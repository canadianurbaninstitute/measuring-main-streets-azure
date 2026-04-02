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
	import ModernFooter from '../../lib/ui/ModernFooter.svelte';
	import '../../styles.css';

	const title = 'Measuring Main Streets Case Studies';

	const tabs = [
		{
			label: 'Transit Oriented Development',
			value: 'tod',
			description: [
				'Discover how transit-oriented development create complete communities through five detailed case studies in Canada’s largest urban regions. Explore the infrastructure, policy, and development patterns that shape transit-oriented communities at the neighbourhood scale.'
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
			label: 'Main Street Resiliency',
			value: 'msr',
			description: [
				'Discover how infrastructure paints a picture of a community through sixty main streets case studies across three Canadian cities. Explore the built form, civic infrastructure, business profile, employment profile, housing, local characteristics, and visitor patterns to get a unique snapshot of how these factors interplay at the neighbourhood scale to influence community outcomes.'
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

<ModernFooter />
