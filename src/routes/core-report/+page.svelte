<!-- Canada's Core Report — an unlisted explorer for spotting national trends
     across the fifteen downtown cores and their wider regions. Not linked from
     the site navigation; reachable at /core-report/ only. -->

<script>
	import { CITIES } from '../lib/data/coredata/coreData.js';
	import '../styles.css';
	import Beeswarm from './components/Beeswarm.svelte';
	import ChipGroup from './components/ChipGroup.svelte';
	import CoreScatter from './components/CoreScatter.svelte';
	import PlayControl from './components/PlayControl.svelte';
	import {
		INDUSTRIES,
		METRICS,
		OCCUPATIONS,
		SIZE_LEGEND,
		UNPROFILED_COLOR
	} from './coreMetrics.js';
	import { SERIES_AVAILABLE, SERIES_YEARS, loadSeries } from './coreTimeSeries.js';

	// One selection is shared by all three modules, so isolating a city in the
	// spread also isolates it in the scatter and the workforce swarm.
	let selectedCity = $state(null);

	let spreadMetric = $state('density');
	let xMetric = $state('density');
	let yMetric = $state('carfree');
	let workforceMode = $state('industries');
	let workforceCategory = $state('professional');

	const metricOptions = METRICS.map((m) => ({ key: m.key, label: m.label }));
	const modeOptions = [
		{ key: 'industries', label: 'Industries' },
		{ key: 'occupations', label: 'Occupations' }
	];

	const spread = $derived(METRICS.find((m) => m.key === spreadMetric) ?? METRICS[0]);
	const x = $derived(METRICS.find((m) => m.key === xMetric) ?? METRICS[0]);
	const y = $derived(METRICS.find((m) => m.key === yMetric) ?? METRICS[4]);

	const workforceCategories = $derived(workforceMode === 'occupations' ? OCCUPATIONS : INDUSTRIES);
	const workforce = $derived(
		workforceCategories.find((c) => c.key === workforceCategory) ?? workforceCategories[0]
	);

	// Switching between industries and occupations lands on a category that
	// exists in the new list rather than falling back silently.
	$effect(() => {
		const categories = workforceMode === 'occupations' ? OCCUPATIONS : INDUSTRIES;
		if (!categories.some((c) => c.key === workforceCategory)) {
			workforceCategory = categories[0].key;
		}
	});

	// 04 · The change — 2001 and 2021 Census snapshots, loaded on demand and only
	// when the sdsc-data comparison CSV is part of the build.
	let seriesThemes = $state([]);
	let seriesTheme = $state('');
	let seriesVariable = $state('');
	let seriesYear = $state(SERIES_YEARS.at(-1));
	let seriesInstant = $state(false);

	$effect(() => {
		if (!SERIES_AVAILABLE) return;
		loadSeries().then((themes) => {
			seriesThemes = themes;
			seriesTheme = themes[0]?.key ?? '';
		});
	});

	const changeTheme = $derived(seriesThemes.find((t) => t.key === seriesTheme) ?? null);
	const change = $derived(
		changeTheme?.variables.find((v) => v.key === seriesVariable) ??
			changeTheme?.variables[0] ??
			null
	);

	$effect(() => {
		const variables = changeTheme?.variables ?? [];
		if (variables.length && !variables.some((v) => v.key === seriesVariable)) {
			seriesVariable = variables[0].key;
		}
	});

	// One axis across both census years, so a dot moving means the value changed
	// rather than the axis rescaling under it.
	const changeDomain = $derived.by(() => {
		if (!change) return null;
		const values = change.cities
			.flatMap((c) => SERIES_YEARS.flatMap((yr) => [c.downtown[yr], c.cma[yr]]))
			.filter((v) => v != null);
		return values.length ? [Math.min(...values), Math.max(...values)] : null;
	});

	const previousYear = $derived(SERIES_YEARS[SERIES_YEARS.indexOf(seriesYear) - 1] ?? null);
	const changeHasUnprofiled = $derived(change?.cities.some((c) => !c.profiled) ?? false);

	const selectedName = $derived(
		CITIES.find((c) => c.key === selectedCity)?.name ??
			change?.cities.find((c) => c.key === selectedCity)?.name ??
			null
	);
</script>

<svelte:head>
	<title>Canada's Core Report | Measuring Main Streets</title>
	<meta
		name="description"
		content="A visual field guide to fifteen Canadian downtown cores and the regions around them."
	/>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="core-report">
	<div class="page-inner">
		<header class="masthead">
			<div class="eyebrow">
				<span class="eyebrow-dot"></span>
				Canada's Core Report · a visual field guide
			</div>
			<h2 class="headline">Fifteen downtowns, one national picture</h2>
			<!-- <p class="standfirst">
				Every measure below plots all fifteen cores at once — no leaderboards, just the shape of the
				data. Each city appears twice: a <b>filled dot for the downtown core</b> and a
				<b>hollow dot for its wider region</b>. Click any city to follow it through all three views.
			</p> -->
		</header>

		<div class="legend">
			<span class="legend-title">Coloured by downtown size</span>
			{#each SIZE_LEGEND as size (size.key)}
				<span class="legend-item">
					<span class="legend-swatch" style:background={size.color}></span>{size.label}
				</span>
			{/each}
			{#if selectedName}
				<button type="button" class="clear-selection" onclick={() => (selectedCity = null)}>
					Following {selectedName} · clear
				</button>
			{/if}
		</div>

		<!-- 00 · The map -->
		<!-- <section class="module">
			<div class="module-number is-purple">00 · The map</div>
			<h3 class="module-title">Fifteen downtown-core boundaries</h3>
			<p class="module-blurb">
				Every filled shape is a downtown's actual boundary, coloured by size group. Click a
				downtown to follow it through every module below.
			</p>

			<CoreMap bind:selectedCity />
		</section> -->

		<!-- 01 · The spread -->
		<section class="module">
			<div class="module-head">
				<div>
					<div class="module-number">01 · The spread</div>
					<h3 class="module-title">{spread.label}: cores and regions</h3>
				</div>
				<div class="kind-legend">
					<span class="kind"><span class="kind-swatch is-core"></span>Core</span>
					<span class="kind"><span class="kind-swatch"></span>Region</span>
				</div>
			</div>
			<p class="module-blurb">
				Every downtown core and every region is placed independently along the axis. Where dots
				bunch, cities cluster; where they spread, they diverge. The dashed gold line marks the core
				average.
			</p>

			<div class="controls">
				<ChipGroup options={metricOptions} bind:selected={spreadMetric} />
			</div>

			<Beeswarm
				cities={CITIES}
				value={spread.get}
				valueFormat={spread.format}
				unit={spread.unit ?? ''}
				scale={spread.scale}
				bind:selectedCity
			/>
		</section>

		<!-- 02 · The relationship -->
		<section class="module">
			<div class="module-number is-green">02 · The relationship</div>
			<h3 class="module-title">{y.label} against {x.label.toLowerCase()}</h3>
			<p class="module-blurb">
				Each bubble is a downtown core, sized by population and coloured by region. Choose any two
				measures for the axes to hunt for relationships across the fifteen cores.
			</p>

			<div class="controls is-stacked">
				<ChipGroup
					label="Horizontal"
					options={metricOptions}
					bind:selected={xMetric}
					accent="var(--brandDarkGreen)"
				/>
				<ChipGroup
					label="Vertical"
					options={metricOptions}
					bind:selected={yMetric}
					accent="var(--brandDarkGreen)"
				/>
			</div>

			<CoreScatter cities={CITIES} xMetric={x} yMetric={y} bind:selectedCity />
		</section>

		<!-- 03 · The workforce -->
		<section class="module">
			<div class="module-number is-yellow">03 · The workforce</div>
			<h3 class="module-title">{workforce.label}: share of the workforce</h3>
			<p class="module-blurb">
				Each downtown core and its region placed by {workforce.label.toLowerCase()}'s share of
				workers. Toggle any {workforceMode === 'occupations' ? 'occupation' : 'industry'} to see which
				cores concentrate it. The dashed line marks the core average.
			</p>

			<div class="controls is-stacked">
				<div class="mode-toggle">
					<ChipGroup
						options={modeOptions}
						bind:selected={workforceMode}
						accent="var(--brandYellow)"
					/>
				</div>
				<ChipGroup
					options={workforceCategories.map((c) => ({ key: c.key, label: c.label }))}
					bind:selected={workforceCategory}
				/>
			</div>

			<Beeswarm
				cities={CITIES}
				value={workforce.get}
				valueFormat="pct"
				zeroFloor
				bind:selectedCity
			/>

			<div class="kind-legend is-below">
				<span class="kind"><span class="kind-swatch is-core"></span>Core</span>
				<span class="kind"><span class="kind-swatch"></span>Region</span>
			</div>
		</section>

		<!-- 04 · The change -->
		{#if change}
			<section class="module">
				<div class="module-head">
					<div>
						<div class="module-number is-purple">
							04 · The change, {SERIES_YEARS[0]} to {SERIES_YEARS.at(-1)}
						</div>
						<h3 class="module-title">{change.label}: then and now</h3>
					</div>
					<div class="kind-legend">
						<span class="kind"><span class="kind-swatch is-core"></span>Core</span>
						<span class="kind"><span class="kind-swatch"></span>Region</span>
						{#if changeHasUnprofiled}
							<span class="kind">
								<span class="legend-swatch" style:background={UNPROFILED_COLOR}></span>
								Not yet profiled
							</span>
						{/if}
					</div>
				</div>
				<p class="module-blurb">
					Press play to watch every core and region move from the {SERIES_YEARS[0]} Census to the
					{SERIES_YEARS.at(-1)} Census. The axis stays fixed across both years, so a dot that moves has
					changed. Hover a dot, or follow a city, to trace it back to where it started.
					{#if change.format === 'pct'}Values are shares of {change.indicator.toLowerCase()}.{/if}
				</p>

				<div class="controls is-stacked">
					<ChipGroup
						options={seriesThemes.map((t) => ({ key: t.key, label: t.label }))}
						bind:selected={seriesTheme}
						accent="var(--brandPurple)"
					/>
					<ChipGroup
						options={changeTheme.variables.map((v) => ({ key: v.key, label: v.label }))}
						bind:selected={seriesVariable}
					/>
					<PlayControl years={SERIES_YEARS} bind:year={seriesYear} bind:instant={seriesInstant} />
				</div>

				<Beeswarm
					cities={change.cities}
					value={(profile) => profile[seriesYear]}
					compare={previousYear ? (profile) => profile[previousYear] : null}
					compareLabel={String(previousYear ?? '')}
					domain={changeDomain}
					valueFormat={change.format}
					scale={change.scale}
					zeroFloor={change.zeroFloor}
					stamp={String(seriesYear)}
					duration={seriesInstant ? 0 : 1400}
					bind:selectedCity
				/>

				<p class="module-note">
					Two census snapshots, not a trend line: the animation shows the jump between them, not the
					path in between. Regions use census metropolitan area boundaries as drawn in each year, so
					some regional change is territory added since {SERIES_YEARS[0]}; regions that did not
					exist in
					{SERIES_YEARS[0]} appear only in {SERIES_YEARS.at(-1)}.
					{#if change.nominalDollars}Dollar values are not adjusted for inflation.{/if}
				</p>
			</section>
		{/if}

		<p class="source">
			Source: Statistics Canada, {change ? `${SERIES_YEARS[0]} and ` : ''}2021 Census (via CUI
			<span class="mono">sdsc-data</span>). Fifteen of the twenty planned cores are shown. Positions
			encode values, not rank — the report never scores cities against each other.
		</p>
	</div>
</div>

<style>
	.core-report {
		/* Dark surface tokens for this explorer, built out of the site's brand blue. */
		--core-surface: #04314a;
		--core-line: #0d445f;
		--core-grid: #082e44;
		--core-text: #eaf4f9;
		--core-text-soft: #cfe3ee;
		--core-text-body: #a9c7d6;
		--core-text-muted: #6f93a4;
		--core-text-faint: #5f8296;

		background: var(--brandDarkBlue);
		color: var(--core-text);
		min-height: 100vh;
		padding: 0 0 5.5rem;
		overflow-x: hidden;
	}

	.page-inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 3rem;
	}

	.masthead {
		padding: 3.5rem 0 1.625rem;
	}

	.eyebrow {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		margin-bottom: 1.25rem;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--brandLightBlue);
	}

	.eyebrow-dot {
		width: 13px;
		height: 13px;
		border-radius: 50%;
		background: var(--brandLightBlue);
	}

	.headline {
		font-family: Gelasio, serif;
		font-weight: 600;
		font-size: clamp(2.375rem, 6vw, 4.25rem);
		line-height: 1.03;
		letter-spacing: -0.015em;
		margin: 0 0 1.25rem;
		max-width: 16ch;
		color: #fff;
	}

	.standfirst {
		font-size: 1.0625rem;
		line-height: 1.6;
		color: var(--core-text-body);
		max-width: 64ch;
		margin: 0;
	}

	.standfirst b {
		color: #fff;
	}

	.legend {
		padding: 0 0 1.875rem;
		display: flex;
		gap: 1.125rem;
		flex-wrap: wrap;
		align-items: center;
	}

	.legend-title {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--core-text-muted);
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.4375rem;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--core-text-soft);
	}

	.legend-swatch {
		width: 13px;
		height: 13px;
		border-radius: 50%;
	}

	.clear-selection {
		border: 1px solid var(--brandYellow);
		background: transparent;
		color: var(--brandYellow);
		font-family: Inter, sans-serif;
		font-weight: 600;
		font-size: 0.75rem;
		padding: 0.35rem 0.75rem;
		border-radius: 999px;
		cursor: pointer;
		transition: 0.18s;
	}

	.clear-selection:hover {
		background: var(--brandYellow);
		color: var(--brandDarkBlue);
	}

	.module {
		margin: 0 0 1.625rem;
		background: var(--core-surface);
		border: 1px solid var(--core-line);
		border-radius: 1.375rem;
		padding: 1.875rem 2.125rem 2.25rem;
	}

	.module-head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1.25rem;
		flex-wrap: wrap;
	}

	.module-number {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--brandLightBlue);
		margin-bottom: 0.5rem;
	}

	.module-number.is-green {
		color: var(--brandDarkGreen);
	}

	.module-number.is-yellow {
		color: var(--brandYellow);
	}

	.module-number.is-purple {
		color: var(--brandPurple);
	}

	.module-title {
		font-family: Gelasio, serif;
		font-weight: 600;
		font-size: 1.875rem;
		margin: 0;
		color: #fff;
		line-height: 1.1;
	}

	.module-blurb {
		font-size: 0.9rem;
		line-height: 1.55;
		color: var(--core-text-body);
		max-width: 74ch;
		margin: 0.5rem 0 1.125rem;
	}

	.controls {
		display: flex;
		gap: 1.25rem;
		flex-wrap: wrap;
		margin-bottom: 1.625rem;
	}

	.controls.is-stacked {
		flex-direction: column;
		gap: 0.75rem;
	}

	.mode-toggle {
		display: inline-flex;
		align-self: flex-start;
		background: #022a3f;
		border: 1px solid var(--core-line);
		border-radius: 999px;
		padding: 0.25rem;
	}

	.kind-legend {
		display: flex;
		gap: 1rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.kind-legend.is-below {
		margin-top: 0.75rem;
	}

	.kind {
		display: flex;
		align-items: center;
		gap: 0.4375rem;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--core-text-soft);
	}

	.kind-swatch {
		width: 15px;
		height: 15px;
		border-radius: 50%;
		background: transparent;
		border: 2px solid #7d97a5;
	}

	.kind-swatch.is-core {
		background: #7d97a5;
		border-color: rgba(255, 255, 255, 0.55);
	}

	.module-note {
		font-size: 0.75rem;
		line-height: 1.55;
		color: var(--core-text-muted);
		max-width: 80ch;
		margin: 1rem 0 0;
	}

	.source {
		padding: 1.625rem 0 0;
		font-size: 0.75rem;
		color: var(--core-text-faint);
		line-height: 1.6;
	}

	.mono {
		font-family: ui-monospace, monospace;
	}

	@media (max-width: 767px) {
		.page-inner {
			padding: 0 1.25rem;
		}

		.masthead {
			padding: 2.25rem 0 1.25rem;
		}

		.module {
			border-radius: 1rem;
			padding: 1.25rem 1rem 1.5rem;
		}

		.module-title {
			font-size: 1.375rem;
		}
	}
</style>
