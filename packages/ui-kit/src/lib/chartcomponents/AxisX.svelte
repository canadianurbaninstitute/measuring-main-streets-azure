<script lang="ts">
	import { getContext } from 'svelte';
	import type { Readable } from 'svelte/store';

	// 1. Fetch LayerCake contexts and map store structures for Type Safety
	const { width, height, xScale, yRange } = getContext<{
		width: Readable<number>;
		height: Readable<number>;
		xScale: Readable<any>; // Can be an ordinal, band, or linear D3 scale
		yRange: Readable<number[]>;
	}>('LayerCake');

	// 2. Define strict component prop typings
	interface Props {
		tickMarks?: boolean;
		gridlines?: boolean;
		tickMarkLength?: number;
		baseline?: boolean;
		snapLabels?: boolean;
		format?: (d: any) => string | number;
		ticks?: number | any[] | ((defaultTicks: any[]) => any[]);
		tickGutter?: number;
		dx?: number | string;
		dy?: number | string;
		label?: string;
	}

	// 3. Receive props using the Svelte 5 $props() rune
	let {
		tickMarks = false,
		gridlines = true,
		tickMarkLength = 6,
		baseline = false,
		snapLabels = false,
		format = (d: any) => d,
		ticks = undefined,
		tickGutter = 0,
		dx = 0,
		dy = 12,
		label = ''
	}: Props = $props();

	// 4. Implement clear edge-case alignment calculation helper
	function textAnchor(i: number, sl: boolean): 'start' | 'end' | 'middle' {
		if (sl === true) {
			if (i === 0) {
				return 'start';
			}
			if (i === tickVals.length - 1) {
				return 'end';
			}
		}
		return 'middle';
	}

	// 5. Convert legacy "$:" reactive labels to $derived states
	let tickLen = $derived(tickMarks === true ? (tickMarkLength ?? 6) : 0);

	let isBandwidth = $derived(typeof $xScale.bandwidth === 'function');

	let tickVals = $derived(
		Array.isArray(ticks)
			? ticks
			: isBandwidth
				? $xScale.domain()
				: typeof ticks === 'function'
					? ticks($xScale.ticks())
					: $xScale.ticks(ticks)
	);

	let halfBand = $derived(isBandwidth ? $xScale.bandwidth() / 2 : 0);
</script>

<g class="axis x-axis" class:snapLabels>
	{#each tickVals as tick, i (tick)}
		{#if baseline === true}
			<line class="baseline" y1={$height} y2={$height} x1="0" x2={$width} />
		{/if}

		<g class="tick tick-{i}" transform="translate({$xScale(tick)},{Math.max(...$yRange)})">
			{#if gridlines === true}
				<line class="gridline" x1={halfBand} x2={halfBand} y1={-$height} y2="0" />
			{/if}
			{#if tickMarks === true}
				<line
					class="tick-mark"
					x1={halfBand}
					x2={halfBand}
					y1={tickGutter}
					y2={tickGutter + tickLen}
				/>
			{/if}
			<text x={halfBand} y={tickGutter + tickLen} {dx} {dy} text-anchor={textAnchor(i, snapLabels)}>
				{format(tick)}
			</text>
		</g>
	{/each}

	{#if label}
		<text
			class="axis-label"
			x={$width / 2}
			y={$height + (tickGutter + tickLen + Number(dy) + 20)}
			text-anchor="middle"
		>
			{label}
		</text>
	{/if}
</g>

<style>
	.tick {
		font-size: 11px;
	}

	line,
	.tick line {
		stroke: #aaa;
		stroke-dasharray: 2;
	}

	.tick text {
		fill: #666;
	}

	.axis-label {
		fill: #444;
		font-size: 13px;
		font-weight: 500;
	}

	.tick .tick-mark,
	.baseline {
		stroke-dasharray: 0;
	}

	.axis.snapLabels .tick:last-child text {
		transform: translateX(3px);
	}
	.axis.snapLabels .tick.tick-0 text {
		transform: translateX(-3px);
	}
</style>
