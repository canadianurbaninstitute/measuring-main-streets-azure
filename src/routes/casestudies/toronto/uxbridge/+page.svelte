<script>
	/* -------------------------------------------------------------------------- */
	/*                                   Imports                                  */
	/* -------------------------------------------------------------------------- */

	import Title from '../../../lib/ui/Title.svelte';
	import uxbridge from '../../../lib/assets/boundaries/torontoboundaries/Uxbridge.svg';

	import EmpSizeLegend from '../../../lib/assets/employmentsizelegend.svg';

	import Summary from '../../../lib/ui/Summary.svelte';

	import greenspace from '../../../lib/data/casestudydata/toronto/uxbridge/greenspace';
	import civicmix from '../../../lib/data/casestudydata/toronto/uxbridge/civicmix';
	import businessmix from '../../../lib/data/casestudydata/toronto/uxbridge/businessmix';
	import housingtype from '../../../lib/data/casestudydata/toronto/uxbridge/housingtype';
	import housingconstruction from '../../../lib/data/casestudydata/toronto/uxbridge/housingconstruction';
	import visitortraffic from '../../../lib/data/casestudydata/toronto/uxbridge/visitortraffic';
	import visitortypes from '../../../lib/data/casestudydata/toronto/uxbridge/visitortypes';
	import visitortimeofday from '../../../lib/data/casestudydata/toronto/uxbridge/visitortimeofday';
	import visitordayofweek from '../../../lib/data/casestudydata/toronto/uxbridge/visitordayofweek';

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


	import { ColumnChart, BarChart, LineChart } from '@onsvisual/svelte-charts';

	import mapboxgl from "mapbox-gl";
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
									`<img src="${url}" style="width:100%;padding:0.5em 0.5em 0 0.5em;">`
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
	<Title outline={uxbridge} name={'Brock Street (Uxbridge)'} location={'Toronto, Ontario'} />
	<div class="container">
		<section data-id="map1">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Overview</h2>
					<p>Situated approximately 80 kilometers northeast of Toronto, Uxbridge is a township in south-central Ontario, characterized by its primarily suburban setting and a population of just over 20,000 residents. The segment of Brock St. between Main St. N and Railway St. serves as the primary commercial main street for the Uxbridge township. This section of Brock St. features a notably higher business density, particularly when compared to surrounding Uxbridge neighborhoods, solidifying its status as a key commercial thoroughfare in the township. While a historic train station anchors one end of this downtown area, it no longer operates as a railway station but instead houses a train museum. Currently, a GO bus service station stop is located outside the old station.</p>

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
							label={'Uxbridge'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq5mgbzm000a01ql2n0ggdqd'}
						center={[-79.1221, 44.109]}
						zoom={15}
						pitch={35}
						bearing={-18}
						layers={['mainstreets-toronto', 'uxbridge', 'uxbridge-fill']}
						section={'overview'}
					/>
				</div>
			</div>
		</section>
		<section data-id="map2">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Built Form</h2>
					<p>Brock St. is centrally located in Uxbridge, which results in the street experiencing relatively high levels of vehicular through-traffic. The street’s built form generally supports this vehicular traffic and movement as it is a wide street, featuring one circulation and one lane of on-street parking in each direction. While the street is generally car-centric in its design and does not feature any cycling infrastructure, it does boast wide sidewalks to support active mobility and pedestrian street life.</p>
					<p>The building stock on Brock St. primarily consists of mid-density, two-storey brick structures with ground floor retail. While Brock St. is underserved in terms of availability of greenspace on the street itself, the street is accessible to greenspace within a 10-minute walk, albeit at a slightly lower percentage of greenspace than the Toronto CMA average.</p>

				</div>
				<div class="map-container">
					<div class="legend-container">
						<LegendItem
							variant={'polygon'}
							label={'Uxbridge'}
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
						<SatelliteCheckbox casestudy={'uxbridge'} section={'builtform'} />

					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq5mgbzm000a01ql2n0ggdqd'}
						center={[-79.1226, 44.1088]}
						zoom={15}
						minZoom={15}
						pitch={40}
						bearing={-18}
						layers={[
							'uxbridge',
							'uxbridge-fill',
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
							<PhotosCheckbox section={'civicinfra'} layer={'civicinfra-photos'} />
							<IsochroneCheckbox section={'civicinfra'} layer={'uxbridge-isochrone'} minZoom={13} maxZoom={13.3}/>
							<EmploymentSizeCheckbox
								section={'civicinfra'}
								layers={[
									'civicinfra-toronto-education',
									'civicinfra-toronto-govt-community',
									'civicinfra-toronto-arts-culture',
									'civicinfra-toronto-health',
									'civicinfra-toronto-recreation'
								]}
								minZoom={13} maxZoom={13.3}
							/>
						</div>
					</div>
					<p>Brock St. and its immediate vicinity host a relative concentration of civic infrastructure, reinforcing its importance as a key main street for the surrounding neighborhoods. Notably, the nearby Uxbridge Railway Station functions as both a railway museum and a stop for the historic York-Durham Heritage Railway. Additionally, this segment of Brock St. itself features three health facilities directly on the street and six more in close proximity. The street also offers a variety of recreational facilities which surpasses the Toronto CMA average. However, there is a limited presence of government services, community services, and educational facilities along the street. Nonetheless, residents have convenient access to these services and civic amenities within a 10-minute walk</p>
					<p>According to the Civic Infrastructure Index, Brock St. lags behind most other main street case studies. In terms of its civic opportunity, Brock St. ranks 14th out of 20 Toronto main streets and 8th out of 12 small town main streets.</p>

				</div>	
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq5mgbzm000a01ql2n0ggdqd'}
						center={[-79.1226, 44.1088]}
						zoom={15}
						minZoom={13.3}
						pitch={0}
						bearing={-18}
						layers={[
							'uxbridge',
							'uxbridge-fill',
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
							<PhotosCheckbox section={'business'} layer={'business-photos'} />
							<IsochroneCheckbox section={'business'} layer={'uxbridge-isochrone'} minZoom={13} maxZoom={13.3} />
							<EmploymentSizeCheckbox
								section={'business'}
								layers={[
									'business-toronto-retail',
									'business-toronto-services',
									'business-toronto-food-drink'
								]}
								minZoom={13} maxZoom={13.3}
							/>
						</div>
					</div>
					<p>Brock St.’s central location in Uxbridge and its role as a commercial main street results in a general clustering of businesses on and around this segment of the street. While retail is the most prevalent type of business on Brock St., the street does offer a relatively equal mix of retail, services, and food and drink establishments. Most of these businesses are local and independent, although a few national chain stores like Pizza Pizza are also present. Although there is no grocery store directly on Brock St., residents can easily access one located southwest of Main St. During the warmer months, businesses extend onto the wide sidewalks, offering customers an indoor-outdoor experience.</p>
					<p>Brock St. lags behind other main street case studies in terms of level of independence of the businesses, ranking 13th out of 20 Toronto main streets and 8th out of 12 small town main streets. In terms of business density, the street ranks 5th in the region and 4th out of the 12 small town main streets.</p>
					<p>This section of Brock St. provides a number of small-scale employment options for Uxbridge and the surrounding communities. The concentration of retail and other businesses in this area creates a relative clustering of employment opportunities. Many of these businesses are small in size, typically employing between zero to five individuals. Additionally, the presence of essential civic infrastructure along the street creates additional employment opportunities, although also at a small scale with similar employment figures. However, among these smaller employers, there are also some larger businesses both directly on Brock St. and in the surrounding vicinity. Notably, just north of Brock St. are several larger-scale employers with staff numbers exceeding 50, while southeast of the street, significant civic infrastructures employ between 50 to 100 employees.  This small-scale of employment opportunities translates to the streets overall employment density. Overall, Brock St. ranks 17th out of 20 Toronto main streets in terms of employment density and 7th out of 12 small town main streets.</p>

				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq5mgbzm000a01ql2n0ggdqd'}
						center={[-79.1226, 44.1088]}
						zoom={15}
						minZoom={13.3}
						pitch={0}
						bearing={-18}
						layers={[
							'uxbridge',
							'uxbridge-fill',
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
					<p>This section of Brock St. provides a number of small-scale employment options for Uxbridge and the surrounding communities. The concentration of retail and other businesses in this area creates a relative clustering of employment opportunities. Many of these businesses are small in size, typically employing between zero to five individuals. Additionally, the presence of essential civic infrastructure along the street creates additional employment opportunities, although also at a small scale with similar employment figures. However, among these smaller employers, there are also some larger businesses both directly on Brock St. and in the surrounding vicinity. Notably, just north of Brock St. are several larger-scale employers with staff numbers exceeding 50, while southeast of the street, significant civic infrastructures employ between 50 to 100 employees.</p>  
					<p>This small-scale of employment opportunities translates to the streets overall employment density. Overall, Brock St. ranks 17th out of 20 Toronto main streets in terms of employment density and 7th out of 12 small town main streets.</p>

					<img id="employmentsizelegend" src={EmpSizeLegend} alt="legend" />
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq5mgbzm000a01ql2n0ggdqd'}
						center={[-79.1226, 44.1088]}
						zoom={15}
						minZoom={13.3}
						pitch={0}
						bearing={-18}
						layers={['uxbridge', 'uxbridge-fill', 'employment-size']}
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
							casestudy={'uxbridge'}
							section={'housing'}
							region={'toronto'}
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
					<p>Uxbridge is a small suburban town and the population density is generally low. However, Brock St., and the areas directly adjacent to it, do offer a higher population density. While Uxbridge is primarily dominated by single-detached houses, the area on and around Brock St. does have a notable presence of low-rise apartment buildings of under five-storeys. This presence of higher-density housing near the main street contributes to the increased population density on and around the street compared to the surrounding neighbourhoods of Uxbridge.</p> 
					<p> The housing stock on and around Brock St. is generally older, with over 40% of the entire housing stock built before 1960. While the following years did see housing being built, new housing construction stagnated by 2000. In recent years, however, Uxbridge has seen a slight increase in new housing construction since 2016.</p>

				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq5mgbzm000a01ql2n0ggdqd'}
						center={[-79.1226, 44.1088]}
						zoom={15}
						minZoom={13.3}
						pitch={0}
						bearing={-18}
						layers={['uxbridge-outline', 'populationdensity']}
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
							casestudy={'uxbridge'}
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
					<p>The residents of Brock St. offer distinct socio-economic characteristics, especially when comparing the main street to the surrounding areas. In general, the average age and income of Brock St. residents is lower on average. This is especially true in terms of average income, as the areas surrounding Brock St., primarily north and south of the street, boast significantly high average incomes. Additionally, the presence of higher density housing, primarily in the low-rise apartment buildings, does result in a notably smaller average household size among Brock St. residents compared to the rest of Uxbridge.  In terms of demographics, there is minimal diversity in terms of the percentages of visible minorities, Indigenous peoples, and recent immigrants.</p>

				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq5mgbzm000a01ql2n0ggdqd'}
						center={[-79.1226, 44.1088]}
						zoom={15}
						minZoom={13.3}
						pitch={0}
						bearing={-18}
						layers={['uxbridge-outline', 'average-age']}
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
					<p>Brock St. has seen a resurgence of visitors since the COVID-19 pandemic. While many main streets across the country struggle to return to 2019 visitor numbers, Brock St. has seen significant growth in the number of visitors to the street. Indeed, most recent data shows that Brock St. is at almost 150 percent the level of visits relative to the same time in 2019. While the numbers of infrequent visitors have not fully recovered to 2019 figures, the street has seen a growth in the number of recurring visitors which signifies a potential new normal and reality for the street.</p>
					<p>Additionally, visits to Brock St. are evenly spread across all days of the week. This indicates that the street plays a significant role both during working hours and for leisure activities on weekends. The only exception is a slightly lower percentage of visits on Sundays.</p>
					<p>As a result, Brock St. ranks well in terms of its overall street resilience and visitor recovery, ranking 5th out of 20 Toronto main streets and 4th out of 12 small town main streets.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq5mgbzm000a01ql2n0ggdqd'}
						center={[-79.1226, 44.1088]}
						zoom={9}
						pitch={0}
						bearing={-15}
						layers={['uxbridge-outline', 'visitors-2022']}
						section={'visitors'}
						attribution={'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="legend-container">
						<Legend
							minlabel={'0'}
							maxlabel={'19,700'}
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
	<Summary name={'Brock Street (Uxbridge)'} location={'Toronto, Ontario'} />
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
		min-width: 20vw;
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
