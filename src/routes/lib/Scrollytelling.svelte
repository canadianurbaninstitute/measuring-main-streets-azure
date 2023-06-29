<script>
	import Scroller from '@sveltejs/svelte-scroller';
	import Map from './Map.svelte';
	import data from './testdata';
	import Gallery from './Gallery.svelte';
	import Legend from './legends/Legend.svelte';
	import LegendItem from './legends/LegendItem.svelte';
	import IsochroneCheckbox from './IsochroneCheckbox.svelte';

	import { LineChart, ColumnChart } from '@onsvisual/svelte-charts';
	import RangeSlider from 'svelte-range-slider-pips';
	import EmploymentSizeCheckbox from './EmploymentSizeCheckbox.svelte';

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
		popdensity: 'linear-gradient(to right, #00acf6, #00acf6, #0283bc, #016f9e, #004566, #012944)',
		avgincome: 'linear-gradient(to right, #f7fcf5, #c9eac2, #7bc77c, #2a924b, #00441b, #002e12)',
		heatmap: 'linear-gradient(to right, #0000ff, royalblue, cyan, lime, yellow, red)'
	};



	let count;
	let index;
	let progress;
	let values = [2022];

	

	// Element bindings
	export let map = null; // Bound to mapbox 'map' instance once initialised

	$: if (map) {
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
					map.setPaintProperty('buildings-toronto', 'fill-extrusion-opacity', 0);
				}

				// legendContainer.innerHTML = "<Legend minlabel={'Low'} maxlabel={'High'} label={'Business Density'} gradient={gradients.business}/>"

				break;
			case 1:
				map.easeTo({
					center: [-79.417, 43.64408],
					zoom: 15.1,
					pitch: 40,
					bearing: -14
				});

				if (map.isStyleLoaded()) {
					map.setPaintProperty('mainstreets-toronto-cvc', 'line-opacity', 0);
					map.setPaintProperty('greenspaces', 'fill-opacity', 0.8);
					map.setPaintProperty('transit-toronto', 'line-opacity', 1);
					map.setPaintProperty('buildings-toronto', 'fill-extrusion-opacity', 0.8);

					map.setPaintProperty('civicinfra-toronto', 'circle-opacity', 0);
					map.setPaintProperty('civicinfra-toronto', 'circle-stroke-opacity', 0);
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
					map.setPaintProperty('civicinfra-toronto', 'circle-opacity', 1);
					map.setPaintProperty('civicinfra-toronto', 'circle-stroke-opacity', 1);

					map.setPaintProperty('greenspaces', 'fill-opacity', 0);
					map.setPaintProperty('transit-toronto', 'line-opacity', 0);
					map.setPaintProperty('buildings-toronto', 'fill-extrusion-opacity', 0);
					map.setPaintProperty('business-toronto', 'circle-opacity', 0);
					map.setPaintProperty('business-toronto', 'circle-stroke-opacity', 0);
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

					map.setPaintProperty('civicinfra-toronto', 'circle-opacity', 0);
					map.setPaintProperty('civicinfra-toronto', 'circle-stroke-opacity', 0);
					map.setPaintProperty('populationdensity', 'fill-opacity', 0);
					map.setPaintProperty('westqueenwest-outline', 'line-opacity', 0);
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
					map.setPaintProperty('populationdensity', 'fill-opacity', 0.95);
					map.setPaintProperty('westqueenwest-outline', 'line-opacity', 1);

					map.setPaintProperty('business-toronto', 'circle-opacity', 0);
					map.setPaintProperty('business-toronto', 'circle-stroke-opacity', 0);
					map.setPaintProperty('averageincome', 'fill-opacity', 0);
				}

				break;
			case 5:
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
					//map.setPaintProperty('employment-size', 'circle-opacity', 0);
				}

				break;
			case 6:
				map.easeTo({
					center: [-79.422, 43.6441],
					zoom: 11,
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
					<p>
						West Queen West is located just outside the western edge of Toronto's downtown core. The
						main street begins at Bathurst Street in the east and extends to Dufferin Street in the
						west. Residents and visitors can easily access the popular Trinity Bellwoods Park for
						rest, recreation, and socialization.
					</p>
					<p>
						Compared to the rest of the Toronto CMA, West Queen West is home to a higher rate of
						renters. Almost half of local residents are between the ages of 25 and 39, and are
						highly educated compared to the rest of the CMA. When comparing household incomes to the
						regional average, data analysis reveals a polarizing wealth disparity.
					</p>
					<Gallery {galleryID} {images} />
					<hr />

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
					<p>
						This segment of Queen Street features four vehicular lanes, on-street parking, a
						streetcar line, bicycle posts, and cohesive BIA branding and street beautification.
					</p>
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
					<p>
						Pictures of key civic infrastructure
						<br />
						Text box highlighting key pieces of civic infrastructure and a sense of related programming
						and examples of neighbourhood organization
						<br />
						Bring in #s from existing data on civic engagement
						<br />
						<br />
						The commercial mix features a high rate of food and drink establishments, while the civic
						infrastructure mix is composed of a high rate of arts and culture establishments and recreation
						facilities.
					</p>
					<hr />
					<IsochroneCheckbox {map} />
					<hr />
					<LegendItem
						variant={'circle'}
						label={'Arts and Culture'}
						bgcolor={'#8a6189'}
						bordercolor={'#fff'}
					/>
					<LegendItem
						variant={'circle'}
						label={'Government and Community Services'}
						bgcolor={'#f97362'}
						bordercolor={'#fff'}
					/>
					<LegendItem
						variant={'circle'}
						label={'Recreation and Facilities'}
						bgcolor={'#055e58'}
						bordercolor={'#fff'}
					/>
					<LegendItem
						variant={'circle'}
						label={'Health and Care Facilities'}
						bgcolor={'#1b9ac2'}
						bordercolor={'#fff'}
					/>
					<LegendItem
						variant={'circle'}
						label={'Education'}
						bgcolor={'#9c320d'}
						bordercolor={'#fff'}
					/>
				</div>
				
			</section>
			<section data-id="map4">
				<div class="col-medium">
					<h2>Business Profile</h2>
					<p>
						Option to add layer showing all other businesses including employment range
						<br />
						Pictures of typical local businesses and anchors
						<br />
						Text box describing how main street (and walk buffer) compare to regional averages.
						<br />
						<br />
						The commercial mix features a high rate of food and drink establishments, while the civic
						infrastructure mix is composed of a high rate of arts and culture establishments and recreation
						facilities.
					</p>
					<hr />
					<IsochroneCheckbox {map} />
					<br>
					<EmploymentSizeCheckbox {map}/>
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
					<h2>Housing</h2>
					<p>
						Population density (people/sq. km) (regional deciles)
						<br />
						Pictures of typical housing
						<br />
						Text box highlighting key housing stats (tenure; period of construction; type; value)
						<br />
						Possibility of 1 or 2 charts
					</p>
					<hr />
					<LineChart
						data={data.filter((d) => d.group == 'apples')}
						xKey="year"
						yKey="value"
						areaOpacity={0.3}
						title="Example Line chart with area"
						footer="Source: Data Source, 2023."
					/>
					<hr />
					<Legend
						minlabel={'0'}
						maxlabel={'4070000'}
						label={'Population Density (people/sq.km)'}
						gradient={gradients.popdensity}
					/>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean maximus eleifend ultrices. Curabitur velit nibh, sollicitudin vitae consequat condimentum, vehicula eu tortor. Vestibulum risus magna, mattis ut neque id, cursus mollis felis. Maecenas sed nunc vel orci laoreet venenatis in nec lacus. Proin quis eros ut erat porttitor blandit eu eget libero. Nunc vehicula a felis auctor commodo. Curabitur vel sagittis eros. Mauris interdum ante nisl, et tempus tellus iaculis non. In condimentum dictum nibh ut pellentesque. Nullam molestie scelerisque ante. Etiam eleifend tristique enim, quis convallis leo bibendum ornare. Nullam lorem purus, sagittis sit amet justo ut, vehicula fermentum ligula. Aliquam erat volutpat. Proin iaculis mauris lorem, et hendrerit augue mattis vitae.
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean maximus eleifend ultrices. Curabitur velit nibh, sollicitudin vitae consequat condimentum, vehicula eu tortor. Vestibulum risus magna, mattis ut neque id, cursus mollis felis. Maecenas sed nunc vel orci laoreet venenatis in nec lacus. Proin quis eros ut erat porttitor blandit eu eget libero. Nunc vehicula a felis auctor commodo. Curabitur vel sagittis eros. Mauris interdum ante nisl, et tempus tellus iaculis non. In condimentum dictum nibh ut pellentesque. Nullam molestie scelerisque ante. Etiam eleifend tristique enim, quis convallis leo bibendum ornare. Nullam lorem purus, sagittis sit amet justo ut, vehicula fermentum ligula. Aliquam erat volutpat. Proin iaculis mauris lorem, et hendrerit augue mattis vitae.

					</p>
				</div>
			</section>
			<section data-id="map6">
				<div class="col-medium">
					<h2>Demographics</h2>
					<p>
						<br />
						Map of average income (regional deciles)
						<br />
						Charts – population pyramid; educational attainment; immigration
						<br />
						Text box with additional detail – especially on major ethnic groups
					</p>
					<hr />
					<Legend
						minlabel={'$0'}
						maxlabel={'$736000'}
						label={'Average Income (Census 2021)'}
						gradient={gradients.avgincome}
					/>
				</div>
			</section>
			<section data-id="map7">
				<div class="col-medium">
					<h2>Visitors</h2>
					<p>
						Breakdown by three types of visitors
						<br />
						Stats over time
						<br />
						Breakdown of weekday and time of day
						<br />
						Visitor demographics (compare to residents)
					</p>
					<RangeSlider on:change={(e) => {
						const year = e.detail.value
						if (map.isStyleLoaded()) {
						const years = [2019, 2020, 2021, 2022];

						years.forEach(y => {
							const opacity = y === year ? 1 : 0;
							map.setPaintProperty(`visitors-${y}`, 'heatmap-opacity', opacity);
						});
						} else {
						console.log('Map style is not loaded.');
						}
					  }} bind:values min={2019} max={2022} pips all="label" />
					<hr />
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
		position: relative; /* Add this line to make sections relative */
		pointer-events: none;
	}

	[slot='background'] {
		font-size: 1.4em;
		overflow: hidden;
		height: 100vh;
		pointer-events: all;
	}

	[slot='foreground'] section {
		pointer-events: all;
		position: relative; /* Add this line to make sections relative */
	}

	section {
		min-height: 100vh;
		background-color: rgba(0, 0, 0, 0);
		padding: 1em;
		margin: 0 0 3em 0;
	}

	[slot='foreground'] section {
		/* width: 70%; */
		margin: auto;
		/* text-align: center; */
		vertical-align: middle;
		position: relative;
	}

	[slot='foreground'] .col-medium {
		background: #fff;
		padding: 1em 2em 2em 2em;
		border-radius: 0.5em;
		width: 25vw;
	}

	h2 {
		padding-top: 20px;
		margin: 0 auto;
		font-family: 'Gelasio', serif;
		font-weight: 400;
		max-width: 450px;
		font-size: 28px;
		line-height: 30px;
		color: var(--brandLightBlue);
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
