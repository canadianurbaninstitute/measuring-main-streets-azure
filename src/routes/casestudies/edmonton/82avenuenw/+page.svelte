<script>
	/* -------------------------------------------------------------------------- */
	/*                                   Imports                                  */
	/* -------------------------------------------------------------------------- */

	import EightyTwoAvenueNW from '../../../lib/assets/boundaries/edmontonboundaries/82AvenueNW.svg';
	import Title from '../../../lib/ui/Title.svelte';

	import EmpSizeLegend from '../../../lib/assets/employmentsizelegend.svg';
	import EmpSizeLegendFr from '../../../lib/assets/employmentsizelegend-fr.svg';

	import businessmix from '../../../lib/data/casestudydata/edmonton/82avenuenw/businessmix';
	import civicmix from '../../../lib/data/casestudydata/edmonton/82avenuenw/civicmix';
	import greenspace from '../../../lib/data/casestudydata/edmonton/82avenuenw/greenspace';
	import housingconstruction from '../../../lib/data/casestudydata/edmonton/82avenuenw/housingconstruction';
	import housingtype from '../../../lib/data/casestudydata/edmonton/82avenuenw/housingtype';
	import visitordayofweek from '../../../lib/data/casestudydata/edmonton/82avenuenw/visitordayofweek';
	import visitortimeofday from '../../../lib/data/casestudydata/edmonton/82avenuenw/visitortimeofday';
	import visitortraffic from '../../../lib/data/casestudydata/edmonton/82avenuenw/visitortraffic';
	import visitortypes from '../../../lib/data/casestudydata/edmonton/82avenuenw/visitortypes';

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
	<Title outline={EightyTwoAvenueNW} name={'Whyte (82) Avenue NW'} location={'Edmonton, Alberta'} />
	<div class="container">
		<section data-id="map1">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>{fr ? 'Vue d’ensemble' : 'Overview'}</h2>
					{#if fr}
						<p>
							La 82 Avenue NW, connue sous le nom de Whyte Avenue, est une destination
							prisée pour le magasinage, la restauration et le divertissement, qui joue un
							double rôle de destination de jour comme de soir. Les personnes visiteuses
							et résidentes profitent du marché public et des cafés pendant la journée, et
							de la vie nocturne animée une fois la nuit tombée.
						</p>
						<p>
							Whyte Avenue accueille souvent des festivals extérieurs tout au long de
							l’année, comme l’Edmonton International Fringe Festival, le Whyte Avenue Art
							Walk et Ice on Whyte. La rue est orientée est-ouest et se trouve au sud de
							la rivière Saskatchewan Nord. Whyte Avenue était la rue principale et le
							centre-ville de Strathcona jusqu’à la fusion de 1912. Whyte Avenue et Old
							Strathcona regroupent une concentration de bâtiments et d’attraits
							historiques, comme le South Edmonton Post Office, le Princess Theatre et de
							nombreuses autres propriétés patrimoniales.
						</p>
					{:else}
						<p>
							82 Avenue NW, known as Whyte Avenue, is a popular shopping, dining, and entertainment
							destination that plays double duty as both a morning and night destination. Visitors and
							residents enjoy the farmers market and coffee shops during the day, and the vibrant
							nightlife scene after dark.
						</p>
						<p>
							Whyte is often used to host outdoor festivals year-round, such as the Edmonton
							International Fringe Festival, Whyte Avenue Art Walk, and Ice on Whyte. The street runs
							east-west and sits south of the North Saskatchewan River. Whyte used to be the main
							street and downtown for Strathcona until amalgamation in 1912. Whyte Avenue and Old
							Strathcona contain a concentration of historical buildings and attractions such as the
							South Edmonton Post Office, the Princess Theatre, and many other heritage properties.
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
							label={'Whyte (82) Avenue NW'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9l21x3003601qo9bq8gaj5'}
						center={[-113.5, 53.515]}
						zoom={13}
						pitch={50}
						bearing={0}
						layers={['mainstreets-edmonton', '82avenuenw', '82avenuenw-fill']}
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
							Whyte Avenue compte six voies et constitue le principal lien routier
							est-ouest juste au sud de la rivière Saskatchewan Nord. On y voit couramment
							des véhicules d’urgence en raison de la proximité de l’University Hospital.
							Deux traverses piétonnes multidirectionnelles se trouvent aux intersections
							de la 105 St et de Calgary Trail. Les vélos et les autres modes de transport
							actif sont redirigés vers la piste cyclable réservée de la 83 Ave NW,
							parallèle au nord.
						</p>
						<p>
							De grands arbres feuillus matures bordent Whyte Avenue le long du trottoir
							et du terre-plein central. Là où il n’y a pas de terre-plein, la rue paraît
							plus large et manque d’ombre.
						</p>
						<p>
							Les bâtiments historiques sont de faible hauteur, seuls deux hôtels
							dépassant cinq étages, ce qui donne au secteur une esthétique plus proche de
							la banlieue que d’une rue de centre-ville. Whyte Avenue donne l’impression
							d’un ensemble éclectique de renouvellement urbain, de restauration et
							d’architecture historique.
						</p>
					{:else}
						<p>
							Whyte Avenue is six lanes wide, serving as the primary east-west vehicular connection
							just south of the North Saskatchewan River. Emergency vehicles are commonly seen on
							Whyte due to its proximity to University Hospital. There are two scramble crosswalks at
							the 105 St and Calgary Trail intersections. Bicycles and other active transportation
							modes are diverted to the dedicated bike lane on 83 Ave NW, running parallel to the
							north.
						</p>
						<p>
							Large, mature deciduous trees line Whyte along the sidewalk and median. Where the median
							is absent, the road feels wider and lacks shade.
						</p>
						<p>
							The historic buildings are low in height, with only two hotels exceeding five storeys,
							giving the area a more suburban aesthetic than that of a downtown street. Whyte feels
							like an eclectic collection of urban turnover, restoration, and historic architecture.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<div class="legend-container">
						<LegendItem
							variant={'polygon'}
							label={'Whyte (82) Avenue NW'}
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
						<SatelliteCheckbox casestudy={'82avenuenw'} section={'builtform'} />
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9l21x3003601qo9bq8gaj5'}
						center={[-113.5061, 53.5182]}
						zoom={15}
						minZoom={15}
						pitch={60}
						bearing={90}
						layers={[
							'82avenuenw',
							'82avenuenw-fill',
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
								layer={'82avenuenw-isochrone'}
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
							Whyte Avenue se trouve au cœur de la zone d’amélioration commerciale (BIA)
							d’Old Strathcona. Le secteur a été nettement mis en valeur par
							l’infrastructure civique et les investissements publics, en particulier les
							trottoirs aménagés pour les piétons, dotés de petites barrières, de mobilier
							urbain, de lampadaires décoratifs, de guirlandes lumineuses et de
							jardinières suspendues. Les petites barrières colorées font leur apparition
							l’été pour séparer les terrasses des restaurants des places de
							stationnement. Le secteur compte quelques murales. Le parc Dr. Wilbert
							McIntyre, à proximité, sert souvent de site de festivals tout au long de
							l’année.
						</p>
						<p>
							Récemment, les ruelles ont commencé à être utilisées par les commerces et
							les piétons, plusieurs commerces s’en servant comme entrée principale, comme
							WoodRack Café, Boxer Kitchen & Bar et Sugared and Spice Bakery.
						</p>
						<p>
							Selon l’Indice d’infrastructure civique, Whyte Avenue se classe 5e sur 20
							rues principales d’Edmonton et au 1er rang des 36 rues principales
							résidentielles.
						</p>
					{:else}
						<p>
							Whyte Avenue is at the centre of the Old Strathcona BIA. The district has been
							noticeably enhanced by civic infrastructure and public investment, especially the
							pedestrianized sidewalks featuring mini barriers, street fixtures, decorative light
							poles, string lights, and hanging planters. The colourful mini barriers show up in the
							summer to separate the restaurant patios from parking spaces. The area features a few
							murals. The nearby Dr. Wilbert MicIntyre Park is often used as a festival ground
							year-round.
						</p>
						<p>
							Recently, alleyways have begun to be used for businesses and pedestrians, with several
							businesses using alleys as their main entrances, such as WoodRack Café, Boxer Kitchen &
							Bar, and Sugared and Spice Bakery.
						</p>
						<p>
							According to the Civic Infrastructure Index, Whyte Avenue ranks 5th out of 20 Edmonton
							Main Streets and 1st of 36 Residential Main Streets.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9l21x3003601qo9bq8gaj5'}
						center={[-113.5006, 53.5179]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={0}
						layers={[
							'82avenuenw',
							'82avenuenw-fill',
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
								layer={'82avenuenw-isochrone'}
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
							Whyte Avenue est avant tout un quartier du divertissement. On y trouve un
							mélange de restaurants, de bars, de salles de spectacle, de boîtes de nuit
							et de boutiques. Les boîtes de nuit occupent généralement l’étage, au-dessus
							des devantures, tandis que les salles de spectacle se trouvent plutôt à
							l’intérieur du quartier environnant.
						</p>
						<p>
							Selon l’Indice des entreprises indépendantes, Whyte Avenue se classe 8e sur
							20 rues principales d’Edmonton et 19e sur 36 rues principales de quartier.
							Whyte Avenue se classe également 4e sur 20 et 8e sur 36 pour la densité
							commerciale.
						</p>
						<p>
							L’été, les restaurants débordent dans la rue, et beaucoup sont dotés de
							portes de type garage permettant de manger à l’air libre. Quelques-uns ont
							même des terrasses d’hiver chauffées. Les magasins de vêtements semblent
							constituer l’offre de commerce de détail la plus courante. On observe
							récemment une hausse des ouvertures de friperies et de boutiques de
							consignation.
						</p>
						<p>
							La rue connaît un roulement important des commerces, et on peut y voir des
							devantures vacantes ou affichant des pancartes « À louer ».
						</p>
					{:else}
						<p>
							Whyte Avenue is first and foremost an entertainment district. It features a mix of
							restaurants, bars, theatres, clubs, and shopping. Clubs are generally housed on the
							second floor above storefronts while the theatres tend to be located further into the
							surrounding neighbourhood.
						</p>
						<p>
							According to the Independent Business Index, Whyte Avenue ranks 8th out of 20 Edmonton
							Main Streets and 19th of 36 Neighbourhood Main Streets. Whyte also ranks 4th out of 20
							and 8th out of 36 for business density.
						</p>
						<p>
							During summertime, restaurants extend out into the street, and many have garage-style
							doors for open-air dining. A couple even have winter patios with heaters. Clothing
							stores seems to be the most common retail offering. There has been a recent uptick of
							vintage and consignment stores opening.
						</p>
						<p>
							The street experiences a significant amount of business turnover and storefront can be
							seen vacant and/or with "For Lease" signs.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9l21x3003601qo9bq8gaj5'}
						center={[-113.5006, 53.5179]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={0}
						layers={[
							'82avenuenw',
							'82avenuenw-fill',
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
							Whyte Avenue accueille une concentration importante d’entreprises et de
							services, allant de petites boutiques comptant de zéro à cinq employés à des
							entreprises de taille moyenne comptant de 10 à 50 employés. Bien que la
							majeure partie de l’emploi soit concentrée dans la zone étudiée de Whyte
							Avenue, de nombreux établissements débordent dans les îlots environnants,
							les plus grandes entreprises étant concentrées plus au sud.
						</p>
						<p>
							Pour la densité d’emploi, Whyte Avenue se classe 5e sur 20 rues principales
							d’Edmonton et 6e sur 35 rues principales de quartier.
						</p>
					{:else}
						<p>
							Whyte Avenue is home to a significant concentration of businesses and services, from
							small businesses, ranging from small shops with zero to five employees and medium sized
							enterprises ranging from 10 to 50 employees. Whle most employment is concentrated on
							within the Whyte Avenue study area, many establishments spill out into the surrounding
							blocks with larger businesses concentrated further south.
						</p>
						<p>
							For employment density, Whyte ranks 5th out of 20 Edmonton Main Streets and 6th of 35
							Neighbourhood Main Streets.
						</p>
					{/if}
					<img id="employmentsizelegend" src={fr ? EmpSizeLegendFr : EmpSizeLegend} alt={fr ? 'Légende' : 'Legend'} />
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9l21x3003601qo9bq8gaj5'}
						center={[-113.5006, 53.5179]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={0}
						layers={['82avenuenw', '82avenuenw-fill', 'employment-size']}
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
							casestudy={'82avenuenw'}
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
							Les immeubles d’appartements de faible hauteur constituent la majeure partie
							de l’offre de logements autour de Whyte Avenue. Les maisons individuelles
							sont de plus en plus nombreuses à mesure qu’on s’éloigne de Whyte Avenue.
							C’est dans les années 1960 et 1970 que le secteur a connu son plus important
							boom de construction résidentielle.
						</p>
						<p>
							Plus de 80 % du parc de logements est constitué d’appartements dans des
							immeubles de faible hauteur. On trouve plusieurs immeubles d’appartements de
							grande hauteur au nord de l’avenue. Quelques grands bâtiments résidentiels
							intercalaires se trouvent sur la rue même, généralement dans des bâtiments à
							usage mixte de cinq ou six étages.
						</p>
					{:else}
						<p>
							Low-rise apartments make up most of the housing options surrounding Whyte Avenue.
							Instances of single-detached homes increase the further away one goes from Whyte Street.
							The 60s and 70s saw the areas most significant housing construction boom.
						</p>
						<p>
							Over 80% of the housing stock are low-rise apartment dwellings. Several high-rise
							apartments can be found north of the Avenue. There are a few large infill residentail
							buildings on the street itself, typically part of mixed-used structures five to
							six-storeys tall.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9l21x3003601qo9bq8gaj5'}
						center={[-113.5006, 53.5179]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={0}
						layers={['82avenuenw-outline', 'populationdensity']}
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
							casestudy={'82avenuenw'}
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
							Parmi les personnes résidant dans la zone étudiée, 32 % sont des personnes
							immigrantes récentes et 31 % font partie d’une minorité visible.
						</p>
					{:else}
						<p>
							Of residents in the study area, 32% are recent immigrants and 31% are visible
							minorities.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9l21x3003601qo9bq8gaj5'}
						center={[-113.5006, 53.5179]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={0}
						layers={['82avenuenw-outline', 'average-age']}
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
							Avant que les confinements liés à la pandémie ne frappent la ville, la zone
							étudiée de Whyte Avenue a reçu en 2019 plus de 4 millions de visites de la
							part de visiteurs occasionnels provenant de l’extérieur du quartier. En
							2022, ce nombre avait diminué de plus de la moitié. Malgré cela, les visites
							des résidents du quartier se sont presque rétablies au cours de la même
							période.
						</p>
						<p>
							Whyte Avenue est la plus achalandée entre midi et 21 h, le samedi étant la
							journée la plus achalandée de la semaine, ce qui reflète peut-être son rôle
							de destination de divertissement.
						</p>
						<p>
							Selon le score de résilience, Whyte Avenue se classe à un rang faible, soit
							16e sur 20 rues principales d’Edmonton et 27e sur 36 rues principales de
							quartier, ce qui révèle une dépendance excessive envers les visiteurs
							occasionnels.
						</p>
					{:else}
						<p>
							Before pandemic shut downs gripped the city, the Whyte Avenue study area saw over 4
							million visits in 2019 by infrequent visitors from outside the neighbourhood. As of
							2022, that number decreased by over half. Despite that, visits by local residents have
							almost recovered in the same period.
						</p>
						<p>
							Whyte is busiest during the 12pm to 9pm period, with the busiest day of the week being
							Saturday, possibly reflective of its role as an entertainment destination.
						</p>
						<p>
							Whyte Avenue's Resilience Score ranks low at 16th of 20 Edmonton Main Streets and 27th
							of 36 Neighbourhood Main Streets revealing an over reliance on infrequent visitors.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr9l21x3003601qo9bq8gaj5'}
						center={[-113.5006, 53.5179]}
						zoom={9}
						pitch={0}
						bearing={0}
						layers={['82avenuenw-outline', 'visitors-2022']}
						section={'visitors'}
						attribution={fr ? 'Institut urbain du Canada | Source des données : Environics Analytics' : 'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="legend-container">
						<Legend
							minlabel={'0'}
							maxlabel={fr ? '131 900' : '131,900'}
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
