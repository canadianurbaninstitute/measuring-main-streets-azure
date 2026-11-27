<script>
	import blank from '../../lib/assets/graphics/blank.svg';
	import Title from '../../lib/ui/Title.svelte';

	import CaseStudyLocationsMap from './CaseStudyLocationsMap.svelte';
	import CIIMainStreetMap from './CIIMainStreetMap.svelte';

	import BubbleChart from '../../lib/ui/charts/BubbleChart.svelte';
	import RecoveryMultiLineChart from '../mainstreets-malls-mice/RecoveryMultiLineChart.svelte';

	import '../../styles.css';

	import data from '../../lib/data/reportdata/edmonton/bubble-edmonton.csv';
	import { dataset } from '../../lib/data/reportdata/edmonton/selectLabels.js';

	import { getLang } from '../../lib/i18n';

	const fr = getLang() === 'fr';

	// order of graphs: downtown, neighbourhood, small towns, malls
</script>

<Title
	outline={blank}
	name={'Edmonton'}
	location={fr ? 'Rapport régional' : 'Regional Report'}
	bg={'https://i.imgur.com/Ickzdba.jpeg'}
/>

<div class="full-text">
	{#if fr}
	<p>
		Des rues principales dynamiques sont essentielles à la construction de quartiers prospères. Des
		quartiers prospères sont essentiels à la vitalité des villes. Et des villes saines sont le
		fondement d’un pays fort. La région d’Edmonton compte 1,5 million de personnes, dont 88 % vivent à
		moins d’un kilomètre d’une rue principale. Les rues principales abritent plus de 6 000 entreprises
		qui emploient près de 60 000 personnes et génèrent plus de 8,5 milliards de dollars de revenus par
		année. On compte également plus de 2 000 sites d’infrastructure civique sur les rues principales de
		la région d’Edmonton.
	</p>
	<p>
		Les entreprises et l’infrastructure civique des rues principales jouent un rôle crucial dans la
		vie quotidienne de la population. Mais lorsque les rues principales souffrent, les gens souffrent.
		La pandémie de COVID-19 a durement frappé les rues principales, entraînant la fermeture
		d’entreprises et, par la suite, des vitrines vides. Bien que certaines rues principales de la
		région d’Edmonton aient rebondi, bon nombre d’entre elles ne se sont pas complètement rétablies.
	</p>
	<p>
		Nos recherches montrent que les <a href="/reports/mainstreet-resiliency"
			>rues principales les plus résilientes sont celles qui sont les plus étroitement liées à leur
			communauté locale immédiate</a
		>. Les possibilités offertes aux entreprises indépendantes et une infrastructure civique à
		l’échelle du quartier sont des éléments essentiels pour contrer les menaces à plus long terme qui
		pèsent sur les rues principales, comme
		<a href="/reports/mainstreets-malls-mice"
			>le commerce électronique et les centres commerciaux régionaux</a
		>.
	</p>
	<p>
		Malheureusement, <a href="/reports/mainstreets-infrastructure-equity"
			>les ressources communautaires ne sont pas réparties équitablement dans les régions urbaines</a
		>, y compris dans la région d’Edmonton. De plus, les quartiers de banlieue plus récents, qui n’ont
		pas été aménagés autour d’une rue principale, manquent d’infrastructure civique. Ce document de
		recherche examine les rues principales sous l’angle de la résilience, de la communauté et de
		l’équité, en s’appuyant sur 20 études de cas de rues principales de la région d’Edmonton.
	</p>
	{:else}
	<p>
		Vibrant main streets are essential to building strong neighbourhoods. Strong neighbourhoods are
		essential to healthy cities. And healthy cities are the foundation of a strong country. The
		Edmonton region is home to 1.5 million people, and 88% of them live within 1 km of a main
		street. Main streets are home to over 6,000 businesses that employ nearly 60,000 people while
		generating over $8.5 billion in revenue per year. There are also over 2,000 sites of civic
		infrastructure on main streets in the Edmonton region.
	</p>
	<p>
		Main street businesses and civic infrastructure play a crucial role in the day-to-day lives of
		residents. But when main streets suffer, people suffer. The COVID-19 pandemic created
		significant pain on main streets, leading to the closure of businesses, and subsequently, to
		empty storefronts. While some main streets in the Edmonton region have rebounded, many have not
		fully recovered.
	</p>
	<p>
		Our research shows that the <a href="/reports/mainstreet-resiliency"
			>most resilient main streets are those most closely aligned with their immediate local
			community</a
		>. Opportunities for independent business and neighbourhood scale civic infrastructure are key
		building blocks for pushing back against longer-term threats to main streets, such as
		<a href="/reports/mainstreets-malls-mice">ecommerce and regional shopping centres.</a>
	</p>
	<p>
		Unfortunately, <a href="/reports/mainstreets-infrastructure-equity">
			community resources are not equitably distributed within urban regions</a
		>, including in the Edmonton region. And, in more recently built suburban neighbourhoods that
		have not been developed around a main street, there is a scarcity of civic infrastructure. This
		research brief looks at main streets in relation to resiliency, community, and equity, drawing
		on 20 Edmonton-region main street case studies.
	</p>
	{/if}
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			{#if fr}
			<h3>Rues principales étudiées dans la région d’Edmonton</h3>
			<p>
				Vingt rues principales ont été choisies dans la région d’Edmonton comme études de cas
				représentatives. Dix d’entre elles ont fait l’objet d’une recherche par observation directe et
				d’une analyse détaillée des données, tandis que les dix autres ne comportent que le volet des
				données.
			</p>
			<p>Les études de cas ont également été comparées à cinq centres commerciaux régionaux.</p>
			<p>
				En outre, nous avons sélectionné des rues principales qui reflètent une diversité de géographies,
				dont quatre rues de centre-ville (axées sur les lieux de travail), quatre rues principales de
				petites villes et 12 rues principales de quartier (à vocation résidentielle).
			</p>
			<p>
				La présence de communautés en quête d’équité a également été un facteur clé dans le processus de
				sélection.
			</p>
			{:else}
			<h3>Edmonton Case Study Main Streets</h3>
			<p>
				Twenty main streets were chosen in the Edmonton region as representative case studies. Ten
				involved direct observational research and detailed data analysis, and ten provide the data
				component alone.
			</p>
			<p>The case studies were also contrasted with five regional shopping centres.</p>
			<p>
				In addition, we selected main streets that reflect a cross section of geographies, including
				four downtown (workplace oriented) streets, four small town main streets, and 12
				neighbourhood (residentially oriented) main streets.
			</p>
			<p>
				The presence of equity deserving communities was also a key factor in the selection process.
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
			{#if fr}
			<h3>Résilience des rues principales</h3>
			<p>
				Bien que toutes les rues principales de la région d’Edmonton aient connu de sérieux ralentissements
				pendant la pandémie, certaines ont été plus durement touchées et ont mis plus de temps à s’en
				remettre.
			</p>
			<p>
				Notre <a href="/reports/mainstreet-resiliency">analyse statistique</a> montre que les rues
				principales les plus résilientes sont celles qui attirent une forte proportion de leurs visiteurs
				du voisinage immédiat (dans un rayon d’un kilomètre). À l’inverse, les rues principales les moins
				résilientes avaient tendance à attirer une plus grande part de leurs visiteurs de plus loin.
			</p>
			<p>
				Les rues principales situées dans les centres-villes ou à proximité ont généralement été plus
				durement touchées par la pandémie et ont mis plus de temps à s’en remettre. Le deuxième facteur en
				importance associé à la résilience pendant la pandémie était la présence d’espaces verts, car les
				gens recherchaient des endroits sécuritaires où un certain degré d’interaction sociale restait
				possible.
			</p>
			<p>
				Parmi les 20 rues principales de la région d’Edmonton, celles des petites villes formaient
				généralement le sous-type le plus résilient, Beaumont en tête. Les rues principales de quartier les
				plus résilientes se trouvaient dans <a href="/casestudies/edmonton/149streetnw"
					>l’ouest d’Edmonton (149th Street NW)</a
				>
				et à <a href="/casestudies/edmonton/118beverly">Beverly (118 Avenue NW)</a>, qui affichaient
				généralement des proportions plus élevées (de 28 % à 33 %) de visiteurs provenant de moins d’un
				kilomètre. Les rues principales davantage axées sur l’automobile, comme
				<a href="/casestudies/edmonton/104streetnw">Calgary Trail</a>
				et
				<a href="/casestudies/edmonton/sherwooddrive">Sherwood Drive</a>, ont été moins résilientes et
				n’attiraient que de 5 % à 13 % de leurs visiteurs des environs.
			</p>
			<p>
				Les rues principales les moins résilientes parmi les études de cas d’Edmonton sont
				<a href="/casestudies/edmonton/97streetnw">97 Street (Chinatown)</a>,
				<a href="/casestudies/edmonton/104streetdowntown">104 Street Promenade</a> et
				<a href="/casestudies/edmonton/jasperavenue">Jasper Avenue</a>. Ces trois rues sont des exemples
				de rues principales de centre-ville qui dépendent traditionnellement de la présence des personnes
				travaillant dans les bureaux et des activités connexes du centre-ville.
				<a href="/casestudies/edmonton/107avenuenw">107th Avenue W (Central McDougall)</a>, la quatrième
				rue principale de centre-ville étudiée à Edmonton, a été moins durement touchée par la pandémie que
				les trois autres, puisqu’elle se trouve à l’extérieur du quartier central des affaires et dessert
				une population davantage résidentielle.
			</p>
			{:else}
			<h3>Main Street Resiliency</h3>
			<p>
				While all Montréal-region main streets experienced serious downturns during the pandemic,
				some were hit harder and took longer to recover.
			</p>
			<p>
				Our <a href="/reports/mainstreet-resiliency">statistical analysis</a> shows that the most resilient
				main streets were those that draw a high proportion of their visitors from the immediate neighbourhood
				(within 1 km). Conversely, the least resilient main streets tended to draw a greater share of
				their visitors from further away.
			</p>
			<p>
				Main streets located in and near downtowns tended to be hit harder by the pandemic and took
				longer to recover. The second most important factor associated with resiliency during the
				pandemic was the presence of greenspace, as people sought out safe places where a degree of
				social interaction remained possible.
			</p>
			<p>
				Among all 20 Edmonton-region main streets, those in small towns were generally the most
				resilient sub-type, with Beaumont leading the way. The most resilient neighbourhood main
				streets were found in <a href="/casestudies/edmonton/149streetnw"
					>West Edmonton (149th Street NW)</a
				>
				and <a href="/casestudies/edmonton/118beverly">Beverly (118 Avenue NW)</a> which typically
				had higher levels (28%-33%) of visitors coming from less than 1 km away. More car-oriented
				main streets such as
				<a href="/casestudies/edmonton/104streetnw">Calgary Trail</a>
				and
				<a href="/casestudies/edmonton/sherwooddrive">Sherwood Drive</a> were less resilient and only
				drew between 5%–13% of their visitors from nearby.
			</p>
			<p>
				The least resilient Edmonton case study main streets <a
					href="/casestudies/edmonton/97streetnw">97 Street (Chinatown)</a
				>, <a href="/casestudies/edmonton/104streetdowntown">4th Street Promenade</a>, and
				<a href="/casestudies/edmonton/jasperavenue">Jasper Avenue</a>. Each of these three are
				examples of downtown main streets that traditionally depend on the presence of office
				workers and related central city activity.
				<a href="/casestudies/edmonton/107avenuenw">107th Avenue W (Central McDougall)</a> was the fourth
				downtown Edmonton case study main street, which was not as adversely affected by the pandemic
				as the other three as it sits outside the central business district and serves more of a residential
				population.
			</p>
			{/if}
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<RecoveryMultiLineChart {dataset} />
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			{#if fr}
			<h3>Communauté des rues principales</h3>
			<p>
				Bien que la pandémie ait posé un défi majeur aux rues principales de la région d’Edmonton, des
				sources de tension à plus long terme persistent.
			</p>
			<p>
				<a href="/reports/mainstreets-malls-mice"
					>Les centres commerciaux régionaux et le commerce électronique offrent des solutions de rechange
					à bon nombre des biens et services offerts sur les rues principales.</a
				> Les centres commerciaux ont d’abord été plus durement touchés par la pandémie en raison des
				confinements stricts, mais ils ont généralement rebondi plus rapidement. Le recours au commerce
				électronique a bondi de 2020 à 2022, avant de reprendre en 2023 sa tendance historique à la hausse
				(plus modeste).
			</p>
			<p>
				Malgré un certain chevauchement entre les rues principales, les centres commerciaux et le commerce
				électronique, il existe aussi des différences importantes. Les rues principales offrent plus de
				possibilités aux entreprises indépendantes et davantage d’infrastructure civique. Les unes comme
				l’autre peuvent mieux répondre aux besoins particuliers de la communauté locale, et les relations
				tissées grâce aux interactions entre les personnes résidentes, les exploitants d’entreprises et
				les gestionnaires de l’infrastructure civique sont essentielles à la vitalité à long terme des
				rues principales.
			</p>
			<p>
				Les cinq centres commerciaux de la région d’Edmonton présentent clairement une rareté
				d’entreprises indépendantes et d’infrastructure civique, se classant sous toutes les rues
				principales sur ces deux plans. Parmi les études de cas d’Edmonton,
				<a href="/casestudies/edmonton/124streetnw">124th Street</a> et
				<a href="/casestudies/edmonton/104streetnw">Calgary Trail</a> se distinguent par des parts plus
				élevées d’entreprises indépendantes et d’infrastructure civique. Bien qu’elles soient situées à
				l’extérieur du centre-ville, ces rues principales sont plus denses et plus propices à la marche
				que bien d’autres rues de banlieue. On y trouve de nombreuses conditions favorables à
				l’établissement de communautés locales fortes.
			</p>
			<p>
				<a href="/casestudies/edmonton/137avenuenw">137th Avenue NW (nord d’Edmonton)</a>
				et
				<a href="/casestudies/edmonton/parsonsroadsw">Parsons Road</a> se situent à l’autre extrémité du
				spectre. Ce sont des endroits qui comptent moins d’entreprises indépendantes et d’infrastructure
				civique, fortement axés sur l’automobile et caractérisés par les grandes surfaces et les chaînes
				de restaurants. Ces rues principales n’ont pas d’identité claire et sont moins susceptibles d’être
				façonnées par et pour la communauté locale.
			</p>
			{:else}
			<h3>Main Street Community</h3>
			<p>
				While the pandemic posed a major challenge to Edmonton-region main streets, there are
				longer-term sources of strain that continue.
			</p>
			<p>
				<a href="/reports/mainstreets-malls-mice"
					>Regional shopping malls and ecommerce offer alternatives to many of the goods and
					services offered on main streets.</a
				> Shopping malls were initially hit harder by the pandemic due to the effects of hard lockdowns,
				but typically rebounded faster. The use of ecommerce spiked from 2020 to 2022 before returning
				to its (more modest) historic upward trend in 2023.
			</p>
			<p>
				Despite a degree of overlap between main streets and shopping malls and ecommerce, there are
				also significant differences. Main streets offer more opportunities for independent business
				and provide more civic infrastructure. Both can be more responsive to the specific needs of
				the local community, and the relationships forged through the interactions of residents,
				business operators, and managers of civic infrastructure are essential for the long-term
				vitality of main streets.
			</p>
			<p>
				The five Edmonton-region shopping malls clearly have a scarcity of both independent
				businesses and civic infrastructure, ranking below all main streets on both scores. Of the
				Edmonton case studies, <a href="/casestudies/edmonton/124streetnw">124th Street</a> and
				<a href="/casestudies/edmonton/104streetnw">Calgary Trail</a> stand out as having higher shares
				of both independent business and civic infrastructure. Despite being located outside the city
				centre, these main streets are denser and more walkable than many other suburban streets. There
				are multiple conditions present that are conducive to building strong local communities.
			</p>
			<p>
				The <a href="/casestudies/edmonton/137avenuenw">137th Avenue NW (North Edmonton)</a>
				and
				<a href="/casestudies/edmonton/parsonsroadsw">Parsons Road</a> are main streets at the other
				end of the spectrum. These are places with less independent business and civic infrastructure
				that are heavily car-oriented and characterized by big box retail and chain restaurants. Such
				main streets do not possess a clear identity and are less likely to be created for and by the
				local community.
			</p>
			{/if}
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<BubbleChart {data} />
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			{#if fr}
			<h3>Équité des rues principales</h3>
			<p>
				Les rues principales réunissent les entreprises et l’infrastructure civique essentielles à la vie
				quotidienne de la population. Elles rendent la vie des gens meilleure, plus facile et plus
				agréable : elles sont le fondement des communautés locales où les gens se rassemblent,
				interagissent et nouent des relations.
			</p>
			<p>
				Malheureusement, tout le monde ne bénéficie pas d’un accès égal aux rues principales et à ce
				qu’elles ont à offrir. Dans certains cas, les rues principales sont dépourvues d’infrastructure
				civique essentielle, mais, plus important encore, certains quartiers n’ont tout simplement pas de
				rue principale. Notre analyse montre que c’est dans les quartiers de banlieue construits plus
				récemment que les déficits d’infrastructure civique sont les plus répandus.
			</p>
			<p>
				Notre indice d’infrastructure civique, qui tient compte de la quantité d’infrastructure civique
				locale (dans un rayon d’un kilomètre) par rapport à la population locale, montre que les quartiers
				plus récents de la région d’Edmonton, plus éloignés du centre-ville et plus proches de l’Anthony
				Henday (autoroute 216), ont tendance à offrir un accès local à l’infrastructure civique inférieur à
				la moyenne régionale.
			</p>
			<p>
				Le centre-ville d’Edmonton se situe à l’autre extrémité du spectre, avec des niveaux
				d’infrastructure civique beaucoup plus élevés, puisqu’il accueille de nombreux équipements
				d’importance régionale. Les quatre rues principales de centre-ville étudiées occupent d’ailleurs
				les quatre premiers rangs de notre indice d’infrastructure civique. Les centres de nombreuses
				petites collectivités de la région, comme Leduc, St. Albert et Fort Saskatchewan, obtiennent aussi
				des résultats bien supérieurs à la médiane.
			</p>
			<p>
				L’enjeu fondamental ne tient pas seulement à la quantité globale d’infrastructure civique, mais
				aussi à sa répartition géographique au sein des régions urbaines. On risque de créer des quartiers
				« nantis » et des quartiers « démunis » dont l’accès local à l’infrastructure civique diverge, ce
				qui réduit le contrôle que les personnes résidentes ayant un accès plus limité à l’infrastructure
				civique exercent sur la programmation. Dans un tel scénario, l’infrastructure civique répond moins
				bien aux besoins particuliers des quartiers.
			</p>
			<p>
				Le déficit d’infrastructure civique dans les quartiers de banlieue récemment construits ne tient
				pas au montant des investissements, mais plutôt à des modèles qui privilégient de grands sites
				centralisés au détriment de lieux plus petits et dispersés. À l’instar de la tendance aux grandes
				surfaces commerciales en banlieue, l’offre d’infrastructure civique a suivi une trajectoire
				semblable. Ces modèles peuvent être plus efficients sur le plan financier à court terme, mais ils
				entraînent à long terme un affaiblissement du développement communautaire et de l’équité entre les
				quartiers.
			</p>
			{:else}
			<h3>Main Street Equity</h3>
			<p>
				Main streets contain the businesses and civic infrastructure that are essential for the
				day-to-day lives of residents. They make people’s lives better, easier, and more enjoyable –
				the foundation of local communities where people come together, interact, and form
				relationships.
			</p>
			<p>
				Unfortunately, not everyone enjoys equal access to main streets and what they have to offer.
				In some cases, main streets lack critical civic infrastructure, but more pointedly, some
				neighbourhoods lack main streets altogether. Our analysis shows that more recently built
				suburban neighbourhoods are where civic infrastructure deficits are most prevalent.
			</p>
			<p>
				Our Civic Infrastructure Index, which considers the amount of local (within 1 km) civic
				infrastructure relative to the local population, shows that newer Edmonton-region
				neighbourhoods further from the city centre and closer to the Henday (Hwy. 216) tend to have
				lower levels of local access to civic infrastructure relative to the regional average.
				Central Etobicoke and the former City of York are examples of older, established
				neighbourhoods that also possess lower levels of civic infrastructure.
			</p>
			<p>
				Downtown Edmonton is at the other end of the spectrum, with much higher levels of civic
				infrastructure, as it is home to many regionally significant assets. The four downtown main
				street case studies are also the top four on our Civic Infrastructure Index. The centres of
				many smaller communities in the region, such as Leduc, St, Albert, and Fort Saskatchewan,
				also score well above the median.
			</p>
			<p>
				The core issue not only about the overall amount of civic infrastructure, but how it is
				geographically distributed within urban regions. There is a danger of creating “have and
				have-not” neighbourhoods with divergent levels of local access to civic infrastructure,
				which in turn decreases the amount of control residents with less access to civic
				infrastructure have over programming. In such a scenario, civic infrastructure is less
				responsive to specific neighbourhood needs.
			</p>
			<p>
				The civic infrastructure deficit in recently constructed suburban neighbourhoods is not
				about the amount of investment, but rather models that favour large, centralized sites over
				smaller diffused locations. Like the trend toward big box retail in suburban environments,
				civic infrastructure provision has charted a similar path. These models may be more fiscally
				efficient in the short term, but they come with reduced community development and
				neighbourhood equity in the long term.
			</p>
			{/if}
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<CIIMainStreetMap
			section={'civic-infra-index-main-streets'}
			title={fr
				? 'Indice d’infrastructure civique (quintile inférieur) par rapport aux rues principales à forte densité'
				: 'Civic Infrastructure Index (Lowest Quintile) in relation to High Density Main Streets'}
		/>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			{#if fr}
			<h3>Résumé</h3>
			<p>
				Notre recherche évalue les rues principales selon leur résilience, leur communauté et leur équité.
				Nous avançons que si les caractéristiques de certaines rues principales favorisent ces éléments,
				elles contribueront à des quartiers sains. Si cela se fait de manière cohérente dans l’ensemble
				des régions urbaines du Canada, elles constitueront le fondement de villes saines. La Ville
				d’Edmonton met en œuvre un nouveau cadre de zonage qui encourage activement l’aménagement de
				« collectivités de 15 minutes ». Les rues principales demeurent un élément important de cette
				politique, qui vise à élargir les possibilités d’utilisation du sol dans les nœuds, les corridors
				et les quartiers résidentiels.
			</p>
			<p>
				La rue principale « parfaite » n’existe pas. Les rues principales peuvent produire de la
				résilience, de la communauté et de l’équité de multiples façons. Nos recherches dégagent toutefois
				des principes généraux sur les caractéristiques des rues principales les plus susceptibles de
				produire des résultats positifs. Nous avons créé des indicateurs qui saisissent le mieux l’essence
				de ces thèmes : un indice de résilience fondé sur la variation relative de l’achalandage d’une rue
				principale pendant la pandémie et sur la part des visiteurs qui habitent à moins d’un kilomètre de
				la rue principale; un indice des entreprises indépendantes; et un indice d’infrastructure civique
				qui pondère la quantité d’infrastructure en fonction de la taille de la population du quartier.
			</p>
			<p>
				La région d’Edmonton est une métropole dynamique dont l’économie est en croissance et qui offre une
				qualité de vie élevée. La région compte à la fois des quartiers bien établis aux identités
				distinctes et de nombreux secteurs plus récents qui sont encore en train de prendre forme. Au cœur
				des quartiers les mieux établis se trouvent des rues principales dynamiques qui offrent une gamme
				de biens, de services et d’activités qui soutiennent les gens dans leur vie quotidienne. Toutefois,
				il n’y a pas deux rues principales identiques : leur emplacement et leurs caractéristiques ont des
				effets importants sur l’éventail des choix et des possibilités qui s’offrent localement aux
				personnes résidentes.
			</p>
			{:else}
			<h3>Summary</h3>
			<p>
				Our research assesses main streets by their resiliency, community, and equity. We suggest
				that if the traits of specific main streets can foster these elements, they will nurture
				healthy neighbourhoods. If this is done consistently across Canada’s urban regions, they
				will provide the foundation for healthy cities. The City of Edmonton is implementing a new
				zoning framework that actively encourages the development of ’15-minute communities’. Main
				streets remain an important element of this policy, as it seeks to expand land use options
				in node, corridors, and residential neighbourhoods.
			</p>
			<p>
				There is no such thing as a “perfect” main street. There are a multitude of ways in which
				they can produce resiliency, community, and equity. Our research does, however, point toward
				general principles about main street characteristics that are more likely to generate
				positive outcomes. We have created indicators that most closely capture the essence of these
				themes: a Resiliency Index based on the relative change in visitor levels to a main street
				through the pandemic and the share of visitors that live within 1 km of the main street; an
				Independent Business Index; and a Civic Infrastructure Index that weighs the amount of
				infrastructure relative to the size of the neighbourhood population.
			</p>
			<p>
				The Edmonton region is a dynamic metropolis that has a growing economy and offers a high
				quality of life. The region has a mix of well-established neighbourhoods with distinct
				identities and many newer areas that are still growing into themselves. At the centre of the
				more well-established neighbourhoods are vibrant main streets that provide a range of goods,
				services, and activities that support people in their day-to-day lives. No two main streets
				are the same, however; their specific locations and characteristics have significant impacts
				on the range of local choices and opportunities for residents.
			</p>
			{/if}
		</div>
	</div>

	<div class="image-container">
		<div>
			<img class="report-image" src="https://i.imgur.com/7VC9qhM.jpeg" alt={fr ? '124 Street NW' : '124st'} />
			<h5>124 Street NW</h5>
		</div>
		<div>
			<img class="report-image" src="https://i.imgur.com/ciffdqV.jpeg" alt={fr ? 'Alberta Avenue' : 'weston'} />
			<h5>Alberta Avenue</h5>
		</div>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			{#if fr}
			<h3>Résumé (II)</h3>
			<p>
				Les rues principales de la région d’Edmonton qui obtiennent le plus régulièrement les meilleurs
				résultats pour les indicateurs clés sont généralement des rues de quartier établies de longue date
				qui desservent d’abord leur communauté locale immédiate grâce à une gamme d’entreprises
				indépendantes et d’infrastructure civique.
				<a href="/casestudies/edmonton/124streetnw">124th Street</a>,
				<a href="/casestudies/edmonton/118albertaave">Alberta Avenue</a> et
				<a href="/casestudies/edmonton/50streetstonyplain">50 Street à Stony Plain</a> sont des secteurs
				relativement propices à la marche, mais qui font aussi place à l’automobile. Ces rues principales
				ont été construites à l’origine (surtout avant 1960) en même temps que le parc de logements
				environnant et ont évolué au rythme des changements physiques et démographiques. L’élément clé est
				le cadre bâti d’origine et sa capacité d’adaptation au fil du temps. Dans le contexte actuel, ces
				rues principales offrent d’excellentes occasions de construction de logements intercalaires,
				puisqu’elles disposent déjà de nombreuses infrastructures de soutien.
			</p>
			<p>
				À l’autre extrémité du spectre se trouvent des rues principales fortement dépendantes de
				l’automobile, bordées de commerces de grande surface et offrant peu d’infrastructure civique. Ces
				rues principales desservent généralement une zone de chalandise plus vaste et comptent moins
				d’entreprises indépendantes. <a href="/casestudies/edmonton/sherwooddrive">Sherwood Drive</a>,
				<a href="/casestudies/edmonton/parsonsroadsw">Parsons Road (South Edmonton Common)</a>,
				<a href="/casestudies/edmonton/104streetnw">104 Street NW (Calgary Trail)</a> et
				<a href="/casestudies/edmonton/50avenue">50 Avenue (Leduc)</a>
				sont des exemples de rues principales conçues pour l’automobile et dominées par de grands
				stationnements. Ces endroits figurent parmi les rues principales les moins résilientes et attirent
				une plus faible part de visiteurs des quartiers environnants.
			</p>
			<p>
				Les récentes modifications apportées par Edmonton à la planification de district et au zonage
				reconnaissent clairement l’objectif de créer des « quartiers de 15 minutes » destinés à procurer
				divers avantages économiques, sociaux et environnementaux aux personnes résidentes et aux
				entreprises locales. Cette approche s’inspire des leçons positives des rues principales
				« traditionnelles », denses et propices à la marche, mais surtout capables de s’adapter à des
				besoins locaux en constante évolution. Elle reconnaît également les échecs des rues principales et
				des quartiers de banlieue plus récents, dominés par l’automobile et associés à de nombreux effets
				négatifs. La réussite de la mise en œuvre de ces politiques aura une incidence importante sur la
				forme urbaine à long terme d’Edmonton et, ultimement, sur la qualité de vie des personnes qui y
				vivent aujourd’hui et y vivront demain.
			</p>
			{:else}
			<h3>Summary (II)</h3>
			<p>
				The Edmonton-region main streets that most consistently score the highest across the key
				indicators tend to be long-established neighbourhood streets that primarily serve their
				immediate local community with a range of independent businesses and civic infrastructure.
				<a href="/casestudies/edmonton/124streetnw">124th Street</a>,
				<a href="/casestudies/edmonton/118albertaave">Alberta Avenue</a>, and
				<a href="/casestudies/edmonton/50streetstonyplain">50 Street in Stony Plain</a> are locations
				that are relatively walkable but also accommodate car use. These main streets were originally
				built (mostly pre-1960) in conjunction with the surrounding housing stock and have co-evolved
				with physical and demographic changes. Key to this is the original built form and how adaptable
				it is over time. In the current context, such main streets offer prime opportunities for infill
				housing as they already provide ample supportive infrastructure.
			</p>
			<p>
				At the lower end of the spectrum are main streets that are heavily car-dependent places with
				large format (big box) retail and offer limited civic infrastructure. Such main streets tend
				to serve a larger catchment area and possess fewer independent businesses. <a
					href="/casestudies/edmonton/sherwooddrive">Sherwood Drive</a
				>,
				<a href="/casestudies/edmonton/parsonsroadsw">Parsons Road (South Edmonton Common)</a>,
				<a href="/casestudies/edmonton/104streetnw"> 104 Street NW (Calgary Trail)</a>, and
				<a href="/casestudies/edmonton/50avenue">50 Avenue (Leduc)</a>
				are examples of main streets that are designed to accommodate cars and are dominated by large
				parking lots. These places are among the least resilient main streets and draw a lower share
				of visitors from their surrounding neighbourhoods.
			</p>
			<p>
				Edmonton’s recent District Planning and zoning amendments clearly recognize the goal of
				creating ’15-minute neighbourhoods’ that intend to generate a range of economic, social, and
				environmental benefits to residents and local businesses. This policy approach applies the
				positive lessons provided by ‘traditional main’ streets that are dense and walkable, but
				most importantly, adaptable to ever changing local needs. While it also recognizes the
				failures of more recently built suburban main streets and neighbourhoods that are dominated
				by car use and are associated with many negative outcomes. Success in implementing these
				policies will have a significant impact on Edmonton’s long-term urban form, and ultimately,
				the quality of life of current and future residents.
			</p>
			{/if}
		</div>
	</div>

	<div class="image-container">
		<div>
			<img class="report-image" src="https://i.imgur.com/yVJb0bT.jpeg" alt={fr ? 'Whyte Avenue' : 'kingstonroad'} />
			<h5>Whyte Avenue</h5>
		</div>
		<div>
			<img class="report-image" src="https://i.imgur.com/J3JdmjW.jpeg" alt={fr ? 'Stony Plain Road NW' : 'missdundas'} />
			<h5>Stony Plain Road NW</h5>
		</div>
	</div>
</div>
