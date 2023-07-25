<script>
	import Scroller from '@sveltejs/svelte-scroller';
	import Map from './Map.svelte';
	import housingtype from './data/housingtype';
	import housingconstruction from './data/housingconstruction';
	import Gallery from './Gallery.svelte';
	import Legend from './legends/Legend.svelte';
	import LegendItem from './legends/LegendItem.svelte';
	import IsochroneCheckbox from './IsochroneCheckbox.svelte';
	import {ColumnChart } from '@onsvisual/svelte-charts';
	import RangeSlider from 'svelte-range-slider-pips';
	import EmploymentSizeCheckbox from './EmploymentSizeCheckbox.svelte';
	import mapboxgl from 'mapbox-gl';

	const galleryID = 'OverviewGallery';
	const images = [
		{
			largeURL: 'src/routes/assets/builtform1.jpeg',
			width: 800,
			height: 450,
			thumbnailURL: 'src/routes/assets/builtform1_thumb.jpg'
		},
		{
			largeURL: 'src/routes/assets/builtform2.jpg',
			width: 800,
			height: 450,
			thumbnailURL: 'src/routes/assets/builtform2_thumb.jpg'
		}

		// Add more image objects as needed
	];

	const gradients = {
		civic: 'linear-gradient(to right, #000033, #50127b, #b6377a, #fb8761, #ffd91a)',
		popdensity: 'linear-gradient(to right, #ebf9ff, #cceffe, #99dffc, #67cefb, #34bef9, #01aef8, #018bc6, #016895, #004663, #002332, #001d29)',
		avgincome: 'linear-gradient(to right, #f7fcf5, #c9eac2, #7bc77c, #2a924b, #00441b, #002e12)',
		heatmap: 'linear-gradient(to right, #0000ff, royalblue, cyan, lime, yellow, red)'
	};

	const zoomlabels = ['Region', 'City', 'Area', 'Neighbourhood', 'Street'];

	let count;
	let index;
	let progress;
	let values = [2022];

	// Element bindings
	export let map = null; // Bound to mapbox 'map' instance once initialised

	$: if (map) {
		map.loadImage('https://i.imgur.com/r6AP8bH.jpg', (error, image) => {
			if (error) throw error;

			// Add the image to the map style.
			map.addImage('cat', image);

			// Add a data source containing one point feature.
			map.addSource('point', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: [
						{
							type: 'Feature',
							geometry: {
								type: 'Point',
								coordinates: [-79.41358158978488, 43.64647469064059]
							}
						}
					]
				}
			});

			// Add a layer to use the image to represent the data.
			map.addLayer({
				id: 'points',
				type: 'symbol',
				source: 'point', // reference the data source
				layout: {
					'icon-image': 'cat', // reference the image
					'icon-size': 0.25,
					'visibility': 'none'
				}
			});
		});

		map.on('click', 'points', (e) => {
			// Copy coordinates array.
			const coordinates = e.features[0].geometry.coordinates.slice();

			// Ensure that if the map is zoomed out such that multiple
			// copies of the feature are visible, the popup appears
			// over the copy being pointed to.
			while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
				coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
			}

			new mapboxgl.Popup()
				.setLngLat(coordinates)
				.setHTML("<img src='https://i.imgur.com/FIAMHCU.jpg' style='width:400px;'/>")
				.addTo(map);
		});

		// Change the cursor to a pointer when the mouse is over the photos layer.
		map.on('mouseenter', 'points', () => {
			map.getCanvas().style.cursor = 'pointer';
		});

		// Change it back to a pointer when it leaves.
		map.on('mouseleave', 'points', () => {
			map.getCanvas().style.cursor = '';
		});

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

				map.once('style.load', () => {
					map.setPaintProperty('mainstreets-toronto-cvc', 'line-opacity', 1);
					map.setPaintProperty('westqueenwest', 'line-opacity', 1);
					map.setPaintProperty('westqueenwest-fill', 'fill-opacity', 0.8);
				});

				if (map.isStyleLoaded()) {
					map.setPaintProperty('mainstreets-toronto-cvc', 'line-opacity', 1);

					map.setPaintProperty('greenspaces', 'fill-opacity', 0);
					map.setPaintProperty('transit-toronto', 'line-opacity', 0);
					map.setPaintProperty('transit-toronto-stops', 'circle-opacity', 0);
					map.setPaintProperty('buildings-toronto', 'fill-extrusion-opacity', 0);
					map.setLayoutProperty('points', 'visibility', 'none');

				}

				break;
			case 1:
				map.easeTo({
					center: [-79.417, 43.64408],
					zoom: 15.1,
					pitch: 40,
					bearing: -14,
					duration: 2000
				});

				if (map.isStyleLoaded()) {
					map.setPaintProperty('mainstreets-toronto-cvc', 'line-opacity', 0);
					map.setPaintProperty('greenspaces', 'fill-opacity', 0.8);
					map.setPaintProperty('transit-toronto', 'line-opacity', 1);
					map.setPaintProperty('transit-toronto-stops', 'circle-opacity', 1);
					map.setPaintProperty('buildings-toronto', 'fill-extrusion-opacity', 0.8);
					map.setLayoutProperty('points', 'visibility', 'visible');


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

				if (map.isStyleLoaded()) {


					// Civic Infra

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

					map.setPaintProperty('greenspaces', 'fill-opacity', 0);
					map.setPaintProperty('transit-toronto', 'line-opacity', 0);
					map.setPaintProperty('transit-toronto-stops', 'circle-opacity', 0);
					map.setPaintProperty('buildings-toronto', 'fill-extrusion-opacity', 0);
					map.setPaintProperty('business-toronto', 'circle-opacity', 0);
					map.setPaintProperty('business-toronto', 'circle-stroke-opacity', 0);
					map.setLayoutProperty('points', 'visibility', 'none');

				}

				break;
			case 3:
				map.easeTo({
					center: [-79.422, 43.6441],
					zoom: 14.7,
					pitch: 0,
					bearing: -14
				});

				if (map.isStyleLoaded()) {
					map.setPaintProperty('business-toronto', 'circle-opacity', 1);
					map.setPaintProperty('business-toronto', 'circle-stroke-opacity', 1);

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
					map.setPaintProperty('employment-size', 'circle-opacity', 1);
					map.setPaintProperty('employment-size', 'circle-stroke-opacity', 1);

					map.setPaintProperty('business-toronto', 'circle-opacity', 0);
					map.setPaintProperty('business-toronto', 'circle-stroke-opacity', 0);
					map.setPaintProperty('populationdensity', 'fill-opacity', 0);
					map.setPaintProperty('westqueenwest-outline', 'line-opacity', 0);
					map.setPaintProperty('buildings-toronto', 'fill-extrusion-opacity', 0);

				}

				break;
			case 5:
				map.easeTo({
					center: [-79.410, 43.646],
					zoom: 15,
					pitch: 20,
					bearing: -14,
					duration: 2000
				});

				if (map.isStyleLoaded()) {
					map.setPaintProperty('populationdensity', 'fill-opacity', 0.95);
					map.setPaintProperty('westqueenwest-outline', 'line-opacity', 1);
					map.setPaintProperty('buildings-toronto', 'fill-extrusion-opacity', 0.4);


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

<div class="container">
	<Scroller bind:count bind:index bind:progress>
		<div slot="background">
			<Map
				bind:map
				interactive={false}
				location={{
					lng: 79,
					lat: 43,
					zoom: 1.8
				}}
			/>
			<div id="legend-container" />
		</div>

		<div slot="foreground">
			<section data-id="map1">
				<div class="col-medium">
					<h2>Overview</h2>
					<!-- <Gallery {galleryID} {images} /> -->
					<Legend
						minlabel={'Low'}
						maxlabel={'High'}
						label={'Civic Infrastructure Density'}
						gradient={gradients.civic}
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
				</div>
			</section>
			<section data-id="map3">
				<div class="col-medium">
					<h2>Civic Infrastructure</h2>
					<IsochroneCheckbox {map} />
					<br />
					<EmploymentSizeCheckbox {map} layers={['civicinfra-toronto-education', 'civicinfra-toronto-govt-community', 'civicinfra-toronto-arts-culture', 'civicinfra-toronto-education', 'civicinfra-toronto-recreation']} />
					<hr />
					<LegendItem
						variant={'circle'}
						label={'Arts and Culture'}
						bgcolor={'#8a6189'}
						bordercolor={'#fff'}
						button={true}
						id={'civicinfra-toronto-arts-culture'}
					/>
					<LegendItem
						variant={'circle'}
						label={'Government and Community Services'}
						bgcolor={'#f97362'}
						bordercolor={'#fff'}
						button={true}
						id={'civicinfra-toronto-govt-community'}
					/>
					<LegendItem
						variant={'circle'}
						label={'Recreation and Facilities'}
						bgcolor={'#055e58'}
						bordercolor={'#fff'}
						button={true}
						id={'civicinfra-toronto-recreation'}

					/>
					<LegendItem
						variant={'circle'}
						label={'Health and Care Facilities'}
						bgcolor={'#1b9ac2'}
						bordercolor={'#fff'}
						button={true}
						id={'civicinfra-toronto-health'}

					/>
					<LegendItem
						variant={'circle'}
						label={'Education'}
						bgcolor={'#9c320d'}
						bordercolor={'#fff'}
						button={true}
						id={'civicinfra-toronto-education'}
					/>
				</div>
			</section>
			<section data-id="map4">
				<div class="col-medium">
					<h2>Business Profile</h2>
					<IsochroneCheckbox {map} />
					<br />
					<EmploymentSizeCheckbox {map} layer={'business-toronto'} />
					<hr />
					<LegendItem
						variant={'circle'}
						label={'Retail'}
						bgcolor={'#f25a5a'}
						bordercolor={'#fff'}
					/>
					<LegendItem
						variant={'circle'}
						label={'Services and Other'}
						bgcolor={'#2a5cac'}
						bordercolor={'#fff'}
					/>
					<LegendItem
						variant={'circle'}
						label={'Food and Drink'}
						bgcolor={'#43b171'}
						bordercolor={'#fff'}
					/>
				</div>
			</section>
			<section data-id="map5">
				<div class="col-medium">
					<h2>Employment Profile</h2>
					<LegendItem
						variant={'circle'}
						label={'Civic Infrastructure'}
						bgcolor={'#055e58'}
						bordercolor={'#fff'}
					/>
					<LegendItem
						variant={'circle'}
						label={'Businesses'}
						bgcolor={'#8a6189'}
						bordercolor={'#fff'}
					/>
					<LegendItem variant={'circle'} label={'Other'} bgcolor={'#f97362'} bordercolor={'#fff'} />
				</div>
			</section>
			<section data-id="map6">
				<div class="col-medium">
					<h2>Housing</h2>
					<Legend
						minlabel={'0'}
						maxlabel={'4070000'}
						label={'Population Density (people/sq.km)'}
						gradient={gradients.popdensity}
					/>
					<ColumnChart data={housingtype} xKey="housingtype" yKey="percentage" zKey="area" mode="grouped" title="Housing Type" legend/>
					<hr>
					<ColumnChart data={housingconstruction} xKey="constructionyear" yKey="percentage" zKey="area" mode="grouped" title="Housing Year" legend/>

				</div>
			</section>
			<section data-id="map7">
				<div class="col-medium">
					<h2>Demographics</h2>
					<Legend
						minlabel={'$0'}
						maxlabel={'$736000'}
						label={'Average Income (Census 2021)'}
						gradient={gradients.avgincome}
					/>
				</div>
			</section>
			<section data-id="map8">
				<div class="col-medium">
					<h2>Visitors</h2>
					<h4>Year</h4>

					<RangeSlider
						on:change={(e) => {
							const year = e.detail.value;
							if (map.isStyleLoaded()) {
								const years = [2019, 2020, 2021, 2022];

								years.forEach((y) => {
									const opacity = y === year ? 1 : 0;
									map.setPaintProperty(`visitors-${y}`, 'heatmap-opacity', opacity);
									const expression = map.getPaintProperty(`visitors-${y}`, 'heatmap-weight');
									console.log(expression);
								});
							} else {
								console.log('Map style is not loaded.');
							}
						}}
						bind:values
						min={2019}
						max={2022}
						pips
						all="label"
					/>
					<hr />
					<h4>Zoom</h4>
					<RangeSlider
						on:change={(e) => {
							const zoomvalues = {0: 10, 1: 11, 2: 12, 3: 13, 4:14.5}
							const zoom = zoomvalues[e.detail.value];
							console.log(zoom)
							map.easeTo({
								center: [-79.417, 43.6441],
								zoom: zoom
							});
						}}
						values={[zoomlabels[0]]}
						pips
						first="label"
						last="label"
						formatter={ v => zoomlabels[v] } max={zoomlabels.length-1}
					/>
					<hr/>
					<Legend
						minlabel={'0'}
						maxlabel={'High'}
						label={'Home Location of Visitors (Number of Visits)'}
						gradient={gradients.heatmap}
					/>
				</div>
			</section>
		</div>
	</Scroller>
</div>

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
	}

	h2 {
		padding-top: 0.4em;
		padding-bottom: 0.4em;
		margin: 0 auto;
		font-family: 'Gelasio', serif;
		font-weight: 400;
		max-width: 450px;
		font-size: 28px;
		line-height: 30px;
		color: var(--brandLightBlue);
	}

	h4 {
		margin: 0 auto;
		font-family: 'Gelasio', serif;
		color: var(--brandDarkBlue);
	}

	#legend-container {
		position: fixed;
		display: block;
		right: 20px;
		bottom: 20px;
		background-color: #fff;
		border-radius: 8px;
		font: 12px/20px 'Inter', sans-serif;
		padding: 10px;
		z-index: 1;
	}



</style>


