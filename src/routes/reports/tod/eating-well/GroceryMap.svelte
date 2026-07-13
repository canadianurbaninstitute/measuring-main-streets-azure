<script lang="ts">
	import circle from '@turf/circle';
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	import configMapbox from '../../../lib/data/transitdata/config-mapbox.json';
	import line_colors from '../../../lib/data/transitdata/line-colors.json';
	import type { Regions } from '../../../lib/data/transitdata/transit-regions';
	import transitRegionsData from '../../../lib/data/transitdata/transit-regions.json';
	import { PUBLIC_MAPBOX_ACCESS_TOKEN } from '$env/static/public';

	const transit_lines_source = configMapbox.transit_lines_source;

	const transitRegions = transitRegionsData as Regions;

	mapboxgl.accessToken = PUBLIC_MAPBOX_ACCESS_TOKEN;

	interface Props {
		map?: mapboxgl.Map | undefined;
		center?: [number, number];
		zoom?: number;
		onStationClick?: (station: any) => void;
		activeCoords?: [number, number] | null;
		fullScreen?: boolean;
		selectedRegion?: string;
		caption?: string;
		source?: string;
	}

	let {
		map = $bindable(),
		center,
		zoom,
		onStationClick,
		activeCoords,
		fullScreen = false,
		selectedRegion = 'greater_golden_horseshoe'
	}: Props = $props();

	let mapContainer: HTMLDivElement;
	let activeRegion = $state(selectedRegion);

	let currentRegionData = $derived.by(() => {
		return transitRegions.find((r) => r.id === activeRegion);
	});

	let regionCenter = $derived.by<[number, number]>(() => {
		if (!currentRegionData) return center || [-79.3832, 43.6532];
		const [minLng, minLat, maxLng, maxLat] = currentRegionData.bbox;
		return [(minLng + maxLng) / 2, (minLat + maxLat) / 2];
	});

	let regionZoom = $derived.by(() => {
		if (!currentRegionData) return zoom || 11;
		const [minLng, minLat, maxLng, maxLat] = currentRegionData.bbox;
		const lng_span = maxLng - minLng;
		const lat_span = maxLat - minLat;
		const max_span = Math.max(lng_span, lat_span);
		return Math.round(Math.log2(360 / max_span)) - 1;
	});

	function updateMask(coords: [number, number]) {
		if (!map || !coords) return;

		const circleSource = map.getSource('circle') as mapboxgl.GeoJSONSource;
		const maskSource = map.getSource('circle-mask') as mapboxgl.GeoJSONSource;

		if (!circleSource || !maskSource) return;

		const radiusInKm = 0.8;
		const circleFeature = circle(coords, radiusInKm, {
			steps: 128,
			units: 'kilometers'
		});

		if (!circleFeature.geometry || !circleFeature.geometry.coordinates) return;

		const maskFeature = {
			type: 'Feature' as const,
			properties: {},
			geometry: {
				type: 'Polygon' as const,
				coordinates: [
					[
						[-180, -90],
						[180, -90],
						[180, 90],
						[-180, 90],
						[-180, -90]
					],
					[...circleFeature.geometry.coordinates[0]].reverse()
				]
			}
		};

		circleSource.setData({
			type: 'FeatureCollection',
			features: [circleFeature as any]
		});

		maskSource.setData({
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

		const interactiveLayers = ['station-analysis-points-expla-c0bvk5', 'grocery-stores'];
		interactiveLayers.forEach((layer) => {
			map!.on('mouseenter', layer, () => {
				map!.getCanvas().style.cursor = 'pointer';
			});
			map!.on('mouseleave', layer, () => {
				map!.getCanvas().style.cursor = '';
			});
		});

		map.on('load', () => {
			if (!map) return;

			map.addSource('transit-line-data', {
				type: 'vector',
				url: transit_lines_source.url
			});

			map.addSource('circle-mask', {
				type: 'geojson',
				data: { type: 'FeatureCollection', features: [] }
			});

			map.addSource('circle', {
				type: 'geojson',
				data: { type: 'FeatureCollection', features: [] }
			});

			const lineColorExpression: any[] = [
				'match',
				['get', 'line_id'],
				...Object.entries(line_colors).flatMap(([id, color]) => [Number(id), color]),
				'#000000'
			];

			map.addLayer(
				{
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
				},
				'grocery-4ikxe7 (1)'
			);

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
					'circle-color': 'transparent'
				}
			});

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
			<button
				class:active={activeRegion === region.id}
				onclick={() => changeRegion(region?.id as string)}
			>
				{region.name}
			</button>
		{/each}
	</div>
</div>

<style>
	.map-wrapper {
		width: 100%;
		height: 100%;
		min-height: 600px;
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

	:global(.source-text a) {
		color: #3b82f6;
		text-decoration: none;
	}

	:global(.source-text a:hover) {
		text-decoration: underline;
	}
</style>
