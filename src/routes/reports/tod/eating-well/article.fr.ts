/**
 * article.fr.ts - Eating Well Report Data (Canadian French)
 * Same structure as article.ts; only the visible text is translated.
 */

export const sections = [
	{
		panels: [
			{
				id: 'market-concentration',
				label: 'Figure 1 – Magasins appartenant à Loblaws, à Sobeys ou à Metro, ou affiliés à ces entreprises',
				source:
					'<a href="https://competition-bureau.canada.ca/sites/default/files/img/2023/20230623-grocery-report-figure-1.jpg" target="_blank">Bureau de la concurrence du Canada (2023)</a>'
			}
		],
		blocks: [
			{
				eyebrow: 'L’oligopole de l’épicerie au Canada',
				heading: 'Des prix de l’épicerie qui s’emballent',
				body: `<p>Le secteur canadien de l’épicerie manque de saine concurrence. Les prix de l’épicerie ont augmenté de plus de <a href="https://stories.td.com/ca/en/article/rising-cost-of-groceries-canada-td-economics" target="_blank">30 % depuis la fin de 2019</a>, et l’accessibilité financière des aliments devient la <a href="https://www.cbc.ca/news/canada/nova-scotia/canadians-save-groceries-food-costs-survey-9.6986295" target="_blank">principale préoccupation financière</a> de nombreux Canadiens et Canadiennes. Cette tendance témoigne d’une défaillance du marché.</p>
				<p>En 2022, les géants canadiens de l’épicerie — Loblaws, Sobeys et Metro — ont déclaré plus de 100 milliards de dollars de ventes d’aliments et réalisé plus de 3,6 milliards de dollars de profits. Ces trois géants freinent activement la concurrence et ont toute latitude pour maximiser leurs profits aux dépens de la population canadienne.</p>
				<p>Si l’on ajoute Walmart et Costco, ces cinq sociétés forment un oligopole qui <a href="https://breachmedia.ca/why-canada-needs-public-grocery-stores/" target="_blank">contrôle plus de 80 %</a> du marché de l’épicerie.</p>
				<p>Le <a href="https://competition-bureau.canada.ca/sites/default/files/attachments/2023/CB-Retail-Grocery-Market-Study-Report-EN-2023-06-23.pdf" target="_blank">Bureau de la concurrence du Canada</a> considère qu’une concurrence accrue est essentielle pour faire baisser les prix de l’épicerie, mais prévient que les épiciers indépendants ne prendront pas d’expansion sans le soutien des gouvernements.</p>`
			},
			{
				body: `<p>Le Bureau a constaté que les épiciers indépendants se heurtent à d’importants obstacles à leur expansion :</p>
				<ul>
					<li><b>Fusions et puissance financière :</b> Les géants d’aujourd’hui sont issus de nombreuses fusions et se servent de leur puissance financière combinée pour absorber de plus petits concurrents.</li>
					<li><b>Commerce de gros et chaîne d’approvisionnement :</b> Beaucoup d’indépendants ne sont pas assez gros pour posséder leur propre entrepôt ou acheter directement auprès des fournisseurs. Les géants tirent parti de leurs activités de gros bien établies pour battre les indépendants sur les prix.</li>
					<li><b>Contrôles fonciers :</b> Les géants utilisent des contrôles fonciers pour rendre difficile, voire impossible, l’ouverture de nouvelles épiceries concurrentes à proximité.</li>
				</ul>`
			}
		]
	},
	{
		layout: 'inline',
		panels: [
			{
				id: 'transit-food-access',
				label: 'Figure 2 – Réseaux de transport collectif urbain et intensité de l’accès aux aliments',
				source: 'Spatial Visualization Study (2026)'
			}
		],
		blocks: [
			{
				heading: 'L’accès aux aliments est inégalement réparti dans nos réseaux de transport collectif',
				body: `<p>Il existe <strong>deux solutions de rechange viables et sans but lucratif</strong> aux géants de l’épicerie, toutes deux axées sur des coûts bas pour la clientèle. </p>`
			}
		]
	},
	{
		panels: [
			{
				id: 'public-option',
				label: 'Figure 3 – Proposition d’investissement fédéral dans des épiceries publiques',
				source: 'Centre canadien de politiques alternatives (2026)'
			}
		],
		blocks: [
			{
				heading: 'L’option publique',
				body: `<p>Des épiceries publiques à bas prix sont proposées un peu partout au Canada pour accroître la concurrence et faire baisser les prix. La Ville de Toronto vient d’<a href="https://secure.toronto.ca/council/agenda-item.do?item=2026.MM39.27" target="_blank"> approuver un projet pilote</a> visant à ouvrir quatre épiceries municipales, en priorité dans des quartiers où le revenu moyen des ménages est plus faible et où l’accès aux supermarchés à service complet est limité.</p>
				<p>Selon des spécialistes du secteur de l’épicerie, des épiceries publiques prospères existent déjà — sous forme de supermarchés urbains et de magasins ruraux au Mexique, ou de magasins sur les bases militaires américaines — et vendent des produits moins chers que ceux des grandes chaînes.</p>
				<p>La clé du succès consiste à <a href="https://www.policyalternatives.ca/news-research/how-public-grocery-stores-could-work-in-canada/" target="_blank">les déployer à grande échelle</a>. Selon une première modélisation, <strong>l’investissement fédéral en vaudrait largement le coût</strong>.</p>
				<p>Imaginez si une partie de ces 40 épiceries urbaines étaient implantées de façon à mieux tirer parti des investissements stratégiques des provinces et des municipalités en transport collectif.</p>`
			}
		]
	},
	{
		panels: [
			{
				id: 'coop-option',
				label: 'Figure 4 – Les promesses des coopératives alimentaires',
				source: 'Grocery Story: The Promise of Food Co-ops in the Age of Grocery Giants (2019)'
			}
		],
		blocks: [
			{
				heading: 'L’option coopérative',
				body: `<p>Les épiceries coopératives, ou coopératives alimentaires, n’ont rien de nouveau au Canada. Bon nombre d’entre elles sont nées <a href="https://www.cbc.ca/news/canada/british-columbia/grocery-coops-alternative-supermarkets-1.7192944" target="_blank" /> à la fin des années 1960 et au début des années 1970</a>. Si elles prennent des formes très variées, les coopératives sont définies par Jon Steinman comme des entreprises ou des organisations fondées et détenues par les personnes qui bénéficient directement de leurs produits ou services. Les coopératives n’imposent pas de prix abusifs à leur clientèle, puisque c’est elle qui les gouverne.</p>
				<p>Des coopératives alimentaires ont été créées pour répondre aux besoins des collectivités en matière d’accès à des aliments sains et abordables, en milieu urbain comme en milieu rural, là où cet accès est devenu difficile. Elles naissent souvent pour combler des lacunes : dans des quartiers urbains où l’offre locale est trop chère, ou dans des villages où le dernier supermarché d’une grande chaîne a fermé ses portes.</p>
				<p>Les coopératives alimentaires ont pour mission de faire baisser le coût de l’épicerie et de faire profiter leurs membres des économies réalisées.</p>
				<p>Imaginez si les pôles de transport collectif comprenaient des épiceries gérées et exploitées par des membres de la collectivité qui s’entraident pour se nourrir et tissent des liens entre voisins et voisines.</p>`
			}
		]
	},
	{
		panels: [
			{
				id: 'civic-infrastructure',
				label: 'Figure 5 – Comparaison de modèles d’épiceries abordables',
				source: 'Recherche de l’IUC (2026)'
			}
		],
		blocks: [
			{
				heading: 'Les épiceries sont une infrastructure civique',
				body: `<p>Alors que tous les ordres de gouvernement s’efforcent de tirer le meilleur parti des investissements en transport collectif, favoriser l’émergence de quartiers urbains animés et à usage mixte autour des stations de métro et de train exige de réfléchir sciemment à l’accès des personnes résidentes aux aliments. Tout comme les initiatives de logement abordable visent la sécurité en matière de logement, des épiceries abordables feraient de même pour la sécurité alimentaire.</p>
				<p>L’option publique et l’option coopérative représentent deux approches pour accroître la concurrence dans le secteur de l’épicerie. Même si elles abordent différemment le même problème — des prix de l’épicerie qui s’emballent —, toutes deux visent à procurer des avantages financiers à la population canadienne et peuvent être combinées au grand bénéfice de millions de personnes qui habitent des quartiers desservis par le transport collectif.</p>
				<p>L’approvisionnement alimentaire ne devrait pas être laissé uniquement aux forces du marché, guidées par la maximisation des profits. </p>`
			}
		]
	},
	{
		panels: [],
		blocks: [
			{
				heading: 'Déployer un réseau national d’épiceries locales abordables',
				body: `<p>Le secteur canadien de l’épicerie a besoin de concurrence pour faire baisser les prix, et les quartiers qui se transforment sous l’effet des investissements en transport collectif exigent des approches réfléchies pour garantir l’accès à une épicerie saine et abordable.</p>
				<p>L’aménagement des quartiers desservis par le transport collectif devrait profiter aux collectivités qui y vivront. Les types d’épiceries que nous encourageons et soutenons devraient répondre aux besoins laissés sans réponse par l’oligopole de l’épicerie.</p>
				<p>Lorsqu’on leur en donne les moyens, les collectivités s’organisent d’elles-mêmes et mettent en œuvre des initiatives pour améliorer leur qualité de vie. Le rôle des gouvernements devrait être de renforcer la capacité des collectivités à se prendre en main en réduisant les obstacles financiers, politiques et réglementaires. Qu’il s’agisse de soutenir des épiceries publiques, des coopératives alimentaires ou des épiciers indépendants, chaque ordre de gouvernement dispose de leviers. </p>`
			},
			{
				eyebrow: 'Gouvernement fédéral',
				heading: 'Exercer le pouvoir de dépenser',
				body: `<h6>Conclure des ententes intergouvernementales et transférer des fonds pour bâtir une infrastructure d’épicerie d’envergure nationale.</h6>
				<p>La mise en place de l’infrastructure de distribution et des sites des épiceries publiques nécessiterait un investissement initial de 350 millions de dollars. C’est un coût modeste compte tenu de l’intention du gouvernement fédéral de lancer le Fonds pour bâtir des collectivités fortes, un programme de 51 milliards de dollars sur 10 ans.</p>
				<p>Les centres de distribution — des projets clés de développement économique régional — pourraient être mis à profit par des réseaux d’épiceries publiques, de coopératives alimentaires, de petits commerces et d’indépendants répartis dans les quartiers desservis par le transport collectif et dans l’ensemble des milieux urbains et ruraux, afin de regrouper leur pouvoir d’achat pour de gros volumes, de disposer d’espace d’entreposage et de rivaliser avec les géants de l’épicerie sur les prix obtenus auprès des fournisseurs. Les économies seraient transmises aux consommateurs et consommatrices.</p>
				<p>Les économies d’échelle et une demande stable, jumelées à une politique d’achat au Canada, seraient une aubaine pour les entreprises canadiennes des industries alimentaires locales et nationales. </p>
				<p>Le gouvernement fédéral a déjà démontré sa capacité à conclure rapidement des ententes intergouvernementales et des transferts budgétaires, comme en témoignent les ententes du Programme national d’alimentation scolaire conclues avec l’ensemble des provinces et des territoires. </p>`
			},
			{
				eyebrow: 'Gouvernements provinciaux',
				heading: 'Favoriser la concurrence locale dans le secteur de l’épicerie',
				body: `<h6>Éliminer les contrôles fonciers visant les épiceries.</h6>
				<p>Les contrôles fonciers — clauses restrictives ou clauses d’exclusivité — sont des ententes conclues entre propriétaires fonciers et détaillants, dans des baux ou des titres de propriété, pour empêcher des concurrents d’exercer leurs activités ou de vendre certains produits sur la même propriété ou sur des propriétés adjacentes ou voisines. </p>
				<p>Il s’agit d’un obstacle majeur à l’ouverture de nouvelles épiceries exploitées par des concurrents autres que les géants. </p>
				<p>Chef de file en matière d’élimination des contrôles fonciers au Canada, le gouvernement du Manitoba a récemment adopté, en juin 2025, une loi sur les contrôles fonciers visant les épiceries et les supermarchés. En décembre 2025, <a href="https://news.gov.mb.ca/news/?item=71917" target="_blank"> 23 contrôles fonciers avaient été soumis en vue de leur suppression</a>.</p>`
			},
			{
				eyebrow: 'Sociétés de transport collectif',
				heading: 'Saisir les occasions propres à chaque site',
				body: `<h6>Recourir à l’aménagement conjoint sur les terrains des sociétés de transport collectif.</h6>
				<p>Selon CATCH, l’aménagement conjoint est une stratégie politique et immobilière par laquelle les sociétés de transport collectif s’associent à des promoteurs publics, privés ou sans but lucratif pour construire des logements et des projets à usage mixte sur des terrains qu’elles possèdent ou contrôlent. Il peut s’agir de stations, de gares de triage, de stationnements et de droits aériens.</p>
				<p>Les sociétés de transport collectif peuvent céder des terrains sous-utilisés à un prix inférieur à celui du marché et exiger des retombées d’intérêt public dans l’entente d’aménagement. Outre les priorités en matière de logement abordable, ces retombées peuvent comprendre des espaces pour des services de soutien essentiels, comme des coopératives alimentaires ou des épiceries publiques. </p>`
			},
			{
				eyebrow: 'Municipalités',
				heading:
					'Favoriser l’implantation d’épiceries abordables dans les quartiers prioritaires et les aires de station de transport collectif ',
				body: `<h6>Implanter d’abord les épiceries publiques dans les quartiers qui en ont le plus besoin.</h6>
				<p>Si l’arrivée graduelle de solutions d’épicerie abordables profitera à toutes les collectivités, les municipalités qui lancent des projets pilotes d’épiceries publiques doivent d’abord cibler les secteurs où l’accès aux aliments est le plus faible. Ces quartiers ont généralement un revenu des ménages inférieur à la moyenne et sans doute une plus forte proportion de populations racisées. Ce sont aussi les groupes les plus susceptibles de dépendre du transport collectif et qui profiteraient le plus des investissements dans ce domaine.</p>
				<h6>Réduire les obstacles financiers pour les épiceries publiques et les coopératives alimentaires.</h6>
				<p>Il peut s’agir d’exonérations de taxes foncières, de redevances d’aménagement et de frais de permis afin de réduire les coûts d’aménagement et d’exploitation. </p>
				<h6>Mettre en œuvre des plans d’amélioration communautaire pour offrir un soutien financier direct aux coopératives alimentaires admissibles </h6>
				<p>Les plans d’amélioration communautaire (Community Improvement Plans) sont un outil de planification qu’utilisent les municipalités pour offrir un soutien financier direct aux entreprises, comme des subventions de prédéveloppement et de développement. Ces subventions peuvent servir à des études de faisabilité et de marché, à la construction et à la rénovation. Les secteurs visés par un plan d’amélioration communautaire peuvent être délimités de manière à inclure les zones où les aires de station de transport collectif chevauchent des quartiers mal desservis.</p>`
			},
			{
				heading:
					'Faciliter la création d’épiceries publiques et de coopératives alimentaires ne vise pas à remplacer les grandes chaînes d’épicerie.',
				body: '<p>Il s’agit d’offrir plus de choix à la population canadienne, de corriger des défaillances du marché, de faire baisser les prix de l’épicerie et de rapprocher nos collectivités de la pleine réalisation de leur droit à l’alimentation. </p>'
			}
		]
	}
];
