<script>
	import methodologyImg from '../../../lib/assets/graphics/methodology.svg';
	import dataImg from '../../../lib/assets/graphics/walkability-data.svg';
	import Footer from '../../../lib/ui/Footer.svelte';
	import '../../../styles.css';
	import { intersect } from './intersect.js';
	import WalkabilityMap from './WalkabilityMap.svelte';
	import WalkabilityStreetview from './WalkabilityStreetview.svelte';

	import Icon from '@iconify/svelte';
	import mapboxgl from 'mapbox-gl';
	import { mount, onMount, unmount } from 'svelte';
	import Accordion from '../../../lib/ui/Accordion.svelte';

	import { stations as initialStations } from './stations.js';
	import { steps } from './steps.js';

	// Hardcoded station target list from requirements
	let stations = $state([...initialStations]);

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
		} catch (e) {
			console.error('Failed to load station coordinate mappings:', e);
		}
	});

	let map = $state(null);
	let activeStationId = $state(null);
	let activePopup = null;

	let methodologyOpen = $state(true);
	let citationsOpen = $state(false);

	let innerWidth = $state(0);
	let isMobile = $derived(innerWidth > 0 && innerWidth < 1024);

	let activeStation = $derived(stations.find((s) => s.id === activeStationId));
	let activeCoords = $derived(
		activeStation && activeStation.lng && activeStation.lat
			? [activeStation.lng, activeStation.lat]
			: null
	);

	// Handle intersection events to move map and trigger popups
	function handleSectionIntersect(node) {
		const stationId = node.dataset.stationId;
		const popupId = node.dataset.popupId;

		// Always update active station to trigger flyTo if changed
		activeStationId = stationId;

		if (popupId) {
			openPopupById(popupId);
		} else {
			closePopup();
		}
	}

	// Reactively trigger map movements when the active section OR the loaded coordinates change
	$effect(() => {
		if (map && activeStationId) {
			const station = stations.find((s) => s.id === activeStationId);
			if (station && station.lng && station.lat) {
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
	function handlePointClick({ lng, lat, properties, mapInstance, point, id }) {
		if (activePopup) {
			activePopup.remove();
		}

		// Highlight the point
		const targetMap = mapInstance || map;
		if (targetMap && targetMap.getSource('selected-station')) {
			targetMap.getSource('selected-station').setData({
				type: 'FeatureCollection',
				features: [
					{
						type: 'Feature',
						id: id,
						geometry: {
							type: 'Point',
							coordinates: [lng, lat]
						},
						properties: properties
					}
				]
			});
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
				id: id,
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

	function openPopupById(id) {
		if (!map || !id) return;

		const tryOpen = () => {
			// Search for the feature by ID in the specific layer
			const features = map.queryRenderedFeatures({
				layers: ['station-analysis-points-expla-c0bvk5'],
				filter: ['==', ['id'], parseInt(id)]
			});

			if (features.length > 0) {
				const feature = features[0];
				const coordinates = feature.geometry.coordinates.slice();
				const point = map.project(coordinates);

				handlePointClick({
					lng: coordinates[0],
					lat: coordinates[1],
					properties: feature.properties,
					mapInstance: map,
					id: feature.id,
					point: point
				});
			}
		};

		if (map.isMoving()) {
			map.once('idle', tryOpen);
		} else {
			tryOpen();
			// Backup attempt in case the layer was still rendering
			map.once('idle', tryOpen);
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
		<p>
			A complete community is a place that provides the goods and services people need in their
			daily lives. It is typically defined by the proximity of amenities to where people live.
			Clustering amenities around a central node—such as a transit station or main street—adds
			convenience and efficiency, and supports higher housing densities. A central premise of this
			model is that people can access daily necessities on foot rather than by car. This, in turn,
			leads to health benefits for individuals and enhances the vitality and sustainability of
			neighbourhoods.
		</p>
		<p>
			However, most complete community models overlook an important detail: the choice to walk
			depends not only on distance, but also on the quality of the journey. Pedestrians need to feel
			comfortable and safe, and walking routes should be engaging. The psychological distance of a
			trip is influenced by the visual experience along the way.
		</p>
		<p>
			Over the past 18 months, the Canadian Urban Institute has developed a methodology to assess
			the quality of the public realm from a pedestrian perspective. This approach uses Google
			Street View images analyzed by a large language model (OpenAI) to evaluate intersections and
			midblock segments across a range of themes. Detailed prompts assess elements such as sidewalk
			quality, placemaking, accessibility, and the built environment. A more detailed explanation is
			provided at the end of this report.
		</p>
		<p>
			This model was applied to five case study station areas. The results are presented in order
			from most to least walkable. An interactive map of walkability scores for each intersection
			and street is included below; users can click on any point to view a Street View panorama
			along with its corresponding assessment.
		</p>
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
		{#each steps as step}
			{@const station = stations.find((s) => s.id === step.stationId)}
			<section
				class="scroll-section"
				data-station-id={step.stationId}
				data-popup-id={step.triggerPopupId}
				use:intersect={handleSectionIntersect}
			>
				{#if step.title}
					<h2 class="station-title">{step.title}</h2>
				{/if}
				{#if step.region}
					<h4 class="mb-4 station-region">{station.region}</h4>
				{/if}
				<div class="prose prose-zinc prose-invert lg:prose-lg max-w-none">
					{#each step.paragraphs as paragraph}
						<p class="mb-4">{@html paragraph}</p>
					{/each}
				</div>

				{#if isMobile && station?.lng && station?.lat}
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
	<Accordion bind:open={methodologyOpen}>
		<div slot="header" class="flex flex-col font-medium w-full outline-none">
			<div class="flex justify-between items-center gap-4">
				<h2 class="mb-0">Methodology</h2>
				<span class="transition-transform text-zinc-400" class:rotate-180={methodologyOpen}>
					<Icon icon="mdi:chevron-down" class="text-3xl" />
				</span>
			</div>
			<div class="border-b border-slate-100 w-full mt-4 mb-4"></div>
		</div>
		<div slot="body" class="w-full">
			<div class="mt-4">
				<img class="my-4 m-auto" src={methodologyImg} alt="Methodology" />
				<p class="mb-4">
					The public realm analysis leverages the Google Maps and OpenAI APIs to quantitatively
					assess walkability from a pedestrian-centred point of view. Images are sampled along 500m
					intervals on the road network surrounding a transit station area. At each coordinate,
					images are captured at 60 degree intervals to capture the entire 360 degree landscape at
					that coordinate.
				</p>
				<p>
					Each image is then individually passed into the GPT-4o model in the OpenAI API. The
					multimodal vision model is primed with a prompt to analyse photos across 22 separate
					metrics and output a dataset capturing this analysis. The score for each metric is
					accompanied by a short justification, allowing for granular analysis at scale. The dataset
					is organised as follows:
				</p>
				<img class="my-4 m-auto" src={dataImg} alt="Scoring breakdown" />
				<p>
					After each image is scored, the 6 datasets for each angle are aggregated together to a
					coordinate-level score. This is done for each coordinate captured from the road network
					until a dataset of scores for the entire area around a transit station is captured.
					Finally, the data is coloured with a gradient interpolation to show how walkability likely
					evolves between individual points to get a quantitatively modelled visualisation of the
					qualitative walkability in a given area.
				</p>
			</div>
		</div>
	</Accordion>
</section>
<section class="container px-20 pb-10">
	<Accordion bind:open={citationsOpen}>
		<div slot="header" class="flex flex-col font-medium w-full outline-none">
			<div class="flex justify-between items-center gap-4">
				<h2 class="mb-0">Citations</h2>
				<span class="transition-transform text-zinc-400" class:rotate-180={citationsOpen}>
					<Icon icon="mdi:chevron-down" class="text-3xl" />
				</span>
			</div>
			<div class="border-b border-slate-100 w-full mt-4 mb-6"></div>
		</div>
		<div slot="body" class="w-full">
			<div class="mt-4">
				<ul class="space-y-4 text-sm text-zinc-600">
					<li>
						Adkins, Arlie, Jennifer Dill, Gwenn Luhr, and Margot Neal. 2012. "Unpacking Walkability:
						Testing the Influence of Urban Design Features on Perceptions of Walking Environment
						Attractiveness." Journal of Urban Design 17 (4): 499–510. <a
							href="https://doi.org/10.1080/13574809.2012.706365"
							target="_blank"
							rel="noopener noreferrer"
							class="text-blue-500 hover:underline">https://doi.org/10.1080/13574809.2012.706365</a
						>.
					</li>
					<li>
						Bader, Michael D. M., Sean J. Mooney, Brian Bennett, and Andrew G. Rundle. 2017. "The
						Promise, Practicalities, and Perils of Virtually Auditing Neighborhoods Using Google
						Street View." The ANNALS of the American Academy of Political and Social Science 669
						(1): 18–40. <a
							href="https://doi.org/10.1177/0002716216681488"
							target="_blank"
							rel="noopener noreferrer"
							class="text-blue-500 hover:underline">https://doi.org/10.1177/0002716216681488</a
						>.
					</li>
					<li>
						Chen, Yinglei. 2017. "How Is Built Environment Associated with the Perception of
						Vibrancy, Beauty, and Safety?" Paper presented at the Annual Conference of the
						Association of Collegiate Schools of Planning, Denver, CO.
					</li>
					<li>
						Clarke, Philippa, Jennifer Ailshire, Robert Melendez, Michael Bader, and Jeffrey
						Morenoff. 2010. "Using Google Earth to Conduct a Neighborhood Audit: Reliability of a
						Virtual Audit Instrument." Health & Place 16 (6): 1224–1229. <a
							href="https://doi.org/10.1016/j.healthplace.2010.08.007"
							target="_blank"
							rel="noopener noreferrer"
							class="text-blue-500 hover:underline"
							>https://doi.org/10.1016/j.healthplace.2010.08.007</a
						>.
					</li>
					<li>
						Dubey, Abhimanyu, Nikhil Naik, Devi Parikh, Ramesh Raskar, and César A. Hidalgo. 2016.
						"Deep Learning the City: Quantifying Urban Perception at a Global Scale." In Computer
						Vision – ECCV 2016, edited by Bastian Leibe, Jiri Matas, Nicu Sebe, and Max Welling,
						196–212. Lecture Notes in Computer Science 9905. Cham: Springer. <a
							href="https://doi.org/10.1007/978-3-319-46448-0_12"
							target="_blank"
							rel="noopener noreferrer"
							class="text-blue-500 hover:underline">https://doi.org/10.1007/978-3-319-46448-0_12</a
						>.
					</li>
					<li>
						Duncan, Dustin T., Jarvis Aldstadt, John Whalen, Steven J. Melly, and Steven L.
						Gortmaker. 2011. "Validation of Walk Score® for Estimating Neighborhood Walkability: An
						Analysis of Four US Metropolitan Areas." International Journal of Environmental Research
						and Public Health 8 (11): 4160–4179. <a
							href="https://doi.org/10.3390/ijerph8114160"
							target="_blank"
							rel="noopener noreferrer"
							class="text-blue-500 hover:underline">https://doi.org/10.3390/ijerph8114160</a
						>.
					</li>
					<li>
						Ewing, Reid, and Otto Clemente. 2013. Measuring Urban Design: Metrics for Livable
						Places. Washington, DC: Island Press.
					</li>
					<li>
						Ewing, Reid, and Susan Handy. 2009. "Measuring the Unmeasurable: Urban Design Qualities
						Related to Walkability." Journal of Urban Design 14 (1): 65–84. <a
							href="https://doi.org/10.1080/13574800802451155"
							target="_blank"
							rel="noopener noreferrer"
							class="text-blue-500 hover:underline">https://doi.org/10.1080/13574800802451155</a
						>.
					</li>
					<li>
						Griew, Paul, Melvyn Hillsdon, Charlie Foster, Emma Coombes, Andy Jones, and Paul
						Wilkinson. 2013. "Developing and Testing a Street Audit Tool Using Google Street View to
						Measure Environmental Supportiveness for Physical Activity." International Journal of
						Behavioral Nutrition and Physical Activity 10 (1): 103.
						<a
							href="https://doi.org/10.1186/1479-5868-10-103"
							target="_blank"
							rel="noopener noreferrer"
							class="text-blue-500 hover:underline">https://doi.org/10.1186/1479-5868-10-103</a
						>.
					</li>
					<li>
						Koo, Bon Woo, Subhrajit Guhathakurta, and Nisha Botchwey. 2022a. "Development and
						Validation of Automated Microscale Walkability Audit Method." Health and Place 73:
						Article 102733. <a
							href="https://doi.org/10.1016/j.healthplace.2021.102733"
							target="_blank"
							rel="noopener noreferrer"
							class="text-blue-500 hover:underline"
							>https://doi.org/10.1016/j.healthplace.2021.102733</a
						>.
					</li>
					<li>
						Koo, Bon Woo, Subhrajit Guhathakurta, and Nisha Botchwey. 2022b. "How Are Neighborhood
						and Street-Level Walkability Factors Associated with Walking Behaviors? A Big Data
						Approach Using Street View Images." Environment and Behavior 54 (1): 211–241. <a
							href="https://doi.org/10.1177/00139165211014609"
							target="_blank"
							rel="noopener noreferrer"
							class="text-blue-500 hover:underline">https://doi.org/10.1177/00139165211014609</a
						>.
					</li>
					<li>
						Walk Score. n.d. "Walk Score Methodology." Accessed May 8, 2025. <a
							href="https://www.walkscore.com/methodology.html"
							target="_blank"
							rel="noopener noreferrer"
							class="text-blue-500 hover:underline">https://www.walkscore.com/methodology.html</a
						>
					</li>
				</ul>
				<p class="m-auto w-full mt-10">
					Special thanks to Bon Woo Koo for his assistance with this project.
				</p>
			</div>
		</div>
	</Accordion>
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
		padding: 3rem 3rem 2.5rem 3rem;
		color: #f4f4f5; /* zinc-50 */
		backdrop-filter: blur(12px);
		border-radius: 1.5rem;
		box-shadow:
			0 20px 25px -5px rgba(0, 0, 0, 0.5),
			0 10px 10px -5px rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	/* Mapbox Popup Overrides to ensure content fits */
	:global(.mapboxgl-popup-content) {
		padding: 0;
		border-radius: 12px;
		overflow: hidden;
		background-color: transparent;
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
