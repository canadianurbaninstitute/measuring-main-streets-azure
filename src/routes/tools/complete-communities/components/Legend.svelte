<script lang="ts">
	import Icon from '@iconify/svelte';
	import {
		AMENITY_ICONS,
		AMENITY_SPRITES,
		TIER_1_AMENITIES,
		TIER_2_AMENITIES
	} from '../../../lib/data/transitdata/complete-communities-config';
	import config from '../../../lib/data/transitdata/config.json';
	import Accordion from '../../../lib/ui/Accordion.svelte';
	import LegendAbsolute from '../../../lib/ui/legends/LegendAbsolute.svelte';
	import LegendItem from '../../../lib/ui/legends/LegendItem.svelte';

	let { activeTab, map, selectedStation, selectedVariable, min, max, missingTier1, missingTier2 } =
		$props();
	let toggledValues = $state({});
	// Use an explicit string to track which tier is expanded
	let expandedTier = $state('tier1');

	// Helper to handle accordion logic explicitly
	function setExpandedTier(tier: 'tier1' | 'tier2') {
		expandedTier = tier;
	}

	// --- Dynamic Map Coloring Logic ---
	const DEFAULT_T1_COLOR = '#003f5e';
	const DEFAULT_T2_COLOR = '#2a5cac';
	const OTHER_COLOR = 'rgba(0,0,0,0)'; // Hide businesses not in T1 or T2
	const spriteMatch = Object.entries(AMENITY_SPRITES).flatMap(([groupName, sprite]) => [
		groupName,
		sprite
	]);

	$effect(() => {
		const mapInstance = map;
		const currentTier = expandedTier;
		if (!mapInstance) return;

		const updateMapIcons = () => {
			if (!mapInstance.getLayer('complete-community-amenities')) return;

			const fillColorExpression =
				currentTier === 'tier1'
					? [
							'case',
							['==', ['get', 'Tier'], 1],
							[
								'match',
								['get', 'Group Name'],
								...TIER_1_AMENITIES.flatMap((a) => [a.label, a.color]),
								DEFAULT_T1_COLOR
							],
							DEFAULT_T2_COLOR
						]
					: [
							'case',
							['==', ['get', 'Tier'], 2],
							[
								'match',
								['get', 'Group Name'],
								...TIER_2_AMENITIES.flatMap((a) => [a.label, a.color]),
								DEFAULT_T2_COLOR
							],
							DEFAULT_T1_COLOR
						];

			mapInstance.setLayoutProperty('complete-community-amenities', 'icon-image', [
				'image',
				['match', ['get', 'Group Name'], ...spriteMatch, 'default-icon'],
				{ params: { fill_color: fillColorExpression } }
			]);
		};

		if (mapInstance.isStyleLoaded()) {
			updateMapIcons();
		} else {
			mapInstance.once('styledata', updateMapIcons);
		}
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

	<Accordion open={selectedStation ? true : false}>
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
						featuretype="icon"
						label="Toggle All Tier 1"
						bgcolor="#003f5e"
						bordercolor="#fff"
						button={true}
						useFilter={true}
						filterProperty="Group Name"
						filterValue={TIER_1_AMENITIES.map((a) => a.label)}
					/>
					{#each TIER_1_AMENITIES as amenity}
						<LegendItem
							{map}
							bind:toggledValues
							variant="circle"
							featuretype="icon"
							label={amenity.label}
							bgcolor={amenity.color}
							icon={AMENITY_ICONS[amenity.label]}
							bordercolor="#fff"
							button={true}
							disabled={missingTier1.includes(amenity)}
							useFilter={true}
							filterProperty="Group Name"
							filterValue={amenity.label}
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
						featuretype="icon"
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
							featuretype="icon"
							label={amenity.label}
							bgcolor={amenity.color}
							icon={AMENITY_ICONS[amenity.label]}
							bordercolor="#fff"
							button={true}
							disabled={missingTier2.includes(amenity)}
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
