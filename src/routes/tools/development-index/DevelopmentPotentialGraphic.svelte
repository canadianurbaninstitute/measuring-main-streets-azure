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
		isHighPotential ? '#ff4d4d' : isMediumPotential ? '#ffb347' : '#a8d6b0'
	);
	const leftColor = $derived(
		isHighPotential ? '#cc0000' : isMediumPotential ? '#e68a00' : '#7bb385'
	);
	const rightColor = $derived(
		isHighPotential ? '#990000' : isMediumPotential ? '#b36b00' : '#51855a'
	);

	const getBuildingPoints = (x: number, y: number, h: number, s: number) => {
		const height = h * (10 + 25 * s);
		return {
			top: `${x},${y - height - 10} ${x + 20},${y - height - 20} ${x + 40},${y - height - 10} ${x + 20},${y - height}`,
			left: `${x},${y - height - 10} ${x + 20},${y - height} ${x + 20},${y + 30} ${x},${y + 20}`,
			right: `${x + 20},${y - height} ${x + 40},${y - height - 10} ${x + 40},${y + 20} ${x + 20},${y + 30}`
		};
	};

	const buildings = $derived([
		getBuildingPoints(80, 80, 2, normalizedAnimatedScore),
		getBuildingPoints(50, 60, 1.5, normalizedAnimatedScore),
		getBuildingPoints(110, 60, 1.8, normalizedAnimatedScore),
		getBuildingPoints(60, 100, 1.2, normalizedAnimatedScore),
		getBuildingPoints(100, 90, 1.4, normalizedAnimatedScore)
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
		<span>Low</span>
		<span>High</span>
	</div>

	<svg viewBox="0 0 200 150" class="w-full h-auto drop-shadow-xl" opacity={0.9}>
		<polygon
			points="100,10 190,55 100,100 10,55"
			fill="#f0fdf4"
			stroke="#d1d5db"
			stroke-width="1"
		/>

		{#if isLowPotential}
			<ellipse cx="40" cy="50" rx="8" ry="4" fill="#6ee7b7" />
			<ellipse cx="60" cy="40" rx="6" ry="3" fill="#6ee7b7" />
			<ellipse cx="140" cy="60" rx="8" ry="4" fill="#6ee7b7" />
			<ellipse cx="160" cy="50" rx="6" ry="3" fill="#6ee7b7" />
		{/if}

		{#each buildings as b}
			<polygon points={b.left} fill={leftColor} style="transition: fill 0.4s ease;" />
			<polygon points={b.right} fill={rightColor} style="transition: fill 0.4s ease;" />
			<polygon points={b.top} fill={topColor} style="transition: fill 0.4s ease;" />
		{/each}

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
