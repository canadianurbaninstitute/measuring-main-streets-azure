<script lang="ts">
	/**
	 * Render an SVG graphic visualizing development potential
	 * using simple isometric block clusters and a top progress bar.
	 */
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	export let score = 0; // expected 0 to 10
	export let maxScore = 10;

	// Use a tweened store for smooth height/score animations
	const animatedScore = tweened(score, {
		duration: 600,
		easing: cubicOut
	});

	// Reactively update the tweened store when the score prop changes
	$: animatedScore.set(score);

	// Pre-calculated polygon points for isometric blocks of varying heights
	const baseIsoPoints = {
		top: '0,-10 20,-20 40,-10 20,0',
		left: '0,-10 20,0 20,30 0,20',
		right: '20,0 40,-10 40,20 20,30'
	};

	// Determine color and general height based on the raw score
	// (we can use the raw score for color to switch immediately, or use animated for fading colors)
	$: normalizedTargetScore = Math.max(0, Math.min(1, score / maxScore));

	$: isHighPotential = normalizedTargetScore > 0.6;
	$: isMediumPotential = normalizedTargetScore > 0.3 && normalizedTargetScore <= 0.6;
	$: isLowPotential = normalizedTargetScore <= 0.3;

	// Determine height based on animated score
	$: normalizedAnimatedScore = Math.max(0, Math.min(1, $animatedScore / maxScore));

	$: topColor = isHighPotential ? '#ff4d4d' : isMediumPotential ? '#ffb347' : '#a8d6b0';
	$: leftColor = isHighPotential ? '#cc0000' : isMediumPotential ? '#e68a00' : '#7bb385';
	$: rightColor = isHighPotential ? '#990000' : isMediumPotential ? '#b36b00' : '#51855a';

	// We'll just define 3-4 clusters of buildings
	// h is relative height multiplier
	const getBuildingPoints = (x, y, h, currentAnimatedScore) => {
		// Calculate dynamic height based on the animated score
		const isHigh = currentAnimatedScore > 0.6;
		const isMed = currentAnimatedScore > 0.3 && currentAnimatedScore <= 0.6;

		// Map the continuous animated score to a fluid height
		// Base height + scaling factor based on score
		const targetHeightBase = isHigh ? 30 : isMed ? 20 : 10;
		// Blend height fluidly by treating currentAnimatedScore as a multiplier from 10 to 30
		const animatedHeight = 10 + 25 * currentAnimatedScore;

		const height = h * animatedHeight;

		return {
			top: `${x},${y - height - 10} ${x + 20},${y - height - 20} ${x + 40},${y - height - 10} ${x + 20},${y - height}`,
			left: `${x},${y - height - 10} ${x + 20},${y - height} ${x + 20},${y + 30} ${x},${y + 20}`,
			right: `${x + 20},${y - height} ${x + 40},${y - height - 10} ${x + 40},${y + 20} ${x + 20},${y + 30}`
		};
	};

	// Generate some fixed buildings to resemble the mock
	$: buildings = [
		getBuildingPoints(80, 80, 2, normalizedAnimatedScore),
		getBuildingPoints(50, 60, 1.5, normalizedAnimatedScore),
		getBuildingPoints(110, 60, 1.8, normalizedAnimatedScore),
		getBuildingPoints(60, 100, 1.2, normalizedAnimatedScore),
		getBuildingPoints(100, 90, 1.4, normalizedAnimatedScore)
	];
</script>

<div class="flex flex-col items-center w-full max-w-sm mt-4">
	<!-- Top Bar -->
	<div class="w-full h-4 bg-gray-200 flex mb-2 relative">
		<!-- Progress indicator -->
		<div
			class="h-full bg-[#006A8E] transition-all duration-500"
			style="width: {normalizedAnimatedScore * 100}%"
		></div>

		<!-- Overlay grid lines matching mockup -->
		<div class="absolute inset-0 flex">
			<div class="flex-1 border-r-2 border-white"></div>
			<div class="flex-1 border-r-2 border-white"></div>
			<div class="flex-1 border-r-2 border-white"></div>
			<div class="flex-1 border-r-2 border-white"></div>
			<div class="flex-1"></div>
		</div>
	</div>

	<!-- Label -->
	<div class="w-full flex justify-between text-xs text-gray-600 mb-6 italic">
		<span>Low</span>
		<span>High</span>
	</div>

	<!-- SVG Isometric Graphic -->
	<svg viewBox="0 0 200 150" class="w-full h-auto drop-shadow-xl" opacity={0.9}>
		<!-- Base ground grid -->
		<polygon
			points="100,10 190,55 100,100 10,55"
			fill="#f0fdf4"
			stroke="#d1d5db"
			stroke-width="1"
		/>

		<!-- Some green trees (spheres/circles mapped to iso) -->
		{#if isLowPotential}
			<ellipse cx="40" cy="50" rx="8" ry="4" fill="#6ee7b7" />
			<ellipse cx="60" cy="40" rx="6" ry="3" fill="#6ee7b7" />
			<ellipse cx="140" cy="60" rx="8" ry="4" fill="#6ee7b7" />
			<ellipse cx="160" cy="50" rx="6" ry="3" fill="#6ee7b7" />
		{/if}

		<!-- Buildings -->
		{#each buildings as b}
			<polygon points={b.left} fill={leftColor} style="transition: fill 0.4s ease;" />
			<polygon points={b.right} fill={rightColor} style="transition: fill 0.4s ease;" />
			<polygon points={b.top} fill={topColor} style="transition: fill 0.4s ease;" />
		{/each}

		<!-- Size labels -->
		<polyline
			points="20,65 10,60 90,110 100,105"
			fill="none"
			stroke="#9ca3af"
			stroke-width="1"
			stroke-dasharray="2,2"
		/>
		<text x="30" y="95" font-size="8" fill="#6b7280" transform="rotate(30 30,95)">150 m</text>

		<polyline
			points="180,65 190,60 110,110 100,105"
			fill="none"
			stroke="#9ca3af"
			stroke-width="1"
			stroke-dasharray="2,2"
		/>
		<text x="140" y="85" font-size="8" fill="#6b7280" transform="rotate(-30 140,85)">150 m</text>
	</svg>
</div>

<style>
	/* Any additional styles */
</style>
