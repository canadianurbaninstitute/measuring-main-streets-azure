<script lang="ts">
	import { BarChart } from '@onsvisual/svelte-charts';
	import {
		AverageEmploymentIncome,
		IndigenousIdentity,
		TotalHouseholds,
		TotalImmigrant,
		TotalPopulation,
		UniversityDegree,
		VisibleMinorityTotal
	} from '../../lib/data/transitdata/config.json';
	import DonutMetric from '../../lib/ui/charts/DonutMetric.svelte';
	import TransitMetric from '../../lib/ui/charts/TransitMetric.svelte';
	import './tabs.css';

	let { selectedStation, ageData, selectedVariable = $bindable(), onSelectVariable } = $props();
</script>

<div class="tab-content gap-1">
	<div class="metric-container">
		{#each [TotalPopulation, TotalHouseholds, AverageEmploymentIncome] as metric}
			<TransitMetric
				label={metric.label}
				active={selectedVariable === metric.key}
				on:click={() => onSelectVariable(selectedVariable !== metric.key ? metric.key : null)}
				value={metric.unit === '$'
					? metric.unit + Math.round(selectedStation[metric.key]).toLocaleString()
					: Math.round(selectedStation[metric.key]).toLocaleString()}
				icon={metric.icon}
			/>
		{/each}
	</div>
	<div class="metric-container">
		{#each [VisibleMinorityTotal, TotalImmigrant, IndigenousIdentity, UniversityDegree] as metric}
			<DonutMetric
				label={metric.label}
				on:click={() => onSelectVariable(selectedVariable !== metric.key ? metric.key : null)}
				value={selectedStation[metric.key] < 5
					? selectedStation[metric.key]
					: Math.round(selectedStation[metric.key])}
				icon={metric.icon}
				suffix="%"
			/>{/each}
	</div>
	<div class="tab-chart-container">
		<div class="tab-chart">
			<BarChart
				colors={['#002a41', '#0098D6', '#db3069']}
				data={ageData}
				zKey="label"
				xKey="value"
				yKey="y"
				title="Age"
				xMax="100"
				mode="stacked"
				legend="true"
				xSuffix="%"
				padding={{ top: 0, bottom: 20, left: 0, right: 20 }}
			/>
		</div>
	</div>
</div>
