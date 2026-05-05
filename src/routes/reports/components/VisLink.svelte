<script>
	/**
	 * VisLink.svelte
	 *
	 * Renders a primary call-to-action button (link) inside a visualization panel.
	 *
	 * Props:
	 *   href   {string}  — internal or external URL (required)
	 *   label  {string}  — text to display on the button (default: 'Learn More')
	 *   target {string}  — link target (default: '_blank')
	 */
	let { href = '', label = 'Learn More', target = '_blank' } = $props();
</script>

<a {href} {target} aria-label={label}>
	<button class="vis-link button-primary flex gap-2 flex-row items-center">
		{label}
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
	</button>
</a>

<style>
	.vis-link {
		width: fit-content;
		margin: 0 auto;
	}
	.vis-link:hover {
		background-color: var(--brandDarkBlue);
		transform: translateY(-3px) scale(1.02);
		box-shadow: 0 8px 20px rgba(0, 41, 64, 0.1);
	}

	.vis-link:active {
		transform: translateY(-1px);
	}

	.vis-link svg {
		transition: transform 0.3s ease;
	}

	.vis-link:hover svg {
		transform: translateX(4px);
	}

	@media (max-width: 768px) {
		.vis-link {
			padding: 1rem 1.8rem;
			font-size: 1.05rem;
		}
	}
</style>
