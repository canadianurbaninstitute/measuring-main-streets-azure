<script>
	import TransitChart from './TransitChart.svelte';
  import { onMount } from 'svelte';
  import stationData from '../../lib/data/chart-stations.json';
</script>

<div class='chart-container'>
<h1>Transit Charts</h1>
<p>The transit chart chart shows key data for each stop along a selected transit line. You can choose a line and a metric—such as population, households, or average income—and the chart will update to display how that metric varies across the stations. Each bar represents a stop, with taller bars indicating higher values. This helps you quickly compare areas along the route and understand patterns in the station areas of the transit system.</p>
<TransitChart data={stationData} />
<!-- <div class="legend-container">
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
</div> -->



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