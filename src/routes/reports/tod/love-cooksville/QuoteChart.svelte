<script>
	import Icon from '@iconify/svelte';

	const categories = [
		{
			title: 'Points of Disagreement',
			icon: 'mdi:thumbs-up-down',
			color: '#db3069',
			colorFam: 'pink',
			items: [
				'Housing development & density',
				'Expansion of public transit',
				'Homelessness & harm reduction policies',
				'Drivers vs. cyclists & transit',
				'Economic & cultural differences'
			]
		},
		{
			title: 'Barriers to Engagement',
			icon: 'mdi:message-unread',
			color: '#f45d01',
			colorFam: 'orange',
			items: [
				'Failure to engage with concerns on social issues',
				'Conversations dominated by privileged groups'
			]
		},
		{
			title: 'Points of Agreement',
			icon: 'mdi:super-chat-for-good',
			color: '#43b171',
			colorFam: 'green',
			items: [
				'Appreciation for TransLink',
				'Desire for European / Asian urban models',
				"Vancouver's culture, aesthetic, outdoors",
				'Concern about social issues'
			]
		},
		{
			title: 'Opportunities for Engagement',
			icon: 'mdi:stars',
			color: '#00adf2',
			colorFam: 'blue',
			items: [
				'Provide a vision for a better development future',
				"Celebrate Vancouver's landscape and culture",
				'Acknowledge desires for solutions to density issues'
			]
		}
	];
</script>

<div class="engagement-summary">
	<div class="grid">
		{#each categories as cat}
			<div
				class="card"
				style={`--accent: ${cat.color}; --lightAccent: var(--color-${cat.colorFam}-100); --darkAccent: var(--color-${cat.colorFam}-800)`}
			>
				<div class="header">
					<div class="icon-box">
						<Icon icon={cat.icon} class="icon" />
					</div>
					<h3>{cat.title}</h3>
				</div>
				<div class="content">
					<ul>
						{#each cat.items as item}
							<li>
								<span class="bullet" style="background-color: {cat.color}"></span>
								{item}
							</li>
						{/each}
					</ul>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.engagement-summary {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		padding: 2rem 0;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
		width: 100%;
		max-height: 100%;
		overflow-y: auto;
		padding: 0.5rem;
	}

	/* Hide scrollbar but keep functionality */
	.grid::-webkit-scrollbar {
		width: 6px;
	}
	.grid::-webkit-scrollbar-thumb {
		background: #e2e8f0;
		border-radius: 3px;
	}

	.card {
		padding: 2.5rem;
		display: flex;
		flex-direction: column;
		border-top: 4px solid var(--accent);
		border-radius: 1.5rem 1.5rem 1.5rem 1.5rem;
		background: linear-gradient(135deg, var(--lightAccent) 0%, #ffffff 100%);
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.05),
			0 10px 15px -3px rgba(0, 0, 0, 0.03);
		position: relative;
		overflow: hidden;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		min-height: fit-content;
	}

	/* .card:hover {
		transform: translateY(-8px);
		box-shadow:
			0 20px 25px -5px rgba(0, 0, 0, 0.08),
			0 10px 10px -5px rgba(0, 0, 0, 0.04);
	} */

	/* .card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: var(--accent);
	} */

	.header {
		display: flex;
		flex-direction: row;
		align-items: baseline;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.icon-box {
		width: 40px;
		height: 40px;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.7);
		backdrop-filter: blur(80px);
		border: 1px solid var(--lightAccent);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	:global(.icon) {
		font-size: 1.2rem;
		color: var(--accent);
	}

	h3 {
		font-size: 1.4rem;
		margin: 0 0 0 0;
		line-height: 1.3;
		height: 100%;
		color: var(--darkAccent);
	}

	.content {
		flex-grow: 1;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	li {
		position: relative;
		padding-left: 1.25rem;
		line-height: 1.5;
		font-size: 0.95rem;
		font-weight: 500;
	}

	li:last-child {
		margin-bottom: 1rem;
	}

	.bullet {
		position: absolute;
		left: 0;
		top: 0.5rem;
		width: 6px;
		height: 6px;
		border-radius: 50%;
	}

	@media (max-width: 640px) {
		.engagement-summary {
			padding: 0;
		}

		.grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.card {
			padding: 1rem;
		}
	}
</style>
