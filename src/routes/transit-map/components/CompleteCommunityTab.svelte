<script lang="ts">
	import Icon from '@iconify/svelte';
	import Accordion from '../../lib/ui/Accordion.svelte';
	import DonutMetric from '../../lib/ui/DonutMetric.svelte';
	import GaugeMetric from '../../lib/ui/GaugeMetric.svelte';
	import TransitMetric from '../../lib/ui/TransitMetric.svelte';
	import LegendItem from '../../lib/ui/legends/LegendItem.svelte';
	import './tabs.css';

	export let map;
	export let selectedStation;
	export let stationCCcounts;
	export let stationVisitorData;
	export let stationCCpresence;
	export let businessData;
	export let civicData;
	export let selectedVariable: string;
	export let onSelectVariable: (v: string) => void;

	let open = true;
</script>

<div class="tab-content">
	<div class="legend-container">
		<Accordion>
			<div class="inline-header" slot="header">
				<div class="text-sm inline-header">
					<Icon icon="mdi:map-legend" />Legend<Icon icon="iconoir:nav-arrow-down" />
				</div>
			</div>
			<div class="accordion-body" slot="body">
				<h6 class="my-3">Complete Community Amenities</h6>
				<div class="tab-controls">
					<div class="inline-header text-sm">
						<div class="text-sm italic">Click on a layer to turn it on or off</div>
					</div>
					<Accordion>
						<div class="inline-header text-sm" slot="header">
							Tier 1<Icon icon="iconoir:nav-arrow-down" />
						</div>
						<div class="accordion-body" slot="body">
							<LegendItem
								{map}
								variant={'circle'}
								label={'Childcare'}
								bgcolor={'#f13737'}
								bordercolor={'#fff'}
								button={true}
								id={'complete-community-amenities'}
								useFilter={true}
								filterProperty="Group Name"
								filterValue={'Childcare'}
							/>
							<LegendItem
								{map}
								variant={'circle'}
								label={'Community Centre'}
								bgcolor={'#43b171'}
								bordercolor={'#fff'}
								button={true}
								id={'complete-community-amenities'}
								useFilter={true}
								filterProperty="Group Name"
								filterValue={'Community Centres'}
							/>
							<LegendItem
								{map}
								variant={'circle'}
								label={'Convenience Store'}
								bgcolor={'#db3069'}
								bordercolor={'#fff'}
								button={true}
								id={'complete-community-amenities'}
								useFilter={true}
								filterProperty="Group Name"
								filterValue={'Convenience Store'}
							/>
							<LegendItem
								{map}
								variant={'circle'}
								label={'Library'}
								bgcolor={'#8a4285'}
								bordercolor={'#fff'}
								button={true}
								id={'complete-community-amenities'}
								useFilter={true}
								filterProperty="Group Name"
								filterValue={'Libraries'}
							/>
							<LegendItem
								{map}
								variant={'circle'}
								label={'Personal and Commercial Banking'}
								bgcolor={'#f45d01'}
								bordercolor={'#fff'}
								button={true}
								id={'complete-community-amenities'}
								useFilter={true}
								filterProperty="Group Name"
								filterValue={'Personal and Commercial Banking'}
							/>
							<LegendItem
								{map}
								variant={'circle'}
								label={'Pharmacy'}
								bgcolor={'#f1c500'}
								bordercolor={'#fff'}
								button={true}
								id={'complete-community-amenities'}
								useFilter={true}
								filterProperty="Group Name"
								filterValue={'Pharmacy'}
							/>
							<LegendItem
								{map}
								variant={'circle'}
								label={'Physicians Office'}
								bgcolor={'#e37d9d'}
								bordercolor={'#fff'}
								button={true}
								id={'complete-community-amenities'}
								useFilter={true}
								filterProperty="Group Name"
								filterValue={'Physicians Office'}
							/>
							<LegendItem
								{map}
								variant={'circle'}
								label={'Post Office'}
								bgcolor={'#921111'}
								bordercolor={'#fff'}
								button={true}
								id={'complete-community-amenities'}
								useFilter={true}
								filterProperty="Group Name"
								filterValue={'Post Office'}
							/>
							<LegendItem
								{map}
								variant={'circle'}
								label={'Primary or Secondary School'}
								bgcolor={'#58e965'}
								bordercolor={'#fff'}
								button={true}
								id={'complete-community-amenities'}
								useFilter={true}
								filterProperty="Group Name"
								filterValue={'Primary and Secondary Schools'}
							/>
							<LegendItem
								{map}
								variant={'circle'}
								label={'Supermarket'}
								bgcolor={'#23c9ff'}
								bordercolor={'#fff'}
								button={true}
								id={'complete-community-amenities'}
								useFilter={true}
								filterProperty="Group Name"
								filterValue={'Supermarket'}
							/>
						</div>
					</Accordion>
					<Accordion>
						<div class="inline-header text-sm" slot="header">
							Tier 2<Icon icon="iconoir:nav-arrow-down" />
						</div>
						<div class="accordion-body" slot="body">
							<LegendItem
								{map}
								variant={'circle'}
								label={'Tier 2'}
								bgcolor={'#2a5cac'}
								bordercolor={'#fff'}
								button={true}
								id={'complete-community-amenities'}
								useFilter={true}
								filterProperty="Tier"
								filterValue={2}
							/>
						</div>
					</Accordion>
				</div>
				<div class="text-sm my-2">
					<strong>Tier 1</strong> amenities are essential for a complete community. <br /><br />
					<strong>Tier 2</strong> amenities improve outcomes but are not essential.
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
							<li>Childcare</li>
							<li>Community Centres</li>
							<li>Community Health and Elderly Care Facilities</li>
							<li>Cosmetics and Beauty Supply Retailers</li>
							<li>Fish and Seafood Market</li>
							<li>Fitness and recreational sports centres</li>
							<li>Fruit and Vegetable Market</li>
							<li>Libraries</li>
							<li>Liquor Stores</li>
							<li>Meat Market</li>
							<li>Nursing Care Facilities</li>
							<li>Office supplies</li>
							<li>Other Personal Care</li>
							<li>Pharmacy</li>
							<li>Physicians Office</li>
						</div>
					</Accordion>
				</div>
			</div>
		</Accordion>
	</div>
	<div class="metric-container">
		<TransitMetric
			disabled
			label={'Average Daily Visitors'}
			active={selectedVariable === 'Daily_Visits'}
			on:click={() => onSelectVariable(selectedVariable !== 'Daily_Visits' ? 'Daily_Visits' : null)}
			value={Math.round(stationVisitorData.Daily_Visits).toLocaleString()}
			icon={'mdi:shop'}
		/>
		<TransitMetric
			disabled
			label={'Average Unique Daily Visitors'}
			active={selectedVariable === 'Unique_Visitors'}
			on:click={() =>
				onSelectVariable(selectedVariable !== 'Unique_Visitors' ? 'Unique_Visitors' : null)}
			value={Math.round(stationVisitorData.Unique_Visitors).toLocaleString()}
			icon={'mdi:shop'}
		/>
	</div>
	<div class="metric-container">
		<TransitMetric
			label={'Main Street Businesses'}
			active={selectedVariable === 'BusinessCount'}
			on:click={() =>
				onSelectVariable(selectedVariable !== 'BusinessCount' ? 'BusinessCount' : null)}
			value={Math.round(selectedStation.BusinessCount).toLocaleString()}
			icon={'mdi:shop'}
		/>
		<GaugeMetric label={'Independent Business Index'} value={selectedStation.bii} maxValue={1} />
	</div>
	<div class="metric-container">
		<DonutMetric
			label={'Tier 1 Presence'}
			value={Math.round(stationCCpresence['Tier_1_presence'])}
			icon={'mdi:store'}
			suffix="%"
			fillColor={'#db3069'}
			disabled
		/>
		<DonutMetric
			label={'Tier 2 Presence'}
			value={Math.round(stationCCpresence['Tier_2_presence'])}
			icon={'mdi:storefront'}
			suffix="%"
			fillColor={'#2a5cac'}
			disabled
		/>
		<DonutMetric
			label={'Overall Score'}
			value={Math.round(stationCCpresence['Overall_score'])}
			icon={'mdi:storefront'}
			suffix="%"
			fillColor={'#2a5cac'}
			disabled
		/>
	</div>
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
</div>
