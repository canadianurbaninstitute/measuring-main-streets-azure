<script>
	// Components
	import ReportHeader from '../../components/ReportHeader.svelte';
	import ReportFindings from '../../components/ReportFindings.svelte';
	import Scroller from '../../components/Scroller.svelte';
	import TextBlock from '../../components/TextBlock.svelte';
	import VisContainer from '../../components/VisContainer.svelte';
	import VisImage from '../../components/VisImage.svelte';
	import VisPanel from '../../components/VisPanel.svelte';
	import ProgressBar from '../../components/ProgressBar.svelte';
	import { sections } from './article.js';
	import { BarChart, ColumnChart, LineChart } from '@onsvisual/svelte-charts';
	import '../../../styles.css';
	// Assets
	import introImage from './assets/IntroHeader.png';
	import urbanPopGrowth from './assets/UrbanPopGrowth.png';
	import ProgressTrain from '../../assets/progress_train.svg';
	// Charts
	import UrbanPop from './charts/UrbanPop.svelte';
	import UrbanPopLineChart from './charts/UrbanPopLineChart.svelte';

	const visConfig = {
		'urban-pop': { type: 'component', component: UrbanPop },
		'urban-pop-growth': { type: 'image', src: urbanPopGrowth, alt: 'Urban Population Growth' },
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
	let activeIndex = 0;
	$: activePanelUid = steps[activeIndex]?.panelUid ?? allPanels[0]?.uid;

	// ── Progress bar ──────────────────────────────────────────────────────────
	const navSections = sections.map((section, si) => ({
		firstStepIndex: steps.findIndex((s) => s.panelUid.startsWith(`${si}:`)),
		label:
			section.blocks.find((b) => b.heading)?.heading ??
			section.panels[0]?.label ??
			`Section ${si + 1}`
	}));
	// `items` is a flat ordered list of everything on the page that should get
	// a marker. Pre-scroller sections use type:'anchor' with an id that matches
	// the `id` attribute on the DOM element. Scroller sections use type:'step'.
	//
	// Add or remove anchor items here to match whatever components sit above
	// the Scroller. The bar tracks anchor visibility via IntersectionObserver
	// and step visibility via activeIndex — no extra wiring needed.
	$: items = [
		{ type: 'anchor', id: 'report-header', label: 'Introduction' },
		{ type: 'anchor', id: 'report-findings', label: 'Key Findings' },
		...navSections.map((s) => ({
			type: 'step',
			stepIndex: s.firstStepIndex,
			label: s.label,
			isFirstInSection: true
		}))
	];
</script>

<main>
	<ProgressBar icon="custom" activeStepIndex={activeIndex} totalSteps={steps.length} {items}>
		<svg
			slot="icon"
			width="76"
			height="18"
			viewBox="0 0 76 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M0 5C0 2.23858 2.23858 0 5 0H25C27.7614 0 30 2.23858 30 5V13C30 15.7614 27.7614 18 25 18H15H5C2.23858 18 0 15.7614 0 13V5Z"
				fill="#002940"
			/>
			<path
				d="M0 4.5C0 2.01472 1.03319 0 2.30769 0H27.6923C28.9668 0 30 2.01472 30 4.5V13.5C30 15.9853 28.9668 18 27.6923 18H2.30769C1.03319 18 0 15.9853 0 13.5V4.5Z"
				fill="#002940"
			/>
			<path
				d="M33 5C33 2.23858 35.2386 0 38 0H59.5086C61.0484 0 62.5023 0.709493 63.4498 1.92327L69.695 9.92327C72.2578 13.2063 69.9186 18 65.7537 18H38C35.2386 18 33 15.7614 33 13V5Z"
				fill="#002940"
			/>
			<path d="M3.5 3H8.5V8H3.5V3Z" fill="white" />
			<path d="M11.5 3H16.5V8H11.5V3Z" fill="white" />
			<path d="M3.5 3H8.5V8H3.5V3Z" fill="white" />
			<path d="M46 3H51V8H46V3Z" fill="white" />
			<path d="M54 3H59V8H54V3Z" fill="white" />
			<path d="M46 3H51V8H46V3Z" fill="white" />
			<path d="M19 3H24V8H19V3Z" fill="white" />
		</svg>
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
		<svelte:fragment slot="text">
			{#each steps as step, i}
				<TextBlock
					index={i}
					active={activeIndex === i}
					eyebrow={step.eyebrow}
					heading={step.heading}
					body={step.body}
				/>
			{/each}
		</svelte:fragment>

		<svelte:fragment slot="visual">
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
							<svelte:component this={panel.config.component} />
						{/if}
					</VisPanel>
				{/each}
			</VisContainer>
		</svelte:fragment>
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
