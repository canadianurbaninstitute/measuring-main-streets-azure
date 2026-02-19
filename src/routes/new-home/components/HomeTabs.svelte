<script>
	import { Tabs } from 'bits-ui';
	import LandingCard from '../../lib/ui/LandingCard.svelte';
	// Import local assets
	import chart from '../../lib/assets/graphics/chart.png';
	import civic from '../../lib/assets/graphics/civic.svg';
	import mainstreets from '../../lib/assets/graphics/mainstreets.svg';
	import resiliency from '../../lib/assets/graphics/resiliency.svg';
	import urbanform from '../../lib/assets/graphics/urbanform.svg';

	let activeTab = 'tod';

	const todCards = [
		{
			title: 'Transit Map',
			description:
				'Explore the major transit station areas and their relationship to main streets.',
			image: 'https://i.imgur.com/c9WT7dM.png',
			link: '/transit-map'
		},
		{
			title: 'Transit Charts',
			description: 'Key data for each stop along a selected transit line.',
			image: chart,
			link: '/tools/transit-charts'
		},
		{
			title: 'Urban Form Comparison',
			description:
				'Compare the urban form characteristics of areas within 800m of transit stations.',
			image: urbanform,
			link: '/tools/urban-form-comparison'
		},
		{
			title: 'Infrastructure Equity',
			description: 'Identifying equity gaps in main street civic infrastructure.',
			image: civic,
			link: '/reports/mainstreets-infrastructure-equity'
		}
	];

	const resilienceCards = [
		{
			title: 'Resilience Map',
			description: 'Analyzing neighbourhood scale data for better city building.',
			image: 'https://i.imgur.com/XtcX0Gn.jpeg',
			link: '/map'
		},
		{
			title: 'Visitor Recovery',
			description: 'This graphing tool highlights the visitor recovery patterns from 2020 to 2022.',
			image: mainstreets,
			link: '/tools/mainstreet-visitor-recovery'
		},
		{
			title: 'Main Street Resiliency',
			description: 'Analysing main street resiliency through visitor levels over the pandemic.',
			image: resiliency,
			link: '/reports/mainstreet-resiliency'
		},
		{
			title: 'Case Studies',
			description:
				'Investigating the resilience of Canadian main streets through 60 detailed studies.',
			image: 'https://i.imgur.com/89GpAIS.png',
			link: '/casestudies'
		}
	];
</script>

<Tabs.Root bind:value={activeTab} class="tabs-root">
	<Tabs.List class="tabs-list">
		<Tabs.Trigger value="tod" class="tab-trigger tod-trigger">
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
		width: 100vw;
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
