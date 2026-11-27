<script>
	import malls from '../../lib/assets/graphics/malls.svg';
	import KeyFindings from '../../lib/ui/KeyFindings.svelte';
	import Title from '../../lib/ui/Title.svelte';
	import BarChart from './BarChart.svelte';
	import MultiLineChart from './MultiLineChart.svelte';
	import RecoveryMultiLineChart from './RecoveryMultiLineChart.svelte';

	import { dataset } from '../../lib/data/reportdata/mainstreets-malls-mice/selectLabels.js';
	import { getLang } from '../../lib/i18n';
	import '../../styles.css';

	const fr = getLang() === 'fr';

	// order of graphs: downtown, neighbourhood, small towns, malls
</script>

<Title
	outline={malls}
	name={fr ? 'Rues principales, centres commerciaux et souris' : 'Main Streets, Malls & Mice'}
	location={fr
		? 'Trajectoires des rues principales, des centres commerciaux et des comportements en ligne'
		: 'Trajectories of main streets, shopping malls and online behaviour'}
/>

<div class="full-text">
	{#if fr}
	<p>
		Les rues principales faisaient déjà face à de sérieux vents contraires avant le début de la
		pandémie de COVID-19, en raison de la concurrence des centres commerciaux et du virage des
		consommateurs vers le commerce en ligne. Au début de la pandémie, alors que le commerce en ligne
		montait en flèche, de nombreuses prédictions alarmistes ont été formulées au sujet des rues
		principales. On y voyait largement l’accélération d’une tendance « inévitable » qui mènerait à la
		fermeture de nombreux commerces physiques (indépendants).
	</p>
	<p>
		Bien que les petites entreprises locales fassent face à de nombreux défis connexes, la façon dont
		les consommateurs choisissent entre les rues principales, les centres commerciaux et les options en
		ligne n’a été ni linéaire ni aussi catastrophique que certains l’avaient prédit. Ce document
		examine les effets de la pandémie sur les comportements de consommation et les leçons à en tirer
		pour la résilience des rues principales. Le message principal est le suivant : pour se positionner
		au mieux face à l’attrait des centres commerciaux et du commerce en ligne, les rues principales
		doivent être au cœur de communautés locales distinctes.
	</p>
	{:else}
	<p>
		Main streets were experiencing serious headwinds before the onset of the COVID-19 pandemic, in
		the form of competition from shopping malls and shifting consumer behaviour to online retailing.
		At the onset of the pandemic there were many doomsday predictions for main streets, as online
		retailing spiked. It was widely seen as an acceleration of an “inevitable” trend that would lead
		to the shuttering of many bricks-and-mortar (independent) businesses.
	</p>
	<p>
		While there are many related challenges facing local small business communities, the trend of
		consumers to choose among main streets, shopping malls, and online options have not been linear
		or as catastrophic as some had predicted. This brief sorts out how the pandemic impacted
		consumer behaviours and what lessons can be learned for main street resiliency. The primary
		message is that main streets need to be central to building distinct local communities, to best
		position themselves relative to the lure of shopping malls and online commerce.
	</p>
	{/if}
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			{#if fr}
			<h3>Achalandage</h3>
			<p>
				Dans le cadre du projet Mesures des rues principales, nous avons suivi l’achalandage de 60 rues
				principales et de 15 centres commerciaux régionaux dans les régions de Toronto, de Montréal et
				d’Edmonton. Les rues ont été choisies pour être représentatives sur le plan de l’emplacement, de la
				forme et des caractéristiques démographiques, ainsi que de l’équité. Chacune a été classée dans
				l’une de trois grandes catégories : centre-ville (axée sur les lieux de travail), petite ville et
				urbaine ou suburbaine (à vocation résidentielle). Les données sur les visites remontent au début de
				2019 et permettent de comparer l’achalandage sur une base mensuelle jusqu’à la fin de 2022, pour
				des rues individuelles ou des groupes de rues selon leur type.
			</p>
			<p>
				La pandémie a commencé à toucher lourdement la vie des Canadiennes et des Canadiens en mars 2020.
				Des confinements stricts ont été imposés dans de nombreux endroits, tandis que la peur et
				l’incertitude dominaient les décisions personnelles. Au cours de ces premiers mois, l’achalandage
				des rues principales et des centres commerciaux a chuté de façon spectaculaire. En avril 2020,
				l’achalandage de tous les types de rues principales à Toronto, à Montréal et à Edmonton avait
				diminué d’au moins la moitié, celui des rues principales de centre-ville tombant sous 30 % des
				niveaux prépandémiques. Les centres commerciaux régionaux ont été les plus touchés par les
				confinements stricts, leur achalandage chutant à 15 % des niveaux prépandémiques.
			</p>
			<p>Les trajectoires de reprise ont aussi varié considérablement selon le contexte.</p>
			<p>
				Les rues principales des petites villes et les rues principales à vocation résidentielle se sont
				rétablies plus rapidement que celles des centres-villes. Cela s’explique en grande partie par le
				passage au télétravail, qui a fortement réduit l’occupation des tours de bureaux dans les
				centres-villes. Comme les gens travaillaient plus souvent de la maison, ils ont probablement
				reporté une partie de leurs habitudes de consommation vers la rue principale de leur quartier.
			</p>
			<p>
				À la fin de 2022, neuf des 75 rues principales et centres commerciaux étudiés avaient retrouvé ou
				dépassé leur achalandage de 2019. Cinq de ces rues principales se trouvaient dans de petites villes
				et quatre étaient au cœur de quartiers résidentiels. Les centres commerciaux régionaux ont
				généralement connu une série de chutes brutales et de rebonds en V au gré des confinements
				stricts. Dans l’ensemble, ces fluctuations en dents de scie ne se sont pas traduites par une
				reprise complète pour les centres commerciaux étudiés à la fin de 2022. Globalement, les centres
				commerciaux régionaux ont tout de même fait mieux que les rues principales en 2022, malgré un
				nouveau recul au cours des deux derniers mois de l’année.
			</p>
			<p>
				Les gens semblaient plus à l’aise de retourner en plus grand nombre, et plus tôt, dans les centres
				commerciaux que dans la plupart des rues principales. Les centres commerciaux ont tendance à
				investir pour créer un sentiment de sûreté et de sécurité. Une partie de cet effort consiste à
				aménager des environnements uniformes et cohérents où les gens savent à quoi s’attendre. Les rues
				principales peuvent en tirer certaines leçons à long terme, tout en conservant leur caractère et
				leurs expériences distinctifs.
			</p>
			{:else}
			<h3>Visitor Levels</h3>
			<p>
				For the Measuring Main Streets project we tracked the visitor levels of 60 main streets and
				15 regional shopping malls in the Toronto, Montreal, and Edmonton regions. The streets were
				chosen to be representative of location, form, and demographics, as well as equity. Each was
				grouped into one of three broad categories: downtown (workplace-oriented), small town, and
				urban/suburban (residential-oriented). The visitor data dates to the beginning of 2019 and
				enables the comparison of visitor levels through to the end of 2022 on a monthly basis for
				individual streets or groups of streets, according to type.
			</p>
			<p>
				The pandemic began to impact the lives of Canadians heavily in March 2020. Hard lockdowns
				were imposed in many places, while fear and uncertainty dominated personal decision-making.
				During these early months, visitor levels to main streets and malls dropped-off
				precipitously. By April 2020, visitor levels to all types of main streets in Toronto,
				Montreal, and Edmonton fell by at least half, with downtown main streets dropping below 30%
				of pre-pandemic levels. Regional shopping malls were the most affected by hard lockdowns,
				falling to 15% of pre-pandemic visitor levels.
			</p>
			<p>Recovery trajectories also varied significantly by specific context.</p>
			<p>
				Small town main streets and residentially oriented main streets recovered more quickly than
				those in downtowns. Much of this was due to a shift to work from home arrangements, which
				heavily impacted office tower occupancy in city centres. As people worked from home more
				often, they likely shifted some of their consumption patterns to their neighbourhood main
				street.
			</p>
			<p>
				By the end of 2022, nine out of the 75 case study main streets and shopping malls had fully
				recovered or exceeded 2019 visitor levels. Five of these main streets were in small towns
				and four anchored residential neighbourhoods. Regional shopping malls typically experienced
				a series of V-shaped sharp declines and rebounds in relation to hard lockdowns. In
				aggregate, these spiky patterns did not add up to a full recovery for the case study
				shopping malls by the end of 2022. Overall, regional shopping malls outperformed main
				streets in 2022 despite another decline in the final two months of that year.
			</p>
			<p>
				People seemed more comfortable returning to malls in greater numbers sooner than to most
				main streets. Shopping malls tend to invest in creating perceptions of safety and security.
				Part of this effort involves crafting consistent and cohesive environments where people know
				what to expect. Main streets can draw some longer-term lessons from this, while retaining
				their distinct character and experiences.
			</p>
			{/if}
		</div>
	</div>

	<div class="chart-container sticky-content">
		<RecoveryMultiLineChart {dataset} />
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			{#if fr}
			<h3>Infrastructure civique</h3>
			<p>
				Les centres commerciaux régionaux n’offrent généralement pas la même gamme de services que les
				rues principales. Le projet Mesures des rues principales recense les commerces (commerce de
				détail, bars et restaurants, services de proximité) et l’infrastructure civique (arts et culture,
				loisirs, éducation, santé, services gouvernementaux et communautaires) que l’on trouve couramment
				sur les rues principales. Pour la rue principale moyenne, l’infrastructure civique représente un
				peu plus de 20 % de l’ensemble des établissements, et une part nettement plus élevée pour
				certaines. À l’inverse, dans les centres commerciaux régionaux, l’infrastructure civique ne
				représente en moyenne que 8 % des établissements. Un seul centre commercial régional de l’étude
				(Millwood Town Centre) offre de l’infrastructure civique dans une proportion comparable à celle
				d’une rue principale typique.
			</p>
			{:else}
			<h3>Civic Infrastructure</h3>
			<p>
				Regional shopping malls do not typically provide the same range of offerings as main
				streets. Measuring Main Streets identifies the businesses (retail, bars and restaurants,
				local services) and civic infrastructure (arts and culture, recreation, education,
				healthcare, government and community services) that are commonly found in main street
				environments. For the average main street, civic infrastructure accounts for slightly more
				than 20% of all establishments, though for some it is significantly higher. This is in
				contrast to regional shopping malls where civic infrastructure accounts for only 8% of
				establishments, on average. Only one regional shopping centre in the study (Millwood Town
				Centre) provides civic infrastructure at the rate of a typical main street.
			</p>
			{/if}
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<BarChart
			xKey="civic"
			title={fr
				? 'Infrastructure civique en proportion des établissements (%)'
				: 'Civic Infrastructure as a Share of Establishments (%)'}
			xDomain={[0, 60]}
		/>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			{#if fr}
			<h3>Entreprises indépendantes</h3>
			<p>
				Une différence clé entre les rues principales et les centres commerciaux régionaux tient à la
				mesure dans laquelle ils soutiennent les entreprises indépendantes. Dans le cadre du projet
				Mesures des rues principales, nous avons élaboré un indice des entreprises indépendantes afin
				d’évaluer l’équilibre relatif entre les entreprises indépendantes uniques et les établissements
				affiliés à une chaîne. (L’indice tient compte de la taille de la chaîne, de sorte que les petites
				chaînes locales ne sont pas assimilées aux grandes chaînes internationales.) Un score proche de 1
				signifie qu’un secteur compte une plus grande part d’entreprises indépendantes que de chaînes; un
				score proche de 0 indique une plus grande part d’entreprises de chaîne.
			</p>
			<p>
				Le score moyen à l’indice des entreprises indépendantes des 60 rues principales étudiées était de
				0,74, contre 0,30 pour les 15 centres commerciaux régionaux. Les rues principales offrent
				clairement beaucoup plus de possibilités aux entreprises indépendantes appartenant à des intérêts
				locaux. Ces entreprises sont aussi plus susceptibles d’offrir des biens et des services adaptés
				aux particularités des communautés locales.
			</p>
			{:else}
			<h3>Independent Businesses</h3>
			<p>
				A key difference between main streets and regional shopping centres is the extent to which
				they support independent business. For the Measuring Main Streets project, we developed an
				Independent Business Index to assess the relative balance between one-off independent
				businesses and chain-affiliated establishments. (The index considers the size of a chain so
				those that are small and local are not equated with large international chains.) A score
				closer to one means that an area has a greater share of independent businesses relative to
				chains; a score closer to zero indicates a higher share of chain businesses.
			</p>
			<p>
				The average Independent Business Index score for the 60 main street case studies was 0.74,
				compared to 0.30 for the 15 regional shopping malls. Main streets clearly provide
				significantly more opportunities for locally owned independent business. Such businesses are
				also more likely to provide goods and services that are more closely aligned with the
				nuances of local communities.
			</p>
			{/if}
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<BarChart
			xKey="independence"
			title={fr ? 'Indice des entreprises indépendantes' : 'Independent Business Index'}
		/>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			{#if fr}
			<h3>Distance parcourue</h3>
			<p>
				Les centres commerciaux régionaux desservent généralement une zone de chalandise plus vaste que
				les rues principales de quartier. En 2022, la distance moyenne parcourue pour se rendre aux 15
				centres commerciaux régionaux était de 10 km, contre 7,8 km pour les rues principales de quartier.
				Le profil des distances parcourues pour se rendre aux rues principales des petites villes et des
				centres-villes s’apparente davantage à celui des centres commerciaux régionaux qu’à celui des rues
				principales de quartier, mais pour des raisons différentes. Les rues principales des petites
				villes desservent généralement des collectivités rurales et peu densément peuplées, tandis que les
				rues principales des centres-villes attirent des gens de toutes les parties de la ville. Les
				distances moyennes parcourues pour se rendre à tous les types de rues principales ainsi qu’aux
				centres commerciaux ont diminué considérablement pendant la pandémie (2020-2021), avant de
				commencer à revenir à leurs niveaux historiques en 2022.
			</p>
			<p>
				Comme les gens se sont moins déplacés pendant la pandémie, les émissions moyennes de gaz à effet
				de serre des ménages ont diminué de façon importante. Elles ont baissé de 17,3 % en 2020, puis de
				0,5 % supplémentaire en 2021 (Statistique Canada, 2022). Cela met en évidence les avantages
				environnementaux que pourrait procurer l’offre de biens et de services essentiels sur les rues
				principales de quartiers plus densément peuplés.
			</p>
			{:else}
			<h3>Distance Travelled</h3>
			<p>
				Regional shopping malls tend to serve a wider catchment area than neighbourhood oriented
				main streets. The average trip distance to the 15 regional shopping malls in 2022 was 10 km,
				versus 7.8 km for neighbourhood main streets. Small town and downtown mains streets’ trip
				distance profiles are more aligned with that of regional shopping malls than neighbourhood
				main streets but for different reasons. Small town main streets typically serve low-density
				and rural communities, while downtown main streets draw people from all parts of the city.
				Average trip distances to all types of main streets as well as to shopping malls fell
				significantly through the pandemic (2020–2021) before beginning to revert to historical
				levels in 2022.
			</p>
			<p>
				As people travelled less during the pandemic there were significant reductions in average
				household greenhouse gas emissions. In 2020 there was a reduction of 17.3% followed by a
				further drop of 0.5% in 2021 (Statistics Canada 2022). This highlights the possible
				environmental benefits of providing essential goods and services on main streets in more
				densely populated neighbourhoods.
			</p>
			{/if}
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<BarChart
			xKey="distance"
			title={fr
				? 'Distance moyenne (km) parcourue par les visiteurs'
				: 'Average Distance (km) Travelled by Visitors'}
			xDomain={[0, 18]}
		/>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			{#if fr}
			<h3>Commerce électronique</h3>
			<p>
				Alors que tous les types de lieux physiques enregistraient une baisse d’activité au début de la
				pandémie, le commerce électronique a explosé. En avril 2020, la part du commerce électronique dans
				l’ensemble du commerce de détail a dépassé 10 % pour la première fois. Avant la pandémie, le
				commerce électronique représentait une part croissante de la valeur des transactions de détail,
				sans toutefois avoir franchi le seuil de 4 %. Cette hausse soudaine a donné lieu à de nombreuses
				prédictions selon lesquelles il s’agissait de l’accélération inévitable d’une tendance existante,
				appelée à se poursuivre au-delà de la fin de la pandémie. Ces prédictions ne se sont pas
				concrétisées : le commerce électronique est resté bien au-dessus des niveaux attendus pendant les
				deux principales années de la pandémie, avant de revenir à sa tendance historique. Si la pandémie
				ne semble pas avoir accéléré le virage des consommateurs vers le commerce en ligne, la tendance à
				long terme continue de progresser régulièrement.
			</p>
			{:else}
			<h3>E-Commerce</h3>
			<p>
				As all types of physical locations showed declines in activity in the early stages of the
				pandemic, e-commerce boomed. April 2020 saw the share of e-commerce for all retail trade
				rise above 10% for the first time. Prior to the pandemic, e-commerce accounted for a rising
				share of the value of retail transactions but had yet to breach the 4% mark. This sudden
				spike led to many predictions that this was an inevitable acceleration of an existing trend
				that would continue beyond the end of the pandemic. These predictions did not come to
				fruition as e-commerce stayed well above expected levels for the core two years of the
				pandemic before retreating to the historic trend. While the pandemic does not seem to have
				accelerated a consumer shift to online retail, the long-term pattern continues to rise
				steadily.
			</p>
			{/if}
		</div>
	</div>

	<div class="chart-container sticky-content">
		<MultiLineChart
			title={fr
				? 'Part (%) du commerce électronique dans l’ensemble des ventes au détail'
				: 'E-Commerce Share (%) of All Retail Sales'}
			yDomain={[0, 12]}
			chartDataset={'ecommerce'}
		/>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			{#if fr}
			<h3>Restaurants</h3>
			<p>
				Les commandes en ligne de repas de restaurant ont aussi connu une hausse notable pendant la
				pandémie. En 2021, les revenus en ligne des restaurants avaient augmenté d’environ 90 % par rapport
				à leur niveau d’avant la pandémie (2019) (DoorDash/Restaurants Canada, 2022). Ce fut une bouée de
				sauvetage pour de nombreuses entreprises des rues principales, dont la clientèle en salle s’était
				évaporée au début de la pandémie. La trajectoire des revenus des restaurants a été semblable à
				celle des centres commerciaux régionaux : des chutes très marquées pendant les confinements
				stricts, suivies de reprises très rapides.
			</p>
			<p>
				Les restaurants à service complet et les bars (« débits de boissons ») ont subi des pertes de
				revenus plus importantes que les restaurants à service restreint (restauration rapide), puisqu’ils
				dépendent presque entièrement de la consommation sur place. Les établissements de restauration
				rapide étaient mieux placés pour s’adapter grâce aux commandes en ligne, à la livraison et aux
				comptoirs de service. Ils ont ainsi réussi à dépasser leurs ventes prépandémiques dès l’été 2021.
				L’inconvénient pour les entreprises indépendantes, c’est qu’une grande partie des commandes en
				ligne et des livraisons passent par des intermédiaires qui accaparent la majeure partie, voire la
				totalité, des revenus supplémentaires (McKinsey, 2021). L’inconvénient potentiel pour les rues
				principales, c’est que lorsque plus de gens restent à la maison (plutôt que de s’y rendre en
				personne), le dynamisme général et l’expérience de la rue principale s’en trouvent réduits, ce qui
				peut à son tour nuire à leurs efforts de reprise.
			</p>
			{:else}
			<h3>Restaurants</h3>
			<p>
				There was also a notable increase in online orders for restaurant meals during the pandemic.
				By 2021, online restaurant revenues had risen by an estimated 90% from pre-pandemic (2019)
				amounts (DoorDash/Restaurants Canada 2022). This was a lifesaver for many main street
				businesses that saw their in-person dining levels evaporate in the early stages of the
				pandemic. The trajectory of restaurant revenues was similar to that of regional shopping
				malls: there were very sharp drop-offs during hard lockdowns and very quick recoveries.
			</p>
			<p>
				Full-service restaurants and bars (“drinking places”) experienced deeper losses of revenue
				than limited-service (fast food) restaurants, as they are almost entirely dependent on
				in-person consumption. Fast food restaurants were better positioned to adjust through online
				orders, deliveries, and service windows. As a result, they managed to exceed pre-pandemic
				sales levels by the summer of 2021. The downside for independent businesses is that many
				online ordering and deliveries are mediated by third parties that capture most, if not all,
				of the extra revenue (McKinsey, 2021). The potential downside for main streets is that when
				more people stay home (rather than visiting in person), the overall vibrancy and experience
				of the main street is reduced, which can in turn undermine their recovery efforts.
			</p>
			{/if}
		</div>
	</div>

	<div class="chart-container sticky-content">
		<MultiLineChart
			title={fr
				? 'Ventes par rapport au même mois en 2019 (%)'
				: 'Sales Relative to Same Month in 2019 (%)'}
			yDomain={[0, 150]}
			chartDataset={'restaurant'}
		/>
	</div>
</div>

{#if fr}
	<div class="key-findings">
		<h3>Constats et messages clés</h3>

		<KeyFindings
			number={'1'}
			finding={'Les rues principales peuvent être le cœur de collectivités complètes d’une manière que les centres commerciaux régionaux et le commerce en ligne ne peuvent pas égaler.'}
			message1={'Regrouper l’infrastructure civique sur les rues principales pour créer des synergies et en faire le cœur de collectivités complètes.'}
			message2={'Soutenir et protéger les entreprises indépendantes.'}
			message3={'Mobiliser les institutions civiques et les exploitants d’entreprises indépendantes pour qu’ils se concentrent sur les besoins de la communauté locale.'}
		/>

		<KeyFindings
			number={'2'}
			finding={'Les centres commerciaux régionaux ont connu des baisses d’achalandage plus marquées à des moments clés de la pandémie (les confinements stricts), mais les gens se sentaient en sécurité d’y retourner plus tôt.'}
			message1={'Faire en sorte que les rues principales soient sécuritaires et accueillantes.'}
			message2={'Créer une identité cohérente pour la rue principale et en faire la promotion.'}
			message3={'Miser sur une expérience globale de la rue principale qui équilibre confort et découvertes fortuites.'}
		/>

		<KeyFindings
			number={'3'}
			finding={'Une part croissante des comportements de consommation se déplace en ligne, mais pas au rythme rapide prévu pendant la pandémie.'}
			message1={'Offrir des outils et des conseils aux petites entreprises indépendantes pour optimiser leur propre présence en ligne.'}
			message2={'Rechercher ou créer des solutions de rechange aux services tiers de livraison de repas en ligne.'}
			message3={'Collaborer pour créer une présence en ligne à l’échelle de la rue principale qui renforce la communauté locale en reliant les personnes résidentes, les entreprises et l’infrastructure civique.'}
		/>
	</div>
{:else}
<div class="key-findings">
	<h3>Key Findings and Messages</h3>

	<KeyFindings
		number={'1'}
		finding={'Main streets are able to center complete communities in ways that regional shopping malls and online commerce cannot.'}
		message1={'Cluster civic infrastructure on main streets to generate synergies and center complete communities.'}
		message2={'Support and protect independent businesses.'}
		message3={'Organize civic institutions and independent business operators to focus on serving local community needs.'}
	/>

	<KeyFindings
		number={'2'}
		finding={'Regional shopping malls experienced sharper declines in visitor levels at key stages (the hard lockdowns) of the pandemic, but people felt safer returning to them earlier.'}
		message1={'Ensure that main streets feel safe and inviting.'}
		message2={'Create a cohesive main street identity and promote it.'}
		message3={'Focus on overall experience on main streets that provides a balance between being comfortable and serendipitous.'}
	/>

	<KeyFindings
		number={'3'}
		finding={'More consumer behaviour is shifting online, but not at the rapid pace expected during the pandemic.'}
		message1={'Provide tools and advice to small independent businesses on maximizing their own online presence.'}
		message2={'Seek out or create alternatives to third-party online food delivery services.'}
		message3={'Work together to create a main street-scale online presence that strengthens local community by connecting residents, business, and civic infrastructure.'}
	/>
</div>
{/if}
