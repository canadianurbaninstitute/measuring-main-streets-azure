<!-- Core / Region switches doubling as the swarm legend: each shows its mark
     and turns that kind of dot on or off. One of the two always stays on. -->

<script>
	/**
	 * Props:
	 *   kinds - bindable { core: boolean, region: boolean }, shared by every swarm
	 */
	let { kinds = $bindable({ core: true, region: true }) } = $props();

	const options = [
		{ key: 'core', label: 'Core' },
		{ key: 'region', label: 'Region' }
	];

	function toggle(key) {
		const other = key === 'core' ? 'region' : 'core';
		// Turning off the only kind on show would leave an empty chart.
		if (kinds[key] && !kinds[other]) return;
		kinds = { ...kinds, [key]: !kinds[key] };
	}
</script>

<div class="kind-toggle" role="group" aria-label="Show downtown cores and regions">
	{#each options as option (option.key)}
		<button
			type="button"
			class="kind"
			class:is-off={!kinds[option.key]}
			aria-pressed={kinds[option.key]}
			title={kinds[option.key]
				? `Hide ${option.label.toLowerCase()}s`
				: `Show ${option.label.toLowerCase()}s`}
			onclick={() => toggle(option.key)}
		>
			<span class="swatch" class:is-core={option.key === 'core'}></span>{option.label}
		</button>
	{/each}
</div>

<style>
	.kind-toggle {
		display: inline-flex;
		gap: 0.375rem;
		flex-wrap: wrap;
	}

	.kind {
		display: inline-flex;
		align-items: center;
		gap: 0.4375rem;
		border: 1px solid var(--core-line);
		background: #022a3f;
		border-radius: 999px;
		padding: 0.3rem 0.75rem 0.3rem 0.5rem;
		font-family: Inter, sans-serif;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--core-text-soft);
		cursor: pointer;
		transition: 0.18s;
	}

	.kind:hover,
	.kind:focus-visible {
		border-color: var(--core-text-muted);
		color: #fff;
	}

	.kind.is-off {
		background: transparent;
		color: var(--core-text-faint);
		text-decoration: line-through;
	}

	.swatch {
		width: 15px;
		height: 15px;
		border-radius: 50%;
		background: transparent;
		border: 2px solid #7d97a5;
	}

	.swatch.is-core {
		background: #7d97a5;
		border-color: rgba(255, 255, 255, 0.55);
	}

	.kind.is-off .swatch {
		opacity: 0.35;
	}
</style>
