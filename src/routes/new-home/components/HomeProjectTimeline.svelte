<script>
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';
	import car from '../../lib/assets/graphics/car.png';
	import train from '../../lib/assets/graphics/dark-train.svg';
	import LandingCard from '../../lib/ui/LandingCard.svelte';
	// Card assets
	import casestudy from '../../lib/assets/screenshots/case-study-arbutus.png';
	import casestudy2 from '../../lib/assets/screenshots/case-study.png';
	import dot from '../../lib/assets/screenshots/dot.png';
	import reports from '../../lib/assets/screenshots/key-findings.png';
	import mainstreetmap from '../../lib/assets/screenshots/main-street-map.png';
	import transitmap from '../../lib/assets/screenshots/transit-map.png';
	import urbanform from '../../lib/assets/screenshots/urban-form.png';
	import reportstsa from '../../lib/assets/screenshots/who-tsas.png';
	import '../../styles.css';

	let timelineElement = null;
	let crossingElement = null;

	// Train (vertical)
	const trainOffset = new Spring(-350, { stiffness: 0.1, damping: 0.7 });

	// Car (horizontal)
	const carOffset = new Spring(0, { stiffness: 0.1, damping: 1 });
	const armAngle = new Spring(0, { stiffness: 0.1, damping: 0.7 });

	let trackX = 0; // pixel position of the train track within the page
	let armIsDown = false;

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
			// Keep train centered in viewport, clamped to section bounds
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

	const projects = [
		{
			phase: 'PHASE TWO | 2025-2026 ',
			title: 'TOD on Main ',
			description:
				'Leveraging transit-oriented development (TOD) to advance housing and community outcomes  ',
			details:
				"Canada has seven rapid transit systems, and the expansion of these networks continues to shape how communities, cities, and regions grow and change. Built on the foundation of the Measuring Main Streets Platform TOD on Main provides tools, case studies, and research to help decision‑makers leverage transit‑driven growth to advance housing goals, support vibrant and complete communities, and challenge the displacement trends often driven by TOD. <a href='/about/v2/#about-tod'> About Phase Two →</a>",
			stat: '4.4 million homes',
			subtext: "could be built in Canada's transit station areas",
			cards: [
				{
					title: 'Transit Map',
					description:
						'Explore the major transit station areas and their relationship to main streets.',
					image: transitmap,
					link: '/transit-map',
					featured: true,
					tags: ['mapping', 'tool']
				},
				{
					title: 'Case Studies',
					description: 'In depth place-based studies.',
					image: casestudy,
					link: '/casestudies/v2/?tab=tod',
					tags: ['Case Study']
				},
				{
					title: 'Reports',
					description: 'In depth reports on transit-oriented development.',
					image: reportstsa,
					link: '/reports/v2/?tab=tod',
					tags: ['Reports']
				},
				{
					title: 'Tools',
					description: 'In depth reports on transit-oriented development.',
					image: urbanform,
					link: '/tools/v2',
					tags: ['Tools']
				}
			]
		},
		{
			phase: 'PHASE ONE | 2023-2024',
			title: 'Resilience on Main ',
			description:
				'Equipping communities to make smarter investments in main streets and downtowns.',
			details:
				'Coming out of the pandemic, many main streets and downtowns faced a convergence of economic, social, and operational challenges and were poorly positioned for recovery. Resilience on Main responded by delivering first-of-its-kind tools, case studies, and research that re‑scaled critical data to the main street level—equipping leaders and practitioners across Canada with the insights needed to restore activity, support recovery, champion equity, and strengthen long‑term resilience.<a href="/about/v2/#about-resilience"> About Phase One →</a>',
			stat: '85%',
			subtext: 'of Canadians live within 1 kilometre from a main street',
			cards: [
				{
					title: 'Main Street Map',
					description: 'Analyzing neighbourhood-scale data for better city building.',
					image: mainstreetmap,
					link: '/map',
					featured: true,
					tags: ['mapping', 'tool']
				},
				{
					title: 'Case Studies',
					description: 'In depth place-based studies.',
					image: casestudy2,
					link: '/casestudies/v2/?tab=msr',
					tags: ['Case Study']
				},
				{
					title: 'Reports',
					description: 'In depth reports on main street resilience.',
					image: reports,
					link: '/reports/v2/?tab=msr',
					tags: ['Reports']
				},
				{
					title: 'Tools',
					description: 'Research and analysis tools.',
					image: dot,
					link: '/tools/v2/',
					tags: ['Tools']
				}
			]
		}
	];
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
			<h2 class="section-title">Making Data More Accessible for Main Street & Downtown Vibrancy</h2>
			<!-- First project -->
			<div class="project-entry pb-10">
				<div class="project-content">
					<div class="track-stop"></div>
					<span class="phase-tag">{projects[0].phase}</span>
					<h3 class="project-title">{projects[0].title}</h3>
					<p class="project-desc">{projects[0].description}</p>
					<p class="project-details">{@html projects[0].details}</p>
					<div class="links-group">
						{#each projects[0].links as link}
							<a
								href={link.href}
								class="project-link"
								class:primary={link.primary}
								style={link.color ? `background-color: ${link.color}` : ''}
							>
								{link.text}
								{#if link.primary}<Icon icon="ph:arrow-right-bold" />{/if}
							</a>
						{/each}
					</div>
				</div>
				<!-- <div class="project-stat-container">
					<div class="big-stat">
						<span class="stat-number-smaller">{projects[0].stat}</span>
						<span class="stat-subtext">{projects[0].subtext}</span>
					</div>
				</div> -->
				<div class="project-cards-container">
					<div class="cards-scroll">
						{#each projects[0].cards as card}
							<LandingCard {...card} minWidth={350} maxWidth={350} />
						{/each}
					</div>
				</div>
			</div>

			<!-- ===== RAILROAD CROSSING BAND ===== -->
			<div class="crossing-band" bind:this={crossingElement}>
				<!-- Road surface -->
				<div class="road">
					<div class="road-marking"></div>
				</div>

				<!-- Crossing arm mounted on the track -->
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

				<!-- The car -->
				<div class="road-car" style="transform: translateX({carOffset.current}px);">
					<img src={car} alt="Car" style="width: 100%; height: auto;" />
				</div>
			</div>

			<!-- Second project -->
			<div class="project-entry pt-10">
				<div class="project-content">
					<div class="track-stop"></div>
					<span class="phase-tag">{projects[1].phase}</span>
					<h3 class="project-title">{projects[1].title}</h3>
					<p class="project-desc">{projects[1].description}</p>
					<p class="project-details">{@html projects[1].details}</p>
					<div class="links-group">
						{#each projects[1].links as link}
							<a
								href={link.href}
								class="project-link"
								class:primary={link.primary}
								style={link.color ? `background-color: ${link.color}` : ''}
							>
								{link.text}
								{#if link.primary}<Icon icon="ph:arrow-right-bold" />{/if}
							</a>
						{/each}
					</div>
				</div>
				<!-- <div class="project-stat-container">
					<div class="big-stat">
						<span class="stat-number">{projects[1].stat}</span>
						<span class="stat-subtext">{projects[1].subtext}</span>
					</div>
				</div> -->
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

<!-- <div class="skyline-border" aria-hidden="true"></div> -->

<style>
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

	/* ── Timeline lane ── */
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

	/* ── Projects list ── */
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
		/* margin-bottom: 4rem; */
	}

	.project-cards-container {
		grid-column: 1 / -1;
		width: 100%;
		padding: 1rem 0 0 0;
		position: relative;
		border-radius: 40px / 50%;
		overflow: hidden;
		/* background-color: var(--color-zinc-100); */
	}

	/* Tunnel Effect Overlays */
	.project-cards-container::before,
	.project-cards-container::after {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100px;
		z-index: 2;
		pointer-events: none;
		transition: opacity 0.3s ease;
	}

	.project-cards-container::before {
		left: 0;
		width: 60px;
		border-radius: 50%;
		background: radial-gradient(ellipse at 140% 50%, transparent 70%, var(--color-zinc-300) 100%);
	}

	.project-cards-container::after {
		right: 0;
		width: 60px;
		border-radius: 50%;
		background: radial-gradient(ellipse at -10% 50%, transparent 70%, var(--color-zinc-300) 100%);
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

	/* ── Railroad crossing band ── */
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

	/* The arm is positioned where the track column is (left: 0 of the projects-list,
	   but the track is actually in the timeline-lane which is ~62px to the left of this element.
	   We use a negative left to reach back into that lane.) */
	.crossing-arm-mount {
		position: absolute;
		left: -42px; /* reach back to track center */
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

	/* ── Road car ── */
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

	/* ── Shared project styles ── */
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

	.project-link {
		padding: 0.8rem 1.5rem;
		border-radius: 2rem;
		text-decoration: none;
		font-family: 'Inter', sans-serif;
		font-weight: 600;
		font-size: 0.9rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background-color: var(--brandDarkBlue);
		color: white;
		transition: transform 0.2s ease;
	}

	.project-link:hover {
		transform: translateY(-2px);
	}

	.project-link:not(.primary) {
		background-color: var(--brandLightBlue);
	}

	.project-stat-container {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		height: 100%;
	}

	.big-stat {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		text-align: right;
	}

	.stat-number {
		font-family: 'Inter', sans-serif;
		font-weight: 800;
		font-size: 7rem;
		line-height: 1;
		color: var(--brandDarkBlue);
	}

	.stat-number-smaller {
		font-family: 'Inter', sans-serif;
		font-weight: 800;
		font-size: 5rem;
		line-height: 1;
		color: var(--brandDarkBlue);
	}

	.stat-subtext {
		font-family: 'Inter', sans-serif;
		font-weight: 600;
		font-size: 1.2rem;
		color: #888;
		max-width: 300px;
	}

	@media (max-width: 1024px) {
		.project-entry {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.big-stat {
			width: 100%;
			align-items: flex-start;
			text-align: left;
		}

		.stat-number {
			font-size: 5rem;
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
