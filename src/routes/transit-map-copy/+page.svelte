<script lang="ts">
	// --- Imports ---
	import { BarChart } from '@onsvisual/svelte-charts';
	import * as turf from '@turf/turf';
	import { Tabs } from 'bits-ui';
	import Fuse from 'fuse.js';
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	import Footer from '../lib/ui/Footer.svelte';
	import TransitMetric from '../lib/ui/TransitMetric.svelte';
	import '../styles.css';
	// --- Data Imports ---
	import type { Station } from '../lib/data/transitdata/stations';
	import stationRawData from '../lib/data/transitdata/stations.json';
	import transitRegionsRawData from '../lib/data/transitdata/transit-regions.json';

	// --- Mapbox Access Token ---
	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	// --- Reactive/Exported Variables ---
	export let map;

	// --- UI State Variables ---
	let circleDrawn = false;
	let statusFilters = [];
	let technologyFilters = [];

	let selectedStation: Station = {};
	let stationSelected = false;
	let regionsData = [];
	let processedStationData = [];
	let searchTerm = '';
	let activeRegion = null;
	let activeLine = null;
	let sidebarDisplayItems = [];

	// --- Fuse.js Search Instances ---
	let regionsFuse;
	let linesFuse;
	let stopsFuse;

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

	// --- Static Chart Data (TODO: Add to stations file) ---
	let employmentData = [
		{ label: 'Civic Infrastructure', value: 20, y: '⠀' },
		{ label: 'Business', value: 20, y: '⠀' },
		{ label: 'Other', value: 60, y: '⠀' }
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
			selectedStation = {};
			return;
		}

		selectedStation = station;

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

		ownerData = [
			{ label: 'Owner', value: selectedStation.Owned, y: '⠀' },
			{ label: 'Renter', value: selectedStation.Rented, y: '⠀' }
		];

		businessData = [
			{ label: 'Food and Drink', value: selectedStation['Food and Drink'], y: '⠀' },
			{ label: 'Retail', value: selectedStation['Retail'], y: '⠀' },
			{ label: 'Local Services', value: selectedStation['Services and Other'], y: '⠀' }
		];

		civicData = [
			{ label: 'Arts and Culture', value: selectedStation['Arts and Culture'], y: '⠀' },
			{
				label: 'Government and Community Services',
				value: selectedStation['Government and Community Services'],
				y: '⠀'
			},
			{ label: 'Recreation', value: selectedStation['Recreation Facilities'], y: '⠀' },
			{ label: 'Healthcare', value: selectedStation['Health and Care Facilities'], y: '⠀' },
			{ label: 'Education', value: selectedStation['Education'], y: '⠀' }
		];
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

		// if the circle feature exists, update it and set variable to be true
		if (map.getSource('circle')) {
			map.getSource('circle').setData({
				type: 'FeatureCollection',
				features: [circleFeature]
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
		const thematicLayers = ['msn-lowdensity', 'msn-highdensity', 'civic-infra', 'business'];

		thematicLayers.forEach((layerId) => {
			if (map.getLayer(layerId)) {
				map.setFilter(layerId, ['within', circlePolygon]);
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
		circleDrawn = false;

		// reset station
		stationSelected = false;
		selectedStation = {};

		//reset layer filters
		const thematicLayersToReset = [
			'msn-lowdensity',
			'msn-highdensity',
			'civic-infra',
			'business',
			'employment-size'
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
		if (!map) return;
		resetStationSelection();

		activeLine = line;

		// find which line is selected on the map based on id
		const selectedLine = map.queryRenderedFeatures({
			layers: ['transit-lines'],
			filter: ['==', 'line_id', activeLine.id]
		});

		// if there is a line selected, zoom to it based on calculated bbox
		if (selectedLine.length > 0) {
			const featureCollection = {
				type: 'FeatureCollection',
				features: selectedLine
			};

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
			map.flyTo({ center: [-89, 58], zoom: 3.3, duration: 1000 });
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
	onMount(() => {
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

		// add map

		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/canadianurbaninstitute/cm36ab0r5003q01qs48e25ng3?fresh=true',
			center: [-89, 58],
			zoom: 3.3,
			maxZoom: 15.5,
			minZoom: 2,
			scrollZoom: true,
			attributionControl: false
		});

		map.addControl(new mapboxgl.NavigationControl(), 'top-right');

		map.addControl(
			new mapboxgl.AttributionControl({
				customAttribution: 'Canadian Urban Institute'
			})
		);

		// add circle source and layer
		map.on('load', () => {
			map.addSource('circle', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: []
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

		map.on('mouseenter', ['transit-stations', 'transit-lines'], () => {
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

		map.on('mouseleave', 'transit-stations', () => {
			popup.remove();
		});

		map.on('mouseleave', 'transit-lines', () => {
			popup2.remove();
		});

		map.on('mouseleave', ['transit-stations', 'transit-lines'], () => {
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
		map.setPaintProperty('greenspace', 'fill-opacity', 0);
		map.setPaintProperty('bus-stops', 'circle-opacity', 0);
		map.setPaintProperty('civic-infra', 'circle-opacity', 0);
		map.setPaintProperty('civic-infra', 'circle-stroke-opacity', 0);
		map.setPaintProperty('business', 'circle-opacity', 0);
		map.setPaintProperty('business', 'circle-stroke-opacity', 0);
		map.setPaintProperty('employment-size', 'circle-opacity', 0);
		map.setPaintProperty('employment-size', 'circle-stroke-opacity', 0);

		switch (selectedTab) {
			case 'demographics':
				break;
			case 'housing':
				break;
			case 'built-form':
				map.flyTo({
					center:
						selectedStation.longitude && selectedStation.latitude
							? [selectedStation.longitude, selectedStation.latitude]
							: map.getCenter(),
					zoom: selectedStation.longitude && selectedStation.latitude ? 14.5 : map.getZoom(),
					duration: 1000
				});

				map.setPaintProperty('greenspace', 'fill-opacity', 0.8);
				map.setPaintProperty('bus-stops', 'circle-opacity', 1);

				break;
			case 'business':
				map.setPaintProperty('business', 'circle-opacity', 1);
				map.setPaintProperty('business', 'circle-stroke-opacity', 1);
				map.setPaintProperty('msn-lowdensity', 'line-opacity', 1);
				map.setPaintProperty('msn-highdensity', 'line-opacity', 1);
				break;
			case 'civic':
				map.setPaintProperty('civic-infra', 'circle-opacity', 1);
				map.setPaintProperty('civic-infra', 'circle-stroke-opacity', 1);
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
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" rel="stylesheet" />
	<script
		src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.min.js"
	></script>
	<link
		rel="stylesheet"
		href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.css"
		type="text/css"
	/>
</svelte:head>

<div class="hero">
	<div id="title">
		<h1>Transit Map</h1>
	</div>
	<p>
		This is a map of all existing, under construction and planned transit lines in Canada. Search
		for a place or navigate the map using the controls; and then click on a transit station to see
		information associated with it in the panel on the left.
	</p>
</div>

<div id="controls">
	<div class="sidebar-top-controls">
		<input
			type="text"
			bind:value={searchTerm}
			placeholder="Search for a region, line, or station..."
			class="search-input"
		/>
	</div>
	<div id="filter-container">
		<div class="filter-group">
			<h4>Status:</h4>
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
			<h4>Technology:</h4>
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
</div>
<div id="content-container">
	<div id="sidebar">
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
							<h2>{selectedStation.stop_label}</h2>
						</div>
						<h4>{selectedStation.line_display_name}</h4>

						<div id="tag-container">
							<div class="tag-list">
								<h5>Status:</h5>
								{#each selectedStation.status?.split(', ') || [] as status}
									<div class="tag">{status}</div>
								{/each}
							</div>
							<div class="tag-list">
								<h5>Technology:</h5>
								{#each selectedStation.technology?.split(', ') || [] as technology}
									<div class="tag">{technology}</div>
								{/each}
							</div>
						</div>
					</div>

					<Tabs.Root
						orientation="vertical"
						value="demographics"
						onValueChange={(value) => handleTabChange(value)}
					>
						<Tabs.List class="flex-wrap">
							<Tabs.Trigger value="demographics">Demographics</Tabs.Trigger>
							<Tabs.Trigger value="housing">Housing</Tabs.Trigger>
							<Tabs.Trigger value="built-form">Built Form</Tabs.Trigger>
							<Tabs.Trigger value="business">Business</Tabs.Trigger>
							<Tabs.Trigger value="civic">Civic Infrastructure</Tabs.Trigger>
							<Tabs.Trigger value="employment">Employment</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content value="demographics" class="tab-button">
							<div class="tab-content">
								<div class="metric-container">
									<TransitMetric
										label={'Population'}
										value={selectedStation.TotalPopulation}
										icon={'fluent:people-20-filled'}
									/>
									<TransitMetric
										label={'Households'}
										value={selectedStation.TotalHouseholds}
										icon={'mdi:house'}
									/>
								</div>
								<TransitMetric
									label={'Average Employment Income'}
									value={selectedStation.AverageEmploymentIncome}
									icon={'mdi:wallet'}
								/>
								<div class="metric-container">
									<TransitMetric
										label={'Visible Minority'}
										value={selectedStation.VisibleMinorityTotal + '%'}
										icon={'mdi:people'}
									/>
									<TransitMetric
										label={'Immigrants'}
										value={selectedStation.TotalImmigrant + '%'}
										icon={'mdi:globe'}
									/>
									<TransitMetric
										label={'Indigenous'}
										value={selectedStation.IndigenousIdentity + '%'}
										icon={'mdi:people'}
									/>
								</div>
								<TransitMetric
									label={'University Degree'}
									value={selectedStation.UniversityDegree + '%'}
									icon={'mdi:school'}
								/>
								<div class="chart-container">
									<div class="chart">
										<BarChart
											colors={['#002a41', '#0098D6', '#db3069']}
											data={ageData}
											zKey="label"
											xKey="value"
											yKey="y"
											title="Age"
											xMax="100"
											mode="stacked"
											legend="true"
											xSuffix="%"
											padding={{ top: 0, bottom: 20, left: 0, right: 20 }}
										/>
									</div>
								</div>
							</div>
						</Tabs.Content>
						<Tabs.Content value="housing" class="tab-button">
							<div class="tab-content">
								<div class="metric-container">
									<TransitMetric
										label={'Total Dwellings'}
										value={selectedStation.dwellings}
										icon={'mdi:house'}
									/>
									<TransitMetric
										label={'Average Value'}
										value={selectedStation.HouseValue}
										icon={'mdi:dollar'}
									/>
									<TransitMetric
										label={'Average Rent'}
										value={selectedStation.MonthlyRent}
										icon={'mdi:dollar'}
									/>
								</div>
								<div class="chart-container">
									<div class="chart">
										<BarChart
											colors={['#002a41', '#0098D6']}
											data={ownerData}
											zKey="label"
											xKey="value"
											yKey="y"
											title="Owners/Renters"
											xMax="100"
											mode="stacked"
											legend="true"
											xSuffix="%"
											padding={{ top: 0, bottom: 20, left: 0, right: 20 }}
										/>
									</div>
									<div class="chart">
										<BarChart
											colors={['#002a41', '#0098D6', '#F35D00', '#db3069', '#8A4285', '#43B171']}
											data={dwellingData}
											zKey="label"
											xKey="value"
											yKey="y"
											title="Dwelling Type"
											xMax="100"
											mode="stacked"
											legend="true"
											xSuffix="%"
											padding={{ top: 0, bottom: 20, left: 0, right: 20 }}
										/>
									</div>
									<div class="chart">
										<BarChart
											colors={['#002a41']}
											data={housingData}
											xKey="value"
											yKey="label"
											title="Housing Construction Year"
											yMax="100"
											xSuffix="%"
											padding={{ top: 0, bottom: 20, left: 60, right: 20 }}
										/>
									</div>
								</div>
							</div>
						</Tabs.Content>
						<Tabs.Content value="built-form" class="tab-button">
							<div class="tab-content">
								<div class="metric-container">
									<TransitMetric
										label={'Green Space'}
										value={selectedStation.GreenspaceArea + 'sq. m'}
										icon={'mdi:tree'}
									/>
									<TransitMetric
										label={'Population Density'}
										value={selectedStation.PopulationDensity}
										icon={'mdi:people'}
									/>
									<TransitMetric
										label={'Employment Density'}
										value={selectedStation.EmploymentDensity}
										icon={'mdi:briefcase'}
									/>
								</div>
								<div></div>
							</div></Tabs.Content
						>
						<Tabs.Content value="business" class="tab-button">
							<div class="tab-content">
								<div class="metric-container">
									<TransitMetric
										label={'Main Street Businesses'}
										value={selectedStation.BusinessCount}
										icon={'mdi:shop'}
									/>
									<TransitMetric
										label={'Independent Business Index'}
										value={selectedStation.bii}
										icon={'mdi:score'}
									/>
								</div>
								<div class="chart-container">
									<div class="chart">
										<BarChart
											colors={['#43b171', '#F13737', '#2a5cac']}
											data={businessData}
											zKey="label"
											xKey="value"
											yKey="y"
											title="Main Street Business"
											xMax="100"
											mode="stacked"
											legend="true"
											xSuffix="%"
											padding={{ top: 0, bottom: 20, left: 0, right: 20 }}
										/>
									</div>
								</div>
							</div>
						</Tabs.Content>
						<Tabs.Content value="civic" class="tab-button">
							<div class="tab-content">
								<TransitMetric
									label={'Civic Infrastructure Loations'}
									value={selectedStation.CivicCount}
									icon={'mdi:museum'}
								/>
								<div class="chart-container">
									<div class="chart">
										<BarChart
											colors={['#DB3069', '#F45D01', '#8A4285', '#33AED7', '#43B171']}
											data={civicData}
											zKey="label"
											xKey="value"
											yKey="y"
											title="Civic Infrastructure"
											xMax="100"
											mode="stacked"
											legend="true"
											xSuffix="%"
											padding={{ top: 0, bottom: 20, left: 0, right: 20 }}
										/>
									</div>
								</div>
							</div>
						</Tabs.Content>
						<Tabs.Content value="employment" class="tab-button">
							<div class="tab-content">
								<TransitMetric
									label={'Total Employment'}
									value={selectedStation.EmployeeCount}
									icon={'mdi:briefcase'}
								/>
								<div class="chart-container">
									<div class="chart">
										<BarChart
											colors={['#db3069', '#0098D6', '#b0b0b0']}
											data={employmentData}
											zKey="label"
											xKey="value"
											yKey="y"
											title="Employment Mix"
											xMax="100"
											mode="stacked"
											legend="true"
											xSuffix="%"
											padding={{ top: 0, bottom: 20, left: 0, right: 20 }}
										/>
									</div>
								</div>
							</div>
						</Tabs.Content>
					</Tabs.Root>
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
								<button
									type="button"
									on:click={() => selectRegionFromSearch(item)}
									class="nav-item region-item"
								>
									{item.name}
								</button>
							{/each}
						</ul>
					{/if}
					{#if searchResults.lines.length > 0}
						<div class="nav-section-header">Lines</div>
						<ul class="nav-list">
							{#each searchResults.lines as item (item.id)}
								<button
									type="button"
									on:click={() => selectLineFromSearch(item)}
									class="nav-item line-item"
								>
									{item.name} <span class="context">({item.regionName})</span>
								</button>
							{/each}
						</ul>
					{/if}
					{#if searchResults.stops.length > 0}
						<div class="nav-section-header">Stops</div>
						<ul class="nav-list">
							{#each searchResults.stops as item (item.id)}
								<button
									type="button"
									on:click={() => selectStopFromSearch(item)}
									class="nav-item stop-item"
								>
									{item.stop_label} <span class="context">({item.line_display_name || 'N/A'})</span>
								</button>
							{/each}
						</ul>
					{/if}
					{#if searchResults.regions.length === 0 && searchResults.lines.length === 0 && searchResults.stops.length === 0}
						<p class="no-results">No results found.</p>
					{/if}
				{:else}
					<nav>
						<ul class="nav-list">
							{#each sidebarDisplayItems as item (item.id || item.stop_label)}
								{#if item.type === 'region'}
									<li>
										<button
											type="button"
											on:click={() => selectRegion(item)}
											class="nav-item region-item"
										>
											{item.name}
										</button>
									</li>
								{:else if item.type === 'line'}
									<li>
										<button
											type="button"
											on:click={() => selectLine(item)}
											class="nav-item line-item">{item.name}</button
										>
									</li>
								{:else if item.type === 'stop'}
									<li>
										<button
											type="button"
											on:click={() => selectStop(item)}
											class="nav-item stop-item"
										>
											{item.stop_label}
										</button>
									</li>
								{/if}
							{/each}
						</ul>
					</nav>
				{/if}
			</div>
		{/if}
		{#if stationSelected || activeLine || activeRegion}
			<button on:click={handleSidebarBack} class="back-button">← Back</button>
		{/if}
	</div>

	<div id="map-container">
		<div id="map"></div>
	</div>
</div>
<Footer />

<style>
	p {
		margin-top: 0;
	}

	.metric-container {
		display: flex;
		flex-direction: row;
		gap: 0.5em;
	}

	.chart {
		border: 1px solid #eee;
		padding: 1em;
		border-radius: 0.5em;
	}

	#title {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1em;
	}

	#map {
		height: 50vh;
		width: 100%;
		position: relative;
		order: -1;
	}

	#controls {
		display: flex;
		flex-direction: column;
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

	.sidebar-top-controls {
		padding: 1em;
		width: 100%;
		border: 1px solid #eee;
		width: 35%;
	}

	.navigation-scroll-container,
	.station-details-scroll-container {
		flex-grow: 1;
		overflow-y: auto;
	}

	.station-details-scroll-container > div {
		padding: 1em;
	}

	#map-container {
		width: 100%;
	}

	#map {
		height: 50vh;
		width: 100%;
	}

	#station-container {
		border-bottom: 1px solid #eee;
		padding: 1em;
		margin: 0 0 1em 0;
	}

	h2,
	h4,
	h5 {
		margin: 0;
		padding: 0.2em 0 0.2em 0;
	}

	h2 {
		font-weight: 600;
		text-transform: uppercase;
		font-family: 'Inter', sans-serif;
	}

	.tag {
		display: flex;
		justify-content: center;
		padding: 0.5em;
		border: 1px solid #ddd;
		border-radius: 10em;
		font-size: 0.8em;
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
		border-bottom: 1px solid #eee;
		border-top: 1px solid #eee;
	}

	.filter-group {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1em;
	}

	.chart-container {
		margin: 1em 0 1em 0;
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	.tab-content {
		padding: 1em;
	}

	.search-input {
		width: 100%;
		padding: 1em;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 0.9em;
	}

	.back-button {
		padding: 8px 12px;
		background-color: #f0f0f0;
		border: 1px solid #ddd;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.9em;
		margin: 1em;
	}

	.back-button:hover {
		background-color: #e0e0e0;
	}

	.nav-list {
		list-style-type: none;
		margin: 0;
		padding: 0;
	}

	.nav-item {
		width: 100%;
		text-align: left;
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

	@media only screen and (min-width: 728px) {
		#controls {
			display: flex;
			flex-direction: row;
			align-items: stretch;
		}

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
			width: 65%;
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

		.filter-group h4 {
			white-space: nowrap;
		}

		:global [data-tabs-list] {
			padding: 0 1em 0 1em;
			display: grid;
			width: 100%;
			grid-template-columns: 1fr 1fr 1fr;
			grid-gap: 2px;
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
