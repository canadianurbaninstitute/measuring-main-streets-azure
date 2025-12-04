import Fuse from 'fuse.js';
import type { Region, Station } from '../types';

export async function initializeData() {
    const [stationRes, regionsRes, metricsRes, ccCountsRes, ccPresenceRes, visitorRes, aiRes] =
        await Promise.all([
            fetch(
                'https://measuringmainstreets.blob.core.windows.net/public/transit-data/enriched/map_stations_enriched.json'
            ),
            fetch(
                'https://measuringmainstreets.blob.core.windows.net/public/transit-data/transit_regions/transit-regions.json'
            ),
            fetch(
                'https://measuringmainstreets.blob.core.windows.net/public/transit-data/built_form/station-metrics.json'
            ),
            fetch(
                'https://measuringmainstreets.blob.core.windows.net/public/transit-data/complete_communities/stations_cc_counts.json'
            ),
            fetch(
                'https://measuringmainstreets.blob.core.windows.net/public/transit-data/complete_communities/stations_cc_presence.json'
            ),
            fetch(
                'https://measuringmainstreets.blob.core.windows.net/public/transit-data/complete_communities/visitor_data.json'
            ),
            fetch(
                'https://measuringmainstreets.blob.core.windows.net/public/transit-data/ai_descriptions.json'
            )
        ]);

    const stationRawData = await stationRes.json();
    const transitRegionsRawData = await regionsRes.json();
    const builtFormMetrics = await metricsRes.json();
    const completeCommunityCounts = await ccCountsRes.json();
    const completeCommunityPresence = await ccPresenceRes.json();
    const visitorData = await visitorRes.json();
    const aiDescriptions = await aiRes.json();

    const regionsData = transitRegionsRawData.sort((a: Region, b: Region) =>
        a.name.localeCompare(b.name)
    );

    const processedStationData = stationRawData.map((station: any) => ({
        ...station,
        line_ids_array: station.line_id
            ? station.line_id
                    .split(',')
                    .map((s: string) => parseInt(s.trim(), 10))
                    .filter((n: number) => !isNaN(n))
            : []
    }));

    return {
        regionsData,
        processedStationData,
        builtFormMetrics,
        completeCommunityCounts,
        completeCommunityPresence,
        visitorData,
        aiDescriptions
    };
}

let regionsFuse: Fuse<any>;
let linesFuse: Fuse<any>;
let stopsFuse: Fuse<any>;

export function initializeSearchIndexes(regionsData: Region[], processedStationData: Station[]) {
    const fuseOptions = { threshold: 0.3, includeScore: true };

    regionsFuse = new Fuse(regionsData, { ...fuseOptions, keys: ['name'] });

    const linesWithContext = [];
    regionsData.forEach((region) => {
        region.lines.forEach((line) => {
            linesWithContext.push({
                ...line,
                regionName: region.name,
                regionId: region.id
            });
        });
    });
    linesFuse = new Fuse(linesWithContext, { ...fuseOptions, keys: ['name', 'regionName'] });

    stopsFuse = new Fuse(processedStationData, {
        ...fuseOptions,
        keys: ['stop_label', 'line_display_name']
    });
}

export function performSearch(query: string) {
    if (!query.trim()) {
        return { regions: [], lines: [], stops: [] };
    }

    return {
        regions: regionsFuse.search(query).slice(0, 5).map((r) => r.item),
        lines: linesFuse.search(query).slice(0, 5).map((r) => r.item),
        stops: stopsFuse.search(query).slice(0, 5).map((r) => r.item)
    };
}