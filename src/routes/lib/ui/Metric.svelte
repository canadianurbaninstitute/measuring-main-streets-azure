<script>
    import Icon from "@iconify/svelte";
    export let label = '';
    export let value;
    export let icon = '';
    export let iconcolor = "#002a41";
    export let prefix = '';
    export let suffix = '';

</script>

<div class="metric">{label}: {prefix}{value}{suffix}<Icon icon={icon} color={iconcolor} /></div>


<style>
    	.metric {
		padding: 0.8em;
		border: 1px solid #ddd;
		border-radius: 0.5em;
		margin: 0.2em 0 0.2em 0;
		font-size: 0.9em;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
</style>