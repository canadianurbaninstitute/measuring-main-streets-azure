<script>
	/* -------------------------------------------------------------------------- */
	/*                                   Imports                                  */
	/* -------------------------------------------------------------------------- */

	import StonyPlainRoadNW from '../../../lib/assets/boundaries/edmontonboundaries/StonyPlainRoadNW.svg';
	import Title from '../../../lib/ui/Title.svelte';

	import EmpSizeLegend from '../../../lib/assets/employmentsizelegend.svg';
	import EmpSizeLegendFr from '../../../lib/assets/employmentsizelegend-fr.svg';

	import businessmix from '../../../lib/data/casestudydata/edmonton/stonyplainroadnw/businessmix';
	import civicmix from '../../../lib/data/casestudydata/edmonton/stonyplainroadnw/civicmix';
	import greenspace from '../../../lib/data/casestudydata/edmonton/stonyplainroadnw/greenspace';
	import housingconstruction from '../../../lib/data/casestudydata/edmonton/stonyplainroadnw/housingconstruction';
	import housingtype from '../../../lib/data/casestudydata/edmonton/stonyplainroadnw/housingtype';
	import visitordayofweek from '../../../lib/data/casestudydata/edmonton/stonyplainroadnw/visitordayofweek';
	import visitortimeofday from '../../../lib/data/casestudydata/edmonton/stonyplainroadnw/visitortimeofday';
	import visitortraffic from '../../../lib/data/casestudydata/edmonton/stonyplainroadnw/visitortraffic';
	import visitortypes from '../../../lib/data/casestudydata/edmonton/stonyplainroadnw/visitortypes';

	import { browser } from '$app/environment';
	import { timeFormat } from 'd3-time-format';
	import mapboxgl from 'mapbox-gl';
	import CaseStudyMap from '../../../lib/ui/CaseStudyMap.svelte';
	import EmploymentSizeCheckbox from '../../../lib/ui/checkbox/EmploymentSizeCheckbox.svelte';
	import IsochroneCheckbox from '../../../lib/ui/checkbox/IsochroneCheckbox.svelte';
	import PhotosCheckbox from '../../../lib/ui/checkbox/PhotosCheckbox.svelte';
	import SatelliteCheckbox from '../../../lib/ui/checkbox/SatelliteCheckbox.svelte';
	import Dropdown from '../../../lib/ui/Dropdown.svelte';
	import Legend from '../../../lib/ui/legends/Legend.svelte';
	import LegendItem from '../../../lib/ui/legends/LegendItem.svelte';

	import { BarChart, ColumnChart, LineChart } from '@onsvisual/svelte-charts';

	import { buildImageUrl, setConfig } from 'cloudinary-build-url';
	import { sexagesimalToDecimal } from 'geolib';
	import RangeSlider from 'svelte-range-slider-pips';

	import { onMount } from 'svelte';

	import { mapStoreList, visitorMapStore } from '../../../lib/stores/mapStore';

	import '../../../styles.css';

	import { localizeRows } from '../../../lib/data/dataLabels';
	import { getLang } from '../../../lib/i18n';

	const fr = getLang() === 'fr';

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
	<Title
		outline={StonyPlainRoadNW}
		name={'Stony Plain Road NW (Jasper Place)'}
		location={'Edmonton, Alberta'}
	/>
	<div class="container">
		<section data-id="map1">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>{fr ? 'Vue d’ensemble' : 'Overview'}</h2>
					{#if fr}
						<p>
							Stony Plain Road NW se trouve à la jonction des quartiers Canora et West
							Jasper Place, à Edmonton. Elle est située à l’ouest du centre-ville
							principal. La rue se trouve au nord de la rivière Saskatchewan Nord et
							s’étend d’est en ouest jusqu’au cœur de la ville. La zone à l’étude faisait
							partie d’un village distinct, Jasper Place, qui a réussi à résister à la
							fusion avec la Ville d’Edmonton jusqu’en 1964.
						</p>
					{:else}
						<p>
							Stony Plain Road NW is situated at the intersection of the Canora and West Jasper Place
							neighbourhoods in Edmonton. It sits west of the main downtown area. The street is north
							of the North Saskatchewan River and runs east-west connecting into the core of the city.
							The study area was part of its own village, Jasper Place, and managed to resist
							amalgamation with the City of Edmonton until 1964.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<div class="legend-container">
						<Legend
							minlabel={fr ? 'Faible' : 'Low'}
							maxlabel={fr ? 'Élevé' : 'High'}
							label={fr ? 'Densité commerciale' : 'Business Density'}
							gradient={gradients.business}
						/>
						<LegendItem
							variant={'polygon'}
							label={'Stony Plain Road NW'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9q5wrw004201pe6uwv4ucd'}
						center={[-113.584, 53.5397]}
						zoom={13}
						pitch={50}
						bearing={0}
						layers={['mainstreets-edmonton', 'stonyplainroadnw', 'stonyplainroadnw-fill']}
						section={'overview'}
					/>
				</div>
			</div>
		</section>
		<section data-id="map2">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>{fr ? 'Cadre bâti' : 'Built Form'}</h2>
					{#if fr}
						<p>
							Le cadre bâti de Stony Plain Road est étalé et principalement de faible
							hauteur, mais il changera radicalement, puisque la rue accueille
							actuellement les travaux de construction du nouveau train léger de la Valley
							Line. Au moment de la visite sur le terrain, les deux voies en direction est
							étaient entièrement fermées par des clôtures, et toute la circulation était
							redirigée vers les voies en direction ouest. Toutes les intersections sont
							dotées de passages pour piétons avec feux clignotants. Les bâtiments ne
							dépassent pas deux étages, et la plupart des immeubles d’appartements sont
							situés à l’écart de l’avenue. De toutes les études de cas de rues
							principales d’Edmonton, Stony Plain Road présentait le plus grand nombre de
							bâtiments vacants, abandonnés ou voués à la démolition, ainsi que de
							stationnements observés. Cette situation contribuait grandement au manque
							général d’interaction entre les commerces et la rue.
						</p>
					{:else}
						<p>
							Stony Plain Road's built form is spread out and primarily low-rise, but this will be
							changing dramatically as it is currently undergoing construction of the new Valley Line
							Light Rail Transit. At the time of the field visit, the entirety of the two east-bound
							lanes were closed off by fences, with all traffic being redirected through the westbound
							lanes. There are pedestrian crossings at all intersections with flashing indicators. The
							buildings don't exceed two-storeys in height, and most apartment buildings are located
							off the avenue. Of all the Edmontonian Main Street case studies, Stony Plan had the
							highest number of vacant, abandoned, or to be demolished buildings, and parking lots
							observed. This contributed greatly to an overall lack of business interaction with the
							street.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<div class="legend-container">
						<LegendItem
							variant={'polygon'}
							label={'Stony Plain Road NW'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
						<LegendItem variant={'polygon'} label={fr ? 'Espaces verts' : 'Green Spaces'} bgcolor={'#43b171'} />
						<LegendItem
							variant={'polygon'}
							label={fr ? 'Bâtiments' : 'Buildings'}
							bgcolor={'#d4d4d4'}
							bordercolor={'#999797'}
						/>
						<LegendItem variant={'line'} label={fr ? 'Transport collectif' : 'Transit'} bordercolor={'#ff4242'} />
						<PhotosCheckbox section={'builtform'} layer={'builtform-photos'} />
						<SatelliteCheckbox casestudy={'stonyplainroadnw'} section={'builtform'} />
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9q5wrw004201pe6uwv4ucd'}
						center={[-113.5864, 53.5414]}
						zoom={15}
						minZoom={15}
						pitch={60}
						bearing={90}
						layers={[
							'stonyplainroadnw',
							'stonyplainroadnw-fill',
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
							data={localizeRows(greenspace, fr)}
							yKey="Area"
							xKey="Park_Percentage"
							title={fr ? 'Espaces verts (%)' : 'Green Space %'}
							padding={{ top: 0, bottom: 20, left: 110 }}
						/>
					</div>
				</div>
			</div>
		</section>
		<section data-id="map3">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>{fr ? 'Infrastructure civique' : 'Civic Infrastructure'}</h2>
					<div class="controls">
						<i><small
							>{fr
								? 'Cliquez sur une couche pour l’activer ou la désactiver'
								: 'Click on a layer to turn it on or off'}</small
						></i>
						<LegendItem
							variant={'circle'}
							label={fr ? 'Arts et culture' : 'Arts and Culture'}
							bgcolor={'#DB3069'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-edmonton-arts-culture'}
							section={'civicinfra'}
						/>
						<LegendItem
							variant={'circle'}
							label={fr ? 'Services gouvernementaux et communautaires' : 'Government and Community Services'}
							bgcolor={'#8A4285'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-edmonton-govt-community'}
							section={'civicinfra'}
						/>
						<LegendItem
							variant={'circle'}
							label={fr ? 'Loisirs' : 'Recreation'}
							bgcolor={'#43B171'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-edmonton-recreation'}
							section={'civicinfra'}
						/>
						<LegendItem
							variant={'circle'}
							label={fr ? 'Santé' : 'Healthcare'}
							bgcolor={'#33AED7'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-edmonton-health'}
							section={'civicinfra'}
						/>
						<LegendItem
							variant={'circle'}
							label={fr ? 'Éducation' : 'Education'}
							bgcolor={'#F45D01'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-edmonton-education'}
							section={'civicinfra'}
						/>
						<div class="checkbox">
							<PhotosCheckbox section={'civicinfra'} layer={'civicinfra-photos'} />
							<IsochroneCheckbox
								section={'civicinfra'}
								layer={'stonyplainroadnw-isochrone'}
								minZoom={13}
								maxZoom={13.3}
							/>
							<EmploymentSizeCheckbox
								section={'civicinfra'}
								layers={[
									'civicinfra-edmonton-education',
									'civicinfra-edmonton-govt-community',
									'civicinfra-edmonton-arts-culture',
									'civicinfra-edmonton-health',
									'civicinfra-edmonton-recreation'
								]}
								minZoom={13}
								maxZoom={13.3}
							/>
						</div>
					</div>
					{#if fr}
						<p>
							Stony Plain Road fait partie de la zone d’amélioration commerciale (BIA) de
							Stony Plain Road. De hauts lampadaires décoratifs bordent les deux côtés de
							la rue dans l’ensemble de la zone à l’étude. La hauteur et l’espacement des
							lampadaires créent un motif cohérent et répétitif le long de la rue.
						</p>
						<p>
							La BIA n’a pas une présence très visible dans le secteur, à part quelques
							bannières suspendues aux lampadaires. On n’y trouve aucune plaque de rue ni
							autre infrastructure à l’image de la BIA. Le trottoir nord présente une
							usure notable.
						</p>
						<p>
							À l’intersection de Stony Plain Road et de la 152 St se trouve une place
							aménagée avec des tables et des bancs en métal argenté. Des panneaux
							d’orientation sont installés dans le secteur.
						</p>
						<p>
							Selon l’Indice d’infrastructure civique, Stony Plain Road se classe bas en
							matière de possibilités civiques, au 15e rang sur 20 rues principales
							d’Edmonton et au 17e rang sur 36 rues principales résidentielles.
						</p>
					{:else}
						<p>
							Stony Plain Road is part of the Stony Plain Road Business Improvement Area. There are
							tall, decorative street lights that border both sides of the street throughout the study
							area. The height and spacing of the street lanterns create a cohesive, repetitive
							pattern along the street.
						</p>
						<p>
							The BIA does not have an overly noticeable presence in the area outside of a couple of
							street banners hanging from the lanterns. There were no branded street signs or other
							branded infrastructure. There is noticeable wear and tear on the north sidewalk.
						</p>
						<p>
							At the intersection of Stony Plain Road and 152 St, there is a square with silver
							metallic tables and benches. There are wayfinding signs around the area.
						</p>
						<p>
							According to the Civic Infrastructure Index, Stony Plain Road ranks low for civic
							opportunity at 15th of 20 Edmonton Main Streets and 17th of 36 Neighbourhood Main
							Streets.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9q5wrw004201pe6uwv4ucd'}
						center={[-113.5855, 53.5414]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={0}
						layers={[
							'stonyplainroadnw',
							'stonyplainroadnw-fill',
							'civicinfra-edmonton-education',
							'civicinfra-edmonton-govt-community',
							'civicinfra-edmonton-health',
							'civicinfra-edmonton-arts-culture',
							'civicinfra-edmonton-recreation'
						]}
						section={'civicinfra'}
						attribution={fr ? 'Institut urbain du Canada | Source des données : Environics Analytics' : 'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="chart">
						<BarChart
							colors={['#DB3069', '#F45D01', '#8A4285', '#33AED7', '#43B171']}
							data={localizeRows(civicmix, fr)}
							yKey="Area"
							xKey="Percentage"
							zKey="Group"
							mode="stacked"
							title={fr ? 'Composition de l’infrastructure civique (%)' : 'Civic Infrastructure Mix (%)'}
							padding={{ top: 0, bottom: 20, left: 110 }}
						/>
					</div>
				</div>
			</div>
		</section>
		<section data-id="map4">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>{fr ? 'Profil des entreprises' : 'Business Profile'}</h2>
					<div class="controls">
						<i><small
							>{fr
								? 'Cliquez sur une couche pour l’activer ou la désactiver'
								: 'Click on a layer to turn it on or off'}</small
						></i>
						<LegendItem
							variant={'circle'}
							label={fr ? 'Commerce de détail' : 'Retail'}
							bgcolor={'#F13737'}
							bordercolor={'#fff'}
							button={true}
							id={'business-edmonton-retail'}
							section={'business'}
						/>
						<LegendItem
							variant={'circle'}
							label={fr ? 'Services de proximité' : 'Local Services'}
							bgcolor={'#2a5cac'}
							bordercolor={'#fff'}
							button={true}
							id={'business-edmonton-services'}
							section={'business'}
						/>
						<LegendItem
							variant={'circle'}
							label={fr ? 'Restauration et boissons' : 'Food and Drink'}
							bgcolor={'#43b171'}
							bordercolor={'#fff'}
							button={true}
							id={'business-edmonton-food-drink'}
							section={'business'}
						/>
						<div class="checkbox">
							<PhotosCheckbox section={'business'} layer={'business-photos'} />
							<IsochroneCheckbox
								section={'business'}
								layer={'stonyplainroadnw-isochrone'}
								minZoom={13}
								maxZoom={13.3}
							/>
							<EmploymentSizeCheckbox
								section={'business'}
								layers={[
									'business-edmonton-retail',
									'business-edmonton-services',
									'business-edmonton-food-drink'
								]}
								minZoom={13}
								maxZoom={13.3}
							/>
						</div>
					</div>
					{#if fr}
						<p>
							Selon l’Indice des entreprises indépendantes, Stony Plain Road se classe 9e
							sur 20 rues principales d’Edmonton et 22e sur 36 rues principales
							résidentielles. Pour la densité commerciale, Stony Plain se classe 8e sur 20
							et 16e sur 36.
						</p>
						<p>
							En raison des travaux du train léger au moment de l’observation, les
							commerces situés du côté sud de la rue étaient difficiles d’accès. Pour
							pallier cette situation, des panneaux d’orientation indiquaient que les
							commerces demeuraient ouverts pendant les travaux.
						</p>
						<p>
							Parmi les commerces notables, mentionnons Revolution Cycle, Celebrate Gluten
							Free Bakery, ainsi qu’une concentration marquée de prêteurs sur gages. Dans
							l’ensemble, possiblement en raison des travaux, il y avait peu d’interaction
							entre les commerces et la rue.
						</p>
					{:else}
						<p>
							According to the Independent Business Index, Stony Plain Road ranks 9th of 20 Edmonton
							Main Streets and 22nd of 36 Neighbourhood Main Streets. For business density, Stony
							Plain ranks 8th of 20 and 16th of 36.
						</p>
						<p>
							Due to the LRT construction at the time of observation, businesses along the southern
							portion of the street were difficult to access. To account for this, wayfinding signs
							were present indicating that businesses were still open during construction.
						</p>
						<p>
							Some businesses of note include Revolution Cycle, Celebrate Gluten Free Bakery, and a
							noticeable clustering of pawn shops. Overall, possibly due to construction, there was
							little interaction between businesses and the street.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9q5wrw004201pe6uwv4ucd'}
						center={[-113.5855, 53.5414]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={0}
						layers={[
							'stonyplainroadnw',
							'stonyplainroadnw-fill',
							'business-edmonton-retail',
							'business-edmonton-food-drink',
							'business-edmonton-services'
						]}
						section={'business'}
						attribution={fr ? 'Institut urbain du Canada | Source des données : Environics Analytics' : 'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="chart">
						<BarChart
							colors={['#43b171', '#F13737', '#2a5cac']}
							data={localizeRows(businessmix, fr)}
							yKey="Area"
							xKey="Percentage"
							zKey="Group"
							mode="stacked"
							title={fr ? 'Composition commerciale (%)' : 'Business Mix (%)'}
							padding={{ top: 0, bottom: 20, left: 110 }}
						/>
					</div>
				</div>
			</div>
		</section>
		<section data-id="map5">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>{fr ? 'Profil de l’emploi' : 'Employment Profile'}</h2>
					{#if fr}
						<p>
							Les données disponibles sur l’emploi pour la zone à l’étude de Stony Plain
							Road NW révèlent une concentration importante d’emplois sur la rue
							principale, surtout comparativement au peu d’emplois dans le quartier
							résidentiel environnant.
						</p>
						<p>
							Les entreprises comptent généralement de zéro à 10 employés, et elles sont
							concentrées dans le centre commercial linéaire situé à l’angle sud-est de la
							zone à l’étude.
						</p>
						<p>
							En matière de densité d’emploi, Stony Plain se classe bas, au 15e rang sur
							20 rues principales d’Edmonton et au 29e rang sur 36 rues principales
							résidentielles.
						</p>
					{:else}
						<p>
							Available employment data for the Stony Plain Road NW study area reveals a significant
							concentration of employment on the main street, especially when compared to the relative
							lack of employment in the surrounding residential neighbourhood.
						</p>
						<p>
							Businesses generally range from zero to 10 employees, with a concentration of businesses
							in the strip mall at the southeast corner of the study area.
						</p>
						<p>
							For employment density, Stony Plain ranks low at 15th of 20 Edmonton Main Streets and
							29th of 36 Neighbourhood Main Streets.
						</p>
					{/if}

					<img id="employmentsizelegend" src={fr ? EmpSizeLegendFr : EmpSizeLegend} alt={fr ? 'Légende' : 'legend'} />
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9q5wrw004201pe6uwv4ucd'}
						center={[-113.5855, 53.5414]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={0}
						layers={['stonyplainroadnw', 'stonyplainroadnw-fill', 'employment-size']}
						section={'employmentsize'}
						attribution={fr ? 'Institut urbain du Canada | Source des données : Environics Analytics' : 'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="legend-container">
						<div>
							<LegendItem
								variant={'circle'}
								label={fr ? 'Infrastructure civique' : 'Civic Infrastructure'}
								bgcolor={'#db3069'}
								bordercolor={'#fff'}
							/>
							<LegendItem
								variant={'circle'}
								label={fr ? 'Entreprises' : 'Businesses'}
								bgcolor={'#2a5cac'}
								bordercolor={'#fff'}
							/>
							<LegendItem
								variant={'circle'}
								label={fr ? 'Autres' : 'Other'}
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
					<h2>{fr ? 'Logement' : 'Housing'}</h2>
					<div class="controls">
						<Dropdown
							casestudy={'stonyplainroadnw'}
							section={'housing'}
							region={'edmonton'}
							options={[
								{ id: 'populationdensity', text: fr ? 'Densité de population' : 'Population Density' },
								{ id: 'dwellings', text: fr ? 'Logements' : 'Dwellings' },
								{ id: 'single-detached', text: fr ? 'Maisons individuelles' : 'Single Detached' },
								{ id: 'semi-detached', text: fr ? 'Maisons jumelées' : 'Semi Detached' },
								{ id: 'duplex', text: fr ? 'Duplex' : 'Duplex' },
								{ id: 'apartment-more-5-stories', text: fr ? 'Appartements (plus de 5 étages)' : 'Apartments (more than 5 stories)' },
								{ id: 'apartment-less-5-stories', text: fr ? 'Appartements (moins de 5 étages)' : 'Apartments (less than 5 stories)' }
							]}
						/>
						<PhotosCheckbox section={'housing'} layer={'housing-photos'} />
					</div>
					{#if fr}
						<p>
							Dans la zone à l’étude, les logements se trouvent surtout à l’écart de Stony
							Plain Road. On compte un nombre important d’immeubles d’appartements de
							faible hauteur près de l’avenue; il s’agit de la forme de logement
							prédominante dans le secteur, à environ 80 %. Ces immeubles sont espacés
							afin de laisser amplement de place au stationnement des personnes résidentes
							dans les ruelles. Les maisons individuelles qu’on y trouve semblaient de
							construction plus ancienne et n’étaient pas particulièrement bien
							entretenues.
						</p>
					{:else}
						<p>
							Housing for the study area can be found predominantly off of Stony Plan Road itself.
							There a significant number of low-rise apartment buildings close to the avenue, being
							the predominant housing form in the area at about 80%. They are spread out to
							accommodate ample parking for residents in laneways. The single-detached housing that
							could be found appeared to be older in construction and were not particularly well
							maintained.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9q5wrw004201pe6uwv4ucd'}
						center={[-113.5855, 53.5414]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={0}
						layers={['stonyplainroadnw-outline', 'populationdensity']}
						section={'housing'}
						attribution={fr ? 'Institut urbain du Canada | Source des données : Environics Analytics' : 'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="graphics-container">
						<div class="chart">
							<ColumnChart
								colors={['#002a41', '#0098D6']}
								data={localizeRows(housingconstruction, fr)}
								xKey="Construction Year"
								yKey="Percentage"
								zKey="Area"
								mode="grouped"
								title={fr ? 'Année de construction des logements (%)' : 'Housing Construction Year (%)'}
								padding={{ top: 0, bottom: 20, left: 10 }}
								legend
							/>
						</div>
						<div class="chart">
							<ColumnChart
								colors={['#002a41', '#0098D6']}
								data={localizeRows(housingtype, fr)}
								xKey="Housing Type"
								yKey="Percentage"
								zKey="Area"
								mode="grouped"
								title={fr ? 'Type de logement (%)' : 'Housing Type (%)'}
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
					<h2>{fr ? 'Caractéristiques locales' : 'Local Characteristics'}</h2>
					<div class="controls">
						<Dropdown
							casestudy={'stonyplainroadnw'}
							section={'demographics'}
							region={'edmonton'}
							options={[
								{ id: 'average-age', text: fr ? 'Âge moyen' : 'Average Age' },
								{ id: 'household-size', text: fr ? 'Taille des ménages' : 'Household Size' },
								{ id: 'average-income', text: fr ? 'Revenu moyen' : 'Average Income' },
								{ id: 'visibleminority', text: fr ? 'Minorités visibles' : 'Visible Minorities' },
								{ id: 'immigrants', text: fr ? 'Personnes immigrantes et résidents non permanents' : 'Immigrants and Non-Permanent Residents' },
								{ id: 'indigenous', text: fr ? 'Population autochtone' : 'Indigenous Population' },
								{ id: 'english-speakers', text: fr ? 'Personnes de langue anglaise' : 'English Speakers' },
								{ id: 'french-speakers', text: fr ? 'Personnes de langue française' : 'French Speakers' },
								{ id: 'education-bachelors', text: fr ? 'Titulaires d’un baccalauréat' : 'Bachelor\'s Degree Holders' }
							]}
						/>
					</div>
					{#if fr}
						<p>
							Parmi les personnes résidant dans la zone à l’étude, 31 % sont issues d’une
							immigration récente et 34 % appartiennent à une minorité visible.
						</p>
					{:else}
						<p>
							Of residents in the study area, 31% are recent immigrants and 34% are visible
							minorities.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9q5wrw004201pe6uwv4ucd'}
						center={[-113.5855, 53.5414]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={0}
						layers={['stonyplainroadnw-outline', 'average-age']}
						section={'demographics'}
					/>
				</div>
			</div>
		</section>
		<section data-id="map8">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>{fr ? 'Visiteurs' : 'Visitors'}</h2>
					<div class="controls">
						<h5>{fr ? 'Année' : 'Year'}</h5>
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
					{#if fr}
						<p>
							Avant la pandémie, Stony Plain Road NW a enregistré près de 2 millions de
							visites en 2019. Le nombre total de visites a diminué d’année en année et,
							en 2022, il est passé sous la barre du million pour l’année.
						</p>
						<p>
							Au quotidien, la plage de 12 h à 18 h est la période la plus achalandée de
							la journée. Le samedi est le jour le plus achalandé de la semaine, suivi du
							jeudi.
						</p>
						<p>
							Le faible score de résilience de Stony Plain Road la place au 13e rang sur
							20 rues principales d’Edmonton et au 20e rang des rues principales
							résidentielles.
						</p>
					{:else}
						<p>
							Prior to the pandemic, Stony Plain Road NW saw nearly 2 million visits in 2019. Total
							visits decreased year by year and by 2022, total visits for that year dipped below 1
							million.
						</p>
						<p>
							On a daily basis, the 12pm to 6pm range is the busiest time of day. Saturday is the
							busiest day of the week followed by Thursday.
						</p>
						<p>
							Stony Plain Road's low Resiliency Score ranks it at 13th of 20 Edmonton Main Streets and
							20th of Neighbourhood Main Streets.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9q5wrw004201pe6uwv4ucd'}
						center={[-113.5855, 53.5414]}
						zoom={9}
						pitch={0}
						bearing={0}
						layers={['stonyplainroadnw-outline', 'visitors-2022']}
						section={'visitors'}
						attribution={fr ? 'Institut urbain du Canada | Source des données : Environics Analytics' : 'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="legend-container">
						<Legend
							minlabel={'0'}
							maxlabel={fr ? '48 600' : '48,600'}
							label={fr ? 'Nombre de visites quotidiennes selon le lieu de résidence des visiteurs' : 'Number of Daily Visits from Visitor Home Location'}
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
								title={fr ? 'Niveau des visites en % (par rapport à 2019)' : 'Level of Visits % (Relative to 2019)'}
								snapTicks={false}
								colors={['#0098D6']}
							/>
						</div>
						<div class="chart">
							<ColumnChart
								colors={['#002a41', '#0098D6', '#db3069']}
								data={localizeRows(visitortypes, fr)}
								xKey="Year"
								yKey="Count"
								zKey="Type"
								mode="stacked"
								title={fr ? 'Nombre de visites par type de visiteur' : 'Visit Count by Type of Visitor'}
								padding={{ top: 20, bottom: 20, left: 70 }}
								legend
							/>
						</div>
						<div class="chart">
							<BarChart
								colors={['#002a41']}
								data={localizeRows(visitortimeofday, fr)}
								yKey="Time"
								xKey="Percentage"
								title={fr ? 'Visites (%) selon le moment de la journée' : 'Visits (%) by Time of Day'}
								padding={{ top: 0, bottom: 20, left: 80 }}
							/>
						</div>
						<div class="chart">
							<BarChart
								colors={['#0098D6']}
								data={localizeRows(visitordayofweek, fr)}
								yKey="Day"
								xKey="Percentage"
								title={fr ? 'Visites (%) selon le jour de la semaine' : 'Visits (%) by Day of Week'}
								padding={{ top: 0, bottom: 20, left: 80 }}
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
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
		display: flex;
		flex-direction: column;
		gap: 1em;
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
			gap: 2em;
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
