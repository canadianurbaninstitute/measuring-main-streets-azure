<script>
	import { onMount } from 'svelte';
	// Get key gracefully if set, or warn missing.
	import { env } from '$env/dynamic/public';

	let { coords, properties, onClose } = $props();

	let panoContainer;
	let panorama;

	onMount(() => {
		// Define the initMap callback on the global window object before loading script
		window.initStreetView = () => {
			if (panoContainer && coords) {
				const position = { lat: coords.lat, lng: coords.lng };

				panorama = new google.maps.StreetViewPanorama(panoContainer, {
					position: position,
					pov: {
						heading: 34,
						pitch: 10
					},
					zoom: 1
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
</script>

<div class="w-full streetview-popup bg-black relative">
	<button
		class="close-button absolute top-2 right-2 bg-zinc-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow hover:bg-zinc-700 z-50 transition-colors"
		onclick={onClose}
		aria-label="Close Streetview"
	>
		✕
	</button>

	<div class="h-full w-full flex flex-col">
		<div
			bind:this={panoContainer}
			class="pano-container w-full flex-grow bg-zinc-200 rounded overflow-hidden"
		>
			<!-- If the map key is missing or slow, this shows temporarily -->
			<div
				class="w-full h-full flex items-center justify-center text-xs text-zinc-400 text-center px-4"
			>
				Loading Google Streetview...
			</div>
		</div>
	</div>
</div>

<style>
	.streetview-popup {
		width: 320px;
		max-width: 90vw;
		height: 320px;
		display: flex;
		flex-direction: column;
	}

	.pano-container {
		flex-grow: 1;
		min-height: 0;
	}
</style>
