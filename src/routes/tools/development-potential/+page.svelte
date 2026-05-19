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
	// Components
	import Checkbox from '../../lib/ui/checkbox/Checkbox.svelte';
	import Combobox from '../../lib/ui/Combobox.svelte';
	import '../../styles.css';
	import DevelopmentPotentialGraphic from './DevelopmentPotentialGraphic.svelte';
	import RadarChart from './RadarChart.svelte';
	import ScoreBar from './ScoreBar.svelte';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	// Maps
	let map1: mapboxgl.Map | undefined = $state();

	// Selected stations
	let selectedStation1 = $state('8');

	let station1Metrics: any = $state({});
	let allDevData: any = $state({});
	let station1Data: any = $state();
	let stationDpiData: any[] = $state([]);
	let stationDpiRawData: any[] = $state([]);
	let buildingPermitYearData: any[] = $state([]);

	// Error messages
	let station1Error = $state('');

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
		{ value: 'growth', label: 'Growth Pressure' },
		{ value: 'potential', label: 'Development Potential' }
	];

	let activeRadarCategory = $state('potential');

	// Validation flag
	let initialStationsValidated = $state(false);
	let mapStyleLoaded = $state(false);

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

	const baseDevData1 = $derived(getStationDevelopmentData(selectedStation1, 'potential'));

	const unitsCreated1 = $derived(
		stationDpiRawData.find((d) => d.id === selectedStation1)?.UnitsCreated || 0
	);

	const buildingPermitYear = $derived(
		buildingPermitYearData.find((d) => d.id === selectedStation1)?.year || 0
	);

	// ─── Effects ──────────────────────────────────────────────────────────────

	// Validate initial stations once data loads
	$effect(() => {
		if (initialStationsValidated || stationsProcessed.length === 0) return;

		if (!stationsProcessed.find((s) => s.id.toString() === selectedStation1)) {
			console.error(`Initial station "${selectedStation1}" not found. Using first available.`);
			selectedStation1 = stationsProcessed[0]?.id.toString() || '1';
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
			allDevData = stationDpiData.find((d) => d.id === selectedStation1);
			if (!station1Metrics) console.warn(`Metrics not found for station "${selectedStation1}"`);
		} else {
			station1Error = 'Station data not available';
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

	// ─── Helpers ──────────────────────────────────────────────────────────────

	function getStationDevelopmentData(stationId: string, category = 'land') {
		const data = stationDpiData.find((d) => d.id === stationId);

		if (!data) {
			return {
				potentialScore: 0,
				subcategoryScore: 0,
				radarPoints: []
			};
		}

		const potentialMap: Record<string, number> = {
			'Very High': 10,
			High: 7.5,
			Moderate: 5,
			Low: 2.5,
			'Very Low': 0.25
		};

		const radarPoints = [];
		const displacementRadar = [
			{
				label: '>30% of income spent on shelter',
				value: (data.MoreThan30OnShelter || 0) * 100
			},
			{ label: 'Total Immigrants', value: (data.TotalImmigrant || 0) * 100 },
			{
				label: 'Total Visible Minorities',
				value: (data.VisibleMinorityTotal || 0) * 100
			},
			{ label: 'Pop Under 19 or Over 65', value: (data.YouthElderly || 0) * 100 },
			{ label: 'Low Income Population', value: (data.LowIncome || 0) * 100 }
		];
		let subcategoryScore = 0;
		const displacementScore = potentialMap[data.DRLevel] || 0;

		if (category === 'land') {
			subcategoryScore = potentialMap[data.LALevel] || 0;

			radarPoints.push(
				{ label: 'Single Unit Dwellings', value: (data.single_units || 0) * 100 },
				{ label: 'Total Developable Land', value: (data.DevelopableArea || 0) * 100 },
				{ label: 'High Opportunity Sites', value: (data.HighOpportunityArea || 0) * 100 },
				{ label: 'Employment Density', value: (data.EmploymentDensity || 0) * 100 },
				{ label: 'Population Density', value: (data.PopulationDensity || 0) * 100 }
			);
		} else if (category === 'growth') {
			subcategoryScore = potentialMap[data.GPLevel] || 0;

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
		} else if (category == 'potential') {
			subcategoryScore = potentialMap[data.potential] || 0;
		}

		return {
			potentialScore: potentialMap[data.potential] || 0,
			subcategoryScore,
			displacementScore,
			displacementRadar,
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
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/development/AllIndicators_Raw.csv'
			)
				.then((r) => r.text())
				.then((csvText) => {
					stationDpiRawData = d3.csvParse(csvText, (d: any) => {
						const row: any = {};
						for (const key in d) {
							if (key === 'id') {
								row[key] = d[key];
							} else {
								row[key] = d[key] === 'NA' ? 0 : +d[key];
							}
						}
						return row;
					});
				})
				.catch((e) => console.error('DPI CSV fetch error:', e)),
			fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/development/DevelopmentPotential_Subindex.csv'
			)
				.then((r) => r.text())
				.then((csvText) => {
					stationDpiData = d3.csvParse(csvText, (d: any) => {
						const row: any = {};
						for (const key in d) {
							if (key === 'id') {
								row[key] = d[key];
							} else if (['potential', 'LALevel', 'DRLevel', 'GPLevel'].includes(key)) {
								row[key] = d[key];
							} else {
								row[key] = d[key] === 'NA' ? 0 : +d[key];
							}
						}
						return row;
					});
				})
				.catch((e) => console.error('DPI CSV fetch error:', e)),
			fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/development/BuildingPermitYear.csv'
			)
				.then((r) => r.text())
				.then((csvText) => {
					buildingPermitYearData = d3.csvParse(csvText, (d: any) => {
						const row: any = {};
						for (const key in d) {
							row[key] = d[key];
						}
						return row;
					});
				})
				.catch((e) => console.error('Building permit year CSV fetch error:', e))
		];

		await Promise.all(fetches);

		updateStationData(1, selectedStation1);

		const stationGeojson = {
			type: 'FeatureCollection',
			features: stationRawData.map((point) => ({
				type: 'Feature',
				geometry: { type: 'Point', coordinates: [point.longitude, point.latitude] },
				properties: { name: point?.stop_label ?? null, station_id: point?.id ?? null }
			}))
		};

		map1 = createMap('map1');

		map1.on('load', () => {
			addMapLayers(map1!, stationGeojson, mapData[1]);
			if (mapData[1].coords && mapData[1].bbox) {
				map1!.setCenter(mapData[1].coords as [number, number]);
				map1!.fitBounds(mapData[1].bbox, { padding: 0 });

				if (map1!.getLayer('building-permits')) {
					map1!.setLayoutProperty('building-permits', 'visibility', 'visible');
				}
				mapStyleLoaded = true;
			}
		});

		$effect(() => {
			if (!mapStyleLoaded) return; // wait for style
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
	});
</script>

<div class="hero">
	<h1>Development Potential Index</h1>
	<h2>Mapping Tool</h2>
	<p id="description">
		This tool breaks down the housing development potential of areas within 800m of a transit
		station. Use the dropdown to select a transit station.
	</p>
	<p class="text-sm text-gray-500"><em>This tool is in beta.</em></p>
</div>

<div id="content-container">
	<!-- LEFT SIDEBAR -->
	<div id="sidebar">
		<h3 class="mb-4">Select a station:</h3>

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
					<div class="font-bold uppercase text-[#1B6CA8] text-xl tracking-wider mb-1">
						{station1Data.stop_label}
					</div>
					<div class="text-xs text-gray-500 mb-2">
						{station1Data.line_display_name}<br />{station1Data.region}<br />{station1Data.status}
					</div>
					<div class="mt-2 text-[#006A8E] text-lg font-medium">
						Development Potential:
						{allDevData?.potential ?? 'N/A'}
					</div>
					<div class="flex flex-col items-start w-fit mx-auto mt-4 gap-1 text-left">
						<div>
							Land Availability: <span class="font-semibold">{allDevData?.LALevel ?? 'N/A'}</span>
						</div>
						<div>
							Growth Pressure: <span class="font-semibold">{allDevData?.GPLevel ?? 'N/A'}</span>
						</div>
						<div>
							Displacement Risk: <span class="font-semibold">{allDevData?.DRLevel ?? 'N/A'}</span>
						</div>
						<br />
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
			<h4>Displacement Risk</h4>
		</div>

		<!-- Row 1 -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
			<div class="flex flex-col items-center justify-center relative">
				<h4 class="lg:hidden text-center mb-4">Built Form</h4>
				<div id="map1" class="map-circle drop-shadow-lg w-[90%]"></div>

				{#if unitsCreated1 > 0}
					<div class="mt-8 flex flex-col items-center">
						<span
							class="text-xs font-bold text-center text-gray-500 uppercase tracking-[0.2em] mb-2"
							>Active building permits ({buildingPermitYear}) <br /> Number of housing units</span
						>
						<div class="flex items-baseline gap-1">
							<span class="text-5xl font-extrabold text-[#DA3068] leading-none"
								>{unitsCreated1.toLocaleString()}</span
							>
						</div>
					</div>
				{/if}
			</div>
			<div class="flex flex-col w-full items-center gap-4 relative">
				<h4 class="lg:hidden text-center mb-4">Station Ranking</h4>
				<Tabs.Root
					bind:value={activeRadarCategory}
					class="w-full flex justify-center mb-4 px-4 sm:px-0"
				>
					<Tabs.List
						class="flex w-full justify-center flex-wrap bg-gray-50 rounded-md border border-gray-200 overflow-hidden"
					>
						{#each radarCategories as cat}
							<Tabs.Trigger
								value={cat.value}
								class="px-4 w-1/3 py-1.5 transition-colors duration-200 data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-[#ff007f]"
							>
								{cat.label}
							</Tabs.Trigger>
						{/each}
					</Tabs.List>
				</Tabs.Root>
				<ScoreBar score={devData1.subcategoryScore} maxScore={10} colors={['#00adf2', '#db3069']} />
				{#if activeRadarCategory == 'land' || activeRadarCategory == 'growth'}
					<RadarChart data={devData1.radarPoints} max={100} color="#ff007f" />
					{#if activeRadarCategory == 'land'}
						<div class="text-sm italic text-gray-500 text-center">
							Low Population Density is highly ranked<br />
							Low Employment Density is highly ranked
						</div>
					{/if}
				{:else if activeRadarCategory == 'potential'}
					<DevelopmentPotentialGraphic score={baseDevData1.potentialScore} maxScore={10} />
				{/if}
			</div>
			<div class="flex flex-col items-center justify-center relative">
				<h4 class="lg:hidden text-center mb-4">Displacement Risk</h4>
				<ScoreBar
					score={devData1.displacementScore}
					maxScore={10}
					colors={['#00adf2', '#f45d01']}
				/>
				<RadarChart data={devData1.displacementRadar} max={100} color="#f45d01" />
			</div>
		</div>
	</div>
</div>

<style>
	#map1 {
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
		max-width: 400px;
		display: flex;
		flex-direction: column;
		border-top: 1px solid #eee;
		scrollbar-width: none;
		padding: 2rem;
	}
	.inline-icon {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
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
