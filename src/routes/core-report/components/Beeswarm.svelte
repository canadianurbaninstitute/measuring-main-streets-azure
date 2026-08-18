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
	 *   scale         - 'lin' | 'sqrt'
	 *   zeroFloor     - anchor the axis at zero (used for percentage shares)
	 *   selectedCity  - bindable city key; clicking a dot isolates that city
	 */
	let {
		cities = [],
		value,
		valueFormat = 'pct',
		unit = '',
		scale = 'lin',
		zeroFloor = false,
		selectedCity = $bindable(null)
	} = $props();

	let width = $state(1080);
	let hovered = $state(null);

	const height = $derived(width < 640 ? 300 : 340);
	const swarm = $derived(
		width > 0 ? packSwarm({ cities, value, width, height, scale, zeroFloor }) : null
	);
	const hoveredDot = $derived(swarm?.dots.find((d) => d.key === hovered) ?? null);

	function toggleCity(cityKey) {
		selectedCity = selectedCity === cityKey ? null : cityKey;
	}
</script>

<div class="swarm" bind:clientWidth={width} style:height="{height}px">
	{#if swarm}
		<div class="axis"></div>

		<div class="average" style:left="{swarm.averageX}px"></div>
		<div class="average-label" style:left="{swarm.averageX}px">
			core average · {format(swarm.average, valueFormat)}
		</div>

		{#each swarm.ticks as tick (tick.x)}
			<div class="tick" style:left="{tick.x}px">{format(tick.value, valueFormat)}</div>
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
			</div>
		{/if}
	{/if}
</div>

<style>
	.swarm {
		position: relative;
		width: 100%;
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
		transition: left 0.8s cubic-bezier(0.4, 1.2, 0.4, 1);
	}

	.average-label {
		position: absolute;
		bottom: 12px;
		transform: translateX(-50%);
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--brandYellow);
		white-space: nowrap;
		transition: left 0.8s cubic-bezier(0.4, 1.2, 0.4, 1);
	}

	.tick {
		position: absolute;
		bottom: 38px;
		transform: translateX(-50%);
		font-size: 0.7rem;
		color: var(--core-text-faint);
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
			left 0.6s cubic-bezier(0.4, 1.2, 0.4, 1),
			top 0.6s cubic-bezier(0.4, 1.2, 0.4, 1),
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
</style>
