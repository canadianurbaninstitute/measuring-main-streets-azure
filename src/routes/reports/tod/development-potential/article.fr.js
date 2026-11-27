// Canadian French version of article.js (same exports and shape).
// `props` values (region, highlightIds) are lookup keys and stay identical to the English file.
export const sections = [
	{
		panels: [
			{
				id: 'intro',
				label:
					'L’aménagement résidentiel axé sur le transport collectif prend des formes différentes selon les lieux.'
			}
		],
		blocks: [
			{
				panelId: 'intro',
				heading: 'Maximiser les retombées de l’aménagement axé sur le transport collectif',
				body: `<p>Les investissements en transport collectif stimulent la construction de logements, mais pas de la même façon partout.
                La demande pour l’aménagement axé sur le transport collectif (TOD) varie d’une région à l’autre, d’une ville à l’autre et même d’une station à l’autre sur une même ligne.
                Lorsque de nouvelles stations sont planifiées, elles peuvent être situées là où la demande est la plus forte, dans des centres urbains densément peuplés, ou là où l’offre de terrains est
                abondante, en planifiant les stations en même temps que de nouvelles collectivités axées sur le transport collectif.</p>`
			},
			{
				panelId: 'intro',
				body: `<p>Toutefois, <a href="https://measuringmainstreets.ca/fr/reports/tod/intro" target="_blank">les nouvelles stations de transport collectif ne garantissent pas
                systématiquement un rendement en matière de logement</a> : dans les trois plus grandes régions urbaines (Toronto, Montréal, Vancouver), la construction de logements se fait surtout près des grandes stations de transport collectif,
                alors que dans les trois suivantes (Calgary, Edmonton, Ottawa), les nouveaux logements sont surtout construits à l’extérieur des aires de station de transport collectif.</p>`
			}
		]
	},
	{
		panels: [
			{
				id: 'intro2',
				label:
					'Cartes de la forme urbaine. Le cadre bâti d’une station de transport collectif influence son potentiel de développement.',
				source: '<a href="/tools/urban-form-comparison" target="_blank">Outil sur la forme urbaine</a>'
			}
		],
		blocks: [
			{
				panelId: 'intro2',
				heading: '',
				body: `<p>Puisque les investissements dans les projets de transport collectif n’offrent pas tous le même potentiel de construction de logements,
                <b>quelles stations de transport collectif présentent le plus fort potentiel résidentiel, et qu’ont-elles en commun? De plus, lorsque de nouvelles
                stations sont planifiées, où devraient-elles être situées pour maximiser le rendement en matière de logement?</b><br><br>
                Ce rapport examine la disponibilité des terrains et
                la pression de croissance dans les aires de station de transport collectif afin de déterminer où la capacité et la demande de logements sont les plus grandes, et évalue le potentiel global
                d’aménagement axé sur le transport collectif des stations de transport collectif structurant du Canada.</p>`
			}
		]
	},
	{
		panels: [
			{
				id: 'intro3',
				label:
					'NorQuest est un exemple de station où la disponibilité des terrains est faible et la pression de croissance, élevée.',
				source:
					'<a href="/tools/development-potential" target="_blank">Outil sur le potentiel de développement</a>'
			}
		],
		blocks: [
			{
				panelId: 'intro3',
				heading: 'Disponibilité des terrains et pression de croissance',
				body: `<p>Pour examiner le potentiel de développement résidentiel de chaque aire de station, nous avons sélectionné cinq indicateurs de disponibilité des terrains et
                cinq indicateurs de pression de croissance afin d’établir un score de disponibilité des terrains et un score de pression de croissance pour chaque station.
                </p>`
			},
			{
				panelId: 'intro3',
				heading: '',
				body: `<p>Voici les indicateurs :
                <br><br>
                <b>Disponibilité des terrains</b>
                <ul style="list-style-type: square;">
                <li>Superficie aménageable (superficie totale - plans d’eau - espaces verts)</li>
                <li>Superficie à fort potentiel (aires de stationnement de surface)</li>
                <li>Habitations unifamiliales</li>
                <li>Densité de population</li>
                <li>Densité d’emploi</li>
                </ul>
								<br />
                <b>Pression de croissance</b>
                <ul style="list-style-type: square;">
                <li>Variation de la population de l’aire de station, 2020-2025</li>
                <li>Variation de la population de l’aire de station, 2025-2030</li>
                <li>Croissance démographique municipale, 2020-2025</li>
                <li>Visites quotidiennes</li>
                <li>Score global de collectivité complète</li>
                </ul>
                </p>`
			}
		]
	},
	{
		panels: [
			{
				id: 'potential-scatter'
			}
		],
		blocks: [
			{
				panelId: 'potential-scatter',
				body: `<p>Les indicateurs de disponibilité des terrains ont été choisis pour refléter la capacité de l’aire de station à accueillir de nouveaux logements.
                Les indicateurs de pression de croissance ont été choisis pour refléter la demande de nouveaux logements dans l’aire de station.
                <b>Les scores de disponibilité des terrains et de pression
                de croissance correspondent à la moyenne des rangs centiles de la station pour chaque ensemble d’indicateurs.</b>
                L’aire de station désigne le rayon de 800 m autour d’une station.
                </p><p>La disponibilité des terrains et la pression de croissance sont corrélées négativement. Les stations où la pression de croissance est élevée ont généralement une faible disponibilité des terrains, et les stations où la disponibilité des terrains est élevée subissent généralement une faible pression de croissance.</p>
				<p>Nous pouvons diviser le nuage de points de la disponibilité des terrains et de la pression de croissance selon la médiane de chacune, et classer chaque station selon que sa disponibilité des terrains et sa pression de croissance sont faibles ou élevées. Nous pouvons ensuite examiner le potentiel de développement d’une station en fonction de sa demande et de sa capacité globales pour de nouveaux logements.</p>`
			},
			{
				heading:
					'Déterminer le potentiel de développement résidentiel dans les aires de station de transport collectif',
				body: `<h3>Calgary</h3>
				<p>Le scénario le plus courant est une faible disponibilité des terrains et une forte pression de croissance. On compte 13 stations où la disponibilité des terrains et la pression de croissance sont toutes deux élevées, dont <b>Chinook</b>, <b>Dalhousie</b> et <b>Lions Park</b> sur la ligne Rouge (Red Line), ainsi que les stations prévues <b>Seton</b>, <b>28 Avenue N</b> et <b>16 Avenue N</b> sur la ligne Verte (Green Line).</p>`,
				props: {
					region: 'Calgary'
				}
			},
			{
				body: `<h3>Edmonton</h3>
				<p>Le scénario le plus courant est une forte disponibilité des terrains et une faible pression de croissance. Trois stations présentent à la fois une forte disponibilité des terrains et une forte pression de croissance :
				<b>McKernan-Belgravia</b> sur la Capital Line, ainsi que <b>NAIT/Blatchford Market</b> et <b>Kingsway RAH</b> sur la Metro Line.</p>`,
				props: {
					region: 'Edmonton'
				}
			},
			{
				body: `<h3>Région élargie du Golden Horseshoe</h3>
				<p>Le scénario le plus courant est une faible disponibilité des terrains et une forte pression de croissance. On compte 86 stations où la disponibilité des terrains et la pression de croissance sont toutes deux élevées, dont
				<b>Oakwood</b> sur la ligne 5 Eglinton, <b>Main Street</b> sur la ligne 2 Bloor-Danforth et <b>Milton</b> sur la ligne Milton.</p>`,
				props: {
					region: 'Greater Golden Horseshoe'
				}
			},
			{
				body: `<h3>Grand Vancouver/Lower Mainland</h3>
				<p>Le scénario le plus courant est une faible disponibilité des terrains et une forte pression de croissance. Les stations du Grand Vancouver/Lower Mainland affichent la plus faible disponibilité moyenne des terrains
				et la plus forte pression de croissance moyenne de toutes les régions. On compte 6 stations où la disponibilité des terrains et la pression de croissance sont toutes deux élevées, dont les stations en construction
				<b>Willowbrook</b>, <b>Hillcrest-184 St</b> et <b>152 St</b> sur la ligne Expo.</p>`,
				props: {
					region: 'Greater Vancouver/Lower Mainland'
				}
			},
			{
				body: `<h3>Montréal</h3>
				<p>Le scénario le plus courant est une forte disponibilité des terrains et une faible pression de croissance. On compte 5 stations où la disponibilité des terrains et la pression de croissance sont toutes deux élevées, dont
				<b>Ahuntsic</b> sur la ligne Mascouche, <b>Préfontaine</b> sur la ligne verte et <b>Montmorency</b> sur la ligne orange.</p>`,
				props: {
					region: 'Montreal'
				}
			},
			{
				body: `<h3>Ottawa-Gatineau</h3>
				<p>Le scénario le plus courant est une forte disponibilité des terrains et une faible pression de croissance. Deux stations présentent à la fois une forte disponibilité des terrains et une forte pression de croissance :
				<b>Tunney’s Pasture</b> sur la ligne 1 Trim-Algonquin et la ligne 3 Trim-Moodie, et <b>Corso Italia</b> sur la ligne 2 Bayview-Limebank.</p>`,
				props: {
					region: 'Ottawa-Gatineau'
				}
			},
			{
				body: `<h3>Ville de Québec</h3>
				<p>Le scénario le plus courant est une forte disponibilité des terrains et une faible pression de croissance. Une station présente à la fois une forte disponibilité des terrains et une forte pression de croissance :
				<b>CHUL</b>, sur le tramway de Québec prévu.</p>`,
				props: {
					region: 'Ville de Québec'
				}
			}
		]
	},
	{
		layout: 'scrolly',
		panels: [{ id: 'tech-scatter' }],
		blocks: [
			{
				heading: 'Potentiel de développement selon la technologie',
				body: `<p>Les tendances en matière de disponibilité des terrains et de pression de croissance varient selon la technologie.</p>`
			},
			{
				body: `<h3>Train de banlieue</h3>
				<p>Le scénario le plus courant pour les gares de train de banlieue est une forte disponibilité des terrains et une faible pression de croissance, ce qui indique une plus grande capacité foncière pour de nouveaux logements, mais une demande moindre.
				Ces gares se trouvent souvent dans des collectivités de banlieue ou de frange urbaine, où la croissance démographique est plus lente, la densité de population plus faible et l’aire de station moins
				construite. Parmi les gares de train de banlieue où la disponibilité des terrains est élevée et la pression de croissance faible figurent la gare GO East Gwillimbury, la gare GO Acton et la gare Vaudreuil.</p>`,
				props: {
					region: 'Commuter'
				}
			},
			{
				body: `<h3>Métro</h3>
				<p>À l’inverse, le scénario le plus courant pour les stations de métro est une faible disponibilité des terrains et une forte pression de croissance, ce qui traduit une capacité foncière limitée pour de nouveaux logements,
				mais une forte demande. Des stations de métro comme Bloor-Yonge à Toronto, Granville à Vancouver et Berri-UQAM à Montréal sont situées au centre-ville,
				dans des secteurs densément peuplés, fortement bâtis et soumis à une forte pression de croissance. En dehors des centres-villes, les stations de métro se trouvent encore souvent dans des quartiers anciens
				dont l’aire de station s’est développée et densifiée au fil de nombreuses années. Ainsi, des stations de métro comme Runnymede à Toronto, Langara-49th Avenue à Vancouver et
				De Castelnau à Montréal, bien qu’elles soient moins centrales, ont tout de même une capacité foncière limitée pour de nouveaux aménagements.</p>`,
				props: {
					region: 'Subway'
				}
			},
			{
				body: `<h3>SLR</h3>
				<p>Bien que le scénario le plus courant pour les stations de train léger sur rail (SLR) soit une forte disponibilité des terrains et une faible pression de croissance, leur répartition entre les catégories de disponibilité des terrains
				et de pression de croissance est relativement équilibrée par rapport aux gares de train de banlieue et aux stations de métro. De plus, le SLR est la technologie la plus courante parmi les stations à forte disponibilité des terrains
				et à forte pression de croissance : plus de la moitié de ces stations « élevée-élevée » se trouvent sur des lignes de SLR. Bon nombre d’entre elles sont situées sur des lignes de SLR relativement récentes,
				en banlieue, par exemple la station Ionview à Toronto, la station Borden à Kitchener et la station Kingsway/Royal Alex à Edmonton.</p>`,
				props: {
					region: 'LRT'
				}
			}
		]
	},
	{
		layout: 'overlay',
		panels: [{ id: 'potential-map' }],
		blocks: [
			{
				heading: 'Forte disponibilité des terrains, forte pression de croissance',
				body: `<p>Alors que les stations à faible disponibilité des terrains et à forte pression de croissance se trouvent généralement dans les centres-villes, et que les stations à forte disponibilité des terrains
				et à faible pression de croissance se trouvent dans des collectivités de banlieue et de frange urbaine, les stations où la disponibilité des terrains et la pression de croissance
				sont toutes deux élevées sont plus variées quant à leur emplacement. Certaines se trouvent dans des quartiers anciens et bâtis, sur des lignes de transport collectif établies, tandis que d’autres sont situées
				dans des secteurs commerciaux de banlieue ou dans des projets de densification sur des lignes nouvelles ou prévues.</p>

				<p>Malgré leurs caractéristiques variées, ces stations présentent une forte demande
				de logements ainsi que la capacité foncière pour y répondre, ce qui en fait des lieux idéaux pour construire de nouveaux logements. Ces stations à forte disponibilité des terrains et à forte pression
				de croissance font souvent déjà l’objet de plans d’aménagement qui reconnaissent leur potentiel. En voici quelques exemples :</p>`,
				props: {
					region: 'Canada'
				}
			},
			{
				heading: 'Chinook',
				body: `
				<h4>Calgary</h4>
				<br>
				<p>La station Chinook, sur la ligne Rouge de Calgary, est située près du centre commercial Chinook Centre, au sud du centre-ville. Avec une grande superficie de terrains aménageables
				et de sites à fort potentiel, ainsi qu’une pression de croissance relativement élevée, l’aire de la station Chinook présente un fort potentiel de développement résidentiel.
				Compte tenu de sa forte densité d’emploi, le secteur est appelé à continuer de se développer comme pôle d’emploi régional.</p>`,
				props: {
					region: 'Calgary'
				}
			},
			{
				body: `
				<p><a href="https://www.calgary.ca/planning/local-area/completed-plans/chinook-communities-local-area-plan.html" target="_blank">Les plans pour le secteur entourant la station Chinook</a> misent sur
				l’aménagement axé sur le transport collectif, en créant des collectivités à usage mixte qui intègrent des espaces publics propices à la marche et bien reliés, des possibilités de logement hors marché et une croissance plus forte concentrée dans l’aire
				de la station. <a href="https://www.cbc.ca/news/canada/calgary/major-redevelopment-near-chinook-centre-gets-preliminary-green-light-from-city-council-1.7197317" target="_blank">Les plans préliminaires pour Chinook Centre</a>
				comprennent Midtown, un projet de 28 nouveaux bâtiments. Ce projet créerait jusqu’à 6 200 logements près de la
				station de SLR, avec la possibilité d’aménager une nouvelle station intercalaire à proximité. La forte densité d’emploi et la disponibilité des terrains de la station Chinook offrent l’occasion de développer davantage une
				collectivité à usage mixte près du transport collectif, en accroissant l’aménagement résidentiel aux côtés des aménagements commerciaux existants et futurs.</p>`,
				props: {
					region: 'Calgary',
					highlightIds: ['Chinook']
				}
			},
			{
				heading: 'NAIT/Blatchford Market',
				body: `
				<h4>Edmonton</h4>
				<br>
				<p>La station NAIT/Blatchford Market, située près du Northern Alberta Institute of Technology (NAIT), est l’actuel terminus nord de la Metro Line d’Edmonton. La forte disponibilité des terrains de la station
				s’explique par sa faible densité de population et sa superficie relativement importante de terrains aménageables et de sites à fort potentiel.
				Combinée à une forte pression de croissance, notamment une croissance démographique projetée relativement élevée, l’aire de la station NAIT/Blatchford
				Market présente un fort potentiel de développement résidentiel.</p>`,
				props: {
					region: 'Edmonton'
				}
			},
			{
				body: `<p>Située près de l’ancien aéroport du centre-ville d’Edmonton, la station a été créée en raison des plans de développement
				de la collectivité voisine de Blatchford. Les terrains de l’aéroport désaffecté doivent être réaménagés en une
				<a href="https://www.edmonton.ca/projects_plans/blatchford" target="_blank">collectivité intercalaire urbaine à usage mixte et à densité moyenne</a>.
				Le développement de Blatchford est intégré à l’<a href="https://www.nait.ca/nait/about/our-campuses/campus-development-plan" target="_blank">
				agrandissement prévu du campus du NAIT</a>, qui comprend un centre de compétences avancées et
				de possibles résidences étudiantes, ce qui ouvre la voie à des installations partagées au service des deux collectivités.</p>
				<p><a href="https://www.ctvnews.ca/edmonton/article/construction-going-full-steam-ahead-in-blatchford-city/" target="_blank">
				Plusieurs centaines de logements à Blatchford</a> ont été achevés ou sont en construction; maisons en rangée,
				logements locatifs construits à cette fin et logements abordables figurent parmi les types d’habitations prévus dans le quartier. Blatchford, qui devrait accueillir jusqu’à 30 000 personnes une fois achevé, est appelé à devenir un exemple clé d’aménagement intercalaire à plus forte densité et axé sur le transport collectif dans les collectivités de banlieue d’Edmonton.</p>`,
				props: {
					region: 'Edmonton',
					highlightIds: ['NAIT Blatchford Market']
				}
			},
			{
				heading: 'Mount Pleasant GO',
				body: `
				<h4>Brampton</h4>
				<br>
				<p>La gare GO Mount Pleasant, sur la ligne Kitchener, est située à Brampton. La disponibilité des terrains y est très élevée, avec une faible densité d’emploi et une forte proportion d’habitations unifamiliales et de terrains aménageables. Grâce à une forte croissance démographique passée et projetée, le potentiel de développement résidentiel de Mount Pleasant est très élevé.</p>`,
				props: {
					region: 'Greater Golden Horseshoe'
				}
			},
			{
				body: `<p>Situé dans une aire de station de transport collectif majeure (ASTCM),
				<a href="https://www.brampton.ca/EN/Business/planning-development/projects-studies/Pages/Mount-Pleasant-Village.aspx" target="_blank">
				le secteur entourant la gare Mount Pleasant</a> est encadré par le
				<a href="https://www.brampton.ca/EN/Business/planning-development/plans-and-policies/secondary%20plans/SPA51%20Mount%20Pleasant.pdf#page=61" target="_blank">
				cadre stratégique de la Ville de Brampton pour les ASTCM</a>, qui fixe des cibles d’aménagement à usage mixte et à plus forte densité.
				<a href="https://www.brampton.ca/EN/Business/planning-development/projects-studies/Documents/MPV_article_illustrated_Jan_2012.pdf" target="_blank">Les premiers plans de Mount Pleasant Village</a>,
				le quartier entourant la gare, visaient à faire la démonstration d’un aménagement en terrains vierges axé sur le transport collectif, en centrant le nouveau quartier sur le transport collectif et le transport actif.</p>
				<p>Bien que la phase actuelle de Mount Pleasant Village intègre des éléments d’aménagement axé sur le transport collectif
				pour atteindre ces objectifs, le potentiel de développement de l’aire de station demeure important. Les propositions pour Mount Pleasant comprennent un
				<a href="https://urbantoronto.ca/news/2024/02/massive-mixed-use-development-proposed-mount-pleasant-go-brampton.55201" target="_blank">ensemble de plusieurs tours à usage mixte</a>
				comptant plus de 2 000 logements. Alors que de nouvelles gares GO et les collectivités qui les entourent sont en cours de planification, par exemple la
				<a href="https://www.innisfil.ca/building-development/planning-development/proposed-developments/orbit" target="_blank">
				gare Innisfil sur la ligne Barrie</a>,
				la croissance future de Mount Pleasant Village offre au quartier l’occasion de devenir un modèle d’aménagement en terrains vierges axé sur le transport collectif.</p>`,
				props: {
					region: 'Greater Golden Horseshoe',
					highlightIds: ['298']
				}
			},
			{
				heading: 'Willowbrook',
				body: `
				<h4>Canton de Langley (Township of Langley)</h4>
				<br>
				<p>La station Willowbrook, en construction, se trouve sur le prolongement Surrey-Langley du SkyTrain, sur la ligne Expo. Située dans le canton de Langley, la station sera adjacente au centre commercial Willowbrook Shopping Centre. Bien qu’elle ne subisse pas une pression de croissance extrême, sa grande superficie de terrains aménageables, ses sites à fort potentiel et sa densité de population relativement faible confèrent à l’aire de station un fort potentiel de développement résidentiel.</p>`,
				props: {
					region: 'Vancouver'
				}
			},
			{
				body: `
				<p>Le secteur entourant la station Willowbrook est désigné
				<a href="https://www2.gov.bc.ca/gov/content/housing-tenancy/local-governments-and-housing/housing-initiatives/transit-oriented-development-areas" target="_blank">aire axée sur le transport collectif (Transit Oriented Area)</a>,
				ce qui donne la priorité à l’aménagement à usage mixte et à forte densité à proximité de la station. Bien que le
				<a href="https://www.tol.ca/en/the-township/willowbrook-community-plan.aspx target="_blank">plan de collectivité de Willowbrook (Willowbrook Community Plan)</a>
				soit actuellement suspendu, le potentiel d’aménagement de l’aire de station est manifeste.
				<a href="https://dailyhive.com/vancouver/19677-19653-19665-willowbrook-drive-langley-township-skytrain-towers" target="blank">Plusieurs tours d’habitation</a>
				totalisant jusqu’à 2 600 nouveaux logements ont été proposées près de la station. Même si les plans pour l’aire de la station Willowbrook ne sont pas arrêtés, la mise en service prochaine de la station montre la nécessité d’une approche axée sur le transport collectif qui exploitera le potentiel de développement et soutiendra la croissance de la collectivité de Willowbrook.</p>`,
				props: {
					region: 'Vancouver',
					highlightIds: ['Willowbrook']
				}
			},
			{
				heading: 'Montmorency',

				body: `
				<h4>Laval</h4>
				<br><p>La station Montmorency, située au centre-ville de Laval, est le terminus nord de la ligne orange. Elle se trouve près du Collège Montmorency et de l’emplacement de la
				<a href="https://www.laval.ca/organisation-municipale/salle-presse/communiques-presse/infrastructure-culturelle-centre-ville-pelletee-terre/" target="_blank">future bibliothèque centrale et du futur centre culturel</a> de Laval.
				Bien que la station Montmorency ne subisse pas une pression de croissance exceptionnellement élevée, sa disponibilité des terrains relativement élevée lui confère un fort potentiel de développement global.</p>`,
				props: {
					region: 'Montreal'
				}
			},
			{
				body: `
			<p>Parmi les nouveaux projets du secteur figurent <a href="https://www.condourbania.com/condo-a-vendre/condo-neuf-laval/" target="_blank">U-Bahn</a>,
			un immeuble de copropriétés de plus de 300 logements, et <a href="https://espacemontmorency.com/fr/quartier" target="_blank">Espace Montmorency</a>, un complexe à usage mixte de plus de 700 appartements comprenant aussi des espaces commerciaux et des bureaux. Ces nouveaux projets résidentiels, conjugués au développement culturel continu du secteur, illustrent le rôle de l’aménagement axé sur le transport collectif dans l’essor du secteur Montmorency et de l’ensemble du centre-ville de Laval.</p>`,
				props: {
					region: 'Montreal',
					highlightIds: ['486']
				}
			},
			{
				heading: 'Tunney’s Pasture',
				body: `
				<h4>Ottawa</h4>
				<br>
				<p>Tunney’s Pasture est un site d’emploi fédéral situé à l’ouest du centre-ville. La station de SLR Tunney’s Pasture, sur la ligne 1 et la future ligne 3 d’Ottawa, dessert ce campus d’immeubles gouvernementaux. Grâce à une forte croissance démographique projetée et à la présence de services de collectivité complète destinés à sa main-d’œuvre fédérale, l’aire de la station Tunney’s Pasture présente un très fort potentiel de développement résidentiel.</p>`,
				props: {
					region: 'Ottawa-Gatineau'
				}
			},
			{
				body: `
				<p>Le secteur entourant la station est assujetti au
				<a href="https://www.canada.ca/en/public-services-procurement/services/infrastructure-buildings/construction/tunneys-pasture-redevelopment/master-plan.html" target="_blank">plan directeur de Tunney’s Pasture</a>,
				un vaste projet de réaménagement dont l’aménagement axé sur le transport collectif est un objectif clé. Le projet prévoit de réduire les espaces de bureaux, d’accroître les espaces verts et d’ajouter
				<a href="https://engage.clc-sic.ca/tunney-s-pasture-vision-to-reality/widgets/108174/faqs" target="_blank">de 7 000 à 9 000 nouveaux logements</a> afin d’urbaniser ce pôle d’emploi historiquement à usage unique.</p>
				<p>Le secteur compte déjà plusieurs tours, dont un complexe à usage mixte de deux tours de 32 étages, un immeuble à usage mixte de 31 étages et un immeuble de 11 étages près de la station. Les projets proposés pour Tunney’s Pasture comprennent une
				<a href="https://www.ctvnews.ca/ottawa/article/40-storey-high-rise-proposed-for-area-near-ottawas-tunneys-pasture/" target="_blank">tour à usage mixte de 40 étages et un immeuble de six étages</a>, qui créeraient 429 logements. Ces projets résidentiels, ainsi que d’autres volets du plan directeur de Tunney’s Pasture axés sur la collectivité, offrent l’occasion de miser sur une approche axée sur le transport collectif pour transformer ce site de bureaux fédéraux en un quartier urbain à usage mixte.</p>`,
				props: {
					region: 'Ottawa-Gatineau',
					highlightIds: ['594']
				}
			}
		]
	},
	{
		layout: 'inline',
		blocks: [
			{
				heading: 'Conclusion',
				body: `<p>Lorsqu’il s’agit de construire de nouvelles stations de transport collectif, les secteurs où la demande et la capacité foncière pour de nouveaux logements sont élevées constituent des emplacements idéaux. Qu’ils soient situés en terrains vierges, dans des secteurs commerciaux ou dans des pôles d’emploi, les secteurs à forte pression de croissance et à forte disponibilité des terrains offrent des occasions uniques de créer des aménagements axés sur le transport collectif qui servent leurs résidents.</p>
				<p>Nos scores de disponibilité des terrains et de pression de croissance sont des mesures indépendantes des politiques : ils évaluent le potentiel de développement résidentiel d’une station selon ses caractéristiques physiques et d’utilisation du sol, plutôt que selon ce que permet la réglementation d’urbanisme en vigueur. Cette approche neutre sur le plan des politiques nous permet d’envisager ce qui serait possible si les provinces et les municipalités harmonisaient leurs politiques pour maximiser les retombées résidentielles des investissements en transport collectif structurant.</p>
				<p>En plus de nouveaux logements, les aires de station ont besoin d’infrastructures complémentaires pour devenir des quartiers agréables à vivre et accessibles. Ces services et équipements complémentaires sont essentiels à une qualité de vie élevée dans les aires de station, et permettent de passer d’aménagements axés sur le transport collectif à des collectivités complètes axées sur le transport collectif.</p>`,
				cta: {
					href: '/reports/tod/complete-communities',
					label: 'En savoir plus sur les collectivités complètes'
				}
			},
			{
				body: `<p>En considérant les investissements en transport collectif comme des investissements en logement et, ultimement, comme des investissements dans le développement des collectivités, les bâtisseurs de villes sont bien placés pour concevoir les quartiers dynamiques et durables que permet le fort potentiel des aires de station de transport collectif.</p>`,
				cta: {
					href: '/tools/development-potential',
					label: 'Explorer l’outil sur le potentiel de développement'
				}
			}
		]
	}
];
