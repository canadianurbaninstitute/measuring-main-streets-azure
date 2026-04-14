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
	import introImage from '../../../lib/assets/screenshots/IntroHeader.png';
	// Charts
	import { onMount } from 'svelte';
	import train from '../../../lib/assets/graphics/train-long.svg';
	import mississauga from '../../assets/mississauga.png';
	import montreal from '../../assets/montreal.png';
	import renfrew from '../../assets/renfrew.png';

	import arbutus from '../../../lib/assets/screenshots/arbutus.png';
	import casestudypanama from '../../../lib/assets/screenshots/case-study-arbutus.png';
	import ccmartindale from '../../../lib/assets/screenshots/cc-martindale.png';
	import cc from '../../../lib/assets/screenshots/cc.png';
	import dpscooksville from '../../../lib/assets/screenshots/dps-cooksville.png';
	import panama from '../../../lib/assets/screenshots/panama.png';
	import wholivesintsas from '../../../lib/assets/screenshots/who-lives-in-tsas.png';
	import CommuteTime from './charts/CommuteTime.svelte';
	import GatewayCities from './charts/GatewayCities.svelte';
	import HousingNeed from './charts/HousingNeed.svelte';
	import JobGrowthSector from './charts/JobGrowthSector.svelte';
	import Line5 from './charts/Line5.svelte';
	import Line5Line6 from './charts/Line5Line6.svelte';
	import TOD from './charts/TOD.svelte';
	import UrbanPop from './charts/UrbanPop.svelte';
	import UrbanPopLineChart from './charts/UrbanPopLineChart.svelte';

	// Data
	let JobGrowthSectorData = $state(null);

	const visConfig = {
		'urban-pop': { type: 'component', component: UrbanPop },
		'urban-pop-growth': { type: 'component', component: UrbanPopLineChart },
		'urban-economy': { type: 'component', component: JobGrowthSector },
		gateway: { type: 'component', component: GatewayCities },
		housing: { type: 'component', component: HousingNeed },
		commute: { type: 'component', component: CommuteTime },
		development: { type: 'component', component: TOD },
		line5: { type: 'component', component: Line5Line6 },
		pipeline: { type: 'component', component: Line5 },
		forces: {
			type: 'image',
			src: renfrew,
			alt: 'Catchment area map example for Renfrew Station'
		},
		forces2: {
			type: 'image',
			src: mississauga,
			alt: 'Major Transit Station Area Map Mississauga'
		},
		forces3: {
			type: 'image',
			src: montreal,
			alt: 'Les aires TOD de Montréal'
		},
		cc: {
			type: 'image',
			src: cc,
			alt: 'Screenshot of complete communities tool showing 95% overall score for 1 Street SW in Calgary.',
			fit: 'cover',
			aspect: '16/9'
		},
		cc2: {
			type: 'image',
			src: ccmartindale,
			alt: 'Screenshot of complete communities tool showing 26% overall score for Martindale in Calgary.',
			fit: 'cover',
			aspect: '16/9'
		},
		walkability: {
			type: 'image',
			src: arbutus,
			alt: 'Walkability map of Arbutus Station area.',
			fit: 'cover',
			aspect: '4/3'
		},
		walkability2: {
			type: 'image',
			src: panama,
			alt: 'Walkability map of Panama Station area.',
			fit: 'cover',
			aspect: '4/3'
		},
		benefits: {
			type: 'image',
			src: casestudypanama,
			alt: 'Screenshot of case study for Arbutus Station by School of Cities'
		},
		displacement: {
			type: 'image',
			src: wholivesintsas,
			alt: 'Screenshot of Who Lives in TSAs infographic report'
		},
		dps: {
			type: 'image',
			src: dpscooksville,
			alt: 'Screenshot of community poll for Cooksville by Digital Public Square'
		}
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
	const scrollySections = sections.slice(0, 6);
	const inlineSections = sections.slice(6);

	/**
	 * Flatten stations up to section 6 into steps for Scroller
	 */
	const steps = scrollySections.flatMap((section, si) => {
		const defaultId = section.panels?.[0]?.id;
		return section.blocks.map((block) => {
			const pids = block.panelIds ?? (block.panelId ? [block.panelId] : [defaultId]);
			const uids = pids.map((pid) => {
				const valid = section.panels.some((p) => p.id === pid);
				return `${si}:${valid ? pid : defaultId}`;
			});
			return { ...block, panelUids: uids, panelUid: uids[0] };
		});
	});

	// ── Reactive state ───────────────────────────────────────────────────────
	let activeIndex = $state(0);
	let activePanelUid = $derived(steps[activeIndex]?.panelUid ?? allPanels[0]?.uid);

	// ── Progress bar ──────────────────────────────────────────────────────────
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
</script>

<main>
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
					showInlineVisual={step.panelUid &&
						(i === 0 || steps[i].panelUid !== steps[i - 1].panelUid)}
				>
					{#snippet inlineVisual()}
						<div class="scrolly-inline-vis-grid" class:multi={step.panelUids.length > 1}>
							{#each step.panelUids as uid}
								<div class="vis-grid-item">
									{@render renderPanel(uid, true)}
								</div>
							{/each}
						</div>
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

	<div class="inline-article">
		{#each inlineSections as section, si}
			<div class="inline-section" id="inline-section-{si}">
				{#each section.blocks as block, i}
					{@const panelIds = block.panelIds ?? (block.panelId ? [block.panelId] : [])}
					{@const prevPanelIds =
						i > 0
							? (section.blocks[i - 1].panelIds ??
								(section.blocks[i - 1].panelId ? [section.blocks[i - 1].panelId] : []))
							: []}
					{@const changed = panelIds.join(',') !== prevPanelIds.join(',')}

					<div class="inline-block">
						{#if block.heading}
							<h3 class="inline-heading">{block.heading}</h3>
						{/if}
						<div class="inline-body">{@html block.body}</div>

						{#if block.cta}
							<div class="inline-cta">
								<VisLink href={block.cta.href} label={block.cta.label} />
							</div>
						{/if}

						<!-- Render panels if they changed from previous block -->
						{#if changed && panelIds.length > 0}
							<div class="inline-vis-container" class:multi-vis={panelIds.length > 1}>
								{#each panelIds as pid}
									{@const p = section.panels.find((sp) => sp.id === pid)}
									{#if p}
										<div class="inline-vis-item">
											{@render renderPanel(`${si + scrollySections.length}:${p.id}`, true)}
										</div>
									{/if}
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</div>
</main>

<style>
	.chart {
		border: 1px solid #eee;
		padding: 1em;
		border-radius: 0.5em;
		min-width: 1px;
		min-height: 1px;
		height: 100%;
		gap: 0.3em;
	}

	.scrolly-inline-vis-grid {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.scrolly-inline-vis-grid.multi {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1rem;
		padding: 1rem;
	}

	.vis-grid-item {
		width: 100%;
		height: 100%;
		min-height: 400px;
		position: relative;
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
		margin-bottom: 0.5rem;
	}

	.inline-body {
		margin-bottom: 2rem;
	}

	.inline-cta {
		margin-bottom: 2rem;
	}

	.inline-visual-wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: fit-content;
		min-height: 450px;
		margin: 2rem 0;
		background: #ffffff;
		border: 1px solid #eee;
		border-radius: 8px;
		overflow: hidden;
		position: relative;
	}

	.inline-vis-container {
		width: 100vw;
		margin-left: calc(-50vw + 50%);
		display: flex;
		justify-content: center;
		padding: 2rem 1rem;
		background-color: var(--color-zinc-50);
		border-top: 1px solid #eee;
		border-bottom: 1px solid #eee;
		position: relative;
		min-height: 50vh;
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

	.inline-vis-container:not(.multi-vis) .inline-vis-item {
		width: 100%;
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

		.inline-vis-container :global(.vis-panel),
		:global(.text-column .vis-panel) {
			padding: 1rem;
			height: auto;
			min-height: 400px;
		}
	}
</style>
