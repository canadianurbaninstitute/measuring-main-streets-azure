<script>
	import '../styles.css';
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import * as turf from '@turf/turf';
	import {BarChart, ColumnChart } from '@onsvisual/svelte-charts';

	import Footer from '../lib/Footer.svelte';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	export let map;

	let geocoder;
	let circleDrawn = false;
	let statusFilters = [];
	let technologyFilters = [];


	let stationData = []; // Store station data from stations.json
	let selectedStation = {};
	let stationSelected = false;

	let ownerData = [
    {
        "label": "Owner",
        "value": 0,
        "y": "⠀"
    },
    {
        "label": "Renter",
        "value": 0,
        "y": "⠀"
    }
	];

	let mobilityData = [
    {
        "label": "Car",
        "value": 0,
        "y": "⠀"
    },
    {
        "label": "Public Transit",
        "value": 0,
        "y": "⠀"
    },
    {
        "label": "Active Transit",
        "value": 0,
        "y": "⠀"
    }
	];

	let housingData = [
    {
        "label": "Pre-1960",
        "value": 0
    },
    {
        "label": "1961-80",
        "value": 0
    },
    {
        "label": "1981-00",
        "value": 0
    },
    {
        "label": "Post-2000",
        "value": 0
    }
	];

	let dwellingData = [
    {
        "label": "Detached",
        "value": 0,
		"y": '⠀'
    },
    {
        "label": "Semi-Detached",
        "value": 0,
		"y": '⠀'
    },
	{
        "label": "Row",
        "value": 0,
		"y": '⠀'
    },
    {
        "label": "Apt >5",
        "value": 0,
		"y": '⠀'
    },
    {
        "label": "Apt <5",
        "value": 0,
		"y": '⠀'
    },
    {
        "label": "Duplex",
        "value": 0,
		"y": '⠀'
    }
	];

	let ageData = [
		{
			"label": "0-19",
			"value": 0,
			"y": '⠀'
		},
		{
			"label": "20-64",
			"value": 0,
			"y": '⠀'
		},
		{
			"label": "65+",
			"value": 0,
			"y": '⠀'
		}
	];


	function updateStationData(id) {
		selectedStation = stationData.find(station => station.id === id);

		ageData = [
		{ label: "0-19", value: selectedStation.age_0_19, "y": '⠀'},
		{ label: "20-64", value: selectedStation.age_20_64, "y": '⠀' },
		{ label: "65+", value: selectedStation.age_65_over, "y": '⠀' }
		];

		mobilityData = [
		{ label: "Car", value: selectedStation.mobiity_car, "y": '⠀' },
		{ label: "Public Transit", value: selectedStation.mobility_public_transit, "y": '⠀' },
		{ label: "Active Transit", value: selectedStation.mobility_active_transit, "y": '⠀' }
		];


		housingData = [
		{ label: "Pre-1960", value: selectedStation.housing_pre1960 },
		{ label: "1961-80", value: selectedStation.housing_1961_80 },
		{ label: "1981-00", value: selectedStation.housing_1981_00 },
		{ label: "Post-2000", value: selectedStation.housing_after2000 }
		];

		dwellingData = [
		{ label: "Detached", value: selectedStation.single_detached, "y": '⠀' },
		{ label: "Semi-Detached", value: selectedStation.row_house, "y": '⠀' },
		{ label: "Row", value: selectedStation.semi_detached, "y": '⠀' },
		{ label: "Apt >5", value: selectedStation.apt_more_5, "y": '⠀' },
		{ label: "Apt <5", value: selectedStation.apt_less_5, "y": '⠀' },
		{ label: "Duplex", value: selectedStation.duplex, "y": '⠀' }
		];

		ownerData = [
		{ label: "Owner", value: selectedStation.owners, "y": '⠀'},
		{ label: "Renter", value: selectedStation.renters, "y": '⠀' }
		];
	}
		

	onMount(async () => {

		const response = await fetch('/src/routes/lib/data/stations.json'); // Adjust the path as needed
		stationData = await response.json();

		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/canadianurbaninstitute/cm36ab0r5003q01qs48e25ng3?fresh=true',
			center: [-89, 58],
			zoom: 3.3,
			maxZoom: 15,
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
					type: 'fill',
					source: 'circle',
					paint: {
						'fill-outline-color': '#DB3069',
						'fill-color': '#db799a',
						'fill-opacity': 0.4
					}
				},
				'transit-stations'
			);

			// Event listener for clicks on the transit-stations layer
			map.on('click', 'transit-stations', (e) => {

				const stationId = e.features[0].properties.id;

				updateStationData(stationId);

				stationSelected = true;

				const coordinates = e.features[0].geometry.coordinates;
				const radiusInKilometers = 0.8; // 800 meters is 0.8 kilometers

				// Create a GeoJSON circle feature with an 800m radius using Turf.js
				const circleFeature = turf.circle(coordinates, radiusInKilometers, {
					steps: 128, // Increase or decrease for smoother/rougher edges
					units: 'kilometers'
				});

				// Update the circle data in the source
				map.getSource('circle').setData({
					type: 'FeatureCollection',
					features: [circleFeature]
				});

				// Set the flag to true indicating a circle is displayed
				circleDrawn = true;

				 // Zoom and center to the selected station
				 map.flyTo({
					center: coordinates,
					zoom: 14.5, // Adjust the zoom level as needed
					duration: 1000 // Animation duration in milliseconds
				});


				// Use 'within' filter to restrict the visibility of layers to the circle area
				const circlePolygon = circleFeature.geometry;

				map.setFilter('msn-lowdensity', ['within', circlePolygon]);
				map.setFilter('msn-highdensity', ['within', circlePolygon]);

				// Optionally set layer opacity to make them visible
				map.setPaintProperty('msn-lowdensity', 'line-opacity', 1);
				map.setPaintProperty('msn-highdensity', 'line-opacity', 1);

			});

			// Event listener for clicks on the map outside of transit-stations
			map.on('click', (e) => {
				// If a circle is already drawn, remove it when clicking outside the 'transit-stations' layer
				const features = map.queryRenderedFeatures(e.point, { layers: ['transit-stations'] });

				if (circleDrawn && features.length === 0) {
					// Clear the circle data by setting an empty FeatureCollection
					map.getSource('circle').setData({
						type: 'FeatureCollection',
						features: []
					});

					// Reset the flag
					circleDrawn = false;

					//stationSelected = false;
				}
			});
		});

		map.on(
			'mouseenter',
			[
				'transit-stations',
				'vancouver-lines',
				'edmonton-lines',
				'calgary-lines',
				'quebec-city-line',
				'montreal-lines',
				'ottawa-lines',
				'waterloo-lines',
				'toronto-lines'
			],
			() => {
				map.getCanvas().style.cursor = 'pointer';
			}
		);

		// Change the cursor back to a pointer
		// when it leaves the states layer.
		map.on(
			'mouseleave',
			[
				'transit-stations',
				'vancouver-lines',
				'edmonton-lines',
				'calgary-lines',
				'quebec-city-line',
				'montreal-lines',
				'ottawa-lines',
				'waterloo-lines',
				'toronto-lines'
			],
			() => {
				map.getCanvas().style.cursor = '';
			}
		);
	});

	function applyFilters() {
		const filterConditions = [];

		// Filter by status if any statuses are selected
		if (statusFilters.length) {
			filterConditions.push(['in', ['get', 'status'], ['literal', statusFilters]]);
		}

		// Filter by technology if any technologies are selected
		if (technologyFilters.length) {
			filterConditions.push(['in', ['get', 'technology'], ['literal', technologyFilters]]);
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



<div id="content-container">


	<div id="sidebar">
		{#if stationSelected}

		<h2>{selectedStation.stop_label}</h2>
		<h4>{selectedStation.line_label}</h4>

		<div class="tag-container">
			<div class="tag">{selectedStation.status}</div>
			<div class="tag">{selectedStation.technology}</div>
		</div>

		<hr>

		<div>Population: {selectedStation.population}</div>
		<div>Households: {selectedStation.households}</div>

		<hr>

		<div id='chart-container'>

		<BarChart
		colors={['#002a41', '#0098D6', '#db3069']}
		data={ageData}
		zKey="label"
		xKey="value"
		yKey="y"
		title="Age"
		xMax=100
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
		xMax=100
		mode="stacked"
		legend="true"
		xSuffix="%"
		padding={{ top: 0, bottom: 20, left: 0, right: 20 }}
		/>

		<BarChart
		colors={['#002a41', '#0098D6']}
		data={ownerData}
		zKey="label"
		xKey="value"
		yKey="y"
		title="Owners/Renters"
		xMax=100
		mode="stacked"
		legend="true"
		xSuffix="%"
		padding={{ top: 0, bottom: 20, left: 0, right: 20 }}
		/>


		<BarChart
		colors={['#002a41', '#0098D6', '#F35D00', '#db3069', '#8A4285', '#43B171']}
		data={dwellingData}
		zKey="label"
		xKey="value"
		yKey="y"
		title="Dwelling Type"
		xMax=100
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
		title="Housing Construction"
		yMax=100
		xSuffix="%"
		padding={{ top: 0, bottom: 0, left: 30, right: 20 }}

		/>

		</div>


		{/if}


		
	</div>


	<div id=map-container>
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

	#content-container {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border-top: 1px solid #eee;
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
		border: 1px solid #eee;
	}

	.filter-group {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1em;
	}

	#chart-container {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	@media only screen and (min-width: 768px) {
		#content-container {
			flex-direction: row;
		}

		#sidebar {
			width: 40vw;
			border-right: 1px solid #eee;
		}

		#map {
			height: 100vh;
			order: 0;
		}

		#map-container {
			width: 100%;
			order: 0;
		}
	}

	hr {
		border: 0.5px solid #eee;
		width: 100%;
	}


</style>
