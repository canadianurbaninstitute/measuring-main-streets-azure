<script>
	export let label;
	export let variant;
	export let bgcolor;
	export let bordercolor;
	export let id;
	export let button = false;
  export let section;

	import { mapStore2 } from '../../mapStore'; // Import the mapStore
  import { onDestroy } from 'svelte';

  let map = null; // Initialize map as null

  // Subscribe to the map store and update the local `map` variable
  const unsubscribe = mapStore2.subscribe((maps) => {
    if (section && maps[section]) {
      map = maps[section];
    }
  });

  let layerActive = true;

  // Unsubscribe when the component is destroyed to prevent memory leaks
  onDestroy(unsubscribe);

	function toggleLayerVisibility() {

   //console.log(map)

    if (map) {
		  let visibilitystatus = map.getLayoutProperty(id, 'visibility');
      let opacity =  map.getPaintProperty(id, 'circle-opacity');

		if (opacity === 0.9 || opacity === undefined) {
			map.setPaintProperty(id, 'circle-opacity', 0);
      map.setPaintProperty(id, 'circle-stroke-opacity', 0);

			layerActive = false;
		} else {
			map.setPaintProperty(id, 'circle-opacity', 0.9);
      map.setPaintProperty(id, 'circle-stroke-opacity', 0.9);
			layerActive = true;
		}
	}
}
</script>

{#if button}
	<button class={layerActive ? 'layerOn' : 'layerOff'} on:click={toggleLayerVisibility}
		><div class="legend-item" {id}>
			<span
				class={variant}
				style="background-color: {bgcolor};  box-shadow:inset 0px 0px 0px 2px {bordercolor}; border-color: {bordercolor};"
			/>{label}
		</div></button
	>
{:else}
	<div class="legend-item">
		<span
			class={variant}
			style="background-color: {bgcolor};  box-shadow:inset 0px 0px 0px 2px {bordercolor}; border-color: {bordercolor};"
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
		width: 15px;
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
		margin-top: 0.5em;
		width: 100%;
		display: flex;
		padding: 0.2em;
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
