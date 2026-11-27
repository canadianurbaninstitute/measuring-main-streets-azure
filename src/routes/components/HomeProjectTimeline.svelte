<script lang="ts">
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';
	import car from '../lib/assets/graphics/car.png';
	import train from '../lib/assets/graphics/dark-train.svg';
	import LandingCard from '../lib/ui/LandingCard.svelte';
	// Card assets
	import casestudy from '../lib/assets/screenshots/case-study-arbutus.png';
	import casestudy2 from '../lib/assets/screenshots/case-study.png';
	import dot from '../lib/assets/screenshots/dot.png';
	import reports from '../lib/assets/screenshots/key-findings.png';
	import mainstreetmap from '../lib/assets/screenshots/main-street-map.png';
	import transitmap from '../lib/assets/screenshots/transit-map.png';
	import urbanform from '../lib/assets/screenshots/urban-form.png';
	import reportstsa from '../lib/assets/screenshots/who-tsas.png';
	import CustomButton from '../lib/ui/CustomButton.svelte';
	import '../styles.css';
	import { getLang } from '../lib/i18n';

	const fr = getLang() === 'fr';
	const T = (en: string, frText: string) => (fr ? frText : en);

	// 1. Structure explicit custom component props
	interface Props {
		visible?: boolean;
	}

	let { visible = false }: Props = $props();

	// 2. Set precise type definitions for DOM bindings
	let timelineElement = $state<HTMLElement | null>(null);
	let crossingElement = $state<HTMLElement | null>(null);

	// 3. Define strong types for Spring animation nodes
	const trainOffset = new Spring<number>(-350, { stiffness: 0.1, damping: 0.7 });
	const carOffset = new Spring<number>(0, { stiffness: 0.1, damping: 1 });
	const armAngle = new Spring<number>(0, { stiffness: 0.1, damping: 0.7 });

	let trackX = $state(0);
	let armIsDown = $state(false);

	// 4. Define structural interfaces for the data models
	interface CardItem {
		title: string;
		description: string;
		image: string;
		link: string;
		featured?: boolean;
		tags: string[];
	}

	interface Project {
		phase: string;
		title: string;
		description: string;
		details: string;
		cta: { link: string; label: string; href?: string };
		stat?: string;
		subtext?: string;
		cards: CardItem[];
	}

	onMount(() => {
		const measure = () => {
			if (timelineElement) {
				const rect = timelineElement.getBoundingClientRect();
				trackX = rect.left + 30; // center of the 60px lane
			}
		};

		measure();
		window.addEventListener('resize', measure);

		const handleScroll = () => {
			if (!timelineElement || !crossingElement) return;

			const scrollY = window.scrollY;
			const rect = timelineElement.getBoundingClientRect();
			const elementTop = rect.top + scrollY;
			const maxOffset = timelineElement.offsetHeight - 500;

			// Train position
			const viewportCenter = scrollY + window.innerHeight / 2;
			const centeredOffset = viewportCenter - elementTop;
			trainOffset.target = Math.min(centeredOffset, maxOffset);

			const progress = Math.max(
				0,
				Math.min(
					1,
					(scrollY - elementTop + window.innerHeight * 1) / (timelineElement.offsetHeight * 2)
				)
			);
			const carTargetFull = window.innerWidth - progress * (window.innerWidth * 2);

			// Stop zone: car stops ~80px before the track
			const stopX = trackX - rect.left;

			// Arm comes down when train is in middle portion of its travel
			const trainProgress = trainOffset.target / maxOffset;
			const shouldArmBeDown = trainProgress > 0.2 && trainProgress < 0.95;

			if (shouldArmBeDown !== armIsDown) {
				armIsDown = shouldArmBeDown;
				armAngle.target = armIsDown ? 0 : -90;
			}

			// Car stops if arm is down and car hasn't passed the stop zone yet
			if (armIsDown && carTargetFull <= stopX) {
				carOffset.target = stopX;
			} else {
				carOffset.target = carTargetFull;
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', measure);
		};
	});

	const projects: Project[] = [
		{
			phase: T('PHASE TWO | 2025-2026 ', 'PHASE DEUX | 2025-2026 '),
			title: T('TOD on Main ', 'TOD sur la rue principale '),
			description:
				T('Leveraging transit-oriented development (TOD) to advance housing and community outcomes.', 'Tirer parti de l’aménagement axé sur le transport collectif (TOD) pour faire progresser le logement et le bien-être des collectivités.'),
			details:
				T('Canada has seven rapid transit systems, and the expansion of these networks continues to shape how communities, cities, and regions grow and change. Built on the foundation of the Measuring Main Streets Platform TOD on Main provides tools, case studies, and research to help decision‑makers leverage transit‑driven growth to advance housing goals, support vibrant and complete communities, and challenge the displacement trends often driven by TOD.', 'Le Canada compte sept réseaux de transport collectif rapide, et leur expansion continue de façonner la croissance et la transformation des collectivités, des villes et des régions. Fondé sur la plateforme Mesures des rues principales, TOD sur la rue principale propose des outils, des études de cas et des recherches pour aider les décideurs à tirer parti de la croissance liée au transport collectif afin d’atteindre leurs objectifs en matière de logement, de soutenir des collectivités dynamiques et complètes et de contrer les tendances au déplacement de population souvent associées aux TOD.'),
			cta: { link: '/about/#about-tod', label: T('About Phase Two', 'À propos de la phase deux'), href: '/about/#about-tod' },
			stat: T('4.4 million homes', '4,4\u00a0millions de logements'),
			subtext: T("could be built in Canada's transit station areas", 'pourraient être construits dans les aires de station de transport collectif du Canada'),
			cards: [
				{
					title: T('Transit Map', 'Carte du transport collectif'),
					description:
						T('Explore the major transit station areas and their relationship to main streets.', 'Explorez les aires de station de transport collectif majeures et leur relation avec les rues principales.'),
					image: transitmap,
					link: '/transit-map',
					featured: true,
					tags: ['mapping', 'tool']
				},
				{
					title: T('Case Studies', 'Études de cas'),
					description: T('In depth place-based studies.', 'Études approfondies axées sur des lieux précis.'),
					image: casestudy,
					link: '/casestudies/?tab=tod',
					tags: ['Case Study']
				},
				{
					title: T('Reports', 'Rapports'),
					description: T('In depth reports on transit-oriented development.', 'Rapports approfondis sur l’aménagement axé sur le transport collectif.'),
					image: reportstsa,
					link: '/reports/?tab=tod',
					tags: ['Reports']
				},
				{
					title: T('Tools', 'Outils'),
					description: T('In depth reports on transit-oriented development.', 'Rapports approfondis sur l’aménagement axé sur le transport collectif.'),
					image: urbanform,
					link: '/tools',
					tags: ['Tools']
				}
			]
		},
		{
			phase: T('PHASE ONE | 2023-2024', 'PHASE UN | 2023-2024'),
			title: T('Resilience on Main ', 'Résilience sur la rue principale '),
			description:
				T('Equipping communities to make smarter investments in main streets and downtowns.', 'Outiller les collectivités pour investir plus judicieusement dans les rues principales et les centres-villes.'),
			details:
				T('Coming out of the pandemic, many main streets and downtowns faced a convergence of economic, social, and operational challenges and were poorly positioned for recovery. Resilience on Main responded by delivering first-of-its-kind tools, case studies, and research that re‑scaled critical data to the main street level—equipping leaders and practitioners across Canada with the insights needed to restore activity, support recovery, champion equity, and strengthen long‑term resilience.', 'Au sortir de la pandémie, de nombreuses rues principales et de nombreux centres-villes faisaient face à une convergence de défis économiques, sociaux et opérationnels et étaient mal placés pour la reprise. Résilience sur la rue principale y a répondu en offrant des outils, des études de cas et des recherches uniques en leur genre, qui ramènent des données essentielles à l’échelle de la rue principale, donnant ainsi aux leaders et aux praticiens de partout au Canada les connaissances nécessaires pour relancer l’activité, soutenir la reprise, promouvoir l’équité et renforcer la résilience à long terme.'),
			stat: T('85%', '85\u00a0%'),
			subtext: T('of Canadians live within 1 kilometre from a main street', 'de la population canadienne vit à moins de 1\u00a0kilomètre d’une rue principale'),
			cta: {
				link: '/about/#about-resilience',
				label: T('About Phase One', 'À propos de la phase un'),
				href: '/about/#about-resilience'
			},
			cards: [
				{
					title: T('Main Street Map', 'Carte des rues principales'),
					description: T('Analyzing neighbourhood-scale data for better city building.', 'Analyser des données à l’échelle des quartiers pour mieux bâtir nos villes.'),
					image: mainstreetmap,
					link: '/map',
					featured: true,
					tags: ['mapping', 'tool']
				},
				{
					title: T('Case Studies', 'Études de cas'),
					description: T('In depth place-based studies.', 'Études approfondies axées sur des lieux précis.'),
					image: casestudy2,
					link: '/casestudies/?tab=msr',
					tags: ['Case Study']
				},
				{
					title: T('Reports', 'Rapports'),
					description: T('In depth reports on main street resilience.', 'Rapports approfondis sur la résilience des rues principales.'),
					image: reports,
					link: '/reports/?tab=msr',
					tags: ['Reports']
				},
				{
					title: T('Tools', 'Outils'),
					description: T('Research and analysis tools.', 'Outils de recherche et d’analyse.'),
					image: dot,
					link: '/tools/',
					tags: ['Tools']
				}
			]
		}
	];

	// Crucial: Resize the map when it becomes visible
	$effect(() => {
		if (visible && timelineElement) {
			// Handle dynamic animation resets if visible visibility flag toggles
		}
	});
</script>

<section class="timeline-section bg-slate-50 shadow-large" bind:this={timelineElement}>
	<div class="projects-container">
		<div class="timeline-lane">
			<div class="transit-car" style="top: {trainOffset.current}px;">
				<img src={train} alt="Train" style="width: 60%; height: auto;" />
			</div>
			<div class="dashed-vertical-line"></div>
		</div>

		<div class="projects-list">
			<h2 class="section-title">
				{fr
					? 'Rendre les données plus accessibles pour la vitalité des rues principales et des centres-villes'
					: 'Making Data More Accessible for Main Street & Downtown Vibrancy'}
			</h2>

			<div class="project-entry pb-10">
				<div class="project-content">
					<div class="track-stop"></div>
					<span class="phase-tag">{projects[0].phase}</span>
					<h3 class="project-title">{projects[0].title}</h3>
					<p class="project-desc">{projects[0].description}</p>
					<p class="project-details">{@html projects[0].details}</p>
					<div class="links-group">
						<CustomButton label={projects[0].cta.label} href={projects[0].cta.href} />
					</div>
				</div>
				<div class="project-cards-container">
					<div class="cards-scroll">
						{#each projects[0].cards as card}
							<LandingCard {...card} minWidth={350} maxWidth={350} />
						{/each}
					</div>
				</div>
			</div>

			<div class="crossing-band" bind:this={crossingElement}>
				<div class="road">
					<div class="road-marking"></div>
				</div>

				<div class="crossing-arm-mount">
					<div class="arm-pivot">
						<div class="arm-bar" style="transform: rotate({armAngle.current}deg);">
							<div class="arm-stripes"></div>
						</div>
					</div>
					<div class="signal-post">
						<div class="signal-light" class:active={armIsDown}></div>
					</div>
				</div>

				<div class="road-car" style="transform: translateX({carOffset.current}px);">
					<img src={car} alt={fr ? 'Voiture' : 'Car'} style="width: 100%; height: auto;" />
				</div>
			</div>

			<div class="project-entry pt-10">
				<div class="project-content">
					<div class="track-stop"></div>
					<span class="phase-tag">{projects[1].phase}</span>
					<h3 class="project-title">{projects[1].title}</h3>
					<p class="project-desc">{projects[1].description}</p>
					<p class="project-details">{@html projects[1].details}</p>
					<div class="links-group">
						<CustomButton label={projects[1].cta.label} href={projects[1].cta.href} />
					</div>
				</div>
				<div class="project-cards-container">
					<div class="cards-scroll">
						{#each projects[1].cards as card}
							<LandingCard {...card} minWidth={350} maxWidth={350} />
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	/* Your styles are unchanged and completely valid */
	.timeline-section {
		padding: 6rem 2rem;
		width: 100%;
		margin: 0 auto;
		display: flex;
		justify-content: center;
		overflow: hidden;
	}
	.section-title {
		font-family: 'Inter', sans-serif;
		font-size: 3.5rem;
		color: var(--brandDarkBlue);
	}
	.projects-container {
		display: flex;
		max-width: 1400px;
		justify-content: center;
		gap: 2rem;
		position: relative;
	}
	.timeline-lane {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 60px;
		position: relative;
	}
	.transit-car {
		width: 50px;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 1.5rem;
		z-index: 2;
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
	}
	.dashed-vertical-line {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 4px;
		background-image: linear-gradient(to bottom, var(--brandYellow) 50%, transparent 50%);
		background-size: 100% 20px;
		background-repeat: repeat-y;
	}
	.track-stop {
		position: absolute;
		left: 30px;
		transform: translate(-50%, 45px);
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background-color: var(--color-slate-200);
		border: 3px solid var(--brandDarkBlue);
		z-index: 1;
	}
	.projects-list {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.project-entry {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		gap: 2rem;
		align-items: flex-start;
	}
	.project-cards-container {
		grid-column: 1 / -1;
		width: 100%;
		padding: 1rem 0 0 0;
		position: relative;
		overflow: hidden;
	}
	.cards-scroll {
		display: flex;
		flex-direction: row;
		gap: 2rem;
		padding: 1rem 40px 2rem 40px;
		overflow-x: auto;
		scroll-snap-type: x proximity;
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch;
	}
	.cards-scroll > :global(*) {
		scroll-snap-align: center;
		scroll-snap-stop: always;
		flex-shrink: 0;
	}
	.crossing-band {
		position: relative;
		height: 80px;
		display: flex;
		align-items: center;
		overflow: visible;
	}
	.road-marking {
		position: absolute;
		left: 0;
		right: 0;
		height: 4px;
		background-image: repeating-linear-gradient(
			to right,
			grey 0px,
			grey 30px,
			transparent 30px,
			transparent 60px
		);
	}
	.crossing-arm-mount {
		position: absolute;
		left: -42px;
		top: 0;
		bottom: 0;
		width: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 10;
	}
	.signal-post {
		position: absolute;
		top: 0;
		width: 6px;
		height: 100%;
		background-color: var(--brandDarkBlue);
		border-radius: 3px;
	}
	.signal-light {
		position: absolute;
		top: -10px;
		left: 50%;
		transform: translateX(-50%);
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background-color: #555;
		transition: background-color 0.3s ease;
	}
	.signal-light.active {
		background-color: red;
		box-shadow: 0 0 8px red;
	}
	.arm-pivot {
		position: absolute;
		top: 8px;
		left: 50%;
		transform: translateX(-50%);
		transform-origin: top center;
		z-index: 11;
	}
	.arm-bar {
		transform-origin: top center;
		width: 10px;
		height: 100px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.arm-stripes {
		width: 10px;
		flex: 1;
		background-image: repeating-linear-gradient(
			to bottom,
			var(--brandYellow) 0px,
			var(--brandYellow) 10px,
			var(--brandDarkBlue) 10px,
			var(--brandDarkBlue) 20px
		);
		border-radius: 4px;
	}
	.road-car {
		position: absolute;
		left: 0;
		top: 0;
		transform: translateY(-50%);
		width: 80px;
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 1.5rem;
		z-index: 5;
	}
	.phase-tag {
		font-family: 'Inter', sans-serif;
		font-weight: 700;
		color: var(--brandLightBlue);
		font-size: 0.9rem;
		letter-spacing: 0.05em;
	}
	.project-title {
		font-family: 'Gelasio', serif;
		font-size: 2.5rem;
		color: var(--brandDarkBlue);
		margin: 0.5rem 0 1.5rem 0;
	}
	.project-desc {
		font-weight: 700;
		font-size: 1.2rem;
		color: #555;
		margin-bottom: 1rem;
	}
	.links-group {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}
	@media (max-width: 1024px) {
		.project-entry {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
	}
	@media (max-width: 768px) {
		.projects-container {
			flex-direction: column;
		}
		.timeline-lane {
			display: none;
		}
		.crossing-band {
			display: none;
		}
		.track-stop {
			display: none;
		}
		.section-title {
			font-size: 2.5rem;
		}
	}
</style>
