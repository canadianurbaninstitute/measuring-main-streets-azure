<script>
	import '../styles.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import mapboxgl from 'mapbox-gl';
	import * as turf from '@turf/turf';
	import Icon from '@iconify/svelte';

	import Legend from '../lib/ui/legends/Legend.svelte';
	import LegendItem from '../lib/ui/legends/LegendItem.svelte';
	import Metric from '../lib/ui/Metric.svelte';
	import Accordion from '../lib/ui/Accordion.svelte';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	export let map;

	// info
	let streetname = 'Canada';
	let place = '23,223 Main Streets';

	// basic

	let population = '29,482,761';
	let employees = '1,692,453';

	// business
	let business = '397,476';
	let business_retail = '185,241';
	let business_services = '143,274';
	let business_food_drink = '68,960';

	let independent_business = 0.52; //BII_avg

	// civic

	let civic = '197,035';
	let civic_govt_community = '59,272';
	let civic_healthcare = '80,252';
	let civic_education = '34,858';
	let civic_arts_culture = '8,551';
	let civic_recreation = '14,101';

	// demographic

	// income + education

	let income = 76427;
	let education = 28;

	// age

	let average_age = 41;
	let age_0_19 = 20;
	let age_20_64 = 61;
	let age_over_65 = 19;

	// equity

	let immigrants = 28.4;
	let visibleminority = 29.4;
	let indigenous = 3.9;

	// commute

	let car = 76;
	let public_transit = 15;
	let active_transit = 8;

	// housing

	let dwellings = '11,936,445';
	let singledetached = 49;
	let semidetached = 5;
	let duplex = 6;
	let apartments_more_than_5 = 11;
	let apartments_less_than_5 = 19;

	// language

	let french = 18;
	let english = 62;

	let geocoder;

	onMount(() => {
		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/canadianurbaninstitute/clpa3pw06003901qr8j8v7rjj?fresh=true',
			center: [-89, 58],
			zoom: 3.3,
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
			
				geocoder.on('results', function(results) {
					document.getElementById('resetButton').style.display = 'flex'; // Show the button
				});

			map.addControl(geocoder,'top-left');

			map.addSource('canada-DAs', {
				type: 'vector',
				url: 'mapbox://canadianurbaninstitute.dayeanmd'
			});

			map.addLayer(
				{
					id: 'canada-DAs',
					type: 'fill',
					source: 'canada-DAs',
					'source-layer': 'canadaDAs',
					paint: {
						'fill-outline-color': 'rgba(200,200,200,0.1)',
						'fill-color': 'rgba(0,0,0,0)'
					}
				},
				// Place polygons under labels, roads and buildings.
				'mainstreets-canada'
			);

			map.addLayer(
				{
					id: 'canada-DAs-highlighted',
					type: 'fill',
					source: 'canada-DAs',
					'source-layer': 'canadaDAs',
					paint: {
						'fill-outline-color': '#cb1515',
						'fill-color': '#ffb8b8',
						'fill-opacity': 0.4
					},
					filter: ['in', 'DAUID', '']
				},
				// Place polygons under labels, roads and buildings.
				'mainstreets-canada'
			);
		});

		map.on('click', ['mainstreets-canada', 'mainstreets-canada-invisible'], (e) => {
		
			// map zooming
			const endpoints = e.features[0].geometry.coordinates;
			const midpoint = turf.midpoint(endpoints[0], endpoints[1]);

			map.flyTo({
				center: midpoint.geometry.coordinates,
				zoom: 13
			});

			// button
		
			document.getElementById('resetButton').style.display = 'flex'

			// general

			streetname = e.features[0].properties.R_STNAM;
			place = e.features[0].properties.R_PLACE;

			population = e.features[0].properties.Pop;
			employees = e.features[0].properties.total_emp.toFixed(0);

			// business

			business =
				e.features[0].properties.FdandDr +
				e.features[0].properties.Retail +
				e.features[0].properties.SrvcsaO;
			business_food_drink = e.features[0].properties.FdandDr;
			business_retail = e.features[0].properties.Retail;
			business_services = e.features[0].properties.SrvcsaO;
			independent_business = e.features[0].properties.BII_avg.toFixed(2);

			// civic

			civic =
				e.features[0].properties.ArtsanC +
				e.features[0].properties.Educatn +
				e.features[0].properties.GvrnaCS +
				e.features[0].properties.HlthaCF +
				e.features[0].properties.RcrtnFc;
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
			age_0_19 = e.features[0].properties.Age0_19.toFixed(0);
			age_20_64 = e.features[0].properties.Age20_64.toFixed(0);
			age_over_65 = e.features[0].properties.Age65_Over.toFixed(0);

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

			// highlighting road

			let features = map.queryRenderedFeatures(e.point, {
				layers: ['mainstreets-canada', 'mainstreets-canada-invisible']
			});

			if (!features.length) {
				return;
			}

			if (typeof map.getLayer('selectedRoad') !== 'undefined') {
				map.removeLayer('selectedRoad');
				map.removeSource('selectedRoad');
				// map.removeLayer('selectedRoadBuffer');
				// map.removeSource('selectedRoadBuffer');
			}

			let feature = features[0];
			let buffered = turf.buffer(feature, 1);

			map.addSource('selectedRoad', {
				type: 'geojson',
				data: feature.toJSON()
			});

			const geobbox = turf.bbox(buffered);
			const bboxpoint1 = map.project([geobbox[0], geobbox[1]]);
			const bboxpoint2 = map.project([geobbox[2], geobbox[3]]);

			//const bboxpolygon = turf.bboxPolygon(geobbox)

			const bbox = [bboxpoint1, bboxpoint2];

			// Find features intersecting the bounding box.
			const selectedFeatures = map.queryRenderedFeatures(bbox, {
				layers: ['canada-DAs']
			});

			const dauid = selectedFeatures.map((feature) => feature.properties.DAUID);
			// Set a filter matching selected features by FIPS codes
			// to activate the 'canada-DAs-highlighted' layer.
			map.setFilter('canada-DAs-highlighted', ['in', 'DAUID', ...dauid]);

			// map.addSource('selectedRoadBuffer', {
			// 	type: 'geojson',
			// 	data: bboxpolygon
			// });

			// map.addLayer({
			// 	id: 'selectedRoadBuffer',
			// 	type: 'fill',
			// 	source: 'selectedRoadBuffer',
			// 	paint: {
			// 		'fill-color': '#ffb8b8',
			// 		'fill-opacity': 0.4
			// 	}
			// }, 'mainstreets-canada');

			map.addLayer({
				id: 'selectedRoad',
				type: 'line',
				source: 'selectedRoad',
				layout: {
					'line-join': 'round',
					'line-cap': 'round'
				},
				paint: {
					'line-color': '#cb1515',
					'line-width': 5
				}
			});
		});

		map.on('click', 'case-study-BIAs', (e) => {
			const path = e.features[0].properties.path
			goto('/casestudies/' + path);
		});

		// Change the cursor to a pointer when
		// the mouse is over the states layer.
		map.on(
			'mouseenter',
			['mainstreets-canada', 'mainstreets-canada-invisible', 'case-study-BIAs'],
			() => {
				map.getCanvas().style.cursor = 'pointer';
			}
		);

		// Change the cursor back to a pointer
		// when it leaves the states layer.
		map.on(
			'mouseleave',
			['mainstreets-canada', 'mainstreets-canada-invisible', 'case-study-BIAs'],
			() => {
				map.getCanvas().style.cursor = '';
			}
		);

		map.on('zoom', () => {
			if (map.getZoom() > 11) {
				// Show the HTML element
				document.getElementById('business-civic-legend').style.opacity = '1';
				document.getElementById('business-civic-legend').style.visibility = 'visible';
			} else {
				// Hide the HTML element
				document.getElementById('business-civic-legend').style.opacity = '0';
				document.getElementById('business-civic-legend').style.visibility = 'hidden';
			}
		});
	});

	// Reset Map

	function resetMap() {

		document.getElementById('resetButton').style.display = 'none';

		// reset geocoder
		geocoder.clear();
		document.getElementsByClassName('mapboxgl-ctrl-geocoder--input')[0].blur();



		map.flyTo({
			zoom: 3.2,
			center: [-89, 58]
		});

		// info
		streetname = 'Canada';
		place = '23,223 Main Streets';

		// basic

		population = '29,482,761';
		employees = '1,692,453';

		// business
		business = '397,476';
		business_retail = '185,241';
		business_services = '143,274';
		business_food_drink = '68,960';

		independent_business = 0.52; //BII_avg

		// civic

		civic = '197,035';
		civic_govt_community = '59,272';
		civic_healthcare = '80,252';
		civic_education = '34,858';
		civic_arts_culture = '8,551';
		civic_recreation = '14,101';

		// demographic

		// income + education

		income = 76427;
		education = 28;

		// age

		average_age = 41;
		age_0_19 = 20;
		age_20_64 = 61;
		age_over_65 = 19;

		// equity

		immigrants = 28.4;
		visibleminority = 29.4;
		indigenous = 3.9;

		// commute

		car = 76;
		public_transit = 15;
		active_transit = 8;

		// housing

		dwellings = '11,936,445';
		singledetached = 49;
		semidetached = 5;
		duplex = 6;
		apartments_more_than_5 = 11;
		apartments_less_than_5 = 19;

		// language

		french = 18;
		english = 62;

		map.removeLayer('selectedRoad');
		map.removeSource('selectedRoad');
		map.setFilter('canada-DAs-highlighted', ['in', 'DAUID', '']);
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

<div id="content-container">
	<div id="sidebar">
		<h2>{streetname}</h2>
		<h5>{place}</h5>
		<hr />
		<!-- <Metric label={'Amenity Score'} value={business_independence} icon={"bxs:tachometer"}/> -->
		<div class="metric-container">
			<Metric label={'Population'} value={population} icon={'fluent:people-20-filled'} />
			<Metric label={'Employees'} value={employees} icon={'mdi:briefcase'} />
		</div>
		<Accordion>
			<Metric
				accordion
				slot="header"
				label={'Civic Infrastructure'}
				value={civic}
				icon={'heroicons:building-library-20-solid'}
			/>
			<div slot="body">
				<div class="metric-container">
					<Metric label={'Education'} value={civic_education} icon={'mdi:school'} />
					<Metric
						label={'Arts & Culture'}
						value={civic_arts_culture}
						icon={'fa6-solid:masks-theater'}
					/>
					<Metric
						label={'Recreation'}
						value={civic_recreation}
						icon={'material-symbols:park-rounded'}
					/>
				</div>
				<div class="metric-container">
					<Metric
						label={'Government & Community Services'}
						value={civic_govt_community}
						icon={'mingcute:government-fill'}
					/>
					<Metric
						label={'Health & Care Facilities'}
						value={civic_healthcare}
						icon={'mdi:hospital-box'}
					/>
				</div>
			</div>
		</Accordion>
		<Accordion>
			<Metric accordion slot="header" label={'Businesses'} value={business} icon={'mdi:building'} />
			<div slot="body" class="metric-container">
				<Metric label={'Retail'} value={business_retail} icon={'mdi:shopping'} />
				<Metric label={'Food & Drink'} value={business_food_drink} icon={'dashicons:food'} />
				<Metric label={'Services'} value={business_services} icon={'mdi:ticket'} />
			</div>
		</Accordion>
		<Metric label={'Independent Business Index'} value={independent_business} icon={'mdi:shop'} />
		<h6>Demographic</h6>
		<div class="metric-container">
			<Metric
				label={'Average Income'}
				prefix={'$'}
				value={income.toLocaleString()}
				icon={'mdi:wallet'}
			/>
			<Metric label={"Bachelor's Degree"} value={education} suffix={'%'} icon={'mdi:school'} />
		</div>
		<Accordion>
			<Metric
				accordion
				slot="header"
				label={'Average Age'}
				value={average_age}
				icon={'mingcute:birthday-2-fill'}
			/>
			<div slot="body" class="metric-container">
				<Metric label={'0 to 19'} value={age_0_19} suffix={'%'} />
				<Metric label={'20 to 64'} value={age_20_64} suffix={'%'} />
				<Metric label={'65 and over'} value={age_over_65} suffix={'%'} />
			</div>
		</Accordion>
		<div class="metric-container">
			<Metric label={'Recent Immigrants'} value={immigrants} suffix={'%'} icon={'mdi:globe'} />
			<Metric
				label={'Visible Minorities'}
				value={visibleminority}
				suffix={'%'}
				icon={'material-symbols:handshake'}
			/>
			<Metric label={'Indigenous Population'} value={indigenous} suffix={'%'} icon={'mdi:person'} />
		</div>
		<h6>Commuting</h6>
		<div class="metric-container">
			<Metric label={'Car'} value={car} suffix={'%'} icon={'mdi:car'} />
			<Metric label={'Public Transit'} value={public_transit} suffix={'%'} icon={'mdi:bus'} />
			<Metric label={'Active Transit'} value={active_transit} suffix={'%'} icon={'mdi:bike'} />
		</div>
		<h6>Housing</h6>
		<Accordion>
			<Metric
				accordion
				slot="header"
				label={'Dwellings'}
				value={dwellings}
				icon={'material-symbols:apartment'}
			/>
			<div slot="body">
				<div class="metric-container">
					<Metric label={'Single Detached'} value={singledetached} suffix={'%'} />
					<Metric label={'Semi-Detached'} value={semidetached} suffix={'%'} />
					<Metric label={'Duplex'} value={duplex} suffix={'%'} />
				</div>
				<div class="metric-container">
					<Metric label={'Apartment (>5 stories)'} value={apartments_more_than_5} suffix={'%'} />
					<Metric label={'Apartment (<5 stories)'} value={apartments_less_than_5} suffix={'%'} />
				</div>
			</div>
		</Accordion>
		<!-- <Metric label={'English Speakers'} value={english} suffix={'%'}/>
		<Metric label={'French Speakers'} value={french} suffix={'%'} /> -->
	</div>
	<div id="map" />
	<div id="controls">
		<div>
			<div class="legend">

		<p>This is a map of all main street segments in Canada. Search for a place using the search box or navigate the map using the controls and click on a main street segment to see information associated with it.</p>
				</div>
		<div class="legend">
			<Legend
				minlabel={'Low'}
				maxlabel={'High'}
				label={'Main Street Business Density'}
				sublabel={'(# of Main Street businesses / km)'}
				gradient={'linear-gradient(to right, #cceffe, #99dffc, #34bef9, #018bc6, #004663)'}
			/>
			<LegendItem
				variant={'polygon'}
				label={'Main Street Catchment'}
				bgcolor={'#ffb8b8'}
				bordercolor={'#cb1515'}
				featuretype={'fill'}
				{map}
			/>
		</div>
		<div class="legend">
			<LegendItem
				variant={'polygon'}
				label={'Case Studies'}
				bgcolor={'#ffdd33'}
				bordercolor={'#c4ad37'}
				button={true}
				id={'case-study-BIAs'}
				featuretype={'fill'}
				targetopacity={0.5}
				{map}
			/>
		</div>
		<div class="legend" id="business-civic-legend">
			<h4>Civic Infrastructure</h4>
			<LegendItem
				variant={'circle'}
				label={'Arts and Culture'}
				bgcolor={'#DB3069'}
				bordercolor={'#fff'}
				button={true}
				id={'canada-civicinfra-arts-culture'}
				{map}
			/>
			<LegendItem
				variant={'circle'}
				label={'Government and Community Services'}
				bgcolor={'#8A4285'}
				bordercolor={'#fff'}
				button={true}
				id={'canada-civicinfra-govt-community'}
				{map}
			/>
			<LegendItem
				variant={'circle'}
				label={'Recreation and Facilities'}
				bgcolor={'#43B171'}
				bordercolor={'#fff'}
				button={true}
				id={'canada-civicinfra-recreation'}
				{map}
			/>
			<LegendItem
				variant={'circle'}
				label={'Health and Care Facilities'}
				bgcolor={'#33AED7'}
				bordercolor={'#fff'}
				button={true}
				id={'canada-civicinfra-health-care'}
				{map}
			/>
			<LegendItem
				variant={'circle'}
				label={'Education'}
				bgcolor={'#F45D01'}
				bordercolor={'#fff'}
				button={true}
				id={'canada-civicinfra-education'}
				{map}
			/>
			<h4>Business</h4>
			<LegendItem
				variant={'circle'}
				label={'Retail'}
				bgcolor={'#F13737'}
				bordercolor={'#fff'}
				button={true}
				id={'canada-business-retail'}
				{map}
			/>
			<LegendItem
				variant={'circle'}
				label={'Services and Other'}
				bgcolor={'#2a5cac'}
				bordercolor={'#fff'}
				button={true}
				id={'canada-business-services-other'}
				{map}
			/>
			<LegendItem
				variant={'circle'}
				label={'Food and Drink'}
				bgcolor={'#58420e'}
				bordercolor={'#fff'}
				button={true}
				id={'canada-business-food-drink'}
				{map}
			/>
		</div>
		</div>
		<button id="resetButton" on:click={resetMap}>
			<Icon icon="mi:undo" /> Reset Map
		</button>
	</div>
</div>

<style>
	:global(body) {
		padding: 0px;
		margin: 0px;
		background-color: white;
		height: 100%;
	}

	p {
		color: #222;
		margin: 0 auto;
		font-size: 0.8em;
	}

	#map {
		height: 90vh;
		width: 100%;
		position: relative;
	}

	#content-container {
		display: flex;
		flex-direction: row;
		overflow: hidden;
	}

	#sidebar {
		width: 30vw;
		display: flex;
		flex-direction: column;
		padding: 0.5em 1em 0.5em 1em;
		border-right: 1px solid #eee;
		overflow-y: scroll;
		overflow-x: hidden;
		height: 90vh;
	}

	#controls {
		display: flex;
		flex-direction: column;
		border-left: 1px solid #eee;
		padding: 0.5em;
		width: 25vw;
		justify-content: space-between;
	}

	#resetButton {
		border: 1px solid rgba(28, 32, 36, 0.302);
		background-color: rgb(250, 251, 252);
		border-radius: 0.5em;
		box-shadow: rgba(27, 31, 35, 0.04) 0px 1px 0px 0px,
			rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset;
		opacity: 1;
		width: 100%;
		display: none;
		padding: 0.5em;
		margin: 0 0 0.5em 0;
		align-items: center;
		justify-content: center;
	}

	#resetButton:hover {
		cursor: pointer;
		box-shadow: 0px 1px 0px 0px rgba(27, 31, 35, 0.04),
			inset 0px 1px 0px 0px hsla(0, 0%, 100%, 0.25);
		background-color: #f3f4f6;
		transition: 0.3s;
	}

	#business-civic-legend {
		transition: opacity 0.3s, visibility 0.3s;
		opacity: 0;
		visibility: hidden;
	}

	.metric-container {
		display: flex;
		flex-direction: row;
		gap: 0.5em;
		/*width: 20vw;*/
	}

	h2 {
		text-align: center;
	}

	h6 {
		margin:0.5em 0 0.5em 0;
	}

	@media screen and (min-width: 640px) {
		.legend {
			background-color: #fff;
			padding: 1em;
			border-radius: 0.6em;
			border: 1px solid #eee;
			margin: 0 0 0.5em 0;
		}
	}

	hr {
		border: 0.5px solid #eee;
		width: 100%;
	}
</style>
