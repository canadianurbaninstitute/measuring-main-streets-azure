<script lang="ts">
	import * as d3 from 'd3';
	import { onMount, untrack } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import { AMENITY_PATHS } from '../../../lib/data/transitdata/complete-communities-config';
	let {
		currentAccessData,
		futureDemandData,
		visitorCount = 0,
		futureVisits,
		sliderValues = $bindable([0])
	} = $props();

	let isOpen = $state(true);
	let chart = $state();
	let tooltip = $state();
	let width = $state(0);

	// Define our range bounds
	let min = $derived(visitorCount);
	let max = $derived(Math.max(visitorCount + 50000, 5000));
	let percent = $derived.by(() => {
		if (max === min) return 0;
		const p = ((sliderValues[0] - min) / (max - min)) * 100;
		return Math.max(0, Math.min(100, p)); // Clamp between 0-100
	});

	// User Icon Path (mdi:account)
	const userIconPath =
		'M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4';

	// Config
	const ICON_SIZE = 14;
	const EMPLOYEES_PER_ICON = 10;

	function updateChart() {
		untrack(() => {
			if (!chart || !width) return;
			const data = futureDemandData;
			const maxLabelCharCount = d3.max(data, (d) => d.amenity.length) || 0;
			const calculatedLeftMargin = Math.min(width * 0.4, maxLabelCharCount * 7 + 20);
			const margin = { top: 60, right: 40, bottom: 40, left: calculatedLeftMargin };
			const chartWidth = width - margin.left - margin.right;
			const barHeight = 35;
			const height = data.length * barHeight + margin.top + margin.bottom;
			const maxIconsInAnyRow =
				d3.max(data, (d) => {
					const currentCount = Math.round(d.currentAccess * (visitorCount / 100000));
					const needed = Math.ceil(d.additionalResources);
					return currentCount + needed;
				}) || 1; // Avoid divide by zero

			// Calculate a size that fits.
			// chartWidth = (count * size) + ((count - 1) * spacing)
			// Simplified: size = chartWidth / count
			const spacing = 2;
			const maxPossibleSize = 24; // Cap size so it doesn't look huge if only 1 icon
			const dynamicIconSize = Math.min(maxPossibleSize, chartWidth / maxIconsInAnyRow - spacing);
			const scaleFactor = dynamicIconSize / 24; // Based on standard 24px MDI paths

			// 1. Select or Create SVG
			let svg = d3.select(chart).select('svg');
			if (svg.empty()) {
				svg = d3.select(chart).append('svg');
			}
			svg.attr('width', width).attr('height', height);

			const y = d3
				.scaleBand()
				.range([margin.top, height - margin.bottom])
				.domain(data.map((d) => d.amenity))
				.padding(0.2);

			const rows = svg.selectAll('.amenity-row').data(data, (d: any) => d.amenity);
			const rowsEnter = rows.enter().append('g').attr('class', 'amenity-row');

			// 3. FIX: Add the label inside the Row Enter selection
			// This ensures the label is created exactly once per row
			rowsEnter
				.append('text')
				.attr('class', 'row-label')
				.attr('x', -15) // Position to the left of the icons
				.attr('y', 14) // Centered vertically with icon size
				.attr('text-anchor', 'end')
				.style('font-size', '12px')
				.style('font-weight', '600')
				.style('fill', '#374151');

			const rowsMerged = rowsEnter
				.merge(rows as any)
				.attr('transform', (d: any) => `translate(${margin.left}, ${y(d.amenity)})`);

			rowsMerged.select('.row-label').text((d: any) => d.amenity);

			rowsMerged.each(function (d) {
				const g = d3.select(this);
				const spacing = 2;

				const currentCount = Math.round(d.currentAccess * (visitorCount / 100000));
				const needed = Math.ceil(d.additionalResources);
				const iconPath = AMENITY_PATHS[d.amenity] || userIconPath;

				const iconsArray = [
					...Array(currentCount).fill({ type: 'existing' }),
					...Array(needed).fill({ type: 'new' })
				];

				const icons = g.selectAll('.amenity-icon').data(iconsArray, (d_icon, i) => i);
				const popEase = d3.easeBackOut.overshoot(2.0);
				icons
					.enter()
					.append('path')
					.attr('class', 'amenity-icon')
					.attr('d', iconPath)
					.attr(
						'transform',
						(d_icon, i) =>
							`translate(${i * (dynamicIconSize + spacing)}, ${dynamicIconSize / 2}) scale(0)`
					)
					.style('opacity', 0)
					.merge(icons as any)
					.transition()
					.duration(450)
					.delay((d_icon, i) => i * 15)
					.ease(popEase)
					.attr(
						'transform',
						(d_icon, i) =>
							`translate(${i * (dynamicIconSize + spacing)}, 0) scale(${dynamicIconSize / 24})`
					)
					.attr('fill', (d_icon) => (d_icon.type === 'existing' ? '#00adf2' : '#db3069'))
					.style('opacity', 1);

				// EXIT: Shrink down smoothly
				icons
					.exit()
					.transition()
					.duration(200)
					.attr(
						'transform',
						(d_icon, i) =>
							`translate(${i * (dynamicIconSize + spacing)}, ${dynamicIconSize / 2}) scale(0)`
					)
					.style('opacity', 0)
					.remove();

				// --- NUMERIC BADGE (+3) ---
				const badgeX = iconsArray.length * (dynamicIconSize + spacing) + 8;
				const badgeData = needed > 0 ? [needed] : [];
				const badge = g.selectAll('.need-badge').data(badgeData);

				badge.exit().remove();

				badge
					.enter()
					.append('text')
					.attr('class', 'need-badge')
					.attr('dy', dynamicIconSize / 1.4)
					.style('font-weight', '800')
					.style('font-size', '13px')
					.style('fill', '#db3069')
					.style('opacity', 0)
					.merge(badge as any)
					.transition()
					.duration(450)
					.attr('x', badgeX)
					.text((n) => `+${n}`)
					.style('opacity', 1);
			});

			// 5. Static Legend (Only draw if it doesn't exist)
			if (svg.select('.legend').empty()) {
				const legend = svg
					.append('g')
					.attr('class', 'legend')
					.attr('transform', `translate(${margin.left}, 30)`);

				legend.append('circle').attr('r', 5).attr('fill', '#00adf2');
				legend
					.append('text')
					.attr('x', 12)
					.attr('y', 5)
					.text('Current')
					.style('font-size', '11px')
					.attr('fill', '#6b7280');

				legend.append('circle').attr('r', 5).attr('cx', 80).attr('fill', '#db3069');
				legend
					.append('text')
					.attr('x', 92)
					.attr('y', 5)
					.text('Additional Need')
					.style('font-size', '11px')
					.attr('fill', '#6b7280');
			}
		});
	}

	$effect(() => {
		// Explicitly reference the changing value and the data array
		const currentVal = sliderValues[0];
		const data = futureDemandData;

		if (width && data) {
			updateChart();
		}
	});

	onMount(() => {
		updateChart();
	});
</script>

<div
	class="absolute w-full z-10 bottom-0 transition-all duration-500 ease-in-out rounded-lg bg-white p-4 flex flex-col border border-zinc-200"
	class:h-full={isOpen}
	class:h-50={!isOpen}
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
		<div transition:slide={{ duration: 600, easing: cubicInOut }} class="space-y-4 flex-grow">
			<div class="bg-zinc-50 p-4 rounded-lg border border-zinc-100">
				<label class="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">
					Projected Daily Visits
				</label>
				<div class="flex items-center gap-4">
					<div class="relative h-2 flex-grow">
						<input
							type="range"
							class="w-full absolute z-10 opacity-0 cursor-pointer"
							{min}
							{max}
							step="100"
							bind:value={sliderValues[0]}
						/>

						<div class="w-full h-1.5 bg-zinc-200 rounded-full absolute top-0.5"></div>

						<div
							class="h-1.5 bg-blue-600 rounded-full absolute top-0.5"
							style:width="{percent}%"
						></div>

						<div
							class="w-5 h-5 bg-white border-2 border-blue-600 rounded-full absolute top-[-6px] shadow-md pointer-events-none"
							style:left="calc({percent}% - 10px)"
						></div>
					</div>

					<div class="text-lg font-mono font-bold text-blue-600 w-24 text-right">
						{Math.round(sliderValues[0]).toLocaleString()}
					</div>
				</div>
			</div>

			<!-- D3 CHART CONTAINER -->
			<div class="w-full h-full min-h-[400px]" bind:clientWidth={width} bind:this={chart}></div>
		</div>
	{/if}
</div>

<style>
</style>
