

<script>
    import { onMount } from 'svelte';
    import Icon from '@iconify/svelte';

  
    export let map;


    let isChecked = false;
	let toggleText = 'Off';
  
    function toggleLayerOpacity() {
      if (map) {
        const layerId = 'photos';
        const opacity = isChecked ? 1 : 0;
        map.setPaintProperty(layerId, 'icon-opacity', opacity);
		toggleText = isChecked ? 'On' : 'Off';
      }
    }

  
    onMount(() => {
      toggleLayerOpacity(); // Initialize layer opacity based on the initial checkbox state
    });
  </script>
  
  <button class={isChecked ? 'layerOn' : 'layerOff'}>
    <Icon icon="material-symbols:photo"  width="24" color="#222" />
  <label>
    <input type="checkbox" bind:checked={isChecked} on:change={toggleLayerOpacity} />
    Photos: {toggleText}
  </label>
</button>
  

<style>
	label {
		padding: 0.4em;
		display: flex;
		align-items: center;
		font-size: 0.9em;
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
		border-radius: 10em;
		box-shadow: rgba(27, 31, 35, 0.04) 0px 1px 0px 0px,
			rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset;
		opacity: 1;
		display: flex;
		align-items: center;
		z-index: 1;
		/* width: 5%; */
		padding: 0.2em 0.4em 0.2em 0.55em;
		margin-top: 0.5em;
		position: fixed;
    	bottom: 2em;
    	right: 1em;
	}

	.layerOn {
		opacity: 1;
	}

	.layerOff {
		opacity: 0.9;
		border: 1px dashed rgba(27, 31, 35, 0.3);
	}

	button:hover {
		cursor: pointer;
		box-shadow: 0px 1px 0px 0px rgba(27, 31, 35, 0.04),
			inset 0px 1px 0px 0px hsla(0, 0%, 100%, 0.25);
		background-color: #f3f4f6;
	}

	button:active {
		box-shadow: 0px 1px 0px 0px rgba(27, 31, 35, 0.04),
			inset 0px 1px 0px 0px hsla(0, 0%, 100%, 0.25), 0px 1px 0px 0px rgba(225, 228, 232, 0.2);
		background-color: #edeff2;
	}
</style>
