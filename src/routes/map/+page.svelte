<script>
	import '../styles.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import mapboxgl from 'mapbox-gl';
	import * as turf from '@turf/turf';
	import Icon from '@iconify/svelte';
	import { Tabs } from 'bits-ui';
	import '../styles.css'

	import LegendItem from '../lib/ui/legends/LegendItem.svelte';
	import Metric from '../lib/ui/Metric.svelte';
	import Accordion from '../lib/ui/Accordion.svelte';
	import Footer from '../lib/Footer.svelte';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	export let map;

	// info
	let streetname = 'Canada';
	let place = 'Main Streets';

	// basic

	let population = '29,482,761';
	let populationchange = '';
	let employees = '1,692,453';

	// business
	let business = '397,476';
	let business_retail = '185,241';
	let business_services = '143,274';
	let business_food_drink = '68,960';

	let independent_business = 0.52; //BII_avg

	let retail_min = '0';
	let retail_max = '0';

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
	let otherlang = 20;

	/*---------- PERCENTILES --------------*/

	let per_Age0_19 = '';
	let per_Age20_64 = '';
	let per_Age65_Over = '';
	let per_AptLess5 = '';
	let per_AptMore5 = '';
	let per_Arts = '';
	let per_AvgAge = '';
	let per_AvgEmpInc = '';
	let per_BIIavg = '';
	let per_BusDensity = '';
	let per_CivDensity = '';
	let per_CommOver60 = '';
	let per_CommT15 = '';
	let per_CommT30 = '';
	let per_CommT45 = '';
	let per_CommT60 = '';
	let per_Density = '';
	let per_Duplex = '';
	let per_Education = '';
	let per_EmpDensity = '';
	let per_FoodDrink = '';
	let per_GovandCom = '';
	let per_HHSize = '';
	let per_HHs = '';
	let per_Healthcare = '';
	let per_ImmNPR = '';
	let per_Indig = '';
	let per_LanEng = '';
	let per_LanFr = '';
	let per_LanOth = '';
	let per_LocalService = '';
	let per_MobAct = '';
	let per_MobCar = '';
	let per_MobPT = '';
	let per_Pop = '';
	let per_PopChng = '';
	let per_Recreation = '';
	let per_Retail = '';
	let per_Retailmax = '';
	let per_Retailmin = '';
	let per_SemiDetach = '';
	let per_SinDetach = '';
	let per_VM = '';

	let geocoder;

	onMount(() => {
		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/canadianurbaninstitute/cltogc52e020c01ph6xvyfbgz?fresh=true', //'mapbox://styles/canadianurbaninstitute/clpa3pw06003901qr8j8v7rjj?fresh=true',
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

			map.addControl(geocoder, 'top-left');

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
				'mainstreets-base'
			);

			map.addLayer(
				{
					id: 'canada-DAs-highlighted',
					type: 'fill',
					source: 'canada-DAs',
					'source-layer': 'canadaDAs',
					paint: {
						'fill-outline-color': '#DB3069',
						'fill-color': '#db799a',
						'fill-opacity': 0.4
					},
					filter: ['in', 'DAUID', '']
				},
				// Place polygons under labels, roads and buildings.
				'mainstreets-base'
			);
		});

		// function for adding percentile suffixes

		function nth(n) {
			return ['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th';
		}

		map.on('click', ['mainstreets-low-density', 'mainstreets-high-density'], (e) => {
			// map zooming
			const endpoints = e.features[0].geometry.coordinates;
			const midpoint = turf.midpoint(endpoints[0], endpoints[1]);

			map.flyTo({
				center: midpoint.geometry.coordinates,
				zoom: 13
			});

			// button

			document.getElementById('resetButton').style.display = 'flex';
			document.getElementById('catchment').style.display = 'block';

			// general

			streetname = e.features[0].properties.Street_Name;
			place = e.features[0].properties.City_Name;

			population = e.features[0].properties.Pop;
			populationchange =
				' (' +
				(e.features[0].properties.PopChng >= 0 ? '+' : '') +
				e.features[0].properties.PopChng.toFixed(1) +
				'%)';
			employees = e.features[0].properties.total_emp.toFixed(0);

			// business

			business =
				e.features[0].properties.Food_Drink +
				e.features[0].properties.Retail +
				e.features[0].properties.Local_Service;
			business_food_drink = e.features[0].properties.Food_Drink;
			business_retail = e.features[0].properties.Retail;
			business_services = e.features[0].properties.Local_Service;
			independent_business = e.features[0].properties.BII_avg.toFixed(2);
			retail_min = e.features[0].properties.Retail_min;
			retail_max = e.features[0].properties.Retail_max;

			// civic

			civic =
				e.features[0].properties.Arts +
				e.features[0].properties.Education +
				e.features[0].properties.GovandCom +
				e.features[0].properties.Healthcare +
				e.features[0].properties.Recreation;
			civic_arts_culture = e.features[0].properties.Arts;
			civic_education = e.features[0].properties.Education;
			civic_govt_community = e.features[0].properties.GovandCom;
			civic_healthcare = e.features[0].properties.Healthcare;
			civic_recreation = e.features[0].properties.Recreation;

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

			dwellings = e.features[0].properties.total_dwellings.toFixed(0);
			singledetached = e.features[0].properties.SinDetach.toFixed(0);
			semidetached = e.features[0].properties.SemiDetach.toFixed(0);
			duplex = e.features[0].properties.Duplex.toFixed(0);
			apartments_more_than_5 = e.features[0].properties.AptMore5.toFixed(0);
			apartments_less_than_5 = e.features[0].properties.AptLess5.toFixed(0);

			//language

			english = e.features[0].properties.LanEng.toFixed(0);
			french = e.features[0].properties.LanFr.toFixed(0);
			otherlang = e.features[0].properties.LanOth.toFixed(0);

			/* --------- PERCENTILES ------------- */

			per_Age0_19 = e.features[0].properties.per_Age0_19.toFixed(0);
			per_Age20_64 = e.features[0].properties.per_Age20_64.toFixed(0);
			per_Age65_Over = e.features[0].properties.per_Age65_Over.toFixed(0);
			per_AptLess5 = e.features[0].properties.per_AptLess5.toFixed(0);
			per_AptMore5 = e.features[0].properties.per_AptMore5.toFixed(0);
			per_Arts = e.features[0].properties.per_Arts.toFixed(0);
			per_AvgAge = e.features[0].properties.per_AvgAge.toFixed(0);
			per_AvgEmpInc = e.features[0].properties.per_AvgEmpInc.toFixed(0);
			per_BIIavg = e.features[0].properties.per_BIIavg.toFixed(0);
			per_BusDensity = e.features[0].properties.per_BusDensity.toFixed(0);
			per_CivDensity = e.features[0].properties.per_CivDensity.toFixed(0);
			per_CommOver60 = e.features[0].properties.per_CommOver60.toFixed(0);
			per_CommT15 = e.features[0].properties.per_CommT15.toFixed(0);
			per_CommT30 = e.features[0].properties.per_CommT30.toFixed(0);
			per_CommT45 = e.features[0].properties.per_CommT45.toFixed(0);
			per_CommT60 = e.features[0].properties.per_CommT60.toFixed(0);
			per_Density = e.features[0].properties.per_Density.toFixed(0);
			per_Duplex = e.features[0].properties.per_Duplex.toFixed(0);
			per_Education = e.features[0].properties.per_Education.toFixed(0);
			per_EmpDensity = e.features[0].properties.per_EmpDensity.toFixed(0);
			per_FoodDrink = e.features[0].properties.per_FoodDrink.toFixed(0);
			per_GovandCom = e.features[0].properties.per_GovandCom.toFixed(0);
			per_HHSize = e.features[0].properties.per_HHSize.toFixed(0);
			per_HHs = e.features[0].properties.per_HHs.toFixed(0);
			per_Healthcare = e.features[0].properties.per_Healthcare.toFixed(0);
			per_ImmNPR = e.features[0].properties.per_ImmNPR.toFixed(0);
			per_Indig = e.features[0].properties.per_Indig.toFixed(0);
			per_LanEng = e.features[0].properties.per_LanEng.toFixed(0);
			per_LanFr = e.features[0].properties.per_LanFr.toFixed(0);
			per_LanOth = e.features[0].properties.per_LanOth.toFixed(0);
			per_LocalService = e.features[0].properties.per_LocalService.toFixed(0);
			per_MobAct = e.features[0].properties.per_MobAct.toFixed(0);
			per_MobCar = e.features[0].properties.per_MobCar.toFixed(0);
			per_MobPT = e.features[0].properties.per_MobPT.toFixed(0);
			per_Pop = e.features[0].properties.per_Pop.toFixed(0);
			per_PopChng = e.features[0].properties.per_PopChng.toFixed(0);
			per_Recreation = e.features[0].properties.per_Recreation.toFixed(0);
			per_Retail = e.features[0].properties.per_Retail.toFixed(0);
			per_Retailmax = e.features[0].properties.per_Retailmax.toFixed(0);
			per_Retailmin = e.features[0].properties.per_Retailmin.toFixed(0);
			per_SemiDetach = e.features[0].properties.per_SemiDetach.toFixed(0);
			per_SinDetach = e.features[0].properties.per_SinDetach.toFixed(0);
			per_VM = e.features[0].properties.per_VM.toFixed(0);

			// highlighting road

			let features = map.queryRenderedFeatures(e.point, {
				layers: ['mainstreets-low-density', 'mainstreets-high-density']
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
			// }, 'mainstreets-base');

			map.addLayer({
				id: 'selectedRoad',
				type: 'line',
				source: 'selectedRoad',
				layout: {
					'line-join': 'round',
					'line-cap': 'round'
				},
				paint: {
					'line-color': '#DB3069',
					'line-width': 5
				}
			});
		});

		map.on('click', 'case-study-BIAs', (e) => {
			const path = e.features[0].properties.path;
			goto('/casestudies/' + path);
		});

		// Change the cursor to a pointer when
		// the mouse is over the states layer.
		map.on(
			'mouseenter',
			['mainstreets-low-density', 'mainstreets-high-density', 'case-study-BIAs'],
			() => {
				map.getCanvas().style.cursor = 'pointer';
			}
		);

		// Change the cursor back to a pointer
		// when it leaves the states layer.
		map.on(
			'mouseleave',
			['mainstreets-low-density', 'mainstreets-high-density', 'case-study-BIAs'],
			() => {
				map.getCanvas().style.cursor = '';
			}
		);

		map.on('zoom', () => {
			if (map.getZoom() > 11) {
				// Show the HTML element
				document.getElementById('business-civic-legend').style.opacity = '1';
				document.getElementById('business-civic-legend').style.visibility = 'visible';
				document.getElementById('case-studies').style.display = 'block';
			} else {
				// Hide the HTML element
				document.getElementById('business-civic-legend').style.opacity = '0';
				document.getElementById('business-civic-legend').style.visibility = 'hidden';
				document.getElementById('case-studies').style.display = 'none';
			}
		});
	});

	// Reset Map

	function resetMap() {
		document.getElementById('resetButton').style.display = 'none';
		document.getElementById('catchment').style.display = 'none';

		// reset geocoder
		geocoder.clear();
		document.getElementsByClassName('mapboxgl-ctrl-geocoder--input')[0].blur();

		map.flyTo({
			zoom: 3.2,
			center: [-89, 58]
		});

		// info
		streetname = 'Canada';
		place = 'Main Streets';

		// basic

		population = '29,482,761';
		populationchange = '';
		employees = '1,692,453';

		// business
		business = '397,476';
		business_retail = '185,241';
		business_services = '143,274';
		business_food_drink = '68,960';

		independent_business = 0.52; //BII_avg
		retail_min = '0';
		retail_max = '0';

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
		otherlang = 20;

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

<div class="hero">
	<h1>Main Street Map</h1>
	<p>
		This is a map of main streets in Canada. Search for a place or navigate the map using the
		controls and click on a main street to see information associated with it.
	</p>
</div>

<div id="content-container">
	<div id="sidebar">
		<h2>{streetname}</h2>
		<h4>{place}</h4>
		<hr />
		<Tabs.Root value="measures">
			<Tabs.List class="tab-container">
				<Tabs.Trigger value="measures">Measures</Tabs.Trigger>
				<Tabs.Trigger value="percentiles">Percentiles</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="measures" class="tab-button">
				<div id="raw-number-measures">
					<h5>Street Characteristics</h5>
					<Accordion>
						<Metric
							accordion
							slot="header"
							label={'Civic Infrastructure (on street)'}
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
						<Metric
							accordion
							slot="header"
							label={'Businesses (on street)'}
							value={business}
							icon={'mdi:building'}
						/>
						<div slot="body" class="metric-container">
							<Metric label={'Retail'} value={business_retail} icon={'mdi:shopping'} />
							<Metric label={'Food & Drink'} value={business_food_drink} icon={'dashicons:food'} />
							<Metric label={'Services'} value={business_services} icon={'mdi:ticket'} />
						</div>
					</Accordion>
					<Metric
						label={'Independent Business Index'}
						value={independent_business}
						icon={'mdi:shop'}
					/>
					<Metric
						label={'Estimated Retail Sales (2023)'}
						value={'$' + retail_min.toLocaleString() + ' - ' + '$' + retail_max.toLocaleString()}
						icon={'mdi:graph-line'}
					/>
					<hr />
					<h5>Neighbourhood Characteristics</h5>
					<h6>Demographic</h6>
					<Metric
						label={'Population (% change since 2016)'}
						value={population + populationchange}
						icon={'fluent:people-20-filled'}
					/>
					<Metric label={'Employees'} value={employees} icon={'mdi:briefcase'} />
					<div class="metric-container">
						<Metric
							label={'Average Income'}
							prefix={'$'}
							value={income.toLocaleString()}
							icon={'mdi:wallet'}
						/>
						<Metric
							label={"Bachelor's Degree"}
							value={education}
							suffix={'%'}
							icon={'mdi:school'}
						/>
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
						<Metric
							label={'Recent Immigrants'}
							value={immigrants}
							suffix={'%'}
							icon={'mdi:globe'}
						/>
						<Metric
							label={'Visible Minorities'}
							value={visibleminority}
							suffix={'%'}
							icon={'material-symbols:handshake'}
						/>
						<Metric
							label={'Indigenous Population'}
							value={indigenous}
							suffix={'%'}
							icon={'mdi:person'}
						/>
					</div>
					<div class="metric-container">
						<Metric label={'English Speakers'} value={english} suffix={'%'} />
						<Metric label={'French Speakers'} value={french} suffix={'%'} />
						<Metric label={'Other Language'} value={otherlang} suffix={'%'} />
					</div>
					<h6>Commuting</h6>
					<div class="metric-container">
						<Metric label={'Car'} value={car} suffix={'%'} icon={'mdi:car'} />
						<Metric label={'Public Transit'} value={public_transit} suffix={'%'} icon={'mdi:bus'} />
						<Metric
							label={'Active Transit'}
							value={active_transit}
							suffix={'%'}
							icon={'mdi:bike'}
						/>
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
								<Metric
									label={'Apartment (>5 stories)'}
									value={apartments_more_than_5}
									suffix={'%'}
								/>
								<Metric
									label={'Apartment (<5 stories)'}
									value={apartments_less_than_5}
									suffix={'%'}
								/>
							</div>
						</div>
					</Accordion>
				</div>
			</Tabs.Content>
			<Tabs.Content value="percentiles" class="tab-button">
				<div id="percentile-measures">
					<h5>Street Characteristics</h5>
					<Accordion>
						<Metric
							accordion
							slot="header"
							label={'Civic Infrastructure (on street)'}
							value={per_CivDensity}
							suffix={'%'}
							icon={'heroicons:building-library-20-solid'}
						/>
						<div slot="body">
							<div class="metric-container">
								<Metric
									label={'Education'}
									value={per_Education}
									suffix={'%'}
									icon={'mdi:school'}
								/>
								<Metric
									label={'Arts & Culture'}
									value={per_Arts}
									suffix={'%'}
									icon={'fa6-solid:masks-theater'}
								/>
								<Metric
									label={'Recreation'}
									value={per_Recreation}
									suffix={'%'}
									icon={'material-symbols:park-rounded'}
								/>
							</div>
							<div class="metric-container">
								<Metric
									label={'Government & Community Services'}
									value={per_GovandCom}
									suffix={'%'}
									icon={'mingcute:government-fill'}
								/>
								<Metric
									label={'Health & Care Facilities'}
									value={per_Healthcare}
									suffix={'%'}
									icon={'mdi:hospital-box'}
								/>
							</div>
						</div>
					</Accordion>
					<Accordion>
						<Metric
							accordion
							slot="header"
							label={'Businesses (on street)'}
							value={per_BusDensity}
							suffix={'%'}
							icon={'mdi:building'}
						/>
						<div slot="body" class="metric-container">
							<Metric label={'Retail'} value={per_Retail} suffix={'%'} icon={'mdi:shopping'} />
							<Metric
								label={'Food & Drink'}
								value={per_FoodDrink}
								suffix={'%'}
								icon={'dashicons:food'}
							/>
							<Metric
								label={'Services'}
								value={per_LocalService}
								suffix={'%'}
								icon={'mdi:ticket'}
							/>
						</div>
					</Accordion>
					<Metric
						label={'Independent Business Index'}
						value={per_BIIavg}
						suffix={'%'}
						icon={'mdi:shop'}
					/>
					<!-- <Metric
						label={'Estimated Retail Sales (2023)'}
						value={per_Retailmin + ' - ' + per_Retailmax}
						icon={'mdi:graph-line'}
					/> -->

					<hr />
					<h5>Neighbourhood Characteristics</h5>
					<h6>Demographic</h6>
					<Metric
						label={'Population (% change since 2016)'}
						value={per_Pop + per_PopChng}
						icon={'fluent:people-20-filled'}
					/>
					<Metric label={'Employees'} value={per_EmpDensity} suffix={'%'} icon={'mdi:briefcase'} />
					<div class="metric-container">
						<Metric
							label={'Average Income'}
							value={per_AvgEmpInc}
							suffix={'%'}
							icon={'mdi:wallet'}
						/>
						<Metric
							label={"Bachelor's Degree"}
							value={per_Education}
							suffix={'%'}
							icon={'mdi:school'}
						/>
					</div>
					<Accordion>
						<Metric
							accordion
							slot="header"
							label={'Average Age'}
							value={per_AvgAge}
							suffix={'%'}
							icon={'mingcute:birthday-2-fill'}
						/>
						<div slot="body" class="metric-container">
							<Metric label={'0 to 19'} value={per_Age0_19} suffix={'%'} />
							<Metric label={'20 to 64'} value={per_Age20_64} suffix={'%'} />
							<Metric label={'65 and over'} value={per_Age65_Over} suffix={'%'} />
						</div>
					</Accordion>
					<div class="metric-container">
						<Metric
							label={'Recent Immigrants'}
							value={per_ImmNPR}
							suffix={'%'}
							icon={'mdi:globe'}
						/>
						<Metric
							label={'Visible Minorities'}
							value={per_VM}
							suffix={'%'}
							icon={'material-symbols:handshake'}
						/>
						<Metric
							label={'Indigenous Population'}
							value={per_Indig}
							suffix={'%'}
							icon={'mdi:person'}
						/>
					</div>
					<div class="metric-container">
						<Metric label={'English Speakers'} value={per_LanEng} suffix={'%'} />
						<Metric label={'French Speakers'} value={per_LanFr} suffix={'%'} />
						<Metric label={'Other Language'} value={per_LanOth} suffix={'%'} />
					</div>
					<h6>Commuting</h6>
					<div class="metric-container">
						<Metric label={'Car'} value={per_MobCar} suffix={'%'} icon={'mdi:car'} />
						<Metric label={'Public Transit'} value={per_MobPT} suffix={'%'} icon={'mdi:bus'} />
						<Metric label={'Active Transit'} value={per_MobAct} suffix={'%'} icon={'mdi:bike'} />
					</div>
					<h6>Housing</h6>
					<Accordion>
						<Metric
							accordion
							slot="header"
							label={'Dwellings'}
							value={dwellings}
							suffix={'%'}
							icon={'material-symbols:apartment'}
						/>
						<div slot="body">
							<div class="metric-container">
								<Metric label={'Single Detached'} value={per_SinDetach} suffix={'%'} />
								<Metric label={'Semi-Detached'} value={per_SinDetach} suffix={'%'} />
								<Metric label={'Duplex'} value={per_Duplex} suffix={'%'} />
							</div>
							<div class="metric-container">
								<Metric label={'Apartment (>5 stories)'} value={per_AptMore5} suffix={'%'} />
								<Metric label={'Apartment (<5 stories)'} value={per_AptLess5} suffix={'%'} />
							</div>
						</div>
					</Accordion>
				</div>
			</Tabs.Content>
		</Tabs.Root>
	</div>
	<div id="map" />
	<div id="controls">
		<div>
			<button id="resetButton" on:click={resetMap}>
				<Icon icon="mi:undo" /> Reset Map
			</button>
			<div class="legend">
				<LegendItem variant={'line'} label={'High Density Main Streets'} bordercolor={'#002940'} />
				<LegendItem variant={'line'} label={'Low Density Main Streets'} bordercolor={'#00adf2'} />
				<LegendItem variant={'line'} label={'Arterial Streets'} bordercolor={'#ddd'} />
				<div id="case-studies">
					<LegendItem
						variant={'polygon'}
						label={'Case Studies'}
						bgcolor={'#58e965'}
						bordercolor={'#189122'}
						button={true}
						id={'case-study-BIAs'}
						featuretype={'fill'}
						targetopacity={0.5}
						{map}
					/>
				</div>
				<div id="catchment">
					<LegendItem
						variant={'polygon'}
						label={'Main Street Catchment'}
						bgcolor={'#db799a'}
						bordercolor={'#DB3069'}
					/>
				</div>
			</div>
			<div class="legend" id="business-civic-legend">
				<h5>Civic Infrastructure</h5>
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
					label={'Govt & Community Services'}
					bgcolor={'#8A4285'}
					bordercolor={'#fff'}
					button={true}
					id={'canada-civicinfra-govt-community'}
					{map}
				/>
				<LegendItem
					variant={'circle'}
					label={'Recreation'}
					bgcolor={'#43B171'}
					bordercolor={'#fff'}
					button={true}
					id={'canada-civicinfra-recreation'}
					{map}
				/>
				<LegendItem
					variant={'circle'}
					label={'Healthcare'}
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
				<h5>Business</h5>
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
					label={'Local Services'}
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
	</div>
</div>
<Footer />

<style>
	:global(body) {
		padding: 0px;
		margin: 0px;
		background-color: white;
		height: 100%;
	}

	p {
		margin-top: 0;
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
		border-top: 1px solid #eee;
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

	#catchment {
		display: none;
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

	#case-studies {
		display: none;
	}

	.metric-container {
		display: flex;
		flex-direction: row;
		gap: 0.5em;
		/*width: 20vw;*/
	}

	h6 {
		margin: 0.5em 0 0.5em 0;
		font-weight: 500;
	}

	h5 {
		font-weight: 600;
		margin: 0.5em 0 0.5em 0;
	}

	h4 {
		font-size: 0.8em;
	}

	h2,
	h4 {
		margin: 0;
		padding: 0.1em 0 0.1em 0;
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
