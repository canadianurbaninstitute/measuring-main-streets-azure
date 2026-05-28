<script lang="ts">
	interface Props {
		id?: string;
		title?: string;
		finding1?: string;
		description1?: string;
		flip1?: boolean;
		back1?: string;
		finding2?: string;
		description2?: string;
		flip2?: boolean;
		back2?: string;
		finding3?: string;
		description3?: string;
		flip3?: boolean;
		back3?: string;
		link1?: string;
		link2?: string;
		link3?: string;
		newTab1?: boolean;
		newTab2?: boolean;
		newTab3?: boolean;
		image1?: string;
		image2?: string;
		image3?: string;
	}

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
		back3 = '',
		link1 = '',
		link2 = '',
		link3 = '',
		newTab1 = false,
		newTab2 = false,
		newTab3 = false,
		image1 = '',
		image2 = '',
		image3 = ''
	}: Props = $props();
</script>

{#snippet Card(
	finding: string,
	description: string,
	flip: boolean,
	backText: string,
	link: string,
	newTab: boolean,
	image: string
)}
	{#if link}
		<a href={link} target={newTab ? '_blank' : '_self'} class="card-wrapper">
			{@render CardInner(finding, description, flip, backText, link, image)}
		</a>
	{:else}
		<div class="card-wrapper">
			{@render CardInner(finding, description, flip, backText, undefined, image)}
		</div>
	{/if}
{/snippet}

{#snippet CardInner(
	finding: string,
	description: string,
	flip: boolean,
	backText: string,
	link: string | undefined,
	image: string
)}
	<div class={flip ? 'flip-card' : 'card'}>
		{#if flip}
			<div class="flip-card-inner">
				<div class="flip-card-front">
					<h2 style="color: white; margin-bottom: 20px;">{finding}</h2>
					{#if image}<img src={image} alt="" class="card-image" />{/if}
					<h3 style="color: white;">{description}</h3>
				</div>
				<div class="flip-card-back">
					<p>{backText}</p>
				</div>
			</div>
		{:else}
			<h2 style="margin-bottom: 20px;">{finding}</h2>
			{#if image}<img src={image} alt="" class="card-image" />{/if}
			<h3 style="color: white;">{description}</h3>
			{#if link}<p style="color: var(--color-blue-50);" class="learn-more">Learn More →</p>{/if}
		{/if}
	</div>
{/snippet}

<section {id} class="findings">
	<div class="inner">
		<h1 class="title uppercase">{title}</h1>
		<div class="cards">
			{@render Card(finding1, description1, flip1, back1, link1, newTab1, image1)}
			{@render Card(finding2, description2, flip2, back2, link2, newTab2, image2)}
			{@render Card(finding3, description3, flip3, back3, link3, newTab3, image3)}
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
	.card-wrapper {
		text-decoration: none;
		display: block;
		height: 100%;
	}
	.card {
		background-color: #0a1f44;
		color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border-radius: 0.5rem;
		padding: 2rem 1.5rem;
		height: 100%;
		box-sizing: border-box;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}
	.card-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		margin-bottom: 1rem;
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
	.flip-card:hover .flip-card-inner {
		transform: rotateY(180deg);
	}
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
	.learn-more {
		margin-top: 1rem;
		text-underline-offset: 4px;
		font-size: clamp(0.8rem, 2.5vw, 1rem);
		letter-spacing: 0.18em;
		font-weight: 600;
		text-transform: uppercase;
	}
</style>
