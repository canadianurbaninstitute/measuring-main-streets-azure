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
							mapInstance: map
						});
					}
				}
			});

			// Apply line gradient once map is idle and segments are loaded
			// map.once('idle', applyLineGradient);
		});

		async function applyLineGradient() {
			if (!map) return;

			const layerId = 'station-analyses-overall-scor-6g4jt9';
			const sourceId = 'composite';
			const sourceLayer = 'station_analyses_overall_scor-6g4jt9';

			// 1. Extract features from the vector source layers
			const lineFeatures = map.querySourceFeatures(sourceId, {
				sourceLayer: sourceLayer
			});

			if (!lineFeatures || lineFeatures.length === 0) {
				console.warn('No line features found for gradient');
				return;
			}

			// 2. Stitch Line Segments
			const uniqueLinesMap = new Map();
			lineFeatures.forEach((f) => {
				if (f.geometry.type === 'LineString') {
					const key =
						JSON.stringify(f.geometry.coordinates[0]) +
						JSON.stringify(f.geometry.coordinates.at(-1));
					uniqueLinesMap.set(key, f);
				}
			});

			const segments = Array.from(uniqueLinesMap.values());
			if (segments.length === 0) return;

			const TOLERANCE = 0.05; // 50 meters
			let remaining = [...segments];
			let chains = [];

			while (remaining.length > 0) {
				let current = remaining.splice(0, 1)[0];
				let chain = {
					coords: [...current.geometry.coordinates],
					scores: [current.properties.overall_score || 0]
				};

				let foundMatch = true;
				while (foundMatch) {
					foundMatch = false;
					for (let i = 0; i < remaining.length; i++) {
						const s = remaining[i];
						const coords = s.geometry.coordinates;
						const score = s.properties.overall_score || 0;
						const head = chain.coords[0];
						const tail = chain.coords.at(-1);

						if (turf.distance(tail, coords[0]) < TOLERANCE) {
							chain.coords.push(...coords.slice(1));
							chain.scores.push(score);
							remaining.splice(i, 1);
							foundMatch = true;
							break;
						}
						if (turf.distance(tail, coords.at(-1)) < TOLERANCE) {
							chain.coords.push(...[...coords].reverse().slice(1));
							chain.scores.push(score);
							remaining.splice(i, 1);
							foundMatch = true;
							break;
						}
						if (turf.distance(head, coords[0]) < TOLERANCE) {
							chain.coords = [...coords].reverse().concat(chain.coords.slice(1));
							chain.scores.unshift(score);
							remaining.splice(i, 1);
							foundMatch = true;
							break;
						}
						if (turf.distance(head, coords.at(-1)) < TOLERANCE) {
							chain.coords = coords.concat(chain.coords.slice(1));
							chain.scores.unshift(score);
							remaining.splice(i, 1);
							foundMatch = true;
							break;
						}
					}
				}
				chains.push(chain);
			}

			// Join disparate chains if they are within tolerance
			chains.sort((a, b) => b.coords.length - a.coords.length);
			let primaryChain = chains[0];
			let standaloneChains = chains.slice(1);

			let joined = true;
			while (joined && standaloneChains.length > 0) {
				joined = false;
				for (let i = 0; i < standaloneChains.length; i++) {
					const other = standaloneChains[i];
					const pHead = primaryChain.coords[0];
					const pTail = primaryChain.coords.at(-1);
					const oHead = other.coords[0];
					const oTail = other.coords.at(-1);

					if (turf.distance(pTail, oHead) < TOLERANCE) {
						primaryChain.coords.push(...other.coords.slice(1));
						primaryChain.scores.push(...other.scores);
						standaloneChains.splice(i, 1);
						joined = true;
						break;
					} else if (turf.distance(pTail, oTail) < TOLERANCE) {
						primaryChain.coords.push(...[...other.coords].reverse().slice(1));
						primaryChain.scores.push(...[...other.scores].reverse());
						standaloneChains.splice(i, 1);
						joined = true;
						break;
					} else if (turf.distance(pHead, oHead) < TOLERANCE) {
						primaryChain.coords = [...other.coords].reverse().concat(primaryChain.coords.slice(1));
						primaryChain.scores = [...other.scores].reverse().concat(primaryChain.scores);
						standaloneChains.splice(i, 1);
						joined = true;
						break;
					} else if (turf.distance(pHead, oTail) < TOLERANCE) {
						primaryChain.coords = other.coords.concat(primaryChain.coords.slice(1));
						primaryChain.scores = other.scores.concat(primaryChain.scores);
						standaloneChains.splice(i, 1);
						joined = true;
						break;
					}
				}
			}

			// Create FeatureCollection of all road pieces so we don't lose anything
			const featureCollection = turf.featureCollection(
				[primaryChain, ...standaloneChains].map((c) => turf.lineString(c.coords))
			);

			// 3. Generate Progress Stops based on the primary chain
			const colorScale = chroma.scale(['#2ecc71', '#f1c40f', '#e74c3c']).domain([1, 2.5, 4]);
			const stops = [];

			primaryChain.scores.forEach((score, idx) => {
				const progress = idx / (primaryChain.scores.length - 1);
				stops.push({
					progress: Math.min(Math.max(progress, 0), 1),
					color: colorScale(score).hex()
				});
			});

			// Strictly ascending stops for Mapbox
			const uniqueStops = [];
			stops.forEach((s) => {
				if (uniqueStops.length === 0 || s.progress > uniqueStops[uniqueStops.length - 1].progress) {
					uniqueStops.push(s);
				}
			});

			if (uniqueStops.length > 0) {
				if (uniqueStops[0].progress > 0)
					uniqueStops.unshift({ progress: 0, color: uniqueStops[0].color });
				if (uniqueStops[uniqueStops.length - 1].progress < 1)
					uniqueStops.push({ progress: 1, color: uniqueStops[uniqueStops.length - 1].color });
			} else {
				return;
			}

			const finalStops = [];
			uniqueStops.forEach((s) => {
				if (finalStops.length === 0 || s.progress > finalStops[finalStops.length - 1].progress) {
					finalStops.push(s);
				}
			});

			const gradientDefinition = ['interpolate', ['linear'], ['line-progress']];
			finalStops.forEach((s) => {
				gradientDefinition.push(s.progress, s.color);
			});

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
						'line-opacity': 1
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
		overflow: hidden;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}
</style>
