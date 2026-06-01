<script lang="ts">
	import circle from '@turf/circle';
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	import { transit_lines_source } from '../../../lib/data/transitdata/config-mapbox.json';
	import line_colors from '../../../lib/data/transitdata/line-colors.json';
	import transitRegions from '../../../lib/data/transitdata/transit-regions.json';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	let {
		map = $bindable(),
		center,
		zoom,
		onStationClick,
		activeCoords,
		fullScreen = false,
		selectedRegion = 'greater_golden_horseshoe',
		caption = 'Figure 2 – Urban transit networks and food access intensities',
		source = 'Spatial Visualization Study (2026)'
	} = $props();

	let mapContainer;
	let activeRegion = $state(selectedRegion);

	// Get region data
	let currentRegionData = $derived.by(() => {
		return transitRegions.find((r) => r.id === activeRegion);
	});

	// Calculate map center from bbox
	let regionCenter = $derived.by(() => {
		if (!currentRegionData) return center || [-79.3832, 43.6532];
		const [minLng, minLat, maxLng, maxLat] = currentRegionData.bbox;
		return [(minLng + maxLng) / 2, (minLat + maxLat) / 2];
	});

	// Calculate appropriate zoom level
	let regionZoom = $derived.by(() => {
		if (!currentRegionData) return zoom || 11;
		const [minLng, minLat, maxLng, maxLat] = currentRegionData.bbox;
		const lng_span = maxLng - minLng;
		const lat_span = maxLat - minLat;
		const max_span = Math.max(lng_span, lat_span);
		// Approximate zoom calculation
		return Math.round(Math.log2(360 / max_span)) - 1;
	});

	function updateMask(coords) {
		if (!map || !map.getSource('circle') || !map.getSource('circle-mask') || !coords) return;

		const radiusInKm = 0.8;
		const circleFeature = circle(coords, radiusInKm, {
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
		if (targetCoords && map && map.getSource('circle')) {
			updateMask(targetCoords);
		}
	});

	// Update map when region changes
	$effect(() => {
		if (map && currentRegionData && !map.isMoving()) {
			map.fitBounds(
				[
					[currentRegionData.bbox[0], currentRegionData.bbox[1]],
					[currentRegionData.bbox[2], currentRegionData.bbox[3]]
				],
				{
					padding: 40,
					duration: 1000
				}
			);
		}
	});

	function changeRegion(regionId: string) {
		activeRegion = regionId;
	}

	onMount(() => {
		map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/canadianurbaninstitute/cmn7wup2g001n01s6hree42l7?optimize=true',
			center: regionCenter,
			zoom: regionZoom,
			scrollZoom: false,
			attributionControl: false
		});

		map.addControl(new mapboxgl.NavigationControl(), 'top-right');

		// Change cursor to pointer over interactive layers
		const interactiveLayers = ['station-analysis-points-expla-c0bvk5', 'grocery-stores'];
		interactiveLayers.forEach((layer) => {
			map.on('mouseenter', layer, () => {
				map.getCanvas().style.cursor = 'pointer';
			});
			map.on('mouseleave', layer, () => {
				map.getCanvas().style.cursor = '';
			});
		});

		map.on('load', () => {
			map.addSource('transit-line-data', {
				type: 'vector',
				url: transit_lines_source.url
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

			// Convert line colours to Mapbox expression
			const lineColorExpression = [
				'match',
				['get', 'line_id'],
				...Object.entries(line_colors).flatMap(([id, color]) => [
					[Number(id)], // Wrap the number in an array
					color
				]),
				'#000000' // Fallback color
			];

			map.addLayer({
				id: 'transit-lines',
				type: 'line',
				source: 'transit-line-data',
				'source-layer': transit_lines_source.source_layer,
				paint: {
					'line-color':
						lineColorExpression as mapboxgl.DataDrivenPropertyValueSpecification<string>,
					'line-width': ['interpolate', ['linear'], ['zoom'], 3, 0, 7, 4, 12, 8],
					'line-dasharray': [
						'case',
						[
							'any',
							['==', ['get', 'status'], 'Construction'],
							['==', ['get', 'status'], 'Planned']
						],
						['literal', [1, 2]],
						['literal', [1, 0]]
					]
				}
			});

			map.addSource('selected-station', {
				type: 'geojson',
				data: { type: 'FeatureCollection', features: [] }
			});

			map.addLayer({
				id: 'selected-station-highlight',
				type: 'circle',
				source: 'selected-station',
				paint: {
					'circle-radius': 5,
					'circle-stroke-width': 3,
					'circle-stroke-color': '#ffffff',
					'circle-emissive-strength': 1,
					'circle-color': 'transparent'
				}
			});

			// Initial mask update
			const targetCoords = activeCoords || center;
			if (targetCoords) {
				updateMask(targetCoords);
			}
		});
	});
</script>

<div class="map-wrapper {fullScreen ? 'full-screen' : ''}" bind:this={mapContainer}>
	<div class="region-nav">
		{#each transitRegions as region}
			<button class:active={activeRegion === region.id} onclick={() => changeRegion(region.id)}>
				{region.name}
			</button>
		{/each}
	</div>
</div>

<style>
	.map-wrapper {
		width: 100%;
		height: 100%;
		min-height: 300px;
		border-radius: 12px;
		overflow: visible;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
		position: relative;
	}

	.map-wrapper.full-screen {
		border-radius: 0;
		box-shadow: none;
		min-height: auto;
		height: 100vh;
	}

	:global(.mapboxgl-canvas) {
		border-radius: inherit;
	}

	.region-nav {
		position: absolute;
		top: 1rem;
		left: 1rem;
		z-index: 10;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		max-width: 300px;
	}

	.region-nav button {
		background: white;
		border: 1px solid #e2e8f0;
		padding: 4px 10px;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
		transition: all 0.2s;
	}

	.region-nav button:hover {
		background: #f8fafc;
	}

	.region-nav button.active {
		background: var(--color-blue-400, #60a5fa);
		color: white;
		border-color: var(--color-blue-500, #3b82f6);
	}

	.map-caption {
		margin-top: 0.75rem;
		font-size: 0.875rem;
		color: #666;
	}

	.caption-text {
		margin: 0 0 0.25rem 0;
		font-weight: 600;
	}

	.source-text {
		margin: 0;
		font-size: 0.8rem;
		color: #999;
	}

	:global(.source-text a) {
		color: #3b82f6;
		text-decoration: none;
	}

	:global(.source-text a:hover) {
		text-decoration: underline;
	}
</style>
