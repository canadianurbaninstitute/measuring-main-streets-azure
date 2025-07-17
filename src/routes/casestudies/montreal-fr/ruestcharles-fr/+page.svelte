<script>
	/* -------------------------------------------------------------------------- */
	/*                                   Imports                                  */
	/* -------------------------------------------------------------------------- */

	import Title from '../../../lib/ui/Title.svelte';
	import RueStCharles from '../../../lib/assets/boundaries/montrealboundaries/RueStCharles.svg';

	import EmpSizeLegend from '../../../lib/assets/employmentsizelegend.svg';

	import Summary from '../../../lib/ui/Summary.svelte';

	import greenspace from '../../../lib/data/casestudydata/montreal-fr/ruestcharles/greenspace';
	import civicmix from '../../../lib/data/casestudydata/montreal-fr/ruestcharles/civicmix';
	import businessmix from '../../../lib/data/casestudydata/montreal-fr/ruestcharles/businessmix';
	import housingtype from '../../../lib/data/casestudydata/montreal-fr/ruestcharles/housingtype';
	import housingconstruction from '../../../lib/data/casestudydata/montreal-fr/ruestcharles/housingconstruction';
	import visitortraffic from '../../../lib/data/casestudydata/montreal-fr/ruestcharles/visitortraffic';
	import visitortypes from '../../../lib/data/casestudydata/montreal-fr/ruestcharles/visitortypes';
	import visitortimeofday from '../../../lib/data/casestudydata/montreal-fr/ruestcharles/visitortimeofday';
	import visitordayofweek from '../../../lib/data/casestudydata/montreal-fr/ruestcharles/visitordayofweek';

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
	<Title
		outline={RueStCharles}
		name={'Rue St. Charles (Old Longueuil)'}
		location={'Montreal, Québec'}
	/>
	<LanguageSelector eng={'/casestudies/montreal/ruestcharles'} fr={'/casestudies/montreal-fr/ruestcharles-fr'} selected='fr'/>

	<div class="container">
		<section data-id="map1">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Vue d’ensemble</h2>
					<p>La rue Saint-Charles est située dans la ville de Longueuil, sur la rive sud du fleuve Saint-Laurent, directement en face de l’île de Montréal. Longueuil est une ville de banlieue qui abrite une population d’environ 250 000 habitants. Longueuil possède son propre service de bus assuré par le Réseau de transport de Longueuil (RTL) ainsi que la station de métro Longueuil-Université-de-Sherbrooke qui relie Longueuil au centre-ville de Montréal via la ligne jaune du métro de Montréal.</p><p>La rue Saint-Charles est l’une des principales artères de Longueuil et ce segment de la rue Saint-Charles, entre le chemin de Chambly et la rue Guilbault, sert de principale rue commerciale dans Le Vieux-Longueuil. Depuis 2022, le secteur compris entre la rue Saint-Jacques et la rue Sainte-Sylvestre fait l’objet d’une piétonnisation de juin à septembre. Cette transformation voit la construction de terrasses et de sièges extérieurs pour les restaurants, du mobilier urbain temporaire et une augmentation des initiatives d’art urbain et d’aménagement de l’espace public.</p>
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
							label={'Rue St. Charles'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr80v24n000q01p47bhx29ow'}
						center={[-73.51, 45.539]}
						zoom={13}
						pitch={50}
						bearing={0}
						layers={['mainstreets-montreal', 'ruestcharles', 'ruestcharles-fill']}
						section={'overview'}
					/>
				</div>
			</div>
		</section>
		<section data-id="map2">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Forme bâtie</h2>
					<p>La typologie des bâtiments de la rue Saint-Charles se compose principalement d’immeubles de faible hauteur, dotés de commerces au rez-de-chaussée. La zone environnante est principalement résidentielle, composée d’habitations unifamiliales et de logements intermédiaires de type «chaînon manquant» de faible et moyenne densité.</p><p>La rue elle-même est large et inclut deux voies de circulation, un stationnement sur rue, et n’a pas de pistes cyclables. Les rues entourant la rue Saint-Charles sont principalement résidentielles, mais la route 132 est située juste au nord de ce segment de la rue Saint-Charles. Pendant les mois d’été, la rue est piétonne, ce qui modifie la distribution de l’espace en faveur des piétons et des modes de mobilité active. Cette piétonnisation de la rue Saint-Charles s’accompagne d’une programmation et d’un aménagement de l’espace public accru, qui comprennent : du mobilier urbain temporaire, de l’art urbain, des zones wifi, des terrasses et des sièges extérieurs pour les restaurants. La rue est bien desservie par des espaces verts en raison du parc Saint-Mark situé directement sur ce segment de la rue Saint-Charles.</p>
				</div>
				<div class="map-container">
					<div class="legend-container">
						<LegendItem
							variant={'polygon'}
							label={'Rue St. Charles'}
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
						<SatelliteCheckboxFr casestudy={'ruestcharles'} section={'builtform'} />
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr80v24n000q01p47bhx29ow'}
						center={[-73.5108, 45.5379]}
						zoom={15}
						minZoom={15}
						pitch={48}
						bearing={25}
						layers={[
							'ruestcharles',
							'ruestcharles-fill',
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
								layer={'ruestcharles-isochrone'}
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
					<p>Cette section de la rue Saint-Charles est relativement bien desservie par les infrastructures municipales puisque les cinq catégories ou types d’infrastructures municipales y sont présents. Les établissements de soins de santé sont les plus importants puisqu’ils sont au nombre de huit sur ce tronçon de la rue Saint-Charles. En outre, si l’on compare la présence d’infrastructures municipales dans la zone environnante, on constate une certaine surconcentration de celles-ci sur ce tronçon de la rue Saint-Charles, ce qui met en évidence le rôle de cette rue principale en tant que lieu d’accès aux infrastructures municipales.</p><p>Pendant les mois d’été, la piétonnisation de la rue engendre une signalisation spécifique de la rue, des peintures murales, des zones wifi en plein air, des stations de rafraîchissement et du mobilier urbain.</p><p>Selon l’indice d’infrastructure municipale, la rue Saint-Charles se situe en milieu de peloton parmi les études de cas des rues principales de Montréal. En matière de possibilités civiques, la rue Saint-Charles se classe 10e sur 20 rues principales de Montréal et 16e sur 36 rues principales résidentielles.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr80v24n000q01p47bhx29ow'}
						center={[-73.5108, 45.5379]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={[
							'ruestcharles',
							'ruestcharles-fill',
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
								layer={'ruestcharles-isochrone'}
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
					<p>La rue Saint-Charles présente un mélange relativement équilibré de commerces de détail, d’établissements alimentaires et d’entreprises de services. Le segment est, en particulier pendant la piétonnisation estivale, offre au Vieux-Longueuil une grande variété d’options de restauration, comprenant des chaînes de restaurants et de bars montréalais populaires comme Frites Alors, ainsi que des institutions locales comme Péché Matinal. La piétonnisation estivale intègre les restaurants dans la rue, créant un lien intérieur-extérieur par le biais de patios, de terrasses et d’aires de pique-nique. Par une chaude journée d’été, on peut voir les gens attablés aux terrasses des restaurants ou savourant une boisson fraîche dans la rue piétonne ou dans le parc Saint-Mark.</p><p>En revanche, l’extrémité ouest, à l’ouest de la rue Saint-Alexandre, s’oriente vers un paysage commercial plus axé sur les services et les bureaux. Cette zone présente des panneaux indiquant des locaux commerciaux vacants et des espaces de bureaux disponibles, soulignant le contraste dans la composition commerciale entre les deux segments de la rue Saint-Charles.</p><p>Selon l’indice des entreprises indépendantes, la rue Saint-Charles se classe 9e sur 20 études de cas montréalaises et 7e sur 36 rues principales résidentielles, en matière de niveau d’indépendance des entreprises.</p><p>De même, en matière de densité commerciale, la rue se classe 9e sur 20 rues principales de Montréal et 10e sur 36 rues principales résidentielles.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr80v24n000q01p47bhx29ow'}
						center={[-73.5108, 45.5379]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={[
							'ruestcharles',
							'ruestcharles-fill',
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
					<p>Il y a un regroupement important d’emplois sur ce segment de la rue Saint-Charles, surtout lorsqu’on le compare à la zone environnante. Ce regroupement d’emplois conforte la rue Saint-Charles dans son rôle de rue principale du quartier du Vieux-Longueuil. Représentative de la nature commerciale de la rue Saint-Charles, la majorité des personnes travaillent pour des employeurs liés aux affaires, ce qui inclut le large éventail de restaurants et d’établissements de vente au détail.</p><p>Dans l’ensemble, la rue Saint-Charles se classe au 17e rang des 20 rues principales de Montréal et au 28e rang des 36 rues principales résidentielles pour ce qui est de la densité d’emploi.</p>

					<img id="employmentsizelegend" src={EmpSizeLegend} alt="legend" />
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr80v24n000q01p47bhx29ow'}
						center={[-73.5108, 45.5379]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['ruestcharles', 'ruestcharles-fill', 'employment-size']}
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
							casestudy={'ruestcharles'}
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
					<p>La majorité des logements de la rue Saint-Charles et de ses environs datent d’avant 1980, avec des pics de construction importants entre les années 2006 à 2010 et 2016 à 2021. Un changement perceptible dans les caractéristiques des bâtiments et des logements se produit lorsque l’on passe du tronçon commercial de la rue Saint-Charles aux rues résidentielles de banlieue avoisinantes. La rue Saint-Charles comporte quelques logements surmontant des espaces commerciaux, mais les structures principales de la rue sont essentiellement commerciales. Malgré son environnement de banlieue, les rues résidentielles avoisinantes présentent une densité de logements plus élevée que les maisons individuelles non attenantes typiques des zones de banlieue. Les logements de ces rues résidentielles sont principalement des appartements de faible hauteur, avec un mélange varié d’appartements de grande hauteur, de maisons individuelles non attenantes et de maisons jumelées.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr80v24n000q01p47bhx29ow'}
						center={[-73.5108, 45.5379]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['ruestcharles-outline', 'populationdensity']}
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
							casestudy={'ruestcharles'}
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
					<p>Les caractéristiques démographiques de la région entourant la rue Saint-Charles contribuent aux particularités locales. De nombreuses personnes résidant sur la rue Saint-Charles ont plus de 60 ans, assurant une moyenne d’âge relativement élevée. Malgré un environnement de banlieue, la taille moyenne des ménages est particulièrement réduite, avec une moyenne d’environ une personne par ménage. D’un point de vue socio-économique, la zone est majoritairement composée de ménages à revenus élevés, en particulier le long de la rue Saint-Charles, mais cette situation est juxtaposée à des îlots de revenus moyens inférieurs, ce qui favorise un mélange particulier de ménages à revenus élevés et inférieurs au sein d’une même région. Sur le plan linguistique, la zone est majoritairement de langue française. Bien que le pourcentage de nouveaux immigrants soit relativement faible, certaines sections, en particulier le long de la rue Saint-Charles, connaissent un afflux plus important de nouveaux immigrants.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr80v24n000q01p47bhx29ow'}
						center={[-73.5108, 45.5379]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['ruestcharles-outline', 'average-age']}
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
					<p>La rue Saint-Charles est une rue à prédominance commerciale qui offre une grande variété de commerces de détail et de produits alimentaires aux régions de Longueil et de la Rive-Sud. En tant que telle, la rue accueille un grand nombre de visiteurs. La majorité de ces visiteurs sont peu fréquents et ne se rendent donc pas souvent sur la rue Saint-Charles, mais plutôt occasionnellement pour profiter des nombreuses attractions qu’offre la rue. Bien que par une chaude journée d’été, la rue Saint-Charles, piétonne, attire toujours des visiteurs qui viennent profiter de la nourriture, des commerces et de la rue, la pandémie de COVID-19 a eu un impact considérable sur la rue Saint-Charles. À l’instar de nombreuses autres rues principales, le nombre de visiteurs actuels est bien inférieur à celui d’avant la pandémie en 2019. Dans le décompte le plus récent des visiteurs de la rue Saint-Charles, la rue se situe à un peu moins de 60 pour cent de ses chiffres de 2019, ce qui signifie une importante diminution du nombre de visiteurs — principalement des visiteurs peu fréquents — qui fréquentent la rue.</p><p>Par conséquent, en matière de résilience de la rue et de récupération des visiteurs, la rue Saint-Charles est à la traîne de la plupart des autres rues principales de Montréal et des rues principales résidentielles. La rue Saint-Charles se classe 15e sur 20 pour la résilience des visiteurs dans la région et 33e sur 36 rues principales résidentielles.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr80v24n000q01p47bhx29ow'}
						center={[-73.5108, 45.5379]}
						zoom={9}
						pitch={0}
						bearing={-15}
						layers={['ruestcharles-outline', 'visitors-2022']}
						section={'visitors'}
						attribution={'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="legend-container">
						<Legend
							minlabel={'0'}
							maxlabel={'28,100'}
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
	<Summary name={'Rue St. Charles (Old Longueuil)'} location={'Montreal, Québec'} />
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
