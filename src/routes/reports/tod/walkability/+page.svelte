<script>
	import methodologyImg from '../../../lib/assets/graphics/methodology.svg';
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
					return {
						id: s.id,
						lng: match.longitude,
						lat: match.latitude,
						name: match.stop_label || match.platform_name || s.name,
						region: match.region
					};
				}
				return s;
			});
			console.log(stations);
		} catch (e) {
			console.error('Failed to load station coordinate mappings:', e);
		}
	});

	let map = $state(null);
	let activeStationId = $state(null);
	let activePopup = null;

	let innerWidth = $state(0);
	let isMobile = $derived(innerWidth > 0 && innerWidth < 1024);

	let activeStation = $derived(stations.find((s) => s.id === activeStationId));
	let activeCoords = $derived(
		activeStation && activeStation.lng && activeStation.lat
			? [activeStation.lng, activeStation.lat]
			: null
	);

	// Handle intersection events to move map
	function handleSectionIntersect(node) {
		const stationId = node.dataset.stationId;
		activeStationId = stationId;
	}

	// Reactively trigger map movements when the active section OR the loaded coordinates change
	$effect(() => {
		if (map && activeStationId) {
			const station = stations.find((s) => s.id === activeStationId);
			if (station) {
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
	function handlePointClick({ lng, lat, properties, mapInstance, point }) {
		if (activePopup) {
			activePopup.remove();
		}

		// Calculate dynamic anchor based on click position
		const mapCanvas = mapInstance.getCanvas();
		const w = mapCanvas.clientWidth;
		const h = mapCanvas.clientHeight;

		// Thresholds for flipping
		const vThreshold = h * 0.5;
		const hThreshold = w * 0.25;

		let vAnchor = point && point.y < vThreshold ? 'top' : 'bottom';
		let hAnchor = '';
		if (point) {
			if (point.x < hThreshold) hAnchor = '-left';
			else if (point.x > w - hThreshold) hAnchor = '-right';
		}

		const anchor = vAnchor + hAnchor || 'bottom';

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
			maxWidth: '350px', // ensure it fits the new streetview container width
			anchor: anchor,
			offset: {
				top: [0, 10],
				'top-left': [10, 10],
				'top-right': [-10, 10],
				bottom: [0, -20],
				'bottom-left': [10, -10],
				'bottom-right': [-10, -10],
				left: [15, 0],
				right: [-15, 0]
			}
		})
			.setLngLat([lng, lat])
			.setDOMContent(container)
			.addTo(mapInstance || map);

		// Clean up the Svelte component when the Mapbox popup is destroyed
		activePopup.on('close', () => {
			unmount(comp);
			activePopup = null;
			const targetMap = mapInstance || map;
			if (targetMap && targetMap.getSource('selected-station')) {
				targetMap.getSource('selected-station').setData({
					type: 'FeatureCollection',
					features: []
				});
			}
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

<svelte:window bind:innerWidth />

<div class="header-section">
	<div class="header-content">
		<h1 class="mb-4 uppercase">
			Complete Communities and <span class="text-blue-300">Walkability</span>
		</h1>
		<h3><span class="text-slate-500">A Forgotten Facet of Transit Oriented Development</span></h3>
	</div>
</div>
<div class="page-layout">
	<!-- Background Map -->
	{#if !isMobile}
		<div class="map-background">
			<WalkabilityMap bind:map onStationClick={handlePointClick} {activeCoords} fullScreen={true} />
		</div>
	{/if}

	<!-- Foreground: Scrolling Content Blocks -->
	<div class="content-foreground">
		{#each stations as station}
			<section
				class="scroll-section"
				data-station-id={station.id}
				use:intersect={handleSectionIntersect}
			>
				<h2 class="station-title">{station.name}</h2>
				<h4 class="mb-4 station-region">{station.region}</h4>
				<div class="prose prose-zinc prose-invert lg:prose-lg max-w-none">
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
							>Click the dots on the map to explore the immediate surroundings via Google Maps
							Streetview.</strong
						>
					</p>
				</div>

				{#if isMobile && station.lng && station.lat}
					<div class="mt-8 w-full h-[400px] rounded-xl overflow-hidden shadow-md">
						<WalkabilityMap
							center={[station.lng, station.lat]}
							zoom={14}
							onStationClick={handlePointClick}
						/>
					</div>
				{/if}
			</section>
		{/each}
	</div>

	<!-- Right Side: Sticky Map (Hidden on mobile) -->
</div>
<section class="container p-20">
	<h2 class="mb-4 w-full">Methodology</h2>
	<div class="border-b border-slate-100 w-full"></div>
	<img class="my-4" src={methodologyImg} alt="Methodology" />
	<p class="mb-4">
		The public realm analysis leverages the Google Maps and OpenAI APIs to quantitatively assess
		walkability from a pedestrian-centred point of view. Images are sampled along 500m intervals on
		the road network surrounding a transit station area. At each coordinate, images are captured at
		60 degree intervals to capture the entire 360 degree landscape at that coordinate.
	</p>
	<p>
		Each image is then individually passed into the GPT-4o model in the OpenAI API. The multimodal
		vision model is primed with a prompt to analyse photos across 22 separate metrics and output a
		dataset capturing this analysis. The score for each metric is accompanied by a short
		justification, allowing for granular analysis at scale. The dataset is organised as follows:
	</p>
</section>
<Footer />

<style>
	.page-layout {
		position: relative;
		min-height: 100vh;
		display: grid;
		grid-template-columns: 1fr;
	}

	.station-title {
		color: var(--color-blue-100);
	}

	.station-region {
		color: var(--color-blue-50);
		font-size: 1.25rem;
	}

	.map-background {
		grid-column: 1;
		grid-row: 1;
		position: sticky;
		top: 0;
		width: 100%;
		height: 100vh;
		z-index: 0;
	}

	.content-foreground {
		grid-column: 1;
		grid-row: 1;
		width: 40%;
		max-width: 600px;
		position: relative;
		z-index: 10;
		pointer-events: none;
	}

	.header-section {
		position: relative;
		width: 100%;
		z-index: 10;
		/* padding: 5vh 10%; */
		background-image: url('../../../lib/assets/screenshots/walkability-arbutus.png');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		background-attachment: fixed;
	}

	.header-content {
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(4px);
		padding: 10% 10%;
		/* border-radius: 2rem; */
	}

	/* Each section is heavily padded to force scrolling */
	.scroll-section {
		pointer-events: auto;
		margin: 20vh 0 20vh 10%;
		padding: 3rem;
		color: #f4f4f5; /* zinc-50 */
		backdrop-filter: blur(12px);
		border-radius: 1.5rem;
		box-shadow:
			0 20px 25px -5px rgba(0, 0, 0, 0.5),
			0 10px 10px -5px rgba(0, 0, 0, 0.3);
		min-height: 40vh;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	/* Mapbox Popup Overrides to ensure content fits */
	:global(.mapboxgl-popup-content) {
		padding: 0;
		border-radius: 12px;
		overflow: hidden;
	}

	@media (max-width: 1024px) {
		.content-foreground {
			width: 100%;
			max-width: none;
			pointer-events: auto;
		}

		.scroll-section {
			margin: 0;
			padding: 10vh 5%;
			min-height: 60vh;
			border-radius: 0;
			background: #18181b; /* zinc-900 solid on mobile */
			box-shadow: none;
			border: none;
			border-top: 1px solid #3f3f46; /* zinc-700 */
		}
	}
</style>
