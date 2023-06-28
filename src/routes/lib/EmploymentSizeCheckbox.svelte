<script>
    import { onMount } from 'svelte';
  
    export let map;
  
    let isChecked = false;
  
    function toggleEmploymentSize() {
      if (map) {
        const layerId = 'civicinfra-toronto';
        const zoom = isChecked ? 14.1 : 14.7;
        const opacity = isChecked ? 0.8 : 1;
        const radius = isChecked ? [
          'step',
          ['get', 'empsize_EmpSzNm'],
          5, 2,
          10, 8,
          50, 15,
          100, 20,
          1000, 25,
          5
        ] : 5;
        map.setPaintProperty(layerId, 'circle-radius', radius);
        map.setPaintProperty(layerId, 'circle-opacity', opacity);

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
  