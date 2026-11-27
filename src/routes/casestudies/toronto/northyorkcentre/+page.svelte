<script>
	/* -------------------------------------------------------------------------- */
	/*                                   Imports                                  */
	/* -------------------------------------------------------------------------- */

	import northyorkcentre from '../../../lib/assets/boundaries/torontoboundaries/NorthYorkCentre.svg';
	import Title from '../../../lib/ui/Title.svelte';

	import EmpSizeLegend from '../../../lib/assets/employmentsizelegend.svg';
	import EmpSizeLegendFr from '../../../lib/assets/employmentsizelegend-fr.svg';

	import businessmix from '../../../lib/data/casestudydata/toronto/northyorkcentre/businessmix';
	import civicmix from '../../../lib/data/casestudydata/toronto/northyorkcentre/civicmix';
	import greenspace from '../../../lib/data/casestudydata/toronto/northyorkcentre/greenspace';
	import housingconstruction from '../../../lib/data/casestudydata/toronto/northyorkcentre/housingconstruction';
	import housingtype from '../../../lib/data/casestudydata/toronto/northyorkcentre/housingtype';
	import visitordayofweek from '../../../lib/data/casestudydata/toronto/northyorkcentre/visitordayofweek';
	import visitortimeofday from '../../../lib/data/casestudydata/toronto/northyorkcentre/visitortimeofday';
	import visitortraffic from '../../../lib/data/casestudydata/toronto/northyorkcentre/visitortraffic';
	import visitortypes from '../../../lib/data/casestudydata/toronto/northyorkcentre/visitortypes';

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
	<Title outline={northyorkcentre} name={'North York Centre'} location={'Toronto, Ontario'} />
	<div class="container">
		<section data-id="map1">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>{fr ? 'Vue d’ensemble' : 'Overview'}</h2>
					{#if fr}
						<p>
							Ce tronçon de Yonge Street formait le cœur civique de North York avant la
							fusion de celle-ci avec la Ville de Toronto en 1998. Aujourd’hui, il s’agit
							du plus grand centre urbain de la ville à l’extérieur du centre-ville.
						</p>
						<p>
							Pendant le boom démographique d’après-guerre que connaissait North York, ses
							institutions municipales ont été construites le long de Yonge Street. Depuis
							l’ouverture des stations de métro Finch, North York Centre et Sheppard de la
							ligne 1 dans les années 1970 et 1980, le secteur a connu un essor de projets
							planifiés en fonction de l’accessibilité au transport collectif et de la vie
							piétonne.
						</p>
						<p>
							La zone d’étude de North York Centre s’étend de l’autoroute 401 au sud
							jusqu’à Hendon Avenue et Bishop Avenue au nord, et est délimitée par
							Beecroft Rd à l’ouest et par Doris Ave jusqu’à Bonnington Pl à l’est. Ce
							tronçon de Yonge Street se trouve dans l’arrondissement de North York, à
							Toronto.
						</p>
					{:else}
						<p>
							This segment of Yonge Street formed the civic heart of North York before amalgamation
							into the City of Toronto in 1998. Today, it is the city's largest urban centre outside
							of the downtown core.
						</p>
						<p>
							As North York experienced a post-war population boom, its municipal institutions were
							built along Yonge Street. Since the opening of Line 1's Finch, North York Centre, and
							Sheppard subway stations in the 70s and 80s, the area has seen a boom in development
							planned around transit accessibility and pedestrian life.
						</p>
						<p>
							The North York Centre study area extends from Highway 401 in the south to Hendon and
							Bishop Avenues in the north, and is bound by Beecroft Rd to the west and Doris Ave to
							Bonnington Pl to the east. This segment of Yonge Street is located in the North York
							borough of Toronto.
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
							label={'North York Centre BIA'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq5d860p01au01p6hcwadd6k'}
						center={[-79.4118, 43.7659]}
						zoom={13}
						pitch={50}
						bearing={0}
						layers={['mainstreets-toronto', 'northyorkcentre', 'northyorkcentre-fill']}
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
							North York Centre est considéré comme le troisième centre-ville de Toronto.
							L’ensemble du corridor est très dense et présente un fort potentiel
							piétonnier, s’étendant sur deux ou trois bâtiments de profondeur de part et
							d’autre de Yonge Street. Des tours modernes de bureaux et d’habitation
							dominent l’horizon au-dessus de la trame d’origine de Yonge Street,
							antérieure aux années 1980, composée de petites devantures attenantes.
						</p>
						<p>
							Le paysage de rue de Yonge Street est délibérément conçu pour offrir une
							expérience piétonne confortable, malgré la largeur de l’emprise routière,
							grâce à de larges trottoirs, des parcs, des aménagements paysagers et même
							des mesures pour atténuer le refroidissement éolien.
						</p>
						<p>
							Curieusement, dès qu’on s’éloigne d’un îlot à l’est ou à l’ouest de Yonge
							Street, la trame à haute densité de l’aménagement axé sur le transport
							collectif cède immédiatement la place à une trame de rues en damier bordées
							de logements de banlieue à faible densité. Même les tours résidentielles
							situées entre les deux sont construites sur des lots de type superîlot. Cela
							limite les interactions entre Yonge Street et les banlieues d’après-guerre
							environnantes.
						</p>
					{:else}
						<p>
							North York Centre is considered Toronto's third downtown. The entire corridor is highly
							dense and walkable, going two or three buildings deep on either side of Yonge Street.
							Modern high-rise towers of offices and residential fill the skyline above Yonge Street's
							original pre-80s pattern of small, interconnected storefronts.
						</p>
						<p>
							Yonge Street's streetscape is deliberately designed for a comfortable pedestrian
							experience, despite the wide vehicular right-of-way, with wide sidewalks, parks,
							landscaping, and even measures to mitigate wind chill.
						</p>
						<p>
							Peculiarly, going one block east or west away from Yonge Street, the high density
							pattern of transit-oriented development reverts immediately to a grid street pattern of
							low-density suburban housing. Even the residential towers inbetween are built on
							superblock-style lots. This limits interaction between Yonge Street and the surrounding
							post-war suburbs.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<div class="legend-container">
						<LegendItem
							variant={'polygon'}
							label={'North York Centre'}
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
						<SatelliteCheckbox casestudy={'northyorkcentre'} section={'builtform'} />
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq5d860p01au01p6hcwadd6k'}
						center={[-79.4104, 43.7616]}
						zoom={15}
						minZoom={15}
						pitch={60}
						bearing={-15}
						layers={[
							'northyorkcentre',
							'northyorkcentre-fill',
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
								layer={'northyorkcentre-isochrone'}
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
							Des parcs, des zones ombragées par les arbres et des bancs bordent ce
							tronçon de Yonge Street. La zone d’amélioration commerciale (BIA) Yonge
							North York a installé des tables de pique-nique tout le long du tronçon de
							Yonge Street, ce qui incite les personnes qui résident, travaillent ou se
							rendent dans le secteur à s’y attarder.
						</p>
						<p>
							Le Mel Lastman Square, élément civique central de North York Centre, est un
							espace ouvert de 20 000 pieds carrés comprenant une cour-jardin, un
							amphithéâtre extérieur, des fontaines et un bassin miroir qui se transforme
							en patinoire l’hiver. La place accueille de nombreuses activités, dont des
							festivals culturels, des concerts et des manifestations politiques.
						</p>
						<p>
							Selon l’Indice d’infrastructure civique, Yonge Street à North York Centre
							accuse un retard sur la moitié des études de cas de rues principales de
							Toronto en matière de possibilités civiques, se classant au 11e rang sur 20
							et au dernier rang sur 12 rues principales de centre-ville. Cela pourrait
							s’expliquer par la fusion de North York avec la Ville de Toronto et le
							déplacement subséquent des grandes institutions civiques vers le
							centre-ville de Toronto.
						</p>
					{:else}
						<p>
							Parks, tree-shaded areas, and benches line this segment of Yonge Street. The Yonge North
							York BIA has added picnic tables throughout the Yonge Street segment encouraging
							residents, visitors, and workers alike to linger in the area.
						</p>
						<p>
							Mel Lastman Square, the central civic feature of North York Centre, is a 20,000 square
							foot open space featuring a garden court, an outdoor ampitheatre, fountains, and a
							reflecting pool that turns into a wintertime ice rink. The Square is used for many
							activities, including cultural festivals, concerts, and political demonstrations.
						</p>
						<p>
							According to the Civic Infrastructure Index, Yonge Street in North York Centre lags
							behind half of Toronto Main Streets case studies in terms of civic opportunity, at 11th
							out of 20, and last out of 12 Downtown Main Streets. This may be due to North York's
							amalgamation into the City of Toronto and the subsequent shift of major civic
							institutions to Toronto's downtown core.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq5d860p01au01p6hcwadd6k'}
						center={[-79.4126, 43.7675]}
						zoom={13.3}
						minZoom={13}
						pitch={0}
						bearing={-15}
						layers={[
							'northyorkcentre',
							'northyorkcentre-fill',
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
								layer={'northyorkcentre-isochrone'}
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
							Le tronçon de Yonge Street à North York Centre offre une gamme
							impressionnante de restaurants, de bars et d’activités culturelles. Les
							devantures anciennes et récentes de Yonge accueillent des chaînes
							internationales et des commerces locaux, reflet d’un quartier de plus en
							plus diversifié. Avec très peu de locaux commerciaux vacants, ce tronçon de
							Yonge Street est pleinement animé.
						</p>
						<p>
							Selon l’Indice des entreprises indépendantes, Yonge Street à North York
							Centre accuse un retard par rapport aux autres études de cas de rues
							principales sur le plan du niveau d’indépendance des entreprises, se
							classant 11e sur 20 rues principales de Toronto et 7e sur 12 rues
							principales de centre-ville.
						</p>
						<p>
							North York Centre se situe dans la moyenne pour la densité commerciale, au
							10e rang sur 20 rues principales de Toronto, mais accuse un retard sur la
							plupart des rues principales de centre-ville, au 9e rang sur 12.
						</p>
					{:else}
						<p>
							The North York Centre segment of Yonge Street boasts an impressive range of restaurants,
							bars, and cultural offerings. Old and new storefront on Yonge feature international
							chains and local offerings. reflective of the increasingly diverse neighbourhood. With
							very few vacant storefronts, this segment of Yonge Street is fully activated.
						</p>
						<p>
							According to the Independent Business Index, Yonge Street in North York Centre lags
							behind other Main Street case studies in terms of the level of business independence,
							ranking 11th out of 20 Toronto Main Streets and 7th out of 12 Downtown Main Streets.
						</p>
						<p>
							North York Centre is in the middle of the pack for business density, at 10th out of 20
							Toronto Main Streets and lags behind most Downtown Main Streets at 9th out of 12.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq5d860p01au01p6hcwadd6k'}
						center={[-79.4126, 43.7675]}
						zoom={13.3}
						minZoom={13}
						pitch={0}
						bearing={-15}
						layers={[
							'northyorkcentre',
							'northyorkcentre-fill',
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
							L’accès de North York Centre à trois stations de la ligne 1 et son accès
							direct à l’achalandée autoroute 401 permettent aux employeurs du secteur
							d’accéder à la main-d’œuvre régionale.
						</p>
						<p>
							North York Centre est un pôle d’emploi dense pour le nord de Toronto. Les
							petites devantures le long de Yonge Street et des rues perpendiculaires
							accueillent de petites entreprises comptant de zéro à cinq employés. Les
							plus grands employeurs, dont bon nombre comptent jusqu’à 50 employés et
							plusieurs jusqu’à 100, se trouvent dans de plus grands bâtiments.
						</p>
						<p>
							En matière de densité d’emploi, North York Centre se classe bien par rapport
							aux rues principales de Toronto, au 6e rang sur 20, mais occupe le dernier
							rang des 12 rues principales de centre-ville.
						</p>
						<p>
							Ce tronçon de Yonge Street croise deux corridors d’emploi est-ouest : le
							principal au sud, le long de Sheppard Ave, et un secondaire au nord, le long
							de Finch Ave.
						</p>
					{:else}
						<p>
							North York Centre's three-stop access to Line 1 and direct access to the busy 401
							Highway provides the area's employers access to the regional labour force.
						</p>
						<p>
							North York Centre is a dense employment hub for northern Toronto. The small storefronts
							along Yonge Street and on perpendicular streets accommodate small businesses with zero
							to five employees. Larger employers, many with up to 50 employees, and several up to
							100, are located in larger buildings.
						</p>
						<p>
							For employment density, North York Centre ranks well in comparison to Toronto Main
							Streets at 6th out of 20, but sits in last place for the 12 Downtown Main Streets.
						</p>
						<p>
							This Yonge Street segment intersects with two east-west employment corridors: the major
							one south along Sheppard Ave; a minor one north along Finch Ave.
						</p>
					{/if}

					<img id="employmentsizelegend" src={fr ? EmpSizeLegendFr : EmpSizeLegend} alt={fr ? 'Légende' : 'legend'} />
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq5d860p01au01p6hcwadd6k'}
						center={[-79.4126, 43.7675]}
						zoom={13.3}
						minZoom={13}
						pitch={0}
						bearing={-15}
						layers={['northyorkcentre', 'northyorkcentre-fill', 'employment-size']}
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
							casestudy={'northyorkcentre'}
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
							La zone d’étude de North York Centre a connu un essor de la construction
							résidentielle à partir de la fin des années 1980, qui a culminé durant la
							période 2001-2005 (alors que plus de 20 % du parc de logements a été
							construit), puis a diminué progressivement jusqu’à aujourd’hui. Plus de 80 %
							du parc total de logements de North York Centre et des environs est composé
							d’immeubles d’appartements de grande hauteur. Il en résulte un contraste
							important de densité de population entre la zone d’étude de North York
							Centre et les secteurs environnants. En raison de la concentration
							d’immeubles d’appartements de grande hauteur, la zone d’étude de North York
							Centre affiche une densité de population nettement plus élevée que les
							secteurs qui l’entourent.
						</p>
					{:else}
						<p>
							The North York Centre study area saw a late 80s housing construction boom, peaking in
							the 2001-2005 period (when over 20% of the housing stock was built), and steadily
							tapering off until present time. Over 80% of the total housing stock in North York
							Centre and the surrounding area are high-rise apartments. This results in a significant
							contrast in the population density within the North York Centre study area and the
							surrounding areas. As a result of the concentration of high rise apartments, the North
							York Centre study area has a significantly higher population density than areas
							surrounding it.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq5d860p01au01p6hcwadd6k'}
						center={[-79.4126, 43.7675]}
						zoom={13.3}
						minZoom={13}
						pitch={0}
						bearing={-15}
						layers={['northyorkcentre-outline', 'populationdensity']}
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
							casestudy={'northyorkcentre'}
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
							North York Centre est un quartier très diversifié, et cette diversité se
							reflète dans la zone de l’étude de cas. En effet, parmi l’ensemble des
							personnes résidentes, 69,7 % sont des personnes immigrantes récentes et
							70,1 % font partie d’une minorité visible. De plus, la majorité de ces
							personnes sont titulaires d’un baccalauréat, et le revenu annuel moyen
							d’emploi à temps plein des personnes qui résident dans cette zone d’étude
							s’élève à environ 93 000 $.
						</p>
					{:else}
						<p>
							North York Centre is a highly diverse neighbourhood and this diversity is represented in
							the case study area. Indeed, of all local residents, 69.7% are recent immigrants, and
							70.1% are visible minorities. Additionally, the majority of these residents hold a
							bachelors degree and the average individual full time annual employment income of
							residents in this study area is approximately $93,000.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq5d860p01au01p6hcwadd6k'}
						center={[-79.4126, 43.7675]}
						zoom={13.3}
						minZoom={13}
						pitch={0}
						bearing={-15}
						layers={['northyorkcentre-outline', 'average-age']}
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
							Le score de résilience de North York Centre se classe bien parmi les rues
							principales de Toronto, au 7e rang sur 20, et devance toutes les autres rues
							principales de centre-ville, au 1er rang.
						</p>
						<p>
							Bien que le nombre total de visites annuelles ait diminué par rapport au
							niveau prépandémique de 2019, le nombre de visites des personnes résidentes
							à North York Centre a augmenté pour dépasser 10 millions en 2022, surpassant
							ainsi le niveau de 2019.
						</p>
						<p>
							Fait intéressant, la période la plus achalandée de la journée est celle de
							minuit à 6 h, ce qui indique que ce tronçon de Yonge Street attire une
							clientèle nocturne, souvent à la recherche de restauration ou de
							divertissement en fin de soirée.
						</p>
					{:else}
						<p>
							North York Centre's Resiliency Score ranks well for Toronto Main Streets at 7th out of
							20, and beats all other Downtown Main Streets at 1st place.
						</p>
						<p>
							While total annual visits have decreased since the pre-pandemic 2019 level, the number
							of visits by residents to North York Centre increased to over 10 million in 2022
							surpassing the 2019 resident visitor rate.
						</p>
						<p>
							Interestingly, the busiest time of day is the 12am to 6am period, indicating that this
							segment of Yonge Street caters to an after hours crowd, often seeking late night food or
							entertainment.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clq5d860p01au01p6hcwadd6k'}
						center={[-79.417, 43.6441]}
						zoom={9}
						pitch={0}
						bearing={-15}
						layers={['northyorkcentre-outline', 'visitors-2022']}
						section={'visitors'}
						attribution={fr ? 'Institut urbain du Canada | Source des données : Environics Analytics' : 'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="legend-container">
						<Legend
							minlabel={'0'}
							maxlabel={fr ? '360 800' : '360,800'}
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
