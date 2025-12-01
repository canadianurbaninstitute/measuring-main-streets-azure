<script lang="ts">
	// --- Imports ---
	import * as turf from '@turf/turf';
	import { Accordion, Tabs } from 'bits-ui';
	import * as d3 from 'd3';
	import Fuse from 'fuse.js';
	import mapboxgl from 'mapbox-gl';
	import CaretDown from 'phosphor-svelte/lib/CaretDown';
	import { onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import Footer from '../lib/ui/Footer.svelte';
	import '../styles.css';
	// --- Import Tabs ---
	import BuiltFormTab from './components/BuiltFormTab.svelte';
	import CompleteCommunityTab from './components/CompleteCommunityTab.svelte';
	import DemographicsTab from './components/DemographicsTab.svelte';
	import HousingTab from './components/HousingTab.svelte';
	// --- Data Imports ---
	// import builtFormMetrics from '../lib/data/transitdata/station-metrics.json';
	// import stationRawData from '../lib/data/transitdata/stations.json';
	// import transitRegionsRawData from '../lib/data/transitdata/transit-regions.json';
	import line_colors from '../lib/data/transitdata/line-colors.json';
	import type { Station } from '../lib/data/transitdata/stations';
	import LegendAbsolute from '../lib/ui/legends/LegendAbsolute.svelte';
	import AiDescription from './components/AiDescription.svelte';

	// --- Mapbox Access Token ---
	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';
	// --- Reactive/Exported Variables ---
	export let map;
	export let aiDescriptions = {};

	// --- UI State Variables ---
	let circleDrawn = false;
	let statusFilters = ['Existing', 'Construction', 'Planned'];
	let technologyFilters = ['Subway', 'LRT', 'Commuter'];
	let selectedStation: Station = { id: null };
	let stationSelected = false;
	let regionsData = [];
	let processedStationData = [];
	let searchTerm = '';
	let activeRegion = null;
	let activeLine = null;
	let sidebarDisplayItems = [];
	let stationBuiltForm = {};
	let stationCCcounts = {};
	let stationCCpresence = {};
	let mapCenter: [number, number] = [-92, 52];
	let defaultZoom: number = 3.7;
	let selectedVariable = null;
	let greenspaceVisible = true;
	let waterVisible = true;
	let buildingVisible = true;
	let parkingVisible = true;
	let isOpen = true;
	// Convert line colours to Mapbox expression
	const lineColorExpression = [
		'match',
		['get', 'line_id'],
		...Object.entries(line_colors).flatMap(([id, color]) => [
			[Number(id)], // Wrap the number in an array
			color
		]),
		'#000000' // Fallback color
	];
	let savedFilter = null;

	// --- Fuse.js Search Instances ---
	let regionsFuse;
	let linesFuse;
	let stopsFuse;

	// load data from remote
	let transitRegionsRawData;
	let stationRawData;
	let builtFormMetrics;
	let completeCommunityCounts;
	let completeCommunityPresence;

	// --- Chart Data Templates ---
	let ownerData = [
		{ label: 'Owner', value: 0, y: '⠀' },
		{ label: 'Renter', value: 0, y: '⠀' }
	];

	let housingData = [
		{ label: 'Pre-1960', value: 0 },
		{ label: '1961-80', value: 0 },
		{ label: '1981-00', value: 0 },
		{ label: 'Post-2000', value: 0 }
	];

	let dwellingData = [
		{ label: 'Detached', value: 0, y: '⠀' },
		{ label: 'Semi-Detached', value: 0, y: '⠀' },
		{ label: 'Row', value: 0, y: '⠀' },
		{ label: 'Duplex', value: 0, y: '⠀' },
		{ label: 'Apt >5', value: 0, y: '⠀' },
		{ label: 'Apt <5', value: 0, y: '⠀' }
	];

	let bedData = [
		{ label: 'Studio', value: 0, y: '⠀' },
		{ label: '1 Bed', value: 0, y: '⠀' },
		{ label: '2 Bed', value: 0, y: '⠀' },
		{ label: '3 Bed', value: 0, y: '⠀' },
		{ label: '≥ 4 Bed', value: 0, y: '⠀' }
	];

	let ageData = [
		{ label: '0-19', value: 0, y: '⠀' },
		{ label: '20-64', value: 0, y: '⠀' },
		{ label: '65+', value: 0, y: '⠀' }
	];

	let businessData = [
		{ label: 'Food and Drink', value: 0, y: '⠀' },
		{ label: 'Retail', value: 0, y: '⠀' },
		{ label: 'Local Services', value: 0, y: '⠀' }
	];

	let civicData = [
		{ label: 'Arts and Culture', value: 0, y: '⠀' },
		{ label: 'Government and Community Services', value: 0, y: '⠀' },
		{ label: 'Recreation', value: 0, y: '⠀' },
		{ label: 'Healthcare', value: 0, y: '⠀' },
		{ label: 'Education', value: 0, y: '⠀' }
	];

	let employmentData = [
		{ label: 'Tier 1', value: 0, y: '⠀' },
		{ label: 'Tier 2', value: 0, y: '⠀' },
		{ label: 'Other', value: 0, y: '⠀' }
	];

	// --- Search Functions ---
	function initializeSearchIndexes() {
		// Configure Fuse.js options for better search
		const fuseOptions = {
			threshold: 0.3,
			includeScore: true,
			keys: ['name', 'stop_label', 'line_display_name']
		};

		// Create search indexes
		regionsFuse = new Fuse(regionsData, {
			...fuseOptions,
			keys: ['name']
		});

		// Create lines search data with region context
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
		linesFuse = new Fuse(linesWithContext, {
			...fuseOptions,
			keys: ['name', 'regionName']
		});

		// Create stops search index
		stopsFuse = new Fuse(processedStationData, {
			...fuseOptions,
			keys: ['stop_label', 'line_display_name']
		});
	}

	function performSearch(query) {
		if (!query.trim()) {
			return {
				regions: [],
				lines: [],
				stops: []
			};
		}

		const regions = regionsFuse.search(query).map((result) => ({
			...result.item,
			type: 'region'
		}));

		const lines = linesFuse.search(query).map((result) => ({
			...result.item,
			type: 'line'
		}));

		const stops = stopsFuse.search(query).map((result) => ({
			...result.item,
			type: 'stop'
		}));

		return { regions, lines, stops };
	}

	// --- Data/Map Update Functions ---
	function updateStationData(id) {
		const station = processedStationData.find((s) => s.id === id);

		if (!station) {
			console.error('Station not found for ID:', id);
			selectedStation = { id: null };
			return;
		}

		selectedStation = station;
		// console.log('Selected Station:', selectedStation);

		stationBuiltForm = builtFormMetrics.find((station) => station.id === selectedStation.id) || {};
		stationCCcounts =
			completeCommunityCounts.find((station) => station.id === selectedStation.id) || {};
		stationCCpresence =
			completeCommunityPresence.find((station) => station.id === selectedStation.id) || {};

		ageData = [
			{ label: '0-19', value: selectedStation.Youth, y: '⠀' },
			{ label: '20-64', value: selectedStation.WorkingAge, y: '⠀' },
			{ label: '65+', value: selectedStation.Elderly, y: '⠀' }
		];

		housingData = [
			{ label: 'Pre-1960', value: selectedStation.BuiltBefore1961 },
			{ label: '1961-80', value: selectedStation.BuiltBetween1961And1980 },
			{ label: '1981-00', value: selectedStation.BuiltBetween1981And2000 },
			{ label: '2000-2020', value: selectedStation.BuiltBetween2001And2021 }
		];

		dwellingData = [
			{ label: 'Detached', value: selectedStation.SingleDetachedHouse, y: '⠀' },
			{ label: 'Semi-Detached', value: selectedStation.RowHouse, y: '⠀' },
			{ label: 'Row', value: selectedStation.SemiDetachedHouse, y: '⠀' },
			{ label: 'Duplex', value: selectedStation.DetachedDuplex, y: '⠀' },
			{ label: 'Apt >5', value: selectedStation['Apartment,FiveOrMoreStory'], y: '⠀' },
			{ label: 'Apt <5', value: selectedStation['Apartment,FewerThanFiveStory'], y: '⠀' }
		];

		const totalBedData =
			(selectedStation['NoBed'] ?? 0) +
			(selectedStation['OneBed'] ?? 0) +
			(selectedStation['TwoBed'] ?? 0) +
			(selectedStation['ThreeBed'] ?? 0) +
			(selectedStation['FourOrMoreBed'] ?? 0);

		bedData = [
			{
				label: 'Studio',
				value: totalBedData ? (selectedStation['NoBed'] / totalBedData) * 100 : 0,
				y: '⠀'
			},
			{
				label: '1 Bed',
				value: totalBedData ? (selectedStation['OneBed'] / totalBedData) * 100 : 0,
				y: '⠀'
			},
			{
				label: '2 Bed',
				value: totalBedData ? (selectedStation['TwoBed'] / totalBedData) * 100 : 0,
				y: '⠀'
			},
			{
				label: '3 Bed',
				value: totalBedData ? (selectedStation['ThreeBed'] / totalBedData) * 100 : 0,
				y: '⠀'
			},
			{
				label: '≥ 4 Bed',
				value: totalBedData ? (selectedStation['FourOrMoreBed'] / totalBedData) * 100 : 0,
				y: '⠀'
			}
		];

		ownerData = [
			{ label: 'Owner', value: selectedStation.Owned, y: '⠀' },
			{ label: 'Renter', value: selectedStation.Rented, y: '⠀' }
		];

		const totalBusinessData =
			(selectedStation['Food and Drink'] ?? 0) +
			(selectedStation['Retail'] ?? 0) +
			(selectedStation['Services and Other'] ?? 0);

		businessData = [
			{
				label: 'Food and Drink',
				value: totalBusinessData
					? (selectedStation['Food and Drink'] / totalBusinessData) * 100
					: 0,
				y: '⠀'
			},
			{
				label: 'Retail',
				value: totalBusinessData ? (selectedStation['Retail'] / totalBusinessData) * 100 : 0,
				y: '⠀'
			},
			{
				label: 'Local Services',
				value: totalBusinessData
					? (selectedStation['Services and Other'] / totalBusinessData) * 100
					: 0,
				y: '⠀'
			}
		];

		const totalCivicData =
			(selectedStation['Arts and Culture'] ?? 0) +
			(selectedStation['Government and Community Services'] ?? 0) +
			(selectedStation['Recreation Facilities'] ?? 0) +
			(selectedStation['Health and Care Facilities'] ?? 0) +
			(selectedStation['Education'] ?? 0);

		civicData = [
			{
				label: 'Arts and Culture',
				value: totalCivicData ? (selectedStation['Arts and Culture'] / totalCivicData) * 100 : 0,
				y: '⠀'
			},
			{
				label: 'Government and Community Services',
				value: totalCivicData
					? (selectedStation['Government and Community Services'] / totalCivicData) * 100
					: 0,
				y: '⠀'
			},
			{
				label: 'Recreation',
				value: totalCivicData
					? (selectedStation['Recreation Facilities'] / totalCivicData) * 100
					: 0,
				y: '⠀'
			},
			{
				label: 'Healthcare',
				value: totalCivicData
					? (selectedStation['Health and Care Facilities'] / totalCivicData) * 100
					: 0,
				y: '⠀'
			},
			{
				label: 'Education',
				value: totalCivicData ? (selectedStation['Education'] / totalCivicData) * 100 : 0,
				y: '⠀'
			}
		];

		const totalEmploymentData = selectedStation['EmployeeCount'] ?? 0;

		employmentData = [
			{
				label: 'Tier 1',
				value: totalEmploymentData
					? (stationCCcounts['Tier 1 Employment'] / totalEmploymentData) * 100
					: 0,
				y: '⠀'
			},
			{
				label: 'Tier 2',
				value: totalEmploymentData
					? (stationCCcounts['Tier 2 Employment'] / totalEmploymentData) * 100
					: 0,
				y: '⠀'
			},
			{
				label: 'Other',
				value: totalEmploymentData
					? ((totalEmploymentData -
							stationCCcounts['Tier 1 Employment'] -
							stationCCcounts['Tier 2 Employment']) /
							totalEmploymentData) *
						100
					: 0,
				y: '⠀'
			}
		];
	}

	export let min = 0;
	export let max = 0;

	//helper function to interpolate colours for d3
	function getD3InterpolateExpression(
		features,
		variable,
		colors = ['#F5C8D7', '#E87CA0', '#DB3069', '#721433']
	) {
		const values = features.map((f) => f.properties[variable]).filter((v) => v != null);
		min = +d3.min(values);
		max = +d3.max(values);
		const stops = colors
			.map((color, i) => [min + (i * (max - min)) / (colors.length - 1), color])
			.flat();

		return ['interpolate', ['linear'], ['get', variable], ...stops];
	}

	function updateLayerVariable(variable) {
		if (variable === null) {
			selectedVariable = null;
			if (map.getLayer('da')) map.removeLayer('da');
			return;
		}
		selectedVariable = variable;

		// If layer exists, just update it
		if (map.getLayer('da')) {
			const features = map.querySourceFeatures('da_map-bco47g', { sourceLayer: 'da_map-bco47g' });
			const expression = getD3InterpolateExpression(features, variable);
			map.setPaintProperty('da', 'fill-color', expression);
		} else {
			if (!map.getSource('da_map-bco47g')) return;
			// Add the layer if not present
			map.addLayer(
				{
					id: 'da',
					type: 'fill',
					source: 'da_map-bco47g',
					'source-layer': 'da_map-bco47g',
					paint: {
						'fill-color': '#000',
						'fill-opacity': 0
					}
				},
				'greenspace'
			);
			map.once('idle', () => {
				const features = map.querySourceFeatures('da_map-bco47g', { sourceLayer: 'da_map-bco47g' });
				const expression = getD3InterpolateExpression(features, variable);
				map.setPaintProperty('da', 'fill-color', expression);
				map.setPaintProperty('da', 'fill-opacity', 0.8);
			});
		}
	}

	function toggleLayer(layerIds, currentState) {
		// Handle both single layer (string) and multiple layers (array)
		const layers = Array.isArray(layerIds) ? layerIds : [layerIds];

		layers.forEach((layerId) => {
			if (map.getLayer(layerId)) {
				map.setLayoutProperty(layerId, 'visibility', currentState ? 'none' : 'visible');
			} else {
				console.warn(`Layer ${layerId} does not exist`);
			}
		});
		return !currentState;
	}

	// --- Map/Sidebar Navigation Functions ---
	function handleStationSelection(stationId, stationCoordinates) {
		// run update function to fetch relevant station data

		if (!map) return;
		updateStationData(stationId);

		stationSelected = true;

		// draw the MTSA circle
		const radiusInKilometers = 0.8;
		const circleFeature = turf.circle(stationCoordinates, radiusInKilometers, {
			steps: 128,
			units: 'kilometers'
		});
		// mask features outside circle
		const maskFeature = {
			geometry: {
				type: 'Polygon',
				coordinates: [
					// Outer ring (world bounds)
					[
						[-180, -90],
						[180, -90],
						[180, 90],
						[-180, 90],
						[-180, -90]
					],
					// Inner ring (circle - reversed coordinates)
					[...circleFeature.geometry.coordinates[0]].reverse()
				]
			}
		};
		// if the circle feature exists, update it and set variable to be true
		if (map.getSource('circle')) {
			map.getSource('circle').setData({
				type: 'FeatureCollection',
				features: [circleFeature]
			});
		}
		// Update mask source
		if (map.getSource('circle-mask')) {
			map.getSource('circle-mask').setData({
				type: 'FeatureCollection',
				features: [maskFeature]
			});
		}

		circleDrawn = true;

		// zoom to station
		map.flyTo({
			center: stationCoordinates,
			zoom: 14.5,
			duration: 1000
		});

		// filter layers to be only visible within the circle - could change to be colored inside circle grey outside but more complex

		const circlePolygon = circleFeature.geometry;
		const thematicLayers = [
			'msn-lowdensity',
			'msn-highdensity',
			'complete-community-amenities',
			'employment-size',
			'all-nar'
		];

		thematicLayers.forEach((layerId) => {
			if (map.getLayer(layerId)) {
				map.setFilter(layerId, ['in', circlePolygon]);
			}
		});
	}

	function resetStationSelection() {
		// remove circle
		if (map && map.getSource('circle')) {
			map.getSource('circle').setData({
				type: 'FeatureCollection',
				features: []
			});
		}
		// remove mask
		if (map && map.getSource('circle-mask')) {
			map.getSource('circle-mask').setData({
				type: 'FeatureCollection',
				features: []
			});
		}
		circleDrawn = false;

		// reset station
		stationSelected = false;
		selectedStation = { id: null };

		//reset layer filters
		const thematicLayersToReset = [
			'msn-lowdensity',
			'msn-highdensity',
			'complete-community-amenities',
			'employment-size',
			'all-nar'
		];
		thematicLayersToReset.forEach((layerId) => {
			if (map && map.getLayer(layerId)) {
				map.setFilter(layerId, null);
			}
		});
	}

	// search helper functions

	function selectRegion(region) {
		if (!map) return;
		resetStationSelection();

		activeRegion = region;
		activeLine = null;

		// zoom map to region based on bbox from transit-regions.json
		map.fitBounds(region.bbox, { padding: 50, duration: 1000 });
	}

	function selectLine(line) {
		if (!map || !map.getLayer('transit-lines')) return;
		resetStationSelection();

		activeLine = line;

		// find which line is selected on the map based on id
		const selectedLine = map.queryRenderedFeatures({
			layers: ['transit-lines'],
			filter: ['==', 'line_id', activeLine.id]
		});

		// if there is a line selected, zoom to it based on calculated bbox
		if (selectedLine.length > 0) {
			// Cast to any/GeoJSON-compatible type so TypeScript accepts the object for turf.bbox
			const featureCollection = {
				type: 'FeatureCollection',
				features: selectedLine
			} as any;

			const combinedBBox = turf.bbox(featureCollection);

			map.fitBounds(combinedBBox, { padding: 50, duration: 1000 });
		}
	}

	function selectStop(station) {
		handleStationSelection(station.id, [station.longitude, station.latitude]);
	}

	function navigateBack() {
		// navigate back to reset
		if (!map) return;
		resetStationSelection();

		// line case: zoom to region line is in

		if (activeLine) {
			activeLine = null;
			if (activeRegion) {
				map.fitBounds(activeRegion.bbox, { padding: 50, duration: 1000 });
			}
			// region case: reset map
		} else if (activeRegion) {
			activeRegion = null;
			map.flyTo({ center: mapCenter, zoom: defaultZoom, duration: 1000 });
			// TODO: should resetStationSelection run here too
		}
	}

	// --- Search/Sidebar Selection Functions ---
	function selectRegionFromSearch(region) {
		searchTerm = '';
		selectRegion(region);
	}

	function selectLineFromSearch(line) {
		searchTerm = '';
		const parentRegion = regionsData.find((r) => r.id === line.regionId);
		if (parentRegion) {
			activeRegion = parentRegion;
		}
		selectLine(line);
	}

	function selectStopFromSearch(stop) {
		searchTerm = '';
		selectStop(stop);
	}

	function handleSidebarBack() {
		if (stationSelected) {
			const previouslyActiveLine = activeLine;
			const previouslyActiveRegion = activeRegion;

			resetStationSelection();

			stationSelected = false;

			if (map) {
				if (previouslyActiveLine) {
					const lineStations = processedStationData.filter(
						(s) => s.line_ids_array && s.line_ids_array.includes(previouslyActiveLine.id)
					);
					if (
						lineStations.length > 0 &&
						typeof turf !== 'undefined' &&
						turf.featureCollection &&
						turf.point &&
						turf.bbox
					) {
						const stationPoints = turf.featureCollection(
							lineStations.map((s) => turf.point([s.longitude, s.latitude]))
						);
						const lineBbox = turf.bbox(stationPoints);
						map.fitBounds(lineBbox, { padding: 50, duration: 1000 });
					} else if (previouslyActiveRegion) {
						map.fitBounds(previouslyActiveRegion.bbox, { padding: 50, duration: 1000 });
					}
				} else if (previouslyActiveRegion) {
					map.fitBounds(previouslyActiveRegion.bbox, { padding: 50, duration: 1000 });
				}
			}
		} else {
			navigateBack();
		}
	}

	// --- Reactive Logic with Fuse.js search library ---
	$: searchResults = searchTerm ? performSearch(searchTerm) : { regions: [], lines: [], stops: [] };

	$: {
		if (searchTerm) {
			sidebarDisplayItems = [];
		} else if (activeLine) {
			sidebarDisplayItems = processedStationData
				.filter((s) => s.line_ids_array && s.line_ids_array.includes(activeLine.id))
				.map((s) => ({ ...s, type: 'stop' }))
				.sort((a, b) => (a.stop_label || '').localeCompare(b.stop_label || ''));
		} else if (activeRegion) {
			sidebarDisplayItems = activeRegion.lines
				.map((l) => ({ ...l, type: 'line' }))
				.sort((a, b) => a.name.localeCompare(b.name));
		} else {
			sidebarDisplayItems = regionsData
				.map((r) => ({ ...r, type: 'region' }))
				.sort((a, b) => a.name.localeCompare(b.name));
		}
	}

	// --- Svelte Lifecycle: onMount (Map Initialization) ---
	onMount(async () => {
		// add map
		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/canadianurbaninstitute/cmif0wnev003201s3b0btg8te?optimize=true', // no transit lines
			center: mapCenter,
			zoom: defaultZoom,
			maxZoom: 15.5,
			minZoom: 2,
			scrollZoom: true,
			attributionControl: false
		});

		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/enriched/map_stations_enriched.json'
			);
			stationRawData = await response.json();
		} catch (error) {
			console.error('Error fetching station data:', error);
		}

		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/transit_regions/transit-regions.json'
			);
			transitRegionsRawData = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error);
		}

		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/built_form/station-metrics.json'
			);
			builtFormMetrics = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error);
		}
		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/complete_communities/stations_cc_counts.json'
			);
			completeCommunityCounts = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error);
		}
		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/complete_communities/stations_cc_presence.json'
			);
			completeCommunityPresence = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error);
		}

		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/ai_descriptions.json'
			);
			aiDescriptions = await response.json();
		} catch (error) {
			console.error('Error fetching station data:', error);
		}

		regionsData = transitRegionsRawData.sort((a, b) => a.name.localeCompare(b.name));

		processedStationData = stationRawData.map((station) => ({
			...station,
			line_ids_array: station.line_id
				? station.line_id
						.split(',')
						.map((s) => parseInt(s.trim(), 10))
						.filter((n) => !isNaN(n))
				: []
		}));

		// Initialize search indexes after data is loaded

		initializeSearchIndexes();

		map.addControl(new mapboxgl.NavigationControl(), 'top-right');

		map.addControl(
			new mapboxgl.AttributionControl({
				customAttribution: 'Canadian Urban Institute'
			})
		);
		map.on('style.import.load', () => {
			console.log('Map style.import.load');
		});

		map.on('load', () => {
			console.log('Map load');
		});

		map.on('style.load', () => {
			console.log('Map style.load');
		});

		map.on('styledataloading', () => {
			console.log('Map styledataloading');
		});

		// add map sources and layers
		map.on('load', () => {
			console.log('Map loaded');
			// Add transit sources
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
			// Add mask source
			map.addSource('circle-mask', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: []
				}
			});
			// Add circle source
			map.addSource('circle', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: []
				}
			});
			map.addSource('da_map-bco47g', {
				type: 'vector',
				url: 'mapbox://canadianurbaninstitute.1cu02ydb'
			});

			// Add layers
			map.addLayer({
				id: 'transit-lines',
				type: 'line',
				source: 'transit-line-data',
				'source-layer': 'merged_map_lines',
				paint: {
					'line-color': lineColorExpression,
					'line-width': ['interpolate', ['linear'], ['zoom'], 3, 0, 7, 4, 12, 8],
					'line-dasharray': [
						'case',
						[
							'any',
							['==', ['get', 'status'], 'Construction'],
							['==', ['get', 'status'], 'Planned']
						],
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
					'circle-radius': [
						'interpolate',
						['linear'],
						['zoom'],
						6,
						0, // Zoom level, radius
						7,
						2,
						10,
						3,
						12,
						6,
						14,
						10
					],
					'circle-stroke-color': '#000',
					'circle-stroke-width': [
						'interpolate',
						['linear'],
						['zoom'],
						6,
						0, // Zoom level, width
						7,
						0.8,
						10,
						1.5,
						13,
						2
					]
				},
				minzoom: 6
			});
			map.addLayer({
				id: 'circle-mask',
				type: 'fill',
				source: 'circle-mask',
				paint: {
					'fill-color': '#ffffff', // match your background color
					'fill-opacity': 0.8
				}
			});
			map.addLayer(
				{
					id: 'circle-radius',
					type: 'line',
					source: 'circle',
					paint: {
						'line-color': '#222',
						'line-opacity': 1,
						'line-width': 3,
						'line-dasharray': [2, 2]
					}
				},
				'transit-stations'
			);
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

			// click function for transit layers
			map.on('click', 'transit-stations', (e) => {
				if (e.features.length > 0) {
					const stationId = e.features[0].properties.id;
					const stationDataForClick = processedStationData.find((s) => s.id === stationId);
					if (stationDataForClick) {
						selectStop(stationDataForClick);
					}
				}
			});
			// click function for transit region points
			map.on('click', 'transit-region-points', (e) => {
				const regionId = e.features[0].properties.id;
				const regionClicked = regionsData.find((r) => r.id === regionId);
				selectRegion(regionClicked);
			});

			map.on('zoom', () => {
				if (map.getLayer('da')) {
					updateLayerVariable(selectedVariable);
				}
			});
		});

		// show popups on hover
		const popup = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false
		});

		popup.addClassName('station-popup');

		const popup2 = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false
		});

		popup.addClassName('line-popup');

		const popup3 = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false
		});

		popup3.addClassName('region-popup');

		map.on('mouseenter', ['transit-stations', 'transit-lines', 'transit-region-points'], () => {
			map.getCanvas().style.cursor = 'pointer';
		});

		map.on('mousemove', 'transit-stations', (e) => {
			if (e.features.length > 0) {
				const coordinates = e.lngLat;
				const name = e.features[0].properties.stop_label;

				popup
					.setLngLat(coordinates)
					.setHTML(
						`
                <span class="label-name">${name}</span>
            			`
					)
					.addTo(map);
			}
		});

		map.on('mousemove', 'transit-region-points', (e) => {
			if (e.features.length > 0) {
				const coordinates = e.lngLat;
				const name = e.features[0].properties.region;

				if (map.getZoom() <= 5) {
					// only show pop-up if map is zoomed out
					popup3
						.setLngLat(coordinates)
						.setHTML(
							`
					<span class="label-name">${name}</span>
							`
						)
						.addTo(map);
				}
			}
		});

		map.on('mouseleave', 'transit-stations', () => {
			popup.remove();
		});

		map.on('mouseleave', 'transit-lines', () => {
			popup2.remove();
		});

		map.on('mouseleave', 'transit-region-points', () => {
			popup3.remove();
		});

		map.on('mouseleave', ['transit-stations', 'transit-lines', 'transit-region-points'], () => {
			map.getCanvas().style.cursor = '';
		});
	});

	// --- Filter/Tab UI Handlers ---
	function applyFilters() {
		const filterConditions = [];

		if (statusFilters.length) {
			filterConditions.push([
				'any',
				...statusFilters.map((status) => [
					'case',
					['!=', ['index-of', status, ['get', 'status']], -1],
					true,
					false
				])
			]);
		}

		if (technologyFilters.length) {
			filterConditions.push([
				'any',
				...technologyFilters.map((tech) => [
					'case',
					['!=', ['index-of', tech, ['get', 'technology']], -1],
					true,
					false
				])
			]);
		}

		const combinedFilter = filterConditions.length ? ['all', ...filterConditions] : true;

		const layers = ['transit-stations', 'transit-lines'];

		layers.forEach((layer) => {
			if (map.getLayer(layer)) {
				map.setFilter(layer, combinedFilter);
			}
		});
	}

	function handleTabChange(selectedTab) {
		map.setPaintProperty('msn-lowdensity', 'line-opacity', 0);
		map.setPaintProperty('msn-highdensity', 'line-opacity', 0);
		map.setPaintProperty('complete-community-amenities', 'circle-opacity', 0);
		map.setPaintProperty('complete-community-amenities', 'circle-stroke-opacity', 0);
		map.setPaintProperty('greenspace', 'fill-opacity', 0);
		map.setPaintProperty('parking-built-form', 'fill-opacity', 0);
		map.setPaintProperty('all-buildings', 'fill-opacity', 0);
		map.setPaintProperty('water-built-form', 'fill-opacity', 0);
		map.setPaintProperty('waterway-built-form', 'line-opacity', 0);
		map.setPaintProperty('employment-size', 'circle-opacity', 0);
		map.setPaintProperty('employment-size', 'circle-stroke-opacity', 0);
		map.setPaintProperty('all-nar', 'circle-opacity', 0);
		map.setPaintProperty('all-nar', 'circle-stroke-opacity', 0);
		updateLayerVariable(null);

		switch (selectedTab) {
			case 'demographics':
				break;
			case 'housing':
				map.setPaintProperty('all-nar', 'circle-opacity', 0.8);
				map.setPaintProperty('all-nar', 'circle-stroke-opacity', 1);
				break;
			case 'built-form':
				// map.flyTo({
				// 	center:
				// 		selectedStation.longitude && selectedStation.latitude
				// 			? [selectedStation.longitude, selectedStation.latitude]
				// 			: map.getCenter(),
				// 	zoom: selectedStation.longitude && selectedStation.latitude ? 14.5 : map.getZoom(),
				// 	duration: 1000
				// });

				map.setPaintProperty('greenspace', 'fill-opacity', 0.8);
				map.setPaintProperty('parking-built-form', 'fill-opacity', 0.8);
				map.setPaintProperty('all-buildings', 'fill-opacity', 0.8);
				map.setPaintProperty('water-built-form', 'fill-opacity', 0.8);
				map.setPaintProperty('waterway-built-form', 'line-opacity', 0.8);

				break;
			case 'complete-communities':
				map.setPaintProperty('complete-community-amenities', 'circle-opacity', 1);
				map.setPaintProperty('complete-community-amenities', 'circle-stroke-opacity', 1);
				map.setPaintProperty('msn-lowdensity', 'line-opacity', 1);
				map.setPaintProperty('msn-highdensity', 'line-opacity', 1);
				break;
			case 'employment':
				map.setPaintProperty('employment-size', 'circle-opacity', 0.8);
				map.setPaintProperty('employment-size', 'circle-stroke-opacity', 1);
			default:
				break;
		}
	}

	let accordionValue: string | null = 'intro';

	// Auto-close when a station is selected
	$: if (selectedStation.id) {
		accordionValue = null;
	}
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<!-- <div class="hero">
</div> -->
<Tabs.Root value="demographics" onValueChange={(value) => handleTabChange(value)}>
	<div id="content-container">
		<div id="sidebar">
			<div class="p-4">
				<Accordion.Root
					bind:value={accordionValue}
					type="single"
					onValueChange={(val) => (isOpen = val === 'intro')}
				>
					<Accordion.Item value="intro">
						<Accordion.Content forceMount={true} class="overflow-hidden text-sm tracking-[-0.01em]">
							{#if isOpen}
								<div
									transition:slide={{ duration: 300, easing: cubicOut }}
									class="overflow-hidden text-sm tracking-[-0.01em]"
								>
									<Accordion.Header>
										<div id="title">
											<h1>Transit Map</h1>
										</div>
									</Accordion.Header>
									<p>
										This is a map of all existing, under construction and planned higher-order
										transit lines in Canada. Search for a place or navigate the map using the
										controls; and then click on a transit station to see information associated with
										it in the panel on the left.
									</p>
									<p class="text-sm mt-4">
										<em>This tool is in beta.</em>
									</p>
								</div>
							{/if}
						</Accordion.Content>
						<Accordion.Trigger
							class="rounded-lg flex w-full flex-1 select-none items-center py-2 justify-between text-[15px] font-medium transition-all
						[&[data-state=open]_.closed]:hidden
						[&[data-state=closed]_.open]:hidden
						[&[data-state=open]>span>svg]:rotate-180"
						>
							<p class="open">Close description</p>
							<p class="closed">Open description</p>

							<span
								class="hover:bg-dark-10 inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent"
							>
								<CaretDown class="size-[18px] transition-transform duration-200" />
							</span>
						</Accordion.Trigger>
					</Accordion.Item>
				</Accordion.Root>
			</div>
			<input
				id="search"
				type="text"
				bind:value={searchTerm}
				placeholder="Search for a region, line, or station..."
				class="search-input"
			/>
			{#if stationSelected || activeLine || activeRegion}
				<button on:click={handleSidebarBack} class="back-button bg-zinc-50">← Back</button>
			{/if}
			{#if stationSelected && !searchTerm}
				<div class="station-details-scroll-container">
					{#if selectedStation && selectedStation.id}
						<div id="station-container">
							<div>
								<div id="transit-logos">
									{#each selectedStation.line_id ? selectedStation.line_id
												.split(',')
												.map((s) => s.trim()) : [] as lineId}
										<img
											src={`/transit-logos/${lineId}.svg`}
											alt="transit-logo"
											class="transit-logo"
										/>
									{/each}
								</div>
								<h3>{selectedStation.stop_label}</h3>
							</div>
							<h4>{selectedStation.line_display_name}</h4>

							<div id="tag-container">
								<div class="tag-list">
									<h6>Status:</h6>
									{#each selectedStation.status?.split(', ') || [] as status}
										<div
											class="tag"
											class:bg-green-200={status === 'Existing'}
											class:bg-pink-200={status === 'Planned'}
											class:bg-yellow-200={status === 'Construction'}
										>
											{status}
										</div>
									{/each}
								</div>
								<div class="tag-list">
									<h6>Technology:</h6>
									{#each selectedStation.technology?.split(', ') || [] as technology}
										<div
											class="tag"
											class:bg-blue-200={technology === 'Subway'}
											class:bg-blue-300={technology === 'LRT'}
											class:bg-blue-400={technology === 'Commuter'}
										>
											{technology}
										</div>
									{/each}
								</div>
							</div>
						</div>
						<AiDescription {selectedStation} {aiDescriptions} />
						<Tabs.Content value="demographics" class="tab-button">
							<DemographicsTab
								{selectedStation}
								{ageData}
								{selectedVariable}
								onSelectVariable={(v) => updateLayerVariable(v)}
							/>
						</Tabs.Content>
						<Tabs.Content value="housing" class="tab-button">
							<HousingTab
								{map}
								{selectedStation}
								{ownerData}
								{dwellingData}
								{housingData}
								{bedData}
								{selectedVariable}
								onSelectVariable={(v) => updateLayerVariable(v)}
							/>
						</Tabs.Content>
						<Tabs.Content value="built-form" class="tab-button">
							<BuiltFormTab
								{selectedStation}
								{stationBuiltForm}
								{selectedVariable}
								bind:greenspaceVisible
								bind:waterVisible
								bind:buildingVisible
								bind:parkingVisible
								toggleLayer={(layerId, currentState) => toggleLayer(layerId, currentState)}
								onSelectVariable={(v) => updateLayerVariable(v)}
							/>
						</Tabs.Content>
						<Tabs.Content value="complete-communities" class="tab-button">
							<CompleteCommunityTab
								{map}
								{selectedStation}
								{stationCCcounts}
								{stationCCpresence}
								{businessData}
								{civicData}
								{selectedVariable}
								onSelectVariable={(v) => updateLayerVariable(v)}
							/>
						</Tabs.Content>
					{:else if stationSelected}
						<p>Loading station details...</p>
					{/if}
				</div>
			{:else}
				<div class="navigation-scroll-container">
					{#if searchTerm}
						{#if searchResults.regions.length > 0}
							<div class="nav-section-header">Regions</div>
							<ul class="nav-list">
								{#each searchResults.regions as item (item.id)}
									<li on:click={() => selectRegionFromSearch(item)} class="nav-item region-item">
										{item.name}
									</li>
								{/each}
							</ul>
						{/if}
						{#if searchResults.lines.length > 0}
							<div class="nav-section-header">Lines</div>
							<ul class="nav-list">
								{#each searchResults.lines as item (item.id)}
									<li on:click={() => selectLineFromSearch(item)} class="nav-item line-item">
										{item.name} <span class="context">({item.regionName})</span>
									</li>
								{/each}
							</ul>
						{/if}
						{#if searchResults.stops.length > 0}
							<div class="nav-section-header">Stops</div>
							<ul class="nav-list">
								{#each searchResults.stops as item (item.id)}
									<li on:click={() => selectStopFromSearch(item)} class="nav-item stop-item">
										{item.stop_label}
										<span class="context">({item.line_display_name || 'N/A'})</span>
									</li>
								{/each}
							</ul>
						{/if}
						{#if searchResults.regions.length === 0 && searchResults.lines.length === 0 && searchResults.stops.length === 0}
							<p class="no-results">No results found.</p>
						{/if}
					{:else}
						<ul class="nav-list">
							{#each sidebarDisplayItems as item (item.id || item.stop_label)}
								{#if item.type === 'region'}
									<li on:click={() => selectRegion(item)} class="nav-item region-item">
										{item.name}
									</li>
								{:else if item.type === 'line'}
									<li on:click={() => selectLine(item)} class="nav-item line-item">{item.name}</li>
								{:else if item.type === 'stop'}
									<li on:click={() => selectStop(item)} class="nav-item stop-item">
										{item.stop_label}
									</li>
								{/if}
							{/each}
						</ul>
					{/if}
				</div>
			{/if}
		</div>
		<div class="w-full">
			<div class="flex flex-row w-full flex-wrap lg:flex-nowrap">
				<div id="controls" class="flex flex-col w-full">
					<div id="filter-container" class="flex-wrap">
						<div class="filter-group">
							<h6>Status:</h6>
							<label
								><input
									type="checkbox"
									bind:group={statusFilters}
									value="Existing"
									on:change={applyFilters}
								/> Existing</label
							>
							<label
								><input
									type="checkbox"
									bind:group={statusFilters}
									value="Construction"
									on:change={applyFilters}
								/> Construction</label
							>
							<label
								><input
									type="checkbox"
									bind:group={statusFilters}
									value="Planned"
									on:change={applyFilters}
								/> Planned</label
							>
						</div>

						<div class="filter-group">
							<h6>Technology:</h6>
							<label
								><input
									type="checkbox"
									bind:group={technologyFilters}
									value="Subway"
									on:change={applyFilters}
								/> Subway</label
							>
							<label
								><input
									type="checkbox"
									bind:group={technologyFilters}
									value="LRT"
									on:change={applyFilters}
								/> LRT</label
							>
							<label
								><input
									type="checkbox"
									bind:group={technologyFilters}
									value="Commuter"
									on:change={applyFilters}
								/> Commuter</label
							>
						</div>
					</div>
					<Tabs.List class="w-full grid grid-cols-3 xl:grid-cols-6 gap-1">
						<Tabs.Trigger
							class="rounded-md xl:rounded-none xl:rounded-t-md data-[state=inactive]:bg-zinc-50 data-[state=active]:bg-blue-300"
							value="demographics">Demographics</Tabs.Trigger
						>
						<Tabs.Trigger
							class="rounded-md xl:rounded-none xl:rounded-t-md data-[state=inactive]:bg-zinc-50 data-[state=active]:bg-blue-300"
							value="housing">Housing</Tabs.Trigger
						>
						<Tabs.Trigger
							class="rounded-md xl:rounded-none xl:rounded-t-md data-[state=inactive]:bg-zinc-50 data-[state=active]:bg-blue-300"
							value="employment">Employment</Tabs.Trigger
						>
						<Tabs.Trigger
							class="rounded-md xl:rounded-none xl:rounded-t-md data-[state=inactive]:bg-zinc-50 data-[state=active]:bg-blue-300"
							value="built-form">Built Form</Tabs.Trigger
						>
						<Tabs.Trigger
							class="rounded-md xl:rounded-none xl:rounded-t-md data-[state=inactive]:bg-zinc-50 data-[state=active]:bg-blue-300"
							value="complete-communities">Complete Communities</Tabs.Trigger
						>
						<Tabs.Trigger
							class="rounded-md xl:rounded-none xl:rounded-t-md data-[state=inactive]:bg-zinc-50 data-[state=active]:bg-blue-300"
							value="employment">Employment</Tabs.Trigger
						>
					</Tabs.List>
				</div>
			</div>
			<div id="map-container" class="w-full">
				{#if typeof min === 'number' && !isNaN(min) && typeof max === 'number' && !isNaN(max) && min !== max && selectedVariable}
					<LegendAbsolute
						title={selectedVariable}
						gradient="linear-gradient(to right, #F5C8D7, #E87CA0, #DB3069, #721433)"
						items={[{ label: min.toString() }, { label: max.toString() }]}
					/>
				{/if}

				<div id="map"></div>
			</div>
		</div>
	</div>
</Tabs.Root>
<Footer />

<style>
	#title {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1em;
	}

	#map {
		height: 100%;
		width: 100%;
		position: relative;
		order: -1;
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
	}

	#sidebar::-webkit-scrollbar {
		display: none;
	}

	.navigation-scroll-container,
	.station-details-scroll-container {
		flex-grow: 1;
		overflow-y: auto;
	}

	.station-details-scroll-container > div {
		padding: 1em;
	}

	#map {
		height: 100%;
		width: 100%;
	}

	#map-container {
		position: relative;
	}

	#station-container {
		padding: 1em 1em 0 1em;
	}

	h4 {
		margin: 0;
		padding: 0.2em 0 0.2em 0;
		overflow-wrap: break-word;
	}
	.tag {
		display: flex;
		justify-content: center;
		padding: 0.25em 1em;
		border: 1px solid #ddd;
		border-radius: 10em;
	}

	.tag-list {
		display: flex;
		align-items: center;
		flex-direction: row;
		gap: 0.5em;
		width: 100%;
		padding: 0.5em 0 0 0;
	}

	#filter-container {
		display: flex;
		flex-direction: column;
		gap: 1em;
		padding: 1em;
	}

	.filter-group {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1em;
	}

	.search-input {
		margin: 0 1em 0.5em 1em;
		padding: 1em;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 0.9em;
	}

	.back-button {
		padding: 8px 12px;
		border-radius: 4px;
		border: 1px solid #ccc;
		cursor: pointer;
		font-size: 0.9em;
		margin: 0 1em;
	}

	.back-button:hover {
		background-color: var(--color-zinc-100);
	}

	.nav-list {
		list-style-type: none;
		margin: 0;
		padding: 0;
	}

	.nav-item {
		padding: 1em;
		cursor: pointer;
		border-bottom: 1px solid #f5f5f5;
		transition: background-color 0.1s;
		font-size: 0.9em;
	}
	.nav-item:last-child {
		border-bottom: none;
	}

	.nav-item:hover {
		background-color: #f0f0f0;
	}

	.region-item {
		font-weight: bold;
		padding-left: 1em;
	}
	.line-item {
		padding-left: 1em;
	}
	.stop-item {
		padding-left: 1em;
	}

	.nav-section-header {
		font-weight: bold;
		margin: 0.8em;
		color: #555;
		font-size: 0.8em;
		text-transform: uppercase;
	}

	.context {
		font-size: 0.9em;
		color: #777;
	}
	.no-results {
		padding: 10px;
		color: #777;
	}

	@media only screen and (min-width: 768px) {
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

		#map-container {
			height: 100%;
		}

		#map {
			height: 100%;
		}

		#filter-container {
			flex-grow: 1;
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 1em;
		}
	}

	@media only screen and (max-width: 768px) {
		#map-container {
			height: 100vw;
			min-height: 500px;
		}

		#map {
			height: 100vw;
			min-height: 500px;
		}
	}

	#transit-logos {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5em;
		margin: 0.5em 0;
	}

	.transit-logo {
		height: 30px;
		width: auto;
		border-radius: 4px;
	}
</style>
