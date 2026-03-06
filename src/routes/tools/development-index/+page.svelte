<script lang="ts">
	import * as turf from '@turf/turf';
	import { Tabs } from 'bits-ui';
	import * as d3 from 'd3';
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
	let stationDpiData: any[] = $state([]);

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
	let buildingpermitsCheck = $state(true);

	// Data
	let transitStationsDropdown: any[] = $state([]);
	let stationRawData: any[] = $state([]);
	let stationMetrics: any[] = $state([]);

	// Radar tabs
	const radarCategories = [
		{ value: 'land', label: 'Land Availability' },
		{ value: 'growth', label: 'Growth Pressure' }
	];

	let activeRadarCategory = $state('land');

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

	const devData1 = $derived(getStationDevelopmentData(selectedStation1, activeRadarCategory));
	const devData2 = $derived(getStationDevelopmentData(selectedStation2, activeRadarCategory));

	const baseDevData1 = $derived(getStationDevelopmentData(selectedStation1, 'potential'));
	const baseDevData2 = $derived(getStationDevelopmentData(selectedStation2, 'potential'));

	const unitsCreated1 = $derived(
		(stationDpiData.find((d) => d.id === selectedStation1)?.UnitsCreated || 0) * 100
	);
	const unitsCreated2 = $derived(
		(stationDpiData.find((d) => d.id === selectedStation2)?.UnitsCreated || 0) * 100
	);

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
			water: waterCheck,
			buildingpermits: buildingpermitsCheck
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
			water: waterCheck,
			buildingpermits: buildingpermitsCheck
		});
	});

	// ─── Helpers ──────────────────────────────────────────────────────────────

	function getStationDevelopmentData(stationId: string, category = 'land') {
		const data = stationDpiData.find((d) => d.id === stationId);
		if (!data) {
			return {
				potentialScore: 0,
				radarPoints: []
			};
		}

		const potentialMap: Record<string, number> = {
			High: 7.5,
			Moderate: 5,
			Low: 2.5
		};

		const radarPoints = [];

		if (category === 'land') {
			radarPoints.push(
				{ label: 'Single Unit Dwellings', value: (data.single_units || 0) * 100 },
				{ label: 'Total Developable Land', value: (data.DevelopableArea || 0) * 100 },
				{ label: 'High Opportunity Sites', value: (data.HighOpportunityArea || 0) * 100 },
				{ label: 'Employment Density', value: (data.EmploymentDensity || 0) * 100 },
				{ label: 'Population Density', value: (data.PopulationDensity || 0) * 100 }
			);
		} else if (category === 'growth') {
			radarPoints.push(
				{ label: 'Pop Change 2020-25', value: (data.PopChange2020to2025 || 0) * 100 },
				{ label: 'Pop Change 2025-30', value: (data.PopChange2025to2030 || 0) * 100 },
				{
					label: 'Municipal Pop Change 20-25',
					value: (data.MunicipalPopChange2020to2025 || 0) * 100
				},
				{ label: 'Complete Community Score', value: (data.OverallCCScore || 0) * 100 },
				{ label: 'Daily Visits', value: (data.DailyVisits || 0) * 100 }
			);
		} else if (category === 'permits') {
			radarPoints.push({ label: 'Units Created', value: (data.UnitsCreated || 0) * 100 });
		}

		return {
			potentialScore: potentialMap[data.potential] || 0,
			radarPoints
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
			'building-permits',
			'water'
		];
		if (!required.every((id) => map.getLayer(id))) return false;

		map.setLayoutProperty('greenspace', 'visibility', cfg.greenspace ? 'visible' : 'none');
		map.setLayoutProperty(
			'building-permits',
			'visibility',
			cfg.buildingpermits ? 'visible' : 'none'
		);
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
				.catch((e) => console.error('Metrics fetch error:', e)),

			fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/development/station_dpi.csv'
			)
				.then((r) => r.text())
				.then((csvText) => {
					stationDpiData = d3.csvParse(csvText, (d: any) => {
						const row: any = {};
						for (const key in d) {
							if (key === 'id') {
								row[key] = d[key];
							} else if (key === 'potential') {
								row[key] = d[key];
							} else {
								row[key] = d[key] === 'NA' ? 0 : +d[key];
							}
						}
						return row;
					});
				})
				.catch((e) => console.error('DPI CSV fetch error:', e))
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

		// Force visibility of building-permits on initial load
		[map1, map2].forEach((m) => {
			m?.on('styledata', () => {
				if (m.getLayer('building-permits')) {
					m.setLayoutProperty('building-permits', 'visibility', 'visible');
				}
			});
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
	<p class="text-sm text-gray-500"><em>This tool is in beta.</em></p>
</div>

<div id="content-container">
	<!-- LEFT SIDEBAR -->
	<div id="sidebar">
		<h3 class="mb-4">Select stations:</h3>

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
							{getStationDevelopmentData(selectedStation1).potentialScore >= 7
								? 'High'
								: getStationDevelopmentData(selectedStation1).potentialScore >= 5
									? 'Moderate'
									: getStationDevelopmentData(selectedStation1).potentialScore >= 2
										? 'Low'
										: 'N/A'}
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
							{getStationDevelopmentData(selectedStation2).potentialScore >= 7
								? 'High'
								: getStationDevelopmentData(selectedStation2).potentialScore >= 5
									? 'Moderate'
									: getStationDevelopmentData(selectedStation2).potentialScore >= 2
										? 'Low'
										: 'N/A'}
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Layer Toggles -->
		<div class="mt-6">
			<h6>Legend</h6>
			<p>Click to toggle layers</p>
			<div class="mt-4 grid grid-cols-2 gap-x-2 gap-y-4 text-xs">
				<div class="flex flex-col gap-2">
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
					<Checkbox bind:checked={greenspaceCheck} label="Greenspace" color="#475249" />
					<Checkbox bind:checked={waterCheck} label="Water" color="#253841" />
					<Checkbox bind:checked={buildingsCheck} label="Buildings" color="#6A6A6A" />
					<Checkbox bind:checked={parkingCheck} label="Parking" color="#B2B2B2" />
					<Checkbox bind:checked={buildingpermitsCheck} label="Building Permits" color="#DA3068" />
				</div>
			</div>
		</div>
	</div>

	<!-- RIGHT CONTENT -->
	<div class="flex-grow flex flex-col gap-12 pt-4">
		<div class="hidden lg:grid grid-cols-3 gap-6 text-center">
			<h4>Built Form</h4>
			<h4>Station Ranking</h4>
			<h4>Development Potential</h4>
		</div>

		<!-- Row 1 -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
			<div class="flex flex-col items-center justify-center relative">
				<h4 class="lg:hidden text-center mb-4">Built Form</h4>
				<div id="map1" class="map-circle drop-shadow-lg"></div>

				{#if unitsCreated1 > 0}
					<div class="mt-8 flex flex-col items-center">
						<span class="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-2"
							>Units Created</span
						>
						<div class="flex items-baseline gap-1">
							<span class="text-5xl font-extrabold text-[#DA3068] leading-none"
								>{unitsCreated1.toFixed(0)}</span
							>
						</div>
					</div>
				{/if}
			</div>
			<div class="flex flex-col h-full w-full items-center gap-4 relative">
				<h4 class="lg:hidden text-center mb-4">Station Ranking</h4>
				<Tabs.Root bind:value={activeRadarCategory} class="w-full flex justify-center mb-4">
					<Tabs.List
						class="flex w-full justify-center flex-wrap bg-gray-50 rounded-md border border-gray-200 overflow-hidden"
					>
						{#each radarCategories as cat}
							<Tabs.Trigger
								value={cat.value}
								class="px-3 w-full py-1.5 transition-colors duration-200 data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-[#ff007f]"
							>
								{cat.label}
							</Tabs.Trigger>
						{/each}
					</Tabs.List>
				</Tabs.Root>
				<RadarChart data={devData1.radarPoints} max={100} color="#ff007f" />
			</div>
			<div class="flex flex-col items-center justify-center relative">
				<h4 class="lg:hidden text-center mb-4">Development Potential</h4>
				<DevelopmentPotentialGraphic score={baseDevData1.potentialScore} maxScore={10} />
			</div>
		</div>

		<div class="w-full h-px bg-gray-200 hidden lg:block"></div>

		<!-- Row 2 -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
			<div class="flex flex-col items-center justify-center relative">
				<h4 class="lg:hidden text-center mb-4">Built Form</h4>
				<div id="map2" class="map-circle drop-shadow-lg"></div>

				{#if unitsCreated2 > 0}
					<div class="mt-8 flex flex-col items-center">
						<span class="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-2"
							>Units Created</span
						>
						<div class="flex items-baseline gap-1">
							<span class="text-5xl font-extrabold text-[#DA3068] leading-none"
								>{unitsCreated2.toFixed(0)}</span
							>
						</div>
					</div>
				{/if}
			</div>
			<div class="flex flex-col h-full w-full items-center gap-4 relative">
				<h4 class="lg:hidden text-center mb-4">Station Ranking</h4>
				<Tabs.Root bind:value={activeRadarCategory} class="w-full flex justify-center mb-4">
					<Tabs.List
						class="flex w-full justify-center flex-wrap bg-gray-50 rounded-md border border-gray-200 overflow-hidden"
					>
						{#each radarCategories as cat}
							<Tabs.Trigger
								value={cat.value}
								class="px-3 w-full py-1.5 transition-colors duration-200 data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-[#ff007f]"
							>
								{cat.label}
							</Tabs.Trigger>
						{/each}
					</Tabs.List>
				</Tabs.Root>
				<RadarChart data={devData2.radarPoints} max={100} color="#ff007f" />
			</div>
			<div class="flex flex-col items-center justify-center relative">
				<h4 class="lg:hidden text-center mb-4">Development Potential</h4>
				<DevelopmentPotentialGraphic score={baseDevData2.potentialScore} maxScore={10} />
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
		height: auto;
		min-height: 100%;
		padding-bottom: 4rem;
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
			min-height: calc(100vh - 120px);
			padding-right: 2rem;
		}

		#sidebar {
			width: 25%;
			min-width: 400px;
			height: 100%;
			border-top: none;
			border-right: 1px solid #eee;
		}
	}
</style>
