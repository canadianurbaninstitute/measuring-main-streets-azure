<script>
	import Scroller from '@sveltejs/svelte-scroller';
	import Map from './Map.svelte';
	import data from './testdata';
	import Gallery from './Gallery.svelte';
	import Legend from './legends/Legend.svelte';
	import BuiltFormLegend from './legends/BuiltFormLegend.svelte';
	import BusinessLegend from './legends/BusinessLegend.svelte';
	import CivicLegend from './legends/CivicLegend.svelte';
	import IsochroneCheckbox from './IsochroneCheckbox.svelte';

	import { LineChart} from '@onsvisual/svelte-charts';
	import RangeSlider from "svelte-range-slider-pips";

	const galleryID = 'OverviewGallery';
	const images = [
		{
			largeURL:
				'src/routes/assets/builtform1.jpeg',
			width: 800,
			height: 450,
			thumbnailURL: 'src/routes/assets/builtform1_thumb.jpg'
		},
		{
			largeURL:
				'src/routes/assets/builtform2.jpg',
			width: 800,
			height: 450,
			thumbnailURL: 'src/routes/assets/builtform2_thumb.jpg'
		}

		// Add more image objects as needed
	];

	const gradients = {
    business: 'linear-gradient(to right, #000033, #50127b, #b6377a, #fb8761, #ffd91a)',
    popdensity: 'linear-gradient(to right, #00acf6, #00acf6, #0283bc, #016f9e, #004566, #012944)',
    avgincome: 'linear-gradient(to right, #f7fcf5, #c9eac2, #7bc77c, #2a924b, #00441b, #002e12)'
	  };

	let count;
	let index;
	let progress;

	// Element bindings
	export let map = null; // Bound to mapbox 'map' instance once initialised

	$: if (map) {
		// Update the map based on the index
		switch (index) {
			case 0:
				map.easeTo({
					center: [-79.41145, 43.64923],
					zoom: 12,
					pitch: 50.0,
					bearing: 0,
					duration: 1000
				});

				map.once('style.load', () => {
					map.setPaintProperty('westqueenwest-fill', 'fill-opacity', 0.8);
					map.setPaintProperty('mainstreets-toronto', 'line-opacity', 1);
					map.setPaintProperty('westqueenwest', 'line-opacity', 1);
				});

				if (map.isStyleLoaded()) {
					map.setPaintProperty('mainstreets-toronto', 'line-opacity', 1);
					map.setPaintProperty('greenspaces', 'fill-opacity', 0);
					map.setPaintProperty('transit-toronto', 'line-opacity', 0);
					map.setPaintProperty('buildings-toronto', 'fill-extrusion-opacity', 0);
				}

				break;
			case 1:
				map.easeTo({
					center: [-79.417, 43.64408],
					zoom: 15.1,
					pitch: 40,
					bearing: -14
				});

				if (map.isStyleLoaded()) {
					map.setPaintProperty('mainstreets-toronto', 'line-opacity', 0);
					map.setPaintProperty('greenspaces', 'fill-opacity', 0.8);
					map.setPaintProperty('transit-toronto', 'line-opacity', 1);
					map.setPaintProperty('buildings-toronto', 'fill-extrusion-opacity', 0.8);

					map.setPaintProperty('business-toronto', 'circle-opacity', 0);
					map.setPaintProperty('business-toronto', 'circle-stroke-opacity', 0);
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
					map.setPaintProperty('business-toronto', 'circle-opacity', 1);
					map.setPaintProperty('business-toronto', 'circle-stroke-opacity', 1);

					map.setPaintProperty('greenspaces', 'fill-opacity', 0);
					map.setPaintProperty('transit-toronto', 'line-opacity', 0);
					map.setPaintProperty('buildings-toronto', 'fill-extrusion-opacity', 0);
					map.setPaintProperty('civicinfra-toronto', 'circle-opacity', 0);
					map.setPaintProperty('civicinfra-toronto', 'circle-stroke-opacity', 0);
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
					map.setPaintProperty('civicinfra-toronto', 'circle-opacity', 1);
					map.setPaintProperty('civicinfra-toronto', 'circle-stroke-opacity', 1);

					map.setPaintProperty('business-toronto', 'circle-opacity', 0);
					map.setPaintProperty('business-toronto', 'circle-stroke-opacity', 0);
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

					map.setPaintProperty('civicinfra-toronto', 'circle-opacity', 0);
					map.setPaintProperty('civicinfra-toronto', 'circle-stroke-opacity', 0);
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
					map.setPaintProperty('averageincome', 'fill-opacity', 0);
				}

				break;
			default:
				console.log('default');
		}
	}
</script>

<div class="demo">
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
		</div>

		<div slot="foreground">
			<section data-id="map1">
				<div class="col-medium">
					<h2>Overview</h2>
					<p>West Queen West is located just outside the western edge of Toronto's downtown core. The main street begins at Bathurst Street in the east and extends to Dufferin Street in the west. Residents and visitors can easily access the popular Trinity Bellwoods Park for rest, recreation, and socialization.
					</p>
					<p>
					Compared to the rest of the Toronto CMA, West Queen West is home to a higher rate of renters. Almost half of local residents are between the ages of 25 and 39, and are highly educated compared to the rest of the CMA. When comparing household incomes to the regional average, data analysis reveals a polarizing wealth disparity.
				</p>
				<Legend minlabel={'Low'} maxlabel={'High'} label={'Business Density'} gradient={gradients.business}/>
				<Gallery {galleryID} {images} />

				</div>
			</section>
			<section data-id="map2">
				<div class="col-medium">
					<h2>Built Form</h2>
					<p>
						This  segment of Queen Street features four vehicular lanes, on-street parking, a streetcar line, bicycle posts, and cohesive BIA branding and street beautification. 
					</p>
					<BuiltFormLegend/>
				</div>
			</section>
			<section data-id="map3">
				<div class="col-medium">
					<h2>Business Profile</h2>
					<p>
						Option to add layer showing all other businesses including employment range
						<br />
						Pictures of typical local businesses and anchors
						<br />
						Text box describing how main street (and walk buffer) compare to regional averages.
						<br>
						<br>
						The commercial mix features a high rate of food and drink establishments, while the civic infrastructure mix is composed of a high rate of arts and culture establishments and recreation facilities.
					</p>
					<hr>
					<IsochroneCheckbox {map}/>
					<hr>
					<BusinessLegend/>
				</div>
			</section>
			<section data-id="map4">
				<div class="col-medium">
					<h2>Civic Infrastructure</h2>
					<p>
						Pictures of key civic infrastructure
						<br />
						Text box highlighting key pieces of civic infrastructure and a sense of related programming
						and examples of neighbourhood organization
						<br />
						Bring in #s from existing data on civic engagement
						<br>
						<br>
						The commercial mix features a high rate of food and drink establishments, while the civic infrastructure mix is composed of a high rate of arts and culture establishments and recreation facilities.
					</p>
					<hr>
					<IsochroneCheckbox {map}/>
					<hr>
					<CivicLegend/>
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
					<hr>
					<LineChart
							data={data.filter((d) => d.group == 'apples')}
							xKey="year"
							yKey="value"
							areaOpacity={0.3}
							title="Example Line chart with area"
							footer="Source: Data Source, 2023."
						/>
					<hr>	
					<Legend minlabel={'0'} maxlabel={'4070000'} label={'Population Density (people/sq.km)'} gradient={gradients.popdensity}/>
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
					<hr>	
					<Legend minlabel={'$0'} maxlabel={'$736000'} label={'Average Income (Census 2021)'} gradient={gradients.avgincome}/>
				</div>
			</section>
			<section data-id="map7">
				<div class="col-medium">
					<h2>Visitors</h2>
					<p>
						<br />
						Map of visitor home locations (hotspot)
						<br />
						Breakdown by three types of visitors
						<br />
						Stats over time
						<br />
						Breakdown of weekday and time of day
						<br />
						Visitor demographics (compare to residents)
						<br>
						Add ability to view previous years as an option
					</p>
					<RangeSlider values={[2023]} min={2021} max={2023} pips all='label' />
				</div>
			</section>
		</div>
	</Scroller>
</div>

<style>
	.demo {
	padding: 0;
	position: relative; /* Add this line to make sections relative */
	}

	[slot='background'] {
		font-size: 1.4em;
		overflow: hidden;
		height:100vh;
	}

	[slot='foreground'] {
		pointer-events: none;
	}

	[slot='foreground'] section {
		pointer-events: all;
		position: relative; /* Add this line to make sections relative */

	}

	section {
		height: 100vh;
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
</style>
