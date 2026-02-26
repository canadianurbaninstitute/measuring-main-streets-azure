<script>
	import Icon from '@iconify/svelte';
	import LandingCard from './LandingCard.svelte';

	export let title = '';
	export let description = '';
	export let items = []; // Array of { title, description, image, link, tags }
	export let categories = []; // Array of strings for filter pills

	let searchTerm = '';
	let activeCategory = 'All';

	$: filteredItems = items.filter((item) => {
		const matchesSearch =
			item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.description.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesCategory =
			activeCategory === 'All' ||
			(item.tags &&
				item.tags.some((t) => {
					const tagText = typeof t === 'object' ? t.text : t;
					return tagText === activeCategory;
				}));

		return matchesSearch && matchesCategory;
	});
</script>

<div class="landing-container container">
	<header class="landing-header">
		<h1>{title}</h1>
		<p>{description}</p>
	</header>

	<div class="controls">
		<div class="search-box">
			<Icon icon="ph:magnifying-glass" height="2rem" color="#555" />
			<input type="text" placeholder="Search..." bind:value={searchTerm} />
		</div>

		{#if categories && categories.length > 0}
			<div class="filter-pills">
				<button
					class="pill"
					class:active={activeCategory === 'All'}
					on:click={() => (activeCategory = 'All')}
				>
					All
				</button>
				{#each categories as category}
					<button
						class="pill"
						class:active={activeCategory === category}
						on:click={() => (activeCategory = category)}
					>
						{category}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<div class="card-grid">
		{#each filteredItems as item}
			<LandingCard {...item} />
		{/each}
	</div>
</div>

<style>
	.landing-container {
		margin: 0 auto;
		padding: 4rem 2rem;
	}

	.landing-header {
		margin-bottom: 3rem;
	}

	.landing-title {
		font-family: 'Gelasio', serif;
		font-size: 3.5rem;
		color: var(--brandDarkBlue);
		margin-bottom: 1.5rem;
	}

	.landing-intro {
		font-size: 1.1rem;
		line-height: 1.6;
		color: #555;
		max-width: 900px;
	}

	.controls {
		margin-bottom: 3rem;
		gap: 1.5rem;
	}

	.search-box {
		display: flex;
		align-items: center;
		position: relative;
		max-width: 400px;
	}

	.search-box input {
		width: 100%;
		padding: 0.75rem 1rem 0.75rem 2.5rem;
		border-radius: 2rem;
		border: 1px solid #ddd;
		font-family: 'Inter', sans-serif;
		font-size: 0.9rem;
	}

	.filter-pills {
		display: flex;
		flex-wrap: wrap;
		margin-top: 0.5rem;
		gap: 0.5rem;
	}

	.pill {
		padding: 0.5rem 1.25rem;
		border-radius: 2rem;
		border: 1px solid #ddd;
		background: white;
		font-family: 'Inter', sans-serif;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		color: #555;
	}

	.pill:hover {
		border-color: var(--brandLightBlue);
		color: var(--brandLightBlue);
	}

	.pill.active {
		background-color: var(--brandDarkBlue);
		border-color: var(--brandDarkBlue);
		color: white;
	}

	.card-grid {
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;
	}

	@media (max-width: 768px) {
		.landing-title {
			font-size: 2.5rem;
		}
	}
</style>
