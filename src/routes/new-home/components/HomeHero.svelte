<script>
	// We can use a CSS pattern or a subtle SVG for the background
</script>

<section class="hero-container">
	<div class="background-pattern"></div>
	<div class="content">
		<h1 class="title">
			<span class="top-row">MEASURING</span>
			<span class="bottom-row">
				<span class="blue-text">MAIN</span>
				<div class="dashed-line"></div>
				<span class="blue-text">STREETS</span>
			</span>
		</h1>
	</div>
</section>

<style>
	.hero-container {
		position: relative;
		width: 100%;
		height: 60vh;
		min-height: 400px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		background-color: #fff;
	}

	.background-pattern {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: radial-gradient(var(--brandLightBlue) 0.5px, transparent 0.5px);
		background-size: 30px 30px;
		opacity: 0.1;
		z-index: 1;
	}

	.content {
		position: relative;
		z-index: 2;
		text-align: center;
		padding: 2rem;
	}

	.title {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: 'Inter', sans-serif;
		font-weight: 800;
		font-size: clamp(3rem, 10vw, 8rem);
		line-height: 0.9;
		color: var(--brandDarkBlue);
		margin: 0;
	}

	.top-row {
		letter-spacing: -0.02em;
	}

	.bottom-row {
		display: flex;
		align-items: center;
		gap: 0.2em;
		position: relative;
	}

	.blue-text {
		color: var(--brandLightBlue);
	}

	.dashed-line {
		height: 0.8em;
		width: 4px;
		background-image: linear-gradient(to bottom, var(--brandYellow) 50%, transparent 50%);
		background-size: 100% 20%;
		background-repeat: repeat-y;
	}

	@media (max-width: 768px) {
		.hero-container {
			height: 40vh;
		}
	}
</style>
