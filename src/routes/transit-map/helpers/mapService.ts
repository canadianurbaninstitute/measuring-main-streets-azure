import mapboxgl from 'mapbox-gl';
import line_colors from '../../lib/data/transitdata/line-colors.json';
import type { Region, Station } from '../types';

export function createMapInstance(containerId: string): mapboxgl.Map {
    return new mapboxgl.Map({
        container: containerId,
        style: 'mapbox://styles/canadianurbaninstitute/cmif0wnev003201s3b0btg8te?optimize=true',
        center: [-92, 52],
        zoom: 3.7,
        maxZoom: 15.5,
        minZoom: 2,
        scrollZoom: true,
        attributionControl: false
    });
}

export function setupMapLayers(map: mapboxgl.Map) {
    // Add sources
    map.addSource('transit-station-data', {
        type: 'vector',
        url: 'mapbox://canadianurbaninstitute.btyr8w65'
    });
    map.addSource('transit-line-data', {
        type: 'vector',
        url: 'mapbox://canadianurbaninstitute.683e8euy'
    });
    map.addSource('transit-region-data', {
        type: 'vector',
        url: 'mapbox://canadianurbaninstitute.003rt68i'
    });
    map.addSource('circle-mask', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
    });
    map.addSource('circle', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
    });
    map.addSource('da_map-bco47g', {
        type: 'vector',
        url: 'mapbox://canadianurbaninstitute.1cu02ydb'
    });

    // Line color expression
    const lineColorExpression = [
        'match',
        ['get', 'line_id'],
        ...Object.entries(line_colors).flatMap(([id, color]) => [[Number(id)], color]),
        '#000000'
    ];

    // Add layers
    map.addLayer({
        id: 'transit-lines',
        type: 'line',
        source: 'transit-line-data',
        'source-layer': 'merged_map_lines',
        paint: {
            'line-color': lineColorExpression as any,
            'line-width': ['interpolate', ['linear'], ['zoom'], 3, 0, 7, 4, 12, 8],
            'line-dasharray': [
                'case',
                ['any', ['==', ['get', 'status'], 'Construction'], ['==', ['get', 'status'], 'Planned']],
                ['literal', [1, 2]],
                ['literal', [1, 0]]
            ]
        }
    });

    map.addLayer({
        id: 'transit-stations',
        type: 'circle',
        source: 'transit-station-data',
        'source-layer': 'merged_map_stations-bcc58j',
        paint: {
            'circle-color': '#fff',
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 6, 0, 7, 2, 10, 3, 12, 6, 14, 10],
            'circle-stroke-color': '#000',
            'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 6, 0, 7, 0.8, 10, 1.5, 13, 2]
        },
        minzoom: 6
    });

    map.addLayer({
        id: 'circle-mask',
        type: 'fill',
        source: 'circle-mask',
        paint: { 'fill-color': '#ffffff', 'fill-opacity': 0.8 }
    });

    map.addLayer({
        id: 'circle-radius',
        type: 'line',
        source: 'circle',
        paint: { 'line-color': '#222', 'line-opacity': 1, 'line-width': 3, 'line-dasharray': [2, 2] }
    });

    map.addLayer({
        id: 'transit-region-points',
        type: 'circle',
        source: 'transit-region-data',
        'source-layer': 'transit-region-points-9m4y8g',
        paint: {
            'circle-color': '#34bef9',
            'circle-radius': 8,
            'circle-stroke-color': '#fff',
            'circle-stroke-width': 1
        },
        maxzoom: 5
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(
        new mapboxgl.AttributionControl({
            customAttribution: 'Canadian Urban Institute'
        })
    );
}

export function setupMapEvents(
    map: mapboxgl.Map,
    stationData: Station[],
    regionData: Region[],
    callbacks: {
        onStationSelect: (station: Station) => void;
        onRegionSelect: (region: Region) => void;
    }
) {
    map.on('click', 'transit-stations', (e) => {
        if (e.features?.length > 0) {
            const stationId = e.features[0].properties.id;
            const station = stationData.find((s) => s.id === stationId);
            if (station) callbacks.onStationSelect(station);
        }
    });

    map.on('click', 'transit-region-points', (e) => {
        if (e.features?.length > 0) {
            const regionId = e.features[0].properties.id;
            const region = regionData.find((r) => r.id === regionId);
            if (region) callbacks.onRegionSelect(region);
        }
    });

    // Popups
    const stationPopup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });
    const regionPopup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });

    map.on('mouseenter', ['transit-stations', 'transit-lines', 'transit-region-points'], () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mousemove', 'transit-stations', (e) => {
        if (e.features?.length > 0) {
            stationPopup
                .setLngLat(e.lngLat)
                .setHTML(`<span class="label-name">${e.features[0].properties.stop_label}</span>`)
                .addTo(map);
        }
    });

    map.on('mousemove', 'transit-region-points', (e) => {
        if (e.features?.length > 0 && map.getZoom() <= 5) {
            regionPopup
                .setLngLat(e.lngLat)
                .setHTML(`<span class="label-name">${e.features[0].properties.region}</span>`)
                .addTo(map);
        }
    });

    map.on('mouseleave', 'transit-stations', () => stationPopup.remove());
    map.on('mouseleave', 'transit-region-points', () => regionPopup.remove());
    map.on('mouseleave', ['transit-stations', 'transit-lines', 'transit-region-points'], () => {
        map.getCanvas().style.cursor = '';
    });
}