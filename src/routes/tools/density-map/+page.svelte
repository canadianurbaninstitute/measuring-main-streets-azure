<script>
  import { onMount } from 'svelte';
  import mapboxgl from 'mapbox-gl';
  import * as turf from '@turf/turf';
  import 'mapbox-gl/dist/mapbox-gl.css';

  let mapContainer;
  let map;
  let popup;

  // Performance improvement
  // How to deal with different data densities:
  // upload different POINT_LAYERS for each province
  // have a if statement to check which layer to use based on
  // the centre coordinates of the viewport 
  // then use conditional logic to adjust to zoom hex sizes.

  const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';
  const POINT_LAYER_ID = 'nova-scotia-housing-points';
  let lastHexSize; 

  function zoomToHexSize(zoom) {
    if (zoom >= 10) return 0.25;
    if (zoom >= 8.5) return 1;
    if (zoom >= 7) return 3;

    return 5; 
  }

  function updateHexbins() {

    const features = map.queryRenderedFeatures({ layers: [POINT_LAYER_ID] })
      .filter(f => f.properties && f.properties.reppoint_latitude !== undefined);

    if (!features.length) {
      map.getSource('hexbins').setData(turf.featureCollection([]));
      return;
    }

    const points = turf.featureCollection(
      features.map(f => turf.point(
        [f.properties.reppoint_longitude, f.properties.reppoint_latitude],
        { unit_count: f.properties.unit_count }
      ))
    );

    const bbox = turf.bbox(points);

    // Dynamic size based on zoom
    const hexSize = zoomToHexSize(map.getZoom());

    // Don't recalculate if hex size hasn't changed
    if (hexSize === lastHexSize) {
      console.log("Not recalculating");
      return;
    }

    lastHexSize = hexSize;

    document.getElementById('zoom').textContent = `Zoom: ${map.getZoom().toFixed(2)} | Hex Size: ${hexSize} km`;

    const hexGrid = turf.hexGrid(bbox, hexSize, { units: 'kilometers' });

    const hexbins = hexGrid.features.map(hex => {
      
      const pointsWithin = turf.pointsWithinPolygon(points, hex);
      
      const totalUnits = pointsWithin.features.reduce(
        (sum, p) => sum + p.properties.unit_count, 0
      );

      hex.properties.unit_count = totalUnits;
      hex.properties.point_count = pointsWithin.features.length;
      
      return hex;

    }).filter(hex => hex.properties.unit_count > 0);

    map.getSource('hexbins').setData(turf.featureCollection(hexbins));

  }

  onMount(() => {
    mapboxgl.accessToken = MAPBOX_TOKEN;

    map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/canadianurbaninstitute/cmebusgda001n01qw1y042h3q',
      center: [-63.5859, 44.6820],
      zoom: 8
    });

    map.on('load', () => {

      map.addSource('hexbins', {
        type: 'geojson',
        data: turf.featureCollection([])
      });

      map.addLayer({
        id: 'hexbins-extrusion',
        type: 'fill-extrusion',
        source: 'hexbins',
        paint: {
          'fill-extrusion-color': '#ff4444',
          'fill-extrusion-height': ['*', ['get', 'unit_count'], 25],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.8
        }
      });

      popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      map.on('mousemove', 'hexbins-extrusion', (e) => {
        const props = e.features[0].properties;
        popup
          .setLngLat(e.lngLat)
          .setHTML(`<strong>${props.unit_count}</strong> units<br>${props.point_count} Locations`)
          .addTo(map);
      });

      map.on('mouseleave', 'hexbins-extrusion', () => {
        popup.remove();
      });

      // First load
      updateHexbins();

      // Recalculate whenever viewport changes OR zoom changes
      map.on('moveend', updateHexbins);
      map.on('zoomend', updateHexbins);
    });

    return () => {
      if (map) map.remove();
    };
  });

</script>

<h1>NAR Unit Density Map - Hexbins</h1>
<div id="map-container">
  <div bind:this={mapContainer} id="map"></div>
  <p id="zoom"></p>
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