<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Select } from 'bits-ui';

	interface OptionItem {
		value: string;
		label: string;
	}

	interface GroupedData {
		[groupName: string]: OptionItem[];
	}

	interface Props {
		data: OptionItem[] | GroupedData;
		icon: string;
		placeholder: string;
		handleSelect?: ((value: string | undefined) => void) | null;
		selected: string;
	}

	let { data, icon, placeholder, handleSelect = null, selected = $bindable() }: Props = $props();

	function getLabel(value: string): string | null {
		if (Array.isArray(data)) {
			const found = data.find((v) => v.value === value);
			return found ? found.label : null;
		} else if (data && typeof data === 'object') {
			for (const group of Object.values(data)) {
				const found = group.find((v) => v.value === value);
				if (found) return found.label;
			}
		}
		return null;
	}

	function isGroupedData(targetData: OptionItem[] | GroupedData): targetData is GroupedData {
		return !Array.isArray(targetData) && typeof targetData === 'object' && targetData !== null;
	}

	const isGrouped = $derived(isGroupedData(data));

	function onSelectChange(value: string | undefined) {
		if (handleSelect) handleSelect(value);
	}
</script>

<Select.Root type="single" bind:value={selected} onValueChange={onSelectChange}>
	<Select.Trigger class="select-trigger" aria-label="Select">
		<Icon {icon} class="icon-start" />
		{#if selected}
			{getLabel(selected)}
		{:else}
			<span class="placeholder">{placeholder}</span>
		{/if}
		<Icon icon="mdi:chevron-down" class="icon-end" />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content class="select-content" sideOffset={10}>
			<Select.Viewport class="select-viewport">
				{#if isGrouped}
					{#each Object.entries(data) as [group, options]}
						<Select.Group>
							<Select.GroupHeading class="group-heading">{group}</Select.GroupHeading>
							{#each options as { value, label }}
								<Select.Item class="select-item" {value} {label}>
									{label}
									{#if selected === value}
										<div class="check-icon">
											<Icon icon="mdi:check" aria-label="selected" />
										</div>
									{/if}
								</Select.Item>
							{/each}
						</Select.Group>
					{/each}
				{/if}

				{#if !isGrouped}
					{#each data as OptionItem[] as { value, label }}
						<Select.Item class="select-item" {value} {label}>
							{label}
							{#if selected === value}
								<div class="check-icon">
									<Icon icon="mdi:check" aria-label="selected" />
								</div>
							{/if}
						</Select.Item>
					{/each}
				{/if}
			</Select.Viewport>
		</Select.Content>
	</Select.Portal>
</Select.Root>
