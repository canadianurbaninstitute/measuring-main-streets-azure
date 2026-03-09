export const prerender = false;

/** @type {import('./$types').EntryGenerator} */
export async function entries() {
	const res = await fetch(
		'https://measuringmainstreets.blob.core.windows.net/public/transit-data/enriched/map_stations_enriched.json'
	);
	const stations = await res.json();

	const dynamicEntries = stations.map((s) => ({ stationId: String(s.id) }));

	// Provide both the empty case (for the base /transit-map route) and all specific station IDs
	return [{ stationId: '' }, ...dynamicEntries];
}
