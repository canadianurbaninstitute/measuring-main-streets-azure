<script>
	import Title from '../../lib/ui/Title.svelte';
	import blank from '../../lib/assets/graphics/blank.svg';
	import CaseStudyLocationsMap from './CaseStudyLocationsMap.svelte';
	import RecoveryMultiLineChart from '../mainstreets-malls-mice/RecoveryMultiLineChart.svelte';
	import CIIMainStreetMap from './CIIMainStreetMap.svelte';
	import BubbleChart from '../../lib/BubbleChart.svelte'
	import Footer from '../../lib/ui/Footer.svelte';
	import LanguageSelector from '../../lib/ui/LanguageSelector.svelte';

	import { dataset } from '../../lib/data/reportdata/montreal/selectLabels.js';
	import data from '../../lib/data/reportdata/montreal/bubble-montreal.csv';




	import '../../styles.css';

	// order of graphs: downtown, neighbourhood, small towns, malls
</script>

<Title
	outline={blank}
	name={'Montréal'}
	location={'Les rues principales de la région de Montréal'}
	bg={'https://i.imgur.com/2sGLoIh.jpeg'}
/>

<LanguageSelector eng={'/reports/montreal'} fr={'/reports/montreal-fr'} selected='fr'/>


<div class="full-text">
	<p>
		Des rues principales dynamiques sont essentielles à la construction de quartiers prospères. Des quartiers prospères sont essentiels à la vitalité des villes. Et des villes saines sont le fondement d’un pays fort.

		Plus de 4 millions de personnes vivent dans la région de Montréal et 96 % d’entre elles habitent à moins d’un kilomètre d’une rue principale. Les rues principales de Montréal abritent plus de 23 000 entreprises qui emploient 215 000 personnes et génèrent plus de 30 milliards de dollars de revenus par année. On compte également près de 8 000 infrastructures municipales le long des rues principales.
	</p>
	<p>
		Les entreprises et les infrastructures municipales des rues principales jouent un rôle crucial dans la vie quotidienne des personnes qui habitent les villes. Mais lorsque les rues principales souffrent, les gens souffrent. La pandémie de COVID-19 a causé de grandes souffrances au sein des rues principales, entraînant la fermeture d’entreprises et, par la suite, des vitrines vides. Bien que certaines rues principales de la région de Montréal aient rebondi, bon nombre d’entre elles ne se sont pas complètement rétablies.  
	</p>
	<p>

		Nos recherches montrent que les <a href="/reports/mainstreet-resiliency">rues principales les plus résistantes sont celles qui sont les plus étroitement liées à leur communauté locale immédiate</a>. Les perspectives pour les entreprises indépendantes et les infrastructures municipales à l’échelle du quartier sont des éléments clés pour lutter contre les menaces à plus long terme qui pèsent sur les rues principales, telles que <a href="reports/mainstreets-malls-mice">le commerce électronique et les centres commerciaux régionaux</a>.
	</p>
	<p>
		Malheureusement, <a href="/reports/mainstreets-infrastructure-equity">les ressources communautaires ne sont pas réparties équitablement dans les régions urbaines</a>, y compris dans la région de Montréal. De plus, il existe une pénurie d’infrastructures municipales dans les quartiers de banlieue plus récents qui n’ont pas été développés autour d’une rue principale. Ce document de recherche examine les rues principales sous l’angle de la résilience, de la communauté et de l’équité, en s’appuyant sur 20 études de cas de rues principales de la région de Montréal.
	</p>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Les rues principales de l’étude de cas de Montréal</h3>
			<p>
				Vingt rues principales ont été choisies dans la région de Montréal comme études de cas représentatives. Dix d’entre elles ont fait l’objet d’une recherche par observation directe et d’une analyse détaillée des données, tandis que les dix autres n’ont fourni que des données.
			</p>
			<p>Les études de cas ont également été comparées à cinq centres commerciaux régionaux. </p>
			<p>
				En outre, nous avons sélectionné des rues principales qui reflètent un échantillon représentatif de géographies, y compris quatre rues de centres-villes (orientées vers le lieu de travail), quatre rues principales de petites villes et 12 rues principales de quartier (orientées vers les résidents). 
			</p>
			<p>
				La présence de communautés méritant l’équité a également représenté un facteur clé dans le processus de sélection.  
		</div>
	</div>

	<div class="chart-container sticky-content">
		<CaseStudyLocationsMap />
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Résilience des rues principales</h3>
			<p>
				Bien que l’ensemble des rues principales de la région de Montréal aient connu de sérieux ralentissements au cours de la pandémie, certaines ont été plus durement touchées et ont mis plus de temps à s’en remettre. 
			</p>
			<p>
				Notre <a href="/reports/mainstreet-resiliency">analyse statistique</a> montre que les rues principales les plus résilientes sont celles qui attirent une forte proportion de visiteurs provenant du voisinage immédiat (dans un rayon d’un kilomètre). À l’inverse, les rues principales les moins résilientes ont tendance à attirer une plus grande part de leurs visiteurs provenant de régions plus éloignées.
			</p>
			<p>
				Les rues principales situées dans les centres-villes et à proximité de ceux-ci ont été plus durement touchées par la pandémie et ont mis plus de temps à s’en remettre. Le deuxième facteur le plus important associé à la résilience pendant la pandémie était la présence d’espaces verts, car les gens recherchaient des endroits sécuritaires où un certain degré d’interaction sociale restait possible.
			</p>
			<p>
				Parmi les 20 rues principales de la région de Montréal, il y avait des exemples de petites villes, de centres-villes et de rues résidentielles démontrant des niveaux plus élevés de résilience. L’étude de cas de la rue principale la plus résiliente est celle de <a href="/casestudies/montreal/ruestanne">Sainte-Anne-de-Bellevue</a>, qui démontre un taux élevé de visiteurs (27 %) provenant de moins d’un kilomètre. <a href="/casestudies/montreal/ruestpaul">La rue Saint-Paul</a>, dans le Vieux-Montréal, est un rare exemple d’une rue principale de centres-villes qui a montré un degré de résilience plus élevé. <a href="/casestudies/montreal/avedorval">Dorval</a> et <a href="/casestudies/montreal/boulevardmonk">Ville-Émard (boulevard Monk)</a> représentent les études de cas de rues principales de quartier les plus résilientes de la région de Montréal.
			</p>
			<p>
				Les rues <a href="/casestudies/montreal/stdenis">Saint-Denis</a> et <a href="/casestudies/montreal/notredame">Notre-Dame (Saint-Henri)</a> figurent parmi les études de cas de rues principales les moins résilientes de la région de Montréal. Toutes deux sont situées à la périphérie du centre-ville et comptent sur une plus grande proportion de visiteurs provenant de plus d’un kilomètre. La rue principale la moins résiliente de l’étude de cas de quartier est <a href="/casestudies/montreal/rueontario">la rue Ontario</a> à Hochelaga. Elle a capté 20 % de ses visiteurs à moins de 1 km en 2019, ce qui se situe au bas de l’échelle des rues principales de type quartier.
			</p>
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<RecoveryMultiLineChart dataset={dataset} title={'Pourcentage du nombre de visites (par rapport à 2019)'}/>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Communauté des rues principales</h3>
			<p>
				Bien que la pandémie ait posé un défi majeur aux rues principales de la région de Montréal, des sources de tension à plus long terme persistent également.
			</p>
			<p>
				<a href="/reports/mainstreets-malls-mice">Les centres commerciaux régionaux et le commerce électronique offrent des choix alternatifs</a> à de nombreux biens et services offerts sur les rues principales. Les centres commerciaux ont d’abord été plus durement touchés par la pandémie en raison des effets brutaux des confinements, mais ils ont généralement rebondi plus rapidement. Le recours au commerce électronique a connu un pic entre 2020 et 2022 avant de revenir à sa tendance historique à la hausse (plus modeste) en 2023.
			</p>
			<p>
				Malgré un certain degré de chevauchement de l’activité commerciale entre les rues principales et les centres commerciaux et le commerce électronique, il existe également des différences significatives. Les rues principales offrent plus de possibilités pour les entreprises indépendantes et fournissent davantage d’infrastructures municipales. Elles peuvent toutes deux mieux répondre aux besoins spécifiques de la communauté locale, et les relations tissées grâce aux interactions entre les locaux, les opérateurs commerciaux et les gestionnaires de l’infrastructure municipale sont essentielles à la vitalité à long terme des rues principales.
			</p>
			<p>
				Les cinq centres commerciaux de la région de Montréal présentent manifestement une pénurie de commerces indépendants et d’infrastructures municipales, se classant en dessous de toutes les rues principales pour ces deux critères. Parmi les rues principales de l’étude de cas de Montréal, <a href="/casestudies/montreal/boulevardmonk">le boulevard Monk (Ville-Émard)</a>, <a href="/casestudies/montreal/ruestcharles">la rue Saint-Charles (Vieux Longueil)</a> et <a href="/casestudies/montreal/notredame">la rue Notre-Dame (Saint-Henri)</a> se distinguent par des parts plus élevées de commerces indépendants et d’infrastructures municipales. Chacune de ces rues principales est un exemple de rue principale plus ancienne, bien établie, dense et praticable. Elles possèdent une variété de types de bâtiments qui sont généralement flexibles et adaptables. Deux des études de cas portant sur des rues principales de petites villes se sont également classées parmi les dix premières pour ce qui est du commerce indépendant et de l’infrastructure municipale commune. <a href="/casestudies/montreal/ruestgeorge">La rue George (Saint-Jérôme)</a> et <a href="/casestudies/montreal/steustache">la rue Saint-Eustache (Saint-Eustache)</a> présentent toutes deux des atouts propices à l’établissement de communautés locales fortes.
			</p>
			<p>
				<a href="/casestudies/montreal/avenuevictoria">L’avenue Victoria (Saint-Lambert)</a> et <a href="/casestudies/montreal/boulevardstmartin">le boulevard Saint-Martin (Laval)</a> sont des rues principales situées à l’autre extrémité du spectre. Il s’agit d’endroits où l’infrastructure commerciale et municipale est moins indépendante, qui sont fortement axés sur l’automobile et qui se caractérisent par la présence de grandes surfaces commerciales et de chaînes de restaurants. Ces rues principales ne possèdent pas d’identité bien définie et sont moins susceptibles d’être façonnées par la communauté locale.
			</p>			
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<BubbleChart data={data} />
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>L’équité des rues principales</h3>
			<p>
				Les rues principales abritent les entreprises et les infrastructures municipales qui sont essentielles à la vie quotidienne des personnes qui y habitent. Elles rendent la vie des gens meilleure, plus facile et plus agréable. Elles sont le fondement des communautés locales où les gens se rassemblent, interagissent et nouent des relations.
			</p>
			<p>
				Malheureusement, tout le monde ne bénéficie pas d’un accès égal aux rues principales et à ce qu’elles ont à offrir. Dans certains cas, les rues principales sont dépourvues d’infrastructures municipales essentielles, mais plus particulièrement, certains quartiers sont totalement dépourvus de rues principales. Notre analyse montre que c’est dans les quartiers de banlieue de construction récente que les déficits en matière d’infrastructures municipales sont les plus importants.
			</p>
			<p>
				Notre indice d’infrastructures municipales, qui prend en compte la quantité d’infrastructures municipales locales (dans un rayon de 1 km) par rapport à la population locale, montre que les quartiers de la région de Montréal construits plus récemment dans des endroits comme Blainville, Laval et Brossard ont tendance à avoir des niveaux d’accès locaux aux infrastructures municipales inférieures à la moyenne régionale.
			</p>
			<p>
				Le centre-ville de Montréal se situe à l’autre extrémité du spectre, avec des niveaux d’infrastructure municipale beaucoup plus élevés, car il abrite de nombreux actifs d’importance régionale. <a href="/casestudies/montreal/notredame">Les rues Notre-Dame (Saint-Henri)</a> et <a href="/casestudies/montreal/stdenis">Saint-Denis</a> sont les études de cas qui obtiennent les meilleurs résultats à l’indice d’infrastructures municipales. Dans la région de Montréal, l’accès aux infrastructures municipales tend à décroître à partir du centre, de sorte que les rues principales des quartiers qui obtiennent les meilleurs résultats à l’indice sont relativement proches du centre-ville. <a href="/casestudies/montreal/ruebeaubien">La rue Beaubien (Rosemont-La-Petite-Patrie)</a> et <a href="/casestudies/montreal/rueontario">la rue Ontario (Hochelaga)</a> sont des exemples parfaits de rues principales de quartier avec des niveaux élevés d’opportunités civiques.
			</p>
			<p>
				La question fondamentale n’est pas seulement la quantité globale d’infrastructures municipales, mais la façon dont elles sont réparties géographiquement parmi les régions urbaines. Il existe un risque de créer des quartiers « nantis » et des quartiers « démunis » avec des niveaux divergents d’accès local aux infrastructures municipales, ce qui diminue le contrôle exercé sur la programmation par les personnes ayant un accès plus limité aux infrastructures municipales. Dans un tel scénario, l’infrastructure municipale répond moins aux besoins spécifiques des quartiers.
			</p>
			<p>
				Le déficit d’infrastructures municipales dans les quartiers de banlieue récemment construits n’est pas lié au montant des investissements, mais plutôt à des modèles qui favorisent les grands sites centralisés au détriment de lieux plus petits et diffus. À l’instar de la tendance à l’implantation de grandes surfaces dans les banlieues, la fourniture d’infrastructures municipales a suivi la même voie. Ces modèles peuvent être plus efficaces d’un point de vue fiscal à court terme, mais ils s’accompagnent d’une réduction du développement communautaire et de l’équité entre les quartiers à long terme.
			</p>
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<CIIMainStreetMap
			section={'civic-infra-index-main-streets'}
			title={'Indice d’infrastructure municipale (quintile le plus bas) par rapport aux rues principales à haute densité'}
		/>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Résumé</h3>
			<p>
				Notre recherche évalue les rues principales en fonction de leur résilience, de leur communauté et de leur niveau d’équité. Nous suggérons que si les caractéristiques de certaines rues principales peuvent favoriser ces éléments, elles nourriront des quartiers sains. Si cela est fait de manière cohérente dans l’ensemble des régions urbaines du Canada, elles constitueront la base de villes saines.
			</p>
			<p>
				Il n’existe pas de rue principale « parfaite ». Il existe une multitude de façons dont elles peuvent produire de la résilience, de la communauté et de l’équité. Nos recherches indiquent toutefois des principes généraux concernant les caractéristiques des rues principales qui sont plus susceptibles de générer des résultats positifs. Nous avons créé des indicateurs qui capturent le mieux l’essence de ces thèmes : un indice de résilience basé sur le changement relatif du nombre de visiteurs dans une rue principale pendant la pandémie ; la part des visiteurs qui vivent dans un rayon d’un kilomètre de la rue principale ; un indice des entreprises indépendantes ; et un indice d’infrastructures municipales qui pondère la quantité d’infrastructures par rapport à la taille de la population du quartier.
			</p>
			<p>
				La région de Montréal est une métropole prospère qui offre une qualité de vie parmi les plus élevées au monde. La région est traditionnellement reconnue pour ses quartiers vigoureux aux identités distinctes. Au centre de ces quartiers se trouvent des rues principales dynamiques qui offrent une gamme de biens, de services et d’activités qui soutiennent les gens dans leur vie quotidienne. Cependant, il n’y a pas deux rues principales identiques ; leur emplacement et leurs caractéristiques spécifiques ont un impact significatif sur l’éventail des choix locaux et des opportunités pour les personnes qui y résident.
			</p>
		</div>
	</div>

	<div class="image-container">
		<div>
			<img
				class="report-image"
				src="https://res.cloudinary.com/dfseerxb3/image/upload/Montreal/MontRoyal/2_Built_Form/IMG_6200"
				alt="downtownyonge"
			/>
			<h5>Mont Royal</h5>
		</div>
		<div>
			<img
				class="report-image"
				src="https://res.cloudinary.com/dfseerxb3/image/upload/Montreal/RueStCharles/2_Built_Form/IMG_6450"
				alt="weston"
			/>
			<h5>Rue St. Charles</h5>
		</div>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Résumé (II)</h3>
			<p>
				Les études de cas de rues principales de la région de Montréal qui obtiennent le plus régulièrement les meilleurs résultats pour les indicateurs clés ont tendance à être des rues de quartier plus éloignées du centre-ville avec une gamme de commerces indépendants et d’infrastructures municipales. <a href="/casestudies/montreal/avedorval">L’avenue Dorval</a>, <a href="/casestudies/montreal/boulevardmonk">le boulevard Monk (Ville-Émard)</a>, <a href="/casestudies/montreal/boulevardstmartin">les boulevards Saint-Martin (Laval)</a> et <a href="/casestudies/montreal/jeantalon">Jean Talon (Parc-Extension)</a> sont des rues principales de banlieue plus anciennes qui desservent principalement leurs communautés locales. Elles ont également tendance à offrir un mélange de types d’habitations qui répondent à un large éventail de niveaux de revenus. Ces rues principales ont été construites à l’origine (avant 1960) en même temps que le parc immobilier environnant et ont évolué avec les changements physiques et démographiques. L’élément clé est la forme bâtie d’origine et son adaptabilité au fil du temps. Dans le contexte actuel, ces rues principales offrent des perspectives de choix pour la construction de logements intercalaires, car elles disposent déjà d’une infrastructure de soutien suffisante.
			</p>
			<p>
				La forme urbaine générale de Montréal diffère de celle des autres régions étudiées, Toronto et Edmonton, principalement en raison de son âge. De nombreuses rues principales sont plus anciennes et peuvent donc être considérées comme « traditionnelles » dans le sens où elles sont très praticables et offrent un commerce de détail bien structuré. Les facteurs culturels contribuent aussi probablement à ce que Montréal ait des niveaux considérablement plus élevés de commerces indépendants. À long terme, ces facteurs favorisent le dynamisme des rues principales, mais à court terme, ils peuvent avoir contribué à ce que Montréal soit plus durement touchée par la pandémie, en particulier dans les zones les plus proches du centre. En plus de posséder une forme avantageuse, Montréal a également été à l’avant-garde de l’innovation en matière de rues principales. L’utilisation imaginative du domaine public et la poursuite plus audacieuse de la piétonnisation ont attiré l’attention partout au pays. Bon nombre de ces initiatives sont maintenant appuyées par des données semblables à celles que l’on peut trouver sur la plateforme Ma rue principale.
			</p>
		</div>
	</div>

	<div class="image-container">
		<div>
			<img
				class="report-image"
				src="https://res.cloudinary.com/dfseerxb3/image/upload/Montreal/RueOntario/2_Built_Form/IMG_6286"
				alt="kingstonroad"
			/>
			<h5>Rue Ontario</h5>
		</div>
		<div>
			<img
				class="report-image"
				src="https://res.cloudinary.com/dfseerxb3/image/upload/Montreal/BoulStMartin/3_Civic/IMG_6774"
				alt="missdundas"
			/>
			<h5>Boulevard St. Martin, Laval</h5>
		</div>
	</div>
</div>

<Footer />
