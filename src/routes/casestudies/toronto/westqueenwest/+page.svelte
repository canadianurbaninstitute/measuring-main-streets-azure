<script>
	import Title from '../../../lib/Title.svelte';
	import WestQueenWest from '../../../lib/assets/boundaries/torontoboundaries/WestQueenWest.svg';
	import EmpSizeLegend from '../../../lib/assets/employmentsizelegend.svg';

	import Summary from '../../../lib/Summary.svelte';

	import greenspace from '../../../lib/data/casestudydata/toronto/westqueenwest/greenspace';
	import civicmix from '../../../lib/data/casestudydata/toronto/westqueenwest/civicmix';
	import businessmix from '../../../lib/data/casestudydata/toronto/westqueenwest/businessmix';
	import housingtype from '../../../lib/data/casestudydata/toronto/westqueenwest/housingtype';
	import housingconstruction from '../../../lib/data/casestudydata/toronto/westqueenwest/housingconstruction';
	// import educationalattainment from '../../../lib/data/casestudydata/toronto/westqueenwest/educationalattainment';
	// import immigrationstatus from '../../../lib/data/casestudydata/toronto/westqueenwest/immigrationstatus';
	import visitortraffic from '../../../lib/data/casestudydata/toronto/westqueenwest/visitortraffic';
	import visitortypes from '../../../lib/data/casestudydata/toronto/westqueenwest/visitortypes';
	import visitortimeofday from '../../../lib/data/casestudydata/toronto/westqueenwest/visitortimeofday';
	import visitordayofweek from '../../../lib/data/casestudydata/toronto/westqueenwest/visitordayofweek';

	import Map from '../../../lib/CaseStudyMap.svelte';

	import Legend from '../../../lib/ui/legends/Legend.svelte';
	import LegendItem from '../../../lib/ui/legends/LegendItem.svelte';
	import IsochroneCheckbox from '../../../lib/ui/checkbox/IsochroneCheckbox.svelte';
	import EmploymentSizeCheckbox from '../../../lib/ui/checkbox/EmploymentSizeCheckbox.svelte';
	import PhotosCheckbox from '../../../lib/ui/checkbox/PhotosCheckbox.svelte';
	import Dropdown from '../../../lib/ui/Dropdown.svelte';

	import { timeFormat } from 'd3-time-format';

	import { ColumnChart, BarChart, LineChart } from '@onsvisual/svelte-charts';

	import RangeSlider from 'svelte-range-slider-pips';
	import mapboxgl from 'mapbox-gl';
	import Scroller from '@sveltejs/svelte-scroller';
	import { sexagesimalToDecimal } from 'geolib';
	import { buildImageUrl } from 'cloudinary-build-url';
	import { setConfig } from 'cloudinary-build-url';

	import { weightMaxStore } from '../../../lib/mapStore';

	import '../../../styles.css';

	// WeightMax for Visitor Gradient Max Value
	$: weightMax = $weightMaxStore; // Subscribe to the store's value

	// Cloudinary Config
	setConfig({
		cloudName: 'dq4p0s7xo'
	});

	// Photos Setup

	export let data;

	const photosJSON = data.photos;

	function createGeoJSON(filterString = null) {
		// Create GeoJSON structure
		const geojson = {
			type: 'FeatureCollection',
			features: []
		};

		// Iterate through resources
		photosJSON.resources.forEach((resource) => {
			let latitude, longitude;
			resource.metadata.forEach((meta) => {
				if (meta.external_id === 'latitude') {
					const cleanLatitude = meta.value.replace(/\\/g, '').replace(/\s*deg/g, '°'); // clean latitude
					latitude = sexagesimalToDecimal(cleanLatitude); // convert to decimal value
				} else if (meta.external_id === 'longitude') {
					const cleanLongitude = meta.value.replace(/\\/g, '').replace(/\s*deg/g, '°'); // clean latitude
					longitude = sexagesimalToDecimal(cleanLongitude); // convert to deicmal value
				}
			});

			if (latitude && longitude) {
				if (!filterString || resource.public_id.includes(filterString)) {
					let url = buildImageUrl(resource.public_id, {
						transformations: {
							rawTransformation: 'c_scale,h_300'
						}
					});
					let thumburl = buildImageUrl(resource.public_id, {
						transformations: {
							rawTransformation: 'r_15,bo_15px_solid_white,c_scale,h_200'
						},
						format: 'png'
					});

					const feature = {
						type: 'Feature',
						geometry: {
							type: 'Point',
							coordinates: [longitude, latitude]
						},
						properties: {
							public_id: resource.public_id,
							url: url,
							thumbnail: thumburl
						}
					};
					geojson.features.push(feature);
				}
			}
		});

		return geojson;
	}

	const photosGeoJSON = createGeoJSON();

	// create images list for AddImage and LoadImage to work properly

	const images = photosGeoJSON.features.map((feature) => ({
		url: feature.properties.thumbnail,
		id: feature.properties.public_id
	}));

	// Miscallenous Constants

	const gradients = {
		business: 'linear-gradient(to right, #cceffe, #99dffc, #34bef9, #018bc6, #004663)',
		popdensity:
			'linear-gradient(to right, #ebf9ff, #cceffe, #99dffc, #67cefb, #34bef9, #01aef8, #018bc6, #016895, #004663, #002332, #001d29)',
		avgincome: 'linear-gradient(to right, #f7fcf5, #c9eac2, #7bc77c, #2a924b, #00441b, #002e12)',
		vismin: 'linear-gradient(to right, #ffeddb, #fd9243, #df5005, #7f2704, #4a1703)',
		heatmap: 'linear-gradient(to right, #0000ff, royalblue, cyan, lime, yellow, red)'
	};

	const zoomlabels = ['Region', 'City', 'Area', 'Neighbourhood', 'Street'];

	let count;
	let index;
	let progress;
	let values = [2022];

	// Element bindings
	export let map = null; // Bound to mapbox 'map' instance once initialised

	// Image Loading

	let imagesLoaded = false; // Add a flag to track whether images are already loaded

	$: if (map) {
		if (!imagesLoaded) {
			Promise.all(
				images.map(
					(img) =>
						new Promise((resolve, reject) => {
							map.loadImage(img.url, (error, res) => {
								if (error) {
									console.log(error);
									reject(error);
								} else {
									map.addImage(img.id, res);
									resolve();
								}
							});
						})
				)
			).then(() => {
				console.log('Images loaded');
				imagesLoaded = true; // Mark images as loaded to prevent multiple executions
			});

			// Setting Control

			map.addControl(
				new mapboxgl.AttributionControl({
					customAttribution: 'Canadian Urban Institute'
				})
			);

			map.once('style.load', () => {
				map.addSource('photos', {
					type: 'geojson',
					data: {
						type: 'FeatureCollection',
						features: []
					}
				});

				map.addLayer({
					id: 'photos',
					type: 'symbol',
					source: 'photos',
					layout: {
						'icon-image': ['get', 'public_id'], // reference the image
						'icon-ignore-placement': true,
						'icon-size': 0.2,
						'icon-allow-overlap': true,
						visibility: 'visible'
					}
				});

				// WeightMax for Visitor Legend Max Value on initial load

				const weight = map.getPaintProperty('visitors-2022', 'heatmap-weight');
				const weightMax = weight[5];
				weightMaxStore.set(weightMax);
			});
		}

		// Creating empty GeoJSON for photos to diplsay

		const emptygeojson = {
			type: 'FeatureCollection',
			features: []
		};

		const photoslayer = map.getSource('photos');

		// Photo Popup

		map.on('click', 'photos', (e) => {
			// Copy coordinates array.
			const coordinates = e.features[0].geometry.coordinates.slice();
			const image = e.features[0].properties.url;

			// Ensure that if the map is zoomed out such that multiple
			// copies of the feature are visible, the popup appears
			// over the copy being pointed to.
			while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
				coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
			}

			new mapboxgl.Popup()
				.setLngLat(coordinates)
				.setHTML("<img src='" + image + "'" + ' class=popupImage ' + '/>')
				.addTo(map);
		});

		// Change the cursor to a pointer when the mouse is over the photos layer.
		map.on('mouseenter', 'photos', () => {
			map.getCanvas().style.cursor = 'pointer';
		});

		// Change it back to a pointer when it leaves.
		map.on('mouseleave', 'photos', () => {
			map.getCanvas().style.cursor = '';
		});

		// Map Scrolling

		// Update the map based on the index
		switch (index) {
			case 0:
				map.easeTo({
					center: [-79.41145, 43.647],
					zoom: 12,
					pitch: 50.0,
					bearing: 0,
					duration: 1000
				});

				let overviewgeojson = createGeoJSON('1_Overview');

				map.once('style.load', () => {
					map.setPaintProperty('mainstreets-toronto', 'line-opacity', 1);
					map.setPaintProperty('westqueenwest', 'line-opacity', 1);
					map.setPaintProperty('westqueenwest-fill', 'fill-opacity', 0.8);
				});

				if (map.isStyleLoaded()) {
					map.setPaintProperty('mainstreets-toronto', 'line-opacity', 1);

					map.setPaintProperty('greenspaces', 'fill-opacity', 0);
					map.setPaintProperty('transit-toronto', 'line-opacity', 0);
					map.setPaintProperty('transit-toronto-stops', 'circle-opacity', 0);
					map.setPaintProperty('buildings-toronto', 'fill-extrusion-opacity', 0);
				}

				break;
			case 1:
				map.easeTo({
					center: [-79.4188, 43.64408],
					zoom: 15.01,
					pitch: 40,
					bearing: -14,
					duration: 2000
				});

				// Built Form

				let builtformgeojson = createGeoJSON('2_Built_Form');

				if (map.isStyleLoaded()) {
					photoslayer.setData(builtformgeojson);

					map.setPaintProperty('mainstreets-toronto', 'line-opacity', 0);

					map.setPaintProperty('greenspaces', 'fill-opacity', 1);

					map.setPaintProperty('transit-toronto', 'line-opacity', 1);
					map.setPaintProperty('transit-toronto-stops', 'circle-opacity', 1);
					map.setPaintProperty('buildings-toronto', 'fill-extrusion-opacity', 0.8);

					map.setPaintProperty('civicinfra-toronto-education', 'circle-opacity', 0);
					map.setPaintProperty('civicinfra-toronto-education', 'circle-stroke-opacity', 0);

					map.setPaintProperty('civicinfra-toronto-govt-community', 'circle-opacity', 0);
					map.setPaintProperty('civicinfra-toronto-govt-community', 'circle-stroke-opacity', 0);

					map.setPaintProperty('civicinfra-toronto-health', 'circle-opacity', 0);
					map.setPaintProperty('civicinfra-toronto-health', 'circle-stroke-opacity', 0);

					map.setPaintProperty('civicinfra-toronto-arts-culture', 'circle-opacity', 0);
					map.setPaintProperty('civicinfra-toronto-arts-culture', 'circle-stroke-opacity', 0);

					map.setPaintProperty('civicinfra-toronto-recreation', 'circle-opacity', 0);
					map.setPaintProperty('civicinfra-toronto-recreation', 'circle-stroke-opacity', 0);
				}

				break;
			case 2:
				map.easeTo({
					center: [-79.422, 43.6441],
					zoom: 14.7,
					pitch: 0,
					bearing: -14
				});

				// Civic Infra

				let civicinfrageojson = createGeoJSON('3_Civic');

				if (map.isStyleLoaded()) {
					photoslayer.setData(civicinfrageojson);

					map.setPaintProperty('civicinfra-toronto-education', 'circle-opacity', 1);
					map.setPaintProperty('civicinfra-toronto-education', 'circle-stroke-opacity', 1);

					map.setPaintProperty('civicinfra-toronto-govt-community', 'circle-opacity', 1);
					map.setPaintProperty('civicinfra-toronto-govt-community', 'circle-stroke-opacity', 1);

					map.setPaintProperty('civicinfra-toronto-health', 'circle-opacity', 1);
					map.setPaintProperty('civicinfra-toronto-health', 'circle-stroke-opacity', 1);

					map.setPaintProperty('civicinfra-toronto-arts-culture', 'circle-opacity', 1);
					map.setPaintProperty('civicinfra-toronto-arts-culture', 'circle-stroke-opacity', 1);

					map.setPaintProperty('civicinfra-toronto-recreation', 'circle-opacity', 1);
					map.setPaintProperty('civicinfra-toronto-recreation', 'circle-stroke-opacity', 1);

					// Business

					map.setPaintProperty('business-toronto-retail', 'circle-opacity', 0);
					map.setPaintProperty('business-toronto-retail', 'circle-stroke-opacity', 0);

					map.setPaintProperty('business-toronto-food-drink', 'circle-opacity', 0);
					map.setPaintProperty('business-toronto-food-drink', 'circle-stroke-opacity', 0);

					map.setPaintProperty('business-toronto-services', 'circle-opacity', 0);
					map.setPaintProperty('business-toronto-services', 'circle-stroke-opacity', 0);

					map.setPaintProperty('greenspaces', 'fill-opacity', 0);
					map.setPaintProperty('transit-toronto', 'line-opacity', 0);
					map.setPaintProperty('transit-toronto-stops', 'circle-opacity', 0);
					map.setPaintProperty('buildings-toronto', 'fill-extrusion-opacity', 0);
				}

				break;
			case 3:
				map.easeTo({
					center: [-79.422, 43.6441],
					zoom: 14.7,
					pitch: 0,
					bearing: -14
				});

				// Businesses

				let businessgeojson = createGeoJSON('4_Business');

				if (map.isStyleLoaded()) {
					photoslayer.setData(businessgeojson);

					map.setPaintProperty('business-toronto-retail', 'circle-opacity', 1);
					map.setPaintProperty('business-toronto-retail', 'circle-stroke-opacity', 1);

					map.setPaintProperty('business-toronto-food-drink', 'circle-opacity', 1);
					map.setPaintProperty('business-toronto-food-drink', 'circle-stroke-opacity', 1);

					map.setPaintProperty('business-toronto-services', 'circle-opacity', 1);
					map.setPaintProperty('business-toronto-services', 'circle-stroke-opacity', 1);

					// Civic Infra

					map.setPaintProperty('civicinfra-toronto-education', 'circle-opacity', 0);
					map.setPaintProperty('civicinfra-toronto-education', 'circle-stroke-opacity', 0);

					map.setPaintProperty('civicinfra-toronto-govt-community', 'circle-opacity', 0);
					map.setPaintProperty('civicinfra-toronto-govt-community', 'circle-stroke-opacity', 0);

					map.setPaintProperty('civicinfra-toronto-health', 'circle-opacity', 0);
					map.setPaintProperty('civicinfra-toronto-health', 'circle-stroke-opacity', 0);

					map.setPaintProperty('civicinfra-toronto-arts-culture', 'circle-opacity', 0);
					map.setPaintProperty('civicinfra-toronto-arts-culture', 'circle-stroke-opacity', 0);

					map.setPaintProperty('civicinfra-toronto-recreation', 'circle-opacity', 0);
					map.setPaintProperty('civicinfra-toronto-recreation', 'circle-stroke-opacity', 0);

					map.setPaintProperty('employment-size', 'circle-opacity', 0);
					map.setPaintProperty('employment-size', 'circle-stroke-opacity', 0);
				}

				break;
			case 4:
				map.easeTo({
					center: [-79.422, 43.6441],
					zoom: 14.7,
					pitch: 0,
					bearing: -14
				});

				if (map.isStyleLoaded()) {
					photoslayer.setData(emptygeojson);

					map.setPaintProperty('employment-size', 'circle-opacity', 1);
					map.setPaintProperty('employment-size', 'circle-stroke-opacity', 1);

					// Business

					map.setPaintProperty('business-toronto-retail', 'circle-opacity', 0);
					map.setPaintProperty('business-toronto-retail', 'circle-stroke-opacity', 0);

					map.setPaintProperty('business-toronto-food-drink', 'circle-opacity', 0);
					map.setPaintProperty('business-toronto-food-drink', 'circle-stroke-opacity', 0);

					map.setPaintProperty('business-toronto-services', 'circle-opacity', 0);
					map.setPaintProperty('business-toronto-services', 'circle-stroke-opacity', 0);

					map.setPaintProperty('populationdensity', 'fill-opacity', 0);
					map.setPaintProperty('westqueenwest-outline', 'line-opacity', 0);
					map.setPaintProperty('buildings-toronto', 'fill-extrusion-opacity', 0);
				}

				break;
			case 5:
				map.easeTo({
					center: [-79.421, 43.6441],
					zoom: 14.5,
					pitch: 20,
					bearing: -14,
					duration: 1000
				});

				let housinggeojson = createGeoJSON('5_Housing');

				if (map.isStyleLoaded()) {
					photoslayer.setData(housinggeojson);

					map.setPaintProperty('populationdensity', 'fill-opacity', 0.95);
					map.setPaintProperty('westqueenwest-outline', 'line-opacity', 1);
					//map.setPaintProperty('buildings-toronto', 'fill-extrusion-opacity', 0.4);

					map.setPaintProperty('employment-size', 'circle-opacity', 0);
					map.setPaintProperty('employment-size', 'circle-stroke-opacity', 0);
					map.setPaintProperty('averageincome', 'fill-opacity', 0);
				}

				break;
			case 6:
				map.easeTo({
					center: [-79.422, 43.6441],
					zoom: 14.7,
					pitch: 0,
					bearing: -14
				});

				if (map.isStyleLoaded()) {
					photoslayer.setData(emptygeojson);

					map.setPaintProperty('averageincome', 'fill-opacity', 0.95);

					map.setPaintProperty('populationdensity', 'fill-opacity', 0);
					map.setPaintProperty('visitors-2022', 'heatmap-opacity', 0);
					map.setPaintProperty('buildings-toronto', 'fill-extrusion-opacity', 0);
				}

				break;
			case 7:
				map.easeTo({
					center: [-79.422, 43.71],
					zoom: 10,
					pitch: 0,
					bearing: -14,
					duration: 5000
				});

				if (map.isStyleLoaded()) {
					map.setPaintProperty('visitors-2022', 'heatmap-opacity', 1);

					map.setPaintProperty('averageincome', 'fill-opacity', 0);
					map.setPaintProperty('employment-size', 'circle-opacity', 0);
				}

				break;
		}
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Gelasio:wght@400;600&family=Inter&display=swap"
		rel="stylesheet"
	/>
	<link href="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<main>
	<Title image={WestQueenWest} name={'West Queen West'} location={'Toronto, Ontario'} />
	<div class="container">
		<Scroller bind:count bind:index bind:progress>
			<div slot="background">
				<div>
					<PhotosCheckbox {map} />
				</div>
				<Map
					bind:map
					interactive={false}
					location={{
						lng: 79,
						lat: 43,
						zoom: 1.8
					}}
					style={'mapbox://styles/ananmay/clilulw4v002t01pgahq9d88q?&fresh=true?optimize=true'}
				/>
			</div>

			<div slot="foreground">
				<section data-id="map1">
					<div class="col-medium">
						<h2>Overview</h2>
						<p>
							West Queen West is the segment of a prominent arterial road through the southern parts
							of the city of Toronto, specifically the part of the street between Dufferin in the
							west and Bathurst in the east. To its immediate west is the neighbourhood of Parkdale,
							to its south a mix of high-density neighbourhoods such as Liberty Village and Niagara,
							to the east the street leads into the entertainment district and downtown, and to the
							north a patchwork of lower-rise residential neighbourhoods.
						</p>
						<p>
							The street has served as a historic westbound route in and out of Toronto’s core and
							has been urbanized since at least the 1850s. Historically a working-class district
							close to factory jobs, as the economic profile of Toronto has shifted to services and
							knowledge work so has West Queen West’s residential population.
						</p>
						<hr />
						<Legend
							minlabel={'Low'}
							maxlabel={'High'}
							label={'Business Density'}
							gradient={gradients.business}
						/>
						<LegendItem
							variant={'polygon'}
							label={'West Queen West'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
					</div>
				</section>
				<section data-id="map2">
					<div class="col-medium">
						<h2>Built Form</h2>
						<p>
							Most of the buildings along the street consists of mixed-use commercial and
							residential structures, with small-scale retail directly fronting a sidewalk. Few
							properties have a significant setback from their roadway and heights are limited
							largely to a maximum of three storeys directly on the road — though taller structures
							do exist immediately to the south of the street, especially in its western segment.
							Many properties along Queen Street have alley access to the north and south. There is
							also a small strip mall in the extreme western segment of the street.
						</p>
						<p>
							The street is served by multiple transit routes, most prominently a TTC streetcar
							route on Queen Street itself. While there is not bike infrastructure on the street
							beyond parking, there are protected bike lanes on some parallel streets.
						</p>
						<p>
							The most significant change in built-form along the route is the Centre for Addiction
							and Mental Health (CAMH), which occupies a significant property between Shaw and White
							Squirrel on the south of the street. On this stretch, the north side largely maintains
							the prevalent form, but in recent years CAMH has built a number of eight to ten storey
							institutional and mixed-use buildings as well as extended the street grid from the
							north to the south.
						</p>
						<hr />
						<LegendItem
							variant={'polygon'}
							label={'West Queen West'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
						<LegendItem variant={'polygon'} label={'Green Spaces'} bgcolor={'#43b171'} />
						<LegendItem
							variant={'polygon'}
							label={'Buildings'}
							bgcolor={'#d4d4d4'}
							bordercolor={'#999797'}
						/>
						<LegendItem variant={'line'} label={'Transit'} bordercolor={'#ff4242'} />
						<hr />
						<BarChart
							colors={['#43b171']}
							data={greenspace}
							yKey="Area"
							xKey="Park_Percentage"
							title="Green Space %"
							padding={{ top: 0, bottom: 20, left: 75 }}
						/>
					</div>
				</section>
				<section data-id="map3">
					<div class="col-medium">
						<h2>Civic Infrastructure</h2>
						<p>
							The most prominent example of civic infrastructure on the street is CAMH, occupying
							multiple blocks, employing and serving thousands of workers and patients. There are
							also a number of related medical services in the neighbourhood.
						</p>
						<p>
							East of CAMH, Queen Street’s heart might be best found at Trinity Bellwoods Park, a
							15.4 hectares green space. Within the park is a large, and popular, community centre,
							dog off-leash space and sports fields. The park has served as a community hub and
							gathering space in Toronto’s west end for years.
						</p>
						<hr />
						<i><small>Click on a layer to turn it on or off</small></i>
						<LegendItem
							variant={'circle'}
							label={'Arts and Culture'}
							bgcolor={'#DB3069'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-toronto-arts-culture'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Government and Community Services'}
							bgcolor={'#8A4285'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-toronto-govt-community'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Recreation and Facilities'}
							bgcolor={'#43B171'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-toronto-recreation'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Health and Care Facilities'}
							bgcolor={'#33AED7'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-toronto-health'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Education'}
							bgcolor={'#F45D01'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-toronto-education'}
						/>
						<div class="controls">
							<IsochroneCheckbox {map} layer={'wqw-isochrone'} />
							<EmploymentSizeCheckbox
								{map}
								layers={[
									'civicinfra-toronto-education',
									'civicinfra-toronto-govt-community',
									'civicinfra-toronto-arts-culture',
									'civicinfra-toronto-education',
									'civicinfra-toronto-recreation'
								]}
							/>
						</div>
						<hr />
						<BarChart
							colors={['#DB3069', '#F45D01', '#8A4285', '#33AED7', '#43B171']}
							data={civicmix}
							yKey="Area"
							xKey="Percentage"
							zKey="Group"
							mode="stacked"
							title="Civic Infrastructure Mix (%)"
							padding={{ top: 0, bottom: 20, left: 75 }}
						/>
					</div>
				</section>
				<section data-id="map4">
					<div class="col-medium">
						<h2>Business Profile</h2>
						<p>
							West Queen West is an established retail district, with many small to medium fashion
							stores along the street — with specific concentrations of casual wear, eye glasses,
							and shoes in different blocks. Other retail exists along the street, covering a vast
							range of items from bakeries to convenience stores to toy stores.
						</p>
						<p>
							The services are relatively diverse, with a focus on restaurants — both formal, casual
							and fast food. No supermarket grocery store directly fronts the street on this
							stretch, but there are many located just off the street or on segments to the east and
							west.
						</p>
						<p>
							There are a number of event venues, especially in the western segment of the street
							which often draw large crowds for concerns and other events.
						</p>
						<hr />
						<i><small>Click on a layer to turn it on or off</small></i>

						<LegendItem
							variant={'circle'}
							label={'Retail'}
							bgcolor={'#F13737'}
							bordercolor={'#fff'}
							button={true}
							id={'business-toronto-retail'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Services and Other'}
							bgcolor={'#2a5cac'}
							bordercolor={'#fff'}
							button={true}
							id={'business-toronto-services'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Food and Drink'}
							bgcolor={'#43b171'}
							bordercolor={'#fff'}
							button={true}
							id={'business-toronto-food-drink'}
						/>
						<!-- <PhotosCheckbox {map} /> -->
						<div class="controls">
							<IsochroneCheckbox {map} layer={'wqw-isochrone'} />
							<EmploymentSizeCheckbox
								{map}
								layers={[
									'business-toronto-retail',
									'business-toronto-services',
									'business-toronto-food-drink'
								]}
							/>
						</div>
						<hr />
						<BarChart
							colors={['#43b171', '#F13737', '#2a5cac']}
							data={businessmix}
							yKey="Area"
							xKey="Percentage"
							zKey="Group"
							mode="stacked"
							title="Business Mix (%)"
							padding={{ top: 0, bottom: 20, left: 75 }}
						/>
					</div>
				</section>
				<section data-id="map5">
					<div class="col-medium">
						<h2>Employment Profile</h2>
						<p>
							Employment along the street is largely distributed across hundreds of small
							businesses, with some businesses employing more. CAMH is a sizeable employer along the
							street — but most large employers are concentrated just east, in downtown, or south,
							in Liberty Village, of the street itself.
						</p>
						<hr />
						<LegendItem
							variant={'circle'}
							label={'Civic Infrastructure'}
							bgcolor={'#db3069'}
							bordercolor={'#fff'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Businesses'}
							bgcolor={'#2a5cac'}
							bordercolor={'#fff'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Other'}
							bgcolor={'#b0b0b0'}
							bordercolor={'#fff'}
						/>
						<img id="empsizelegend" src={EmpSizeLegend} alt="legend" />
					</div>
				</section>
				<section data-id="map6">
					<div class="col-medium">
						<h2>Housing</h2>
						<p>
							The predominant housing form in the area are ground-oriented single family homes north
							of the street, and high-rise condominium and apartment buildings south of the street.
							There are exceptions to this and numerous examples of mid-rise apartment buildings
							throughout the street. Few newer developments directly front onto the street, other
							than some examples directly south of Trinity Bellwoods Park.
						</p>
						<p>
							Generally, the population density is high for Canada and the GTA throughout the area,
							though south of the street is much denser with construction in the last 20 years. In
							contrast, the neighbourhoods north of the street have seen stable or declining
							populations in the same period as two-to-three unit buildings are converted into
							single-family houses.
						</p>
						<hr />
						<Legend
							minlabel={'0'}
							maxlabel={'4070000'}
							label={'Population Density (people/sq.km)'}
							gradient={gradients.popdensity}
						/>
						<hr />
						<BarChart
							colors={['#002a41', '#0098D6']}
							data={housingtype}
							yKey="housingtype"
							xKey="percentage"
							zKey="area"
							mode="grouped"
							title="Housing Type (%)"
							padding={{ top: 0, bottom: 20, left: 65 }}
						/>
						<BarChart
							colors={['#002a41', '#0098D6']}
							data={housingconstruction}
							yKey="constructionyear"
							xKey="percentage"
							zKey="area"
							mode="grouped"
							title="Housing Construction Year (%)"
							padding={{ top: 0, bottom: 20, left: 35 }}
							legend
						/>
					</div>
				</section>
				<section data-id="map7">
					<div class="col-medium">
						<h2>Demographics</h2>
						<p>
							The neighbourhoods surrounding West Queen West are more highly educated and less
							likely to be a first generation immigrant than the regional average. Additionally,
							they are more likely to be both in the upper quintile of income, more likely to be in
							the bottom decile of income — indicating a polarized income distribution with limited
							representation of middle income households.
						</p>
						<hr />
						<Dropdown
							{map}
							options={[
								{ id: 'averageincome', text: 'Average Income' },
								{ id: 'populationdensity', text: 'Population Density' },
								{ id: 'visibleminority', text: 'Visible Minorities' }
							]}
						/>
						<!-- <ColumnChart
							colors={['#2A5CAB', '#DB3069']}
							data={educationalattainment}
							xKey="Degree Attained"
							yKey="Percentage"
							zKey="Area"
							mode="grouped"
							title="Educational Attainment"
						/> -->
						<!-- <ColumnChart
							colors={['#2A5CAB', '#DB3069']}
							data={immigrationstatus}
							xKey="Generation Status"
							yKey="Percentage"
							zKey="Area"
							mode="grouped"
							title="Immigration Status"
							legend
						/> -->
					</div>
				</section>
				<section data-id="map8">
					<div class="col-medium">
						<h2>Visitors</h2>
						<p>
							West Queen West does draw visitors throughout the Greater Toronto Area, but with a
							significant concentration among local residents to the west end and downtown of
							Toronto. Generally, visitor traffic is heaviest on Fridays and Saturdays and in the
							late afternoon or evening.
						</p>
						<hr />
						<h5>Year</h5>
						<RangeSlider
							on:change={(e) => {
								const year = e.detail.value;
								if (map.isStyleLoaded()) {
									const years = [2019, 2020, 2021, 2022];
									years.forEach((y) => {
										const opacity = y === year ? 1 : 0;
										map.setPaintProperty(`visitors-${y}`, 'heatmap-opacity', opacity);
									});
									const weight = map.getPaintProperty(`visitors-${year}`, 'heatmap-weight');
									const weightMax = weight[5];
									console.log(weightMax);
									weightMaxStore.set(weightMax);
								} else {
									console.log('Map style is not loaded.');
								}
							}}
							bind:values
							min={2019}
							max={2022}
							pips
							all="label"
							hoverable={false}
						/>
						<h5>Zoom</h5>
						<RangeSlider
							on:change={(e) => {
								const zoomvalues = { 0: 10, 1: 11, 2: 12, 3: 13, 4: 14.5 };
								const zoom = zoomvalues[e.detail.value];
								console.log(zoom);
								map.easeTo({
									center: [-79.417, 43.6441],
									zoom: zoom
								});
							}}
							values={[zoomlabels[0]]}
							pips
							first="label"
							last="label"
							formatter={(v) => zoomlabels[v]}
							max={zoomlabels.length - 1}
							hoverable={false}
						/>
						<hr />
						<Legend
							minlabel={'0'}
							maxlabel={Math.round(weightMax)}
							label={'Number of Daily Visits from Visitor Home Location'}
							gradient={gradients.heatmap}
						/>
						<hr />
						<LineChart
							data={visitortraffic.map((d) => ({
								date: new Date(`${d.date}`),
								Percentage: d.Percentage,
								Count: d.Count
							}))}
							xKey="date"
							yKey="Percentage"
							xScale="time"
							xFormatTick={(d) => timeFormat('%Y')(d)}
							area={false}
							title="Visitor Levels % (Relative to 2019)"
							snapTicks={false}
							colors={['#0098D6']}
						/>
						<hr />
						<ColumnChart
							colors={['#002a41', '#0098D6', '#db3069']}
							data={visitortypes}
							xKey="Year"
							yKey="Count"
							zKey="Type"
							mode="stacked"
							title="Visitor Count by Type"
							padding={{ top: 20, bottom: 20, left: 70 }}
							legend
						/>
						<hr />
						<BarChart
							colors={['#002a41']}
							data={visitortimeofday}
							yKey="Time"
							xKey="Percentage"
							title="Visitors (%) by Time of Day"
							padding={{ top: 0, bottom: 20, left: 50 }}
						/>
						<hr />
						<BarChart
							colors={['#0098D6']}
							data={visitordayofweek}
							yKey="Day"
							xKey="Percentage"
							title="Visitors (%) by Day of Week"
							padding={{ top: 0, bottom: 20, left: 50 }}
						/>
					</div>
				</section>
			</div>
		</Scroller>
	</div>
	<Summary name={'West Queen West'} location={'Toronto, Ontario'} />
</main>

<style>
	.container {
		padding: 0;
		position: relative;
		pointer-events: all;
	}

	[slot='background'] {
		font-size: 1.4em;
		overflow: hidden;
		height: 100vh;
		pointer-events: all;
	}

	[slot='foreground'] {
		background-color: rgba(0, 0, 0, 0);
	}

	[slot='foreground'] section {
		pointer-events: all;
		position: relative;
		min-height: 100vh;
		background-color: rgba(0, 0, 0, 0);
		padding: 1em;
		max-width: fit-content;
	}

	[slot='foreground'] .col-medium {
		background: #fff;
		padding: 1em 2em;
		border-radius: 0.5em;
		width: 20vw;
		opacity: 0.95;
	}

	h2 {
		padding-top: 0.4em;
		padding-bottom: 0.2em;
		margin: 0 auto;
		font-family: 'Gelasio', serif;
		font-weight: 400;
		max-width: 450px;
		font-size: 28px;
		line-height: 30px;
		color: var(--brandLightBlue);
	}

	h5 {
		margin: 0 auto;
		font-family: 'Inter', sans-serif;
		color: var(--brandDarkBlue);
	}

	.controls {
		display: flex;
		width: 100%;
		flex-direction: column;
	}

	hr {
		border: 0.5px solid #bdbdbd;
	}

	#empsizelegend {
		width: 100%;
	}
</style>
