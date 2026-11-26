<script lang="ts">
	// @ts-ignore-next-line
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
	import { trTransit } from '../../lib/data/transitdata/labels.fr';
	import { formatNumber, getLang } from '../../lib/i18n';

	let { selectedStation, ageData, selectedVariable = $bindable(), onSelectVariable } = $props();

	const fr = getLang() === 'fr';
	const pct = fr ? '\u00a0%' : '%';
	const num = (n: number) => (fr ? formatNumber(n, undefined, 'fr') : n.toLocaleString());
	const money = (n: number) =>
		fr ? formatNumber(n, undefined, 'fr') + '\u00a0$' : '$' + n.toLocaleString();

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
				label={trTransit(metric.label, fr)}
				active={selectedVariable === metric.key}
				onclick={() => onSelectVariable(selectedVariable !== metric.key ? metric.key : null)}
				value={metric.unit === '$'
					? money(Math.round(selectedStation[metric.key]))
					: num(Math.round(selectedStation[metric.key]))}
				icon={metric.icon}
			/>
		{/each}
	</div>
	<div class="metric-container">
		{#each [VisibleMinorityTotal, TotalImmigrant, IndigenousIdentity, UniversityDegree] as metric}
			<DonutMetric
				label={trTransit(metric.label, fr)}
				on:click={() => onSelectVariable(selectedVariable !== metric.key ? metric.key : null)}
				value={selectedStation[metric.key] < 5
					? selectedStation[metric.key]
					: Math.round(selectedStation[metric.key])}
				icon={metric.icon}
				suffix={pct}
			/>{/each}
	</div>
	<div class="metric-container">
		<div class="tab-chart">
			<h6 class="chart-title">
				{fr ? 'Croissance démographique projetée' : 'Projected Population Growth'}
			</h6>
			<MultiLineChart
				data={popGrowthData}
				minHeight="150px"
				xKey="date"
				seriesConfig={[{ key: 'growth', label: fr ? 'Taux de croissance' : 'Growth Rate', color: 'var(--color-green-400)' }]}
				formatLabelX={(d: Date) => d.getFullYear().toString()}
				formatLabelY={(d: number) => d.toFixed(0) + pct}
				formatValue={(value: any) => {
					if (value && typeof value === 'object') {
						const { d, key } = value as { d: number; key: string };
						return key === 'growth'
							? (fr
									? formatNumber(d, { minimumFractionDigits: 2, maximumFractionDigits: 2 }, 'fr')
									: d.toFixed(2)) + pct
							: String(d);
					}
					return String(value);
				}}
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
				title={fr ? 'Âge' : 'Age'}
				xMax="100"
				mode="stacked"
				legend="true"
				xSuffix={pct}
				showTooltip={true}
				padding={{ top: 0, bottom: 20, left: 0, right: 20 }}
			/>
		</div>
	</div>
</div>
