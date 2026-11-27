<script lang="ts">
	import { csvParse } from 'd3-dsv';
	import { onMount } from 'svelte';
	import lineColors from '../../lib/data/transitdata/line-colors.json';
	import Select from '../../lib/ui/Select.svelte';
	import { getLang } from '../../lib/i18n';
	import '../../styles.css';
	import TransitChart from './TransitChart.svelte';
	import TransitLegend from './TransitLegend.svelte';
	import TransitMap from './TransitMap.svelte';

	const fr = getLang() === 'fr';
	const T = (en: string, frText: string) => (fr ? frText : en);

	// Available metrics that can be displayed for each station add more as needed
	// (group names are display text only; `value` is the data key)
	const variablesArray = {
		[T('Demographics', 'Démographie')]: [
			{ value: 'TotalPopulation', label: 'Population', format: ',.0f' },
			{
				value: 'PopGrowth2020to2025',
				label: T('Population Growth 2020 to 2025 (%)', 'Croissance démographique 2020 à 2025 (%)')
			},
			{
				value: 'PopGrowth2025to2030',
				label: T(
					'Projected Population Growth 2025 to 2030 (%)',
					'Croissance démographique projetée 2025 à 2030 (%)'
				)
			},
			{ value: 'TotalHouseholds', label: T('Households', 'Ménages'), format: ',.0f' },
			{
				value: 'AverageEmploymentIncome',
				label: T('Average Employment Income ($) (2021)', 'Revenu d’emploi moyen ($) (2021)'),
				format: ',.0f'
			},
			{ value: 'TotalImmigrant', label: T('Total Immigrants (%)', 'Personnes immigrantes (%)') },
			{
				value: 'VisibleMinorityTotal',
				label: T('Visible Minorities (%)', 'Minorités visibles (%)')
			},
			{
				value: 'UniversityDegree',
				label: T(
					'Population with University Degree (%)',
					'Population titulaire d’un diplôme universitaire (%)'
				)
			},
			{
				value: 'WorkingAge',
				label: T('Population that is Working Age (%)', 'Population en âge de travailler (%)')
			},
			{ value: 'Youth', label: T('Population that are Youth (%)', 'Population jeune (%)') }
		],
		[T('Housing', 'Logement')]: [
			{ value: 'HousingTotal', label: T('Total Dwellings', 'Nombre total de logements'), format: ',.0f' },
			{
				value: 'HouseValue',
				label: T('Average House Value ($) (2021)', 'Valeur moyenne des logements ($) (2021)'),
				format: ',.0f'
			},
			{
				value: 'MonthlyRent',
				label: T('Average Monthly Rent ($) (2021)', 'Loyer mensuel moyen ($) (2021)'),
				format: ',.0f'
			},
			{
				value: 'MoreThan30OnShelter',
				label: T(
					'Population spending ≥30% of income on shelter (%) (2021)',
					'Population consacrant ≥ 30 % de son revenu au logement (%) (2021)'
				)
			}
		],
		[T('Employment', 'Emploi')]: [
			{
				value: 'EmployeeCount',
				label: T('Number of Employees', 'Nombre d’employés'),
				format: ',.0f'
			},
			{
				value: 'EmploymentDensity',
				label: T('Employment Density (per sq. km)', 'Densité d’emploi (par km²)'),
				format: ',.0f'
			}
		],
		[T('Built Form', 'Cadre bâti')]: [
			{
				value: 'PopulationDensity',
				label: T('Population Density (per sq. km)', 'Densité de population (par km²)'),
				format: ',.0f'
			},
			{
				value: 'building_pct',
				label: T(
					'Percentage of Land that is Buildings (%)',
					'Proportion du territoire occupée par des bâtiments (%)'
				),
				format: ',.0f'
			},
			{
				value: 'greenspace_pct',
				label: T(
					'Percentage of Land that is Greenspace (%)',
					'Proportion du territoire en espaces verts (%)'
				),
				format: ',.0f'
			},
			{
				value: 'water_pct',
				label: T(
					'Percentage of Land that is Water (%)',
					'Proportion du territoire couverte d’eau (%)'
				),
				format: ',.0f'
			},
			{
				value: 'parking_pct',
				label: T(
					'Percentage of Land that is Parking (%)',
					'Proportion du territoire occupée par du stationnement (%)'
				),
				format: ',.0f'
			}
		],
		[T('Complete Communities', 'Collectivités complètes')]: [
			{
				value: 'BusinessCount',
				label: T('Main Street Businesses', 'Commerces de rue principale'),
				format: ',.0f'
			},
			{
				value: 'bii',
				label: T('Independent Business Index (out of 1)', 'Indice des entreprises indépendantes (sur 1)')
			},
			{
				value: 'CivicCount',
				label: T('Civic Infrastructure Locations', 'Lieux d’infrastructure civique'),
				format: ',.0f'
			},
			{
				value: 'Daily_Visits',
				label: T('Average Daily Visitors', 'Visiteurs quotidiens moyens'),
				format: ',.0f'
			},
			{
				value: 'Tier_1_presence',
				label: T('Core Complete Community Score', 'Score de collectivité complète – services essentiels')
			},
			{
				value: 'Tier_2_presence',
				label: T(
					'Additional Complete Community Score',
					'Score de collectivité complète – services complémentaires'
				)
			},
			{
				value: 'Overall_score',
				label: T('Overall Complete Community Score', 'Score global de collectivité complète')
			}
		],
		[T('Housing Development Potential', 'Potentiel de développement résidentiel')]: [
			{
				value: 'DevelopmentPotentialScore',
				label: T('Development Potential Score', 'Score de potentiel de développement'),
				format: ',.0f'
			},
			{
				value: 'LandAvailability',
				label: T('Land Availability Score', 'Score de disponibilité des terrains'),
				format: ',.1f'
			},
			{
				value: 'DisplacementRisk',
				label: T('Displacement Risk Score', 'Score de risque de déplacement de population'),
				format: ',.1f'
			},
			{
				value: 'GrowthPressure',
				label: T('Growth Pressure Score', 'Score de pression de croissance'),
				format: ',.1f'
			}
		]
	};

	let variables = $state(variablesArray);
	let flatVariables = $derived(Object.values(variables).flat());

	let selectedVariable = $state('TotalPopulation'); // Currently selected metric to display
	let dataSources = $state<{
		data: any[];
		visitorData: any[];
		completeCommunityData: any[];
		builtForm: any[];
		developmentData: any[];
	}>({
		data: [],
		visitorData: [],
		completeCommunityData: [],
		builtForm: [],
		developmentData: []
	});
	let transitLines = $state<any>();
	let selectedLine = $state<string | number>(0);
	let selectedStation = $state<string | number>(0);

	// Auto-select first available line when component initializes
	$effect(() => {
		if (selectedLine === 0 && transitLines) {
			const firstRegion = Object.values(transitLines)[0];
			if (Array.isArray(firstRegion) && firstRegion.length) {
				selectedLine = firstRegion[0].value;
			}
		}
	});

	let lineColor = $derived(lineColors[selectedLine as keyof typeof lineColors]);

	let mergedData = $derived.by(() => {
		const { data, visitorData, completeCommunityData, builtForm, developmentData } = dataSources;

		// If either dataset is empty, return empty array
		if (!data.length || !visitorData.length) return [];

		// Create maps of supplementary data by station name/id for quick lookup
		const visitorMap = new Map(visitorData.map((station) => [station.id, station]));
		const ccMap = new Map(completeCommunityData.map((station) => [station.id, station]));
		const builtFormMap = new Map(builtForm.map((station) => [station.id, station]));
		const devMap = new Map(developmentData.map((station) => [station.id, station]));

		// Merge the datasets
		return data.map((station) => {
			const visitorInfo = visitorMap.get(station.id);
			const ccInfo = ccMap.get(station.id);
			const builtFormInfo = builtFormMap.get(station.id);
			const devInfo = devMap.get(station.id);

			return {
				...station,
				water_pct: builtFormInfo?.water_pct || 0,
				greenspace_pct: builtFormInfo?.greenspace_pct || 0,
				building_pct: builtFormInfo?.building_pct || 0,
				parking_pct: builtFormInfo?.parking_pct || 0,
				Daily_Visits: visitorInfo?.Daily_Visits || 0,
				Unique_Visitors: visitorInfo?.Unique_Visitors || 0,
				Tier_1_presence: ccInfo?.Tier_1_presence || 0,
				Tier_2_presence: ccInfo?.Tier_2_presence || 0,
				Overall_score: ccInfo?.Overall_score || 0,
				DevelopmentPotentialScore: devInfo?.DevelopmentPotentialScore || 0,
				LandAvailability: devInfo?.LandAvailability || 0,
				DisplacementRisk: devInfo?.DisplacementRisk || 0,
				GrowthPressure: devInfo?.GrowthPressure || 0
			};
		});
	});

	let currentData = $derived(
		mergedData.filter((station) => station.line_id === selectedLine.toString())
	);

	onMount(async () => {
		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/enriched/chart_stations_enriched.json'
			);
			dataSources.data = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error instanceof Error ? error.message : error);
		}

		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/built_form/station-metrics.json'
			);
			dataSources.builtForm = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error instanceof Error ? error.message : error);
		}

		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/dropdowns/transit-lines-dropdown.json'
			);
			transitLines = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error instanceof Error ? error.message : error);
		}

		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/complete_communities/visitor_data.json'
			);
			dataSources.visitorData = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error instanceof Error ? error.message : error);
		}

		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/complete_communities/stations_cc_presence.json'
			);
			dataSources.completeCommunityData = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error instanceof Error ? error.message : error);
		}

		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/transit-data/development/DevelopmentPotential_Subindex.csv'
			);
			const csvText = await response.text();
			dataSources.developmentData = csvParse(csvText, (d: any) => {
				const row: any = {};
				for (const key in d) {
					if (key === 'id') {
						row[key] = d[key].toString();
					} else if (['potential', 'LALevel', 'DRLevel', 'GPLevel'].includes(key)) {
						row[key] = d[key];
					} else {
						row[key] = d[key] === 'NA' ? 0 : +d[key];
					}
				}
				return row;
			});
		} catch (error) {
			console.error(
				'Error fetching development potential data:',
				error instanceof Error ? error.message : error
			);
		}
	});
</script>

<div class="hero">
	<h1>{fr ? 'Graphiques du transport collectif' : 'Transit Charts'}</h1>
	{#if fr}
		<p>
			Le graphique présente des données clés pour chaque arrêt d’une ligne de transport collectif
			sélectionnée. Choisissez une ligne et un indicateur (population, ménages ou revenu moyen, par
			exemple) : le graphique se met à jour pour montrer comment cet indicateur varie d’une station à
			l’autre. Chaque barre représente un arrêt; plus la barre est longue, plus la valeur est élevée.
			Vous pouvez ainsi comparer rapidement les secteurs le long du tracé et comprendre les tendances
			dans les aires de station du réseau. Les données datent de 2025, sauf indication contraire.
			Inspiré par <a href="https://schoolofcities.github.io/tod-toronto-1996-to-2021/" target="_blank"
				>School of Cities</a
			>. Consultez la section <a href="/about/data-methodology/#tod-meth" target="_blank"
				>Données et méthodologie</a
			> pour en savoir plus sur les sources de données et les calculs à la base de ces graphiques.
		</p>
	{:else}
	<p>
		The transit chart shows key data for each stop along a selected transit line. You can choose a
		line and a metric—such as population, households, or average income—and the chart will update to
		display how that metric varies across the stations. Each bar represents a stop, with taller bars
		indicating higher values. This helps you quickly compare areas along the route and understand
		patterns in the station areas of the transit system. Data is from 2025 unless otherwise
		specified. Inspired by <a
			href="https://schoolofcities.github.io/tod-toronto-1996-to-2021/"
			target="_blank">School of Cities</a
		>. See <a href="/about/data-methodology/#tod-meth" target="_blank">Data & Methodology</a> for more
		details on the data sources and calculations behind these charts.
	</p>
	{/if}
</div>
<div class="chart-container grid grid-cols-1 md:grid-cols-3 gap-4">
	<!-- Control panel for user selections -->
	<div class="container col-span-1 md:col-span-3">
		<div class="controls">
			<div class="select-wrapper">
				<label for="line-select">{fr ? 'Choisir une ligne :' : 'Select Line:'}</label>
				<Select
					data={transitLines}
					icon="mdi:train"
					placeholder={fr ? 'Choisir une ligne de transport collectif' : 'Select a Transit Line'}
					bind:selected={selectedLine as string}
				></Select>
			</div>
			<div class="select-wrapper">
				<label for="variable-select">{fr ? 'Choisir une variable :' : 'Select Variable:'}</label>
				<Select
					data={variables}
					icon="mdi:chart-bar"
					placeholder={fr ? 'Choisir une variable' : 'Select Variable'}
					bind:selected={selectedVariable}
				></Select>
			</div>
		</div>
		<!-- <div class="select-wrapper">
			<Combobo
			data={transitStations}
			icon="mdi:train"
			placeholder={'Search for a Transit Station'}
		></Combobox>
		</div> -->
	</div>
	<div class="col-span-1 md:col-span-1 w-[90%] md:w-full order-2 md:order-1">
		<TransitMap bind:selectedLine bind:selectedStation {currentData} {selectedVariable} />
	</div>
	<div class="col-span-1 md:col-span-2 w-[90%] order-1 md:order-2">
		{#if currentData}
			<TransitChart
				data={currentData}
				bind:selectedLine
				variables={flatVariables}
				bind:selectedStation
				{selectedVariable}
			/>
			{#if typeof lineColor === 'string'}
				<TransitLegend bind:lineColor />
			{/if}
		{/if}
	</div>
</div>

<style lang="postcss">
	/* Main container styling */
	.container {
		width: 100%;
	}
	/* Control panel layout */
	.controls {
		display: flex;
		gap: 1em;
		flex-wrap: wrap;
		align-items: flex-end;
	}
	.select-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		min-width: 350px;
	}
	.select-wrapper label {
		font-size: 0.9em;
		font-weight: 500;
		color: #333;
	}

	@reference "tailwindcss";
	.chart-container {
		margin: 2em;
	}
</style>
