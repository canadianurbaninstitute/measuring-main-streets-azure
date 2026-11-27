<script>
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import Edmonton from '../lib/assets/boundaries/Edmonton.svg';
	import Montreal from '../lib/assets/boundaries/Montreal.svg';
	import Toronto from '../lib/assets/boundaries/Toronto.svg';
	// Assets
	import ii from '../lib/assets/logos/ii-logo.png';
	import soc from '../lib/assets/logos/uotsoc_color.png';
	import arbutus from '../lib/assets/screenshots/case-study-arbutus.png';
	import cooksville from '../lib/assets/screenshots/case-study-cooksville.png';
	import mckernan from '../lib/assets/screenshots/case-study-mckernan.png';
	import northfield from '../lib/assets/screenshots/case-study-northfield.png';
	import panama from '../lib/assets/screenshots/case-study-panama.png';
	import vancouver from '../lib/assets/screenshots/vancouver-skyline.jpg';
	import { getLang } from '../lib/i18n';
	import LandingLayout from '../lib/ui/LandingLayout.svelte';
	import '../styles.css';

	const fr = getLang() === 'fr';
	const T = (/** @type {string} */ en, /** @type {string} */ frText) => (fr ? frText : en);

	const title = T('Measuring Main Streets Case Studies', 'Études de cas de Mesures des rues principales');

	const tabs = [
		{
			label: T('TOD on Main', 'TOD sur la rue principale'),

			value: 'tod',
			description: [
				T('<p>Transit-oriented development (TOD) can be a catalyst for growth – but not all growth is created equal. Through five detailed case studies based on real TOD in Canada’s largest urban regions, discover how policy levers, pre-existing infrastructure, and other factors can determine the kind of communities and neighbourhoods that can be created by TOD.</p><p> These case studies were created by the <a href="https://infrastructureinstitute.ca/" target="_blank">Infrastructure Institute</a> at the <a href="https://www.schoolofcities.utoronto.ca/" target="_blank">School of Cities</a> based out of the University of Toronto.</p>', '<p>L’aménagement axé sur le transport collectif (TOD) peut être un catalyseur de croissance, mais toutes les formes de croissance ne se valent pas. À travers cinq études de cas détaillées portant sur des TOD réels dans les plus grandes régions urbaines du Canada, découvrez comment les leviers politiques, les infrastructures existantes et d’autres facteurs peuvent déterminer le type de collectivités et de quartiers que les TOD permettent de créer.</p><p> Ces études de cas ont été réalisées par l’<a href="https://infrastructureinstitute.ca/" target="_blank">Infrastructure Institute</a> de la <a href="https://www.schoolofcities.utoronto.ca/" target="_blank">School of Cities</a> de l’Université de Toronto.</p>')
			],
			categories: [
				'Ontario',
				'Quebec',
				'Alberta',
				'British Columbia',
				'School of Cities',
				'Infrastructure Institute'
			],
			items: [
				{
					title: T('Overview', 'Vue d’ensemble'),
					logo: [soc, ii],
					description:
						T('Background and context on the case studies by the Infrastructure Institute and the School of Cities.', 'Contexte des études de cas réalisées par l’Infrastructure Institute et la School of Cities.'),
					image: vancouver,
					link: '/casestudies/tod/overview',
					tags: ['School of Cities', 'Infrastructure Institute']
				},
				{
					title: T('Cooksville Station', 'Station Cooksville'),
					logo: [soc, ii],
					description: T('Case study by the Infrastructure Institute and the School of Cities.', 'Étude de cas réalisée par l’Infrastructure Institute et la School of Cities.'),
					image: cooksville,
					link: '/casestudies/tod/cooksville',
					tags: ['Ontario', 'School of Cities', 'Infrastructure Institute']
				},
				{
					title: T('Panama Station', 'Station Panama'),
					logo: [soc, ii],
					description: T('Case study by the Infrastructure Institute and the School of Cities.', 'Étude de cas réalisée par l’Infrastructure Institute et la School of Cities.'),
					image: panama,
					link: '/casestudies/tod/panama',
					tags: ['Quebec', 'School of Cities', 'Infrastructure Institute']
				},
				{
					title: T('McKernan-Belgravia Station', 'Station McKernan-Belgravia'),
					logo: [soc, ii],
					description: T('Case study by the Infrastructure Institute and the School of Cities.', 'Étude de cas réalisée par l’Infrastructure Institute et la School of Cities.'),
					image: mckernan,
					link: '/casestudies/tod/mckernan-belgravia',
					tags: ['Alberta', 'School of Cities', 'Infrastructure Institute']
				},
				{
					title: T('Northfield Station', 'Station Northfield'),
					logo: [soc, ii],
					description: T('Case study by the Infrastructure Institute and the School of Cities.', 'Étude de cas réalisée par l’Infrastructure Institute et la School of Cities.'),
					image: northfield,
					link: '/casestudies/tod/northfield',
					tags: ['Ontario', 'School of Cities', 'Infrastructure Institute']
				},
				{
					title: T('Arbutus Station', 'Station Arbutus'),
					logo: [soc, ii],
					description: T('Case study by the Infrastructure Institute and the School of Cities.', 'Étude de cas réalisée par l’Infrastructure Institute et la School of Cities.'),
					image: arbutus,
					link: '/casestudies/tod/arbutus',
					tags: ['British Columbia', 'School of Cities', 'Infrastructure Institute']
				}
			]
		},
		{
			label: T('Resilience on Main', 'Résilience sur la rue principale'),
			value: 'msr',
			description: [
				T("<p>How much can data alone tell us about a community and its future? Through sixty main street case studies across three Canadian cities, see first-hand how data from the National Main Street Map can come together to generate a snapshot of a neighborhood's defining characteristics, vulnerabilities, and key advantages. And for 1/3 of data case studies, see how the story changed through on-the-ground analysis in each community.</p>", '<p>Que peuvent nous apprendre les données à elles seules sur une collectivité et son avenir? À travers soixante études de cas de rues principales dans trois villes canadiennes, voyez comment les données de la Carte nationale des rues principales peuvent se combiner pour dresser un portrait des caractéristiques déterminantes, des vulnérabilités et des principaux atouts d’un quartier. Et pour le tiers de ces études de cas, voyez comment le portrait a changé grâce à une analyse sur le terrain dans chaque collectivité.</p>')
			],
			categories: ['Ontario', 'Quebec', 'Alberta'],
			items: [
				{
					title: 'Toronto',
					description:
						T('Explore 20 case studies in the Greater Toronto Area, from downtown cores to small towns.', 'Explorez 20 études de cas dans la région du Grand Toronto, des centres-villes aux petites villes.'),
					image: Toronto,
					link: '/casestudies/toronto/',
					tags: ['Ontario']
				},
				{
					title: T('Montreal', 'Montréal'),
					description:
						T('Explore 20 case studies in the Montreal region, highlighting unique cultural and infrastructure patterns.', 'Explorez 20 études de cas dans la région de Montréal, qui mettent en lumière des caractéristiques culturelles et d’infrastructure uniques.'),
					image: Montreal,
					link: '/casestudies/montreal/',
					tags: ['Quebec']
				},
				{
					title: 'Edmonton',
					description:
						T('Explore 20 case studies in the Edmonton region, focusing on resilience and community growth.', 'Explorez 20 études de cas dans la région d’Edmonton, axées sur la résilience et la croissance des collectivités.'),
					image: Edmonton,
					link: '/casestudies/edmonton/',
					tags: ['Alberta']
				}
			]
		}
	];

	let activeTab = $state('tod');

	onMount(() => {
		activeTab = page.url.searchParams.get('tab') || 'tod';
	});
</script>

<main>
	<LandingLayout {title} {tabs} bind:activeTab syncUrl />
</main>
