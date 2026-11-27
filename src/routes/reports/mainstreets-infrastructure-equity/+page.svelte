<script>
	import civic from '../../lib/assets/graphics/civic.svg';
	import KeyFindings from '../../lib/ui/KeyFindings.svelte';
	import Title from '../../lib/ui/Title.svelte';
	import CIIHousingMap from './CIIHousingMap.svelte';
	import CIIMainStreetMap from './CIIMainStreetMap.svelte';
	import CIIRecentImmigrantsMap from './CIIRecentImmigrantsMap.svelte';
	import CivicInfraIndexMap from './CivicInfraIndexMap.svelte';

	import '../../styles.css';
	import { getLang } from '../../lib/i18n';

	const fr = getLang() === 'fr';

	// order of graphs: downtown, neighbourhood, small towns, malls
</script>

<Title
	outline={civic}
	name={fr ? 'Équité des infrastructures et rues principales' : 'Infrastructure Equity & Main Streets'}
	location={fr
		? 'Cerner les lacunes en matière d’équité dans l’infrastructure civique des rues principales'
		: 'Identifying equity gaps in main street civic infrastructure'}
/>

<div class="full-text">
	{#if fr}
	<p>
		Toutes les personnes qui vivent dans les villes canadiennes devraient avoir un accès égal à
		l’infrastructure civique de base, quel que soit leur quartier. Malheureusement, ce n’est pas le
		cas aujourd’hui. Non seulement l’infrastructure civique est-elle inégalement répartie au sein des
		grandes régions urbaines, mais on observe aussi des tendances constantes et préoccupantes qui
		pourraient poser des problèmes à long terme pour les communautés mal desservies.
	</p>
	<p>
		Ce rapport examine l’offre d’infrastructure civique dans les régions de Toronto, de Montréal et
		d’Edmonton à l’échelle des quartiers, en lien avec la construction de logements, les tendances de
		l’immigration et la géographie des rues principales. La recherche montre que les déficits
		d’infrastructure civique se trouvent le plus souvent dans les ensembles résidentiels de banlieue
		récemment construits. Ces quartiers sont fortement peuplés de personnes immigrantes, ce qui les
		expose davantage à l’exclusion des services publics essentiels et des programmes
		communautaires. On craint aussi que, dans la course pour résoudre la crise du logement, nous
		négligions d’investir suffisamment dans l’infrastructure civique essentielle à la création de
		collectivités complètes et inclusives. Et, dans bien des cas, les nouveaux ensembles de banlieue
		ne sont pas planifiés ni aménagés autour de rues principales pouvant servir de points de
		convergence pour les quartiers.
	</p>
	{:else}
	<p>
		Everyone living in Canadian cities should have equal access to basic civic infrastructure, no
		matter what neighbourhood they reside in. Unfortunately, this is not the case today. Not only is
		civic infrastructure unequally distributed within major urban regions; there are also some
		troublingly consistent patterns that pose potential long-term issues for underserved
		communities.
	</p>
	<p>
		This report examines civic infrastructure provision in the Toronto, Montreal, and Edmonton
		regions at the neighbourhood scale in relation to housing construction, immigration patterns,
		and the geography of main streets. The research shows that civic infrastructure deficits are
		most commonly found in recently built suburban housing developments. These neighbourhoods are
		heavily populated by immigrants, placing them at greater risk of exclusion from essential public
		services and community programs. There is another concern that in the rush to tackle the housing
		crisis, we are neglecting to invest sufficiently in the civic infrastructure that is essential
		for building inclusive, complete communities. And, in many cases, new suburban developments are
		not planned and developed around main streets that can serve as focal points for neighbourhoods.
	</p>
	{/if}
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>{fr ? 'Indice d’infrastructure civique' : 'Civic Infrastructure Index'}</h3>
			{#if fr}
			<p>
				Pour chaque région urbaine cartographiée, nous avons évalué l’offre relative d’infrastructure
				civique par quartier. Notre indice d’infrastructure civique calcule un dénombrement pondéré
				des établissements d’infrastructure civique (selon le nombre d’employés) par rapport à la
				taille de la population locale (dans un rayon de 1&nbsp;km). Ces tendances sont illustrées en
				reportant l’indice sur les grandes artères des secteurs résidentiels bâtis de chaque région.
				Les centres-villes des régions de Toronto, de Montréal et d’Edmonton présentent une
				concentration relativement élevée d’infrastructure civique. Ce n’est pas surprenant&nbsp;: les
				bibliothèques centrales, les hôtels de ville et les grands hôpitaux sont généralement regroupés
				au centre-ville pour desservir une population plus large. À l’extérieur des centres-villes,
				les secteurs où l’infrastructure civique est plus concentrée sont généralement des quartiers
				plus anciens et bien établis. À l’inverse, les secteurs qui présentent les plus importants
				déficits d’infrastructure civique se trouvent généralement dans des quartiers de banlieue plus
				récents.
			</p>
			{:else}
			<p>
				For each urban region we mapped, we evaluated the relative provision of civic infrastructure
				by neighbourhood. Our Civic Infrastructure Index calculates a weighted count of civic
				infrastructure establishments (by employees) relative to the size of the local population
				(within 1 km). These patterns are visualized by transposing the index onto major roadways in
				built-up residential areas of each region. City centres in the Toronto, Montreal, and
				Edmonton regions show a relatively high concentration of civic infrastructure. This is
				unsurprising: central library branches, city halls, and major hospitals tend to be clustered
				in downtowns to serve wider populations. Outside of the city centres, the places with a
				higher concentration of civic infrastructure tend to be older, well-established
				neighbourhoods. Conversely, the places that tend to have the largest civic infrastructure
				deficits are in more recently constructed suburban neighbourhoods.
			</p>
			{/if}
		</div>
	</div>
	<div class="chart-container sticky-content">
		<CivicInfraIndexMap
			section={'civic-infra-index'}
			title={fr ? 'Indice d’infrastructure civique' : 'Civic Infrastructure Index'}
		/>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>
				{fr
					? 'Infrastructure civique et nouveaux quartiers'
					: 'Civic Infrastructure & New Communities'}
			</h3>
			{#if fr}
			<p>
				Pour examiner le lien géographique entre les déficits d’infrastructure civique et les
				quartiers plus récents, nous avons superposé l’indice d’infrastructure civique et la
				proportion du parc de logements construite depuis 2010. Nous repérons les grandes artères qui
				se situent sous la médiane de l’indice d’infrastructure civique et au-dessus de la médiane
				de la proportion de logements construits. Nous utilisons des quartiles pour classer davantage
				les rues en quatre catégories. Les rues en blanc sur la carte sont les secteurs qui présentent
				à la fois les plus importants déficits d’infrastructure civique et la plus grande quantité de
				nouveaux logements. Dans les trois régions, on observe une tendance constante de déficits
				d’infrastructure civique en périphérie urbaine, dans les quartiers construits plus récemment.
				Cela remet en question l’efficacité des politiques d’aménagement qui fixent l’offre
				d’infrastructure civique en fonction de la construction de logements. Le modèle d’offre
				d’infrastructure civique des nouveaux ensembles de banlieue est aussi en cause&nbsp;: il
				privilégie des installations de plus grande envergure, en moins d’endroits, ce qui éloigne
				physiquement de nombreux quartiers des ressources clés et, potentiellement, les éloigne aussi
				sur le plan des liens personnels et de la réceptivité aux besoins de la collectivité.
			</p>
			{:else}
			<p>
				To examine the geographic connection between civic infrastructure deficits and newer
				communities, we overlayed the Civic Infrastructure Index with the share of the housing stock
				constructed since 2010. We identify major streets that are below the median on the Civic
				Infrastructure Index and above the median on the share of housing built. We use quartiles to
				further segment the streets into four categories. The streets in white on the map are the
				places that have both the largest civic infrastructure deficits and the greatest amount of
				new housing. In all three regions, there is a consistent pattern of civic infrastructure
				deficits on the urban fringe, in more recently built communities. This calls into question
				the effectiveness of planning policies that stipulate the amount of civic infrastructure
				provision relative to housing construction. Also at issue is the model of civic
				infrastructure provision in newer suburban developments that favours larger-scale facilities
				in fewer locations, leaving many neighbourhoods physically further away from key assets and
				potentially more distant in terms of personal connection and community responsiveness.
			</p>
			{/if}
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<CIIHousingMap
			section={'civic-infra-index-housing'}
			title={fr
				? 'Indice d’infrastructure civique selon le % de logements récents'
				: 'Civic Infrastructure Index in relation to % of New Housing'}
		/>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>
				{fr
					? 'Infrastructure civique, immigrants et résidents non permanents'
					: 'Civic Infrastructure & Immigrants and Non-Permanent Residents'}
			</h3>
			{#if fr}
			<p>
				Une grande partie de la croissance démographique du Canada, et de la demande de logements qui
				en découle, provient de l’immigration. La majorité des personnes nouvellement immigrées
				choisissent de s’établir dans les plus grandes régions urbaines. Les municipalités des régions
				de Toronto, de Montréal et d’Edmonton peinent toutes à construire des logements assez
				rapidement pour répondre à cette demande. Résultat&nbsp;: les nouveaux ensembles résidentiels de
				banlieue sont souvent habités par des familles immigrantes sans niveau suffisant
				d’infrastructure civique. Le danger est que nous établissions un schéma dans lequel les
				communautés établies depuis plus longtemps (en grande partie d’origine européenne) profitent
				d’une infrastructure civique abondante dans des quartiers plus urbains, tandis que les
				communautés immigrantes (en grande partie racisées) en sont privées.
			</p>
			{:else}
			<p>
				A large amount of Canada’s population growth, and subsequent demand for housing, is from
				immigration. The majority of newly arrived immigrants choose to live in the largest urban
				regions. Municipalities in the Toronto, Montreal, and Edmonton regions are all struggling to
				get housing built fast enough to meet this demand. The net result is often that new suburban
				housing developments are being populated by immigrant families without sufficient levels of
				civic infrastructure. The danger is that we are establishing a pattern whereby
				longer-established communities (of largely European descent) enjoy ample civic
				infrastructure in neighbourhoods that are more urban, while (largely racialized) immigrant
				communities do not.
			</p>
			{/if}
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<CIIRecentImmigrantsMap
			section={'civic-infra-index-recent-immigrants'}
			title={fr
				? 'Indice d’infrastructure civique selon le % d’«\u00a0immigrants et résidents non permanents\u00a0»'
				: 'Civic Infrastructure Index in relation to % of "Immigrants and Non-Permanent Residents"'}
		/>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>
				{fr
					? 'Infrastructure civique et rues principales à forte densité'
					: 'Civic Infrastructure & High Density Main Streets'}
			</h3>
			{#if fr}
			<p>
				Un problème fondamental de l’infrastructure civique dans les quartiers de banlieue récents est
				qu’ils ne sont pas structurés autour de rues principales, même si bon nombre d’entre eux sont
				plus densément peuplés que ceux du milieu du XXe&nbsp;siècle qui les ont précédés. Si
				l’utilisation du sol à des fins résidentielles est devenue plus efficace, ce n’est pas le cas
				des usages commerciaux ni de l’infrastructure civique. Les cartes montrent où les lacunes en
				infrastructure civique sont les plus importantes (grandes artères, en blanc) par rapport à
				l’emplacement des rues principales denses (en bleu clair). Ces éléments se chevauchent très
				rarement&nbsp;: les quartiers présentant d’importants déficits d’infrastructure civique n’ont
				généralement pas de rue principale, et les quartiers dotés de rues principales ne présentent
				habituellement pas de déficits. La façon dont nous planifions et construisons les nouveaux
				ensembles résidentiels de banlieue semble être la principale cause des lacunes systémiques en
				matière d’infrastructure civique. Réintroduire la rue principale comme élément fondamental de
				collectivités complètes et inclusives est une façon claire d’y remédier. Une autre solution
				consiste à poursuivre la densification résidentielle sur les rues principales existantes et à
				proximité, là où l’infrastructure civique est déjà abondante (et même, dans certains cas,
				excédentaire).
			</p>
			{:else}
			<p>
				A foundational problem of civic infrastructure in recently built suburban communities is
				that they are not centred on main streets, even though many are more densely populated than
				those of their mid-20th century predecessors. While land use for housing has become more
				efficient, commercial land uses and civic infrastructure have not. The maps show where civic
				infrastructure gaps are greatest (major roadways, in white) in relation to the locations of
				dense main streets (in light blue). There are very few instances where these elements
				overlap – neighbourhoods with significant civic infrastructure deficits generally do not
				have main streets, and neighbourhoods with main streets do not typically have infrastructure
				deficits. How we plan and build new suburban housing developments appears to be the main
				culprit when it comes to systemic gaps in civic infrastructure. Reintroducing main streets
				as a fundamental building block of inclusive, complete communities is a clear way to address
				this. Another solution is to continue to build infill housing on and near existing main
				streets where there is ample (and even in some cases, surplus) civic infrastructure already
				in place.
			</p>
			{/if}
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<CIIMainStreetMap
			section={'civic-infra-index-main-streets'}
			title={fr
				? 'Indice d’infrastructure civique (quintile inférieur) et rues principales à forte densité'
				: 'Civic Infrastructure Index (Lowest Quintile) in relation to High Density Main Streets'}
		/>
	</div>
</div>

<div class="key-findings">
	<h3>{fr ? 'Principaux constats et messages' : 'Key Findings and Messages'}</h3>

	<KeyFindings
		number={'1'}
		finding={fr
			? 'Les plus importants déficits d’infrastructure civique se trouvent surtout dans les quartiers de banlieue construits plus récemment.'
			: 'The greatest deficits of civic infrastructure are predominantly found in more recently built suburban neighbourhoods.'}
		message1={fr
			? 'Dans la course pour résoudre la crise du logement, ne pas négliger les besoins en infrastructure à l’échelle du quartier.'
			: 'In the rush to address the housing crisis do not ignore the need for neighbourhood scale infrastructure.'}
		message2={fr
			? 'Maintenir un lien direct entre les redevances d’aménagement et les investissements dans l’infrastructure civique.'
			: 'Maintain direct connection between development charges and civic infrastructure investment.'}
		message3={fr
			? 'Favoriser la densification résidentielle sur les rues principales existantes (et à proximité) qui offrent déjà une infrastructure civique abondante.'
			: 'Encourage infill housing on (and near to) existing main streets that provide ample existing civic infrastructure.'}
	/>

	<KeyFindings
		number={'2'}
		finding={fr
			? 'Les quartiers de banlieue récents ne sont généralement pas structurés autour de rues principales.'
			: 'Recently built suburban neighborhoods are not typically centered around main streets.'}
		message1={fr
			? 'Partir des rues principales lors de la planification de nouveaux quartiers de banlieue.'
			: 'Begin with main streets when planning new suburban neighbourhoods.'}
		message2={fr
			? 'Créer une masse critique sur les rues principales en (co)localisant l’infrastructure civique à proximité des usages commerciaux.'
			: 'Create critical mass on main streets by (co)locating civic infrastructure in close proximity to commercial uses.'}
		message3={fr
			? 'Adapter l’envergure des installations d’infrastructure civique à des quartiers propices à la marche.'
			: 'Align scale of civic infrastructure facilities to walkable neighbourhoods.'}
	/>

	<KeyFindings
		number={'3'}
		finding={fr
			? 'Les personnes récemment immigrées sont plus susceptibles de vivre dans des quartiers de banlieue récents et de subir des déficits d’infrastructure civique.'
			: 'Recent immigrants are more likely to live in recently built suburban neighbourhoods and experience civic infrastructure deficits.'}
		message1={fr
			? 'Veiller à ce que l’infrastructure civique et les services publics correspondent aux niveaux d’immigration et aux tendances d’établissement.'
			: 'Ensure that the civic infrastructure and public services are aligned with immigration levels and patterns of settlement.'}
		message2={fr
			? 'Écouter les communautés au sujet de leurs besoins en infrastructure civique et les associer réellement aux décisions d’investissement.'
			: 'Listen to communities about their civic infrastructure needs and genuinely include them in investment decisions.'}
		message3={fr
			? 'Adapter l’offre et la programmation de l’infrastructure civique aux besoins propres à chaque quartier.'
			: 'Align provision and programming of civic infrastructure to specific neighbourhood needs.'}
	/>
</div>
