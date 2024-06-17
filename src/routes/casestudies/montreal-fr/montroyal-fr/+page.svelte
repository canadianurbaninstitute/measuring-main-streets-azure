<script>
	/* -------------------------------------------------------------------------- */
	/*                                   Imports                                  */
	/* -------------------------------------------------------------------------- */

	import Title from '../../../lib/Title.svelte';
	import MontRoyal from '../../../lib/assets/boundaries/montrealboundaries/MontRoyal.svg';

	import EmpSizeLegend from '../../../lib/assets/employmentsizelegend.svg';

	import Summary from '../../../lib/Summary.svelte';

	import greenspace from '../../../lib/data/casestudydata/montreal-fr/montroyal/greenspace';
	import civicmix from '../../../lib/data/casestudydata/montreal-fr/montroyal/civicmix';
	import businessmix from '../../../lib/data/casestudydata/montreal-fr/montroyal/businessmix';
	import housingtype from '../../../lib/data/casestudydata/montreal-fr/montroyal/housingtype';
	import housingconstruction from '../../../lib/data/casestudydata/montreal-fr/montroyal/housingconstruction';
	import visitortraffic from '../../../lib/data/casestudydata/montreal-fr/montroyal/visitortraffic';
	import visitortypes from '../../../lib/data/casestudydata/montreal-fr/montroyal/visitortypes';
	import visitortimeofday from '../../../lib/data/casestudydata/montreal-fr/montroyal/visitortimeofday';
	import visitordayofweek from '../../../lib/data/casestudydata/montreal-fr/montroyal/visitordayofweek';

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
	<Title outline={MontRoyal} name={'Mont Royal (Plateau)'} location={'Montreal, Québec'} />
	<LanguageSelector eng={'/casestudies/montreal/montroyal'} fr={'/casestudies/montreal-fr/montroyal-fr'} selected='fr'/>
	<div class="container">
		<section data-id="map1">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Vue d’ensemble</h2>
					<p>L’avenue du Mont-Royal est une importante artère commerciale orientée est-ouest de l’arrondissement du Plateau-Mont-Royal à Montréal, au Québec. S’étendant au pied du Mont-Royal, la rue traverse l’arrondissement du Plateau-Mont-Royal de l’avenue du Parc à la rue Frontenac et offre une vue imprenable sur la montagne et le stade olympique. Cette étude de cas se concentre sur le tronçon de l’avenue du Mont-Royal situé entre les grandes artères nord-sud de la rue Saint-Denis et de la rue Papineau.</p><p>L’avenue du Mont-Royal est un centre d’activité commerciale très animé et est réputée pour son large éventail de boutiques, de restaurants et de bars. Depuis 2020, l’avenue Mont-Royal fait l’objet d’une piétonnisation de juin à septembre. Cette transformation crée une rue piétonne de 36 pâtés de maisons et entraîne un étalement de l’engagement commercial sur la rue, une valorisation de la programmation et de l’aménagement de l’espace public, ainsi qu’une augmentation du nombre de visites dans le quartier.</p>
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
							label={'Mont Royal'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clqzixl5o00sc01pid7d3hnjr'}
						center={[-73.5788, 45.5284]}
						zoom={13}
						pitch={50}
						bearing={0}
						layers={['mainstreets-montreal', 'montroyal', 'montroyal-fill']}
						section={'overview'}
					/>
				</div>
			</div>
		</section>
		<section data-id="map2">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Forme bâtie</h2>
					<p>La typologie des bâtiments de ce corridor à usage mixte reste relativement cohérente avec des immeubles de deux à trois étages, comprenant des commerces actifs au rez-de-chaussée et des logements résidentiels au-dessus. La zone résidentielle environnante se compose presque exclusivement de logements collectifs. L’ensemble de cette typologie de logements collectifs mixtes est représentatif du charme esthétique du quartier du Plateau-Mont-Royal.</p><p>La rue comporte une voie de circulation et un stationnement sur rue dans chaque direction, mais pas de piste cyclable. Plusieurs lignes d’autobus circulent sur l’avenue du Mont-Royal et des arrêts sont aménagés de part et d’autre de la rue. À l’extrémité sud-ouest du segment de rue se trouve la station de métro Mont-Royal, qui dessert la ligne orange du métro de Montréal.</p><p>Depuis 2020, l’avenue du Mont-Royal est piétonne en été et les piétons disposent de plus d’espace pour s’arrêter et s’attarder grâce à un mobilier urbain temporaire, des bancs et des tables. De nombreux commerces s’étendent sur les trottoirs et dans la rue grâce à des terrasses et des structures temporaires.</p>
				</div>
				<div class="map-container">
					<div class="legend-container">
						<LegendItem
							variant={'polygon'}
							label={'Rue Fleury'}
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
						<SatelliteCheckboxFr casestudy={'montroyal'} section={'builtform'} />
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clqzixl5o00sc01pid7d3hnjr'}
						center={[-73.5788, 45.5284]}
						zoom={15}
						minZoom={15}
						pitch={40}
						bearing={-15}
						layers={[
							'montroyal',
							'montroyal-fill',
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
								layer={'montroyal-isochrone'}
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
					<p>L’avenue du Mont-Royal se trouve à proximité de tous les types d’infrastructures municipales et de commodités. Il s’agit d’une zone bien desservie, accessible en moins de 10 minutes de marche à plusieurs commodités et infrastructures municipales clés. Celles-ci comprennent un certain nombre d’établissements de soins de santé, de services gouvernementaux et communautaires, et d’établissements d’enseignement.</p><p>La SDC du Mont-Royal et la piétonnisation estivale entraînent une quantité importante d’infrastructures temporaires et permanentes destinées à promouvoir la rue et à en faire un espace plus attrayant, accueillant et agréable pour les personnes résidant dans le quartier et les visiteurs. Tout au long de l’année, ces infrastructures comprennent des panneaux de signalisation pour la SDC, des peintures murales et d’autres installations artistiques, ainsi que des sièges permanents et des espaces pour s’attarder sur la place Gérald-Godin. Pendant les mois d’été, la rue se transforme pour mieux soutenir les locaux, les visiteurs et les entreprises environnantes, grâce à du mobilier urbain, des peintures murales et des œuvres d’art urbain supplémentaires, ainsi qu’à des jardinières et des jardins temporaires.</p><p>Selon l’indice des infrastructures municipales, l’avenue du Mont-Royal est en retard par rapport à la moitié des rues principales de Montréal. En matière d’opportunités civiques, l’avenue du Mont-Royal se situe au 12e rang des 20 rues principales de Montréal et au 26e rang des 36 rues principales résidentielles.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clqzixl5o00sc01pid7d3hnjr'}
						center={[-73.5788, 45.5284]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={[
							'montroyal',
							'montroyal-fill',
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
								layer={'montroyal-isochrone'}
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
					<p>L’avenue du Mont-Royal compte un nombre d’établissements de vente au détail, de services de restauration et débits de boissons supérieur à la moyenne de la RMR de Montréal, ce qui fait de ce corridor une destination commerciale importante. Les commerces du rez-de-chaussée débordent sur l’avenue et les magasins de détail présentent des portants remplis de vêtements et d’autres marchandises. De nombreux établissements commerciaux laissent leurs fenêtres et leurs portes ouvertes, atténuant ainsi la frontière entre l’intérieur et l’extérieur. De nombreux bars, restaurants et cafés incitent les locaux et les visiteurs à s’attarder sur les terrasses aménagées en plein air. La plupart des établissements sont gérés par des commerces indépendants, comme les favoris locaux Café Rico et Soleil de Saigon, mais quelques grandes chaînes, comme A&W et Subway, sont présentes. Cette forte vitalité commerciale se traduit par un très petit nombre de vitrines vacantes apparentes dans la rue.</p><p>Selon l’Indice des entreprises indépendantes, l’avenue du Mont-Royal accuse un retard par rapport aux autres études de cas de rues principales de Montréal en matière de niveau d’indépendance des entreprises, se classant 16e sur 20 rues principales de Montréal et 23e sur 36 rues principales résidentielles.</p><p>L’avenue du Mont-Royal a une densité commerciale élevée, se classant 4e sur 20 rues principales de Montréal et 2e sur 36 rues principales résidentielles.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clqzixl5o00sc01pid7d3hnjr'}
						center={[-73.5788, 45.5284]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={[
							'montroyal',
							'montroyal-fill',
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
					<p>L’avenue du Mont-Royal est une artère commerciale très animée. Par conséquent, la majorité des emplois le long de l’avenue du Mont-Royal se trouvent dans les entreprises environnantes et une proportion beaucoup plus faible au sein de l’infrastructure municipale. Cependant, ce profil d’emploi commence à changer lorsque l’on s’étend dans le quartier du Plateau qui entoure l’avenue du Mont-Royal. Dans les environs immédiats de la rue, le rôle de l’infrastructure municipale dans la création d’emplois devient de plus en plus important. Dans ces zones, un plus grand nombre de personnes travaillent dans l’infrastructure municipale.</p><p>Dans l’ensemble, l’avenue du Mont-Royal se classe en bonne position pour ce qui est de sa densité d’emploi, au 5e rang des 20 rues principales de Montréal et au 9e rang des 36 rues principales résidentielles.</p>
					<img id="employmentsizelegend" src={EmpSizeLegend} alt="legend" />
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clqzixl5o00sc01pid7d3hnjr'}
						center={[-73.5788, 45.5284]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['montroyal', 'montroyal-fill', 'employment-size']}
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
							casestudy={'montroyal'}
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
					<p>Plus de 60 % des logements situés autour de l’avenue du Mont-Royal ont été construits avant les années 1960, ce qui confère au quartier un caractère historique urbain peu élevé, mais dense. Les rues orientées nord-sud, perpendiculaires à l’avenue, sont similaires en matière d’échelle et d’esthétique et présentent principalement des formes d’habitation de type logement collectif de deux à trois étages, avec plusieurs grands immeubles d’appartements ne dépassant pas quatre étages. Ce type de logement collectif est représentatif du quartier environnant du Plateau. Par rapport à la zone, le secteur entourant l’avenue accueille un taux plus élevé de ménages locataires.</p><p>Les quartiers de Montréal comme celui-ci présentent les logements de type intermédiaires qui font défaut dans les autres grandes banlieues canadiennes.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clqzixl5o00sc01pid7d3hnjr'}
						center={[-73.5788, 45.5284]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['montroyal-outline', 'populationdensity']}
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
							casestudy={'montroyal'}
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
					<p>Cette section de l’avenue du Mont-Royal présente certaines caractéristiques importantes et appréciables. L’âge moyen des personnes résidant dans la rue est jeune, une grande partie du segment de la rue étant composée de personnes dans la trentaine avancée. La taille des ménages sur l’avenue du Mont-Royal est également relativement faible, ce qui est probablement le reflet de la jeunesse de la population et de la taille réduite du parc immobilier. En ce qui concerne les caractéristiques des personnes vivant sur l’avenue du Mont-Royal, la répartition entre personnes de langue anglaise et personnes de langue française est relativement similaire, et environ la moitié de la population est constituée d’immigrants récents. En outre, le revenu moyen des personnes vivant sur l’avenue du Mont-Royal est très élevé et environ 100 % des personnes qui y vivent sont titulaires d’un baccalauréat.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clqzixl5o00sc01pid7d3hnjr'}
						center={[-73.5788, 45.5284]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['montroyal-outline', 'average-age']}
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
					<p>En tant que grande rue commerciale, l’avenue du Mont-Royal connaît des niveaux de fréquentation relativement élevés. Toutefois, si l’on compare les niveaux de fréquentation actuels à ceux de 2019, on constate que le nombre de visiteurs dans la rue a considérablement diminué depuis la pandémie de COVID-19. Le rayon d’action des visiteurs a diminué de manière significative depuis la pandémie de COVID-19 en 2019. Cela signifie qu’actuellement, la plupart des visiteurs proviennent d’endroits plus rapprochés de la rue ou y résident. De même, en 2019, la majorité des visiteurs étaient des visiteurs peu fréquents, alors que lors du plus récent décompte, en 2022, la majorité des visiteurs étaient des personnes résidant sur l’avenue du Mont-Royal. Probablement en raison de la présence importante de commerces le long de la rue, la plupart des visites ont lieu entre 12 h et 18 h, pendant les heures d’ouverture habituelles. Bien que la majorité des visites aient lieu le jeudi, le vendredi et le samedi, la répartition est relativement égale sur l’ensemble de la semaine, ce qui montre que la rue et ses commerces sont fréquemment visités tout au long de la semaine.</p><p>Dans l’ensemble, en matière de résilience de la rue et de récupération des visiteurs, l’avenue du Mont-Royal est à la traîne par rapport aux autres études de cas de rues principales. Elle se classe au 10e rang sur 20 pour la résilience des visiteurs dans la région et au 26e rang sur 36 rues principales résidentielles.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clqzixl5o00sc01pid7d3hnjr'}
						center={[-73.5788, 45.5284]}
						zoom={9}
						pitch={0}
						bearing={-15}
						layers={['montroyal-outline', 'visitors-2022']}
						section={'visitors'}
						attribution={'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="legend-container">
						<Legend
							minlabel={'0'}
							maxlabel={'87,100'}
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
	<Summary name={'Mont Royal (Plateau)'} location={'Montreal, Québec'} />
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
