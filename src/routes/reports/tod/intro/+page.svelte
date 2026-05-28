<script lang="ts">
	import { onMount } from 'svelte';
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
	import { sections } from './article';
	// Assets
	import train from '../../../lib/assets/graphics/train-long.svg';
	import introImage from '../../../lib/assets/screenshots/IntroHeader.png';
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
	// Charts
	import type {
		AnchorItem,
		Block,
		NavItem,
		Panel,
		Section,
		StepItem,
		VisConfigItem
	} from '../../components/Template.d.ts';
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
	let jobGrowthSectorData = $state<any[] | null>(null);

	const visConfig: Record<string, VisConfigItem> = {
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

	const allPanels: Panel[] = sections.flatMap((section, si) =>
		section.panels.map((panel) => ({
			...panel,
			uid: `${si}:${panel.id}`,
			config: visConfig[panel.id] ?? null
		}))
	);

	const scrollySections: Section[] = sections.slice(0, 6);
	const inlineSections: Section[] = sections.slice(6);

	const steps: Block[] = scrollySections.flatMap((section, si) => {
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
	const activePanelUid = $derived(steps[activeIndex]?.panelUid ?? allPanels[0]?.uid);

	// ── Progress bar items mapping ───────────────────────────────────────────
	const navSections = scrollySections.map((section, si) => ({
		firstStepIndex: steps.findIndex((s) => s.panelUid?.startsWith(`${si}:`)),
		label: section.blocks.find((b) => b.heading)?.heading ?? `Section ${si + 1}`
	}));

	const inlineNavSections = inlineSections.map((section, si) => ({
		id: `inline-section-${si}`,
		label:
			section.blocks.find((b) => b.heading)?.heading ?? `Section ${si + 1 + scrollySections.length}`
	}));

	const items = $derived.by<NavItem[]>(() => {
		return [
			{ type: 'anchor', id: 'report-header', label: 'Introduction' },
			{ type: 'anchor', id: 'report-findings', label: 'Key Findings' },
			...navSections.map(
				(s) =>
					({
						type: 'step',
						stepIndex: s.firstStepIndex,
						label: s.label,
						isFirstInSection: true
					}) as StepItem
			),
			...inlineNavSections.map(
				(s) =>
					({
						type: 'anchor',
						id: s.id,
						label: s.label,
						isFirstInSection: true
					}) as AnchorItem
			)
		];
	});

	onMount(async () => {
		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/reports/intro/03_jobsectorgrowth.json'
			);
			jobGrowthSectorData = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	});
</script>

{#snippet renderPanel(uid: string, isVisible: boolean)}
	{@const panel = allPanels.find((p) => p.uid === uid)}
	{#if panel}
		<VisPanel visible={isVisible} label={panel.label ?? ''} source={panel.source ?? ''}>
			{#if panel.config?.type === 'image'}
				<VisImage
					src={panel.config.src}
					alt={panel.config.alt}
					caption={panel.config.caption ?? ''}
					fit={panel.config.fit as 'none' | 'fill' | 'cover' | 'contain' | 'scale-down' | undefined}
					aspect={panel.config.aspect}
				/>
			{:else if panel.config?.type === 'component'}
				{@const Component = panel.config.component}
				<Component
					visible={isVisible}
					data={panel.id === 'urban-economy' ? jobGrowthSectorData : undefined}
				/>
			{:else if panel.config?.type === 'link'}
				<VisLink
					href={panel.config.href}
					target={panel.config.target}
					label={panel.config.btnLabel ?? 'Learn More'}
				/>
			{/if}
		</VisPanel>
	{/if}
{/snippet}

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
		description1="are vital to maintaining growth in Canada’s largest urban regions."
		finding2="Communities are only complete"
		description2="if they are walkable."
		finding3="Not all transit projects"
		description3="deliver the same return."
	/>

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
					(i === 0 || steps[i].panelUid !== steps[i - 1].panelUid)
						? true
						: false}
				>
					{#snippet inlineVisual()}
						<div
							class="scrolly-inline-vis-grid"
							class:multi={step.panelUids?.length && step.panelUids.length > 1}
						>
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
					{@render renderPanel(panel.uid ?? '', activePanelUid === panel.uid)}
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
								<VisLink href={block.cta.href} target={block.cta.target} label={block.cta.label} />
							</div>
						{/if}

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
		position: relative;
	}

	.inline-article {
		max-width: 65ch;
		display: flex;
		flex-direction: column;
		gap: 0rem;
		margin: auto;
	}

	.inline-section {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		margin: auto;
		width: 100%;
	}

	.inline-heading {
		margin-top: 3rem;
		margin-bottom: 0.5rem;
		padding: 0 1.5rem;
	}

	.inline-body {
		margin-bottom: 2rem;
		padding: 0 1.5rem;
	}

	.inline-cta {
		margin-bottom: 2rem;
		padding: 0 1.5rem;
	}

	.inline-vis-container {
		width: 100vw;
		position: relative;
		left: 50%;
		right: 50%;
		margin-left: -50vw;
		margin-right: -50vw;
		display: flex;
		justify-content: center;
		padding: 4rem 3rem;
		background-color: var(--color-zinc-50);
		border-top: 1px solid #eee;
		border-bottom: 1px solid #eee;
	}

	.inline-vis-container.multi-vis {
		flex-direction: row;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0rem;
	}

	.inline-vis-item {
		flex: 1 1 400px;
		max-width: 1000px;
		padding: 2rem;
		display: flex;
		flex-direction: column;
	}

	.inline-vis-container:not(.multi-vis) .inline-vis-item {
		width: 100%;
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
	}

	@media (max-width: 768px) {
		.inline-vis-container {
			padding: 0 0;
		}

		.inline-vis-container.multi-vis {
			flex-direction: column;
			gap: 0;
		}

		.inline-vis-item {
			flex: 0 0 auto;
			width: 100%;
			max-width: none;
			display: flex;
		}
	}
</style>
