<script>
	export let label;
	export let variant;
	export let bgcolor;
	export let bordercolor;
	export let id;
	export let button = false;
	export let section;
	export let map; // Allow map to be directly passed as a prop
	export let featuretype = 'circle';
	export let targetopacity = 0.9;

	import { mapStoreList } from '../../mapStore';
	import { onDestroy } from 'svelte';

	let layerActive = true;

	// Subscribe to the map store only if section is provided
	let unsubscribe;
	if (section) {
		unsubscribe = mapStoreList.subscribe((maps) => {
			if (maps[section]) {
				map = maps[section];
			}
		});
	}

	// Unsubscribe when the component is destroyed to prevent memory leaks
	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	});

	function toggleLayerVisibility() {
		if (map) {
			// get opacity of the type of feature the legend item is
			let opacity = map.getPaintProperty(id, `${featuretype}-opacity`);
			// if it is visible, undefined or has an expression as the value, set opacity to 0
			if (opacity > 0.4 || opacity === undefined || opacity.constructor === Array) {
				map.setPaintProperty(id, `${featuretype}-opacity`, 0);
				if (featuretype === 'circle') {
					map.setPaintProperty(id, `${featuretype}-stroke-opacity`, 0);
				}
				else if ( id === 'case-study-BIAs' ) {
					map.setLayoutProperty(
                        id,
                        'visibility',
                        'none'
                    );
				}
				layerActive = false;
			// set opacity to provided targetopacity, default is 0.9
			} else {
				map.setPaintProperty(id, `${featuretype}-opacity`, targetopacity);
				if (featuretype === 'circle') {
					map.setPaintProperty(id, `${featuretype}-stroke-opacity`, targetopacity);
				}
				else if ( id === 'case-study-BIAs' ) {
					map.setLayoutProperty(
                        id,
                        'visibility',
                        'visible'
                    );
				}
				layerActive = true;
			}
		}
	}
</script>

{#if button}
	<button class={layerActive ? 'layerOn' : 'layerOff'} on:click={toggleLayerVisibility}>
		<div class="legend-item" {id}>
			<span
				class={variant}
				style="background-color: {bgcolor}; box-shadow:inset 0px 0px 0px 2px {bordercolor}; border-color: {bordercolor};"
			/>{label}
		</div>
	</button>
{:else}
	<div class="legend-item">
		<span
			class={variant}
			style="background-color: {bgcolor}; box-shadow:inset 0px 0px 0px 2px {bordercolor}; border-color: {bordercolor};"
		/>{label}
	</div>
{/if}

<style>
	.legend-item {
		padding: 0.3em;
		display: flex;
		align-items: center;
		font-size: 0.9em;
		text-align: left;
	}

	.polygon {
		border-radius: 2px;
		display: inline-block;
		height: 15px;
		margin-right: 5px;
		width: 15px;
	}

	.circle {
		border-radius: 100px;
		display: inline-block;
		height: 15px;
		margin-right: 5px;
		min-width: 15px;
	}

	.line {
		border-radius: 2px;
		display: inline-block;
		margin-right: 5px;
		width: 15px;
		height: 0;
		border-style: solid;
		border-width: 2px 2px 0 0;
		transform: rotate(45deg);
	}

	button {
		border: 1px solid rgba(28, 32, 36, 0.302);
		background-color: rgb(250, 251, 252);
		border-radius: 0.5em;
		box-shadow: rgba(27, 31, 35, 0.04) 0px 1px 0px 0px,
			rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset;
		opacity: 1;
		width: 100%;
		display: flex;
		padding: 0.2em;
		margin: 0.5em 0 0.5em 0;
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
