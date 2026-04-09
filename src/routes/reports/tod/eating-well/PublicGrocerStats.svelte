<script>
	import Icon from '@iconify/svelte';
</script>

<div class="stats-aside">
	<div class="stats-header">
		<p class="stats-lead">For <strong>$350 million</strong>, the federal government could develop:</p>
	</div>

	<div class="stats-grid">
		<div class="stats-item">
			<div class="icon-wrap">
				<Icon icon="mdi:store-24-hour" class="icon" />
			</div>
			<div class="stats-content">
				<p class="stats-value">50</p>
				<p class="stats-label">government-owned grocery stores</p>
				<p class="stats-sub">(40 in urban areas, 10 in rural Northern communities)</p>
			</div>
		</div>

		<div class="stats-item">
			<div class="icon-wrap">
				<Icon icon="mdi:warehouse" class="icon" />
			</div>
			<div class="stats-content">
				<p class="stats-value">6</p>
				<p class="stats-label">regional distribution hubs</p>
			</div>
		</div>
	</div>

	<div class="stats-footer">
		<ul class="stats-list">
			<li>
				<span class="dot"></span>
				<p>Annual operation: <strong>$290 million</strong></p>
			</li>
			<li>
				<span class="dot"></span>
				<p>In urban areas, reductions in consumer prices: <strong>25–30%</strong></p>
			</li>
			<li>
				<span class="dot"></span>
				<p>Families could save <strong>$2,500 to $10,000</strong> annually depending on location</p>
			</li>
			<li>
				<span class="dot"></span>
				<p>
					<strong>200,000 urban families</strong> and <strong>10,000 Northern families</strong> could save
					a total <strong>$600 million</strong> annually
				</p>
			</li>
			<li>
				<span class="dot"></span>
				<p>
					For every loonie spent on operation, Canadian shoppers would save <strong>two</strong> on groceries
				</p>
			</li>
		</ul>
	</div>
</div>

<style>
	.stats-aside {
		padding: 2.5rem;
		background: linear-gradient(135deg, var(--color-blue-50) 0%, #ffffff 100%);
		border-left: 4px solid var(--color-blue-500);
		border-radius: 0 1.5rem 1.5rem 0;
		box-shadow:
			0 20px 25px -5px rgba(0, 0, 0, 0.1),
			0 10px 10px -5px rgba(0, 0, 0, 0.04);
		width: 100%;
		max-width: 600px;
	}

	.stats-lead {
		font-size: 1.1rem;
		color: var(--color-slate-700);
		margin-bottom: 2rem;
		line-height: 1.4;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.stats-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.75rem;
	}

	.icon-wrap {
		width: 3rem;
		height: 3rem;
		background: var(--color-blue-100);
		border-radius: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-blue-600);
	}

	:global(.icon-wrap .icon) {
		width: 1.75rem;
		height: 1.75rem;
	}

	.stats-value {
		font-size: 2.5rem;
		font-weight: 800;
		line-height: 1;
		color: var(--color-blue-900);
		margin: 0;
	}

	.stats-label {
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--color-slate-800);
		margin: 0;
		line-height: 1.2;
	}

	.stats-sub {
		font-size: 0.75rem;
		color: var(--color-slate-500);
		margin: 0.25rem 0 0;
		line-height: 1.4;
	}

	.stats-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border-top: 1px solid var(--color-blue-100);
		padding-top: 1.5rem;
	}

	.stats-list li {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
	}

	.dot {
		width: 6px;
		height: 6px;
		background: var(--color-blue-400);
		border-radius: 50%;
		margin-top: 0.5rem;
		flex-shrink: 0;
	}

	.stats-list p {
		margin: 0;
		font-size: 0.95rem;
		color: var(--color-slate-700);
		line-height: 1.5;
	}

	@media (max-width: 640px) {
		.stats-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.stats-aside {
			padding: 1.5rem;
		}

		.stats-value {
			font-size: 2rem;
		}
	}
</style>
