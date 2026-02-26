<script>
	import Icon from '@iconify/svelte';

	export let link = '#';
	export let image = '';
	export let title = '';
	export let description = '';
	export let tags = []; // Array of objects { text: '', color: '' } or just strings

	/**
	 * Map tag text to predefined colors if color is not provided
	 */
	const getTagColor = (tag) => {
		if (typeof tag === 'object' && tag.color) return tag.color;

		const text = (typeof tag === 'object' ? tag.text : tag).toLowerCase();

		if (text.includes('mapping')) return 'var(--brandPink)';
		if (text.includes('resilience')) return 'var(--brandBlue)';
		if (text.includes('transit')) return 'var(--brandDarkGreen)';
		if (text.includes('graphing')) return 'var(--brandOrange)';
		if (text.includes('case study')) return 'var(--brandGreen)';
		if (text.includes('qualitative')) return 'var(--brandPurple)';
		if (text.includes('tool')) return 'var(--color-yellow-200)';

		return 'var(--brandLightBlue)';
	};

	const getTagText = (tag) => (typeof tag === 'object' ? tag.text : tag);
</script>

<a href={link} class="card-link">
	<article class="landing-card">
		<div class="card-image-container">
			<img src={image} alt={title} />
		</div>
		<div class="card-content">
			<h5 class="card-title">{title}</h5>
			<p class="card-description">{description}</p>
			<div class="card-footer flex flex-row justify-between items-baseline w-full">
				{#if tags && tags.length > 0}
					<div class="card-tags">
						{#each tags as tag}
							<span class="tag" style="background-color: {getTagColor(tag)}">
								{getTagText(tag)}
							</span>
						{/each}
					</div>
				{/if}
				<span class="cta">
					Go now <Icon icon="ph:arrow-right-bold" />
				</span>
			</div>
		</div>
	</article>
</a>

<style>
	.card-link {
		text-decoration: none;
		color: inherit;
		display: block;
		height: 100%;
	}

	.landing-card {
		background-color: white;
		width: 450px;
		min-height: 300px;
		border-radius: 0.75rem;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		height: 100%;
		border: 1px solid #eee;
		position: relative;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}

	.landing-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
	}

	.card-image-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #f8f9fa;
		z-index: 0;
	}

	.card-image-container img {
		width: 100%;
		height: 70%;
		object-fit: cover;
	}

	.card-content {
		position: relative;
		z-index: 1;
		padding: 2rem;
		padding-top: 6rem;
		margin-top: auto;
		display: flex;
		flex-direction: column;
		background: linear-gradient(
			to top,
			rgba(255, 255, 255, 1) 0%,
			rgba(255, 255, 255, 1) 50%,
			rgba(255, 255, 255, 0.9) 60%,
			rgba(255, 255, 255, 0.75) 70%,
			rgba(255, 255, 255, 0.5) 80%,
			transparent 100%
		);
	}

	.card-tags {
		display: flex;
		flex-wrap: wrap;
		max-width: 70%;
		gap: 0.5rem;
	}

	.tag {
		padding: 0.2rem 0.6rem;
		border-radius: 1rem;
		color: white;
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}

	.card-title {
		font-size: 1.5rem;
		color: var(--brandDarkBlue);
		max-width: 100%;
	}

	.card-description {
		font-size: 0.9rem;
		color: #666;
		line-height: 1.5;
		margin: 0 0 1.5rem 0;
		flex: 1;
		max-width: 100%;
	}

	.cta {
		display: flex;
		width: fit-content;
		align-items: center;
		gap: 0.5rem;
		color: var(--brandDarkBlue);
		font-weight: 700;
		font-size: 0.85rem;
		margin-top: auto;
		border-bottom: 2px solid var(--brandDarkBlue);
	}
</style>
