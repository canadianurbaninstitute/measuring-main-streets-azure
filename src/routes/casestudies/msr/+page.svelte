<script>
	import Edmonton from '../../lib/assets/boundaries/Edmonton.svg';
	import Montreal from '../../lib/assets/boundaries/Montreal.svg';
	import Toronto from '../../lib/assets/boundaries/Toronto.svg';
	import { getLang } from '../../lib/i18n';
	import LandingLayout from '../../lib/ui/LandingLayout.svelte';
	import '../../styles.css';

	const fr = getLang() === 'fr';
	const T = (/** @type {string} */ en, /** @type {string} */ frText) => (fr ? frText : en);

	const title = T('Case Studies', 'Études de cas');
	const description =
		T('Discover how infrastructure paints a picture of a community through sixty main streets case studies across three Canadian cities. Explore the built form, civic infrastructure, business profile, employment profile, housing, local characteristics, and visitor patterns to get a unique snapshot of how these factors interplay at the neighbourhood scale to influence community outcomes.', 'Découvrez comment les infrastructures dressent le portrait d’une collectivité à travers soixante études de cas de rues principales dans trois villes canadiennes. Explorez le cadre bâti, l’infrastructure civique, le profil des commerces, le profil de l’emploi, le logement, les caractéristiques locales et les habitudes des visiteurs pour obtenir un aperçu unique de la façon dont ces facteurs interagissent à l’échelle du quartier pour influer sur le devenir des collectivités.');

	const categories = ['Ontario', 'Quebec', 'Alberta'];

	const items = [
		{
			title: 'Toronto',
			description:
				T('Explore 20 case studies in the Greater Toronto Area, from downtown cores to small towns.', 'Explorez 20 études de cas dans la région du Grand Toronto, des centres-villes aux petites villes.'),
			image: Toronto,
			link: '/casestudies/toronto/',
			tags: ['Ontario', 'Case Study']
		},
		{
			title: T('Montreal', 'Montréal'),
			description:
				T('Explore 20 case studies in the Montreal region, highlighting unique cultural and infrastructure patterns.', 'Explorez 20 études de cas dans la région de Montréal, qui mettent en lumière des caractéristiques culturelles et d’infrastructure uniques.'),
			image: Montreal,
			link: '/casestudies/montreal/',
			tags: ['Quebec', 'Case Study']
		},
		{
			title: 'Edmonton',
			description:
				T('Explore 20 case studies in the Edmonton region, focusing on resilience and community growth.', 'Explorez 20 études de cas dans la région d’Edmonton, axées sur la résilience et la croissance des collectivités.'),
			image: Edmonton,
			link: '/casestudies/edmonton/',
			tags: ['Alberta', 'Case Study']
		}
	];
</script>

<main>
	<LandingLayout {title} {description} {items} {categories} />
</main>
