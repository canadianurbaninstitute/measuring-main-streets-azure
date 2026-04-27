<script>
	import { onMount } from 'svelte';
	import '../../../styles.css';
	import AmenityMap from './charts/AmenityMap.svelte';
	// Report Components
	import ProgressBar from '../../components/ProgressBar.svelte';
	import ReportFindings from '../../components/ReportFindings.svelte';
	import ReportHeader from '../../components/ReportHeader.svelte';
	import Scroller from '../../components/Scroller.svelte';
	import TextBlock from '../../components/TextBlock.svelte';
	import VisContainer from '../../components/VisContainer.svelte';
	import VisImage from '../../components/VisImage.svelte';
	import VisLink from '../../components/VisLink.svelte';
	import VisPanel from '../../components/VisPanel.svelte';
	import AmenityNeeds from './charts/AmenityNeeds.svelte';
	import CivicInfrastructure from './charts/CivicInfrastructure.svelte';
	import DevelopmentPotential from './charts/DevelopmentPotential.svelte';
	import FutureStations from './charts/FutureStations.svelte';
	import LibraryMap from './charts/LibraryMap.svelte';
	import MissingAmenities from './charts/MissingAmenities.svelte';

	import { sections } from './article.js';

	// Charts
	import AccessScatter from './charts/AccessScatter.svelte';
	import AmenityTiers from './charts/AmenityTiers.svelte';
	// Assets
	import train from '../../../lib/assets/graphics/train-long.svg';
	import introImage from '../../../lib/assets/screenshots/cc.png';

	let activeIndex = $state(0);

	onMount(async () => {
		// Scrolly observer
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

	const visConfig = $derived({
		'amenity-tiers': {
			type: 'component',
			component: AmenityTiers
		},
		'access-scatter': {
			type: 'component',
			component: AccessScatter
		},
		'access-scatter-additional': {
			type: 'component',
			component: AccessScatter,
			props: { tier: 'Additional' }
		},
		'amenity-map': {
			type: 'component',
			component: AmenityMap
		},
		'missing-infrastructure': {
			type: 'component',
			component: MissingAmenities
		},
		'civic-infrastructure': {
			type: 'component',
			component: CivicInfrastructure
		},
		'library-map': {
			type: 'component',
			component: LibraryMap
		},
		'future-stations': {
			type: 'component',
			component: FutureStations
		},
		'development-potential': {
			type: 'component',
			component: DevelopmentPotential
		},
		'amenity-needs-summary': {
			type: 'component',
			component: AmenityNeeds
		}
	});

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
		eyebrow="TOWARDS COMPLETE COMMUNITIES"
		title="FROM TOD TO TOCC"
		subtitle="Transit-oriented development and complete communities in a Canadian context."
		backgroundImage={introImage}
	/>

	<ReportFindings
		id="report-findings"
		title="KEY TAKEAWAYS"
		finding1="Amenity Access and Density"
		description1="Access to core and additional amenities was positively correlated with residential density in Transit Station Areas."
		finding2="Large Civic Infrastructure Missing"
		description2="Libraries and Community centres are absent in over 50 percent of existing Transit Station Areas."
		finding3="TOD TO TOCC"
		description3="Future and existing stations face significant amenity debt around Transit Station Areas that need to be addressed in order to meet sustainable development goals."
	/>

	{#snippet renderPanel(uid, isVisible)}
		{@const panel = allPanels.find((p) => p.uid === uid)}
		{@const activeStep = steps[activeIndex]}
		<!-- Merge default panel props with any props defined on the specific active text step -->
		{@const stepProps = activePanelUid === uid ? activeStep?.props || {} : {}}
		{@const mergedProps = { ...panel.config?.props, ...stepProps }}

		{#if panel}
			<VisPanel visible={isVisible} label={panel.label ?? ''} source={panel.source ?? ''}>
				{#if panel.config?.type === 'image'}
					<VisImage
						src={panel.config.src}
						alt={panel.config.alt}
						caption={panel.config.caption ?? ''}
					/>
				{:else if panel.config?.type === 'component'}
					{@const Component = panel.config.component}
					<Component visible={isVisible} {...mergedProps} />
				{:else if panel.config?.type === 'link'}
					<VisLink href={panel.config.href} label={panel.config.btnLabel ?? 'Learn More'} />
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

<!-- {#if isLoading}
	<div class="loading-overlay">
		<div class="spinner"></div>
		<p>Loading report data...</p>
	</div>
{/if} -->

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

	.loading-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.9);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #f3f3f3;
		border-top: 4px solid #3b82f6;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
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
