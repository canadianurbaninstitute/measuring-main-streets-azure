<script>
	import Icon from '@iconify/svelte';
	import {
		AMENITY_ICONS,
		TIER_1_AMENITIES,
		TIER_2_AMENITIES
	} from '../../../../lib/data/transitdata/complete-communities-config';

	let { visible } = $props();
</script>

<div class="amenity-tiers {visible ? 'visible' : ''}">
	<div class="tier-card core">
		<div class="tier-header">
			<div class="icon-wrap core">
				<Icon icon="mdi:store" />
			</div>
			<div>
				<h4>Core Amenities</h4>
				<!-- <p>Essential services for daily needs within an 800m walk.</p> -->
			</div>
		</div>
		<div class="pill-cloud">
			{#each TIER_1_AMENITIES as amenity}
				<div class="amenity-pill" style="--amenity-color: {amenity.color}">
					{#if AMENITY_ICONS[amenity.label]}
						<Icon icon={AMENITY_ICONS[amenity.label]} />
					{/if}
					<span>{amenity.label}</span>
				</div>
			{/each}
		</div>
	</div>

	<div class="tier-card additional">
		<div class="tier-header">
			<div class="icon-wrap additional">
				<Icon icon="mdi:storefront" />
			</div>
			<div>
				<h4>Additional Amenities</h4>
				<!-- <p>Supportive services that enhance community livability.</p> -->
			</div>
		</div>
		<div class="pill-cloud">
			{#each TIER_2_AMENITIES as amenity}
				<div class="amenity-pill secondary" style="--amenity-color: {amenity.color}">
					{#if AMENITY_ICONS[amenity.label]}
						<Icon icon={AMENITY_ICONS[amenity.label]} />
					{/if}
					<span>{amenity.label}</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.amenity-tiers {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		padding: 1rem;
	}

	.tier-card {
		background: white;
		border-radius: 16px;
		padding: 2rem;
		border: 1px solid #e2e8f0;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
	}

	.tier-header {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		margin-bottom: 2rem;
	}

	.icon-wrap {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.75rem;
		flex-shrink: 0;
	}

	.icon-wrap.core {
		background: #fee2e2;
		color: #ef4444;
	}

	.icon-wrap.additional {
		background: #fef3c7;
		color: #f59e0b;
	}

	.tier-header h3 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 800;
		color: #1e293b;
	}

	.tier-header p {
		margin: 0.25rem 0 0 0;
		font-size: 0.9rem;
		color: #64748b;
		font-weight: 500;
	}

	.pill-cloud {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.amenity-pill {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: color-mix(in srgb, var(--amenity-color), transparent 88%);
		border-radius: 100px;
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--colors-slate-900);
		border: 1px solid var(--amenity-color);
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		cursor: default;
	}
	.amenity-pill :global(svg) {
		font-size: 1rem;
		color: var(--amenity-color);
	}

	.amenity-pill.secondary {
		font-weight: 600;
		font-size: 0.8rem;
		background: color-mix(in srgb, var(--amenity-color), transparent 92%);
	}

	@media (min-width: 1280px) {
		.amenity-tiers {
			grid-template-columns: 1fr 1.4fr;
		}
	}
</style>
