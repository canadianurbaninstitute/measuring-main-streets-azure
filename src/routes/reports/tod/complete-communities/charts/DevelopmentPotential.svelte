<script>
	import Icon from '@iconify/svelte';
	import { AMENITY_ICONS, TIER_1_AMENITIES } from '../../../../lib/data/transitdata/complete-communities-config';

	let { visible, data = [] } = $props();

	const stations = $derived([...new Set(data.map((d) => d.stop_label))]);
	let activeStation = $state('');

	$effect(() => {
		if (stations.length > 0 && !activeStation) {
			activeStation = stations[0];
		}
	});

	const stationData = $derived(data.filter((d) => d.stop_label === activeStation));

	const absentAmenities = $derived(
		stationData
			.filter((d) => d.Amenity_Status === 'Absent')
			.map((d) => ({
				name: d.Amenity,
				employeesNeeded: d.Emp_High,
				establishmentsNeeded: d.Amenities_High,
				color: TIER_1_AMENITIES.find(a => a.label === d.Amenity)?.color || '#94a3b8'
			}))
	);

	const presentAmenities = $derived(
		stationData
			.filter((d) => d.Amenity_Status === 'Present')
			.map((d) => ({
				name: d.Amenity,
				color: TIER_1_AMENITIES.find(a => a.label === d.Amenity)?.color || '#94a3b8'
			}))
	);
</script>

<div class="development-potential {visible ? 'visible' : ''}">
	<div class="station-selector">
		{#each stations as station}
			<button 
				class:active={activeStation === station}
				onclick={() => { activeStation = station; }}
			>
				{station}
			</button>
		{/each}
	</div>

	<div class="case-study-content">
		<div class="summary-grid">
			<div class="summary-card missing">
				<div class="card-header">
					<Icon icon="mdi:alert-circle" />
					<h4>Missing Core Amenities</h4>
				</div>
				{#if absentAmenities.length > 0}
					<div class="amenity-list">
						{#each absentAmenities as amenity}
							<div class="amenity-item" style="--amenity-color: {amenity.color}">
								<div class="name-box">
									<div class="mini-icon">
										{#if AMENITY_ICONS[amenity.name]}
											<Icon icon={AMENITY_ICONS[amenity.name]} />
										{/if}
									</div>
									<span class="name">{amenity.name}</span>
								</div>
								<span class="need">+{amenity.establishmentsNeeded.toFixed(1)} est.</span>
							</div>
						{/each}
					</div>
				{:else}
					<p class="empty-state">All core amenities present!</p>
				{/if}
			</div>

			<div class="summary-card metrics">
				<div class="card-header">
					<Icon icon="mdi:finance" />
					<h4>Investment Needed</h4>
				</div>
				<p class="description">
					To reach regional benchmarks, this station area requires approximately 
					<strong class="highlight">{absentAmenities.reduce((acc, curr) => acc + curr.employeesNeeded, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong> 
					new service jobs.
				</p>
				<div class="impact-metric">
					<div class="metric-val">{absentAmenities.length}</div>
					<div class="metric-label">Key Gaps Identified</div>
				</div>
			</div>
		</div>

		<div class="present-region">
			<h5>Present Core Amenities</h5>
			<div class="pill-grid">
				{#each presentAmenities as amenity}
					<div class="present-pill" style="--amenity-color: {amenity.color}">
						{#if AMENITY_ICONS[amenity.name]}
							<Icon icon={AMENITY_ICONS[amenity.name]} />
						{/if}
						<span>{amenity.name}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.development-potential {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		height: 100%;
		background: white;
		padding: 2rem;
		border-radius: 16px;
		border: 1px solid #e2e8f0;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
	}

	.station-selector {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e2e8f0;
	}

	.station-selector button {
		padding: 0.5rem 1.25rem;
		border-radius: 100px;
		border: 1px solid #e2e8f0;
		background: white;
		font-size: 0.85rem;
		font-weight: 700;
		color: #64748b;
		cursor: pointer;
		transition: all 0.2s;
	}

	.station-selector button.active {
		background: #3b82f6;
		color: white;
		border-color: #2563eb;
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
	}

	.case-study-content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		flex: 1;
	}

	.summary-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
	}

	.summary-card {
		padding: 1.5rem;
		border-radius: 12px;
		background: #f8fafc;
		border: 1px solid #f1f5f9;
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.card-header :global(svg) {
		font-size: 1.5rem;
	}

	.summary-card.missing .card-header { color: #ef4444; }
	.summary-card.metrics .card-header { color: #10b981; }

	.summary-card h4 {
		margin: 0;
		font-size: 1rem;
		font-weight: 800;
		color: #1e293b;
	}

	.amenity-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.amenity-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background: white;
		border-radius: 8px;
		border: 1px solid #f1f5f9;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
	}

	.name-box {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.mini-icon {
		width: 32px;
		height: 32px;
		background: color-mix(in srgb, var(--amenity-color), transparent 90%);
		color: var(--amenity-color);
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.25rem;
	}

	.name {
		font-weight: 700;
		color: #334155;
		font-size: 0.9rem;
	}

	.need {
		font-size: 0.75rem;
		color: #ef4444;
		font-weight: 800;
		background: #fee2e2;
		padding: 3px 8px;
		border-radius: 100px;
		border: 1px solid #fecaca;
	}

	.description {
		font-size: 0.95rem;
		color: #475569;
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.highlight {
		color: #10b981;
		font-size: 1.25rem;
		font-weight: 900;
	}

	.impact-metric {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		background: white;
		padding: 1rem;
		border-radius: 8px;
		border: 1px solid #f1f5f9;
	}

	.metric-val {
		font-size: 2.5rem;
		font-weight: 900;
		color: #1e293b;
		line-height: 1;
	}

	.metric-label {
		font-size: 0.75rem;
		font-weight: 700;
		color: #64748b;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.present-region h5 {
		margin: 0 0 1rem 0;
		font-size: 0.8rem;
		text-transform: uppercase;
		color: #64748b;
		letter-spacing: 0.05em;
		font-weight: 800;
	}

	.pill-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.present-pill {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem 0.9rem;
		border-radius: 100px;
		background: color-mix(in srgb, var(--amenity-color), transparent 90%);
		color: var(--amenity-color);
		font-size: 0.8rem;
		font-weight: 700;
		border: 1px solid color-mix(in srgb, var(--amenity-color), transparent 70%);
	}

	@media (max-width: 640px) {
		.summary-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
