<script>
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
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
	export let style = 'mapbox://styles/canadianurbaninstitute/clua3r2e201hz01nw3w6n8axx';
	export let attribution = 'Canadian Urban Institute'


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
			if (selectedRegion === 'Toronto') {
				map.jumpTo({
					center: [-79.5365, 43.9245],
				});
			} else if (selectedRegion === 'Montreal') {
				map.jumpTo({
					center: [-73.617, 45.578],
					zoom: 8
				});
			} else if (selectedRegion === 'Edmonton') {
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
				name="place"
				value="Toronto"
				checked
				on:change={navigateMap}
			/>
			<label>Toronto</label>
		</div>

		<div class="radio">
			<input type="radio" id="montreal" name="place" value="Montreal" on:change={navigateMap} />
			<label>Montreal</label>
		</div>

		<div class="radio">
			<input type="radio" id="edmonton" name="place" value="Edmonton" on:change={navigateMap} />
			<label>Edmonton</label>
		</div>
	</div>

<div id={section} class="map"/>


<svg width="184.458621px" height="152.32069px" viewBox="0 0 184.458621 152.32069" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="bivariate-recent-immigrants" transform="translate(-19.569, -26.1897)">
            <g id="Group" transform="translate(19.569, 26.1897)">
                <rect id="Rectangle" fill="#ED97B4" x="69.6655172" y="0.424137931" width="54.7931034" height="54.7931034"></rect>
                <rect id="Rectangle" fill="#62639B" x="124.458621" y="0.424137931" width="54.7931034" height="54.7931034"></rect>
                <rect id="Rectangle" fill="#E9E9E9" x="69.6655172" y="55.2172414" width="54.7931034" height="54.7931034"></rect>
                <rect id="Rectangle" fill="#7FD4F7" x="124.458621" y="55.2172414" width="54.7931034" height="54.7931034"></rect>
                <text id="Top-25%" font-family="Inter-Regular, Inter" font-size="9.39310345" font-weight="normal" fill="#000000">
                    <tspan x="75.9275862" y="126.837931">Top 25%</tspan>
                </text>
                <text id="Bottom-50%" font-family="Inter-Regular, Inter" font-size="9.39310345" font-weight="normal" fill="#000000">
                    <tspan x="23.7896356" y="25.0793103">Bottom</tspan>
                    <tspan x="30.3141066" y="36.0793103">50%</tspan>
                </text>
                <text id="Bottom-25%" font-family="Inter-Regular, Inter" font-size="9.39310345" font-weight="normal" fill="#000000">
                    <tspan x="23.7896356" y="81.437931">Bottom</tspan>
                    <tspan x="30.4075039" y="92.437931">25%</tspan>
                </text>
                <text id="Top-50%" font-family="Inter-Regular, Inter" font-size="9.39310345" font-weight="normal" fill="#000000">
                    <tspan x="130.72069" y="126.837931">Top 50%</tspan>
                </text>
                <text id="Percent-Recent-Immig" font-family="Inter-Regular, Inter" font-size="9.39310345" font-weight="normal" fill="#000000">
                    <tspan x="64.4775176" y="150.32069">Percent Immigrants and Non-Permanent Residents</tspan>
                </text>
                <text id="Civic-Infrastructure" transform="translate(5.5, 56) rotate(270) translate(-5.5, -56)" font-family="Inter-Regular, Inter" font-size="9.39310345" font-weight="normal" fill="#000000">
                    <tspan x="-50.3115792" y="59.5">Civic Infrastructure Index</tspan>
                </text>
            </g>
        </g>
    </g>
</svg>

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
