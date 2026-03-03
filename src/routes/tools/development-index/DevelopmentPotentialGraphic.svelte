<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	let { score = 0, maxScore = 10 }: { score?: number; maxScore?: number } = $props();

	const animatedScore = tweened(score, { duration: 600, easing: cubicOut });

	$effect(() => {
		animatedScore.set(score);
	});

	const normalizedTargetScore = $derived(Math.max(0, Math.min(1, score / maxScore)));
	const normalizedAnimatedScore = $derived(Math.max(0, Math.min(1, $animatedScore / maxScore)));

	const isHighPotential = $derived(normalizedTargetScore > 0.6);
	const isMediumPotential = $derived(normalizedTargetScore > 0.3 && normalizedTargetScore <= 0.6);
	const isLowPotential = $derived(normalizedTargetScore <= 0.3);

	const topColor = $derived(
		isHighPotential ? '#efa4bd' : isMediumPotential ? '#ffefa9' : '#b4eaff'
	);
	const leftColor = $derived(
		isHighPotential ? '#db3069' : isMediumPotential ? '#deb500' : '#00adf2'
	);
	const rightColor = $derived(
		isHighPotential ? '#721433' : isMediumPotential ? '#8e7400' : '#003f5e'
	);

	const getBuildingPoints = (x: number, y: number, h: number, s: number) => {
		// Dramatic height difference using squared power
		const height = h * (100 + 700 * Math.pow(s, 2));
		// Base width 40 (w=20 per side), depth 20 (d=10 per side)
		const w = 20;
		const d = 10;
		return {
			top: `${x},${y - height} ${x + w},${y - d - height} ${x},${y - 2 * d - height} ${x - w},${y - d - height}`,
			left: `${x},${y} ${x},${y - height} ${x - w},${y - d - height} ${x - w},${y - d}`,
			right: `${x},${y} ${x},${y - height} ${x + w},${y - d - height} ${x + w},${y - d}`
		};
	};

	const buildings = $derived([
		// Sorted back-to-front
		getBuildingPoints(80, 105, 0.12, normalizedAnimatedScore),
		getBuildingPoints(120, 110, 0.14, normalizedAnimatedScore),
		getBuildingPoints(70, 120, 0.15, normalizedAnimatedScore),
		getBuildingPoints(130, 125, 0.12, normalizedAnimatedScore),
		getBuildingPoints(105, 140, 0.1, normalizedAnimatedScore)
	]);
</script>

<div class="flex flex-col items-center w-full max-w-sm mt-4">
	<!-- Top Bar -->
	<div class="w-full h-4 bg-gray-200 flex mb-2 relative">
		<div
			class="h-full bg-[#006A8E] transition-all duration-500"
			style="width: {normalizedAnimatedScore * 100}%"
		></div>
		<div class="absolute inset-0 flex">
			<div class="flex-1 border-r-2 border-white"></div>
			<div class="flex-1 border-r-2 border-white"></div>
			<div class="flex-1 border-r-2 border-white"></div>
			<div class="flex-1 border-r-2 border-white"></div>
			<div class="flex-1"></div>
		</div>
	</div>

	<div class="w-full flex justify-between text-xs text-gray-600 mb-6 italic">
		<span>Low Potential</span>
		<span>High Potential</span>
	</div>

	<svg viewBox="0 0 200 200" class="w-full h-auto drop-shadow-xl" opacity={0.9}>
		<polygon
			points="100,60 190,105 100,150 10,105"
			fill="#cdd5d9"
			stroke="#d1d5db"
			stroke-width="1"
		/>

		{#each buildings as b}
			<polygon points={b.left} fill={leftColor} style="transition: fill 0.4s ease;" />
			<polygon points={b.right} fill={rightColor} style="transition: fill 0.4s ease;" />
			<polygon points={b.top} fill={topColor} style="transition: fill 0.4s ease;" />
		{/each}

		<!-- Ground decals aligned with bottom diamond corner (100,150) -->
		<polyline
			points="30,115 10,105 100,150 120,140"
			fill="none"
			stroke="#9ca3af"
			stroke-width="1"
			stroke-dasharray="2,2"
		/>
		<polyline
			points="170,115 190,105 100,150 80,140"
			fill="none"
			stroke="#9ca3af"
			stroke-width="1"
			stroke-dasharray="2,2"
		/>
	</svg>
</div>
