<script lang="ts">
	import * as turf from '@turf/turf';
	import { Tabs } from 'bits-ui';
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	import '../../../../node_modules/mapbox-gl/dist/mapbox-gl.css';
	import {
		transit_lines_source,
		urban_form_comp_style
	} from '../../lib/data/transitdata/config-mapbox.json';
	import line_colors from '../../lib/data/transitdata/line-colors.json';
	import Checkbox from '../../lib/ui/checkbox/Checkbox.svelte';
	import Combobox from '../../lib/ui/Combobox.svelte';
	import Footer from '../../lib/ui/Footer.svelte';
	import '../../styles.css';
	import DevelopmentPotentialGraphic from './DevelopmentPotentialGraphic.svelte';
	import RadarChart from './RadarChart.svelte';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	// Maps
	let map1: mapboxgl.Map | undefined = $state();
	let map2: mapboxgl.Map | undefined = $state();

	// Selected stations
	let selectedStation1 = $state('573');
	let selectedStation2 = $state('194');

	let station1Metrics: any = $state({});
	let station2Metrics: any = $state({});
	let station1Data: any = $state();
	let station2Data: any = $state();

	// Error messages
	let station1Error = $state('');
	let station2Error = $state('');

	// Layer toggles
	let greenspaceCheck = $state(true);
	let roadsCheck = $state(true);
	let transitCheck = $state(true);
	let stationCheck = $state(true);
	let parkingCheck = $state(true);
	let buildingsCheck = $state(true);
	let waterCheck = $state(true);

	// Data
	let transitStationsDropdown: any[] = $state([]);
	let stationRawData: any[] = $state([]);
	let stationMetrics: any[] = $state([]);

	// Radar tabs
	const radarCategories = [
		{ value: 'land', label: 'Land Availability' },
		{ value: 'growth', label: 'Growth Pressure' },
		{ value: 'permits', label: 'Building Permits' }
	];

	let activeRadarCategory1 = $state('land');
	let activeRadarCategory2 = $state('land');

	// Validation flag
	let initialStationsValidated = $state(false);

	// ─── Constants ────────────────────────────────────────────────────────────

	const radiusInKilometers = 0.8;

	const mapConfig = {
		style: urban_form_comp_style.url,
		zoom: 13,
		minZoom: 2,
		scrollZoom: false,
		dragPan: false,
		dragRotate: false,
		attributionControl: false,
		projection: 'mercator'
	};

	const lineColorExpression = [
		'match',
		['get', 'line_id'],
		...Object.entries(line_colors).flatMap(([id, color]) => [[Number(id)], color]),
		'#000000'
	];

	const mapData: Record<number, { data: any; coords: any[]; circle: any; bbox: any }> = {
		1: { data: {}, coords: [], circle: null, bbox: null },
		2: { data: {}, coords: [], circle: null, bbox: null }
	};

	// ─── Derived ──────────────────────────────────────────────────────────────

	const stationsProcessed = $derived(stationRawData ?? []);

	const mock1 = $derived(generateMockData(selectedStation1, activeRadarCategory1));
	const baseMock1 = $derived(generateMockData(selectedStation1, 'land'));
	const mock2 = $derived(generateMockData(selectedStation2, activeRadarCategory2));
	const baseMock2 = $derived(generateMockData(selectedStation2, 'land'));

	// ─── Effects ──────────────────────────────────────────────────────────────

	// Validate initial stations once data loads
	$effect(() => {
		if (initialStationsValidated || stationsProcessed.length === 0) return;

		if (!stationsProcessed.find((s) => s.id.toString() === selectedStation1)) {
			console.error(`Initial station "${selectedStation1}" not found. Using first available.`);
			selectedStation1 = stationsProcessed[0]?.id.toString() || '1';
		}
		if (!stationsProcessed.find((s) => s.id.toString() === selectedStation2)) {
			console.error(`Initial station "${selectedStation2}" not found. Using second available.`);
			selectedStation2 = stationsProcessed[1]?.id.toString() || '2';
		}
		initialStationsValidated = true;
	});

	// Map 1 — react to station selection
	$effect(() => {
		if (!selectedStation1 || stationsProcessed.length === 0) return;
		const ok = updateStationData(1, selectedStation1);
		if (ok) {
			station1Error = '';
			updateMapWithStationData(map1, mapData[1], { updateStylingCallback: updateStationStyling });
			station1Metrics = stationMetrics.find((s) => s.id.toString() === selectedStation1);
			station1Data = stationsProcessed.find((s) => s.id.toString() === selectedStation1);
			if (!station1Metrics) console.warn(`Metrics not found for station "${selectedStation1}"`);
		} else {
			station1Error = 'Station data not available';
		}
	});

	// Map 2 — react to station selection
	$effect(() => {
		if (!selectedStation2 || stationsProcessed.length === 0) return;
		const ok = updateStationData(2, selectedStation2);
		if (ok) {
			station2Error = '';
			updateMapWithStationData(map2, mapData[2], { updateStylingCallback: updateStationStyling });
			station2Metrics = stationMetrics.find((s) => s.id.toString() === selectedStation2);
			station2Data = stationsProcessed.find((s) => s.id.toString() === selectedStation2);
			if (!station2Metrics) console.warn(`Metrics not found for station "${selectedStation2}"`);
		} else {
			station2Error = 'Station data not available';
		}
	});

	// Layer toggles — map 1
	$effect(() => {
		mapLayerToggle(map1, {
			greenspace: greenspaceCheck,
			transit: transitCheck,
			parking: parkingCheck,
			stations: stationCheck,
			roads: roadsCheck,
			buildings: buildingsCheck,
			water: waterCheck
		});
	});

	// Layer toggles — map 2
	$effect(() => {
		mapLayerToggle(map2, {
			greenspace: greenspaceCheck,
			transit: transitCheck,
			parking: parkingCheck,
			stations: stationCheck,
			roads: roadsCheck,
			buildings: buildingsCheck,
			water: waterCheck
		});
	});

	// ─── Helpers ──────────────────────────────────────────────────────────────

	function generateMockData(stationId: string, category = 'land') {
		const seed = parseInt(stationId) || 123;
		const catShift = category === 'land' ? 1 : category === 'growth' ? 2 : 3;
		const baseValue = ((seed * catShift * 17) % 50) + 20;
		return {
			potentialScore: ((seed * 7) % 10) + 1,
			radarPoints: [
				{ label: 'Single Unit Dwellings', value: (baseValue + ((seed * 3) % 40)) % 100 },
				{ label: 'Total Developable Land', value: (baseValue + ((seed * 11) % 40)) % 100 },
				{ label: 'High Opportunity Sites', value: (baseValue + ((seed * 19) % 40)) % 100 },
				{ label: 'Employment Density', value: (baseValue + ((seed * 23) % 40)) % 100 },
				{ label: 'Population Density', value: (baseValue + ((seed * 31) % 40)) % 100 }
			]
		};
	}

	function updateStationData(mapIndex: number, selectedStationId: string) {
		const stationData = stationsProcessed.find((s) => s.id.toString() === selectedStationId);
		if (!stationData) {
			console.warn(`Station "${selectedStationId}" not found for map ${mapIndex}`);
			mapData[mapIndex] = { data: null, coords: [], circle: null, bbox: null };
			return false;
		}
		const coords = [stationData.longitude, stationData.latitude];
		const circle = turf.circle(coords, radiusInKilometers, { steps: 128, units: 'kilometers' });
		const bbox = turf.bbox(circle);
		mapData[mapIndex] = { data: stationData, coords, circle, bbox };
		return true;
	}

	function handleStation1Select(value: any) {
		const id = value.toString();
		if (!stationsProcessed.find((s) => s.id === id)) {
			station1Error = 'Station data not available';
			return;
		}
		station1Error = '';
		selectedStation1 = id;
	}

	function handleStation2Select(value: any) {
		const id = value.toString();
		if (!stationsProcessed.find((s) => s.id === id)) {
			station2Error = 'Station data not available';
			return;
		}
		station2Error = '';
		selectedStation2 = id;
	}

	function createMap(containerId: string) {
		return new mapboxgl.Map({
			container: containerId,
			...(mapConfig as any)
		});
	}

	function addMapLayers(map: mapboxgl.Map, allStationData: any, _selectedStationData: any) {
		map.addSource('transit-line-data', { type: 'vector', url: transit_lines_source.url });
		map.addSource('transit-station-data', { type: 'geojson', data: allStationData });

		map.addLayer({
			id: 'transit-lines',
			type: 'line',
			source: 'transit-line-data',
			'source-layer': transit_lines_source.source_layer,
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
			id: 'transit-station-points',
			type: 'circle',
			source: 'transit-station-data',
			paint: {
				'circle-radius': 10,
				'circle-color': '#FFFFFF',
				'circle-stroke-color': 'black',
				'circle-stroke-width': 2
			}
		});
	}

	function updateStationStyling(map: mapboxgl.Map, selectedStationFilter: any) {
		[
			['circle-color', ['case', selectedStationFilter, '#FFFFFF', '#B8B8B8']],
			['circle-stroke-color', ['case', selectedStationFilter, '#000000', '#949292']],
			['circle-stroke-width', ['case', selectedStationFilter, 2, 1]]
		].forEach(([prop, val]) =>
			map.setPaintProperty(
				'transit-station-points',
				prop as 'circle-color' | 'circle-stroke-color' | 'circle-stroke-width',
				val as string
			)
		);
	}

	function updateMapWithStationData(
		map: mapboxgl.Map | undefined,
		stationData: any,
		options: {
			radiusSourceId?: string;
			stationLayerId?: string;
			updateStylingCallback?: ((map: mapboxgl.Map, filter: any) => void) | null;
		} = {}
	) {
		const {
			radiusSourceId = 'station-radius',
			stationLayerId = 'transit-station-points',
			updateStylingCallback = null
		} = options;
		if (!map || !stationData) return;
		const { data, circle, bbox, coords } = stationData;
		if (!map.isStyleLoaded() || !data || !circle || !map.getLayer(stationLayerId)) return;

		const selectedStationFilter = ['==', ['get', 'station_id'], data.id];
		const source = map.getSource(radiusSourceId) as mapboxgl.GeoJSONSource | undefined;
		if (source) (source as any).setData(circle);
		if (bbox && coords) {
			map.setCenter(coords);
			map.fitBounds(bbox, { padding: 0 });
		}
		if (updateStylingCallback) updateStylingCallback(map, selectedStationFilter);
	}

	function mapLayerToggle(map: mapboxgl.Map | undefined, cfg: Record<string, boolean>) {
		if (!map || !map.isStyleLoaded()) return false;
		const required = [
			'greenspace',
			'transit-lines',
			'road',
			'parking',
			'transit-station-points',
			'all-buildings',
			'water'
		];
		if (!required.every((id) => map.getLayer(id))) return false;

		map.setLayoutProperty('greenspace', 'visibility', cfg.greenspace ? 'visible' : 'none');
		map.setLayoutProperty('transit-lines', 'visibility', cfg.transit ? 'visible' : 'none');
		map.setLayoutProperty('parking', 'visibility', cfg.parking ? 'visible' : 'none');
		map.setLayoutProperty(
			'transit-station-points',
			'visibility',
			cfg.stations ? 'visible' : 'none'
		);
		map.setLayoutProperty('all-buildings', 'visibility', cfg.buildings ? 'visible' : 'none');

		map
			.getStyle()
			.layers.filter((l) => l['source-layer'] === 'road')
			.forEach((l) => map.setLayoutProperty(l.id, 'visibility', cfg.roads ? 'visible' : 'none'));

		['water', 'waterway'].forEach((id) =>
			map.setLayoutProperty(id, 'visibility', cfg.water ? 'visible' : 'none')
		);
		return true;
	}

	// ─── Mount ────────────────────────────────────────────────────────────────

	onMount(async () => {
		const fetches = [
			fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/dropdowns/transit-stations-dropdown.json'
			)
				.then((r) => r.json())
				.then((d) => (transitStationsDropdown = d))
				.catch((e) => console.error('Dropdown fetch error:', e)),

			fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/enriched/map_stations_enriched.json'
			)
				.then((r) => r.json())
				.then((d) => (stationRawData = d))
				.catch((e) => console.error('Station data fetch error:', e)),

			fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/built_form/station-metrics.json'
			)
				.then((r) => r.json())
				.then((d) => (stationMetrics = d))
				.catch((e) => console.error('Metrics fetch error:', e))
		];

		await Promise.all(fetches);

		updateStationData(1, selectedStation1);
		updateStationData(2, selectedStation2);

		const stationGeojson = {
			type: 'FeatureCollection',
			features: stationRawData.map((point) => ({
				type: 'Feature',
				geometry: { type: 'Point', coordinates: [point.longitude, point.latitude] },
				properties: { name: point?.stop_label ?? null, station_id: point?.id ?? null }
			}))
		};

		map1 = createMap('map1');
		map2 = createMap('map2');

		map1.on('load', () => {
			addMapLayers(map1!, stationGeojson, mapData[1]);
			if (mapData[1].coords && mapData[1].bbox) {
				map1!.setCenter(mapData[1].coords as [number, number]);
				map1!.fitBounds(mapData[1].bbox, { padding: 0 });
			}
		});

		map2.on('load', () => {
			addMapLayers(map2!, stationGeojson, mapData[2]);
			if (mapData[2].coords && mapData[2].bbox) {
				map2!.setCenter(mapData[2].coords as [number, number]);
				map2!.fitBounds(mapData[2].bbox, { padding: 0 });
			}
		});
	});
</script>

<div class="hero">
	<h1>Urban Form Comparison</h1>
	<h2>Mapping Tool</h2>
	<p id="description">
		This tool highlights the urban form of areas within 800m of a transit station. Use the dropdowns
		to select transit stations to compare. Inspired by
		<a href="https://schoolofcities.github.io/rail-transit-and-population-density/" target="_blank"
			><u>School of Cities</u></a
		>.
	</p>
	<p class="text-sm mt-4 text-gray-500"><em>This tool is in beta.</em></p>
</div>

<div id="content-container">
	<!-- LEFT SIDEBAR -->
	<div id="sidebar">
		<h3 class="font-bold text-gray-700 italic">Select stations:</h3>

		<!-- Station 1 -->
		<div class="bg-gray-50 border border-gray-200 p-4 rounded-md">
			<Combobox
				handleSelect={handleStation1Select}
				data={transitStationsDropdown}
				icon="mdi:train"
				placeholder="Search for a station"
				selected={selectedStation1}
			/>
			{#if station1Error}
				<div class="error-message text-center mt-2">{station1Error}</div>
			{/if}
			{#if station1Data}
				<div class="mt-4 text-center text-sm text-gray-700">
					<div class="font-bold uppercase text-[#1B6CA8] tracking-wider mb-1">
						{station1Data.stop_label}
					</div>
					<div class="text-xs text-gray-500 mb-2">
						Line {station1Data.line_display_name}<br />{station1Data.region}<br
						/>{station1Data.status}
					</div>
					<div class="flex flex-col items-start w-fit mx-auto mt-4 gap-1 text-left">
						<div>
							Greenspace: <span class="font-semibold"
								>{station1Metrics?.greenspace_pct?.toFixed(1) ?? 'N/A'}%</span
							>
						</div>
						<div>
							Water: <span class="font-semibold"
								>{station1Metrics?.water_pct?.toFixed(1) ?? 'N/A'}%</span
							>
						</div>
						<div>
							Buildings: <span class="font-semibold"
								>{station1Metrics?.building_pct?.toFixed(1) ?? 'N/A'}%</span
							>
						</div>
						<div>
							Parking: <span class="font-semibold"
								>{station1Metrics?.parking_pct?.toFixed(1) ?? 'N/A'}%</span
							>
						</div>
						<div class="mt-2 text-[#006A8E] font-medium">
							Development Potential:
							{generateMockData(selectedStation1).potentialScore > 6
								? 'High'
								: generateMockData(selectedStation1).potentialScore > 3
									? 'Med'
									: 'Low'}
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Station 2 -->
		<div class="bg-gray-50 border border-gray-200 p-4 rounded-md">
			<Combobox
				handleSelect={handleStation2Select}
				data={transitStationsDropdown}
				icon="mdi:train"
				placeholder="Search for a station"
				selected={selectedStation2}
			/>
			{#if station2Error}
				<div class="error-message text-center mt-2">{station2Error}</div>
			{/if}
			{#if station2Data}
				<div class="mt-4 text-center text-sm text-gray-700">
					<div class="font-bold uppercase text-[#1B6CA8] tracking-wider mb-1">
						{station2Data.stop_label}
					</div>
					<div class="text-xs text-gray-500 mb-2">
						Line {station2Data.line_display_name}<br />{station2Data.region}<br
						/>{station2Data.status}
					</div>
					<div class="flex flex-col items-start w-fit mx-auto mt-4 gap-1 text-left">
						<div>
							Greenspace: <span class="font-semibold"
								>{station2Metrics?.greenspace_pct?.toFixed(1) ?? 'N/A'}%</span
							>
						</div>
						<div>
							Water: <span class="font-semibold"
								>{station2Metrics?.water_pct?.toFixed(1) ?? 'N/A'}%</span
							>
						</div>
						<div>
							Buildings: <span class="font-semibold"
								>{station2Metrics?.building_pct?.toFixed(1) ?? 'N/A'}%</span
							>
						</div>
						<div>
							Parking: <span class="font-semibold"
								>{station2Metrics?.parking_pct?.toFixed(1) ?? 'N/A'}%</span
							>
						</div>
						<div class="mt-2 text-[#006A8E] font-medium">
							Development Potential:
							{generateMockData(selectedStation2).potentialScore > 6
								? 'High'
								: generateMockData(selectedStation2).potentialScore > 3
									? 'Med'
									: 'Low'}
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Layer Toggles -->
		<div class="mt-4">
			<div class="grid grid-cols-2 gap-x-2 gap-y-4 text-xs">
				<div class="flex flex-col gap-2 border-r border-gray-200 pr-2">
					<div class="font-bold text-gray-500 mb-1">Transit & Roads</div>
					<Checkbox
						bind:checked={transitCheck}
						label="Transit Lines"
						icon="mdi:transit-connection-variant"
					/>
					<Checkbox bind:checked={stationCheck} label="Transit Stations" icon="mdi:train" />
					<Checkbox bind:checked={roadsCheck} label="Road Network" icon="mdi:road" />
				</div>
				<div class="flex flex-col gap-2 pl-2">
					<div class="font-bold text-gray-500 mb-1">Built Form</div>
					<Checkbox
						bind:checked={greenspaceCheck}
						label="Greenspace"
						icon="mdi:pine-tree-variant"
					/>
					<Checkbox bind:checked={waterCheck} label="Water" icon="mdi:waves" />
					<Checkbox bind:checked={buildingsCheck} label="Buildings" icon="mdi:office-building" />
					<Checkbox bind:checked={parkingCheck} label="Parking" icon="mdi:car" />
				</div>
			</div>
		</div>
	</div>

	<!-- RIGHT CONTENT -->
	<div class="flex-grow flex flex-col gap-12 pt-4">
		<div
			class="hidden md:grid grid-cols-3 gap-6 text-center text-[#4B7992] uppercase tracking-wider font-semibold text-sm"
		>
			<div>Built Form</div>
			<div>Station Ranking</div>
			<div>Development Potential</div>
		</div>

		<!-- Row 1 -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
			<div class="flex justify-center relative">
				<div class="md:hidden absolute -top-8 text-[#4B7992] font-semibold text-sm uppercase">
					Built Form
				</div>
				<div id="map1" class="map-circle drop-shadow-lg"></div>
			</div>
			<div class="flex flex-col items-center relative">
				<div class="md:hidden absolute -top-8 text-[#4B7992] font-semibold text-sm uppercase">
					Station Ranking
				</div>
				<Tabs.Root
					bind:value={activeRadarCategory1}
					class="w-full flex justify-center mb-4 text-xs"
				>
					<Tabs.List
						class="flex bg-gray-50 rounded-md border border-gray-200 overflow-hidden shadow-sm"
					>
						{#each radarCategories as cat}
							<Tabs.Trigger
								value={cat.value}
								class="px-3 py-1.5 transition-colors duration-200 data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-[#ff007f]"
							>
								{cat.label}
							</Tabs.Trigger>
						{/each}
					</Tabs.List>
				</Tabs.Root>
				<RadarChart data={mock1.radarPoints} size={250} max={100} color="#ff007f" />
			</div>
			<div class="flex justify-center relative">
				<div class="md:hidden absolute -top-8 text-[#4B7992] font-semibold text-sm uppercase">
					Development Potential
				</div>
				<DevelopmentPotentialGraphic score={baseMock1.potentialScore} maxScore={10} />
			</div>
		</div>

		<div class="w-full h-px bg-gray-200 hidden md:block"></div>

		<!-- Row 2 -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
			<div class="flex justify-center">
				<div id="map2" class="map-circle drop-shadow-lg"></div>
			</div>
			<div class="flex flex-col items-center">
				<Tabs.Root
					bind:value={activeRadarCategory2}
					class="w-full flex justify-center mb-4 text-xs"
				>
					<Tabs.List
						class="flex bg-gray-50 rounded-md border border-gray-200 overflow-hidden shadow-sm"
					>
						{#each radarCategories as cat}
							<Tabs.Trigger
								value={cat.value}
								class="px-3 py-1.5 transition-colors duration-200 data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-[#ff007f]"
							>
								{cat.label}
							</Tabs.Trigger>
						{/each}
					</Tabs.List>
				</Tabs.Root>
				<RadarChart data={mock2.radarPoints} size={250} max={100} color="#ff007f" />
			</div>
			<div class="flex justify-center">
				<DevelopmentPotentialGraphic score={baseMock2.potentialScore} maxScore={10} />
			</div>
		</div>
	</div>
</div>

<Footer />

<style>
	#map1,
	#map2 {
		min-width: 200px;
		min-height: 200px;
		max-width: 450px;
		max-height: 450px;
		aspect-ratio: 1;
		flex-grow: 1;
		border-radius: 50%; /* Circular frame */
		overflow: hidden; /* Clip map to circle */
		border: 2px solid #d3d3d3;
		padding: 20px;
	}

	.error-message {
		color: #dc2626;
		font-size: 0.875rem;
	}

	#content-container {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	#sidebar {
		width: 100%;
		display: flex;
		flex-direction: column;
		border-top: 1px solid #eee;
		scrollbar-width: none;
		padding: 2rem;
	}

	@media only screen and (min-width: 1024px) {
		#content-container {
			flex-direction: row;
			height: calc(100vh - 120px);
		}

		#sidebar {
			width: 35%;
			min-width: 400px;
			height: 100%;
			border-top: none;
			border-right: 1px solid #eee;
		}
	}
</style>
