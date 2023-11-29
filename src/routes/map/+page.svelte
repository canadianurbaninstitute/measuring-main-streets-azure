<script>
	import '../styles.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import mapboxgl from 'mapbox-gl';

	import Legend from '../lib/ui/legends/Legend.svelte';
	import Metric from '../lib/ui/Metric.svelte';
	import Accordion from '../lib/ui/Accordion.svelte';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	export let map;

	// currently weighted averages, would make more sense to do it as % of 'main street population base'

	// info
	let streetname = 'Canada';
	let place = '23,223 Main Streets';

	// basic

	let population = 0; //Pop
	let employees = 0; //


	// business 
	let business = '397,476';
	let business_retail = '185,241';
	let business_services = '143,274';
	let business_food_drink = '68,960';

	let business_independence = 0.52; //BII_avg

	// civic

	let civic = '197,035';
	let civic_govt_community = '59,272';
	let civic_healthcare = '80,252';
	let civic_education = '34,858';
	let civic_arts_culture = '8,551';
	let civic_recreation = '14,101';

	// demographic

	// income + education

	let income = 76650;
	let education = 24;
	
	// age

	let average_age = 33;
	let age_0_19;
	let age_20_64;
	let age_over_65;

	// equity

	let immigrants = 30.0; 
	let visibleminority  = 29.6;
	let indigenous = 4.7;

	// commute

	let car = 34;
	let public_transit = 10;
	let active_transit = 9;

	// housing

	let dwellings = 0;
	let singledetached = 0;
	let semidetached = 0;
	let duplex = 0;
	let apartments_more_than_5 = 0;
	let apartments_less_than_5 = 0;

	// language

	let french = 0;
	let english = 0;

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

			business = e.features[0].properties.FdandDr + e.features[0].properties.Retail + e.features[0].properties.SrvcsaO;
			business_food_drink = e.features[0].properties.FdandDr;
			business_retail = e.features[0].properties.Retail;
			business_services = e.features[0].properties.SrvcsaO;
			business_independence = e.features[0].properties.BII_avg.toFixed(2);

			// civic

			civic = (e.features[0].properties.ArtsanC + e.features[0].properties.Educatn + e.features[0].properties.GvrnaCS + e.features[0].properties.HlthaCF + e.features[0].properties.RcrtnFc)
			civic_arts_culture = e.features[0].properties.ArtsanC;
			civic_education = e.features[0].properties.Educatn;
			civic_govt_community = e.features[0].properties.GvrnaCS;
			civic_healthcare = e.features[0].properties.HlthaCF;
			civic_recreation = e.features[0].properties.RcrtnFc;

			// demographic

			// income + education

			income = parseFloat(e.features[0].properties.AvgEmpInc.toFixed(0)).toLocaleString();
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

			let features = map.queryRenderedFeatures(e.point, { layers: ['mainstreets-canada', 'mainstreets-canada-invisible'] });
			
			if (!features.length) {
				return;
			}

			if (typeof map.getLayer('selectedRoad') !== "undefined" ){         
				map.removeLayer('selectedRoad')
				map.removeSource('selectedRoad');   
			}

			let feature = features[0];

			//console.log(feature.toJSON());
			
			map.addSource('selectedRoad', {
				type: "geojson",
				data: feature.toJSON()
			});

			map.addLayer({
				id: "selectedRoad",
				type: "line",
				source: "selectedRoad",
				layout: {
					'line-join': "round",
					'line-cap': "round"
				},
				paint: {
					'line-color': "#cb1515",
					'line-width': 5
				}
			});

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
		<h2>{streetname}</h2>
		<h5>{place}</h5>
		<hr />
		<!-- <Metric label={'Amenity Score'} value={business_independence} icon={"bxs:tachometer"}/> -->
		<div class='metric-container'>
		<Metric label={'Population'} value={population} icon={"fluent:people-20-filled"}/>
		<Metric label={'Employees'} value={employees} icon={"mdi:briefcase"}/>
		</div>
		<Accordion>
			<Metric accordion slot='header' label={'Civic Infrastructure'} value={civic} icon={"heroicons:building-library-20-solid"}/>
			<div slot='body'>
				<div class='metric-container'>
					<Metric label={'Education'} value={civic_education} icon={"mdi:school"}/>
					<Metric label={'Arts & Culture'} value={civic_arts_culture} icon={"fa6-solid:masks-theater"}/>
					<Metric label={'Recreation'} value={civic_recreation}  icon={"material-symbols:park-rounded"}/>
				</div>
				<div class='metric-container'>
					<Metric label={'Government & Community Services'} value={civic_govt_community} icon={"mingcute:government-fill"}/>
					<Metric label={'Health & Care Facilities'} value={civic_healthcare} icon={"mdi:hospital-box"}/>
				</div>
			</div>
		</Accordion>	
		<Accordion>
			<Metric accordion slot='header' label={'Businesses'} value={business} icon={"mdi:building"}/>
			<div slot='body' class='metric-container'>
				<Metric label={'Retail'} value={business_retail} icon={"mdi:shopping"}/>
				<Metric label={'Food & Drink'} value={business_food_drink} icon={"dashicons:food"}/>
				<Metric label={'Services'} value={business_services}  icon={"mdi:ticket"}/>
			</div>
		</Accordion>	
		<Metric label={'Business Independence Index'} value={business_independence} icon={"mdi:shop"}/>
		<hr/>
		<div class='metric-container'>
		<Metric label={'Average Income'} prefix={'$'} value={income.toLocaleString()} icon={"mdi:wallet"}/>
		<Metric label={"Bachelor's Degree"} value={education} suffix={'%'} icon={"mdi:school"}/>
		</div>
		<Metric accordion label={'Average Age'} value={average_age} icon={"mingcute:birthday-2-fill"}/>
		<div class='metric-container'>
		<Metric label={'Recent Immigrants'} value={immigrants} suffix={'%'} icon={"mdi:globe"}/>
		<Metric label={'Visible Minorities'} value={visibleminority} suffix={'%'} icon={"material-symbols:handshake"}/>
		<Metric label={'Indigenous Population'} value={indigenous} suffix={'%'} icon={"mdi:person"}/>
		</div>
		<div class='metric-container'>
		<Metric label={'Car'} value={car} suffix={'%'} icon={"mdi:car"}/>
		<Metric label={'Public Transit'} value={public_transit} suffix={'%'} icon={"mdi:bus"}/>
		<Metric label={'Active Transit'} value={active_transit} suffix={'%'} icon={"mdi:bike"}/>
		</div>
		<Accordion>
		<Metric accordion slot='header' label={'Dwellings'} value={dwellings} icon={"material-symbols:apartment"}/>
		<div slot='body'>
			<div class='metric-container'>
				<Metric label={'Single Detached'} value={singledetached} suffix={'%'}/>
				<Metric label={'Semi-Detached'} value={semidetached} suffix={'%'}/>
				<Metric label={'Duplex'} value={duplex} suffix={'%'}/>
			</div>
			<div class='metric-container'>
				<Metric label={'Apartment (>5 stories)'} value={apartments_more_than_5} suffix={'%'} />
				<Metric label={'Apartment (<5 stories)'} value={apartments_less_than_5} suffix={'%'}/>
			</div>
		</div>
		</Accordion>
		<!-- <Metric label={'English Speakers'} value={english} suffix={'%'}/>
		<Metric label={'French Speakers'} value={french} suffix={'%'} /> -->
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
		padding: 0.5em 1em 0.5em 1em;
		border-right: 1px solid #eee;
	}

	.metric-container {
		display: flex;
		flex-direction: row;
		gap: 0.5em;
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
