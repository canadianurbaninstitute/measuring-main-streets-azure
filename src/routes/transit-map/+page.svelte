<script>
	import '../styles.css';
	import { afterUpdate, onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import * as turf from '@turf/turf';
	import { BarChart, ColumnChart } from '@onsvisual/svelte-charts';
	import { Tabs } from 'bits-ui';
	import Select from 'svelte-select';
	import Metric from '../lib/ui/Metric.svelte';

	import Footer from '../lib/Footer.svelte';

	import stationData from '../lib/data/stations.json';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	export let map;

	let geocoder;
	let circleDrawn = false;
	let statusFilters = [];
	let technologyFilters = [];

	let selectedStation = {};
	let stationSelected = false;

	let stationAll = stationData.map((item) => {
		return {
			label: item.stop_label + ' [' + item.line_label + ']',
			value: item.id,
			group: item.line_label
		};
	});

	let civic;
	let coordinates;

	let ownerData = [
		{
			label: 'Owner',
			value: 0,
			y: '⠀'
		},
		{
			label: 'Renter',
			value: 0,
			y: '⠀'
		}
	];

	let mobilityData = [
		{
			label: 'Car',
			value: 0,
			y: '⠀'
		},
		{
			label: 'Public Transit',
			value: 0,
			y: '⠀'
		},
		{
			label: 'Active Transit',
			value: 0,
			y: '⠀'
		}
	];

	let housingData = [
		{
			label: 'Pre-1960',
			value: 0
		},
		{
			label: '1961-80',
			value: 0
		},
		{
			label: '1981-00',
			value: 0
		},
		{
			label: 'Post-2000',
			value: 0
		}
	];

	let demoData = [
		{
			label: 'Visible Minority',
			value: 0
		},
		{
			label: 'Recent Immigrant',
			value: 0
		},
		{
			label: 'Indigenous',
			value: 0
		}
	];

	let dwellingData = [
		{
			label: 'Detached',
			value: 0,
			y: '⠀'
		},
		{
			label: 'Semi-Detached',
			value: 0,
			y: '⠀'
		},
		{
			label: 'Row',
			value: 0,
			y: '⠀'
		},
		{
			label: 'Duplex',
			value: 0,
			y: '⠀'
		},
		{
			label: 'Apt >5',
			value: 0,
			y: '⠀'
		},
		{
			label: 'Apt <5',
			value: 0,
			y: '⠀'
		}
	];

	let ageData = [
		{
			label: '0-19',
			value: 0,
			y: '⠀'
		},
		{
			label: '20-64',
			value: 0,
			y: '⠀'
		},
		{
			label: '65+',
			value: 0,
			y: '⠀'
		}
	];

	function updateStationData(id) {

		selectedStation = stationData.find((station) => station.id === id);

		console.log(selectedStation);

		civic =
			selectedStation.arts_and_culture +
			selectedStation.education +
			selectedStation.government_community_services +
			selectedStation.healthcare_facilities +
			selectedStation.recreation;

		ageData = [
			{ label: '0-19', value: selectedStation.age_0_19, y: '⠀' },
			{ label: '20-64', value: selectedStation.age_20_64, y: '⠀' },
			{ label: '65+', value: selectedStation.age_65_over, y: '⠀' }
		];

		console.log(ageData);

		mobilityData = [
			{ label: 'Car', value: selectedStation.mobility_car, y: '⠀' },
			{ label: 'Public Transit', value: selectedStation.mobility_public_transit, y: '⠀' },
			{ label: 'Active Transit', value: selectedStation.mobility_active_transit, y: '⠀' }
		];

		housingData = [
			{ label: 'Pre-1960', value: selectedStation.housing_pre1960 },
			{ label: '1961-80', value: selectedStation.housing_1961_80 },
			{ label: '1981-00', value: selectedStation.housing_1981_00 },
			{ label: 'Post-2000', value: selectedStation.housing_after2000 }
		];

		dwellingData = [
			{ label: 'Detached', value: selectedStation.single_detached, y: '⠀' },
			{ label: 'Semi-Detached', value: selectedStation.row_house, y: '⠀' },
			{ label: 'Row', value: selectedStation.semi_detached, y: '⠀' },
			{ label: 'Duplex', value: selectedStation.duplex, y: '⠀' },
			{ label: 'Apt >5', value: selectedStation.apt_more_5, y: '⠀' },
			{ label: 'Apt <5', value: selectedStation.apt_less_5, y: '⠀' }
		];

		ownerData = [
			{ label: 'Owner', value: selectedStation.owners, y: '⠀' },
			{ label: 'Renter', value: selectedStation.renters, y: '⠀' }
		];

		demoData = [
			{ label: 'Visible Minority', value: selectedStation.visible_minority },
			{ label: 'Recent Immigrant', value: selectedStation.immigrants_non_permanent_residents },
			{ label: 'Indigenous', value: selectedStation.indigenous }
		];
	}

	// Extract the station selection logic into a reusable function
	function handleStationSelection(stationId, coordinates) {

		updateStationData(stationId);

		stationSelected = true;

		const radiusInKilometers = 0.8;

		// Create a GeoJSON circle feature with an 800m radius using Turf.js
		const circleFeature = turf.circle(coordinates, radiusInKilometers, {
			steps: 128,
			units: 'kilometers'
		});

		// Update the circle data in the source
		map.getSource('circle').setData({
			type: 'FeatureCollection',
			features: [circleFeature]
		});

		circleDrawn = true;

		// Zoom and center to the selected station
		map.flyTo({
			center: coordinates,
			zoom: 14.5,
			duration: 1000
		});

		// Use 'within' filter to restrict the visibility of layers to the circle area
		const circlePolygon = circleFeature.geometry;
		map.setFilter('msn-lowdensity', ['within', circlePolygon]);
		map.setFilter('msn-highdensity', ['within', circlePolygon]);
		map.setFilter('civic-infra', ['within', circlePolygon]);
		map.setFilter('business', ['within', circlePolygon]);
	}

	// Extract the reset logic into a reusable function
	function resetStationSelection() {
		map.getSource('circle').setData({
			type: 'FeatureCollection',
			features: []
		});
		circleDrawn = false;
		stationSelected = false;
	}

	// Add the handle select function
	function handleSelect(event) {
		if (event.detail) {
			const stationId = event.detail.value;
			const selectedStation = stationData.find(station => station.id === stationId);
			const coordinates = [selectedStation.longitude, selectedStation.latitude];
			handleStationSelection(stationId, coordinates);
		} else {
			// Handle clear selection
			resetStationSelection();
		}
	}

	onMount(() => {
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

		// Geocoder Search

		map.on('load', () => {
			geocoder = new MapboxGeocoder({
				accessToken: mapboxgl.accessToken,
				countries: 'ca',
				proximity: 'ip',
				types: 'address, region, country, postcode, district, place, locality, neighborhood',
				language: 'en, fr',
				marker: true,
				zoom: 12,
				marker: {
					color: '#0098D6'
				},
				placeholder: 'Search for a place',
				mapboxgl: mapboxgl
			});

			geocoder.on('results', function (results) {
				document.getElementById('resetButton').style.display = 'flex'; // Show the button
			});

			//map.addControl(geocoder, 'top-left');

			map.addSource('circle', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: []
				}
			});

			// Add a layer to display the circle
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

			// Event listener for clicks on the transit-stations layer
			map.on('click', 'transit-stations', (e) => {
				const stationId = e.features[0].properties.id;
				const coordinates = e.features[0].geometry.coordinates;
				handleStationSelection(stationId, coordinates);
			});

			// Event listener for clicks outside stations
			map.on('click', (e) => {
				const features = map.queryRenderedFeatures(e.point, { layers: ['transit-stations'] });
				if (circleDrawn && features.length === 0) {
					resetStationSelection();
				}
			});
		});

		// Create the popup instance
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

		// Handle line popups
		// map.on('mousemove', 'transit-lines', (e) => {
		// 	if (e.features.length > 0) {
		// 		const coordinates = e.lngLat;
		// 		const name = e.features[0].properties.name;

		// 		popup2
		// 			.setLngLat(coordinates)
		// 			.setHTML(
		// 				`
        //         <span class="label-name">${name}</span>
        //     `
		// 			)
		// 			.addTo(map);
		// 	}
		// });

		// Remove popups when leaving features
		map.on('mouseleave', 'transit-stations', () => {
			popup.remove();
		});

		map.on('mouseleave', 'transit-lines', () => {
			popup2.remove();
		});

		// Reset cursor
		map.on('mouseleave', ['transit-stations', 'transit-lines'], () => {
			map.getCanvas().style.cursor = '';
		});
	});

	function applyFilters() {
		const filterConditions = [];

		// Filter by status if any statuses are selected
		if (statusFilters.length) {
			filterConditions.push([
				'any',
				...statusFilters.map((status) => [
					'case',
					['!=', ['index-of', status, ['get', 'status']], -1], // Check if the status exists in the string
					true, // Include if found
					false // Exclude if not found
				])
			]);
		}

		// Filter by technology if any technologies are selected
		if (technologyFilters.length) {
			filterConditions.push([
				'any',
				...technologyFilters.map((tech) => [
					'case',
					['!=', ['index-of', tech, ['get', 'technology']], -1], // Check if the technology exists in the string
					true, // Include if found
					false // Exclude if not found
				])
			]);
		}

		// Combine the conditions for each layer
		const combinedFilter = filterConditions.length ? ['all', ...filterConditions] : true;

		const layers = ['transit-stations', 'transit-lines'];

		// Apply the combined filter to each relevant layer
		layers.forEach((layer) => {
			if (map.getLayer(layer)) {
				map.setFilter(layer, combinedFilter);
			}
		});
	}

	function handleTabChange(selectedTab) {
		// Show specific layers based on the selected tab
		map.setPaintProperty('msn-lowdensity', 'line-opacity', 0);
		map.setPaintProperty('msn-highdensity', 'line-opacity', 0);
		map.setPaintProperty('building-footprint', 'fill-extrusion-opacity', 0);
		map.setPaintProperty('greenspace', 'fill-opacity', 0);
		map.setPaintProperty('civic-infra', 'circle-opacity', 0);
		map.setPaintProperty('civic-infra', 'circle-stroke-opacity', 0);
		map.setPaintProperty('business', 'circle-opacity', 0);
		map.setPaintProperty('business', 'circle-stroke-opacity', 0);

		switch (selectedTab) {
			case 'demographics':
				break;
			case 'housing':
				console.log('housing');
				break;
			case 'built-form':
				map.flyTo({
					center: coordinates,
					zoom: 14.5, // Adjust the zoom level as needed
					duration: 1000 // Animation duration in milliseconds
				});

				map.setPaintProperty('msn-lowdensity', 'line-opacity', 1);
				map.setPaintProperty('msn-highdensity', 'line-opacity', 1);
				map.setPaintProperty('building-footprint', 'fill-extrusion-opacity', 0.6);
				map.setPaintProperty('greenspace', 'fill-opacity', 1);

				break;
			case 'business':
				map.setPaintProperty('business', 'circle-opacity', 1);
				map.setPaintProperty('business', 'circle-stroke-opacity', 1);
				break;
			case 'civic':
				map.setPaintProperty('civic-infra', 'circle-opacity', 1);
				map.setPaintProperty('civic-infra', 'circle-stroke-opacity', 1);
				break;
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
	<link rel="preconnect" href="https://rsms.me/">
	<link rel="stylesheet" href="https://rsms.me/inter/inter.css">
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
	<div class="select-wrapper">
		<Select
			items={stationAll}
			on:input={handleSelect}
			on:clear={handleSelect}
			placeholder="Search for a station"
			clearable={true}
			--border-radius="0"
			--border="1px solid #eee"
			--height="60px"
		/>
	</div>
	<div id="filter-container">

		<h4>Filter</h4>
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
	
	
	<div id="sidebar" class:active={stationSelected}>
		{#if stationSelected}
			<h2>{selectedStation.stop_label}</h2>
			<h4>{selectedStation.line_label}</h4>

			<div class="tag-container">
				{#each selectedStation.status?.split(', ') || [] as status}
					<div class="tag">{status}</div>
				{/each}

				{#each selectedStation.technology?.split(', ') || [] as technology}
					<div class="tag">{technology}</div>
				{/each}
			</div>

			<hr />

			<Tabs.Root
				value="demographics"
				id="tab-container"
				onValueChange={(value) => handleTabChange(value)}
			>
				<Tabs.List class="tab-container">
					<Tabs.Trigger value="demographics">Demographics</Tabs.Trigger>
					<Tabs.Trigger value="housing">Housing</Tabs.Trigger>
					<Tabs.Trigger value="built-form">Built Form</Tabs.Trigger>
					<Tabs.Trigger value="business">Business</Tabs.Trigger>
					<!-- <Tabs.Trigger value="civic">Civic Infrastructure</Tabs.Trigger> -->
				</Tabs.List>
				<Tabs.Content value="demographics" class="tab-button">
					<div class="tab-content">
						<h4>Population: {selectedStation.population}</h4>
						<h4>Households: {selectedStation.households}</h4>
						<h4>Average Employment Income: {selectedStation.average_employment_income}</h4>
						<hr />
						<div class="chart-container">
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
							<BarChart
								colors={['#002a41', '#0098D6', '#db3069']}
								data={mobilityData}
								zKey="label"
								xKey="value"
								yKey="y"
								title="Mobility"
								xMax="100"
								mode="stacked"
								legend="true"
								xSuffix="%"
								padding={{ top: 0, bottom: 20, left: 0, right: 20 }}
							/>
							<BarChart
								colors={['#002a41']}
								data={demoData}
								xKey="value"
								yKey="label"
								title="Population (%)"
								yMax="100"
								xSuffix="%"
								padding={{ top: 0, bottom: 20, left: 60, right: 20 }}
							/>
						</div>
					</div>
				</Tabs.Content>
				<Tabs.Content value="housing" class="tab-button">
					<div class="tab-content">
						<h4>Total Dwellings: {selectedStation.dwellings}</h4>
						<hr />
						<div class="chart-container">
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
				</Tabs.Content>
				<Tabs.Content value="built-form" class="tab-button">
					<div class="tab-content">
						<h4>Green Space: {selectedStation.greenspace} sq. meters</h4>
						<hr />
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
						<div />
					</div></Tabs.Content
				>
				<Tabs.Content value="business" class="tab-button">
					<div class="tab-content">
						<h4>Businesses: {selectedStation.total_businesses}</h4>
						<h4>Employment: {selectedStation.total_employment}</h4>
					</div>
				</Tabs.Content>
				<Tabs.Content value="civic" class="tab-button">
					<div class="tab-content">
						<h4>Civic Infrastructure: {civic}</h4>
					</div>
				</Tabs.Content>
			</Tabs.Root>

			<hr />
		{/if}
	</div>

	<div id="map-container">
		<div id="map" />
	</div>
</div>
<Footer />

<style>
	p {
		margin-top: 0;
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
		/* border-top: 1px solid #eee; */
	}


	.select-wrapper {
		width: 100%;
		margin-bottom: 1em;
	}

	#sidebar {
		width: 100%;
		display: flex;
		flex-direction: column;
		padding: 1em;
		overflow-y: scroll;
		overflow-x: hidden;
		border-top: 1px solid #eee;
	}

	#map-container {
		width: 100%;
	}

	#map {
		height: 50vh;
		width: 100%;
	}

	h2,
	h4 {
		margin: 0;
		padding: 0.2em 0 0.2em 0;
	}

	.tag {
		display: flex;
		justify-content: center;
		padding: 0.5em;
		border: 2px solid #eee;
		border-radius: 10em;
	}

	.tag-container {
		display: flex;
		flex-direction: row;
		gap: 0.5em;
		width: 100%;
		padding: 0.5em 0 0 0;
	}

	#filter-container {
		display: flex;
		flex-direction: row;
		gap: 1em;
		padding: 1em;
		height: 60px;
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
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	.tab-content {
		padding: 1em 0 1em 0;
	}

	@media only screen and (min-width: 768px) {
		#controls {
			display: flex;
			flex-direction: row;
			align-items: flex-start;
		}

		.select-wrapper {
			width: 400px;
			margin-bottom: 0;
		}

		#content-container {
			position: relative;
		}

		#sidebar {
			position: absolute;
			left: -400px; /* Starting position off-screen */
			top: 0;
			width: 400px;
			height: 100vh;
			background: white;
			transition: left 0.3s ease;
			z-index: 1;
			box-shadow: 2px 0 5px rgba(0,0,0,0.1);
			border-top: none;
		}

		#sidebar.active {
			left: 0;
		}

		#map-container {
			width: 100%;
			height: calc(100vh - 120px); /* Adjust based on your controls height */
		}

		#map {
			height: 100%;
		}

		#filter-container {
			flex: 1;
			background: white;
			padding: 1em;
		}
	}

	hr {
		border: 0.5px solid #eee;
		width: 100%;
	}
</style>