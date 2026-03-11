<script>
	export let id = '';
	export let eyebrow = '';
	export let title = 'Report Title';
	export let subtitle = '';
	export let backgroundImage = '';
	export let backgroundOpacity = 0.1;
</script>

<section {id}>
	<header
		class="report-header"
		style={`
		${backgroundImage ? `--bg-image: url(${backgroundImage});` : ''}
		--bg-opacity: ${backgroundOpacity};
	`}
	>
		<div class="header-body">
			<div class="headline">
				<h1 class="eyebrow">{eyebrow}</h1>
				<h1 class="title">{title}</h1>
			</div>

			<div class="description">
				<div class="subtitle">
					{subtitle} <br /><br />
				</div>
				<p class="scroll-hint">LEARN MORE ↓</p>
			</div>
		</div>
	</header>
</section>

<style>
	.report-header {
		position: relative;
		min-height: 100svh;
		display: flex;
		align-items: center; /* vertical center */
		justify-content: center; /* horizontal center */
		padding: 4rem clamp(1.5rem, 6vw, 6rem);
		background-color: white;
		overflow: hidden;
	}

	.report-header::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image: var(--bg-image);
		background-size: cover;
		background-position: center;
		opacity: var(--bg-opacity);
		z-index: 0;
	}

	.header-body {
		position: relative;
		z-index: 1;

		display: flex;
		align-items: baseline; /* same text baseline */
		justify-content: center;

		gap: clamp(1rem, 3vw, 2rem);
	}

	@media (max-width: 700px) {
		.header-body {
			flex-wrap: wrap;
		}
	}
	.headline {
		width: 100%;
		max-width: 1000px;
	}
	.eyebrow {
		font-size: clamp(1rem, 7vw, 3rem);
		margin: 0;
		color: var(--brandLightBlue);
	}

	.title {
		font-size: clamp(2.8rem, 7vw, 6rem);
		margin: 0;
	}

	.description {
		display: flex;
		flex-direction: column;
		align-items: left;
		width: 100%;
		max-width: 400px;
	}

	.subtitle {
		font-size: clamp(1rem, 2vw, 1.2rem);
		margin: 0;
		opacity: 0.8;
	}
	.scroll-hint {
		font-size: 1rem;
		letter-spacing: 0.1em;
		color: var(--foreground-alt);
		animation: nudge 2s ease-in-out infinite;
	}
	@keyframes nudge {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(5px);
		}
	}
</style>
