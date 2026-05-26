<script lang="ts">
	interface OptionItem {
		value: string;
		name: string;
		image?: string;
	}

	interface Props {
		options?: OptionItem[];
		selected?: string | null;
	}

	let { options = [], selected = $bindable(null) }: Props = $props();

	function select(value: string) {
		selected = value;
	}
</script>

<div class="card-selector mx-auto">
	{#each options as option}
		<button
			class="card"
			class:selected={selected === option.value}
			onclick={() => select(option.value)}
			aria-pressed={selected === option.value}
		>
			<div class="card-image">
				{#if option.image}
					<img src={option.image} alt={option.name} />
				{:else}
					<div class="card-image-placeholder">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
							<rect x="3" y="3" width="18" height="18" rx="3" />
							<circle cx="8.5" cy="8.5" r="1.5" />
							<path d="M21 15l-5-5L5 21" />
						</svg>
					</div>
				{/if}
			</div>
			<span class="card-label">{option.name}</span>
		</button>
	{/each}
</div>

<style>
	.card-selector {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	.card {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		padding: 10px 10px 12px;
		width: 100px;
		background: #fff;
		border: 1.5px solid #e2e2e8;
		border-radius: 12px;
		cursor: pointer;
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease,
			transform 0.1s ease;
		font-family: inherit;
		outline: none;
		text-align: center;
		aspect-ratio: 1 / 1;
	}

	.card:hover {
		border-color: #a5a5c0;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.07);
		transform: translateY(-1px);
	}

	.card:focus-visible {
		border-color: var(--brandPink);
		box-shadow: 0 0 0 3px rgba(219, 48, 105, 0.18);
	}

	.card.selected {
		border-color: var(--brandPink);
		background: #fff7fa;
		box-shadow: 0 2px 12px rgba(219, 48, 105, 0.15);
	}

	/* Image area */
	.card-image {
		width: 58px;
		height: 58px;
		border-radius: 7px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fff;
		flex-shrink: 0;
	}

	.card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.card-image-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		color: #b0b0c4;
	}

	.card-image-placeholder svg {
		width: 22px;
		height: 22px;
	}

	.card.selected .card-image {
		background: #fff7fa;
	}

	/* Label */
	.card-label {
		font-size: 14px;
		font-weight: 500;
		text-align: center;
		color: #3c3c52;
		line-height: 1.3;
		letter-spacing: 0.01em;
	}

	.card.selected .card-label {
		color: var(--brandPink);
	}
</style>
