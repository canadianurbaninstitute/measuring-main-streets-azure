<script lang="ts">
	import Legend from './Legend.svelte';
	let { selectedVariable, min, max, map, activeTab } = $props();
</script>

<div id="map-container">
	<div id="map"></div>
	<Legend {map} {activeTab} {selectedVariable} {min} {max} />
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
