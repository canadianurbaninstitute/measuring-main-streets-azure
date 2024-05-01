<script>
	import Arrow from './ui/Arrow.svelte';

	export let name;
	export let location;
	export let outline;
	export let bg = '';
</script>

<div class="blueprint" style="background: linear-gradient(
	rgba(255, 255, 255, 0.7),
	rgba(255, 255, 255, 0.5),
	rgba(255, 255, 255, 0.7)), url({bg});background-color: white;
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;">
	<div class="title">
		<img src={outline} alt="street" />
		<h1>
			{name}
		</h1>
		<h2>
			{location}
		</h2>
	</div>
</div>

<style>
	.title {
		color: white;
		position: relative;
		height: 20%; /* background-color: rgba(255, 255, 255, 1); */
		padding: 5em 0 5em 0;
	}

	.title h1 {
		margin: 0 auto;
		font-family: 'Gelasio', serif;
		font-weight: 400;
		color: var(--brandDarkBlue);
		padding: 0.5em 0 0;
		display: flex;
		flex-direction: column;
	}

	.title h2 {
		padding-top: 1em;
		margin: 0 auto;
		font-family: 'Inter', sans-serif;
		font-weight: 400;
		line-height: 30px;
		color: var(--brandDarkBlue);
        letter-spacing: -0.1rem;
	}

	.blueprint {
		display: flex;
		flex-direction: column;
		align-items: center;
		border-bottom: 1px solid #ddd;
		padding: 2.5em;

	}



	@media only screen and (min-width: 768px) {
		.blueprint {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: center;
			padding: 0 0 0 5em;
			border-bottom: 1px solid #ddd;
		}
	}
</style>
