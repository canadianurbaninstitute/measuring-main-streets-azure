<script>
	import Icon from '@iconify/svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	export let label = '';
	export let value;
	export let icon = '';
	export let iconcolor = '#002a41';
	export let prefix = '';
	export let suffix = '';
	export let accordion = false;
	export let active = false;
	export let disabled = false;
	export let id = '';

	let container;
	let visible = true; // set to false and uncomment below if you want to enable the fade in

	// onMount(() => {
	// 	const observer = new IntersectionObserver(
	// 		(entries) => {
	// 			entries.forEach((entry) => {
	// 				visible = entry.isIntersecting;
	// 			});
	// 		},
	// 		{ threshold: 0.1 }
	// 	);

	// 	if (container) observer.observe(container);

	// 	return () => observer.disconnect();
	// });
</script>

<div {id} lass="metric-wrapper" bind:this={container}>
	{#if visible}
		<button
			{disabled}
			class="metric"
			class:active
			on:click
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
		min-height: 50px;
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
