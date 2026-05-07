<script>
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
	import { sections } from './article.js';

	import train from '../../../lib/assets/graphics/train-long.svg';
	import ETOAHComponents from './ETOAHComponents.svelte';
	import HeaderImage from './assets/HeaderImage.png';
	import boarding from './assets/boarding.png';
	import buildings from './assets/buildings.png';
	import interior from './assets/bus-interior.png';
	import conclusion from './assets/conclusion.png';
	import intro2 from './assets/elevated-train.png';
	import intro5 from './assets/gobus.png';
	import intro from './assets/intro.png';
	import octranspo from './assets/octranspo.png';
	import skytrain from './assets/skytrain.png';
	import intro3 from './assets/train-passing.png';
	import intro4 from './assets/ttc-subway.png';

	const visConfig = {
		'etoah-components': {
			type: 'component',
			component: ETOAHComponents
		},
		'etoah-components1': {
			type: 'component',
			component: ETOAHComponents,
			props: { highlight: 1 }
		},
		'etoah-components2': {
			type: 'component',
			component: ETOAHComponents,
			props: { highlight: 2 }
		},
		'etoah-components3': {
			type: 'component',
			component: ETOAHComponents,
			props: { highlight: 3 }
		},
		intro: {
			type: 'image',
			src: intro,
			alt: 'Exterior view of apartment building balconies'
		},
		intro2: {
			type: 'image',
			src: intro2,
			alt: 'Elevated train passing on bridge'
		},
		intro3: {
			type: 'image',
			src: intro3,
			alt: 'Train passing platform'
		},
		intro4: {
			type: 'image',
			src: intro4,
			alt: 'TTC Subway car on elevated track'
		},
		intro5: {
			type: 'image',
			src: intro5,
			alt: 'Train passing platform'
		},
		etoah: {
			type: 'image',
			src: boarding,
			alt: 'Several people boarding a bus'
		},
		etoah2: {
			type: 'image',
			src: buildings,
			alt: 'Exterior of a building'
		},
		action: {
			type: 'image',
			src: interior,
			alt: 'People sitting in a public bus interior'
		},
		action2: {
			type: 'image',
			src: octranspo,
			alt: 'An elevated OC Transpo train passing'
		},
		community: {
			type: 'image',
			src: skytrain,
			alt: 'An elevated Skytrain passing'
		},
		community2: {
			type: 'image',
			src: conclusion,
			alt: 'Exterior of a subway station with a large glass facade'
		}
	};

	const allPanels = sections.flatMap((section, si) =>
		section.panels.map((panel) => ({
			...panel,
			uid: `${si}:${panel.id}`,
			sectionIndex: si,
			config: visConfig[panel.id] ?? null
		}))
	);

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

	let activeIndex = $state(0);
	let activePanelUid = $derived(steps[activeIndex]?.panelUid ?? allPanels[0]?.uid);

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

		nav.push({ type: 'anchor', id: 'contact', label: 'Contact' });
		nav.push({ type: 'anchor', id: 'references', label: 'References' });

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
		logo={'catch'}
		subEyebrow="How Communities Can Ensure Transit-Oriented Development Works for Everyone"
		title="TRANSIT WITHOUT DISPLACEMENT"
		subtitle="Inclusive, equitable transit-oriented development is possible with the right approach. As Canada invests billions in transit infrastructure, 
    knowing how to unlock this potential is key."
		backgroundImage={HeaderImage}
	/>

	<ReportFindings
		id="report-findings"
		title="KEY TAKEAWAYS"
		finding1="Transit doesn’t automatically cause displacement."
		description1="Rather, it creates conditions that, without intervention, frequently lead to the erosion of affordability near transit lines."
		finding2="Equitable Transit-Oriented Affordable Housing"
		description2="is an evidence-based framework that makes affordability and inclusion core to the development process."
		finding3="Canada’s housing crisis"
		description3="is a mosaic of local shortages that demands coordinated, place-based solutions."
	/>
	<div class="center mt-12">
		<iframe
			width="840"
			height="473"
			src="https://www.youtube.com/embed/-TLSM14PnTQ?si=Lf4ROdgCjBfmE4j3"
			title="YouTube video player"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			referrerpolicy="strict-origin-when-cross-origin"
			allowfullscreen
		></iframe>
	</div>
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

	<div class="inline-article" id="contact">
		Learn more about CATCH and access the ETOAH toolkit:
		<div class="inline-cta">
			<VisLink href="https://catch-rehac.ca/" label="Learn More" />
		</div>
		Cities, investors, policymakers, and partners interested in joining local collaboratives can contact
		info@catch-rehac.ca:
		<div class="inline-cta">
			<VisLink href="mailto:info@catch-rehac.ca" label="Contact CATCH" />
		</div>
	</div>
	<div class="inline-article" id="references">
		<h2>References</h2>
		<p>
			<sup>[1]</sup><a
				href="https://www.cirrelt.ca/documentstravail/cirrelt-2013-06.pdf"
				target="_blank">Grube-Cavers & Patterson, 2013</a
			>;
			<a
				href="https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1540-6229.2007.00186.x"
				,
				target="_blank">Kahn, 2007</a
			>
		</p>
		<p>
			<sup>[2]</sup><a href="/reports/tod/displacement" target="_blank"
				>Allen, Chapple & Forouhar, 2026</a
			>
		</p>
		<p>
			<sup>[3]</sup><a
				href="https://homelesshub.ca/wp-content/uploads/2024/04/Lewis-Financialization-Racialized-Impacts-ofha-en.pdf"
				target="_blank">Lewis, 2022</a
			>;
			<a
				href="https://cutaactu.ca/wp-content/uploads/2025/08/2023-CUTA-Housing-Is-On-The-Line.pdf#:~:text=High%20land%20acquisition%20costs%20near%20transit%20stations,most%20being%20priced%20out%20of%20these%20areas."
				target="_blank">Canadian Urban Transit Association, 2023</a
			>
		</p>
		<p>
			<sup>[4]</sup><a
				href="https://watermark02.silverchair.com/9780262352901_cam.pdf?token=AQECAHi208BE49Ooan9kkhW_Ercy7Dm3ZL_9Cf3qfKAc485ysgAAA0QwggNABgkqhkiG9w0BBwagggMxMIIDLQIBADCCAyYGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMMeoCWKYFZlRZRXD_AgEQgIIC95E4nss-fuw0FC8ADW5KUASCqs04ia9sdXcaBNM3Kl8Y8ToLQ5XxPFLHxa-5Bty2tNzZ5-2mgtmWHjyMrlcVLJ6BanpUm4vLwZy2IIpxNOswT8rEHcZ5RhLnDaAPNAKzcd8kW8khtK9t1b9I_i4wRmWYEmpjTfa3iMlgp6ZuAvVRnehHF86obsLNud70Uy4aAjSd_pYKAIEF_hltKgxw5-1NWFB4McU8cdmo7df049KG634FVQ0ICAsw_FC29nlnIzhRJRE9g6cLdzTjbxvjGKJcflAbVxyp4P6PIWLpXJrpv1rebfeSMXuwjOdERhvTMa16qxsCb7KOIRL7bf8MB4loBalD8NF5RXvWpkuOZAmlUwt5w2cuGt1XOMyrJTRQFQ1OMGcJTldydfE9VWcq-baf_NIWIgz63GL4eKoY10X-b8uAGbO7b7JOBkb1MXJKcS94Rd3lzItpnu9_iWBjE4ZW8wgBGMLimCNPyndGwfuhPl8Cor6Iz_Dq-AYWdevLqu2Spv2PDjY3yhfYigzdbk30Wpa0mt0qfwg0cb6dugzXXO55CROKR0C-F9RInEOiW2w0W1nuQIVUNagDfoCcj_9nMaxzBZkJFpLH62pXx-xcW1i1Gmpmhc-yitNbo3hyVIEThsPsoKuGBd56Vs9iTMMPJhwMBq-0k02ER8oZJW2d54Q8vTPE-cz7GhPGBoZbYTkp6djQrkEqO3XC0wKaX6MqtaA39pIoJ8k0xX2Y7kxtSQj9jB1tCXYEdvBc2-U12hkmZCls8KEoiZ8BvWimnq-8luT7Bf7WW5zDJctHF4WuF1r7jttB41JVY3I10GpSg1sy5lbPU1buFc_SFnuv7hv9_lPUEG3iHRBLct_D-dxKoWbRpGi8mkvXp3W4AL0RGZ8WZ6OtlexRgtEp_TEpi_cphfdgtCJfYnZ8KhSNj58rxbaYVQmsXk96eqZNIV7Az64TBOX6RwiYEg2qaxSJtAvF0O7kGA4STjEVDkZ-1K3kDeqqHWTXTw"
				target="_blank">Chapple & Loukaitou-Sideris, 2019</a
			>
		</p>
		<p>
			<sup>[5]</sup>
			<a href="/reports/tod/displacement" target="_blank">Allen, Chapple & Forouhar, 2026</a>;
			<a href="/reports/tod/intro" target="_blank">Canadian Urban Institute, 2026</a>
		</p>
		<p>
			<sup>[6]</sup>
			<a href="https://www.reimaginerpe.org/files/TRN_Equity_final%282%29.pdf" target="_blank"
				>Pollack, Bluestone & Billingham, 2010</a
			>;
			<a href="https://journals.sagepub.com/doi/10.1177/1078087404273341" target="_blank"
				>Freeman, 2005
			</a>;
			<a href="https://www.nber.org/system/files/working_papers/w14036/w14036.pdf" target="_blank">
				McKinnish, Walsh & White, 2008
			</a>;
			<a href="https://www.tandfonline.com/doi/abs/10.1080/02723638.2017.1360041" target="_blank"
				>Immergluck & Balan, 2017</a
			>
		</p>
		<p>
			<sup>[7]</sup>
			<a href="https://onlinelibrary.wiley.com/doi/epdf/10.1111/iere.12556" target="_blank"
				>Chernoff & Craig, 2022</a
			>
		</p>
	</div>
</main>

<style>
	.inline-article {
		max-width: 65ch;
		margin: 4em auto;
		padding: 0 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
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
		margin-bottom: 1rem;
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
	}

	@media (max-width: 768px) {
		.inline-vis-container {
			padding: 2rem 0;
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
		}
	}
	.center {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
