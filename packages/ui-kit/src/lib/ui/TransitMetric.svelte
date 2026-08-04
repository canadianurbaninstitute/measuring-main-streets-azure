<script lang="ts">
	import Icon from '@iconify/svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	interface Props {
		label?: string;
		value: string | number;
		icon?: string;
		iconcolor?: string;
		prefix?: string;
		suffix?: string;
		accordion?: boolean;
		active?: boolean;
		disabled?: boolean;
		id?: string;
		onclick?: (event: MouseEvent) => void;
	}

	let {
		label = '',
		value,
		icon = '',
		iconcolor = '#002a41',
		prefix = '',
		suffix = '',
		accordion = false,
		active = false,
		disabled = false,
		id = '',
		onclick
	}: Props = $props();

	let container: HTMLDivElement | undefined = $state();
	let visible = $state(true);
</script>

<div {id} class="metric-wrapper" bind:this={container}>
	{#if visible}
		<button
			{disabled}
			class="metric"
			class:active
			{onclick}
			in:fly={{ y: 20, duration: 800, easing: backOut }}
		>
			<div class="text">
				<div class="value"><Icon {icon} color={iconcolor} />{prefix}{value}{suffix}</div>
				<div class="label">{label}</div>
			</div>
			{#if accordion}
				<Icon icon="mdi:unfold-more-horizontal" />
			{/if}
		</button>
	{/if}
</div>

<style>
	.metric-wrapper {
		width: 100%;
		flex-grow: 1;
	}
	.metric {
		height: 100%;
		padding: 0.35em;
		border: 1px solid #ddd;
		border-radius: 0.5em;
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
