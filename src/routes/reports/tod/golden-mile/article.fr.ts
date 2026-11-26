// Canadian French version of article.ts (same structure; only the visible text is translated).
export const sections = [
	{
		panels: [
			{
				id: 'gmstudyarea',
				label: 'Figure 1 — Zone d’étude du Golden Mile.'
			},
			{
				id: 'gmbuildings',
				label: 'Figure 2 — Bâtiments proposés, approuvés et existants dans le Golden Mile.'
			}
		],
		blocks: [
			{
				panelIds: ['gmstudyarea'],
				heading: 'Le rez-de-chaussée du Golden Mile',
				body: `<p>C’est au rez-de-chaussée que la ville prend vie. Le rez-de-chaussée est l’interface entre
                les bâtiments et le domaine public; il façonne la manière dont les gens se déplacent, se rassemblent, magasinent
                et tissent des liens au quotidien. Il constitue l’infrastructure sociale et économique
                des quartiers en favorisant le potentiel piétonnier, en accueillant des entreprises locales et en nourrissant un sentiment d’appartenance.</p>
                <p>Dans la région du Grand Toronto (RGT), d’importants investissements en transport collectif transforment les corridors urbains à un rythme et à une échelle inédits depuis des générations.
                Pourtant, la densité ne suffit pas à elle seule à créer une collectivité. Trop souvent, les aménagements axés sur le transport collectif (TOD) ont atteint les cibles de logement
                sans parvenir à créer les milieux animés, inclusifs et socialement cohésifs que promettent les politiques d’aménagement. Il en résulte un scénario récurrent :
                des locaux commerciaux surdimensionnés, des façades inactives et une prédominance de locataires de chaînes qui limitent l’adaptabilité, la diversité économique locale et la vie communautaire.</p>
                <p>Ce projet répond à cette lacune en posant une question centrale : comment concevoir
                et gérer le rez-de-chaussée des collectivités nouvellement densifiées et axées sur le transport collectif pour soutenir des quartiers animés, inclusifs et résilients? Sans intervention délibérée, le Golden Mile de Scarborough risque
                de devenir un corridor dense, dépourvu des conditions nécessaires à des collectivités complètes.</p>`
			},
			{
				panelIds: ['gmbuildings'],
				body: `<p><b>Le Golden Mile de Scarborough constitue un cas type déterminant.</b> Ancien corridor
                industriel et commercial de l’après-guerre axé sur l’automobile, le Golden Mile se transforme en un secteur à haute densité desservi par le transport collectif et ancré par le
                SLR Eglinton Crosstown (ligne 5). Le plan secondaire du Golden Mile de la Ville prévoit environ 24 000 nouveaux logements, 43 000 personnes résidentes
                et 19 500 emplois sur 113 hectares, ce qui revient à bâtir une nouvelle collectivité de toutes pièces.</p>`
			},
			{
				body: `<p>Si le plan fixe des cibles de croissance ambitieuses, il
                donne peu d’orientations sur la façon dont le rez-de-chaussée sera conçu, programmé et géré.</p>
				<p><b>Cette situation présente à la fois un risque et une occasion rare :</b> celle de façonner
                la vie quotidienne d’un quartier avant même qu’il n’existe pleinement.</p>`
			}
		]
	},
	{
		panels: [
			{
				id: 'reimagining',
				label: 'Figure 3a — Atouts clés pour le réaménagement du Golden Mile.'
			},
			{
				id: 'macro',
				label:
					'Figure 3b — Emplacements possibles et distances de marche pour de nouveaux atouts communautaires dans le Golden Mile.'
			}
		],
		blocks: [
			{
				panelIds: ['reimagining', 'macro'],
				heading: 'Réimaginer le Golden Mile',
				body: `<p>Pour y répondre, notre équipe a élaboré un guide pratique destiné aux professionnels, en partenariat avec l’Institut urbain du Canada (IUC). Le guide
                propose une approche intégrée qui combine des stratégies de conception du rez-de-chaussée et un modèle de gouvernance locale pour que ces espaces
                demeurent actifs, adaptables et au service de la collectivité au fil du temps.</p>
                <p>Les recommandations de conception s’articulent aux échelles macro, méso et micro,
                et mettent l’accent sur des façades à grain fin, des configurations spatiales souples et de solides liens avec le transport collectif et le domaine public. En complément,
                nous proposons le Golden Mile Stewardship District (GMSD), un modèle de gouvernance infra-municipal qui coordonne l’animation du domaine public, soutient les entreprises locales
                et celles appartenant à des personnes nouvellement arrivées, et pérennise l’infrastructure communautaire grâce à des partenariats et à des ententes sur les avantages communautaires.</p>`
			},
			{
				body: `<p>Notre travail s’appuie sur un processus de recherche de huit mois combinant analyse spatiale, prévisions démographiques, études de cas comparatives, examen des politiques
                et collaboration continue avec l’IUC. Nous avons étudié des précédents locaux et internationaux, des quartiers à haute densité de Toronto à des villes
                comme New York, Londres, Amsterdam et Barcelone, afin de repérer des stratégies transposables et d’éviter des écueils bien documentés.</p>
                <p><b>Ce guide est un outil pratique d’aide à la décision</b> pour les urbanistes, les promoteurs, les décideurs et les organismes communautaires qui participent au réaménagement
                du Golden Mile, ainsi qu’un cadre plus large pour d’autres corridors de la RGT en densification rapide. Son argument central est simple : réussir le rez-de-chaussée est essentiel pour réussir la collectivité. Le Golden Mile représente une occasion rare
                et urgente d’harmoniser densité et qualité de vie, et de fixer une nouvelle norme pour l’aménagement de collectivités complètes axées sur le transport collectif.</p>`,
				cta: {
					href: 'https://canurb.org/wp-content/uploads/MUCP-x-CUI-Guidebook.pdf',
					label: 'Lire le guide complet (en anglais)'
				}
			}
		]
	}
];
