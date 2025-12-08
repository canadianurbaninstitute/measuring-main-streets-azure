<!-- UI component that displays a key metric used on National Transit Map sidebar.-->
<script>
	import Icon from '@iconify/svelte';
	export let label = '';
	export let value;
	export let icon = '';
	export let iconcolor = '#002a41';
	export let prefix = '';
	export let suffix = '';
	export let accordion = false;
	export let active = false;
	export let disabled = false;
</script>

<button {disabled} class="metric" class:active on:click>
	<div class="text">
		<div class="value"><Icon {icon} color={iconcolor} />{prefix}{value}{suffix}</div>
		<div class="label">{label}</div>
	</div>
	{#if accordion}
		<Icon icon="mdi:unfold-more-horizontal" />
	{/if}
</button>

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
		cursor: pointer;
	}

	.metric:disabled {
		cursor: not-allowed;
	}

	.active {
		background-color: var(--color-pink-50);
		outline: 3px solid var(--color-pink-400);
		box-sizing: border-box;
		outline-offset: -3px;
	}

	.text {
		display: flex;
		flex-direction: column;
		text-align: left;
	}

	.label {
		font-size: 0.8em;
	}

	.value {
		font-size: 1em;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.2em;
	}
</style>
