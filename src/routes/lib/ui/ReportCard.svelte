<script>
	export let link;
	export let cardImage;
	export let title;
	export let subtitle;
</script>

<a href={link}>
	<div class="card">
		<div class="card-img-container">
			<img src={cardImage} alt="card" />
		</div>
		<div class="card-text-container">
			<div>
				<h2>{title}</h2>
				<h5>{subtitle}</h5>
			</div>
		</div>
	</div>
</a>

<style>
	.card {
		background-color: #fff;
		display: flex;
		flex-direction: row;
		border: 1px solid #ddd;
		border-radius: 1em;
		justify-content: space-between;
		height: 100%;
	}

	.card:hover {
		cursor: pointer;
		background-color: #eee;
		transition: 1ms;
	}

	.card-text-container {
		width: 90%;
		padding: 1em;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	h2 {
		color: var(--brandDarkBlue);
		font-weight: 400;
		font-size: calc(1rem + 1vw);
	}

	h5 {
		font-weight: 400;
	}

	a {
		text-decoration: none;
	}
	
	.card-img-container {
        overflow: hidden;
        padding: 1em;
	}

	.card-img-container img {
		height: 100%;
		width: 100%;
		object-fit: cover;
        overflow: hidden;
		max-height: 100px;
		border-radius: 1em;
	}



</style>
