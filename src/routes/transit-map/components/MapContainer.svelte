<script lang="ts">
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	import { PUBLIC_MAPBOX_ACCESS_TOKEN } from '$env/static/public';
	import {
		da_map_source,
		transit_lines_source,
		transit_map_style,
		transit_regions_source,
		transit_stations_source
	} from '../../lib/data/transitdata/config-mapbox.json';
	import line_colors from '../../lib/data/transitdata/line-colors.json';
	import Legend from './Legend.svelte';

	interface Props {
		selectedVariable: string | null | undefined;
		min: number | undefined;
		max: number | undefined;
		activeTab: string;
		updateLayerVariable: (variable: string | null | undefined) => void;
		statusFilters: string[];
		technologyFilters: string[];
		map: mapboxgl.Map | undefined;
		mapCenter: [number, number];
		defaultZoom: number;
		processedStationData: any[];
		selectStop: (stop: any) => void;
		selectRegion: (region: any) => void;
		regionsData: any[];
		missingTier1: any[];
		missingTier2: any[];
	}

	let {
		selectedVariable,
		min,
		max,
		activeTab,
		updateLayerVariable,
		statusFilters,
		technologyFilters,
		map = $bindable(),
		mapCenter,
		defaultZoom,
		processedStationData,
		selectStop,
		selectRegion,
		regionsData,
		missingTier1,
		missingTier2
	}: Props = $props();

	mapboxgl.accessToken = PUBLIC_MAPBOX_ACCESS_TOKEN;

	$effect(() => {
		if (!map) return;
		applyFilters();
	});

	onMount(async () => {
		map = new mapboxgl.Map({
			container: 'map',
			style: transit_map_style.url,
			center: mapCenter,
			zoom: defaultZoom,
			maxZoom: 15.5,
			minZoom: 2,
			scrollZoom: true,
			attributionControl: false
		});

		map.addControl(new mapboxgl.NavigationControl(), 'top-left');

		map.addControl(
			new mapboxgl.AttributionControl({
				customAttribution: 'Canadian Urban Institute'
			})
		);

		map.on('load', () => {
			if (!map) return;

			map.addSource('transit-station-data', {
				type: 'vector',
				url: transit_stations_source.url
			});
			map.addSource('transit-line-data', {
				type: 'vector',
				url: transit_lines_source.url
			});
			map.addSource('transit-region-data', {
				type: 'vector',
				url: transit_regions_source.url
			});
			map.addSource('circle-mask', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: []
				}
			});
			map.addSource('circle', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: []
				}
			});
			map.addSource('da_map', {
				type: 'vector',
				url: da_map_source.url
			});

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
			map.addLayer({
				id: 'transit-stations',
				type: 'circle',
				source: 'transit-station-data',
				'source-layer': transit_stations_source.source_layer,
				paint: {
					'circle-color': '#fff',
					'circle-radius': ['interpolate', ['linear'], ['zoom'], 6, 0, 7, 2, 10, 3, 12, 6, 14, 10],
					'circle-stroke-color': '#000',
					'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 6, 0, 7, 0.8, 10, 1.5, 13, 2]
				},
				minzoom: 6
			});
			map.addLayer({
				id: 'circle-mask',
				type: 'fill',
				source: 'circle-mask',
				paint: {
					'fill-color': '#ffffff',
					'fill-opacity': 0.8
				}
			});
			map.addLayer(
				{
					id: 'circle-radius',
					type: 'line',
					source: 'circle',
					paint: {
						'line-color': '#222',
						'line-opacity': 1,
						'line-width': 3,
						'line-dasharray': [2, 2]
					}
				},
				'transit-stations'
			);
			map.addLayer({
				id: 'transit-region-points',
				type: 'circle',
				source: 'transit-region-data',
				'source-layer': transit_regions_source.source_layer,
				paint: {
					'circle-color': '#34bef9',
					'circle-radius': 8,
					'circle-stroke-color': '#fff',
					'circle-stroke-width': 1
				},
				maxzoom: 5
			});

			map.setPaintProperty('complete-community-amenities', 'icon-opacity', 0);

			map.on('click', 'transit-stations', (e: any) => {
				if (e.features && e.features.length > 0) {
					const stationId = e.features[0].properties.id;
					const stationDataForClick = processedStationData.find((s) => s.id === stationId);
					if (stationDataForClick) {
						selectStop(stationDataForClick);
					}
				}
			});

			map.on('click', 'transit-region-points', (e: any) => {
				if (e.features && e.features.length > 0) {
					const regionId = e.features[0].properties.id;
					const regionClicked = regionsData.find((r) => r.id === regionId);
					selectRegion(regionClicked);
				}
			});

			map.on('zoom', () => {
				if (!map) return;
				if (map.getLayer('da')) {
					updateLayerVariable(selectedVariable);
				}
			});
		});

		const popup = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false
		});

		popup.addClassName('station-popup');

		const popup2 = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false
		});

		popup2.addClassName('line-popup');

		const popup3 = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false
		});

		popup3.addClassName('region-popup');

		map.on('mouseenter', ['transit-stations', 'transit-lines', 'transit-region-points'], () => {
			if (map) map.getCanvas().style.cursor = 'pointer';
		});

		map.on('mousemove', 'transit-stations', (e: any) => {
			if (map && e.features && e.features.length > 0) {
				const coordinates = e.lngLat;
				const name = e.features[0].properties.stop_label;

				popup.setLngLat(coordinates).setHTML(`<span class="label-name">${name}</span>`).addTo(map);
			}
		});

		map.on('mousemove', 'transit-region-points', (e: any) => {
			if (map && e.features && e.features.length > 0) {
				const coordinates = e.lngLat;
				const name = e.features[0].properties.region;

				if (map.getZoom() <= 5) {
					popup3
						.setLngLat(coordinates)
						.setHTML(`<span class="label-name">${name}</span>`)
						.addTo(map);
				}
			}
		});

		map.on('mouseleave', 'transit-stations', () => {
			popup.remove();
		});

		map.on('mouseleave', 'transit-lines', () => {
			popup2.remove();
		});

		map.on('mouseleave', 'transit-region-points', () => {
			popup3.remove();
		});

		map.on('mouseleave', ['transit-stations', 'transit-lines', 'transit-region-points'], () => {
			if (map) map.getCanvas().style.cursor = '';
		});
	});

	function applyFilters() {
		if (!map) return;
		const filterConditions: any[] = [];

		if (statusFilters.length) {
			filterConditions.push([
				'any',
				...statusFilters.map((status) => [
					'case',
					['!=', ['index-of', status, ['get', 'status']], -1],
					true,
					false
				])
			]);
		}

		if (technologyFilters.length) {
			filterConditions.push([
				'any',
				...technologyFilters.map((tech) => [
					'case',
					['!=', ['index-of', tech, ['get', 'technology']], -1],
					true,
					false
				])
			]);
		}

		const combinedFilter = filterConditions.length ? ['all', ...filterConditions] : null;

		const layers = ['transit-stations', 'transit-lines'];
		if (layers.length === 0) return;

		layers.forEach((layer) => {
			if (map?.getLayer(layer)) {
				map.setFilter(layer, combinedFilter);
			}
		});
	}

	const lineColorExpression = [
		'match',
		['get', 'line_id'],
		...Object.entries(line_colors).flatMap(([id, color]) => [Number(id), color]),
		'#000000'
	];
</script>

<div id="map-container">
	<div id="map"></div>
	<Legend {map} {missingTier1} {missingTier2} {activeTab} {selectedVariable} {min} {max} />
</div>

<style>
	:global(.mapboxgl-popup-content) {
		background: var(--color-slate-900) !important;
		padding: 6px !important;
		border-radius: 6px !important;
	}

	#map {
		height: 100%;
		width: 100%;
		position: relative;
		order: -1;
	}

	#map-container {
		height: 100%;
		width: 100%;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	@media only screen and (max-width: 768px) {
		#map-container {
			min-height: 100vw;
		}

		#map {
			min-height: 100vw;
		}
	}
</style>
