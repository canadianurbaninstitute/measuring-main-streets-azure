<script>
	/* -------------------------------------------------------------------------- */
	/*                                   Imports                                  */
	/* -------------------------------------------------------------------------- */

	import Title from '../../../lib/ui/Title.svelte';
	import RueSainteCatherine from '../../../lib/assets/boundaries/montrealboundaries/RueSainteCatherine.svg';

	import EmpSizeLegend from '../../../lib/assets/employmentsizelegend.svg';

	import Summary from '../../../lib/ui/Summary.svelte';

	import greenspace from '../../../lib/data/casestudydata/montreal-fr/ruesaintecatherine/greenspace';
	import civicmix from '../../../lib/data/casestudydata/montreal-fr/ruesaintecatherine/civicmix';
	import businessmix from '../../../lib/data/casestudydata/montreal-fr/ruesaintecatherine/businessmix';
	import housingtype from '../../../lib/data/casestudydata/montreal-fr/ruesaintecatherine/housingtype';
	import housingconstruction from '../../../lib/data/casestudydata/montreal-fr/ruesaintecatherine/housingconstruction';
	import visitortraffic from '../../../lib/data/casestudydata/montreal-fr/ruesaintecatherine/visitortraffic';
	import visitortypes from '../../../lib/data/casestudydata/montreal-fr/ruesaintecatherine/visitortypes';
	import visitortimeofday from '../../../lib/data/casestudydata/montreal-fr/ruesaintecatherine/visitortimeofday';
	import visitordayofweek from '../../../lib/data/casestudydata/montreal-fr/ruesaintecatherine/visitordayofweek';

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
	<Title outline={RueSainteCatherine} name={'Rue Sainte-Catherine'} location={'Montreal, Québec'} />
	<LanguageSelector eng={'/casestudies/montreal/ruesaintecatherine'} fr={'/casestudies/montreal-fr/ruesaintecatherine-fr'} selected='fr'/>

	<div class="container">
		<section data-id="map1">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Vue d’ensemble</h2>
					<p>
						Située au cœur du quartier des Spectacles — le principal quartier culturel de Montréal —, la rue Sainte-Catherine est l’une des artères commerciales les plus emblématiques et les plus animées de Montréal. En tant que principale artère commerciale de la ville, elle joue un rôle crucial dans l’économie et le tissu culturel de Montréal. La rue s’étend sur plusieurs quartiers, offrant une gamme variée d’options de magasinage, de restauration et de divertissement, ce qui en fait une destination populaire pour les locaux et les touristes.
					</p>
					<p>
						Cette étude se concentre sur le segment de la rue Sainte-Catherine entre la rue Guy et la rue Jeanne Mance en raison de son emplacement au cœur du centre-ville, de la présence d’une SDC (Société de développement commercial) qui soutient activement les entreprises locales, et de son lien étroit avec le quartier des Spectacles. Ce secteur de la rue Sainte-Catherine est caractérisé par la présence de grands magasins, de boutiques, de restaurants, de grands centres commerciaux, du Musée d’art contemporain de Montréal et de festivals tels que le Festival international de jazz de Montréal et Les Francos de Montréal.
					</p>
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
							label={'Rue Sainte-Catherine'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr6vs03l00m101qv9wvk98ji'}
						center={[-73.569, 45.501]}
						zoom={13}
						pitch={50}
						bearing={0}
						layers={['mainstreets-montreal', 'ruesaintecatherine', 'ruesaintecatherine-fill']}
						section={'overview'}
					/>
				</div>
			</div>
		</section>
		<section data-id="map2">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>Forme bâtie</h2>
					<p>
						Cette section de la rue Sainte-Catherine présente une forme bâtie distincte qui change au fur et à mesure que l’on se déplace de l’extrémité est à l’extrémité ouest. Près de la rue Jeanne-Mance, à l’extrémité est, la rue a fait l’objet de rénovations qui ont permis d’élargir les trottoirs et de remplacer le stationnement dans la rue. Ici, la rue est caractérisée par une seule voie de circulation, ce qui permet de créer un environnement plus favorable aux piétons. Dans le quartier des Spectacles, près de la rue Jeanne-Mance, la rue Sainte-Catherine est entièrement piétonne et se fond dans les places et les espaces ouverts à l’extérieur du Musée d’art contemporain. Plus près de la rue Guy, à l’extrémité ouest du segment de rue, la rue n’a pas été rénovée récemment et comprend deux voies de circulation et deux voies de stationnement. Il est important de noter que tous les bâtiments situés le long de cette rue comprennent des commerces au rez-de-chaussée.
					</p>
					<p>
						La rue Sainte-Catherine est relativement mal desservie en matière d’espaces verts directement le long de la rue. Cependant, sa position centrale permet de disposer d’un grand nombre d’espaces verts à dix minutes de marche.
					</p>
				</div>
				<div class="map-container">
					<div class="legend-container">
						<LegendItem
							variant={'polygon'}
							label={'Rue Sainte-Catherine'}
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
						<SatelliteCheckboxFr casestudy={'ruesaintecatherine'} section={'builtform'} />
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr6vs03l00m101qv9wvk98ji'}
						center={[-73.5737, 45.4987]}
						zoom={15}
						minZoom={15}
						pitch={48}
						bearing={25}
						layers={[
							'ruesaintecatherine',
							'ruesaintecatherine-fill',
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
								layer={'ruesaintecatherine-isochrone'}
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
					<p>La rue Sainte-Catherine se trouve au cœur du centre-ville et est donc très bien desservie par tous les types d’infrastructures municipales. Le centre-ville étant une destination touristique de premier plan, le pourcentage d’infrastructures artistiques et culturelles y est beaucoup plus élevé que dans la moyenne de la RMR de Montréal.</p><p>À l’extrémité est du segment de rue se trouve la Place des Arts, le plus grand complexe culturel et artistique du Canada. Outre les salles de musique, les espaces culturels et les musées, la place elle-même remplit des fonctions civiques essentielles et est le lieu central de plusieurs festivals tout au long de l’année. La place est également très bien aménagée, avec des panneaux de signalisation, du mobilier urbain, des stations de rafraîchissement en été, et bien d’autres choses encore. C’est donc une place très animée qui attire de nombreux visiteurs et touristes.</p><p>Cette section de la rue Sainte-Catherine fait partie de la SDC du centre-ville qui coordonne une grande partie de la programmation de la rue. La signalisation et l’image de marque de la SDC sont présentes tout au long de la rue Sainte-Catherine et sur la Place des Arts.</p><p>Selon l’indice d’infrastructure municipale, la rue Sainte-Catherine se classe bien en matière de possibilités civiques. La rue se classe au 2e rang des 20 rues principales de Montréal et au 6e rang des 12 rues principales de centres-villes.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr6vs03l00m101qv9wvk98ji'}
						center={[-73.5729, 45.5009]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={[
							'ruesaintecatherine',
							'ruesaintecatherine-fill',
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
								layer={'ruesaintecatherine-isochrone'}
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
					<p>La rue Sainte-Catherine est la principale artère commerciale du centre-ville de Montréal, abritant une multitude d’entreprises qui s’alignent le long de ses rues et de ses environs. En outre, le vaste réseau souterrain de la ville, qui s’étend sur plus de 33 kilomètres et qui est connu sous le nom de ville souterraine, se croise sous la rue Sainte-Catherine et aux alentours, offrant un accès direct aux stations de métro et aux complexes commerciaux. Les centres commerciaux emblématiques du centre-ville, tels que le Centre Eaton et le Complexe Desjardins, sont facilement accessibles depuis la rue.</p><p>La majorité de ces commerces sont des commerces de détail, avec une prédominance de chaînes de magasins nationales et internationales telles que Uniqlo, Nike et Footlocker, aux côtés de diverses chaînes de restaurants et de restauration rapide régionales et nationales. À l’extrémité est, près de la Place des Arts, certains restaurants offrent des places en plein air pendant les mois d’été.</p><p>Selon l’indice des entreprises indépendantes, la rue Sainte-Catherine est à la traîne par rapport aux autres études de cas de la rue principale en matière de niveau d’indépendance des entreprises, se classant 18e sur 20 rues principales de Montréal et 10e sur 12 rues principales de centres-villes.</p><p>Cependant, la rue Sainte-Catherine se classe au premier rang de toutes les rues principales de Montréal et au premier rang de toutes les rues principales de centres-villes en matière de densité commerciale.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr6vs03l00m101qv9wvk98ji'}
						center={[-73.5729, 45.5009]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={[
							'ruesaintecatherine',
							'ruesaintecatherine-fill',
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
					<p>Situées dans le quartier central des affaires de Montréal, la rue Sainte-Catherine et ses zones environnantes constituent le principal pôle d’emploi de la ville. Ce secteur est caractérisé par un éventail diversifié d’employeurs, de tailles et d’industries variés. Compte tenu de la présence importante d’établissements de vente au détail et de restauration, une part considérable de la main-d’œuvre est employée dans ces secteurs. En outre, le paysage est marqué par la proéminence de grands immeubles de bureaux et de gratte-ciel, qui accueillent un nombre important de personnels d’entreprises et de bureaux. Bien que moins fréquentes, les perspectives d’emploi dans les infrastructures municipales voisines contribuent également à la main-d’œuvre de la zone.</p><p>Ainsi, la rue Sainte-Catherine se classe au premier rang de la région et au deuxième rang des rues principales de centres-villes en matière de densité d’emploi.</p>

					<img id="employmentsizelegend" src={EmpSizeLegend} alt="legend" />
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr6vs03l00m101qv9wvk98ji'}
						center={[-73.5729, 45.5009]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['ruesaintecatherine', 'ruesaintecatherine-fill', 'employment-size']}
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
							casestudy={'ruesaintecatherine'}
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
					<p>Le centre-ville de Montréal se caractérise principalement par une abondance d’immeubles de bureaux et de commerces, bien que l’activité résidentielle y soit toujours présente. Le paysage résidentiel sur et aux alentours de la rue Sainte-Catherine se compose principalement de condominiums et plus particulièrement de logements de luxe. Ces résidences sont principalement situées dans des tours d’habitation, dont la plupart ont été construites après 2016. En raison du coût élevé du développement et du logement dans cette zone, de nombreux logements sont relativement petits. Cela se reflète dans la faible densité de population de la zone, malgré un nombre élevé de logements, ce qui se traduit par un nombre réduit d’occupants par logement.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr6vs03l00m101qv9wvk98ji'}
						center={[-73.5729, 45.5009]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['ruesaintecatherine-outline', 'populationdensity']}
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
							casestudy={'ruesaintecatherine'}
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
					<p>Étant située au centre-ville et abritant des employeurs, des entreprises et des universités importantes, la rue Sainte-Catherine présente une démographie locale distincte, tant sur la rue qu’aux alentours. Le paysage résidentiel, principalement composé de petits logements qui ne conviennent pas aux familles, façonne également la démographie du quartier. Ces logements compacts s’adressent davantage à des individus qu’à des familles, ce qui se traduit par une moyenne d’âge et une taille des ménages plus faibles. De plus, la proximité d’employeurs importants et d’universités anglophones comme l’Université McGill et l’Université Concordia favorise un taux élevé d’immigrants récents, une prédominance de personnes de langue anglaise et une proportion importante de titulaires d’un baccalauréat.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr6vs03l00m101qv9wvk98ji'}
						center={[-73.5729, 45.5009]}
						zoom={14.5}
						minZoom={13.3}
						pitch={0}
						bearing={-15}
						layers={['ruesaintecatherine-outline', 'average-age']}
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
					<p>Le centre-ville de Montréal, comme la plupart des autres centres-villes d’Amérique du Nord, a connu une forte baisse du nombre de visiteurs quotidiens depuis la période précédant la pandémie de COVID-19. Notamment, le travail hybride et à distance a réduit le nombre de personnes qui se déplacent pour y travailler quotidiennement. Par conséquent, le nombre de visiteurs est aujourd’hui nettement inférieur à ce qu’il était avant la pandémie de COVID-19 en 2019. À l’heure actuelle, le niveau des visites par rapport à 2019 se situe juste en dessous de 50 %. Alors que le nombre de visiteurs locaux s’est relativement rétabli, le nombre et la fréquence des visiteurs récurrents et peu fréquents sont nettement inférieurs.</p><p>Par conséquent, la rue Sainte-Catherine se classe au dernier rang des 20 rues principales de Montréal et au 10e rang des 12 rues principales de centres-villes en matière de résilience de la rue et de récupération des visiteurs.</p><p>Pour remédier à cette situation, la Ville de Montréal a élaboré un certain nombre de nouvelles initiatives, de plans et de programmes tels qu’une zone nocturne de 24 heures et un plan de revitalisation du centre-ville afin de revitaliser le centre-ville et d’augmenter le nombre de visiteurs dans le secteur.</p>
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clr6vs03l00m101qv9wvk98ji'}
						center={[-73.5729, 45.5009]}
						zoom={9}
						pitch={0}
						bearing={-15}
						layers={['ruesaintecatherine-outline', 'visitors-2022']}
						section={'visitors'}
						attribution={'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="legend-container">
						<Legend
							minlabel={'0'}
							maxlabel={'98,700'}
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
	<Summary name={'Rue Sainte-Catherine'} location={'Montreal, Québec'} />
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
