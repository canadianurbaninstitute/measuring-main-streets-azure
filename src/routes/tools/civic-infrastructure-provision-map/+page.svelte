<script>
	import Icon from '@iconify/svelte';
	import { Select } from 'bits-ui';
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	import { PUBLIC_MAPBOX_ACCESS_TOKEN } from '$env/static/public';

	import '../../../../node_modules/mapbox-gl/dist/mapbox-gl.css';
	import '../../styles.css';

	import Legend from '../../lib/ui/legends/Legend.svelte';
	import LegendItem from '../../lib/ui/legends/LegendItem.svelte';

	import { getLang } from '../../lib/i18n';
	import cmaSummary from './cma-summary.json';

	const fr = getLang() === 'fr';

	// Province names are grouping keys in the data; translate at display time only
	const PROVINCES_FR = {
		'Newfoundland and Labrador': 'Terre-Neuve-et-Labrador',
		'Prince Edward Island': 'Île-du-Prince-Édouard',
		'Nova Scotia': 'Nouvelle-Écosse',
		'New Brunswick': 'Nouveau-Brunswick',
		Quebec: 'Québec',
		'British Columbia': 'Colombie-Britannique',
		'Northwest Territories': 'Territoires du Nord-Ouest'
	};
	const provinceLabel = (p) => (fr ? (PROVINCES_FR[p] ?? p) : p);

	mapboxgl.accessToken = PUBLIC_MAPBOX_ACCESS_TOKEN;

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

	let map;

	// initial cma and variable selected
	let cmaSelected = '';

	const grouped = {};
	for (const cma of cmaSummary) {
		const province = cma.province || '';
		if (!grouped[province]) grouped[province] = [];
		grouped[province].push({ value: String(cma.cmauid), label: cma.cmaname });
	}

	onMount(() => {
		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/canadianurbaninstitute/clutuyz05003b01qrf7gh74ou?fresh=true',
			center: [-90, 55],
			zoom: 3.5,
			maxZoom: 15,
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
		cmaSelected = e;

		// filter cma data to just the cma we selected
		let filteredData = cmaSummary.filter((item) => item.cmauid === Number(cmaSelected))[0];

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

	function resetMap() {
		cmaSelected = '';

		map.flyTo({
			center: [-90, 55],
			zoom: 3.5
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
	<h1>{fr ? 'Carte de l’offre d’infrastructure civique' : 'Civic Infrastructure Provision Map'}</h1>
	<h2>{fr ? 'Outil cartographique' : 'Mapping Tool'}</h2>
	{#if fr}
		<p>
			Cet outil cartographie l’offre relative d’infrastructure civique par quartier. L’indice
			d’infrastructure civique calcule un nombre pondéré (selon le nombre d’employés)
			d’établissements d’infrastructure civique par rapport à la taille de la population locale
			(dans un rayon de 1 km). Ces tendances sont représentées en reportant l’indice sur les grandes
			artères des zones résidentielles bâties de chaque région.
		</p>
	{:else}
		<p>
			This tool maps the relative provision of civic infrastructure by neighbourhood. The Civic
			Infrastructure Index calculates a weighted (by employees) count of civic infrastructure
			establishments relative to the size of the local (within 1km) population. These patterns are
			visualized by transposing the index onto major roadways in built-up residential areas of each
			region.
		</p>
	{/if}
</div>

<div class="map-container">
	<div class="controls">
		<div class="select-wrapper">
			<h4>{fr ? 'Choisir une région :' : 'Select a region:'}</h4>
			<Select.Root type="single" bind:value={cmaSelected} onValueChange={handleSelect}>
				<Select.Trigger class="select-trigger" aria-label={fr ? 'Choisir une RMR' : 'Select CMA'}>
					<Icon icon="mdi:map-marker-outline" class="icon-start" />
					{#if cmaSelected}
						{cmaSummary.find((c) => String(c.cmauid) === cmaSelected)?.cmaname}
					{:else}
						<span class="placeholder">{fr ? 'Choisir une RMR' : 'Select a CMA'}</span>
					{/if}
					<Icon icon="mdi:chevron-down" class="icon-end" />
				</Select.Trigger>

				<Select.Portal>
					<Select.Content class="select-content" sideOffset={10}>
						<Select.Viewport class="select-viewport">
							{#each Object.entries(grouped) as [province, options]}
								<Select.Group>
									<Select.GroupHeading class="group-heading">{provinceLabel(province)}</Select.GroupHeading>
									{#each options as { value, label }}
										<Select.Item class="select-item" {value} {label}>
											{label}
											{#if cmaSelected === value}
												<div class="check-icon">
													<Icon icon="mdi:check" aria-label={fr ? 'sélectionné' : 'selected'} />
												</div>
											{/if}
										</Select.Item>
									{/each}
								</Select.Group>
							{/each}
						</Select.Viewport>
					</Select.Content>
				</Select.Portal>
			</Select.Root>
		</div>

		<div class="legend">
			<h4>{fr ? 'Légende' : 'Legend'}</h4>
			<LegendItem variant={'circle'} label={fr ? 'Régions métropolitaines de recensement' : 'Census Metropolitan Areas'} bgcolor={'#00adf2'} />
			<div id="legend">
				<Legend
					minlabel={fr ? 'Faible' : 'Low'}
					maxlabel={fr ? 'Élevé' : 'High'}
					label={fr ? 'Offre d’infrastructure civique' : 'Civic Infrastructure Provision'}
					gradient={'linear-gradient(to right, #cceffe, #99dffc, #34bef9, #018bc6, #004663)'}
				/>
			</div>
			<div id="mainstreet-legend">
				<h5><i>{fr ? 'Cliquez pour afficher ou masquer les couches' : 'Click to turn layers on and off'}</i></h5>
				<LegendItem
					variant={'circle'}
					label={fr ? 'Arts et culture' : 'Arts and Culture'}
					bgcolor={'#DB3069'}
					bordercolor={'#fff'}
					button={true}
					id={'canada-civicinfra-arts-culture'}
					{map}
				/>
				<LegendItem
					variant={'circle'}
					label={fr ? 'Services gouvernementaux et communautaires' : 'Govt & Community Services'}
					bgcolor={'#8A4285'}
					bordercolor={'#fff'}
					button={true}
					id={'canada-civicinfra-govt-community'}
					{map}
				/>
				<LegendItem
					variant={'circle'}
					label={fr ? 'Loisirs' : 'Recreation'}
					bgcolor={'#43B171'}
					bordercolor={'#fff'}
					button={true}
					id={'canada-civicinfra-recreation'}
					{map}
				/>
				<LegendItem
					variant={'circle'}
					label={fr ? 'Santé' : 'Healthcare'}
					bgcolor={'#33AED7'}
					bordercolor={'#fff'}
					button={true}
					id={'canada-civicinfra-health-care'}
					{map}
				/>
				<LegendItem
					variant={'circle'}
					label={fr ? 'Éducation' : 'Education'}
					bgcolor={'#F45D01'}
					bordercolor={'#fff'}
					button={true}
					id={'canada-civicinfra-education'}
					{map}
				/>
				<LegendItem variant={'polygon'} label={fr ? 'Rues principales à forte densité' : 'High Density Main Streets'} bgcolor={'#eee'} />
				<LegendItem variant={'polygon'} label={fr ? 'Rues principales à faible densité' : 'Low Density Main Streets'} bgcolor={'#dddd'} />
			</div>
		</div>
		<button id="resetButton" on:click={resetMap}>
			<Icon icon="mi:undo" /> {fr ? 'Réinitialiser la carte' : 'Reset Map'}
		</button>
	</div>

	<div id="map"></div>
</div>

<style>
	#map {
		height: 50vh;
		width: 100%;
		position: relative;
		order: -1;
		border-bottom: 1px solid #eee;
	}

	h4,
	h5 {
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
		gap: 1em;
	}

	#legend,
	#mainstreet-legend {
		transition:
			opacity 0.3s,
			visibility 0.3s;
		opacity: 0;
		visibility: hidden;
		display: flex;
		flex-direction: column;
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
		box-shadow:
			rgba(27, 31, 35, 0.04) 0px 1px 0px 0px,
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
		box-shadow:
			0px 1px 0px 0px rgba(27, 31, 35, 0.04),
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
