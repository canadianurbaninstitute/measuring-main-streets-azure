<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  export let data;

  let selectedLine = '';
  let selectedVariable = 'population';
  let uniqueLines = [];
  let chart;

  const line_colors = {
    "Blue Line (202)": "#028ab1",
    "Green Line": "#02aa1d",
    "Red Line (201)": "#d51b32",
    "Capital Line": "#111e89",
    "Metro Line": "#ff0f00",
    "Valley Line": "#1b8744",
    "Barrie": "#005e9f",
    "Eglinton Crosstown LRT": "#f58831",
    "Eglinton East LRT": "#A7DBA8",
    "Finch West LRT": "#8a999a",
    "Hamilton B-Line LRT": "#1cb4e3",
    "Hazel McCallion Line": "#b6d87b",
    "ION LRT": "#0c4c91",
    "Kitchener": "#00853d",
    "Lakeshore East": "#ee2e22",
    "Lakeshore West": "#8d0133",
    "Line 1: Yonge-University Subway": "#f8c300",
    "Line 2: Bloor-Danforth Subway": "#00923f",
    "Line 4: Sheppard Subway": "#a21a68",
    "Milton": "#dd6327",
    "Ontario Line": "#00b0ef",
    "Richmond Hill": "#02abe7",
    "Stouffville": "#7d4b0d",
    "UP Express": "#2486c7",
    "Canada Line": "#019bc8",
    "Expo Line": "#005dab",
    "Millennium Line": "#fed126",
    "West Coast Express": "#77278d",
    "Candiac": "#55b6b1",
    "Ligne 1 - Verte": "#008e4f",
    "Ligne 2 - Orange": "#ef8122",
    "Ligne 4 - Jaune": "#ffe32a",
    "Ligne 5 - Bleue": "#0183c9",
    "Mascouche": "#ca559a",
    "Mont-Saint-Hilaire": "#9897c7",
    "REM": "#89bd40",
    "Saint-Jérôme": "#ffdc7e",
    "Vaudreuil-Hudson": "#f06278",
    "Line 1": "#d30f1d",
    "Line 2": "#65a233",
    "Line 3": "#8f7210",
    "Line 4": "#0980a5",
    "TramGO": "#0070ff",
    "Tramway de Québec": "#f9c322",
  };

  const variables = [
    { value: 'population', label: 'Population' },
    { value: 'households', label: 'Households' },
    { value: 'dwellings', label: 'Dwellings' },
    { value: 'average_employment_income', label: 'Average Employment Income ($)'}
  ];

  // Create SVG patterns for different statuses
  function createPatterns(svg, lineColor) {
  const defs = svg.append('defs');

  // Pattern for 'Construction' status
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

  // Pattern for 'Planned' status
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

  $: {
    if (data) {
      uniqueLines = [...new Set(data.map(d => d.line_label))].sort();
      if (!selectedLine && uniqueLines.length > 0) {
        selectedLine = uniqueLines[0];
      }
    }
  }

  $: filteredData = data?.filter(d => d.line_label === selectedLine) || [];

  function getFillStyle(d) {
  const baseColor = line_colors[d.line_label] || '#666';
  switch(d.status) {
    case 'Construction':
      return `url(#construction-pattern)`;
    case 'Planned':
      return `url(#planned-pattern)`;
    default:
      return baseColor;
  }
}

  function updateChart() {
  if (!filteredData.length) return;

  // Increase bottom margin to accommodate longer labels
  const margin = { top: 40, right: 40, bottom: 140, left: 80 };
  const width = chart.clientWidth - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // Clear previous chart
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
      .domain([0, d3.max(filteredData, d => d[selectedVariable])]);

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

  // Add the transition
  bars.transition()
    .duration(750)
    .attr('y', d => y(d[selectedVariable]))
    .attr('height', d => height - y(d[selectedVariable]));

     // Add Y axis with larger font
     svg.append('g')
      .call(d3.axisLeft(y)
        .tickFormat(d3.format(','))
        .ticks(10))
      .selectAll('text')
      .style('font-size', '10px');

      // Add Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -60)
      .attr('x', -height/2)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .text(selectedVariable.charAt(0).toUpperCase() + selectedVariable.slice(1));

  // Add transit line (move before bars)
  const xAxis = svg.append('g')
    .attr('transform', `translate(0,${height})`);
  
  xAxis.append('line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('stroke', lineColor)
    .attr('stroke-width', 4);

  // Add station labels with more space
  xAxis.selectAll('.station-label')
    .data(filteredData)
    .enter()
    .append('text')
    .attr('x', d => x(d.stop_label) + x.bandwidth()/2)
    .attr('y', 40)  // Increased from 30
    .attr('text-anchor', 'end')
    .attr('transform', d => `rotate(-45, ${x(d.stop_label) + x.bandwidth()/2}, 40)`)
    .text(d => d.stop_label)
    .style('font-size', '12px');

  // Add station markers (move to front)
  svg.append('g')
    .selectAll('.station-marker')
    .data(filteredData)
    .enter()
    .append('circle')
    .attr('cx', d => x(d.stop_label) + x.bandwidth()/2)
    .attr('cy', height)
    .attr('r', 4)
    .attr('fill', 'white')
    .attr('stroke', lineColor)
    .attr('stroke-width', 2);
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
    border: 1px solid #eee;
    border-radius: 4px;
  }
</style>