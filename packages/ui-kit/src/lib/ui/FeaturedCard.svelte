<script>
	import Icon from '@iconify/svelte';

	export let link = '#';
	export let image = '';
	export let title = '';
	export let description = '';
	export let tags = [];

	const getTagColor = (tag) => {
		if (typeof tag === 'object' && tag.color) return tag.color;
		const text = (typeof tag === 'object' ? tag.text : tag).toLowerCase();
		if (text.includes('mapping')) return 'var(--brandPink)';
		if (text.includes('resilience')) return 'var(--brandBlue)';
		if (text.includes('transit')) return 'var(--brandDarkGreen)';
		if (text.includes('graphing')) return 'var(--brandOrange)';
		if (text.includes('case study')) return 'var(--brandGreen)';
		if (text.includes('tool')) return 'var(--color-yellow-200)';
		return 'var(--brandLightBlue)';
	};

	const getTagText = (tag) => (typeof tag === 'object' ? tag.text : tag);
</script>

<a href={link} class="card-link featured">
	<article class="featured-card">
		<div class="badge">Featured</div>
		<div class="card-image-container">
			<img src={image} alt={title} />
		</div>
		<div class="card-content">
			<div class="card-tags">
				{#each tags as tag}
					<span class="tag" style="background-color: {getTagColor(tag)}">
						{getTagText(tag)}
					</span>
				{/each}
			</div>
			<h3 class="card-title">{title}</h3>
			<p class="card-description">{description}</p>

			<div class="card-footer">
				<span class="cta">
					Explore Project <Icon icon="ph:arrow-right-bold" />
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
		width: 100%;
		max-width: 900px;
		margin-bottom: 2rem;
	}

	.featured-card {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(20px);
		border-radius: 1.5rem;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		min-height: 400px;
		border: 1px solid rgba(255, 255, 255, 0.3);
		position: relative;
		transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
	}

	@media (min-width: 768px) {
		.featured-card {
			flex-direction: row;
		}
	}

	.badge {
		position: absolute;
		top: 1.5rem;
		left: 1.5rem;
		background: var(--brandDarkBlue);
		color: white;
		padding: 0.4rem 1rem;
		border-radius: 2rem;
		font-size: 0.75rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 1px;
		z-index: 10;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.card-link:hover .featured-card {
		transform: translateY(-8px) scale(1.01);
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
		border-color: rgba(255, 255, 255, 0.5);
	}

	.card-image-container {
		flex: 1;
		min-height: 250px;
		position: relative;
		overflow: hidden;
	}

	.card-image-container img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.6s ease;
	}

	.card-link:hover img {
		transform: scale(1.05);
	}

	.card-content {
		flex: 1.2;
		padding: 2.5rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.4) 100%);
	}

	.card-tags {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.25rem;
	}

	.tag {
		padding: 0.3rem 0.8rem;
		border-radius: 2rem;
		color: #fff;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.card-title {
		font-size: 2.25rem;
		color: var(--brandDarkBlue);
		margin: 0 0 1rem 0;
		line-height: 1.1;
		font-weight: 800;
	}

	.card-description {
		font-size: 1.1rem;
		color: #444;
		line-height: 1.6;
		margin-bottom: 2rem;
	}

	.cta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: var(--brandDarkBlue);
		font-weight: 800;
		font-size: 1rem;
		width: fit-content;
		padding: 0.75rem 0;
		border-bottom: 3px solid var(--brandDarkBlue);
		transition: gap 0.2s ease;
	}

	.card-link:hover .cta {
		gap: 1.25rem;
	}
</style>
