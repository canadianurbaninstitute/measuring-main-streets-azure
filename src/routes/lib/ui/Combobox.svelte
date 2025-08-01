<!-- UI component used for creating combobox dropdowns with search functionality. Data can be grouped or ungrouped.-->
<script>
import { Combobox } from "bits-ui"
import Icon from '@iconify/svelte'

export let handleSelect;
export let data;
export let icon;
export let placeholder;
export let selected = '';
export let type = 'single'; // 'single' or 'multiple'

let searchValue = "";

// Helper function to get label from grouped variable names
function getLabel(value) {
    // Check if data is grouped (object with groups) or ungrouped (array)
    if (Array.isArray(data)) {
        // Ungrouped data - direct array of options
        const found = data.find(v => v.value === value);
        return found ? found.label : null;
    } else {
        // Grouped data - object with groups
        for (const group of Object.values(data)) {
            const found = group.find(v => v.value === value);
            if (found) return found.label;
        }
    }
    return null;
}

// Helper function to check if data is grouped
function isGroupedData(data) {
    return !Array.isArray(data) && typeof data === 'object';
}

// Helper function to flatten data for filtering
function flattenData(data) {
    if (Array.isArray(data)) {
        return data;
    } else {
        // Grouped data - flatten into single array
        const flattened = [];
        for (const group of Object.values(data)) {
            flattened.push(...group);
        }
        return flattened;
    }
}

// Filter data based on search value
$: filteredData = (() => {
    if (searchValue === "") {
        return data;
    }
    
    if (Array.isArray(data)) {
        // Ungrouped data - filter directly
        return data.filter(item => 
            item.label.toLowerCase().includes(searchValue.toLowerCase())
        );
    } else {
        // Grouped data - filter within each group
        const filtered = {};
        for (const [groupName, groupItems] of Object.entries(data)) {
            const filteredGroup = groupItems.filter(item => 
                item.label.toLowerCase().includes(searchValue.toLowerCase())
            );
            if (filteredGroup.length > 0) {
                filtered[groupName] = filteredGroup;
            }
        }
        return filtered;
    }
})();

// Handle input change
function handleInput(e) {
    searchValue = e.currentTarget.value;
}

// Handle open change to clear search when closed
function handleOpenChange(open) {
    if (!open) {
        searchValue = "";
    }
}
</script>

<Combobox.Root 
    {type} 
    bind:value={selected} 
    onValueChange={handleSelect}
    onOpenChange={handleOpenChange}
>
    <div class="relative">
        <Icon icon={icon} class="icon-start combobox" />
        <Combobox.Input
            oninput={handleInput}
            class="combobox-input"
            placeholder={placeholder}
            aria-label={placeholder}
        />
        <Combobox.Trigger class="combobox-trigger">
            <Icon icon="mdi:chevron-down" class="icon-end combobox" />
        </Combobox.Trigger>
    </div>
    
    <Combobox.Portal>
        <Combobox.Content class="combobox-content" sideOffset={10}>
            <Combobox.Viewport class="combobox-viewport">
                {#if isGroupedData(filteredData)}
                    <!-- Grouped data structure -->
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
                {:else}
                    <!-- Ungrouped data structure -->
                    {#each filteredData as { value, label }}
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
                
                {#if (isGroupedData(filteredData) ? Object.values(filteredData).flat().length : filteredData.length) === 0}
                    <span class="no-results">
                        No results found, try again.
                    </span>
                {/if}
            </Combobox.Viewport>
        </Combobox.Content>
    </Combobox.Portal>
</Combobox.Root>

<style>
    :global(.relative) {
        position: relative;
    }

    :global(.combobox-input) {
        width: 100%;
        height: 3em;
        padding: 0 1em;
        padding-left: 4em; /* Space for icon */
        padding-right: 3em; /* Space for trigger */
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
