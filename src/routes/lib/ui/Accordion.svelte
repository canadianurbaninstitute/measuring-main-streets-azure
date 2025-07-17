<script>
    import collapse from 'svelte-collapse'
    export let open = false
    export let duration = 0.2
    export let easing = 'ease'

    function handleToggle () {
        open = !open
        if (open) {
            emit('open')
        }
        else {
            emit('close')
        }
    }

</script> 

<div class='card' class:open aria-expanded={open}>

    <div class='card-header' role="button" tabindex="0" on:keydown={handleToggle} on:click={handleToggle}>
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