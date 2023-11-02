<script>
	import '../styles.css';
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import Icon from '@iconify/svelte';

	import Legend from '../lib/ui/legends/Legend.svelte';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiYW5hbm1heSIsImEiOiJjbDk0azNmY3oxa203M3huMzhyZndlZDRoIn0.1L-fBYplQMuwz0LGctNeiA';

	export let map;

	// info
	let streetname = 'Canada';
	let place = 'Main Streets';
	let province = ''; //codes not names - add column for codes

	// business
	let independence = ''; //BII_avg
	let employees = ''; //emp_sum

	// demographic
	let population = ''; //Pop
	let visibleminority = ''; // Eth_VM
	let immigrants = ''; // Eth_Imm

	// housing
	let singledetached = 0;
	let apartments = 0;

	onMount(() => {
		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/ananmay/clnc7tpm907rd01p93bgs013m?&fresh=true?optimize=true',
			center: [-97, 54],
			zoom: 3.9,
			minZoom: 2,
			scrollZoom: true,
			attributionControl: false
		});

		map.addControl(new mapboxgl.NavigationControl());

		map.addControl(
				new mapboxgl.AttributionControl({
					customAttribution: 'Canadian Urban Institute'
				})
			);

		// Geocoder Search

		map.on('load', () => {
			map.addControl(
				new MapboxGeocoder({
					accessToken: mapboxgl.accessToken,
					countries: 'ca',
					proximity: 'ip',
					types: 'address, region, country, postcode, district, place, locality, neighborhood',
					language: 'en, fr',
					marker: true,
					placeholder: 'Search for a place',
					mapboxgl: mapboxgl
				}),
				'top-left'
			);
		});

		map.on('click', 'mainstreets-canada', (e) => {

			streetname = e.features[0].properties.R_STNAM;
			place = e.features[0].properties.R_PLACE;

			independence = e.features[0].properties.BII_avg.toFixed(2);
			employees = e.features[0].properties.emp_sum.toFixed(0);

			population = e.features[0].properties.Pop;
			visibleminority = e.features[0].properties.Eth_VM;
			immigrants = e.features[0].properties.Eth_Imm;

			apartments = e.features[0].properties.HH_APT.toFixed(1);
			singledetached = e.features[0].properties.HH_SDH.toFixed(1);
		});

		// Change the cursor to a pointer when
		// the mouse is over the states layer.
		map.on('mouseenter', 'mainstreets-canada', () => {
			map.getCanvas().style.cursor = 'pointer';
		});

		// Change the cursor back to a pointer
		// when it leaves the states layer.
		map.on('mouseleave', 'mainstreets-canada', () => {
			map.getCanvas().style.cursor = '';
		});
	});
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

<div id="map-container">
	<div id="sidebar">
		<h5>Click on a street segment on the map to view information.</h5>
		<hr />
		<h2>{streetname}</h2>
		<h5>{place}</h5>
		<hr />
		<div class="metric">Amenity Score: <Icon icon="mdi:score" color="#002a41" /></div>
		<hr />
		<div class="metric">
			Population: {population}
			<Icon icon="fluent:people-20-filled" color="#002a41" />
		</div>
		<div class="metric">
			# of Employees: {employees}
			<Icon icon="mdi:briefcase" color="#002a41" />
		</div>
		<hr />
		<div class="metric">
			Business Independence Index: {independence}
			<Icon icon="mdi:shop" color="#002a41" />
		</div>
		<hr />
		<div class="metric">Apartments: {apartments}% <Icon icon="mdi:building" color="#002a41" /></div>
		<div class="metric">
			Single Detached: {singledetached}% <Icon icon="mdi:home" color="#002a41" />
		</div>
	</div>
	<div id="map" />
	<div id="legend">
		<Legend
			minlabel={'Low'}
			maxlabel={'High'}
			label={'Business Density'}
			gradient={'linear-gradient(to right, #cceffe, #99dffc, #34bef9, #018bc6, #004663)'}
		/>
	</div>
</div>

<style>
	:global(body) {
		padding: 0px;
		margin: 0px;
		background-color: white;
	}

	#map {
		height: 88vh;
		width: 100%;
		position: relative;
	}

	#map-container {
		display: flex;
		flex-direction: row;
	}

	#sidebar {
		width: 20vw;
		display: flex;
		flex-direction: column;
		padding: 1em;
	}

	.metric {
		padding: 0.8em;
		border: 1px solid #ddd;
		border-radius: 0.5em;
		margin: 0.2em 0 0.2em 0;
		font-size: 0.9em;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	@media screen and (min-width: 640px) {
		#legend {
			position: absolute;
			bottom: 0.5em;
			left: 0.5em;
			width: 15vw;
			background-color: #fff;
			padding: 1em;
			border-radius: 0.6em;
			border: 1px solid #eee;
			max-width: 360px;
		}
	}

	hr {
		border: 0.5px solid #eee;
		width: 100%;
	}
</style>
