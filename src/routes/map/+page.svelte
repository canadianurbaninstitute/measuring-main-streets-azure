<script>
	import '../styles.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import mapboxgl from 'mapbox-gl';
	import Icon from '@iconify/svelte';

	import Legend from '../lib/ui/legends/Legend.svelte';
	import Metric from '../lib/ui/Metric.svelte';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	export let map;

	// info
	let streetname = 'Canada';
	let place = 'Main Streets';

	// basic

	let population = ''; //Pop
	let employees = ''; //


	// business 
	let business = '';
	let business_retail = '';
	let business_services = '';
	let business_food_drink = '';

	let business_independence = ''; //BII_avg

	// civic

	let civic = '';
	let civic_govt_community;
	let civic_healthcare;
	let civic_education;
	let civic_arts_culture;
	let civic_recreation;

	// demographic

	// income + education

	let income = '';
	let education = '';
	
	// age

	let average_age = '';
	let age_0_19;
	let age_20_64;
	let age_over_65;

	// equity

	let immigrants = ''; 
	let visibleminority  = '';
	let indigenous = '';

	// commute

	let car = '';
	let public_transit = '';
	let active_transit = '';

	// housing

	let dwellings = '';
	let singledetached;
	let semidetached;
	let duplex;
	let apartments_more_than_5;
	let apartments_less_than_5;

	// language

	let french = '';
	let english = '';

	onMount(() => {
		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/canadianurbaninstitute/clpa3pw06003901qr8j8v7rjj',
			center: [-89, 53],
			zoom: 3.6,
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

		map.on('click', ['mainstreets-canada', 'mainstreets-canada-invisible'], (e) => {

			// general

			streetname = e.features[0].properties.R_STNAM;
			place = e.features[0].properties.R_PLACE;

			population = e.features[0].properties.Pop;
			employees = e.features[0].properties.total_emp.toFixed(0);

			// business

			business = e.features[0].properties.Bsnss_t.toFixed(0);
			business_food_drink = e.features[0].properties.FdandDr.toFixed(0);
			business_retail = e.features[0].properties.Retail.toFixed(0);
			business_services = e.features[0].properties.SrvcsaO.toFixed(0);
			business_independence = e.features[0].properties.BII_avg.toFixed(2);

			// civic

			civic = e.features[0].properties.Cvc_ttl.toFixed(0);
			civic_arts_culture = e.features[0].properties.ArtsanC.toFixed(0);
			civic_education = e.features[0].properties.Educatn.toFixed(0);
			civic_govt_community = e.features[0].properties.GvrnaCS.toFixed(0);
			civic_healthcare = e.features[0].properties.HlthaCF.toFixed(0);
			civic_recreation = e.features[0].properties.RcrtnFc.toFixed(0);

			// demographic

			// income + education

			income = e.features[0].properties.AvgEmpInc.toFixed(0);
			education = e.features[0].properties.UniDeg.toFixed(0);
			
			// age

			average_age = e.features[0].properties.AvgAge.toFixed(0);

			// equity

			immigrants = e.features[0].properties.ImmNPR.toFixed(0);
			visibleminority = e.features[0].properties.VM.toFixed(0);
			indigenous = e.features[0].properties.Indig.toFixed(0);

			// commute

			car = e.features[0].properties.MobCar.toFixed(0);
			public_transit = e.features[0].properties.MobPT.toFixed(0);
			active_transit = e.features[0].properties.MobAct.toFixed(0);

			// housing

			dwellings = e.features[0].properties.TotalDwellings.toFixed(0);
			singledetached = e.features[0].properties.SinDetach.toFixed(0);
			semidetached = e.features[0].properties.SemiDetach.toFixed(0);
			duplex = e.features[0].properties.Duplex.toFixed(0);
			apartments_more_than_5 = e.features[0].properties.AptMore5.toFixed(0);
			apartments_less_than_5 = e.features[0].properties.AptLess5.toFixed(0);

			// language

			english = e.features[0].properties.LanEng.toFixed(0);
			french = e.features[0].properties.LanFr.toFixed(0);

		});

		map.on('click', 'toronto-bias', (e) => {
			goto("/casestudies/westqueenwest")

		});


		// Change the cursor to a pointer when
		// the mouse is over the states layer.
		map.on('mouseenter', ['mainstreets-canada', 'mainstreets-canada-invisible', 'toronto-bias'], () => {
			map.getCanvas().style.cursor = 'pointer';
		});

		// Change the cursor back to a pointer
		// when it leaves the states layer.
		map.on('mouseleave', ['mainstreets-canada', 'mainstreets-canada-invisible', 'toronto-bias'], () => {
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
		<div class="metric">Amenity Score: <Icon icon="bxs:tachometer" color="#002a41" /></div>
		<hr />
		<Metric label={'Population'} value={population} icon={"fluent:people-20-filled"}/>
		<Metric label={'Employees'} value={employees} icon={"mdi:briefcase"}/>
		<hr />
		<Metric label={'Civic Infrastructure'} value={civic} icon={"heroicons:building-library-20-solid"}/>
		<Metric label={'Businesses'} value={business} icon={"mdi:shop"}/>
		<Metric label={'Business Independence Index'} value={business_independence} icon={"mdi:shop"}/>
		<hr />
		<Metric label={'Average Income'} prefix={'$'} value={income} icon={"mdi:dollar"}/>
		<Metric label={'% of Population with Bachelors'} value={education} suffix={'%'} icon={"mdi:school"}/>
		<Metric label={'Average Age'} value={average_age} icon={"mdi:calendar"}/>
		<hr />
		<Metric label={'Recent Immigrants'} value={immigrants} suffix={'%'} icon={"mdi:passport"}/>
		<Metric label={'Visible Minorities'} value={visibleminority} suffix={'%'} icon={"mdi:person"}/>
		<Metric label={'Indigenous'} value={indigenous} suffix={'%'} icon={"mdi:person"}/>
		<hr />
		<Metric label={'Car'} value={car} suffix={'%'} icon={"mdi:car"}/>
		<Metric label={'Public Transit'} value={public_transit} suffix={'%'} icon={"mdi:bus"}/>
		<Metric label={'Active Transit'} value={active_transit} suffix={'%'} icon={"mdi:bike"}/>
		<hr/>
		<Metric label={'Dwellings'} value={dwellings} icon={"mdi:building"}/>
		<hr/>
		<Metric label={'English Speakers'} value={english} suffix={'%'} icon={"mdi:web-box"}/>
		<Metric label={'French Speakers'} value={french} suffix={'%'} icon={"material-symbols:language-french"}/>
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
		width: 30vw;
		display: flex;
		flex-direction: column;
		padding: 1em;
		border-right: 1px solid #eee;


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

	h2 {
		text-align: center;
	}

	@media screen and (min-width: 640px) {
		#legend {
			position: absolute;
			bottom: 1.5em;
			right: 0.5em;
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
