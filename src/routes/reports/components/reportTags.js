// Canadian French labels for the report listing filter tags/categories.
// The English labels stay the source values; translate the whole tab (categories and item tags)
// with the same dictionary so the filter keeps matching.

/** @type {Record<string, string>} */
export const REPORT_TAGS_FR = {
	Mobility: 'Mobilité',
	Equity: 'Équité',
	'GHG Emissions': 'Émissions de GES',
	Infographic: 'Infographie',
	'Complete Communities': 'Collectivités complètes',
	'Development Potential': 'Potentiel de développement',
	'Regional Report': 'Rapport régional',
	'School of Cities': 'School of Cities',
	'Infrastructure Institute': 'Infrastructure Institute',
	'Digital Public Square': 'Digital Public Square',
	CATCH: 'CATCH',
	'Executive Summary': 'Résumé',
	'Research Brief': 'Note de recherche',
	'Partner Report': 'Rapport de partenaire'
};

/**
 * @param {string} tag
 * @param {boolean} fr
 */
export function translateTag(tag, fr) {
	return fr ? (REPORT_TAGS_FR[tag] ?? tag) : tag;
}

/**
 * Translate `categories` and every item's `tags` (strings only).
 * @template {{ tags?: string[] }} I
 * @param {{ categories?: string[], items?: I[] }} group
 * @param {boolean} fr
 */
export function translateTagGroup(group, fr) {
	if (!fr) return group;
	return {
		...group,
		categories: group.categories?.map((c) => translateTag(c, true)),
		items: group.items?.map((item) => ({
			...item,
			tags: item.tags?.map((t) => translateTag(t, true))
		}))
	};
}

/**
 * French card titles and descriptions for the report listings, keyed by the card link.
 * @type {Record<string, { title: string, description: string }>}
 */
export const REPORT_CARDS_FR = {
	'/reports/tod/intro': {
		title: 'Plaidoyer pour l’aménagement axé sur le transport collectif',
		description:
			'Pourquoi vaut-il la peine d’investir dans l’aménagement axé sur le transport collectif, et que faut-il pour en assurer le succès?'
	},
	'/reports/tod/who-lives-in-tsas': {
		title: 'Qui habite dans les aires de station de transport collectif du Canada?',
		description:
			'Un résumé visuel du profil démographique des aires de station de transport collectif partout au Canada.'
	},
	'/reports/tod/walkability': {
		title: 'Rapport sur le potentiel piétonnier',
		description:
			'Une collectivité n’est complète que si elle se parcourt facilement à pied.'
	},
	'/reports/tod/eating-well': {
		title: 'Bien manger',
		description:
			'Favoriser l’accès à des épiceries abordables dans les stations de transport collectif et autour de celles-ci.'
	},
	'/reports/tod/complete-communities': {
		title: 'Du TOD aux TOCC',
		description:
			'L’aménagement axé sur le transport collectif et les collectivités complètes dans le contexte canadien.'
	},
	'/reports/tod/development-potential': {
		title: 'Fort potentiel',
		description:
			'Exploration du potentiel de développement résidentiel dans les aires de station de transport collectif.'
	},
	'/reports/tod/displacement': {
		title: 'Déplacement de population induit par le transport collectif',
		description:
			'Les effets de l’ouverture de nouvelles stations de transport collectif sur les personnes résidentes à faible revenu, à partir d’une recherche sur les tendances de déplacement résidentiel et d’exclusion.'
	},
	'/reports/tod/embodied-carbon': {
		title: 'Émissions de GES intrinsèques',
		description:
			'Recherche qui quantifie l’influence des décisions d’aménagement sur les émissions de GES intrinsèques des projets proposés, dans cinq scénarios d’études de cas canadiennes.'
	},
	'/reports/tod/decarbonizing': {
		title: 'Décarboner les transports',
		description:
			'Examine si l’orientation de la croissance vers les secteurs bien desservis par le transport collectif réduit de façon significative les déplacements en véhicule et les émissions.'
	},
	'/reports/tod/transportation-equity': {
		title: 'Équité en matière de transport',
		description:
			'Recherche sur les effets du TOD sur deux indicateurs clés\u00a0: l’équité en matière de transport et le transfert modal vers des modes durables.'
	},
	'/reports/tod/intensification-equity': {
		title: 'Suivre l’évolution des quartiers',
		description:
			'Examine si les secteurs de TOD favorisent l’abordabilité grâce à une hausse de la construction de logements.'
	},
	'/reports/tod/fiscal-impacts': {
		title: 'Retombées fiscales du TOD',
		description:
			'Examine si le TOD génère des revenus nets ou des coûts nets pour les administrations municipales.'
	},
	'/reports/tod/golden-mile': {
		title: 'Rez-de-chaussée',
		description:
			'Une étude de cas du Golden Mile de Scarborough préparée par des étudiantes et étudiants de quatrième année au baccalauréat de l’Université de Toronto.'
	},
	'/reports/tod/love-northfield': {
		title: 'Love Northfield',
		description:
			'La plateforme Love Your Neighbourhood de Northfield a invité les personnes résidentes à donner leur point de vue sur les priorités de la collectivité et l’évolution du quartier.'
	},
	'/reports/tod/love-kitsilano': {
		title: 'Love Kitsilano',
		description:
			'La plateforme Love Your Neighbourhood de Kitsilano a invité les personnes résidentes à donner leur point de vue sur les priorités de la collectivité et l’évolution du quartier.'
	},
	'/reports/tod/love-cooksville': {
		title: 'Love Cooksville',
		description:
			'La plateforme Love Your Neighbourhood de Cooksville a invité les personnes résidentes à donner leur point de vue sur les priorités de la collectivité et l’évolution du quartier.'
	},
	'/reports/tod/digital-public-engagement': {
		title: 'Consultation publique numérique',
		description:
			'Exploration du potentiel des initiatives numériques pour la consultation publique.'
	},
	'/reports/tod/catch': {
		title: 'Le transport collectif sans déplacement de population',
		description:
			'Comment les collectivités peuvent faire en sorte que l’aménagement axé sur le transport collectif profite à tout le monde.'
	},
	'/reports/executive-summary': {
		title: 'Résumé\u00a0: Mesures des rues principales',
		description:
			'Découvrez le projet et la plateforme Mesures des rues principales.'
	},
	'/reports/mainstreets-malls-mice': {
		title: 'Rues principales, centres commerciaux et souris',
		description:
			'Trajectoires des rues principales, des centres commerciaux et des comportements en ligne.'
	},
	'/reports/mainstreet-resiliency': {
		title: 'Résilience des rues principales',
		description:
			'Analyse de la résilience des rues principales à partir de la fréquentation pendant la pandémie.'
	},
	'/reports/mainstreets-infrastructure-equity': {
		title: 'Équité des infrastructures et rues principales',
		description:
			'Cerner les lacunes en matière d’équité dans l’infrastructure civique des rues principales.'
	},
	'https://canurb.org/wp-content/uploads/Data-Driven-Approaches-to-Main-Street-Challenges.pdf': {
		title: 'Nord Ouvert\u00a0: approches axées sur les données',
		description:
			'Planifier des projets de données et de technologie pour soutenir des investissements judicieux dans l’infrastructure civique (en anglais).'
	},
	'/reports/toronto': {
		title: 'Rapport régional de Toronto',
		description:
			'Analyse régionale de l’Ontario fondée sur soixante études de cas.'
	},
	'/reports/montreal': {
		title: 'Rapport régional de Montréal',
		description:
			'Analyse régionale du Québec fondée sur soixante études de cas.'
	},
	'/reports/edmonton': {
		title: 'Rapport régional d’Edmonton',
		description:
			'Analyse régionale de l’Alberta fondée sur soixante études de cas.'
	},
};

/**
 * Translate a report listing (`categories`, and each item's `tags`, `title` and `description`).
 * @template {{ tags?: string[], link?: string, title: string, description: string }} I
 * @template {{ categories?: string[], items?: I[] }} G
 * @param {G} group
 * @param {boolean} fr
 * @returns {G}
 */
export function translateReportListing(group, fr) {
	if (!fr) return group;
	const g = translateTagGroup(group, true);
	return {
		...g,
		items: g.items?.map((item) => ({ ...item, ...(REPORT_CARDS_FR[item.link ?? ''] ?? {}) }))
	};
}
