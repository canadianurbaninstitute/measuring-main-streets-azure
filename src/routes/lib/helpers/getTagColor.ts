// French tag labels (see lib/ui/tagLabels.js, reports/components/reportTags.js) are matched too.
const getTagColor = (tag: string) => {
	const text = tag.toLowerCase();
	if (text.includes('mapping') || text.includes('cartographie')) return 'var(--brandPink)';
	if (text.includes('resilience') || text.includes('résilience')) return 'var(--brandBlue)';
	if (text.includes('report') || text.includes('rapport')) return 'var(--color-blue-800)';
	if (text.includes('tod')) return 'var(--brandDarkGreen)';
	if (text.includes('graphing') || text.includes('graphique')) return 'var(--brandOrange)';
	if (text.includes('case study') || text.includes('étude de cas')) return 'var(--color-green-500)';
	if (text.includes('qualitative') || text.includes('qualitati')) return 'var(--brandPurple)';
	if (text.includes('school of cities')) return 'var(--color-pink-500)';
	if (text.includes('infrastructure institute')) return 'var(--color-pink-600)';
	if (text.includes('tool') || text.includes('outil')) return 'var(--color-yellow-200)';
	if (text.includes('regional') || text.includes('régional')) return 'var(--color-blue-800)';
	if (text.includes('complete communities') || text.includes('collectivités complètes')) return 'var(--color-green-400)';
	if (text.includes('partner') || text.includes('partenaire')) return 'var(--brandPink)';
	if (text.includes('executive summary') || text.includes('sommaire')) return 'var(--brandLightBlue)';
	if (text.includes('research brief') || text.includes('note de recherche')) return 'var(--color-green-500)';
	if (text.includes('ghg emissions') || text.includes('émissions de ges')) return 'var(--color-green-500)';
	if (text.includes('catch')) return 'var(--color-green-600)';
	if (text.includes('digital public square')) return 'var(--color-blue-500)';
	if (text.includes('equity') || text.includes('équité')) return 'var(--color-orange-500)';
	if (text.includes('mobility') || text.includes('mobilité')) return 'var(--color-yellow-300)';
	if (text.includes('infographic') || text.includes('infographie')) return 'var(--color-purple-500)';
	if (text.includes('ontario')) return 'var(--color-purple-500)';
	if (text.includes('quebec') || text.includes('québec')) return 'var(--color-yellow-300)';
	if (text.includes('development') || text.includes('potentiel de développement')) return 'var(--color-blue-600)';
	if (text.includes('alberta')) return 'var(--color-green-500)';
	if (text.includes('british columbia') || text.includes('colombie-britannique')) return 'var(--color-blue-400)';

	return 'var(--brandLightBlue)';
};

export default getTagColor;
