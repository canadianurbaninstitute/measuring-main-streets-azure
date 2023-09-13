<script>
	import Title from '../../../lib/Title.svelte';
	import Summary from '../../../lib/Summary.svelte';

	import MississaugaDundas from "../../../lib/assets/boundaries/torontoboundaries/MississaugaDundas.svg"
	import EmpSizeLegend from "../../../lib/assets/employmentsizelegend.svg"



	import '../../../styles.css';

	import housingtype from '../../../lib/data/casestudydata/toronto/mississaugadundas/housingtype';
	import housingconstruction from '../../../lib/data/casestudydata/toronto/mississaugadundas/housingconstruction';
	import educationalattainment from '../../../lib/data/casestudydata/toronto/mississaugadundas/educationalattainment';
	import immigrationstatus from '../../../lib/data/casestudydata/toronto/mississaugadundas/immigrationstatus';

	import Map from '../../../lib/Map.svelte';

	import Legend from '../../../lib/ui/legends/Legend.svelte';
	import LegendItem from '../../../lib/ui/legends/LegendItem.svelte';
	import IsochroneCheckbox from '../../../lib/ui/checkbox/IsochroneCheckbox.svelte';
	import EmploymentSizeCheckbox from '../../../lib/ui/checkbox/EmploymentSizeCheckbox.svelte';
	import PhotosCheckbox from '../../../lib/ui/checkbox/PhotosCheckbox.svelte';
	import Dropdown from '../../../lib/ui/Dropdown.svelte';

	import { ColumnChart, BarChart } from '@onsvisual/svelte-charts';
	import RangeSlider from 'svelte-range-slider-pips';
	import mapboxgl from 'mapbox-gl';
	import Scroller from '@sveltejs/svelte-scroller';
	import { sexagesimalToDecimal } from 'geolib';
	import { buildImageUrl } from 'cloudinary-build-url';
	import { setConfig } from 'cloudinary-build-url';
	import Icon from '@iconify/svelte';


	import { weightMaxStore } from '../../../lib/mapStore';


	// WeightMax for Visitor Gradient Max Value
	$: weightMax = $weightMaxStore; // Subscribe to the store's value

	// Scroll Map for Built Form

	let defaultValue = [0];

	function generateIncrementalValues(start, end, count) {
  const step = (end - start) / (count - 1);
  const values = {};

  for (let i = 0; i < count; i++) {
    const value = start + i * step;
    values[i] = value.toFixed(6); // To round to 6 decimal places
  }

  return values;
}



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
		civic: 'linear-gradient(to right, #000033, #50127b, #b6377a, #fb8761, #ffd91a)',
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
					center: [-79.584, 43.605],
					zoom: 12,
					pitch: 50.0,
					bearing: -37,
					duration: 1000
				});

				let overviewgeojson = createGeoJSON('1_Overview');

				map.once('style.load', () => {
					map.setPaintProperty('mainstreets-toronto-cvc', 'line-opacity', 1);
					map.setPaintProperty('missdundas', 'line-opacity', 1);
					map.setPaintProperty('missdundas-fill', 'fill-opacity', 0.8);
				});

				if (map.isStyleLoaded()) {
					map.setPaintProperty('mainstreets-toronto-cvc', 'line-opacity', 1);

					map.setPaintProperty('greenspaces', 'fill-opacity', 0);
					map.setPaintProperty('transit-toronto', 'line-opacity', 0);
					map.setPaintProperty('transit-toronto-stops', 'circle-opacity', 0);
					map.setPaintProperty('buildings-toronto', 'fill-extrusion-opacity', 0);
				}

				break;
			case 1:
				map.easeTo({
					center: [-79.596, 43.5965],
					zoom: 15.01,
					pitch: 40,
					bearing: -50,
					duration: 2000
				});

				// Built Form

				let builtformgeojson = createGeoJSON('2_Built_Form');

				if (map.isStyleLoaded()) {
					photoslayer.setData(builtformgeojson);

					map.setPaintProperty('mainstreets-toronto-cvc', 'line-opacity', 0);

					map.setPaintProperty('greenspaces', 'fill-opacity', 0.8);
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
					center: [-79.5875, 43.605],
					zoom: 13.5,
					pitch: 0,
					bearing: -50
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
					center: [-79.5875, 43.605],
					zoom: 13.5,
					pitch: 0,
					bearing: -50
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
					center: [-79.5875, 43.605],
					zoom: 13.5,
					pitch: 0,
					bearing: -50
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
					map.setPaintProperty('missdundas-outline', 'line-opacity', 0);
					map.setPaintProperty('buildings-toronto', 'fill-extrusion-opacity', 0);
				}

				break;
			case 5:
				map.easeTo({
					center: [-79.584, 43.605],
					zoom: 13.3,
					pitch: 20,
					bearing: -52,
					duration: 1000
				});

				let housinggeojson = createGeoJSON('5_Housing');

				if (map.isStyleLoaded()) {
					photoslayer.setData(housinggeojson);

					map.setPaintProperty('populationdensity', 'fill-opacity', 0.95);
					map.setPaintProperty('missdundas-outline', 'line-opacity', 1);
					//map.setPaintProperty('buildings-toronto', 'fill-extrusion-opacity', 0.4);
					map.setPaintProperty('missdundas-outline', 'line-color', '#ffdd33');


					map.setPaintProperty('employment-size', 'circle-opacity', 0);
					map.setPaintProperty('employment-size', 'circle-stroke-opacity', 0);
					map.setPaintProperty('averageincome', 'fill-opacity', 0);
				}

				break;
			case 6:
				map.easeTo({
					center: [-79.5875, 43.605],
					zoom: 13.5,
					pitch: 0,
					bearing: -52
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
					center: [-79.584, 43.605],
					zoom: 11 ,
					pitch: 0,
					bearing: -52,
					duration: 5000
				});

				if (map.isStyleLoaded()) {
					map.setPaintProperty('visitors-2022', 'heatmap-opacity', 1);
					map.setPaintProperty('missdundas-outline', 'line-color', '#fff');


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
	<Title image={MississaugaDundas} name={'Mississauga Dundas'} location={'Toronto, Ontario'} />
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
					style={'mapbox://styles/ananmay/clm6f8mdm02j701qi0i1b9hxh?&fresh=true?optimize=true'} 
				/>
			</div>

			<div slot="foreground">
				<section data-id="map1">
					<div class="col-medium">
						<h2>Overview</h2>
						<hr />
						<Legend
							minlabel={'Low'}
							maxlabel={'High'}
							label={'Civic Infrastructure Density'}
							gradient={gradients.civic}
						/>
						<LegendItem
							variant={'polygon'}
							label={'Mississauga Dundas'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
					</div>
				</section>
				<section data-id="map2">
					<div class="col-medium">
						<h2>Built Form</h2>
						<hr />
						<LegendItem
							variant={'polygon'}
							label={'Mississauga Dundas'}
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
						<hr>
							<small>Drag the slider to pan the map between left and right</small>
							<div id="mapSlider">
							<Icon icon="mdi:chevron-left"  color="#0098D6" width="36" />
							<RangeSlider
							on:change={(e) => {
								const startlongValue = -79.596;
								const endlongValue = -79.569;
	
								const startlatValue = 43.5965;
								const endlatValue = 43.617;
								
								const valueCount = 10;
	
								const longIncrementalvalues = generateIncrementalValues(startlongValue, endlongValue, valueCount);
								const latIncrementalvalues = generateIncrementalValues(startlatValue, endlatValue, valueCount)
	
								const longitude = longIncrementalvalues[e.detail.value];
								const latitude = latIncrementalvalues[e.detail.value];
	
								map.easeTo({
									center: [longitude, latitude],
								});
							}}
							bind:values={defaultValue}
							min={0}
							max={9}
							all="false"
							hoverable={false}
						/>
						<Icon icon="mdi:chevron-right"  color="#0098D6" width="36" />
						</div>
					</div>
				</section>
				<section data-id="map3">
					<div class="col-medium">
						<h2>Civic Infrastructure</h2>
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
							<IsochroneCheckbox {map} layer={'missdundas-isochrone'} minZoom={13} maxZoom={13.5}/>
							<EmploymentSizeCheckbox
								{map}
								layers={[
									'civicinfra-toronto-education',
									'civicinfra-toronto-govt-community',
									'civicinfra-toronto-arts-culture',
									'civicinfra-toronto-education',
									'civicinfra-toronto-recreation'
								]} minZoom={13} maxZoom={13.5}
							/>
						</div>
					</div>
				</section>
				<section data-id="map4">
					<div class="col-medium">
						<h2>Business Profile</h2>
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
							<IsochroneCheckbox {map} layer={'missdundas-isochrone'} minZoom={13} maxZoom={13.5} />
							<EmploymentSizeCheckbox
								{map}
								layers={[
									'business-toronto-retail',
									'business-toronto-services',
									'business-toronto-food-drink'
								]
								} minZoom={13} maxZoom={13.5}
							/>
						</div>
					</div>
				</section>
				<section data-id="map5">
					<div class="col-medium">
						<h2>Employment Profile</h2>
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
						<hr />
						<Legend
							minlabel={'0'}
							maxlabel={'4070000'}
							label={'Population Density (people/sq.km)'}
							gradient={gradients.popdensity}
						/>
						<hr />
						<ColumnChart
							colors={['#2A5CAB', '#DB3069']}
							data={housingtype}
							xKey="Housing Type"
							yKey="Percentage"
							zKey="Area"
							mode="grouped"
							title="Housing Type"
						/>
						<ColumnChart
							colors={['#2A5CAB', '#DB3069']}
							data={housingconstruction}
							xKey="Construction Year"
							yKey="Percentage"
							zKey="Area"
							mode="grouped"
							title="Housing Year"
							legend
						/>
					</div>
				</section>
				<section data-id="map7">
					<div class="col-medium">
						<h2>Demographics</h2>
						<hr />
						<Dropdown
							{map}
							options={[
								{ id: 'averageincome', text: 'Average Income' },
								{ id: 'populationdensity', text: 'Population Density' },
								{ id: 'visibleminority', text: 'Visible Minorities' }
							]}
						/>
						<hr />
						<ColumnChart
							colors={['#2A5CAB', '#DB3069']}
							data={educationalattainment}
							xKey="Degree Attained"
							yKey="Percentage"
							zKey="Area"
							mode="grouped"
							title="Educational Attainment"
						/>
						<ColumnChart
							colors={['#2A5CAB', '#DB3069']}
							data={immigrationstatus}
							xKey="Generation Status"
							yKey="Percentage"
							zKey="Area"
							mode="grouped"
							title="Immigration Status"
							legend
						/>
					</div>
				</section>
				<section data-id="map8">
					<div class="col-medium">
						<h2>Visitors</h2>
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
								const zoomvalues = { 0: 10, 1: 11, 2: 12, 3: 13, 4: 14 };
								const zoom = zoomvalues[e.detail.value];
								map.easeTo({
									center: [-79.584, 43.605],
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
					</div>
				</section>
			</div>
		</Scroller>
	</div>
	<Summary name={'Mississauga Dundas'} location={'Toronto, Ontario'}   />
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

	#mapSlider {
		 background-color: #fff;
		 display: flex;
		 align-items: center;
	}
</style>
