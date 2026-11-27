<script lang="ts">
	//@ts-ignore-next-line
	import { BarChart } from '@onsvisual/svelte-charts';
	import {
		HouseValue,
		HousingTotal,
		MonthlyRent,
		MoreThan30OnShelter
	} from '../../lib/data/transitdata/config.json';
	import DonutMetric from '../../lib/ui/charts/DonutMetric.svelte';
	import TransitMetric from '../../lib/ui/TransitMetric.svelte';
	import './tabs.css';
	import { trTransit } from '../../lib/data/transitdata/labels.fr';
	import { formatNumber, getLang } from '../../lib/i18n';

	let {
		selectedStation,
		ownerData,
		dwellingData,
		housingData,
		bedData,
		selectedVariable = $bindable(),
		onSelectVariable
	} = $props();

	const fr = getLang() === 'fr';
	const pct = fr ? '\u00a0%' : '%';
	const num = (n: number) => (fr ? formatNumber(n, undefined, 'fr') : n.toLocaleString());
	const money = (n: number) =>
		fr ? formatNumber(n, undefined, 'fr') + '\u00a0$' : '$' + n.toLocaleString();
</script>

<div class="tab-content">
	<div class="metric-container">
		{#each [HousingTotal, HouseValue, MonthlyRent] as metric}
			<TransitMetric
				label={trTransit(metric.label, fr)}
				active={selectedVariable === metric.key}
				onclick={() => onSelectVariable(selectedVariable !== metric.key ? metric.key : null)}
				value={metric.unit === '$'
					? money(Math.round(selectedStation[metric.key]))
					: num(Math.round(selectedStation[metric.key]))}
				icon={metric.icon}
				disabled={metric.key === 'HousingTotal'}
			/>
		{/each}
	</div>
	<div class="metric-container">
		<DonutMetric
			label={trTransit(MoreThan30OnShelter.label, fr)}
			value={Math.round(selectedStation[MoreThan30OnShelter.key])}
			icon={MoreThan30OnShelter.icon}
			suffix={fr ? pct : MoreThan30OnShelter.unit}
			fillColor={'#002940'}
			disabled
		/>
	</div>
	<div class="tab-chart-container">
		<div class="tab-chart">
			<BarChart
				colors={['#002a41', '#0098D6']}
				data={ownerData}
				zKey="label"
				xKey="value"
				yKey="y"
				title={fr ? 'Propriétaires/locataires' : 'Owners/Renters'}
				xMax="100"
				mode="stacked"
				legend="true"
				xSuffix={pct}
				padding={{ top: 0, bottom: 20, left: 0, right: 20 }}
			/>
		</div>
		<div class="tab-chart">
			<BarChart
				colors={['#002a41', '#0098D6', '#F35D00', '#db3069', '#8A4285', '#43B171']}
				data={dwellingData}
				zKey="label"
				xKey="value"
				yKey="y"
				title={fr ? 'Type de logement' : 'Dwelling Type'}
				xMax="100"
				mode="stacked"
				legend="true"
				xSuffix={pct}
				padding={{ top: 0, bottom: 20, left: 0, right: 20 }}
			/>
		</div>
		<div class="tab-chart">
			<BarChart
				colors={['#002a41']}
				data={housingData}
				xKey="value"
				yKey="label"
				title={fr ? 'Année de construction des logements' : 'Housing Construction Year'}
				yMax="100"
				xSuffix={pct}
				padding={{ top: 0, bottom: 20, left: 60, right: 20 }}
			/>
		</div>
		<div class="tab-chart">
			<BarChart
				colors={['#2a5cac']}
				data={bedData}
				xKey="value"
				yKey="label"
				title={fr ? 'Nombre de chambres' : 'Number of Bedrooms'}
				yMax="100"
				xSuffix={pct}
				padding={{ top: 0, bottom: 20, left: 60, right: 20 }}
			/>
		</div>
	</div>
</div>
