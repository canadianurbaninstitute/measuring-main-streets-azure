<!-- Pill selector used to switch the measure on show in each Core Report module. -->

<script>
	/**
	 * Props:
	 *   label    - optional eyebrow rendered before the pills
	 *   options  - array of { key, label }
	 *   selected - bindable key of the active option
	 *   accent   - CSS colour used for the active pill
	 */
	let {
		label = '',
		options = [],
		selected = $bindable(''),
		accent = 'var(--brandLightBlue)'
	} = $props();
</script>

<div class="chip-group">
	{#if label}
		<span class="chip-label">{label}</span>
	{/if}
	{#each options as option (option.key)}
		<button
			type="button"
			class="chip"
			class:is-active={option.key === selected}
			style:background={option.key === selected ? accent : 'transparent'}
			aria-pressed={option.key === selected}
			onclick={() => (selected = option.key)}
		>
			{option.label}
		</button>
	{/each}
</div>

<style>
	.chip-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.chip-label {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--core-text-muted);
	}

	.chip {
		border: none;
		cursor: pointer;
		font-family: Inter, sans-serif;
		font-weight: 600;
		font-size: 0.78rem;
		padding: 0.5rem 0.875rem;
		border-radius: 999px;
		color: var(--core-text-soft);
		transition: 0.18s;
	}

	.chip:hover {
		color: #fff;
	}

	.chip.is-active {
		color: var(--brandDarkBlue);
	}
</style>
