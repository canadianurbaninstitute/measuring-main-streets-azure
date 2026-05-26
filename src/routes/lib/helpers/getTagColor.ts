const getTagColor = (tag: string) => {
	const text = tag.toLowerCase();
	if (text.includes('mapping')) return 'var(--brandPink)';
	if (text.includes('resilience')) return 'var(--brandBlue)';
	if (text.includes('report')) return 'var(--color-blue-800)';
	if (text.includes('tod')) return 'var(--brandDarkGreen)';
	if (text.includes('graphing')) return 'var(--brandOrange)';
	if (text.includes('case study')) return 'var(--color-green-500)';
	if (text.includes('qualitative')) return 'var(--brandPurple)';
	if (text.includes('school of cities')) return 'var(--color-pink-500)';
	if (text.includes('infrastructure institute')) return 'var(--color-pink-600)';
	if (text.includes('tool')) return 'var(--color-yellow-200)';
	if (text.includes('regional')) return 'var(--color-blue-800)';
	if (text.includes('complete communities')) return 'var(--color-green-400)';
	if (text.includes('partner')) return 'var(--brandPink)';
	if (text.includes('executive summary')) return 'var(--brandLightBlue)';
	if (text.includes('research brief')) return 'var(--color-green-500)';
	if (text.includes('ghg emissions')) return 'var(--color-green-500)';
	if (text.includes('catch')) return 'var(--color-green-600)';
	if (text.includes('digital public square')) return 'var(--color-blue-500)';
	if (text.includes('equity')) return 'var(--color-orange-500)';
	if (text.includes('mobility')) return 'var(--color-yellow-300)';
	if (text.includes('infographic')) return 'var(--color-purple-500)';
	if (text.includes('ontario')) return 'var(--color-purple-500)';
	if (text.includes('quebec')) return 'var(--color-yellow-300)';
	if (text.includes('development')) return 'var(--color-blue-600)';
	if (text.includes('alberta')) return 'var(--color-green-500)';
	if (text.includes('british columbia')) return 'var(--color-blue-400)';

	return 'var(--brandLightBlue)';
};

export default getTagColor;
