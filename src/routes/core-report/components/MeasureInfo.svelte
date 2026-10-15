<!-- "What this measures": the census definition behind a measure, in
     Statistics Canada's own words. The latest census shows by default; every
     year's labels and census vectors sit behind a disclosure for anyone who
     needs to trace a number back to the source. -->

<script>
	/**
	 * Props:
	 *   measure - { label, note?, definition: { years, note } } from coreMetrics
	 *             or coreCensus
	 *   prefix  - optional label shown before the measure name (e.g. "Horizontal")
	 */
	let { measure, prefix = '' } = $props();

	const years = $derived(measure.definition?.years ?? []);
	const latest = $derived(years.at(-1) ?? null);
	const isShare = $derived(Boolean(latest?.universe));

	// Earlier censuses are worth spelling out only where they differ.
	const differs = $derived(
		years.some(
			(y) =>
				y.counts.join() !== latest.counts.join() || (y.universe ?? '') !== (latest.universe ?? '')
		)
	);

	// "Total - Private households by tenure" → "Private households by tenure"
	const universe = (text) => String(text ?? '').replace(/^Total\s*-\s*/i, '');
</script>

<div class="measure-info">
	<div class="title">
		{#if prefix}<span class="prefix">{prefix}</span>{/if}
		What “{measure.label}” measures
	</div>

	{#if latest}
		<dl>
			<dt>{isShare ? 'Counted' : 'Census figure'}</dt>
			<dd>{latest.counts.join(' + ')}</dd>
			{#if isShare}
				<dt>Out of</dt>
				<dd>{universe(latest.universe)}</dd>
			{/if}
		</dl>
	{/if}

	{#if measure.note}<p class="note">{measure.note}</p>{/if}
	{#if measure.definition?.note}<p class="note">{measure.definition.note}</p>{/if}

	{#if years.length}
		<details>
			<summary>
				Census definitions{differs ? ' (these differ between years)' : ''}
			</summary>
			{#each years as entry (entry.year)}
				<div class="year">
					<div class="year-label">{entry.year} Census</div>
					<dl>
						<dt>Counted</dt>
						<dd>{entry.counts.join(' + ')}</dd>
						{#if entry.universe}
							<dt>Out of</dt>
							<dd>{entry.universe}</dd>
						{/if}
						<dt>Vectors</dt>
						<dd class="mono">{entry.codes.join(', ')}</dd>
					</dl>
				</div>
			{/each}
			<p class="source">
				From CUI’s census variable worksheet; labels are Statistics Canada’s, via CensusMapper.
			</p>
		</details>
	{/if}
</div>

<style>
	.measure-info {
		margin: 0 0 1.25rem;
		padding: 0.875rem 1rem;
		border: 1px solid var(--core-line);
		border-radius: 0.75rem;
		background: rgba(2, 42, 63, 0.6);
		font-size: 0.78rem;
		line-height: 1.5;
		color: var(--core-text-body);
		max-width: 80ch;
	}

	.title {
		font-weight: 700;
		color: var(--core-text-soft);
		margin-bottom: 0.375rem;
	}

	.prefix {
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--core-text-muted);
		margin-right: 0.375rem;
	}

	dl {
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: 0.15rem 0.75rem;
		margin: 0;
	}

	dt {
		font-weight: 600;
		color: var(--core-text-muted);
	}

	dd {
		margin: 0;
	}

	/* Sizes are set explicitly: the site's global paragraph style would
	   otherwise win over the inherited panel size. */
	.note {
		margin: 0.5rem 0 0;
		font-size: 0.78rem;
		line-height: 1.5;
		color: var(--core-text-muted);
	}

	details {
		margin-top: 0.5rem;
	}

	summary {
		cursor: pointer;
		font-weight: 600;
		color: var(--brandLightBlue);
	}

	.year {
		margin-top: 0.625rem;
	}

	.year-label {
		font-weight: 700;
		color: var(--core-text-soft);
		margin-bottom: 0.15rem;
	}

	.mono {
		font-family: ui-monospace, monospace;
		font-size: 0.72rem;
		word-break: break-word;
	}

	.source {
		margin: 0.625rem 0 0;
		font-size: 0.72rem;
		line-height: 1.5;
		color: var(--core-text-faint);
	}
</style>
