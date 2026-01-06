<script>
	import Icon from '@iconify/svelte';
	import * as d3 from 'd3';
	import { onMount } from 'svelte';

	export let label = '';
	export let value = 0; // 0–100
	export let maxValue = 100;
	export let icon = '';
	export let iconcolor = '#002a41';
	export let prefix = '';
	export let suffix = '';
	export let size = 180;
	export let thickness = 14;
	export let fillColor = '';
	export let duration = 1000;
	export let segmentColors = ['#58e965', '#eab308', '#f13737']; //note reverse order
	export let pointerColor = '#002940';

	let displayed = 0;
	let gaugeId = `gauge-${Math.random().toString(36).substr(2, 9)}`;

	$: fraction = value / maxValue;

	onMount(() => {
		if (!fillColor) fillColor = pointerColor;

		const radius = size / 2 - thickness / 2;
		const center = { x: size / 2, y: size / 2 };

		const svg = d3
			.select(`#${gaugeId}`)
			.attr('width', size)
			.attr('height', size / 2)
			.attr('viewBox', `0 0 ${size} ${size / 2 + 5}`) //leave extra room so arrow doesn't run out of room
			.append('g')
			.attr('transform', `translate(${center.x},${center.y})`);

		const startAngle = Math.PI / 2; // left
		const endAngle = -Math.PI / 2; // right

		// Background semicircle
		// svg
		// 	.append('path')
		// 	.datum({ startAngle, endAngle })
		// 	.attr(
		// 		'd',
		// 		d3.arc().innerRadius(radius).outerRadius(radius).startAngle(startAngle).endAngle(endAngle)()
		// 	)
		// 	.attr('fill', 'none')
		// 	.attr('stroke', bgColor)
		// 	.attr('stroke-width', thickness)
		// 	.attr('stroke-linecap', 'round');

		// Multi-colored background segments (red, yellow, green)
		const segmentCount = segmentColors.length; // e.g., 3
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

		// Foreground arc (animated)
		// const fg = svg
		// 	.append('path')
		// 	.attr('fill', 'none')
		// 	.attr('stroke', fillColor)
		// 	.attr('stroke-width', thickness)
		// 	.attr('stroke-linecap', 'round');

		// const targetAngle = startAngle + (endAngle - startAngle) * fraction;

		// fg.transition()
		// 	.duration(duration)
		// 	.attrTween('d', () => {
		// 		const interpAngle = d3.interpolate(startAngle, targetAngle);
		// 		return (t) => {
		// 			return d3
		// 				.arc()
		// 				.innerRadius(radius)
		// 				.outerRadius(radius)
		// 				.startAngle(startAngle)
		// 				.endAngle(interpAngle(t))();
		// 		};
		// 	});

		// Needle
		const needleOffset = 0; // Gap in the middle for text
		const needleLength = radius + 5;
		const needleWidth = 10; // Width at the base of the triangle

		// Create a triangular needle path with a gap in the middle
		const needlePath = svg
			.append('path')
			.attr(
				'd',
				`
	M ${-needleWidth / 2},${needleOffset}
	L 0,${needleOffset - needleLength}
	L ${needleWidth / 2},${needleOffset}
	Z
`
			)
			.attr('fill', fillColor)
			.attr('transform', `rotate(${-180})`);

		// Animate needle
		const needleStartDeg = -90; // bottom
		const needleEndDeg = 90; // top
		const needleTargetDeg = needleStartDeg + fraction * (needleEndDeg - needleStartDeg);

		needlePath
			.transition()
			.duration(duration)
			.attrTween('transform', () => {
				const needleInterp = d3.interpolate(needleStartDeg, needleTargetDeg);
				return (t) => `rotate(${needleInterp(t)})`;
			});

		displayed = value;
	});
</script>

<div class="gauge-metric" style="position: relative; width:{size}px; height:{size / 2 + 30}px;">
	<svg id={gaugeId}></svg>
	<div
		class="center-contents"
		style="position: absolute; top:0; left:0; width:100%; height:{size /
			2}px; display:flex; flex-direction: column; align-items:center; justify-content:center; pointer-events:none;"
	>
		{#if icon}
			<div class="icon"><Icon {icon} color={iconcolor} /></div>
		{/if}
		<div class="number">{prefix}{displayed}{suffix}</div>
	</div>
	<div class="label">{label}</div>
</div>

<style>
	.gauge-metric {
		margin: 0.15em 0 0.15em 0;
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
</style>
