<script>
	import '../styles.css';
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import * as turf from '@turf/turf';

	import Footer from '../lib/Footer.svelte';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	export let map;

	let geocoder;
	let circleDrawn = false;
	let station = '';
	let line = '';
	let stop_status = '';
	let technology = '';
	let statusFilters = [];
let technologyFilters = [];

	onMount(() => {
		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/canadianurbaninstitute/cm36ab0r5003q01qs48e25ng3?fresh=true',
			center: [-89, 58],
			zoom: 3.3,
			maxZoom: 14,
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
			map.addLayer({
				id: 'circle-radius',
				type: 'fill',
				source: 'circle',
				paint: {
					'fill-outline-color': '#DB3069',
					'fill-color': '#db799a',
					'fill-opacity': 0.4
				}
			}, 'transit-stations');

			// Event listener for clicks on the transit-stations layer
			map.on('click', 'transit-stations', (e) => {

				station = e.features[0].properties.stop_label;
				line = e.features[0].properties.line_label;
				stop_status = e.features[0].properties.status;
				technology = e.features[0].properties.technology;




				const coordinates = e.features[0].geometry.coordinates;
				const radiusInKilometers = 0.8; // 800 meters is 0.8 kilometers

				// Create a GeoJSON circle feature with an 800m radius using Turf.js
				const circleFeature = turf.circle(coordinates, radiusInKilometers, {
					steps: 64, // Increase or decrease for smoother/rougher edges
					units: 'kilometers'
				});

				// Update the circle data in the source
				map.getSource('circle').setData({
					type: 'FeatureCollection',
					features: [circleFeature]
				});

				// Set the flag to true indicating a circle is displayed
				circleDrawn = true;
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

					station = '';
					line = '';
					stop_status = '';
					technology = '';
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

	const layers = [
		'transit-stations',
		'transit-lines'
	];

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
		<h2>{station}</h2>
		<h4>{line}</h4>
	<div class='tag-container'>
		<div class='tag'>{stop_status}</div>
		<div class='tag'>{technology}</div>
	</div>

	<div id="filter-container">
		<h3>Filters</h3>
		<div class="filter-group">
			<h4>Status</h4>
			<label><input type="checkbox" bind:group={statusFilters} value="Existing" on:change={applyFilters} /> Existing</label>
			<label><input type="checkbox" bind:group={statusFilters} value="Construction" on:change={applyFilters} /> Construction</label>
			<label><input type="checkbox" bind:group={statusFilters} value="Planned" on:change={applyFilters} /> Planned</label>
		</div>
	
		<div class="filter-group">
			<h4>Technology</h4>
			<label><input type="checkbox" bind:group={technologyFilters} value="Subway" on:change={applyFilters} /> Subway</label>
			<label><input type="checkbox" bind:group={technologyFilters} value="LRT" on:change={applyFilters} /> LRT</label>
			<label><input type="checkbox" bind:group={technologyFilters} value="Commuter" on:change={applyFilters} /> Commuter</label>
		</div>
	</div>
	</div>
	<div id="map" />
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
		padding: 0.5em 1em 0.5em 1em;
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
		margin: 1em 0 0 0;
		padding: 1em;
		border: 1px solid #eee;
	}

	@media only screen and (min-width: 768px) {
		#content-container {
			flex-direction: row;
		}

		#sidebar {
			width: 35vw;
			border-right: 1px solid #eee;
		}

		#map {
			height: 100vh;
			order: 0;
		}
	}

	hr {
		border: 0.5px solid #eee;
		width: 100%;
	}
</style>
