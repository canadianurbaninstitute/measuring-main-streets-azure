<script>
  export let label;
  export let variant;
  export let bgcolor;
  export let bordercolor;
  export let id;
  export let button = false;

  import { mapStore } from '../mapStore'; // Import the mapStore

let map;

// Subscribe to the map store and update the local `map` variable
mapStore.subscribe(value => {
  map = value;
});


function toggleLayerVisibility() {
  let visibilitystatus = map.getLayoutProperty(id, 'visibility');
  console.log(visibilitystatus)

  if (visibilitystatus === 'visible' | visibilitystatus === undefined) {
        map.setLayoutProperty(id, 'visibility', 'none');
      } else {
        map.setLayoutProperty(id, 'visibility', 'visible');
      }
    	}

</script>

{#if button}
<button on:click={toggleLayerVisibility}><div class="legend-item" id={id}><span class={variant} style="background-color: {bgcolor};  box-shadow:inset 0px 0px 0px 2px {bordercolor}; border-color: {bordercolor};"></span>{label}</div></button>
{:else}
<div class="legend-item"><span class={variant} style="background-color: {bgcolor};  box-shadow:inset 0px 0px 0px 2px {bordercolor}; border-color: {bordercolor};"></span>{label}</div>
{/if}

<style>

.legend-item {
    padding: 0.4em;
    display: flex;
    align-items: center;
    font-size: 0.8em;
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
  background-color: #fff;
  border-radius: 0.2em;
  display:flex;
  margin:0.4em;
}

button:hover {
  cursor: pointer;
}
</style>