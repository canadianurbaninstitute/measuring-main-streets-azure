<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import regions from '../../lib/data/transit-regions.json';
	import Select from 'svelte-select'; // Original import

	export let data = [];

	let selectedLine = null;
	let selectedVariable = 'TotalPopulation';
	let chart; // bind:this to the main chart div
	let tooltip;

	const stickyXAxisHeight = 35; // Height for the area of the sticky X-axis ticks/numbers

	const line_colors = {
		7: '#00923f',
		6: '#f8c300',
		5: '#a21a68',
		8: '#00b0ef',
		113: '#f58831',
		206: '#005e9f',
		209: '#00853d',
		210: '#ee2e22',
		211: '#8d0133',
		213: '#dd6327',
		212: '#02abe7',
		207: '#7d4b0d',
		115: '#8a999a',
		208: '#2486c7',
		116: '#b6d87b',
		117: '#1cb4e3',
		118: '#0c4c91',
		1: '#008e4f',
		2: '#ef8122',
		3: '#ffe32a',
		4: '#0183c9',
		200: '#f06278',
		204: '#ffdc7e',
		201: '#9897c7',
		203: '#55b6b1',
		205: '#ca559a',
		106: '#89bd40',
		112: '#f9c322',
		102: '#d51b32',
		100: '#028ab1',
		101: '#02aa1d',
		104: '#ff0f00',
		103: '#111e89',
		105: '#1b8744',
		11: '#019bc8',
		10: '#005dab',
		9: '#fed126',
		214: '#77278d',
		108: '#d30f1d',
		110: '#8f7210',
		111: '#0980a5',
		107: '#0070ff',
		109: '#65a233',
		114: '#a6dca8'
	};

	const variables = [
		{ value: 'TotalPopulation', label: 'Population' },
		{ value: 'TotalHouseholds', label: 'Households' },
		{ value: 'GreenspaceArea', label: 'Greenspace (sq. m)' },
		{ value: 'AverageEmploymentIncome', label: 'Average Employment Income ($) (2021)' },
		{ value: 'HouseValue', label: 'Average House Value ($) (2021)' },
		{ value: 'MonthlyRent', label: 'Average Monthly Rent ($) (2021)' }
	];

	$: if (selectedLine === null && regions.length) {
		const firstRegion = regions[0];
		if (firstRegion?.lines?.length) selectedLine = firstRegion.lines[0].id;
	}

	$: filteredData =
		data && data.length
			? data
					.filter((d) => +d.line_id === +selectedLine)
					.sort((a, b) => a.stop_sequence - b.stop_sequence)
			: [];

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
	function getFillStyle(d) {
		const base = line_colors[d.line_id] || '#666';
		switch (d.status) {
			case 'Construction':
				return 'url(#construction-pattern)';
			case 'Planned':
				return 'transparent';
			default:
				return base;
		}
	}
	function estimateMargin(longestLabelLen) {
		const charWidth = 7;
		const labelWidth = longestLabelLen * charWidth;
		return 100 + labelWidth;
	}

	function updateChart() {
		if (!chart) return;

		// Apply padding to main chart div to make space for sticky X-axis ticks SVG
		chart.style.paddingBottom = `${stickyXAxisHeight}px`;

		if (!filteredData.length) {
			d3.select(chart).selectAll('svg').remove(); // Clear all SVGs if no data
			return;
		}

		const longestLabelLen = d3.max(filteredData, (d) => d.stop_label.length) || 10;
		const margin = {
			top: 50,
			right: 50,
			bottom: 60, 
			left: estimateMargin(longestLabelLen)
		};
		const chartHostDivWidth = chart.clientWidth || 600;
		const plotAreaWidth = chartHostDivWidth - margin.left - margin.right;
		const barH = 25;
		const plotAreaHeight = barH * filteredData.length;

		// --- Tooltip ---
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

		// --- Main Chart SVG (for plot area, Y-axis, grid, X-AXIS TITLE) ---
		d3.select(chart).select('svg.main-chart-svg').remove();
		const rootSvg = d3
			.select(chart)
			.append('svg')
			.attr('class', 'main-chart-svg')
			.attr('width', plotAreaWidth + margin.left + margin.right)
			.attr('height', plotAreaHeight + margin.top);

		const plotAreaG = rootSvg
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const lineColor = line_colors[selectedLine] || '#666';
		createPatterns(plotAreaG, lineColor);

		const y = d3
			.scaleBand()
			.range([0, plotAreaHeight])
			.domain(filteredData.map((d) => d.stop_label))
			.padding(0.25);
		const maxVal = d3.max(filteredData, (d) => +d[selectedVariable]) || 0;
		const x = d3.scaleLinear().range([0, plotAreaWidth]).domain([0, maxVal]).nice();

	
		plotAreaG
			.append('g')
			.attr('class', 'grid')
			.call(d3.axisTop(x).tickSize(-plotAreaHeight).tickFormat(''))
			.call((g) => {
				g.select('.domain').remove();
				g.selectAll('line').attr('stroke', '#ddd').attr('stroke-dasharray', '2,2');
			});

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
			.on('mouseover', function (event, d) {
	    d3.select(this)
					.style('filter', 'brightness(0.9)')
					.style('cursor', 'pointer');
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
			});

		bars
			.transition()
			.duration(750)
			.attr('width', (d) => x(+d[selectedVariable]));

		plotAreaG
			.append('g')
			.call(d3.axisLeft(y))
			.call((g) => {
				g.selectAll('.tick line').remove();
				g.select('.domain').remove();
			})
			.selectAll('text')
			.attr('x', -40)
			.style('font-family', 'Inter, sans-serif')
			.style('font-size', '12px')
			.style('font-weight', '600')
			.style('text-transform', 'uppercase');

		plotAreaG
			.append('line')
			.attr('x1', -20)
			.attr('x2', -20)
			.attr('y1', y.paddingInner() * y.step())
			.attr('y2', plotAreaHeight - y.paddingInner() * y.step())
			.attr('stroke', lineColor)
			.attr('stroke-width', 4);

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

		// X-Axis TITLE (stays with main chart, scrolls normally)
		const metaVariable = variables.find((v) => v.value === selectedVariable);

		// plotAreaG
		// 	.append('text')
		// 	.attr('class', 'x-axis-title')
		// 	.attr('x', plotAreaWidth / 2)
		// 	.attr('y', plotAreaHeight + 45) // Positioned below bars, within rootSvg's bottom margin
		// 	.attr('text-anchor', 'middle')
		// 	.style('font-family', 'Inter, sans-serif')
		// 	.style('font-size', '14px')
		// 	.style('font-weight', '600')
		// 	.style('text-transform', 'uppercase')
		// 	.text(metaVariable ? metaVariable.label : selectedVariable);

		// --- STICKY X-AXIS TICKS/NUMBERS/LINE (Separate SVG) ---

		d3.select(chart).select('svg.x-axis-ticks-svg').remove();

		const xAxisTicksSvg = d3
			.select(chart)
			.append('svg')
			.attr('class', 'x-axis-ticks-svg') // For CSS styling (sticky)
			.attr('width', chartHostDivWidth) // Takes full width of .chart div
			.attr('height', stickyXAxisHeight); // Fixed height for this SVG

		const xAxisG = xAxisTicksSvg
			.append('g')
			.attr('transform', `translate(${margin.left}, ${stickyXAxisHeight - 25})`); // Vertically center/position axis line

		xAxisG.call(d3.axisBottom(x).tickFormat(d3.format(','))).call((g) => {
			g.selectAll('.tick line').attr('stroke', '#444');
      g.selectAll('.tick line').attr('stroke-width', '2px');
			g.selectAll('.tick text').attr('fill', '#444');
			g.select('.domain').attr('stroke', '#444');
      g.select('.domain').attr('stroke-width', '2px');

			g.selectAll('text')
				.style('font-family', 'Inter, sans-serif')
				.style('font-size', '12px')
				.style('font-weight', '600')
        .style('text-shadow', '0 0 5px white, 0 0 5px white');

		});
	}

	$: if (chart && selectedLine !== null && selectedVariable && data) {
		updateChart();
	}

	onMount(() => {
		if (data && data.length > 0 && regions && regions.length > 0) {
			updateChart();
		}
		window.addEventListener('resize', updateChart);
		return () => {
			window.removeEventListener('resize', updateChart);
			if (tooltip) tooltip.remove();
		};
	});
</script>

<div class="container">
	<div class="controls">
		<div class="select-wrapper">
			<label for="line-select">Select Line:</label>
			<select
				id="line-select"
				bind:value={selectedLine}
				on:change={() => (selectedLine = +selectedLine)}
			>
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

	<div class="chart" bind:this={chart} />
</div>

<style>
	.container {
		width: 100%;
		margin: 0 auto;
		font-family: 'Inter', sans-serif;
	}

	.controls {
		display: flex;
		gap: 1em;
		margin-bottom: 1.5em;
		flex-wrap: wrap;
		align-items: flex-end;
	}
	.select-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}
	.select-wrapper label {
		font-size: 0.9em;
		font-weight: 500;
		color: #333;
	}
	select {
		padding: 0.75em 1em;
		border-radius: 6px;
		border: 1px solid #ccc;
		min-width: 280px;
		background-color: white;
		font-size: 1em;
	}

	.chart {
		width: 100%;
		position: relative; /* Important for sticky positioning context of child SVG */
		border: 1px solid #eee; /* Original border */
		border-radius: 8px; /* Original radius */
	}

	/* Styles for the SVG that contains the sticky X-axis ticks/numbers/line */
	:global(svg.x-axis-ticks-svg) {
		position: -webkit-sticky; /* Safari */
		position: sticky;
		bottom: 0; /* Stick to the bottom of the .chart container */
		left: 0; /* Align to the left of .chart container */
		width: 100%; /* Span full width of .chart container */
		z-index: 990; /* Ensure it's above main chart SVG content if they overlap slightly during scroll */
  }

</style>
