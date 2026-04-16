<script>
	// Components
	import '../../../styles.css';
	import ReportHeader from '../../components/ReportHeader.svelte';
	import ReportFindings from '../../components/ReportFindings.svelte';
	import Scroller from '../../components/Scroller.svelte';
	import TextBlock from '../../components/TextBlock.svelte';
	import VisContainer from '../../components/VisContainer.svelte';
	import VisImage from '../../components/VisImage.svelte';
	import VisLink from '../../components/VisLink.svelte';
	import VisPanel from '../../components/VisPanel.svelte';
	import { sections } from './article.js';

	// Assets
	import HeaderImage from './assets/HeaderImage.png';
	import train from '../../../lib/assets/graphics/train-long.svg';
	import buildings from './assets/buildings.png';
	import indicators from './assets/indicators.png';
	import stncomp from './assets/stncomp.png';

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
			type: 'image',
			src: indicators,
			alt: 'Example of land availability and growth pressure indicators for a station'
		}
	};

	const allPanels = sections.flatMap((section, si) =>
		section.panels.map((panel) => ({
			...panel,
			uid: `${si}:${panel.id}`,
			config: visConfig[panel.id] ?? null
		}))
	);

	const scrollySections = sections;
	const inlineSections = [];

	const steps = scrollySections.flatMap((section, si) => {
		const defaultId = section.panels[0].id;
		return section.blocks.map((block) => {
			const pid = block.panelId ?? defaultId;
			const valid = section.panels.some((p) => p.id === pid);
			return { ...block, panelUid: `${si}:${valid ? pid : defaultId}` };
		});
	});

	let activeIndex = $state(0);
	let activePanelUid = $derived(steps[activeIndex]?.panelUid ?? allPanels[0]?.uid);

	const navSections = scrollySections.map((section, si) => ({
		firstStepIndex: steps.findIndex((s) => s.panelUid.startsWith(`${si}:`)),
		label: section.blocks.find((b) => b.heading)?.heading ?? `Section ${si + 1}`
	}));

	const inlineNavSections = inlineSections.map((section, si) => ({
		id: `inline-section-${si}`,
		label:
			section.blocks.find((b) => b.heading)?.heading ?? `Section ${si + 1 + scrollySections.length}`
	}));

	const items = [
		{ type: 'anchor', id: 'report-header', label: 'Introduction' },
		{ type: 'anchor', id: 'report-findings', label: 'Key Findings' },
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
	<!-- <ProgressBar iconType="custom" activeStepIndex={activeIndex} totalSteps={steps.length} {items}>
		{#snippet icon()}
			<img src={train} width="100%" height="100%" alt="Progress icon" />
		{/snippet}
	</ProgressBar> -->

	<ReportHeader
		id="report-header"
		title="HIGH POTENTIAL"
		subEyebrow="Exploring Housing Development Potential in Transit Station Areas"
		subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
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
					<Component visible={isVisible} />
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
					showInlineVisual={!!step.panelId &&
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
				{#each allPanels.filter( (p) => scrollySections.some( (s) => s.panels.some((sp) => sp.id === p.id) ) ) as panel (panel.uid)}
					{@render renderPanel(panel.uid, activePanelUid === panel.uid)}
				{/each}
			</VisContainer>
		{/snippet}
	</Scroller>
</main>
