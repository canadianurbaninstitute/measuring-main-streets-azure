<script>
	import Edmonton from '../../lib/assets/boundaries/Edmonton.svg';
	import Montreal from '../../lib/assets/boundaries/Montreal.svg';
	import Toronto from '../../lib/assets/boundaries/Toronto.svg';
	import city from '../../lib/assets/graphics/montreal.jpg';
	import Vancouver from '../../lib/assets/graphics/vancouver-bg.png';
	import LandingLayout from '../../lib/ui/LandingLayout.svelte';
	import ModernFooter from '../../lib/ui/ModernFooter.svelte';
	import '../../styles.css';

	const title = 'Case Studies';
	const description = 'Insert School of Cities blurb here.';

	// const categories = ['Ontario', 'Quebec', 'Alberta'];

	const items = [
		{
			title: 'Cooksville',
			description: 'Description',
			image: Toronto,
			link: '/casestudies/tod/cooksville'
		},
		{
			title: 'Panama',
			description: 'Description',
			image: Montreal,
			link: '/casestudies/tod/panama'
		},
		{
			title: 'McKernan/Belgravia',
			description: 'Description',
			image: Edmonton,
			link: '/casestudies/tod/mckernan-belgravia'
		},
		{
			title: 'Northfield',
			description: 'Description',
			image: city,
			link: '/casestudies/tod/northfield'
		},
		{
			title: 'Arbutus',
			description: 'Description',
			image: Vancouver,
			link: '/casestudies/tod/arbutus'
		}
	];
</script>

<main>
	<LandingLayout {title} {description} {items} />
</main>

<ModernFooter />

<style>
</style>
