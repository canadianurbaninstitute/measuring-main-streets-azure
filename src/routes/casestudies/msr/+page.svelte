<script>
	import Edmonton from '../../lib/assets/boundaries/Edmonton.svg';
	import Montreal from '../../lib/assets/boundaries/Montreal.svg';
	import Toronto from '../../lib/assets/boundaries/Toronto.svg';
	import LandingLayout from '../../lib/ui/LandingLayout.svelte';
	import ModernFooter from '../../lib/ui/ModernFooter.svelte';
	import '../../styles.css';

	const title = 'Case Studies';
	const description =
		'Discover how infrastructure paints a picture of a community through sixty main streets case studies across three Canadian cities. Explore the built form, civic infrastructure, business profile, employment profile, housing, local characteristics, and visitor patterns to get a unique snapshot of how these factors interplay at the neighbourhood scale to influence community outcomes.';

	const categories = ['Ontario', 'Quebec', 'Alberta'];

	const items = [
		{
			title: 'Toronto',
			description:
				'Explore 20 case studies in the Greater Toronto Area, from downtown cores to small towns.',
			image: Toronto,
			link: '/casestudies/toronto/',
			tags: ['Ontario', 'Case Study']
		},
		{
			title: 'Montreal',
			description:
				'Explore 20 case studies in the Montreal region, highlighting unique cultural and infrastructure patterns.',
			image: Montreal,
			link: '/casestudies/montreal/',
			tags: ['Quebec', 'Case Study']
		},
		{
			title: 'Edmonton',
			description:
				'Explore 20 case studies in the Edmonton region, focusing on resilience and community growth.',
			image: Edmonton,
			link: '/casestudies/edmonton/',
			tags: ['Alberta', 'Case Study']
		}
	];
</script>

<main>
	<LandingLayout {title} {description} {items} {categories} />
</main>

<ModernFooter />

<style>
	.collage-section {
		width: 100%;
		margin-top: 4rem;
	}
	.collage-img {
		width: 100%;
		display: block;
	}
</style>
