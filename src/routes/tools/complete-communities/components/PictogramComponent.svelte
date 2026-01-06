<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as d3 from 'd3';

	export let visitorCount = 0;
	export let employeeCount = 0;
	export let iconSize = 25;
	export let animate = true;

	let container;
	let width = 0;
    let height = 0;

	// Icons paths (using simple paths for demo, can be replaced with SVGs or complex paths)
	const userIconPath = "M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"; // mdi:account
	const briefcaseIconPath = "M10 2h4a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4V4a2 2 0 0 1 2-2m4 4V4h-4v4z"; // mdi:briefcase

    const itemsPerRow = 20;

	function draw() {
		if (!container || !width) return;

        // Calculate total items (scaling: 1 icon = 100 people approx for demo, or just normalized)
        // For this visual, let's normalize to a fixed grid or just show relative counts.
        // User request: "pictogram that shows the amount of visitors compared to the number of employees"
        // Let's use a 1:X ratio representation or a grid.
        // Given the numbers can be large (100k visitors), we should probably scale.
        // Let's say we want to show 100 icons total for the "base" and scale the other relative to it, or just a grid of 100 representing the mix.
        // Actually, let's just show them side by side or mixed.
        // Let's assume we want to visualize the *density* or ratio.
        
        // Let's try to fit icons into the width.
        
        const scaleFactor = 1000; // 1 icon = 1000 people
        const vIcons = Math.ceil(visitorCount / scaleFactor);
        const eIcons = Math.ceil(employeeCount / scaleFactor);
        
        const data = [
            ...Array(vIcons).fill({ type: 'visitor' }),
            ...Array(eIcons).fill({ type: 'employee' })
        ];

		const svg = d3.select(container).selectAll('svg').data([null]).join('svg')
			.attr('width', width)
			.attr('height', Math.ceil(data.length / itemsPerRow) * (iconSize + 5));

		const t = svg.transition().duration(750);

		const icons = svg.selectAll('path')
			.data(data, (d, i) => i);

		icons.exit()
			.transition(t)
			.style('opacity', 0)
			.remove();

		icons.enter()
			.append('path')
			.attr('d', d => d.type === 'visitor' ? userIconPath : briefcaseIconPath)
			.attr('fill', d => d.type === 'visitor' ? '#34bef9' : '#F45D01') // Blue for visitors, Orange for employees
			.attr('transform', (d, i) => `translate(${(i % itemsPerRow) * iconSize}, ${Math.floor(i / itemsPerRow) * iconSize}) scale(0)`)
			.merge(icons)
			.transition(t)
			.attr('transform', (d, i) => `translate(${(i % itemsPerRow) * iconSize}, ${Math.floor(i / itemsPerRow) * iconSize}) scale(${iconSize/24})`); // Path is on 24x24 grid
	}
    
    // Initial draw and reactive updates
    $: if (visitorCount || employeeCount) {
        draw();
    }
    
     $: if (width) {
        draw();
    }

</script>

<div class="pictogram-container" bind:this={container} bind:clientWidth={width}></div>

<style>
	.pictogram-container {
		width: 100%;
		min-height: 200px;
	}
</style>
