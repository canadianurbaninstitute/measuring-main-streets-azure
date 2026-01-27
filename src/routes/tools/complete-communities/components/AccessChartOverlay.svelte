<script lang="ts">
	import * as d3 from 'd3';
	import { onMount, untrack } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import { AMENITY_PATHS } from '../../../lib/data/transitdata/complete-communities-config';
	let {
		currentAccessData,
		tier = $bindable('tier1'),
		futureDemandData,
		visitorCount = 0,
		futureVisits,
		sliderValues = $bindable([0])
	} = $props();

	let isOpen = $state(true);
	let chart = $state();
	let tooltip = $state();
	let width = $state(0);

	let min = $derived(visitorCount);
	let max = $derived(Math.max(visitorCount + 50000, 5000));
	let percent = $derived.by(() => {
		if (max === min) return 0;
		const p = ((sliderValues[0] - min) / (max - min)) * 100;
		return Math.max(0, Math.min(100, p)); // Clamp between 0-100
	});
	let increase = $derived(sliderValues[0] - visitorCount);

	// Fallback user Icon Path (mdi:account)
	const userIconPath =
		'M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4';
	function updateChart() {
		untrack(() => {
			if (!chart || !width) return;
			const data = futureDemandData;

			// --- 1. DYNAMIC WIDTH CALCULATION ---
			const maxLabelCharCount = d3.max(data, (d) => d.amenity.length) || 0;
			const calculatedLeftMargin = Math.min(width * 0.4, maxLabelCharCount * 7 + 20);
			const margin = { top: 60, right: 60, bottom: 40, left: calculatedLeftMargin };
			const chartWidth = width - margin.left - margin.right;

			// How many icons can we fit? (Assuming ~18px per icon + spacing)
			// This ensures mobile shows fewer icons and desktop shows more.
			const MAX_ICONS_LIMIT = Math.max(5, Math.floor(chartWidth / 20));

			// --- 2. GLOBAL MULTIPLIER ---
			// Find the row with the absolute highest number of resources
			const absoluteMaxVal =
				d3.max(data, (d) => {
					const current = Math.round(d.currentAccess * (visitorCount / 100000));
					const needed = Math.ceil(d.additionalResources);
					return current + needed;
				}) || 1;

			// Calculate a single multiplier for the whole chart
			const globalUnitsPerIcon =
				absoluteMaxVal > MAX_ICONS_LIMIT ? Math.ceil(absoluteMaxVal / MAX_ICONS_LIMIT) : 1;

			// --- 3. SCALING & SVG SETUP ---
			const barHeight = 35;
			const height = data.length * barHeight + margin.top + margin.bottom;

			// The icon size is now calculated based on our dynamic limit
			const spacing = 0;
			const dynamicIconSize = Math.min(24, chartWidth / MAX_ICONS_LIMIT - spacing);

			let svg = d3.select(chart).select('svg');
			if (svg.empty()) svg = d3.select(chart).append('svg');
			svg.attr('width', width).attr('height', height);

			const y = d3
				.scaleBand()
				.range([margin.top, height - margin.bottom])
				.domain(data.map((d) => d.amenity))
				.padding(0.2);

			// --- 4. DRAW ROWS ---
			const rows = svg.selectAll('.amenity-row').data(data, (d: any) => d.amenity);
			const rowsEnter = rows.enter().append('g').attr('class', 'amenity-row');

			rowsEnter
				.append('text')
				.attr('class', 'row-label')
				.attr('x', -15)
				.attr('y', dynamicIconSize / 1.5)
				.attr('text-anchor', 'end')
				.style('font-size', '12px')
				.style('font-weight', '600')
				.style('fill', '#374151');

			const rowsMerged = rowsEnter
				.merge(rows as any)
				.attr('transform', (d: any) => `translate(${margin.left}, ${y(d.amenity)})`);

			rowsMerged.select('.row-label').text((d: any) => d.amenity);

			rowsMerged.each(function (d, rowIndex) {
				const g = d3.select(this);
				const iconPath = AMENITY_PATHS[d.amenity] || userIconPath;

				// 1. Math - Calculate icon counts as decimals
				const iconsCurrent = (d.currentAccess * (visitorCount / 100000)) / globalUnitsPerIcon;
				const iconsTotal = iconsCurrent + d.additionalResources / globalUnitsPerIcon;
				const totalDisplayCount = Math.ceil(iconsTotal);

				// 2. Setup Defs for unique clipping
				let defs = g.select('defs');
				if (defs.empty()) defs = g.append('defs');

				// 3. Create a Slot Array [0, 1, 2...]
				const slots = Array.from({ length: totalDisplayCount }, (_, i) => i);

				const iconSlots = g.selectAll('.icon-slot').data(slots, (i) => i);
				iconSlots.exit().remove();

				const enterSlots = iconSlots.enter().append('g').attr('class', 'icon-slot');

				enterSlots
					.merge(iconSlots as any)
					.attr(
						'transform',
						(i) => `translate(${i * (dynamicIconSize + spacing)}, 0) scale(${dynamicIconSize / 24})`
					)
					.each(function (i) {
						const slotGroup = d3.select(this);

						// IDs for this specific icon slot
						const clipTotalId = `clip-total-${rowIndex}-${i}`;
						const clipExistId = `clip-exist-${rowIndex}-${i}`;

						// A. CLIP FOR TOTAL (Pink) - How much of this icon exists at all?
						let clipTotal = defs.select(`#${clipTotalId}`);
						if (clipTotal.empty())
							clipTotal = defs
								.append('clipPath')
								.attr('id', clipTotalId)
								.append('rect')
								.attr('height', 24);
						const totalFill = Math.max(0, Math.min(1, iconsTotal - i));
						clipTotal.attr('width', 24 * totalFill);

						// B. CLIP FOR EXISTING (Blue) - How much of this icon is "Current"?
						let clipExist = defs.select(`#${clipExistId}`);
						if (clipExist.empty())
							clipExist = defs
								.append('clipPath')
								.attr('id', clipExistId)
								.append('rect')
								.attr('height', 24);
						const existFill = Math.max(0, Math.min(1, iconsCurrent - i));
						clipExist.attr('width', 24 * existFill);

						// Render Pink Path (Total)
						let pinkPath = slotGroup.select('.path-total');
						if (pinkPath.empty()) pinkPath = slotGroup.append('path').attr('class', 'path-total');
						pinkPath
							.attr('d', iconPath)
							.attr('fill', '#db3069')
							.attr('clip-path', `url(#${clipTotalId})`);

						// Render Blue Path (Existing) - This sits on top of pink
						let bluePath = slotGroup.select('.path-exist');
						if (bluePath.empty()) bluePath = slotGroup.append('path').attr('class', 'path-exist');
						bluePath
							.attr('d', iconPath)
							.attr('fill', '#00adf2')
							.attr('clip-path', `url(#${clipExistId})`);
					});

				// 4. Position Badge
				// Position is precisely based on the decimal iconsTotal
				const finalX = iconsTotal * (dynamicIconSize + spacing);

				const badge = g
					.selectAll('.need-badge')
					.data(d.additionalResources > 0 ? [Math.round(d.additionalResources)] : []);
				badge.exit().remove();
				badge
					.enter()
					.append('text')
					.attr('class', 'need-badge')
					.merge(badge as any)
					.attr('x', finalX + 8)
					.attr('dy', dynamicIconSize / 1.4)
					.style('fill', '#db3069')
					.style('font-weight', 'bold')
					.style('font-size', '12px')
					.text((n) => `+${n}`); // Showing 1 decimal place for precision
			});
			// --- 5. LEGEND & MULTIPLIER (CENTERED) ---
			let legend = svg.select('.legend');
			if (legend.empty()) {
				legend = svg.append('g').attr('class', 'legend');
			}

			// Calculate the center of the actual chart area
			const chartCenter = (margin.left + chartWidth) / 2;

			// Position the legend container
			legend.transition().duration(450).attr('transform', `translate(${chartCenter}, 30)`);

			// Legend Data - defining offsets relative to the center
			const legendItems = [
				{ label: 'Current', color: '#00adf2', x: -110 },
				{ label: 'Additional Need', color: '#db3069', x: -20 },
				{
					label: globalUnitsPerIcon > 1 ? `(1 icon = ${globalUnitsPerIcon} amenities)` : '',
					color: '#9ca3af',
					x: 90,
					isNote: true
				}
			];

			const items = legend.selectAll('.legend-item').data(legendItems);
			const itemsEnter = items.enter().append('g').attr('class', 'legend-item');

			// Add Circles
			itemsEnter.append('circle').attr('r', 5);
			// Add Text
			itemsEnter
				.append('text')
				.attr('x', 12)
				.attr('y', 5)
				.style('font-size', '11px')
				.style('fill', '#6b7280');

			const itemsMerged = itemsEnter.merge(items as any);

			// Update positions and values
			itemsMerged
				.transition()
				.duration(450)
				.attr('transform', (d) => `translate(${d.x}, 0)`);

			itemsMerged
				.select('circle')
				.attr('fill', (d) => d.color)
				.style('opacity', (d) => (d.isNote ? 0 : 1)); // Hide circle for the multiplier note

			itemsMerged
				.select('text')
				.text((d) => d.label)
				.style('font-weight', (d) => (d.isNote ? 'bold' : 'normal'));

			items.exit().remove();
		});
	}

	let lastTier = $state(tier);

	$effect(() => {
		const currentTier = tier;
		const data = futureDemandData;
		const currentVal = sliderValues[0];
		const isOpened = isOpen;

		if (data && isOpen) {
			// Check if the tier actually changed
			const isHardRedraw = currentTier !== lastTier;

			if (isHardRedraw || width) {
				// Wipe the SVG defs and reset internal states if needed
				d3.select(chart).select('svg').selectAll('*').remove();
				lastTier = currentTier;
			}
			updateChart();
		}
	});

	onMount(() => {
		updateChart();
	});
</script>

<div
	class="absolute w-full z-10 bottom-0 transition-all duration-500 ease-in-out rounded-lg bg-white p-4 flex flex-col border border-zinc-200 overflow-y-auto"
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
				<div class="mb-6 flex items-end justify-between">
					<div>
						<label class="block text-xs font-bold uppercase tracking-wider text-zinc-500">
							Projected Daily Visits
						</label>
						<div class="text-2xl font-mono font-black text-blue-600">
							{Math.round(sliderValues[0]).toLocaleString()}
						</div>
					</div>

					{#if increase > 0}
						<div class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold mb-1">
							+{Math.round(increase).toLocaleString()} increase
						</div>
					{/if}
				</div>

				<div class="relative h-10 flex flex-col justify-center">
					<div class="relative w-full h-1.5 mb-2">
						<div class="w-full h-1.5 bg-zinc-200 rounded-full absolute top-0"></div>

						<div
							class="h-1.5 bg-blue-600 rounded-full absolute top-0"
							style:width="{percent}%"
						></div>

						<input
							type="range"
							class="w-full absolute z-20 opacity-0 cursor-pointer -top-2 h-6"
							{min}
							{max}
							step="100"
							bind:value={sliderValues[0]}
						/>

						<div
							class="w-5 h-5 bg-white border-2 border-blue-600 rounded-full absolute top-[-7px] shadow-md pointer-events-none z-10"
							style:left="calc({percent}% - 10px)"
						></div>
					</div>

					<div class="flex justify-between mt-2">
						<div class="text-[10px] font-bold text-zinc-400">
							<!-- <span class="block text-zinc-300 uppercase">Min (Current)</span> -->
							{min.toLocaleString()}
						</div>
						<div class="text-[10px] font-bold text-zinc-400 text-right">
							<!-- <span class="block text-zinc-300 uppercase">Max Range</span> -->
							{max.toLocaleString()}
						</div>
					</div>
				</div>
			</div>

			<div class="flex items-center justify-center pt-2">
				<div class="inline-flex p-1 bg-zinc-100 rounded-lg border border-zinc-200">
					{#each ['tier1', 'tier2'] as filter}
						<button
							onclick={() => (tier = filter)}
							class="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 rounded-md"
							class:bg-white={tier === filter}
							class:text-blue-600={tier === filter}
							class:shadow-sm={tier === filter}
							class:text-zinc-500={tier !== filter}
							class:hover:text-zinc-700={tier !== filter}
						>
							{filter}
						</button>
					{/each}
				</div>
			</div>

			<!-- D3 CHART CONTAINER -->
			<div class="w-full h-full min-h-[400px]" bind:clientWidth={width} bind:this={chart}></div>
		</div>
	{/if}
</div>

<style>
</style>
