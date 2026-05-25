<script>
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import Edmonton from '../../lib/assets/boundaries/Edmonton.svg';
	import Montreal from '../../lib/assets/boundaries/Montreal.svg';
	import Toronto from '../../lib/assets/boundaries/Toronto.svg';
	// Assets
	import ii from '../../lib/assets/logos/ii-logo.png';
	import soc from '../../lib/assets/logos/uotsoc_color.png';
	import arbutus from '../../lib/assets/screenshots/case-study-arbutus.png';
	import cooksville from '../../lib/assets/screenshots/case-study-cooksville.png';
	import mckernan from '../../lib/assets/screenshots/case-study-mckernan.png';
	import northfield from '../../lib/assets/screenshots/case-study-northfield.png';
	import panama from '../../lib/assets/screenshots/case-study-panama.png';
	import vancouver from '../../lib/assets/screenshots/vancouver-skyline.jpg';
	import LandingLayout from '../../lib/ui/LandingLayout.svelte';
	import '../../styles.css';

	const title = 'Measuring Main Streets Case Studies';

	const tabs = [
		{
			label: 'TOD on Main',

			value: 'tod',
			description: [
				'<p>Transit-oriented development (TOD) can be a catalyst for growth – but not all growth is created equal. Through five detailed case studies based on real TOD in Canada’s largest urban regions, discover how policy levers, pre-existing infrastructure, and other factors can determine the kind of communities and neighbourhoods that can be created by TOD.</p><p> These case studies were created by the <a href="https://infrastructureinstitute.ca/" target="_blank">Infrastructure Institute</a> at the <a href="https://www.schoolofcities.utoronto.ca/" target="_blank">School of Cities</a> based out of the University of Toronto.</p>'
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
					title: 'Overview',
					logo: [soc, ii],
					description:
						'Background and context on the case studies by the Infrastructure Institute and the School of Cities.',
					image: vancouver,
					link: '/casestudies/tod/overview',
					tags: ['School of Cities', 'Infrastructure Institute']
				},
				{
					title: 'Cooksville Station',
					logo: [soc, ii],
					description: 'Case study by the Infrastructure Institute and the School of Cities.',
					image: cooksville,
					link: '/casestudies/tod/cooksville',
					tags: ['Ontario', 'School of Cities', 'Infrastructure Institute']
				},
				{
					title: 'Panama Station',
					logo: [soc, ii],
					description: 'Case study by the Infrastructure Institute and the School of Cities.',
					image: panama,
					link: '/casestudies/tod/panama',
					tags: ['Quebec', 'School of Cities', 'Infrastructure Institute']
				},
				{
					title: 'McKernan-Belgravia Station',
					logo: [soc, ii],
					description: 'Case study by the Infrastructure Institute and the School of Cities.',
					image: mckernan,
					link: '/casestudies/tod/mckernan-belgravia',
					tags: ['Alberta', 'School of Cities', 'Infrastructure Institute']
				},
				{
					title: 'Northfield Station',
					logo: [soc, ii],
					description: 'Case study by the Infrastructure Institute and the School of Cities.',
					image: northfield,
					link: '/casestudies/tod/northfield',
					tags: ['Ontario', 'School of Cities', 'Infrastructure Institute']
				},
				{
					title: 'Arbutus Station',
					logo: [soc, ii],
					description: 'Case study by the Infrastructure Institute and the School of Cities.',
					image: arbutus,
					link: '/casestudies/tod/arbutus',
					tags: ['British Columbia', 'School of Cities', 'Infrastructure Institute']
				}
			]
		},
		{
			label: 'Resilience on Main',
			value: 'msr',
			description: [
				"<p>How much can data alone tell us about a community and its future? Through sixty main street case studies across three Canadian cities, see first-hand how data from the National Main Street Map can come together to generate a snapshot of a neighborhood's defining characteristics, vulnerabilities, and key advantages. And for 1/3 of data case studies, see how the story changed through on-the-ground analysis in each community.</p>"
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
