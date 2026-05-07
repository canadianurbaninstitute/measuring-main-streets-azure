<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
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

	// Initial load from URL
	if (syncUrl) {
		const urlTag = page.url.searchParams.get('tag');
		if (urlTag) activeCategory = urlTag;
	}

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

	/**
	 * Map tag text to predefined colors (sync with LandingCard.svelte)
	 */
	const getTagColor = (tag) => {
		const text = tag.toLowerCase();
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

	// Sync activeCategory → URL
	$effect(() => {
		if (!syncUrl || !goto || !page) return;
		const current = page.url.searchParams.get('tag') || 'All';
		if (activeCategory !== current) {
			const newUrl = new URL(page.url.href);
			if (activeCategory === 'All') {
				newUrl.searchParams.delete('tag');
			} else {
				newUrl.searchParams.set('tag', activeCategory);
			}
			goto(newUrl.toString(), { replaceState: true, keepFocus: true, noScroll: true });
		}
	});

	// Reset search and category filter when tab changes
	// We use a flag and check if the tab changed to avoid resetting on mount
	let lastTab = $state(activeTab);
	let isFirstRun = true;
	$effect(() => {
		const currentTab = activeTab;
		if (isFirstRun) {
			lastTab = currentTab;
			isFirstRun = false;
			return;
		}
		if (currentTab !== lastTab) {
			searchTerm = '';
			activeCategory = 'All';
			lastTab = currentTab;
		}
	});
</script>

<div class="landing-container container">
	<header class="landing-header">
		<h1>{title}</h1>
	</header>

	{#if tabs && tabs.length > 0}
		<TabNav {tabs} bind:activeTab {syncUrl} bg="slate-50">
			{#snippet children()}
				<div class="w-full">
					<Collapsible paragraphs={activeTabData.description} defaultOpen={false} />
				</div>
				<div class="flex-1">
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
									style={activeCategory === 'All'
										? 'background-color: var(--brandDarkBlue); border-color: var(--brandDarkBlue); color: white;'
										: ''}
									onclick={() => (activeCategory = 'All')}
								>
									All
								</button>
								{#each activeCategories as category}
									<button
										class="pill"
										class:active={activeCategory === category}
										style="
                                            --tag-color: {getTagColor(category)};
                                            background-color: {activeCategory === category
											? 'var(--tag-color)'
											: 'color-mix(in srgb, var(--tag-color), white 90%)'};
                                            border-color: {activeCategory === category
											? 'var(--tag-color)'
											: 'color-mix(in srgb, var(--tag-color), white 70%)'};
                                            color: {activeCategory === category
											? 'white'
											: 'color-mix(in srgb, var(--tag-color), black 20%)'};
                                        "
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
						style={activeCategory === 'All'
							? 'background-color: var(--brandDarkBlue); border-color: var(--brandDarkBlue); color: white;'
							: ''}
						onclick={() => (activeCategory = 'All')}
					>
						All
					</button>
					{#each categories as category}
						<button
							class="pill"
							class:active={activeCategory === category}
							style="
                                --tag-color: {getTagColor(category)};
                                background-color: {activeCategory === category
								? 'var(--tag-color)'
								: 'color-mix(in srgb, var(--tag-color), white 90%)'};
                                border-color: {activeCategory === category
								? 'var(--tag-color)'
								: 'color-mix(in srgb, var(--tag-color), white 70%)'};
                                color: {activeCategory === category
								? 'white'
								: 'color-mix(in srgb, var(--tag-color), black 20%)'};
                            "
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
		/* Base active styles are now handled by inline styles for dynamic colors */
		color: white;
	}

	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 2rem;
	}

	@media (max-width: 768px) {
		.landing-header h1 {
			font-size: 2.5rem;
		}
		.landing-container {
			padding: 2rem 0.5rem;
		}
	}
</style>
