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

<div class="vis-link-container">
	<a {href} {target} class="vis-link">
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
	</a>
</div>

<style>
	.vis-link-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		min-height: 250px;
	}

	.vis-link {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		background-color: var(--brandLightBlue);
		color: white;
		padding: 1.1rem 2.2rem;
		border-radius: 0.6rem;
		text-decoration: none;
		font-weight: 700;
		font-size: 1.15rem;
		transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		box-shadow: 0 4px 14px rgba(0, 173, 242, 0.25);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.vis-link:hover {
		background-color: var(--brandDarkBlue);
		transform: translateY(-3px) scale(1.02);
		box-shadow: 0 8px 20px rgba(0, 41, 64, 0.3);
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
