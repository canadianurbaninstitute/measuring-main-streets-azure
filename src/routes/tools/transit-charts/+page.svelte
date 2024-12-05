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
  <div class="legend">
    <div class="legend-item">
      <span class="legend-box existing"></span>
      <span>Existing</span>
    </div>
    <div class="legend-item">
      <span class="legend-box planned"></span>
      <span>Planned</span>
    </div>
    <div class="legend-item">
      <span class="legend-box construction"></span>
      <span>Construction</span>
    </div>
  </div>
</div>



</div>

<style>
 .chart-container {
  margin: 2em;
 }

 .legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: Arial, sans-serif;
  font-size: 14px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-box {
  width: 20px;
  height: 20px;
  display: inline-block;
  background-color: #808080; /* Grey background for all */
}

.existing {
  /* Solid grey */
}

.planned {
  background: repeating-linear-gradient(
    45deg,
    #808080, /* Grey */
    #808080 5px,
    transparent 5px,
    transparent 10px
  );
}

.construction {
  background: repeating-linear-gradient(
    -45deg,
    #808080, /* Grey */
    #808080 5px,
    transparent 5px,
    transparent 10px
  );
}

</style>