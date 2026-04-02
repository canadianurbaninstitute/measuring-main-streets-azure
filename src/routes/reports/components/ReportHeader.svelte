<script>
	let {
		id = '',
		reporttype = '',
		logo = '',
		eyebrow = '',
		title = 'Report Title',
		subtitle = '',
		backgroundImage = '',
		backgroundOpacity = 0.1
	} = $props();

	import SoC from '../assets/SoC.svg';
	import UofT from '../assets/UofT.svg';
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
				{#if logo == 'soc'}
					<div class="logo-row">
						<a href="https://schoolofcities.utoronto.ca/">
							<img src={UofT} alt="University of Toronto logo" width="120" />
						</a>
						<a href="https://schoolofcities.utoronto.ca/">
							<span class="text-3xl font-thin" style="color: var(--brandDarkBlue)">|</span>
						</a>
						<a href="https://schoolofcities.utoronto.ca/">
							<img src={SoC} alt="School of Cities logo" width="120" />
						</a>
					</div>
				{/if}
				<div class="title-group">
					<div class="reporttype">{reporttype}</div>
					<h1 class="eyebrow">{eyebrow}</h1>
					<h1 class="title">{title}</h1>
				</div>
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
		align-items: flex-end; /* align to bottom = aligns to title */
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
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		min-height: 40vh;
	}
	.logo-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0 0 6rem 0;
	}

	.title-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.reporttype {
		font-size: clamp(1rem, 4vw, 1.75rem);
		margin: 0 0 6rem 0;
		color: var(--brandDarkBlue);
		text-transform: uppercase;
		font-weight: 800;
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
