<script>
	/* -------------------------------------------------------------------------- */
	/*                                   Imports                                  */
	/* -------------------------------------------------------------------------- */

	import Title from '../../../lib/ui/Title.svelte';
	import RueStAnne from '../../../lib/assets/boundaries/montrealboundaries/RueStAnne.svg';

	import EmpSizeLegend from '../../../lib/assets/employmentsizelegend.svg';

	import Summary from '../../../lib/ui/Summary.svelte';

	import greenspace from '../../../lib/data/casestudydata/montreal-fr/ruestanne/greenspace';
	import civicmix from '../../../lib/data/casestudydata/montreal-fr/ruestanne/civicmix';
	import businessmix from '../../../lib/data/casestudydata/montreal-fr/ruestanne/businessmix';
	import housingtype from '../../../lib/data/casestudydata/montreal-fr/ruestanne/housingtype';
	import housingconstruction from '../../../lib/data/casestudydata/montreal-fr/ruestanne/housingconstruction';
	import visitortraffic from '../../../lib/data/casestudydata/montreal-fr/ruestanne/visitortraffic';
	import visitortypes from '../../../lib/data/casestudydata/montreal-fr/ruestanne/visitortypes';
	import visitortimeofday from '../../../lib/data/casestudydata/montreal-fr/ruestanne/visitortimeofday';
	import visitordayofweek from '../../../lib/data/casestudydata/montreal-fr/ruestanne/visitordayofweek';

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
		outline={RueStAnne}
		name={'Rue St. Anne (Sainte Anne de Bellevue)'}
		location={'Montreal, Québec'}
	/>
	<LanguageSelector eng={'/casestudies/montreal/ruestanne'} fr={'/casestudies/montreal-fr/ruestanne-fr'} selected='fr'/>

	<div class="container">
		<section data-id="map1">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Vue d’ensemble</h2>
					<p>Située sur ce que l’on appelle l’ouest de l’île de Montréal, Sainte-Anne-de-Bellevue est une petite banlieue majoritairement de langue anglaise située à l’extrémité ouest de l’île de Montréal. Sainte-Anne-de-Bellevue abrite un certain nombre de points d’intérêt importants qui servent à la fois aux locaux et aux visiteurs de la petite ville. Il s’agit notamment de l’Arboretum Morgan, du Parc naturel de L’Anse-à-l’Orme, du Collège John Abbott, du Campus Macdonald de l’Université McGill et du canal de Sainte-Anne-de-Bellevue. Parallèlement au canal de Sainte-Anne-de-Bellevue, reconnu comme lieu historique national du Canada, se trouve la rue Sainte-Anne, la principale artère commerciale de Sainte-Anne-de-Bellevue, qui traverse le centre historique de la ville.</p><p>La rue Sainte-Anne est une rue principale pittoresque dotée d’une architecture patrimoniale charmante. Au-delà de son charme historique et touristique, la rue Sainte-Anne offre une grande variété de restaurants au bord de l’eau, de boutiques indépendantes et un accès au bord de l’eau et à la promenade le long du canal.</p>
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
							label={'Rue St. Anne'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr7woapp000601qh4reh2jlg'}
						center={[-73.951, 45.403]}
						zoom={13}
						pitch={50}
						bearing={0}
						layers={['mainstreets-montreal', 'ruestanne', 'ruestanne-fill']}
						section={'overview'}
					/>
				</div>
			</div>
		</section>
		<section data-id="map2">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Forme bâtie</h2>
					<p>Les bâtiments situés le long de la rue Sainte-Anne sont principalement des structures de faible hauteur dotées d’espaces commerciaux au rez-de-chaussée. La zone environnante est essentiellement résidentielle, et comprend un mélange de maisons individuelles et d’appartements de faible hauteur.</p><p>La rue Sainte-Anne est une rue à double sens avec une voie de circulation dans chaque direction. Il est possible de se garer dans la rue à certains endroits, mais l’étroitesse de la rue limite les possibilités de stationnement. Bien qu’il n’y ait pas de pistes cyclables, on a pu observer, lors d’une chaude journée d’été, un certain nombre de cyclistes empruntant la rue.</p><p>Juste au sud de la rue Sainte-Anne se trouve la Promenade du Canal, une promenade qui longe le canal. Il existe de nombreuses connexions entre la rue Sainte-Anne et la promenade, facilitées par les restaurants et les sentiers environnants, créant ainsi un lien continu entre les deux. La promenade elle-même offre diverses commodités aux visiteurs, notamment un grand nombre d’arbres, des tables de pique-nique, des bancs, des fontaines d’eau et des poubelles, invitant les gens à s’attarder et à profiter de l’environnement.</p>
				</div>
				<div class="map-container">
					<div class="legend-container">
						<LegendItem
							variant={'polygon'}
							label={'Rue St. Anne'}
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
						<SatelliteCheckboxFr casestudy={'ruestanne'} section={'builtform'} />
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr7woapp000601qh4reh2jlg'}
						center={[-73.9512, 45.4031]}
						zoom={15.5}
						minZoom={15}
						pitch={48}
						bearing={25}
						layers={[
							'ruestanne',
							'ruestanne-fill',
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
								layer={'ruestanne-isochrone'}
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

					<p>La rue Sainte-Anne est relativement bien desservie par les établissements de santé ainsi que par les services gouvernementaux et communautaires. Ces établissements de santé sont principalement de petites cliniques indépendantes. À dix minutes de marche, la présence du campus Macdonald de l’Université McGill et du collège John Abbott, entre autres établissements d’enseignement, fait que le quartier est bien desservi par l’infrastructure municipale en matière d’éducation. Sur la rue Sainte-Anne elle-même, il y a un petit parc qui offre une certaine programmation. Pendant les mois d’été, par exemple, une scène a été construite dans le parc et des panneaux signalaient un petit événement musical public qui se déroulait dans le parc et dans la rue. La Promenade du Canal, située à proximité, offre une plus grande variété et davantage de commodités aux visiteurs, notamment des bancs, des tables de pique-nique et des fontaines d’eau.</p><p>Malgré ces commodités essentielles, la rue Sainte-Anne est mal desservie en ce qui concerne d’autres infrastructures municipales clés telles que les arts et la culture et les loisirs. Cependant, à dix minutes de marche, ces infrastructures municipales sont accessibles aux personnes qui habitent sur la rue Sainte-Anne dans des proportions similaires à la moyenne de la RMR de Montréal.</p><p>Selon l’indice d’infrastructure municipale, la rue Sainte-Anne est en retard par rapport à la plupart des autres études de cas de Montréal et des rues principales résidentielles. En matière de possibilités civiques, la rue Sainte-Anne se classe 18e sur 20 rues principales de Montréal et 11e sur 12 rues principales de petites villes.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr7woapp000601qh4reh2jlg'}
						center={[-73.9512, 45.4031]}
						zoom={15}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={[
							'ruestanne',
							'ruestanne-fill',
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
								layer={'ruestanne-isochrone'}
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
					<p>La rue Sainte-Anne fait office de rue commerciale principale en raison de sa concentration dense de commerces par rapport à la zone environnante. La majorité des entreprises situées sur la rue Sainte-Anne est constituée de restaurants et d’autres établissements de restauration. Sainte-Anne-de-Bellevue est une petite ville, mais la rue Sainte-Anne offre une grande variété et une grande quantité d’options pour se nourrir, y compris des restaurants thaïlandais et de fruits de mer, des marchands de crème glacée et des cafés tels que le café Twig, le préféré des locaux. Pendant les chauds mois d’été, certains restaurants disposent de patios et de terrasses qui débordent sur le trottoir, créant ainsi un lien entre l’intérieur et l’extérieur de la rue. Sur le côté sud de la rue, de nombreux restaurants sont dotés de terrasses qui permettent de manger au bord de l’eau, le long du canal. La rue Sainte-Anne compte également un certain nombre de boutiques indépendantes.</p><p>Selon l’indice des entreprises indépendantes, la rue Sainte-Anne se classe 11e sur 20 études de cas de rues principales de Montréal et 5e sur 12 rues principales de petites villes, en matière de niveau d’indépendance des entreprises.</p><p>De même, en matière de densité commerciale, la rue se classe 13e sur 20 rues principales de Montréal et 7e sur 12 rues principales de petites villes.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr7woapp000601qh4reh2jlg'}
						center={[-73.9512, 45.4031]}
						zoom={15}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={[
							'ruestanne',
							'ruestanne-fill',
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
					<p>Cette section de la rue Sainte-Anne présente une concentration importante d’emplois. Représentative de la prédominance des petits commerces de détail indépendants et des établissements de restauration sur la rue, la majorité des emplois se trouvent dans les entreprises, qui n’emploient qu’entre zéro et dix personnes.</p><p>Cependant, la rue Sainte-Anne est à la traîne de toutes les autres études de cas de rues principales de Montréal en matière de densité d’emploi, puisqu’elle se classe 20e sur 20 rues principales de Montréal. De plus, la rue se classe 11e sur 12 rues principales de petites villes.</p>

					<img id="employmentsizelegend" src={EmpSizeLegend} alt="legend" />
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr7woapp000601qh4reh2jlg'}
						center={[-73.9512, 45.4031]}
						zoom={15}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['ruestanne', 'ruestanne-fill', 'employment-size']}
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
							casestudy={'ruestanne'}
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
					<p>La densité de population diminue généralement au fur et à mesure que l’on s’éloigne de la rue Sainte-Anne, ce qui met en évidence sa présence en tant que rue principale. Sur la rue Sainte-Anne, on trouve quelques logements à l’extrémité est du segment de rue, mais la majorité des logements sont situés juste à côté de la rue Sainte-Anne et dans les rues avoisinantes. En ce qui concerne le parc immobilier lui-même, les bâtiments sont généralement plus anciens — la majorité des logements ont été construits avant 1960 et il y a eu très peu de nouvelles constructions depuis 2001. En outre, la plupart des logements sont des appartements de faible hauteur, bien qu’il y ait plus de maisons jumelées et de tours d’habitation que la moyenne montréalaise. Malgré sa situation en banlieue, le pourcentage de maisons individuelles non attenantes est nettement inférieur à la moyenne.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr7woapp000601qh4reh2jlg'}
						center={[-73.9512, 45.4031]}
						zoom={15}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['ruestanne-outline', 'populationdensity']}
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
							casestudy={'ruestanne'}
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
					<p>La rue Sainte-Anne présente plusieurs caractéristiques démographiques qui la distinguent des quartiers avoisinants. La présence du campus Macdonald de l’Université McGill et du Collège John Abbott contribue à une démographie relativement jeune, tandis que la prédominance d’appartements de faible hauteur se traduit par des ménages de plus petite taille que dans les régions avoisinantes. Cette situation, associée à la présence importante d’une population étudiante, est en corrélation avec le revenu moyen plus faible du quartier. En outre, la rue Sainte-Anne présente des pourcentages plus élevés de minorités visibles et d’immigrants récents. Sainte-Anne-de-Bellevue est située dans l’ouest de l’île où l’on parle anglais. Par conséquent, la rue elle-même conserve une population majoritairement de langue anglaise, et l’on note une absence marquée de personnes dont le français est la langue maternelle. Cependant, le bilinguisme reste répandu parmi les locaux, ce qui reflète le contexte linguistique plus large de la région.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr7woapp000601qh4reh2jlg'}
						center={[-73.9512, 45.4031]}
						zoom={15}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['ruestanne-outline', 'average-age']}
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
					<p>Les visiteurs de la rue Sainte-Anne sont principalement des visiteurs peu fréquents, la majorité des visites ayant lieu le week-end, en particulier les vendredis et samedis. Malgré les défis posés par la pandémie de COVID-19, le nombre de personnes résidant dans la rue et de visiteurs récurrents est resté relativement stable, ce qui indique une fréquentation locale constante tout au long de la pandémie. Cependant, le nombre de visiteurs occasionnels a connu une forte baisse au cours de cette période.</p><p>L’analyse de l’origine des visiteurs révèle qu’une part importante du trafic piétonnier quotidien provient de l’ouest de l’île, ce qui indique qu’une proportion considérable des visiteurs de la rue Sainte-Anne provient de la région environnante. Cela souligne l’importance de la rue en tant que destination locale au sein de la communauté de l’ouest de l’île.</p><p>Cependant, en matière de résilience globale de la rue et de récupération des visiteurs, la rue Sainte-Anne se classe 11e sur 20 pour la résilience des visiteurs dans la région et 10e sur 12 rues principales de petites villes.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr7woapp000601qh4reh2jlg'}
						center={[-73.9512, 45.4031]}
						zoom={9}
						pitch={0}
						bearing={-15}
						layers={['ruestanne-outline', 'visitors-2022']}
						section={'visitors'}
						attribution={'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="legend-container">
						<Legend
							minlabel={'0'}
							maxlabel={'26,500'}
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
	<Summary name={'Rue St. Anne (Sainte Anne de Bellevue)'} location={'Montreal, Québec'} />
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
