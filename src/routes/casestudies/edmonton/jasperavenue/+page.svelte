<script>
	/* -------------------------------------------------------------------------- */
	/*                                   Imports                                  */
	/* -------------------------------------------------------------------------- */

	import JasperAvenue from '../../../lib/assets/boundaries/edmontonboundaries/JasperAve.svg';
	import Title from '../../../lib/ui/Title.svelte';

	import EmpSizeLegend from '../../../lib/assets/employmentsizelegend.svg';
	import EmpSizeLegendFr from '../../../lib/assets/employmentsizelegend-fr.svg';

	import businessmix from '../../../lib/data/casestudydata/edmonton/jasperavenue/businessmix';
	import civicmix from '../../../lib/data/casestudydata/edmonton/jasperavenue/civicmix';
	import greenspace from '../../../lib/data/casestudydata/edmonton/jasperavenue/greenspace';
	import housingconstruction from '../../../lib/data/casestudydata/edmonton/jasperavenue/housingconstruction';
	import housingtype from '../../../lib/data/casestudydata/edmonton/jasperavenue/housingtype';
	import visitordayofweek from '../../../lib/data/casestudydata/edmonton/jasperavenue/visitordayofweek';
	import visitortimeofday from '../../../lib/data/casestudydata/edmonton/jasperavenue/visitortimeofday';
	import visitortraffic from '../../../lib/data/casestudydata/edmonton/jasperavenue/visitortraffic';
	import visitortypes from '../../../lib/data/casestudydata/edmonton/jasperavenue/visitortypes';

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
	<Title outline={JasperAvenue} name={'Jasper Avenue'} location={'Edmonton, Alberta'} />
	<div class="container">
		<section data-id="map1">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>{fr ? 'Vue d’ensemble' : 'Overview'}</h2>
					{#if fr}
						<p>
							Jasper Avenue est considérée comme <i>la</i> rue principale d’Edmonton. Lieu
							de magasinage, de restauration et de divertissement, Jasper Avenue
							correspond techniquement à la 101 Avenue NW, mais elle fait partie des rares
							rues de la ville désignées principalement par leur nom. La rue est orientée
							est-ouest et se trouve au nord de la rivière Saskatchewan Nord, au cœur du
							centre-ville d’Edmonton.
						</p>
						<p>
							Jasper Avenue est la rue commerçante d’Edmonton depuis 1871. En raison de sa
							longue histoire, on y trouve des bâtiments d’âges et de styles
							architecturaux variés. Par exemple, le Jasper Block est l’un des plus
							anciens bâtiments du XXe siècle encore debout au centre-ville. Il côtoie des
							tours, des bâtiments modernes et des propriétés patrimoniales. L’Alberta
							Block, construit en 1909, a été rénové en 2016. Jasper Avenue sert de
							corridor pour les véhicules, le transport collectif et les piétons, en plus
							d’accueillir de nombreux restaurants et des entreprises nées à Edmonton et
							établies de longue date.
						</p>
					{:else}
						<p>
							Jasper Avenue is considered to be <i>the</i> main street of Edmonton. A locale for shopping,
							dining, and entertainment, Jasper is technically 101 Avenue NW but is one of the select few
							streets in the city predominantly referred to by its name. The street runs east-west and
							sits north of the North Saskatchewan River in the centre of downtown Edmonton.
						</p>
						<p>
							Jasper has been Edmonton's commercial street since 1871. Due to the long history of this
							street, there is a mix of building ages and architectural styles. For example, the
							Jasper Block is one of the oldest standing 20th century buildings downtown. This Block
							sits among a backdrop of high-rises, modern buildings, and heritage properties. The
							Alberta Block, built in 1909, underwent a renovation in 2016. Jasper Avenue acts as a
							vehicle, transit, and pedestrian corridor as well as the home to many restaurants and
							long-time made in Edmonton businesses.
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
							label={'Jasper Avenue'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9pse0i004701nsefzddeiw'}
						center={[-113.502, 53.54]}
						zoom={13}
						pitch={50}
						bearing={0}
						layers={['mainstreets-edmonton', 'jasperavenue', 'jasperavenue-fill']}
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
							Jasper Avenue traverse directement le centre-ville d’Edmonton, et son cadre
							bâti est typique d’un quartier central des affaires nord-américain, avec un
							mélange de bâtiments de grande et de faible hauteur dans une configuration
							relativement dense. La circulation y est importante. La rue est utilisée par
							tous les modes de transport, et les rues parallèles, la 102 Avenue et la 100
							Avenue, sont dotées de pistes cyclables réservées. Elle compte six voies de
							circulation et de larges trottoirs des deux côtés. Une traverse piétonne
							multidirectionnelle se trouve à l’intersection de la 104 Street NW et de
							Jasper Avenue. En regardant vers le nord le long de la 108, de la 107 ou de
							la 106 Street, on aperçoit l’alignement des tours de la MacEwan University.
						</p>
						<p>
							La ligne Valley Line du SLR, la plus ancienne ligne de train de transport
							collectif en service de la ville, circule sous terre parallèlement à Jasper
							Avenue. Deux stations, Corona et Bay/Enterprise Square, se trouvent dans la
							zone étudiée et comptent au total neuf entrées donnant accès au train.
						</p>
					{:else}
						<p>
							Jasper Avenue runs directly across Edmonton's downtown and the built form is typical of
							a North American central business district with a mix of high and low-rise buildings in
							a relatively dense configuration. A significant amount of traffic can be seen on Jasper.
							The street is used by all modes of transportation and the parallel streets of 102 and
							100 Avenues features dedicated bike lanes. There are six lanes of traffic with wide
							sidewalks on either side. There is one scramble crosswalk at the intersection between
							104 Street NW and Jasper Avenue. If one looks norths along 108, 107, or 106 Streets, the
							towers of MacEwan University line up.
						</p>
						<p>
							The Valley Line LRT, the oldest running public transit train line in the city, runs
							underground parallel to Jasper. Two stations, Corona and Bay/Enterprise Square, lay
							within the study area with a total of nine entrances to access the train.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<div class="legend-container">
						<LegendItem
							variant={'polygon'}
							label={'Jasper Avenue'}
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
						<SatelliteCheckbox casestudy={'jasperavenue'} section={'builtform'} />
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9pse0i004701nsefzddeiw'}
						center={[-113.5037, 53.5407]}
						zoom={15}
						minZoom={15}
						pitch={60}
						bearing={90}
						layers={[
							'jasperavenue',
							'jasperavenue-fill',
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
								layer={'jasperavenue-isochrone'}
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
							Jasper Avenue présente une image de marque cohérente, le style des
							lampadaires et du mobilier aux intersections étant uniforme dans toute la
							zone étudiée. Le parc Beaver Hill House (amisko waciw waskahikan ihtawin),
							un espace public doté de bancs, de verdure et d’une place souvent utilisée
							pour des événements et des manifestations, se trouve à l’angle nord-est de
							la 105 St et de Jasper Avenue.
						</p>
						<p>
							Un projet récent sur la 108 St, perpendiculaire, a permis de créer des îlots
							circulaires décoratifs ornés de sculptures.
						</p>
						<p>
							Selon l’Indice d’infrastructure civique, Jasper Avenue se classe 3e sur 20
							rues principales d’Edmonton et sur 12 rues principales de centre-ville. Cela
							s’explique par sa situation centrale et son accès aux ressources civiques.
						</p>
					{:else}
						<p>
							Jasper Avenue features cohesive branding, with the style of light poles and intersection
							furniture consistent across the study area. Beaver Hill House Park (amisko waciw
							waskahikan ihtawin), a public space with benches, greenery, and a plaza often used for
							events and demonstrations, sits at the northeast corner of 105 St and Jasper.
						</p>
						<p>
							A recent project on the perpendicular 108 St has created decorative circular traffic
							medians with sculptures.
						</p>
						<p>
							Acording to the Civic Infrastructure Index, Jasper ranks 3rd of 20 Edmonton Main Streets
							and 12 Downtown Main Streets. This is due to its central location and access to civic
							opportunity.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9pse0i004701nsefzddeiw'}
						center={[-113.5037, 53.5407]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={0}
						layers={[
							'jasperavenue',
							'jasperavenue-fill',
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
								layer={'jasperavenue-isochrone'}
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
							Selon l’Indice des entreprises indépendantes, Jasper Avenue se situe au
							milieu du classement, au 10e rang sur 20 rues principales d’Edmonton et au
							8e rang sur 12 rues principales de centre-ville. Pour la densité
							commerciale, Jasper Avenue se classe 2e à Edmonton et 3e parmi les rues
							principales de centre-ville.
						</p>
						<p>
							Les commerces de Jasper Avenue se trouvent au niveau de la rue, avec des
							bureaux aux étages supérieurs des tours. Jasper Avenue tend à attirer une
							clientèle un peu plus âgée, et les commerces locaux s’adressent davantage
							aux jeunes professionnels et aux travailleurs du centre-ville qu’aux
							étudiants universitaires. Jasper Avenue est aussi un lieu de vie nocturne,
							avec de nombreux bars et établissements ouverts tard le soir.
						</p>
						<p>
							On y trouve quelques restaurants haut de gamme et bars à cocktails comme Bar
							Bricco et Pablo, des cafés comme Coffee Bureau et Lock Stock Coffee, ainsi
							que des entreprises edmontoniennes comme Farrow Sandwiches, Remedy Cafe,
							Dorinku Osaka et Wee Book Inn.
						</p>
					{:else}
						<p>
							According to the Independent Businsess Index, Jasper ranks in the middle at 10th of 20
							Edmonton Main Streets and 8th of 12 Downtown Main Streets. For buisness density, Jaspers
							ranks 2nd in Edmonton and 3rd of Downtown Main Streets.
						</p>
						<p>
							Jasper Avenue's businesses are situated at street level with office space ascending
							above in high-rise buildings. Jasper tends to attract a slightly older crowd and the
							local businesses cater more to young professionals and downtown workers than university
							students. Jasper is also a nightlife area, with many bars and late night venues.
						</p>
						<p>
							There are a couple of high-end restaurants and cocktail bars such as Bar Bricco and
							Pablo, some coffee shops such as Coffee Bureau and Lock Stock Coffee, and some
							Edmontonian businesses such as Farrow Sandwiches, Remedy Cafe, Dorinku Osaka, and Wee
							Book Inn.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9pse0i004701nsefzddeiw'}
						center={[-113.5037, 53.5407]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={0}
						layers={[
							'jasperavenue',
							'jasperavenue-fill',
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
							Comme ce tronçon de Jasper Avenue se trouve dans le centre-ville et le
							quartier central des affaires d’Edmonton, on y trouve un mélange
							d’entreprises dont la taille varie de zéro à 50 employés. Le secteur compte
							1 348 entreprises par kilomètre carré. Les petites entreprises occupent les
							rez-de-chaussée, tandis que les plus grandes se trouvent dans les tours.
						</p>
						<p>
							Reflet de sa situation centrale, Jasper Avenue se classe 2e parmi les rues
							principales d’Edmonton pour la densité d’emploi et 6e parmi les rues
							principales de centre-ville.
						</p>
					{:else}
						<p>
							As this segment of Jasper Avenue is within Edmonton's downtown and central business
							district, there is a mix of businesses ranging in size from zero to 50 employees. There
							are 1,348 businesses per square kilometre in the area. Small businesses line the ground
							levels while larger businesses are housed within the high-rise towers.
						</p>
						<p>
							Reflective of its central location, Jasper ranks 2nd for Edmonton Main Streets in terms
							of employmenty density and 6th for Downtown Main Streets.
						</p>
					{/if}

					<img id="employmentsizelegend" src={fr ? EmpSizeLegendFr : EmpSizeLegend} alt={fr ? 'Légende' : 'Legend'} />
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9pse0i004701nsefzddeiw'}
						center={[-113.5037, 53.5407]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={0}
						layers={['jasperavenue', 'jasperavenue-fill', 'employment-size']}
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
							casestudy={'jasperavenue'}
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
							Le parc de logements de la zone étudiée de Jasper Avenue se compose presque
							exclusivement d’appartements dans des immeubles de grande hauteur (plus de
							60 %) et de faible hauteur (plus de 30 %). Quelques immeubles d’appartements
							donnent directement sur Jasper Avenue, mais la plupart se trouvent une rue
							plus au nord ou au sud, tout en restant visibles depuis l’avenue. Lors de la
							visite sur le terrain, plusieurs immeubles d’appartements étaient en
							construction, leur ossature de béton déjà érigée. On trouve un regroupement
							de logements au nord, sur la 104 St NW. Jasper Avenue compte également
							quelques bâtiments à usage mixte.
						</p>
					{:else}
						<p>
							The housing mix in the Jasper Avenue study area is almost exclusively high-rise
							apartments (over 60%) and low-rise apartments (over 30%). There are a few apartment
							buildings fronting Jasper itself, but most are either one street north or south, though
							still visible from the Avenue. At the time of the field visit, there were several
							apartment buildings under construction with concrete skeletons erected. There is a
							cluster of residential north on 104 St NW. There are a couple of mixed-use buildings on
							Jasper as well.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9pse0i004701nsefzddeiw'}
						center={[-113.5037, 53.5407]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={0}
						layers={['jasperavenue-outline', 'populationdensity']}
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
							casestudy={'jasperavenue'}
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
							Parmi les personnes résidant dans la zone étudiée, 37 % sont des personnes
							immigrantes récentes et 38 % font partie d’une minorité visible.
						</p>
					{:else}
						<p>
							Of residents in the study area, 37% are recent immigrants and 38% are visible
							minorities.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9pse0i004701nsefzddeiw'}
						center={[-113.5037, 53.5407]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={0}
						layers={['jasperavenue-outline', 'average-age']}
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
							Les séquelles de la COVID-19 ont entraîné un certain ralentissement de la
							fréquentation des commerces du centre-ville par les travailleurs de bureau.
							Comme bon nombre d’entre eux travaillent encore de la maison, en mode
							hybride ou entièrement à distance, l’animation de l’avenue à l’heure de
							pointe du midi a diminué.
						</p>
						<p>
							Comme c’est souvent le cas dans les quartiers centraux des affaires, ce
							tronçon de Jasper Avenue a reçu plus de 6 millions de visites en 2019, avant
							la pandémie, dont plus de la moitié par des visiteurs occasionnels. À la fin
							de 2022, le nombre total de visites annuelles avait diminué de plus de 3
							millions.
						</p>
						<p>
							En raison de la dépendance de Jasper Avenue envers les visiteurs
							occasionnels, son score de résilience la classe à un rang faible, soit 18e
							sur 20 rues principales d’Edmonton et 8e sur 12 rues principales de
							centre-ville.
						</p>
					{:else}
						<p>
							The legacy of COVID-19 has left a bit of a lull in the patronage of downtown businessess
							by office workers. With many still working from home, hybrid or fully remote, the
							liveliness of the Avenue at peak lunch has diminished.
						</p>
						<p>
							Typical of central business districts, this segment of Jasper Avenue saw over 6 million
							visits in 2019 before the pandemic with more than half by infrequent visitors. By the
							end of 2022, total annual visits decreased by over 3 million.
						</p>
						<p>
							Due to Jasper's reliance on infrequent visitors, its Resiliency Score ranks low at 18th
							of 20 Edmonton Main Streets and 8th of 12 Downtown Main Streets.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9pse0i004701nsefzddeiw'}
						center={[-113.5037, 53.5407]}
						zoom={9}
						pitch={0}
						bearing={0}
						layers={['jasperavenue-outline', 'visitors-2022']}
						section={'visitors'}
						attribution={fr ? 'Institut urbain du Canada | Source des données : Environics Analytics' : 'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="legend-container">
						<Legend
							minlabel={'0'}
							maxlabel={fr ? '19 200' : '19,200'}
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
