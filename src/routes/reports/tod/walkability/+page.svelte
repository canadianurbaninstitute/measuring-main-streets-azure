<script>
	import Footer from '../../../lib/ui/Footer.svelte';
	import '../../../styles.css';
	import { intersect } from './intersect.js';
	import WalkabilityMap from './WalkabilityMap.svelte';
	import WalkabilityStreetview from './WalkabilityStreetview.svelte';

	import mapboxgl from 'mapbox-gl';
	import { mount, onMount, unmount } from 'svelte';

	// Hardcoded station target list from requirements
	let stations = $state([
		{ id: '653', name: 'Main Street Station', lng: null, lat: null },
		{ id: '106', name: 'Keele Station', lng: null, lat: null },
		{ id: '426', name: 'Islington Station', lng: null, lat: null },
		{ id: '172', name: 'Sheppard-Yonge Station', lng: null, lat: null },
		{ id: '567', name: 'Kennedy Station', lng: null, lat: null }
	]);

	// Fetch station locations on mount to populate coordinates
	onMount(async () => {
		try {
			const res = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/enriched/map_stations_enriched.json'
			);
			const allStations = await res.json();

			// Update only coordinates so we preserve the placeholder names before fetch resolves
			stations = stations.map((s) => {
				const match = allStations.find((station) => station.id === s.id);
				if (match) {
					console.log(match);
					return {
						id: s.id,
						lng: match.longitude,
						lat: match.latitude,
						name: match.stop_label || match.platform_name || s.name
					};
				}
				return s;
			});
		} catch (e) {
			console.error('Failed to load station coordinate mappings:', e);
		}
	});

	let map = $state(null);
	let activeStationId = $state(null);
	let activePopup = null;

	// Handle intersection events to move map
	function handleSectionIntersect(node) {
		const stationId = node.dataset.stationId;
		activeStationId = stationId;
	}

	// Reactively trigger map movements when the active section OR the loaded coordinates change
	$effect(() => {
		if (map && activeStationId) {
			console.log(activeStationId);
			const station = stations.find((s) => s.id === activeStationId);
			if (station) {
				console.log(station);
				map.flyTo({
					center: [station.lng, station.lat],
					zoom: 14,
					duration: 2000,
					essential: true
				});
			}
		}
	});

	// Handle Map Point Clicks
	function handlePointClick({ lng, lat, properties }) {
		if (activePopup) {
			activePopup.remove();
		}

		const container = document.createElement('div');

		const comp = mount(WalkabilityStreetview, {
			target: container,
			props: {
				coords: { lng, lat },
				properties: properties,
				onClose: () => {
					if (activePopup) activePopup.remove();
				}
			}
		});

		activePopup = new mapboxgl.Popup({
			closeButton: false, // WalkabilityStreetview handles the close button rendering
			closeOnClick: true,
			maxWidth: '350px' // ensure it fits the new streetview container width
		})
			.setLngLat([lng, lat])
			.setDOMContent(container)
			.addTo(map);

		// Clean up the Svelte component when the Mapbox popup is destroyed
		activePopup.on('close', () => {
			unmount(comp);
			activePopup = null;
		});
	}

	function closePopup() {
		if (activePopup) {
			activePopup.remove();
		}
	}
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<div class="header-section">
	<h1 class="mb-4 uppercase">Transit Walkability Report</h1>
	<p class="text-lg text-zinc-600 mb-8">
		Exploring the immediate surroundings, built form, and localized pedestrian experiences around
		key transit hubs using Mapbox scroll-telling and native Google Streetview integration. Scroll
		down to travel between stations.
	</p>
</div>
<div class="page-layout">
	<!-- Left Side: Scrolling Content Blocks -->
	<div class="content-column bg-zinc-50">
		{#each stations as station}
			<section
				class="scroll-section"
				data-station-id={station.id}
				use:intersect={handleSectionIntersect}
			>
				<h2 class="mb-4">{station.name}</h2>
				<div class="prose prose-zinc lg:prose-lg max-w-none">
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus
						hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut
						eleifend nibh porttitor. Ut in nulla enim.
					</p>
					<p>
						Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum
						feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut
						blandit odio. Proin quis tortor orci.
					</p>
					<p>
						Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus
						condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum
						faucibus eget in metus. In pellentesque faucibus vestibulum.
					</p>
					<p>
						<strong
							>Click the blue dots on the map to explore the immediate surroundings via Google Maps
							Streetview!</strong
						>
					</p>
				</div>
			</section>
		{/each}

		<div class="spacer"></div>
	</div>

	<!-- Right Side: Sticky Map -->
	<div class="map-column">
		<!-- Bind to the child map instance so we can call map.flyTo() -->
		<WalkabilityMap bind:map onStationClick={handlePointClick} />
	</div>
</div>
<Footer />

<style>
	.page-layout {
		display: flex;
		min-height: 100vh;
		position: relative;
	}

	.map-column {
		width: 50%;
		position: relative;
		display: flex;
		align-items: center; /* Centers the rectangle map vertically in the viewport if needed */
		justify-content: center;
		padding: 2rem;
		position: sticky;
		top: 0;
		height: 100vh;
	}

	.content-column {
		width: 50%;
		border-right: 1px solid #e5e7eb;
	}

	.header-section {
		padding: 15vh 10% 5vh 10%;
		background-image: url('../../../lib/assets/graphics/montreal-bg.png');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		background-attachment: fixed;
	}

	/* Each section is heavily padded to force scrolling */
	.scroll-section {
		padding: 20vh 10%;
		border-top: 1px solid #e5e7eb;
		min-height: 80vh;
	}

	/* Adding a spacer at the bottom so the final section can comfortably scroll to the middle of the screen */
	.spacer {
		height: 50vh;
	}

	.spacer {
		height: 50vh;
	}

	/* Mapbox Popup Overrides to ensure content fits */
	:global(.mapboxgl-popup-content) {
		padding: 0;
		border-radius: 12px;
		overflow: hidden;
	}

	@media (max-width: 1024px) {
		.page-layout {
			flex-direction: column;
		}

		.map-column {
			width: 100%;
			height: 50vh;
			position: sticky;
			top: 0;
			z-index: 10;
			padding: 0;
			border-left: none;
			border-bottom: 2px solid #e5e7eb;
		}

		.map-column :global(.map-wrapper) {
			height: 50vh;
		}

		.content-column {
			width: 100%;
			z-index: 20;
			background: white;
		}

		.scroll-section {
			padding: 10vh 5%;
			min-height: 60vh;
		}
	}
</style>
