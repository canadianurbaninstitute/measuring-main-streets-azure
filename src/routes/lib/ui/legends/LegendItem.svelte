<script>
  export let label;
  export let variant;
  export let bgcolor;
  export let bordercolor;
  export let id;
  export let button = false;

  import { mapStore } from '../../mapStore'; // Import the mapStore

let map;

// Subscribe to the map store and update the local `map` variable
mapStore.subscribe(value => {
  map = value;
});

let layerActive = true;

function toggleLayerVisibility() {


  let visibilitystatus = map.getLayoutProperty(id, 'visibility');

  if (visibilitystatus === 'visible' || visibilitystatus === undefined) {
        map.setLayoutProperty(id, 'visibility', 'none');
        layerActive = false;
      } else {
        map.setLayoutProperty(id, 'visibility', 'visible');
        layerActive = true;
      }
    	}

</script>

{#if button}
<button class="{layerActive ? 'layerOn' : 'layerOff'}" on:click={toggleLayerVisibility}><div class="legend-item" id={id}><span class={variant} style="background-color: {bgcolor};  box-shadow:inset 0px 0px 0px 2px {bordercolor}; border-color: {bordercolor};"></span>{label}</div></button>
{:else}
<div class="legend-item"><span class={variant} style="background-color: {bgcolor};  box-shadow:inset 0px 0px 0px 2px {bordercolor}; border-color: {bordercolor};"></span>{label}</div>
{/if}

<style>

.legend-item {
    padding: 0.3em;
    display: flex;
    align-items: center;
    font-size: 0.9em;
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
    box-shadow: rgba(27, 31, 35, 0.04) 0px 1px 0px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset;
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
  box-shadow: 0px 1px 0px 0px rgba(27, 31, 35, 0.04), inset 0px 1px 0px 0px hsla(0, 0%, 100%, 0.25);
  background-color: #f3f4f6;
}

button:active {
  box-shadow: 0px 1px 0px 0px rgba(27, 31, 35, 0.04), inset 0px 1px 0px 0px hsla(0, 0%, 100%, 0.25), 0px 1px 0px 0px rgba(225, 228, 232, 0.2);
  background-color: #edeff2;
}
</style>