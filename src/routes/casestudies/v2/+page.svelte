<script>
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import Edmonton from '../../lib/assets/boundaries/Edmonton.svg';
	import Montreal from '../../lib/assets/boundaries/Montreal.svg';
	import Toronto from '../../lib/assets/boundaries/Toronto.svg';
	// Assets
	import arbutus from '../../lib/assets/screenshots/case-study-arbutus.png';
	import cooksville from '../../lib/assets/screenshots/case-study-cooksville.png';
	import mckernan from '../../lib/assets/screenshots/case-study-mckernan.png';
	import northfield from '../../lib/assets/screenshots/case-study-northfield.png';
	import panama from '../../lib/assets/screenshots/case-study-panama.png';
	import LandingLayout from '../../lib/ui/LandingLayout.svelte';
	import '../../styles.css';

	const title = 'Measuring Main Streets Case Studies';

	const tabs = [
		{
			label: 'TOD on Main',
			value: 'tod',
			description: [
				'Transit-Oriented Development (TOD) can be a catalyst for growth – but not all growth is created equal. Through five detailed case studies based on real TOD in Canada’s largest urban regions, discover how policy levers, pre-existing infrastructure, and other factors can determine the kind of communities and neighborhoods that can be created by TOD. These case studies were created by the Infrastructure Institute at the School of Cities based out of the University of Toronto.'
			],
			categories: ['Ontario', 'Quebec', 'Alberta', 'British Columbia'],
			items: [
				{
					title: 'Cooksville Station',
					description: 'Case study by School of Cities.',
					image: cooksville,
					link: '/casestudies/tod/cooksville',
					tags: ['Ontario', 'Partner Study']
				},
				{
					title: 'Panama Station',
					description: 'Case study by School of Cities.',
					image: panama,
					link: '/casestudies/tod/panama',
					tags: ['Quebec', 'Partner Study']
				},
				{
					title: 'McKernan/Belgravia Station',
					description: 'Case study by School of Cities.',
					image: mckernan,
					link: '/casestudies/tod/mckernan-belgravia',
					tags: ['Alberta', 'Partner Study']
				},
				{
					title: 'Northfield Station',
					description: 'Case study by School of Cities.',
					image: northfield,
					link: '/casestudies/tod/northfield',
					tags: ['Ontario', 'Partner Study']
				},
				{
					title: 'Arbutus Station',
					description: 'Case study by School of Cities.',
					image: arbutus,
					link: '/casestudies/tod/arbutus',
					tags: ['British Columbia', 'Partner Study']
				}
			]
		},
		{
			label: 'Resilience on Main',
			value: 'msr',
			description: [
				"How much can data alone tell us about a community and its future? Through sixty main street case studies across three Canadian cities, see first-hand how data from the National Main Street Map can come together to generate a snapshot of a neighborhood's defining characteristics, vulnerabilities, and key advantages. And for 1/3 of data case studies, see how the story changed through on-the-ground analysis in each community."
			],
			categories: ['Ontario', 'Quebec', 'Alberta'],
			items: [
				{
					title: 'Toronto',
					description:
						'Explore 20 case studies in the Greater Toronto Area, from downtown cores to small towns.',
					image: Toronto,
					link: '/casestudies/toronto/',
					tags: ['Ontario']
				},
				{
					title: 'Montreal',
					description:
						'Explore 20 case studies in the Montreal region, highlighting unique cultural and infrastructure patterns.',
					image: Montreal,
					link: '/casestudies/montreal/',
					tags: ['Quebec']
				},
				{
					title: 'Edmonton',
					description:
						'Explore 20 case studies in the Edmonton region, focusing on resilience and community growth.',
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
