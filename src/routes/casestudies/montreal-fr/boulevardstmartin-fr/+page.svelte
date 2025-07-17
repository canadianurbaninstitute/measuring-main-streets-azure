<script>
	/* -------------------------------------------------------------------------- */
	/*                                   Imports                                  */
	/* -------------------------------------------------------------------------- */

	import Title from '../../../lib/ui/Title.svelte';
	import BoulStMartin from '../../../lib/assets/boundaries/montrealboundaries/BoulStMartin.svg';

	import EmpSizeLegend from '../../../lib/assets/employmentsizelegend.svg';

	import Summary from '../../../lib/ui/Summary.svelte';

	import greenspace from '../../../lib/data/casestudydata/montreal-fr/boulevardstmartin/greenspace';
	import civicmix from '../../../lib/data/casestudydata/montreal-fr/boulevardstmartin/civicmix';
	import businessmix from '../../../lib/data/casestudydata/montreal-fr/boulevardstmartin/businessmix';
	import housingtype from '../../../lib/data/casestudydata/montreal-fr/boulevardstmartin/housingtype';
	import housingconstruction from '../../../lib/data/casestudydata/montreal-fr/boulevardstmartin/housingconstruction';
	import visitortraffic from '../../../lib/data/casestudydata/montreal-fr/boulevardstmartin/visitortraffic';
	import visitortypes from '../../../lib/data/casestudydata/montreal-fr/boulevardstmartin/visitortypes';
	import visitortimeofday from '../../../lib/data/casestudydata/montreal-fr/boulevardstmartin/visitortimeofday';
	import visitordayofweek from '../../../lib/data/casestudydata/montreal-fr/boulevardstmartin/visitordayofweek';

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
		outline={BoulStMartin}
		name={'Boulevard St. Martin (Laval)'}
		location={'Montreal, Québec'}
	/>
	<LanguageSelector eng={'/casestudies/montreal/boulevardstmartin'} fr={'/casestudies/montreal-fr/boulevardstmartin-fr'} selected='fr'/>
	<div class="container">
		<section data-id="map1">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Vue d’ensemble</h2>
					<p>Le boulevard Saint-Martin est l’une des rues principales de Laval, au Québec, une ville située sur une île juste au nord de l’île de Montréal. Laval est essentiellement une ville de banlieue d’environ 440 000 habitants, mais de grandes parties de l’île sont occupées par des terres agricoles. Laval est la plus grande banlieue de Montréal et la troisième ville du Québec.</p><p>Le boulevard Saint-Martin, qui date du XIXe siècle, est l’un des plus anciens et des plus longs boulevards de Laval. Cette section particulière du boulevard comporte de nombreux commerces de détail et établissements commerciaux, ce qui en fait une artère commerciale principale importante pour les quartiers environnants de Laval. Le boulevard Saint-Martin est relié aux autoroutes et autres artères avoisinantes, ce qui se traduit par une circulation automobile importante sur le boulevard.</p>
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
							label={'Boulevard St. Martin'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr6on41x011801quckekh80f'}
						center={[-73.7348, 45.5641]}
						zoom={13}
						pitch={50}
						bearing={0}
						layers={['mainstreets-montreal', 'boulevardstmartin', 'boulevardstmartin-fill']}
						section={'overview'}
					/>
				</div>
			</div>
		</section>
		<section data-id="map2">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Forme bâtie</h2>
					<p>Le boulevard Saint-Martin est une grande artère rapide dont la forme bâtie sert principalement à la circulation automobile. La rue comprend trois voies de circulation dans chaque direction avec une limite de vitesse de 50 km/h. Bien qu’il y ait des trottoirs et une piste cyclable des deux côtés de la rue, le nombre de voies de circulation, la vitesse des véhicules et le nombre de véhicules en font un endroit désagréable et peu accueillant pour les piétons et les cyclistes.</p><p>La plupart des bâtiments situés le long du boulevard sont des structures commerciales à un seul étage, semblables à des centres commerciaux, abritant divers commerces tels que des restaurants et des bureaux. Certains parcs ou immeubles de bureaux plus importants sont également présents. Beaucoup de ces structures sont sensiblement en retrait de la rue, en raison de la présence de vastes parcs de stationnement en surface. Cette abondance de stationnements en surface souligne la nature centrée sur la voiture de la rue.</p><p>En revanche, les rues résidentielles adjacentes au boulevard Saint-Martin présentent un aspect de banlieue, certaines d’entre elles abritant des maisons individuelles avec des pelouses à l’avant.</p>
				</div>
				<div class="map-container">
					<div class="legend-container">
						<LegendItem
							variant={'polygon'}
							label={'Boulevard St. Martin'}
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
						<SatelliteCheckboxFr casestudy={'boulevardstmartin'} section={'builtform'} />
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr6on41x011801quckekh80f'}
						center={[-73.7379, 45.5621]}
						zoom={15}
						minZoom={15}
						pitch={69}
						bearing={40}
						layers={[
							'boulevardstmartin',
							'boulevardstmartin-fill',
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
								layer={'boulevardstmartin-isochrone'}
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
					<p>Le boulevard Saint-Martin bénéficie d’infrastructures municipales essentielles, notamment d’établissements de santé et de services publics. Cependant, il ne dispose pas de commodités adéquates pour les arts, la culture et les loisirs. Contrairement à de nombreuses autres rues principales de Montréal ayant fait l’objet d’une étude de cas, le boulevard Saint-Martin sert principalement de voie de circulation pour les véhicules. Par conséquent, les infrastructures destinées aux piétons, telles que le mobilier urbain, la programmation et la signalisation, sont limitées. Néanmoins, le boulevard joue un rôle crucial en répondant aux besoins de santé des quartiers environnants de Laval, en raison de la présence appréciable d’établissements de soins et de santé. En outre, il accueille d’importants services gouvernementaux, notamment le Palais de Justice de Laval.</p><p>Cependant, selon l’indice d’infrastructure municipale, le boulevard Saint-Martin accuse un retard par rapport à la plupart des autres études de cas de rues principales de Montréal et d’autres rues principales résidentielles en matière de possibilités civiques. La rue se classe 13e sur 20 rues principales de Montréal et 29e sur 36 rues principales résidentielles.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr6on41x011801quckekh80f'}
						center={[-73.7348, 45.5641]}
						zoom={14.1}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={[
							'boulevardstmartin',
							'boulevardstmartin-fill',
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
								layer={'boulevardstmartin-isochrone'}
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
					<p>Le long du boulevard Saint-Martin, les commerces de détail, les services locaux et les services de restauration et débits de boisson sont relativement homogènes. La plupart des commerces de détail et des services de restauration et débits de boissons sont de grandes chaînes nationales, avec peu de commerces de détail ou de restauration indépendants. Pour répondre à la nature centrée sur la voiture de la rue, beaucoup de ces établissements disposent d’un grand stationnement et d’un service à l’auto. De nombreux services et entreprises de services sont liés à l’automobile et comprennent des stations-service, des garages et des services d’entretien automobile.</p><p>En se déplaçant d’est en ouest le long du boulevard Saint-Martin, le paysage commercial commence à changer, soulignant que les différents tronçons de la rue offrent des options commerciales et d’affaires diverses. L’extrémité ouest de ce segment de rue est dominée par de grands centres commerciaux et des parcs de bureaux à forte densité, tandis que l’extrémité est est dominée par des centres commerciaux de faible densité et de faible hauteur.</p><p>Selon l’indice des entreprises indépendantes, le boulevard Saint-Martin est à la traîne par rapport à d’autres études de cas de rues principales en matière de niveau d’indépendance des entreprises, se classant 20e sur 20 rues principales de Montréal et 30e sur 36 rues principales résidentielles.</p><p>De même, en matière de densité commerciale, la rue se classe 19e sur 20 rues principales de Montréal et 32e sur 36 rues principales résidentielles.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr6on41x011801quckekh80f'}
						center={[-73.7348, 45.5641]}
						zoom={14.1}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={[
							'boulevardstmartin',
							'boulevardstmartin-fill',
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
					<p>La majorité des entreprises du boulevard Saint-Martin sont des commerces de détail ou des services de restauration et débits de boissons et le profil de l’emploi de la rue en est représentatif. Une grande partie de l’emploi le long de ce segment du boulevard Saint-Martin se trouve dans les entreprises qui bordent la rue. Il s’agit d’un mélange d’employeurs de petite taille, employant entre 0 et 5 personnes, et d’employeurs plus importants, comptant sur une main-d’œuvre de plus de 50 personnes.</p><p>Si le boulevard Saint-Martin accueille une part importante des opportunités d’emploi, la zone environnante y contribue également de manière significative. Au nord-est de ce segment, les entreprises autres que de détail offrent d’importantes possibilités d’emploi, tandis qu’au sud-ouest, les établissements d’infrastructure municipale jouent un rôle clé dans le paysage de l’emploi.</p><p>Dans l’ensemble, le boulevard Saint-Martin se classe au 8e rang des 20 rues principales de Montréal et au 7e rang des 36 rues principales résidentielles pour ce qui est de la densité d’emploi.</p>
					<img id="employmentsizelegend" src={EmpSizeLegend} alt="legend" />
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr6on41x011801quckekh80f'}
						center={[-73.7348, 45.5641]}
						zoom={14.1}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['boulevardstmartin', 'boulevardstmartin-fill', 'employment-size']}
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
							casestudy={'boulevardstmartin'}
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
					<p>En général, la situation de banlieue du boulevard Saint-Martin à Laval se traduit par une densité de population relativement faible. En tant qu’artère principale, il n’y a pas beaucoup d’habitations directement sur le boulevard Saint-Martin, mais les zones environnantes et les rues adjacentes comprennent un plus grand nombre d’habitations. La construction de logements a connu une croissance régulière entre 2001 et 2021, mais a fortement diminué depuis.</p><p>Bien que la zone soit principalement caractérisée par des tours d’habitation et des appartements de faible hauteur, il existe encore une variété de types de logements autour du boulevard Saint-Martin. Les tours d’habitation sont prédominantes le long du boulevard et dans les zones résidentielles adjacentes du sud. En revanche, le quartier nord présente une atmosphère de banlieue avec des maisons individuelles non attenantes et des pelouses.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr6on41x011801quckekh80f'}
						center={[-73.7348, 45.5641]}
						zoom={14.1}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['boulevardstmartin-outline', 'populationdensity']}
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
							casestudy={'boulevardstmartin'}
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
					<p>La région entourant le boulevard Saint-Martin présente une diversité considérable sur le plan économique, racial, linguistique et éducatif. Sur le plan économique, il existe un éventail de revenus le long de la rue et dans les zones avoisinantes, allant de faibles à élevés. Sur le plan racial et ethnique, le quartier comprend une proportion importante de minorités visibles et d’immigrants récents, bien que la population autochtone soit minime. Sur le plan linguistique, le quartier compte un nombre équilibré de personnes de langue anglaise et de langue française. En outre, le niveau d’éducation varie, certaines zones affichant un pourcentage élevé de titulaires d’un baccalauréat, tandis que d’autres n’en comptent qu’un nombre minime.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr6on41x011801quckekh80f'}
						center={[-73.7348, 45.5641]}
						zoom={14.1}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['boulevardstmartin-outline', 'average-age']}
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
					<p>La pandémie de COVID-19 a eu un impact significatif sur la fréquentation du boulevard Saint-Martin, les taux de fréquentation actuels n’atteignant qu’environ 50 % des niveaux d’avant la pandémie. Bien que le nombre de visites des locaux se soit mieux rétabli, soulignant l’importance de la rue en tant que pôle local, il y a un décalage considérable entre les visites des visiteurs récurrents et celles des visiteurs peu fréquents. On observe également une augmentation substantielle des pourcentages de visites pendant le week-end, ce qui souligne l’importance des établissements commerciaux de la rue, car les gens ont tendance à venir le week-end pour faire des achats plutôt que pour travailler en semaine.</p><p>En matière de résilience globale de la rue et de récupération des visiteurs, le boulevard Saint-Martin se classe 13e sur 20 pour la résilience des visiteurs dans la région et 29e sur 36 rues principales résidentielles.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr6on41x011801quckekh80f'}
						center={[-73.7348, 45.5641]}
						zoom={9}
						pitch={0}
						bearing={-15}
						layers={['boulevardstmartin-outline', 'visitors-2022']}
						section={'visitors'}
						attribution={'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="legend-container">
						<Legend
							minlabel={'0'}
							maxlabel={'65,700'}
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
	<Summary name={'Boulevard St. Martin (Laval)'} location={'Montreal, Québec'} />
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
