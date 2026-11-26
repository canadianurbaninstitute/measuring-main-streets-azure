<script>
	import correlation from '../../lib/assets/graphics/correlation-plot.png';
	import resiliency from '../../lib/assets/graphics/resiliency.svg';
	import KeyFindings from '../../lib/ui/KeyFindings.svelte';
	import Title from '../../lib/ui/Title.svelte';
	import BarChart from './BarChart.svelte';
	import BarChartStacked from './BarChartStacked.svelte';
	import CaseStudyLocationsMap from './CaseStudyLocationsMap.svelte';
	import CivicBarChart from './CivicBarChart.svelte';
	import LineAreaChart from './LineAreaChart.svelte';

	import '../../styles.css';
	import { getLang } from '../../lib/i18n';

	const fr = getLang() === 'fr';

	// order of graphs: downtown, neighbourhood, small towns, malls
</script>

<Title
	outline={resiliency}
	name={fr ? 'Résilience des rues principales' : 'Main Street Resiliency'}
	location={fr
		? 'Analyse de la résilience des rues principales à partir de la fréquentation pendant la pandémie'
		: 'Analysing main street resiliency through visitor levels over the pandemic'}
/>

<div class="full-text">
	{#if fr}
	<p>
		Les rues principales du Canada ont subi d’énormes pressions tout au long de la pandémie de
		COVID-19, alors que la population restait à la maison et que l’achalandage chutait
		radicalement. Si toutes les rues principales ont été touchées, chacune a suivi sa propre
		trajectoire depuis le début de 2019. Certaines ont connu des baisses plus marquées que d’autres
		au début de la pandémie, et certaines se sont redressées plus rapidement au cours des années
		suivantes.
	</p>
	<p>
		L’IUC a mené une analyse statistique afin de déterminer quelles caractéristiques des rues
		principales sont le plus fortement corrélées à leur niveau de résilience. Nous avons dégagé deux
		constats clés&nbsp;: d’abord, les rues les plus résilientes de 2019 à 2022 étaient celles qui
		desservaient une population surtout locale; ensuite, la présence d’espaces verts a renforcé la
		résilience des rues principales tout au long de la pandémie.
	</p>
	<p>
		Ces associations suivent des tendances géographiques claires. Les rues principales situées dans
		les centres-villes ou à proximité ont connu les baisses les plus marquées et les reprises les plus
		lentes. Le télétravail ainsi que la diminution des voyages d’affaires et du tourisme ont frappé
		les centres-villes plus durement que tout autre secteur, et leurs rues principales en ont
		grandement souffert. Comme certaines de ces tendances se sont enracinées, de nombreuses rues
		principales de centre-ville n’ont pas retrouvé leur niveau d’activité d’avant la pandémie. Les
		rues principales des banlieues et des petites villes ont généralement connu des replis moins
		sévères et des reprises plus rapides. Dans certains cas, l’achalandage des rues principales a
		dépassé les niveaux d’avant la pandémie, habituellement dans les villes et les quartiers où la
		proportion de personnes en télétravail est plus élevée.
	</p>
	{:else}
	<p>
		Canada’s main streets experienced a great deal of stress throughout the COVID-19 pandemic, as
		people stayed home and footfall drastically declined. While every main street was negatively
		affected, each has had its own specific trajectory since early 2019. Some saw sharper declines
		than others at the outset of the pandemic and some bounced back faster in the subsequent years.
	</p>
	<p>
		CUI conducted a statistical analysis to determine which main street characteristics have the
		strongest correlation with their level of resiliency. We identified two key points: first, that
		the most resilient streets from 2019 to 2022 were the ones that serviced a predominantly local
		population; the second is that the presence of green spaces gave main street resiliency a boost
		throughout the pandemic.
	</p>
	<p>
		There were clear geographic patterns to these associations. Main streets in and near the
		downtowns of cities experienced the sharpest declines and the slowest rebounds. Work from home
		and reduced business travel and tourism hit city centres the hardest, and main streets suffered
		greatly. As some of these trends have become engrained, many downtown main streets have not
		fully recovered to pre-pandemic levels of activity. Main streets in suburban areas and small
		towns tended to experience less severe downturns and more rapid recoveries. In some cases, main
		streets have exceeded pre-pandemic levels of footfall, usually in towns and neighbourhoods that
		have higher rates of people working from home.
	</p>
	{/if}
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>{fr ? 'Sélection des études de cas' : 'Case Study Selection'}</h3>
			{#if fr}
			<p>
				Pour notre analyse détaillée de la résilience, nous avons sélectionné 20 rues principales
				dans les régions de Toronto, de Montréal et d’Edmonton. Ces rues principales ont été choisies
				pour constituer un échantillon représentatif des types de rues de chaque contexte régional&nbsp;:
				quatre rues principales de centre-ville (axées sur les lieux de travail), quatre de petite
				ville et 12 de quartier (axées sur la fonction résidentielle). (Davantage de rues principales
				ont été incluses dans la catégorie des quartiers, car ce groupe présente une plus grande
				variété de rues principales.) De plus, nous avons volontairement inclus des rues principales
				desservant des communautés en quête d’équité.
			</p>
			{:else}
			<p>
				For our detailed resiliency analysis, we selected 20 main streets in the Toronto, Montreal,
				and Edmonton regions. These main streets were chosen to provide a representative sample of
				the types of streets in each regional context, and included four downtown
				(workplace-oriented), four small town, and 12 neighbourhood (residential-oriented) main
				streets. (More main streets were included in the neighbourhood category as there is a
				greater variety of main streets within this group.) In addition, we intentionally included
				main streets with equity-deserving communities.
			</p>
			{/if}
		</div>
	</div>

	<div class="chart-container sticky-content">
		<CaseStudyLocationsMap />
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>{fr ? 'Indice de résilience (I)' : 'Resiliency Score (I)'}</h3>
			{#if fr}
			<p>
				La principale variable dépendante utilisée pour évaluer la résilience repose sur le nombre
				mensuel de visiteurs sur la rue principale. Les données sont fournies par <a
					href="https://environicsanalytics.com/en-ca/home">Environics Analytics</a
				> et proviennent des signaux GPS de téléphones cellulaires. Nous comptons le nombre de personnes
				(appareils) qui entrent dans les bâtiments d’une rue principale au cours de certains intervalles.
				Lorsqu’un lieu de nuit habituel (présumé être le domicile de la personne) peut être associé à un
				appareil, des variables supplémentaires sont rattachées aux données sur les visiteurs. Nous
				calculons la distance parcourue par les visiteurs depuis leur domicile et y associons des
				données démographiques (selon le code postal) pour avoir une idée des caractéristiques des
				personnes qui fréquentent chaque rue principale.
			</p>
			<p>
				Nous avons créé un indice de résilience unique pour chaque rue principale en comparant la
				fréquentation mensuelle de 2020 à 2022 à celle des mêmes mois en 2019 (avant la pandémie).
				Pour chaque mois, nous calculons le nombre de visiteurs en pourcentage du nombre de visiteurs
				en 2019. L’écart total sous les niveaux de fréquentation de 2019, pour chaque mois de 2020 à
				2022, constitue l’indice de résilience. Par exemple, si une rue principale a connu une chute
				marquée de la fréquentation en 2020 et une reprise lente jusqu’en 2022, son indice de
				résilience était relativement faible. À l’inverse, si une rue principale a connu une baisse
				modérée de la fréquentation et une reprise relativement rapide, son indice de résilience était
				plus élevé.
			</p>
			{:else}
			<p>
				The primary dependent variable we used to assess resiliency was based on the number of
				visitors to the main street on a monthly basis. The data is provided by <a
					href="https://environicsanalytics.com/en-ca/home">Environics Analytics</a
				> and is ultimately derived from cell phone GPS signals. We count the number of people (devices)
				entering buildings on a main street within certain time intervals. When a regular nighttime location
				(assumed to be someone’s home location) can be associated with a device, additional variables
				are attached to the visitor data. We derive how far visitors have travelled from home, and link
				demographic data (based on postal codes) to get a sense of the characteristics of people visiting
				each main street.
			</p>
			<p>
				We created a single resiliency score for each main street by comparing monthly visitor
				levels from 2020–2022 to their equivalent months in 2019 (pre-pandemic). For each month, we
				calculate the number of visitors as a percentage of the number of visitors in 2019. The
				total amount that a main street was below its 2019 visitor levels for each month from
				2020–2022 is the resiliency score. For example, if a main street experienced a sharp
				drop-off in visitors in 2020 and was slow to recover through to 2022, it had a relatively
				low resiliency score. Conversely, if a main street experienced a modest drop-off in visitors
				and experienced a relatively quick recovery, it had a higher resiliency score.
			</p>
			{/if}
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<LineAreaChart
			title={fr
				? 'Rue principale à faible indice de résilience'
				: 'Main Street with Low Resiliency Score'}
			chartDataset="libertyvillage"
			yDomain={[0, 150]}
		/>
		<LineAreaChart
			title={fr
				? 'Rue principale à indice de résilience élevé'
				: 'Main Street with High Resiliency Score'}
			chartDataset="uxbridge"
			yDomain={[0, 150]}
		/>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>{fr ? 'Indice de résilience (II)' : 'Resiliency Score (II)'}</h3>
			{#if fr}
			<p>
				La résilience des rues principales pendant la pandémie présente une géographie claire&nbsp;:
				les rues principales de centre-ville ont généralement subi les baisses de fréquentation les
				plus marquées et connu les reprises les plus lentes.
			</p>
			<ul>
				<li>
					North York Centre, à Toronto, était la rue de centre-ville la plus résiliente parmi nos
					études de cas. Cela s’explique probablement par son rôle de centre-ville secondaire par
					rapport au noyau central de Toronto, avec une importante population résidente.
				</li>
				<li>
					La rue principale de centre-ville la moins résiliente était la 97 Street, à Edmonton, où la
					fréquentation est tombée à 15&nbsp;% des niveaux d’avant la pandémie en octobre 2021, pour ne
					remonter qu’à 33&nbsp;% à la fin de 2022.
				</li>
				<li>
					Les rues principales de petite ville ont généralement été les plus résilientes, bien que
					l’écart soit considérable entre le haut du classement (Sutton, dans la région de Toronto) et
					le bas (Saint-Eustache, dans la région de Montréal).
				</li>
				<li>
					La résilience des rues principales de quartier se situait entre celle des centres-villes et
					celle des petites villes (plus près de ces dernières). La rue Beaubien, à Montréal, était la
					rue principale de quartier la plus résiliente; le centre de Brampton (Main et Queen) était la
					moins résiliente.
				</li>
			</ul>
			{:else}
			<p>
				There was a clear geography to main street resiliency through the pandemic, with downtown
				main streets typically suffering the sharpest drop-offs in visitor levels and experiencing
				the slowest recoveries.
			</p>
			<ul>
				<li>
					North York Centre in Toronto was the most resilient downtown street among our case
					studies. This is likely due to its function as a secondary downtown to Toronto’s central
					core, with a significant residential population.
				</li>
				<li>
					The least resilient downtown main street was 97th Street in Edmonton, which saw visitor
					levels drop to 15% of pre-pandemic levels in October 2021, and rising only to 33% by the
					end of 2022.
				</li>
				<li>
					Small town main streets tended to be the most resilient, although there was an extensive
					range between the top (Sutton in the Toronto region) and the bottom (St. Eustache in the
					Montreal region).
				</li>
				<li>
					Neighbourhood main street resiliency was in between that of downtowns and small towns
					(closer to the latter). Rue Beaubien in Montreal was the most resilient neighbourhood main
					street; Central Brampton (Main and Queen) was the least resilient.
				</li>
			</ul>
			{/if}
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<BarChart
			xKey="Resiliency_Score"
			title={fr ? 'Indice de résilience' : 'Resiliency Score'}
			xDomain={[0, 3500]}
		/>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>{fr ? 'Types de visiteurs' : 'Visitor Types'}</h3>
			{#if fr}
			<p>
				Les rues principales de centre-ville ont été les moins résilientes pendant la pandémie, en
				grande partie parce que les gens n’avaient pas à s’y rendre. Le passage au télétravail des
				personnes qui travaillaient habituellement dans des immeubles de bureaux a eu, et continue
				d’avoir, l’un des effets les plus importants sur les villes. Les données de téléphonie
				cellulaire permettent de repérer les lieux habituels de nuit (domicile) et de jour
				(généralement le travail), et peuvent éclairer les raisons pour lesquelles les gens fréquentent
				certaines rues principales. Nous classons les visiteurs en trois catégories&nbsp;:
			</p>
			<ul>
				<li>personnes résidentes locales (habitent à moins de 1&nbsp;km de la rue);</li>
				<li>visiteurs fréquents (s’y rendent le jour de façon régulière);</li>
				<li>
					visiteurs occasionnels (travailleuses et travailleurs, ni résidents locaux ni visiteurs
					fréquents).
				</li>
			</ul>
			<p>
				La tendance est claire&nbsp;: avant la pandémie, les visiteurs occasionnels (travailleurs)
				étaient plus nombreux que les résidents locaux sur les rues principales de centre-ville.
				L’inverse tend à être vrai pour les rues principales de petite ville et de quartier, qui
				dépendaient davantage des visiteurs résidents.
			</p>
			{:else}
			<p>
				Downtown main streets were the least resilient through the pandemic, largely because people
				did not have to go there. The shift to working from home for those who typically worked in
				office buildings had, and continues to have, one of the most significant impacts on cities.
				Cell phone data can identify regular nighttime (home) and regular daytime (typically, work)
				locations, and can provide insights into the reasons people visit particular main streets.
				We segment visitors into three categories:
			</p>
			<ul>
				<li>local residents (live within 1 km of the street)</li>
				<li>frequent visitors (visit during the day on a regular basis)</li>
				<li>infrequent visitors (workers, neither local residents or frequent visitors).</li>
			</ul>
			<p>
				There is a clear pattern: infrequent visitors (workers) outnumbered local residents on
				downtown main streets prior to the pandemic. The opposite tends to be true for small towns
				and neighbourhood main streets that relied more heavily on residential visitors.
			</p>
			{/if}
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<BarChartStacked title={fr ? 'Répartition des visiteurs' : 'Share of Visitors'} />
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>{fr ? 'Offre d’infrastructure civique' : 'Civic Infrastructure Provision'}</h3>
			{#if fr}
			<p>
				L’un des objectifs centraux du projet initial Mesures des rues principales était d’évaluer le
				rôle de l’infrastructure civique dans la résilience des rues principales. Nous avons créé un
				indicateur de l’offre d’infrastructure civique pour chaque rue principale au pays&nbsp;: l’indice
				d’infrastructure civique. Cette mesure met en rapport la présence de lieux d’infrastructure
				civique et la densité de population d’un secteur. Les lieux d’infrastructure civique sont
				pondérés selon le nombre de personnes qu’ils emploient, afin de tenir compte de la taille des
				installations. Les rues principales de centre-ville ont généralement les niveaux d’offre
				d’infrastructure civique les plus élevés, en grande partie parce qu’elles accueillent des
				installations aux fonctions centrales (bibliothèques principales, grandes salles de spectacle,
				hôtels de ville) plutôt que de servir strictement une population locale. Dans le contexte de
				la COVID-19, ces installations n’ont pas suffi à permettre aux rues principales de centre-ville
				de résister aux effets de la pandémie sur la fréquentation. Le lien entre l’infrastructure
				civique et la résilience des rues principales s’est révélé plus nuancé.
			</p>
			{:else}
			<p>
				A core purpose of the initial Measuring Main Street project was to assess the role of civic
				infrastructure on main street resiliency. We created a civic infrastructure provision score
				for every main street in the country: the Civic Infrastructure Index. This metric combines
				the presence of civic infrastructure locations relative to the population density of an
				area. The civic infrastructure locations are weighted by how many people they employ, to
				account for scale of the facility. Downtown main streets tend to have the highest levels of
				civic infrastructure provisions, largely because they house facilities that offer central
				functions (main libraries, major performance theatres, city halls) rather than strictly
				cater to a local population. In the context of COVID-19, these facilities were not
				sufficient to enable downtown main streets to withstand the pandemic’s impacts on visitor
				levels. The connection between civic infrastructure and main street resiliency proved to be
				more nuanced.
			</p>
			{/if}
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<CivicBarChart title={fr ? 'Offre d’infrastructure civique' : 'Civic Infrastructure Provision'} />
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>{fr ? 'Analyse de corrélation' : 'Correlation Analysis'}</h3>
			{#if fr}
			<p>
				Pour mettre au jour les facteurs qui aident à expliquer la résilience des rues principales
				pendant la pandémie, nous avons effectué une analyse de corrélation avec un large éventail
				d’indicateurs. Ces facteurs comprenaient des variables liées à la forme urbaine, à la
				démographie et au contenu de la rue.
			</p>
			<p>
				L’analyse a fait ressortir deux indicateurs étroitement associés à la résilience des rues
				principales. Le premier est la proportion de visiteurs qui sont des résidents locaux. Pendant
				la pandémie, les gens avaient tendance à rester près de chez eux et étaient moins susceptibles
				de se rendre au travail ou dans d’autres lieux plus éloignés. Les rues principales qui
				dépendaient davantage de visiteurs venant de plus loin étaient plus susceptibles de connaître
				des baisses plus marquées et des reprises plus lentes. Le second est la présence d’espaces
				verts. Si l’infrastructure civique ne permettait généralement pas de prédire une résilience
				plus élevée, les parcs, eux, le permettaient. C’est logique&nbsp;: les gens avaient toujours le
				désir fondamental de se rassembler, mais voulaient le faire dans un cadre extérieur sécuritaire.
				Cela laisse croire que l’infrastructure civique est bel et bien importante pour la vitalité des
				rues principales, et qu’une analyse des données en période plus «&nbsp;normale&nbsp;» pourrait le
				confirmer.
			</p>
			{:else}
			<p>
				To uncover the factors that help explain main street resiliency throughout the pandemic, we
				performed a correlation analysis with a wide range of indicators. The factors included
				variables of urban form, demographics, and street content.
			</p>
			<p>
				The analysis revealed two key indicators that had the closest associations with main street
				resiliency. First was the share of visitors that are local residents. During the pandemic,
				people tended to stay closer to home; they were less likely to travel to work or other
				locations further away. Main streets that relied more heavily on visitors from further away
				were more likely to experience sharper drop-offs and slower recoveries. Second was the
				presence of green spaces. While civic infrastructure generally did not predict higher
				resiliency, parks did. This makes intuitive sense, as people still had the core desire to
				congregate, but wanted to do so in a safe outdoor setting. This suggests that civic
				infrastructure is indeed important to the vitality of main streets and that data analysis in
				more “normal” times may reveal this to be the case.
			</p>
			{/if}
		</div>
	</div>

	<div class="chart-container sticky-content">
		<img src={correlation} alt={fr ? 'Graphique de corrélation' : 'Correlation Plot'} />
	</div>
</div>

<div class="key-findings">
	<h3>{fr ? 'Principaux constats et messages' : 'Key Findings and Messages'}</h3>

	<KeyFindings
		number={'1'}
		finding={fr
			? 'Les rues principales de centre-ville ont été les plus durement touchées par la pandémie et sont celles qui se rétablissent le plus lentement.'
			: 'Downtown main streets were hit hardest by the pandemic and have been the slowest to recover.'}
		message1={fr
			? 'Élaborer et mettre en œuvre des stratégies de relance du centre-ville dans chaque ville.'
			: 'Develop and implement downtown recovery strategies in every city.'}
		message2={fr
			? 'Rééquilibrer la mixité des usages sur les rues principales de centre-ville – l’infrastructure civique peut jouer un rôle important dans cette solution.'
			: 'Adjust the mix of uses on downtown main streets – civic infrastructure can be a major part of this solution.'}
		message3={fr
			? 'Créer une image positive du centre-ville pour inciter les gens à y revenir, tout en freinant le déclin du transport collectif et de la sécurité publique.'
			: 'Create positive impressions of downtown in order to encourage people to return while backstopping declines in public transportation and public safety.'}
	/>

	<KeyFindings
		number={'2'}
		finding={fr
			? 'Les rues principales qui desservent surtout la population locale immédiate ont été les plus résilientes pendant la pandémie.'
			: 'Main streets that predominantly serve their immediate local residents were the most resilient through the pandemic.'}
		message1={fr
			? 'Adapter l’offre commerciale des rues principales à la demande locale en utilisant l’analyse de données pour cerner les lacunes de l’offre actuelle.'
			: 'Curate main street businesses to match local demand using data analysis to identify gaps in what a main street currently provides.'}
		message2={fr
			? 'Construire davantage de logements sur les rues principales et à proximité en repérant les possibilités de densification qui peuvent compléter et élargir l’offre existante.'
			: 'Build more housing on and near to main streets by looking for infill opportunities that can supplement and expand existing options.'}
		message3={fr
			? 'Investir dans les options de transport actif à l’échelle du quartier.'
			: 'Invest in active transportation options at the neighbourhood scale.'}
	/>

	<KeyFindings
		number={'3'}
		finding={fr
			? 'La présence d’espaces verts a contribué à la résilience des rues principales pendant la pandémie.'
			: 'The presence of green spaces contributed to main street resiliency through the pandemic.'}
		message1={fr
			? 'Aménager sur les rues principales des lieux extérieurs de qualité où les gens peuvent se rassembler.'
			: 'Provide high quality outdoor places on main streets for people to congregate.'}
		message2={fr
			? 'Intégrer la végétation et des aménagements naturels dans les milieux de rue principale.'
			: 'Integrate greenery and natural amenities into main street environments.'}
		message3={fr
			? 'Regrouper l’infrastructure civique sur les rues principales et créer des points de convergence pour les collectivités locales.'
			: 'Cluster civic infrastructure on main streets and create focal points for local communities.'}
	/>
</div>

<style>
	img {
		width: 100%;
	}
</style>
