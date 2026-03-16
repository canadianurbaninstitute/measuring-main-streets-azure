<script lang="ts">
	import * as turf from '@turf/turf';
	import chroma from 'chroma-js';
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	// You might want to get the token via environment variables or a config file later
	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	let { map = $bindable(), center, zoom, onStationClick, activeCoords } = $props();

	let mapContainer;

	function updateMask(coords) {
		if (!map || !map.getSource('circle') || !map.getSource('circle-mask') || !coords) return;

		const radiusInKm = 0.8;
		const circleFeature = turf.circle(coords, radiusInKm, {
			steps: 128,
			units: 'kilometers'
		});

		const maskFeature = {
			type: 'Feature',
			geometry: {
				type: 'Polygon',
				coordinates: [
					// Outer ring (world bounds)
					[
						[-180, -90],
						[180, -90],
						[180, 90],
						[-180, 90],
						[-180, -90]
					],
					// Inner ring (circle - reversed coordinates)
					[...circleFeature.geometry.coordinates[0]].reverse()
				]
			}
		};

		map.getSource('circle').setData({
			type: 'FeatureCollection',
			features: [circleFeature]
		});

		map.getSource('circle-mask').setData({
			type: 'FeatureCollection',
			features: [maskFeature]
		});
	}

	$effect(() => {
		const targetCoords = activeCoords || center;
		if (targetCoords) {
			updateMask(targetCoords);
		}
	});

	onMount(() => {
		map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/canadianurbaninstitute/cmkwt0bmm000s01qraw6c3izu',
			center: center || [-79.3832, 43.6532], // Defaulting to Toronto
			zoom: zoom || 11,
			scrollZoom: false, // Recommended false for scroll-telling to prevent trapping the scroll wheel
			attributionControl: false
		});

		map.addControl(new mapboxgl.NavigationControl(), 'top-left');

		map.on('load', () => {
			// Change cursor to pointer over stations
			map.on('mouseenter', 'station-analysis-points-4cu7xs', () => {
				map.getCanvas().style.cursor = 'pointer';
			});

			map.on('mouseleave', 'station-analysis-points-4cu7xs', () => {
				map.getCanvas().style.cursor = '';
			});

			// Add mask sources
			map.addSource('circle-mask', {
				type: 'geojson',
				data: { type: 'FeatureCollection', features: [] }
			});

			map.addSource('circle', {
				type: 'geojson',
				data: { type: 'FeatureCollection', features: [] }
			});

			// Add mask layers
			map.addLayer(
				{
					id: 'circle-mask',
					type: 'fill',
					source: 'circle-mask',
					paint: {
						'fill-color': '#fff',
						'fill-opacity': 0.7
					}
				},
				'station-analysis-points-4cu7xs'
			);

			map.addLayer(
				{
					id: 'circle-radius',
					type: 'line',
					source: 'circle',
					paint: {
						'line-color': '#000',
						'line-opacity': 0.3,
						'line-width': 1.5,
						'line-dasharray': [2, 2]
					}
				},
				'station-analysis-points-4cu7xs'
			);

			// Initial mask update
			const targetCoords = activeCoords || center;
			if (targetCoords) {
				updateMask(targetCoords);
			}

			// Handle clicks on the specified station layer
			map.on('click', 'station-analysis-points-4cu7xs', (e) => {
				if (e.features.length > 0) {
					const coordinates = e.features[0].geometry.coordinates.slice();
					const properties = e.features[0].properties;

					// Ensure appropriate zoom levels when handling clusters vs single points
					while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
						coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
					}

					if (onStationClick) {
						onStationClick({
							lng: coordinates[0],
							lat: coordinates[1],
							properties,
							mapInstance: map,
							point: e.point
						});
					}
				}
			});

			// Apply line gradient once map is idle and segments are loaded
			// map.once('idle', applyLineGradient);
		});

		async function applyLineGradient() {
			if (!map) return;

			const layerId = 'station-analyses-overall-scor-2o1m63';
			const sourceId = 'composite';
			const sourceLayer = 'station_analyses_overall_scor-2o1m63';

			// 1. Extract features from the vector source layers
			const lineFeatures = map.querySourceFeatures(sourceId, {
				sourceLayer: sourceLayer
			});

			if (!lineFeatures || lineFeatures.length === 0) {
				console.warn('No line features found for gradient');
				return;
			}

			// 2. Process and Stitch segments for continuous gradient
			const uniqueLinesMap = new Map();
			lineFeatures.forEach((f) => {
				if (f.geometry.type === 'LineString') {
					const key = JSON.stringify(f.geometry.coordinates);
					if (!uniqueLinesMap.has(key)) {
						uniqueLinesMap.set(key, f);
					}
				}
			});

			const segments = Array.from(uniqueLinesMap.values()).map((f) => {
				const props = f.properties;
				let sa = props.endpoint_a_overall_score;
				let sb = props.endpoint_b_overall_score;

				// Handle nulls: fallback logic
				if (sa === null || sa === undefined) sa = sb;
				if (sb === null || sb === undefined) sb = sa;
				if (sa === null || sa === undefined) {
					sa = props.overall_score ?? 2.25;
					sb = props.overall_score ?? 2.25;
				}

				return {
					coords: f.geometry.coordinates,
					sa: Number(sa),
					sb: Number(sb),
					length: turf.length(f)
				};
			});

			if (segments.length === 0) return;

			// Stitching: Join adjacent segments into ordered sequences
			let remaining = [...segments];
			let orderedSegments = [];
			const TOLERANCE = 0.001; // ~1 meter

			while (remaining.length > 0) {
				let chain = [remaining.shift()];
				let found = true;
				while (found) {
					found = false;
					const tail = chain[chain.length - 1].coords.at(-1);
					for (let i = 0; i < remaining.length; i++) {
						const s = remaining[i];
						if (turf.distance(tail, s.coords[0]) < TOLERANCE) {
							chain.push(remaining.splice(i, 1)[0]);
							found = true;
							break;
						} else if (turf.distance(tail, s.coords.at(-1)) < TOLERANCE) {
							const flipped = remaining.splice(i, 1)[0];
							[flipped.sa, flipped.sb] = [flipped.sb, flipped.sa];
							flipped.coords.reverse();
							chain.push(flipped);
							found = true;
							break;
						}
					}
				}
				orderedSegments.push(...chain);
			}

			// 3. Calculate Global Score Stops (N+1 stops for N segments)
			const totalLength = orderedSegments.reduce((sum, s) => sum + s.length, 0);
			const colorScale = chroma
				.scale(['#8b1b1d', '#ff9c2c', '#eeee00', '#74c800', '#13612c'])
				.domain([0.5, 1.375, 2.25, 3.125, 4]);

			const stops = [];
			let currentOffset = 0;

			orderedSegments.forEach((s, idx) => {
				const startP = totalLength > 0 ? currentOffset / totalLength : 0;
				const endP = totalLength > 0 ? (currentOffset + s.length) / totalLength : 1;

				if (idx === 0) {
					// First point ever
					stops.push({ progress: 0, color: colorScale(s.sa).hex() });
				} else {
					// Junction: Average previous end and current start for smoothness
					const lastStop = stops[stops.length - 1];
					const prevScore = orderedSegments[idx - 1].sb;
					const avgScore = (prevScore + s.sa) / 2;
					lastStop.color = colorScale(avgScore).hex();
				}

				// End of this segment
				stops.push({ progress: Math.min(endP, 1), color: colorScale(s.sb).hex() });
				currentOffset += s.length;
			});

			// Final deduplication for strictly ascending progress
			const uniqueStops = [];
			stops.forEach((s) => {
				if (
					uniqueStops.length === 0 ||
					s.progress > uniqueStops[uniqueStops.length - 1].progress + 0.00001
				) {
					uniqueStops.push(s);
				}
			});

			if (uniqueStops.length === 0) return;

			// Mapbox requires 0 and 1
			if (uniqueStops[0].progress > 0)
				uniqueStops.unshift({ progress: 0, color: uniqueStops[0].color });
			if (uniqueStops[uniqueStops.length - 1].progress < 1)
				uniqueStops.push({ progress: 1, color: uniqueStops[uniqueStops.length - 1].color });

			const gradientDefinition = ['interpolate', ['linear'], ['line-progress']];
			uniqueStops.forEach((s) => {
				gradientDefinition.push(s.progress, s.color);
			});

			// 4. Update Source and Layer
			const featureCollection = turf.featureCollection([
				turf.multiLineString(orderedSegments.map((s) => s.coords))
			]);

			// 4. Update Source and Layer
			if (map.getSource('gradient-route')) {
				map.removeLayer('gradient-route-layer');
				map.removeSource('gradient-route');
			}

			map.addSource('gradient-route', {
				type: 'geojson',
				lineMetrics: true,
				data: featureCollection
			});

			map.addLayer(
				{
					id: 'gradient-route-layer',
					type: 'line',
					source: 'gradient-route',
					layout: {
						'line-cap': 'round',
						'line-join': 'round'
					},
					paint: {
						'line-width': 8,
						'line-gradient': gradientDefinition as any,
						'line-opacity': 1,
						'line-emissive-strength': 1
					}
				},
				'station-analysis-points-4cu7xs'
			);

			if (map.getLayer(layerId)) {
				map.setLayoutProperty(layerId, 'visibility', 'none');
			}
		}

		return () => {
			if (map) map.remove();
		};
	});
</script>

<div class="map-wrapper" bind:this={mapContainer}></div>

<style>
	.map-wrapper {
		width: 100%;
		height: 100%;
		min-height: 400px;
		border-radius: 12px;
		overflow: visible;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}

	:global(.mapboxgl-canvas) {
		border-radius: 12px;
	}
</style>
