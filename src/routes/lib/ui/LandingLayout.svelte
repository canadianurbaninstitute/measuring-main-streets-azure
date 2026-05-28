<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Icon from '@iconify/svelte';
	import getTagColor from '../helpers/getTagColor';
	import LandingCard from './LandingCard.svelte';
	import TabNav from './TabNav.svelte';

	// Define types for item structure
	interface ItemTag {
		text: string;
	}

	interface GridItem {
		title: string;
		description: string;
		tags?: (string | ItemTag)[];
		[key: string]: any; // Allows passing down rest properties via {...item} safely
	}

	interface TabData {
		value: string;
		description: string;
		items: GridItem[];
		categories: string[];
	}

	// Explicitly define Component Props
	interface Props {
		title?: string;
		description?: string | string[];
		items?: GridItem[];
		categories?: string[];
		tabs?: TabData[];
		activeTab?: string;
		syncUrl?: boolean;
	}

	let {
		title = '',
		description = [''],
		items = [],
		categories = [],
		tabs = [],
		activeTab = $bindable(''),
		syncUrl = false
	}: Props = $props();

	let searchTerm = $state('');
	let activeCategory = $state('All');

	// Initial load from URL
	if (syncUrl) {
		const urlTag = page.url.searchParams.get('tag');
		if (urlTag) activeCategory = urlTag;
	}

	// In tab mode, derive content from the active tab object
	let activeTabData = $derived(tabs.find((t) => t.value === activeTab) ?? null);
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
					{@html activeTabData?.description ?? ''}
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
		<div class="tab-description">{@html description}</div>

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
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 3rem;
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
