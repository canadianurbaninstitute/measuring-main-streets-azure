<script>
	import * as d3 from 'd3';
	import { onMount } from 'svelte';
	import RadarChart from '../../../../tools/development-potential/RadarChart.svelte';
	import { getLang } from '../../../../lib/i18n';

	const fr = getLang() === 'fr';
	const T = (en, frText) => (fr ? frText : en);

	let { visible } = $props();

	let dataLoaded = $state(false);
	let landRadar = $state([]);
	let growthRadar = $state([]);
	let stationName = $state('');

	onMount(async () => {
		try {
			// Fetch the two resources to get names and metrics
			const [csvRes, jsonRes] = await Promise.all([
				fetch(
					'https://measuringmainstreets.blob.core.windows.net/public/transit-data/development/DevelopmentPotential_Subindex.csv'
				),
				fetch(
					'https://measuringmainstreets.blob.core.windows.net/public/transit-data/enriched/map_stations_enriched.json'
				)
			]);

			const text = await csvRes.text();
			const csv = d3.csvParse(text);
			const stationsEnriched = await jsonRes.json();

			// Find a candidate with Low/Very Low Land Availability and High/Very High Growth Pressure.
			const candidate = csv.find(
				(d) =>
					(d.GPLevel === 'Very High' || d.GPLevel === 'High') &&
					(d.LALevel === 'Low' || d.LALevel === 'Very Low')
			);

			const target = candidate || csv[0];

			const enrichedTarget = stationsEnriched.find((s) => s.id.toString() === target.id.toString());
			if (enrichedTarget) {
				stationName = enrichedTarget.stop_label;
			} else {
				stationName = `Station ${target.id}`;
			}

			landRadar = [
				{ label: T('Single Unit Dwellings', 'Habitations unifamiliales'), value: (parseFloat(target.single_units) || 0) * 100 },
				{
					label: T('Total Developable Land', 'Superficie aménageable totale'),
					value: (parseFloat(target.DevelopableArea) || 0) * 100 },
				{
					label: T('High Opportunity Sites', 'Sites à fort potentiel'),
					value: (parseFloat(target.HighOpportunityArea) || 0) * 100
				},
				{ label: T('Employment Density', 'Densité d’emploi'), value: (parseFloat(target.EmploymentDensity) || 0) * 100 },
				{ label: T('Population Density', 'Densité de population'), value: (parseFloat(target.PopulationDensity) || 0) * 100 }
			];

			growthRadar = [
				{
					label: T('Pop Change 2020-2025', 'Variation de la pop. 2020-2025'),
					value: (parseFloat(target.PopChange2020to2025) || 0) * 100
				},
				{
					label: T('Pop Change 2025-2030', 'Variation de la pop. 2025-2030'),
					value: (parseFloat(target.PopChange2025to2030) || 0) * 100
				},
				{
					label: T('Municipal Pop Change 2020-2025', 'Variation de la pop. municipale 2020-2025'),
					value: (parseFloat(target.MunicipalPopChange2020to2025) || 0) * 100
				},
				{
					label: T('Complete Community Score', 'Score de collectivité complète'),
					value: (parseFloat(target.OverallCCScore) || 0) * 100
				},
				{ label: T('Daily Visits', 'Visites quotidiennes'), value: (parseFloat(target.DailyVisits) || 0) * 100 }
			];

			dataLoaded = true;
		} catch (e) {
			console.error(e);
		}
	});
</script>

<div
	class="flex flex-col h-full w-full justify-center items-center gap-4 py-4 transition-opacity duration-1000 {visible
		? 'opacity-100'
		: 'opacity-0'}"
>
	{#if dataLoaded}
		<!-- <h3>
			{stationName}
		</h3> -->
		<div class="flex flex-col md:flex-row gap-4 w-full justify-center items-center">
			<div
				class="flex-1 flex flex-col items-center w-full bg-white p-3 rounded-xl shadow-sm border border-zinc-100"
			>
				<h4 class="text-lg font-bold text-center text-[#ff007f] uppercase tracking-wide">
					{fr ? 'Disponibilité des terrains' : 'Land Availability'}
				</h4>
				<span class="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2"
					>{fr ? 'Faible' : 'Low'}</span
				>
				<div class="w-full aspect-square p-12">
					<RadarChart data={landRadar} max={100} color="#ff007f" />
				</div>
			</div>

			<div
				class="flex-1 flex flex-col items-center w-full bg-white p-3 rounded-xl shadow-sm border border-zinc-100"
			>
				<h4 class="text-lg font-bold text-center text-[#00adf2] uppercase tracking-wide">
					{fr ? 'Pression de croissance' : 'Growth Pressure'}
				</h4>
				<span class="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2"
					>{fr ? 'Élevée' : 'High'}</span
				>
				<div class="w-full aspect-square p-12">
					<RadarChart data={growthRadar} max={100} color="#00adf2" />
				</div>
			</div>
		</div>
	{/if}
</div>
