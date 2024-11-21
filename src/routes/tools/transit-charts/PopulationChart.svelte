<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
  
    export let lineLabel = '';
    export let stations = []; // Pass the data for a single line
  
    const colorScale = d3.scaleOrdinal()
      .domain(['Existing', 'Construction', 'Planned'])
      .range(['#4caf50', '#ff9800', '#9e9e9e']);
  
    let chart;
    const margin = { top: 40, right: 20, bottom: 60, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
  
    onMount(() => {
      const svg = d3.select(chart)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
  
      // Scales
      const x = d3.scaleBand()
        .domain(stations.map(d => d.stop_label))
        .range([0, width])
        .padding(0.1);
  
      const y = d3.scaleLinear()
        .domain([0, d3.max(stations, d => d.population)])
        .nice()
        .range([height, 0]);
  
      // Axes
      svg.append('g')
        .call(d3.axisBottom(x))
        .attr('transform', `translate(0,${height})`)
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');
  
      svg.append('g')
        .call(d3.axisLeft(y));
  
      // Bars
      svg.selectAll('rect')
        .data(stations)
        .enter()
        .append('rect')
        .attr('x', d => x(d.stop_label))
        .attr('y', d => y(d.population))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.population))
        .attr('fill', d => colorScale(d.status));
    });
  </script>
  
  <svg bind:this={chart}></svg>
  