<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
	import regions from '../../lib/data/transit-regions.json';

  export let data = [];

  let selectedLine = null;
  let selectedVariable = 'TotalPopulation';
  let chart;

  // Map of line_id to color
  const line_colors = {
    7: '#00923f', 6: '#f8c300', 5: '#a21a68', 8: '#00b0ef', 113: '#f58831',
    206: '#005e9f', 209: '#00853d', 210: '#ee2e22', 211: '#8d0133', 213: '#dd6327',
    212: '#02abe7', 207: '#7d4b0d', 115: '#8a999a', 208: '#2486c7', 116: '#b6d87b',
    117: '#1cb4e3', 118: '#0c4c91', 1: '#008e4f', 2: '#ef8122', 3: '#ffe32a',
    4: '#0183c9', 200: '#f06278', 204: '#ffdc7e', 201: '#9897c7', 203: '#55b6b1',
    205: '#ca559a', 106: '#89bd40', 112: '#f9c322', 102: '#d51b32', 100: '#028ab1',
    101: '#02aa1d', 104: '#ff0f00', 103: '#111e89', 105: '#1b8744', 11: '#019bc8',
    10: '#005dab', 9: '#fed126', 214: '#77278d', 108: '#d30f1d', 110: '#8f7210',
    111: '#0980a5', 107: '#0070ff', 109: '#65a233', 114: '#a6dca8'
  };

  const variables = [
    { value: 'TotalPopulation',        label: 'Population' },
    { value: 'TotalHouseholds',        label: 'Households' },
    { value: 'AverageEmploymentIncome',label: 'Average Employment Income ($)' }
  ];

  // Set default selected line
  $: if (selectedLine === null && regions.length) {
    const firstRegion = regions[0];
    if (firstRegion?.lines?.length) {
      selectedLine = firstRegion.lines[0].id;
    }
  }

  $: filteredData = data
    ? data.filter(d => +d.line_id === +selectedLine).sort((a, b) => a.stop_sequence - b.stop_sequence)
    : [];

  function createPatterns(svg, lineColor) {
    const defs = svg.append('defs');

    defs.append('pattern')
      .attr('id', 'construction-pattern')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 8)
      .attr('height', 8)
      .append('path')
      .attr('d', 'M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4')
      .attr('stroke', lineColor)
      .attr('stroke-width', 1)
      .attr('opacity', 0.5);

    defs.append('pattern')
      .attr('id', 'planned-pattern')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 8)
      .attr('height', 8)
      .append('path')
      .attr('d', 'M0,0 l8,8 M-2,6 l4,4 M6,-2 l4,4')
      .attr('stroke', lineColor)
      .attr('stroke-width', 1)
      .attr('opacity', 0.5);
  }

  function getFillStyle(d) {
    const base = line_colors[d.line_id] || '#666';
    switch (d.status) {
      case 'Construction': return 'url(#construction-pattern)';
      case 'Planned':      return 'url(#planned-pattern)';
      default:             return base;
    }
  }

  function updateChart() {
    if (!filteredData.length) return;

    const margin = { top: 40, right: 40, bottom: 140, left: 80 };
    const width = chart.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    d3.select(chart).selectAll('*').remove();

    const svg = d3.select(chart)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const lineColor = line_colors[selectedLine] || '#666';
    createPatterns(svg, lineColor);

    const x = d3.scaleBand()
      .range([0, width])
      .domain(filteredData.map(d => d.stop_label))
      .padding(0.2);

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(filteredData, d => +d[selectedVariable])]);

    const bars = svg.selectAll('rect')
      .data(filteredData)
      .enter()
      .append('rect')
      .attr('x', d => x(d.stop_label))
      .attr('width', x.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('fill', d => getFillStyle(d))
      .attr('stroke', lineColor)
      .attr('stroke-width', 1);

    bars.transition()
      .duration(750)
      .attr('y', d => y(+d[selectedVariable]))
      .attr('height', d => height - y(+d[selectedVariable]));

    svg.append('g')
      .call(d3.axisLeft(y).tickFormat(d3.format(',')).ticks(10))
      .selectAll('text')
      .style('font-size', '10px');

    const meta = variables.find(v => v.value === selectedVariable);
    const yText = meta ? meta.label : selectedVariable;

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -60)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .text(yText);

    const xAxis = svg.append('g').attr('transform', `translate(0,${height})`);

    xAxis.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('stroke', lineColor)
      .attr('stroke-width', 4);

    xAxis.selectAll('.station-label')
      .data(filteredData)
      .enter()
      .append('text')
      .attr('x', d => x(d.stop_label) + x.bandwidth() / 2)
      .attr('y', 40)
      .attr('text-anchor', 'end')
      .attr('transform', d => `rotate(-45, ${x(d.stop_label) + x.bandwidth() / 2}, 40)`)
      .text(d => d.stop_label)
      .style('font-size', '12px');

    svg.append('g')
      .selectAll('circle')
      .data(filteredData)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.stop_label) + x.bandwidth() / 2)
      .attr('cy', height)
      .attr('r', 4)
      .attr('fill', 'white')
      .attr('stroke', lineColor)
      .attr('stroke-width', 2);
  }

  $: if (chart && selectedLine !== null && selectedVariable) updateChart();

  onMount(() => {
    window.addEventListener('resize', updateChart);
    return () => window.removeEventListener('resize', updateChart);
  });
</script>

<div class="container">
  <div class="controls">
    <div class="select-wrapper">
      <label for="line-select">Select Line:</label>
      <select id="line-select" bind:value={selectedLine} on:change={() => selectedLine = +selectedLine}>
        {#each regions as region}
          <optgroup label={region.name}>
            {#each region.lines as line}
              <option value={line.id}>{line.name}</option>
            {/each}
          </optgroup>
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
    border: 1px solid #eee;
    border-radius: 4px;
  }
</style>
