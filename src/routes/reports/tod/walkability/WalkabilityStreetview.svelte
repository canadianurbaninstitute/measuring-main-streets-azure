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
	const colorScale = chroma
		.scale(['#8b1b1d', '#ff9c2c', '#eeee00', '#74c800', '#13612c'])
		.domain([0.5, 1.375, 2.25, 3.125, 4]);

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
	<div class="relative w-full h-40 sm:h-48 overflow-hidden">
		<button
			class="absolute top-3 left-3 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full w-8 h-8 flex items-center justify-center font-bold z-50 transition-all border border-white/20"
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
	</div>

	<div class="flex-grow p-3 overflow-y-auto custom-scrollbar">
		<div class="grid grid-cols-2 gap-2">
			{#each metrics as metric}
				<div class="flex items-center gap-2 p-1.5 bg-zinc-50 rounded-lg border border-zinc-100">
					<div
						class="w-7 h-7 rounded-full flex items-center justify-center bg-white shadow-sm border border-zinc-200 shrink-0"
						style="color: {getScoreColor(properties?.[metric.key])}"
					>
						<Icon icon={metric.icon} class="text-base" />
					</div>
					<div class="flex-grow min-w-0">
						<div class="text-[9px] text-zinc-400 font-bold uppercase truncate leading-tight">
							{metric.label}
						</div>
						<div class="text-xs font-black text-zinc-800">
							{properties?.[metric.key]?.toFixed(1) || '—'}
						</div>
					</div>
				</div>
			{/each}
		</div>

		{#if properties?.overall_assessment_explanation}
			<div
				class="mt-3 p-3 bg-zinc-50 rounded-lg border border-zinc-100 text-[11px] text-zinc-600 leading-relaxed italic"
			>
				"{properties.overall_assessment_explanation}"
			</div>
		{/if}

		<div class="mt-4 pt-3 pb-2 border-t border-zinc-100 flex items-center justify-between">
			<div class="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
				Overall Walkability
			</div>
			<div
				class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black tabular-nums shadow-inner border border-white/20"
				style="background-color: {getScoreColor(
					properties?.overall_score
				)}; color: {chroma.contrast(getScoreColor(properties?.overall_score), 'white') > 2
					? 'white'
					: '#18181b'}"
			>
				{properties?.overall_score?.toFixed(1) || 'N/A'}
			</div>
		</div>
	</div>
</div>

<style>
	.streetview-container {
		width: 320px;
		max-width: 90vw;
		max-height: 80vh;
	}

	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: #e4e4e7;
		border-radius: 10px;
	}

	:global(.mapboxgl-popup) {
		z-index: 1000;
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
