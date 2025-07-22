<script>
	// Import styles and Svelte functionality
	import '../styles.css'; // Main stylesheet
	import { onMount } from 'svelte'; // Svelte lifecycle hook
	import { goto } from '$app/navigation'; // SvelteKit navigation

	// Import Mapbox GL JS for interactive maps
	import mapboxgl from 'mapbox-gl';

	// Import Turf.js for geospatial operations
	import * as turf from '@turf/turf';
	import Icon from '@iconify/svelte';

	import { driver } from 'driver.js'; // For guided tutorial
	import 'driver.js/dist/driver.css'; // Tutorial styles

	// Custom Svelte components for UI
	import LegendItem from '../lib/ui/legends/LegendItem.svelte';
	import Metric from '../lib/ui/Metric.svelte';
	import Accordion from '../lib/ui/Accordion.svelte';
	import Footer from '../lib/ui/Footer.svelte';

	// Set Mapbox access token
	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	// Exported map variable (for child components)
	export let map;
	let id; // Selected street segment id

	// --- Sidebar Info State ---
	// Default values for sidebar metrics (Canada-wide)
	let streetname = 'Canada';
	let place = 'Main Streets';

	// Population and employment
	let population = '29,482,761';
	let populationchange = ' (+5.8%)';
	let employees = '1,692,453';

	// Business metrics
	let business = '397,476';
	let business_retail = '185,241';
	let business_services = '143,274';
	let business_food_drink = '68,960';
	let independent_business = 0.52; //BII_avg
	let retail_min = '170,832,364,000';
	let retail_max = '437,305,794,454';

	// Civic infrastructure metrics
	let civic = '197,035';
	let civic_govt_community = '59,272';
	let civic_healthcare = '80,252';
	let civic_education = '34,858';
	let civic_arts_culture = '8,551';
	let civic_recreation = '14,101';

	// Demographic metrics
	// Income and education
	let income = 76427;
	let education = 28;

	// Age breakdown
	let average_age = 41;
	let age_0_19 = 20;
	let age_20_64 = 61;
	let age_over_65 = 19;

	// Equity metrics
	let immigrants = 28.4;
	let visibleminority = 29.4;
	let indigenous = 3.9;

	// Commute mode share
	let car = 76;
	let public_transit = 15;
	let active_transit = 8;

	// Housing metrics
	let dwellings = '11,936,445';
	let singledetached = 49;
	let semidetached = 5;
	let duplex = 6;
	let apartments_more_than_5 = 11;
	let apartments_less_than_5 = 19;

	// Language breakdown
	let french = 18;
	let english = 62;
	let otherlang = 20;

	let geocoder; // Mapbox geocoder instance
	let driverObj; // Driver.js tutorial instance

	// Start the guided tutorial
	function initiateTutorial() {
		driverObj.drive();
	}

	// Svelte lifecycle: runs after component is mounted
	onMount(() => {
		// --- Initialize Mapbox map ---
		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/canadianurbaninstitute/clurst5kt00a501p27qk6bhvr',
			center: [-89, 58], // Center of Canada
			zoom: 3.3,
			maxZoom: 14,
			minZoom: 2,
			scrollZoom: true,
			attributionControl: false
		});

		// Add navigation controls (zoom, rotate)
		map.addControl(new mapboxgl.NavigationControl(), 'top-right');

		// Add custom attribution
		map.addControl(
			new mapboxgl.AttributionControl({
				customAttribution: 'Canadian Urban Institute'
			})
		);

		// --- Geocoder Search ---
		map.on('load', () => {
			// Add Mapbox geocoder for place search
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

			// Show reset button when search results are returned
			geocoder.on('results', function (results) {
				document.getElementById('resetButton').style.display = 'flex'; // Show the button
			});

			map.addControl(geocoder, 'top-left');

			// Add vector source for Canadian Dissemination Areas (DAs)
			map.addSource('canada-DAs', {
				type: 'vector',
				url: 'mapbox://canadianurbaninstitute.dayeanmd'
			});

			// Add invisible DA polygons (for highlighting later)
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

			// Add highlighted DA polygons (for catchment display)
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

		// --- Guided Tutorial Setup ---
		driverObj = driver({
			showProgress: true,
			steps: [
				{
					element: '.hero',
					popover: {
						title: 'Main Street Map',
						description: 'Welcome to the main street map tutorial.',
						side: 'left',
						align: 'start'
					}
				},
				{
					element: '#map',
					popover: {
						title: 'Main Street Map',
						description:
							'This is an interactive map of all the main streets in Canada. Search for a place or navigate the map by scrolling or zooming; and then click on a street segment.',
						side: 'bottom',
						align: 'start'
					}
				},
				{
					element: '#sidebar',
					popover: {
						title: 'Information',
						description:
							'After you click on a street segment, you can see information associated with the street in this panel.',
						side: 'left',
						align: 'start'
					}
				},
				{
					element: '#controls',
					popover: {
						title: 'Legend',
						description: 'This is a dynamic legend that updates as layers come in and out of view.',
						side: 'left',
						align: 'start'
					}
				},
				{
					element: '#tutorial',
					popover: {
						title: 'Tutorial',
						description:
							"Congratulations, you've completed the tutorial! You can revisit it at anytime by clicking this button.",
						side: 'left',
						align: 'start'
					}
				}
			]
		});

		// --- First-Time Visitor Tutorial ---
		if (typeof sessionStorage !== 'undefined') {
			const hasVisitedBefore = sessionStorage.getItem('hasVisitedBefore');

			if (!hasVisitedBefore) {
				// Run the tutorial for the first-time visitor
				initiateTutorial();

				// Set the flag in localStorage
				sessionStorage.setItem('hasVisitedBefore', 'true');
			}
		}

		// --- Fetch street-level data for a given segment id ---
		async function fetchMeasureData(id) {
			const response = await fetch(`/mainstreets-measures?id=${id}`);
			if (response.ok) {
				const data = await response.json();
				return data;
			} else {
				console.error('Failed to fetch data');
			}
		}

		// --- Map click handler for main street segments ---
		map.on('click', ['mainstreets-base', 'mainstreets-base-invisible'], (e) => {
			// Get endpoints of clicked street segment
			const endpoints = e.features[0].geometry.coordinates;
			const midpoint = turf.midpoint(endpoints[0], endpoints[1]);

			// Zoom to the midpoint of the segment
			map.flyTo({
				center: midpoint.geometry.coordinates
			});

			// Show reset and catchment buttons
			document.getElementById('resetButton').style.display = 'flex';
			document.getElementById('catchment').style.display = 'block';

			// Store selected segment id
			id = e.features[0].properties.id;

			// Fetch and update sidebar data for the selected street
			async function returnStreetData() {
				let mainstreet_data = await fetchMeasureData(id);

				/***** street *****/

				// Update street and place names
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
				independent_business = mainstreet_data[0].business_independence_index;
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
					mainstreet_data[0].population_change +
					'%)';

				// demographic

				// income + education
				income = parseFloat(mainstreet_data[0].average_employment_income).toLocaleString();
				education = mainstreet_data[0].university_degree;

				// age
				average_age = mainstreet_data[0].average_age;
				age_0_19 = mainstreet_data[0].age_0_19;
				age_20_64 = mainstreet_data[0].age_20_64;
				age_over_65 = mainstreet_data[0].age_65_Over;

				// equity
				immigrants = mainstreet_data[0].immigrants_non_permanent_residents;
				visibleminority = mainstreet_data[0].visible_minorities;
				indigenous = mainstreet_data[0].indigenous;

				// commute
				car = mainstreet_data[0].mobility_car;
				public_transit = mainstreet_data[0].mobility_public_transit;
				active_transit = mainstreet_data[0].mobility_active_transit;

				// housing
				dwellings = mainstreet_data[0].total_dwellings;
				singledetached = mainstreet_data[0].single_detached;
				semidetached = mainstreet_data[0].semi_detached;
				duplex = mainstreet_data[0].duplex;
				apartments_more_than_5 = mainstreet_data[0].apartment_more_5;
				apartments_less_than_5 = mainstreet_data[0].apartment_less_5;

				//language
				english = mainstreet_data[0].language_english;
				french = mainstreet_data[0].language_french;
				otherlang = mainstreet_data[0].language_other;
			}

			// Fetch and update sidebar
			returnStreetData();

			// --- Highlighting selected road segment ---
			let features = map.queryRenderedFeatures(e.point, {
				layers: ['mainstreets-base', 'mainstreets-base-invisible']
			});

			if (!features.length) {
				return;
			}

			// Remove previous highlight if exists
			if (typeof map.getLayer('selectedRoad') !== 'undefined') {
				map.removeLayer('selectedRoad');
				map.removeSource('selectedRoad');
			}

			let feature = features[0];
			let buffered = turf.buffer(feature, 1); // Buffer for catchment

			// Add GeoJSON source for selected road
			map.addSource('selectedRoad', {
				type: 'geojson',
				data: feature.toJSON()
			});

			// Calculate bounding box for catchment
			const turfgeobbox = turf.bbox(buffered);
			const geobboxpoint1 = [turfgeobbox[0], turfgeobbox[1]];
			const geobboxpoint2 = [turfgeobbox[2], turfgeobbox[3]];

			const bboxpoint1 = map.project([turfgeobbox[0], turfgeobbox[1]]);
			const bboxpoint2 = map.project([turfgeobbox[2], turfgeobbox[3]]);

			const bbox = [bboxpoint1, bboxpoint2];
			const geobbox = [geobboxpoint1, geobboxpoint2];

			// Zoom to bounding box
			map.fitBounds(geobbox);

			// Find features intersecting the bounding box.
			const selectedFeatures = map.queryRenderedFeatures(bbox, {
				layers: ['canada-DAs']
			});

			const dauid = selectedFeatures.map((feature) => feature.properties.DAUID);
			// Set a filter matching selected features by FIPS codes
			// to activate the 'canada-DAs-highlighted' layer.
			map.setFilter('canada-DAs-highlighted', ['in', 'DAUID', ...dauid]);

			// Add highlight layer for selected road
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

		// --- Click handler for case study BIAs ---
		map.on('click', 'case-study-BIAs', (e) => {
			const path = e.features[0].properties.path;
			goto('/casestudies/' + path);
		});

		// --- Cursor pointer for interactive layers ---
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

		// Change the cursor back to a pointer when it leaves the streets layers.
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
	<div id="title">
		<h1>Main Street Map</h1>
		<a on:click={initiateTutorial} id="tutorial">
			<Icon icon="fluent:question-circle-12-filled" width="1.5em" height="1.5em" color="#002940" />
		</a>
	</div>
	<p>
		This is a map of all of the main streets in Canada. Search for a place or navigate the map using
		the controls; and then click on a street segment to see information associated with it in the
		panel on the left. For more information on how we classified main streets and data sources, read
		our <a href="/about/data-methodology">Data Sources & Methodology</a>.
	</p>
</div>

<div id="content-container">
	<div id="sidebar">
		<h2>{streetname}</h2>
		<h4 id="place-name">{place}</h4>
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
			<Metric label={'Independent Business Index'} value={independent_business} icon={'mdi:shop'} />
			<Metric
				label={'Estimated Retail Sales (2023)'}
				value={'$' + retail_min.toLocaleString() + ' - ' + '$' + retail_max.toLocaleString()}
				icon={'mdi:graph-line'}
			/>
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
				<Metric
					label={'Immigrants and Non-Permanent Residents'}
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
		</div>
	</div>
	<div id="map"></div>
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
				<h5><i>Toggle layers on or off</i></h5>
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

	#title {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1em;
	}

	#tutorial:hover {
		cursor: pointer;
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
		box-shadow:
			rgba(27, 31, 35, 0.04) 0px 1px 0px 0px,
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
		box-shadow:
			0px 1px 0px 0px rgba(27, 31, 35, 0.04),
			inset 0px 1px 0px 0px hsla(0, 0%, 100%, 0.25);
		background-color: #f3f4f6;
		transition: 0.3s;
	}

	#business-civic-legend {
		transition:
			opacity 0.3s,
			visibility 0.3s;
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
	}

	h5,
	h6 {
		margin: 0.5em 0;
	}
	h5,
	h6 {
		font-weight: 600;
	}
	h4 {
		font-size: 0.8em;
		margin: 0;
		padding: 0.1em 0;
	}
	h2 {
		margin: 0;
		padding: 0.1em 0;
	}

	#place-name {
		margin-bottom: 0.5em;
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
			overflow-y: auto;
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
</style>
