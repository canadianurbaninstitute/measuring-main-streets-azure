<script lang="ts">
	import Icon from '@iconify/svelte';
	import {
		bii,
		BusinessCount,
		Daily_Visits,
		Overall_score,
		Tier_1_presence,
		Tier_2_presence,
		TotalHouseholds
	} from '../../lib/data/transitdata/config.json';
	import Accordion from '../../lib/ui/Accordion.svelte';
	import GaugeMetric from '../../lib/ui/charts/GaugeMetric.svelte';
	import CustomButton from '../../lib/ui/CustomButton.svelte';
	import TransitMetric from '../../lib/ui/TransitMetric.svelte';
	import './tabs.css';
	import { trTransit } from '../../lib/data/transitdata/labels.fr';
	import { formatNumber, getLang } from '../../lib/i18n';

	let {
		selectedStation,
		stationVisitorData,
		stationCCpresence,
		selectedVariable = $bindable(),
		onSelectVariable
	} = $props();

	const fr = getLang() === 'fr';
	const pct = fr ? '\u00a0%' : '%';
	const num = (n: number) => (fr ? formatNumber(n, undefined, 'fr') : n.toLocaleString());

	// Amenity lists for the French explainer, translated and sorted in French order.
	const frSorted = (list: string[]) =>
		list.map((a) => trTransit(a, true)).sort((a, b) => a.localeCompare(b, 'fr'));
	const CORE_AMENITY_LIST_FR = frSorted([
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
	]);
	const ADDITIONAL_AMENITY_LIST_FR = frSorted([
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
	]);
</script>

<div class="tab-content">
	<div class="metric-container">
		<GaugeMetric
			label={trTransit(Overall_score.label, fr)}
			value={Math.round(stationCCpresence[Overall_score.key])}
			icon={Overall_score.icon}
			suffix={fr ? pct : Overall_score.unit}
			fillColor="var(--color-zinc-400)"
		/>
	</div>
	<div class="metric-container">
		{#each [Tier_1_presence, Tier_2_presence] as metric}
			<GaugeMetric
				size={140}
				label={trTransit(metric.label, fr)}
				value={Math.round(stationCCpresence[metric.key])}
				suffix={fr ? pct : metric.unit}
				fillColor="var(--color-zinc-400)"
			/>
		{/each}
	</div>
	<div class="metric-container">
		{#each [Daily_Visits, TotalHouseholds] as metric}
			<TransitMetric
				disabled
				label={trTransit(metric.label, fr)}
				active={selectedVariable === metric.key}
				onclick={() => onSelectVariable(selectedVariable !== metric.key ? metric.key : null)}
				value={stationVisitorData && stationVisitorData[metric.key]
					? num(Math.round(stationVisitorData[metric.key]))
					: selectedStation && selectedStation[metric.key]
						? num(Math.round(selectedStation[metric.key]))
						: '0'}
				icon={metric.icon}
			/>
		{/each}
	</div>
	<div class="metric-container">
		<TransitMetric
			label={trTransit(BusinessCount.label, fr)}
			active={selectedVariable === BusinessCount.key}
			onclick={() =>
				onSelectVariable(selectedVariable !== BusinessCount.key ? BusinessCount.key : null)}
			value={num(Math.round(selectedStation[BusinessCount.key]))}
			icon={BusinessCount.icon}
		/>
		<GaugeMetric
			label={trTransit(bii.label, fr)}
			value={Math.round(selectedStation[bii.key] * 100)}
			maxValue={100}
		/>
	</div>
	{#if fr}
		<div class="legend-container">
			<Accordion>
				<div class="inline-header text-sm italic" slot="header">
					Que sont les commodités des collectivités complètes?<Icon icon="iconoir:nav-arrow-down" />
				</div>
				<div class="text-sm my-2" slot="body">
					Les commodités des collectivités complètes offrent des services qui répondent aux besoins
					essentiels de la population.<br /><br />
					<Icon icon="mdi:store" />Les commodités <strong>essentielles</strong> sont indispensables à
					une collectivité complète.
					<Accordion>
						<div class="inline-header text-xs" slot="header">
							<i>Cliquez ici pour voir la liste complète des commodités essentielles</i><Icon
								icon="iconoir:nav-arrow-down"
							/>
						</div>
						<div class="text-xs ml-5" slot="body">
							{#each CORE_AMENITY_LIST_FR as amenity}
								<li>{amenity}</li>
							{/each}
						</div>
					</Accordion>
					<br />
					<Icon icon="mdi:storefront" />Les commodités <strong>complémentaires</strong> améliorent la
					qualité de vie sans être indispensables.
					<Accordion>
						<div class="inline-header text-xs" slot="header">
							<i>Cliquez ici pour voir la liste complète des commodités complémentaires</i><Icon
								icon="iconoir:nav-arrow-down"
							/>
						</div>
						<div class="text-xs ml-5" slot="body">
							{#each ADDITIONAL_AMENITY_LIST_FR as amenity}
								<li>{amenity}</li>
							{/each}
						</div>
					</Accordion>
				</div>
			</Accordion>
		</div>
	{:else}
		<div class="legend-container">
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
							<li>Childcare</li>
							<li>Community Centres</li>
							<li>Convenience Store</li>
							<li>Libraries</li>
							<li>Personal and Commercial Banking</li>
							<li>Pharmacy</li>
							<li>Physicians Office</li>
							<li>Post Office</li>
							<li>Primary and Secondary Schools</li>
							<li>Supermarket</li>
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
	{/if}
	<!-- <h5 class="mt-3 mb-1">Want to dig deeper?</h5>
	<button class="button-primary"> Go to the Complete Communities Tool </button> -->
	<!-- <div class="chart-container">
		<div class="chart">
			<BarChart
				colors={['#43b171', '#F13737', '#2a5cac']}
				data={businessData}
				zKey="label"
				xKey="value"
				yKey="y"
				title="Main Street Business"
				xMax="100"
				mode="stacked"
				legend="true"
				xSuffix="%"
				padding={{ top: 0, bottom: 20, left: 0, right: 20 }}
			/>
		</div>
	</div> -->
	<!-- <TransitMetric
		label={'Civic Infrastructure Locations'}
		active={selectedVariable === 'CivicCount'}
		on:click={() => onSelectVariable('CivicCount')}
		value={Math.round(selectedStation.CivicCount).toLocaleString()}
		icon={'mdi:museum'}
	/>
	<div class="tab-chart-container">
		<div class="tab-chart">
			<BarChart
				colors={['#DB3069', '#F45D01', '#8A4285', '#33AED7', '#43B171']}
				data={civicData}
				zKey="label"
				xKey="value"
				yKey="y"
				title="Civic Infrastructure"
				xMax="100"
				mode="stacked"
				legend="true"
				xSuffix="%"
				padding={{ top: 0, bottom: 20, left: 0, right: 20 }}
			/>
		</div>
	</div> -->
	<CustomButton
		href="/reports/tod/complete-communities"
		label={fr
			? 'Lire le rapport sur les collectivités complètes'
			: 'Read the Complete Communities report'}
		className="mt-2 w-full"
		color="pink"
	/>
	<CustomButton
		href="/tools/complete-communities"
		label={fr
			? 'Essayer l’outil des collectivités complètes'
			: 'Try the Complete Communities Tool'}
		className="mt-2 w-full"
		variant="secondary"
		color="pink"
	/>
</div>
