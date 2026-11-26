<script>
	/* -------------------------------------------------------------------------- */
	/*                                   Imports                                  */
	/* -------------------------------------------------------------------------- */

	import sutton from '../../../lib/assets/boundaries/torontoboundaries/Sutton.svg';
	import Title from '../../../lib/ui/Title.svelte';

	import EmpSizeLegend from '../../../lib/assets/employmentsizelegend.svg';
	import EmpSizeLegendFr from '../../../lib/assets/employmentsizelegend-fr.svg';

	import businessmix from '../../../lib/data/casestudydata/toronto/sutton/businessmix';
	import civicmix from '../../../lib/data/casestudydata/toronto/sutton/civicmix';
	import greenspace from '../../../lib/data/casestudydata/toronto/sutton/greenspace';
	import housingconstruction from '../../../lib/data/casestudydata/toronto/sutton/housingconstruction';
	import housingtype from '../../../lib/data/casestudydata/toronto/sutton/housingtype';
	import visitordayofweek from '../../../lib/data/casestudydata/toronto/sutton/visitordayofweek';
	import visitortimeofday from '../../../lib/data/casestudydata/toronto/sutton/visitortimeofday';
	import visitortraffic from '../../../lib/data/casestudydata/toronto/sutton/visitortraffic';
	import visitortypes from '../../../lib/data/casestudydata/toronto/sutton/visitortypes';

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
	<Title outline={sutton} name={'High Street (Sutton)'} location={'Toronto, Ontario'} />
	<div class="container">
		<section data-id="map1">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>{fr ? 'Vue d’ensemble' : 'Overview'}</h2>
					{#if fr}
						<p>
							Comptant environ 6 000 personnes résidentes, Sutton est une collectivité de
							banlieue située à seulement deux kilomètres au sud du lac Simcoe. Connue
							sous le nom de Village of Sutton jusqu’à sa fusion avec la ville de Georgina
							en 1971, Sutton fait partie de la municipalité régionale d’York. Sa
							proximité avec le lac Simcoe a fait de Sutton et de ses environs des
							destinations touristiques et de villégiature prisées. Sutton est bien
							desservie par York Region Transit (YRT), qui offre des services de transport
							collectif locaux, rapides et adaptés dans les neuf municipalités de la
							région d’York, ainsi que par le train GO, qui permet d’accéder facilement au
							centre-ville de Toronto.
						</p>
						<p>
							High St., située dans le centre-ville historique de Sutton, est la rue
							principale de la collectivité. Malgré une densité commerciale relativement
							faible, High St. bénéficie de la présence de la zone d’amélioration
							commerciale (BIA) Downtown Sutton, ce qui permet d’offrir aux personnes
							résidentes comme aux visiteurs une variété de commerces et d’expériences.
						</p>
					{:else}
						<p>
							With a population of approximately 6,000 residents, Sutton is a suburban community
							situated just two kilometers south of Lake Simcoe. Formerly known as the Village of
							Sutton until its amalgamation with the Town of Georgina in 1971, Sutton is located in
							the Regional Municipality of York. Its proximity to Lake Simcoe has made Sutton and its
							surrounding areas popular tourist and cottage destinations. Sutton is well-served by the
							York Region Transit (YRT), which provides local, rapid, and specialized transit services
							across all nine York Region municipalities, as well as by the GO train, offering
							convenient access to downtown Toronto.
						</p>
						<p>
							High St., situated in historic downtown Sutton, serves as the main street for the
							community. Despite having a relatively low business density, High St. benefits from the
							presence of the Downtown Sutton Business Improvement Area (BIA), offering residents and
							visitors alike a variety of commercial offerings and experiences.
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
							label={'Sutton BIA'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq5hw60o01a401quf34z533x'}
						center={[-79.358, 44.303]}
						zoom={14}
						pitch={50}
						bearing={0}
						layers={['mainstreets-toronto', 'sutton', 'sutton-fill']}
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
							High St. compte une voie de circulation et une voie de stationnement sur rue
							dans chaque direction, sans voie ni infrastructure cyclable désignée. Bien
							que la rue soit principalement axée sur l’usage automobile, sa largeur
							relativement étroite, combinée à une limite de vitesse maximale de 50 km/h
							et à la présence de feux de circulation, la rend plus propice aux
							déplacements à pied et à la mobilité active.
						</p>
						<p>
							La typologie des bâtiments le long de High St. est principalement de faible
							densité, composée de bâtiments d’un ou de deux étages, dont certains sont
							entièrement isolés, avec des locaux commerciaux au rez-de-chaussée.
							Toutefois, High St. et le secteur situé dans un rayon de 10 minutes de
							marche manquent nettement d’accès aux espaces verts. Cet écart est
							particulièrement manifeste lorsqu’on le compare au pourcentage moyen
							d’espaces verts dans la RMR de Toronto.
						</p>
					{:else}
						<p>
							High St. consists of one circulation lane and one on-street parking lane in each
							direction with no designated cycling lanes or infrastructure. Despite its primary focus
							on vehicular use, the street's relatively narrow width, combined with a maximum speed
							limit of 50 km/h and the presence of traffic lights, enhances its suitability for
							pedestrian and active mobility.
						</p>
						<p>
							The building typology along High St. is predominantly low-density, featuring one- and
							two-storey structures, some of which are fully-detached, with ground floor retail
							spaces. However, High St. and the surrounding area within a 10-minute walk are notably
							lacking in accessibility to green spaces. This disparity becomes particularly evident
							when compared to the average percentage of greenspace in the Toronto CMA.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<div class="legend-container">
						<LegendItem
							variant={'polygon'}
							label={'Sutton'}
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
						<SatelliteCheckbox casestudy={'sutton'} section={'builtform'} />
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq5hw60o01a401quf34z533x'}
						center={[-79.3587, 44.3039]}
						zoom={19}
						minZoom={15}
						pitch={60}
						bearing={-30}
						layers={[
							'sutton',
							'sutton-fill',
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
							<PhotosCheckbox section={'civicinfra'} layer={'civicinfra-photos'} />
							<IsochroneCheckbox
								section={'civicinfra'}
								layer={'sutton-isochrone'}
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
							On observe une concentration relative d’infrastructures civiques sur High
							St. et dans un rayon de 10 minutes de marche de la rue. La rue elle-même est
							bien desservie en services gouvernementaux, en services communautaires et en
							établissements de santé. En élargissant l’analyse à l’infrastructure civique
							accessible dans un rayon de 10 minutes de marche, on constate la présence
							d’établissements d’enseignement et d’équipements artistiques et culturels.
							De plus, la BIA Downtown Sutton soutient les entreprises locales situées sur
							High St. Cependant, l’accès aux installations récréatives est limité, tant
							pour High St. que pour ses résidents. Malgré cette absence d’installations
							récréatives formelles sur High St., la populaire foire annuelle Sutton Fair
							and Horse Show se tient juste au nord de High St. et attire visiteurs et
							résidents dans le secteur.
						</p>
						<p>
							Selon l’Indice d’infrastructure civique, High St. se situe dans la moyenne
							par rapport aux autres études de cas de rues principales. Sur le plan des
							possibilités civiques, High St. se classe au 9e rang sur 20 rues principales
							de Toronto et au 5e rang sur 12 rues principales de petites villes.
						</p>
					{:else}
						<p>
							There is a relative clustering of civic infrastructure on High St. and within a
							10-minute walking radius of the street. The street itself is well-served by government
							services, community services, and health facilities. Expanding this scope to include
							civic infrastructure accessible within a 10-minute walk reveals the availability of
							educational facilities and arts and culture amenities. Additionally, the Downtown Sutton
							BIA serves to support the local businesses situated on High St. However, access to
							recreational facilities is limited for both High St. and its residents. Despite this
							lack of formal recreational facilities on High St., the popular annual Sutton Fair and
							Horse Show is located just north of High St and draws visitors and residents to the
							area.
						</p>
						<p>
							According to the Civic Infrastructure Index, High St. ranks in the middle of the pack
							compared to other main street case studies. In terms of its civic opportunity, High St.
							ranks 9th out of 20 Toronto main streets and 5th out of 12 small town main streets.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq5hw60o01a401quf34z533x'}
						center={[-79.3587, 44.3039]}
						zoom={15}
						minZoom={13.3}
						pitch={0}
						bearing={-30}
						layers={[
							'sutton',
							'sutton-fill',
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
							<PhotosCheckbox section={'business'} layer={'business-photos'} />
							<IsochroneCheckbox
								section={'business'}
								layer={'sutton-isochrone'}
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
							La majorité des entreprises de High St. se trouvent à l’intérieur des
							limites de la BIA Downtown Sutton. Ces entreprises sont principalement des
							établissements de restauration et de boissons ainsi que des entreprises
							offrant divers services. Bien qu’ils soient moins nombreux, plusieurs
							commerces de détail sont tout de même présents sur High St. Sur Dalton Road,
							accessible depuis High St. en 10 minutes de marche, se trouve une autre
							concentration relative d’entreprises, dont une proportion plus importante de
							commerces de détail. La majorité des entreprises de la BIA Downtown Sutton
							et de High St. sont des restaurants, des boutiques et des services
							indépendants, qui offrent aux résidents et aux visiteurs du centre-ville de
							Sutton une expérience de magasinage de proximité.
						</p>
						<p>
							High St. surpasse de nombreuses autres études de cas de rues principales en
							ce qui concerne le niveau d’indépendance des entreprises, se classant au 4e
							rang sur 20 rues principales de Toronto et au 6e rang sur 12 rues
							principales de petites villes.
						</p>
						<p>
							Toutefois, sur le plan de la densité commerciale, la rue se classe au 12e
							rang dans la région et au 10e rang sur les 12 rues principales de petites
							villes.
						</p>
					{:else}
						<p>
							The majority of businesses on High St. are located within the Downtown Sutton BIA
							boundaries. These businesses are primarily comprised of food and drink establishments
							and businesses offering various services. While not as prevalent, High St. does still
							feature several retail businesses. On the nearby Dalton Road, accessible to High St.
							within a 10-minute walk, is another relative cluster of businesses, including a more
							significant percentage of retail establishments. The majority of the businesses in the
							Downtown Sutton BIA and on High St. are independently owned restaurants, shops, and
							services, offering residents and visitors of downtown Sutton a localized shopping
							experience.
						</p>
						<p>
							High St. surpasses many other main street case studies in terms of its businesses level
							of independence, ranking 4th out of 20 Toronto main streets and 6th out 12 small town
							main streets.
						</p>
						<p>
							However, in terms of business density, the street ranks 12th in the region and 10th out
							of the 12 small town main streets.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq5hw60o01a401quf34z533x'}
						center={[-79.3587, 44.3039]}
						zoom={15}
						minZoom={13.3}
						pitch={0}
						bearing={-30}
						layers={[
							'sutton',
							'sutton-fill',
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
							High St. accueille principalement de petites entreprises indépendantes. En
							conséquence, la plupart des employeurs de High St. comptent entre zéro et
							cinq employés. Si la majorité des emplois se concentrent dans les
							entreprises de la rue, on trouve aussi quelques emplois à petite échelle
							dans l’infrastructure civique. Dans les environs plus larges, notamment le
							long de Dalton Road, on trouve des employeurs plus importants et davantage
							d’emplois dans l’infrastructure civique. Au regard de l’ensemble du paysage
							de l’emploi à Sutton, High St. et ses environs apparaissent comme des pôles
							essentiels de l’emploi local.
						</p>
						<p>
							Toutefois, sur le plan de la densité d’emploi globale, High St. affiche une
							densité d’emploi inférieure à celle de la plupart des autres études de cas
							de rues principales. La rue se classe au 18e rang sur 20 rues principales de
							Toronto pour la densité d’emploi et au 9e rang sur 12 rues principales de
							petites villes.
						</p>
					{:else}
						<p>
							High St. predominantly hosts small, independent businesses. Reflecting this, most
							employers on High St. employ between zero to five individuals. While the bulk of
							employment opportunities are concentrated within the street's businesses, there's also
							some small-scale employment within civic infrastructure. In the broader vicinity,
							especially along Dalton Road, larger employers and more opportunities within civic
							infrastructure can be found. Looking at Sutton's employment landscape as a whole, High
							St. and its surrounding area emerge as crucial hubs for local employment.
						</p>
						<p>
							However, in terms of overall employment density, High St. has a lower employment density
							than most other main street case studies. The street ranks 18th out of 20 Toronto main
							streets in terms of employment density and 9th out of 12 small town main streets.
						</p>
					{/if}

					<img id="employmentsizelegend" src={fr ? EmpSizeLegendFr : EmpSizeLegend} alt={fr ? 'Légende' : 'Legend'} />
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq5hw60o01a401quf34z533x'}
						center={[-79.3587, 44.3039]}
						zoom={15}
						minZoom={13.3}
						pitch={0}
						bearing={-30}
						layers={['sutton', 'sutton-fill', 'employment-size']}
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
							casestudy={'sutton'}
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
						<PhotosCheckbox section={'housing'} layer={'housing-photos'} />
					</div>
					{#if fr}
						<p>
							Sutton est une petite collectivité de banlieue; sa densité de population est
							donc très faible. Toutefois, High St. et ses abords présentent une densité
							de population plus élevée que le reste de Sutton. Cela s’explique par la
							présence, sur High St., d’immeubles d’appartements de moins de cinq étages
							que l’on ne retrouve nulle part ailleurs dans les environs. Hormis cette
							présence limitée d’immeubles d’appartements de faible hauteur sur High St.,
							la grande majorité des autres logements sont des maisons individuelles non
							attenantes.
						</p>
						<p>
							Le parc de logements est ancien, puisqu’environ 50 % de tous les logements
							ont été construits avant 1960. Quelques nouveaux logements ont été
							construits au cours des années suivantes, mais pratiquement aucun nouveau
							logement n’a été construit depuis 2000.
						</p>
					{:else}
						<p>
							Sutton is a small suburban community and as a result it has a very low population
							density. However, High St. and the areas around it do have a higher population density
							than the rest of Sutton. This is representative of the presence of low-rise apartment
							buildings of under five-stories that are present on High St. but nowhere else in the
							vicinity. Besides this limited presence of low-rise apartments on High St., the vast
							majority of the remaining housing is in single-detached dwellings.
						</p>
						<p>
							The housing stock itself is old as approximately 50-percent of all housing was built
							before 1960. The years following saw some new housing being built, but since 2000
							virtually no new housing has been built.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq5hw60o01a401quf34z533x'}
						center={[-79.3587, 44.3039]}
						zoom={15}
						minZoom={13.3}
						pitch={0}
						bearing={-30}
						layers={['sutton-outline', 'populationdensity']}
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
							casestudy={'sutton'}
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
							Ce tronçon de High St. offre un aperçu du paysage démographique de Sutton et
							reflète la combinaison d’immigrants récents, de population autochtone, de
							personnes parlant anglais et français et de titulaires d’un baccalauréat que
							l’on retrouve dans l’ensemble de la ville. On observe toutefois de légères
							différences entre les résidents de High St. et ceux du reste de Sutton.
							L’âge moyen sur High St. et dans ses environs a tendance à être légèrement
							plus élevé, sans l’être de façon marquée. De plus, les ménages situés le
							long de High St. et dans ses environs immédiats sont généralement plus
							petits, en particulier par rapport aux secteurs situés au sud, à l’ouest et
							à l’est de la rue.
						</p>
						<p>
							Fait intéressant, High St. constitue une ligne de partage économique, les
							secteurs situés au nord et au nord-ouest affichant généralement des revenus
							moyens plus élevés que ceux situés au sud. Enfin, bien que Sutton dans son
							ensemble compte un faible pourcentage de minorités visibles, ce tronçon de
							High St. et le secteur voisin au sud-ouest comptent une population de
							minorités visibles légèrement plus importante, quoique encore relativement
							faible.
						</p>
					{:else}
						<p>
							This segment of High St. provides a snapshot of Sutton's demographic landscape,
							reflecting the mix of recent immigrants, Indigenous population, English and French
							speakers, and individuals with bachelor’s degrees found throughout the town. However,
							there are minor differences between High St. residents and those in wider Sutton. The
							average age in and around High St. tends to be slightly higher, though not markedly so.
							Additionally, households along High St. and its immediate vicinity are typically
							smaller, particularly when compared to areas south, west, and east of the street.
						</p>
						<p>
							Interestingly, High St. serves as an economic divide, with areas to the north and
							northwest generally boasting higher average incomes than those to the south. Lastly,
							while Sutton as a whole has a low percentage of visible minorities, this specific
							section of High St. and the nearby southwest area have a slightly larger visible
							minority population, although still relatively small.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq5hw60o01a401quf34z533x'}
						center={[-79.3587, 44.3039]}
						zoom={15}
						minZoom={13.3}
						pitch={0}
						bearing={-30}
						layers={['sutton-outline', 'average-age']}
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
							High St. connaît un regain de visites depuis le début de la pandémie de
							COVID-19, ce qui souligne son importance en tant que rue principale et
							destination clé de la région de Sutton. Alors que de nombreuses rues
							principales au pays peinent à retrouver leur niveau de visites d’avant la
							pandémie, High St. a connu une croissance notable de sa fréquentation.
							Actuellement, le taux de visites atteint environ 125 % par rapport à 2019,
							ce qui représente une hausse de 25 % de la fréquentation depuis.
						</p>
						<p>
							Fait important, cette reprise et cette croissance des visites s’observent
							chez tous les types de visiteurs (résidents, visiteurs occasionnels et
							visiteurs fréquents), la plupart ayant atteint les niveaux de 2019.
						</p>
						<p>
							La majorité des visites sur High St. ont lieu en journée, entre 9 h et 18 h,
							et principalement en semaine, du mardi au vendredi.
						</p>
						<p>
							Par conséquent, High St. se classe au 1er rang pour la résilience globale de
							la rue et la reprise des visites parmi les 20 rues principales de Toronto,
							et au 2e rang sur 12 rues principales de petites villes.
						</p>
					{:else}
						<p>
							High St. has experienced a resurgence in visitors since the onset of the COVID-19
							pandemic, underscoring its significance as a key main street and destination within the
							Sutton area. While many main streets nationwide are grappling with a slow return to
							pre-pandemic visitor levels, High St. has witnessed notable growth in visitation.
							Currently, the rate of visits is approximately 125% compared to 2019, indicating a 25%
							increase in visitation since that time.
						</p>
						<p>
							Importantly, this recovery and growth in visits is consistent across all visitor types -
							residents, infrequent visitors, and frequent visitors - with most reaching 2019 levels.
						</p>
						<p>
							The majority of visits to High St. occur during daytime hours, between 9 am and 6 pm,
							and predominantly on weekdays from Tuesday to Friday.
						</p>
						<p>
							As a result, High St. ranks 1st overall in terms of its overall street resilience and
							visitor recovery among all 20 Toronto main streets and 2nd out of 12 small town main
							streets.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq5hw60o01a401quf34z533x'}
						center={[-79.3587, 44.3039]}
						zoom={9}
						pitch={0}
						bearing={-15}
						layers={['sutton-outline', 'visitors-2022']}
						section={'visitors'}
						attribution={fr ? 'Institut urbain du Canada | Source des données : Environics Analytics' : 'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="legend-container">
						<Legend
							minlabel={'0'}
							maxlabel={fr ? '34 700' : '34,700'}
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
