/**
 * article.fr.ts — Canadian French version of article.ts (same exports and shape).
 * See article.ts for the data shape.
 */

export const sections = [
	{
		panels: [
			{
				id: 'urban-pop',
				label:
					'Figure 1 – Part de la population canadienne dans les six « régions de transport collectif »',
				source:
					'Statistique Canada. Tableau 17-10-0148-01  Estimations de la population, 1er juillet, par région métropolitaine de recensement et agglomération de recensement, limites de 2021'
			},
			{
				id: 'urban-pop-growth',
				label: 'Figure 2 – Croissance démographique selon la taille des régions',
				source:
					'Statistique Canada. Tableau 17-10-0148-01  Estimations de la population, 1er juillet, par région métropolitaine de recensement et agglomération de recensement, limites de 2021'
			}
		],
		blocks: [
			{
				eyebrow: '',
				heading: 'La croissance des plus grandes villes du Canada se poursuivra-t-elle?',
				body: `<p>Les plus grandes régions métropolitaines du Canada (Toronto, Montréal, Vancouver, Calgary, Edmonton et Ottawa) regroupent 56 % de la population canadienne.</p>`
			},
			{
				panelId: 'urban-pop-growth',
				body: `<p><b>Ces régions croissent aussi plus rapidement, avec en moyenne 300 000 personnes résidentes de plus chaque année entre 2001 et 2025.</b></p>
				<p>Cette croissance s’explique principalement par la création d’emplois et l’immigration. Selon de nombreux indicateurs, la crise du logement au Canada est la plus aiguë dans les plus grandes villes.
				Les politiques fédérales, provinciales et municipales doivent tenir compte des différences structurelles entre les localités lorsqu’il s’agit d’élaborer
				des politiques et de réaliser des investissements en infrastructure. La construction de réseaux de transport collectif structurant est l’une des mesures les plus efficaces prises par les gouvernements
				pour s’attaquer directement à la pénurie de logements dans les plus grandes villes du Canada. Les investissements dans le transport collectif vont bien au-delà de la mobilité :
				ce sont des investissements fondamentaux dans le développement des villes.</p>`
			}
		]
	},
	{
		panels: [
			{
				id: 'urban-economy',
				label: 'Figure 3 – Croissance des secteurs producteurs de biens et de services',
				source:
					'Statistique Canada. Tableau 14-10-0355-01  Emploi selon l’industrie, données mensuelles désaisonnalisées et non désaisonnalisées, et tendance-cycle, 5 derniers mois (x 1 000)'
			}
		],
		blocks: [
			{
				panelId: 'urban-economy',
				heading: 'L’économie urbaine du Canada',
				body: `<p>La création d’emplois est l’un des principaux moteurs de la croissance démographique dans les régions urbaines du Canada. Les six régions de transport collectif ont gagné 2,6 millions d’emplois depuis 2011, soit deux nouveaux emplois nets sur trois au pays. Ce constat va à l’encontre du discours populaire de longue date selon lequel le moteur économique du Canada serait le secteur des ressources naturelles. Si la production de biens (agriculture, ressources naturelles, fabrication) représente une part beaucoup plus importante des exportations, elle compte beaucoup moins d’emplois directs. Au cours des 50 dernières années, la création d’emplois dans les secteurs producteurs de biens est restée pratiquement stable, avec seulement 900 000 postes de plus. Les secteurs producteurs de services, à l’inverse, ont ajouté plus de 10 millions d’emplois au cours de la même période. Les industries de services dépendent non seulement des personnes, mais surtout des relations entre elles. Malgré les progrès des technologies de communication numérique, la proximité physique offre encore des avantages importants. Retenons surtout que la croissance de l’emploi dans le secteur des services se concentre dans les plus grandes régions urbaines et, plus précisément encore, dans les centres-villes des grandes villes.</p>`
			}
		]
	},
	{
		panels: [
			{
				id: 'gateway',
				label: 'Figure 4 – Part de l’immigration selon la géographie, 2001-2025',
				source:
					'Statistique Canada. Tableau 17-10-0149-01  Composantes de l’accroissement démographique par région métropolitaine de recensement et agglomération de recensement, limites de 2021'
			}
		],
		blocks: [
			{
				panelId: 'gateway',
				heading: 'Des villes d’accueil',
				body: `<p>L’autre grand moteur de la croissance démographique est l’immigration. Les six plus grandes régions urbaines accueillent les trois quarts de l’ensemble des personnes immigrantes au Canada. Si les gens sont généralement attirés par les perspectives économiques, les nouveaux arrivants recherchent aussi des collectivités qui offrent des soutiens sociaux et culturels. Au cours des dernières décennies, un cycle s’est autoalimenté : plus d’emplois attirent plus de gens, qui à leur tour attirent plus d’emplois. Résultat : les plus grandes villes canadiennes croissent plus rapidement que le reste du pays.</p>`
			}
		]
	},
	{
		panels: [
			{
				id: 'housing',
				label: 'Figure 5 – Abordabilité du logement dans les plus grandes RMR',
				source: `<a href="https://www.cmhc-schl.gc.ca/observer/2026/beyond-toronto-vancouver-affordability-challenges-spread-across-canadian-cities" target="_blank">https://www.cmhc-schl.gc.ca/observer/2026/beyond-toronto-vancouver-affordability-challenges-spread-across-canadian-cities</a>`
			}
		],
		blocks: [
			{
				panelId: 'housing',
				heading: 'Le besoin de logements dans les plus grandes régions urbaines du Canada',
				body: `<p>Pour répondre aux besoins d’une population croissante, la Société canadienne d’hypothèques et de logement estime que le Canada doit presque doubler sa production annuelle de logements, pour atteindre 480 000 nouveaux logements par année au cours de la prochaine décennie, afin de rendre le logement abordable pour la population canadienne. Ce besoin se fait sentir de façon plus aiguë dans les plus grandes villes et régions du pays. Par exemple, pour atteindre ces cibles nationales, Toronto doit augmenter ses mises en chantier annuelles de 71 %, Montréal de plus de 200 %, Calgary de 45 % et Ottawa-Gatineau de 155 %. Au total, un peu plus de 50 % des logements nécessaires se trouvent dans les six plus grandes régions métropolitaines du Canada. La SCHL prévoit que la demande de logements et les prix continueront d’augmenter plus rapidement dans ces régions dans un avenir prévisible.</p>`
			}
		]
	},
	{
		panels: [
			{
				id: 'commute',
				label:
					'Figure 6 – Durée du trajet domicile-travail dans les plus grandes régions urbaines',
				source:
					'Statistique Canada. Tableau 98-10-0465-01  Principal mode de transport pour se rendre au travail selon la durée du trajet domicile-travail, l’heure de départ pour le travail, les secteurs d’industrie, la grande catégorie de profession et le genre : Canada, provinces et territoires, régions métropolitaines de recensement et agglomérations de recensement avec parties'
			}
		],
		blocks: [
			{
				panelId: 'commute',
				heading:
					'Le besoin de transport collectif structurant dans les plus grandes régions urbaines du Canada',
				body: `<p>Les investissements dans le transport collectif sont essentiels pour soutenir la croissance des plus grandes régions urbaines. À mesure que la demande de terrains augmente, ceux-ci prennent de la valeur, ce qui exerce une pression à la hausse sur les coûts. Dans ce contexte, des projets de logement peuvent rapidement devenir non viables. Construire à plus forte densité peut aider à surmonter cet obstacle, mais à mesure que les grandes villes croissent de cette manière, il devient plus difficile de s’y déplacer. Cette friction dans les déplacements réduit à la fois l’avantage économique des villes et la qualité de vie. La Chambre de commerce de la région de Toronto (Toronto Region Board of Trade) estime que la congestion dans la région du Grand Toronto et de Hamilton coûte 44 milliards de dollars par année à l’économie. Les investissements dans les infrastructures de transport collectif constituent la solution la plus efficace à ces problèmes. Ils améliorent la mobilité et la qualité de vie, ce qui se reflète dans la valeur foncière et attire en retour davantage d’investissements privés dans la construction résidentielle. Lorsqu’il devient trop difficile de se déplacer en ville, les gens ont tendance à en partir.</p>`
			},
			{
				body: `<p>Six régions disposent d’infrastructures de transport collectif structurant, et une septième en est à l’étape de la planification (Québec).</p>
				<p>Ces six régions comptent 12 lignes de train léger sur rail (TLR), 10 lignes de métro et 14 lignes de train de banlieue.
				Quatre lignes de TLR sont en construction et quatre autres sont à l’étape de la planification.
				Une ligne de métro est en construction, et divers prolongements et améliorations des trains de banlieue sont en cours.</p>
				<p>On compte au total 465 stations de transport collectif structurant, et 298 autres sont en construction ou à l’étape de la planification.
				Actuellement, 5,59 millions de personnes vivent à moins de 800 m d’une station de transport collectif structurant.</p>`
			}
		]
	},
	{
		panels: [
			{
				id: 'development',
				label:
					'Figure 7 – Aménagement axé sur le transport collectif dans certaines municipalités (stations existantes)',
				source:
					'Statistique Canada. Tableau 98-10-0002-01  Chiffres de population et des logements : Canada et subdivisions de recensement (municipalités)'
			},
			{
				id: 'line5',
				label:
					'Figure 8 – Trajectoires de construction résidentielle des lignes 5 et 6 à Toronto ',
				source: ''
			},
			{
				id: 'pipeline',
				label: 'Figure 9 – Logements projetés le long de la ligne 5 à Toronto',
				source: ''
			}
		],
		blocks: [
			{
				panelId: 'development',
				heading:
					'Maximiser les retombées des investissements en transport collectif sur la construction de logements ',
				body: `<p>Tous les projets de transport collectif ne produisent toutefois pas le même effet sur la construction de logements. La demande de marché pour l’aménagement axé sur le transport collectif (TOD) varie d’une ville à l’autre, d’une ligne à l’autre au sein d’une même ville, et même d’une station à l’autre sur une même ligne. Chaque lieu présente des caractéristiques uniques qui le rendent plus ou moins attrayant pour les futurs résidents. Le rapport entre la demande et l’offre de terrains joue aussi un rôle important : dans les municipalités centrales des trois plus grandes régions urbaines (Toronto, Montréal, Vancouver), la majorité des nouveaux logements sont construits près des grandes stations de transport collectif, alors que dans les trois suivantes (Calgary, Edmonton, Ottawa), on construit encore davantage à l’extérieur des aires de station de transport collectif.</p>`
			},
			{
				panelId: 'line5',
				body: `<p>Deux lignes de TLR récemment mises en service à Toronto (lignes 5 et 6) illustrent des trajectoires divergentes de construction résidentielle dans un même contexte municipal : 140 844 nouveaux logements sont actuellement en construction ou proposés dans le corridor de la ligne 5, contre 23 430 logements projetés pour la ligne 6.</p>`
			},
			{
				panelId: 'pipeline',
				body: `<p>La ligne 5 montre également à quel point la construction résidentielle varie sur son parcours : certaines stations connaissent une activité modeste, tandis qu’une poignée d’entre elles comptent chacune 25 000 logements ou plus proposés dans un rayon de 800 m.</p>`
			}
		]
	},
	{
		panels: [
			{
				id: 'forces',
				label: 'Figure 10a – Exemples de politiques de zonage autour des stations de transport collectif',
				source:
					'<a href="https://www2.gov.bc.ca/assets/gov/housing-and-tenancy/tools-for-government/local-governments-and-housing/toa_provincial_policy_manual.pdf" target="_blank">https://www2.gov.bc.ca/assets/gov/housing-and-tenancy/tools-for-government/local-governments-and-housing/toa_provincial_policy_manual.pdf</a>'
			},
			{
				id: 'forces2',
				label: 'Figure 10b – Exemples de politiques de zonage autour des stations de transport collectif',
				source:
					'<a href="https://www.mississauga.ca/wp-content/uploads/2022/11/City-wide-MTSA_Virtual_Information_Session_Presentation_April_26_2022.pdf" target="_blank">https://www.mississauga.ca/wp-content/uploads/2022/11/City-wide-MTSA_Virtual_Information_Session_Presentation_April_26_2022.pdf</a>'
			},
			{
				id: 'forces3',
				label: 'Figure 10c – Exemples de politiques de zonage autour des stations de transport collectif',
				source:
					'<a href="https://cmm.qc.ca/wp-content/uploads/2019/03/pmad_plan_metropolitain_amenagement_developpement.pdf" target="_blank">https://cmm.qc.ca/wp-content/uploads/2019/03/pmad_plan_metropolitain_amenagement_developpement.pdf </a>'
			}
		],
		blocks: [
			{
				panelIds: ['forces', 'forces2', 'forces3'],
				heading: 'Forces du marché et politiques d’aménagement',
				body: `<p>Les forces du marché ne sont pas le seul facteur qui détermine ce qui se construit, et où. Pour maximiser les retombées des investissements en transport collectif structurant sur la construction de logements, les provinces et les municipalités peuvent travailler ensemble à harmoniser la réglementation d’urbanisme. Lorsqu’il contribue financièrement aux projets d’infrastructure de transport collectif, le gouvernement fédéral peut aussi assortir son financement de conditions afin que les politiques d’aménagement soutiennent l’investissement en favorisant la construction de logements à proximité.</p>
				<p>Dans certains contextes, des politiques qui autorisent des densités plus élevées ne suffisent pas à stimuler de façon importante la construction de logements. Calgary, Edmonton et Ottawa continuent de connaître plus de développement à l’extérieur des aires de station de transport collectif qu’à l’intérieur. Une grande partie de ce développement se fait en terrains vierges, car les terrains y sont encore relativement abondants et la congestion n’a pas atteint les niveaux problématiques observés dans les plus grandes régions urbaines. Cependant, les développements en terrains vierges axés sur l’automobile minent souvent l’appui aux investissements en transport collectif, ce qui complique la tâche des villes qui veulent faire du transport collectif le fondement de leur croissance.</p>
				<p>Plusieurs options stratégiques permettent d’orienter davantage le développement vers les aires de station de transport collectif. La première consisterait à resserrer les restrictions d’utilisation du sol dans les secteurs en terrains vierges. Par ailleurs, les provinces et les municipalités peuvent créer des incitatifs à construire près du transport collectif en réduisant les frais municipaux, notamment les redevances d’aménagement. Une troisième option consiste à investir davantage dans les équipements et services au sein des aires de station afin de les rendre plus attrayantes pour les futurs résidents — autrement dit, à créer des aménagements axés sur le transport collectif (TOD).</p>`
			}
		]
	},
	{
		panels: [
			{
				id: 'cc',
				label:
					'Figure 11a — 1st Street SW, à Calgary, affiche un score élevé de collectivité complète'
			},
			{
				id: 'cc2',
				label: 'Figure 11b — Martindale, à Calgary, affiche un faible score de collectivité complète'
			}
		],
		blocks: [
			{
				panelIds: ['cc', 'cc2'],
				heading: 'Des collectivités complètes axées sur le transport collectif',
				body: `<p>Le choix d’un lieu de résidence repose sur plusieurs facteurs, dont la proximité de l’emploi, l’accès au transport collectif et le prix des logements, mais aussi sur ce qui rend un quartier accueillant et dynamique : l’accès à de bonnes écoles, à des parcs et espaces verts, à des commerces et restaurants de proximité. Pour réussir à cet égard, les aménagements axés sur le transport collectif nécessitent un large éventail d’infrastructures complémentaires. Le concept de « collectivités complètes » veut que les gens puissent accéder à ce dont ils ont besoin au quotidien à une courte distance de marche de chez eux. Les épiceries, les écoles et les cabinets médicaux sont des exemples d’éléments essentiels des collectivités complètes. Concentrer l’infrastructure civique et les commerces locaux près des stations améliorera l’accès et l’efficacité, tant pour les fournisseurs que pour les utilisateurs de ces services. Pour que les collectivités axées sur le transport collectif réussissent à long terme, il faut dresser un portrait clair des besoins futurs des collectivités. Intégrer la planification des services de quartier à celle des nouvelles infrastructures de transport collectif structurant devrait donner de meilleurs résultats dans l’ensemble.</p>`,
				cta: {
					href: '/tools/complete-communities',
					label: 'Explorer l’outil Collectivités complètes'
				}
			}
		]
	},
	{
		panels: [
			{
				id: 'walkability',
				label:
					'Figure 12a — La station Arbutus, à Vancouver, est un exemple de station de transport collectif au potentiel piétonnier élevé.'
			},
			{
				id: 'walkability2',
				label:
					'Figure 12b — La station Panama, à Montréal, est un exemple de station de transport collectif au faible potentiel piétonnier.'
			}
		],
		blocks: [
			{
				panelIds: ['walkability', 'walkability2'],
				heading: 'Une collectivité n’est complète que si elle est propice à la marche',
				body: `<p>Les collectivités complètes peuvent offrir aux gens des options locales pour répondre à leurs besoins quotidiens, mais la mesure dans laquelle ils choisissent ces options dépend largement du potentiel piétonnier de la collectivité. Il est important de créer des grappes denses de services et d’équipements, y compris des stations de transport collectif, mais la qualité du domaine public qui les relie entre eux et aux lieux de résidence est un ingrédient essentiel d’une collectivité complète véritablement fonctionnelle.</p>`
			},
			{
				body: `<p>Des rues principales dynamiques sont un pilier des quartiers propices à la marche. Il est crucial que le trajet à pied vers la rue principale et la station de transport collectif soit sécuritaire, agréable et accessible aux personnes à mobilité réduite. Bon nombre des investissements récents en transport collectif structurant au Canada s’étendent au-delà des centres-villes, dans des milieux de banlieue conçus à l’origine pour maximiser les déplacements en automobile. C’est dans ces cas que le potentiel piétonnier est le plus souvent à son plus bas. À mesure que de nouvelles stations sont mises en service et que le développement suit, ces quartiers se densifient, mais ils risquent de ne pas devenir véritablement urbains si le domaine public est hostile aux modes de transport actif. Planifier le réaménagement du domaine public pour accueillir les nouveaux résidents et les nouveaux services sera l’un des défis les plus difficiles, mais aussi les plus importants, des aménagements axés sur le transport collectif. </p>`,
				cta: {
					href: '/reports/tod/walkability',
					label: 'En savoir plus dans le rapport sur le potentiel piétonnier'
				}
			}
		]
	},
	{
		panels: [
			{
				id: 'benefits',
				label:
					'Figure 13 — Rendu de l’étude de cas de la station Arbutus réalisée par l’Infrastructure Institute et la School of Cities.',
				source:
					'<a href="https://measuringmainstreets.ca/fr/casestudies/tod/arbutus" target="_blank">https://measuringmainstreets.ca/fr/casestudies/tod/arbutus</a>'
			}
		],
		blocks: [
			{
				panelId: 'benefits',
				heading:
					'Concrétiser les avantages des collectivités complètes axées sur le transport collectif ',
				body: `<p>Lorsque les gens disposent de nombreux services et équipements dans leur collectivité, et que ceux-ci sont accessibles par des modes de transport actif, ils s’en portent mieux. Des milieux denses, propices à la marche et riches en services peuvent améliorer la santé physique et mentale des personnes résidentes, renforcer les liens sociaux et le sentiment d’appartenance, et fournir la masse critique nécessaire pour soutenir les entreprises indépendantes des rues principales. Les collectivités axées sur le transport collectif améliorent l’accès aux possibilités d’emploi, améliorent la qualité de l’air, réduisent l’intensité carbone globale et peuvent être plus viables sur le plan financier pour les administrations locales. Lorsqu’on additionne tous ces avantages, les arguments en faveur des collectivités complètes axées sur le transport collectif sont indéniablement solides. Au-delà des gains en matière de transport, une analyse rigoureuse et réfléchie des améliorations sur les plans du logement, de l’économie, de la santé et des finances publiques découlant des nouveaux investissements en transport collectif structurant devrait permettre à un plus grand nombre d’analyses de rentabilisation d’obtenir la note de passage.</p>`,
				cta: {
					href: '/casestudies/?tab=tod&tag=School+of+Cities',
					label: 'Lire les études de cas'
				}
			}
		]
	},
	{
		panels: [
			{
				id: 'displacement',
				label:
					'Figure 14 — Capture d’écran du rapport « Qui vit dans les aires de station de transport collectif? »',
				source:
					'<a href="/reports/tod/who-lives-in-tsas" target="_blank">Qui vit dans les aires de station de transport collectif?</a>'
			}
		],
		blocks: [
			{
				panelId: 'displacement',
				heading: 'Abordabilité et déplacement de population',
				body: `<p>Les répercussions des nouveaux projets d’infrastructure de transport collectif structurant ne sont pas toutes positives. Les nouvelles lignes de TLR, de métro et de train de banlieue entraînent des changements importants dans les collectivités existantes. La valeur des propriétés augmente habituellement, l’utilisation des terrains change souvent, et de nouveaux bâtiments remplacent les plus anciens. Lorsque cela se produit, des résidents et des entreprises peuvent être déplacés. Les personnes qui subissent ce déplacement sont le plus souvent les plus vulnérables. Il ne s’agit pas seulement de retirer des individus d’un quartier : ce déplacement peut surtout fragiliser, voire rompre, les relations entre les gens et leur attachement à un lieu. Les relations sont le fondement de la communauté, et la communauté est le fondement de la résilience locale. L’aménagement axé sur le transport collectif doit être inclusif. Les politiques et les modèles de développement devraient limiter et atténuer les effets de déplacement, et offrir des possibilités abordables aux résidents de tous les niveaux de revenu.  </p>`,
				cta: {
					href: '/reports/tod/who-lives-in-tsas',
					label: 'Lire le rapport — Qui vit dans les aires de station de transport collectif?'
				}
			}
		]
	},
	{
		panels: [
			{
				id: 'dps',
				label: 'Figure 15 — Capture d’écran de l’outil de consultation communautaire de Digital Public Square.'
			}
		],
		blocks: [
			{
				panelId: 'dps',
				heading: 'Bâtir des collectivités axées sur le transport collectif à partir de la base',
				body: `<p>Les infrastructures de transport collectif structurant font bien plus que transporter les gens d’un point A à un point B. Elles sont au fondement même du développement des villes. Là où vont les investissements publics en transport collectif, les investissements privés ont tendance à suivre. Au fil du temps, ces investissements façonnent les milieux urbains les plus denses du pays et sont essentiels aux économies régionales. Si les lignes de transport collectif relient les différentes parties de la ville, chaque aire de station constitue en soi une collectivité de quartier. Lors de la planification et de la construction de nouvelles infrastructures de transport collectif, une approche de collectivité complète pour chaque arrêt devrait permettre d’obtenir plus de logements et une meilleure qualité de vie. Les nouvelles infrastructures de transport collectif structurant coûtent des milliards de dollars. C’est un travail complexe qui exige beaucoup d’expertise et de coordination. Ce qu’on ne peut négliger dans ce processus, c’est l’opinion du public. Dans quel genre de collectivités les gens veulent-ils vivre? Quels services et équipements leur importent le plus? Où veulent-ils être? Il faut faire de réels efforts pour poser ces questions afin que les projets d’infrastructure répondent en fin de compte aux attentes de la population. Si nous parvenons à faire évoluer notre réflexion de la planification des transports vers le développement des villes, puis vers le développement des collectivités, les futurs résidents devraient être bien servis.</p>`,
				cta: {
					href: '/tools',
					label: 'Explorer les outils'
				}
			}
		]
	}
];
