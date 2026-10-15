<!-- Plots the actual downtown-core boundary for all fifteen cities on one
     national map, coloured by downtown size, so the size groupings can be
     read against real geography. -->

<script>
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import { onMount } from 'svelte';
	import boundaries from '../../lib/data/coredata/downtownBoundaries.json';
	import { SIZE_COLOR, SIZE_OF } from '../coreMetrics.js';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	/**
	 * Props:
	 *   selectedCity - bindable city key; clicking a boundary isolates that city
	 */
	let { selectedCity = $bindable(null) } = $props();

	let section = $state();
	let map;
	let loaded = $state(false);

	const coloured = {
		...boundaries,
		features: boundaries.features.map((f) => ({
			...f,
			properties: {
				...f.properties,
				sizeGroup: SIZE_OF[f.properties.key],
				color: SIZE_COLOR[SIZE_OF[f.properties.key]]
			}
		}))
	};

	onMount(() => {
		map = new mapboxgl.Map({
			container: section,
			style: 'mapbox://styles/mapbox/light-v11',
			center: [-96, 56],
			zoom: 2.6,
			minZoom: 2,
			maxZoom: 12,
			attributionControl: false
		});

		map.addControl(new mapboxgl.NavigationControl(), 'top-right');
		map.addControl(
			new mapboxgl.AttributionControl({ customAttribution: 'Canadian Urban Institute' })
		);

		map.on('load', () => {
			map.addSource('downtowns', { type: 'geojson', data: coloured });

			map.addLayer({
				id: 'downtown-fill',
				type: 'fill',
				source: 'downtowns',
				paint: {
					'fill-color': ['get', 'color'],
					'fill-opacity': 0.55
				}
			});

			map.addLayer({
				id: 'downtown-outline',
				type: 'line',
				source: 'downtowns',
				paint: {
					'line-color': ['get', 'color'],
					'line-width': 1.5
				}
			});

			// Each downtown boundary is tiny relative to the national view, so a
			// generously sized invisible circle at its centroid keeps click/hover
			// targets usable while zoomed out.
			const points = {
				type: 'FeatureCollection',
				features: coloured.features.map((f) => ({
					type: 'Feature',
					properties: f.properties,
					geometry: { type: 'Point', coordinates: centroidOf(f.geometry) }
				}))
			};
			map.addSource('downtown-points', { type: 'geojson', data: points });
			map.addLayer({
				id: 'downtown-target',
				type: 'circle',
				source: 'downtown-points',
				paint: { 'circle-radius': 14, 'circle-opacity': 0 }
			});

			loaded = true;

			const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });

			map.on('mouseenter', 'downtown-target', (e) => {
				map.getCanvas().style.cursor = 'pointer';
				const { name } = e.features[0].properties;
				popup.setLngLat(e.lngLat).setHTML(`<strong>${name}</strong>`).addTo(map);
			});
			map.on('mouseleave', 'downtown-target', () => {
				map.getCanvas().style.cursor = '';
				popup.remove();
			});
			map.on('click', 'downtown-target', (e) => {
				const { key } = e.features[0].properties;
				selectedCity = selectedCity === key ? null : key;
			});
		});
	});

	function centroidOf(geometry) {
		const rings =
			geometry.type === 'MultiPolygon' ? geometry.coordinates.flat() : geometry.coordinates;
		let x = 0;
		let y = 0;
		let n = 0;
		for (const ring of rings) {
			for (const [lng, lat] of ring) {
				x += lng;
				y += lat;
				n++;
			}
		}
		return [x / n, y / n];
	}

	$effect(() => {
		if (!loaded || !map.getLayer('downtown-fill')) return;
		const opacity = selectedCity
			? ['case', ['==', ['get', 'key'], selectedCity], 0.85, 0.12]
			: 0.55;
		map.setPaintProperty('downtown-fill', 'fill-opacity', opacity);
	});
</script>

<div bind:this={section} class="map"></div>

<style>
	.map {
		height: 420px;
		width: 100%;
		border-radius: 0.8em;
		border: 1px solid var(--core-line);
	}
</style>
