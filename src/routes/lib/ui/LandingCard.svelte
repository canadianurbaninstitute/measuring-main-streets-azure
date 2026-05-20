<script>
	import Icon from '@iconify/svelte';

	let {
		link = '#',
		image = '',
		title = '',
		featured = false,
		description = '',
		tags = [],
		minWidth = 0,
		maxWidth = 500,
		logo = null
	} = $props();

	/**
	 * Map tag text to predefined colors if color is not provided
	 */
	const getTagColor = (tag) => {
		if (typeof tag === 'object' && tag.color) return tag.color;

		const text = (typeof tag === 'object' ? tag.text : tag).toLowerCase();

		if (text.includes('mapping')) return 'var(--brandPink)';
		if (text.includes('resilience')) return 'var(--brandBlue)';
		if (text.includes('report')) return 'var(--color-blue-800)';
		if (text.includes('tod')) return 'var(--brandDarkGreen)';
		if (text.includes('graphing')) return 'var(--brandOrange)';
		if (text.includes('case study')) return 'var(--color-green-500)';
		if (text.includes('qualitative')) return 'var(--brandPurple)';
		if (text.includes('school of cities')) return 'var(--color-pink-500)';
		if (text.includes('tool')) return 'var(--color-yellow-200)';
		if (text.includes('regional')) return 'var(--color-blue-800)';
		if (text.includes('complete communities')) return 'var(--color-green-400)';
		if (text.includes('partner')) return 'var(--brandPink)';
		if (text.includes('executive summary')) return 'var(--brandLightBlue)';
		if (text.includes('research brief')) return 'var(--color-green-500)';
		if (text.includes('ghg emissions')) return 'var(--color-green-500)';
		if (text.includes('equity')) return 'var(--color-orange-500)';
		if (text.includes('mobility')) return 'var(--color-yellow-300)';
		if (text.includes('infographic')) return 'var(--color-purple-500)';
		if (text.includes('ontario')) return 'var(--color-purple-500)';
		if (text.includes('quebec')) return 'var(--color-yellow-300)';
		if (text.includes('alberta')) return 'var(--color-green-500)';
		if (text.includes('british columbia')) return 'var(--color-blue-400)';

		return 'var(--brandLightBlue)';
	};

	const getTagText = (tag) => (typeof tag === 'object' ? tag.text : tag);
</script>

<a href={link} class="card-link">
	<article
		class="landing-card"
		style="--min-w: {minWidth}px; --max-w: {maxWidth}px;"
		class:featured
	>
		<div class="card-image-container">
			<img src={image} alt={title} />
			{#if logo}
				<div class="card-logo-overlay">
					<img src={logo} alt="Partner logo" />
				</div>
			{/if}
		</div>
		<div class="card-content">
			<h5 class="card-title">{title}</h5>
			<p class="card-description">{description}</p>
			<div class="card-footer flex flex-row justify-between items-baseline w-full">
				{#if tags && tags.length > 0}
					<div class="card-tags">
						{#if featured}
							<span class="tag" style="background-color: {getTagColor('Featured')}">
								{getTagText('Featured')}
							</span>
						{/if}
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
		width: 100%;
		min-height: 300px;
		border-radius: 0.75rem;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		height: 100%;
		position: relative;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

		/* Desktop sizes from props */
		min-width: var(--min-w);
		max-width: var(--max-w);
	}

	/* Mobile adjustment */
	@media (max-width: 640px) {
		.landing-card {
			min-width: 200px; /* Reduced for mobile */
		}
	}

	.featured {
		outline: 6px solid var(--brandLightBlue);
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
		height: 100%;
		object-fit: cover;
	}

	.card-logo-overlay {
		position: absolute;
		top: 1rem;
		left: 1rem;
		z-index: 2;
		background-color: rgba(255, 255, 255, 0.9);
		padding: 0.5rem 0.75rem;
		border-radius: 0.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		backdrop-filter: blur(4px);
	}

	.card-logo-overlay img {
		max-height: 30px;
		max-width: 150px;
		object-fit: contain;
	}

	.card-content {
		position: relative;
		z-index: 1;
		padding: 2rem;
		padding-top: 1.5rem;
		margin-top: auto;
		display: flex;
		flex-direction: column;
		/* Gradient background for tint */
		background: linear-gradient(
			to top,
			rgba(255, 255, 255, 1) 0%,
			rgba(255, 255, 255, 0.95) 20%,
			rgba(255, 255, 255, 0.9) 60%,
			rgba(255, 255, 255, 0.9) 70%,
			rgba(255, 255, 255, 0.8) 80%,
			rgba(255, 255, 255, 0.7) 90%
		);
		/* The Blur */
		backdrop-filter: blur(4px);
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
		color: #fff;
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
		flex-wrap: nowrap;
		white-space: nowrap;
		gap: 0.5rem;
		color: var(--brandDarkBlue);
		font-weight: 700;
		font-size: 0.85rem;
		margin-top: auto;
		border-bottom: 2px solid var(--brandDarkBlue);
	}
</style>
