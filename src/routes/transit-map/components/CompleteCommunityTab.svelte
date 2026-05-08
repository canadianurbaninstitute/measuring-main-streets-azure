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
	import TransitMetric from '../../lib/ui/TransitMetric.svelte';
	import CustomButton from '../../lib/ui/CustomButton.svelte';
	import './tabs.css';

	let {
		selectedStation,
		stationVisitorData,
		stationCCpresence,
		selectedVariable = $bindable(),
		onSelectVariable
	} = $props();
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
				suffix={metric.unit}
				fillColor="var(--color-zinc-400)"
			/>
		{/each}
	</div>
	<div class="metric-container">
		{#each [Daily_Visits, TotalHouseholds] as metric}
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
			value={Math.round(selectedStation[BusinessCount.key]).toLocaleString()}
			icon={BusinessCount.icon}
		/>
		<GaugeMetric
			label={bii.label}
			value={Math.round(selectedStation[bii.key] * 100)}
			maxValue={100}
		/>
	</div>
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
		label="Read the Complete Communities report"
		className="mt-2 w-full"
		color="pink"
	/>
	<CustomButton
		href="/tools/complete-communities"
		label="Try the Complete Communities Tool"
		className="mt-2 w-full"
		variant="secondary"
		color="pink"
	/>
</div>
