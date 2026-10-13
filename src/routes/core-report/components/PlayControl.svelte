<!-- Date range, play button and year pills for animating a beeswarm through
     census years. The range picks the first and last census to compare; Play
     rewinds to the first, holds, then steps forward one census at a time; the
     pills jump straight to any year in the range. -->

<script>
	import { onDestroy } from 'svelte';

	/**
	 * Props:
	 *   years    - every census year available, in order
	 *   from     - bindable first year of the range
	 *   to       - bindable last year of the range
	 *   year     - bindable year on show
	 *   instant  - bindable; true while rewinding, so the swarm can jump rather than glide
	 *   step     - milliseconds between frames while playing (should exceed the glide)
	 *   accent   - CSS colour for the button and active pill
	 */
	let {
		years = [],
		from = $bindable(null),
		to = $bindable(null),
		year = $bindable(null),
		instant = $bindable(false),
		step = 1800,
		accent = 'var(--brandPurple)'
	} = $props();

	let playing = $state(false);
	let timer = null;

	const frames = $derived(years.filter((yr) => yr >= from && yr <= to));

	function stop() {
		clearTimeout(timer);
		timer = null;
		playing = false;
		instant = false;
	}

	function advance(index) {
		if (index >= frames.length) return stop();
		year = frames[index];
		timer = setTimeout(() => advance(index + 1), step);
	}

	function play() {
		if (playing) return stop();
		if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
			year = to;
			return;
		}
		playing = true;
		// Snap back to the first year without gliding, hold so the reader can
		// take in the starting picture, then let the dots travel.
		instant = true;
		year = from;
		timer = setTimeout(() => {
			instant = false;
			advance(1);
		}, 900);
	}

	function choose(target) {
		stop();
		year = target;
	}

	// A new range lands on its end year, the picture the range leads to.
	function setRange(nextFrom, nextTo) {
		stop();
		from = nextFrom;
		to = nextTo;
		year = nextTo;
	}

	onDestroy(stop);
</script>

<div class="play-control" style:--accent={accent}>
	<button
		type="button"
		class="play"
		aria-pressed={playing}
		aria-label={playing ? 'Stop' : `Play ${from} to ${to}`}
		disabled={frames.length < 2}
		onclick={play}
	>
		{#if playing}
			<svg viewBox="0 0 16 16" aria-hidden="true"
				><rect x="3" y="3" width="10" height="10" rx="1.5" /></svg
			>
			Stop
		{:else}
			<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9.5-5.5z" /></svg>
			Play
		{/if}
	</button>

	<div class="range" role="group" aria-label="Date range">
		<label>
			<span class="range-label">From</span>
			<select value={from} onchange={(e) => setRange(Number(e.currentTarget.value), to)}>
				{#each years as option (option)}
					<option value={option} disabled={option >= to}>{option}</option>
				{/each}
			</select>
		</label>
		<label>
			<span class="range-label">to</span>
			<select value={to} onchange={(e) => setRange(from, Number(e.currentTarget.value))}>
				{#each years as option (option)}
					<option value={option} disabled={option <= from}>{option}</option>
				{/each}
			</select>
		</label>
	</div>

	<div class="years" role="group" aria-label="Census year on show">
		{#each frames as option, i (option)}
			{#if i > 0}<span class="arrow" aria-hidden="true">→</span>{/if}
			<button
				type="button"
				class="year"
				class:is-active={option === year}
				aria-pressed={option === year}
				onclick={() => choose(option)}
			>
				{option}
			</button>
		{/each}
	</div>
</div>

<style>
	.play-control {
		display: flex;
		align-items: center;
		gap: 0.875rem;
		flex-wrap: wrap;
	}

	.play {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		border: none;
		cursor: pointer;
		font-family: Inter, sans-serif;
		font-weight: 700;
		font-size: 0.8rem;
		padding: 0.55rem 1.1rem 0.55rem 0.9rem;
		border-radius: 999px;
		background: var(--accent);
		color: #fff;
		transition: 0.18s;
	}

	.play:hover,
	.play:focus-visible {
		filter: brightness(1.15);
	}

	.play:disabled {
		opacity: 0.4;
		cursor: default;
		filter: none;
	}

	.play svg {
		width: 0.9rem;
		height: 0.9rem;
		fill: currentColor;
	}

	.range {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.range label {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.range-label {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--core-text-muted);
	}

	.range select {
		font-family: Inter, sans-serif;
		font-weight: 600;
		font-size: 0.78rem;
		color: var(--core-text-soft);
		background: #022a3f;
		border: 1px solid var(--core-line);
		border-radius: 999px;
		padding: 0.4rem 0.75rem;
		cursor: pointer;
	}

	.range select:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	.years {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		background: #022a3f;
		border: 1px solid var(--core-line);
		border-radius: 999px;
		padding: 0.25rem;
	}

	.year {
		border: none;
		background: transparent;
		cursor: pointer;
		font-family: Inter, sans-serif;
		font-weight: 600;
		font-size: 0.78rem;
		padding: 0.4rem 0.8rem;
		border-radius: 999px;
		color: var(--core-text-soft);
		transition: 0.18s;
	}

	.year:hover {
		color: #fff;
	}

	.year.is-active {
		background: var(--accent);
		color: #fff;
	}

	.arrow {
		font-size: 0.75rem;
		color: var(--core-text-faint);
	}
</style>
