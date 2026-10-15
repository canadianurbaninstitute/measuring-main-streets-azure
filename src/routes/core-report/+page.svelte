<!-- Canada's Core Report — an unlisted explorer for spotting national trends
     across Canada's downtown cores and their wider regions. Not linked from
     the site navigation; reachable at /core-report/ only. -->

<script>
	import '../styles.css';
	import ChipGroup from './components/ChipGroup.svelte';
	import CoreScatter from './components/CoreScatter.svelte';
	import KindToggle from './components/KindToggle.svelte';
	import MeasureInfo from './components/MeasureInfo.svelte';
	import TimeSwarm from './components/TimeSwarm.svelte';
	import { CENSUS_YEARS, CITIES, LATEST_YEAR, THEMES, yearsWithData } from './coreCensus.js';
	import { METRICS, OCCUPATIONS, SIZE_LEGEND } from './coreMetrics.js';

	// One selection is shared by every module, so isolating a city in the
	// spread also isolates it in the scatter and the other swarms.
	let selectedCity = $state(null);

	// Core and region dots can be switched off to thin out busy swarms; the
	// choice applies to every swarm, like the followed downtown.
	let kinds = $state({ core: true, region: true });

	// Defaults use measures every downtown has (density covers only those with
	// a mapped boundary so far).
	let spreadMetric = $state('rented');
	let xMetric = $state('population');
	let yMetric = $state('carfree');
	let occupation = $state('business');

	const metricOptions = METRICS.map((m) => ({ key: m.key, label: m.label }));

	const spread = $derived(METRICS.find((m) => m.key === spreadMetric) ?? METRICS[0]);
	const x = $derived(METRICS.find((m) => m.key === xMetric) ?? METRICS[0]);
	const y = $derived(METRICS.find((m) => m.key === yMetric) ?? METRICS[1]);
	const workforce = $derived(OCCUPATIONS.find((o) => o.key === occupation) ?? OCCUPATIONS[0]);

	// The scatter compares cores in the latest census only.
	const latestCities = CITIES.map((city) => ({
		...city,
		downtown: city.downtown[LATEST_YEAR],
		cma: city.cma[LATEST_YEAR]
	}));

	// 04 · The change offers every census variable that has downtown values in
	// at least two census years (commute times, for one, start in 2021).
	const changeThemes = THEMES.map((theme) => ({
		...theme,
		indicators: theme.indicators
			.map((indicator) => ({
				...indicator,
				variables: indicator.variables.filter((v) => yearsWithData(v.get).length > 1)
			}))
			.filter((indicator) => indicator.variables.length)
	})).filter((theme) => theme.indicators.length);

	let changeIndicatorKey = $state(changeThemes[0]?.indicators[0]?.key ?? '');
	let changeVariableKey = $state('');

	const changeIndicator = $derived.by(() => {
		const indicators = changeThemes.flatMap((t) => t.indicators);
		return indicators.find((i) => i.key === changeIndicatorKey) ?? indicators[0] ?? null;
	});
	const change = $derived(
		changeIndicator?.variables.find((v) => v.key === changeVariableKey) ??
			changeIndicator?.variables[0] ??
			null
	);

	// Keep the variable pills in step when a new indicator lands on its first variable.
	$effect(() => {
		if (change && change.key !== changeVariableKey) changeVariableKey = change.key;
	});

	const selectedName = $derived(CITIES.find((c) => c.key === selectedCity)?.name ?? null);

	// With this many dots, picking a downtown from a list beats hunting for it.
	const followOptions = [...CITIES].sort((a, b) => a.name.localeCompare(b.name, 'en-CA'));
</script>

<svelte:head>
	<title>Canada's Core Report | Measuring Main Streets</title>
	<meta
		name="description"
		content="A visual field guide to {CITIES.length} Canadian downtown cores and the regions around them."
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
			<h2 class="headline">{CITIES.length} downtowns, one national picture</h2>
			<!-- <p class="standfirst">
				Every measure below plots every core at once — no leaderboards, just the shape of the
				data. Each city appears twice: a <b>filled dot for the downtown core</b> and a
				<b>hollow dot for its wider region</b>. Click any city to follow it through all three views.
			</p> -->
		</header>

		<div class="legend">
			<span class="legend-title">Coloured by downtown residents</span>
			{#each SIZE_LEGEND as size (size.key)}
				<span class="legend-item">
					<span class="legend-swatch" style:background={size.color}></span>{size.label}
					<span class="legend-range">{size.range}</span>
				</span>
			{/each}
			<label class="follow">
				<span class="legend-title">Follow</span>
				<select bind:value={selectedCity}>
					<option value={null}>A downtown…</option>
					{#each followOptions as city (city.key)}
						<option value={city.key}>{city.name}, {city.province}</option>
					{/each}
				</select>
			</label>
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
				<KindToggle bind:kinds />
			</div>
			<p class="module-blurb">
				Every downtown core and every region is placed independently along the axis. Where dots
				bunch, cities cluster; where they spread, they diverge. The dashed gold line marks the core
				average. Press play to watch them move between censuses.
			</p>

			<div class="controls">
				<ChipGroup options={metricOptions} bind:selected={spreadMetric} />
			</div>

			<MeasureInfo measure={spread} />

			<TimeSwarm measure={spread} accent="var(--brandBlue)" {kinds} bind:selectedCity />
		</section>

		<!-- 02 · The relationship -->
		<section class="module">
			<div class="module-number is-green">02 · The relationship</div>
			<h3 class="module-title">{y.label} against {x.label.toLowerCase()}</h3>
			<p class="module-blurb">
				Each bubble is a downtown core in the {LATEST_YEAR} Census, sized by population and coloured
				by downtown size. Choose any two measures for the axes to hunt for relationships across the
				{CITIES.length} cores.
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

			<div class="measure-pair">
				<MeasureInfo measure={x} prefix="Horizontal" />
				<MeasureInfo measure={y} prefix="Vertical" />
			</div>

			<CoreScatter cities={latestCities} xMetric={x} yMetric={y} bind:selectedCity />
		</section>

		<!-- 03 · The workforce -->
		<section class="module">
			<div class="module-head">
				<div>
					<div class="module-number is-yellow">03 · The workforce</div>
					<h3 class="module-title">{workforce.label}: share of employed residents</h3>
				</div>
				<KindToggle bind:kinds />
			</div>
			<p class="module-blurb">
				Each downtown core and its region placed by the share of residents working in
				{workforce.label.toLowerCase()} occupations. The census counts people where they live, not where
				they work, so this describes who lives downtown rather than downtown jobs.
			</p>

			<div class="controls">
				<ChipGroup
					options={OCCUPATIONS.map((o) => ({ key: o.key, label: o.label }))}
					bind:selected={occupation}
				/>
			</div>

			<MeasureInfo measure={workforce} />

			<TimeSwarm measure={workforce} accent="#8a6d00" {kinds} bind:selectedCity />
		</section>

		<!-- 04 · The change -->
		{#if change}
			<section class="module">
				<div class="module-head">
					<div>
						<div class="module-number is-purple">04 · Every census measure</div>
						<h3 class="module-title">{change.title}: then and now</h3>
					</div>
					<KindToggle bind:kinds />
				</div>
				<p class="module-blurb">
					Every census variable sdsc-data carries for both years, beyond the curated measures above.
					{#if change.format === 'pct'}Values are shares of {change.indicator.toLowerCase()}.{/if}
				</p>

				<div class="controls is-stacked">
					<div class="theme-groups">
						{#each changeThemes as theme (theme.key)}
							<ChipGroup
								label={theme.label}
								options={theme.indicators.map((i) => ({ key: i.key, label: i.label }))}
								bind:selected={changeIndicatorKey}
							/>
						{/each}
					</div>
					{#if changeIndicator.variables.length > 1}
						<ChipGroup
							options={changeIndicator.variables.map((v) => ({ key: v.key, label: v.label }))}
							bind:selected={changeVariableKey}
							accent="#d7a9d2"
						/>
					{/if}
				</div>

				<MeasureInfo measure={change} />

				<TimeSwarm measure={change} {kinds} bind:selectedCity />
			</section>
		{/if}

		<p class="source">
			Source: Statistics Canada, {CENSUS_YEARS.join(' and ')} Censuses (via CUI
			<span class="mono">sdsc-data</span>). {CITIES.length} downtowns are shown. Positions encode values,
			not rank — the report never scores cities against each other.
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

	.legend-range {
		font-weight: 500;
		color: var(--core-text-muted);
	}

	.legend-swatch {
		width: 13px;
		height: 13px;
		border-radius: 50%;
	}

	.follow {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.follow select {
		font-family: Inter, sans-serif;
		font-weight: 600;
		font-size: 0.78rem;
		color: var(--core-text-soft);
		background: #022a3f;
		border: 1px solid var(--core-line);
		border-radius: 999px;
		padding: 0.35rem 0.75rem;
		max-width: 14rem;
		cursor: pointer;
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

	.measure-pair {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
		gap: 0 1rem;
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

	.theme-groups {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
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
