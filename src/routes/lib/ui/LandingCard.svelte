<script lang="ts">
	import Icon from '@iconify/svelte';
	import getTagColor from '../helpers/getTagColor';

	// 1. Define types for complex data shapes
	interface ItemTag {
		text: string;
	}

	type TagType = string | ItemTag;

	// 2. Define the Component Props Interface
	interface Props {
		link?: string;
		image?: string;
		title?: string;
		featured?: boolean;
		description?: string;
		tags?: TagType[];
		minWidth?: number;
		maxWidth?: number;
		logo?: string | string[] | null;
	}

	// 3. Bind the props destructured object to the Props interface
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
	}: Props = $props();

	// 4. Add type safety to the helper function parameter
	const getTagText = (tag: TagType): string => (typeof tag === 'object' ? tag.text : tag);
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
					{#if Array.isArray(logo)}
						{#each logo as singleLogo, i}
							{#if i > 0}
								<span class="logo-divider"></span>
							{/if}
							<img src={singleLogo} alt="Partner logo" />
						{/each}
					{:else}
						<img src={logo} alt="Partner logo" />
					{/if}
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
							<span class="tag" style="background-color: {getTagColor(tag as string)}">
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
	/* Your styles remain unchanged and perfectly valid */
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
		min-width: var(--min-w);
		max-width: var(--max-w);
	}
	@media (max-width: 640px) {
		.landing-card {
			min-width: 200px;
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
		gap: 0.5rem;
	}
	.logo-divider {
		width: 1px;
		height: 20px;
		background-color: #ccc;
		margin: 0 0.25rem;
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
		background: linear-gradient(
			to top,
			rgba(255, 255, 255, 1) 0%,
			rgba(255, 255, 255, 0.95) 20%,
			rgba(255, 255, 255, 0.9) 60%,
			rgba(255, 255, 255, 0.9) 70%,
			rgba(255, 255, 255, 0.8) 80%,
			rgba(255, 255, 255, 0.7) 90%
		);
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
