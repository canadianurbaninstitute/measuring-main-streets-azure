<script>
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import '../../../../node_modules/mapbox-gl/dist/mapbox-gl.css';
	import cmaSummary from './cma-summary.json';
	import variableNames from './variable-names.json';
	import Select from 'svelte-select';
	import Footer from '../../lib/Footer.svelte';
	import LegendItem from '../../lib/ui/legends/LegendItem.svelte';
	import Legend from '../../lib/ui/legends/Legend.svelte';
	import Icon from '@iconify/svelte';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiY2FuYWRpYW51cmJhbmluc3RpdHV0ZSIsImEiOiJjbG95bzJiMG4wNW5mMmlzMjkxOW5lM241In0.o8ZurilZ00tGHXFV-gLSag';

	// creating a geojson for points of CMAs (when zoomed out)

	let cmaPoints;

	cmaPoints = {
		type: 'FeatureCollection',
		features: cmaSummary
			.filter((feature) => feature.cmauid !== '000')
			.map((feature) => ({
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [feature.x, feature.y]
				},
				properties: {
					cmauid: feature.cmauid,
					cmaname: feature.cmaname
				}
			}))
	};

	// array of all cma names
	let cmaAll = cmaSummary.map((item) => {
		return {
			label: item.cmaname,
			value: item.cmaname,
			group: item.province
		};
	});

	let variablesAll = variableNames.map((item) => {
		return {
			label: item.name,
			value: item.variable,
			group: item.group
		};
	});

	let map;

	// initial cma and variable selected
	let cmaSelected = 'All Regions';
	let variableSelected = 'Population';
	let variableSelectedLabel = 'Population';

	onMount(() => {
		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/canadianurbaninstitute/clu8uyibd004v01qt1tctazkv?fresh=true',
			center: [-90, 55],
			zoom: 3.5,
			maxZoom: 14,
			minZoom: 2,
			scrollZoom: true,
			attributionControl: false
		});

		map.on('load', function () {
			map.addLayer({
				id: 'cmaPoints',
				type: 'circle',
				source: {
					type: 'geojson',
					data: cmaPoints
				},
				paint: {
					'circle-radius': 4,
					'circle-color': '#00adf2',
					'circle-stroke-width': 2,
					'circle-stroke-color': '#fff'
				}
			});
		});

		map.on('zoom', function () {
			if (map.getZoom() < 6) {
				map.setLayoutProperty('cmaPoints', 'visibility', 'visible');
			} else {
				map.setLayoutProperty('cmaPoints', 'visibility', 'none');
			}
		});

		map.addControl(new mapboxgl.NavigationControl(), 'top-right');

		const scale = new mapboxgl.ScaleControl({
			maxWidth: 100,
			unit: 'metric'
		});

		map.addControl(scale, 'bottom-right');

		map.on('mouseenter', ['cmaPoints', 'cma-fill', 'cma-highlight'], () => {
			map.getCanvas().style.cursor = 'pointer';
		});

		map.on('mouseleave', ['cmaPoints', 'cma-fill', 'cma-highlight'], () => {
			map.getCanvas().style.cursor = '';
		});

		map.on('click', 'cma-fill', (e) => {
			cmaSelected = cmaSummary.filter(
				(item) => item.cmauid === parseInt(e.features[0].properties.CMAUID)
			)[0].cmaname;
		});

		map.on('click', 'cmaPoints', (e) => {
			console.log(e.features[0]);
			cmaSelected = e.features[0].properties.cmaname;
		});

		map.on('zoom', () => {
			if (map.getZoom() > 6) {
				// Show the HTML element
				document.getElementById('legend').style.opacity = '1';
				document.getElementById('legend').style.visibility = 'visible';
			} else {
				// Hide the HTML element
				document.getElementById('legend').style.opacity = '0';
				document.getElementById('legend').style.visibility = 'hidden';
			}
		});

		map.on('zoom', () => {
			if (map.getZoom() > 10) {
				// Show the HTML element
				document.getElementById('mainstreet-legend').style.opacity = '1';
				document.getElementById('mainstreet-legend').style.visibility = 'visible';
			} else {
				// Hide the HTML element
				document.getElementById('mainstreet-legend').style.opacity = '0';
				document.getElementById('mainstreet-legend').style.visibility = 'hidden';
			}
		});
	});

	// function for what to do when new cma is selected
	function handleSelect(e) {
		// reset cma selected variable
		cmaSelected = e.detail.value;

		// filter cma data to just the cma we selected
		let filteredData = cmaSummary.filter((item) => item.cmaname === cmaSelected)[0];

		let cmaX = filteredData.x;
		let cmaY = filteredData.y;
		let cmauid = filteredData.cmauid.toString();

		// pan and zoom to the new cma - reset pitch and bearing if they changed
		if (cmaSelected !== 'All Regions') {
			map.setZoom(8);
			map.setBearing(0);
			map.setPitch(0);
			map.panTo([cmaX, cmaY]);

			map.setPaintProperty('cma-fill', 'fill-opacity', 0.8);

			map.setFilter('cma-fill', [
				'all',
				[
					'match',
					['get', 'CMANAME'],
					[
						'Granby',
						'Saint-Hyacinthe',
						'North Bay',
						'Sault Ste. Marie',
						'Medicine Hat',
						'Wood Buffalo'
					],
					false,
					true
				],
				['match', ['get', 'CMAUID'], [cmauid.toString()], false, true]
			]);

			map.setFilter('cma-highlight', ['all', ['match', ['get', 'CMAUID'], [cmauid], true, false]]);
		} else {
			resetMap();
		}
	}

	function handleSelectVariable(e) {

		variableSelected = e.detail.value;
		variableSelectedLabel = e.detail.label;

		// filter variable data to just the variable we selected
		let filteredData = variableNames.filter((item) => item.variable === variableSelected)[0];

		let expression = [
			'match',
			['get', ['literal', filteredData.variable]],
			[1],
			'#cceffe',
			[2],
			'#99dffc',
			[3],
			'#34bef9',
			[4],
			'#018bc6',
			[5],
			'#004663',
			'#eeeeee'
		];

		map.setPaintProperty('cma-demographic', 'line-color', expression);

		// waiting on setting expressions to just be percentile values
	}

	function resetMap() {

		cmaSelected = 'All Regions';

		map.flyTo({
				center: [-90, 55],
				zoom: 3.5,
			});
			map.setPaintProperty('cma-fill', 'fill-opacity', 0);
			map.setFilter('cma-fill', [
				'all',
				[
					'match',
					['get', 'CMANAME'],
					[
						'Granby',
						'Saint-Hyacinthe',
						'North Bay',
						'Sault Ste. Marie',
						'Medicine Hat',
						'Wood Buffalo'
					],
					false,
					true
				]
			]);

			map.setFilter('cma-highlight', ['all', ['match', ['get', 'CMAUID'], ['000'], true, false]]);
	}
</script>

<div class="hero">
	<h1>Main Street Demographic Map</h1>
	<h2>Mapping Tool</h2>
	<p>
		This mapping tool highlights demographic variables mapped to all arterial streets across
		Census Metropolitan Areas and Census Agglomerations within Canada. First, select a demographic variable from the dropdown
		below, and then, navigate the map by clicking on a point or by using the dropdown to select a region.
	</p>
</div>

<div class="map-container">
	<div class="controls">
		<div class="select-wrapper">
			<h4>Select a variable:</h4>
			<Select
				id="select"
				items={variablesAll}
				value={variableSelected}
				groupBy={(item) => item.group}
				clearable={false}
				showChevron={true}
				on:input={handleSelectVariable}
				--background="white"
				--item-color="black"
				--item-is-active-color="black"
				--item-is-active-bg="#eee"
			/>
		</div>

		<div class="select-wrapper">
			<h4>Select a region:</h4>
			<Select
				id="select"
				items={cmaAll}
				value={cmaSelected}
				groupBy={(item) => item.group}
				clearable={false}
				showChevron={true}
				on:input={handleSelect}
				--background="white"
				--item-color="black"
				--item-is-active-color="black"
				--item-is-active-bg="#eee"
			/>
		</div>

		<div class="legend">
			<h4>Legend</h4>

			<LegendItem variant={'circle'} label={'Census Metropolitan Areas'} bgcolor={'#00adf2'} />

			<div id="legend">
				<Legend
					minlabel={'Low'}
					maxlabel={'High'}
					label={variableSelectedLabel}
					gradient={'linear-gradient(to right, #cceffe, #99dffc, #34bef9, #018bc6, #004663)'}
				/>
			</div>

			<div id="mainstreet-legend">
				
			<LegendItem variant={'polygon'} label={'High Density Main Streets'} bgcolor={'#eee'} />

			<LegendItem variant={'polygon'} label={'Low Density Main Streets'} bgcolor={'#dddd'} />
			
			</div>
			
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
		height: 80vh;
		width: 100%;
		position: relative;
	}

	h4 {
		margin: 0;
	}

	.map-container {
		display: flex;
		flex-direction: row;
		border: 1px solid var(--brandGrey);
	}

	.controls {
		display: flex;
		flex-direction: column;
		border-right: 1px solid var(--brandGrey);
		padding: 1em;
		gap: 1em;
		width: 30vw;
		max-width: 30vw;
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
		gap: 1em;
	}

	#legend, #mainstreet-legend {
		transition: opacity 0.3s, visibility 0.3s;
		opacity: 0;
		visibility: hidden;
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	.select-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
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
</style>
