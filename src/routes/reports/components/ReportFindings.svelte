<script>
	let {
		id = '',
		title = 'Key Findings',
		finding1 = '',
		description1 = '',
		flip1 = false,
		back1 = '',
		finding2 = '',
		description2 = '',
		flip2 = false,
		back2 = '',
		finding3 = '',
		description3 = '',
		flip3 = false,
		back3 = ''
	} = $props();
</script>

{#snippet Card(finding, description, flip, backText)}
	<div class={flip ? 'flip-card' : 'card'}>
		{#if flip}
			<div class="flip-card-inner">
				<div class="flip-card-front">
					<h2 style="color: white; margin-bottom: 20px;">{finding}</h2>
					<h3 style="color: white;">{description}</h3>
				</div>
				<div class="flip-card-back">
					<p>{backText}</p>
				</div>
			</div>
		{:else}
			<h2 style="margin-bottom: 20px;">{finding}</h2>
			<h3 style="color: white;">{description}</h3>
		{/if}
	</div>
{/snippet}

<section {id} class="findings">
	<div class="inner">
		<h1 class="title">{title}</h1>
		<div class="cards">
			{@render Card(finding1, description1, flip1, back1)}
			{@render Card(finding2, description2, flip2, back2)}
			{@render Card(finding3, description3, flip3, back3)}
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
		box-sizing: border-box;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}

	.card h3,
	.flip-card-front h3 {
		font-size: 1.3rem;
		font-weight: 400;
	}

	.card h2,
	.flip-card-front h2 {
		line-height: 1;
		font-size: 2rem;
	}
	.flip-card {
		background-color: transparent;
		height: 100%;
		border-radius: 0.5rem;
		perspective: 1000px;
	}

	.flip-card-inner {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 180px;
		transition: transform 0.6s;
		transform-style: preserve-3d;
	}

	/* flip interaction */
	.flip-card:hover .flip-card-inner {
		transform: rotateY(180deg);
	}

	/* front + back share card styling */
	.flip-card-front,
	.flip-card-back {
		position: absolute;
		width: 100%;
		height: 100%;
		backface-visibility: hidden;

		background-color: #0a1f44;
		color: #fff;
		border-radius: 0.5rem;
		padding: 2rem 1.5rem;
		box-sizing: border-box;

		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}

	/* lift like other cards */
	.flip-card:hover .flip-card-front,
	.flip-card:hover .flip-card-back {
		box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
	}

	.flip-card-front {
		transform: rotateY(0deg);
	}

	.flip-card-back {
		transform: rotateY(180deg);
	}
	.card:hover {
		transform: translateY(-12px);
		box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
	}

	.card h2 {
		margin: 0 0 0.75rem;
		color: #fff;
	}

	.flip-card-back p {
		margin: 0;
		color: #fff;
	}
	@media (max-width: 640px) {
		.cards {
			grid-template-columns: 1fr;
		}
	}
</style>
