<script lang="ts">
	import Icon from '@iconify/svelte';
	import {
		AMENITY_ICONS,
		TIER_1_AMENITIES,
		TIER_2_AMENITIES
	} from '../../lib/data/transitdata/complete-communities-config';
	import config from '../../lib/data/transitdata/config.json';
	import Accordion from '../../lib/ui/Accordion.svelte';
	import LegendAbsolute from '../../lib/ui/legends/LegendAbsolute.svelte';
	import LegendItem from '../../lib/ui/legends/LegendItem.svelte';
	let { activeTab, map, selectedVariable, min, max, missingTier1, missingTier2 } = $props();
	let toggledValues = $state({});
	// Use an explicit string to track which tier is expanded
	let expandedTier = $state('tier1');

	// Helper to handle accordion logic explicitly
	function setExpandedTier(tier: 'tier1' | 'tier2') {
		expandedTier = tier;
	}
</script>

{#if map && (selectedVariable || activeTab === 'housing' || activeTab === 'employment' || activeTab === 'complete-communities')}
	<LegendAbsolute>
		{#if selectedVariable && min !== max}
			<h6 class="font-semibold mb-1">{config[selectedVariable]?.label}</h6>
			<div class="flex flex-col gap-2 mb-2">
				<div
					class="w-full h-4 rounded"
					style="background: linear-gradient(to right, #F5C8D7, #E87CA0, #DB3069, #721433);"
				></div>
				<div>
					<div class="flex justify-between w-full text-xs">
						{#each [{ label: min ?? 0 }, { label: max ?? 0 }] as item}
							<span
								>{config[selectedVariable]?.unit === '$'
									? Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(
											item.label
										)
									: item.label}</span
							>
						{/each}
					</div>
					{#if config[selectedVariable]?.unit && config[selectedVariable]?.unit !== '$'}
						<span class="italic text-xs">({config[selectedVariable]?.unit})</span>
					{/if}
				</div>
			</div>
		{/if}
		{#if activeTab === 'housing'}
			<Accordion>
				<div class="inline-header" slot="header">
					<div class="text-sm inline-header">
						Housing Type<Icon icon="iconoir:nav-arrow-down" />
					</div>
				</div>
				<div class="accordion-body" slot="body">
					<div class="text-xs italic">Click on a layer to turn it on or off</div>
					<LegendItem
						{map}
						bind:toggledValues
						id="all-nar"
						variant="circle"
						label="Residential"
						bgcolor="#db3069"
						bordercolor="#fff"
						button={true}
						useFilter={true}
						filterProperty="BU_USE"
						filterValue="Residential"
					/>
					<!-- <LegendItem
						{map}
						bind:toggledValues
						id="all-nar"
						variant="circle"
						label="Non-Residential"
						bgcolor="#00adf2"
						bordercolor="#fff"
						button={true}
						useFilter={true}
						filterProperty="BU_USE"
						filterValue="Non-Residential"
					/> -->
					<div class="text-xs italic">Size = Number of Units</div>
				</div>
			</Accordion>
		{/if}
		{#if activeTab === 'employment'}
			<Accordion>
				<div class="inline-header" slot="header">
					<div class="text-sm inline-header">
						Employer Type<Icon icon="iconoir:nav-arrow-down" />
					</div>
				</div>
				<div class="accordion-body" slot="body">
					<div class="text-xs mb-3 italic">by Complete Community Tier</div>
					<div class="text-xs italic">Click on a layer to turn it on or off</div>
					<LegendItem
						{map}
						bind:toggledValues
						variant="circle"
						label="Core Amenity"
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
						label="Additional Amenity"
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
		{#if activeTab === 'complete-communities'}
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
							Core Amenities<Icon icon="iconoir:nav-arrow-down" />
						</div>
						<div slot="body" class="p-1">
							<LegendItem
								{map}
								bind:toggledValues
								id="complete-community-amenities"
								variant="circle"
								featuretype="icon"
								label="Toggle All Core Amenities"
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
							Additional Amenities<Icon icon="iconoir:nav-arrow-down" />
						</div>
						<div slot="body" class="p-1">
							<!-- Bulk Toggle for all Tier 2 -->
							<LegendItem
								{map}
								bind:toggledValues
								id="complete-community-amenities"
								variant="circle"
								featuretype="icon"
								label="Toggle All Additional Amenities"
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
									bgcolor="#2a5cac"
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
				</div></Accordion
			>
		{/if}
	</LegendAbsolute>
{/if}
