<script>
	// Components
	import '../../../styles.css';
	import ProgressBar from '../../components/ProgressBar.svelte';
	import ReportFindings from '../../components/ReportFindings.svelte';
	import ReportHeader from '../../components/ReportHeader.svelte';
	import Scroller from '../../components/Scroller.svelte';
	import TextBlock from '../../components/TextBlock.svelte';
	import VisContainer from '../../components/VisContainer.svelte';
	import VisImage from '../../components/VisImage.svelte';
	import VisPanel from '../../components/VisPanel.svelte';
	import { sections } from './article.js';
	// Assets
	import introImage from '../../../lib/assets/screenshots/IntroHeader.png';
	import urbanPopGrowth from '../../../lib/assets/screenshots/UrbanPopGrowth.png';
	// Charts
	import { onMount } from 'svelte';
	import train from '../../../lib/assets/graphics/train-long.svg';
	import UrbanPop from './charts/UrbanPop.svelte';
	import UrbanPopLineChart from './charts/UrbanPopLineChart.svelte';

	// Data
	let JobGrowthSectorData = $state(null);

	const visConfig = {
		'urban-pop': { type: 'component', component: UrbanPop },
		'urban-pop-growth': { type: 'component', component: UrbanPopLineChart },
		'test-image': { type: 'image', src: introImage, alt: 'Test Image' },
		'urban-pop-growth1': { type: 'image', src: urbanPopGrowth, alt: 'Urban Population Growth' },
		'test-image1': { type: 'image', src: introImage, alt: 'Test Image' }
	};
	/**
	 * Flatten all panels, tagging each with a globally-unique uid
	 * of the form `sectionIndex:panelId`.
	 */
	const allPanels = sections.flatMap((section, si) =>
		section.panels.map((panel) => ({
			...panel,
			uid: `${si}:${panel.id}`,
			config: visConfig[panel.id] ?? null
		}))
	);
	/**
	 * Flatten sections → steps. Each step carries the uid of the panel it
	 * should display. panelId defaults to the section's first panel if unset,
	 * and falls back gracefully if the id doesn't exist in the section.
	 */
	const steps = sections.flatMap((section, si) => {
		const defaultId = section.panels[0].id;
		return section.blocks.map((block) => {
			const pid = block.panelId ?? defaultId;
			const valid = section.panels.some((p) => p.id === pid);
			return { ...block, panelUid: `${si}:${valid ? pid : defaultId}` };
		});
	});

	// ── Reactive state ───────────────────────────────────────────────────────
	let activeIndex = $state(0);
	let activePanelUid = $derived(steps[activeIndex]?.panelUid ?? allPanels[0]?.uid);

	// ── Progress bar ──────────────────────────────────────────────────────────
	const navSections = sections.map((section, si) => ({
		firstStepIndex: steps.findIndex((s) => s.panelUid.startsWith(`${si}:`)),
		label:
			section.blocks.find((b) => b.heading)?.heading ??
			section.panels[0]?.label ??
			`Section ${si + 1}`
	}));

	const items = [
		{ type: 'anchor', id: 'report-header', label: 'Introduction' },
		{ type: 'anchor', id: 'report-findings', label: 'Key Findings' },
		...navSections.map((s) => ({
			type: 'step',
			stepIndex: s.firstStepIndex,
			label: s.label,
			isFirstInSection: true
		}))
	];

	onMount(async () => {
		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/reports/intro/03_jobsectorgrowth.json'
			);
			JobGrowthSectorData = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	});

	$effect(() => {
		console.log(activePanelUid);
	});
</script>

<main>
	<!-- {#if JobGrowthSectorData}
		<JobGrowthSector data={JobGrowthSectorData} />
	{/if} -->
	<ProgressBar iconType="custom" activeStepIndex={activeIndex} totalSteps={steps.length} {items}>
		{#snippet icon()}
			<img src={train} width="100%" height="100%" alt="Progress icon" />
		{/snippet}
	</ProgressBar>

	<ReportHeader
		id="report-header"
		eyebrow="THE CASE FOR"
		title="TRANSIT-ORIENTED COMPLETE COMMUNITIES"
		subtitle="With rapidly-growing populations, Canada’s largest metropolitan regions face an acute need for housing. How can transit-oriented development create complete communities that fulfill this need?"
		backgroundImage={introImage}
	/>
	<ReportFindings
		id="report-findings"
		title="KEY FINDINGS"
		finding1="Investments in public transit"
		description1="are vital to maintaining growth in Canada’s largest urban regions."
		finding2="Communities are only complete"
		description2="if they are walkable."
		finding3="Not all transit projects"
		description3="deliver the same return."
	/>
	<div class="chart"></div>
	<Scroller bind:activeIndex threshold={0.5}>
		{#snippet text()}
			{#each steps as step, i}
				<TextBlock
					index={i}
					active={activeIndex === i}
					eyebrow={step.eyebrow}
					heading={step.heading}
					body={step.body}
				/>
			{/each}
		{/snippet}

		{#snippet visual()}
			<VisContainer>
				{#each allPanels as panel (panel.uid)}
					<VisPanel visible={activePanelUid === panel.uid} label={panel.label ?? ''}>
						{#if panel.config?.type === 'image'}
							<VisImage
								src={panel.config.src}
								alt={panel.config.alt}
								caption={panel.config.caption ?? ''}
								fit={panel.config.fit ?? 'contain'}
							/>
						{:else if panel.config?.type === 'component'}
							{@const Component = panel.config.component}
							<Component visible={activePanelUid === panel.uid} />
						{/if}
					</VisPanel>
				{/each}
			</VisContainer>
		{/snippet}
	</Scroller>
</main>

<style>
	.chart {
		border: 1px solid #eee;
		padding: 1em;
		border-radius: 0.5em;
		min-width: 1px;
		min-height: 1px;
		gap: 0.3em;
	}
</style>
