<script>
	import Icon from '@iconify/svelte';
	export let label = '';
	export let value;
	export let icon = '';
	export let iconcolor = '#002a41';
	export let prefix = '';
	export let suffix = '';
	export let accordion = false;
</script>

<div class="metric">
	<div class="text">
		<div class="value"><Icon {icon} color={iconcolor} />{prefix}{value}{suffix}</div>
		<div class="label">{label}</div>
	</div>
	{#if accordion}
	<Icon icon="mdi:unfold-more-horizontal" />
	{/if}
</div>

<style>
	.metric {
		padding: 0.35em;
		border: 1px solid #ddd;
		border-radius: 0.5em;
		margin: 0.15em 0 0.15em 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		box-sizing: border-box;
		width: 100%;
		justify-content: space-between;
	}

	.metric:hover {
		background-color: #eee;
		transition: 0.3s;
		cursor: pointer;
	}

	.text {
		display: flex;
		flex-direction: column;
	}

	.label {
		font-size: 0.6em;
	}

	.value {
		font-size: 0.7em;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.2em;
	}
</style>
