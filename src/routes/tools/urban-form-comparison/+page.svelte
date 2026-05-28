<script lang="ts">
	// Imports
	import * as turf from '@turf/turf';
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	import '../../../../node_modules/mapbox-gl/dist/mapbox-gl.css';
	import {
		transit_lines_source,
		urban_form_comp_style
	} from '../../lib/data/transitdata/config-mapbox.json';
	import line_colors from '../../lib/data/transitdata/line-colors.json';
	import Combobox from '../../lib/ui/Combobox.svelte';
	import Checkbox from '../../lib/ui/checkbox/Checkbox.svelte';
	import MetricsDisplay from './MetricsDisplay.svelte';

	import '../../styles.css';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	interface StationRaw {
		id: string | number;
		longitude: number;
		latitude: number;
		stop_label?: string;
		[key: string]: any;
	}

	interface MapStationState {
		data: StationRaw | null;
		coords: number[];
		circle: any;
		bbox: any;
	}

	// Initialize maps
	let map1 = $state<mapboxgl.Map>();
	let map2 = $state<mapboxgl.Map>();

	// Initial stations
	let selectedStation1 = $state('573');
	let selectedStation2 = $state('194');

	let station1Metrics = $state<any>([]);
	let station2Metrics = $state<any>([]);

	let station1Data = $state<any>([]);
	let station2Data = $state<any>([]);

	// Convert line colours to Mapbox expression
	const lineColorExpression = [
		'match',
		['get', 'line_id'],
		...Object.entries(line_colors).flatMap(([id, color]) => [[Number(id)], color]),
		'#000000'
	];

	// Error messages for user display
	let station1Error = $state('');
	let station2Error = $state('');

	// Station area radius in km
	const radiusInKilometers = 0.8;

	// Map configuration
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

	// For layer toggle
	let greenspaceCheck = $state(true);
	let roadsCheck = $state(true);
	let transitCheck = $state(true);
	let stationCheck = $state(true);
	let parkingCheck = $state(true);
	let buildingsCheck = $state(true);
	let waterCheck = $state(true);

	// Data variables
	let transitStationsDropdown = $state<any[]>([]);
	let stationRawData = $state<StationRaw[]>([]);
	let stationMetrics = $state<any[]>([]);

	// Create reactive station data from stationRawData
	const stationsProcessed = $derived(stationRawData || []);

	// Compute station data reactively using $derived.by instead of mutating states inside effects
	const mapData = $derived.by<Record<number, MapStationState>>(() => {
		const getStationGeoState = (selectedId: string, mapIndex: number) => {
			const stationData = stationsProcessed.find((station) => station.id.toString() === selectedId);
			if (!stationData) {
				return { data: null, coords: [], circle: null, bbox: null };
			}
			const coords = [stationData.longitude, stationData.latitude];
			const circle = turf.circle(coords, radiusInKilometers, {
				steps: 128,
				units: 'kilometers'
			});
			const bbox = turf.bbox(circle);
			return { data: stationData, coords, circle, bbox };
		};

		return {
			1: getStationGeoState(selectedStation1, 1),
			2: getStationGeoState(selectedStation2, 2)
		};
	});

	// Handle station selection from combobox
	function handleStation1Select(value: any) {
		const newStationId = value.toString();
		const stationExists = stationsProcessed.find(
			(station) => station.id.toString() === newStationId
		);

		if (!stationExists) {
			console.error(`Cannot select station "${newStationId}" for Map 1: Station not found in data`);
			station1Error = 'Station data not available';
			return;
		}

		station1Error = '';
		selectedStation1 = newStationId;
	}

	function handleStation2Select(value: any) {
		const newStationId = value.toString();
		const stationExists = stationsProcessed.find(
			(station) => station.id.toString() === newStationId
		);

		if (!stationExists) {
			console.error(`Cannot select station "${newStationId}" for Map 2: Station not found in data`);
			station2Error = 'Station data not available';
			return;
		}

		station2Error = '';
		selectedStation2 = newStationId;
	}

	// Create map instances
	function createMap(containerId: string) {
		const cfg = {
			...mapConfig,
			projection: mapConfig.projection as unknown as mapboxgl.Projection
		};

		return new mapboxgl.Map({
			container: containerId,
			...cfg
		});
	}

	// Add layers to map (transit, etc.)
	function addMapLayers(map: mapboxgl.Map, allStationData: any) {
		map.addSource('transit-line-data', {
			type: 'vector',
			url: transit_lines_source.url
		});
		map.addSource('transit-station-data', {
			type: 'geojson',
			data: allStationData
		});

		map.addLayer({
			id: 'transit-lines',
			type: 'line',
			source: 'transit-line-data',
			'source-layer': transit_lines_source.source_layer,
			paint: {
				'line-color': lineColorExpression as mapboxgl.DataDrivenPropertyValueSpecification<string>,
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

	// Update station styling for selected station
	function updateStationStyling(map: mapboxgl.Map, selectedStationFilter: any) {
		const styleUpdates = [
			['circle-color', ['case', selectedStationFilter, '#FFFFFF', '#B8B8B8']],
			['circle-stroke-color', ['case', selectedStationFilter, '#000000', '#949292']],
			['circle-stroke-width', ['case', selectedStationFilter, 2, 1]]
		];

		styleUpdates.forEach(([property, value]) => {
			map.setPaintProperty(
				'transit-station-points',
				property as 'circle-color' | 'circle-stroke-color' | 'circle-stroke-width',
				value as mapboxgl.ExpressionSpecification
			);
		});
	}

	// Update map for selected station
	function updateMapWithStationData(
		map: mapboxgl.Map | undefined,
		stationData: MapStationState,
		options: {
			radiusSourceId?: string;
			stationLayerId?: string;
			updateStylingCallback?: ((map: mapboxgl.Map, selectedStationFilter: any) => void) | null;
		} = {}
	) {
		const {
			radiusSourceId = 'station-radius',
			stationLayerId = 'transit-station-points',
			updateStylingCallback = null
		} = options;

		if (!map || !stationData) {
			return;
		}

		const { data, circle, bbox, coords } = stationData;

		if (!map.isStyleLoaded() || !data || !circle || !map.getLayer(stationLayerId)) {
			return;
		}

		const selectedStationFilter = ['==', ['get', 'station_id'], data.id];

		const source = map.getSource(radiusSourceId) as mapboxgl.GeoJSONSource | undefined;
		if (source) {
			(source as any).setData(circle);
		}

		if (bbox && coords) {
			map.setCenter(coords as [number, number]);
			map.fitBounds(bbox, { padding: 0 });
		}
		if (updateStylingCallback && typeof updateStylingCallback === 'function') {
			updateStylingCallback(map, selectedStationFilter);
		}
	}

	// Handle layer toggles
	function mapLayerToggle(map: mapboxgl.Map | undefined, layerVisibilityConfig: any) {
		const requiredLayers = [
			'greenspace',
			'transit-lines',
			'road',
			'parking',
			'transit-station-points',
			'all-buildings',
			'water'
		];

		if (!map || !map.isStyleLoaded()) {
			return false;
		}

		const allLayersExist = requiredLayers.every((layerId) => map.getLayer(layerId));
		if (!allLayersExist) {
			return false;
		}

		map.setLayoutProperty(
			'greenspace',
			'visibility',
			layerVisibilityConfig.greenspace ? 'visible' : 'none'
		);
		map.setLayoutProperty(
			'transit-lines',
			'visibility',
			layerVisibilityConfig.transit ? 'visible' : 'none'
		);
		map.setLayoutProperty(
			'parking',
			'visibility',
			layerVisibilityConfig.parking ? 'visible' : 'none'
		);
		map.setLayoutProperty(
			'transit-station-points',
			'visibility',
			layerVisibilityConfig.stations ? 'visible' : 'none'
		);
		map.setLayoutProperty(
			'all-buildings',
			'visibility',
			layerVisibilityConfig.buildings ? 'visible' : 'none'
		);

		const roadLayers = map.getStyle().layers.filter((layer) => layer['source-layer'] === 'road');
		roadLayers.forEach((layer) => {
			map.setLayoutProperty(
				layer.id,
				'visibility',
				layerVisibilityConfig.roads ? 'visible' : 'none'
			);
		});

		const waterLayers = ['water', 'waterway'];
		waterLayers.forEach((layer) => {
			if (map.getLayer(layer)) {
				map.setLayoutProperty(
					layer,
					'visibility',
					layerVisibilityConfig.water ? 'visible' : 'none'
				);
			}
		});

		return true;
	}

	// Safe isolated effect mapping down to Mapbox views
	$effect(() => {
		if (stationsProcessed.length > 0) {
			// Map 1 side effects execution
			if (mapData[1].data) {
				station1Error = '';
				updateMapWithStationData(map1, mapData[1], {
					updateStylingCallback: updateStationStyling
				});
				station1Metrics = stationMetrics.find(
					(station) => station.id.toString() === selectedStation1
				);
				station1Data = mapData[1].data;
			} else {
				station1Error = 'Station data not available';
			}

			// Map 2 side effects execution
			if (mapData[2].data) {
				station2Error = '';
				updateMapWithStationData(map2, mapData[2], {
					updateStylingCallback: updateStationStyling
				});
				station2Metrics = stationMetrics.find(
					(station) => station.id.toString() === selectedStation2
				);
				station2Data = mapData[2].data;
			} else {
				station2Error = 'Station data not available';
			}
		}
	});

	// Isolated Layer visibility rendering effect
	$effect(() => {
		const activeVisibility = {
			greenspace: greenspaceCheck,
			transit: transitCheck,
			parking: parkingCheck,
			stations: stationCheck,
			roads: roadsCheck,
			buildings: buildingsCheck,
			water: waterCheck
		};

		mapLayerToggle(map1, activeVisibility);
		mapLayerToggle(map2, activeVisibility);
	});

	// State verification fallbacks
	let initialStationsValidated = $state(false);
	$effect(() => {
		if (!initialStationsValidated && stationsProcessed.length > 0) {
			const station1Exists = stationsProcessed.find(
				(station) => station.id.toString() === selectedStation1
			);
			const station2Exists = stationsProcessed.find(
				(station) => station.id.toString() === selectedStation2
			);

			if (!station1Exists && stationsProcessed[0]) {
				selectedStation1 = stationsProcessed[0].id.toString();
			}
			if (!station2Exists && stationsProcessed[1]) {
				selectedStation2 = stationsProcessed[1].id.toString();
			}
			initialStationsValidated = true;
		}
	});

	onMount(async () => {
		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/dropdowns/transit-stations-dropdown.json'
			);
			transitStationsDropdown = await response.json();
		} catch (error) {
			console.error(
				'Error fetching station dropdown data:',
				error instanceof Error ? error.message : error
			);
		}

		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/enriched/map_stations_enriched.json'
			);
			stationRawData = await response.json();
		} catch (error) {
			console.error(
				'Error fetching map station data:',
				error instanceof Error ? error.message : error
			);
		}

		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/built_form/station-metrics.json'
			);
			stationMetrics = await response.json();
		} catch (error) {
			console.error(
				'Error fetching built form metric data:',
				error instanceof Error ? error.message : error
			);
		}

		const stationGeojson = {
			type: 'FeatureCollection',
			features: stationRawData.map((point) => ({
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [point.longitude, point.latitude]
				},
				properties: {
					name: point?.stop_label ?? null,
					station_id: point?.id ?? null
				}
			}))
		};

		map1 = createMap('map1');
		map2 = createMap('map2');

		map1.on('load', () => {
			addMapLayers(map1!, stationGeojson);
			if (mapData[1].coords && mapData[1].bbox) {
				map1!.setCenter(mapData[1].coords as [number, number]);
				map1!.fitBounds(mapData[1].bbox, { padding: 0 });
			}
		});

		map2.on('load', () => {
			addMapLayers(map2!, stationGeojson);
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
			>School of Cities</a
		>.
	</p>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-fit mx-auto">
	<div class="flex flex-col items-center">
		<div class="w-80 py-2 mx-auto my-auto">
			<Combobox
				handleSelect={handleStation1Select}
				data={transitStationsDropdown}
				icon="mdi:train"
				placeholder={'Search for a station'}
				selected={selectedStation1}
			></Combobox>
			<div class="h-4 text-center">
				{#if station1Error}
					<div class="error-message">{station1Error}</div>
				{/if}
			</div>
		</div>
		<div id="map1"></div>
	</div>

	<div class="flex flex-col items-center">
		<div class="w-80 py-2 mx-auto my-auto">
			<Combobox
				handleSelect={handleStation2Select}
				data={transitStationsDropdown}
				icon="mdi:train"
				placeholder={'Search for a station'}
				selected={selectedStation2}
			></Combobox>
			<div class="h-4 text-center">
				{#if station2Error}
					<div class="error-message">{station2Error}</div>
				{/if}
			</div>
		</div>
		<div id="map2"></div>
	</div>
</div>

<div class="flex justify-center text-sm px-2 py-4 gap-2 flex-wrap">
	<Checkbox bind:checked={roadsCheck} label="Road Network" icon="mdi:road" />
	<Checkbox
		bind:checked={transitCheck}
		label="Transit Lines"
		icon="mdi:transit-connection-variant"
	/>
	<Checkbox bind:checked={stationCheck} label="Transit Stations" icon="mdi:train" />
	<Checkbox bind:checked={greenspaceCheck} label="Greenspace" icon="mdi:pine-tree-variant" />
	<Checkbox bind:checked={waterCheck} label="Water" icon="mdi:waves" />
	<Checkbox bind:checked={buildingsCheck} label="Buildings" icon="mdi:office-building" />
	<Checkbox bind:checked={parkingCheck} label="Parking" icon="mdi:car" />
</div>

<div class="container mx-auto flex justify-center px-4 sm:px-6 pb-10 max-w-4xl">
	<MetricsDisplay {station1Data} {station2Data} {station1Metrics} {station2Metrics} />
</div>

<style>
	#map1,
	#map2 {
		width: 450px;
		height: 100%;
		min-height: 450px;
		border-radius: 50%;
		overflow: hidden;
		border: 2px solid #d3d3d3;
		padding: 20px;
	}

	.error-message {
		color: #dc2626;
		font-size: 0.875rem;
	}
</style>
