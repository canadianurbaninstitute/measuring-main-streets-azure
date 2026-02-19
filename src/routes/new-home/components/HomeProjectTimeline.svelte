<script>
	import Icon from '@iconify/svelte';

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

<section class="timeline-section">
	<h2 class="section-title">The Projects</h2>

	<div class="projects-container">
		<div class="timeline-lane">
			<div class="transit-car">
				<Icon icon="ph:train-bold" />
			</div>
			<div class="dashed-vertical-line"></div>
		</div>

		<div class="projects-list">
			{#each projects as project}
				<div class="project-entry">
					<div class="project-content">
						<span class="phase-tag">{project.phase}</span>
						<h3 class="project-title">{project.title}</h3>
						<p class="project-desc">{project.description}</p>
						<p class="project-details">{project.details}</p>
						<div class="links-group">
							{#each project.links as link}
								<a
									href={link.href}
									class="project-link"
									class:primary={link.primary}
									style={link.color ? `background-color: ${link.color}` : ''}
								>
									{link.text}
									{#if link.primary}
										<Icon icon="ph:arrow-right-bold" />
									{/if}
								</a>
							{/each}
						</div>
					</div>
					<div class="project-stat-container">
						<div class="big-stat">
							<span class="stat-number">{project.stat}</span>
							<span class="stat-subtext">{project.subtext}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.timeline-section {
		padding: 4rem 2rem;
		max-width: 1400px;
		margin: 0 auto;
		background-color: white;
	}

	.section-title {
		font-family: 'Gelasio', serif;
		font-size: 3.5rem;
		margin-bottom: 4rem;
		color: var(--brandDarkBlue);
	}

	.projects-container {
		display: flex;
		gap: 2rem;
	}

	.timeline-lane {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 60px;
		position: relative;
	}

	.transit-car {
		width: 40px;
		height: 80px;
		background-color: var(--brandLightBlue);
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 1.5rem;
		z-index: 2;
	}

	.dashed-vertical-line {
		flex: 1;
		width: 4px;
		background-image: linear-gradient(to bottom, var(--brandYellow) 50%, transparent 50%);
		background-size: 100% 20px;
		background-repeat: repeat-y;
		margin-top: 10px;
	}

	.projects-list {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 6rem;
	}

	.project-entry {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		align-items: flex-start;
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
		max-width: 100%;
	}

	.project-desc {
		font-weight: 700;
		font-size: 1.2rem;
		color: #555;
		margin-bottom: 1rem;
		max-width: 100%;
	}

	.project-details {
		font-size: 1rem;
		line-height: 1.6;
		color: #666;
		margin-bottom: 2rem;
		white-space: pre-line;
		max-width: 100%;
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
		.section-title {
			font-size: 2.5rem;
		}
	}
</style>
