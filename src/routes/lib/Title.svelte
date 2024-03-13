<script>
	import Arrow from './ui/Arrow.svelte';

	export let name;
	export let location;
	export let outline;
</script>

<div class="blueprint">
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
		font-size: 3em;
		color: var(--brandDarkBlue);
		padding: 0.5em 0 0;
		display: flex;
		flex-direction: column;
	}

	.title h2 {
		padding-top: 20px;
		margin: 0 auto;
		font-family: 'Inter', sans-serif;
		font-weight: 400;
		line-height: 30px;
		color: var(--brandDarkBlue);
        letter-spacing: -0.1rem;
	}

	/*MOBILE DEVICE*/

	@media only screen and (max-width: 968px) {
		.title h1 {
			font-size: 42px;
		}
		.title h2 {
			font-size: 18px;
			line-height: 30px;
		}

		.blueprint {
			background-color: white;
			background: linear-gradient(
				rgba(255, 255, 255, 0.95),
				rgba(255, 255, 255, 0.6),
				rgba(255, 255, 255, 0.95)
			);
			background-position: center;
			background-repeat: no-repeat;
			background-size: cover;
			display: flex;
			flex-direction: column;
			align-items: center;
			border-bottom: 1px solid #ddd;
		}
	}

	/* url('https://i.imgur.com/DXGEpQB.png') */

	@media only screen and (min-width: 768px) {
		.blueprint {
			background-color: white;
			background: linear-gradient(
					rgba(255, 255, 255, 0.95),
					rgba(255, 255, 255, 0.6),
					rgba(255, 255, 255, 0.95)
				),
				url('https://i.imgur.com/DXGEpQB.png');
			background-position: center;
			background-repeat: no-repeat;
			background-size: cover;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: center;
			padding: 0 0 0 5em;
			border-bottom: 1px solid #ddd;
		}
	}
</style>
