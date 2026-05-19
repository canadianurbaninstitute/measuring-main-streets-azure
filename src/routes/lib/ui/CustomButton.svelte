<script lang="ts">
	/**
	 * CustomButton.svelte
	 *
	 * A versatile button/link component based on VisLink.
	 *
	 * Iconify support: pass iconBeforeName or iconAfterName (e.g. 'mdi:arrow-left')
	 */
	import Icon from '@iconify/svelte';
	let {
		href = '',
		label = 'Learn More',
		target = '_blank',
		variant = 'primary', // primary, secondary, ghost
		color = 'blue', // blue, darkblue, green, pink, orange, purple, red, yellow
		size = 'md', // sm, md, lg
		onclick = null,
		icon = true, // legacy: trailing arrow
		iconBefore = null, // custom leading icon (component or SVG)
		iconAfter = null, // custom trailing icon (component or SVG)
		iconBeforeName = '', // Iconify icon name (e.g. 'mdi:arrow-left')
		iconAfterName = '', // Iconify icon name (e.g. 'mdi:arrow-right')
		disabled = false,
		className = '',
		fullWidth = false
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
			class="custom-button {variant} size-{size} {disabled ? 'disabled' : ''} {fullWidth
				? 'full-width'
				: ''}"
			style="--btn-color: {bgColor}; --btn-hover-color: {hoverColor};"
			{disabled}
		>
			{#if iconBeforeName}
				<Icon icon={iconBeforeName} width={18} height={18} class="icon-before" />
			{:else if iconBefore}
				{@html iconBefore}
			{/if}
			<span class="label">{label}</span>
			{#if iconAfterName}
				<Icon icon={iconAfterName} width={18} height={18} class="icon-after" />
			{:else if iconAfter}
				{@html iconAfter}
			{:else if icon}
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
		class="custom-button {variant} size-{size} {className} {disabled ? 'disabled' : ''} {fullWidth
			? 'full-width'
			: ''}"
		style="--btn-color: {bgColor}; --btn-hover-color: {hoverColor};"
		{onclick}
		{disabled}
	>
		{#if iconBeforeName}
			<div class="icon-before">
				<Icon icon={iconBeforeName} width={18} height={18} class="icon-before" />
			</div>
		{:else if iconBefore}
			{@html iconBefore}
		{/if}
		<span class="label">{label}</span>
		{#if iconAfterName}
			<div class="icon-after">
				<Icon icon={iconAfterName} width={18} height={18} class="icon-after" />
			</div>
		{:else if iconAfter}
			{@html iconAfter}
		{:else if icon}
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

	.custom-button.full-width {
		width: 100%;
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
		transform: translateY(-1px) scale(1.01);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
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
		/* transform: translateY(-2px); */
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
		/* transform: translateY(-1px); */
	}

	.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		pointer-events: none;
	}

	.icon-before {
		transition: transform 0.3s ease;
	}

	.icon-after {
		transition: transform 0.3s ease;
	}

	svg {
		transition: transform 0.3s ease;
	}

	.custom-button:hover:not(.disabled) svg {
		transform: translateX(4px);
	}

	.custom-button:hover:not(.disabled) .icon-after {
		transform: translateX(4px);
	}

	.custom-button:hover:not(.disabled) .icon-before {
		transform: translateX(-4px);
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
