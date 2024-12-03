<script>
	import PopulationChart from './PopulationChart.svelte';
  import LegendItem from '../../lib/ui/legends/LegendItem.svelte';
  import { onMount } from 'svelte';

  let stationData = [];

  onMount(async () => {
    const response = await fetch('/src/routes/lib/data/chart-stations.json');
    stationData = await response.json();
  });
</script>

<div class='chart-container'>
<h1>Transit Charts</h1>
<PopulationChart data={stationData} />
<div class="legend-container">
  <LegendItem variant={'polygon'} label={'Existing'} bgcolor={'#002940'} />
  <LegendItem variant={'polygon'} label={'Planned'} bgcolor={'#00adf2'} />
  <LegendItem variant={'polygon'} label={'Construction'} bgcolor={'#DB3069'} />
</div>
</div>

<style>
 .chart-container {
  margin: 2em;
 }
</style>