<script lang="ts">
	import Icon from '@iconify/svelte';
	import * as d3 from 'd3';
	import { onMount } from 'svelte';

	// Props
	export let label = '';
	export let value = 0; // current value (0–maxValue)
	export let maxValue = 100;
	export let icon = '';
	export let iconcolor = '#002a41';
	export let prefix = '';
	export let suffix = '';
	export let size = 180;
	export let thickness = 14;
	export let fillColor = '#002940';
	export let duration = 1000;
	export let segmentColors = ['#58e965', '#eab308', '#f13737']; // reversed order
	export let pointerColor = '#002940';
	export let showValue = true;
	export let title = '';

	let displayed = 0;
	let gaugeId = `gauge-${Math.random().toString(36).substr(2, 9)}`;

	const startAngle = Math.PI / 2; // left
	const endAngle = -Math.PI / 2; // right

	const radius = size / 2 - thickness / 2 - 10;
	const needleWidth = 10; // base width of needle

	let svg: d3.Selection<SVGGElement, unknown, null, undefined>;
	let needle: d3.Selection<SVGPathElement, unknown, null, undefined>;

	// Initialize SVG once on mount
	onMount(() => {
		const center = { x: size / 2, y: size / 2 };
		const svgEl = d3
			.select(`#${gaugeId}`)
			.attr('width', size)
			.attr('height', size / 2 + 5)
			.attr('viewBox', `0 0 ${size} ${size / 2 + 5}`);

		svg = svgEl.append('g').attr('transform', `translate(${center.x},${center.y})`);

		// Draw segments
		const segmentCount = segmentColors.length;
		const anglePerSegment = (endAngle - startAngle) / segmentCount;

		segmentColors.forEach((color, i) => {
			const segStart = startAngle + i * anglePerSegment;
			const segEnd = startAngle + (i + 1) * anglePerSegment;
			svg
				.append('path')
				.attr(
					'd',
					d3
						.arc()
						.innerRadius(radius - thickness / 2)
						.outerRadius(radius + thickness / 2)
						.startAngle(segStart)
						.endAngle(segEnd)
				)
				.attr('fill', color);
		});

		// Draw needle path (initially at -90deg)
		needle = svg
			.append('path')
			.attr('d', `M ${-needleWidth / 2},0 L 0,${-radius - 5} L ${needleWidth / 2},0 Z`)
			.attr('fill', fillColor)
			.attr('transform', 'rotate(-90)');
	});

	// Reactive: animate needle whenever `value` changes
	$: if (needle) {
		const fraction = Math.min(Math.max(value / maxValue, 0), 1);
		const targetDeg = -90 + fraction * 180;

		needle
			.transition()
			.duration(duration)
			.attrTween('transform', () => {
				const current = needle.attr('transform').match(/-?\d+(\.\d+)?/)?.[0] ?? '-90';
				const interp = d3.interpolate(Number(current), targetDeg);
				return (t) => `rotate(${interp(t)})`;
			});

		displayed = value;
	}
</script>

<div class="gauge-metric" style="position: relative; width:{size}px; height:auto;">
	{#if title}
		<h6 class="chart-title">{title}</h6>
	{/if}
	<svg id={gaugeId}></svg>
	<div
		class="center-contents"
		style="position: absolute; top:0; left:0; width:100%; height:{size / 2 +
			30}px; display:flex; flex-direction: column; align-items:center; justify-content:center; pointer-events:none;"
	>
		{#if icon}
			<div class="icon"><Icon {icon} color={iconcolor} /></div>
		{/if}
		{#if showValue}
			<div class="number">{prefix}{displayed}{suffix}</div>
		{/if}
	</div>
	<div class="label">{label}</div>
</div>

<style>
	.gauge-metric {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: center;
		padding: 0.35em;
		border: 1px solid #ddd;
		border-radius: 0.5em;
		box-sizing: border-box;
		width: 100%;
		flex-grow: 1;
	}

	.number {
		font-weight: 600;
		font-size: 1.2rem;
	}

	.label {
		font-size: 0.85rem;
		text-align: center;
	}

	.chart-title {
		font-size: 1em;
		margin-bottom: 10px;
		color: var(--color-blue-900);
		font-weight: 700;
		text-align: center;
		width: 100%;
	}
</style>
