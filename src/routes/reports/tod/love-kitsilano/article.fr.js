/**
 * article.fr.js - Love Kitsilano Report Data (French)
 */

export const sections = [
	{
		layout: 'scrolly',
		panels: [
			{
				id: 'welcome'
			}
		],
		blocks: [
			{
				panelId: 'welcome',
				heading: 'Que signifie « aimer son quartier »?',
				body: `<p><em>Love Your Neighbourhood</em> est une initiative de consultation publique numérique élaborée par Digital Public Square dans le cadre du projet de l’Initiative de recherche et de connaissances (IRC), dirigé par l’Institut urbain du Canada et financé par Logement, Infrastructures et Collectivités Canada. La plateforme numérique a été conçue pour donner aux membres de la collectivité voix au chapitre dans l’établissement des priorités de leur quartier, tout en les informant sur la densification résidentielle, l’aménagement axé sur le transport collectif et les collectivités complètes. </p>
				<p>Le projet visait à faire connaître ce que les collectivités complètes peuvent offrir, à recueillir l’opinion des personnes résidentes sur les priorités locales et à donner aux gens les moyens de défendre les changements qu’ils souhaitent voir.</p>`
			}
		]
	},
	{
		layout: 'scrolly',
		panels: [
			{
				id: 'kitsilano'
			}
		],
		blocks: [
			{
				panelId: 'kitsilano',
				heading: 'Love Kitsilano',
				body: `<p>La plateforme de Kitsilano invitait les personnes résidant dans ce quartier établi de Vancouver à donner leur point de vue sur les priorités de la collectivité et l’évolution du quartier. Secteur dense et riche en services et commodités, Kitsilano offrait un contexte unique pour explorer la façon dont la population comprend et valorise les principes des collectivités complètes, et ce que la densification résidentielle et l’aménagement axé sur le transport collectif pourraient signifier pour un quartier déjà aux prises avec des pressions liées à la croissance.</p>
				<p>Pour analyser le quartier, nous avons utilisé le traitement automatique du langage naturel, en combinaison avec les données Opticks Numeris d’Environics Analytics et des publications Reddit portant sur Kitsilano et son développement. Digital Public Square a ainsi pu obtenir un portrait global de l’opinion des gens sur la densification à Kitsilano.</p>`
			}
		]
	},
	{
		layout: 'inline',
		panels: [{ id: 'engagement-summary' }],
		blocks: [
			{
				heading: 'Points de vue de la collectivité',
				body: `<p>L’analyse des discussions communautaires a fait ressortir des thèmes clairs quant à la façon dont les personnes résidentes perçoivent l’évolution de leur quartier. Ces résultats mettent en lumière à la fois les points de friction et les valeurs communes qui peuvent orienter le développement futur.</p>`,
				panelId: 'engagement-summary'
			}
		]
	},
	{
		layout: 'scrolly',
		panels: [
			{
				id: 'engagement',
				label: 'Figure 1 – Indicateurs de participation par quartier'
			}
		],
		blocks: [
			{
				panelId: 'engagement',
				heading: 'Point à retenir nº 1 : une forte participation',
				body: `<p>Kitsilano a enregistré les chiffres les plus élevés pour six indicateurs clés de participation, dont le nombre total de
				réponses aux questions, le nombre de personnes ayant répondu à au moins une question, les clics sur les liens vers des services complémentaires et le nombre de personnes ayant accepté de communiquer leur code postal. C’est aussi à Kitsilano que la participation au sondage communautaire a été la plus forte.</p>`
			}
		]
	},
	{
		layout: 'scrolly',
		panels: [
			{
				id: 'walking',
				label: 'Figure 2 – Préférences en matière de déplacements'
			}
		],
		blocks: [
			{
				panelId: 'walking',
				heading: 'Point à retenir nº 2 : une forte préférence pour la marche',
				body: `<p>Kitsilano est le seul quartier où la préférence pour
				la marche était élevée pour l’ensemble des activités.</p>
				<p>
				L’automobile demeure toutefois très prisée : 33,8 % des personnes répondantes l’utilisent pour leurs déplacements quotidiens.
				Les gens sont plus susceptibles de prendre l’autobus pour se rendre au travail ou à l’école, de se déplacer à vélo pour se rendre à
				leur activité préférée et de marcher pour aller à l’épicerie.</p>`
			}
		]
	},
	{
		layout: 'scrolly',
		panels: [
			{
				id: 'privacy',
				label: 'Figure 3 – Préférences en matière d’intimité'
			}
		],
		blocks: [
			{
				panelId: 'privacy',
				heading: 'Point à retenir nº 3 : l’intimité avant tout',
				body: `<p>Bien que quatre des sept catégories de compromis aient recueilli
				une plus grande proportion de réponses favorables à
				la densification — comme la taille des logements, des rues
				principales dynamiques, les trottoirs, les traverses et les pistes cyclables —,
				on observe une forte préférence pour moins de
				voisins et plus d’intimité.
				Ce constat concorde avec les données qualitatives recueillies au moyen du
				sondage communautaire et de la recherche sur les personas, ce qui
				souligne davantage la tension entourant la construction de nouveaux logements
				à Kitsilano.</p>`
			}
		]
	},
	{
		layout: 'scrolly',
		panels: [
			{
				id: 'everyone'
			}
		],
		blocks: [
			{
				panelId: 'everyone',
				heading: 'Concevoir une ville pour tout le monde',
				body: `<p>Cette expérience pilote démontre clairement que les outils numériques peuvent être un moyen efficace de joindre les personnes résidentes, notamment pour recueillir des voix qui ne se font généralement pas entendre lors des consultations publiques traditionnelles. L’ajout d’un sondage communautaire à réponses ouvertes, en complément des mesures quantitatives, s’est révélé précieux pour cerner les causes profondes des inquiétudes liées à l’évolution des quartiers et pour montrer que les gens sont prêts à participer de façon constructive en ligne, malgré les nombreuses sollicitations qui se disputent leur attention.</p>
				<p>À l’avenir, il sera possible d’obtenir une participation publique de qualité à plus grande échelle grâce à une période de collecte plus longue, à une utilisation plus efficace de publicités ciblées sur un plus grand nombre de médias sociaux et à l’arrimage de la consultation numérique avec des méthodes traditionnelles, comme les consultations en personne. Toutes ces mesures peuvent contribuer à réduire encore l’écart entre la voix du public et l’action collective sur les enjeux qui comptent le plus pour la population locale.</p>`,
				cta: {
					label: 'Explorer l’outil',
					href: 'https://lovekitsilano.ca/',
					target: '_blank'
				}
			}
		]
	},
	{
		layout: 'inline',
		panels: [
			{
				id: 'polis'
			}
		],
		blocks: [
			{
				panelId: 'polis',
				eyebrow: 'Annexe',
				heading: 'Que dit-on à Kitsilano au sujet de Kitsilano?',
				body: `<p>Digital Public Square a utilisé un outil libre appelé pol.is, qui permet d’analyser rapidement la façon dont les gens parlent du développement à Kitsilano. Découvrez de quoi les gens ont parlé :</p>`
			}
		]
	}
];
