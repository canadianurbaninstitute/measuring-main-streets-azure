<script lang="ts">
	// Components
	import marketConcentrationImg from '../../../lib/assets/graphics/grocery.jpg';
	import '../../../styles.css';
	import headerImage from '../../assets/transit-grocery.png';
	import ProgressBar from '../../components/ProgressBar.svelte';
	import ReportFindings from '../../components/ReportFindings.svelte';
	import ReportHeader from '../../components/ReportHeader.svelte';
	import Scroller from '../../components/Scroller.svelte';
	import type { Block, VisConfigItem } from '../../components/Template';
	import TextBlock from '../../components/TextBlock.svelte';
	import VisContainer from '../../components/VisContainer.svelte';
	import VisImage from '../../components/VisImage.svelte';
	import VisLink from '../../components/VisLink.svelte';
	import VisPanel from '../../components/VisPanel.svelte';
	import { sections } from './article';
	import CivicInfrastructureComparison from './CivicInfrastructureComparison.svelte';
	import FoodCoopBenefits from './FoodCoopBenefits.svelte';
	import GroceryMap from './GroceryMap.svelte';
	import PublicGrocerStats from './PublicGrocerStats.svelte';

	import train from '../../../lib/assets/graphics/train-long.svg';

	// Reactive state
	let selectedRegion = $state('greater_golden_horseshoe');

	const getVisConfig = (currentSelectedRegion: string): Record<string, VisConfigItem> => ({
		'market-concentration': {
			type: 'image',
			src: marketConcentrationImg,
			alt: 'Infographic showing Canadian grocery market concentration: 80% controlled by 5 giants.'
		},
		'transit-food-access': {
			type: 'component',
			component: GroceryMap,
			props: { selectedRegion: currentSelectedRegion }
		},
		'public-option': {
			type: 'component',
			component: PublicGrocerStats,
			props: {}
		},
		'coop-option': {
			type: 'component',
			component: FoodCoopBenefits,
			props: {}
		},
		'civic-infrastructure': {
			type: 'component',
			component: CivicInfrastructureComparison,
			props: {}
		}
	});

	let visConfig = $derived(getVisConfig(selectedRegion));

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

	const steps = sections.flatMap((section, si) => {
		const defaultId = section.panels[0]?.id;
		return section.blocks.map((block: Block) => {
			const pid = block.panelId ?? defaultId;
			const valid = section.panels.some((p) => p.id === pid);
			return {
				...block,
				sectionIndex: si,
				panelUid: pid ? `${si}:${valid ? pid : defaultId}` : null
			};
		});
	});

	const layoutGroups = (() => {
		const groups = [] as any[];
		let currentGroup: any = { layout: '', sections: [] };

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

			if (currentGroup.layout === layout) {
				currentGroup.sections.push(sectionWithIndices);
			} else {
				currentGroup = { layout, sections: [sectionWithIndices] };
				groups.push(currentGroup);
			}
		});

		return groups;
	})();

	// Reactive state
	let activeIndex = $state(0);
	let activePanelUid = $derived(steps[activeIndex]?.panelUid ?? allPanels[0]?.uid);

	const items = [
		{ type: 'anchor', id: 'report-header', label: 'Introduction' },
		{ type: 'anchor', id: 'report-findings', label: 'Key Takeaways' },
		...(sections
			.map((section, si) => {
				const heading = section.blocks.find((b) => b.heading)?.heading;
				if (!heading) return null;
				const stepIndex = steps.findIndex((s) => s.sectionIndex === si);
				return {
					type: 'anchor',
					id: `section-${si}`,
					label: heading,
					...(stepIndex >= 0 ? { stepIndex, isFirstInSection: true } : {})
				};
			})
			.filter(Boolean) as any[])
	];
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
		subEyebrow="Enabling affordable grocery options in and around transit stations "
		title="EATING WELL"
		subtitle="The development of new transit-oriented communities represents a generational opportunity to ensure reliable access to healthy and affordable food for those who rely on transit the most."
		author="By Leandro G. Santos"
		date="March 31, 2026"
		backgroundImage={headerImage}
	/>

	<ReportFindings
		id="report-findings"
		title="KEY TAKEAWAYS"
		finding1="Canada’s grocery industry lacks healthy competition"
		description1="and grocery prices won’t decrease without intervention."
		finding2="Public grocery stores and food co-operatives"
		description2="represent viable, non-profit models to make groceries more affordable."
		finding3="Food access is a keystone of complete communities"
		description3="and must be integrated into transit station area planning and development."
	/>

	{#snippet renderPanel(uid: string, isVisible: boolean)}
		{@const panel = allPanels.find((p) => p.uid === uid)}
		{#if panel}
			<VisPanel visible={isVisible} label={panel.label ?? ''} source={panel.source ?? ''}>
				{#if panel.config?.type === 'image'}
					<VisImage
						src={panel.config.src}
						alt={panel.config.alt}
						caption={panel.config.caption ?? ''}
						fit={panel.config.fit as
							| 'fill'
							| 'none'
							| 'contain'
							| 'cover'
							| 'scale-down'
							| undefined}
						aspect={panel.config.aspect}
					/>
				{:else if panel.config?.type === 'component'}
					{@const Component = panel.config.component}
					<Component {...panel.config.props} visible={isVisible} />
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
										steps[block.globalStepIndex ?? -1].panelUid !==
											steps[(block.globalStepIndex ?? -1) - 1].panelUid)
										? true
										: false}
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
						{#each allPanels.filter( (p) => group.sections.some((s: any) => s.si === p.sectionIndex) ) as panel (panel.uid)}
							{@render renderPanel(panel.uid, activePanelUid === panel.uid)}
						{/each}
					</VisContainer>
				{/snippet}
			</Scroller>
		{:else}
			<div class="inline-article">
				{#each group.sections as section}
					<div class="inline-section" id="section-{section.si}">
						{#each section.blocks as block}
							{@const pids =
								block.panelIds ??
								(block.panelId ? [block.panelId] : section.panels[0] ? [section.panels[0].id] : [])}

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
	.inline-article {
		max-width: 65ch;
		padding: 0 1rem;
		display: flex;
		flex-direction: column;
		margin: auto;
	}

	.inline-section {
		display: flex;
		flex-direction: column;
	}

	.inline-heading {
		margin-top: 3rem;
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
		width: calc(100cqi);
		margin-left: calc(-50cqi + 50%);
		margin-bottom: 2rem;
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
