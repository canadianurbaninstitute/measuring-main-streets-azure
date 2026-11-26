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
	import { getLang } from '../../../lib/i18n';
	import { sections as sectionsEn } from './article.js';
	import { sections as sectionsFr } from './article.fr.js';

	const fr = getLang() === 'fr';
	const sections = fr ? sectionsFr : sectionsEn;

	import train from '../../../lib/assets/graphics/train-long.svg';
	import everyone from '../../assets/dps-heart.png';
	import cooksville from '../../assets/dps-cooksville.png';
	import welcome from '../../assets/dps-welcome.png';
	import Safety from './Safety.svelte';
	import Polis from './Polis.svelte';
	import Privacy from './Privacy.svelte';
	import QuoteChart from './QuoteChart.svelte';
	import QuoteGroup from '../../components/QuoteGroup.svelte';

	const visConfig = {
		welcome: {
			type: 'image',
			src: welcome
		},
		cooksville: {
			type: 'image',
			src: cooksville,
			alt: fr
				? 'Illustration de trois personnes devant une enseigne indiquant «\u00a0Cooksville\u00a0»'
				: 'Graphic of 3 people in front of a sign that says "Cooksville"'
		},
		'engagement-summary': {
			type: 'component',
			component: QuoteChart
		},
		safety: {
			type: 'component',
			component: Safety
		},
		cleanliness: {
			type: 'component',
			component: QuoteGroup,
			props: {
				columns: 1,
				quotes: [
					{
						text: fr
							? 'Faites le ménage dans tous les vieux petits commerces sur Dundas, près de Hurontario. C’est sale, il y a de la racaille… est-ce que ça favorise un quartier sécuritaire?'
							: 'Clean up all the old small businesses in Dundas near Hurontario. Dirty riff raff and is it promoting a safe neighborhood?',
						colorFam: 'blue'
					},
					{
						text: fr ? 'Rendre le quartier plus convivial' : 'Make it more neighbourhood friendly',
						colorFam: 'green'
					},
					{
						text: fr
							? 'Un quartier cohérent, où tout est facile d’accès. Plus d’espaces verts, des boutiques intéressantes, pas autant de magasins de cannabis et de vapotage.'
							: 'A cohesive neighborhood, everything easy to get to. More green spaces, interesting stores not so many cannabis and vape places.',
						colorFam: 'pink'
					},
					{
						text: fr
							? 'Les personnes en situation d’itinérance à Cooksville dissuadent les gens de venir magasiner et se promener.'
							: 'The homeless population in cooksville is a deterrent to having people shop and walk around.',
						colorFam: 'orange'
					}
				]
			}
		},
		privacy: {
			type: 'component',
			component: Privacy
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
			{
				type: 'anchor',
				id: 'report-findings',
				label: fr ? 'Points à retenir' : 'Key Takeaways'
			}
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
			<img src={train} width="100%" height="100%" alt={fr ? 'Icône de progression' : 'Progress icon'} />
		{/snippet}
	</ProgressBar>

	<ReportHeader
		id="report-header"
		subEyebrow={fr ? 'Un rapport Love Your Neighbourhood' : 'A Love Your Neighbourhood Report'}
		title="COOKSVILLE"
		subtitle={fr
			? 'Explorer les possibilités des plateformes de consultation numérique pour favoriser une participation plus large des personnes résidant dans les aires de station de transport collectif'
			: 'Exploring the possibilities of digital engagement platforms to facilitate  broader engagement of residents around Transit Station Areas'}
		backgroundImage={cooksville}
		customLogos={[
			{ src: dps, alt: fr ? 'Logo de DPS' : 'DPS Logo', width: '120' },
			{ src: cui, alt: fr ? 'Logo de l’IUC' : 'CUI Logo', width: '200' }
		]}
	/>

	<ReportFindings
		id="report-findings"
		title={fr ? 'POINTS À RETENIR' : 'KEY TAKEAWAYS'}
		finding1={fr ? 'Enjeux de sécurité' : 'Safety Issues'}
		description1={fr
			? 'Les personnes répondantes de Cooksville se sentent nettement moins en sécurité et moins bien accueillies que dans les deux autres quartiers.'
			: 'Respondents from Cooksville feel notably less safe and welcome than the other two neighbourhoods.'}
		link1="#safety"
		finding2={fr ? 'La propreté est une priorité' : 'Cleanliness is a priority'}
		description2={fr
			? 'La sécurité, la propreté et l’esthétique étaient étroitement liées dans l’évaluation que les personnes résidentes faisaient de leur quartier et faisaient largement consensus.'
			: 'Safety, cleanliness, and aesthetics were all tightly linked in how\n\t\t\t\tresidents evaluated their neighbourhood and were widely agreed upon.'}
		link2="#cleanliness"
		finding3={fr
			? 'Du développement, mais seulement s’il est bénéfique'
			: 'Development, but only if it helps'}
		description3={fr
			? 'Les opinions sur les avantages de la densification étaient partagées, tant dans les données qualitatives que dans les données quantitatives.'
			: 'Sentiments towards the benefits of densification were mixed both in\n\t\t\t\tthe qualitative and quantitative insights.'}
		link3="#privacy"
	/>

	{#snippet renderPanel(uid, isVisible, id)}
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
					<Component {...panel.config.props} visible={isVisible} />
				{:else if panel.config?.type === 'link'}
					<VisLink
						href={panel.config.href}
						label={panel.config.btnLabel ?? (fr ? 'En savoir plus' : 'Learn More')}
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
