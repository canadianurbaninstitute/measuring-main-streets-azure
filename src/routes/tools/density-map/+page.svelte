<script>
  import { onMount } from 'svelte';
  import mapboxgl from 'mapbox-gl';
  import * as turf from '@turf/turf';
  import 'mapbox-gl/dist/mapbox-gl.css';

  let mapContainer;
  let map;

  const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';
  
  onMount(() => {
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    setTimeout(() => {
      if (mapContainer) {
        map = new mapboxgl.Map({
          container: mapContainer,
          style: 'mapbox://styles/canadianurbaninstitute/cmebusgda001n01qw1y042h3q',
          center: [-63.5859, 44.6820],
          zoom: 7
        });

        map.on('load', () => {
          setTimeout(() => {
            console.log('Getting housing data...');
            
            // Get the housing data
            const features = map.queryRenderedFeatures().filter(f => 
              f.properties && f.properties.reppoint_latitude !== undefined
            );
            
            console.log(`Found ${features.length} housing points`);
            
            if (features.length === 0) {
              console.log('No housing data found');
              return;
            }

            // Convert to GeoJSON points
            const points = turf.featureCollection(
              features.map(f => turf.point([
                f.properties.reppoint_longitude, 
                f.properties.reppoint_latitude
              ], {
                unit_count: f.properties.unit_count
              }))
            );

            // Get bounds for hex grid
            const bbox = turf.bbox(points);
            
            // Create hexagon grid - 5km radius
            const hexGrid = turf.hexGrid(bbox, 5, {units: 'kilometers'});
            
            // Aggregate points into hexbins, including those with zero units
            const hexbins = hexGrid.features.map(hex => {
              const pointsWithin = turf.pointsWithinPolygon(points, hex);
              const totalUnits = pointsWithin.features.reduce((sum, point) => 
                sum + point.properties.unit_count, 0
              );
              
              hex.properties.unit_count = totalUnits;
              hex.properties.point_count = pointsWithin.features.length;
              return hex;
            })

            // Add hexbins to map
            map.addSource('hexbins', {
              type: 'geojson',
              data: turf.featureCollection(hexbins)
            });

            map.addLayer({
              id: 'hexbins-extrusion',
              type: 'fill-extrusion',
              source: 'hexbins',
              paint: {
                'fill-extrusion-color': '#ff4444',
                'fill-extrusion-height': ['*', ['get', 'unit_count'], 50],
                'fill-extrusion-base': 0,
                'fill-extrusion-opacity': 0.8
              }
            });

            console.log('Hexbins added to map');

          }, 2000);
        });
      }
    }, 0);

    return () => {
      if (map) map.remove();
    };
  });
</script>

<h1>NAR Unit Density Map - Hexbins</h1>
<div id="map-container">
  <div bind:this={mapContainer} id="map"></div>
</div>

<style>
  #map {
    width: 80%; 
    height: 90vh;
  }

  #map-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
</style>