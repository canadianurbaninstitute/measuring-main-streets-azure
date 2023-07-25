<script>
    import { onMount } from 'svelte';
  
    export let map;
    export let layers = [];
  
    let isChecked = false;
  
    function toggleEmploymentSize() {
      if (map) {
        const layerList = layers;
        const zoom = isChecked ? 14.1 : 14.7;
        const opacity = isChecked ? 0.8 : 1;
        const radius = isChecked ? [
          'step',
          ['get', 'empsize_EmpSzNm'],
          5, 5,
          10, 10,
          15, 50,
          20, 100,
          25, 1000,
          5
        ] : 5;

        for (let i = 0; i < layerList.length; i++) {
          const layerId = layerList[i];
          map.setPaintProperty(layerId, 'circle-radius', radius);
          map.setPaintProperty(layerId, 'circle-opacity', opacity);
        }
                
       
        map.easeTo({zoom})
      }
    }
  
    onMount(() => {
      toggleEmploymentSize(); // Initialize layer radius based on the initial checkbox state
    });
  </script>
  
  <label>
    <input type="checkbox" bind:checked={isChecked} on:change={toggleEmploymentSize} />
    Show Employment Size
  </label>  