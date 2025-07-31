<script>
	import TransitChart from './TransitChart.svelte';

	import stationData from '../../lib/data/transitdata/chart-stations.json';

	import '../../styles.css';
</script>

<div class="hero">
	<h1>Transit Charts</h1>
	<p>
		The transit chart shows key data for each stop along a selected transit line. You can choose a
		line and a metric—such as population, households, or average income—and the chart will update to
		display how that metric varies across the stations. Each bar represents a stop, with taller bars
		indicating higher values. This helps you quickly compare areas along the route and understand
		patterns in the station areas of the transit system.
	</p>
</div>

<div class="chart-container">
	<TransitChart data={stationData} />
</div>

<style>
	.chart-container {
		margin: 2em;
	}
</style>
