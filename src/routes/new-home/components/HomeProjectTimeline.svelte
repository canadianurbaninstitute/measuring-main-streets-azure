<script>
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';
	import car from '../../lib/assets/graphics/car.png';
	import train from '../../lib/assets/graphics/dark-train.svg';

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
			phase: 'PHASE TWO',
			title: 'Transit Oriented Development',
			description: "Mapping major transit station areas on Canada's main streets.",
			details:
				"Canada's seven rapid transit systems are mapped at main street scale, adding further depth and dimension to understanding Canada's main streets at the local station level.",
			links: [{ text: 'Explore the Map', href: '/transit-map', primary: true }],
			stat: '300 billion',
			subtext: 'made up facts!!!!'
		},
		{
			phase: 'PHASE ONE',
			title: 'Main Street Resilience',
			description: 'Orienting data analysis around main streets for the first time.',
			details:
				'Visit local community data is reimagined at the scale of the main street, creating a first-of-its-kind methodology to understand Canadian main streets and empower practitioners with the findings.\n\nGive some background on how the project started, what the goals were, and any major findings.',
			links: [
				{ text: 'Explore the Map', href: '/map', primary: true, color: 'var(--brandLightBlue)' },
				{ text: 'About the project', href: '/about' },
				{ text: 'Reports and Case Studies', href: '/reports' }
			],
			stat: '85%',
			subtext: 'of Canadians live within 1 kilometre from a main street'
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
			<h2 class="section-title">The Projects</h2>

			<!-- First project -->
			<div class="project-entry pb-10">
				<div class="project-content">
					<div class="track-stop"></div>
					<span class="phase-tag">{projects[0].phase}</span>
					<h3 class="project-title">{projects[0].title}</h3>
					<p class="project-desc">{projects[0].description}</p>
					<p class="project-details">{projects[0].details}</p>
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
				<div class="project-stat-container">
					<div class="big-stat">
						<span class="stat-number">{projects[0].stat}</span>
						<span class="stat-subtext">{projects[0].subtext}</span>
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
					<p class="project-details">{projects[1].details}</p>
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
				<div class="project-stat-container">
					<div class="big-stat">
						<span class="stat-number">{projects[1].stat}</span>
						<span class="stat-subtext">{projects[1].subtext}</span>
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

	.skyline-border {
		width: 100%;
		height: 38px;
		background-image: url("data:image/svg+xml,%3Csvg width='80' height='38' viewBox='0 0 57 38' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M22.6976 27.1592H27.5099V22.3231H22.6976V27.1592ZM22.6976 13.4056H27.5099V8.56943H22.6976V13.4056ZM29.3351 20.2824H34.1474V15.4463H29.3351V20.2824ZM20.0894 37.0536H36.6072V0H20.0894V37.0536Z' fill='%23002940'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M40.1787 8.25879V37.0534H46.1401V28.9052H50.9524V37.0534H56.6966V8.25879H40.1787Z' fill='%23002940'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2.61166 27.1905H7.42393V22.3696H2.61166V27.1905ZM9.24918 27.1905H14.0614V22.3696H9.24918V27.1905ZM0 37.0536H16.5179V15.625H0V37.0536Z' fill='%23002940'/%3E%3C/svg%3E");
		background-repeat: repeat-x;
		background-color: var(--color-slate-50);
		background-position: bottom left;
		background-size: 60px 38px;
	}

	.section-title {
		font-family: 'Gelasio', serif;
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
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		align-items: flex-start;
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

	.project-details {
		font-size: 1rem;
		line-height: 1.6;
		color: #666;
		margin-bottom: 2rem;
		white-space: pre-line;
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

		.section-title {
			font-size: 2.5rem;
		}
	}
</style>
