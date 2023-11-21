<script>
	import { onMount, onDestroy } from 'svelte';
	import { mapStoreList } from '../../mapStore'; // Import the mapStore

	import Icon from '@iconify/svelte';

	let isChecked = true;

	export let section;
	export let layer;
	let map = null; // Initialize map as null

	// Subscribe to the map store and update the local `map` variable
	const unsubscribe = mapStoreList.subscribe((maps) => {
		if (section && maps[section]) {
			map = maps[section];
		}
	});

	// Unsubscribe when the component is destroyed to prevent memory leaks
	onDestroy(unsubscribe);

	function toggleLayerOpacity() {
		if (map) {
			// const layerId = 'photos';
			const opacity = isChecked ? 1 : 0;
			map.setPaintProperty(layer, 'icon-opacity', opacity);
		}
	}

	onMount(() => {
		toggleLayerOpacity(); // Initialize layer opacity based on the initial checkbox state
	});
</script>

<button class={isChecked ? 'layerOn' : 'layerOff'}>
	<Icon icon="material-symbols:photo" />
	<label>
		<input type="checkbox" bind:checked={isChecked} on:change={toggleLayerOpacity} />
		Photos
	</label>
</button>

<style>
	label {
		padding: 0.4em;
		display: flex;
		align-items: center;
		font-size: 0.88em;
		width: 100%;
	}

	label:hover {
		cursor: pointer;
	}

	input {
		display: none;
	}

	button {
		border: 1px solid rgba(27, 31, 35, 0.3);
		background-color: rgb(250, 251, 252);
		border-radius: 0.5em;
		box-shadow: rgba(27, 31, 35, 0.04) 0px 1px 0px 0px,
			rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset;
		opacity: 1;
		display: flex;
		align-items: center;
		margin-top: 0.5em;
		width: 100%;
	}

	.layerOn {
		opacity: 1;
	}

	.layerOff {
		opacity: 0.6;
		border: 1px dashed rgba(27, 31, 35, 0.3);
	}

	button:hover {
		cursor: pointer;
		box-shadow: 0px 1px 0px 0px rgba(27, 31, 35, 0.04),
			inset 0px 1px 0px 0px hsla(0, 0%, 100%, 0.25);
		background-color: #f3f4f6;
		transition: 0.3s;
	}

	button:active {
		box-shadow: 0px 1px 0px 0px rgba(27, 31, 35, 0.04),
			inset 0px 1px 0px 0px hsla(0, 0%, 100%, 0.25), 0px 1px 0px 0px rgba(225, 228, 232, 0.2);
		background-color: #edeff2;
		transition: 0.3s;
	}
</style>
