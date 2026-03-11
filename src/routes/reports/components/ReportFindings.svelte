<script>
	export let id = '';
	export let title = 'Key Findings';
	export let finding1 = '';
	export let description1 = '';
	export let finding2 = '';
	export let description2 = '';
	export let finding3 = '';
	export let description3 = '';
</script>

<section {id} class="findings">
	<div class="inner">
		<h1 class="title">{title}</h1>
		<div class="cards">
			<div class="card">
				<h2>{finding1}</h2>
				<h3 style="color: white;">{description1}</h3>
			</div>
			<div class="card">
				<h2>{finding2}</h2>
				<h3 style="color: white;">{description2}</h3>
			</div>
			<div class="card">
				<h2>{finding3}</h2>
				<h3 style="color: white;">{description3}</h3>
			</div>
		</div>
	</div>
</section>

<style>
	.findings {
		position: relative;
		min-height: 100svh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 4rem clamp(1.5rem, 6vw, 6rem);
		overflow: hidden;
		background-color: #e6f6fd;
	}

	.inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2.5rem;
		width: 100%;
		max-width: 1200px;
	}

	.title {
		margin: 0;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
		width: 100%;
		align-items: stretch;
	}

	.card {
		background-color: #0a1f44;
		color: #fff;
		border-radius: 0.5rem;
		padding: 2rem 1.5rem;
		height: 100%;
		box-sizing: border-box; /* added so padding doesn't cause overflow */
	}

	.card h2 {
		margin: 0 0 0.75rem;
		color: #fff;
	}

	.card p {
		margin: 0;
		color: #fff;
	}
	@media (max-width: 640px) {
		.cards {
			grid-template-columns: 1fr;
		}
	}
</style>
