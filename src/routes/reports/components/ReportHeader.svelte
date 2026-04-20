<script>
	let {
		id = '',
		eyebrow = '',
		subEyebrow = '',
		author = '',
		date = '',
		title = 'Report Title',
		subtitle = '',
		backgroundImage = '',
		backgroundOpacity = 0.1,
		scrollTargetId = 'report-findings',
		reporttype = '',
		logo = '',
		customLogos = []
	} = $props();

	import SoC from '../assets/SoC.svg';
	import UofT from '../assets/UofT.svg';
	import CATCH from '../assets/catch.webp';

	function handleScroll() {
		const target = document.getElementById(scrollTargetId);
		if (target) {
			target.scrollIntoView({ behavior: 'smooth' });
		}
	}
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
				{#if logo === 'soc' || customLogos.length > 0}
					<div class="logo-row">
						{#if logo === 'soc'}
							<a href="https://schoolofcities.utoronto.ca/">
								<img src={UofT} alt="University of Toronto logo" width="120" />
							</a>
							<span class="text-3xl font-thin" style="color: var(--brandDarkBlue)">|</span>
							<a href="https://schoolofcities.utoronto.ca/">
								<img src={SoC} alt="School of Cities logo" width="120" />
							</a>
						{/if}

						{#each customLogos as l, i}
							{#if i > 0 || logo === 'soc'}
								<span class="text-3xl font-thin" style="color: var(--brandDarkBlue)">|</span>
							{/if}
							{#if l.href}
								<a href={l.href} target={l.target || '_blank'} rel="noopener noreferrer">
									<img src={l.src} alt={l.alt || ''} width={l.width || '120'} />
								</a>
							{:else}
								<img src={l.src} alt={l.alt || ''} width={l.width || '120'} />
							{/if}
						{/each}
					</div>
				{:else if logo == 'catch'}
					<div class="logo-row">
						<a href="https://catch-rehac.ca/" target="_blank">
							<img src={CATCH} alt="CATCH logo" width="180" />
						</a>
					</div>
				{/if}
				{#if reporttype}<div class="reporttype">{reporttype}</div>{/if}
				<div>
					{#if eyebrow}<h4 class="eyebrow">{eyebrow}</h4>{/if}
					<h1 class="title">{title}</h1>
					{#if subEyebrow}<h4 class="eyebrow">{subEyebrow}</h4>{/if}
					{#if author}<p class="extra">{author}</p>{/if}
					{#if date}<p class="extra">{date}</p>{/if}
				</div>
			</div>

			<div class="description">
				<div class="subtitle">
					{subtitle} <br /><br />
				</div>
				<button class="scroll-hint" onclick={handleScroll}>LEARN MORE ↓</button>
			</div>
		</div>
	</header>
</section>

<style>
	.scroll-hint {
		background: none;
		border: none;
		padding: 0;
		text-align: left;
		cursor: pointer;
		font-family: inherit;
		width: fit-content;
		font-size: 1rem;
		letter-spacing: 0.1em;
		color: var(--color-slate-700);
		animation: nudge 2s ease-in-out infinite;
	}
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
		align-items: flex-end;
		height: 100%;
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
	.reporttype {
		font-size: clamp(1rem, 4vw, 1.75rem);
		margin: 0 0 6rem 0;
		color: var(--brandDarkBlue);
		text-transform: uppercase;
		font-weight: 800;
	}
	.eyebrow {
		font-size: clamp(1rem, 7vw, 2rem);
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

	.extra {
		font-size: clamp(0.8rem, 2.5vw, 1rem);
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--color-slate-700);
		margin-bottom: 0;
	}

	.extra:first-of-type {
		margin-top: 1rem;
	}

	.subtitle {
		font-size: clamp(1rem, 2vw, 1.2rem);
		margin: 0;
		opacity: 0.8;
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
