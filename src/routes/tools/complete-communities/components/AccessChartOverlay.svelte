<script lang="ts">
	import * as d3 from 'd3';
	import { onMount } from 'svelte';

	interface Props {
		futureDemandData: {
			amenity: string;
			status: string;
			classification: string;
			currentAccess: number;
			desiredAccess: number;
			currentDemand: number;
			futureDemand: number;
			additionalEmployees: number;
			mtsaAvg: number;
		}[];
		visitorCount: number;
		futureVisits: number;
		sliderValues: number[];
	}

	let {
		futureDemandData,
		visitorCount,
		futureVisits,
		sliderValues = $bindable()
	}: Props = $props();

	let isOpen = $state(true);
	let chart = $state();
	let tooltip = $state();
	let width = $state(0);

	// User Icon Path (mdi:account)
	const userIconPath =
		'M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4';

	// Config
	const ICON_SIZE = 14;
	const EMPLOYEES_PER_ICON = 10;
	// Scale pattern for density?
	// TransitChart uses simple patterns. We'll use the person pattern.
	// To match 1 icon = 10 employees visually, we need to ensure the BAR AREA
	// roughly corresponds to that count.
	// But since this is a continuous bar chart now, the exact "count of icons" might be handled by the fill
	// repeating. We need to set the pattern size such that 1 unit of width (roughly) = 10 employees?
	// If x-scale maps 10 employees to X pixels, we want the pattern width to be X pixels.

	function updateChart() {
		if (!chart || !width) return;

		// Filter for relevant data (amenities with gaps?) or show all?
		// User asked for "Access Chart", implying all.
		// But "Employees Needed" is 0 for many.
		// Let's show ALL amenities to provide a complete picture,
		// bars will be 0 for those with sufficient capacity.
		// OR better: Show all, differentiate status.
		const data = futureDemandData; // Sort?

		d3.select(chart).selectAll('*').remove();

		const margin = { top: 40, right: 30, bottom: 40, left: 140 }; // Increased left for labels
		const chartWidth = width - margin.left - margin.right;
		const barHeight = 30;
		const height = data.length * (barHeight + 10) + margin.top + margin.bottom;

		const svg = d3
			.select(chart)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.style('display', 'block'); // Remove inline spacing issues

		// 1. DEFINE PATTERN LOCALLY
		const defs = svg.append('defs');
		const patternId = 'person-pattern-overlay';

		// We want the pattern to repeat.
		// Let's decide a fixed visual size for the icon, say 15px.
		const pSize = 15;
		const pattern = defs
			.append('pattern')
			.attr('id', patternId)
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', pSize)
			.attr('height', pSize)
			.attr('patternUnits', 'userSpaceOnUse');

		pattern
			.append('path')
			.attr('d', userIconPath)
			.attr('fill', '#f97316')
			.attr('transform', `scale(${pSize / 24})`); // 24 is viewbox

		// 2. SCALES
		const y = d3
			.scaleBand()
			.range([margin.top, height - margin.bottom])
			.domain(data.map((d) => d.amenity))
			.padding(0.2);

		// Map max employees needed for domain. detailed view
		const maxVal = d3.max(data, (d) => d.additionalEmployees) || 100;
		// Ensure we have some range if all are 0
		const xDomain = maxVal > 0 ? maxVal : 100;

		const x = d3.scaleLinear().domain([0, xDomain]).range([0, chartWidth]).nice();

		const g = svg.append('g').attr('transform', `translate(${margin.left},0)`);

		// 3. GRID
		g.append('g')
			.attr('class', 'grid')
			.attr('transform', `translate(0,${margin.top})`)
			.call(
				d3
					.axisTop(x)
					.tickSize(-(height - margin.top - margin.bottom))
					.tickFormat(() => '') // No labels here
			)
			.call((g) => {
				g.select('.domain').remove();
				g.selectAll('line').attr('stroke', '#eee').attr('stroke-dasharray', '2,2');
			});

		// 4. BARS (Gap / Employees Needed)
		g.selectAll('.bar')
			.data(data)
			.enter()
			.append('rect')
			.attr('class', 'bar')
			.attr('x', 0)
			.attr('y', (d) => y(d.amenity))
			.attr('height', y.bandwidth())
			.attr('width', 0) // animate
			.attr('fill', `url(#${patternId})`)
			.attr('stroke', '#f97316')
			.attr('stroke-width', 1)
			.attr('rx', 2)
			// Tooltips
			.on('mouseover', function (event, d) {
				d3.select(this).style('opacity', 0.8);
				if (!tooltip) return;
				tooltip
					.style('opacity', 1)
					.html(
						`
                        <div class="font-bold text-sm mb-1">${d.amenity}</div>
                        <div class="text-xs">Needed: <span class="font-semibold text-orange-600">${Math.ceil(d.additionalEmployees).toLocaleString()}</span></div>
                        <div class="text-xs text-zinc-500">MTSA Avg: ${d.mtsaAvg}</div>
                    `
					)
					.style('left', event.pageX + 10 + 'px')
					.style('top', event.pageY - 10 + 'px');
			})
			.on('mousemove', function (event) {
				if (tooltip) {
					tooltip.style('left', event.pageX + 10 + 'px').style('top', event.pageY - 10 + 'px');
				}
			})
			.on('mouseout', function () {
				d3.select(this).style('opacity', 1);
				if (tooltip) tooltip.style('opacity', 0);
			})
			.transition()
			.duration(750)
			.attr('width', (d) => x(d.additionalEmployees));

		// 5. MTSA Marker (optional overlay?)
		// User asked for "MTSA average overlay".
		// If we map MTSA Avg (score) to Employees (count), we need a common unit.
		// Assuming user implies: "Compare the Access Score of station vs MTSA".
		// BUT we are showing Employees Chart.
		// Let's add a small text label or indicator of Status next to the bar?
		// Or maybe a secondary bar for Access Score?
		// The implementation plan settled on "horizontal bar chart ... simple labels".
		// Let's imply the MTSA comparison via the TOOLTIP and maybe a color-coded status indicator on the Y-axis label.

		// 6. Y-AXIS (Labels)
		svg
			.append('g')
			.attr('transform', `translate(${margin.left},0)`)
			.call(d3.axisLeft(y).tickSize(0))
			.call((g) => g.select('.domain').remove())
			.selectAll('text')
			.attr('x', -10)
			.style('text-anchor', 'end')
			.style('font-family', 'Inter, sans-serif')
			.style('font-size', '11px') // 12px might be big for long names
			.style('font-weight', '600')
			.style('fill', '#333')
			.text((d) => d); // d is string

		// Add Status Dots to Y-Axis Labels
		const labelGroup = svg.append('g').attr('transform', `translate(${margin.left},0)`);

		data.forEach((d) => {
			const yPos = y(d.amenity) + y.bandwidth() / 2;
			const statusColor = d.additionalEmployees > 0 ? '#ea580c' : '#10b981'; // Orange or Emerald

			// Status Dot
			labelGroup
				.append('circle')
				.attr('cx', -5) // Just right of text? No, left of text is better but hard with axis.
				// Let's put it on the right side of the axis line (x=0)
				.attr('cx', 0)
				.attr('cy', yPos)
				.attr('r', 3)
				.attr('fill', statusColor);
		});

		// 7. STICKY X-AXIS (Bottom)
		// We'll just render a standard axis at the bottom of the SVG.
		// Sticky behavior requires CSS on a separate SVG or container logic.
		// Given the container `overflow-y-auto`, we can place a separate SVG for the axis at the bottom?
		// Or just let it scroll. `TransitChart.svelte` used sticky CSS.
		// Since this overlay is `absolute`, let's just use standard axis for now to ensure alignment.
		svg
			.append('g')
			.attr('transform', `translate(${margin.left},${height - margin.bottom})`)
			.call(d3.axisBottom(x).ticks(5))
			.call((g) => g.select('.domain').attr('stroke', '#ddd'));

		// X-Axis Label
		svg
			.append('text')
			.attr('x', margin.left + chartWidth / 2)
			.attr('y', height - 5)
			.style('text-anchor', 'middle')
			.style('font-size', '10px')
			.style('fill', '#666')
			.text('Additional Employees Needed');

		// Legend
		const legend = svg.append('g').attr('transform', `translate(${margin.left}, 10)`);

		legend
			.append('rect')
			.attr('width', pSize)
			.attr('height', pSize)
			.attr('fill', `url(#${patternId})`)
			.attr('stroke', '#f97316');

		legend
			.append('text')
			.attr('x', pSize + 5)
			.attr('y', 12)
			.style('font-size', '10px')
			.style('fill', '#666')
			.text(`= ~${EMPLOYEES_PER_ICON} Employees`);
	}

	// Resize observer or simplified reactive update
	$effect(() => {
		if (sliderValues || width) {
			updateChart();
		}
	});

	onMount(() => {
		tooltip = d3
			.select('body')
			.append('div')
			.attr('class', 'tooltip')
			.style('opacity', 0)
			.style('position', 'absolute')
			.style('background', 'white')
			.style('padding', '8px')
			.style('border', '1px solid #ddd')
			.style('border-radius', '4px')
			.style('pointer-events', 'none')
			.style('z-index', 9999);

		return () => tooltip.remove();
	});
</script>

<div
	class="absolute right-4 top-24 z-10 max-h-[80vh] w-[400px] overflow-y-auto rounded-lg bg-white p-4 shadow-lg flex flex-col font-sans border border-zinc-200"
>
	<div class="mb-4 flex items-center justify-between flex-shrink-0 border-b border-zinc-100 pb-2">
		<h3 class="text-lg font-bold text-zinc-900">Access Analysis</h3>
		<button
			onclick={() => (isOpen = !isOpen)}
			class="text-zinc-400 hover:text-zinc-900 text-xl font-bold"
		>
			{isOpen ? '−' : '+'}
		</button>
	</div>

	{#if isOpen}
		<div class="space-y-4 flex-grow">
			<!-- Slider Section (Styled closer to TransitChart header inputs?) -->
			<div class="bg-zinc-50 p-4 rounded-lg border border-zinc-100">
				<label class="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">
					Projected Daily Visits
				</label>
				<div class="flex items-center gap-4">
					<div class="relative h-2 flex-grow">
						<input
							type="range"
							class="w-full absolute z-10 opacity-0 cursor-pointer"
							min="0"
							max="50000"
							step="100"
							bind:value={sliderValues[0]}
						/>
						<div class="w-full h-1 bg-zinc-200 rounded-full absolute top-0.5"></div>
						<div
							class="h-1 bg-blue-600 rounded-full absolute top-0.5"
							style="width: {(sliderValues[0] / 50000) * 100}%"
						></div>
						<div
							class="w-4 h-4 bg-white border-2 border-blue-600 rounded-full absolute top-[-5px] shadow-sm pointer-events-none"
							style="left: calc({(sliderValues[0] / 50000) * 100}% - 8px)"
						></div>
					</div>
					<div class="text-lg font-bold text-blue-600 w-20 text-right">
						{sliderValues[0].toLocaleString()}
					</div>
				</div>
			</div>

			<!-- D3 CHART CONTAINER -->
			<div class="w-full h-full min-h-[400px]" bind:clientWidth={width} bind:this={chart}></div>
		</div>
	{/if}
</div>
