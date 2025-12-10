<script lang="ts">
	import {
		bii,
		BusinessCount,
		Daily_Visits,
		Overall_score,
		Tier_1_presence,
		Tier_2_presence,
		Unique_Visitors
	} from '../../lib/data/transitdata/config.json';
	import DonutMetric from '../../lib/ui/DonutMetric.svelte';
	import GaugeMetric from '../../lib/ui/GaugeMetric.svelte';
	import TransitMetric from '../../lib/ui/TransitMetric.svelte';
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
		{#each [Daily_Visits, Unique_Visitors] as metric}
			<TransitMetric
				disabled
				label={metric.label}
				active={selectedVariable === metric.key}
				on:click={() => onSelectVariable(selectedVariable !== metric.key ? metric.key : null)}
				value={Math.round(stationVisitorData[metric.key]).toLocaleString()}
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
		<GaugeMetric label={bii.label} value={selectedStation[bii.key]} maxValue={1} />
	</div>
	<div class="metric-container">
		{#each [Tier_1_presence, Tier_2_presence, Overall_score] as metric}
			<DonutMetric
				label={metric.label}
				value={Math.round(stationCCpresence[metric.key])}
				icon={metric.icon}
				suffix={metric.unit}
				disabled
			/>
		{/each}
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
