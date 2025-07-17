<script>
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import '../../../../node_modules/mapbox-gl/dist/mapbox-gl.css';
	import Footer from '../../lib/Footer.svelte';
	import LegendItem from '../../lib/ui/legends/LegendItem.svelte';
	import Icon from '@iconify/svelte';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';


	let map;

	onMount(() => {
		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/canadianurbaninstitute/cluk7htch03qc01nw78lqf46n?fresh=true',
			center: [-90, 55],
			zoom: 3.5,
			maxZoom: 11,
			minZoom: 2,
			scrollZoom: true,
			attributionControl: false
		});


		map.addControl(new mapboxgl.NavigationControl(), 'top-right');

		const scale = new mapboxgl.ScaleControl({
			maxWidth: 100,
			unit: 'metric'
		});

		map.addControl(scale, 'bottom-right');


	});


	function resetMap() {

		map.flyTo({
			center: [-90, 55],
			zoom: 3.5
		});
	}
</script>

<div class="hero">
	<h1>Housing Dot Density Map</h1>
	<h2>Mapping Tool</h2>
	<p>
		This choropleth dot mapping tool highlights housing built in Canada over the course of the past
		60 years, divided into 4 periods: pre 1960, 1961 to 1980, 1981 to 2000, and 2001 to 2023. 
		Each
		dot represents 50 houses. It is important to note that in a dot density map, while the dots are used to
		represent data points, they don't directly indicate the <i>exact</i> locations of the data points themselves, rather,
		they are spread out randomly within an area, in order to give a visual impression of the density or distribution
		of the data across a geographic region.
	</p>
</div>

<div class="map-container">
	<div class="controls">
		<div class="legend">
			<h4>Legend</h4>
			<h5><i>Click to turn layers on and off</i></h5>
			<h5>1 dot = 50 housing units</h5>
			<LegendItem
				variant={'circle'}
				label={'2001 - 2023'}
				bgcolor={'#DB3069'}
				button={true}
				{map}
				id={'const-0123'}
			/>
			<LegendItem
				variant={'circle'}
				label={'1981 - 2000'}
				bgcolor={'#58e965'}
				button={true}
				{map}
				id={'const-8100'}
			/>
			<LegendItem
				variant={'circle'}
				label={'1961 - 1980'}
				bgcolor={'#00adf2'}
				button={true}
				{map}
				id={'const-6180'}
			/>
			<LegendItem
				variant={'circle'}
				label={'Pre 1960'}
				bgcolor={'#002940'}
				button={true}
				{map}
				id={'const-pre1960'}
			/>
		</div>
		<button id="resetButton" on:click={resetMap}>
			<Icon icon="mi:undo" /> Reset Map
		</button>
	</div>

	<div id="map" />
</div>

<Footer />

<style>
	#map {
		height: 50vh;
		width: 100%;
		position: relative;
		order: -1;
		border-bottom: 1px solid #eee;
	}


	h4, h5 {
		margin: 0.4em 0 0.4em 0;
	}

	h5 {
		font-weight: 400;
	}

	.map-container {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--brandGrey);
	}

	.controls {
		display: flex;
		flex-direction: column;
		border-right: 1px solid var(--brandGrey);
		padding: 1em;
		gap: 1em;
	}

	.legend {
		background-color: #fff;
		padding: 1em;
		border-radius: 0.6em;
		border: 1px solid #eee;
		margin: 0 0 0.5em 0;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	#resetButton {
		border: 1px solid rgba(28, 32, 36, 0.302);
		background-color: rgb(250, 251, 252);
		border-radius: 0.5em;
		box-shadow: rgba(27, 31, 35, 0.04) 0px 1px 0px 0px,
			rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset;
		opacity: 1;
		width: 100%;
		padding: 0.5em;
		margin: 0 0 0.5em 0;
		align-items: center;
		justify-content: center;
	}

	#resetButton:hover {
		cursor: pointer;
		box-shadow: 0px 1px 0px 0px rgba(27, 31, 35, 0.04),
			inset 0px 1px 0px 0px hsla(0, 0%, 100%, 0.25);
		background-color: #f3f4f6;
		transition: 0.3s;
	}

	@media only screen and (min-width: 768px) {

#map {
	height: 80vh;
	order: 1;

}

.map-container {
	flex-direction: row;
}

.controls {
	width: 30vw;
	min-width: 25vw;
}

}
</style>
