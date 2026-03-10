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

	const visComponents = {
		'urban-pop': UrbanPop
	};

	const visImages = {
		urbanpopgrowth: {
			src: urbanPopGrowth,
			alt: 'test img',
			fit: 'cover'
		}
	};
	/**
	 * Flatten sections → steps so Scroller works with a single index.
	 *
	 * Each step carries:
	 *   { visId, eyebrow, heading, body }
	 */
	const steps = sections.flatMap((section) =>
		section.blocks.map((block) => ({ visId: section.visId, ...block }))
	);

	/** Unique ordered list of visIds (preserves first appearance order) */
	const visIds = [...new Map(sections.map((s) => [s.visId, s.visId])).values()];

	// ── Reactive state ───────────────────────────────────────────────────────
	let activeIndex = 0;

	$: activeVisId = steps[activeIndex]?.visId ?? visIds[0];

	const navSections = sections.map((section) => {
		// Find the global step index where this section starts
		const firstStepIndex = steps.findIndex((s) => s.visId === section.visId);
		const label = section.blocks.find((b) => b.heading)?.heading ?? section.visId;
		return { firstStepIndex, label };
	});
</script>

<main>
	<ProgressBar {activeIndex} totalSteps={steps.length} sections={navSections} />
	<ReportHeader
		eyebrow="THE CASE FOR"
		title="TRANSIT-ORIENTED COMPLETE COMMUNITIES"
		subtitle="With rapidly-growing populations, Canada’s largest metropolitan regions face an acute need for housing. How can transit-oriented development create complete communities that fulfill this need?"
		backgroundImage={introImage}
	/>
	<ReportFindings
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
				{#each visIds as visId}
					<VisPanel visible={activeVisId === visId} label={visId}>
						{#if visImages[visId]}
							<!-- Image panel -->
							<VisImage
								src={visImages[visId].src}
								alt={visImages[visId].alt}
								caption={visImages[visId].caption ?? ''}
								fit={visImages[visId].fit ?? 'contain'}
							/>
						{:else if visComponents[visId]}
							<!-- Svelte component panel -->
							<svelte:component this={visComponents[visId]} />
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
