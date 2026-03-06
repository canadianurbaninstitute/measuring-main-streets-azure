<script>
	import Icon from '@iconify/svelte';
	import Collapsible from './Collapsible.svelte';
	import LandingCard from './LandingCard.svelte';
	import TabNav from './TabNav.svelte';

	let {
		title = '',
		// Legacy flat props (used when no tabs)
		description = [''],
		items = [],
		categories = [],
		// Tab mode: each tab carries its own description, items, categories
		tabs = [],
		activeTab = $bindable(''),
		syncUrl = false
	} = $props();

	let searchTerm = $state('');
	let activeCategory = $state('All');

	// In tab mode, derive content from the active tab object
	let activeTabData = $derived(tabs.find((t) => t.value === activeTab) ?? null);
	let activeDescription = $derived(activeTabData?.description ?? description);
	let activeItems = $derived(activeTabData?.items ?? items);
	let activeCategories = $derived(activeTabData?.categories ?? categories);

	let filteredItems = $derived(
		activeItems.filter((item) => {
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
		})
	);

	// Reset search and category filter when tab changes
	$effect(() => {
		activeTab;
		searchTerm = '';
		activeCategory = 'All';
	});
</script>

<div class="landing-container container">
	<header class="landing-header">
		<h1>{title}</h1>
	</header>

	{#if tabs && tabs.length > 0}
		<TabNav {tabs} bind:activeTab {syncUrl} bg="slate-50">
			{#snippet children()}
				<div class="flex w-full md:gap-20 md:flex-row flex-col">
					<div class="w-fit">
						<Collapsible paragraphs={activeTabData.description} defaultOpen={false} />
					</div>
					<div class="w-fit">
						<div class="controls">
							<div class="search-box">
								<Icon icon="ph:magnifying-glass" height="2rem" color="#555" />
								<input type="text" placeholder="Search..." bind:value={searchTerm} />
							</div>

							{#if activeCategories && activeCategories.length > 0}
								<div class="filter-pills">
									<button
										class="pill"
										class:active={activeCategory === 'All'}
										onclick={() => (activeCategory = 'All')}
									>
										All
									</button>
									{#each activeCategories as category}
										<button
											class="pill"
											class:active={activeCategory === category}
											onclick={() => (activeCategory = category)}
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
				</div>
			{/snippet}
		</TabNav>
	{:else}
		<!-- No tabs: flat layout using legacy props -->
		<p class="tab-description">{description}</p>

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
						onclick={() => (activeCategory = 'All')}
					>
						All
					</button>
					{#each categories as category}
						<button
							class="pill"
							class:active={activeCategory === category}
							onclick={() => (activeCategory = category)}
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
	{/if}
</div>

<style>
	.landing-container {
		padding: 4rem 2rem;
	}

	.landing-header {
		margin-bottom: 3rem;
	}

	.tab-description {
		margin-bottom: 2rem;
		color: #444;
		max-width: 70ch;
		line-height: 1.6;
	}

	.controls {
		margin-bottom: 3rem;
		display: flex;
		flex-direction: column;
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
		.landing-header h1 {
			font-size: 2.5rem;
		}
	}
</style>
