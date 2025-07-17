<script>
	/* -------------------------------------------------------------------------- */
	/*                                   Imports                                  */
	/* -------------------------------------------------------------------------- */

	import Title from '../../../lib/ui/Title.svelte';
	import RueWellington from '../../../lib/assets/boundaries/montrealboundaries/RueWellington.svg';

	import EmpSizeLegend from '../../../lib/assets/employmentsizelegend.svg';

	import Summary from '../../../lib/ui/Summary.svelte';

	import greenspace from '../../../lib/data/casestudydata/montreal-fr/ruewellington/greenspace';
	import civicmix from '../../../lib/data/casestudydata/montreal-fr/ruewellington/civicmix';
	import businessmix from '../../../lib/data/casestudydata/montreal-fr/ruewellington/businessmix';
	import housingtype from '../../../lib/data/casestudydata/montreal-fr/ruewellington/housingtype';
	import housingconstruction from '../../../lib/data/casestudydata/montreal-fr/ruewellington/housingconstruction';
	import visitortraffic from '../../../lib/data/casestudydata/montreal-fr/ruewellington/visitortraffic';
	import visitortypes from '../../../lib/data/casestudydata/montreal-fr/ruewellington/visitortypes';
	import visitortimeofday from '../../../lib/data/casestudydata/montreal-fr/ruewellington/visitortimeofday';
	import visitordayofweek from '../../../lib/data/casestudydata/montreal-fr/ruewellington/visitordayofweek';

	import Legend from '../../../lib/ui/legends/Legend.svelte';
	import LegendItem from '../../../lib/ui/legends/LegendItem.svelte';
	import IsochroneCheckboxFr from '../../../lib/ui/checkbox/IsochroneCheckboxFr.svelte';
	import EmploymentSizeCheckboxFr from '../../../lib/ui/checkbox/EmploymentSizeCheckboxFr.svelte';
	import PhotosCheckbox from '../../../lib/ui/checkbox/PhotosCheckbox.svelte';
	import SatelliteCheckboxFr from '../../../lib/ui/checkbox/SatelliteCheckboxFr.svelte';
	import Dropdown from '../../../lib/ui/Dropdown.svelte';
	import CaseStudyMap from '../../../lib/CaseStudyMap.svelte';
	import LanguageSelector from '../../../lib/ui/LanguageSelector.svelte';
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
	<Title outline={RueWellington} name={'Rue Wellington (Verdun)'} location={'Montreal, Québec'} />
	<LanguageSelector eng={'/casestudies/montreal/ruewellington'} fr={'/casestudies/montreal-fr/ruewellington-fr'} selected='fr'/>

	<div class="container">
		<section data-id="map1">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Vue d’ensemble</h2>
					<p>La rue Wellington est une importante artère orientée est-ouest à l’extrémité ouest de Montréal, qui traverse les quartiers de Verdun, de Pointe-Saint-Charles et de Griffintown. Nommée «rue la plus cool du monde» par le magazine TimeOut en 2022, cette section, connue sous le nom de Promenade Wellington, est un carrefour commercial animé au cœur de Verdun. En collaboration avec la SDC Wellington, la Promenade Wellington fait l’objet d’une piétonnisation pendant les mois d’été. L’introduction de mobilier urbain temporaire, de peintures murales, de stations de rafraîchissement et de patios et de terrasses extérieures contribue à l’animation de la rue.</p><p>Cependant, le paysage de Verdun évolue. La popularité croissante des rues Wellington et Verdun, marquée par l’apparition de nouveaux restaurants, cafés et bars et par la valorisation du paysage urbain, s’accompagne d’une hausse marquée de la valeur des propriétés et des loyers. Ces transformations ont soulevé des inquiétudes concernant l’embourgeoisement et le déplacement forcé, ce qui a incité les personnes qui habitent le quartier et les défenseurs du logement à se mobiliser pour soutenir les personnes qui habitent sur la rue Wellington et l’ensemble de la communauté de Verdun.</p>
				</div>
				<div class="map-container">
					<div class="legend-container">
						<Legend
							minlabel={'Faible'}
							maxlabel={'Haut'}
							label={'Rues principales'}
							gradient={gradients.business}
						/>
						<LegendItem
							variant={'polygon'}
							label={'Rue Wellington'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr83ya8h000s01nu14my3o3u'}
						center={[-73.566, 45.461]}
						zoom={13}
						pitch={50}
						bearing={0}
						layers={['mainstreets-montreal', 'ruewellington', 'ruewellington-fill']}
						section={'overview'}
					/>
				</div>
			</div>
		</section>
		<section data-id="map2">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Forme bâtie</h2>
					<p>La rue Wellington dispose d’une voie de circulation et d’un stationnement sur rue dans les deux sens. La rue est également bien desservie par les transports en commun, avec la station de métro de l’Église de la ligne verte et des arrêts d’autobus des deux côtés de la rue desservant plusieurs lignes d’autobus.</p><p>Reflétant le «chaînon manquant» (ou logement de type intermédiaire) et la densité moyenne qui caractérisent Montréal, les bâtiments situés le long de la rue Wellington se composent principalement d’immeubles de trois à quatre étages dotés de commerces au rez-de-chaussée et d’habitations à l’étage supérieur. La rue comprend également quelques immeubles entièrement résidentiels. Pendant la période de piétonnisation estivale, toutes les voies de circulation sont fermées à la circulation automobile et la rue est entièrement ouverte aux piétons et aux utilisateurs de mobilité active.</p><p>Bien qu’il y ait peu d’espaces verts directement sur ce segment de la rue Wellington, la rue est très bien desservie par des espaces verts à moins de dix minutes de marche. Le fleuve Saint-Laurent, situé juste à l’est de la rue Wellington, comprend un certain nombre de parcs, de sentiers pédestres et de pistes cyclables, ainsi que la populaire plage de Verdun.</p>
				</div>
				<div class="map-container">
					<div class="legend-container">
						<LegendItem
							variant={'polygon'}
							label={'Rue Wellington'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
						<LegendItem variant={'polygon'} label={'Espaces verts'} bgcolor={'#43b171'} />
						<LegendItem
							variant={'polygon'}
							label={'Bâtiments'}
							bgcolor={'#d4d4d4'}
							bordercolor={'#999797'}
						/>
						<LegendItem variant={'line'} label={'Transport en commun'} bordercolor={'#ff4242'} />
						<PhotosCheckbox section={'builtform'} layer={'builtform-photos'} />
						<SatelliteCheckboxFr casestudy={'ruewellington'} section={'builtform'} />
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr83ya8h000s01nu14my3o3u'}
						center={[-73.5677, 45.4596]}
						zoom={15}
						minZoom={15}
						pitch={48}
						bearing={25}
						layers={[
							'ruewellington',
							'ruewellington-fill',
							'greenspaces',
							'transit-montreal',
							'transit-montreal-stops',
							'buildings-montreal'
						]}
						section={'builtform'}
					/>
					<div class="chart">
						<BarChart
							colors={['#43b171']}
							data={greenspace}
							yKey="Area"
							xKey="Park_Percentage"
							title="Espaces verts %"
							padding={{ top: 0, bottom: 20, left: 110 }}
						/>
					</div>
				</div>
			</div>
		</section>
		<section data-id="map3">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Infrastructure municipale</h2>
					<div class="controls">
						<i><small>Cliquez sur une couche pour l’activer ou la désactiver</small></i>
						<LegendItem
							variant={'circle'}
							label={'Arts et Culture'}
							bgcolor={'#DB3069'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-montreal-arts-culture'}
							section={'civicinfra'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Services gouvernementaux et communautaires'}
							bgcolor={'#8A4285'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-montreal-govt-community'}
							section={'civicinfra'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Loisirs'}
							bgcolor={'#43B171'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-montreal-recreation'}
							section={'civicinfra'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Soins de santé'}
							bgcolor={'#33AED7'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-montreal-health'}
							section={'civicinfra'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Éducation'}
							bgcolor={'#F45D01'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-montreal-education'}
							section={'civicinfra'}
						/>
						<div class="checkbox">
							<PhotosCheckbox section={'civicinfra'} layer={'civicinfra-photos'} />
							<IsochroneCheckboxFr
								section={'civicinfra'}
								layer={'ruewellington-isochrone'}
								minZoom={13}
								maxZoom={13.3}
							/>
							<EmploymentSizeCheckboxFr
								section={'civicinfra'}
								layers={[
									'civicinfra-montreal-education',
									'civicinfra-montreal-govt-community',
									'civicinfra-montreal-arts-culture',
									'civicinfra-montreal-health',
									'civicinfra-montreal-recreation'
								]}
								minZoom={13}
								maxZoom={13.3}
							/>
						</div>
					</div>
					<p>Cette section de la rue Wellington comprend une grande part d’établissements de santé et de services gouvernementaux et communautaires tels qu’un édifice abritant le ministère de la Défense nationale du Canada. En comparaison, la rue ne se targue pas d’un pourcentage élevé d’installations récréatives, éducatives ou artistiques. Cependant, un certain nombre d’établissements d’enseignement sont accessibles à moins de dix minutes de marche.</p><p>La Société de développement commercial (SDC) de la rue Wellington et la piétonnisation estivale entraînent l’installation d’infrastructures temporaires pour soutenir la vie civique, sociale et commerciale et la vitalité de la rue. Il s’agit notamment de mobilier urbain temporaire, d’une signalisation accrue, de peintures murales et d’œuvres d’art urbain, de terrasses, de stations de rafraîchissement, de zones wifi en plein air et de programmes pour tous les âges.</p><p>Cependant, selon l’indice d’infrastructure municipale, la rue Wellington est à la traîne par rapport à la plupart des autres études de cas de rues principales montréalaises et résidentielles. En matière de possibilités civiques, la rue Wellington se classe au 19e rang des 20 rues principales de Montréal et au 35e rang des 36 rues principales résidentielles.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr83ya8h000s01nu14my3o3u'}
						center={[-73.5667, 45.461]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={[
							'ruewellington',
							'ruewellington-fill',
							'civicinfra-montreal-education',
							'civicinfra-montreal-govt-community',
							'civicinfra-montreal-health',
							'civicinfra-montreal-arts-culture',
							'civicinfra-montreal-recreation'
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
							title="Infrastructure municipale (%)"
							padding={{ top: 0, bottom: 20, left: 110 }}
						/>
					</div>
				</div>
			</div>
		</section>
		<section data-id="map4">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Profil des enterprises</h2>
					<div class="controls">
						<i><small>Cliquez sur une couche pour l’activer ou la désactiver</small></i>
						<LegendItem
							variant={'circle'}
							label={'Commerce de détail'}
							bgcolor={'#F13737'}
							bordercolor={'#fff'}
							button={true}
							id={'business-montreal-retail'}
							section={'business'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Services locaux'}
							bgcolor={'#2a5cac'}
							bordercolor={'#fff'}
							button={true}
							id={'business-montreal-services'}
							section={'business'}
						/>
						<LegendItem
							variant={'circle'}
							label={'Services de restauration et débits de boissons'}
							bgcolor={'#43b171'}
							bordercolor={'#fff'}
							button={true}
							id={'business-montreal-food-drink'}
							section={'business'}
						/>
						<div class="checkbox">
							<PhotosCheckbox section={'business'} layer={'business-photos'} />
							<IsochroneCheckboxFr
								section={'business'}
								layer={'ruewellington-isochrone'}
								minZoom={13}
								maxZoom={13.3}
							/>
							<EmploymentSizeCheckboxFr
								section={'business'}
								layers={[
									'business-montreal-retail',
									'business-montreal-services',
									'business-montreal-food-drink'
								]}
								minZoom={13}
								maxZoom={13.3}
							/>
						</div>
					</div>
					<p>Ce tronçon de la rue Wellington offre un mélange vivant d’entreprises, comprenant des commerces de détail et de services, ainsi que des services de restauration et débits de boissons. La diversité s’étend aux entreprises elles-mêmes, qu’elles soient établies depuis longtemps ou plus récemment, et qu’elles soient indépendantes ou qu’elles appartiennent à des chaînes. Des chaînes bien connues comme Dollarama, Pizza Pizza et Subway aux favoris montréalais comme Falafel Yoni et Boulangerie Toledo, en passant par de plus petites quincailleries, cette variété commerciale contribue à l’attrait de la rue. Cependant, la présence d’établissements plus anciens et plus récents représente aussi visuellement l’évolution du paysage du quartier, les vitrines traditionnelles étant progressivement remplacées par des restaurants, cafés et bars branchés et haut de gamme.</p><p>Selon l’indice des entreprises indépendantes, la rue Wellington tire de l’arrière par rapport à d’autres études de cas de rues principales de Montréal en matière de niveau d’indépendance des entreprises, se classant 14e sur 20 rues principales de Montréal et 18e sur 36 rues principales résidentielles.</p><p>Cependant, la rue Wellington a une densité commerciale relativement élevée, se classant 6e sur 20 rues principales de Montréal et 4e sur 36 rues principales résidentielles.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr83ya8h000s01nu14my3o3u'}
						center={[-73.5667, 45.461]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={[
							'ruewellington',
							'ruewellington-fill',
							'business-montreal-retail',
							'business-montreal-food-drink',
							'business-montreal-services'
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
							title="Entreprises (%)"
							padding={{ top: 0, bottom: 20, left: 110 }}
						/>
					</div>
				</div>
			</div>
		</section>
		<section data-id="map5">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Profil d’emploi</h2>
					<p>Ce segment de la rue Wellington comprend une activité commerciale dynamique et, par conséquent, la rue sert de pôle d’emploi clé pour aider à soutenir son nombre considérable d’entreprises. Beaucoup de ces entreprises emploient entre zéro et dix personnes. Au-delà de la rue Wellington, les rues adjacentes abritent de nombreux employeurs de plus petite taille, employant jusqu’à 50 personnes. Il s’agit d’un mélange relativement équilibré d’emplois dans les infrastructures municipales, les entreprises et d’autres secteurs. L’ensemble de ces éléments fait de la rue Wellington et de ses environs un pôle d’emploi de premier plan dans le quartier de Verdun.</p><p>Dans l’ensemble, la rue Wellington se situe en milieu de peloton en matière de densité d’emploi. En matière de densité d’emploi, la rue se classe 13e sur 20 rues principales de Montréal et 21e sur 36 rues principales résidentielles.</p>

					<img id="employmentsizelegend" src={EmpSizeLegend} alt="legend" />
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr83ya8h000s01nu14my3o3u'}
						center={[-73.5667, 45.461]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['ruewellington', 'ruewellington-fill', 'employment-size']}
						section={'employmentsize'}
						attribution={'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="legend-container">
						<div>
							<LegendItem
								variant={'circle'}
								label={'Infrastructure municipale'}
								bgcolor={'#db3069'}
								bordercolor={'#fff'}
							/>
							<LegendItem
								variant={'circle'}
								label={'Entreprises'}
								bgcolor={'#2a5cac'}
								bordercolor={'#fff'}
							/>
							<LegendItem
								variant={'circle'}
								label={'Autres'}
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
					<h2>Logement</h2>
					<div class="controls">
						<Dropdown
							casestudy={'ruewellington'}
							section={'housing'}
							region={'montreal-fr'}
							options={[
								{ id: 'populationdensity', text: 'Densité de la population' },
								{ id: 'dwellings', text: 'Logements' },
								{ id: 'single-detached', text: 'Logements individuels non attenants' },
								{ id: 'semi-detached', text: 'Logements jumelés' },
								{ id: 'duplex', text: 'Duplex' },
								{ id: 'apartment-more-5-stories', text: 'Tours d’habitation' },
								{ id: 'apartment-less-5-stories', text: 'Immeubles à hauteur restreinte' }
							]}
						/>
						<PhotosCheckbox section={'housing'} layer={'housing-photos'} />
					</div>
					<p>La rue Wellington est une rue commerciale principale entourée de rues résidentielles dominées par des appartements de faible hauteur. Par conséquent, la rue et ses environs conservent une densité de population relativement élevée. Le parc immobilier le long de la rue Wellington et dans les environs est ancien — plus de 50 % de tous les logements de la zone ont été construits avant 1960 et il y a eu très peu de nouvelles constructions au cours des trois dernières décennies. Par conséquent, certains bâtiments, en particulier dans les rues résidentielles proches de la rue Wellington, semblent avoir besoin de réparations externes. En ce qui concerne la typologie des bâtiments, les logements collectifs de trois étages typiquement montréalais prédominent dans le quartier. Ces structures principalement en brique, dont beaucoup sont dotées d’escaliers extérieurs, de petits balcons et de retraits réduits en façade, confèrent au secteur le charme d’un quartier montréalais.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr83ya8h000s01nu14my3o3u'}
						center={[-73.5667, 45.461]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['ruewellington-outline', 'populationdensity']}
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
								title="Année de construction des logements (%)"
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
								title="Type de logement (%)"
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
					<h2>Caractéristiques locales</h2>
					<div class="controls">
						<Dropdown
							casestudy={'ruewellington'}
							section={'demographics'}
							region={'montreal-fr'}
							options={[
								{ id: 'average-age', text: 'Âge moyen' },
								{ id: 'household-size', text: 'Taille des ménages' },
								{ id: 'average-income', text: 'Revenu moyen' },
								{ id: 'visibleminority', text: 'Minorités visibles' },
								{ id: 'immigrants', text: 'Immigrants récents' },
								{ id: 'indigenous', text: 'Population autochtone' },
								{ id: 'english-speakers', text: 'Personne de langue anglaise' },
								{ id: 'french-speakers', text: 'Personne de langue française' },
								{ id: 'education-bachelors', text: "Titulaires d’un baccalauréat" }
							]}
						/>
					</div>
					<p>En moyenne, les personnes résidant sur la rue Wellington et dans les environs sont jeunes, puisque la moyenne d’âge de nombreux pâtés de maisons avoisinant la rue Wellington n’est que de 38 ans. Contrairement à des rues commerciales principales similaires dans d’autres quartiers de Montréal, comme l’avenue du Mont Royal dans le Plateau, la rue Wellington et le quartier Verdun qui l’entoure présentent une grande diversité de revenus, mais les revenus moyens se situent au bas de l’échelle. La rue Wellington et le quartier environnant sont relativement diversifiés, car environ 50 % des personnes qui y habitent appartiennent à une minorité visible et un pourcentage encore plus important est constitué d’immigrants récents. Contrairement à la plupart des autres rues principales de Montréal, il y a un plus grand pourcentage de personnes de langue anglaise que de langue française parmi les personnes résidant sur la rue Wellington et dans les zones environnantes.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr83ya8h000s01nu14my3o3u'}
						center={[-73.5667, 45.461]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['ruewellington-outline', 'average-age']}
						section={'demographics'}
					/>
				</div>
			</div>
		</section>
		<section data-id="map8">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Visiteurs</h2>
					<div class="controls">
						<h5>Année</h5>
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
					<p>L’afflux de nouveaux restaurants, bars et cafés, combiné à la piétonnisation de la rue et à d’autres initiatives d’aménagement de l’espace public, a valu à la rue Wellington le titre de «rue la plus cool du monde» décerné par le magazine TimeOut en 2022. Malgré cela, le niveau de visites par rapport à la période prépandémique de 2019 oscille toujours autour de 60 %. Alors que le taux de visiteurs récurrents s’est pratiquement rétabli, les visites des locaux et des visiteurs occasionnels sont encore largement inférieures aux chiffres de 2019. Plus important encore, la grande majorité de la perte de visiteurs de la rue Wellington provient de visiteurs peu fréquents.</p><p>En matière de résilience globale de la rue et de récupération des visiteurs, la rue Wellington se classe 7e sur 20 pour la résilience des visiteurs dans la région et 21e sur 36 rues principales résidentielles.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr83ya8h000s01nu14my3o3u'}
						center={[-73.5557, 45.5021]}
						zoom={9}
						pitch={0}
						bearing={-15}
						layers={['ruewellington-outline', 'visitors-2022']}
						section={'visitors'}
						attribution={'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="legend-container">
						<Legend
							minlabel={'0'}
							maxlabel={'104,900'}
							label={'Nombre de visites quotidiennes à partir du domicile du visiteur'}
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
								title="Pourcentage du nombre de visites (par rapport à 2019)"
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
								title="Nombre de visites par type de visiteur"
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
								title="Pourcentage de visites par heure de la journée"
								padding={{ top: 0, bottom: 20, left: 80 }}
							/>
						</div>
						<div class="chart">
							<BarChart
								colors={['#0098D6']}
								data={visitordayofweek}
								yKey="Day"
								xKey="Percentage"
								title="Pourcentage de visites par jour de la semaine"
								padding={{ top: 0, bottom: 20, left: 80 }}
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
	<Summary name={'Rue Wellington (Verdun)'} location={'Montreal, Québec'} />
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
