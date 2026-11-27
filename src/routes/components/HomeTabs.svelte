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
	import { getLang } from '../lib/i18n';
	import TabNav from '../lib/ui/TabNav.svelte';

	const fr = getLang() === 'fr';
	const T = (/** @type {string} */ en, /** @type {string} */ frText) => (fr ? frText : en);

	let activeTab = $state('tod');
	const tabs = [
		{ label: T('Transit-Oriented Development', 'Aménagement axé sur le transport collectif'), value: 'tod' },
		{ label: T('Main Street Resilience', 'Résilience des rues principales'), value: 'resilience' }
	];

	const todCards = [
		{
			title: T('Transit Map', 'Carte du transport collectif'),
			description:
				T('Explore the major transit station areas and their relationship to main streets.', 'Explorez les aires de station de transport collectif majeures et leur relation avec les rues principales.'),
			image: transitmap,
			link: '/transit-map',
			featured: true,
			tags: ['mapping', 'tool']
		},
		{
			title: T('Case Studies', 'Études de cas'),
			description: T('In depth place-based studies.', 'Études approfondies axées sur des lieux précis.'),
			image: casestudy,
			link: '/casestudies/?tab=tod',
			tags: ['Case Study']
		},
		{
			title: T('Reports', 'Rapports'),
			description: T('In depth reports on transit-oriented development.', 'Rapports approfondis sur l’aménagement axé sur le transport collectif.'),
			image: reportstsa,
			link: '/reports/tod',
			tags: ['Reports']
		},
		{
			title: T('Tools', 'Outils'),
			description: T('In depth reports on transit-oriented development.', 'Rapports approfondis sur l’aménagement axé sur le transport collectif.'),
			image: urbanform,
			link: '/reports/tod',
			tags: ['Tools']
		}
	];

	const resilienceCards = [
		{
			title: T('Main Street Map', 'Carte des rues principales'),
			description: T('Analyzing neighbourhood-scale data for better city building.', 'Analyser des données à l’échelle des quartiers pour mieux bâtir nos villes.'),
			image: mainstreetmap,
			link: '/map',
			featured: true,
			tags: ['mapping', 'tool']
		},
		{
			title: T('Case Studies', 'Études de cas'),
			description: T('In depth place-based studies.', 'Études approfondies axées sur des lieux précis.'),
			image: casestudy2,
			link: '/casestudies/?tab=msr',
			tags: ['Case Study']
		},
		{
			title: T('Reports', 'Rapports'),
			description: T('In depth reports on main street resilience.', 'Rapports approfondis sur la résilience des rues principales.'),
			image: reports,
			link: '/reports/?tab=msr',
			tags: ['Reports']
		},
		{
			title: T('Tools', 'Outils'),
			description: T('Research and analysis tools.', 'Outils de recherche et d’analyse.'),
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
