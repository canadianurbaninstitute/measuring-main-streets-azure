<script>
    import Icon from '@iconify/svelte';
    
    export let checked = false;
    export let label = '';
    export let icon = '';
</script>

<label class="cursor-pointer">
    <input 
        type="checkbox" 
        bind:checked 
        class="sr-only" 
    />
    <div class="flex items-center px-3 py-2 rounded-md border transition-colors duration-200 text-xs {checked ? 'bg-gray-200 border-gray-300' : 'bg-white border-gray-300 hover:bg-gray-50'}">
        {#if icon}
            <Icon {icon} class="mr-1" />
        {/if}
        {label}
    </div>
</label>