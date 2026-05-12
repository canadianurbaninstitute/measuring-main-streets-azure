<script>
	import { onMount } from 'svelte';
	import ContactCard from '../../../lib/ui/ContactCard.svelte';
	import '../../../styles.css';
	import ProgressBar from '../../components/ProgressBar.svelte';
	import ReportHeader from '../../components/ReportHeader.svelte';
	import VisImage from '../../components/VisImage.svelte';
	import VisLink from '../../components/VisLink.svelte';
	import VisPanel from '../../components/VisPanel.svelte';
	// Assets
	import train from '../../../lib/assets/graphics/train-long.svg';
	import goldenMileStudyArea from './assets/GoldenMileStudyArea.png';
	import introImage from './assets/HeaderImage.png';
	import macroScale from './assets/MacroScaleInterventions.png';
	import reimaginingGoldenMile from './assets/ReimaginingGoldenMile.png';
	import goldenMileBuildings from './assets/test.png';

	import { sections } from './article.js';

	const inlineSections = sections.slice(0);

	const scrollySections = [];

	const visConfig = {
		gmstudyarea: { type: 'image', src: goldenMileStudyArea, alt: 'Map of Golden Mile boundary' },
		gmbuildings: {
			type: 'image',
			src: goldenMileBuildings,
			alt: 'Rendering of proposed, approved, and existing buildings on the Golden Mile'
		},
		reimagining: {
			type: 'image',
			src: reimaginingGoldenMile,
			alt: 'Diagram highlighting key components of Golden Mile development'
		},
		macro: {
			type: 'image',
			src: macroScale,
			alt: 'Map of potential placement of resources in the Golden Mile, including community centres, green spaces, medical, restaurants, and schools'
		}
	};

	const allPanels = sections.flatMap((section, si) =>
		section.panels.map((panel) => ({
			...panel,
			uid: `${si}:${panel.id}`,
			config: visConfig[panel.id] ?? null
		}))
	);

	const steps = sections.flatMap((section, si) => {
		return section.blocks.map((block, bi) => ({
			...block,
			sectionIndex: si,
			blockIndex: bi
		}));
	});

	let activeIndex = $state(0);

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

	const items = $derived.by(() => {
		const nav = [{ type: 'anchor', id: 'report-header', label: 'Introduction' }];

		sections.forEach((section, si) => {
			const firstStepIndex = steps.findIndex((s) => s.sectionIndex === si);
			const heading = section.blocks.find((b) => b.heading)?.heading;

			if (heading) {
				nav.push({
					type: 'anchor',
					id: `inline-section-${si}`,
					label: heading,
					stepIndex: firstStepIndex,
					isFirstInSection: true
				});
			}
		});

		nav.push({ type: 'anchor', id: 'team', label: 'Project Team' });

		return nav;
	});
</script>

<ReportHeader
	id="report-header"
	logo={'soc'}
	reporttype="Student Project"
	subEyebrow="A Case Study of the Scarborough Golden Mile"
	title="GROUND FLOOR"
	subtitle="The Scarborough Golden Mile is at the centre of one of Toronto's most significant urban transformations. 
    How can this rapidly densifying community be designed to support a vibrant, inclusive, and resilient neighbourhood?"
	backgroundImage={introImage}
	scrollTargetId="main"
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
<main>
	<ProgressBar iconType="custom" activeStepIndex={activeIndex} totalSteps={steps.length} {items}>
		{#snippet icon()}
			<img src={train} width="100%" height="100%" alt="Progress icon" />
		{/snippet}
	</ProgressBar>

	<div class="center" id="main">
		<div class="card italic text-center mt-20 mx-8">
			This report was prepared by fourth-year undergraduate students at the University of Toronto as
			part of the School of Cities' Multidisciplinary Urban Capstone Project, in collaboration with
			the Canadian Urban Institute.
		</div>
	</div>
	<div class="inline-article">
		{#each inlineSections as section, si}
			<div class="inline-section" id="inline-section-{si}">
				{#each section.blocks as block, i}
					{@const globalStepIndex = steps.findIndex(
						(s) => s.sectionIndex === si && s.blockIndex === i
					)}
					{@const panelIds = block.panelIds ?? (block.panelId ? [block.panelId] : [])}
					{@const prevPanelIds =
						i > 0
							? (section.blocks[i - 1].panelIds ??
								(section.blocks[i - 1].panelId ? [section.blocks[i - 1].panelId] : []))
							: []}
					{@const changed = panelIds.join(',') !== prevPanelIds.join(',')}

					<div class="inline-block" data-step={globalStepIndex}>
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
	<div class="team-header">
		<h2>Project Team</h2>
	</div>

	<div
		class="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2 max-w-2xl mx-auto justify-items-center"
		id="team"
	>
		<ContactCard
			title="Fouad Agha"
			link="https://www.linkedin.com/in/fouad-agha-60478b1a8"
			description="Student | University of Toronto"
		/>
		<ContactCard
			title="Luke Lee"
			link="https://www.linkedin.com/in/luke-lee10/"
			description="Student | University of Toronto"
		/>
		<ContactCard
			title="Nathan Saunders-DeGuire"
			link="https://www.linkedin.com/in/nathan-deguire-195224198"
			description="Student | University of Toronto"
		/>
		<ContactCard
			title="Arjun Yanglem"
			link="https://www.linkedin.com/in/arjun-singh-yanglem/"
			description="Student | University of Toronto"
		/>
		<ContactCard
			title="Youjia Zhang"
			link="https://www.linkedin.com/in/youjia-zhang-3aa989263"
			description="Student | University of Toronto"
		/>
	</div>
</main>

<style>
	.card {
		background-color: #0a1f44;
		color: #fff;
		border-radius: 0.5rem;
		padding: 2rem 1.5rem;
		height: 100%;
		box-sizing: border-box;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		max-width: 500px;
	}
	.center {
		display: flex;
		justify-content: center;
		align-items: center;
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
	.inline-vis-container :global(.vis-panel) {
		position: relative;
		opacity: 1 !important;
		transform: none !important;
		pointer-events: auto !important;
		width: 100%;
		height: 100%;
	}

	@media (max-width: 768px) {
		.inline-vis-container {
			padding: 2rem 0;
			min-height: auto;
		}

		.inline-vis-container.multi-vis {
			flex-direction: column;
			/* gap: 4rem; */
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
			min-height: 100%;
		}
	}
	.team-header {
		display: flex;
		margin: 0 auto 2rem;
		width: fit-content;
		flex-direction: column;
	}
	@media (min-width: 640px) {
		.team {
			flex-direction: row;
		}
	}
</style>
