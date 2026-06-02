<script>
	import Icon from '@iconify/svelte';

	let {
		text = 'Vibrant main streets need local retailers, not just large corporate grocery stores.',
		author = null,
		isDivisive = false,
		colorFam = 'blue'
	} = $props();

	// Derived colors based on family
	const colors = {
		blue: { main: '#00adf2', light: 'var(--color-blue-50)', dark: 'var(--color-blue-800)' },
		green: { main: '#43b171', light: 'var(--color-green-50)', dark: 'var(--color-green-800)' },
		pink: { main: '#db3069', light: 'var(--color-pink-50)', dark: 'var(--color-pink-800)' },
		orange: { main: '#f45d01', light: 'var(--color-orange-50)', dark: 'var(--color-orange-800)' }
	};

	const theme = $derived(isDivisive ? colors.orange : colors[colorFam] || colors.blue);
</script>

<div
	class="quote-container"
	class:divisive={isDivisive}
	style="--accent: {theme.main}; --lightAccent: {theme.light}; --darkAccent: {theme.dark}"
>
	{#if isDivisive}
		<div class="divisive-flag">
			<Icon icon="mdi:alert-decagram" class="flag-icon" />
			<span>Most Divisive Statement</span>
		</div>
	{/if}

	<div class="bubble">
		<div class="quote-mark open">“</div>
		<p class="quote-text">“{text}”</p>
		<div class="quote-mark close">”</div>
	</div>

	{#if author}
		<div class="author-info">
			<div class="author-line"></div>
			<span class="author-name">{author}</span>
		</div>
	{/if}
</div>

<style>
	.quote-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 500px;
		margin: 0 auto;
		position: relative;
		font-family: 'Inter', sans-serif;
		min-height: 0;
		flex: 1 1 auto;
	}

	.bubble {
		background: linear-gradient(135deg, var(--lightAccent) 0%, #ffffff 100%);
		padding: 0.75rem 1.25rem;
		border-radius: 1rem;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.05),
			0 2px 4px -1px rgba(0, 0, 0, 0.02);
		border: 1px solid var(--lightAccent);
		/* border-top: 3px solid var(--accent); */
		position: relative;
		transition: transform 0.3s ease;
		min-height: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1 1 auto;
	}

	.quote-container:hover .bubble {
		transform: translateY(-2px);
	}

	.quote-text {
		font-size: clamp(0.8rem, 1.8vw, 1rem);
		line-height: 1.3;
		color: var(--darkAccent);
		font-weight: 600;
		margin: 0;
		text-align: center;
		position: relative;
		z-index: 1;
	}

	.quote-mark {
		position: absolute;
		font-family: 'Gelasio', serif;
		font-size: 3rem;
		line-height: 1;
		color: var(--accent);
		opacity: 0.1;
		user-select: none;
		pointer-events: none;
	}

	.quote-mark.open {
		top: -0.25rem;
		left: 0.25rem;
	}

	.quote-mark.close {
		bottom: -1rem;
		right: 0.25rem;
	}

	.author-info {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 0.5rem;
		gap: 0.5rem;
	}

	.author-line {
		width: 16px;
		height: 1px;
		background: var(--accent);
		opacity: 0.5;
	}

	.author-name {
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #64748b;
	}

	/* ── Divisive Flag ────────────────────────────────────────── */
	.divisive-flag {
		position: absolute;
		top: -8px;
		left: 50%;
		transform: translateX(-50%);
		background: var(--brandOrange);
		color: white;
		padding: 2px 8px;
		border-radius: 20px;
		font-size: 0.6rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		display: flex;
		align-items: center;
		gap: 4px;
		box-shadow: 0 4px 6px -1px rgba(244, 93, 1, 0.3);
		z-index: 10;
		white-space: nowrap;
	}

	:global(.flag-icon) {
		font-size: 0.8rem;
	}

	.quote-container.divisive .bubble {
		border-color: var(--brandOrange);
		box-shadow: 0 4px 6px -1px rgba(244, 93, 1, 0.05);
	}

	.quote-container.divisive {
		--accent: var(--brandOrange);
	}

	@media (max-width: 640px) {
		.bubble {
			padding: 0.75rem 1rem;
		}

		.quote-mark {
			display: none;
		}

		.quote-text {
			font-size: 0.9rem;
		}
	}
</style>
