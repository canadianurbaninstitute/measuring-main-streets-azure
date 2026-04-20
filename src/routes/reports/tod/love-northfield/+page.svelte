<script>
	// Components
	import dps from '../../../lib/assets/logos/DPS-logo-black.png';
	import cui from '../../../lib/assets/logos/cui_logo.svg';
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
	import { sections } from './article.js';

	import train from '../../../lib/assets/graphics/train-long.svg';
	import everyone from '../../assets/dps-heart.png';
	import northfield from '../../assets/dps-northfield.png';
	import welcome from '../../assets/dps-welcome.png';
	import QuoteGroup from '../../components/QuoteGroup.svelte';
	import Polis from './Polis.svelte';
	import QuoteChart from './QuoteChart.svelte';
	import Tradeoffs from './TradeOffs.svelte';
	import Walking from './Walking.svelte';

	const visConfig = {
		welcome: {
			type: 'image',
			src: welcome
		},
		northfield: {
			type: 'image',
			src: northfield,
			alt: 'Graphic of 3 people behind a train track that says "Waterloo"'
		},
		'engagement-summary': {
			type: 'component',
			component: QuoteChart
		},
		tradeoffs: {
			type: 'component',
			component: Tradeoffs
		},
		cars: {
			type: 'component',
			component: Walking
		},
		functionality: {
			type: 'component',
			component: QuoteGroup,
			props: {
				columns: 1,
				quotes: [
					{
						text: 'We need to stack amenities like in Europe. More small businesses at ground level, with residences above. More stimulating and shorter walks.',
						colorFam: 'blue'
					},
					{
						text: 'Varied rental/high density housing options for people/families with varied incomes that are big/comfortable enough to live in long term.',
						colorFam: 'green'
					},
					{
						text: 'Would love more areas like Belmont Village, walkable commercial districts surrounded and topped by housing.',
						colorFam: 'pink'
					},
					{
						text: 'Stop turning car lanes into bicycle lanes. And stop elimiting parking in Uptown.',
						isDivisive: true
					}
				]
			}
		},
		everyone: {
			type: 'image',
			src: everyone
		},
		polis: {
			type: 'component',
			component: Polis
		}
	};

	/**
	 * Flatten all panels, tagging each with a globally-unique uid
	 */
	const allPanels = sections.flatMap((section, si) =>
		section.panels.map((panel) => ({
			...panel,
			uid: `${si}:${panel.id}`,
			sectionIndex: si,
			config: visConfig[panel.id] ?? null
		}))
	);

	/**
	 * Flatten all blocks from all sections into a single steps array
	 */
	const steps = sections.flatMap((section, si) => {
		const defaultId = section.panels?.[0]?.id;
		return section.blocks.map((block) => {
			const pid = block.panelId ?? defaultId;
			const valid = section.panels?.some((p) => p.id === pid);
			return {
				...block,
				sectionIndex: si,
				panelUid: pid ? `${si}:${valid ? pid : defaultId}` : null,
				panelProps: block.panelProps ?? {}
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

			// Tag blocks with global indices and pull panelUid from steps
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

	// Reactive state
	let activeIndex = $state(0);
	let activePanelUid = $derived(steps[activeIndex]?.panelUid ?? allPanels[0]?.uid);

	import { onMount } from 'svelte';

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeIndex = Number(entry.target.dataset.step);
					}
				});
			},
			{
				rootMargin: '-40% 0px -40% 0px',
				threshold: 0
			}
		);

		document.querySelectorAll('[data-step]').forEach((step) => observer.observe(step));
		return () => observer.disconnect();
	});

	// Navigation items for ProgressBar
	const items = $derived.by(() => {
		const nav = [
			{ type: 'anchor', id: 'report-header', label: 'Introduction' },
			{ type: 'anchor', id: 'report-findings', label: 'Key Takeaways' }
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

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<main>
	<ProgressBar iconType="custom" activeStepIndex={activeIndex} totalSteps={steps.length} {items}>
		{#snippet icon()}
			<img src={train} width="100%" height="100%" alt="Progress icon" />
		{/snippet}
	</ProgressBar>

	<ReportHeader
		id="report-header"
		subEyebrow="A Love Your Neighbourhood Report"
		title="NORTHFIELD"
		subtitle="Exploring the possibilities of digital engagement platforms to facilitate  broader engagement of residents around Transit Station Areas"
		backgroundImage={northfield}
		customLogos={[
			{ src: dps, alt: 'DPS Logo', width: '120' },
			{ src: cui, alt: 'CUI Logo', width: '200' }
		]}
	/>

	<ReportFindings
		id="report-findings"
		title="KEY TAKEAWAYS"
		finding1="Trade‑offs Unclear"
		description1="Future engagement may need to focus on raising awareness about the tradeoffs that come with TOD."
		link1="#tradeoffs"
		finding2="Cars Still Dominate Daily Travel"
		description2="Cars are the most used method to commute. "
		link2="#cars"
		finding3="Density Without Losing Functionality"
		description3="Strong emphasis on walkability, mixed-use environments, and transit improvements."
		link3="#functionality"
	/>

	{#snippet renderPanel(uid, isVisible, id, extraProps)}
		{@const panel = allPanels.find((p) => p.uid === uid)}
		{#if panel}
			<VisPanel
				id={id || panel.id}
				visible={isVisible}
				label={panel.label ?? ''}
				source={panel.source ?? ''}
			>
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
					<Component {...panel.config.props} {...extraProps} visible={isVisible} />
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
									id={block.panelId}
									index={block.globalStepIndex}
									active={activeIndex === block.globalStepIndex}
									eyebrow={block.eyebrow}
									heading={block.heading}
									body={block.body}
									cta={block.cta}
									showInlineVisual={!!block.panelUid &&
										(block.globalStepIndex === 0 ||
											steps[block.globalStepIndex].panelUid !==
												steps[block.globalStepIndex - 1].panelUid)}
								>
									{#snippet inlineVisual()}
										{@render renderPanel(block.panelUid, true, undefined, block.panelProps)}
									{/snippet}
								</TextBlock>
							{/each}
						</div>
					{/each}
				{/snippet}

				{#snippet visual()}
					<VisContainer>
						{#each allPanels.filter( (p) => group.sections.some((s) => s.si === p.sectionIndex) ) as panel (panel.uid)}
							{@render renderPanel(
								panel.uid,
								activePanelUid === panel.uid,
								undefined,
								steps[activeIndex]?.panelProps
							)}
						{/each}
					</VisContainer>
				{/snippet}
			</Scroller>
		{:else}
			<div class="inline-article">
				{#each group.sections as section}
					<div class="inline-section" id="section-{section.si}">
						{#each section.blocks as block}
							{@const pids = block.panelIds ?? (block.panelId ? [block.panelId] : [])}
							<div class="inline-block" data-step={block.globalStepIndex}>
								{#if block.eyebrow}
									<div class="uppercase tracking-widest text-blue-400 mb-1 text-large">
										{block.eyebrow}
									</div>
								{/if}
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
	}

	.inline-body {
		margin-bottom: 2rem;
	}

	:global(.inline-body > h6) {
		margin-bottom: 0.5rem;
	}

	.inline-cta {
		margin-bottom: 2rem;
	}

	.inline-vis-container {
		width: 100vw;
		margin-left: calc(-50vw + 50%);
		display: flex;
		justify-content: center;
		padding: 2rem 1rem;
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
	.inline-vis-container :global(.vis-panel),
	:global(.text-column .vis-panel) {
		position: relative;
		opacity: 1 !important;
		visibility: visible !important;
		transform: none !important;
		pointer-events: auto !important;
		width: 100%;
		height: 100%;
		min-height: 400px;
	}

	:global(.vis-panel) {
		transition:
			opacity 0.3s ease,
			transform 0.3s ease;
	}

	@media (max-width: 768px) {
		.inline-article {
			margin: 2em auto;
		}

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

		.inline-vis-container :global(.vis-panel),
		:global(.text-column .vis-panel) {
			padding: 1rem;
			height: auto;
			min-height: 400px;
		}
	}
</style>
