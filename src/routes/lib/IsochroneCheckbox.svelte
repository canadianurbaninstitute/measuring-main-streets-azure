<script>
    import { onMount } from 'svelte';
  
    export let map;
  
    let isChecked = false;
  
    function toggleLayerOpacity() {
      if (map) {
        const layerId = 'wqw-isochrone';
        const opacity = isChecked ? 1 : 0;
        const zoom = isChecked ? 14.1 : 14.7;
        map.setPaintProperty(layerId, 'fill-opacity', opacity);
        map.easeTo({zoom})
      }
    }
  
    onMount(() => {
      toggleLayerOpacity(); // Initialize layer opacity based on the initial checkbox state
    });
  </script>
  
  <label>
    <input type="checkbox" bind:checked={isChecked} on:change={toggleLayerOpacity} />
    Show 10 Minute Walking Radius
  </label>
  