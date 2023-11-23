<script>

    import { createEventDispatcher } from 'svelte'
    import collapse from 'svelte-collapse'
    import Icon from '@iconify/svelte';

    export let open = false
    export let duration = 0.2
    export let easing = 'ease'

    const dispatch = createEventDispatcher()

    function handleToggle () {
        open = !open
        if (open) {
            dispatch('open')
        }
        else {
            dispatch('close')
        }

    }

</script> 

<div class='card' class:open aria-expanded={open}>

    <div class='card-header' on:keydown={handleToggle} on:click={handleToggle}>
        <slot name='header'/>
        </div>

    <div class='card-body' use:collapse={{open, duration, easing}}>
        <slot name='body'/>
    </div>

</div>

<style>
    .card-header {
        cursor: pointer;
        user-select: none;
        padding: 0;
        width: 100%
    }
</style>