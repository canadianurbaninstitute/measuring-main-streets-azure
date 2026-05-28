<script>
	import LandingCard from '../lib/ui/LandingCard.svelte';
	// Import local assets
	import casestudy from '../lib/assets/screenshots/case-study-arbutus.png';
	import casestudy2 from '../lib/assets/screenshots/case-study.png';
	import dot from '../lib/assets/screenshots/dot.png';
	import reports from '../lib/assets/screenshots/key-findings.png';
	import mainstreetmap from '../lib/assets/screenshots/main-street-map.png';
	import transitmap from '../lib/assets/screenshots/transit-map.png';
	import urbanform from '../lib/assets/screenshots/urban-form.png';
	import reportstsa from '../lib/assets/screenshots/who-tsas.png';
	import TabNav from '../lib/ui/TabNav.svelte';

	let activeTab = $state('tod');
	const tabs = [
		{ label: 'Transit-Oriented Development', value: 'tod' },
		{ label: 'Main Street Resilience', value: 'resilience' }
	];

	const todCards = [
		{
			title: 'Transit Map',
			description:
				'Explore the major transit station areas and their relationship to main streets.',
			image: transitmap,
			link: '/transit-map',
			featured: true,
			tags: ['mapping', 'tool']
		},
		{
			title: 'Case Studies',
			description: 'In depth place-based studies.',
			image: casestudy,
			link: '/casestudies/?tab=tod',
			tags: ['Case Study']
		},
		{
			title: 'Reports',
			description: 'In depth reports on transit-oriented development.',
			image: reportstsa,
			link: '/reports/tod',
			tags: ['Reports']
		},
		{
			title: 'Tools',
			description: 'In depth reports on transit-oriented development.',
			image: urbanform,
			link: '/reports/tod',
			tags: ['Tools']
		}
	];

	const resilienceCards = [
		{
			title: 'Main Street Map',
			description: 'Analyzing neighbourhood-scale data for better city building.',
			image: mainstreetmap,
			link: '/map',
			featured: true,
			tags: ['mapping', 'tool']
		},
		{
			title: 'Case Studies',
			description: 'In depth place-based studies.',
			image: casestudy2,
			link: '/casestudies/?tab=msr',
			tags: ['Case Study']
		},
		{
			title: 'Reports',
			description: 'In depth reports on main street resilience.',
			image: reports,
			link: '/reports/?tab=msr',
			tags: ['Reports']
		},
		{
			title: 'Tools',
			description: 'Research and analysis tools.',
			image: dot,
			link: '/tools/',
			tags: ['Tools']
		}
	];
</script>

<TabNav {tabs} bind:activeTab bg="blue-800">
	{#snippet children({ activeTab: tab })}
		<div class="flex flex-nowrap gap-6">
			{#each tab === 'tod' ? todCards : resilienceCards as card}
				<LandingCard {...card} minWidth={400} />
			{/each}
		</div>
	{/snippet}
</TabNav>

<style>
</style>
