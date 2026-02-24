<script>
	import { Tabs } from 'bits-ui';
	import LandingCard from '../../lib/ui/LandingCard.svelte';
	// Import local assets
	import casestudy from '../../lib/assets/screenshots/case-study-main-street.png';
	import civic from '../../lib/assets/screenshots/civic-infrastructure.png';
	import completecommunities from '../../lib/assets/screenshots/complete-communities.png';
	import housing from '../../lib/assets/screenshots/housing-dot-density.png';
	import reports from '../../lib/assets/screenshots/key-findings.png';
	import mainstreetmap from '../../lib/assets/screenshots/main-street-map.png';
	import recovery from '../../lib/assets/screenshots/main-street-recovery.png';
	import transitchart from '../../lib/assets/screenshots/transit-chart.png';
	import transitmap from '../../lib/assets/screenshots/transit-map.png';
	import urbanform from '../../lib/assets/screenshots/urban-form.png';
	import walkability from '../../lib/assets/screenshots/walkability.png';

	let activeTab = 'tod';

	const todCards = [
		{
			title: 'Transit Map',
			description:
				'Explore the major transit station areas and their relationship to main streets.',
			image: transitmap,
			link: '/transit-map',
			tags: ['mapping', 'tool']
		},
		{
			title: 'Transit Charts',
			description: 'Compare key data for each stop along a selected transit line.',
			image: transitchart,
			link: '/tools/transit-charts',
			tags: ['tool']
		},
		{
			title: 'Complete Communities',
			description: 'Explore presence of and access to key amenities.',
			image: completecommunities,
			link: '/tools/complete-communities',
			tags: ['mapping', 'tool']
		},
		{
			title: 'Urban Form Comparison',
			description: 'Compare urban form characteristics between transit station areas.',
			image: urbanform,
			link: '/tools/urban-form-comparison',
			tags: ['tool']
		},
		{
			title: 'Case Studies',
			description: 'In depth place-based studies.',
			image: walkability,
			link: '/case-studies/tod',
			tags: ['Case Study']
		},
		{
			title: 'Reports',
			description: 'In depth reports on transit oriented development.',
			image: reports,
			link: '/reports/tod',
			tags: ['Report']
		}
	];

	const resilienceCards = [
		{
			title: 'Main Street Map',
			description: 'Analyzing neighbourhood-scale data for better city building.',
			image: mainstreetmap,
			link: '/map',
			tags: ['mapping', 'tool']
		},
		{
			title: 'Visitor Recovery',
			description: 'This graphing tool highlights the visitor recovery patterns from 2020 to 2022.',
			image: recovery,
			link: '/tools/mainstreet-visitor-recovery',
			tags: ['tool']
		},
		{
			title: 'Civic Infrastructure Provision',
			description: 'Relative provision of civic infrastructure by neighbourhood.',
			image: civic,
			link: '/tools/civic-infrastructure-provision-map',
			tags: ['mapping', 'tool']
		},
		{
			title: 'Housing Dot Density',
			description:
				'Choropleth dot mapping tool highlights housing built in Canada over the course of the past 60 years',
			image: housing,
			link: '/tools/housing-density-map',
			tags: ['mapping', 'tool']
		},
		{
			title: 'Case Studies',
			description: 'In depth place-based studies.',
			image: casestudy,
			link: '/case-studies/tod',
			tags: ['Case Study']
		},
		{
			title: 'Reports',
			description: 'In depth reports on transit oriented development.',
			image: reports,
			link: '/reports/tod',
			tags: ['Report']
		}
	];
</script>

<Tabs.Root bind:value={activeTab} class="tabs-root">
	<Tabs.List class="tabs-list">
		<Tabs.Trigger value="tod" class="tab-trigger tod-trigger shadow-md">
			Transit Oriented Development
		</Tabs.Trigger>
		<Tabs.Trigger value="resilience" class="tab-trigger resilience-trigger">
			Main Street Resilience
		</Tabs.Trigger>
	</Tabs.List>

	<div class="tabs-container">
		<Tabs.Content value="tod" class="tab-content">
			<div class="flex flex-nowrap gap-4">
				{#each todCards as card}
					<LandingCard {...card} />
				{/each}
			</div>
		</Tabs.Content>

		<Tabs.Content value="resilience" class="tab-content">
			<div class="flex flex-nowrap gap-4">
				{#each resilienceCards as card}
					<LandingCard {...card} />
				{/each}
			</div>
		</Tabs.Content>
	</div>
</Tabs.Root>

<style>
	.tabs-container {
		width: 100%;
		background-color: var(--brandDarkBlue);
		display: flex;
		overflow-x: scroll;
	}

	:global(.tabs-list) {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		width: 100%;
	}

	:global(.tab-trigger) {
		flex: 1;
		font-weight: 600;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
		border-radius: 0.5rem 0.5rem 0 0;
	}

	:global(.tab-trigger:not(:first-child)) {
		margin-left: -1rem;
	}

	:global(.tab-trigger[data-state='inactive']) {
		background-color: var(--color-slate-100);
		color: var(--color-slate-900);
	}

	:global(.tab-trigger[data-state='active']) {
		background-color: var(--color-blue-800);
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		color: #fff;
		z-index: 10;
	}

	:global(.tab-trigger:hover) {
		background-color: var(--color-blue-400);
	}

	.tabs-container :global(.tab-content) {
		padding: 4rem 2rem;
		background-color: var(--brandDarkBlue);
	}
</style>
