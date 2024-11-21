<script>
    import PopulationChart from './PopulationChart.svelte';
    import { onMount } from 'svelte';
  
    let stationData = [];
    let groupedStations = []; // Declare groupedStations outside onMount for reactivity
  
    onMount(async () => {
      const response = await fetch('/src/routes/lib/data/stations.json'); // Adjust the path as needed
      stationData = await response.json();
  
      // Group data by line_label
      groupedStations = Object.entries(
        stationData.reduce((acc, station) => {
          (acc[station.line_label] = acc[station.line_label] || []).push(station);
          return acc;
        }, {})
      );
    });
  </script>
  
  <main>
    <h1>Transit Line Charts</h1>
    {#if groupedStations.length > 0}
      {#each groupedStations as [lineLabel, stations]}
        <section>
          <h2>{lineLabel}</h2>
          <PopulationChart lineLabel={lineLabel} stations={stations} />
        </section>
      {/each}
    {:else}
      <p>Loading data...</p>
    {/if}
  </main>
  