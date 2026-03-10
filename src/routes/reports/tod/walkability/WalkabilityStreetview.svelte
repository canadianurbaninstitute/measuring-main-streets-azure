<script>
	import { onMount } from 'svelte';
	// Get key gracefully if set, or warn missing.
	import { env } from '$env/dynamic/public';
	import Icon from '@iconify/svelte';
	import chroma from 'chroma-js';

	let { coords, properties, onClose } = $props();

	let panoContainer;
	let panorama;
	let showDetails = $state(false);

	// Scale from user requirement: 0 (green) -> 50 (yellow) -> 100 (red)
	// Mapbox scores seem to be 0-5 scale based on the data, let's normalize or use fixed domains
	const colorScale = chroma.scale(['#ef4444', '#f59e0b', '#10b981']).domain([1, 3, 5]);

	const getScoreColor = (score) => colorScale(score || 0).hex();

	onMount(() => {
		// Define the initMap callback on the global window object before loading script
		window.initStreetView = () => {
			if (panoContainer && coords) {
				const position = { lat: coords.lat, lng: coords.lng };

				panorama = new google.maps.StreetViewPanorama(panoContainer, {
					position: position,
					pov: {
						heading: properties?.heading || 165,
						pitch: 0
					},
					zoom: 1,
					addressControl: false,
					showRoadLabels: false,
					visible: true
				});
			}
		};

		// Only load the script if the Google Maps API isn't already present
		if (!window.google || !window.google.maps) {
			const apiKey = env.PUBLIC_GOOGLE_MAPS_API_KEY;

			if (!apiKey) {
				console.error(
					'Missing PUBLIC_GOOGLE_MAPS_API_KEY environment variable. Streetview will not load.'
				);
				return;
			}

			const script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initStreetView`;
			script.async = true;
			script.defer = true;
			document.head.appendChild(script);
		} else {
			// If already loaded by another component, just fire the initialization
			window.initStreetView();
		}

		return () => {
			// Cleanup global callback
			if (window.initStreetView) {
				delete window.initStreetView;
			}
		};
	});

	const metrics = $derived([
		{ label: 'Sidewalk', key: 'sidewalk_analysis_score', icon: 'mdi:walk' },
		{
			label: 'Accessibility',
			key: 'accessibility_analysis_score',
			icon: 'mdi:wheelchair-accessibility'
		},
		{ label: 'Street Quality', key: 'street_quality_score', icon: 'mdi:road-variant' },
		{ label: 'Building', key: 'building_analysis_score', icon: 'mdi:office-building-outline' },
		{ label: 'Placemaking', key: 'place_making_analysis_score', icon: 'mdi:bench' },
		{ label: 'Bicycle', key: 'bicycle_infrastructure_score', icon: 'mdi:bike' }
	]);
</script>

<div class="streetview-container bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
	<div class="relative w-full h-48 bg-zinc-900 overflow-hidden">
		<button
			class="absolute top-3 right-3 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full w-8 h-8 flex items-center justify-center font-bold z-50 transition-all border border-white/20"
			onclick={onClose}
			aria-label="Close"
		>
			<Icon icon="mdi:close" />
		</button>

		<div bind:this={panoContainer} class="w-full h-full">
			<div class="w-full h-full flex flex-col items-center justify-center text-xs text-zinc-400">
				<Icon icon="mdi:google-maps" class="text-3xl mb-2 opacity-50" />
				Loading Streetview...
			</div>
		</div>

		<div
			class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"
		>
			<div class="flex justify-between items-end text-white">
				<div>
					<h3 class="text-xs uppercase tracking-wider font-bold opacity-80 decoration-zinc-400">
						Overall Score
					</h3>
					<div
						class="text-3xl font-black"
						style="color: {getScoreColor(properties?.overall_score)}"
					>
						{properties?.overall_score?.toFixed(1) || 'N/A'}
					</div>
				</div>
				<Icon icon="mdi:information-outline" class="text-xl opacity-60" />
			</div>
		</div>
	</div>

	<div class="flex-grow p-4 overflow-y-auto">
		<div class="grid grid-cols-2 gap-3">
			{#each metrics as metric}
				<div class="flex items-center gap-2 p-2 bg-zinc-50 rounded-lg border border-zinc-100">
					<div
						class="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm border border-zinc-200"
						style="color: {getScoreColor(properties?.[metric.key])}"
					>
						<Icon icon={metric.icon} class="text-lg" />
					</div>
					<div class="flex-grow min-w-0">
						<div class="text-[10px] text-zinc-500 font-semibold uppercase truncate">
							{metric.label}
						</div>
						<div class="text-sm font-bold text-zinc-800">
							{properties?.[metric.key]?.toFixed(1) || '—'}
						</div>
					</div>
				</div>
			{/each}
		</div>

		{#if properties?.overall_assessment_explanation}
			<div
				class="mt-4 p-3 bg-zinc-50 rounded-lg border border-zinc-100 text-[11px] text-zinc-600 leading-relaxed italic"
			>
				"{properties.overall_assessment_explanation}"
			</div>
		{/if}
	</div>
</div>

<style>
	.streetview-container {
		width: 350px;
		max-width: 90vw;
	}

	:global(.mapboxgl-popup-content) {
		background: transparent !important;
		padding: 0 !important;
		box-shadow: none !important;
	}

	:global(.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip) {
		border-top-color: white !important;
	}
	:global(.mapboxgl-popup-anchor-top .mapboxgl-popup-tip) {
		border-bottom-color: white !important;
	}
</style>
