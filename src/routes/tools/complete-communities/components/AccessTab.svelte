<script lang="ts">
	import * as d3 from 'd3';
	import { onMount, untrack } from 'svelte';
	import { AMENITY_PATHS } from '../../../lib/data/transitdata/complete-communities-config';

	let {
		stationCCcounts,
		computedAmenities,
		projectedVisits,
		tier = $bindable('tier1'),
		sliderValues = $bindable([0])
	} = $props();

	let isOpen = $state(true);
	let chart = $state();
	let tooltip = $state();
	let width = $state(0);

	let min = 0;
	let max = 50000;
	let percent = $derived.by(() => {
		if (max === min) return 0;
		const p = ((sliderValues[0] - min) / (max - min)) * 100;
		return Math.max(0, Math.min(100, p)); // Clamp between 0-100
	});

	// Fallback user Icon Path (mdi:account)
	const userIconPath =
		'M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4';

	function updateChart() {
		untrack(() => {
			if (!chart || !width) return;
			const data = computedAmenities;

			// --- 1. DYNAMIC WIDTH CALCULATION ---
			const maxLabelCharCount = d3.max(data, (d) => d.Amenity.length) || 0;
			const calculatedLeftMargin = Math.min(width * 0.5, maxLabelCharCount * 5.25);
			const margin = { top: 100, right: -10, bottom: 40, left: calculatedLeftMargin };
			const chartWidth = width - margin.left - margin.right;

			// How many icons can we fit? (Assuming ~18px per icon + spacing)
			// This ensures mobile shows fewer icons and desktop shows more.
			const MAX_ICONS_LIMIT = Math.max(5, Math.floor(chartWidth / 20));

			// --- 2. GLOBAL MULTIPLIER ---
			// Find the row with the absolute highest number of resources
			const absoluteMaxVal =
				d3.max(data, (d) => {
					const current = stationCCcounts[d.Amenity];
					const needed = d.amenitiesNeeded_p75;
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
				.domain(data.map((d) => d.Amenity))
				.padding(0.2);

			// --- 4. DRAW ROWS ---
			const rows = svg.selectAll('.amenity-row').data(data, (d: any) => d.Amenity);
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
				.attr('transform', (d: any) => `translate(${margin.left}, ${y(d.Amenity)})`);

			const CHAR_LIMIT = 20; // Adjust this based on your sidebar width

			rowsMerged.select('.row-label').each(function (d) {
				const el = d3.select(this);
				const fullText = d.Amenity;

				// Truncate logic
				const displayedText =
					fullText.length > CHAR_LIMIT ? fullText.slice(0, CHAR_LIMIT) + '...' : fullText;

				el.text(displayedText);

				// Add a tooltip (native SVG title) for the full name on hover
				el.selectAll('title').remove(); // Clear old titles
				el.append('title').text(fullText);
			});

			rowsMerged.each(function (d, rowIndex) {
				const g = d3.select(this);
				const iconPath = AMENITY_PATHS[d.Amenity] || userIconPath;

				// 1. Math - Calculate icon counts as decimals
				const iconsCurrent = (stationCCcounts[d.Amenity] || 0) / globalUnitsPerIcon;
				const iconsMedThreshold = iconsCurrent + d.amenitiesNeeded_med / globalUnitsPerIcon;
				const iconsP75Threshold = iconsCurrent + d.amenitiesNeeded_p75 / globalUnitsPerIcon;
				const totalDisplayCount = Math.ceil(iconsP75Threshold);

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
						const clipExistId = `clip-exist-${rowIndex}-${i}`;
						const clipMedId = `clip-med-${rowIndex}-${i}`;
						const clipP75Id = `clip-p75-${rowIndex}-${i}`;

						// A. CLIP FOR P75 (Light Pink) - The full range up to Above Average
						let clipP75 = defs.select(`#${clipP75Id}`);
						if (clipP75.empty())
							clipP75 = defs
								.append('clipPath')
								.attr('id', clipP75Id)
								.append('rect')
								.attr('height', 24);
						const p75Fill = Math.max(0, Math.min(1, iconsP75Threshold - i));
						clipP75.attr('width', 24 * p75Fill);

						// B. CLIP FOR MED (Darker Pink) - Part of the range up to Typical
						let clipMed = defs.select(`#${clipMedId}`);
						if (clipMed.empty())
							clipMed = defs
								.append('clipPath')
								.attr('id', clipMedId)
								.append('rect')
								.attr('height', 24);
						const medFill = Math.max(0, Math.min(1, iconsMedThreshold - i));
						clipMed.attr('width', 24 * medFill);

						// C. CLIP FOR EXISTING (Blue) - How much of this icon is "Current"?
						let clipExist = defs.select(`#${clipExistId}`);
						if (clipExist.empty())
							clipExist = defs
								.append('clipPath')
								.attr('id', clipExistId)
								.append('rect')
								.attr('height', 24);
						const existFill = Math.max(0, Math.min(1, iconsCurrent - i));
						clipExist.attr('width', 24 * existFill);

						// Render P75 Path (Light Pink) - The background of the "need" range
						let p75Path = slotGroup.select('.path-p75');
						if (p75Path.empty()) p75Path = slotGroup.append('path').attr('class', 'path-p75');
						p75Path
							.attr('d', iconPath)
							.attr('fill', '#fcc5d6') // Light Pink
							.attr('clip-path', `url(#${clipP75Id})`);

						// Render Med Path (Pink) - Typical Need
						let medPath = slotGroup.select('.path-med');
						if (medPath.empty()) medPath = slotGroup.append('path').attr('class', 'path-med');
						medPath
							.attr('d', iconPath)
							.attr('fill', '#db3069')
							.attr('clip-path', `url(#${clipMedId})`);

						// Render Blue Path (Existing) - This sits on top of pink
						let bluePath = slotGroup.select('.path-exist');
						if (bluePath.empty()) bluePath = slotGroup.append('path').attr('class', 'path-exist');
						bluePath
							.attr('d', iconPath)
							.attr('fill', '#00adf2')
							.attr('clip-path', `url(#${clipExistId})`);
					});

				// 4. Position Badge
				// Position is precisely based on the decimal iconsP75Threshold
				const finalX = iconsP75Threshold * (dynamicIconSize + spacing);

				const badge = g.selectAll('.need-badge').data(d.amenitiesNeeded_p75 > 0 ? [d] : []);
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
					.text((d) => {
						const min = Math.floor(d.amenitiesNeeded_med);
						const max = Math.floor(d.amenitiesNeeded_p75);
						return min === max ? `+${min}` : `+${min}-${max}`;
					});
			});
			// --- 5. LEGEND & MULTIPLIER (CENTERED) ---
			let legend = svg.select('.legend');
			if (legend.empty()) {
				legend = svg.append('g').attr('class', 'legend');
			}

			// Calculate the center of the actual chart area
			const chartCenter = (margin.left + chartWidth) / 2;

			// Position the legend container
			legend.attr('transform', `translate(${chartCenter}, 30)`);

			// Legend Data - defining offsets relative to the center
			const legendItems = [
				{ label: 'Current', color: '#00adf2', y: 0 },
				{ label: 'Need for Regional Typical Access', color: '#db3069', y: 20 },
				{ label: 'Need for Above Average Access', color: '#fcc5d6', y: 40 },
				{
					label: globalUnitsPerIcon > 0 ? `(1 icon = ${globalUnitsPerIcon} amenities)` : '',
					color: '#9ca3af',
					y: 60,
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
			// Position legend at top-left of chart area
			legend.attr('transform', `translate(${margin.left - 50}, 20)`);

			// Use y offset for stacking
			itemsMerged.attr('transform', (d) => `translate(0, ${d.y})`);

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
		const data = computedAmenities;
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

<div class="access-tab mb-4">
	<!-- Table 1: Current Level of Access -->
	<div class="section">
		<div class="bg-zinc-50 p-4 rounded-lg border border-zinc-100">
			<div class="mb-6 flex items-end justify-between">
				<div>
					<label class="block text-xs font-bold uppercase tracking-wider text-zinc-500">
						Additional Residents
					</label>
					<div class="text-2xl font-mono font-black text-blue-600">
						{Math.round(sliderValues[0]).toLocaleString()}
					</div>
				</div>

				{#if projectedVisits > 0}
					<div class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold mb-1">
						{Math.round(projectedVisits).toLocaleString()} total visitors
					</div>
				{/if}
			</div>

			<div class="relative h-10 flex flex-col justify-center">
				<div class="relative w-full h-1.5 mb-2">
					<div class="w-full h-1.5 bg-zinc-200 rounded-full absolute top-0"></div>

					<div class="h-1.5 bg-blue-600 rounded-full absolute top-0" style:width="{percent}%"></div>

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
						{min.toLocaleString()}
					</div>
					<div class="text-[10px] font-bold text-zinc-400 text-right">
						{max.toLocaleString()}
					</div>
				</div>
			</div>
		</div>

		<div class="flex flex-col items-center justify-center pt-2 gap-4">
			<div class="inline-flex p-1 bg-zinc-100 rounded-lg border border-zinc-200">
				<button
					onclick={() => (tier = 'tier1')}
					class="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 rounded-md"
					class:bg-white={tier === 'tier1'}
					class:text-blue-600={tier === 'tier1'}
					class:shadow-sm={tier === 'tier1'}
					class:text-zinc-500={tier !== 'tier1'}
					class:hover:text-zinc-700={tier !== 'tier1'}
				>
					Core Amenities
				</button>
				<button
					onclick={() => (tier = 'tier2')}
					class="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 rounded-md"
					class:bg-white={tier === 'tier2'}
					class:text-blue-600={tier === 'tier2'}
					class:shadow-sm={tier === 'tier2'}
					class:text-zinc-500={tier !== 'tier2'}
					class:hover:text-zinc-700={tier !== 'tier2'}
				>
					Additional Amenities
				</button>
			</div>
		</div>

		<!-- D3 CHART CONTAINER -->
		<div class="w-full h-full min-h-[400px]" bind:clientWidth={width} bind:this={chart}></div>
	</div>
</div>

<style>
	.access-tab {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.section {
		width: 100%;
	}
</style>
