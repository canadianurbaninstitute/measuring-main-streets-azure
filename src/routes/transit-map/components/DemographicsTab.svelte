<script lang="ts">
	import { BarChart } from '@onsvisual/svelte-charts';
	import DonutMetric from '../../lib/ui/DonutMetric.svelte';
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
			active={selectedVariable === 'TotalPopulation'}
			on:click={() =>
				onSelectVariable(selectedVariable !== 'TotalPopulation' ? 'TotalPopulation' : null)}
			value={selectedStation.TotalPopulation.toLocaleString()}
			icon={'fluent:people-20-filled'}
		/>
		<TransitMetric
			label={'Households'}
			active={selectedVariable === 'TotalHouseholds'}
			on:click={() =>
				onSelectVariable(selectedVariable !== 'TotalHouseholds' ? 'TotalHouseholds' : null)}
			value={selectedStation.TotalHouseholds.toLocaleString()}
			icon={'mdi:house'}
		/>
	</div>
	<TransitMetric
		active={selectedVariable === 'AverageEmploymentIncome'}
		on:click={() =>
			onSelectVariable(
				selectedVariable !== 'AverageEmploymentIncome' ? 'AverageEmploymentIncome' : null
			)}
		label={'Average Employment Income'}
		value={'$' + Math.round(selectedStation.AverageEmploymentIncome).toLocaleString()}
		icon={'mdi:wallet'}
	/>
	<div class="grid grid-cols-3 gap-[0.3em]">
		<DonutMetric
			active={selectedVariable === 'VisibleMinorityTotal'}
			on:click={() =>
				onSelectVariable(
					selectedVariable !== 'VisibleMinorityTotal' ? 'VisibleMinorityTotal' : null
				)}
			label={'Visible Minority'}
			value={Math.round(selectedStation.VisibleMinorityTotal)}
			icon={'mdi:people'}
			suffix="%"
		/>
		<DonutMetric
			active={selectedVariable === 'TotalImmigrant'}
			on:click={() =>
				onSelectVariable(selectedVariable !== 'TotalImmigrant' ? 'TotalImmigrant' : null)}
			label={'Immigrants'}
			value={Math.round(selectedStation.TotalImmigrant)}
			icon={'mdi:globe'}
			suffix="%"
		/>
		<DonutMetric
			active={selectedVariable === 'IndigenousIdentity'}
			on:click={() =>
				onSelectVariable(selectedVariable !== 'IndigenousIdentity' ? 'IndigenousIdentity' : null)}
			label={'Indigenous'}
			value={selectedStation.IndigenousIdentity}
			icon={'mdi:people'}
			suffix="%"
		/>
	</div>
	<DonutMetric
		label={'University Degree'}
		active={selectedVariable === 'UniversityDegree'}
		on:click={() =>
			onSelectVariable(selectedVariable !== 'UniversityDegree' ? 'UniversityDegree' : null)}
		value={Math.round(selectedStation.UniversityDegree)}
		icon={'mdi:school'}
		suffix="%"
	/>
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
