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
	import MultiLineChart from '../../lib/ui/charts/MultiLineChart.svelte';
	import TransitMetric from '../../lib/ui/TransitMetric.svelte';
	import './tabs.css';

	let { selectedStation, ageData, selectedVariable = $bindable(), onSelectVariable } = $props();

	const popGrowthData = $derived([
		{
			date: new Date(2025, 0, 1),
			period: '2020-2025',
			growth: selectedStation?.PopGrowth2020to2025
		},
		{
			date: new Date(2030, 0, 1),
			period: '2025-2030',
			growth: selectedStation?.PopGrowth2025to2030
		},
		{
			date: new Date(2035, 0, 1),
			period: '2030-2035',
			growth: selectedStation?.PopGrowth2030to2035
		}
	]);
</script>

<div class="tab-content gap-1">
	<div class="metric-container">
		{#each [TotalPopulation, TotalHouseholds, AverageEmploymentIncome] as metric}
			<TransitMetric
				id={metric.key}
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
	<div class="metric-container">
		<div class="tab-chart">
			<h6 class="chart-title">Projected Population Growth</h6>
			<MultiLineChart
				data={popGrowthData}
				minHeight="150px"
				xKey="date"
				seriesConfig={[{ key: 'growth', label: 'Growth Rate', color: 'var(--color-green-400)' }]}
				formatLabelX={(d: Date) => d.getFullYear().toString()}
				formatLabelY={(d: number) => d.toFixed(0) + '%'}
				formatValue={({ d, key }: { d: number; key: string }) =>
					(key === 'growth' ? d.toFixed(2) + '%' : key === 'period' ? d : d) as string}
				yDomain={[0, 40]}
				ticks={popGrowthData.map((d) => new Date(d.date))}
				showLegend={false}
				showTooltipTotal={false}
			/>
		</div>
	</div>
	<div class="metric-container">
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
				showTooltip={true}
				padding={{ top: 0, bottom: 20, left: 0, right: 20 }}
			/>
		</div>
	</div>
</div>
