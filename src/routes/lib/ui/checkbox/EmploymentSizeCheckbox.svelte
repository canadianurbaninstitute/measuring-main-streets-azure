<script>
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	export let map;
	export let layers = [];
	export let minZoom = 14.1;
	export let maxZoom = 14.7;

	let isChecked = false;

	function toggleEmploymentSize() {
		if (map) {
			const layerList = layers;
			const zoom = isChecked ? minZoom : maxZoom;
			const opacity = isChecked ? 0.8 : 1;
			const radius = isChecked
				? ['step', ['get', 'empsize_EmpSzNm'], 5, 5, 10, 10, 15, 50, 20, 100, 25, 1000, 5]
				: 5;

			for (let i = 0; i < layerList.length; i++) {
				const layerId = layerList[i];
				map.setPaintProperty(layerId, 'circle-radius', radius);
				map.setPaintProperty(layerId, 'circle-opacity', opacity);
			}

			map.easeTo({ zoom });
		}
	}

	onMount(() => {
		toggleEmploymentSize(); // Initialize layer radius based on the initial checkbox state
	});
</script>

<div id="container">
<button class={isChecked ? 'layerOn' : 'layerOff'}>
	<Icon icon="iconoir:drag" />
	<label>
		<input type="checkbox" bind:checked={isChecked} on:change={toggleEmploymentSize} />
		Employment Size
	</label>
</button>
<div id='legend' class={isChecked ? 'legendOn' : 'legendOff'}>
	<img src="https://raw.githubusercontent.com/ananmaysharan/rki-app/master/src/routes/assets/employmentsizelegend.svg" alt="legend">
  </div>
</div>


<style>

	#container {
		display:flex;
		flex-direction: column;
	}

	label {
		padding: 0.4em;
		display: flex;
		align-items: center;
		font-size: 0.88em;
		width:100%;
	}

	label:hover {
		cursor: pointer;
	}

	input {
		display: none;
	}

	button {
		border: 1px solid rgba(27, 31, 35, 0.3);
		background-color: rgb(250, 251, 252);
		border-radius: 0.5em;
		box-shadow: rgba(27, 31, 35, 0.04) 0px 1px 0px 0px,
			rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset;
		opacity: 1;
		display: flex;
		align-items: center;
		margin:0.5em 0 0.5em 0;

	}

	img {
		width: 100%;
	}

	.layerOn, .legendOn {
		opacity: 1;
	}

	.legendOff {
		opacity: 0;
		height: 0px;
	}

	.layerOff {
		opacity: 0.6;
		border: 1px dashed rgba(27, 31, 35, 0.3);
	}

	button:hover {
		cursor: pointer;
		box-shadow: 0px 1px 0px 0px rgba(27, 31, 35, 0.04),
			inset 0px 1px 0px 0px hsla(0, 0%, 100%, 0.25);
		background-color: #f3f4f6;
	}

	button:active {
		box-shadow: 0px 1px 0px 0px rgba(27, 31, 35, 0.04),
			inset 0px 1px 0px 0px hsla(0, 0%, 100%, 0.25), 0px 1px 0px 0px rgba(225, 228, 232, 0.2);
		background-color: #edeff2;
	}
</style>
