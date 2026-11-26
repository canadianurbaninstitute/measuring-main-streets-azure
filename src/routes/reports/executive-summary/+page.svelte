<script>
	import '../../styles.css';
	import Footer from '../../lib/ui/Footer.svelte';
	import { getLang } from '../../lib/i18n';

	const fr = getLang() === 'fr';
</script>

<div class="collage-image-container">
	<img src="https://i.imgur.com/0xWjVS8.png" alt={fr ? 'Collage des régions' : 'region-collage'} />
</div>

<div class="hero">
	<h1>{fr ? 'Sommaire' : 'Executive Summary'}</h1>

</div>

<div class="hero">
{#if fr}
<p>
	La plateforme Mesures des rues principales cartographie, analyse et explore le rôle de l’infrastructure civique et des autres éléments qui composent les milliers de rues principales du Canada. Elle vise à comprendre le profil d’une variété de milieux de rue principale ainsi que le rôle de l’infrastructure civique, des commerces, du logement, des infrastructures et du cadre bâti et du domaine public dans la création et le maintien de rues principales dynamiques dans les collectivités canadiennes. La plateforme est le premier outil de recherche qui utilise la rue principale comme unité d’analyse principale. Elle repère et cartographie chaque rue principale au Canada et fournit des données sur les commerces et l’infrastructure civique qui s’y trouvent, ainsi qu’un profil démographique du quartier que dessert chaque rue principale. Le projet initial a utilisé ces données pour mieux comprendre les rues principales sous l’angle de la résilience, de la collectivité et de l’équité.
</p>

<p>La plateforme offre diverses applications pour comprendre les dynamiques qui influent sur la résilience et la reprise. Premièrement, l’Institut urbain du Canada a réalisé une analyse détaillée de la résilience des rues principales à partir d’études de cas dans trois villes – Montréal, Toronto et Edmonton – au fil des étapes de la pandémie de COVID-19. Diverses sources de données ont été utilisées, des données GPS de téléphones cellulaires servant à mesurer la fréquentation à la recherche par observation visant à comprendre les commerces, les services, le cadre bâti, le domaine public et les autres générateurs d’activité, pour un total de 30 études de cas (dix dans chacune des trois régions urbaines). Cette analyse a révélé que les rues principales desservant surtout une population locale ont généralement connu une baisse moins marquée de la fréquentation au début de la pandémie ou une reprise plus rapide. À l’inverse, les rues principales des centres-villes des trois villes ont généralement été les plus durement touchées et ne se sont pas entièrement rétablies. Selon les observations et l’analyse des données, la présence d’espaces verts a été un facteur clé d’une plus grande résilience pendant la pandémie.</p>

<p>Deuxièmement, les milieux de rue principale ont été comparés aux trajectoires des centres commerciaux régionaux pendant la pandémie. La recherche a montré que la plupart des centres commerciaux ont subi des baisses plus prononcées de l’achalandage et de l’activité, mais qu’ils se sont rétablis plus rapidement. Nos résultats montrent que si les confinements stricts ont eu un effet plus important sur les centres commerciaux, la population y est retournée plus tôt que dans de nombreux milieux de rue principale.</p>

<p>Troisièmement, la recherche évalue l’effet de l’évolution des habitudes de dépenses pendant la pandémie. Les données révèlent que l’utilisation du commerce électronique a bondi pendant la pandémie, ce qui a sonné l’alarme pour le commerce de détail traditionnel en magasin, mais que le commerce électronique est revenu à ses tendances historiques après la pandémie.</p>

<p>Enfin, les travaux analysent la répartition équitable de l’infrastructure civique dans les trois régions urbaines. Notre recherche montre que les déficits d’infrastructure civique sont les plus marqués dans les quartiers de banlieue récemment construits, où la proportion de personnes immigrantes tend à être plus élevée. Bon nombre de ces ensembles résidentiels sont planifiés sans rue principale et ont une faible capacité d’adaptation. À l’inverse, on observe des surplus d’infrastructure civique dans de nombreux quartiers bien établis qui ont connu une baisse de population. Ces secteurs ont généralement des rues principales traditionnelles qui offrent d’importantes possibilités de densification résidentielle, ce qui pourrait améliorer l’efficacité des infrastructures existantes.</p>

<p>Somme toute, le principal atout des rues principales est leur rôle dans le développement des collectivités. Les entreprises indépendantes et l’infrastructure civique à l’échelle du quartier sont à la fois le produit et le reflet des cultures et des besoins locaux. Lorsqu’ils sont bien soutenus, ces atouts sont essentiels au maintien de rues principales dynamiques.</p>

<p>Bien qu’il n’existe pas de modèle unique de rue principale idéale, notre recherche fait ressortir certains principes communs aux lieux qui affichent des réussites relatives sur les plans de la résilience, de la collectivité et de l’équité. En examinant ces thèmes ensemble, selon une approche géographique dans chacune des trois régions, certains types de rues se dégagent. Les rues principales les plus performantes étaient généralement celles qui desservent des quartiers résidentiels bien établis et propices à la marche. Ces rues principales comptent des bâtiments flexibles, qui ont été adaptés au gré de l’évolution de la population locale. Les rues principales les plus résilientes ont aussi tendance à offrir une gamme d’options de logement. En revanche, dans un contexte de banlieue où les rues principales sont conçues en fonction de l’automobile, avec des bâtiments à usage unique, une faible densité résidentielle et moins d’infrastructure civique, ce milieu peut plus difficilement remplir les fonctions d’une rue principale, et le manque de vitalité en témoigne.</p>

<p>Le projet Mesures des rues principales a débuté en juin 2022 et a été officiellement lancé en juin 2024. La plateforme se trouve à l’adresse <a href='/'>www.measuringmainstreets.ca</a>. Elle comprend quatre composantes principales&nbsp;: une carte interactive de toutes les rues principales du Canada, des notes de recherche thématiques et régionales, des études de cas détaillées de rues principales, ainsi qu’un ensemble d’outils de données et de visualisation. La plateforme Mesures des rues principales sera accessible au public et servira de carrefour pour la recherche sur les rues principales.</p>
{:else}
<p>
	The Measuring Main Streets Platform (MMSP) maps, analyses and explores the role of civic infrastructure and other elements that make-up the thousands of main streets throughout Canada to understand the profile of a variety of main street environments and the role of civic infrastructure, businesses, housing, infrastructure and the built form/public realm in creating and maintaining vibrant main streets in Canadian communities. The MMSP is the first research tool that uses main streets as the primary unit of analysis. It identifies and maps every main street in Canada and supplies data on the businesses and civic infrastructure present as well as a demographic profile of the neighbourhood each main street serves. The original project used the data to better understand main streets across the themes of resiliency, community, and equity. 
</p>

<p>MMSP offers a range of applications to understand the dynamics impacting resiliency and recovery. First, the Canadian Urban Institute has provide detailed analysis  of main street resiliency using case studies in three cities: Montreal, Toronto and Edmonton through the stages of the COVID pandemic. A variety of data sources from GPS cell phone data used to measure visitor levels to observational research to understand businesses, amenities, built form, public realm and other generators of activity for a total of 30 case studies (ten in each of the three urban regions). This analysis revealed that main streets that primarily serve a local population tended to experience a lower drop in visitor numbers at the onset of the pandemic and/or recovered more quickly. Conversely, main streets in the downtowns of the three cities were generally hit the hardest and have not fully recovered. Based on observational and data analysis, the presence of greenspace was a key type aspect of higher levels of resiliency through the pandemic.</p>

<p>Second, main street environments were compared to the trajectories of regional shopping centres through the pandemic. Research found that most malls experienced sharper declines in footfall and activity but faster recoveries. Our findings show that while hard lockdowns had a greater impact on shopping centres, people returned to them sooner than to many main street environments. </p>

<p>Third, research evaluates the impact of changing spending trends during the pandemic. While data reveals that e-commerce usage spiked during the pandemic, setting off alarm bells for traditional bricks-and-mortar retail, but e-commerce levels returned to historical trendlines post-pandemic. </p>

<p>Finally, the work analyzes the equitable distribution of civic infrastructure across the three urban regions. Our research shows that civic infrastructure deficits are most acute in recently built suburban neighbourhoods that tend to have higher levels of immigrant populations. Many of these housing developments are planned without main streets and have a low capacity to adapt. Conversely, civic infrastructure surpluses are found in many well-established neighbourhoods that have experienced population decline. These places tend to have traditional main streets that present significant opportunities for infill housing, which could improve the efficiency of existing infrastructure.</p>

<p>In total, the key advantage that main streets possess is their role in community building. The presence of independent business and neighbourhood scale civic infrastructure are creations and reflections of local cultures and needs. When properly supported, these assets are essential to maintaining vibrant main streets. </p>

<p>While there is no singular model of an ideal main street, our research does highlight some common principles of places that demonstrate relative successes across the themes of resiliency, community, and equity. By examining the themes together from a geographic approach in each of three regions some types of streets become evident. The well-performing main streets tended to be places that served well-established walkable residential neighbourhoods. These main streets possessed buildings that are flexible and have been adapted as local populations shifted. The most resilient main streets also tend to offer a range of housing options. By contrast, in a suburban context where main streets are built around car use, single use buildings, low housing density, and less civic infrastructure the ability of this environment to serve the purposes of a main street is more difficult and the lack of vibrancy reflects this. </p>

<p>The Measuring Main Street project began in June of 2022 and formally launched in June 2024. The platform can be found at <a href='/'>www.measuringmainstreets.ca</a>. It is comprised of four primary components, an interactive map of all main streets in Canada, thematic and regional research briefs, detailed main street case studies, and a set of data and visualization tools. The Measuring Main Streets Platform will be publicly available and serve as a hub of main street research going forward.</p>

{/if}
</div>


<Footer/>

<style>


@media only screen and (min-width: 768px) {
	.hero {
		margin: 2em 15em 2em 15em;
	}
}

img {
    width: 100%;
}
</style>