<script>
	import Edmonton from '../../lib/assets/boundaries/Edmonton.svg';
	import Montreal from '../../lib/assets/boundaries/Montreal.svg';
	import Toronto from '../../lib/assets/boundaries/Toronto.svg';
	import city from '../../lib/assets/graphics/montreal.jpg';
	import Vancouver from '../../lib/assets/graphics/vancouver-bg.png';
	import { getLang } from '../../lib/i18n';
	import LandingLayout from '../../lib/ui/LandingLayout.svelte';
	import '../../styles.css';

	const fr = getLang() === 'fr';
	const T = (/** @type {string} */ en, /** @type {string} */ frText) => (fr ? frText : en);

	const title = T('Case Studies', 'Études de cas');
	const description = T('Insert School of Cities blurb here.', 'Insérer ici le texte de présentation de la School of Cities.');

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

<style>
</style>
