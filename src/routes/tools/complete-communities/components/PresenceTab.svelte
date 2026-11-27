<script lang="ts">
	import Icon from '@iconify/svelte';
	import {
		AMENITY_ICONS,
		TIER_1_AMENITIES
	} from '../../../lib/data/transitdata/complete-communities-config';
	import { trTransit } from '../../../lib/data/transitdata/labels.fr';
	import {
		EmployeeCount,
		Overall_score,
		Tier_1_presence,
		Tier_2_presence,
		TotalHouseholds
	} from '../../../lib/data/transitdata/config.json';
	import Accordion from '../../../lib/ui/Accordion.svelte';
	import GaugeMetric from '../../../lib/ui/charts/GaugeMetric.svelte';
	import TransitMetric from '../../../lib/ui/TransitMetric.svelte';
	import { formatNumber, getLang } from '../../../lib/i18n';
	import './tabs.css';

	const fr = getLang() === 'fr';
	const tr = (v: string) => trTransit(v, fr);
	const fmtInt = (v: number) => (fr ? formatNumber(Math.round(v)) : Math.round(v).toLocaleString());

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
			label={tr(Overall_score.label)}
			value={Math.round(stationCCpresence[Overall_score.key])}
			icon={Overall_score.icon}
			suffix={Overall_score.unit}
			fillColor="var(--color-zinc-400)"
		/>
	</div>
	<div class="metric-container">
		{#each [Tier_1_presence, Tier_2_presence] as metric}
			<GaugeMetric
				label={tr(metric.label)}
				value={Math.round(stationCCpresence[metric.key])}
				icon={metric.icon}
				size={160}
				suffix={metric.unit}
				fillColor="var(--color-zinc-400)"
			/>
		{/each}
	</div>
	<div class="metric-container">
		<TransitMetric
			disabled
			label={fr ? 'Visites quotidiennes' : 'Daily Visits'}
			value={fmtInt(futureDemand.Daily_Visits) ?? 0}
			icon="mdi:shop"
		/>
		<TransitMetric
			disabled
			label={fr ? 'Visites locales' : 'Local Visits'}
			value={fr
				? `${formatNumber((futureDemand.Daily_Visits_Residents / futureDemand.Daily_Visits) * 100, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}\u00a0%`
				: `${((futureDemand.Daily_Visits_Residents / futureDemand.Daily_Visits) * 100)
						.toFixed(1)
						.toLocaleString()}%`}
			icon="mdi:shop"
		/>
	</div>
	<div class="metric-container">
		{#each [TotalHouseholds, EmployeeCount] as metric}
			<TransitMetric
				disabled
				label={tr(metric.label)}
				active={selectedVariable === metric.key}
				on:click={() => onSelectVariable(selectedVariable !== metric.key ? metric.key : null)}
				value={stationCCpresence && stationVisitorData[metric.key]
					? fmtInt(stationVisitorData[metric.key])
					: selectedStation && selectedStation[metric.key]
						? fmtInt(selectedStation[metric.key])
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
				<span>{fr ? 'Commodités essentielles manquantes' : 'Missing Core Amenities'}</span>
			</div>
			<div class="flex flex-wrap gap-2">
				{#each missingTier1 as amenity}
					<div
						class="flex items-center gap-1.5 text-xs bg-white text-red-600 px-2 py-1 rounded border border-red-100 shadow-sm"
					>
						{#if AMENITY_ICONS[amenity.label]}
							<Icon icon={AMENITY_ICONS[amenity.label]} class="text-sm opacity-80" />
						{/if}
						<span>{tr(amenity.label)}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if missingTier2.length > 0}
		<div class="bg-orange-50 border border-orange-100 rounded-lg p-3 mt-2">
			<div class="flex items-center gap-2 mb-2 text-orange-800 font-semibold text-sm">
				<Icon icon="mdi:alert-circle-outline" />
				<span>{fr ? 'Commodités complémentaires manquantes' : 'Missing Additional Amenities'}</span>
			</div>
			<div class="flex flex-wrap gap-2">
				{#each missingTier2 as amenity}
					<div
						class="flex items-center gap-1.5 text-xs bg-white text-orange-600 px-2 py-1 rounded border border-orange-100 shadow-sm"
					>
						{#if AMENITY_ICONS[amenity.label]}
							<Icon icon={AMENITY_ICONS[amenity.label]} class="text-sm opacity-80" />
						{/if}
						<span>{tr(amenity.label)}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<div class="legend-container mt-4">
		<Accordion>
			<div class="inline-header text-sm italic" slot="header">
				{fr
					? 'Que sont les commodités d’une collectivité complète?'
					: 'What are Complete Community Amenities?'}<Icon icon="iconoir:nav-arrow-down" />
			</div>
			<div class="text-sm my-2" slot="body">
				{#if fr}
					Les commodités d’une collectivité complète offrent des services qui répondent aux besoins
					de base de la population.<br /><br />
					<Icon icon="mdi:store" />Les commodités <strong>essentielles</strong> sont indispensables à
					une collectivité complète.
				{:else}
					Complete Community Amenities provide services that meet residents' basic needs.<br /><br />
					<Icon icon="mdi:store" /><strong>Core</strong> amenities are essential for a complete
					community.
				{/if}
				<Accordion>
					<div class="inline-header text-xs" slot="header">
						<i
							>{fr
								? 'Cliquez ici pour voir la liste complète des commodités essentielles'
								: 'Click here for a full list of core amenities'}</i
						><Icon icon="iconoir:nav-arrow-down" />
					</div>
					<div class="text-xs ml-5" slot="body">
						{#each TIER_1_AMENITIES as item}
							<li>{tr(item.label)}</li>
						{/each}
					</div>
				</Accordion>
				<br />
				{#if fr}
					<Icon icon="mdi:storefront" />Les commodités <strong>complémentaires</strong> améliorent
					la qualité de vie, sans être indispensables.
				{:else}
					<Icon icon="mdi:storefront" /><strong>Additional</strong> amenities improve outcomes but are
					not essential.
				{/if}
				<Accordion>
					<div class="inline-header text-xs" slot="header">
						<i
							>{fr
								? 'Cliquez ici pour voir la liste complète des commodités complémentaires'
								: 'Click here for a full list of additional amenities'}</i
						><Icon icon="iconoir:nav-arrow-down" />
					</div>
					<div class="text-xs ml-5" slot="body">
							<li>{tr('Appliance TV and Electronics Retailers')}</li>
							<li>{tr('Baked Goods')}</li>
							<li>{tr('Barber Shop')}</li>
							<li>{tr('Beauty Salon')}</li>
							<li>{tr('Book Stores')}</li>
							<li>{tr('Building Material and Lawn Garden Stores')}</li>
							<li>{tr('Clothing and Shoe Retailers')}</li>
							<li>{tr('Coin Laundry')}</li>
							<li>{tr('Community Health and Elderly Care Facilities')}</li>
							<li>{tr('Cosmetics and Beauty Supply Retailers')}</li>
							<li>{tr('Dentist Office')}</li>
							<li>{tr('Dry Cleaners')}</li>
							<li>{tr('Fish and Seafood Market')}</li>
							<li>{tr('Fitness and recreational sports centres')}</li>
							<li>{tr('Florists')}</li>
							<li>{tr('Fruit and Vegetable Market')}</li>
							<li>{tr('Liquor Stores')}</li>
							<li>{tr('Meat Market')}</li>
							<li>{tr('Museums and Art Galleries')}</li>
							<li>{tr('Nursing Care Facilities')}</li>
							<li>{tr('Office supplies')}</li>
							<li>{tr('Other Personal Care')}</li>
							<li>{tr('Religious Organizations')}</li>
							<li>{tr('Restaurants')}</li>
							<li>{tr('Sporting goods and Hobby Retailers')}</li>
					</div>
				</Accordion>
			</div>
		</Accordion>
	</div>
</div>
