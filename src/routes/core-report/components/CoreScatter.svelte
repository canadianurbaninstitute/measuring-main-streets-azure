<!-- Plots the fifteen downtown cores against any two measures, sized by
     population and coloured by downtown size, with a plain-language read on how
     tightly the pairing actually holds. -->

<script>
	import {
		SIZE_COLOR,
		SIZE_OF,
		correlation,
		correlationLabel,
		format,
		population
	} from '../coreMetrics.js';

	/**
	 * Props:
	 *   cities       - rows from coreCensus, each core a single census-year profile
	 *   xMetric      - metric definition for the horizontal axis
	 *   yMetric      - metric definition for the vertical axis
	 *   selectedCity - bindable city key; clicking a bubble isolates that city
	 */
	let { cities = [], xMetric, yMetric, selectedCity = $bindable(null) } = $props();

	let width = $state(900);
	let hovered = $state(null);

	const height = $derived(width < 640 ? 340 : 440);

	// Percentage measures start at zero so shares stay comparable; other measures
	// get a little breathing room below the smallest value. Cores missing either
	// value are left off rather than drawn at zero.
	const rows = $derived(
		cities
			.map((city) => {
				const profile = city.downtown;
				return {
					key: city.key,
					name: city.name,
					sizeGroup: SIZE_OF[city.key],
					color: SIZE_COLOR[SIZE_OF[city.key]],
					x: xMetric.get(profile),
					y: yMetric.get(profile),
					population: population(profile) ?? 0
				};
			})
			.filter((row) => row.x != null && row.y != null)
	);

	// [transform, inverse] for an axis: counts like population need a log scale.
	function axisTransform(scale) {
		if (scale === 'log') return [(v) => Math.log10(Math.max(v, 1)), (t) => Math.pow(10, t)];
		if (scale === 'sqrt') return [(v) => Math.sqrt(Math.max(v, 0)), (t) => t * t];
		return [(v) => v, (t) => t];
	}

	const layout = $derived.by(() => {
		const padLeft = 56;
		const padRight = 26;
		const padTop = 26;
		const padBottom = 30;
		const plotWidth = Math.max(width - padLeft - padRight, 1);
		const plotHeight = Math.max(height - padTop - padBottom, 1);

		const [tx, untx] = axisTransform(xMetric.scale);
		const [ty, unty] = axisTransform(yMetric.scale);
		const xValues = rows.map((r) => tx(r.x));
		const xLo = Math.min(...xValues);
		const xHi = Math.max(...xValues) * 1.03;
		const xSpan = xHi - xLo || 1;

		const yValues = rows.map((r) => ty(r.y));
		const yLo = yMetric.format === 'pct' ? 0 : Math.min(...yValues) * 0.92;
		const yHi = Math.max(...yValues) * 1.08;
		const ySpan = yHi - yLo || 1;

		const maxPopulation = Math.max(...rows.map((r) => r.population));
		const sizeCap = width < 640 ? 18 : 26;

		const toX = (v) => padLeft + ((tx(v) - xLo) / xSpan) * plotWidth;
		const toY = (v) => padTop + plotHeight - ((ty(v) - yLo) / ySpan) * plotHeight;

		const dots = rows.map((row) => ({
			...row,
			cx: toX(row.x),
			cy: toY(row.y),
			radius: 8 + Math.sqrt(row.population / maxPopulation) * sizeCap
		}));

		const gridLines = [];
		for (let i = 0; i <= 5; i++) {
			const value = unty(yLo + (i / 5) * ySpan);
			gridLines.push({ y: toY(value), label: format(value, yMetric.format) });
		}

		const xTicks = [];
		for (let i = 0; i <= 4; i++) {
			const fraction = i / 4;
			const value = untx(xLo + fraction * xSpan);
			xTicks.push({ x: padLeft + fraction * plotWidth, label: format(value, xMetric.format) });
		}

		return { dots, gridLines, xTicks, padLeft, padTop, padBottom, plotHeight };
	});

	const hoveredDot = $derived(layout.dots.find((d) => d.key === hovered) ?? null);

	const r = $derived(
		correlation(
			rows.map((d) => d.x),
			rows.map((d) => d.y)
		)
	);

	function toggleCity(cityKey) {
		selectedCity = selectedCity === cityKey ? null : cityKey;
	}

	function shorten(name) {
		return name.length > 9 ? name.slice(0, 8) + '…' : name;
	}
</script>

<div class="reading">
	<span class="reading-strength">{correlationLabel(r)}</span>
	<span class="reading-detail">
		{#if r == null}
			across the fifteen cores
		{:else}
			r = {r.toFixed(2)} across the fifteen cores
		{/if}
	</span>
</div>

<div class="scatter-frame">
	<div class="y-title">{yMetric.label} →</div>
	<div class="plot-column">
		<div class="plot" bind:clientWidth={width} style:height="{height}px">
			<div
				class="plot-frame"
				style:left="{layout.padLeft}px"
				style:top="{layout.padTop}px"
				style:height="{layout.plotHeight}px"
			></div>

			{#each layout.gridLines as line (line.label + line.y)}
				<div class="grid-line" style:top="{line.y}px" style:left="{layout.padLeft}px"></div>
				<div class="grid-label" style:top="{line.y}px" style:left="{layout.padLeft - 8}px">
					{line.label}
				</div>
			{/each}

			{#each layout.xTicks as tick (tick.label + tick.x)}
				<div class="x-tick" style:left="{tick.x}px" style:top="{height - layout.padBottom + 8}px">
					{tick.label}
				</div>
			{/each}

			{#each layout.dots as dot (dot.key)}
				{@const dimmed = selectedCity && dot.key !== selectedCity}
				<button
					type="button"
					class="bubble"
					aria-label="{dot.name}: {xMetric.label} {format(
						dot.x,
						xMetric.format
					)}, {yMetric.label} {format(dot.y, yMetric.format)}"
					style:left="{dot.cx}px"
					style:top="{dot.cy}px"
					style:width="{dot.radius}px"
					style:height="{dot.radius}px"
					style:background={dot.color}
					style:opacity={dimmed ? 0.16 : 0.82}
					onclick={() => toggleCity(dot.key)}
					onmouseenter={() => (hovered = dot.key)}
					onmouseleave={() => (hovered = null)}
					onfocus={() => (hovered = dot.key)}
					onblur={() => (hovered = null)}
				></button>
				<div
					class="bubble-label"
					style:left="{dot.cx}px"
					style:top="{dot.cy + dot.radius / 2 + 8}px"
					style:opacity={dimmed ? 0.16 : 1}
				>
					{shorten(dot.name)}
				</div>
			{/each}

			{#if hoveredDot}
				<div class="tooltip" style:left="{hoveredDot.cx}px" style:top="{hoveredDot.cy}px">
					<div class="tooltip-name">{hoveredDot.name}</div>
					<div class="tooltip-value">
						{xMetric.label}: {format(hoveredDot.x, xMetric.format)} · {yMetric.label}:
						{format(hoveredDot.y, yMetric.format)}
					</div>
				</div>
			{/if}
		</div>
		<div class="x-title">{xMetric.label} →</div>
	</div>
</div>

<style>
	.reading {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		flex-wrap: wrap;
		margin-bottom: 1.25rem;
	}

	.reading-strength {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--brandDarkGreen);
	}

	.reading-detail {
		font-size: 0.8rem;
		color: var(--core-text-muted);
		font-variant-numeric: tabular-nums;
	}

	.scatter-frame {
		display: grid;
		grid-template-columns: 2.25rem 1fr;
		gap: 0.625rem;
	}

	.y-title,
	.x-title {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--core-text-muted);
	}

	.y-title {
		writing-mode: vertical-rl;
		transform: rotate(180deg);
		text-align: center;
	}

	.x-title {
		text-align: center;
		margin-top: 0.5rem;
	}

	.plot {
		position: relative;
		width: 100%;
	}

	.plot-frame {
		position: absolute;
		right: 0;
		border-left: 1px solid var(--core-line);
		border-bottom: 1px solid var(--core-line);
		pointer-events: none;
	}

	.grid-line {
		position: absolute;
		right: 0;
		height: 1px;
		background: var(--core-grid);
	}

	.grid-label {
		position: absolute;
		transform: translate(-100%, -50%);
		font-size: 0.65rem;
		color: var(--core-text-faint);
	}

	.x-tick {
		position: absolute;
		transform: translateX(-50%);
		font-size: 0.65rem;
		color: var(--core-text-faint);
	}

	.bubble {
		position: absolute;
		padding: 0;
		border-radius: 50%;
		border: 2px solid rgba(255, 255, 255, 0.35);
		transform: translate(-50%, -50%);
		cursor: pointer;
		transition: 0.2s;
	}

	.bubble:hover,
	.bubble:focus-visible {
		border-color: #fff;
		outline: none;
		z-index: 30;
	}

	.bubble-label {
		position: absolute;
		transform: translateX(-50%);
		font-size: 0.65rem;
		font-weight: 600;
		color: var(--core-text-soft);
		white-space: nowrap;
		pointer-events: none;
		transition: opacity 0.3s;
	}

	.tooltip {
		position: absolute;
		transform: translate(-50%, -135%);
		background: #fff;
		color: var(--brandDarkBlue);
		padding: 0.5rem 0.75rem;
		border-radius: 0.5rem;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
		pointer-events: none;
		z-index: 40;
		white-space: nowrap;
	}

	.tooltip-name {
		font-weight: 700;
		font-size: 0.8rem;
	}

	.tooltip-value {
		font-size: 0.72rem;
		color: var(--brandBlue);
		font-weight: 600;
	}

	/* Too little room for city labels on a phone — tapping a bubble still names it. */
	@media (max-width: 639px) {
		.bubble-label {
			display: none;
		}
	}
</style>
