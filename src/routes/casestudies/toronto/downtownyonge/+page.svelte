<script>
	/* -------------------------------------------------------------------------- */
	/*                                   Imports                                  */
	/* -------------------------------------------------------------------------- */

	import downtownyonge from '../../../lib/assets/boundaries/torontoboundaries/DowntownYonge.svg';
	import Title from '../../../lib/ui/Title.svelte';

	import EmpSizeLegend from '../../../lib/assets/employmentsizelegend.svg';
	import EmpSizeLegendFr from '../../../lib/assets/employmentsizelegend-fr.svg';

	import businessmix from '../../../lib/data/casestudydata/toronto/downtownyonge/businessmix';
	import civicmix from '../../../lib/data/casestudydata/toronto/downtownyonge/civicmix';
	import greenspace from '../../../lib/data/casestudydata/toronto/downtownyonge/greenspace';
	import housingconstruction from '../../../lib/data/casestudydata/toronto/downtownyonge/housingconstruction';
	import housingtype from '../../../lib/data/casestudydata/toronto/downtownyonge/housingtype';
	import visitordayofweek from '../../../lib/data/casestudydata/toronto/downtownyonge/visitordayofweek';
	import visitortimeofday from '../../../lib/data/casestudydata/toronto/downtownyonge/visitortimeofday';
	import visitortraffic from '../../../lib/data/casestudydata/toronto/downtownyonge/visitortraffic';
	import visitortypes from '../../../lib/data/casestudydata/toronto/downtownyonge/visitortypes';

	import { browser } from '$app/environment';
	import { timeFormat } from 'd3-time-format';
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
	import mapboxgl from 'mapbox-gl';
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
	<Title outline={downtownyonge} name={'Downtown Yonge'} location={'Toronto, Ontario'} />
	<div class="container">
		<section data-id="map1">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>{fr ? 'Vue d’ensemble' : 'Overview'}</h2>
					{#if fr}
						<p>
							Yonge Street a d’abord été arpentée en 1796 comme voie de transport nord-sud
							entre la ville de York et le lac Simcoe. Certaines portions de Yonge Street
							chevauchent un ancien réseau de sentiers autochtones.
						</p>
						<p>
							Après la constitution de Toronto en municipalité en 1834, Yonge est devenue
							une artère commerciale importante. Surnommée « la rue principale de
							Toronto », Yonge continue de jouer un rôle essentiel dans la croissance et
							le développement de Toronto et de la région du Grand Toronto.
						</p>
						<p>
							La zone à l’étude de Downtown Yonge s’étend de Richmond St W, au sud,
							jusqu’à Grosvenor St, au nord, et est délimitée par Bay St à l’ouest et par
							la Toronto Metropolitan University (TMU) à l’est. Downtown Yonge se trouve
							juste au nord du quartier financier de Toronto et à l’ouest de l’hôtel de
							ville.
						</p>
					{:else}
						<p>
							Yonge Street was originally surveyed as a north-south transportation route between the
							Town of York and Lake Simcoe in 1796. Portions of Yonge Street overlap with an ancient
							Indigenous trail system.
						</p>
						<p>
							After Toronto was incorporated in 1834, Yonge emerged as a key commercial street. Known
							as "Toronto's Main Street", Yonge continues to play a vital role in the growth and
							development of Toronto and the Greater Toronto Area.
						</p>
						<p>
							The Downtown Yonge study area extends from Richmond St W in the south to Grosvenor St in
							the north, and is bound by Bay St to the west and Toronto Metropolitan University (TMU)
							to the east. Downtown Younge sits just north of Toronto's Financial District and west of
							City Hall.
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
							label={'Downtown Yonge BIA'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq2jlg0p015z01p6dj1caevl'}
						center={[-79.3814, 43.6573]}
						zoom={13}
						pitch={50}
						bearing={0}
						layers={['mainstreets-toronto', 'downtownyonge', 'downtownyonge-fill']}
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
							En raison de la longue histoire de Yonge Street en tant que cœur de Toronto,
							on trouve une grande diversité de styles architecturaux et de formes bâties
							dans Downtown Yonge. À bien des égards, le centre commercial Eaton Centre
							domine le secteur, surtout entre Dundas et Queen. Des bâtiments commerciaux
							de plus petite échelle bordent la rue, mais les grands complexes commerciaux
							et les tours de grande hauteur y occupent une place plus importante.
						</p>
						<p>
							La ligne 1 de la TTC passe sous Yonge Street et relie Downtown Yonge à Union
							Station au sud et au Vaughan Metropolitan Centre au nord. Plusieurs grandes
							lignes de tramway traversent également la zone à l’étude d’est en ouest, ce
							qui en fait un milieu très bien desservi par le transport collectif.
						</p>
						<p>
							La rue elle-même compte quatre voies et des trottoirs modestes, souvent
							bondés de piétons pendant les périodes achalandées. Pour y remédier, le
							Yonge Love Action Plan de la BIA locale propose une refonte importante du
							paysage de rue afin de piétonniser le corridor, parmi d’autres initiatives
							visant à dynamiser le secteur.
						</p>
					{:else}
						<p>
							Due to Yonge Street's long history as the heart of Toronto, there is a diverse and wide
							range of architectural styles and building forms throughout Downtown Yonge. In many
							ways, the Eaton Centre shopping mall dominates the area, especially between Dundas and
							Queen. Smaller-scale commercial buildings exist along the street, but large retail
							complexes and high-rise towers are more prominent.
						</p>
						<p>
							The TTC's Line 1 runs under Yonge Street, connecting Downtown Yonge to Union Station in
							the south and Vaughan Metropolitan Centre to the north. Several major streetcar lines
							also run east-west through the study area facilitating a transit rich environment.
						</p>
						<p>
							The street itself is four lanes wide with modest sidewalks that are often packed with
							pedestrians during busy periods. In response, the local BIA's Yonge Love Action Plan
							proposes a significant overhaul of the streetscape to pedestrianize the corridor among
							other vibrancy initiatives.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<div class="legend-container">
						<LegendItem
							variant={'polygon'}
							label={'Downtown Yonge BIA'}
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
						<PhotosCheckbox section={'builtform'} />
						<SatelliteCheckbox casestudy={'downtownyonge'} section={'builtform'} />
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq2jlg0p015z01p6dj1caevl'}
						center={[-79.38, 43.6561]}
						zoom={15}
						minZoom={15}
						pitch={40}
						bearing={-15}
						layers={[
							'downtownyonge',
							'downtownyonge-fill',
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
							id={'civicinfra-toronto-arts-culture'}
							section={'civicinfra'}
						/>
						<LegendItem
							variant={'circle'}
							label={fr ? 'Services gouvernementaux et communautaires' : 'Government and Community Services'}
							bgcolor={'#8A4285'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-toronto-govt-community'}
							section={'civicinfra'}
						/>
						<LegendItem
							variant={'circle'}
							label={fr ? 'Loisirs' : 'Recreation'}
							bgcolor={'#43B171'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-toronto-recreation'}
							section={'civicinfra'}
						/>
						<LegendItem
							variant={'circle'}
							label={fr ? 'Santé' : 'Healthcare'}
							bgcolor={'#33AED7'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-toronto-health'}
							section={'civicinfra'}
						/>
						<LegendItem
							variant={'circle'}
							label={fr ? 'Éducation' : 'Education'}
							bgcolor={'#F45D01'}
							bordercolor={'#fff'}
							button={true}
							id={'civicinfra-toronto-education'}
							section={'civicinfra'}
						/>
						<div class="checkbox">
							<PhotosCheckbox section={'civicinfra'} />
							<IsochroneCheckbox
								section={'civicinfra'}
								layer={'downtownyonge-isochrone'}
								minZoom={13}
								maxZoom={13.3}
							/>
							<EmploymentSizeCheckbox
								section={'civicinfra'}
								layers={[
									'civicinfra-toronto-education',
									'civicinfra-toronto-govt-community',
									'civicinfra-toronto-arts-culture',
									'civicinfra-toronto-health',
									'civicinfra-toronto-recreation'
								]}
								minZoom={13}
								maxZoom={13.3}
							/>
						</div>
					</div>
					{#if fr}
						<p>
							La zone à l’étude de Downtown Yonge correspond aux limites de la zone
							d’amélioration commerciale (BIA) de Downtown Yonge. La BIA a mené des
							initiatives d’embellissement, notamment des poteaux de rue à l’image du
							secteur, des bannières, des jardinières, des lumières des Fêtes, des
							plantations d’arbres et des améliorations aux trottoirs.
						</p>
						<p>
							Yonge-Dundas Square sert de point de rassemblement pour la communauté du
							centre-ville de Toronto. Cet ancien stationnement transformé en place
							publique relie l’Eaton Centre à la TMU et offre un lieu de repos, avec des
							tables et des chaises installées pendant les mois plus chauds. La scène
							extérieure et la place sont réservées pour des événements tout au long de
							l’année.
						</p>
						<p>
							Le Sheldon & Tracy Levy Student Learning Centre, à l’angle de Yonge et de
							Gould, ouvert à la population étudiante de la TMU en 2015, sert de porte
							d’entrée au campus de la TMU.
						</p>
						<p>
							Selon l’Indice d’infrastructure civique, Downtown Yonge se classe au 1er
							rang sur 20 études de cas de Toronto en matière de possibilités civiques.
							Par rapport aux autres rues principales de centres-villes, Downtown Yonge se
							classe 7e sur 12.
						</p>
					{:else}
						<p>
							The Downtown Yonge study area is based on the boundaries of the Downtown Yonge BIA. The
							BIA has spearheaded beautification initiatives including branded street poles, banners,
							planters, holiday lights, tree plantings, and sidewalk improvements.
						</p>
						<p>
							Yonge-Dundas Square serves as a focal point for the downtown Toronto community. The
							former parking lot turned public plaza connects the Eaton Centre to TMU and provides a
							place for rest with tables and chairs out during warmer months. The outdoor stage and
							plaza are booked for events all year round.
						</p>
						<p>
							The Sheldon & Tracy Levy Student Learning Centre at Yonge and Gould, first opened to TMU
							students in 2015, serves as a gateway into the TMU campus.
						</p>
						<p>
							According to the Civic Infrastructure Index, Downtown Yonge ranks 1st out of 20 Toronto
							case studies in terms of its civic opportunity. Compared to other downtown main streets,
							Downtown Yonge ranks 7th out of the 12 downtown main streets.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq2jlg0p015z01p6dj1caevl'}
						center={[-79.38, 43.6575]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={[
							'downtownyonge',
							'downtownyonge-fill',
							'civicinfra-toronto-education',
							'civicinfra-toronto-govt-community',
							'civicinfra-toronto-health',
							'civicinfra-toronto-arts-culture',
							'civicinfra-toronto-recreation'
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
							id={'business-toronto-retail'}
							section={'business'}
						/>
						<LegendItem
							variant={'circle'}
							label={fr ? 'Services de proximité' : 'Local Services'}
							bgcolor={'#2a5cac'}
							bordercolor={'#fff'}
							button={true}
							id={'business-toronto-services'}
							section={'business'}
						/>
						<LegendItem
							variant={'circle'}
							label={fr ? 'Restauration et boissons' : 'Food and Drink'}
							bgcolor={'#43b171'}
							bordercolor={'#fff'}
							button={true}
							id={'business-toronto-food-drink'}
							section={'business'}
						/>
						<div class="checkbox">
							<PhotosCheckbox section={'business'} />
							<IsochroneCheckbox
								section={'business'}
								layer={'downtownyonge-isochrone'}
								minZoom={13}
								maxZoom={13.3}
							/>
							<EmploymentSizeCheckbox
								section={'business'}
								layers={[
									'business-toronto-retail',
									'business-toronto-services',
									'business-toronto-food-drink'
								]}
								minZoom={13}
								maxZoom={13.3}
							/>
						</div>
					</div>
					{#if fr}
						<p>
							Downtown Yonge fait partie du grand centre-ville, un secteur où la densité
							d’emploi est considérable. Downtown Yonge se classe 1er sur 20 rues
							principales de Toronto pour la densité commerciale, et 4e sur 12 rues
							principales de centres-villes. On y trouve de petites entreprises orientées
							vers Yonge Street dans des bâtiments historiques de faible hauteur, ainsi
							que des entreprises de moyenne et de grande taille dans des complexes
							commerciaux et des tours de bureaux de grande hauteur.
						</p>
						<p>
							Selon l’Indice des entreprises indépendantes, Downtown Yonge se classe 18e
							sur 20 rues principales de Toronto et au dernier rang des 12 rues
							principales de centres-villes.
						</p>
					{:else}
						<p>
							Downtown Yonge is part of the larger downtown core, an area of immense employment
							density. Downtown Yonge ranks 1st of 20 Toronto Main Streets for business density, and
							4th out of 12 Downtown Main Streets. There are small businesses oriented toward Yonge
							Street itself in low-rise, historical buildings, and medium to large businesses in
							retail complexes and high-rise office towers.
						</p>
						<p>
							According to the Independent Business Index, Downtown Yonge ranks 18th out of 20 Toronto
							Main Streets and last out of 12 Downtown Main Streets.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq2jlg0p015z01p6dj1caevl'}
						center={[-79.38, 43.6575]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={[
							'downtownyonge',
							'downtownyonge-fill',
							'business-toronto-retail',
							'business-toronto-food-drink',
							'business-toronto-services'
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
							Faisant partie d’un centre-ville qui présente la plus forte concentration
							d’emplois au Canada, Downtown Yonge offre des possibilités d’emploi sur la
							rue et dans ses environs. La taille de ces employeurs varie, des petites
							entreprises de moins de cinq employés aux grands employeurs de plus de 100
							employés. De plus, les types d’employeurs sont relativement variés, puisque
							les emplois se trouvent à la fois dans l’infrastructure civique, dans les
							entreprises et dans d’autres types d’organisations. Par conséquent, Downtown
							Yonge se classe au 1er rang pour la densité d’emploi parmi les 20 rues
							principales de Toronto et les 12 rues principales de centres-villes.
						</p>
					{:else}
						<p>
							As part of a downtown core with the densest concentration of employment in Canada, there
							is employment opportunities on and around Downtown Yonge. These employers range in size
							- from small scale businesses employing under five employees to large scale employers
							with over 100 employees. Additionally, there is relative mix in the type of employers,
							as employment is located in both civic infrastructure and businesses as well as other
							types of enterprises. As a result, Downtown Yonge ranks first in employment density for
							all 20 Toronto Main Streets and 12 Downtown Main Streets.
						</p>
					{/if}

					<img id="employmentsizelegend" src={fr ? EmpSizeLegendFr : EmpSizeLegend} alt={fr ? 'Légende' : 'Legend'} />
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq2jlg0p015z01p6dj1caevl'}
						center={[-79.38, 43.6575]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['downtownyonge', 'downtownyonge-fill', 'employment-size']}
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
							casestudy={'downtownyonge'}
							section={'housing'}
							region={'toronto'}
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
						<PhotosCheckbox section={'housing'} />
					</div>
					{#if fr}
						<p>
							Comme le secteur fait partie d’un centre-ville densifié, toutes les
							personnes résidentes de Downtown Yonge habitent dans des immeubles
							d’appartements de grande hauteur. Tirant parti de la proximité des stations
							de métro de la ligne 1, des tours résidentielles, souvent construites sur
							des basilaires à usage mixte, ont été érigées le long de Yonge et des rues
							adjacentes.
						</p>
						<p>
							Reflet du récent boom des copropriétés au centre-ville de Toronto, plus de
							25 % des logements de la zone à l’étude ont été construits entre 2016 et
							2021.
						</p>
					{:else}
						<p>
							As part of an intensified downtown core, the residents of Downtown Yonge are all housed
							in high-rise apartments. Taking advantage of close proximity to Line 1 subway stations,
							residential towers, often above mixed-use podiums, have been erected along Yonge and
							adjacent streets.
						</p>
						<p>
							Reflective of the recent condo boom in downtown Toronto, more than 25% of housing in the
							study area was constructed between 2016 and 2021.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq2jlg0p015z01p6dj1caevl'}
						center={[-79.38, 43.6575]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['downtownyonge-outline', 'populationdensity']}
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
							casestudy={'downtownyonge'}
							section={'demographics'}
							region={'toronto'}
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
							La zone à l’étude de Downtown Yonge compte une population résidente
							diversifiée : 53 % des personnes sont issues d’une immigration récente et
							53 % appartiennent à une minorité visible. Dans l’un des centres-villes les
							plus prisés au Canada, où les loyers sont élevés en conséquence, le revenu
							annuel moyen d’emploi individuel à temps plein des personnes résidant dans
							la zone à l’étude s’élève à 98 428 $.
						</p>
					{:else}
						<p>
							The Downtown Yonge study area has a diverse residential population, with 53% being
							recent immigrants and 53% being visible minorities. Living in one of the most sought
							after downtowns in Canada with high rents to match, the average individual full time
							annual employment income of residents in the study area is $98,428.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq2jlg0p015z01p6dj1caevl'}
						center={[-79.38, 43.6575]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['downtownyonge-outline', 'average-age']}
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
							Comme Downtown Yonge se situe au cœur de Toronto et attire des travailleurs,
							des étudiants, des touristes et des résidents de la région à la recherche de
							divertissement, il n’est pas surprenant de constater que la zone à l’étude
							attire plus de personnes visiteuses que toute autre.
						</p>
						<p>
							Bien qu’elle ait enregistré 20 millions de visites de moins qu’en 2019, la
							zone a tout de même attiré plus de 30 millions de visites en 2022.
						</p>
						<p>
							Toutefois, la trop grande dépendance de Downtown Yonge envers les visiteurs
							occasionnels lui vaut un faible score de résilience : la zone se classe 18e
							sur 20 rues principales de Toronto et en milieu de peloton, au 6e rang sur
							12 rues principales de centres-villes.
						</p>
					{:else}
						<p>
							As Downtown Yonge is situated in the heart of Toronto, drawing workers, students,
							tourists, and regional residents looking for entertainment, it's not surprised to see
							that the study area draws more visitors than any other.
						</p>
						<p>
							Despite seeing 20 million less visits than the relative 2019 count, the area still
							attracted over 30 million visits 2022.
						</p>
						<p>
							But Downtown Yonge's over reliance on infrequent visitors resulted in a low Resiliency
							Score, ranking 18th of 20 Toronto Main Streets and in the middle at 6th of 12 Downtown
							Main Streets.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq2jlg0p015z01p6dj1caevl'}
						center={[-79.417, 43.6441]}
						zoom={9}
						pitch={0}
						bearing={-15}
						layers={['downtownyonge-outline', 'visitors-2022']}
						section={'visitors'}
						attribution={fr ? 'Institut urbain du Canada | Source des données : Environics Analytics' : 'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="legend-container">
						<Legend
							minlabel={'0'}
							maxlabel={fr ? '293 000' : '293,000'}
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
