<script>
	/* -------------------------------------------------------------------------- */
	/*                                   Imports                                  */
	/* -------------------------------------------------------------------------- */

	import FiftyAvenue from '../../../lib/assets/boundaries/edmontonboundaries/50Avenue.svg';
	import Title from '../../../lib/ui/Title.svelte';

	import EmpSizeLegend from '../../../lib/assets/employmentsizelegend.svg';
	import EmpSizeLegendFr from '../../../lib/assets/employmentsizelegend-fr.svg';

	import businessmix from '../../../lib/data/casestudydata/edmonton/50avenue/businessmix';
	import civicmix from '../../../lib/data/casestudydata/edmonton/50avenue/civicmix';
	import greenspace from '../../../lib/data/casestudydata/edmonton/50avenue/greenspace';
	import housingconstruction from '../../../lib/data/casestudydata/edmonton/50avenue/housingconstruction';
	import housingtype from '../../../lib/data/casestudydata/edmonton/50avenue/housingtype';
	import visitordayofweek from '../../../lib/data/casestudydata/edmonton/50avenue/visitordayofweek';
	import visitortimeofday from '../../../lib/data/casestudydata/edmonton/50avenue/visitortimeofday';
	import visitortraffic from '../../../lib/data/casestudydata/edmonton/50avenue/visitortraffic';
	import visitortypes from '../../../lib/data/casestudydata/edmonton/50avenue/visitortypes';

	import { timeFormat } from 'd3-time-format';
	import CaseStudyMap from '../../../lib/ui/CaseStudyMap.svelte';
	import EmploymentSizeCheckbox from '../../../lib/ui/checkbox/EmploymentSizeCheckbox.svelte';
	import IsochroneCheckbox from '../../../lib/ui/checkbox/IsochroneCheckbox.svelte';
	import SatelliteCheckbox from '../../../lib/ui/checkbox/SatelliteCheckbox.svelte';
	import Dropdown from '../../../lib/ui/Dropdown.svelte';
	import Legend from '../../../lib/ui/legends/Legend.svelte';
	import LegendItem from '../../../lib/ui/legends/LegendItem.svelte';

	import { BarChart, ColumnChart, LineChart } from '@onsvisual/svelte-charts';

	import RangeSlider from 'svelte-range-slider-pips';

	import { visitorMapStore } from '../../../lib/stores/mapStore';

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

	let map = null;

	/* -------------------------------------------------------------------------- */
	/*                                   Stores                                   */
	/* -------------------------------------------------------------------------- */

	visitorMapStore.subscribe((value) => {
		map = value;
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
	<Title outline={FiftyAvenue} name={'50 Avenue (Leduc)'} location={'Edmonton, Alberta'} />
	<div class="container">
		<section data-id="map1">
			<div class="section-container">
				<div class="content-container sticky-content">
					<h2>{fr ? 'Vue d’ensemble' : 'Overview'}</h2>
					{#if fr}
						<p>
							L’étude de cas vise à offrir une vue d’ensemble de la zone étudiée au moyen
							d’une combinaison de cartes interactives, de graphiques et d’analyses de
							données.
						</p>
						<p>
							La carte présente les limites de l’étude de cas, superposées au réseau de
							rues principales.
						</p>
					{:else}
						<p>
							The case study aims to provide an overview of the case study area; through a combination
							of interactive maps, charts and data analysis.
						</p>
						<p>
							The map displays the boundaries of the case study, overlaid on the main street network.
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
							label={'50 Avenue'}
							bgcolor={'#ffdd33'}
							bordercolor={'#c4ad37'}
						/>
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clt4ms9rr02i701p4f1h72p78'}
						center={[-113.55, 53.265]}
						zoom={15}
						pitch={50}
						bearing={0}
						layers={['mainstreets-edmonton', '50avenue', '50avenue-fill']}
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
							Le cadre bâti de la zone étudiée est représenté par la couche des bâtiments
							en 3D, les arrêts et lignes de transport collectif ainsi que les espaces
							verts, accompagnés d’un graphique comparant le pourcentage d’espaces verts
							dans la zone étudiée, dans un rayon de 10 minutes de marche et dans la
							région métropolitaine de recensement où se trouve l’étude de cas. Utilisez
							le bouton « Vue satellite » pour afficher la zone étudiée superposée à
							l’imagerie satellite.
						</p>
					{:else}
						<p>
							The built form of the case study area is represented through the 3D building layer,
							transit stops and lines, as well as green space, including a comparative graph of the %
							of green space present within the case study area, a 10 minute walk radius and in the
							Census Metropolitan Area the case study is located in. Use the Satellite View toggle to
							see the case study area overlaid with satellite imagery.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<div class="legend-container">
						<LegendItem
							variant={'polygon'}
							label={'50 Avenue'}
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
						<SatelliteCheckbox casestudy={'50avenue'} section={'builtform'} />
					</div>
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clt4ms9rr02i701p4f1h72p78'}
						center={[-113.55, 53.265]}
						zoom={15.5}
						minZoom={15}
						pitch={60}
						bearing={0}
						layers={[
							'50avenue',
							'50avenue-fill',
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
								layer={'50avenue-isochrone'}
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
							L’infrastructure civique présente dans la zone étudiée est représentée selon
							5 catégories : Éducation, Services gouvernementaux et communautaires, Arts
							et culture, Loisirs et Santé. Pour en savoir plus sur la façon dont nous
							avons classé ces catégories, consultez notre section <a
							href="/about/data-methodology">Données et méthodologie</a >. Le graphique
							présente la répartition proportionnelle de l’infrastructure civique dans la
							zone étudiée, dans un rayon de 10 minutes de marche et dans la région
							métropolitaine de recensement où se trouve l’étude de cas.
						</p>
						<p>
							Cliquez sur les boutons « Rayon de 10 minutes de marche » et « Taille des entreprises » pour afficher un rayon de 10 minutes de marche autour de la zone
							étudiée ainsi que le nombre estimé d’employés de chaque lieu
							d’infrastructure civique.
						</p>
					{:else}
						<p>
							Civic Infrastructure present in the case study area is represented through 5 categories:
							Education, Government & Community Services, Arts & Culture, Recreation, and Healthcare.
							For more information about how we classified these categories, read our <a
								href="/about/data-methodology">Data and Methodology</a
							>. The graph displays the proportional mix of Civic Infrastucture in the case study
							area, a 10 minute walk radius and in the Census Metropolitan Area the case study is
							located in.
						</p>
						<p>
							Click on the 10 Minute Walk and Employment Size toggles to view a 10 minute walk radius
							of the case study area, as well as the estimated employment sizes of each location of
							Civic Infrastructure.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clt4ms9rr02i701p4f1h72p78'}
						center={[-113.55, 53.265]}
						zoom={14.5}
						minZoom={13}
						pitch={0}
						bearing={0}
						layers={[
							'50avenue',
							'50avenue-fill',
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
								layer={'50avenue-isochrone'}
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
							Les commerces de rue principale présents dans la zone étudiée sont
							représentés selon 3 catégories : Commerce de détail, Restauration et
							boissons et Services de proximité. Pour en savoir plus sur la façon dont
							nous avons classé ces catégories, consultez notre section <a
							href="/about/data-methodology" >Données et méthodologie</a >. Le graphique
							présente la répartition proportionnelle des commerces de rue principale dans
							la zone étudiée, dans un rayon de 10 minutes de marche et dans la région
							métropolitaine de recensement où se trouve l’étude de cas.
						</p>
						<p>
							Cliquez sur les boutons « Rayon de 10 minutes de marche » et « Taille des entreprises » pour afficher un rayon de 10 minutes de marche autour de la zone
							étudiée ainsi que le nombre estimé d’employés de chaque commerce de rue
							principale.
						</p>
					{:else}
						<p>
							Main Street Businesses present in the case study area are represented through 3
							categories: Retail, Food & Drink and Local Services. For more information about how we
							classified these categories, read our <a href="/about/data-methodology"
								>Data and Methodology</a
							>. The graph displays the proportional mix of Main Street Businesses in the case study
							area, a 10 minute walk radius and in the Census Metropolitan Area the case study is
							located in.
						</p>
						<p>
							Click on the 10 Minute Walk and Employment Size toggles to view a 10 minute walk radius
							of the case study area, as well as the estimated employment sizes of each Main Street
							Business.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clt4ms9rr02i701p4f1h72p78'}
						center={[-113.55, 53.265]}
						zoom={14.5}
						minZoom={13}
						pitch={0}
						bearing={0}
						layers={[
							'50avenue',
							'50avenue-fill',
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
							Le nombre estimé d’employés de toutes les entités, y compris les commerces
							de rue principale, l’infrastructure civique et les autres, est affiché sur
							cette carte. Pour en savoir plus sur la façon dont nous l’avons calculé,
							consultez notre section <a href="/about/data-methodology">Données et
							méthodologie</a>.
						</p>
					{:else}
						<p>
							The estimated employment size of all entities, including main street businesses, civic
							infrastructure and others, are displayed on this map. For more information about how we
							calculated these, read our <a href="/about/data-methodology">Data and Methodology</a>.
						</p>
					{/if}
					<img id="employmentsizelegend" src={fr ? EmpSizeLegendFr : EmpSizeLegend} alt={fr ? 'Légende' : 'legend'} />
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clt4ms9rr02i701p4f1h72p78'}
						center={[-113.55, 53.265]}
						zoom={14.5}
						minZoom={13}
						pitch={0}
						bearing={0}
						layers={['50avenue', '50avenue-fill', 'employment-size']}
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
							casestudy={'50avenue'}
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
							La carte présente une visualisation choroplèthe des principales variables du
							recensement liées au logement, à l’échelle des aires de diffusion, pour la
							zone étudiée et ses environs. Utilisez le menu déroulant pour passer d’une
							variable à l’autre. Les données proviennent d’Environics Analytics et de
							Statistique Canada.
						</p>
						<p>
							Les graphiques comparent l’année de construction et les types de logements
							de la zone étudiée à ceux de la région métropolitaine de recensement où se
							trouve l’étude de cas.
						</p>
					{:else}
						<p>
							The map displays a choropleth vizualisation of key housing related Census variables at
							the Dissemination Area level of the case study and surrounding area. Use the dropdown to
							toggle between different variables. The data is sourced from Environics Analytics and
							Statistics Canada.
						</p>
						<p>
							The charts contrast the housing construction year and the types of housing between the
							case study area and the Census Metropolitan Area the case study is located in.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clt4ms9rr02i701p4f1h72p78'}
						center={[-113.55, 53.265]}
						zoom={14.5}
						minZoom={13}
						pitch={0}
						bearing={0}
						layers={['50avenue-outline', 'populationdensity']}
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
							casestudy={'50avenue'}
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
							La carte présente une visualisation choroplèthe des principales variables du
							recensement liées aux caractéristiques démographiques et à d’autres
							caractéristiques locales, à l’échelle des aires de diffusion, pour la zone
							étudiée et ses environs. Utilisez le menu déroulant pour passer d’une
							variable à l’autre. Les données proviennent d’Environics Analytics et de
							Statistique Canada.
						</p>
					{:else}
						<p>
							The map displays a choropleth vizualisation of key demograhoic and other local
							characteristic related Census variables at the Dissemination Area level of the case
							study and surrounding area. Use the dropdown to toggle between different variables. The
							data is sourced from Environics Analytics and Statistics Canada.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clt4ms9rr02i701p4f1h72p78'}
						center={[-113.55, 53.265]}
						zoom={14.5}
						minZoom={13}
						pitch={0}
						bearing={0}
						layers={['50avenue-outline', 'average-age']}
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
							La carte de chaleur illustre la répartition des visites quotidiennes selon
							le lieu de résidence des personnes visiteuses, de 2019 à 2022, à partir des
							données MobileScapes d’Environics Analytics. Pour en savoir plus, consultez
							notre section <a href="/about/data-methodology">Données et méthodologie</a
							>.
						</p>
						<p>
							Les graphiques présentent l’évolution des visites (par rapport à 2019) sous
							forme de graphique linéaire, le nombre de visites par type de visiteur ainsi
							que la répartition des visites selon le moment de la journée et le jour de
							la semaine.
						</p>
					{:else}
						<p>
							The heatmap displayed represents the pattern of daily visits from the visitor's home
							location from 2019 to 2022, which is sourced from Environics Analytics MobileScapes
							data. To learn more, read our <a href="/about/data-methodology">Data and Methodology</a
							>.
						</p>
						<p>
							The charts display the pattern of visits (relative to 2019) as a line chart, the visit
							count by type of visitor, as well as the breakdown of visits by time of day and week.
						</p>
					{/if}
				</div>
				<div class="map-container">
					<CaseStudyMap
						style={'mapbox://styles/canadianurbaninstitute/clt4ms9rr02i701p4f1h72p78'}
						center={[-113.55, 53.265]}
						zoom={9}
						pitch={0}
						bearing={0}
						layers={['50avenue-outline', 'visitors-2022']}
						section={'visitors'}
						attribution={fr ? 'Institut urbain du Canada | Source des données : Environics Analytics' : 'Canadian Urban Institute | Data Source: Environics Analytics'}
					/>
					<div class="legend-container">
						<Legend
							minlabel={'0'}
							maxlabel={fr ? '20 100' : '20,100'}
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
