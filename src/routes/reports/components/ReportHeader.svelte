<script>
	export let title = 'Report Title';
	export let subtitle = '';
	export let backgroundImage = '';
	export let backgroundOpacity = 0.1;
</script>

<header
	class="report-header"
	style={`
		${backgroundImage ? `--bg-image: url(${backgroundImage});` : ''}
		--bg-opacity: ${backgroundOpacity};
	`}
>
	<div class="header-body">
		<h1 class="title">{title}</h1>

		<p class="subtitle">
			{subtitle} <br /><br />
			LEARN MORE
		</p>
	</div>
</header>

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

	.title {
		font-size: clamp(2.8rem, 7vw, 6rem);
		margin: 0;
	}

	.subtitle {
		font-size: clamp(1rem, 2vw, 1.2rem);
		margin: 0;
		opacity: 0.8;
	}
</style>
