<script>
	/* -------------------------------------------------------------------------- */
	/*                                   Imports                                  */
	/* -------------------------------------------------------------------------- */

	import Title from '../../../lib/ui/Title.svelte';
	import HundredEighteenAlbertaAve from '../../../lib/assets/boundaries/edmontonboundaries/118AlbertaAve.svg';

	import EmpSizeLegend from '../../../lib/assets/employmentsizelegend.svg';

	import Summary from '../../../lib/ui/Summary.svelte';

	import greenspace from '../../../lib/data/casestudydata/edmonton/118albertaave/greenspace';
	import civicmix from '../../../lib/data/casestudydata/edmonton/118albertaave/civicmix';
	import businessmix from '../../../lib/data/casestudydata/edmonton/118albertaave/businessmix';
	import housingtype from '../../../lib/data/casestudydata/edmonton/118albertaave/housingtype';
	import housingconstruction from '../../../lib/data/casestudydata/edmonton/118albertaave/housingconstruction';
	import visitortraffic from '../../../lib/data/casestudydata/edmonton/118albertaave/visitortraffic';
	import visitortypes from '../../../lib/data/casestudydata/edmonton/118albertaave/visitortypes';
	import visitortimeofday from '../../../lib/data/casestudydata/edmonton/118albertaave/visitortimeofday';
	import visitordayofweek from '../../../lib/data/casestudydata/edmonton/118albertaave/visitordayofweek';

	import Legend from '../../../lib/ui/legends/Legend.svelte';
	import LegendItem from '../../../lib/ui/legends/LegendItem.svelte';
	import IsochroneCheckbox from '../../../lib/ui/checkbox/IsochroneCheckbox.svelte';
	import EmploymentSizeCheckbox from '../../../lib/ui/checkbox/EmploymentSizeCheckbox.svelte';
	import PhotosCheckbox from '../../../lib/ui/checkbox/PhotosCheckbox.svelte';
	import SatelliteCheckbox from '../../../lib/ui/checkbox/SatelliteCheckbox.svelte';
	import Dropdown from '../../../lib/ui/Dropdown.svelte';
	import CaseStudyMap from '../../../lib/CaseStudyMap.svelte';

	import { timeFormat } from 'd3-time-format';
	import { browser } from '$app/environment';
	import mapboxgl from 'mapbox-gl';

	import { ColumnChart, BarChart, LineChart } from '@onsvisual/svelte-charts';

	import RangeSlider from 'svelte-range-slider-pips';
	import { sexagesimalToDecimal } from 'geolib';
	import { buildImageUrl } from 'cloudinary-build-url';
	import { setConfig } from 'cloudinary-build-url';

	import { onMount } from 'svelte';

	import { visitorMapStore, mapStoreList } from '../../../lib/mapStore';

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

	let sections = ['builtform', 'civicinfra', 'business', 'housing'];

	let photosections = {
		builtform: '2_Built_Form',
		civicinfra: '3_Civic',
		business: '4_Business',
		housing: '5_Housing'
	};

	let map = null;

	/* -------------------------------------------------------------------------- */
	/*                                   Stores                                   */
	/* -------------------------------------------------------------------------- */

	visitorMapStore.subscribe((value) => {
		map = value;
	});

	let mapInstances = {};

	/* -------------------------------------------------------------------------- */
	/*                                Photos Setup                                */
	/* -------------------------------------------------------------------------- */

// Cloudinary Config

setConfig({
		cloudName: 'dfseerxb3'
	});

	// getting access to json data from page.server.js
	export let data;
	const photosJSON = data.photos;

	function createGeoJSON(filterString = null) {
		// Create GeoJSON structure
		const geojson = {
			type: 'FeatureCollection',
			features: []
		};

		// Iterate through resources (long/lat cleaning)

		photosJSON.resources.forEach((resource) => {
			let latitude, longitude;
			resource.metadata.forEach((meta) => {
				if (meta.external_id === 'latitude' && meta.value != 0) {
					const cleanLatitude = meta.value.replace(' deg ', '° ').trim(); // clean latitude
					latitude = sexagesimalToDecimal(cleanLatitude); // convert to decimal value
				} else if (meta.external_id === 'longitude' && meta.value != 0) {
					const cleanLongitude = meta.value.replace(' deg ', '° ').trim(); // clean latitude
					longitude = sexagesimalToDecimal(cleanLongitude); // convert to deicmal value
				}
			});

			// building images

			if (latitude && longitude) {
				if (!filterString || resource.public_id.includes(filterString)) {
					let url = buildImageUrl(resource.public_id, {
						transformations: {
							rawTransformation: 'c_scale,h_300'
						}
					});
					let thumburl = buildImageUrl(resource.public_id, {
						transformations: {
							rawTransformation: 'r_5,bo_5px_solid_white,c_scale,h_30' // 5 rounding, 5 border, 30 height
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
							thumbnail: thumburl,
							width: resource.width,
							height: resource.height
						}
					};
					geojson.features.push(feature);
				}
			}
		});

		return geojson;
	}

	onMount(() => {
		mapStoreList.subscribe((value) => {
			mapInstances = value;
			// for each map insance, find section
			Object.entries(mapInstances).forEach(([id, map]) => {
				if (map && id) {
					const section = sections.find((sec) => sec === id);
					if (section) {
						const sectionValue = photosections[section];
						const sectionGeoJSON = createGeoJSON(sectionValue);
						// Add markers to the map.
						for (const marker of sectionGeoJSON.features) {
							if (browser) {
								// Create a DOM element for each marker.
								const el = document.createElement('div');
								const thumburl = marker.properties.thumbnail;
								const width = marker.properties.width;
								const height = marker.properties.height;
								const url = marker.properties.url;
								// calc new width based on new height (100) and add 15px border on each side (30)
								const scaledWidth = (width / height) * 30 + 10;
								el.className = `marker-${section}`;
								el.style.backgroundImage = `url(${thumburl})`;
								el.style.width = `${scaledWidth}px`;
								el.style.height = '40px';
								el.style.backgroundSize = '100%';

								//popup
								const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
									`<img src="${url}" style="width:100%;padding: 0.5em 0.5em 0 0.5em;">`
								);

								// Add markers to the map.
								new mapboxgl.Marker(el)
									.setLngLat(marker.geometry.coordinates)
									.setPopup(popup)
									.addTo(map);
							}
						}
					}
				}
			});
		});
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
	<Title outline={HundredEighteenAlbertaAve} name={'118 Avenue (Alberta Avenue)'} location={'Edmonton, Alberta'} />
	<div class="container">
		<section data-id="map1">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Overview</h2>
					<p>118 Avenue is a commercial street in the Alberta neighbourhood of Edmonton. The street runs east-west and is located north of Edmonton's main downtown. This segment of 118 Avenue began as a main street for a smaller community, Norwood, before amalgamation.</p>
					<p>The history of 118 Avenue follows a non-linear trajectory of disrepair and revitalization. Today, the area has a strong local music, arts, and culture scene and an eclectic mix of residents, businesses, and visitors. The Avenue is home to permanent arts locales such as the Nina Haggerty Centre for the Arts and the Carrot Community Arts Coffeehouse, both established neighbourhood community hubs. The Avenue serves as the temporary home for arts festivals throughout the year.</p>
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
							label={'118 Ave (Alberta Avenue)'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9mwbk0003q01ns7k79dvj6'}
						center={[-113.481, 53.569]}
						zoom={13}
						pitch={50}
						bearing={0}
						layers={['mainstreets-edmonton', '118albertaave', '118albertaave-fill']}
						section={'overview'}
					/>
				</div>
			</div>
		</section>
		<section data-id="map2">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Built Form</h2>
					<p>118 Avenue itself has a consistent design throughout the study area from 95 St NW to 82 St NW. The streetscape consists of relatively wide, tree-lined sidewalks. There are four lanes for vehicles with street parking.</p>
					<p>The streets that connect with 118 form an alternating pattern of T intersections. At many, there are bump-outs and curb extensions with decorative benches and plants. Most side streets feature angled parking stalls along the sides of buildings, transitioning into residential areas where available parking becomes parallel.</p>
					<p>The scale of buildings are generally one to two-storeys in height and are consistent through the study area, save for residential apartments. There is little to no new infill development and many buildings have noticeable wear and tear. There are quite a few strip mall style lots with parking between the storefronts and sidewalks.</p>
				</div>
				<div class="map-container">
					<div class="legend-container">
						<LegendItem
							variant={'polygon'}
							label={'118 Ave (Alberta Avenue)'}
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
						<PhotosCheckbox section={'builtform'} layer={'builtform-photos'} />
						<SatelliteCheckbox casestudy={'118albertaave'} section={'builtform'} />

					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9mwbk0003q01ns7k79dvj6'}
						center={[-113.4908, 53.571]}
						zoom={15}
						minZoom={15}
						pitch={60}
						bearing={135}
						layers={[
							'118albertaave',
							'118albertaave-fill',
							'greenspaces',
							'transit-edmonton',
							'transit-edmonton-stops',
							'buildings-edmonton'
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
							id={'civicinfra-edmonton-arts-culture'}
							section={'civicinfra'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Government and Community Services'}
							bgcolor={'#8A4285'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-edmonton-govt-community'}
							section={'civicinfra'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Recreation'}
							bgcolor={'#43B171'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-edmonton-recreation'}
							section={'civicinfra'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Healthcare'}
							bgcolor={'#33AED7'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-edmonton-health'}
							section={'civicinfra'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Education'}
							bgcolor={'#F45D01'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-edmonton-education'}
							section={'civicinfra'}
						/>
						<div class="checkbox">
							<PhotosCheckbox section={'civicinfra'} layer={'civicinfra-photos'} />
							<IsochroneCheckbox section={'civicinfra'} layer={'118albertaave-isochrone'} minZoom={13} maxZoom={13.3}/>
							<EmploymentSizeCheckbox
								section={'civicinfra'}
								layers={[
									'civicinfra-edmonton-education',
									'civicinfra-edmonton-govt-community',
									'civicinfra-edmonton-arts-culture',
									'civicinfra-edmonton-health',
									'civicinfra-edmonton-recreation'
								]}
								minZoom={13} maxZoom={13.3}
							/>
						</div>
					</div>
					<p>118 Avenue lies within the Alberta Avenue BIA and was part of the Avenue Initiative Revitalization that began in 2006, a neighbourhood revitalization program aiming to attract people by improving the streetscape and vibrancy of the corridor.</p>
					<p>During the field visit, the 118 was lined with stone decorative benches, themed street signs, artistic cutouts attached to specialty street lanterns, and flower planters in bloom. Murals adorn the sides of many buildings. Investment, from both City and community initiatives, are evident in the look and feel of the Avenue.</p>
					<p>According to the Civic Infrastructure Index, this segment of 118 ranks 7th out of 20 Edmonton Main Streets and 3rd of 36 Neighbourhood Main Streets. Led by Arts on the Ave, the area is being developed into a community arts hub. The organization runs the Kaleido Family Arts Festival in the fall and Deep Freeze Festival in the winter.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9mwbk0003q01ns7k79dvj6'}
						center={[-113.4811, 53.5698]}
						zoom={14.1}
						minZoom={13.3}
						pitch={0}
						bearing={0}
						layers={[
							'118albertaave',
							'118albertaave-fill',
							'civicinfra-edmonton-education',
							'civicinfra-edmonton-govt-community',
							'civicinfra-edmonton-health',
							'civicinfra-edmonton-arts-culture',
							'civicinfra-edmonton-recreation'
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
							id={'business-edmonton-retail'}
							section={'business'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Local Services'}
							bgcolor={'#2a5cac'}
							bordercolor={'#fff'}
							button={true}
							id={'business-edmonton-services'}
							section={'business'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Food and Drink'}
							bgcolor={'#43b171'}
							bordercolor={'#fff'}
							button={true}
							id={'business-edmonton-food-drink'}
							section={'business'}
						/>
						<div class="checkbox">
							<PhotosCheckbox section={'business'} layer={'business-photos'} />
							<IsochroneCheckbox section={'business'} layer={'118albertaave-isochrone'} minZoom={13} maxZoom={13.3} />
							<EmploymentSizeCheckbox
								section={'business'}
								layers={[
									'business-edmonton-retail',
									'business-edmonton-services',
									'business-edmonton-food-drink'
								]}
								minZoom={13} maxZoom={13.3}
							/>
						</div>
					</div>
					<p>Business along 118 Avenue features a wide range of offerings, from specialty food stores to barber shops and hair salons. Many businesses are independent or family-run. Despite the many restaurants, there is a noticeable lack of patios and outdoor dining. There are also several auto body service and repair shops.</p>
					<p>According to the Independent Business Index, 118 Avenue in Alberta ranks 7th of 20 Edmonton Main Streets and 15th of Neighbourhood Main Streets. For business density, 118 Avenue ranks 10th of 20 and 18th of 36.</p>
					<p>While there are well-established community-oriented businesses, there are also many storefront that are vacant or up for lease or sale. These factors contribute to an overall sense of quietness on the street.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9mwbk0003q01ns7k79dvj6'}
						center={[-113.4811, 53.5698]}
						zoom={14.1}
						minZoom={13.3}
						pitch={0}
						bearing={0}
						layers={[
							'118albertaave',
							'118albertaave-fill',
							'business-edmonton-retail',
							'business-edmonton-food-drink',
							'business-edmonton-services'
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
					<p>Employment in along this segment of 118 Avenue is primarily concentrated on along the commercial street itself. Small establishments with zero to five employees line 118 Avenue, with slightly larger employers concentrated at the eastern end. 118 itself seems to play a local role as the primary commercial corridor as the surrounding neighbourhoods are almost solely residential with scattered establishments throughout.</p>
					<p>For employment density, 118 Avenue in Alberta ranks in the middle at 10th of 20 Edmonton Main Streets and 18th of 36 Neighbourhood Main Streets.</p>
					<img id="employmentsizelegend" src={EmpSizeLegend} alt="legend" />
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9mwbk0003q01ns7k79dvj6'}
						center={[-113.4811, 53.5698]}
						zoom={14.1}
						minZoom={13.3}
						pitch={0}
						bearing={0}
						layers={['118albertaave', '118albertaave-fill', 'employment-size']}
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
							casestudy={'118albertaave'}
							section={'housing'}
							region={'edmonton'}
							options={[
								{ id: 'populationdensity', text: 'Population Density' },
								{ id: 'dwellings', text: 'Dwellings' },
								{ id: 'single-detached', text: 'Single Detached' },
								{ id: 'semi-detached', text: 'Semi Detached' },
								{ id: 'duplex', text: 'Duplex' },
								{ id: 'apartment-more-5-stories', text: 'Apartments (more than 5 stories)' },
								{ id: 'apartment-less-5-stories', text: 'Apartments (less than 5 stories)' },
							]}
						/>
						<PhotosCheckbox section={'housing'} layer={'housing-photos'} />
					</div>
					<p>The housing within the study area are located predominantly away from 118 Avenue itself. The streets and avenues in this area intersect in a grid pattern where streets are closer together than the avenues. This results in the north-south streets containing most of the housing stock, with the houses and apartments mostly facing east-west. There is one infill mixed-use building along the Avenue, but otherwise the housing is noticeably tucked behind the main street.</p>
					<p>The housing stock features mostly low-rise apartments (over 40%) followed by single-detached dwellings (almost 40%). Most of the housing was built in the pre-1960 to 1980 period. The area features less infill than other neighbourhoods of the same age in Edmonton.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9mwbk0003q01ns7k79dvj6'}
						center={[-113.4811, 53.5698]}
						zoom={14.1}
						minZoom={13.3}
						pitch={0}
						bearing={0}
						layers={['118albertaave-outline', 'populationdensity']}
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
							casestudy={'118albertaave'}
							section={'demographics'}
							region={'edmonton'}
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
					<p>Of residents in the study area, 31% are recent immigrants and 37% are visible minorities.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9mwbk0003q01ns7k79dvj6'}
						center={[-113.4811, 53.5698]}
						zoom={14.1}
						minZoom={13.3}
						pitch={0}
						bearing={0}
						layers={['118albertaave-outline', 'average-age']}
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
					<p>118 Avenue in Alberta's Resiliency Score ranks low at 15th of 20 Edmonton Main Streets and 24th of 36 Neighbourhood Main Streets.</p>
					<p>Since 2019 before the pandemic shutdowns, overall visit counts have decreased by more than 50% by 2022. But the level of visits relative to 2019 have been slowly recovering since the beginning of 2022. While this segment of 118 Avenue has relied primarily on infrequent visitors from across the region, despite visits across the board decreasing since 2019, resident and recurring visits have remained stable between 2021 and 2022 but have not recovered fully.</p>
					<p>It is busiest during the 12pm to 6pm period, with Friday being the busiest day but by only slightly over Saturday.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9mwbk0003q01ns7k79dvj6'}
						center={[-113.4811, 53.5698]}
						zoom={9}
						pitch={0}
						bearing={0}
						layers={['118albertaave-outline', 'visitors-2022']}
						section={'visitors'}
						attribution={'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="legend-container">
						<Legend
							minlabel={'0'}
							maxlabel={'33,200'}
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
	<Summary name={'118 Avenue (Alberta Avenue)'} location={'Edmonton, Alberta'} />
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
