<!-- Plots every downtown core (filled) and every region (hollow) independently
     along one value axis, so clusters and outliers read at a glance. Shared by
     the "spread" and "workforce" modules of the Core Report explorer. -->

<script>
	import { format, packSwarm } from '../coreMetrics.js';

	/**
	 * Props:
	 *   cities        - rows from coreData
	 *   value         - (profile) => number, reads the measure being plotted
	 *   valueFormat   - format key passed to format()
	 *   unit          - suffix appended in the tooltip
	 *   scale         - 'lin' | 'sqrt' | 'log'
	 *   zeroFloor     - anchor the axis at zero (used for percentage shares)
	 *   domain        - fixed [min, max] for the axis, so animated frames share one axis
	 *   compare       - optional (profile) => number for a comparison year; hovering or
	 *                   following a city then traces each dot back to where it was
	 *   compareLabel  - names the comparison (e.g. "2001")
	 *   stamp         - large label behind the swarm (e.g. the census year on show)
	 *   duration      - milliseconds for dots to glide to new positions
	 *   selectedCity  - bindable city key; clicking a dot isolates that city
	 */
	let {
		cities = [],
		value,
		valueFormat = 'pct',
		unit = '',
		scale = 'lin',
		zeroFloor = false,
		domain = null,
		compare = null,
		compareLabel = '',
		stamp = '',
		duration = 600,
		selectedCity = $bindable(null)
	} = $props();

	let width = $state(1080);
	let hovered = $state(null);

	const height = $derived(width < 640 ? 300 : 340);
	const swarm = $derived(
		width > 0
			? packSwarm({ cities, value, width, height, scale, zeroFloor, domain, compare })
			: null
	);
	const hoveredDot = $derived(swarm?.dots.find((d) => d.key === hovered) ?? null);

	// Dots traced back to the comparison year: the hovered one plus both dots of
	// a followed city. Showing every trail at once would bury the swarm.
	const trails = $derived(
		compare && swarm
			? swarm.dots.filter(
					(d) => d.compareX != null && (d.key === hovered || d.cityKey === selectedCity)
				)
			: []
	);

	function toggleCity(cityKey) {
		selectedCity = selectedCity === cityKey ? null : cityKey;
	}
</script>

<div class="swarm" bind:clientWidth={width} style:height="{height}px" style:--move="{duration}ms">
	{#if stamp}
		<div class="stamp" aria-live="polite">{stamp}</div>
	{/if}

	{#if swarm}
		<div class="axis"></div>

		{#if swarm.compareAverageX != null}
			<div class="average is-compare" style:left="{swarm.compareAverageX}px"></div>
		{/if}

		{#if swarm.averageX != null}
			<div class="average" style:left="{swarm.averageX}px"></div>
			<div class="average-label" style:left="{swarm.averageX}px">
				core average · {format(swarm.average, valueFormat)}
				{#if swarm.compareAverage != null}
					<span class="average-compare">
						({compareLabel}: {format(swarm.compareAverage, valueFormat)})
					</span>
				{/if}
			</div>
		{/if}

		{#each swarm.ticks as tick (tick.x)}
			<div class="tick" style:left="{tick.x}px">{format(tick.value, valueFormat)}</div>
		{/each}

		{#each trails as trail (trail.key)}
			<div
				class="trail"
				style:left="{Math.min(trail.compareX, trail.x)}px"
				style:top="{trail.y}px"
				style:width="{Math.abs(trail.x - trail.compareX)}px"
				style:border-color={trail.color}
			></div>
			<div
				class="ghost"
				style:left="{trail.compareX}px"
				style:top="{trail.y}px"
				style:border-color={trail.color}
			></div>
		{/each}

		{#each swarm.dots as dot (dot.key)}
			{@const active = dot.key === hovered}
			{@const core = dot.kind === 'core'}
			{@const size = active ? dot.radius * 2 + 6 : dot.radius * 2 + (core ? 2 : -2)}
			<button
				type="button"
				class="dot"
				class:is-core={core}
				aria-label="{dot.name} {core ? 'core' : 'region'}: {format(dot.value, valueFormat)}{unit}"
				style:left="{dot.x}px"
				style:top="{dot.y}px"
				style:width="{size}px"
				style:height="{size}px"
				style:background={core ? dot.color : 'var(--core-surface)'}
				style:border-color={core ? 'rgba(255, 255, 255, 0.55)' : dot.color}
				style:opacity={selectedCity && dot.cityKey !== selectedCity ? 0.16 : 1}
				onclick={() => toggleCity(dot.cityKey)}
				onmouseenter={() => (hovered = dot.key)}
				onmouseleave={() => (hovered = null)}
				onfocus={() => (hovered = dot.key)}
				onblur={() => (hovered = null)}
			></button>
		{/each}

		{#if hoveredDot}
			<div class="tooltip" style:left="{hoveredDot.x}px" style:top="{hoveredDot.y - 20}px">
				<div class="tooltip-name">{hoveredDot.name}</div>
				<div class="tooltip-value">
					{hoveredDot.kind === 'core' ? 'Core' : 'Region'} · {format(
						hoveredDot.value,
						valueFormat
					)}{unit}
				</div>
				{#if compare && hoveredDot.compareValue != null}
					<div class="tooltip-compare">
						{compareLabel} · {format(hoveredDot.compareValue, valueFormat)}{unit}
					</div>
				{/if}
			</div>
		{/if}
	{/if}
</div>

<style>
	.swarm {
		position: relative;
		width: 100%;
	}

	.stamp {
		position: absolute;
		top: 0;
		left: 0;
		font-family: Gelasio, serif;
		font-weight: 600;
		font-size: clamp(2.5rem, 7vw, 4.5rem);
		line-height: 1;
		color: rgba(255, 255, 255, 0.09);
		pointer-events: none;
		user-select: none;
	}

	.axis {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 38px;
		height: 1px;
		background: var(--core-line);
	}

	.average {
		position: absolute;
		top: 8px;
		bottom: 38px;
		width: 0;
		border-left: 2px dashed var(--brandYellow);
		transition: left var(--move, 0.8s) cubic-bezier(0.4, 1.2, 0.4, 1);
	}

	.average.is-compare {
		border-left: 2px dotted rgba(241, 197, 0, 0.35);
	}

	.average-label {
		position: absolute;
		bottom: 12px;
		transform: translateX(-50%);
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--brandYellow);
		white-space: nowrap;
		transition: left var(--move, 0.8s) cubic-bezier(0.4, 1.2, 0.4, 1);
	}

	.average-compare {
		font-weight: 600;
		opacity: 0.6;
	}

	.tick {
		position: absolute;
		bottom: 38px;
		transform: translateX(-50%);
		font-size: 0.7rem;
		color: var(--core-text-faint);
	}

	.trail {
		position: absolute;
		height: 0;
		border-top: 2px dotted;
		opacity: 0.7;
		pointer-events: none;
		z-index: 5;
	}

	.ghost {
		position: absolute;
		width: 10px;
		height: 10px;
		border: 2px dashed;
		border-radius: 50%;
		transform: translate(-50%, -50%);
		opacity: 0.8;
		pointer-events: none;
		z-index: 5;
	}

	.dot {
		position: absolute;
		padding: 0;
		border-radius: 50%;
		border-style: solid;
		border-width: 2px;
		transform: translate(-50%, -50%);
		cursor: pointer;
		transition:
			width 0.2s,
			height 0.2s,
			left var(--move, 0.6s) cubic-bezier(0.4, 1.2, 0.4, 1),
			top var(--move, 0.6s) cubic-bezier(0.4, 1.2, 0.4, 1),
			opacity 0.3s;
	}

	.dot.is-core {
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
	}

	.dot:hover,
	.dot:focus-visible {
		border-color: #fff;
		outline: none;
		z-index: 30;
	}

	.tooltip {
		position: absolute;
		transform: translate(-50%, -100%);
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
		font-size: 0.75rem;
		color: var(--brandBlue);
		font-weight: 600;
	}

	.tooltip-compare {
		font-size: 0.7rem;
		color: #5f8296;
		font-weight: 600;
	}

	@media (prefers-reduced-motion: reduce) {
		.dot,
		.average,
		.average-label {
			transition: none;
		}
	}
</style>
