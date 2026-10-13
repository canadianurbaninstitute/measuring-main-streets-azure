<!-- A beeswarm that moves through census years: a date range, a play button
     and year pills above the swarm, one fixed axis across the range, and
     trails back to the start of the range. Measures with a single census year
     show that year alone. Shared by every swarm module in the Core Report. -->

<script>
	import { CITIES, yearsWithData } from '../coreCensus.js';
	import Beeswarm from './Beeswarm.svelte';
	import PlayControl from './PlayControl.svelte';

	/**
	 * Props:
	 *   measure       - { get, format, scale, zeroFloor, unit?, nominalDollars? };
	 *                   `get` reads one census-year profile
	 *   accent        - CSS colour for the play button and active year
	 *   selectedCity  - bindable city key, shared with the other modules
	 */
	let { measure, accent = 'var(--brandPurple)', selectedCity = $bindable(null) } = $props();

	const years = $derived(yearsWithData(measure.get));

	// Start on the measure's full span so the server render already shows dots.
	const initialYears = yearsWithData(measure.get);
	let from = $state(initialYears[0] ?? null);
	let to = $state(initialYears.at(-1) ?? null);
	let year = $state(initialYears.at(-1) ?? null);
	let instant = $state(false);

	// A measure without data at both ends of the current range resets to its
	// full span, landing on the latest year.
	$effect(() => {
		if (!years.includes(from) || !years.includes(to) || from >= to) {
			from = years[0] ?? null;
			to = years.at(-1) ?? null;
			year = to;
		}
	});

	// One axis across every year in the range, so a dot moving means the value
	// changed rather than the axis rescaling under it.
	const domain = $derived.by(() => {
		const inRange = years.filter((yr) => yr >= from && yr <= to);
		const values = CITIES.flatMap((city) =>
			inRange.flatMap((yr) => [measure.get(city.downtown[yr]), measure.get(city.cma[yr])])
		).filter((v) => v != null && Number.isFinite(v));
		return values.length ? [Math.min(...values), Math.max(...values)] : null;
	});

	// Dots are traced back to the start of the range.
	const compareYear = $derived(year !== from ? from : null);
</script>

<div class="time-controls">
	{#if years.length > 1}
		<PlayControl {years} bind:from bind:to bind:year bind:instant {accent} />
	{:else if years.length === 1}
		<span class="single-year">{years[0]} Census only</span>
	{/if}
</div>

<Beeswarm
	cities={CITIES}
	value={(profiles) => measure.get(profiles[year])}
	compare={compareYear ? (profiles) => measure.get(profiles[compareYear]) : null}
	compareLabel={String(compareYear ?? '')}
	{domain}
	valueFormat={measure.format}
	unit={measure.unit ?? ''}
	scale={measure.scale}
	zeroFloor={measure.zeroFloor}
	stamp={year ? String(year) : ''}
	duration={instant ? 0 : 1400}
	bind:selectedCity
/>

{#if years.length > 1 || measure.nominalDollars}
	<p class="note">
		{#if years.length > 1}
			Census snapshots, not a trend line: the animation shows the jump between census years, not the
			path in between. Regions use census metropolitan area boundaries as drawn in each year, so
			some regional change is territory added over time; a region that did not exist in
			{from} appears only later.
		{/if}
		{#if measure.nominalDollars}Dollar values are not adjusted for inflation.{/if}
	</p>
{/if}

<style>
	.time-controls {
		margin-bottom: 1.25rem;
	}

	.note {
		font-size: 0.75rem;
		line-height: 1.55;
		color: var(--core-text-muted);
		max-width: 80ch;
		margin: 1rem 0 0;
	}

	.single-year {
		display: inline-block;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--core-text-muted);
	}
</style>
