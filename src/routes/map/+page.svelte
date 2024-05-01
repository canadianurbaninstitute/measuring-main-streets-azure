<script>
	import '../styles.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import mapboxgl from 'mapbox-gl';
	import * as turf from '@turf/turf';
	import Icon from '@iconify/svelte';
	import { Tabs } from 'bits-ui';
	import '../styles.css';

	import LegendItem from '../lib/ui/legends/LegendItem.svelte';
	import Metric from '../lib/ui/Metric.svelte';
	import Accordion from '../lib/ui/Accordion.svelte';
	import Footer from '../lib/Footer.svelte';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	export let map;
	let id;

	// info
	let streetname = 'Canada';
	let place = 'Main Streets';

	// basic

	let population = '29,482,761';
	let populationchange = ' (+5.8%)';
	let employees = '1,692,453';

	// business
	let business = '397,476';
	let business_retail = '185,241';
	let business_services = '143,274';
	let business_food_drink = '68,960';

	let independent_business = 0.52; //BII_avg

	let retail_min = '170,832,364,000';
	let retail_max = '437,305,794,454';

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


	/**** PERCENTILES ****/

	let per_retail;
	let per_local_services;
	let per_food_drink;
	let per_business_count;
	let per_government_community_services;
	let per_healthcare;
	let per_education;
	let per_recreation;
	let per_arts_culture;
	let per_civic_count;
	let per_business_independence_index;
	let per_retail_min;
	let per_retail_max;
	let per_greenspace;
	let per_total_employment;
	let per_population;
	let per_households;
	let per_household_size;
	let per_population_density;
	let per_population_change;
	let per_total_dwellings;
	let per_single_detached;
	let per_semi_detached;
	let per_duplex;
	let per_apartment_more_5;
	let per_apartment_less_5;
	let per_average_age;
	let per_age_0_19;
	let per_age_20_64;
	let per_age_65_Over;
	let per_university_degree;
	let per_visible_minorities;
	let per_immigrants_non_permanent_residents;
	let per_indigenous;
	let per_language_english;
	let per_language_french;
	let per_language_other;
	let per_average_employment_income;
	let per_mobility_car;
	let per_mobility_public_transit;
	let per_mobility_active_transit;


	let geocoder;

	onMount(() => {
		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/canadianurbaninstitute/clurst5kt00a501p27qk6bhvr?fresh=true',
			center: [-89, 58],
			zoom: 3.3,
			maxZoom: 14,
			minZoom: 2,
			scrollZoom: true,
			attributionControl: false
		});

		async function fetchMeasureData(id) {
			const response = await fetch(`/api/mainstreets-measures?id=${id}`);
			if (response.ok) {
				const data = await response.json();
				return data;
			} else {
				console.error('Failed to fetch data');
			}
		}

		async function fetchPercentileData(id) {
			const response = await fetch(`/api/mainstreets-percentile?id=${id}`);
			if (response.ok) {
				const data = await response.json();
				return data;
			} else {
				console.error('Failed to fetch data');
			}
		}

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
			n = parseFloat(n);
			return ['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th';
		}

		map.on('click', ['mainstreets-base', 'mainstreets-base-invisible'], (e) => {

			document.getElementById('percentile-measures').style.display = 'block';
			document.getElementById('percentile-placeholder').style.display = 'none'; 



			// map zooming
			const endpoints = e.features[0].geometry.coordinates;
			const midpoint = turf.midpoint(endpoints[0], endpoints[1]);

			map.flyTo({
				center: midpoint.geometry.coordinates
			});

			// button

			document.getElementById('resetButton').style.display = 'flex';
			document.getElementById('catchment').style.display = 'block';

			// general

			id = e.features[0].properties.id;


			async function returnStreetData() {

				let mainstreet_data = await fetchMeasureData(id);

				/***** street *****/

				streetname = mainstreet_data[0].street_name;
				place = mainstreet_data[0].city_name;

				// business

				business =
					mainstreet_data[0].food_drink +
					mainstreet_data[0].retail +
					mainstreet_data[0].local_services;
				business_food_drink = mainstreet_data[0].food_drink;
				business_retail = mainstreet_data[0].retail;
				business_services = mainstreet_data[0].local_services;
				independent_business = mainstreet_data[0].business_independence_index.toFixed(2);
				retail_min = mainstreet_data[0].retail_min;
				retail_max = mainstreet_data[0].retail_max;

				// civic

				civic =
					mainstreet_data[0].arts_culture +
					mainstreet_data[0].education +
					mainstreet_data[0].government_community_services +
					mainstreet_data[0].healthcare +
					mainstreet_data[0].recreation;
				civic_arts_culture = mainstreet_data[0].arts_culture;
				civic_education = mainstreet_data[0].education;
				civic_govt_community = mainstreet_data[0].government_community_services;
				civic_healthcare = mainstreet_data[0].healthcare;
				civic_recreation = mainstreet_data[0].recreation;

				/***** street *****/

				// population + employees

				population = mainstreet_data[0].population;
				employees = mainstreet_data[0].total_employment.toFixed(0);

				populationchange =
					' (' +
					(mainstreet_data[0].population_change >= 0 ? '+' : '') +
					mainstreet_data[0].population_change.toFixed(1) +
					'%)';

				// demographic

				// income + education

				income = parseFloat(
					mainstreet_data[0].average_employment_income.toFixed(0)
				).toLocaleString();
				education = mainstreet_data[0].university_degree.toFixed(0);

				// age

				average_age = mainstreet_data[0].average_age.toFixed(0);
				age_0_19 = mainstreet_data[0].age_0_19.toFixed(0);
				age_20_64 = mainstreet_data[0].age_20_64.toFixed(0);
				age_over_65 = mainstreet_data[0].age_65_Over.toFixed(0);

				// equity

				immigrants = mainstreet_data[0].immigrants_non_permanent_residents.toFixed(0);
				visibleminority = mainstreet_data[0].visible_minorities.toFixed(0);
				indigenous = mainstreet_data[0].indigenous.toFixed(0);

				// commute

				car = mainstreet_data[0].mobility_car.toFixed(0);
				public_transit = mainstreet_data[0].mobility_public_transit.toFixed(0);
				active_transit = mainstreet_data[0].mobility_active_transit.toFixed(0);

				// housing

				dwellings = mainstreet_data[0].total_dwellings.toFixed(0);
				singledetached = mainstreet_data[0].single_detached.toFixed(0);
				semidetached = mainstreet_data[0].semi_detached.toFixed(0);
				duplex = mainstreet_data[0].duplex.toFixed(0);
				apartments_more_than_5 = mainstreet_data[0].apartment_more_5.toFixed(0);
				apartments_less_than_5 = mainstreet_data[0].apartment_less_5.toFixed(0);

				//language

				english = mainstreet_data[0].language_english.toFixed(0);
				french = mainstreet_data[0].language_french.toFixed(0);
				otherlang = mainstreet_data[0].language_other.toFixed(0);
			}

			async function returnPercentileData() {

				let percentile_data = await fetchPercentileData(id);
				per_retail = percentile_data[0].per_retail + nth(percentile_data[0].per_retail);
				per_local_services = percentile_data[0].per_local_services + nth(percentile_data[0].per_local_services);
				per_food_drink = percentile_data[0].per_food_drink + nth(percentile_data[0].per_food_drink);
				per_business_count = percentile_data[0].per_business_count + nth(percentile_data[0].per_business_count);
				per_government_community_services = percentile_data[0].per_government_community_services + nth(percentile_data[0].per_government_community_services);
				per_healthcare = percentile_data[0].per_healthcare + nth(percentile_data[0].per_healthcare);
				per_education = percentile_data[0].per_education + nth(percentile_data[0].per_education);
				per_recreation = percentile_data[0].per_recreation + nth(percentile_data[0].per_recreation);
				per_arts_culture = percentile_data[0].per_arts_culture + nth(percentile_data[0].per_arts_culture);
				per_civic_count = percentile_data[0].per_civic_count + nth(percentile_data[0].per_civic_count);
				per_business_independence_index = percentile_data[0].per_business_independence_index + nth(percentile_data[0].per_business_independence_index);
				per_retail_min = percentile_data[0].per_retail_min + nth(percentile_data[0].per_retail_min);
				per_retail_max = percentile_data[0].per_retail_max + nth(percentile_data[0].per_retail_max);
				per_greenspace = percentile_data[0].per_greenspace + nth(percentile_data[0].per_greenspace);
				per_total_employment = percentile_data[0].per_total_employment + nth(percentile_data[0].per_total_employment);
				per_population = percentile_data[0].per_population + nth(percentile_data[0].per_population);
				per_households = percentile_data[0].per_households + nth(percentile_data[0].per_households);
				per_household_size = percentile_data[0].per_household_size + nth(percentile_data[0].per_household_size);
				per_population_density = percentile_data[0].per_population_density + nth(percentile_data[0].per_population_density);
				per_population_change = percentile_data[0].per_population_change + nth(percentile_data[0].per_population_change);
				per_total_dwellings = percentile_data[0].per_total_dwellings + nth(percentile_data[0].per_total_dwellings);
				per_single_detached = percentile_data[0].per_single_detached + nth(percentile_data[0].per_single_detached);
				per_semi_detached = percentile_data[0].per_semi_detached + nth(percentile_data[0].per_semi_detached);
				per_duplex = percentile_data[0].per_duplex + nth(percentile_data[0].per_duplex);
				per_apartment_more_5 = percentile_data[0].per_apartment_more_5 + nth(percentile_data[0].per_apartment_more_5);
				per_apartment_less_5 = percentile_data[0].per_apartment_less_5 + nth(percentile_data[0].per_apartment_less_5);
				per_average_age = percentile_data[0].per_average_age + nth(percentile_data[0].per_average_age);
				per_age_0_19 = percentile_data[0].per_age_0_19 + nth(percentile_data[0].per_age_0_19);
				per_age_20_64 = percentile_data[0].per_age_20_64 + nth(percentile_data[0].per_age_20_64);
				per_age_65_Over = percentile_data[0].per_age_65_Over + nth(percentile_data[0].per_age_65_Over);
				per_university_degree = percentile_data[0].per_university_degree + nth(percentile_data[0].per_university_degree);
				per_visible_minorities = percentile_data[0].per_visible_minorities + nth(percentile_data[0].per_visible_minorities);
				per_immigrants_non_permanent_residents = percentile_data[0].per_immigrants_non_permanent_residents + nth(percentile_data[0].per_immigrants_non_permanent_residents);
				per_indigenous = percentile_data[0].per_indigenous + nth(percentile_data[0].per_indigenous);
				per_language_english = percentile_data[0].per_language_english + nth(percentile_data[0].per_language_english);
				per_language_french = percentile_data[0].per_language_french + nth(percentile_data[0].per_language_french);
				per_language_other = percentile_data[0].per_language_other + nth(percentile_data[0].per_language_other);
				per_average_employment_income = percentile_data[0].per_average_employment_income + nth(percentile_data[0].per_average_employment_income);
				per_mobility_car = percentile_data[0].per_mobility_car + nth(percentile_data[0].per_mobility_car);
				per_mobility_public_transit = percentile_data[0].per_mobility_public_transit + nth(percentile_data[0].per_mobility_public_transit);
				per_mobility_active_transit = percentile_data[0].per_mobility_active_transit + nth(percentile_data[0].per_mobility_active_transit);


			}

			returnStreetData();
			returnPercentileData();


			// highlighting road

			let features = map.queryRenderedFeatures(e.point, {
				layers: ['mainstreets-base', 'mainstreets-base-invisible']
			});

			if (!features.length) {
				return;
			}

			if (typeof map.getLayer('selectedRoad') !== 'undefined') {
				map.removeLayer('selectedRoad');
				map.removeSource('selectedRoad');
			}

			let feature = features[0];
			let buffered = turf.buffer(feature, 1);

			map.addSource('selectedRoad', {
				type: 'geojson',
				data: feature.toJSON()
			});

			const turfgeobbox = turf.bbox(buffered);
			const geobboxpoint1 = [turfgeobbox[0], turfgeobbox[1]];
			const geobboxpoint2 = [turfgeobbox[2], turfgeobbox[3]];

			const bboxpoint1 = map.project([turfgeobbox[0], turfgeobbox[1]]);
			const bboxpoint2 = map.project([turfgeobbox[2], turfgeobbox[3]]);

			//const bboxpolygon = turf.bboxPolygon(geobbox)

			const bbox = [bboxpoint1, bboxpoint2];
			const geobbox = [geobboxpoint1, geobboxpoint2];

			map.fitBounds(geobbox);

			// Find features intersecting the bounding box.
			const selectedFeatures = map.queryRenderedFeatures(bbox, {
				layers: ['canada-DAs']
			});

			const dauid = selectedFeatures.map((feature) => feature.properties.DAUID);
			// Set a filter matching selected features by FIPS codes
			// to activate the 'canada-DAs-highlighted' layer.
			map.setFilter('canada-DAs-highlighted', ['in', 'DAUID', ...dauid]);

			map.addLayer(
				{
					id: 'selectedRoad',
					type: 'line',
					source: 'selectedRoad',
					layout: {
						'line-join': 'round',
						'line-cap': 'square'
					},
					paint: {
						'line-color': '#DB3069',
						'line-width': 15,
						'line-opacity': 0.8
					}
				},
				'mainstreets-base-invisible'
			);
		});

		map.on('click', 'case-study-BIAs', (e) => {
			const path = e.features[0].properties.path;
			goto('/casestudies/' + path);
		});

		// Change the cursor to a pointer when
		// the mouse is over the states layer.
		map.on(
			'mouseenter',
			[
				'mainstreets-base',
				'mainstreets-base-invisible',
				'mainstreets-low-density',
				'mainstreets-high-density',
				'case-study-BIAs'
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
				'mainstreets-base',
				'mainstreets-base-invisible',
				'mainstreets-low-density',
				'mainstreets-high-density',
				'case-study-BIAs'
			],
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
		document.getElementById('percentile-measures').style.display = 'none';
		document.getElementById('percentile-placeholder').style.display = 'block'; 
 


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
		populationchange = ' (+5.8%)';
		employees = '1,692,453';

		// business
		business = '397,476';
		business_retail = '185,241';
		business_services = '143,274';
		business_food_drink = '68,960';

		independent_business = 0.52; //BII_avg
		retail_min = '170,832,364,000';
		retail_max = '437,305,794,454';

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
				<div id="percentile-placeholder">
					<p>Click on a street to view percentile measures.</p>
				</div>
				<div id="percentile-measures">
					<h5>Street Characteristics</h5>
					<Accordion>
						<Metric
							accordion
							slot="header"
							label={'Civic Infrastructure (on street)'}
							value={per_civic_count}
							suffix={' Percentile'}
							icon={'heroicons:building-library-20-solid'}
						/>
						<div slot="body">
							<div class="metric-container">
								<Metric
									label={'Education'}
									value={per_education}
									suffix={' Percentile'}
									icon={'mdi:school'}
								/>
								<Metric
									label={'Arts & Culture'}
									value={per_arts_culture}
									suffix={' Percentile'}
									icon={'fa6-solid:masks-theater'}
								/>
								<Metric
									label={'Recreation'}
									value={per_recreation}
									suffix={' Percentile'}
									icon={'material-symbols:park-rounded'}
								/>
							</div>
							<div class="metric-container">
								<Metric
									label={'Government & Community Services'}
									value={per_government_community_services}
									suffix={' Percentile'}
									icon={'mingcute:government-fill'}
								/>
								<Metric
									label={'Health & Care Facilities'}
									value={per_healthcare}
									suffix={' Percentile'}
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
							value={per_business_count}
							suffix={' Percentile'}
							icon={'mdi:building'}
						/>
						<div slot="body" class="metric-container">
							<Metric label={'Retail'} 
							value={per_retail} 
							suffix={' Percentile'}
							icon={'mdi:shopping'} />
							<Metric
								label={'Food & Drink'}
								value={per_food_drink}
								suffix={' Percentile'}
								icon={'dashicons:food'}
							/>
							<Metric
								label={'Services'}
								value={per_local_services}
								suffix={' Percentile'}
								icon={'mdi:ticket'}
							/>
						</div>
					</Accordion>
					<Metric
						label={'Independent Business Index'}
						value={per_business_independence_index}
						suffix={' Percentile'}
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
						label={'Population'}
						value={per_population}
						suffix={' Percentile'}
						icon={'fluent:people-20-filled'}
					/>
					<Metric label={'Employees'} value={per_total_employment} suffix={'  Percentile'} icon={'mdi:briefcase'} />
					<div class="metric-container">
						<Metric
							label={'Average Income'}
							value={per_average_employment_income}
							suffix={' Percentile'}
							icon={'mdi:wallet'}
						/>
						<Metric
							label={"Bachelor's Degree"}
							value={per_university_degree}
							suffix={' Percentile'}
							icon={'mdi:school'}
						/>
					</div>
					<Accordion>
						<Metric
							accordion
							slot="header"
							label={'Average Age'}
							value={per_average_age}
							suffix={' Percentile'}
							icon={'mingcute:birthday-2-fill'}
						/>
						<div slot="body" class="metric-container">
							<Metric label={'0 to 19'} value={per_age_0_19} suffix={' Percentile'} />
							<Metric label={'20 to 64'} value={per_age_20_64} suffix={' Percentile'} />
							<Metric label={'65 and over'} value={per_age_65_Over} suffix={' Percentile'} />
						</div>
					</Accordion>
					<div class="metric-container">
						<Metric
							label={'Recent Immigrants'}
							value={per_immigrants_non_permanent_residents}
							suffix={' Percentile'}
							icon={'mdi:globe'}
						/>
						<Metric
							label={'Visible Minorities'}
							value={per_visible_minorities}
							suffix={' Percentile'}
							icon={'material-symbols:handshake'}
						/>
						<Metric
							label={'Indigenous Population'}
							value={per_indigenous}
							suffix={' Percentile'}
							icon={'mdi:person'}
						/>
					</div>
					<div class="metric-container">
						<Metric label={'English Speakers'} value={per_language_english} suffix={' Percentile'} />
						<Metric label={'French Speakers'} value={per_language_french} suffix={' Percentile'} />
						<Metric label={'Other Language'} value={per_language_other} suffix={' Percentile'} />
					</div>
					<h6>Commuting</h6>
					<div class="metric-container">
						<Metric label={'Car'} value={per_mobility_car} suffix={' Percentile'} icon={'mdi:car'} />
						<Metric label={'Public Transit'} value={per_mobility_public_transit} suffix={' Percentile'} icon={'mdi:bus'} />
						<Metric label={'Active Transit'} value={per_mobility_active_transit} suffix={' Percentile'} icon={'mdi:bike'} />
					</div>
					<h6>Housing</h6>
					<Accordion>
						<Metric
							accordion
							slot="header"
							label={'Dwellings'}
							value={per_total_dwellings}
							suffix={' Percentile'}
							icon={'material-symbols:apartment'}
						/>
						<div slot="body">
							<div class="metric-container">
								<Metric label={'Single Detached'} value={per_single_detached} suffix={' Percentile'} />
								<Metric label={'Semi-Detached'} value={per_semi_detached} suffix={' Percentile'} />
								<Metric label={'Duplex'} value={per_duplex} suffix={' Percentile'} />
							</div>
							<div class="metric-container">
								<Metric label={'Apartment (>5 stories)'} value={per_apartment_more_5} suffix={' Percentile'} />
								<Metric label={'Apartment (<5 stories)'} value={per_apartment_less_5} suffix={' Percentile'} />
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
				<div id="catchment">
					<LegendItem variant={'polygon'} label={'Selected Street'} bgcolor={'#DB3069'} />
					<LegendItem variant={'polygon'} label={'Neighborhood Catchment'} bgcolor={'#db799a'} />
				</div>
			</div>
			<div class="legend" id="business-civic-legend">
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

	p {
		margin-top: 0;
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

	#percentile-measures {
		display:none;
	}

	#percentile-placeholder {
		display:flex;
	text-align: center;
	margin-top: 1em;
	}

	#controls {
		display: flex;
		flex-direction: column;
		padding: 0.5em;
		width: 100%;
		justify-content: space-between;
		border-top: 1px solid #eee;
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

	.legend {
		background-color: #fff;
		padding: 1em;
		border-radius: 0.6em;
		border: 1px solid #eee;
		margin: 0 0 0.5em 0;
		order: 0;
	}

	@media only screen and (min-width: 768px) {
		#content-container {
			flex-direction: row;
		}

		#sidebar {
			width: 35vw;
			border-right: 1px solid #eee;

		}

		#controls {
			width: 25vw;
			border-left: 1px solid #eee;
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
