<script>
	/* -------------------------------------------------------------------------- */
	/*                                   Imports                                  */
	/* -------------------------------------------------------------------------- */

	import Title from '../../../lib/ui/Title.svelte';
	import thorncliffepark from '../../../lib/assets/boundaries/torontoboundaries/ThorncliffePark.svg';

	import EmpSizeLegend from '../../../lib/assets/employmentsizelegend.svg';

	import Summary from '../../../lib/ui/Summary.svelte';

	import greenspace from '../../../lib/data/casestudydata/toronto/thorncliffepark/greenspace';
	import civicmix from '../../../lib/data/casestudydata/toronto/thorncliffepark/civicmix';
	import businessmix from '../../../lib/data/casestudydata/toronto/thorncliffepark/businessmix';
	import housingtype from '../../../lib/data/casestudydata/toronto/thorncliffepark/housingtype';
	import housingconstruction from '../../../lib/data/casestudydata/toronto/thorncliffepark/housingconstruction';
	import visitortraffic from '../../../lib/data/casestudydata/toronto/thorncliffepark/visitortraffic';
	import visitortypes from '../../../lib/data/casestudydata/toronto/thorncliffepark/visitortypes';
	import visitortimeofday from '../../../lib/data/casestudydata/toronto/thorncliffepark/visitortimeofday';
	import visitordayofweek from '../../../lib/data/casestudydata/toronto/thorncliffepark/visitordayofweek';

	import Legend from '../../../lib/ui/legends/Legend.svelte';
	import LegendItem from '../../../lib/ui/legends/LegendItem.svelte';
	import IsochroneCheckbox from '../../../lib/ui/checkbox/IsochroneCheckbox.svelte';
	import EmploymentSizeCheckbox from '../../../lib/ui/checkbox/EmploymentSizeCheckbox.svelte';
	import PhotosCheckbox from '../../../lib/ui/checkbox/PhotosCheckbox.svelte';
	import SatelliteCheckbox from '../../../lib/ui/checkbox/SatelliteCheckbox.svelte';
	import Dropdown from '../../../lib/ui/Dropdown.svelte';
	import CaseStudyMap from '../../../lib/CaseStudyMap.svelte';

	import { timeFormat } from 'd3-time-format';

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

	// setConfig({
	// 	cloudName: 'dfseerxb3'
	// });

	// export let data;

	// const photosJSON = data.photos;

	// function createGeoJSON(filterString = null) {
	// 	// Create GeoJSON structure
	// 	const geojson = {
	// 		type: 'FeatureCollection',
	// 		features: []
	// 	};

	// 	// Iterate through resources (long/lat cleaning)

	// 	photosJSON.resources.forEach((resource) => {
	// 		let latitude, longitude;
	// 		resource.metadata.forEach((meta) => {
	// 			if (meta.external_id === 'latitude') {
	// 				const cleanLatitude = meta.value.replace(/\\/g, '').replace(/\s*deg/g, '°'); // clean latitude
	// 				latitude = sexagesimalToDecimal(cleanLatitude); // convert to decimal value
	// 			} else if (meta.external_id === 'longitude') {
	// 				const cleanLongitude = meta.value.replace(/\\/g, '').replace(/\s*deg/g, '°'); // clean latitude
	// 				longitude = sexagesimalToDecimal(cleanLongitude); // convert to deicmal value
	// 			}
	// 		});

	// 		// building images

	// 		if (latitude && longitude) {
	// 			if (!filterString || resource.public_id.includes(filterString)) {
	// 				let url = buildImageUrl(resource.public_id, {
	// 					transformations: {
	// 						rawTransformation: 'c_scale,h_300'
	// 					}
	// 				});
	// 				let thumburl = buildImageUrl(resource.public_id, {
	// 					transformations: {
	// 						rawTransformation: 'r_15,bo_15px_solid_white,c_scale,h_200'
	// 					},
	// 					format: 'png'
	// 				});

	// 				const feature = {
	// 					type: 'Feature',
	// 					geometry: {
	// 						type: 'Point',
	// 						coordinates: [longitude, latitude]
	// 					},
	// 					properties: {
	// 						public_id: resource.public_id,
	// 						url: url,
	// 						thumbnail: thumburl
	// 					}
	// 				};
	// 				geojson.features.push(feature);
	// 			}
	// 		}
	// 	});

	// 	return geojson;
	// }

	// // all photos

	// const photosGeoJSON = createGeoJSON();

	// // create images list for AddImage and LoadImage to work properly

	// const images = photosGeoJSON.features.map((feature) => ({
	// 	url: feature.properties.thumbnail,
	// 	id: feature.properties.public_id
	// }));

	// onMount(() => {
	// 	// subscribe to store
	// 	mapStoreList.subscribe((value) => {
	// 		mapInstances = value;
	// 		// for each map insance, find section and add layer
	// 		Object.entries(mapInstances).forEach(([id, map]) => {
	// 			if (map && id) {
	// 				const section = sections.find((sec) => sec === id);
	// 				if (section) {
	// 					Promise.all(
	// 						images.map(
	// 							(img) =>
	// 								new Promise((resolve, reject) => {
	// 									map.loadImage(img.url, (error, res) => {
	// 										if (error) {
	// 											console.log(error);
	// 											reject(error);
	// 										} else {
	// 											map.addImage(img.id, res);
	// 											resolve();
	// 										}
	// 									});
	// 								})
	// 						)
	// 					).then(() => {
	// 						console.log('Images loaded');
	// 					});

	// 					map.on('style.load', () => {
	// 						// based on photosection list, has to match cloudinary photo names
	// 						const sectionValue = photosections[section];
	// 						// Use sectionValue to create the sourceData dynamically
	// 						let sourceData = createGeoJSON(sectionValue);
	// 						// dynamic source name
	// 						let sourceName = `${section}-photos`;

	// 						map.addSource(sourceName, {
	// 							type: 'geojson',
	// 							data: sourceData
	// 						});

	// 						map.addLayer({
	// 							id: sourceName,
	// 							type: 'symbol',
	// 							source: sourceName,
	// 							layout: {
	// 								'icon-image': ['get', 'public_id'], // reference the image
	// 								'icon-ignore-placement': true,
	// 								'icon-size': 0.2,
	// 								'icon-allow-overlap': true,
	// 								visibility: 'visible'
	// 							}
	// 						});
	// 					});
	// 				}
	// 			}
	// 		});
	// 	});
	// });
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
	<Title outline={thorncliffepark} name={'Overlea Boulevard (Thorncliffe Park)'} location={'Toronto, Ontario'} />
	<div class="container">
		<section data-id="map1">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Overview</h2>
					<p>Overlea Boulevard, running east-west, is the Neighbourhood Main Street of the Thorncliffe Park neighbourhood, located at the geographic centre of Toronto.</p>
					<p>With the construction of the Ontario Line subway and its maintenance and storage facility, the area is undergoing significant change.</p>
					<p>The Thorncliffe Park study area extends west to east across the near entirety of Overlea Boulevard, from Millwood Rd to the bridge over the Don River. It includes all the estabishments north of the Boulevard up to the railway and hydro corridor, and the Overlea Mews plaza and East York Town Centre mall to the south.</p>

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
							label={'Thorncliffe Park'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq2v0eo2017201p6hvc26ctb'}
						center={[-79.341, 43.704]}
						zoom={13}
						pitch={50}
						bearing={0}
						layers={['mainstreets-toronto', 'thorncliffepark', 'thorncliffepark-fill']}
						section={'overview'}
					/>
				</div>
			</div>
		</section>
		<section data-id="map2">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Built Form</h2>
					<p>Overlea Boulevard is a four lane road with a grassy, tree-lined central median that tapers to give way for left turn lanes at major intersections. The sidewalks are narrow, typical of suburban development, separated from the road by a strip of grass. As Overlea Boulevard is the one road into and out of the study area, it is well served by a series of school and transit buses.</p>
					<p>Buildings are set far back from the roads, often with parking fronting the lots. North of Overlea includes low-density, suburban-style strip malls, plazas, and parking lots. East York Town Centre lies to the south surrounded in a sea of parking. Residential apartment complexes lie further south.</p>

				</div>
				<div class="map-container">
					<div class="legend-container">
						<LegendItem
							variant={'polygon'}
							label={'Thorncliffe Park'}
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
						<SatelliteCheckbox casestudy={'thorncliffepark'} section={'builtform'} />

					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq2v0eo2017201p6hvc26ctb'}
						center={[-79.348, 43.7076]}
						zoom={15}
						minZoom={15}
						pitch={40}
						bearing={-15}
						layers={[
							'thorncliffepark',
							'thorncliffepark-fill',
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
							<IsochroneCheckbox section={'civicinfra'} layer={'thorncliffepark-isochrone'} minZoom={13} maxZoom={13.3}/>
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
					<p>Thorncliffe Park, when compared to the Toronto CMA, has a much higher proportion of Healthcare in its civic infrastructure mix. Clinics can be found throughout the plazas, strips, and malls.</p>
					<p>The Neighbourhood Organization runs youth supports and newcomer employment programming out of the Thorncliffe Park Youth Wellness Hub. They are expanding their footprint into the second floor of the East York Town Centre, which used to house a municipal vaccination clinic.</p>
					<p>According to the Civic Infrastructure Index, this segment of Thorncliffe Park lags behind most Toronto Main Street case studies in terms of civic opportunity, at 15th out of 20, and 25th out of 36 Neighbourhood Main Streets. Despite the cultural diversity of the neighbourhoods' residents, there are no Arts and Culture facilities to support expressions of those identities.</p>

				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq2v0eo2017201p6hvc26ctb'}
						center={[-79.346, 43.706]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={[
							'thorncliffepark',
							'thorncliffepark-fill',
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
							<IsochroneCheckbox section={'business'} layer={'thorncliffepark-isochrone'} minZoom={13} maxZoom={13.3} />
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
					<p>The concentration of immigrant-run commercial establishments north of Overlea has long been considered the cultural hub of the Thorncliffe Park community. Unfortunately, construction of Ontario Line infrastructure has resulted in the displacement of dozens of businesses and hundreds of jobs. With many businesses unable to find a suitable location within the neighbourhood, many have been forced to move out of the community or shut down.</p>
					<p>According to the Independent Business Index, Thorncliffe Park ranks behind most other Main Street case studies in terms of level of business independence, ranking 17th out of 20 Toronto Main Streets, and 27th out of 36 Neighbourhood Main Streets.</p>
					<p>Thorncliffe Park also ranks the same in terms of business density, reflective of its suburban built form.</p>

				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq2v0eo2017201p6hvc26ctb'}
						center={[-79.346, 43.706]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={[
							'thorncliffepark',
							'thorncliffepark-fill',
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
					<p>Throughout the Thorncliffe Park study area, employment is generally spread throughout the low-density commercial structures each with ample parking. There's a mix of businesses with zero to five employees in smaller units, and larger businesses with up to 50 employees in larger, but not taller, buildings. Costco is a dominant presence and competes with East York Town Centre for local patronage. Just north across the tracks, Leaside Business Park hosts a greater concentration of commercial and industrial establishments.</p>
					<p>For employment density, Thorncliffe Park ranks middle in comparison to Toronto Main Streets at 9th out of 20, and relatively better at 14th out of 36 Neighbourhood Main Streets.</p>

					<img id="employmentsizelegend" src={EmpSizeLegend} alt="legend" />
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq2v0eo2017201p6hvc26ctb'}
						center={[-79.346, 43.706]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['thorncliffepark', 'thorncliffepark-fill', 'employment-size']}
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
							casestudy={'thorncliffepark'}
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
					<p>Since this segment of Thorncliffe Park is primarily zoned for commercial and industrial uses, residents can be found outside of the study area to the south in apartment tower complexes. These apartment complexes represent approximately eighty percent of the housing stock. Additionally, some low-density housing is present on and around this section of Thorncliffe Park. Most likely attributed to the purpose built housing boom, over 30% of the total housing stock was built in the 1961-80 period.</p>

				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq2v0eo2017201p6hvc26ctb'}
						center={[-79.346, 43.706]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['thorncliffepark-outline', 'populationdensity']}
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
							casestudy={'thorncliffepark'}
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
					<p>Of residents around the Thorncliffe Park study area, 60% are recent immigrants and 67% are visible minorities.</p>
					<p>According to the City of Toronto's 2016 Demographic Snapshot of Thorncliffe Park, it is a culturally and linguistically diverse neighbourhood with Urdu as the top non-English mother tongue, followed far behind by Pashto, Tagalog, Farsi, then Gujarati. In 2016, 89% of households rented, which was far above the City-wide rate of 47%. That same year, 46% of households had low-income status, versus 20% city-wide.</p>
					<p>As a designated Neighbourhood Improvement Area, the community is recognized as equity-deserving, warranting special place-based policies to improve the well-being of residents.</p>

				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq2v0eo2017201p6hvc26ctb'}
						center={[-79.346, 43.706]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['thorncliffepark-outline', 'average-age']}
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
					<p>Thorncliffe Park ranks high in Resiliency Score, at 3rd out of 20 Toronto Main Streets, and 4th out of 26 Neighbourhood Main Streets.</p>
					<p>While Main Streets that heavily relied on non-resident visitors have been slow to recover since pandemic shut downs in 2019, Thorncliffe Park businesses have been able to count on local patronage from within the neighbourhood and Flemingdon Park to the northeast, pushing visit numbers to momentarily hit 100% the relative 2019 level near the end of 2022.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq2v0eo2017201p6hvc26ctb'}
						center={[-79.346, 43.706]}
						zoom={9}
						pitch={0}
						bearing={-15}
						layers={['thorncliffepark-outline', 'visitors-2022']}
						section={'visitors'}
						attribution={'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="legend-container">
						<Legend
							minlabel={'0'}
							maxlabel={'153,400'}
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
	<Summary name={'Overlea Boulevard (Thorncliffe Park)'} location={'Toronto, Ontario'} />
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
