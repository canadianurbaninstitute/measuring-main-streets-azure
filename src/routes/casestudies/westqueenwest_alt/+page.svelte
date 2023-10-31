<script>
	import Title2 from '../../lib/Title2.svelte';
	import WestQueenWest from '../../lib/assets/boundaries/torontoboundaries/WestQueenWest.svg';

	import EmpSizeLegend from '../../lib/assets/employmentsizelegend.svg';

	import Summary from '../../lib/Summary.svelte';

	import greenspace from '../../lib/data/casestudydata/toronto/westqueenwest/greenspace';
	import civicmix from '../../lib/data/casestudydata/toronto/westqueenwest/civicmix';
	import businessmix from '../../lib/data/casestudydata/toronto/westqueenwest/businessmix';
	import housingtype from '../../lib/data/casestudydata/toronto/westqueenwest/housingtype';
	import housingconstruction from '../../lib/data/casestudydata/toronto/westqueenwest/housingconstruction';
	import visitortraffic from '../../lib/data/casestudydata/toronto/westqueenwest/visitortraffic';
	import visitortypes from '../../lib/data/casestudydata/toronto/westqueenwest/visitortypes';
	import visitortimeofday from '../../lib/data/casestudydata/toronto/westqueenwest/visitortimeofday';
	import visitordayofweek from '../../lib/data/casestudydata/toronto/westqueenwest/visitordayofweek';

	import Legend from '../../lib/ui/legends/Legend.svelte';
	import LegendItem from '../../lib/ui/legends/LegendItem.svelte';
	import IsochroneCheckbox from '../../lib/ui/checkbox/IsochroneCheckbox.svelte';
	import EmploymentSizeCheckbox from '../../lib/ui/checkbox/EmploymentSizeCheckbox.svelte';
	import PhotosCheckbox from '../../lib/ui/checkbox/PhotosCheckbox.svelte';
	import Dropdown from '../../lib/ui/Dropdown.svelte';
	import CaseStudyMap2 from '../../lib/CaseStudyMap2.svelte';

	import { timeFormat } from 'd3-time-format';

	import { ColumnChart, BarChart, LineChart } from '@onsvisual/svelte-charts';

	import RangeSlider from 'svelte-range-slider-pips';
	import mapboxgl from 'mapbox-gl';
	import { sexagesimalToDecimal } from 'geolib';
	import { buildImageUrl } from 'cloudinary-build-url';
	import { setConfig } from 'cloudinary-build-url';

	import { weightMaxStore } from '../../lib/mapStore';

	import '../../styles.css';

	const gradients = {
		business: 'linear-gradient(to right, #cceffe, #99dffc, #34bef9, #018bc6, #004663)',
		popdensity:
			'linear-gradient(to right, #ebf9ff, #cceffe, #99dffc, #67cefb, #34bef9, #01aef8, #018bc6, #016895, #004663, #002332, #001d29)',
		avgincome: 'linear-gradient(to right, #f7fcf5, #c9eac2, #7bc77c, #2a924b, #00441b, #002e12)',
		vismin: 'linear-gradient(to right, #ffeddb, #fd9243, #df5005, #7f2704, #4a1703)',
		heatmap: 'linear-gradient(to right, #0000ff, royalblue, cyan, lime, yellow, red)'
	};

	const zoomlabels = ['Region', 'City', 'Area', 'Neighbourhood', 'Street'];

	let values = [2022];
	export let map = null;

	// WeightMax for Visitor Gradient Max Value
	$: weightMax = $weightMaxStore; // Subscribe to the store's value
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
	<Title2 outline={WestQueenWest} name={'West Queen West'} location={'Toronto, Ontario'} />
	<div class="container">
		<section data-id="map1">
			<div class="section-container">
				<div class="content-container">
					<h2>Overview</h2>
					<p>
						West Queen West is the segment of a prominent arterial road through the southern parts
						of the city of Toronto, specifically the part of the street between Dufferin in the west
						and Bathurst in the east. To its immediate west is the neighbourhood of Parkdale, to its
						south a mix of high-density neighbourhoods such as Liberty Village and Niagara, to the
						east the street leads into the entertainment district and downtown, and to the north a
						patchwork of lower-rise residential neighbourhoods.
					</p>
					<p>
						The street has served as a historic westbound route in and out of Toronto’s core and has
						been urbanized since at least the 1850s. Historically a working-class district close to
						factory jobs, as the economic profile of Toronto has shifted to services and knowledge
						work so has West Queen West’s residential population.
					</p>
				</div>
				<div class="map-container">
					<div class="legend-container">
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
					<CaseStudyMap2
						center={[-79.41145, 43.647]}
						zoom={13}
						pitch={50}
						bearing={0}
						layers={['mainstreets-toronto', 'westqueenwest', 'westqueenwest-fill']}
						section={'overview'}
					/>
				</div>
			</div>
		</section>
		<section data-id="map2">
			<div class="section-container">
				<div class="content-container">
					<h2>Built Form</h2>
					<p>
						Most of the buildings along the street consists of mixed-use commercial and residential
						structures, with small-scale retail directly fronting a sidewalk. Few properties have a
						significant setback from their roadway and heights are limited largely to a maximum of
						three storeys directly on the road — though taller structures do exist immediately to
						the south of the street, especially in its western segment. Many properties along Queen
						Street have alley access to the north and south. There is also a small strip mall in the
						extreme western segment of the street.
					</p>
					<p>
						The street is served by multiple transit routes, most prominently a TTC streetcar route.
						While there is not bike infrastructure on the street beyond parking, there are protected
						bike lanes on some parallel streets.
					</p>
					<p>
						The most significant change in built-form along the route is the Centre for Addiction
						and Mental Health (CAMH), which occupies a significant property between Shaw and White
						Squirrel on the south of the street. On this stretch, the north side largely maintains
						the prevalent form, but in recent years CAMH has built a number of eight to ten storey
						institutional and mixed-use buildings as well as extended the street grid from the north
						to the south.
					</p>
				</div>
				<div class="map-container">
					<div class="legend-container">
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
					<CaseStudyMap2
						center={[-79.4145, 43.64408]}
						zoom={15}
						minZoom={15}
						pitch={40}
						bearing={-15}
						layers={[
							'westqueenwest',
							'westqueenwest-fill',
							'greenspaces',
							'transit-toronto',
							'transit-toronto-stops',
							'buildings-toronto'
						]}
						section={'builtform'}
					/>
					<div class="chart">
						<BarChart
							colors={['#43b171']}
							data={greenspace}
							yKey="Area"
							xKey="Park_Percentage"
							title="Green Space %"
							padding={{ top: 0, bottom: 20, left: 110 }}
						/>
					</div>
				</div>
			</div>
		</section>
		<section data-id="map3">
			<div class="section-container">
				<div class="content-container">
					<h2>Civic Infrastructure</h2>
					<p>
						The most prominent example of civic infrastructure on the street is CAMH, occupying
						multiple blocks, employing and serving thousands of workers and patients. There are also
						a number of related medical services in the neighbourhood.
					</p>
					<p>
						East of CAMH, Queen Street’s heart might be best found at Trinity Bellwoods Park, a 15.4
						hectares green space. Within the park is a large, and popular, community centre, dog
						off-leash space and sports fields. The park has served as a community hub and gathering
						space in Toronto’s west end for years.
					</p>
					<div class="controls">
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
						<div class="checkbox">
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
					</div>
				</div>
				<div class="map-container">
					<CaseStudyMap2
						center={[-79.418, 43.6441]}
						zoom={14.7}
						minZoom={14}
						pitch={0}
						bearing={-15}
						layers={[
							'westqueenwest',
							'westqueenwest-fill',
							'civicinfra-toronto-education',
							'civicinfra-toronto-govt-community',
							'civicinfra-toronto-health',
							'civicinfra-toronto-arts-culture',
							'civicinfra-toronto-recreation'
						]}
						section={'civicinfra'}
					/>
					<div class="chart">
						<BarChart
							colors={['#DB3069', '#F45D01', '#8A4285', '#33AED7', '#43B171']}
							data={civicmix}
							yKey="Area"
							xKey="Percentage"
							zKey="Group"
							mode="stacked"
							title="Civic Infrastructure Mix (%)"
							padding={{ top: 0, bottom: 20, left: 110 }}
						/>
					</div>
				</div>
			</div>
		</section>
		<section data-id="map4">
			<div class="section-container">
				<div class="content-container">
					<h2>Business Profile</h2>
					<p>
						West Queen West is an established retail district, with many small to medium fashion
						stores along the street — with specific concentrations of casual wear, eye glasses, and
						shoes in different blocks. Other retail exists along the street, covering a vast range
						of items from bakeries to convenience stores to toy stores.
					</p>
					<p>
						The services are relatively diverse, with a focus on restaurants — both formal, casual
						and fast food. No supermarket grocery store directly fronts the street on this stretch,
						but there are many located just off the street or on segments to the east and west.
					</p>
					<p>
						There are a number of event venues, especially in the western segment of the street
						which often draw large crowds for concerns and other events.
					</p>
					<div class="controls">
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
						<div class="checkbox">
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
					</div>
				</div>
				<div class="map-container">
					<CaseStudyMap2
						center={[-79.418, 43.6441]}
						zoom={14.7}
						minZoom={14}
						pitch={0}
						bearing={-15}
						layers={[
							'westqueenwest',
							'westqueenwest-fill',
							'business-toronto-retail',
							'business-toronto-food-drink',
							'business-toronto-services'
						]}
						section={'business'}
					/>
					<div class="chart">
						<BarChart
							colors={['#43b171', '#F13737', '#2a5cac']}
							data={businessmix}
							yKey="Area"
							xKey="Percentage"
							zKey="Group"
							mode="stacked"
							title="Business Mix (%)"
							padding={{ top: 0, bottom: 20, left: 110 }}
						/>
					</div>
				</div>
			</div>
		</section>
		<section data-id="map5">
			<div class="section-container">
				<div class="content-container">
					<h2>Employment Profile</h2>
					<p>
						Employment along the street is largely distributed across hundreds of small businesses,
						with some businesses employing more. CAMH is a sizeable employer along the street — but
						most large employers are concentrated just east, in downtown, or south, in Liberty
						Village, of the street itself.
					</p>
				</div>
				<div class="map-container">
					<CaseStudyMap2
						center={[-79.418, 43.6441]}
						zoom={14.5}
						minZoom={14}
						pitch={20}
						bearing={-15}
						layers={['westqueenwest', 'westqueenwest-fill', 'employment-size']}
						section={'employmentsize'}
					/>
					<div class="legend-container">
						<div>
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
						</div>
						<img id="employmentsizelegend" src={EmpSizeLegend} alt="legend" />
					</div>
				</div>
			</div>
		</section>
		<section data-id="map6">
			<div class="section-container">
				<div class="content-container">
					<h2>Housing</h2>
					<p>
						The predominant housing form in the area are ground-oriented single family homes north
						of the street, and high-rise condominium and apartment buildings south of the street.
						There are exceptions to this and numerous examples of mid-rise apartment buildings
						throughout the street. Few newer developments directly front onto the street, other than
						some examples directly south of Trinity Bellwoods Park.
					</p>
					<p>
						Generally, the population density is high for Canada and the GTA throughout the area,
						though south of the street is much denser with construction in the last 20 years. In
						contrast, the neighbourhoods north of the street have seen stable or declining
						populations in the same period as two-to-three unit buildings are converted into
						single-family houses.
					</p>
				</div>

				<div class="map-container">
					<div class="legend-container">
						<Legend
							minlabel={'0'}
							maxlabel={'4070000'}
							label={'Population Density (people/sq.km)'}
							gradient={gradients.popdensity}
						/>
					</div>
					<CaseStudyMap2
						center={[-79.418, 43.6441]}
						zoom={14.7}
						minZoom={14}
						pitch={0}
						bearing={-15}
						layers={['westqueenwest-outline', 'populationdensity']}
						section={'housing'}
					/>
				</div>
			</div>
			<div class="graphics-container">
				<div class="chart">
					<ColumnChart
						colors={['#002a41', '#0098D6']}
						data={housingconstruction}
						xKey="constructionyear"
						yKey="percentage"
						zKey="area"
						mode="grouped"
						title="Housing Construction Year (%)"
						padding={{ top: 0, bottom: 20, left: 10 }}
						legend
					/>
				</div>
				<div class="chart">
					<ColumnChart
						colors={['#002a41', '#0098D6']}
						data={housingtype}
						xKey="housingtype"
						yKey="percentage"
						zKey="area"
						mode="grouped"
						title="Housing Type (%)"
						padding={{ top: 10, bottom: 20, left: 10 }}
						legend
					/>
				</div>
			</div>
		</section>
		<section data-id="map7">
			<div class="section-container">
				<div class="content-container">
					<h2>Demographics</h2>
					<p>
						The neighbourhoods surrounding West Queen West are more highly educated and less likely
						to be a first generation immigrant than the regional average. Additionally, they are
						more likely to be both in the upper quintile of income, more likely to be in the bottom
						decile of income — indicating a polarized income distribution with limited
						representation of middle income households.
					</p>
					<div class="controls">
						<Dropdown
							{map}
							options={[
								{ id: 'averageincome', text: 'Average Income' },
								{ id: 'populationdensity', text: 'Population Density' },
								{ id: 'visibleminority', text: 'Visible Minorities' }
							]}
						/>
					</div>
				</div>
				<div class="map-container">
					<CaseStudyMap2
						center={[-79.418, 43.6441]}
						zoom={14.5}
						minZoom={14}
						pitch={0}
						bearing={-15}
						layers={['westqueenwest-outline', 'averageincome']}
						section={'demographics'}
					/>
				</div>
			</div>
		</section>
		<section data-id="map8">
			<div class="section-container">
				<div class="content-container">
					<h2>Visitors</h2>
					<p>
						West Queen West does draw visitors throughout the Greater Toronto Area, but with a
						significant concentration among local residents to the west end and downtown of Toronto.
						Generally, visitor traffic is heaviest on Fridays and Saturdays and in the late
						afternoon or evening.
					</p>
					<div class="controls">
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
						<!-- <h5>Zoom</h5> -->
						<!-- <RangeSlider
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
				/> -->
					</div>
				</div>
				<div class="map-container">
					<CaseStudyMap2
						center={[-79.417, 43.6441]}
						zoom={9}
						pitch={0}
						bearing={-15}
						layers={['westqueenwest-outline', 'visitors-2022']}
						section={'visitors'}
					/>
					<div class="legend-container">
						<Legend
							minlabel={'0'}
							maxlabel={Math.round(weightMax)}
							label={'Number of Daily Visits from Visitor Home Location'}
							gradient={gradients.heatmap}
						/>
					</div>
				</div>
			</div>
			<div class="graphics-container">
				<div class="chart">
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
				</div>
				<div class="chart">
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
				</div>
			</div>
			<div class="graphics-container">
				<div class="chart">
					<BarChart
						colors={['#002a41']}
						data={visitortimeofday}
						yKey="Time"
						xKey="Percentage"
						title="Visitors (%) by Time of Day"
						padding={{ top: 0, bottom: 20, left: 80 }}
					/>
				</div>
				<div class="chart">
					<BarChart
						colors={['#0098D6']}
						data={visitordayofweek}
						yKey="Day"
						xKey="Percentage"
						title="Visitors (%) by Day of Week"
						padding={{ top: 0, bottom: 20, left: 80 }}
					/>
				</div>
			</div>
		</section>
	</div>
	<Summary name={'West Queen West'} location={'Toronto, Ontario'} />
</main>

<style>
	section {
		padding: 2em 5em 2em 5em;
		border-bottom: 1px solid #ddd;
	}

	.legend-container {
		border: 1px solid #ddd;
		border-radius: 0.5em;
		padding: 1em;
		position: absolute;
		z-index: 1;
		background: white;
		right: 1em;
		top: 1em;
	}

	.section-container {
		display: flex;
		flex-direction: row;
	}

	.content-container {
			line-height: 160%;
			text-align: left;
			margin: 0 2em 0 0;
	}

	.graphics-container {
		display: flex;
		flex-direction: row;
	}

	.chart {
		border: 2px solid #ddd;
		border-radius: 0.5em;
		padding: 1em;
		width: 100%;
	}

	.map-container {
		position: relative;
		width: 100%;
	}

	h2 {
		padding-bottom: 0.2em;
		margin: 0 auto;
		font-family: 'Gelasio', serif;
		font-weight: 400;
		font-size: 28px;
		color: var(--brandLightBlue);
	}

	h5 {
		margin: 0 auto;
		font-family: 'Inter', sans-serif;
		color: var(--brandDarkBlue);
	}

	.controls {
		border: 2px solid #ddd;
		border-radius: 0.5em;
		padding: 1em;
	}

	.checkbox {
		display: flex;
		flex-direction: column;
	}

	/* MOBILE FLEX COLUMN (STACKED) LAYOUT */

	@media only screen and (max-width: 768px) {
		.section-container {
			flex-direction: column;
		}

		.content-container {
			max-width: 100%;
		}
	}

	/* DESKTOP TEXT LAYOUT (SIDE BY SIDE) */

	@media only screen and (min-width: 768px) {
		.content-container {
			max-width: 25%;
		}
	}

</style>
