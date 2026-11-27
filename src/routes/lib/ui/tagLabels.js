// Canadian French display labels for card tags and filter categories (LandingCard, LandingLayout,
// FeaturedCard). Tags stay in English in the data because they are also used as lookup keys
// (colours in `getTagColor`, the `?tag=` URL parameter, filtering); translate only at display time.

/** @type {Record<string, string>} */
export const TAGS_FR = {
	All: 'Tous',
	Featured: 'En vedette',
	'Case Study': 'Étude de cas',
	'Resilience on Main': 'Résilience sur la rue principale',
	'TOD on Main': 'TOD sur la rue principale',
	'Regional Report': 'Rapport régional',
	'Research Brief': 'Note de recherche',
	'Executive Summary': 'Résumé',
	'Partner Report': 'Rapport de partenaire',
	'Partner Tools': 'Outils des partenaires',
	Reports: 'Rapports',
	Tools: 'Outils',
	tool: 'outil',
	Tool: 'Outil',
	Mapping: 'Cartographie',
	mapping: 'cartographie',
	Graphing: 'Graphiques',
	Qualitative: 'Qualitatif',
	Equity: 'Équité',
	'Complete Communities': 'Collectivités complètes',
	Mobility: 'Mobilité',
	'GHG Emissions': 'Émissions de GES',
	Infographic: 'Infographie',
	'Development Potential': 'Potentiel de développement',
	Quebec: 'Québec',
	'British Columbia': 'Colombie-Britannique'
};

/**
 * Display label for a tag or category.
 * @param {string} tag
 * @param {boolean} fr
 */
export function tagLabel(tag, fr) {
	return fr ? (TAGS_FR[tag] ?? tag) : tag;
}
