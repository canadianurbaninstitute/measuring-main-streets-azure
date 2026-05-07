<script lang="ts">
	/**
	 * CustomButton.svelte
	 *
	 * A versatile button/link component based on VisLink.
	 */
	let {
		href = '',
		label = 'Learn More',
		target = '_blank',
		variant = 'primary', // primary, secondary, ghost
		color = 'blue', // blue, darkblue, green, pink, orange, purple, red, yellow
		size = 'md', // sm, md, lg
		onclick = null,
		icon = true,
		disabled = false,
		className = ''
	} = $props();

	// Map color props to Tailwind CSS variables
	const colorMap: Record<string, string> = {
		blue: 'var(--color-blue-500)',
		darkblue: 'var(--brandDarkBlue)',
		green: 'var(--color-emerald-500)',
		pink: 'var(--color-pink-500)',
		orange: 'var(--color-orange-500)',
		purple: 'var(--color-violet-500)',
		red: 'var(--color-red-500)',
		yellow: 'var(--color-yellow-500)'
	};

	const hoverColorMap: Record<string, string> = {
		blue: 'var(--color-blue-700)',
		darkblue: 'var(--color-slate-900)',
		green: 'var(--color-emerald-700)',
		pink: 'var(--color-pink-700)',
		orange: 'var(--color-orange-700)',
		purple: 'var(--color-violet-700)',
		red: 'var(--color-red-700)',
		yellow: 'var(--color-yellow-700)'
	};

	const bgColor = $derived(colorMap[color] || colorMap.blue);
	const hoverColor = $derived(hoverColorMap[color] || hoverColorMap.blue);
</script>

{#if href}
	<a {href} {target} aria-label={label} class="custom-button-link {className}">
		<button
			class="custom-button {variant} size-{size} {disabled ? 'disabled' : ''}"
			style="--btn-color: {bgColor}; --btn-hover-color: {hoverColor};"
			{disabled}
		>
			<span class="label">{label}</span>
			{#if icon}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M5 12h14" />
					<path d="m12 5 7 7-7 7" />
				</svg>
			{/if}
		</button>
	</a>
{:else}
	<button
		class="custom-button {variant} size-{size} {className} {disabled ? 'disabled' : ''}"
		style="--btn-color: {bgColor}; --btn-hover-color: {hoverColor};"
		{onclick}
		{disabled}
	>
		<span class="label">{label}</span>
		{#if icon}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M5 12h14" />
				<path d="m12 5 7 7-7 7" />
			</svg>
		{/if}
	</button>
{/if}

<style>
	.custom-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		border-radius: 2rem;
		font-family: 'Inter', sans-serif;
		font-weight: 600;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		border: 2px solid transparent;
		cursor: pointer;
		width: fit-content;
		outline: none;
	}

	/* Sizes */
	.size-sm {
		padding: 0.4rem 1rem;
		font-size: 0.75rem;
	}
	.size-md {
		padding: 0.8rem 1.5rem;
		font-size: 0.9rem;
	}
	.size-lg {
		padding: 1rem 2rem;
		font-size: 1.05rem;
	}

	/* Primary Variant */
	.custom-button.primary {
		background-color: var(--btn-color);
		color: white;
	}
	.custom-button.primary:hover:not(.disabled) {
		background-color: var(--btn-hover-color);
		transform: translateY(-3px) scale(1.02);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
	}

	/* Secondary Variant */
	.custom-button.secondary {
		background-color: transparent;
		border-color: var(--btn-color);
		color: var(--btn-color);
	}
	.custom-button.secondary:hover:not(.disabled) {
		background-color: var(--btn-color);
		border-color: var(--btn-color);
		color: white;
		transform: translateY(-2px);
	}
	.custom-button.secondary:active:not(.disabled) {
		background-color: var(--btn-hover-color);
		border-color: var(--btn-hover-color);
	}

	/* Ghost Variant */
	.custom-button.ghost {
		background-color: transparent;
		color: var(--btn-color);
	}
	.custom-button.ghost:hover:not(.disabled) {
		background-color: rgba(0, 0, 0, 0.05);
		transform: translateY(-1px);
	}

	.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		pointer-events: none;
	}

	svg {
		transition: transform 0.3s ease;
	}

	.custom-button:hover:not(.disabled) svg {
		transform: translateX(4px);
	}

	.custom-button-link {
		text-decoration: none !important;
		display: inline-block;
		border: none !important;
	}

	.label {
		line-height: 1;
	}
</style>
