<script>
	export let title = 'Report Title';
	export let subtitle = '';
	export let byline = '';
	export let date = '';
	export let backgroundImage = '';
</script>

<header class="report-header" style={backgroundImage ? `--bg-image: url(${backgroundImage})` : ''}>
	<div class="header-inner">
		<div class="header-meta">
			{#if date}<span class="date">{date}</span>{/if}
			{#if byline}<span class="byline">By {byline}</span>{/if}
		</div>

		<div class="header-body">
			<h1 style="color: var(--brandDarkBlue);" class="title">{title}</h1>

			<div class="header-right">
				{#if subtitle}
					<p class="subtitle">{subtitle}</p>
				{/if}
				<div class="scroll-hint">
					<span>Scroll to explore</span>
					<svg width="16" height="24" viewBox="0 0 16 24" fill="none">
						<rect x="6.5" y="3" width="3" height="6" rx="1.5" fill="currentColor" opacity="0.6" />
						<rect
							x="0.5"
							y="0.5"
							width="15"
							height="23"
							rx="7.5"
							stroke="currentColor"
							opacity="0.4"
						/>
						<path
							d="M8 18l-3-3m3 3l3-3"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							opacity="0.6"
						/>
					</svg>
				</div>
			</div>
		</div>
	</div>
</header>

<style>
	.report-header {
		position: relative;
		min-height: 100svh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 4rem clamp(1.5rem, 6vw, 6rem);
		background-color: white; /* ← was var(--color-ink) */
		background-image: var(--bg-image);
		background-size: cover;
		background-position: center;
		overflow: hidden;
	}

	.report-header::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			color-mix(in srgb, var(--color-ink) 90%, transparent) 0%,
			color-mix(in srgb, var(--color-ink) 40%, transparent) 60%,
			transparent 100%
		);
		opacity: 0.8; /* adjust opacity here */
	}

	.header-inner {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 1200px;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.header-meta {
		display: flex;
		gap: 1.5rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-accent);
	}

	.header-body {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(2rem, 5vw, 5rem);
		align-items: stretch;
	}

	.title {
		font-family: var(--font-display);
		font-size: clamp(2.8rem, 7vw, 6rem);
		font-weight: 700;
		line-height: 1;
		color: #fff;
		margin: 0;
		letter-spacing: -0.02em;
		align-self: center;
	}

	.header-right {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.subtitle {
		font-family: var(--font-body);
		font-size: clamp(1rem, 2vw, 1.25rem);
		line-height: 1.6;
		color: color-mix(in srgb, var(#fff) 70%, transparent);
		margin: 0;
	}

	.scroll-hint {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(#fff) 50%, transparent);
		animation: bob 2.5s ease-in-out infinite;
		margin-top: 2rem;
	}

	@media (max-width: 640px) {
		.header-body {
			grid-template-columns: 1fr;
		}
		.scroll-hint {
			margin-top: 1.5rem;
		}
	}

	@keyframes bob {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(6px);
		}
	}
</style>
