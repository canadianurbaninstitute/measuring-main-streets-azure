<script lang="ts">
	import Icon from '@iconify/svelte';
	import config from '../../../lib/data/transitdata/config.json';
	import Accordion from '../../../lib/ui/Accordion.svelte';
	import LegendAbsolute from '../../../lib/ui/legends/LegendAbsolute.svelte';
	import LegendItem from '../../../lib/ui/legends/LegendItem.svelte';

	let { activeTab, map, selectedVariable, min, max } = $props();
	let toggledValues = $state({});
	// Use an explicit string to track which tier is expanded
	let expandedTier = $state('tier1');

	// Helper to handle accordion logic explicitly
	function setExpandedTier(tier: 'tier1' | 'tier2') {
		expandedTier = tier;
	}

	// --- Constants moved into script ---
	const TIER_1_AMENITIES = [
		{ label: 'Childcare', value: 'Childcare', color: '#f13737' },
		{ label: 'Community Centre', value: 'Community Centres', color: '#43b171' },
		{ label: 'Convenience Store', value: 'Convenience Store', color: '#db3069' },
		{ label: 'Library', value: 'Libraries', color: '#8a4285' },
		{
			label: 'Personal and Commercial Banking',
			value: 'Personal and Commercial Banking',
			color: '#f45d01'
		},
		{ label: 'Pharmacy', value: 'Pharmacy', color: '#f1c500' },
		{ label: 'Physicians Office', value: 'Physicians Office', color: '#e37d9d' },
		{ label: 'Post Office', value: 'Post Office', color: '#921111' },
		{
			label: 'Primary or Secondary School',
			value: 'Primary and Secondary Schools',
			color: '#58e965'
		},
		{ label: 'Supermarket', value: 'Supermarket', color: '#23c9ff' }
	];

	const TIER_2_AMENITIES = [
		{ label: 'Appliance TV and Electronics Retailers', color: '#4a5568' },
		{ label: 'Baked Goods', color: '#d97706' },
		{ label: 'Barber Shop', color: '#0ea5e9' },
		{ label: 'Beauty Salon', color: '#ec4899' },
		{ label: 'Book Stores', color: '#8b5cf6' },
		{ label: 'Building Material and Lawn Garden Stores', color: '#78350f' },
		{ label: 'Clothing and Shoe Retailers', color: '#f43f5e' },
		{ label: 'Coin Laundry', color: '#64748b' },
		{ label: 'Community Health and Elderly Care Facilities', color: '#10b981' },
		{ label: 'Cosmetics and Beauty Supply Retailers', color: '#f472b6' },
		{ label: 'Dentist Office', color: '#2dd4bf' },
		{ label: 'Dry Cleaners', color: '#94a3b8' },
		{ label: 'Fish and Seafood Market', color: '#06b6d4' },
		{ label: 'Fitness and recreational sports centres', color: '#6366f1' },
		{ label: 'Florists', color: '#fb7185' },
		{ label: 'Fruit and Vegetable Market', color: '#84cc16' },
		{ label: 'Liquor Stores', color: '#dc2626' },
		{ label: 'Meat Market', color: '#991b1b' },
		{ label: 'Museums and Art Galleries', color: '#a855f7' },
		{ label: 'Nursing Care Facilities', color: '#059669' },
		{ label: 'Office supplies', color: '#475569' },
		{ label: 'Other Personal Care', color: '#d946ef' },
		{ label: 'Religious Organizations', color: '#f59e0b' },
		{ label: 'Restaurants', color: '#ea580c' },
		{ label: 'Sporting goods and Hobby Retailers', color: '#1d4ed8' }
	];

	// --- Dynamic Map Coloring Logic ---
	const DEFAULT_T1_COLOR = '#003f5e';
	const DEFAULT_T2_COLOR = '#2a5cac';
	const OTHER_COLOR = 'rgba(0,0,0,0)'; // Hide businesses not in T1 or T2

	$effect(() => {
		// This tracksExpandedTier and the map state
		const currentTier = expandedTier;
		const mapInstance = map;

		if (!mapInstance) return;

		// Use a recursive check or wait for the style to load/layer to exist
		const updateMapColors = () => {
			if (!mapInstance.getLayer('complete-community-amenities')) return;

			let colorExpression;

			if (currentTier === 'tier1') {
				const t1Matches = TIER_1_AMENITIES.flatMap((a) => [a.value, a.color]);
				colorExpression = [
					'case',
					['==', ['get', 'Tier'], 1],
					['match', ['get', 'Group Name'], ...t1Matches, DEFAULT_T1_COLOR],
					['==', ['get', 'Tier'], 2],
					DEFAULT_T2_COLOR,
					OTHER_COLOR
				];
			} else {
				const t2Matches = TIER_2_AMENITIES.flatMap((a) => [a.label, a.color]);
				colorExpression = [
					'case',
					['==', ['get', 'Tier'], 2],
					['match', ['get', 'Group Name'], ...t2Matches, DEFAULT_T2_COLOR],
					['==', ['get', 'Tier'], 1],
					DEFAULT_T1_COLOR,
					OTHER_COLOR
				];
			}

			mapInstance.setPaintProperty('complete-community-amenities', 'circle-color', colorExpression);

			// We remove the circle-stroke-opacity logic from here because it fights with LegendItem
		};

		// Run update immediately and also on map idle to catch late-added layers
		updateMapColors();
		mapInstance.on('idle', updateMapColors);

		return () => {
			mapInstance.off('idle', updateMapColors);
		};
	});
</script>

<LegendAbsolute>
	{#if selectedVariable && min !== max}
		<h6 class="font-semibold mb-1">{config[selectedVariable]?.label}</h6>
		<div class="flex flex-col gap-2 mb-2">
			<div
				class="w-full h-4 rounded"
				style="background: linear-gradient(to right, #F5C8D7, #E87CA0, #DB3069, #721433);"
			></div>
			<div class="flex justify-between w-full text-xs">
				{#each [{ label: min ?? 0 }, { label: max ?? 0 }] as item}
					<span>
						{config[selectedVariable]?.unit === '$'
							? Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(
									item.label
								)
							: item.label}
					</span>
				{/each}
			</div>
		</div>
	{/if}

	{#if activeTab === 'access'}
		<Accordion>
			<div class="inline-header" slot="header">
				<div class="text-sm inline-header">
					Employer Type <Icon icon="iconoir:nav-arrow-down" />
				</div>
			</div>
			<div class="accordion-body" slot="body">
				<div class="text-xs mb-3 italic">by Complete Community Tier</div>
				<LegendItem
					{map}
					bind:toggledValues
					variant="circle"
					label="Tier 1"
					bgcolor="#db3069"
					bordercolor="#fff"
					button={true}
					useFilter={true}
					filterProperty="Tier"
					filterValue={1}
					id="employment-size"
				/>
				<LegendItem
					{map}
					bind:toggledValues
					variant="circle"
					label="Tier 2"
					bgcolor="#2a5cac"
					bordercolor="#fff"
					button={true}
					useFilter={true}
					filterProperty="Tier"
					filterValue={2}
					id="employment-size"
				/>
				<div class="text-sm italic mt-3">Number of Employees</div>
				<div class="mx-1">
					<img src="/employmentsizelegend.svg" alt="Employment size legend" />
				</div>
			</div>
		</Accordion>
	{/if}

	<Accordion open={true}>
		<div class="inline-header" slot="header">
			<div class="text-sm inline-header">
				Complete Community Amenities <Icon icon="iconoir:nav-arrow-down" />
			</div>
		</div>
		<div class="accordion-body" slot="body">
			<div class="text-xs mb-2"><i>Click on a layer to turn it on or off</i></div>

			<!-- Tier 1 Section -->
			<Accordion open={expandedTier === 'tier1'} onToggle={() => setExpandedTier('tier1')}>
				<div
					slot="header"
					class="flex font-bold text-xs mt-2 mb-1 uppercase tracking-wider text-zinc-500"
				>
					Tier 1<Icon icon="iconoir:nav-arrow-down" />
				</div>
				<div slot="body" class="p-1">
					<LegendItem
						{map}
						bind:toggledValues
						id="complete-community-amenities"
						variant="circle"
						label="Toggle All Tier 1"
						bgcolor="#003f5e"
						bordercolor="#fff"
						button={true}
						useFilter={true}
						filterProperty="Group Name"
						filterValue={TIER_1_AMENITIES.map((a) => a.value)}
					/>
					{#each TIER_1_AMENITIES as amenity}
						<LegendItem
							{map}
							bind:toggledValues
							variant="circle"
							label={amenity.label}
							bgcolor={amenity.color}
							bordercolor="#fff"
							button={true}
							useFilter={true}
							filterProperty="Group Name"
							filterValue={amenity.value}
							id="complete-community-amenities"
						/>
					{/each}
				</div>
			</Accordion>

			<!-- Tier 2 Section -->
			<Accordion open={expandedTier === 'tier2'} onToggle={() => setExpandedTier('tier2')}>
				<div
					slot="header"
					class="flex font-bold text-xs mt-2 mb-1 uppercase tracking-wider text-zinc-500"
				>
					Tier 2<Icon icon="iconoir:nav-arrow-down" />
				</div>
				<div slot="body" class="p-1">
					<!-- Bulk Toggle for all Tier 2 -->
					<LegendItem
						{map}
						bind:toggledValues
						id="complete-community-amenities"
						variant="circle"
						label="Toggle All Tier 2"
						bgcolor="#2a5cac"
						bordercolor="#fff"
						button={true}
						useFilter={true}
						filterProperty="Group Name"
						filterValue={TIER_2_AMENITIES.map((a) => a.label)}
					/>
					{#each TIER_2_AMENITIES as amenity}
						<LegendItem
							{map}
							bind:toggledValues
							id="complete-community-amenities"
							variant="circle"
							label={amenity.label}
							bgcolor={amenity.color}
							bordercolor="#fff"
							button={true}
							useFilter={true}
							filterProperty="Group Name"
							filterValue={amenity.label}
						/>
					{/each}
				</div>
			</Accordion>
		</div>
	</Accordion>
</LegendAbsolute>

<style>
	.inline-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}
	.accordion-body {
		padding: 0.5rem 0;
	}
</style>
