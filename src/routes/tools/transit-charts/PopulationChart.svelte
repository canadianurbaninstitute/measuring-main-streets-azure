<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  export let data;

  let selectedLine = '';
  let selectedVariable = 'population';
  let uniqueLines = [];
  let chart;

  $: {
    if (data) {
      uniqueLines = [...new Set(data.map(d => d.line_label))].sort();
      if (!selectedLine && uniqueLines.length > 0) {
        selectedLine = uniqueLines[0];
      }
    }
  }

  $: filteredData = data?.filter(d => d.line_label === selectedLine) || [];

  const statusColors = {
    'Existing': '#002a41',
    'Planned': '#0098D6',
    'Construction': '#db3069'
  };

  const variables = [
    { value: 'population', label: 'Population' },
    { value: 'households', label: 'Households' },
    { value: 'dwellings', label: 'Dwellings' }
  ];

  function updateChart() {
    if (!filteredData.length) return;

    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const width = chart.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear previous chart
    d3.select(chart).selectAll('*').remove();

    const svg = d3.select(chart)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .range([0, width])
      .domain(filteredData.map(d => d.stop_label))
      .padding(0.2);

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(filteredData, d => d[selectedVariable])]);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y));

    // Add bars
    svg.selectAll('rect')
      .data(filteredData)
      .enter()
      .append('rect')
      .attr('x', d => x(d.stop_label))
      .attr('y', d => y(d[selectedVariable]))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d[selectedVariable]))
      .attr('fill', d => statusColors[d.status]);


    // // Add legend
    // const legend = svg.append('g')
    //   .attr('transform', `translate(${width - 120}, 0)`);

    // Object.entries(statusColors).forEach(([status, color], i) => {
    //   legend.append('rect')
    //     .attr('x', 0)
    //     .attr('y', i * 20)
    //     .attr('width', 15)
    //     .attr('height', 15)
    //     .attr('fill', color);

    //   legend.append('text')
    //     .attr('x', 20)
    //     .attr('y', i * 20 + 12)
    //     .text(status)
    //     .style('font-size', '12px');
    // });
  }

  $: {
    if (chart && selectedLine && selectedVariable) {
      updateChart();
    }
  }

  onMount(() => {
    window.addEventListener('resize', updateChart);
    return () => window.removeEventListener('resize', updateChart);
  });
</script>

<div class="container">
  <div class="controls">
    <div class="select-wrapper">
      <label for="line-select">Select Line:</label>
      <select id="line-select" bind:value={selectedLine}>
        {#each uniqueLines as line}
          <option value={line}>{line}</option>
        {/each}
      </select>
    </div>

    <div class="select-wrapper">
      <label for="variable-select">Select Variable:</label>
      <select id="variable-select" bind:value={selectedVariable}>
        {#each variables as variable}
          <option value={variable.value}>{variable.label}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="chart" bind:this={chart}></div>
</div>

<style>
  .container {
    width: 100%;
    margin: 0 auto;
    padding: 20px;
  }

  .controls {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }

  .select-wrapper {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  select {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    min-width: 200px;
  }

  .chart {
    width: 100%;
    height: 400px;
    border: 1px solid #eee;
    border-radius: 4px;
  }
</style>