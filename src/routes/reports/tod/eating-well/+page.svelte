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
	import { sections } from './article.js';
	// Assets
	import civicInfraImg from '../../../lib/assets/screenshots/civic-infrastructure-diagram.png';
	import headerImage from '../../../lib/assets/screenshots/eating-well-header.png';
	import foodCoopImg from '../../../lib/assets/screenshots/food-coop-benefits.png';
	import publicGrocerImg from '../../../lib/assets/screenshots/public-grocer-model.png';
	import transitMapImg from '../../../lib/assets/screenshots/transit-map.png';
	import marketConcentrationImg from '../../assets/grocery.jpg';

	import train from '../../../lib/assets/graphics/train-long.svg';

	const visConfig = {
		'market-concentration': {
			type: 'image',
			src: marketConcentrationImg,
			alt: 'Infographic showing Canadian grocery market concentration: 80% controlled by 5 giants.'
		},
		'transit-food-access': {
			type: 'image',
			src: transitMapImg,
			alt: 'Map showing transit networks and potential food access zones.'
		},
		'public-option': {
			type: 'image',
			src: publicGrocerImg,
			alt: 'Proposed model for a national network of 50 public grocery stores.'
		},
		'coop-option': {
			type: 'image',
			src: foodCoopImg,
			alt: 'Illustration of community benefits provided by food co-operatives.'
		},
		'civic-infrastructure': {
			type: 'image',
			src: civicInfraImg,
			alt: 'Diagram comparing top-down public grocers with bottom-up food co-ops.'
		}
	};

	/**
	 * Flatten all panels, tagging each with a globally-unique uid
	 */
	const allPanels = sections.flatMap((section, si) =>
		section.panels.map((panel) => ({
			...panel,
			uid: `${si}:${panel.id}`,
			config: visConfig[panel.id] ?? null
		}))
	);

	/**
	 * Flatten sections into steps for Scroller
	 */
	const scrollySections = sections.slice(0, 5);
	const inlineSections = sections.slice(5);

	const steps = scrollySections.flatMap((section, si) => {
		const defaultId = section.panels[0]?.id;
		return section.blocks.map((block) => {
			const pid = block.panelId ?? defaultId;
			const valid = section.panels.some((p) => p.id === pid);
			return { ...block, panelUid: pid ? `${si}:${valid ? pid : defaultId}` : null };
		});
	});

	// Reactive state
	let activeIndex = $state(0);
	let activePanelUid = $derived(steps[activeIndex]?.panelUid ?? allPanels[0]?.uid);

	// Progress bar items
	const navSections = scrollySections.map((section, si) => ({
		firstStepIndex: steps.findIndex((s) => s.panelUid?.startsWith(`${si}:`)),
		label: section.blocks.find((b) => b.heading)?.heading ?? `Section ${si + 1}`
	}));

	const inlineNavSections = inlineSections.map((section, si) => ({
		id: `inline-section-${si}`,
		label:
			section.blocks.find((b) => b.heading)?.heading ?? `Section ${si + 1 + scrollySections.length}`
	}));

	const items = [
		{ type: 'anchor', id: 'report-header', label: 'Introduction' },
		{ type: 'anchor', id: 'report-findings', label: 'Key Takeaways' },
		...navSections.map((s) => ({
			type: 'step',
			stepIndex: s.firstStepIndex,
			label: s.label,
			isFirstInSection: true
		})),
		...inlineNavSections.map((s) => ({
			type: 'anchor',
			id: s.id,
			label: s.label,
			isFirstInSection: true
		}))
	];
</script>

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

	{#snippet renderPanel(uid, isVisible)}
		{@const panel = allPanels.find((p) => p.uid === uid)}
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

	<Scroller bind:activeIndex threshold={0.5}>
		{#snippet text()}
			{#each steps as step, i}
				<TextBlock
					index={i}
					active={activeIndex === i}
					eyebrow={step.eyebrow}
					heading={step.heading}
					body={step.body}
					cta={step.cta}
					showInlineVisual={!!step.panelUid &&
						(i === 0 || steps[i].panelUid !== steps[i - 1].panelUid)}
				>
					{#snippet inlineVisual()}
						{@render renderPanel(step.panelUid, true)}
					{/snippet}
				</TextBlock>
			{/each}
		{/snippet}

		{#snippet visual()}
			<VisContainer>
				{#each allPanels.filter( (p) => scrollySections.some( (s, si) => s.panels.some((sp) => `${si}:${sp.id}` === p.uid) ) ) as panel (panel.uid)}
					{@render renderPanel(panel.uid, activePanelUid === panel.uid)}
				{/each}
			</VisContainer>
		{/snippet}
	</Scroller>

	<div class="inline-article">
		{#each inlineSections as section, si}
			<div class="inline-section" id="inline-section-{si}">
				{#each section.blocks as block, i}
					{@const panelIds = block.panelIds ?? (block.panelId ? [block.panelId] : [])}

					<div class="inline-block">
						{#if block.eyebrow}
							<div class="text-xs uppercase tracking-widest text-zinc-500 mb-1">
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
					</div>
				{/each}
			</div>
		{/each}
	</div>
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
		margin-bottom: 0.5rem;
	}

	.inline-body {
		margin-bottom: 2rem;
	}

	.inline-cta {
		margin-bottom: 2rem;
	}

	/* Force VisPanel to behave appropriately in inline contexts if needed */
	:global(.vis-panel) {
		transition:
			opacity 0.3s ease,
			transform 0.3s ease;
	}

	@media (max-width: 768px) {
		.inline-article {
			margin: 2em auto;
		}
	}
</style>
