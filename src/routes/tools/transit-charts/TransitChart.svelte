<script lang="ts">
	import * as d3 from 'd3';
	import { onMount } from 'svelte';
	import lineColors from '../../lib/data/transitdata/line-colors.json';
	// import transitLines from '../../lib/data/transitdata/transit-lines-dropdown.json';
	// labels for the select dropdown
	// labels for the select dropdown

	let {
		data = [],
		selectedLine = $bindable(),
		variables,
		selectedVariable,
		selectedStation = $bindable()
	} = $props();

	let chart; // Reference to the main chart container div
	let tooltip; // D3 tooltip element for hover interactions
  let transitLines = $state();
	// Height reserved for the sticky X-axis that remains visible during scroll
	const stickyXAxisHeight = 50;

	// Color mapping for different transit lines - each line has a unique color base on id
	const line_colors = lineColors;

  onMount(async () => {
    try {
      const response = await fetch('https://measuringmainstreets.blob.core.windows.net/public/transit-data/dropdowns/transit-lines-dropdown.json');
      transitLines = await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });

	// Handle selection from the new Select component
	// function handleLineSelect(value) {
	// 	selectedLine = +value; // Convert to number to match existing behavior
	// }

	// Handle variable selection
	function handleVariableSelect(value) {
		selectedVariable = value;
	}

	// Filter and sort data for the selected transit line
	// Data is sorted by stop sequence to maintain proper station order
	let filteredData = $derived(
		data && data.length
			? data
					.filter((d) => +d.line_id === +selectedLine)
					.sort((a, b) => a.stop_sequence - b.stop_sequence)
			: []
	);

	/**
	 * Creates SVG pattern for construction status stations
	 * @param {Object} svgCtx - SVG context to append pattern to
	 * @param {string} lineColor - Color to use for the pattern
	 */
	function createPatterns(svgCtx, lineColor) {
		const defs = svgCtx.append('defs');
		defs
			.append('pattern')
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

	/**
	 * Determines fill style based on station status
	 * @param {Object} d - Station data object
	 * @returns {string} Fill style (color, pattern, or transparent)
	 */
	function getFillStyle(d) {
		const base = line_colors[d.line_id] || '#666';
		switch (d.status) {
			case 'Construction':
				return 'url(#construction-pattern)'; // Diagonal pattern for construction
			case 'Planned':
				return 'transparent'; // Transparent for planned stations
			default:
				return base; // Solid color for operational stations
		}
	}

	/**
	 * Calculates left margin based on longest station name
	 * Ensures station labels have enough space to display
	 * @param {number} longestLabelLen - Length of longest station name
	 * @returns {number} Calculated margin width
	 */
	function estimateMargin(longestLabelLen, chartHostDivWidth = 600) {
		const charWidth = chartHostDivWidth < 500 ? 5 : 7;
		const labelWidth = longestLabelLen * charWidth;
		return 70 + labelWidth;
	}

	/**
	 * Main chart rendering function - creates horizontal bar chart
	 * Uses D3 to create interactive visualization with sticky X-axis
	 */
	function updateChart() {
		if (!chart) return;

		// Add padding to accommodate sticky X-axis
		chart.style.paddingBottom = `${0}px`;

		// Clear chart if no data available
		if (!filteredData.length) {
			d3.select(chart).selectAll('svg').remove();
			return;
		}

		// Calculate chart dimensions and margins
		const longestLabelLen = d3.max(filteredData, (d) => d.stop_label.length) || 10;

    const chartHostDivWidth = chart.getBoundingClientRect().width;
		const margin = {
			top: 50,
			right: chartHostDivWidth < 500 ? 20 : 50,
			bottom: 40,
			left: estimateMargin(longestLabelLen, chartHostDivWidth)
		};
		const plotAreaWidth = chartHostDivWidth - margin.left - margin.right;
		const barH = 25; // Height of each bar
		const plotAreaHeight = barH * filteredData.length;

		// Create tooltip for hover interactions
		if (!tooltip) {
			tooltip = d3
				.select('body')
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
				.style('box-shadow', '0 2px 8px rgba(0,0,0,0.15)')
				.style('transition', 'left 0.1s ease-out, top 0.1s ease-out');
		}

		// Create main chart SVG for plot area, Y-axis, and grid
		d3.select(chart).select('svg.main-chart-svg').remove();
		const rootSvg = d3 
			.select(chart)
			.append('svg')
			.attr('class', 'main-chart-svg')
			.attr('width', chartHostDivWidth)
			.attr('height', plotAreaHeight + margin.top + margin.bottom);

		const plotAreaG = rootSvg
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		// Create patterns for construction status and set up scales
		const lineColor = line_colors[selectedLine] || '#666';
		createPatterns(plotAreaG, lineColor);

		// Y-scale for station names (categorical)
		const y = d3
			.scaleBand()
			.range([0, plotAreaHeight])
			.domain(filteredData.map((d) => d.stop_label))
			.padding(0.25);

		// X-scale for metric values (continuous)
		const maxVal = d3.max(filteredData, (d) => +d[selectedVariable]) || 0;
		const x = d3.scaleLinear().range([0, plotAreaWidth]).domain([0, maxVal]).nice();

		// Add grid lines for better readability
		plotAreaG
			.append('g')
			.attr('class', 'grid')
			.call((g) => d3.axisTop(x).tickSize(-plotAreaHeight)(g))
			.call((g) => {
				g.select('.domain').remove();
				g.selectAll('line').attr('stroke', '#ddd').attr('stroke-dasharray', '2,2');
			});

		//remove automatically generated tick labels
		plotAreaG.selectAll('.tick text').remove();

		// Create horizontal bars for each station
		const bars = plotAreaG
			.selectAll('rect.bar-element')
			.data(filteredData)
			.enter()
			.append('rect')
			.attr('class', 'bar-element')
			.attr('y', (d) => y(d.stop_label))
			.attr('height', y.bandwidth())
			.attr('x', 0)
			.attr('width', 0)
			.attr('fill', getFillStyle)
			.attr('stroke', lineColor)
			.attr('stroke-width', 2)

			// Mouse interaction handlers
			.on('mouseover', function (event, d) {
				d3.select(this).style('filter', 'brightness(0.9)').style('cursor', 'pointer');
				const currentVarMeta = variables.find((v) => v.value === selectedVariable);

				tooltip.transition().duration(200).style('opacity', 0.9);
				tooltip
					.html(
						`<div style="font-weight:600;margin-bottom:4px;">${d.stop_label}</div>` +
							`<div style="font-weight:400;margin-bottom:4px;">${d.status || 'N/A'} Station</div>` +
							`<div>${currentVarMeta.label}: ${d3.format(',')(d[selectedVariable])}</div>`
					)
					.style('left', event.pageX + 10 + 'px')
					.style('top', event.pageY - 28 + 'px');
			})

			.on('mousemove', function (event) {
				tooltip.style('left', event.pageX + 10 + 'px').style('top', event.pageY - 28 + 'px');
			})

			.on('mouseout', function () {
				d3.select(this).style('filter', 'none');
				tooltip.transition().duration(500).style('opacity', 0);
			})
      .on('click', function (e, d) {
        selectedStation = +d.id;
			});

		// Animate bars to their final width
		bars
			.transition()
			.duration(750)
			.attr('width', (d) => x(+d[selectedVariable]));

		// Add Y-axis with station names
		plotAreaG
			.append('g')
			.call(d3.axisLeft(y))
			.call((g) => {
				g.selectAll('.tick line').remove();
				g.select('.domain').remove();
			})
			.selectAll('text')
			.attr('dx', -25)
      .attr('dy', -15)
	    .attr('transform', 'rotate(-30)')
			.style('font-family', 'Inter, sans-serif')
			.style('font-size', chartHostDivWidth < 500 ? '10px' : '12px')
			.style('font-weight', '600')
			.style('text-transform', 'uppercase');

		// Add vertical line connecting station indicators
		plotAreaG
			.append('line')
			.attr('x1', -20)
			.attr('x2', -20)
			.attr('y1', y.paddingInner() * y.step())
			.attr('y2', plotAreaHeight - y.paddingInner() * y.step())
			.attr('stroke', lineColor)
			.attr('stroke-width', 4);

		// Add station indicator circles on the left
		plotAreaG
			.append('g')
			.selectAll('circle')
			.data(filteredData)
			.enter()
			.append('circle')
			.attr('cx', -20)
			.attr('cy', (d) => y(d.stop_label) + y.bandwidth() / 2)
			.attr('r', 6)
			.attr('fill', 'white')
			.attr('stroke', lineColor)
			.attr('stroke-width', 4);

		// Create sticky X-axis that remains visible during scroll
		d3.select(chart).select('svg.x-axis-ticks-svg').remove();

		const xAxisTicksSvg = d3
			.select(chart)
			.append('svg')
			.attr('class', 'x-axis-ticks-svg') // CSS class for sticky positioning
			.attr('width', chartHostDivWidth)
			.attr('height', stickyXAxisHeight)
      .attr('transform', `translate(${0}, ${-30})`);;

		const xAxisG = xAxisTicksSvg
			.append('g')
			.attr('transform', `translate(${margin.left}, ${0})`);

		// Style the X-axis with formatted numbers
		xAxisG.call(d3.axisBottom(x).tickFormat(d3.format(','))).call((g) => {
			g.selectAll('.tick line').attr('stroke', '#444');
			g.selectAll('.tick line').attr('stroke-width', '2px');
			g.selectAll('.tick text').attr('fill', '#444');
			g.select('.domain').attr('stroke', '#444');
			g.select('.domain').attr('stroke-width', '2px');

			g.selectAll('text')
        .attr('transform', 'rotate(-45)')
        .attr('dx', '-0.5em') // move left
        .attr('dy', '0.5em')  // move down
        .style('text-anchor', 'end') 
				.style('font-family', 'Inter, sans-serif')
				.style('font-size', '12px')
				.style('font-weight', '600')
				.style('text-shadow', '0 0 5px white, 0 0 5px white'); // White glow for readability
		});
	}

	// Reactive statement - update chart when selections or data change
	$effect(() => {
		if (chart && selectedLine !== 0 && selectedVariable && data) {
			updateChart();
		}
	});

	$effect(() => {
		if (!chart) return;

		const isSelected = (d: any) => !selectedStation || +d.id === selectedStation;

		d3.select(chart)
			.selectAll('rect.bar-element')
			.style('opacity', (d: any) => (isSelected(d) ? 1 : 0.3));

		d3.select(chart)
			.selectAll('circle')
			.style('opacity', (d: any) => (isSelected(d) ? 1 : 0.3));

		d3.select(chart)
			.selectAll('line')
			.style('opacity', !selectedStation ? 1 : 0.1);
	});

	// Component lifecycle management
	onMount(() => {
		// Initial chart render if data is available
		if (data && data.length > 0 && transitLines) {
			updateChart();
		}
		// Handle window resize for responsive behavior
		window.addEventListener('resize', updateChart);
		return () => {
			window.removeEventListener('resize', updateChart);
			if (tooltip) tooltip.remove(); // Clean up tooltip on unmount
		};
	});
</script>

<!-- Main component template -->
<div class="container">
	<!-- Chart container where D3 visualization is rendered -->
	<div class="chart" bind:this={chart}></div>
</div>

<style>
	/* Main container styling */
	.container {
    min-width: 100%;
		box-sizing: border-box;
		margin: 0;
		font-family: 'Inter', sans-serif;
	}
	/* Chart container with relative positioning for sticky elements */
	.chart {
    background: transparent;
    min-width: 100%;
		position: relative; /* Required for sticky positioning context */
		border: 1px solid #eee;
		border-radius: 8px;
	}


	/* Sticky X-axis styling - remains visible during scroll */
	:global(svg.x-axis-ticks-svg) {
		position: -webkit-sticky; /* Safari support */
		position: sticky;
		bottom: 0; /* Stick to bottom of chart container */
		left: 0; /* Align to left edge */
		width: 100%; /* Full width */
		z-index: 990; /* Ensure visibility above other chart elements */
	}
</style>
