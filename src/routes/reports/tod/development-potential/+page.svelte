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
	import VisLink from '../../components/VisLink.svelte';
	import VisPanel from '../../components/VisPanel.svelte';
	import { intersect } from '../walkability/intersect.js';
	import { sections } from './article.js';
	import ExampleRadar from './charts/ExampleRadar.svelte';
	import PotentialMap from './charts/PotentialMap.svelte';
	// Assets
	import train from '../../../lib/assets/graphics/train-long.svg';
	import buildings from './assets/buildings.png';
	import HeaderImage from './assets/HeaderImage.png';
	import stncomp from './assets/stncomp.png';
	import PotentialScatter from './charts/PotentialScatter.svelte';

	const visConfig = {
		intro: {
			type: 'image',
			src: buildings,
			alt: 'Graphics of building forms'
		},
		intro2: {
			type: 'image',
			src: stncomp,
			alt: 'Urban form maps of station areas'
		},
		intro3: {
			type: 'component',
			component: ExampleRadar
		},
		'potential-scatter': {
			type: 'component',
			component: PotentialScatter
		},
		'potential-map': {
			type: 'component',
			component: PotentialMap
		}
	};

	let activeIndex = $state(0);

	/**
	 * Flatten all panels, tagging each with a globally-unique uid
	 */
	const allPanels = sections.flatMap((section, si) =>
		section.panels
			? section.panels.map((panel) => ({
					...panel,
					uid: `${si}:${panel.id}`,
					sectionIndex: si,
					config: visConfig[panel.id] ?? null
				}))
			: []
	);

	/**
	 * Flatten sections → steps for Scroller
	 */
	const steps = sections.flatMap((section, si) => {
		const defaultId = section.panels?.[0]?.id;
		return section.blocks.map((block) => {
			const pid = block.panelId ?? defaultId;
			const valid = section.panels?.some((p) => p.id === pid);
			return {
				...block,
				sectionIndex: si,
				panelUid: pid ? `${si}:${valid ? pid : defaultId}` : null
			};
		});
	});

	/**
	 * Group adjacent sections by layout and tag blocks with their global step index
	 */
	const layoutGroups = $derived.by(() => {
		const groups = [];
		let currentGroup = null;

		sections.forEach((section, si) => {
			const layout = section.layout || (section.panels?.length > 0 ? 'scrolly' : 'inline');

			const blockOffset = steps.findIndex((s) => s.sectionIndex === si);
			const sectionWithIndices = {
				...section,
				si,
				blocks: steps
					.filter((s) => s.sectionIndex === si)
					.map((b, bi) => ({ ...b, globalStepIndex: blockOffset + bi }))
			};

			if (currentGroup && currentGroup.layout === layout) {
				currentGroup.sections.push(sectionWithIndices);
			} else {
				currentGroup = { layout, sections: [sectionWithIndices] };
				groups.push(currentGroup);
			}
		});
		return groups;
	});

	let activePanelUid = $derived(steps[activeIndex]?.panelUid ?? allPanels[0]?.uid);

	// Navigation items for ProgressBar
	const items = $derived.by(() => {
		const nav = [
			{ type: 'anchor', id: 'report-header', label: 'Introduction' },
			{ type: 'anchor', id: 'report-findings', label: 'Key Findings' }
		];

		sections.forEach((section, si) => {
			const firstStepIndex = steps.findIndex((s) => s.sectionIndex === si);
			const heading = section.blocks.find((b) => b.heading)?.heading;

			if (heading) {
				nav.push({
					type: 'anchor',
					id: `section-${si}`,
					label: heading,
					stepIndex: firstStepIndex,
					isFirstInSection: true
				});
			}
		});

		return nav;
	});
</script>

<main>
	<ProgressBar iconType="custom" activeStepIndex={activeIndex} totalSteps={steps.length} {items}>
		{#snippet icon()}
			<img src={train} width="100%" height="100%" alt="Progress icon" />
		{/snippet}
	</ProgressBar>

	<ReportHeader
		id="report-header"
		title="HIGH POTENTIAL"
		subEyebrow="Exploring Housing Development Potential in Transit Station Areas"
		subtitle="By considering transit investments as housing investments, and ultimately as community-building investments, city-builders are well-positioned to design the vibrant, sustainable neighbourhoods enabled by the high potential of transit station areas."
		backgroundImage={HeaderImage}
	/>
	<ReportFindings
		id="report-findings"
		title="KEY TAKEAWAYS"
		finding1="Transit investments spark housing construction,"
		description1="but not all the same way in all the same places."
		finding2="Growth pressure and land availability are negatively correlated"
		description2="Stations with high growth pressure generally have low land availability, and vice versa."
		finding3="When planning for new transit stations,"
		description3="areas with high land availability and high growth pressure are key areas with high potential for housing development."
	/>

	{#snippet renderPanel(uid, isVisible)}
		{@const panel = allPanels.find((p) => p.uid === uid)}
		{@const activeStep = steps[activeIndex]}
		{@const stepProps = activePanelUid === uid ? activeStep?.props || {} : {}}
		{@const mergedProps = { ...panel?.config?.props, ...stepProps }}

		{#if panel}
			<VisPanel visible={isVisible} label={panel.label ?? ''} source={panel.source ?? ''}>
				{#if panel.config?.type === 'image'}
					<VisImage
						src={panel.config.src}
						alt={panel.config.alt}
						caption={panel.config.caption ?? ''}
						fit={panel.config.fit}
						aspect={panel.config.aspect}
					/>
				{:else if panel.config?.type === 'component'}
					{@const Component = panel.config.component}
					<Component visible={isVisible} {...mergedProps} />
				{:else if panel.config?.type === 'link'}
					<VisLink
						href={panel.config.href}
						label={panel.config.btnLabel ?? 'Learn More'}
						target={panel.config.target}
					/>
				{/if}
			</VisPanel>
		{/if}
	{/snippet}

	{#each layoutGroups as group}
		{#if group.layout === 'scrolly'}
			<Scroller bind:activeIndex threshold={0.5}>
				{#snippet text()}
					{#each group.sections as section}
						<div class="scrolly-section" id="section-{section.si}">
							{#each section.blocks as block}
								<TextBlock
									index={block.globalStepIndex}
									active={activeIndex === block.globalStepIndex}
									eyebrow={block.eyebrow}
									heading={block.heading}
									body={block.body}
									cta={block.cta}
									showInlineVisual={block.panelUid &&
										(block.globalStepIndex === 0 ||
											steps[block.globalStepIndex].panelUid !==
												steps[block.globalStepIndex - 1].panelUid)}
								>
									{#snippet inlineVisual()}
										{@render renderPanel(block.panelUid, true)}
									{/snippet}
								</TextBlock>
							{/each}
						</div>
					{/each}
				{/snippet}

				{#snippet visual()}
					<VisContainer>
						{#each allPanels.filter( (p) => group.sections.some((s) => s.si === p.sectionIndex) ) as panel (panel.uid)}
							{@render renderPanel(panel.uid, activePanelUid === panel.uid)}
						{/each}
					</VisContainer>
				{/snippet}
			</Scroller>
		{:else if group.layout === 'overlay'}
			<div class="page-layout-overlay">
				<div class="map-background">
					<VisContainer>
						{#each allPanels.filter( (p) => group.sections.some((s) => s.si === p.sectionIndex) ) as panel (panel.uid)}
							{@render renderPanel(panel.uid, activePanelUid === panel.uid)}
						{/each}
					</VisContainer>
				</div>
				<div class="content-foreground">
					{#each group.sections as section}
						<div class="scrolly-section overlay" id="section-{section.si}">
							{#each section.blocks as block}
								<section
									class="scroll-section"
									data-step={block.globalStepIndex}
									use:intersect={(node) => {
										activeIndex = Number(node.dataset.step);
									}}
								>
									{#if block.heading}
										<h2 class="station-title">{block.heading}</h2>
									{/if}
									<div class="max-w-none">
										{@html block.body}
									</div>
								</section>
							{/each}
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div class="inline-article shadow-highlight">
				{#each group.sections as section}
					<div class="inline-section" id="section-{section.si}">
						{#each section.blocks as block}
							{@const pids = block.panelIds ?? (block.panelId ? [block.panelId] : [])}
							<div class="inline-block" data-step={block.globalStepIndex}>
								{#if block.heading}
									<h3 class="inline-heading">{block.heading}</h3>
								{/if}
								<div class="inline-body">{@html block.body}</div>

								{#if block.cta}
									<div class="inline-cta">
										<VisLink href={block.cta.href} label={block.cta.label} />
									</div>
								{/if}

								{#if pids.length > 0}
									<div class="inline-vis-container" class:multi-vis={pids.length > 1}>
										{#each pids as pid}
											<div class="inline-vis-item">
												{@render renderPanel(`${section.si}:${pid}`, true)}
											</div>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/each}
			</div>
		{/if}
	{/each}
</main>

<style>
	.page-layout-overlay {
		background-color: var(--color-slate-800);
		position: relative;
		min-height: 100vh;
		display: grid;
		grid-template-columns: 1fr;
	}

	.page-layout-overlay .map-background {
		background-color: var(--color-slate-800);
		grid-column: 1;
		grid-row: 1;
		position: sticky;
		top: 0;
		width: 100%;
		height: 100vh;
		z-index: 0;
	}

	.page-layout-overlay .map-background :global(.vis-container) {
		width: 100%;
		height: 100%;
		padding: 0;
	}

	.page-layout-overlay .content-foreground {
		grid-column: 1;
		grid-row: 1;
		width: 40%;
		max-width: 600px;
		position: relative;
		z-index: 10;
		pointer-events: none;
	}

	.page-layout-overlay .scroll-section {
		pointer-events: auto;
		margin: 20vh 0 20vh 10%;
		padding: 3rem 3rem 2.5rem 3rem;
		backdrop-filter: blur(12px);
		border-radius: 1.5rem;
		background: rgba(24, 24, 27, 0.85); /* zinc-900 */
		box-shadow:
			0 20px 25px -5px rgba(0, 0, 0, 0.5),
			0 10px 10px -5px rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}
	:global(.page-layout-overlay .scroll-section p) {
		color: #f4f4f5 !important; /* zinc-50 */
	}

	.page-layout-overlay .station-title {
		color: var(--color-blue-100);
		margin-bottom: 1rem;
	}

	@media (max-width: 1024px) {
		.page-layout-overlay .content-foreground {
			width: 100%;
			max-width: none;
			pointer-events: auto;
		}

		.page-layout-overlay .scroll-section {
			margin: 0;
			padding: 10vh 5%;
			border-radius: 0;
			background: #18181b;
			box-shadow: none;
			border: none;
			border-top: 1px solid #3f3f46;
		}
	}

	.inline-article {
		max-width: 65ch;
		margin: 4em auto;
		padding: 0 1rem;
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	.inline-section {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.inline-heading {
		margin-bottom: 1.5rem;
		font-size: 2.2rem;
		color: #1e293b;
	}

	.inline-body {
		margin-bottom: 2rem;
		font-size: 1.15rem;
		line-height: 1.7;
		color: #334155;
	}

	.inline-cta {
		margin-bottom: 2rem;
	}

	.inline-vis-container {
		width: 100vw;
		margin-left: calc(-50vw + 50%);
		display: flex;
		justify-content: center;
		padding: 3rem 1rem;
		background-color: #f8fafc;
		border-top: 1px solid #eee;
		border-bottom: 1px solid #eee;
		position: relative;
		min-height: 40vh;
	}

	.inline-vis-container.multi-vis {
		flex-direction: row;
		justify-content: center;
		flex-wrap: wrap;
		align-items: stretch;
	}

	.inline-vis-item {
		flex: 1 1;
		display: flex;
		flex-direction: column;
		max-width: 1200px;
	}

	/* Force VisPanel to behave appropriately in inline contexts */
	.inline-vis-container :global(.vis-panel) {
		position: relative;
		opacity: 1 !important;
		visibility: visible !important;
		transform: none !important;
		pointer-events: auto !important;
		width: 100%;
		height: 100%;
		min-height: 400px;
	}

	@media (max-width: 768px) {
		.inline-vis-container {
			padding: 2rem 0;
			min-height: auto;
		}

		.inline-vis-container.multi-vis {
			flex-direction: column;
		}

		.inline-vis-item {
			flex: 0 0 auto;
			width: 100%;
			max-width: none;
			display: flex;
		}

		.inline-vis-container :global(.vis-panel) {
			padding: 1rem;
			height: auto;
			min-height: 400px;
		}
	}
</style>
