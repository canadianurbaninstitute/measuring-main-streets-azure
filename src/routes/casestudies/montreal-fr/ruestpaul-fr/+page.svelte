<script>
	/* -------------------------------------------------------------------------- */
	/*                                   Imports                                  */
	/* -------------------------------------------------------------------------- */

	import Title from '../../../lib/Title.svelte';
	import RueStPaul from '../../../lib/assets/boundaries/montrealboundaries/RueStPaul.svg';

	import EmpSizeLegend from '../../../lib/assets/employmentsizelegend.svg';

	import Summary from '../../../lib/Summary.svelte';

	import greenspace from '../../../lib/data/casestudydata/montreal-fr/ruestpaul/greenspace';
	import civicmix from '../../../lib/data/casestudydata/montreal-fr/ruestpaul/civicmix';
	import businessmix from '../../../lib/data/casestudydata/montreal-fr/ruestpaul/businessmix';
	import housingtype from '../../../lib/data/casestudydata/montreal-fr/ruestpaul/housingtype';
	import housingconstruction from '../../../lib/data/casestudydata/montreal-fr/ruestpaul/housingconstruction';
	import visitortraffic from '../../../lib/data/casestudydata/montreal-fr/ruestpaul/visitortraffic';
	import visitortypes from '../../../lib/data/casestudydata/montreal-fr/ruestpaul/visitortypes';
	import visitortimeofday from '../../../lib/data/casestudydata/montreal-fr/ruestpaul/visitortimeofday';
	import visitordayofweek from '../../../lib/data/casestudydata/montreal-fr/ruestpaul/visitordayofweek';

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
	<Title outline={RueStPaul} name={'Rue St. Paul (Old Montreal)'} location={'Montreal, Québec'} />
	<LanguageSelector eng={'/casestudies/montreal/ruestpaul'} fr={'/casestudies/montreal-fr/ruestpaul-fr'} selected='fr'/>

	<div class="container">
		<section data-id="map1">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Vue d’ensemble</h2>
					<p>La rue Saint-Paul, située au cœur du Vieux-Montréal, joue un rôle essentiel dans le centre-ville historique de la ville et constitue un lieu très prisé des touristes. Pavée pour la première fois en 1672, la rue Saint-Paul est la plus ancienne rue de Montréal. Une grande partie de la rue est encore pavée et comporte des bâtiments historiques, dont certains datent du 17e siècle. La rue Saint-Paul est bordée de boutiques, de galeries d’art, d’hôtels et de lieux historiques tels que le marché Bonsecours et la chapelle Notre-Dame-de-Bon-Secours.</p><p>Ce tronçon de la rue Saint-Paul, situé entre le boulevard Saint-Laurent et la rue McGill, offre une ambiance animée grâce à une grande variété de commerces, d’espaces culturels et de lieux d’art qui attirent à la fois les locaux et les touristes. En s’éloignant du cœur du Vieux-Montréal vers l’ouest, ce segment de rue devient moins commercial, les voies de circulation s’élargissent et le nombre de touristes diminue tandis que la circulation automobile augmente. Par conséquent, cette partie de la rue principale sert de rue principale pour les entreprises, les personnes résidant dans le quartier et les visiteurs.</p>
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
							label={'Rue St. Paul'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr83fi2a001101p4ae4x8rt6'}
						center={[-73.555, 45.502]}
						zoom={13}
						pitch={50}
						bearing={0}
						layers={['mainstreets-montreal', 'ruestpaul', 'ruestpaul-fill']}
						section={'overview'}
					/>
				</div>
			</div>
		</section>
		<section data-id="map2">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Forme bâtie</h2>
					<p>Cette section de la rue Saint-Paul est relativement étroite, dotée d’une seule voie de circulation, de trottoirs étroits, d’aucune infrastructure pour les vélos et d’un stationnement sur la chaussée. La rue est bordée d’immeubles historiques et patrimoniaux ouvragés de moyenne à grande hauteur, avec des espaces commerciaux au rez-de-chaussée qui contribuent au charme historique du quartier et attirent les touristes. Les étages supérieurs de ces immeubles accueillent des activités commerciales, résidentielles ou hôtelières. De petits stationnements, situés sur des terrains vagues entre certains des bâtiments abondamment ornés, interrompent le paysage de la rue. L’absence de retrait entre les bâtiments et les trottoirs, combinée à l’étroitesse des trottoirs, au stationnement sur la voie publique et aux structures de moyenne et grande hauteur, crée une expérience piétonne étriquée.</p><p>La rue Saint-Paul, en tant qu’artère historique dense et étroite du centre-ville, manque d’espaces verts. Cependant, les locaux et les visiteurs profitent de la proximité du fleuve Saint-Laurent et de la promenade adjacente, qui donnent accès à de beaux espaces verts à dix minutes de marche.</p>
				</div>
				<div class="map-container">
					<div class="legend-container">
						<LegendItem
							variant={'polygon'}
							label={'Rue St. Paul'}
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
						<SatelliteCheckboxFr casestudy={'ruestpaul'} section={'builtform'} />
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr83fi2a001101p4ae4x8rt6'}
						center={[-73.5557, 45.5021]}
						zoom={15}
						minZoom={15}
						pitch={48}
						bearing={25}
						layers={[
							'ruestpaul',
							'ruestpaul-fill',
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
								layer={'ruestpaul-isochrone'}
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
					<p>L’emplacement central stratégique de la rue Saint-Paul dans le Vieux-Montréal garantit un accès pratique à diverses infrastructures municipales à moins de dix minutes de marche. Des attractions clés, comme le marché Bonsecours et la chapelle Notre-Dame-de-Bon-Secours dans les environs, servent de points de convergence qui attirent les touristes et les personnes résidant dans le quartier, offrant des espaces invitants où l’on peut s’attarder. La rue est bordée de bâtiments historiques et patrimoniaux qui contribuent au caractère et au charme du Vieux-Montréal. La rue Saint-Paul accueille également un éventail d’espaces à vocation pédagogique, artistique et culturelle, qui répondent aux divers intérêts des nombreux touristes qui fréquentent la rue.</p><p>Selon l’indice d’infrastructure municipale, la rue Saint-Paul se classe très bien en matière d’opportunités civiques. La rue Saint-Paul se classe au premier rang des 20 rues principales de Montréal et au cinquième rang des 12 rues principales de centres-villes.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr83fi2a001101p4ae4x8rt6'}
						center={[-73.5557, 45.5021]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={[
							'ruestpaul',
							'ruestpaul-fill',
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
								layer={'ruestpaul-isochrone'}
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
					<p>La rue Saint-Paul est une rue commerciale qui offre un mélange relativement égal d’entreprises, comprenant des commerces de détail et de services, ainsi que des services de restauration et débits de boissons. La rue s’adresse principalement aux touristes et aux visiteurs et les commerces reflètent cette clientèle. La rue Saint-Paul compte un certain nombre de boutiques et d’hôtels de prestige. Le rez-de-chaussée des bâtiments historiques abrite un mélange de boutiques, de galeries d’art, de cafés et de restaurants. L’absence marquée de chaînes de magasins et la présence de boutiques spécialisées offrent aux visiteurs de la rue Saint-Paul une expérience d’achat locale, et le regroupement de galeries d’art renforce l’attrait culturel de la rue.</p><p>Malgré l’importance de la rue Saint-Paul en tant que rue principale du Vieux-Montréal, on observe des locaux vacants dans les bureaux et les espaces commerciaux situés au-dessus des vitrines de boutiques.</p><p>Selon l’indice des entreprises indépendantes, la rue Saint-Paul surpasse toutes les autres études de cas de rues principales en matière de niveau d’indépendance des entreprises, se classant au premier rang des 20 rues principales de Montréal et au premier rang des 12 rues principales de centres-villes.</p><p>L’emplacement central de la rue Saint-Paul dans le Vieux-Montréal se traduit également par une forte densité commerciale, la rue se classant au 3e rang de toutes les rues principales de Montréal et au 2e rang des 12 rues principales de centre-ville.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr83fi2a001101p4ae4x8rt6'}
						center={[-73.5557, 45.5021]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={[
							'ruestpaul',
							'ruestpaul-fill',
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
					<p>Le Vieux-Montréal représente un pôle majeur de l’économie et de l’emploi à Montréal et un certain nombre de commerces — de détail et autres — sont situés dans et autour de la rue Saint-Paul. Par conséquent, la majorité des emplois se trouvent au sein de ces entreprises plutôt que dans les infrastructures municipales. De plus, la plupart des entreprises de la rue Saint-Paul sont de petite taille et spécialisées, comme les boutiques et les galeries d’art. Le profil de l’emploi en est le reflet, puisque la majorité des employeurs de la rue Saint-Paul comptent entre zéro et dix membres du personnel. Dans les zones plus proches du centre-ville et du quartier central des affaires de Montréal, situées au nord de la rue Saint-Paul, on peut observer des entreprises plus importantes qui emploient un plus grand nombre de personnes.</p><p>Dans l’ensemble, l’emplacement central de la rue Saint-Paul fait en sorte que la rue surpasse les autres études de cas de rues principales en matière de densité d’emploi, se classant au deuxième rang des 20 rues principales de Montréal et au troisième rang des 12 rues principales de centres-villes.</p>

					<img id="employmentsizelegend" src={EmpSizeLegend} alt="legend" />
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr83fi2a001101p4ae4x8rt6'}
						center={[-73.5557, 45.5021]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['ruestpaul', 'ruestpaul-fill', 'employment-size']}
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
							casestudy={'ruestpaul'}
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
					<p>Les logements de la rue Saint-Paul et de ses environs sont un mélange d’ancien et de nouveau, la majorité des logements ayant été construits avant 1960 ou après 2016.</p><p>Représentative de la densité plus élevée du Vieux-Montréal et du centre-ville environnant, la majorité des logements de la rue Saint-Paul et de ses environs sont des tours d’habitation. Cette situation diffère considérablement de celle de la RMR de Montréal, qui se caractérise par des logements de faible et moyenne densité et des logements collectifs.</p><p>Malgré le nombre élevé de logements sur et aux abords de la rue Saint-Paul, la densité de population y est relativement plus faible que dans les quartiers environnants. La rue Saint-Paul, et plus largement le Vieux-Montréal, est une destination touristique et certains des logements de la zone servent de résidences temporaires pour des visiteurs ou des touristes par le biais de locations à court terme.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr83fi2a001101p4ae4x8rt6'}
						center={[-73.5557, 45.5021]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['ruestpaul-outline', 'populationdensity']}
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
							casestudy={'ruestpaul'}
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
					<p>Certaines données démographiques clés mettent en évidence les caractéristiques locales des personnes résidant sur la rue Saint-Paul et dans les environs du Vieux-Montréal. Le quartier abrite principalement des personnes de langue anglaise, avec 100 % de personnes de langue anglaise contre environ 30 % de personnes de langue française. De plus, les locaux, qui sont majoritairement des ménages d’une seule personne, sont en grande partie des personnes à revenu élevé qui détiennent un diplôme de niveau baccalauréat. La rue Saint-Paul, et plus largement le Vieux-Montréal, se caractérisent également par un pourcentage plus faible de minorités visibles que les quartiers environnants.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr83fi2a001101p4ae4x8rt6'}
						center={[-73.5557, 45.5021]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['ruestpaul-outline', 'average-age']}
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
					<p>La rue Saint-Paul, qui est avant tout une destination touristique qui ne compte que peu de personnes y résidant de façon permanente, dépend fortement des visiteurs occasionnels pour assurer la pérennité des entreprises et des services environnants. La majorité des personnes qui fréquentent la rue sont des visiteurs occasionnels ou des touristes, plutôt que des locaux ou des visiteurs réguliers provenant des zones voisines. Après l’apparition de la pandémie de COVID-19 au début de l’année 2020, le nombre de visites dans la rue Saint-Paul a chuté à moins de 20 % par rapport aux chiffres de 2019. Bien que les visites des locaux, même si elles ne représentent qu’une faible proportion, se soient en grande partie rétablies, le nombre de visiteurs occasionnels et récurrents continue d’accuser un retard important par rapport aux niveaux de 2019. Malgré les efforts de rétablissement en cours et une augmentation progressive du nombre de visiteurs, la rue fonctionne actuellement à environ 70 % de la fréquentation totale par rapport à la période prépandémique en 2019.</p><p>Par conséquent, en matière de résilience de la rue et de récupération des visiteurs, la rue Saint-Paul est à la traîne des autres rues principales de Montréal et des rues principales de centres-villes. Elle se classe 18e sur 20 en matière de résilience des visiteurs dans la région et 7e sur 12 rues principales de centres-villes.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr83fi2a001101p4ae4x8rt6'}
						center={[-73.5557, 45.5021]}
						zoom={9}
						pitch={0}
						bearing={-15}
						layers={['ruestpaul-outline', 'visitors-2022']}
						section={'visitors'}
						attribution={'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="legend-container">
						<Legend
							minlabel={'0'}
							maxlabel={'84,900'}
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
	<Summary name={'Rue St. Paul (Old Montreal)'} location={'Montreal, Québec'} />
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
