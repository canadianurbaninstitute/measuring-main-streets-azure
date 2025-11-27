<script lang="ts">
	import Icon from '@iconify/svelte';
	import { interpolateNumber } from 'd3-interpolate';
	import { onDestroy } from 'svelte';

	// Public props (keeps your original API)
	export let label = '';
	export let value = 0; // Accepts 0-100 or 0-1
	export let icon = '';
	export let iconcolor = '#002940';
	export let prefix = '';
	export let suffix = '';
	export let accordion = false;
	export let active = false;
	export let disabled = false;

	// Visual props
	export let size = 72; // SVG size (px)
	export let thickness = 10; // stroke width
	export let bgColor = '#d4d4d4';
	export let fillColor = ''; // will randomize if not specific
	export let duration = 600; // animation duration (ms)

	const brandColors = [
		'#002940', // brandDarkBlue
		'#2a5cac', // brandAltBlue
		'#00adf2', // brandLightBlue
		'#43b171', // brandDarkGreen
		'#58e965', // brandGreen
		'#db3069', // brandPink
		'#f13737', // brandRed
		'#f1c500', // brandYellow
		'#f45d01', // brandOrange
		'#8a4285' // brandPurple
	];

	if (fillColor === '') {
		fillColor = brandColors[Math.floor(Math.random() * brandColors.length)];
	}

	let fraction = 0; // 0..1 for drawing the circle
	let displayed: number | string = 0; // 1..100 shown to user (string "<1" allowed)
	let rafId = 0;

	const radius = (size - thickness) / 2;
	const circumference = 2 * Math.PI * radius;
	const center = size / 2;

	function animateTo(newValue: number) {
		cancelAnimationFrame(rafId);
		const start = performance.now();
		const fromF = fraction;
		const toF = newValue / 100; // convert 1–100 to 0–1 for SVG
		const fromN = typeof displayed === 'number' ? displayed : 0;
		const toN = newValue; // keep 1–100 for display
		const interpF = interpolateNumber(fromF, toF);
		const interpN = interpolateNumber(fromN, toN);

		function tick(now: number) {
			const t = Math.min(1, (now - start) / duration);
			const ease = 1 - Math.pow(1 - t, 2); // easing
			fraction = interpF(ease);
			const rawValue = interpN(ease);
			displayed = Math.round(rawValue * 10) / 10;
			if (t < 1) rafId = requestAnimationFrame(tick);
		}

		rafId = requestAnimationFrame(tick);
	}

	$: animateTo(value);

	onDestroy(() => cancelAnimationFrame(rafId));
</script>

<button {disabled} class="metric donut-metric" aria-label={label} class:active on:click>
	<div class="chart" style="width:{size}px; height:{size}px">
		<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
			<!-- background ring -->
			<circle
				cx={center}
				cy={center}
				r={radius}
				fill="none"
				stroke={bgColor}
				stroke-width={thickness}
			/>

			<!-- foreground (donut) -->
			<circle
				cx={center}
				cy={center}
				r={radius}
				fill="none"
				stroke={fillColor}
				stroke-width={thickness}
				stroke-linecap="round"
				transform={`rotate(-90 ${center} ${center})`}
				stroke-dasharray={`${(fraction * circumference).toFixed(3)} ${circumference.toFixed(3)}`}
				style="transition: stroke-dasharray 0.2s linear;"
			/>

			<!-- center label -->
			<g class="center-text">
				<foreignObject x="0" y="0" width={size} height={size}>
					<div class="center-contents" xmlns="http://www.w3.org/1999/xhtml">
						{#if icon}
							<div class="icon"><Icon {icon} color={iconcolor} /></div>
						{/if}
						<div class="number">
							<!-- If displayed is 0 but value is greater than 0, show <1 -->
							{prefix}{displayed === 0 && value > 0 ? '<1' : displayed}{suffix}
						</div>
					</div>
				</foreignObject>
			</g>
		</svg>
	</div>

	<div class="text">
		<div class="label">{label}</div>
		{#if accordion}
			<Icon icon="mdi:unfold-more-horizontal" />
		{/if}
	</div>
</button>

<style>
	.donut-metric {
		display: flex;
		margin: 0.15em 0 0.15em 0;
		flex-direction: column;
		gap: 0.5rem;
		align-items: center;
		padding: 0.35em;
		border: 1px solid #ddd;
		border-radius: 0.5em;
		box-sizing: border-box;
		width: 100%;
	}

	.active {
		background-color: var(--color-pink-50);
		outline: 3px solid var(--color-pink-400);
		box-sizing: border-box;
		outline-offset: -3px;
	}

	.metric:disabled {
		cursor: not-allowed;
	}

	.chart {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 0 0 auto;
		border: none;
	}

	.center-contents {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		font-family: inherit;
	}

	.center-contents .icon {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 2px;
	}

	.center-contents .number {
		font-size: 0.95em;
		font-weight: 600;
		line-height: 1;
	}

	.text {
		display: flex;
		flex-direction: column;
	}

	.label {
		font-size: 0.85em;
	}

	/* Ensure the svg center foreignObject contents don't overflow */
	svg {
		overflow: visible;
	}
</style>
