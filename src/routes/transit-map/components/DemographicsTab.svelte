<script lang="ts">
	import { BarChart } from '@onsvisual/svelte-charts';
	import DonutMetric from '../../lib/components/DonutMetric.svelte';
	import TransitMetric from '../../lib/ui/TransitMetric.svelte';
	import './tabs.css';

	export let selectedStation;
	export let ageData;
	export let selectedVariable: string;
	export let onSelectVariable: (v: string) => void;
</script>

<div class="tab-content gap-1">
	<div class="metric-container gap-[0.3em]">
		<TransitMetric
			label={'Population'}
			active={selectedVariable === 'PopulationDensity'}
			on:click={() => onSelectVariable('PopulationDensity')}
			value={selectedStation.TotalPopulation.toLocaleString()}
			icon={'fluent:people-20-filled'}
		/>
		<TransitMetric
			label={'Households'}
			active={selectedVariable === 'TotalHouseholds'}
			on:click={() => onSelectVariable('TotalHouseholds')}
			value={selectedStation.TotalHouseholds.toLocaleString()}
			icon={'mdi:house'}
		/>
	</div>
	<TransitMetric
		active={selectedVariable === 'AverageEmploymentIncome'}
		on:click={() => onSelectVariable('AverageEmploymentIncome')}
		label={'Average Employment Income'}
		value={'$' + Math.round(selectedStation.AverageEmploymentIncome).toLocaleString()}
		icon={'mdi:wallet'}
	/>
	<div class="grid grid-cols-3 gap-[0.3em]">
		<DonutMetric
			active={selectedVariable === 'VisibleMinorityTotal'}
			on:click={() => onSelectVariable('VisibleMinorityTotal')}
			label={'Visible Minority'}
			value={Math.round(selectedStation.VisibleMinorityTotal)}
			icon={'mdi:people'}
			suffix="%"
		/>
		<DonutMetric
			active={selectedVariable === 'TotalImmigrant'}
			on:click={() => onSelectVariable('TotalImmigrant')}
			label={'Immigrants'}
			value={Math.round(selectedStation.TotalImmigrant)}
			icon={'mdi:globe'}
			suffix="%"
		/>
		<DonutMetric
			active={selectedVariable === 'IndigenousIdentity'}
			on:click={() => onSelectVariable('IndigenousIdentity')}
			label={'Indigenous'}
			value={Math.round(selectedStation.IndigenousIdentity)}
			icon={'mdi:people'}
			suffix="%"
		/>
	</div>
	<DonutMetric
		label={'University Degree'}
		active={selectedVariable === 'UniversityDegree'}
		on:click={() => onSelectVariable('UniversityDegree')}
		value={Math.round(selectedStation.UniversityDegree * 10) / 10}
		icon={'mdi:school'}
		suffix="%"
	/>
	<div class="chart-container">
		<div class="chart">
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
