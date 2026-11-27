/**
 * article.fr.ts
 *
 * Canadian French version of article.ts. Same shape, ids, panel ids and props;
 * only the visible text (labels, headings, bodies) is translated.
 */

export const sections = [
	{
		layout: 'inline',
		panels: [{ id: 'amenity-tiers', label: 'Figure 1 — Liste des commodités essentielles et complémentaires' }],
		blocks: [
			{
				heading: 'Recenser les commodités de proximité',
				body: `
        <p>Avec la croissance rapide de la population dans les plus grandes régions urbaines du Canada, il faut accroître l’offre de logements en mettant l’accent sur le développement durable. Le transport collectif structurant est essentiel pour soutenir la croissance à mesure que ces régions continuent de s’étendre, et il est un moteur de la construction résidentielle et de la densification. Dans les six plus grandes municipalités du Canada, les secteurs situés à moins de 800 mètres d’une station de transport collectif ont gagné 499 000 logements de 2001 à 2021, contre 470 000 au-delà de 800 mètres, alors que ces secteurs ne représentent que 8 % de la superficie totale de ces six municipalités.</p>`
			},
			{
				body: `<p>Comme la demande croissante pousse à densifier ces régions, la notion de collectivités complètes a gagné en importance dans le contexte de la planification au Canada. Une étude récente portant sur 102 documents de planification et de politiques publiés entre 1975 et 2023 dans des villes de différentes tailles a relevé une mention des collectivités complètes dans 81 % des documents (Grant, 2024). Si les détails de ce qui constitue une collectivité complète variaient quelque peu, la notion servait de concept global pour désigner une croissance à forte densité permettant aux personnes résidentes de tous âges d’accéder aux commodités et aux services dont elles ont besoin, en misant sur le transport actif.</p><p>À partir de données nationales sur les entreprises, nous avons établi deux niveaux de commodités : essentielles et complémentaires. Les commodités essentielles sont indispensables à une collectivité complète, tandis que les 26 commodités complémentaires améliorent la qualité de vie en général, mais sont moins importantes. Puisque ce rapport porte sur les collectivités complètes dans les aires de station de transport collectif (ASTC), nous nous concentrons surtout sur les commodités essentielles situées dans un rayon de 800 mètres autour de la station, soit l’équivalent de 10 à 15 minutes de marche.</p>
        <p>Dans le contexte des aires de station de transport collectif (ASTC), les collectivités complètes peuvent servir de levier pour favoriser la densification dans une optique de développement durable. Toutefois, les aires de station n’ont pas toutes concrétisé cette relation.</p>`,
				panelId: 'amenity-tiers'
			}
		]
	},
	{
		panels: [
			{
				id: 'access-scatter',
				label: 'Figure 2 — Accès aux commodités essentielles et densité de population'
			},
			{ id: 'amenity-map' }
		],
		blocks: [
			{
				body: `<p>Ce graphique compare l’accès aux commodités essentielles et la population actuelle d’une ASTC, toutes deux rapportées à la médiane régionale. Les stations situées dans le quadrant inférieur gauche présentent à la fois un faible accès et une faible population, tandis que celles du quadrant supérieur droit présentent l’inverse : un accès élevé et une population élevée.</p>`
			},
			{
				body: `<p>Lorsqu’on compare l’ensemble des régions de transport collectif, des tendances nettes se dessinent. L’une d’elles est la relation entre l’accès et la densité. Si la pente globale varie, l’accès aux commodités essentielles augmente généralement avec la population totale. Cela illustre l’avantage global des collectivités complètes et le rôle du transport collectif comme moteur de la densité résidentielle. Même s’il existe une dynamique de « l’œuf ou la poule » entre la complétude et la densité, ces deux notions se renforcent mutuellement. Une densité accrue peut rendre le développement économique plus attrayant pour les entreprises, et, à l’inverse, une collectivité bien pourvue en commodités est attrayante pour le développement résidentiel.</p>`,
				props: { region: 'All' }
			},
			{
				body: `<p>L’emplacement de ces stations dans leur région urbaine est aussi révélateur. Dans des régions comme Montréal, Vancouver, Ottawa et la région élargie du Golden Horseshoe, les stations du quadrant supérieur droit se trouvent dans les secteurs les plus urbanisés, au centre-ville ou tout juste en périphérie, comme en témoignent les stations <strong>Union, Mont-Royal, Rideau et Vancouver City Centre</strong>. Les stations du quadrant inférieur gauche se trouvent en banlieue ou en frange urbaine de ces régions (<strong>Letrim, Limebank, Templeton</strong>); dans la région élargie du Golden Horseshoe et à Montréal, il s’agit de gares de trains de banlieue (<strong>Malton, Old Elm, Mascouche</strong>).</p>`,
				props: {
					highlightIds: ['381', '476', '598', '714', '602', '584', '713', '544', '271', '311'],
					region: 'All'
				}
			},
			{
				body: `<p>À Calgary et à Edmonton, la forme urbaine est différente : l’abondance de terrains disponibles a favorisé l’étalement urbain plutôt que la densification résidentielle. Par conséquent, des stations de banlieue se trouvent aux deux extrémités du graphique, tandis que la plupart des stations du noyau urbain se situent autour de la médiane régionale.</p>`,
				props: { region: ['Calgary', 'Edmonton'] }
			},
			{
				body: `<p>Ce graphique permet aussi de repérer les stations où des investissements résidentiels ou dans les commodités essentielles pourraient être faits. Les stations du quadrant supérieur gauche offrent un accès relativement élevé aux commodités essentielles, mais leur population résidente est inférieure à la moyenne. Des secteurs comme <strong>Port Coquitlam, Guelph, Rundle et Saint-Lambert</strong> pourraient accueillir de nouveaux logements sans que l’accès tombe sous la médiane régionale. À l’inverse, les stations du quadrant inférieur droit sont des secteurs relativement denses où des investissements supplémentaires dans les commodités essentielles apporteraient le plus de valeur, comme la <strong>station Duncanwoods</strong> du nouveau SLR Finch West.</p>`,
				props: { region: 'All', highlightIds: ['191', '227', '699', '56', '531'] }
			}
		]
	},
	{
		layout: 'inline',
		panels: [
			{
				id: 'amenity-map',
				label: 'Figure 3 — Accès aux commodités et densité de population par région de transport collectif'
			}
		],
		blocks: [
			{
				panelId: 'amenity-map',
				body: `<p>Explorez la carte ci-dessous pour voir la répartition des commodités par rapport à la population dans les différentes régions de transport collectif.</p>`
			}
		]
	},
	{
		panels: [
			{
				id: 'access-scatter-additional',
				label: 'Figure 4 — Accès aux commodités complémentaires et densité de population'
			}
		],
		blocks: [
			{
				heading: 'Accès aux commodités complémentaires',
				body: `<p>Un graphique semblable pour les commodités complémentaires fait ressortir une tendance comparable dans des régions comme Montréal, Vancouver, Ottawa et la région élargie du Golden Horseshoe : les stations des quadrants supérieur droit et inférieur gauche semblent s’éloigner davantage les unes des autres. Pour des régions comme Calgary et Edmonton, et même pour les stations de banlieue des quatre régions précédentes, l’étirement vertical le long du côté gauche du graphique est très net, car ces stations ont soit beaucoup de commodités complémentaires, soit aucune. Les stations offrant un accès élevé aux commodités complémentaires le long de l’axe des y semblent être reliées à un centre commercial régional, comme les <strong>stations Yorkdale, Southgate et Chinook</strong>.</p>`
			}
		]
	},
	{
		panels: [
			{
				id: 'missing-infrastructure',
				label: 'Figure 5 — Présence des commodités essentielles dans les ASTC, par type'
			}
		],
		blocks: [
			{
				heading: 'Quelles infrastructures manquent?',
				body: `<p>Sachant qu’une densité de population plus élevée se traduit par un meilleur accès aux commodités essentielles autour des aires de station de transport collectif, nous pouvons maintenant examiner quelles commodités sont plus fréquentes que d’autres.</p>
        <p>Ce graphique présente, pour chaque type de commodité essentielle, sa présence ou son absence dans l’ensemble des stations. Le constat le plus important est le manque de grandes infrastructures civiques comme les <strong>bibliothèques et les centres communautaires</strong>. Ces infrastructures civiques sont absentes de 60 % et de 57 % des ASTC respectivement, alors que les commodités davantage axées sur le marché et occupant une plus petite empreinte (cabinets de médecin, dépanneurs, banques, supermarchés, services de garde et pharmacies) sont beaucoup plus fréquentes, les pharmacies étant les plus présentes : seulement 14 % des ASTC n’en comptent aucune.</p>`
			}
		]
	},
	{
		panels: [
			{
				id: 'civic-infrastructure',
				label: 'Figure 6 — Présence de bibliothèques et de centres communautaires selon la population des ASTC'
			}
		],
		blocks: [
			{
				body: `<p>Lorsqu’on classe les stations selon qu’elles n’ont ni centre communautaire ni bibliothèque, qu’elles ont l’un des deux ou qu’elles ont les deux, on constate de nouveau l’influence de la densité sur la présence de ces infrastructures civiques : les aires de station qui comptent les deux sont beaucoup plus denses, quelle que soit la région de transport collectif.</p>`
			}
		]
	},
	{
		layout: 'inline',
		panels: [
			{
				id: 'library-map',
				label: 'Figure 7 — Présence de bibliothèques et de centres communautaires par aire de station de transport collectif'
			}
		],
		blocks: [
			{
				body: `<p>La carte ci-dessous montre l’emplacement de chaque ASTC et la présence de ces commodités, ainsi que l’emplacement des bibliothèques et des centres communautaires. Dans les centres-villes et les secteurs plus denses de ces régions, on observe une concentration de ces commodités, une seule installation pouvant même desservir plusieurs aires de station de transport collectif à la fois. À l’opposé, dans les secteurs de banlieue, ces commodités sont beaucoup plus dispersées : de nombreuses stations n’y donnent pas accès à pied, et il faut recourir à un autre mode de transport.</p><p>Cette séparation des usages découle des politiques d’aménagement issues de la « suburbanisation » de l’après-Seconde Guerre mondiale dans de nombreuses villes nord-américaines. À mesure que les villes s’étendaient, des décisions d’aménagement ont séparé les usages commerciaux des usages résidentiels, car la population cherchait une solution de rechange aux centres-villes surpeuplés (Centre for Urban Growth and Renewal, 2012). Il en a résulté une dépendance excessive à l’automobile et des inégalités liées au transport : les personnes sans voiture subissent des temps de déplacement plus longs, ou ne peuvent tout simplement pas accéder aux services, ce qui va à l’encontre même du concept de collectivité complète.</p>`,
				panelId: 'library-map'
			}
		]
	},
	{
		layout: 'inline',
		panels: [
			{
				id: 'future-stations',
				label: 'Figure 8 — Potentiel de développement futur par aire de station de transport collectif'
			}
		],
		blocks: [
			{
				panelId: 'future-stations',
				heading: 'Comment les sociétés de transport collectif et les municipalités peuvent-elles y parvenir?',
				body: `<p>L’aménagement axé sur le transport collectif peut être un puissant facteur d’égalité face aux inégalités liées au transport, en donnant à un plus grand nombre de personnes résidentes accès à un transport collectif rapide, fiable et en site propre. La densification autour des stations existantes est déjà en cours et se poursuivra : 277 futures stations de transport collectif structurant sont prévues ou en construction, ce qui rendra ces régions plus connectées que jamais. Toutefois, si nos politiques d’utilisation du sol autour de ces stations ne changent pas, les aires de station de transport collectif deviendront plus achalandées, mais pas meilleures.</p>`
			},
			{
				body: `<p>C’est pourquoi un virage des politiques est nécessaire, de l’<strong>aménagement axé sur le transport collectif (TOD)</strong> vers les <strong>collectivités complètes axées sur le transport collectif (TOCC)</strong>. Les futures stations accusent déjà un déficit de commodités pour la population actuelle, et ce, avant même la densification résidentielle qu’une nouvelle station entraînera inévitablement. Si l’on considère les futures stations des cinq régions, il faudrait, pour atteindre l’accès médian aux commodités essentielles, ajouter à elles seules environ 60 000 emplois dans les commodités essentielles.</p>`
			}
		]
	},
	{
		layout: 'inline',
		panels: [
			{
				id: 'development-potential',
				label: 'Figure 9 — Études de cas sur le potentiel de développement futur'
			},
			{
				id: 'amenity-needs-summary',
				label: 'Figure 10 — Besoins totaux en emplois par type de commodité'
			}
		],
		blocks: [
			{
				panelId: 'development-potential',
				body: `<p>Bien sûr, les pressions de la croissance ne seront pas les mêmes partout, mais il faudrait cibler les stations, existantes et prévues, qui présentent un ensemble de caractéristiques particulières où la densification autour des stations peut avoir le plus d’impact. À l’aide de l’<a href="/tools/development-potential">outil sur le potentiel de développement résidentiel de l’Institut urbain du Canada</a>, nous examinons cinq stations jugées excellentes candidates au développement futur en fonction des pressions de croissance locales et de la disponibilité des terrains :</p>
				<ul>
				<li>Mount Pleasant GO (région élargie du Golden Horseshoe)</li>
<li>Chinook (Calgary)</li>
<li>Tunney’s Pasture (Ottawa)</li>
<li>Willowbrook (Grand Vancouver / Lower Mainland)</li>
<li>NAIT Blatchford Market (Edmonton)</li></ul><br/>`,
			},
{
				body: `<p>À l’aide de l’<a href="/tools/complete-communities">outil Collectivités complètes</a>, nous avons pris la situation actuelle en matière d’accès et ajouté 10 000 personnes résidentes à chaque ASTC afin d’évaluer un scénario hypothétique de densification résidentielle. Si le nombre d’emplois nécessaires dans les commodités essentielles variait, des investissements étaient requis dans toutes les aires de station. Tunney’s Pasture et Chinook obtenaient les meilleurs résultats : Tunney’s Pasture comptait toutes les commodités essentielles sauf un centre communautaire, tandis qu’à Chinook, des investissements dans les services de garde et les épiceries, ainsi qu’une nouvelle bibliothèque, auraient le plus grand impact. Willowbrook comptait 6 des 9 commodités essentielles — il lui manquait un cabinet de médecin, un centre communautaire et une bibliothèque — et avait besoin d’investissements dans les services de garde et les écoles. Mount Pleasant GO et NAIT Blatchford Market obtenaient les moins bons résultats, avec des besoins respectifs de 338 à 795 et de 631 à 1 256 emplois dans les commodités essentielles. À Mount Pleasant, 8 des 9 commodités (toutes sauf la bibliothèque) seraient nettement sous la médiane régionale, et les 9 le seraient à NAIT Blatchford Market, où les besoins les plus importants touchent les bibliothèques, les écoles, les services bancaires, les cabinets de médecin et les épiceries.</p>`
			},
			{
				panelId: 'amenity-needs-summary',
				body: `<p>Par type de commodité, les trois commodités essentielles qui nécessiteraient le plus d’investissements dans l’ensemble des stations sont les bibliothèques, les écoles primaires et secondaires et les épiceries.</p>`
			}
		]
	},
	{
		layout: 'inline',
		panels: [],
		blocks: [
			{
				heading: 'Conclusion et recommandations',
				body: `<p>En conclusion, les plus grandes régions du Canada font face à de nombreux défis en matière de logement et d’abordabilité. Conjuguer les investissements dans le transport collectif structurant et la densification résidentielle peut aider à relever ces défis en augmentant l’offre tout en réduisant les coûts de transport grâce à la promotion du transport collectif et du transport actif. Toutefois, si ces milieux n’offrent pas les commodités essentielles que les gens utilisent au quotidien, nous renforcerons les anciens modèles de séparation des usages et de dépendance à d’autres modes de transport, ce qui accroît les coûts et les inégalités en matière de transport. Voilà pourquoi un virage global de l’<strong>aménagement axé sur le transport collectif</strong> vers les <strong>collectivités complètes axées sur le transport collectif</strong> est essentiel pour concrétiser pleinement les retombées économiques, environnementales et en matière d’équité de ces nouvelles collectivités.</p>`
			},
			{
				body: `<h3>Planification coordonnée</h3><br/><p>Bien avant la construction d’une station, la coordination entre l’organisme responsable de l’infrastructure de transport collectif, souvent le gouvernement provincial, et le personnel municipal en aménagement est essentielle. Cette coordination intervient à deux étapes. La première est l’acquisition de terrains, qui devrait se faire le plus tôt possible afin de limiter la spéculation foncière. Les municipalités devraient disposer d’outils supplémentaires pour acquérir des terrains dans les ASTC à des fins de logement et d’infrastructures communautaires, y compris de grandes commodités civiques comme des bibliothèques, des centres communautaires, des épiceries, etc. Aux stations de banlieue, les espaces sous-utilisés, comme les terrains peu aménagés ou les stationnements de la station, devraient aussi être ciblés pour la densification au sein de l’ASTC. La seconde est une stratégie de zonage coordonnée, afin de réserver suffisamment de terrains aux commodités essentielles et complémentaires pour répondre aux besoins de la future population résidente.</p>`
			},
			{
				body: `<h3>Assurer de bonnes connexions du premier et du dernier kilomètre</h3><br/><p>Des collectivités complètes ne pourront voir le jour autour des aires de station de transport collectif si les trajets du premier et du dernier kilomètre vers ces commodités ne sont pas sécuritaires ni agréables pour les modes actifs, et pour les personnes de tous âges et de toutes capacités. Ce qui est possible dépend du cadre bâti existant, mais des éléments comme la largeur et la qualité des trottoirs, le mobilier urbain et les infrastructures d’accessibilité, entre autres, peuvent améliorer ces connexions. <a href="/reports/tod/walkability">Consultez notre rapport sur le potentiel piétonnier pour en savoir plus</a>.</p>`
			},
			{
				body: `<h3>Bien communiquer les avantages des collectivités complètes</h3><br/><p>Aux stations existantes, le syndrome « pas dans ma cour » peut constituer la principale force d’opposition aux nouvelles infrastructures et à la densification résidentielle. Cette étude a montré que des densités de population plus élevées favorisent un meilleur accès aux commodités essentielles et complémentaires dans l’aire de station de transport collectif. Dans cette optique, les avantages de la densité devraient être bien communiqués aux personnes résidentes actuelles et nouvelles tout au long du processus de planification et de consultation publique, afin que le débat porte davantage sur ce que la population peut attendre des collectivités complètes axées sur le transport collectif plutôt que sur la pertinence même du projet.</p>`
			}
		]
	}
];
