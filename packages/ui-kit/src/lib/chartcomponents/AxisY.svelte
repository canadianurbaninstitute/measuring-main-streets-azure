<script lang="ts">
	import { getContext } from 'svelte';
	import type { Readable } from 'svelte/store';

	// 1. Fetch LayerCake context stores with precise structural types
	const { xRange, yScale, width } = getContext<{
		xRange: Readable<[number, number]>;
		yScale: Readable<any>; // Can be linear, band, or ordinal D3 scales
		width: Readable<number>;
	}>('LayerCake');

	// 2. Define the exact Props interface for type-safety
	interface Props {
		tickMarks?: boolean;
		labelPosition?: 'even' | 'above';
		snapBaselineLabel?: boolean;
		gridlines?: boolean;
		tickMarkLength?: number | undefined;
		format?: (d: any) => string | number;
		ticks?: number | any[] | ((defaultTicks: any[]) => any[]);
		tickGutter?: number;
		dx?: number;
		dy?: number;
		charPixelWidth?: number;
		wrap?: boolean;
		label?: string;
	}

	// 3. Receive parameters using the Svelte 5 $props() rune
	let {
		tickMarks = false,
		labelPosition = 'even',
		snapBaselineLabel = false,
		gridlines = true,
		tickMarkLength = undefined,
		format = (d: any) => d,
		ticks = 4,
		tickGutter = 0,
		dx = 0,
		dy = 0,
		charPixelWidth = 7.25,
		wrap = false,
		label = ''
	}: Props = $props();

	// 4. Calculate string weights defensively
	function calcStringLength(sum: number, val: string): number {
		if (val === ',' || val === '.') return sum + charPixelWidth * 0.5;
		return sum + charPixelWidth;
	}

	// 5. Build computed behaviors using Svelte 5 $derived statements
	let isBandwidth = $derived(typeof $yScale.bandwidth === 'function');

	let tickVals = $derived(
		Array.isArray(ticks)
			? ticks
			: isBandwidth
				? $yScale.domain()
				: typeof ticks === 'function'
					? ticks($yScale.ticks())
					: $yScale.ticks(ticks)
	);

	let widestTickLen = $derived(
		Math.max(
			10,
			Math.max(
				...tickVals.map((d: any) => {
					const formatted = format(d).toString();
					if (wrap) {
						return Math.max(
							...formatted.split(' ').map((word) => word.split('').reduce(calcStringLength, 0))
						);
					}
					return formatted.split('').reduce(calcStringLength, 0);
				})
			)
		)
	);

	let tickLen = $derived(
		tickMarks === true
			? labelPosition === 'above'
				? (tickMarkLength ?? widestTickLen)
				: (tickMarkLength ?? 6)
			: 0
	);

	let x1 = $derived(-tickGutter - (labelPosition === 'above' ? widestTickLen : tickLen));
	let y = $derived(isBandwidth ? $yScale.bandwidth() / 2 : 0);

	let maxTickValPx = $derived(Math.max(...tickVals.map($yScale)));
</script>

<g class="axis y-axis">
	{#each tickVals as tick (tick)}
		{@const tickValPx = $yScale(tick)}
		<g class="tick tick-{tick}" transform="translate({$xRange[0]}, {tickValPx})">
			{#if gridlines === true}
				<line class="gridline" {x1} x2={$width} y1={y} y2={y}></line>
			{/if}
			{#if tickMarks === true}
				<line class="tick-mark" {x1} x2={x1 + tickLen} y1={y} y2={y}></line>
			{/if}
			<text
				x={x1}
				{y}
				dx={dx + (labelPosition === 'even' ? -3 : 0)}
				text-anchor={labelPosition === 'above' ? 'start' : 'end'}
				dy={dy +
					(labelPosition === 'above' || (snapBaselineLabel === true && tickValPx === maxTickValPx)
						? -3
						: 4)}
			>
				{#if wrap}
					{@const words = format(tick).toString().split(' ')}
					{#each words as word, i}
						<tspan x={x1} dy={i === 0 ? `${-((words.length - 1) * 0.5)}em` : '1.1em'}>{word}</tspan>
					{/each}
				{:else}
					{format(tick)}
				{/if}
			</text>
		</g>
	{/each}

	{#if label}
		<text
			class="axis-label"
			transform="rotate(-90)"
			x={-$yScale.range()[0] / 2}
			y={-widestTickLen - (labelPosition === 'even' ? tickLen + 8 : 15)}
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

	.tick line {
		stroke: #aaa;
	}
	.tick .gridline {
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

	.tick.tick-0 line {
		stroke-dasharray: 0;
	}
</style>
