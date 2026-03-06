<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Tabs } from 'bits-ui';
	import '../../styles.css';

	/**
	 * @typedef {{ label: string, value: string }} Tab
	 *
	 * Props:
	 *   tabs        - array of { label, value }
	 *   activeTab   - bindable, currently active tab value
	 *   syncUrl     - whether to sync active tab to ?tab= query param (default: false)
	 *   paramName   - the URL query param key to use (default 'tab')
	 */
	let {
		tabs = [],
		activeTab = $bindable(''),
		syncUrl = false,
		paramName = 'tab',
		children,
		bg = 'blue-900'
	} = $props();
	if (syncUrl) {
		// Initialise from URL if activeTab not already set
		if (!activeTab) {
			activeTab = page.url.searchParams.get(paramName) || tabs?.[0]?.value || '';
		}
	}

	// Default to first tab if still unset
	if (!activeTab) {
		activeTab = tabs?.[0]?.value || '';
	}

	// Sync activeTab → URL
	$effect(() => {
		if (!syncUrl || !goto || !page) return;
		const current = page.url.searchParams.get(paramName) || tabs?.[0]?.value || '';
		if (activeTab !== current) {
			const newUrl = new URL(page.url.href);
			newUrl.searchParams.set(paramName, activeTab);
			goto(newUrl.toString(), { replaceState: true, keepFocus: true, noScroll: true });
		}
	});
</script>

<Tabs.Root class="tabs-root" bind:value={activeTab}>
	<Tabs.List class="tabs-list">
		{#each tabs as tab}
			<Tabs.Trigger value={tab.value} class="tab-trigger shadow-md">
				{tab.label}
			</Tabs.Trigger>
		{/each}
	</Tabs.List>

	<div
		class="tabs-container"
		style="background-color: {bg.startsWith('#') || bg.startsWith('hsl') || bg.startsWith('rgb')
			? bg
			: `var(--color-${bg})`};"
	>
		{#each tabs as tab}
			<Tabs.Content
				value={tab.value}
				class="tab-content"
				style="background-color: {bg.startsWith('#') || bg.startsWith('hsl') || bg.startsWith('rgb')
					? bg
					: `var(--color-${bg})`};"
			>
				{@render children?.({ activeTab: tab.value })}
			</Tabs.Content>
		{/each}
	</div>
</Tabs.Root>

<style>
	.tabs-container {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		overflow-x: auto;
	}

	/* Custom Scrollbar Styling */
	.tabs-container::-webkit-scrollbar {
		height: 8px;
	}

	.tabs-container::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 10px;
	}

	.tabs-container::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.3);
		border-radius: 10px;
	}

	.tabs-container::-webkit-scrollbar-thumb:hover {
		background: rgba(255, 255, 255, 0.5);
	}

	.tabs-container {
		scrollbar-width: thin;
		scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
	}

	:global(.tabs-list) {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		width: 100%;
	}

	:global(.tab-trigger) {
		flex: 1;
		font-weight: 600;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
		border-radius: 0.5rem 0.5rem 0 0;
	}

	:global(.tab-trigger:not(:first-child)) {
		margin-left: -1rem;
	}

	:global(.tab-trigger[data-state='inactive']) {
		background-color: var(--color-slate-100);
		color: var(--color-slate-900);
	}

	:global(.tab-trigger[data-state='active']) {
		background-color: var(--color-blue-800);
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		color: #fff;
		z-index: 10;
	}

	:global(.tab-trigger:hover) {
		background-color: var(--color-blue-400);
	}

	.tabs-container :global(.tab-content) {
		padding: 2.5rem 2rem;
	}
</style>
