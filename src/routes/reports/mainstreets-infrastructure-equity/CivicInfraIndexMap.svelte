<script>
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import Legend from '../../lib/ui/legends/Legend.svelte'
	import "../../../../node_modules/mapbox-gl/dist/mapbox-gl.css";


	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	export let title;
	export let section;
	let center = [-79.5365, 43.9245];
	export let zoom = 8;
    export let maxZoom = 16;
    export let minZoom = 6;
	export let bearing = -17.1;
	export let pitch = 0;
	export let style = 'mapbox://styles/canadianurbaninstitute/clutw7a5f003t01qret745gsb?fresh=true';
	export let attribution = 'Canadian Urban Institute';


	let map;

	const maxBounds = [
		[-79.6772, 43.44], // SW coords
		[-79.04763, 44.03074] // NE coords
	];

	onMount(() => {

		map = new mapboxgl.Map({
			container: section,
			style: style,
			center: center,
			zoom: zoom,
			maxZoom: maxZoom,
			minZoom: minZoom,
			bearing: bearing,
			pitch: pitch,
			projection: 'globe',
			scrollZoom: false,
			// maxBounds: maxBounds,
			attributionControl: false
		});

		map.addControl(new mapboxgl.NavigationControl(), 'top-right');
		map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');
		map.addControl(
				new mapboxgl.AttributionControl({
					customAttribution: attribution
				})
			);
		
			map.on('click', (e) => {
				const coords = JSON.stringify(map.getCenter());
				const pitch = map.getPitch().toFixed(0);
				const bearing = map.getBearing().toFixed(0);
				const coordsObject = JSON.parse(coords);
				const coordsArray = [
						parseFloat(coordsObject.lng.toFixed(4)),
						parseFloat(coordsObject.lat.toFixed(4))
						];
				console.log(coordsArray, 'pitch:', pitch, 'bearing:', bearing)
				});

	});


	function navigateMap(event) {
			const selectedRegion = event.target.value;
			if (selectedRegion === 'toronto') {
				map.jumpTo({
					center: [-79.5365, 43.9245]
				});
			} else if (selectedRegion === 'montreal') {
				map.jumpTo({
					center: [-73.617, 45.578],
					zoom: 8
				});
			} else if (selectedRegion === 'edmonton') {
				map.jumpTo({
					center: [-113.7768, 53.4757],
					zoom: 7.5
				});
			}
		}
</script>

<!-- Need to fix labels not working at some point -->

<div class="chart-container">
	<h4>{title}</h4>
	<div class="radio-container">
		<div class="radio">
			<input
				type="radio"
				id="toronto"
				name="region"
				value="toronto"
				checked
				on:change={navigateMap}
			/>
			<label>Toronto</label>
		</div>

		<div class="radio">
			<input type="radio" id="montreal" name="region" value="montreal" on:change={navigateMap} />
			<label>Montreal</label>
		</div>

		<div class="radio">
			<input type="radio" id="edmonton" name="region" value="edmonton" on:change={navigateMap} />
			<label>Edmonton</label>
		</div>
	</div>

<div id={section} class="map"/>

<Legend
minlabel={'Low'}
maxlabel={'High'}
label={'Civic Infrastructure Index'}
gradient={'linear-gradient(to right, #cceffe, #99dffc, #34bef9, #018bc6, #004663)'}
/>

</div>

<style>
	.map {
		height: 500px;
		width: 100%;
		border-radius: 1em;
	}

	.chart-container {
		display: flex;
		flex-direction: column;
		gap: 1em;
		border: 1px solid #eee;
		padding: 1em;
		border-radius: 1em;
	}

	.radio-container {
		display: flex;
	}

	.radio {
		display: flex;
		align-items: start;
	}
</style>
