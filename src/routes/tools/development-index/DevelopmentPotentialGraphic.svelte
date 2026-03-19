<script lang="ts">
	import chroma from 'chroma-js';
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	let { score = 0, maxScore = 10 }: { score?: number; maxScore?: number } = $props();

	const animatedScore = tweened(score, { duration: 800, easing: cubicOut });

	$effect(() => {
		animatedScore.set(score);
	});

	const normalizedAnimatedScore = $derived(Math.max(0, Math.min(1, $animatedScore / maxScore)));

	// Isometric base block geometry
	const block = {
		top: '100,50 200,100 100,150 0,100',
		left: '0,100 100,150 100,165 0,115',
		right: '200,100 100,150 100,165 200,115'
	};

	// Beautiful color scales morphing from low-density brick -> medium concrete -> high rigid glass
	const colorL = chroma.scale(['#d97706', '#94a3b8', '#38bdf8']).domain([0, 0.4, 1]);
	const colorR = chroma.scale(['#b45309', '#64748b', '#0369a1']).domain([0, 0.4, 1]);
	const colorT = chroma.scale(['#fde68a', '#e2e8f0', '#bae6fd']).domain([0, 0.4, 1]);

	const getBuildingPoints = (
		x: number,
		y: number,
		h: number,
		scaleFactor: number,
		type: number
	) => {
		// Dramatic nonlinear scaling allows small homes to grow into towering skyscrapers
		const height = 15 + h * 600 * Math.pow(scaleFactor, 1.8);

		// Varied dimensions per building type
		const w = type === 1 ? 24 : type === 2 ? 18 : 22;
		const d = type === 1 ? 12 : type === 2 ? 9 : 11;

		const sL = colorL(scaleFactor).hex();
		const sR = colorR(scaleFactor).hex();
		const sT = colorT(scaleFactor).hex();

		// Floor window lines
		const floors = [];
		const floorHeight = 12;
		const numFloors = Math.floor(height / floorHeight);
		for (let i = 1; i < numFloors; i++) {
			const fy = y - i * floorHeight;
			floors.push({ x1: x, y1: fy, x2: x - w, y2: fy - d });
			floors.push({ x1: x, y1: fy, x2: x + w, y2: fy - d });
		}

		// Vertical window panels
		const verticals = [];
		for (let i = 1; i < 3; i++) {
			const lx = x - w * (i / 3);
			const ly = y - d * (i / 3);
			verticals.push({ x1: lx, y1: ly, x2: lx, y2: ly - height });
			const rx = x + w * (i / 3);
			const ry = y - d * (i / 3);
			verticals.push({ x1: rx, y1: ry, x2: rx, y2: ry - height });
		}

		// Shadows cast to the right mimicking authentic isometric lighting
		const sX = height * 0.45;
		const sY = height * 0.225;
		const shadow = `${x},${y} ${x + sX},${y + sY} ${x + w + sX},${y - d + sY} ${x + w},${y - d}`;

		return {
			top: `${x},${y - height} ${x + w},${y - d - height} ${x},${y - 2 * d - height} ${x - w},${y - d - height}`,
			left: `${x},${y} ${x},${y - height} ${x - w},${y - d - height} ${x - w},${y - d}`,
			right: `${x},${y} ${x},${y - height} ${x + w},${y - d - height} ${x + w},${y - d}`,
			shadow,
			floors,
			verticals,
			sL,
			sR,
			sT
		};
	};

	const buildings = $derived([
		// Sorted back-to-front based on base Y-coordinates
		getBuildingPoints(100, 75, 0.16, normalizedAnimatedScore, 1),
		getBuildingPoints(145, 95, 0.18, normalizedAnimatedScore, 3),
		getBuildingPoints(55, 100, 0.12, normalizedAnimatedScore, 2),
		getBuildingPoints(130, 125, 0.15, normalizedAnimatedScore, 1),
		getBuildingPoints(80, 130, 0.13, normalizedAnimatedScore, 2)
	]);
</script>

<div class="flex flex-col items-center w-full max-w-[400px] mt-4">
	<!-- Top Bar -->
	<div
		class="w-full h-4 bg-zinc-200 flex mb-2 relative rounded-sm overflow-hidden border border-zinc-300"
	>
		<div
			class="h-full bg-gradient-to-r from-amber-500 via-slate-400 to-sky-500 transition-all"
			style="width: {normalizedAnimatedScore * 100}%"
		></div>
		<div class="absolute inset-0 flex pointer-events-none">
			<div class="flex-1 border-r border-white/40"></div>
			<div class="flex-1 border-r border-white/40"></div>
			<div class="flex-1 border-r border-white/40"></div>
			<div class="flex-1 border-r border-white/40"></div>
			<div class="flex-1"></div>
		</div>
	</div>

	<div
		class="w-full flex justify-between text-[11px] uppercase tracking-wider font-bold text-zinc-500 mb-6"
	>
		<span>Low</span>
		<span>High</span>
	</div>

	<!-- Realistic Isometric Visualisation -->
	<svg viewBox="-10 10 220 180" class="mt-10 w-full h-auto drop-shadow-2xl overflow-visible">
		<defs>
			<clipPath id="surface-clip">
				<polygon points={block.top} />
			</clipPath>
		</defs>

		<!-- Base block drop shadow -->
		<polygon points="0,115 100,165 200,115 100,65" fill="#000" opacity="0.1" />

		<!-- 3D Ground block sides -->
		<polygon points={block.left} fill="#9ca3af" />
		<polygon points={block.right} fill="#6b7280" />
		<!-- Surface -->
		<polygon points={block.top} fill="#d1d5db" />

		<!-- Context Patches (Parks/Greenery) -->
		<polygon points="15,102.5 40,115 50,110 25,97.5" fill="#84cc16" opacity="0.6" />
		<polygon points="150,100 175,112.5 165,117.5 140,105" fill="#84cc16" opacity="0.6" />
		<polygon points="90,60 115,72.5 105,77.5 80,65" fill="#84cc16" opacity="0.6" />

		<!-- Cross Roads Overlaying Block -->
		<!-- <polygon points="90,55 110,65 50,95 30,85" fill="#6b7280" opacity="0.7" />
		<polygon points="110,55 90,65 150,95 170,85" fill="#6b7280" opacity="0.7" /> -->

		<!-- Contextual Trees (Isometric styling) -->
		<circle cx="38" cy="103" r="4.5" fill="#15803d" />
		<circle cx="28" cy="104" r="3.5" fill="#166534" />
		<circle cx="160" cy="110" r="5" fill="#15803d" />
		<circle cx="150" cy="106" r="4" fill="#166534" />
		<circle cx="100" cy="70" r="4" fill="#15803d" />

		<!-- Shadows Cast by Buildings -->
		<g opacity="0.35" clip-path="url(#surface-clip)">
			{#each buildings as b}
				<polygon points={b.shadow} fill="#1f2937" />
			{/each}
		</g>

		<!-- Building 3D Forms -->
		{#each buildings as b}
			<polygon points={b.left} fill={b.sL} />
			<polygon points={b.right} fill={b.sR} />
			<polygon points={b.top} fill={b.sT} />

			<!-- Floor lines for architectural realism (fades in as score rises) -->
			{#each b.floors as f}
				<line
					x1={f.x1}
					y1={f.y1}
					x2={f.x2}
					y2={f.y2}
					stroke="#ffffff"
					stroke-width="0.75"
					opacity={0.1 + normalizedAnimatedScore * 0.4}
				/>
			{/each}

			<!-- Vertical columns for glass panels -->
			{#each b.verticals as v}
				<line
					x1={v.x1}
					y1={v.y1}
					x2={v.x2}
					y2={v.y2}
					stroke="#ffffff"
					stroke-width="0.75"
					opacity={0.1 + normalizedAnimatedScore * 0.3}
				/>
			{/each}

			<!-- Subtle roof parapet outline -->
			<polygon points={b.top} fill="none" stroke="#ffffff" stroke-width="1.25" opacity="0.8" />
		{/each}
	</svg>
</div>

<style>
	polygon,
	line,
	div {
		transform-style: preserve-3d;
	}
</style>
