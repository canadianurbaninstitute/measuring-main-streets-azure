<script>
	import Icon from '@iconify/svelte';
	import { AMENITY_ICONS, TIER_1_AMENITIES } from '../../../../lib/data/transitdata/complete-communities-config';

	let { visible, data = [] } = $props();

	// Process data to get total need per category
	const processedData = $derived(
		data
			.map((d) => ({
				name: d.Amenity,
				low: d.Emp_Low,
				high: d.Emp_High,
				color: TIER_1_AMENITIES.find(a => a.label === d.Amenity)?.color || '#94a3b8'
			}))
			.sort((a, b) => b.high - a.high)
	);
</script>

<div class="needs-summary {visible ? 'visible' : ''}">
	<div class="needs-grid">
		{#each processedData as item}
			<div class="need-card" style="--accent-color: {item.color}">
				<div class="icon-wrap">
					{#if AMENITY_ICONS[item.name]}
						<Icon icon={AMENITY_ICONS[item.name]} />
					{/if}
				</div>
				<div class="content">
					<span class="category">{item.name}</span>
					<div class="range">
						<div class="range-bg">
							<div class="range-fill" style="width: {(item.high / processedData[0].high) * 100}%"></div>
						</div>
						<div class="vals">
							<span class="high">{item.high.toFixed(0)}</span>
							<span class="label">service jobs per station</span>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.needs-summary {
		background: white;
		padding: 1.5rem;
		border-radius: 12px;
		border: 1px solid #e2e8f0;
	}

	.needs-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1rem;
	}

	.need-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: #f8fafc;
		border-radius: 8px;
		border-left: 4px solid var(--accent-color);
		transition: transform 0.2s;
	}

	.need-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
	}

	.icon-wrap {
		width: 44px;
		height: 44px;
		background: white;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		color: var(--accent-color);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
		flex-shrink: 0;
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.category {
		font-size: 0.9rem;
		font-weight: 700;
		color: #1e293b;
	}

	.range {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.range-bg {
		height: 6px;
		background: #e2e8f0;
		border-radius: 3px;
		overflow: hidden;
	}

	.range-fill {
		height: 100%;
		background: var(--accent-color);
		opacity: 0.7;
	}

	.vals {
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
	}

	.high {
		font-size: 1.1rem;
		font-weight: 800;
		color: #1e293b;
	}

	.label {
		font-size: 0.7rem;
		font-weight: 600;
		color: #64748b;
		text-transform: uppercase;
	}
</style>
