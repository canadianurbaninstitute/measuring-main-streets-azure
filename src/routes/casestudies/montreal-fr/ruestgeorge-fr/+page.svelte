<script>
	/* -------------------------------------------------------------------------- */
	/*                                   Imports                                  */
	/* -------------------------------------------------------------------------- */

	import Title from '../../../lib/ui/Title.svelte';
	import RueStGeorge from '../../../lib/assets/boundaries/montrealboundaries/RueStGeorge.svg';

	import EmpSizeLegend from '../../../lib/assets/employmentsizelegend.svg';

	import Summary from '../../../lib/ui/Summary.svelte';

	import greenspace from '../../../lib/data/casestudydata/montreal-fr/ruestgeorge/greenspace';
	import civicmix from '../../../lib/data/casestudydata/montreal-fr/ruestgeorge/civicmix';
	import businessmix from '../../../lib/data/casestudydata/montreal-fr/ruestgeorge/businessmix';
	import housingtype from '../../../lib/data/casestudydata/montreal-fr/ruestgeorge/housingtype';
	import housingconstruction from '../../../lib/data/casestudydata/montreal-fr/ruestgeorge/housingconstruction';
	import visitortraffic from '../../../lib/data/casestudydata/montreal-fr/ruestgeorge/visitortraffic';
	import visitortypes from '../../../lib/data/casestudydata/montreal-fr/ruestgeorge/visitortypes';
	import visitortimeofday from '../../../lib/data/casestudydata/montreal-fr/ruestgeorge/visitortimeofday';
	import visitordayofweek from '../../../lib/data/casestudydata/montreal-fr/ruestgeorge/visitordayofweek';

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
		outline={RueStGeorge}
		name={'Rue St. George (Saint Jerome)'}
		location={'Montreal, Québec'}
	/>
	<LanguageSelector eng={'/casestudies/montreal/ruestgeorge'} fr={'/casestudies/montreal-fr/ruestgeorge-fr'} selected='fr'/>

	<div class="container">
		<section data-id="map1">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Vue d’ensemble</h2>
					<p>La rue Saint-Georges est une rue commerciale principale située dans la ville de Saint-Jérôme. Saint-Jérôme est une ville de banlieue de 80 000 habitants située à environ 45 km au nord-ouest de Montréal. La ville est la porte d’entrée des Laurentides et sert donc de point de départ à de nombreuses randonnées cyclistes et autres excursions dans les montagnes à partir de Montréal. Saint-Jérôme est accessible depuis Montréal par le train de banlieue EXXO2 qui relie le centre-ville de Montréal à Saint-Jérôme en un peu plus d’une heure.</p><p>Cette section particulière de la rue Saint-Georges comporte de nombreux commerces et établissements commerciaux, ce qui en fait la principale artère commerciale au cœur du centre-ville historique de Saint-Jérôme.</p>
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
							label={'Rue St. George'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr81f0yf000p01qh94qob7bh'}
						center={[-74.003, 45.775]}
						zoom={13}
						pitch={50}
						bearing={0}
						layers={['mainstreets-montreal', 'ruestgeorge', 'ruestgeorge-fill']}
						section={'overview'}
					/>
				</div>
			</div>
		</section>
		<section data-id="map2">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Forme bâtie</h2>
					<p>La forme bâtie de la rue Saint-Georges change au fur et à mesure que l’on traverse ce segment de rue. À l’extrémité sud du segment, près de la rue de Saint-Janvier, la rue a une ou deux voies de circulation dans chaque direction. Plus au nord, cependant, la rue devient unidirectionnelle avec deux voies de circulation et du stationnement des deux côtés de la rue. Il n’y a pas de pistes cyclables ni de marquage pour les vélos dans la rue, mais il y a des stations de bus. Le trottoir et l’état de la rue changent également au fur et à mesure que l’on se dirige vers le nord : le trottoir devient plus large et comporte davantage d’arbres, de bancs et de poubelles. Le matériau du trottoir passe également du béton à la brique rouge. Les bâtiments qui bordent la rue Saint-Georges sont principalement des immeubles commerciaux de deux ou trois étages abritant des commerces au rez-de-chaussée, mais de grands bâtiments institutionnels sont également disséminés dans la rue.</p><p>La rue Saint-Georges bénéficie de nombreux espaces verts accessibles en moins de 10 minutes de marche.</p>
				</div>
				<div class="map-container">
					<div class="legend-container">
						<LegendItem
							variant={'polygon'}
							label={'Rue St. George'}
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
						<SatelliteCheckboxFr casestudy={'ruestgeorge'} section={'builtform'} />
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr81f0yf000p01qh94qob7bh'}
						center={[-74.0034, 45.7754]}
						zoom={15}
						minZoom={15}
						pitch={48}
						bearing={25}
						layers={[
							'ruestgeorge',
							'ruestgeorge-fill',
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
								layer={'ruestgeorge-isochrone'}
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
					<p>La rue Saint-Georges bénéficie d’une solide infrastructure municipale comprenant des services gouvernementaux et communautaires, des établissements de soins et de santé, ainsi que des établissements d’enseignement. Parmi ces derniers, il convient de noter l’immeuble de bureaux du ministère des Transports et de la Mobilité durable du Québec et le campus de l’Université du Québec en Outaouais, situés directement sur la rue. De plus, les locaux ont accès à de petites cliniques de santé et à une pharmacie le long de la rue. Les environs immédiats de la rue Saint-Georges sont bien équipés en commodités de santé, de soins et de services gouvernementaux pour desservir les personnes résidant à Saint-Jérôme. Cependant, il y a un manque flagrant d’art et de culture ainsi que d’équipements de loisirs dans la rue et ses environs.</p><p>Selon l’indice d’infrastructure municipale, la rue Saint-Georges surpasse la plupart des autres études de cas de rues principales en matière d’opportunités civiques. La rue se classe au troisième rang des 20 rues principales de la région et au premier rang des 12 rues principales de petites villes.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr81f0yf000p01qh94qob7bh'}
						center={[-74.0034, 45.7754]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={[
							'ruestgeorge',
							'ruestgeorge-fill',
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
								layer={'ruestgeorge-isochrone'}
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
					<p>La rue Saint-Georges présente un mélange relativement équilibré d’entreprises, comprenant des commerces de détail, des services locaux, et des services de restauration et débits de boissons, avec une légère prédominance des entreprises de services. Tout comme les changements dans la forme bâtie, le profil des entreprises varie le long de la rue. Vers l’extrémité nord du segment, il y a une plus grande concentration de restaurants et de bars, y compris des restaurants locaux indépendants comme le restaurant Arousse et des chaînes régionales comme le bar La P’tite Grenouille. Pendant les mois d’été, certains de ces établissements étendent leur offre avec des terrasses et des places assises sur la rue.</p><p>Malgré sa situation centrale dans le centre-ville de Saint-Jérôme, la rue Saint-Georges connaît une vacance commerciale marquée. Les panneaux à vendre et à louer sont nombreux dans la rue, en particulier dans les bureaux et les espaces commerciaux situés au-dessus des commerces du rez-de-chaussée.</p><p>Selon l’indice des entreprises indépendantes, la rue Saint-Georges se classe au 6e rang des 20 rues principales de Montréal et au 4e rang des 12 rues principales de petites villes en ce qui a trait à l’indépendance des entreprises.</p><p>En matière de densité commerciale, la rue se classe 10e sur 20 rues principales de la région et 3e sur 12 rues principales de petites villes.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr81f0yf000p01qh94qob7bh'}
						center={[-74.0034, 45.7754]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={[
							'ruestgeorge',
							'ruestgeorge-fill',
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
					<p>Les possibilités d’emploi sont nombreuses le long de la rue Saint-Georges, tant sur ce tronçon que sur le reste de la rue. Représentatifs du profil des entreprises, les petits commerces et services, tels que les restaurants et les bars, sont les principaux employeurs, employant entre zéro et cinq personnes. De plus, la rue est dotée d’infrastructures municipales appréciables, dont l’Université du Québec en Outaouais et les bureaux du ministère des Transports et de la Mobilité durable du Québec, qui contribuent de façon importante à l’emploi local.</p><p>Dans l’ensemble, la rue Saint-Georges se classe au 10e rang des 20 rues principales de Montréal en matière de densité d’emploi. Cependant, parmi les autres rues principales de petites villes, la rue Saint-Georges se classe au premier rang des 12 rues principales de petites villes en ce qui a trait à la densité d’emploi.</p>
					<img id="employmentsizelegend" src={EmpSizeLegend} alt="legend" />
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr81f0yf000p01qh94qob7bh'}
						center={[-74.0034, 45.7754]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['ruestgeorge', 'ruestgeorge-fill', 'employment-size']}
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
							casestudy={'ruestgeorge'}
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
					<p>Saint-Jérôme, petite ville de banlieue, conserve une densité de population relativement faible, même dans son centre-ville. Malgré cela, le type de logement prédominant sur et aux abords de la rue Saint-Georges est constitué d’appartements de faible hauteur et de duplex, avec seulement un petit pourcentage de maisons individuelles non attenantes. Le parc immobilier est principalement ancien, la majorité des logements ayant été construits avant 1960 et le développement ayant été minime depuis les années 2000. Le long de la rue Saint-Georges elle-même, on trouve peu de logements, seuls quelques bâtiments commerciaux comportant des logements aux derniers étages.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr81f0yf000p01qh94qob7bh'}
						center={[-74.0034, 45.7754]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['ruestgeorge-outline', 'populationdensity']}
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
							casestudy={'ruestgeorge'}
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
					<p>La rue Saint-Georges à Saint-Jérôme se caractérise par plusieurs attributs locaux distincts. La population a tendance à être plus âgée en moyenne, avec des ménages de petite taille, principalement composés d’une seule personne. Les niveaux de revenus sont particulièrement bas dans cette zone et le pourcentage de minorités visibles est relativement faible. Bien que la proportion d’immigrants récents soit légèrement plus élevée dans ce segment et ses environs, le pourcentage global reste assez faible. En outre, le pourcentage de personnes de langue anglaise est proche de zéro, la quasi-totalité des locaux étant de langue française. Enfin, le pourcentage de personnes titulaires d’un baccalauréat est très faible. L’ensemble de ces facteurs façonne le profil démographique de la rue Saint-Georges, reflétant ses caractéristiques locales uniques.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr81f0yf000p01qh94qob7bh'}
						center={[-74.0034, 45.7754]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['ruestgeorge-outline', 'average-age']}
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
					<p>Le rayon du nombre de visites à partir du domicile des visiteurs a considérablement diminué, ce qui indique que les personnes qui viennent de plus loin ne visitent pas la rue dans la même mesure qu’avant la pandémie en 2019. En outre, bien que les niveaux globaux de visites approchent 80 % de leurs niveaux de 2019, ce qui indique une reprise relativement saine de la pandémie de COVID-19, le nombre de visites classées par type de visiteur a considérablement diminué par rapport à 2019. La diminution du nombre de visiteurs peu fréquents est particulièrement remarquable, passant d’environ 800 000 visiteurs par an à moins de 400 000 visiteurs. Il est intéressant de noter que le plus grand nombre de visiteurs est observé les jeudis et vendredis.</p><p>En matière de résilience globale de la rue et de récupération des visiteurs, la rue Saint-Georges est à la traîne par rapport à d’autres études de cas de rues principales. Elle se classe 17e sur 20 pour la résilience des visiteurs dans la région et 11e sur 12 rues principales de petites villes.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr81f0yf000p01qh94qob7bh'}
						center={[-74.0034, 45.7754]}
						zoom={9}
						pitch={0}
						bearing={-15}
						layers={['ruestgeorge-outline', 'visitors-2022']}
						section={'visitors'}
						attribution={'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="legend-container">
						<Legend
							minlabel={'0'}
							maxlabel={'18,700'}
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
	<Summary name={'Rue St. George (Saint Jerome)'} location={'Montreal, Québec'} />
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
