<script lang="ts">
	// --- Imports ---
	import * as turf from '@turf/turf';
	import { Tabs } from 'bits-ui';
	import * as d3 from 'd3';
	import { da_map_source } from '../../lib/data/transitdata/config-mapbox.json';

	import type { Feature, Polygon } from 'geojson';

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { driver } from 'driver.js';
	import 'driver.js/dist/driver.css';
	import { onMount, untrack } from 'svelte';
	import {
		TIER_1_AMENITIES,
		TIER_2_AMENITIES
	} from '../../lib/data/transitdata/complete-communities-config';
	import { age, bed, dwelling, housing, owner } from '../../lib/data/transitdata/config.json';
	import type { Station } from '../../lib/data/transitdata/stations';
	import getD3InterpolateExpression from '../../lib/helpers/getD3InterpolateExpression';
	import CustomButton from '../../lib/ui/CustomButton.svelte';
	import '../../styles.css';
	import AiDescription from '../components/AiDescription.svelte';
	import BuiltFormTab from '../components/BuiltFormTab.svelte';
	import CompleteCommunityTab from '../components/CompleteCommunityTab.svelte';
	import DemographicsTab from '../components/DemographicsTab.svelte';
	import EmploymentTab from '../components/EmploymentTab.svelte';
	import Filters from '../components/Filters.svelte';
	import Header from '../components/Header.svelte';
	import HousingTab from '../components/HousingTab.svelte';
	import MapContainer from '../components/MapContainer.svelte';
	import Search from '../components/Search.svelte';
	import SelectRegion from '../components/SelectRegion.svelte';
	import StationStatus from '../components/StationStatus.svelte';

	// --- Reactive/Exported Variables ---
	let aiDescriptions = $state({});
	let map: mapboxgl.Map = $state();
	let mapCenter: [number, number] = $state([-92, 52]);
	const defaultZoom: number = 3.7;

	// --- UI State Variables ---
	let statusFilters = $state(['Existing', 'Construction', 'Planned']);
	let technologyFilters = $state(['Subway', 'LRT', 'Commuter']);
	let selectedStation: Station = $state({ id: null });
	let stationSelected = $state(false);
	let regionsData = $state([]);
	let processedStationData = $state([]);
	let searchTerm = $state('');
	let activeRegion = $state(null);
	let activeLine = $state(null);
	let stationBuiltForm = $state({});
	let stationCCcounts = $state({});
	let stationCCpresence = $state({});
	let stationVisitorData = $state({});
	let selectedVariable = $state(null);
	let greenspaceVisible = $state(true);
	let waterVisible = $state(true);
	let buildingVisible = $state(true);
	let parkingVisible = $state(true);
	let min = $state(0);
	let max = $state(0);
	let isOpen = $state(true);
	let isAIOpen = $state(true);
	let activeTab = $state('demographics');

	// data
	let transitRegionsRawData = $state([]);
	let stationRawData = $state([]);
	let builtFormMetrics = $state([]);
	let completeCommunityCounts = $state([]);
	let visitorData = $state([]);
	let completeCommunityPresence = $state([]);
	let ownerData = $state([]);
	let housingData = $state([]);
	let dwellingData = $state([]);
	let bedData = $state([]);
	let ageData = $state([]);
	let employmentData = $state([]);
	let stationDpiData = $state([]);
	let stationDpiRawData: any[] = $state([]);
	let buildingPermitYearData: any[] = $state([]);

	let regionsFuse = $state();
	let linesFuse = $state();
	let stopsFuse = $state();

	// --- Tutorial State ---
	let driverObj = $state({});

	function initiateTutorial() {
		driverObj.drive();
	}
	// --- Guided Tutorial Setup ---
	onMount(() => {
		driverObj = driver({
			showProgress: true,
			steps: [
				{
					element: '.transit-map-title',
					popover: {
						title: 'Transit map tutorial',
						description: 'Welcome to the transit map tutorial.',
						side: 'left',
						align: 'start'
					},
					onHighlightStarted: () => {
						isOpen = true;
						resetStationSelection();
					}
				},
				{
					element: '#collapse',
					popover: {
						title: 'Collapse description',
						description: 'Click here to expand or collapse the page description.',
						side: 'left',
						align: 'start'
					},
					onHighlightStarted: () => {
						isOpen = false;
					}
				},
				{
					element: '#map-container',
					popover: {
						title: 'Transit map',
						description:
							'This is an interactive map of all major transit stations. Navigate the map by scrolling or zooming and click on a region to drill down into a transit station area.',
						side: 'right',
						align: 'start'
					}
				},
				{
					element: '.navigation-scroll-container',
					popover: {
						title: 'Select region',
						description:
							'You can click on a region to drill down by transit line and transit station.',
						side: 'left',
						align: 'start'
					}
				},
				{
					element: '#search',
					popover: {
						title: 'Search',
						description: 'Alternatively, you can search for the station you want.',
						side: 'left',
						align: 'start'
					}
				},
				{
					element: '#sidebar',
					popover: {
						title: 'Sidebar',
						description:
							'After you click on a station, you can see information associated with it in this panel.',
						side: 'left',
						align: 'start'
					},
					onHighlightStarted: () => {
						if (processedStationData && processedStationData.length > 0) {
							const station = processedStationData[89];
							selectStop(station);
						}
						handleTabChange('demographics');
					}
				},
				{
					element: '#ai',
					popover: {
						title: 'AI Summary',
						description:
							'This experimental feature provides an AI-generated summary of the data for this station. Explore the data to verify the accuracy of the summary.',
						side: 'left',
						align: 'start'
					}
				},
				{
					element: '#TotalPopulation',
					popover: {
						title: 'Data overlays',
						description:
							'Most metrics are clickable. Select one to toggle the data as a choropleth layer on the map for a more detailed geographic breakdown.',
						side: 'left',
						align: 'start'
					},
					onHighlightStarted: () => {
						isAIOpen = false;
						updateLayerVariable('TotalPopulation');
					},
					onDeselected: () => {
						updateLayerVariable(null);
					}
				},
				{
					element: '#tabs',
					popover: {
						title: 'Map views',
						description: 'Use these tabs to explore different facets of the station data.',
						side: 'left',
						align: 'start'
					},
					onHighlighted: () => {
						handleTabChange('complete-communities');
						isOpen = true;
					}
				},
				{
					element: '#transit-tutorial',
					popover: {
						title: 'Tutorial',
						description:
							"Congratulations, you've completed the tutorial! You can revisit it at any time by clicking this button.",
						side: 'left',
						align: 'start'
					},
					onDeselected: () => {
						resetStationSelection();
					}
				}
			]
		});

		// --- First-Time Visitor Tutorial ---
		if (typeof sessionStorage !== 'undefined') {
			const hasVisitedTransitTutorial = sessionStorage.getItem('hasVisitedTransitTutorial');
			if (!hasVisitedTransitTutorial) {
				initiateTutorial();
				sessionStorage.setItem('hasVisitedTransitTutorial', 'true');
			}
		}
	});

	// Side Effects
	$effect(() => {
		const id = selectedStation.id;
		if (id) {
			isOpen = false;
		}
	});

	$effect(() => {
		// We need both the map initialized and the data loaded
		if (map && processedStationData.length > 0) {
			const stationIdParam = page.params.stationId;

			untrack(() => {
				// Only select if we haven't already selected it (to avoid loops)
				if (stationIdParam && String(selectedStation.id) !== stationIdParam) {
					const station = processedStationData.find((s) => String(s.id) === stationIdParam);
					if (station) {
						// Ensure map is style-loaded before setting features
						if (map.isStyleLoaded()) {
							handleStationSelection(station.id, [station.longitude, station.latitude]);
						} else {
							map.once('idle', () => {
								handleStationSelection(station.id, [station.longitude, station.latitude]);
							});
						}
					}
				} else if (!stationIdParam && stationSelected) {
					resetStationSelection(true);
					zoomToActiveContext();
				}
			});
		}
	});

	function zoomToActiveContext() {
		if (map) {
			if (activeLine) {
				const lineStations = processedStationData.filter(
					(s) => s.line_ids_array && s.line_ids_array.includes(activeLine.id)
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
					const [minX, minY, maxX, maxY] = turf.bbox(stationPoints);
					map.fitBounds(
						[
							[minX, minY],
							[maxX, maxY]
						],
						{ padding: 50, duration: 1000 }
					);
				} else if (activeRegion) {
					map.fitBounds(activeRegion.bbox, { padding: 50, duration: 1000 });
				}
			} else if (activeRegion) {
				map.fitBounds(activeRegion.bbox, { padding: 50, duration: 1000 });
			} else {
				map.flyTo({ center: mapCenter, zoom: defaultZoom, duration: 1000 });
			}
		}
	}

	let mapInitializedForTabs = false;
	$effect(() => {
		if (map && !mapInitializedForTabs) {
			if (map.isStyleLoaded()) {
				handleTabChange(activeTab);
				mapInitializedForTabs = true;
			} else {
				map.once('idle', () => {
					handleTabChange(activeTab);
					mapInitializedForTabs = true;
				});
			}
		}
	});

	$effect(() => {
		const tabParam = page.url.searchParams.get('tab');
		if (tabParam && tabParam !== activeTab) {
			activeTab = tabParam;
			if (mapInitializedForTabs) {
				handleTabChange(tabParam);
			}
		}
	});

	// --- Data/Map Update Functions ---

	function buildData(config, selectedStation, total = false) {
		// Compute the total once
		if (total) {
			const sum = config.reduce((sum, item) => sum + (selectedStation[item.key] ?? 0), 0);

			return config.map((item) => ({
				label: item.label,
				value: ((selectedStation[item.key] ?? 0) / sum) * 100,
				y: ' '
			}));
		}
		// Map each item to its value
		return config.map((item) => ({
			label: item.label,
			value: selectedStation[item.key] ?? 0,
			y: ' '
		}));
	}

	function updateStationData(id) {
		const station = processedStationData.find((s) => s.id === id);

		if (!station) {
			console.error('Station not found for ID:', id);
			selectedStation = { id: null };
			return;
		}

		selectedStation = station;
		stationBuiltForm = builtFormMetrics.find((station) => station.id === selectedStation.id) || {};
		stationCCcounts =
			completeCommunityCounts.find((station) => station.id === selectedStation.id) || {};
		stationCCpresence =
			completeCommunityPresence.find((station) => station.id === selectedStation.id) || {};

		stationVisitorData = visitorData.find((station) => station.id === selectedStation.id) || {};

		ageData = buildData(age, selectedStation);
		housingData = buildData(housing, selectedStation);
		ownerData = buildData(owner, selectedStation);
		dwellingData = buildData(dwelling, selectedStation);
		bedData = buildData(bed, selectedStation, true);

		//special case for employment data — TODO: include "Other" in preprocessed data
		const totalEmploymentData = selectedStation.EmployeeCount ?? 0;

		employmentData = [
			{
				label: 'Core Amenities',
				value: totalEmploymentData
					? (stationCCcounts['Tier 1 Employment'] / totalEmploymentData) * 100
					: 0,
				y: '⠀'
			},
			{
				label: 'Additional Amenities',
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

	function updateLayerVariable(variable) {
		if (variable === null) {
			selectedVariable = null;
			if (map.getLayer('da')) map.removeLayer('da');
			return;
		}
		selectedVariable = variable;

		// If layer exists, just update it
		if (map.getLayer('da')) {
			const features = map.querySourceFeatures('da_map', {
				sourceLayer: da_map_source.source_layer
			});
			const expression = getD3InterpolateExpression(features, variable);
			if (expression === null) return;
			min = expression.min;
			max = expression.max;
			map.setPaintProperty(
				'da',
				'fill-color',
				expression.expression as mapboxgl.DataDrivenPropertyValueSpecification<string>
			);
		} else {
			if (!map.getSource('da_map')) return;
			// Add the layer if not present
			map.addLayer(
				{
					id: 'da',
					type: 'fill',
					source: 'da_map',
					'source-layer': da_map_source.source_layer,
					paint: {
						'fill-color': 'rgba(0,0,0,0)', // fully transparent
						'fill-opacity': 0
					}
				},
				'greenspace-built-form'
			);
			map.once('idle', () => {
				const features = map.querySourceFeatures('da_map', {
					sourceLayer: da_map_source.source_layer
				});
				const expression = getD3InterpolateExpression(features, variable);
				if (expression === null) return;
				min = expression.min;
				max = expression.max;
				map.setPaintProperty(
					'da',
					'fill-color',
					expression.expression as mapboxgl.DataDrivenPropertyValueSpecification<string>
				);
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
			const circleSource = map.getSource('circle') as mapboxgl.GeoJSONSource;
			circleSource.setData({
				type: 'FeatureCollection',
				features: [circleFeature]
			});
		}
		// Update mask source
		if (map.getSource('circle-mask')) {
			const circleMask = map.getSource('circle-mask') as mapboxgl.GeoJSONSource;
			circleMask.setData({
				type: 'FeatureCollection',
				features: [maskFeature as Feature<Polygon>]
			});
		}
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
			'all-nar',
			'building-permits'
		];

		thematicLayers.forEach((layerId) => {
			if (map.getLayer(layerId)) {
				map.setFilter(layerId, ['within', circlePolygon]);
			}
		});
	}

	function resetStationSelection(skipGoto = false) {
		// remove circle
		if (map && map.getSource('circle')) {
			const circleSource = map.getSource('circle') as mapboxgl.GeoJSONSource;
			circleSource.setData({
				type: 'FeatureCollection',
				features: []
			});
		}
		// remove mask
		if (map && map.getSource('circle-mask')) {
			const circleMaskSource = map.getSource('circle-mask') as mapboxgl.GeoJSONSource;
			circleMaskSource.setData({
				type: 'FeatureCollection',
				features: []
			});
		}

		// reset station
		stationSelected = false;
		selectedStation = { id: null };

		if (!skipGoto) {
			goto(`/transit-map/?tab=${activeTab}`, {
				replaceState: false,
				keepFocus: true,
				noScroll: true
			});
		}

		//reset layer filters
		const thematicLayersToReset = [
			'msn-lowdensity',
			'msn-highdensity',
			'complete-community-amenities',
			'employment-size',
			'all-nar',
			'building-permits'
		];
		thematicLayersToReset.forEach((layerId) => {
			if (map && map.getLayer(layerId)) {
				map.setFilter(layerId, null);
			}
		});
	}

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

			// turf.bbox returns [minX, minY, maxX, maxY]; convert to Mapbox's LngLatBoundsLike: [[minX, minY], [maxX, maxY]]
			const [minX, minY, maxX, maxY] = turf.bbox(featureCollection);

			map.fitBounds(
				[
					[minX, minY],
					[maxX, maxY]
				],
				{ padding: 50, duration: 1000 }
			);
		}
	}

	function selectStop(station) {
		goto(`/transit-map/${station.id}/?tab=${activeTab}`, {
			replaceState: false,
			keepFocus: true,
			noScroll: true
		});
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

	function handleSidebarBack() {
		if (stationSelected) {
			resetStationSelection();
			zoomToActiveContext();
		} else {
			navigateBack();
		}
	}

	// --- Svelte Lifecycle: onMount (Map Initialization) ---
	onMount(async () => {
		// load data
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
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/complete_communities/visitor_data.json'
			);
			visitorData = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error);
		}

		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/development/DevelopmentPotential_Subindex.csv'
			);
			const csvText = await response.text();
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
		} catch (error) {
			console.error('Error fetching DPI data:', error);
		}

		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/development/AllIndicators_Raw.csv'
			);
			const csvText = await response.text();
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
		} catch (error) {
			console.error('Error fetching DPI raw data:', error);
		}

		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/development/BuildingPermitYear.csv'
			);
			const csvText = await response.text();
			buildingPermitYearData = d3.csvParse(csvText, (d: any) => {
				const row: any = {};
				for (const key in d) {
					row[key] = d[key];
				}
				return row;
			});
		} catch (error) {
			console.error('Error fetching building permit year data:', error);
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
	});

	// set active tab from url
	activeTab = page.url.searchParams.get('tab') || 'demographics';

	function handleTabChange(selectedTab) {
		const newUrl = new URL(page.url);
		if (newUrl.searchParams.get('tab') !== selectedTab) {
			newUrl.searchParams.set('tab', selectedTab);
			goto(newUrl, { replaceState: true, keepFocus: true, noScroll: true });
		}

		if (!map || !map.isStyleLoaded()) return;

		map.setPaintProperty('msn-lowdensity', 'line-opacity', 0);
		map.setPaintProperty('msn-highdensity', 'line-opacity', 0);
		map.setPaintProperty('complete-community-amenities', 'icon-opacity', 0);
		map.setPaintProperty('greenspace-built-form', 'fill-opacity', 0);
		map.setPaintProperty('parking-built-form', 'fill-opacity', 0);
		map.setPaintProperty('all-buildings', 'fill-opacity', 0);
		map.setPaintProperty('water-built-form', 'fill-opacity', 0);
		map.setPaintProperty('waterway-built-form', 'line-opacity', 0);
		map.setPaintProperty('employment-size', 'circle-opacity', 0);
		map.setPaintProperty('employment-size', 'circle-stroke-opacity', 0);
		map.setPaintProperty('all-nar', 'circle-opacity', 0);
		map.setPaintProperty('all-nar', 'circle-stroke-opacity', 0);
		map.setPaintProperty('building-permits', 'circle-opacity', 0);
		map.setPaintProperty('building-permits', 'circle-stroke-opacity', 0);
		updateLayerVariable(null);

		switch (selectedTab) {
			case 'demographics':
				break;
			case 'housing':
				map.setPaintProperty('all-nar', 'circle-opacity', 0.8);
				map.setPaintProperty('all-nar', 'circle-stroke-opacity', 1);
				break;
			case 'built-form':
				map.setPaintProperty('greenspace-built-form', 'fill-opacity', 0.8);
				map.setPaintProperty('parking-built-form', 'fill-opacity', 0.8);
				map.setPaintProperty('all-buildings', 'fill-opacity', 0.8);
				map.setPaintProperty('water-built-form', 'fill-opacity', 0.8);
				map.setPaintProperty('waterway-built-form', 'line-opacity', 0.8);
				map.setPaintProperty('building-permits', 'circle-opacity', 0.9);
				map.setPaintProperty('building-permits', 'circle-stroke-opacity', 1);
				break;
			case 'complete-communities':
				map.setPaintProperty('complete-community-amenities', 'icon-opacity', 1);
				map.setPaintProperty('msn-lowdensity', 'line-opacity', 1);
				map.setPaintProperty('msn-highdensity', 'line-opacity', 1);
				break;
			case 'development-potential':
				map.setPaintProperty('all-buildings', 'fill-opacity', 0.8);
				break;
			case 'employment':
				map.setPaintProperty('employment-size', 'circle-opacity', 0.8);
				map.setPaintProperty('employment-size', 'circle-stroke-opacity', 1);
			default:
				break;
		}
	}

	let missingTier1 = $derived(
		stationCCcounts ? TIER_1_AMENITIES.filter((key) => (stationCCcounts[key.label] || 0) === 0) : []
	);

	let missingTier2 = $derived(
		stationCCcounts ? TIER_2_AMENITIES.filter((key) => (stationCCcounts[key.label] || 0) === 0) : []
	);
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<Tabs.Root bind:value={activeTab} onValueChange={(value) => handleTabChange(value)}>
	<div id="content-container">
		<div id="sidebar">
			<Header {isOpen} {initiateTutorial} />
			<Search
				bind:searchTerm
				{regionsData}
				{processedStationData}
				bind:regionsFuse
				bind:linesFuse
				bind:stopsFuse
			/>
			{#if stationSelected || activeLine || activeRegion}
				<div class="flex p-5">
					<CustomButton
						onclick={handleSidebarBack}
						label="Back"
						variant="secondary"
						fullWidth
						icon={false}
						iconBeforeName="mdi:arrow-left"
					/>
				</div>
			{/if}
			{#if stationSelected && !searchTerm}
				<div class="station-details-scroll-container">
					{#if selectedStation && selectedStation.id}
						<StationStatus {selectedStation} />
						<AiDescription isOpen={isAIOpen} {selectedStation} {aiDescriptions} {activeTab} />
						<Tabs.Content value="demographics" class="tab-button">
							<!-- needed to silence LayerCake warnings -->
							{#if activeTab === 'demographics'}
								<DemographicsTab
									{selectedStation}
									{ageData}
									{selectedVariable}
									onSelectVariable={(v) => updateLayerVariable(v)}
								/>
							{/if}
						</Tabs.Content>
						<Tabs.Content value="housing" class="tab-button">
							{#if activeTab === 'housing'}
								<HousingTab
									{selectedStation}
									{ownerData}
									{dwellingData}
									{housingData}
									{bedData}
									{selectedVariable}
									onSelectVariable={(v) => updateLayerVariable(v)}
								/>
							{/if}
						</Tabs.Content>
						<Tabs.Content value="employment" class="tab-button">
							{#if activeTab === 'employment'}
								<EmploymentTab
									{selectedStation}
									{employmentData}
									{selectedVariable}
									onSelectVariable={(v) => updateLayerVariable(v)}
								/>
							{/if}
						</Tabs.Content>
						<Tabs.Content value="built-form" class="tab-button">
							{#if activeTab === 'built-form'}
								<BuiltFormTab
									{selectedStation}
									{stationBuiltForm}
									{stationDpiData}
									{stationDpiRawData}
									{buildingPermitYearData}
									{selectedVariable}
									bind:greenspaceVisible
									bind:waterVisible
									bind:buildingVisible
									bind:parkingVisible
									toggleLayer={(layerId, currentState) => toggleLayer(layerId, currentState)}
									onSelectVariable={(v) => updateLayerVariable(v)}
								/>
							{/if}
						</Tabs.Content>
						<Tabs.Content value="complete-communities" class="tab-button">
							{#if activeTab === 'complete-communities'}
								<CompleteCommunityTab
									{selectedStation}
									{stationCCpresence}
									{stationVisitorData}
									{selectedVariable}
									onSelectVariable={(v) => updateLayerVariable(v)}
								/>
							{/if}
						</Tabs.Content>
						<!-- <Tabs.Content value="development-potential" class="tab-button">
							{#if activeTab === 'development-potential'}
								<DevelopmentPotentialTab {selectedStation} {stationDpiData} />
							{/if}
						</Tabs.Content> -->
					{:else if stationSelected}
						<p>Loading station details...</p>
					{/if}
				</div>
			{:else}
				<SelectRegion
					bind:searchTerm
					{selectLine}
					{selectRegion}
					{selectStop}
					{processedStationData}
					{regionsData}
					{regionsFuse}
					{linesFuse}
					{stopsFuse}
					bind:activeLine
					bind:activeRegion
				/>
			{/if}
		</div>
		<div class="w-full">
			<div class="flex flex-row w-full flex-wrap lg:flex-nowrap">
				<div id="controls" class="flex flex-col w-full">
					<Filters bind:statusFilters bind:technologyFilters />
					<Tabs.List id="tabs" class="w-full grid grid-cols-3 xl:grid-cols-6 gap-1">
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
							value="built-form">Built Form & Development Potential</Tabs.Trigger
						>
						<Tabs.Trigger
							class="rounded-md xl:rounded-none xl:rounded-t-md data-[state=inactive]:bg-zinc-50 data-[state=active]:bg-blue-300"
							value="complete-communities">Complete Communities</Tabs.Trigger
						>
						<!-- <Tabs.Trigger
							class="rounded-md xl:rounded-none xl:rounded-t-md data-[state=inactive]:bg-zinc-50 data-[state=active]:bg-blue-300 text-xs"
							value="development-potential">Development Potential</Tabs.Trigger
						> -->
					</Tabs.List>
				</div>
			</div>
			<MapContainer
				{min}
				{max}
				{missingTier1}
				{missingTier2}
				bind:map
				{mapCenter}
				{defaultZoom}
				{selectedVariable}
				{activeTab}
				{updateLayerVariable}
				{statusFilters}
				{technologyFilters}
				{processedStationData}
				{selectStop}
				{selectRegion}
				{regionsData}
			/>
		</div>
	</div>
</Tabs.Root>

<style>
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

	.station-details-scroll-container {
		flex-grow: 1;
		overflow-y: auto;
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
	}
</style>
