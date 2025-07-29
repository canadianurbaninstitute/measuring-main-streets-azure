<!-- UI component used for creating select dropdowns. Data can be grouped or ungrouped.-->
<script>

import { Select } from "bits-ui"
import Icon from '@iconify/svelte'

export let handleSelectfunction;
export let data;
export let icon;
export let placeholder;
let selected = '';

// Helper function to get label from grouped variable names
function getLabel(value) {
    for (const group of Object.values(data)) {
        const found = group.find(v => v.value === value);
        if (found) return found.label;
    }
    return null;
}

</script>


    <Select.Root type="single" bind:value={selected} onValueChange={handleSelectfunction}>
        <Select.Trigger class="select-trigger" aria-label="Select">
            <Icon icon={icon} class="icon-start" />
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
                </Select.Viewport>
            </Select.Content>
        </Select.Portal>
    </Select.Root>

<style>

</style>