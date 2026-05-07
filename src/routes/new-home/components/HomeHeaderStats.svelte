<script>
	import { onDestroy, onMount } from 'svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let stats = [
		{ label: 'could be built in transit station areas', value: '4.4 million homes' },
		{ value: '5.59 million', label: 'Canadians live in transit station areas' },
		{ value: '465', label: 'higher order transit stations exist in Canada' },
		{ label: 'of Canadians live within 1km of a main street', value: '85%' },
		{ label: 'businesses are open on main streets', value: '280,000' },
		{ label: 'provided on main streets', value: '1.9 million jobs' },
		{ label: 'in annual revenue is generated on main streets', value: '$300 billion' },
		{ label: 'civic infrastructure & community assets exist on main streets', value: '98,000' },
		{ value: 'Over 50%', label: 'of embodied building GHG can be reduced by design choices' },
		{ value: '298', label: 'higher order transit stations are under construction or planned' },
		{ value: 'Over 3.6 million', label: 'jobs provided in transit station areas' }
	];

	// Start with unique indices
	let indices = [0, 1, 2, 3];
	let activeSlot = 0;

	let intervalId;

	function getNextAvailableIndex(slotIndex) {
		let next = (indices[slotIndex] + 1) % stats.length;
		// Ensure the new index isn't currently visible in any other slot
		while (indices.some((val, idx) => idx !== slotIndex && val === next)) {
			next = (next + 1) % stats.length;
		}
		return next;
	}

	onMount(() => {
		// One master timer: every 5 seconds, change one card
		intervalId = setInterval(() => {
			// 1. Update the index for the CURRENT active slot
			indices[activeSlot] = getNextAvailableIndex(activeSlot);

			// 2. Move the focus to the next slot (0, 1, 2, 3, then back to 0)
			activeSlot = (activeSlot + 1) % indices.length;
		}, 4000);
	});

	onDestroy(() => clearInterval(intervalId));
</script>

<div class="header-stats">
	{#each indices as currentIndex, i (i)}
		<div class="stat-card">
			{#key currentIndex}
				<div
					class="stat-content"
					in:fly={{ y: 30, duration: 800, easing: backOut }}
					out:fly={{ y: -30, duration: 600 }}
				>
					<span class="value">{stats[currentIndex].value}</span>
					<span class="label">{stats[currentIndex].label}</span>
				</div>
			{/key}
		</div>
	{/each}
</div>

<style>
	.header-stats {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		width: 100%;
		max-width: 900px;
		padding: 1.5rem;
		margin: 0 auto;
	}

	@media (min-width: 768px) {
		.header-stats {
			grid-template-columns: repeat(4, 1fr);
			gap: 1.5rem;
		}
	}

	.stat-card {
		position: relative;
		padding: 5rem;
		/* background: rgba(255, 255, 255, 0.85); */
		backdrop-filter: blur(5px);
		border: 1px solid rgba(255, 255, 255, 0.4);
		border-radius: 1.25rem;
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.stat-content {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 1rem;
		box-sizing: border-box;
	}

	.value {
		font-size: clamp(1rem, 3vw, 1.3rem);
		font-weight: 800;
		color: var(--color-blue-800, #1e40af);
		line-height: 1.1;
		margin-bottom: 0.5rem;
	}

	.label {
		font-size: clamp(0.75rem, 2vw, 0.85rem);
		color: #475569;
		font-weight: 600;
		line-height: 1.3;
		letter-spacing: 0.025em;
	}
</style>
