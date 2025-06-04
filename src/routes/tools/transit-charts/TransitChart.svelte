<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import regions from '../../lib/data/transit-regions.json';
  import Select from 'svelte-select';

  // ————————————————————————————————————————————
  // PROPS & STATE
  // ————————————————————————————————————————————
  export let data = [];

  let selectedLine = null;
  let selectedVariable = 'TotalPopulation';
  let chart;
  let tooltip;

  // Map of line_id to colour
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
    { value: 'TotalPopulation',         label: 'Population' },
    { value: 'TotalHouseholds',         label: 'Households' },
    { value: 'AverageEmploymentIncome', label: 'Average Employment Income ($)' },
    { value: 'GreenspaceArea',         label: 'Greenspace (sq. m)' },
    { value: 'HouseValue',         label: 'Average House Value ($)' },
    { value: 'MonthlyRent',         label: 'Average Monthly Rent ($)' }

  ];

  // Default selected line (first line of first region)
  $: if (selectedLine === null && regions.length) {
    const firstRegion = regions[0];
    if (firstRegion?.lines?.length) selectedLine = firstRegion.lines[0].id;
  }

  // Filter + sort — recomputed whenever inputs change
  $: filteredData = data && data.length
    ? data.filter(d => +d.line_id === +selectedLine).sort((a, b) => a.stop_sequence - b.stop_sequence)
    : [];

  // ————————————————————————————————————————————
  // HELPER FUNCTIONS
  // ————————————————————————————————————————————
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
      .attr('stroke-width', 2)
      .attr('opacity', 1);
  }

  function getFillStyle(d) {
    const base = line_colors[d.line_id] || '#666';
    switch (d.status) {
      case 'Construction': return 'url(#construction-pattern)';
      case 'Planned':      return 'transparent';
      default:             return base;
    }
  }

  // — Rough left-margin required so labels never clip —
    function estimateMargin(longestLabelLen) {
    const charWidth = 7;                 // average pixel width of one char
    const labelWidth = longestLabelLen * charWidth;
    return 100 + labelWidth;            // 60px is base spacing for circles/line
  }

  // ————————————————————————————————————————————
  // MAIN RENDER ROUTINE
  // ————————————————————————————————————————————
  function updateChart() {
    if (!filteredData.length) return;

    

    const longestLabelLen = d3.max(filteredData, d => d.stop_label.length);

    // Geometry
    const margin = { top: 50, right: 50, bottom: 100, left: estimateMargin(longestLabelLen) };  // wide left for labels
    const width  = chart.clientWidth  - margin.left - margin.right;
    const barH   = 25;                                             // height per bar
    const height = barH * filteredData.length;

    // Remove only the SVG, not the tooltip
    d3.select(chart).select('svg').remove();

    // Tooltip (create once)
    if (!tooltip) {
      tooltip = d3.select(chart)
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('background-color', 'white')
        .style('border', '1px solid #ddd')
        .style('border-radius', '4px')
        .style('padding', '8px')
        .style('pointer-events', 'none')
        .style('font-family', 'Inter, sans-serif')
        .style('font-size', '12px')
        .style('transition', 'left 0.1s ease-out, top 0.1s ease-out');
    }

    const svg = d3.select(chart)
      .append('svg')
      .attr('width',  width  + margin.left + margin.right)
      .attr('height', height + margin.top  + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const lineColor = line_colors[selectedLine] || '#666';
    createPatterns(svg, lineColor);

    // Scales
    const y = d3.scaleBand()
      .range([0, height])
      .domain(filteredData.map(d => d.stop_label))
      .padding(0.25);

    
    const maxVal = d3.max(filteredData, d => +d[selectedVariable]);
    const x = d3.scaleLinear()
      .range([0, width])
      x.domain([0, maxVal])
      .nice(); // this rounds to a smart, readable upper bound

// Grid (vertical, excluding edges and domain line)
svg.append('g')
  .attr('class', 'grid')
  .call(d3.axisTop(x).tickSize(-height).tickFormat(''))
  .call(g => {
    g.select('.domain').remove(); // remove the top axis line
    g.selectAll('line')
      .attr('stroke', '#ddd')
      .attr('stroke-dasharray', '2,2')
  });

    // Bars
    const bars = svg.selectAll('rect')
      .data(filteredData)
      .enter()
      .append('rect')
      .attr('y', d => y(d.stop_label))
      .attr('height', y.bandwidth())
      .attr('x', 0)
      .attr('width', 0)
      .attr('fill', getFillStyle)
      .attr('stroke', lineColor)
      .attr('stroke-width', 2)
      .on('mouseover', function(event, d) {
        d3.select(this).style('filter', 'brightness(0.9)');
        const meta = variables.find(v => v.value === selectedVariable);
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip.html(`
          <div style="font-weight:600;margin-bottom:4px;">${d.stop_label}</div>
          <div style="font-weight:400;margin-bottom:4px;">${d.status} Station</div>
          <div>${meta.label}: ${d3.format(',')(d[selectedVariable])}</div>
        `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top',  (event.pageY - 28) + 'px');
      })
      .on('mousemove', function(event) {
        tooltip.style('left', (event.pageX + 10) + 'px')
               .style('top',  (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).style('filter', 'none');
        tooltip.transition().duration(500).style('opacity', 0);
      });

    bars.transition()
      .duration(750)
      .attr('width', d => x(+d[selectedVariable]));

    // Y-axis (stop labels)
    svg.append('g')
      .call(d3.axisLeft(y))
      .call(g => {
          g.selectAll('.tick line').remove();
          g.select('.domain').remove();
        }) 
      .selectAll('text')
      .attr('x', -40)
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('text-transform', 'uppercase');

    // X-axis (numeric values)
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format(',')))
      .call(g => {
          g.selectAll('.tick line').attr('stroke', '#222');
          g.select('.domain').attr('stroke', '#222'); // set domain line color
        }) 
      .selectAll('text')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '12px')
      .style('color', '#222')
      .style('font-weight', '500');

    // X-axis label
    const meta = variables.find(v => v.value === selectedVariable);
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 50)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('text-transform', 'uppercase')
      .text(meta ? meta.label : selectedVariable);

    // ——————————————————————————————————
    // Coloured baseline + station dots
    // ——————————————————————————————————
    // Vertical baseline at x = 0
    svg.append('line')
      .attr('x1', -20)
      .attr('x2', -20)
      .attr('y1', 20)
      .attr('y2', height-20)
      .attr('stroke', lineColor)
      .attr('stroke-width', 4);

    // Station dots on the baseline
    svg.append('g')
      .selectAll('circle')
      .data(filteredData)
      .enter()
      .append('circle')
      .attr('cx', -20)
      .attr('cy', d => y(d.stop_label) + y.bandwidth() / 2)
      .attr('r', 6)
      .attr('fill', 'white')
      .attr('stroke', lineColor)
      .attr('stroke-width', 4);
  }

  // Re-render whenever data or viewport changes
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
  }

  .controls {
    display: flex;
    gap: 1em;
    margin-bottom: 1em;
    flex-wrap: wrap;
  }

  .select-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }

  select {
    padding: 1em;
    border-radius: 1em;
    border: 1px solid #ccc;
    min-width: 300px;
  }

  .chart {
    width: 100%;
    border: 1px solid #eee;
    border-radius: 1em;
    overflow: visible; /* ensure dots are visible */
  }
</style>
