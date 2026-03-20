<script>
	let { 
		id = '', 
		title = 'Key Findings', 
		finding1 = '', 
		description1 = '', 
		finding2 = '', 
		description2 = '', 
		finding3 = '', 
		description3 = '' 
	} = $props();
</script>

<section {id} class="findings">
	<div class="inner">
		<h1 class="title">{title}</h1>
		<div class="cards">
			<div class="card">
				<h2>{finding1}</h2>
				<h3 style="color: white;">{description1}</h3>
			</div>

			<div class="flip-card">
				<div class="flip-card-inner">
					<div class="flip-card-front">
						<h2 style="color: white;">{finding2}</h2>
						<h3 style="color: white;">{description2}</h3>
					</div>
					<div class="flip-card-back">
						<p>
							Complete communities may offer people local options for fulfilling their basic
							day-to-day needs, but the extent to which people make the local choice largely depends
							on how walkable the community is.
						</p>
					</div>
				</div>
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
		box-sizing: border-box;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
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
