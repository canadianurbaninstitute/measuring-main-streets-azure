<script lang="ts">
	import Icon from '@iconify/svelte';
	import {
		AMENITY_ICONS,
		TIER_1_AMENITIES
	} from '../../../lib/data/transitdata/complete-communities-config';
	import {
		EmployeeCount,
		Overall_score,
		Tier_1_presence,
		Tier_2_presence,
		TotalHouseholds
	} from '../../../lib/data/transitdata/config.json';
	import Accordion from '../../../lib/ui/Accordion.svelte';
	import GaugeMetric from '../../../lib/ui/charts/GaugeMetric.svelte';
	import TransitMetric from '../../../lib/ui/charts/TransitMetric.svelte';
	import './tabs.css';

	let {
		selectedStation,
		stationVisitorData,
		stationCCpresence,
		futureDemand,
		missingTier1,
		missingTier2,
		selectedVariable = $bindable(),
		onSelectVariable
	} = $props();
</script>

<div class="tab-content">
	<!-- <div class="metric-container mt-2">
		<RankMetric label="Complete Communities Rank" value={stationCCpresence.cc_Rank} total="735" />
	</div> -->
	<div class="metric-container">
		<GaugeMetric
			label={Overall_score.label}
			value={Math.round(stationCCpresence[Overall_score.key])}
			icon={Overall_score.icon}
			suffix={Overall_score.unit}
			fillColor="var(--color-zinc-400)"
		/>
	</div>
	<div class="metric-container">
		{#each [Tier_1_presence, Tier_2_presence] as metric}
			<GaugeMetric
				label={metric.label}
				value={Math.round(stationCCpresence[metric.key])}
				icon={metric.icon}
				suffix={metric.unit}
				fillColor="var(--color-zinc-400)"
			/>
		{/each}
	</div>
	<div class="metric-container">
		<TransitMetric
			disabled
			label="Daily Visits"
			value={Math.round(futureDemand.Daily_Visits).toLocaleString() ?? 0}
			icon="mdi:shop"
		/>
		<TransitMetric
			disabled
			label="Local Visits"
			value={`${((futureDemand.Daily_Visits_Residents / futureDemand.Daily_Visits) * 100)
				.toFixed(1)
				.toLocaleString()}%`}
			icon="mdi:shop"
		/>
	</div>
	<div class="metric-container">
		{#each [TotalHouseholds, EmployeeCount] as metric}
			<TransitMetric
				disabled
				label={metric.label}
				active={selectedVariable === metric.key}
				on:click={() => onSelectVariable(selectedVariable !== metric.key ? metric.key : null)}
				value={stationCCpresence && stationVisitorData[metric.key]
					? Math.round(stationVisitorData[metric.key]).toLocaleString()
					: selectedStation && selectedStation[metric.key]
						? Math.round(selectedStation[metric.key]).toLocaleString()
						: '0'}
				icon={metric.icon}
			/>
		{/each}
	</div>

	<!-- Missing Resources Section -->
	{#if missingTier1.length > 0}
		<div class="bg-red-50 border border-red-100 rounded-lg p-3 mt-2">
			<div class="flex items-center gap-2 mb-2 text-red-800 font-semibold text-sm">
				<Icon icon="mdi:alert-circle-outline" />
				<span>Missing Core Amenities</span>
			</div>
			<div class="flex flex-wrap gap-2">
				{#each missingTier1 as amenity}
					<div
						class="flex items-center gap-1.5 text-xs bg-white text-red-600 px-2 py-1 rounded border border-red-100 shadow-sm"
					>
						{#if AMENITY_ICONS[amenity.label]}
							<Icon icon={AMENITY_ICONS[amenity.label]} class="text-sm opacity-80" />
						{/if}
						<span>{amenity.label}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if missingTier2.length > 0}
		<div class="bg-orange-50 border border-orange-100 rounded-lg p-3 mt-2">
			<div class="flex items-center gap-2 mb-2 text-orange-800 font-semibold text-sm">
				<Icon icon="mdi:alert-circle-outline" />
				<span>Missing Additional Amenities</span>
			</div>
			<div class="flex flex-wrap gap-2">
				{#each missingTier2 as amenity}
					<div
						class="flex items-center gap-1.5 text-xs bg-white text-orange-600 px-2 py-1 rounded border border-orange-100 shadow-sm"
					>
						{#if AMENITY_ICONS[amenity.label]}
							<Icon icon={AMENITY_ICONS[amenity.label]} class="text-sm opacity-80" />
						{/if}
						<span>{amenity.label}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<div class="legend-container mt-4">
		<Accordion>
			<div class="inline-header text-sm italic" slot="header">
				What are Complete Community Amenities?<Icon icon="iconoir:nav-arrow-down" />
			</div>
			<div class="text-sm my-2" slot="body">
				Complete Community Amenities provide services that meet residents' basic needs.<br /><br />
				<Icon icon="mdi:store" /><strong>Core</strong> amenities are essential for a complete
				community.
				<Accordion>
					<div class="inline-header text-xs" slot="header">
						<i>Click here for a full list of core amenities</i><Icon
							icon="iconoir:nav-arrow-down"
						/>
					</div>
					<div class="text-xs ml-5" slot="body">
						{#each TIER_1_AMENITIES as item}
							<li>{item}</li>
						{/each}
					</div>
				</Accordion>
				<br />
				<Icon icon="mdi:storefront" /><strong>Additional</strong> amenities improve outcomes but are
				not essential.
				<Accordion>
					<div class="inline-header text-xs" slot="header">
						<i>Click here for a full list of additional amenities</i><Icon
							icon="iconoir:nav-arrow-down"
						/>
					</div>
					<div class="text-xs ml-5" slot="body">
						<li>Appliance TV and Electronics Retailers</li>
						<li>Baked Goods</li>
						<li>Barber Shop</li>
						<li>Beauty Salon</li>
						<li>Book Stores</li>
						<li>Building Material and Lawn Garden Stores</li>
						<li>Clothing and Shoe Retailers</li>
						<li>Coin Laundry</li>
						<li>Community Health and Elderly Care Facilities</li>
						<li>Cosmetics and Beauty Supply Retailers</li>
						<li>Dentist Office</li>
						<li>Dry Cleaners</li>
						<li>Fish and Seafood Market</li>
						<li>Fitness and recreational sports centres</li>
						<li>Florists</li>
						<li>Fruit and Vegetable Market</li>
						<li>Liquor Stores</li>
						<li>Meat Market</li>
						<li>Museums and Art Galleries</li>
						<li>Nursing Care Facilities</li>
						<li>Office supplies</li>
						<li>Other Personal Care</li>
						<li>Religious Organizations</li>
						<li>Restaurants</li>
						<li>Sporting goods and Hobby Retailers</li>
					</div>
				</Accordion>
			</div>
		</Accordion>
	</div>
</div>
