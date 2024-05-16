<script>
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import LegendItem from '../../lib/ui/legends/LegendItem.svelte';
	import "../../../../node_modules/mapbox-gl/dist/mapbox-gl.css"


	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	let center = [-73.617, 45.578];
	let bearing = -17.1;
	let pitch = 0;
	let attribution = 'Canadian Urban Institute';

	let map;

	onMount(() => {
		map = new mapboxgl.Map({
			container: 'case-studies-map',
			style: 'mapbox://styles/canadianurbaninstitute/clu8mq9i6047g01pb6zrgco0m',
			center: center,
			zoom: 8.2,
			bearing: bearing,
			pitch: pitch,
			projection: 'globe',
			scrollZoom: false,
			attributionControl: false
		});

		map.addControl(new mapboxgl.NavigationControl(), 'top-right');
		map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');
		map.addControl(
				new mapboxgl.AttributionControl({
					customAttribution: attribution
				})
			);

		// Create a popup, but don't add it to the map yet.
		const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });


		map.on('mouseenter', 'case-studies-malls-points', (e) => {
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';

            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const name = e.features[0].properties.Name;
            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(coordinates).setHTML(name).addTo(map);

        });

        map.on('mouseleave', 'case-studies-malls-points', () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });
	});

	// function navigateMap(event) {
	// 	const selectedRegion = event.target.value;
	// 	if (selectedRegion === 'toronto') {
	// 		map.jumpTo({
	// 			center: [-79.3659, 43.9085]
	// 		});
	// 	} else if (selectedRegion === 'montreal') {
	// 		map.jumpTo({
	// 			center: [-73.617, 45.578],
	// 			zoom: 8.5
	// 		});
	// 	} else if (selectedRegion === 'edmonton') {
	// 		map.jumpTo({
	// 			center: [-113.376, 53.549]
	// 		});
	// 	}
	// }


</script>

<div class="chart-container">
	
	<div id="case-studies-map" class="map" />

	<div class="legend-container">
		<LegendItem variant={'polygon'} label={'Downtown Main Streets'} bgcolor={'#58e965'} />
		<LegendItem variant={'polygon'} label={'Neighbourhood Main Streets'} bgcolor={'#002940'} />
		<LegendItem variant={'polygon'} label={'Small Town Main Streets'} bgcolor={'#00adf2'} />
		<LegendItem variant={'polygon'} label={'Malls'} bgcolor={'#DB3069'} />
	</div>
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


	.legend-container {
		display: flex;
		flex-direction: column;
		border-radius: 0.5em;
		border: 1px solid var(--brandGrey);
		padding: 0.5em;
	}

	@media only screen and (min-width: 768px) {
		.legend-container {
		flex-direction: row;
		}
	}
</style>
