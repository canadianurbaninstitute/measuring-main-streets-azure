<script>
	/* -------------------------------------------------------------------------- */
	/*                                   Imports                                  */
	/* -------------------------------------------------------------------------- */

	import Title from '../../../lib/ui/Title.svelte';
	import pickering from '../../../lib/assets/boundaries/torontoboundaries/Pickering.svg';

	import EmpSizeLegend from '../../../lib/assets/employmentsizelegend.svg';

	import Summary from '../../../lib/ui/Summary.svelte';

	import greenspace from '../../../lib/data/casestudydata/toronto/pickering/greenspace';
	import civicmix from '../../../lib/data/casestudydata/toronto/pickering/civicmix';
	import businessmix from '../../../lib/data/casestudydata/toronto/pickering/businessmix';
	import housingtype from '../../../lib/data/casestudydata/toronto/pickering/housingtype';
	import housingconstruction from '../../../lib/data/casestudydata/toronto/pickering/housingconstruction';
	import visitortraffic from '../../../lib/data/casestudydata/toronto/pickering/visitortraffic';
	import visitortypes from '../../../lib/data/casestudydata/toronto/pickering/visitortypes';
	import visitortimeofday from '../../../lib/data/casestudydata/toronto/pickering/visitortimeofday';
	import visitordayofweek from '../../../lib/data/casestudydata/toronto/pickering/visitordayofweek';

	import Legend from '../../../lib/ui/legends/Legend.svelte';
	import LegendItem from '../../../lib/ui/legends/LegendItem.svelte';
	import IsochroneCheckbox from '../../../lib/ui/checkbox/IsochroneCheckbox.svelte';
	import EmploymentSizeCheckbox from '../../../lib/ui/checkbox/EmploymentSizeCheckbox.svelte';
	import SatelliteCheckbox from '../../../lib/ui/checkbox/SatelliteCheckbox.svelte';
	import Dropdown from '../../../lib/ui/Dropdown.svelte';
	import CaseStudyMap from '../../../lib/CaseStudyMap.svelte';

	import { timeFormat } from 'd3-time-format';


	import { ColumnChart, BarChart, LineChart } from '@onsvisual/svelte-charts';

	import RangeSlider from 'svelte-range-slider-pips';


	import { visitorMapStore } from '../../../lib/mapStore';

	import '../../../styles.css';

	/* -------------------------------------------------------------------------- */
	/*                               Variable Setup                               */
	/* -------------------------------------------------------------------------- */

	const gradients = {
		business: 'linear-gradient(to right, #cceffe, #99dffc, #34bef9, #018bc6, #004663)',
		popdensity:
			'linear-gradient(to right, #ebf9ff, #cceffe, #99dffc, #67cefb, #34bef9, #01aef8, #018bc6, #016895, #004663, #002332, #001d29)',
		heatmap: 'linear-gradient(to right, #0000ff, royalblue, cyan, lime, yellow, red)'
	};

	let values = [2022];

	let map = null;

	/* -------------------------------------------------------------------------- */
	/*                                   Stores                                   */
	/* -------------------------------------------------------------------------- */

	visitorMapStore.subscribe((value) => {
		map = value;
	});


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
	<Title outline={pickering} name={'Kingston Road (Pickering)'} location={'Toronto, Ontario'} />
	<div class="container">
		<section data-id="map1">
			<div class="section-container">
				<div class="content-container sticky-content">
										<h2>Overview</h2>
<p>The case study aims to provide an overview of the case study area; through a combination of interactive maps, charts and data analysis. </p>
<p>
The map displays the boundaries of the case study, overlaid on the main street network. </p>
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
							label={'Pickering'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clt364z4n022w01qj05196ebi'}
						center={[-79.1189, 43.816]}
						zoom={14}
						pitch={50}
						bearing={0}
						layers={['mainstreets-toronto', 'pickering', 'pickering-fill']}
						section={'overview'}
					/>
				</div>
			</div>
		</section>
		<section data-id="map2">
			<div class="section-container">
				<div class="content-container sticky-content">
<h2>Built Form</h2>
					<p>
						The built form of the case study area is represented through the 3D building layer,
						transit stops and lines, as well as green space, including a comparative graph of the %
						of green space present within the case study area, a 10 minute walk radius and in the
						Census Metropolitan Area the case study is located in. Use the Satellite View toggle to
						see the case study area overlaid with satellite imagery.
					</p>
				</div>
				<div class="map-container">
					<div class="legend-container">
						<LegendItem
							variant={'polygon'}
							label={'Pickering'}
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
						<SatelliteCheckbox casestudy={'pickering'} section={'builtform'} />
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clt364z4n022w01qj05196ebi'}
						center={[-79.1213, 43.8143]}
						zoom={15}
						minZoom={13}
						pitch={50}
						bearing={60}
						layers={[
							'pickering',
							'pickering-fill',
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
				<div class="content-container sticky-content">
					<h2>Civic Infrastructure</h2>
					<div class="controls">
						<i><small>Click on a layer to turn it on or off</small></i>
						<LegendItem
							variant={'circle'}
							label={'Arts and Culture'}
							bgcolor={'#DB3069'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-toronto-arts-culture'}
							section={'civicinfra'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Government and Community Services'}
							bgcolor={'#8A4285'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-toronto-govt-community'}
							section={'civicinfra'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Recreation'}
							bgcolor={'#43B171'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-toronto-recreation'}
							section={'civicinfra'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Healthcare'}
							bgcolor={'#33AED7'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-toronto-health'}
							section={'civicinfra'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Education'}
							bgcolor={'#F45D01'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-toronto-education'}
							section={'civicinfra'}
						/>
						<div class="checkbox">
							<IsochroneCheckbox
								section={'civicinfra'}
								layer={'pickering-isochrone'}
								minZoom={13}
								maxZoom={13.3}
							/>
							<EmploymentSizeCheckbox
								section={'civicinfra'}
								layers={[
									'civicinfra-toronto-education',
									'civicinfra-toronto-govt-community',
									'civicinfra-toronto-arts-culture',
									'civicinfra-toronto-health',
									'civicinfra-toronto-recreation'
								]}
								minZoom={13}
								maxZoom={13.3}
							/>
						</div>
					</div>
					<p>
						Civic Infrastructure present in the case study area is represented through 5 categories:
						Education, Government & Community Services, Arts & Culture, Recreation, and Healthcare.
						For more information about how we classified these categories, read our <a
							href="about/data-methodology">Data and Methodology</a
						>. The graph displays the proportional mix of Civic Infrastucture in the case study
						area, a 10 minute walk radius and in the Census Metropolitan Area the case study is
						located in.
					</p>
					<p>
						Click on the 10 Minute Walk and Employment Size toggles to view a 10 minute walk radius
						of the case study area, as well as the estimated employment sizes of each location of
						Civic Infrastructure.
					</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clt364z4n022w01qj05196ebi'}
						center={[-79.1189, 43.816]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={[
							'pickering',
							'pickering-fill',
							'civicinfra-toronto-education',
							'civicinfra-toronto-govt-community',
							'civicinfra-toronto-health',
							'civicinfra-toronto-arts-culture',
							'civicinfra-toronto-recreation'
						]}
						section={'civicinfra'}
						attribution={'Canadian Urban Institute | Data Source: Environics Analytics'}
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
				<div class="content-container sticky-content">
					<h2>Business Profile</h2>
					<div class="controls">
						<i><small>Click on a layer to turn it on or off</small></i>
						<LegendItem
							variant={'circle'}
							label={'Retail'}
							bgcolor={'#F13737'}
							bordercolor={'#fff'}
							button={true}
							id={'business-toronto-retail'}
							section={'business'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Local Services'}
							bgcolor={'#2a5cac'}
							bordercolor={'#fff'}
							button={true}
							id={'business-toronto-services'}
							section={'business'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Food and Drink'}
							bgcolor={'#43b171'}
							bordercolor={'#fff'}
							button={true}
							id={'business-toronto-food-drink'}
							section={'business'}
						/>
						<div class="checkbox">
							<IsochroneCheckbox
								section={'business'}
								layer={'pickering-isochrone'}
								minZoom={13}
								maxZoom={13.3}
							/>
							<EmploymentSizeCheckbox
								section={'business'}
								layers={[
									'business-toronto-retail',
									'business-toronto-services',
									'business-toronto-food-drink'
								]}
								minZoom={13}
								maxZoom={13.3}
							/>
						</div>
					</div>
					<p>
						Main Street Businesses present in the case study area are represented through 3
						categories: Retail, Food & Drink and Local Services. For more information about how we
						classified these categories, read our <a href="about/data-methodology"
							>Data and Methodology</a
						>. The graph displays the proportional mix of Main Street Businesses in the case study
						area, a 10 minute walk radius and in the Census Metropolitan Area the case study is
						located in.
					</p>
					<p>
						Click on the 10 Minute Walk and Employment Size toggles to view a 10 minute walk radius
						of the case study area, as well as the estimated employment sizes of each Main Street
						Business.
					</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clt364z4n022w01qj05196ebi'}
						center={[-79.1189, 43.816]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={[
							'pickering',
							'pickering-fill',
							'business-toronto-retail',
							'business-toronto-food-drink',
							'business-toronto-services'
						]}
						section={'business'}
						attribution={'Canadian Urban Institute | Data Source: Environics Analytics'}
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
				<div class="content-container sticky-content">
					<h2>Employment Profile</h2>
					<p>
						The estimated employment size of all entities, including main street businesses, civic
						infrastructure and others, are displayed on this map. For more information about how we
						calculated these, read our <a href="about/data-methodology">Data and Methodology</a>.
					</p>
					<img id="employmentsizelegend" src={EmpSizeLegend} alt="legend" />
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clt364z4n022w01qj05196ebi'}
						center={[-79.1189, 43.816]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['pickering', 'pickering-fill', 'employment-size']}
						section={'employmentsize'}
						attribution={'Canadian Urban Institute | Data Source: Environics Analytics'}
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
					</div>
				</div>
			</div>
		</section>
		<section data-id="map6">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Housing</h2>
					<div class="controls">
						<Dropdown
							casestudy={'pickering'}
							section={'housing'}
							region={'toronto'}
							options={[
								{ id: 'populationdensity', text: 'Population Density' },
								{ id: 'dwellings', text: 'Dwellings' },
								{ id: 'single-detached', text: 'Single Detached' },
								{ id: 'semi-detached', text: 'Semi Detached' },
								{ id: 'duplex', text: 'Duplex' },
								{ id: 'apartment-more-5-stories', text: 'Apartments (more than 5 stories)' },
								{ id: 'apartment-less-5-stories', text: 'Apartments (less than 5 stories)' }
							]}
						/>
					</div>
					<p>
						The map displays a choropleth vizualisation of key housing related Census variables at
						the Dissemination Area level of the case study and surrounding area. Use the dropdown to
						toggle between different variables. The data is sourced from Environics Analytics and
						Statistics Canada.
					</p>
					<p>
						The charts contrast the housing construction year and the types of housing between the
						case study area and the Census Metropolitan Area the case study is located in.
					</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clt364z4n022w01qj05196ebi'}
						center={[-79.1189, 43.816]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['pickering-outline', 'populationdensity']}
						section={'housing'}
						attribution={'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="graphics-container">
						<div class="chart">
							<ColumnChart
								colors={['#002a41', '#0098D6']}
								data={housingconstruction}
								xKey="Construction Year"
								yKey="Percentage"
								zKey="Area"
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
								xKey="Housing Type"
								yKey="Percentage"
								zKey="Area"
								mode="grouped"
								title="Housing Type (%)"
								padding={{ top: 10, bottom: 20, left: 10 }}
								legend
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
		<section data-id="map7">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Local Characteristics</h2>
					<div class="controls">
						<Dropdown
							casestudy={'pickering'}
							section={'demographics'}
							region={'toronto'}
							options={[
								{ id: 'average-age', text: 'Average Age' },
								{ id: 'household-size', text: 'Household Size' },
								{ id: 'average-income', text: 'Average Income' },
								{ id: 'visibleminority', text: 'Visible Minorities' },
								{ id: 'immigrants', text: 'Immigrants and Non-Permanent Residents' },
								{ id: 'indigenous', text: 'Indigenous Population' },
								{ id: 'english-speakers', text: 'English Speakers' },
								{ id: 'french-speakers', text: 'French Speakers' },
								{ id: 'education-bachelors', text: "Bachelor's Degree Holders" }
							]}
						/>
					</div>
					<p>
						The map displays a choropleth vizualisation of key demograhoic and other local
						characteristic related Census variables at the Dissemination Area level of the case
						study and surrounding area. Use the dropdown to toggle between different variables. The
						data is sourced from Environics Analytics and Statistics Canada.
					</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clt364z4n022w01qj05196ebi'}
						center={[-79.1189, 43.816]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['pickering-outline', 'average-age']}
						section={'demographics'}
					/>
				</div>
			</div>
		</section>
		<section data-id="map8">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Visitors</h2>
					<div class="controls">
						<h5>Year</h5>
						<RangeSlider
							on:change={(e) => {
								const year = e.detail.value;
								if (map.isStyleLoaded()) {
									const years = [2019, 2020, 2021, 2022];
									years.forEach((y) => {
										const visibility = y === year ? 'visible' : 'none';
										map.setLayoutProperty(`visitors-${y}`, 'visibility', visibility);
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
							hoverable={false}
						/>
					</div>
					<p>
						The heatmap displayed represents the pattern of daily visits from the visitor's home
						location from 2019 to 2022, which is sourced from Environics Analytics MobileScapes
						data. To learn more, read our <a href="about/data-methodology">Data and Methodology</a>.
					</p>
					<p>
						The charts display the pattern of visits (relative to 2019) as a line chart, the visit
						count by type of visitor, as well as the breakdown of visits by time of day and week.
					</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clt364z4n022w01qj05196ebi'}
						center={[-79.1189, 43.816]}
						zoom={9}
						pitch={0}
						bearing={-15}
						layers={['pickering-outline', 'visitors-2022']}
						section={'visitors'}
						attribution={'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="legend-container">
						<Legend
							minlabel={'0'}
							maxlabel={'59,100'}
							label={'Number of Daily Visits from Visitor Home Location'}
							gradient={gradients.heatmap}
						/>
					</div>
					<div class="graphics-container" id="visitor-charts">
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
								title="Level of Visits % (Relative to 2019)"
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
								title="Visit Count by Type of Visitor"
								padding={{ top: 20, bottom: 20, left: 70 }}
								legend
							/>
						</div>
						<div class="chart">
							<BarChart
								colors={['#002a41']}
								data={visitortimeofday}
								yKey="Time"
								xKey="Percentage"
								title="Visits (%) by Time of Day"
								padding={{ top: 0, bottom: 20, left: 80 }}
							/>
						</div>
						<div class="chart">
							<BarChart
								colors={['#0098D6']}
								data={visitordayofweek}
								yKey="Day"
								xKey="Percentage"
								title="Visits (%) by Day of Week"
								padding={{ top: 0, bottom: 20, left: 80 }}
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
	<Summary name={'Kingston Road (Pickering)'} location={'Toronto, Ontario'} />
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
		flex-direction: column;
	}
	.chart {
		border: 2px solid #ddd;
		border-radius: 0.5em;
		padding: 1em;
		margin: 1em 0 0 0;
		/* width: 100%; */
	}

	.map-container {
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
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
		margin: 1em 0 0 0;
	}

	.checkbox {
		display: flex;
		flex-direction: column;
	}

	/* MOBILE FLEX COLUMN (STACKED) LAYOUT */

	@media only screen and (max-width: 768px) {
		section {
			padding: 2em;
			border-bottom: 1px solid #ddd;
		}

		.section-container {
			flex-direction: column;
		}

		.content-container {
			max-width: 100%;
		}

		.controls {
			margin: 0 0 1em 0;
			width: 100%;
		}

		.legend-container {
			position: relative;
			right: 0;
			top: 0;
			margin: 1em 0 1em 0;
		}
	}

	/* DESKTOP TEXT LAYOUT (SIDE BY SIDE) */

	@media only screen and (min-width: 768px) {
		.content-container {
			max-width: 25%;
		}

		.sticky-content {
			position: -webkit-sticky; /* for Safari */
			position: sticky;
			top: 1em;
			align-self: flex-start; /* <-- this is the fix */
		}

		#visitor-charts {
			display: grid;
			grid-template-columns: 1fr 1fr;
			column-gap: 1em;
		}
	}
</style>
