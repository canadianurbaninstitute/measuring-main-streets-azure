<script lang="ts">
	import { env } from '$env/dynamic/public';
	import Icon from '@iconify/svelte';
	import chroma from 'chroma-js';
	import { onMount } from 'svelte';

	interface Props {
		coords: { lng: number; lat: number };
		properties: Record<string, any>;
		id: string | number;
		onClose?: () => void;
		inline?: boolean;
	}

	let { coords, properties, onClose = () => {}, id, inline = false }: Props = $props();

	let panoContainer: HTMLDivElement;
	let panorama: any;
	let showDetails = $state(false);

	const colorScale = chroma
		.scale(['#8b1b1d', '#ff9c2c', '#eeee00', '#74c800', '#13612c'])
		.domain([0.5, 1.375, 2.25, 3.125, 4]);

	const getScoreColor = (score: number): string => (colorScale(score || 0) as any).hex();

	const w = typeof window !== 'undefined' ? (window as any) : null;

	onMount(() => {
		if (!w) return;

		w.initStreetView = () => {
			if (panoContainer && coords && w.google?.maps?.StreetViewPanorama) {
				const position = { lat: coords.lat, lng: coords.lng };

				panorama = new w.google.maps.StreetViewPanorama(panoContainer, {
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

		if (!w.google || !w.google.maps) {
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
			w.initStreetView();
		}

		return () => {
			if (w && w.initStreetView) {
				delete w.initStreetView;
			}
		};
	});

	const metrics = $derived([
		{ label: 'Overall', key: 'overall_score', icon: 'mdi:star-outline', overall: true },
		{ label: 'Sidewalk', key: 'sidewalk_analysis_score', icon: 'mdi:walk' },
		{
			label: 'Accessibility',
			key: 'accessibility_analysis_score',
			icon: 'mdi:wheelchair-accessibility'
		},
		{ label: 'Street Quality', key: 'street_quality_score', icon: 'mdi:road-variant' },
		{ label: 'Building', key: 'building_analysis_score', icon: 'mdi:office-building-outline' },
		{ label: 'Placemaking', key: 'place_making_analysis_score', icon: 'mdi:bench' }
	]);
</script>

<div
	class="streetview-container bg-white rounded-xl overflow-hidden flex flex-col"
	class:shadow-2xl={!inline}
	class:border={inline}
	class:border-zinc-200={inline}
	class:inline-card={inline}
>
	<div class="relative w-full h-40 sm:h-48 overflow-hidden">
		{#if !inline}
			<button
				class="absolute top-3 left-3 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full w-8 h-8 flex items-center justify-center font-bold z-50 transition-all border border-white/20"
				onclick={onClose}
				aria-label="Close"
			>
				<Icon icon="mdi:close" />
			</button>
		{/if}

		<div bind:this={panoContainer} class="flex-grow w-full h-full">
			<div class="w-full h-full flex flex-col items-center justify-center text-xs text-zinc-400">
				<Icon icon="mdi:google-maps" class="text-3xl mb-2 opacity-50" />
				Loading Streetview...
			</div>
		</div>
	</div>

	<div class="flex-grow p-4 overflow-y-auto custom-scrollbar">
		<div class="grid grid-cols-2 gap-3">
			{#each metrics as metric}
				<div
					class="flex items-center gap-2 p-1.5 rounded-lg border border-zinc-100"
					class:bg-blue-50={metric.overall}
					class:bg-zinc-50={!metric.overall}
				>
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
							<span class="text-zinc-500 font-normal">/ 5</span>
						</div>
					</div>
				</div>
			{/each}
		</div>

		{#if properties?.best_explanation}
			<div
				class="mt-4 p-3 bg-zinc-50 rounded-lg border border-zinc-100 text-[11px] text-zinc-600 leading-relaxed italic"
			>
				"{properties?.best_explanation}"
			</div>
		{/if}
	</div>
</div>

<style>
	.streetview-container {
		width: 300px;
		max-width: 85vw;
	}

	.inline-card {
		width: 100% !important;
		max-width: none !important;
		max-height: none !important;
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
		background-color: transparent !important;
	}

	:global(.mapboxgl-popup-content) {
		background-color: transparent !important;
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
