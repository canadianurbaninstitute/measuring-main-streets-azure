<script>
	/* -------------------------------------------------------------------------- */
	/*                                   Imports                                  */
	/* -------------------------------------------------------------------------- */

	import WestQueenWest from '../../../lib/assets/boundaries/torontoboundaries/WestQueenWest.svg';
	import Title from '../../../lib/ui/Title.svelte';

	import EmpSizeLegend from '../../../lib/assets/employmentsizelegend.svg';
	import EmpSizeLegendFr from '../../../lib/assets/employmentsizelegend-fr.svg';

	import businessmix from '../../../lib/data/casestudydata/toronto/westqueenwest/businessmix';
	import civicmix from '../../../lib/data/casestudydata/toronto/westqueenwest/civicmix';
	import greenspace from '../../../lib/data/casestudydata/toronto/westqueenwest/greenspace';
	import housingconstruction from '../../../lib/data/casestudydata/toronto/westqueenwest/housingconstruction';
	import housingtype from '../../../lib/data/casestudydata/toronto/westqueenwest/housingtype';
	import visitordayofweek from '../../../lib/data/casestudydata/toronto/westqueenwest/visitordayofweek';
	import visitortimeofday from '../../../lib/data/casestudydata/toronto/westqueenwest/visitortimeofday';
	import visitortraffic from '../../../lib/data/casestudydata/toronto/westqueenwest/visitortraffic';
	import visitortypes from '../../../lib/data/casestudydata/toronto/westqueenwest/visitortypes';

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
	<Title outline={WestQueenWest} name={'West Queen West'} location={'Toronto, Ontario'} />
	<div class="container">
		<section data-id="map1">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>{fr ? 'Vue d’ensemble' : 'Overview'}</h2>
					{#if fr}
						<p>
							West Queen West est le tronçon d’une importante artère traversant le sud de
							la ville de Toronto, plus précisément la portion de la rue comprise entre
							Dufferin à l’ouest et Bathurst à l’est. Immédiatement à l’ouest se trouve le
							quartier de Parkdale; au sud, un ensemble de quartiers à forte densité comme
							Liberty Village et Niagara; à l’est, la rue mène au quartier des spectacles
							(Entertainment District) et au centre-ville; et au nord, une mosaïque de
							quartiers résidentiels de plus faible hauteur.
						</p>
						<p>
							La rue sert historiquement de voie d’entrée et de sortie vers l’ouest du
							cœur de Toronto et est urbanisée depuis au moins les années 1850.
							Historiquement un quartier ouvrier situé près des emplois en usine, West
							Queen West a vu sa population résidentielle évoluer au même rythme que le
							profil économique de Toronto, qui s’est tourné vers les services et le
							travail du savoir.
						</p>
					{:else}
						<p>
							West Queen West is the segment of a prominent arterial road through the southern parts
							of the city of Toronto, specifically the part of the street between Dufferin in the west
							and Bathurst in the east. To its immediate west is the neighbourhood of Parkdale, to its
							south a mix of high-density neighbourhoods such as Liberty Village and Niagara, to the
							east the street leads into the entertainment district and downtown, and to the north a
							patchwork of lower-rise residential neighbourhoods.
						</p>
						<p>
							The street has served as a historic westbound route in and out of Toronto’s core and has
							been urbanized since at least the 1850s. Historically a working-class district close to
							factory jobs, as the economic profile of Toronto has shifted to services and knowledge
							work so has West Queen West’s residential population.
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
							label={'West Queen West BIA'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clp1i0fls00wg01ntg6hdbldy'}
						center={[-79.41145, 43.647]}
						zoom={13}
						pitch={50}
						bearing={0}
						layers={['mainstreets-toronto', 'westqueenwest', 'westqueenwest-fill']}
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
							La plupart des bâtiments le long de la rue sont des structures mixtes
							commerciales et résidentielles, avec de petits commerces donnant directement
							sur le trottoir. Peu de propriétés présentent un retrait important par
							rapport à la chaussée, et les hauteurs se limitent en grande partie à un
							maximum de trois étages directement sur la rue — bien que des bâtiments plus
							hauts se trouvent immédiatement au sud de la rue, surtout dans son tronçon
							ouest. De nombreuses propriétés le long de Queen Street ont accès à une
							ruelle au nord et au sud. On trouve aussi un petit centre commercial
							linéaire à l’extrémité ouest de la rue.
						</p>
						<p>
							La rue est desservie par plusieurs lignes de transport collectif, notamment
							une ligne de tramway de la TTC. Bien qu’il n’y ait pas d’infrastructure
							cyclable sur la rue, outre du stationnement pour vélos, certaines rues
							parallèles comportent des pistes cyclables protégées.
						</p>
						<p>
							Le changement le plus important du cadre bâti le long de la rue est le
							Centre de toxicomanie et de santé mentale (CAMH), qui occupe une vaste
							propriété entre Shaw et White Squirrel, du côté sud de la rue. Sur ce
							tronçon, le côté nord conserve en grande partie la forme dominante, mais ces
							dernières années, le CAMH a construit plusieurs bâtiments institutionnels et
							à usage mixte de huit à dix étages et a prolongé la trame de rues du nord
							vers le sud.
						</p>
					{:else}
						<p>
							Most of the buildings along the street consists of mixed-use commercial and residential
							structures, with small-scale retail directly fronting a sidewalk. Few properties have a
							significant setback from their roadway and heights are limited largely to a maximum of
							three storeys directly on the road — though taller structures do exist immediately to
							the south of the street, especially in its western segment. Many properties along Queen
							Street have alley access to the north and south. There is also a small strip mall in the
							extreme western segment of the street.
						</p>
						<p>
							The street is served by multiple transit routes, most prominently a TTC streetcar route.
							While there is not bike infrastructure on the street beyond parking, there are protected
							bike lanes on some parallel streets.
						</p>
						<p>
							The most significant change in built-form along the route is the Centre for Addiction
							and Mental Health (CAMH), which occupies a significant property between Shaw and White
							Squirrel on the south of the street. On this stretch, the north side largely maintains
							the prevalent form, but in recent years CAMH has built a number of eight to ten storey
							institutional and mixed-use buildings as well as extended the street grid from the north
							to the south.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<div class="legend-container">
						<LegendItem
							variant={'polygon'}
							label={'West Queen West BIA'}
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
						<SatelliteCheckbox casestudy={'westqueenwest'} section={'builtform'} />
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clp1i0fls00wg01ntg6hdbldy'}
						center={[-79.4145, 43.64408]}
						zoom={15}
						minZoom={15}
						pitch={40}
						bearing={-15}
						layers={[
							'westqueenwest',
							'westqueenwest-fill',
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
							<IsochroneCheckbox section={'civicinfra'} layer={'wqw-isochrone'} />
							<EmploymentSizeCheckbox
								section={'civicinfra'}
								layers={[
									'civicinfra-toronto-education',
									'civicinfra-toronto-govt-community',
									'civicinfra-toronto-arts-culture',
									'civicinfra-toronto-health',
									'civicinfra-toronto-recreation'
								]}
							/>
						</div>
					</div>
					{#if fr}
						<p>
							L’exemple le plus marquant d’infrastructure civique sur la rue est le CAMH,
							qui occupe plusieurs îlots et qui emploie et sert des milliers de
							travailleurs et de patients. On trouve également plusieurs services médicaux
							connexes dans le quartier.
						</p>
						<p>
							À l’est du CAMH, le cœur de Queen Street se trouve peut-être au parc Trinity
							Bellwoods, un espace vert de 15,4 hectares. Le parc abrite un grand centre
							communautaire très fréquenté, une aire d’exercice sans laisse pour chiens et
							des terrains de sport. Le parc sert depuis des années de pôle communautaire
							et de lieu de rassemblement dans l’ouest de Toronto.
						</p>
						<p>
							Selon l’Indice d’infrastructure civique, West Queen West surpasse la plupart
							des autres études de cas de rues principales. Sur le plan des possibilités
							civiques, West Queen West se classe au 6e rang sur 20 rues principales de
							Toronto et au 9e rang sur 36 rues principales résidentielles.
						</p>
					{:else}
						<p>
							The most prominent example of civic infrastructure on the street is CAMH, occupying
							multiple blocks, employing and serving thousands of workers and patients. There are also
							a number of related medical services in the neighbourhood.
						</p>
						<p>
							East of CAMH, Queen Street’s heart might be best found at Trinity Bellwoods Park, a 15.4
							hectares green space. Within the park is a large, and popular, community centre, dog
							off-leash space and sports fields. The park has served as a community hub and gathering
							space in Toronto’s west end for years.
						</p>
						<p>
							According to the Civic Infrastructure Index, West Queen West surpasses most other main
							street case studies. In terms of its civic opportunity, West Queen West ranks 6th out of
							20 Toronto main streets and 9th out of 36 residential main streets.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clp1i0fls00wg01ntg6hdbldy'}
						center={[-79.4154, 43.6441]}
						zoom={14.7}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={[
							'westqueenwest',
							'westqueenwest-fill',
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
							<IsochroneCheckbox section={'business'} layer={'wqw-isochrone'} />
							<EmploymentSizeCheckbox
								section={'business'}
								layers={[
									'business-toronto-retail',
									'business-toronto-services',
									'business-toronto-food-drink'
								]}
							/>
						</div>
					</div>
					{#if fr}
						<p>
							West Queen West est un secteur commercial établi, qui compte de nombreuses
							boutiques de mode de petite et moyenne taille le long de la rue — avec des
							concentrations particulières de vêtements décontractés, de lunettes et de
							chaussures selon les îlots. D’autres commerces de détail sont présents le
							long de la rue et offrent une vaste gamme de produits, des boulangeries aux
							dépanneurs en passant par les magasins de jouets.
						</p>
						<p>
							Les services sont relativement diversifiés, avec une prédominance de
							restaurants — formels, décontractés et de restauration rapide. Aucun
							supermarché ne donne directement sur la rue dans ce tronçon, mais on en
							trouve plusieurs juste à côté de la rue ou dans les tronçons à l’est et à
							l’ouest.
						</p>
						<p>
							On trouve plusieurs salles de spectacles et lieux d’événements, surtout dans
							le tronçon ouest de la rue, qui attirent souvent de grandes foules pour des
							concerts et d’autres événements.
						</p>
						<p>
							West Queen West surpasse d’autres études de cas de rues principales en ce
							qui concerne le niveau d’indépendance des entreprises, se classant au 6e
							rang sur 20 rues principales de Toronto et au 10e rang sur 36 rues
							principales résidentielles.
						</p>
						<p>
							Sur le plan de la densité commerciale, la rue se classe au 8e rang sur 20
							rues principales dans la région et au 13e rang sur 36 rues principales
							résidentielles.
						</p>
					{:else}
						<p>
							West Queen West is an established retail district, with many small to medium fashion
							stores along the street — with specific concentrations of casual wear, eye glasses, and
							shoes in different blocks. Other retail exists along the street, covering a vast range
							of items from bakeries to convenience stores to toy stores.
						</p>
						<p>
							The services are relatively diverse, with a focus on restaurants — both formal, casual
							and fast food. No supermarket grocery store directly fronts the street on this stretch,
							but there are many located just off the street or on segments to the east and west.
						</p>
						<p>
							There are a number of event venues, especially in the western segment of the street
							which often draw large crowds for concerns and other events.
						</p>
						<p>
							West Queen West surpasses other Main Street case studies in terms of level of
							independence of businesses, ranking 6th out of 20 Toronto Main Streets and 10th out of
							36 residential Main Streets.
						</p>
						<p>
							In terms of business density, the street ranks 8th out of 20 main streets in the region
							and 13th out of 36 residential main streets.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clp1i0fls00wg01ntg6hdbldy'}
						center={[-79.4154, 43.6441]}
						zoom={14.7}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={[
							'westqueenwest',
							'westqueenwest-fill',
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
							L’emploi le long de la rue est en grande partie réparti entre des centaines
							de petites entreprises, certaines employant davantage de personnes. Le CAMH
							est un employeur important le long de la rue — mais la plupart des grands
							employeurs sont concentrés juste à l’est, au centre-ville, ou au sud, dans
							Liberty Village, plutôt que sur la rue elle-même.
						</p>
						<p>
							Dans l’ensemble, West Queen West affiche une densité d’emploi très élevée.
							La rue se classe au 3e rang sur 20 rues principales de Toronto pour la
							densité d’emploi et au 1er rang sur 36 rues principales résidentielles.
						</p>
					{:else}
						<p>
							Employment along the street is largely distributed across hundreds of small businesses,
							with some businesses employing more. CAMH is a sizeable employer along the street — but
							most large employers are concentrated just east, in downtown, or south, in Liberty
							Village, of the street itself.
						</p>
						<p>
							Overall, West Queen West has very high employment density. It ranks 3rd out of 20
							Toronto Main Streets in terms of employment density and 1st out of 36 residential main
							streets.
						</p>
					{/if}
					<img id="employmentsizelegend" src={fr ? EmpSizeLegendFr : EmpSizeLegend} alt={fr ? 'Légende' : 'legend'} />
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clp1i0fls00wg01ntg6hdbldy'}
						center={[-79.4154, 43.6441]}
						zoom={14.5}
						minZoom={14}
						pitch={20}
						bearing={-15}
						layers={['westqueenwest', 'westqueenwest-fill', 'employment-size']}
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
							casestudy={'westqueenwest'}
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
							On observe une division générale de la typologie résidentielle entre le nord
							et le sud de West Queen West. Au nord de la rue, la forme de logement
							prédominante est constituée de petits immeubles d’appartements de moins de
							cinq logements et de duplex. Ce secteur compte aussi des maisons
							unifamiliales et individuelles. Du côté sud de la rue, les tours de
							copropriétés et d’appartements dominent. Il existe des exceptions, ainsi que
							de nombreux exemples d’immeubles d’appartements de hauteur moyenne tout le
							long de la rue. De façon générale, toutefois, le secteur situé sur West
							Queen West et aux alentours est dominé par les tours d’appartements.
						</p>
						<p>
							De façon générale, la densité de population est élevée pour le Canada et la
							région du Grand Toronto (RGT) dans l’ensemble du secteur, bien que le sud de
							la rue soit beaucoup plus dense en raison de l’augmentation de la
							construction au cours des 20 dernières années. En revanche, les quartiers au
							nord de la rue ont vu leur population se stabiliser ou diminuer au cours de
							la même période, à mesure que des bâtiments de deux ou trois logements
							étaient convertis en maisons unifamiliales.
						</p>
					{:else}
						<p>
							There is a general split in the housing typology north and south of West Queen West.
							North of the street, the predominant housing form are smaller apartment buildings with
							less than five units and duplexes. This area also features single-family and detached
							homes. On the southern side of the street, high-rise condominium and apartment buildings
							dominate. There are exceptions to this and numerous examples of mid-rise apartment
							buildings throughout the street. In general, however, the area on and surrounding West
							Queen West is dominated by high-rise apartments.
						</p>
						<p>
							Generally, the population density is high for Canada and the GTA throughout the area,
							though south of the street is much denser with increased construction in the last 20
							years. In contrast, the neighbourhoods north of the street have seen stable or declining
							populations in the same period as two-to-three unit buildings are converted into
							single-family houses.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clp1i0fls00wg01ntg6hdbldy'}
						center={[-79.4154, 43.6441]}
						zoom={14.7}
						minZoom={14}
						pitch={0}
						bearing={-15}
						layers={['westqueenwest-outline', 'populationdensity']}
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
							casestudy={'westqueenwest'}
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
							En moyenne, West Queen West et les quartiers qui l’entourent se
							caractérisent par de petits ménages d’environ une personne. Les quartiers
							entourant West Queen West sont plus scolarisés et comptent moins de
							personnes immigrantes de première génération que la moyenne régionale. Ces
							secteurs présentent également une combinaison d’âges moyens relativement
							diversifiée, les moyennes des quartiers entourant West Queen West allant
							d’environ 30 ans jusqu’à environ 80 ans. De plus, les résidents de West
							Queen West et des secteurs environnants sont plus susceptibles de se situer
							à la fois dans le quintile de revenu supérieur et dans le décile de revenu
							inférieur — ce qui indique une répartition polarisée des revenus et une
							faible représentation des ménages à revenu moyen.
						</p>
					{:else}
						<p>
							On average, both West Queen West and the neighbourhoods surrounding the street are
							characterized by small households of approximately one-person. The neighbourhoods
							surrounding West Queen West are more highly educated and less likely to be a
							first-generation immigrant than the regional average. These areas also include a
							relatively diverse mix of average ages, with averages in the neighbourhoods surrounding
							West Queen West ranging from around 30 years old all the way to approximately 80 years
							old. Additionally, residents of West Queen West and the surrounding areas are more
							likely to be both in the upper quintile of income and more likely to be in the bottom
							decile of income — indicating a polarized income distribution with limited
							representation of middle income households.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clp1i0fls00wg01ntg6hdbldy'}
						center={[-79.4154, 43.6441]}
						zoom={14.5}
						minZoom={14}
						pitch={0}
						bearing={-15}
						layers={['westqueenwest-outline', 'average-age']}
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
							West Queen West attire des visiteurs de toute la région du Grand Toronto,
							mais la grande majorité des visites proviennent de résidents de Toronto. De
							plus, le rayon d’origine des visiteurs a diminué entre 2019 et 2022, ce qui
							indique que la pandémie de COVID-19 a influé sur la distance que les
							résidents étaient prêts à parcourir pour visiter West Queen West. Par
							ailleurs, bien que le niveau de visites par rapport à 2019 se situe
							actuellement juste au-dessus de 80 %, ce qui témoigne d’une reprise
							relativement solide des visites après la pandémie, le nombre de visiteurs a
							considérablement diminué. Cette baisse est surtout marquée chez les
							visiteurs occasionnels.
						</p>
						<p>
							De façon générale, l’achalandage est le plus élevé les vendredis et samedis
							ainsi qu’en fin d’après-midi ou en soirée, ce qui souligne l’importance de
							West Queen West en tant que rue commerçante — la plupart des visites ayant
							lieu en dehors des heures normales d’ouverture.
						</p>
						<p>
							Sur le plan de la résilience globale de la rue et de la reprise des visites,
							West Queen West se classe derrière d’autres études de cas de rues
							principales. La rue se classe au 17e rang sur 20 dans la région pour la
							résilience en matière de visites et au 35e rang sur 36 rues principales
							résidentielles.
						</p>
					{:else}
						<p>
							West Queen West does draw visitors from throughout the Greater Toronto Area, but the
							vast majority of visits come from local residents within Toronto. Additionally, the
							radius from where visitors originated from has decreased between 2019 and 2022,
							indicating that the COVID-19 pandemic impacted the distance residents were willing to
							travel to visit West Queen West. Additionally, while the level of visits relative to
							2019 currently hovers just over 80 percent, indicating relatively strong visitor
							recovery from the pandemic, the number of visitors has decreased significantly. This
							decrease in visitors is seen most prominently with infrequent visitors.
						</p>
						<p>
							Generally, visitor traffic is heaviest on Fridays and Saturdays and in the late
							afternoon or evening which highlights the importance of West Queen West as a commercial
							street – as most visits occur outside of normal business hours.
						</p>
						<p>
							In terms of overall street resilience and visitor recovery, West Queen West trails
							behind other main street case studies. It ranks 17th out of 20 in visitor resiliency in
							the region and 35th out of 36 residential main streets.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clp1i0fls00wg01ntg6hdbldy'}
						center={[-79.417, 43.6441]}
						zoom={9}
						pitch={0}
						bearing={-15}
						layers={['westqueenwest-outline', 'visitors-2022']}
						section={'visitors'}
						attribution={fr ? 'Institut urbain du Canada | Source des données : Environics Analytics' : 'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="legend-container">
						<Legend
							minlabel={'0'}
							maxlabel={'58400'}
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
