<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Combobox } from 'bits-ui';

	interface OptionItem {
		value: string;
		label: string;
	}

	interface GroupedData {
		[groupName: string]: OptionItem[];
	}

	// Define a strict union type so TypeScript knows that if type is 'multiple', selected MUST be string[]
	type Props = {
		handleSelect: (value: any) => void;
		data: OptionItem[] | GroupedData;
		icon: string;
		placeholder: string;
	} & ({ type?: 'single'; selected?: string } | { type: 'multiple'; selected?: string[] });

	let { handleSelect, data, icon, placeholder, selected = '', type = 'single' }: Props = $props();

	let searchValue = $state('');

	function isGroupedData(targetData: OptionItem[] | GroupedData): targetData is GroupedData {
		return !Array.isArray(targetData) && typeof targetData === 'object' && targetData !== null;
	}

	const filteredData = $derived.by(() => {
		if (searchValue === '') {
			return data;
		}

		if (Array.isArray(data)) {
			return data.filter((item) => item.label.toLowerCase().includes(searchValue.toLowerCase()));
		} else {
			const filtered: GroupedData = {};
			for (const [groupName, groupItems] of Object.entries(data)) {
				const filteredGroup = groupItems.filter((item) =>
					item.label.toLowerCase().includes(searchValue.toLowerCase())
				);
				if (filteredGroup.length > 0) {
					filtered[groupName] = filteredGroup;
				}
			}
			return filtered;
		}
	});

	const isGrouped = $derived(isGroupedData(filteredData));

	const hasNoResults = $derived(
		(isGroupedData(filteredData)
			? Object.values(filteredData).flat().length
			: (filteredData as OptionItem[]).length) === 0
	);

	function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
		searchValue = e.currentTarget.value;
	}

	function handleOpenChange(open: boolean) {
		if (!open) {
			searchValue = '';
		}
	}
</script>

{#snippet comboboxInner()}
	<div class="relative">
		<Icon {icon} class="icon-start combobox" />
		<Combobox.Input
			oninput={handleInput}
			class="combobox-input"
			{placeholder}
			aria-label={placeholder}
		/>
		<Combobox.Trigger class="combobox-trigger">
			<Icon icon="mdi:chevron-down" class="icon-end combobox" />
		</Combobox.Trigger>
	</div>

	<Combobox.Portal>
		<Combobox.Content class="combobox-content" sideOffset={10}>
			<Combobox.Viewport class="combobox-viewport">
				{#if isGrouped}
					{#each Object.entries(filteredData) as [group, options]}
						<Combobox.Group>
							<Combobox.GroupHeading class="group-heading">{group}</Combobox.GroupHeading>
							{#each options as { value, label }}
								<Combobox.Item class="combobox-item" {value} {label}>
									{#snippet children({ selected })}
										{label}
										{#if selected}
											<div class="check-icon">
												<Icon icon="mdi:check" aria-label="selected" />
											</div>
										{/if}
									{/snippet}
								</Combobox.Item>
							{/each}
						</Combobox.Group>
					{/each}
				{/if}

				{#if !isGrouped}
					{#each filteredData as OptionItem[] as { value, label }}
						<Combobox.Item class="combobox-item" {value} {label}>
							{#snippet children({ selected })}
								{label}
								{#if selected}
									<div class="check-icon">
										<Icon icon="mdi:check" aria-label="selected" />
									</div>
								{/if}
							{/snippet}
						</Combobox.Item>
					{/each}
				{/if}

				{#if hasNoResults}
					<span class="no-results"> No results found, try again. </span>
				{/if}
			</Combobox.Viewport>
		</Combobox.Content>
	</Combobox.Portal>
{/snippet}

{#if type === 'multiple'}
	<Combobox.Root
		type="multiple"
		bind:value={selected as string[]}
		onValueChange={handleSelect}
		onOpenChange={handleOpenChange}
	>
		{@render comboboxInner()}
	</Combobox.Root>
{:else}
	<Combobox.Root
		type="single"
		bind:value={selected as string}
		onValueChange={handleSelect}
		onOpenChange={handleOpenChange}
	>
		{@render comboboxInner()}
	</Combobox.Root>
{/if}

<style>
	:global(.relative) {
		position: relative;
	}

	:global(.combobox-input) {
		width: 100%;
		height: 3em;
		padding: 0 1em;
		padding-left: 4em;
		padding-right: 3em;
		border: 1px solid var(--border-input);
		border-radius: 0.5em;
		background: var(--background);
		color: var(--foreground);
		font-size: 0.875rem;
		outline: none;
		transition: border-color 0.2s;
	}

	:global(.combobox-input:focus) {
		border-color: var(--brandLightBlue);
		box-shadow: 0 0 0 2px rgba(0, 173, 242, 0.2);
	}

	:global(.combobox-trigger) {
		position: absolute;
		right: 0.5em;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5em;
		display: flex;
		align-items: center;
		justify-content: center;
		touch-action: none;
		background: none !important;
		box-shadow: none !important;
	}

	:global(.combobox-content) {
		background: var(--background);
		border: 1px solid var(--border-input);
		border-radius: 1em;
		box-shadow: var(--shadow-popover);
		max-height: 24em;
		overflow: hidden;
		z-index: 50;
		width: 100%;
		min-width: 350px;
		padding: 0.25em;
	}

	:global(.combobox-viewport) {
		padding: 0.25em;
	}

	:global(.combobox-item) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 2.5em;
		padding: 0 1.25em;
		border-radius: 0.5em;
		font-size: 0.875rem;
		text-transform: capitalize;
		cursor: pointer;
		outline: none;
		transition: background-color 0.2s;
	}

	:global(.combobox-item:hover),
	:global(.combobox-item[data-highlighted]) {
		background-color: var(--muted);
	}

	:global(.group-heading) {
		font-weight: 600;
		font-size: 0.75rem;
		color: var(--foreground-alt);
		margin-top: 0.5em;
		margin-bottom: 0.25em;
		padding: 0 0.5em;
	}

	:global(.check-icon) {
		margin-left: auto;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.5em;
		height: 1.5em;
		color: var(--brandLightBlue);
	}

	:global(.no-results) {
		display: block;
		padding: 0.5em 1.25em;
		color: var(--muted-foreground);
		font-size: 0.875rem;
		text-align: center;
	}

	:global(.scroll-up-button),
	:global(.scroll-down-button) {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: center;
		padding: 0.25em;
	}

	:global(.scroll-icon) {
		width: 0.75em;
		height: 0.75em;
		color: var(--muted-foreground);
	}
</style>
