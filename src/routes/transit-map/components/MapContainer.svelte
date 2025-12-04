<script lang="ts">
	import LegendAbsolute from '../../lib/ui/legends/LegendAbsolute.svelte';
	let { selectedVariable, min, max } = $props();
</script>

<div id="map-container" class="w-full">
	{#if typeof min === 'number' && !isNaN(min) && typeof max === 'number' && !isNaN(max) && min !== max && selectedVariable}
		<LegendAbsolute
			title={selectedVariable}
			gradient="linear-gradient(to right, #F5C8D7, #E87CA0, #DB3069, #721433)"
			items={[{ label: min.toString() }, { label: max.toString() }]}
		/>
	{/if}

	<div id="map"></div>
</div>

<style>
	#map {
		height: 100%;
		width: 100%;
		position: relative;
		order: -1;
	}

	#map-container {
		height: 100%;
		position: relative;
	}

	@media only screen and (max-width: 768px) {
		#map-container {
			height: 100vw;
			min-height: 500px;
		}

		#map {
			height: 100vw;
			min-height: 500px;
		}
	}
</style>
