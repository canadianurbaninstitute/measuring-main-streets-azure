<script lang="ts">
	import Icon from '@iconify/svelte';
	import {
		bii,
		BusinessCount,
		Daily_Visits,
		Overall_score,
		Tier_1_presence,
		Tier_2_presence,
		TotalHouseholds,
		Unique_Visitors
	} from '../../../lib/data/transitdata/config.json';
	import Accordion from '../../../lib/ui/Accordion.svelte';
	import GaugeMetric from '../../../lib/ui/GaugeMetric.svelte';
	import TransitMetric from '../../../lib/ui/TransitMetric.svelte';
	import './tabs.css';

	let {
		selectedStation,
		stationVisitorData,
		stationCCpresence,
		stationCCcounts, // New prop
		selectedVariable = $bindable(),
		onSelectVariable
	} = $props();

	// Identify missing amenities (Count == 0)
	// We strictly look at Tier 1 for "Critical Gaps" usually, or all tracked ones.
	// Based on user request "Add a list of missing resources to the presence tab".
	// I'll list Tier 1 items that are missing.

	const TIER_1_AMENITIES = [
		'Childcare',
		'Community Centres',
		'Convenience Store',
		'Libraries',
		'Personal and Commercial Banking',
		'Pharmacy',
		'Physicians Office',
		'Post Office',
		'Primary and Secondary Schools',
		'Supermarket'
	];

	const TIER_2_AMENITIES = [
		'Appliance TV and Electronics Retailers',
		'Baked Goods',
		'Barber Shop',
		'Beauty Salon',
		'Book Stores',
		'Building Material and Lawn Garden Stores',
		'Clothing and Shoe Retailers',
		'Coin Laundry',
		'Community Health and Elderly Care Facilities',
		'Cosmetics and Beauty Supply Retailers',
		'Dentist Office',
		'Dry Cleaners',
		'Fish and Seafood Market',
		'Fitness and recreational sports centres',
		'Florists',
		'Fruit and Vegetable Market',
		'Liquor Stores',
		'Meat Market',
		'Museums and Art Galleries',
		'Nursing Care Facilities',
		'Office supplies',
		'Other Personal Care',
		'Religious Organizations',
		'Restaurants',
		'Sporting goods and Hobby Retailers'
	];

	const AMENITY_ICONS: Record<string, string> = {
		// Tier 1
		Childcare: 'mdi:baby-carriage',
		'Community Centres': 'mdi:account-group',
		'Convenience Store': 'mdi:store',
		Libraries: 'mdi:library',
		'Personal and Commercial Banking': 'mdi:bank',
		Pharmacy: 'mdi:pill',
		'Physicians Office': 'mdi:doctor',
		'Post Office': 'mdi:email',
		'Primary and Secondary Schools': 'mdi:school',
		Supermarket: 'mdi:cart',
		// Tier 2
		'Appliance TV and Electronics Retailers': 'mdi:television',
		'Baked Goods': 'mdi:bread-slice',
		'Barber Shop': 'mdi:content-cut',
		'Beauty Salon': 'mdi:content-cut',
		'Book Stores': 'mdi:book-open-page-variant',
		'Building Material and Lawn Garden Stores': 'mdi:hammer',
		'Clothing and Shoe Retailers': 'mdi:tshirt-crew',
		'Coin Laundry': 'mdi:washing-machine',
		'Community Health and Elderly Care Facilities': 'mdi:home-heart',
		'Cosmetics and Beauty Supply Retailers': 'mdi:lipstick',
		'Dentist Office': 'mdi:tooth',
		'Dry Cleaners': 'mdi:hanger',
		'Fish and Seafood Market': 'mdi:fish',
		'Fitness and recreational sports centres': 'mdi:dumbbell',
		Florists: 'mdi:flower',
		'Fruit and Vegetable Market': 'mdi:fruit-cherries',
		'Liquor Stores': 'mdi:bottle-wine',
		'Meat Market': 'mdi:food-steak',
		'Museums and Art Galleries': 'mdi:palette',
		'Nursing Care Facilities': 'mdi:hospital-building',
		'Office supplies': 'mdi:paperclip',
		'Other Personal Care': 'mdi:account',
		'Religious Organizations': 'mdi:church',
		Restaurants: 'mdi:silverware-fork-knife',
		'Sporting goods and Hobby Retailers': 'mdi:basketball'
	};

	let missingTier1 = $derived(
		stationCCcounts ? TIER_1_AMENITIES.filter((key) => (stationCCcounts[key] || 0) === 0) : []
	);

	let missingTier2 = $derived(
		stationCCcounts ? TIER_2_AMENITIES.filter((key) => (stationCCcounts[key] || 0) === 0) : []
	);
</script>

<div class="tab-content">
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
		{#each [Daily_Visits, Unique_Visitors, TotalHouseholds] as metric}
			<TransitMetric
				disabled
				label={metric.label}
				active={selectedVariable === metric.key}
				on:click={() => onSelectVariable(selectedVariable !== metric.key ? metric.key : null)}
				value={stationVisitorData && stationVisitorData[metric.key]
					? Math.round(stationVisitorData[metric.key]).toLocaleString()
					: selectedStation && selectedStation[metric.key]
						? Math.round(selectedStation[metric.key]).toLocaleString()
						: '0'}
				icon={metric.icon}
			/>
		{/each}
	</div>
	<div class="metric-container">
		<TransitMetric
			label={BusinessCount.label}
			active={selectedVariable === BusinessCount.key}
			on:click={() =>
				onSelectVariable(selectedVariable !== BusinessCount.key ? BusinessCount.key : null)}
			value={Math.round(selectedStation[BusinessCount.key] || 0).toLocaleString()}
			icon={BusinessCount.icon}
		/>
		<GaugeMetric label={bii.label} value={selectedStation[bii.key]} maxValue={1} />
	</div>

	<!-- Missing Resources Section -->
	{#if missingTier1.length > 0}
		<div class="bg-red-50 border border-red-100 rounded-lg p-3 mt-2">
			<div class="flex items-center gap-2 mb-2 text-red-800 font-semibold text-sm">
				<Icon icon="mdi:alert-circle-outline" />
				<span>Missing Tier 1 Amenities</span>
			</div>
			<div class="flex flex-wrap gap-2">
				{#each missingTier1 as amenity}
					<div
						class="flex items-center gap-1.5 text-xs bg-white text-red-600 px-2 py-1 rounded border border-red-100 shadow-sm"
					>
						{#if AMENITY_ICONS[amenity]}
							<Icon icon={AMENITY_ICONS[amenity]} class="text-sm opacity-80" />
						{/if}
						<span>{amenity}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if missingTier2.length > 0}
		<div class="bg-orange-50 border border-orange-100 rounded-lg p-3 mt-2">
			<div class="flex items-center gap-2 mb-2 text-orange-800 font-semibold text-sm">
				<Icon icon="mdi:alert-circle-outline" />
				<span>Missing Tier 2 Amenities</span>
			</div>
			<div class="flex flex-wrap gap-2">
				{#each missingTier2 as amenity}
					<div
						class="flex items-center gap-1.5 text-xs bg-white text-orange-600 px-2 py-1 rounded border border-orange-100 shadow-sm"
					>
						{#if AMENITY_ICONS[amenity]}
							<Icon icon={AMENITY_ICONS[amenity]} class="text-sm opacity-80" />
						{/if}
						<span>{amenity}</span>
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
				<Icon icon="mdi:store" /><strong>Tier 1</strong> amenities are essential for a complete
				community.
				<Accordion>
					<div class="inline-header text-xs" slot="header">
						<i>Click here for a full list of Tier 1 amenities</i><Icon
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
				<Icon icon="mdi:storefront" /><strong>Tier 2</strong> amenities improve outcomes but are not
				essential.
				<!-- Keeping Tier 2 list static or could move to constant too -->
				<Accordion>
					<div class="inline-header text-xs" slot="header">
						<i>Click here for a full list of Tier 2 amenities</i><Icon
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
