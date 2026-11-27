<script>
	/* -------------------------------------------------------------------------- */
	/*                                   Imports                                  */
	/* -------------------------------------------------------------------------- */

	import HundredFiveStreetNW from '../../../lib/assets/boundaries/edmontonboundaries/105StreetNW.svg';
	import Title from '../../../lib/ui/Title.svelte';

	import EmpSizeLegend from '../../../lib/assets/employmentsizelegend.svg';
	import EmpSizeLegendFr from '../../../lib/assets/employmentsizelegend-fr.svg';

	import businessmix from '../../../lib/data/casestudydata/edmonton/105streetnw/businessmix';
	import civicmix from '../../../lib/data/casestudydata/edmonton/105streetnw/civicmix';
	import greenspace from '../../../lib/data/casestudydata/edmonton/105streetnw/greenspace';
	import housingconstruction from '../../../lib/data/casestudydata/edmonton/105streetnw/housingconstruction';
	import housingtype from '../../../lib/data/casestudydata/edmonton/105streetnw/housingtype';
	import visitordayofweek from '../../../lib/data/casestudydata/edmonton/105streetnw/visitordayofweek';
	import visitortimeofday from '../../../lib/data/casestudydata/edmonton/105streetnw/visitortimeofday';
	import visitortraffic from '../../../lib/data/casestudydata/edmonton/105streetnw/visitortraffic';
	import visitortypes from '../../../lib/data/casestudydata/edmonton/105streetnw/visitortypes';

	import { browser } from '$app/environment';
	import { timeFormat } from 'd3-time-format';
	import mapboxgl from 'mapbox-gl';
	import CaseStudyMap from '../../../lib/ui/CaseStudyMap.svelte';
	import EmploymentSizeCheckbox from '../../../lib/ui/checkbox/EmploymentSizeCheckbox.svelte';
	import IsochroneCheckbox from '../../../lib/ui/checkbox/IsochroneCheckbox.svelte';
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
	<Title
		outline={HundredFiveStreetNW}
		name={'104 Street NW Downtown (4th Street Promenade Downtown)'}
		location={'Edmonton, Alberta'}
	/>
	<div class="container">
		<section data-id="map1">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>{fr ? 'Vue d’ensemble' : 'Overview'}</h2>
					{#if fr}
						<p>
							La 104 Street NW est située au centre-ville d’Edmonton et était le cœur
							historique du quartier des entrepôts, dont les origines remontent à la
							période d’essor qui a précédé la Seconde Guerre mondiale. Depuis, les
							fonctions d’entreposage du quartier ont été déplacées vers des secteurs
							industriels à l’extérieur du centre, ce qui a permis la réutilisation
							adaptative de ces bâtiments patrimoniaux. Aujourd’hui, la rue accueille des
							restaurants, des commerces de détail et des logements.
						</p>
						<p>
							La 104 Street NW se trouve juste au nord de Jasper Avenue et suit un axe
							nord-sud.
						</p>
					{:else}
						<p>
							104 Street NW is located in downtown Edmonton and was the historic centre of the
							warehouse district with its roots in the pre-WWII boom period. Since then, the warehouse
							functions of the district has been moved to industrial locations outside of the core,
							leaving these heritage buildings open for adaptive reuse. Today, the street is used for
							dining, retail, and residential.
						</p>
						<p>104 Street NW sits just north of Jasper Avenue and runs north-south.</p>
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
							label={'104 Street Downtown'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clt4rh7ju02hf01p6cykrb1cx'}
						center={[-113.4994, 53.5427]}
						zoom={15}
						pitch={50}
						bearing={0}
						layers={['mainstreets-edmonton', '105streetnw', '105streetnw-fill']}
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
							La 104 Street NW présente un aménagement uniforme dans l’ensemble de la zone
							à l’étude. Bien que plusieurs rues très achalandées la croisent, la 104
							Street elle-même connaît une circulation calme et constitue un endroit
							agréable où les piétons aiment s’attarder. La rue comporte des potelets à
							chaque intersection, de larges trottoirs et plusieurs commerces dotés de
							placottoirs.
						</p>
						<p>
							Des immeubles à usage mixte, avec des logements en hauteur au-dessus de
							vitrines commerciales, caractérisent une grande partie de la rue, et bon
							nombre des rez-de-chaussée ont été réaménagés depuis l’époque des entrepôts.
							Les nouvelles constructions s’harmonisent avec les anciennes grâce à un
							revêtement de brique, ce qui crée une esthétique patrimoniale relativement
							cohérente. La hauteur des bâtiments varie d’un étage à la tour d’habitation.
							Dans les tronçons où les bâtiments sont plus bas, on aperçoit au loin les
							tours d’Edmonton, ce qui donne à la rue l’allure d’un fragment historique au
							milieu d’un centre-ville moderne.
						</p>
					{:else}
						<p>
							104 Street NW has a consistent street design throughout the study area. Although there
							are several heavily trafficked streets intersecting, 104 Street itself experiences calm
							traffic and is a pleasant place for pedestrians to linger. The street features bollards
							at every intersection, large sidewalks, and several businesses with parklet patios.
						</p>
						<p>
							Mixed-use buildings with high-rise residential units above storefronts characterize much
							of the street, with many of the ground level structures repurposed from their old
							warehousing days. New structures match the old using brick cladding, creating a
							relatively cohesive heritage aesthetic. Buildings vary in height from one-storey to
							high-rise. In sections with lower height buildings, one can view Edmonton's high-rises
							in the distance, making the street feel like a historic fragment in the middle of a
							modern downtown.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<div class="legend-container">
						<LegendItem
							variant={'polygon'}
							label={'104 Street Downtown'}
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
						<SatelliteCheckbox casestudy={'105streetnw'} section={'builtform'} />
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clt4rh7ju02hf01p6cykrb1cx'}
						center={[-113.4994, 53.5427]}
						zoom={15.5}
						minZoom={15}
						pitch={60}
						bearing={0}
						layers={[
							'105streetnw',
							'105streetnw-fill',
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
							<IsochroneCheckbox
								section={'civicinfra'}
								layer={'105streetnw-isochrone'}
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
							En entrant dans la 104 Street NW depuis Jasper Avenue, on trouve Michael
							Phair Park sur la gauche. Ce parc est un espace vert urbain coloré. Une
							murale à pois s’étend des bâtiments situés au nord, traverse le parc le long
							de ses sentiers et se prolonge sur le bâtiment situé au sud. Le parc
							accueille des événements et l’on peut y voir des gens profiter de l’espace,
							surtout à l’heure du dîner en semaine.
						</p>
						<p>
							La 104 Street NW fait partie de la zone d’amélioration commerciale (BIA)
							Edmonton Downtown, mais elle présente une image de marque et un caractère
							qui lui sont propres, avec par exemple des lanternes de rue, des poteaux
							d’affichage et des supports à vélos. Des potelets séparent les trottoirs des
							voies de circulation.
						</p>
						<p>
							Lors de la visite sur le terrain, un panneau indiquait que des réseaux de
							services publics étaient en cours de déplacement et de modernisation en vue
							du nouveau projet de train léger Valley Line West, à proximité, sur la 103
							St et la 102 Ave.
						</p>
						<p>
							Selon l’Indice d’infrastructure civique, la 104 Street NW se classe 12e sur
							20 rues principales d’Edmonton et 11e sur 36 rues principales de quartier.
						</p>
					{:else}
						<p>
							As one enters 104 Street NW from Jasper Avenue, Michael Phair Park can be found to the
							left. The park is a colourful urban greenspace. A polka dot mural extends from buildings
							to the north through pathways across the park onto the building to the south. The park
							host events and people can be seen enjoying the space, especially during lunchtime on
							weekdays.
						</p>
						<p>
							104 Street NW is located in the Edmonton Downtown BIA, but features 104 Street-specific
							branding and character, such as street lanterns, street poster posts, and bike racks.
							Bollards separate sidewalks from car lanes.
						</p>
						<p>
							During the field visit, a sign indicated utilities are being relocated and upgraded to
							accommodate the new Valley Line West Light Rail Transit project nearby on 103 St and 102
							Ave.
						</p>
						<p>
							According to the Civic Infrastructure Index, 104 Street NW ranks 12th out of 20 Edmonton
							Main Streets and 11th of 36 Neighbourhood Main Streets.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clt4rh7ju02hf01p6cykrb1cx'}
						center={[-113.4994, 53.5427]}
						zoom={14.5}
						minZoom={13}
						pitch={0}
						bearing={0}
						layers={[
							'105streetnw',
							'105streetnw-fill',
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
							<IsochroneCheckbox
								section={'business'}
								layer={'105streetnw-isochrone'}
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
							En matière de composition commerciale, la 104 Street NW compte une
							proportion plus élevée d’établissements de restauration et de boissons, bien
							que la composition commence à refléter celle de l’ensemble de la RMR
							d’Edmonton lorsqu’on l’élargit à un rayon de 10 minutes de marche, qui offre
							un meilleur accès au commerce de détail.
						</p>
						<p>
							Parmi les établissements notables, mentionnons Home and Away (anciennement
							Mercer Tavern), DOSC, Credo Coffee, Misoya Ramen et Tzin Wine Bar. Les
							entrepôts historiques Mercer Warehouses, situés à l’extrémité nord de la
							zone à l’étude, abritent de petites entreprises et des entrepreneurs.
						</p>
						<p>
							Selon l’Indice des entreprises indépendantes, la 104 Street NW se classe
							bien, au 4e rang sur 20 rues principales d’Edmonton et au 8e rang sur 36
							rues principales de quartier. Pour la densité commerciale, la 104 se classe
							12e sur 20 et 23e sur 36.
						</p>
						<p>
							Lors de la visite sur le terrain, le taux d’occupation semblait élevé, les
							affiches « À louer » étant rares.
						</p>
					{:else}
						<p>
							In terms of business mix, 104 Street NW has a higher percentage of food and drink
							establishments, though the mix begins to reflect the greater Edmonton CMA once expanded
							to a ten minute walkshed with greater access to retail.
						</p>
						<p>
							Notable establishments include Home and Away (formerly Mercer Tavern), DOSC, Credo
							Coffee, Misoya Ramen, and Tzin Wine Bar. The historic Mercer Warehouses can be found at
							the north end of the study area housing small businesses and entrepreneurs.
						</p>
						<p>
							According to the Independent Business Index, 104 Street NW ranks well at 4th out of 20
							Edmonton Main Streets and 8th of 36 Neighbourhood Main Streets. For business density,
							104 ranks 12th of 20 and 23rd of 36.
						</p>
						<p>
							During the field visit, there seemed to be a high occupancy rate as For Lease signs were
							few and far between.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clt4rh7ju02hf01p6cykrb1cx'}
						center={[-113.4994, 53.5427]}
						zoom={14.5}
						minZoom={13}
						pitch={0}
						bearing={0}
						layers={[
							'105streetnw',
							'105streetnw-fill',
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
							La 104 Street NW accueille une concentration importante de petites
							entreprises, comptant de zéro à dix employés, dans la zone à l’étude. À
							l’est de la zone à l’étude, on trouve un nombre important d’entreprises de
							dix à 15 employés. La zone à l’étude fait partie d’un plus vaste corridor
							commercial et industriel de type banlieue qui s’étend vers le sud, de la
							rivière Saskatchewan Nord jusqu’à l’autoroute Whitemud.
						</p>
						<p>
							Pour la densité d’emploi, la 104 Street NW se classe 6e sur 20 rues
							principales d’Edmonton et 8e sur 36 rues principales de quartier.
						</p>
					{:else}
						<p>
							104 Street NW hosts a significant concentration of small businesses, zero to ten
							employees large, within the study area. East of the study area, one can find a
							significant spread of enterprises with ten to 15 employees. The study area is part of a
							larger suburban pattern commercial and industrial corridor that stretches from the North
							Saskatchewan River south to the Whitemud freeway.
						</p>
						<p>
							For employment density, 104 Street NW ranks 6th out of 20 Edmonton Main Streets and 8th
							of 36 Neighbourhood Main Streets.
						</p>
					{/if}
					<img id="employmentsizelegend" src={fr ? EmpSizeLegendFr : EmpSizeLegend} alt={fr ? 'Légende' : 'legend'} />
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clt4rh7ju02hf01p6cykrb1cx'}
						center={[-113.4994, 53.5427]}
						zoom={14.5}
						minZoom={13}
						pitch={0}
						bearing={0}
						layers={['105streetnw', '105streetnw-fill', 'employment-size']}
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
							casestudy={'105streetnw'}
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
					</div>

					{#if fr}
						<p>
							Les appartements de faible hauteur (plus de 30 %), suivis des maisons
							individuelles non attenantes (environ 30 %), sont les principales formes de
							logement dans la zone à l’étude de la 104 Street NW. Le plus important essor
							de la construction résidentielle a eu lieu entre 1961 et 1980.
						</p>
					{:else}
						<p>
							Low-rise apartments (over 30%) followed by single-detached dwellings (around 30%) are
							the predominant housing forms in the 104 Street NW study area. The biggest housing
							construction boom happened in the 1961-80 period.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clt4rh7ju02hf01p6cykrb1cx'}
						center={[-113.4994, 53.5427]}
						zoom={14.5}
						minZoom={13}
						pitch={0}
						bearing={0}
						layers={['105streetnw-outline', 'populationdensity']}
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
							casestudy={'105streetnw'}
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
							Parmi les personnes résidentes de la zone à l’étude, 36 % sont des personnes
							immigrantes récentes et 37 % appartiennent à une minorité visible.
						</p>
					{:else}
						<p>
							Of residents in the study area, 36% are recent immigrants and 37% are visible
							minorities.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clt4rh7ju02hf01p6cykrb1cx'}
						center={[-113.4994, 53.5427]}
						zoom={14.5}
						minZoom={13}
						pitch={0}
						bearing={0}
						layers={['105streetnw-outline', 'average-age']}
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
							Le score de résilience de la 104 Street NW est faible : elle se classe 17e
							sur 20 rues principales d’Edmonton et 30e sur 36 rues principales de
							quartier.
						</p>
						<p>
							Avant la pandémie, en 2019, la plupart des visites dans la zone à l’étude de
							la 104 Street NW étaient le fait de visiteurs occasionnels provenant de
							toute la région. En 2022, les visites avaient diminué dans toutes les
							catégories, et la 104 Street NW n’a rien connu qui ressemble à un retour aux
							niveaux d’avant la pandémie.
						</p>
						<p>
							La 104 Street est la plus achalandée entre midi et 21 h, le samedi étant le
							jour le plus achalandé de la semaine, suivi du vendredi.
						</p>
					{:else}
						<p>
							104 Street NW's Resiliency Score ranks low at 17th of 20 Edmonton Main Streets and 30th
							of 36 Neighbourhood Main Streets.
						</p>
						<p>
							Pre-pandemic in 2019, most visits to the 104 Street NW study area were by infrequent
							visitors from across the region. As of 2022, visits across the board have decreased and
							104 Street NW has not seen anything resembling a return to pre-pandemic numbers.
						</p>
						<p>
							104 Street is busiest during the 12pm to 9pm period, with the busiest day of the week
							being Saturday followed by Friday.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clt4rh7ju02hf01p6cykrb1cx'}
						center={[-113.4994, 53.5427]}
						zoom={9}
						pitch={0}
						bearing={0}
						layers={['105streetnw-outline', 'visitors-2022']}
						section={'visitors'}
						attribution={fr ? 'Institut urbain du Canada | Source des données : Environics Analytics' : 'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="legend-container">
						<Legend
							minlabel={'0'}
							maxlabel={fr ? '23 400' : '23,400'}
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
