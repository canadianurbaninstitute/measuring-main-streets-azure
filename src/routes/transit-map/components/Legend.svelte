<script lang="ts">
	import Icon from '@iconify/svelte';
	import {
		AMENITY_ICONS,
		TIER_1_AMENITIES,
		TIER_2_AMENITIES
	} from '../../lib/data/transitdata/complete-communities-config';
	import type { MetricDefinition, SingleMetric } from '../../lib/data/transitdata/config';
	import configData from '../../lib/data/transitdata/config.json';
	import { trTransit } from '../../lib/data/transitdata/labels.fr';
	import { formatNumber, getLang } from '../../lib/i18n';
	import Accordion from '../../lib/ui/Accordion.svelte';
	import LegendAbsolute from '../../lib/ui/legends/LegendAbsolute.svelte';
	import LegendItem from '../../lib/ui/legends/LegendItem.svelte';

	interface AmenityItem {
		label: string;
		color?: string;
		[key: string]: any;
	}

	interface ConfigEntry {
		label: string;
		unit?: string;
		[key: string]: any;
	}

	interface Props {
		activeTab: string;
		map: any;
		selectedVariable: string | null | undefined;
		min: number | undefined;
		max: number | undefined;
		missingTier1: AmenityItem[];
		missingTier2: AmenityItem[];
	}

	let { activeTab, map, selectedVariable, min, max, missingTier1, missingTier2 }: Props = $props();

	const config = configData as MetricDefinition;
	const fr = getLang() === 'fr';

	let toggledValues = $state<Record<string, any>>({});
	let expandedTier = $state<'tier1' | 'tier2'>('tier1');

	function setExpandedTier(tier: 'tier1' | 'tier2') {
		expandedTier = tier;
	}
</script>

{#if map && (selectedVariable || activeTab === 'housing' || activeTab === 'employment' || activeTab === 'complete-communities' || activeTab === 'built-form')}
	<LegendAbsolute>
		{#if selectedVariable && min !== max && config[selectedVariable]}
			<h6 class="font-semibold mb-1">
				{trTransit((config[selectedVariable] as SingleMetric).label, fr)}
			</h6>
			<div class="flex flex-col gap-2 mb-2">
				<div
					class="w-full h-4 rounded"
					style="background: linear-gradient(to right, #F5C8D7, #E87CA0, #DB3069, #721433);"
				></div>
				<div>
					<div class="flex justify-between w-full text-xs">
						{#each [{ label: min ?? 0 }, { label: max ?? 0 }] as item}
							<span>
								{(config[selectedVariable] as SingleMetric).unit === '$'
									? fr
										? formatNumber(item.label, { style: 'currency', currency: 'CAD' }, 'fr')
										: Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(
												item.label
											)
									: fr
										? formatNumber(item.label, undefined, 'fr')
										: item.label}
							</span>
						{/each}
					</div>
					{#if (config[selectedVariable] as SingleMetric).unit && (config[selectedVariable] as SingleMetric).unit !== '$'}
						<span class="italic text-xs"
						>({trTransit((config[selectedVariable] as SingleMetric).unit, fr)})</span
					>
					{/if}
				</div>
			</div>
		{/if}

		{#if activeTab === 'housing'}
			<Accordion open={true}>
				<div class="inline-header" slot="header">
					<div class="text-sm inline-header">
						{fr ? 'Type de logement' : 'Housing Type'}<Icon icon="iconoir:nav-arrow-down" />
					</div>
				</div>
				<div class="accordion-body" slot="body">
					<div class="text-xs italic">
						{fr
							? 'Cliquez sur une couche pour l’afficher ou la masquer'
							: 'Click on a layer to turn it on or off'}
					</div>
					<LegendItem
						{map}
						bind:toggledValues
						id="all-nar"
						variant="circle"
						label={fr ? 'Résidentiel' : 'Residential'}
						bgcolor="#db3069"
						bordercolor="#fff"
						button={true}
						useFilter={true}
						filterProperty="BU_USE"
						filterValue="Residential"
					/>
					<div class="text-xs italic">
						{fr ? 'Taille = nombre de logements' : 'Size = Number of Units'}
					</div>
				</div>
			</Accordion>
		{/if}

		{#if activeTab === 'employment'}
			<Accordion open={true}>
				<div class="inline-header" slot="header">
					<div class="text-sm inline-header">
						{fr ? 'Type d’employeur' : 'Employer Type'}<Icon icon="iconoir:nav-arrow-down" />
					</div>
				</div>
				<div class="accordion-body" slot="body">
					<div class="text-xs mb-3 italic">
						{fr ? 'selon le niveau de collectivité complète' : 'by Complete Community Tier'}
					</div>
					<div class="text-xs italic">
						{fr
							? 'Cliquez sur une couche pour l’afficher ou la masquer'
							: 'Click on a layer to turn it on or off'}
					</div>
					<LegendItem
						{map}
						bind:toggledValues
						variant="circle"
						label={fr ? 'Commodité essentielle' : 'Core Amenity'}
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
						label={fr ? 'Commodité complémentaire' : 'Additional Amenity'}
						bgcolor="#2a5cac"
						bordercolor="#fff"
						button={true}
						useFilter={true}
						filterProperty="Tier"
						filterValue={2}
						id="employment-size"
					/>
					<div class="text-sm italic mt-3">{fr ? 'Nombre d’employés' : 'Number of Employees'}</div>
					<div class="mx-1">
						<img
							src={fr ? '/employmentsizelegend-fr.svg' : '/employmentsizelegend.svg'}
							alt={fr ? 'Légende de la taille des employeurs' : 'Employment size legend'}
						/>
					</div>
				</div>
			</Accordion>
		{/if}

		{#if activeTab === 'built-form'}
			<Accordion open={true}>
				<div class="inline-header" slot="header">
					<div class="text-sm inline-header">
						{fr ? 'Permis de construction' : 'Building Permits'}<Icon icon="iconoir:nav-arrow-down" />
					</div>
				</div>
				<div class="accordion-body" slot="body">
					<LegendItem
						{map}
						bind:toggledValues
						id="building-permits"
						variant="circle"
						label={fr ? 'Permis de construction actifs' : 'Active Building Permits'}
						bgcolor="#db3069"
						bordercolor="#fff"
						button={true}
						filterProperty="PermitType"
						filterValue="Active"
					/>
					<div class="text-xs italic">
						{fr ? 'Taille = nombre de logements' : 'Size = Number of Housing Units'}
					</div>
				</div>
			</Accordion>
		{/if}

		{#if activeTab === 'complete-communities'}
			<Accordion open={true}>
				<div class="inline-header" slot="header">
					<div class="text-sm inline-header">
						{fr ? 'Commodités des collectivités complètes' : 'Complete Community Amenities'}
						<Icon icon="iconoir:nav-arrow-down" />
					</div>
				</div>
				<div class="accordion-body" slot="body">
					<div class="text-xs mb-2">
						<i
							>{fr
								? 'Cliquez sur une couche pour l’afficher ou la masquer'
								: 'Click on a layer to turn it on or off'}</i
						>
					</div>

					<Accordion open={expandedTier === 'tier1'} on:toggle={() => setExpandedTier('tier1')}>
						<div
							slot="header"
							class="flex font-bold text-xs mt-2 mb-1 uppercase tracking-wider text-zinc-500"
						>
							{fr ? 'Commodités essentielles' : 'Core Amenities'}<Icon icon="iconoir:nav-arrow-down" />
						</div>
						<div slot="body" class="p-1">
							<LegendItem
								{map}
								bind:toggledValues
								id="complete-community-amenities"
								variant="circle"
								label={fr
									? 'Afficher ou masquer toutes les commodités essentielles'
									: 'Toggle All Core Amenities'}
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
									label={trTransit(amenity.label, fr)}
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

					<Accordion open={expandedTier === 'tier2'} on:toggle={() => setExpandedTier('tier2')}>
						<div
							slot="header"
							class="flex font-bold text-xs mt-2 mb-1 uppercase tracking-wider text-zinc-500"
						>
							{fr ? 'Commodités complémentaires' : 'Additional Amenities'}<Icon icon="iconoir:nav-arrow-down" />
						</div>
						<div slot="body" class="p-1">
							<LegendItem
								{map}
								bind:toggledValues
								id="complete-community-amenities"
								variant="circle"
								label={fr
									? 'Afficher ou masquer toutes les commodités complémentaires'
									: 'Toggle All Additional Amenities'}
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
									label={trTransit(amenity.label, fr)}
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
				</div>
			</Accordion>
			<hr class="mt-1 mb-2 border-slate-100" />
			<Accordion open={true}>
				<div class="inline-header" slot="header">
					<div class="text-sm inline-header">
						{fr ? 'Rues principales' : 'Main Streets'}
						<Icon icon="iconoir:nav-arrow-down" />
					</div>
				</div>
				<div slot="body">
					<LegendItem
						variant={'line'}
						label={fr ? 'Rues principales à haute densité' : 'High Density Main Streets'}
						bordercolor={'#002940'}
					/>
					<LegendItem variant={'line'} label={fr ? 'Rues principales à faible densité' : 'Low Density Main Streets'} bordercolor={'#00adf2'} />
				</div>
			</Accordion>
		{/if}
	</LegendAbsolute>
{/if}
