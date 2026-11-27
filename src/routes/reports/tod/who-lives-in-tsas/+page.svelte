<script lang="ts">
	import Icon from '@iconify/svelte';
	import { csvParse } from 'd3-dsv';
	import { onMount } from 'svelte';
	// Images
	import Calgary from './assets/Calgary.png';
	import Canada from './assets/Canada.png';
	import Edmonton from './assets/Edmonton.png';
	import introImage from './assets/HeaderImage.png';
	import KWC from './assets/KWC.png';
	import Montreal from './assets/Montreal.png';
	import Ottawa from './assets/Ottawa-Gatineau.png';
	import Toronto from './assets/Toronto.png';
	import Vancouver from './assets/Vancouver.png';
	// Components
	// @ts-ignore-next-line
	import { BarChart } from '@onsvisual/svelte-charts';
	import '../../../styles.css';
	import ReportHeader from '../../components/ReportHeader.svelte';
	import CardSelector from './components/CardSelector.svelte';
	import DotPlotLegend from './components/DotPlotLegend.svelte';
	import DotPlot from './components/StatDotPlot.svelte';
	import { formatNumber, getLang } from '../../../lib/i18n';

	const fr = getLang() === 'fr';

	// French display names for regions (data values and lookup keys stay in English).
	const REGION_FR: Record<string, { name: string; de: string; cmaSuffix?: string }> = {
		Calgary: { name: 'Calgary', de: 'de Calgary' },
		Edmonton: { name: 'Edmonton', de: 'd’Edmonton' },
		'Kitchener - Cambridge - Waterloo': {
			name: 'Kitchener - Cambridge - Waterloo',
			de: 'de Kitchener - Cambridge - Waterloo'
		},
		Montreal: { name: 'Montréal', de: 'de Montréal' },
		'Ottawa - Gatineau': {
			name: 'Ottawa - Gatineau',
			de: 'd’Ottawa - Gatineau',
			cmaSuffix: ' (partie de l’Ontario)'
		},
		Toronto: { name: 'Toronto', de: 'de Toronto' },
		Vancouver: { name: 'Vancouver', de: 'de Vancouver' }
	};

	const regionName = (value: string) =>
		fr ? (value === 'All Regions' ? 'Toutes les régions' : (REGION_FR[value]?.name ?? value)) : value;

	/** French phrases for the selected region, used in French sentences only. */
	function frenchPlace(region: string) {
		if (region === 'All Regions') {
			return {
				cma: 'Toutes les régions',
				tsa: 'Toutes les ASTC',
				titleDe: 'du Canada',
				ofCma: 'de l’ensemble des régions',
				inCma: 'dans l’ensemble des régions',
				inTsa: 'dans l’ensemble des ASTC'
			};
		}
		const r = REGION_FR[region] ?? { name: region, de: `de ${region}` };
		const cma = `RMR ${r.de}${r.cmaSuffix ?? ''}`;
		const tsa = `ASTC ${r.de}`;
		return {
			cma,
			tsa,
			titleDe: r.de,
			ofCma: `de la ${cma}`,
			inCma: `dans la ${cma}`,
			inTsa: `dans les ${tsa}`
		};
	}

	// Chart labels shown on French pages (the English labels are also used as lookup keys below).
	const LABELS_FR: Record<string, string> = {
		'TSA Area (%)': 'Superficie des ASTC (%)',
		Region: 'Région',
		TSAs: 'ASTC',
		Population: 'Population',
		Dwellings: 'Logements',
		Employment: 'Emplois',
		'Average Transportation Cost': 'Coût moyen du transport',
		'Spending >30% on shelter': 'Plus de 30 % du revenu au logement',
		Renters: 'Locataires',
		Apartments: 'Appartements',
		'Public Transit': 'Transport collectif',
		'Active Transportation': 'Transport actif',
		'University Degree': 'Diplôme universitaire',
		'Single Households': 'Ménages d’une personne',
		'Maintainers Under 35': 'Soutiens du ménage de moins de 35 ans'
	};
	const loc = <T extends { label: string; group?: string }>(rows: T[]): T[] =>
		fr
			? rows.map((r) => ({
					...r,
					label: LABELS_FR[r.label] ?? r.label,
					...(r.group ? { group: LABELS_FR[r.group] ?? r.group } : {})
				}))
			: rows;

	const num = (v: number) => formatNumber(Math.round(v), undefined, 'fr');
	const pct = (v: number) => `${formatNumber(Math.round(v), undefined, 'fr')}\u00a0%`;
	const money = (v: number) => `${formatNumber(Math.round(v), undefined, 'fr')}\u00a0$`;

	interface RegionItem {
		value: string;
		name: string;
		image: string;
	}

	// Initialize data as an empty array to prevent immediate initialization crashes
	// when $derived coordinates assess length before onMount resolves.
	let data = $state<any[]>([]);

	onMount(async () => {
		try {
			const response = await fetch(
				'https://measuringmainstreets.blob.core.windows.net/public/reports/TSA_all_demos.csv'
			);
			const rawText = await response.text();
			//transform data here if necessary
			data = csvParse(rawText, (d) => d);
		} catch (error) {
			console.error('Error fetching job growth data:', error);
		}
	});

	let selectedRegion = $state('All Regions');

	const regions: RegionItem[] = [
		{ value: 'All Regions', name: regionName('All Regions'), image: Canada },
		{ value: 'Calgary', name: 'Calgary', image: Calgary },
		{ value: 'Edmonton', name: 'Edmonton', image: Edmonton },
		{
			value: 'Kitchener - Cambridge - Waterloo',
			name: 'Kitchener - Cambridge - Waterloo',
			image: KWC
		},
		{ value: 'Montreal', name: regionName('Montreal'), image: Montreal },
		{ value: 'Ottawa - Gatineau', name: 'Ottawa - Gatineau', image: Ottawa },
		{ value: 'Toronto', name: 'Toronto', image: Toronto },
		{ value: 'Vancouver', name: 'Vancouver', image: Vancouver }
	];

	const currentImage = $derived(
		regions.find((region) => region.value === selectedRegion)?.image ?? null
	);

	const selectedRow = $derived(
		data.length > 0 ? (data.find((d: any) => d.Region === selectedRegion) ?? data[0]) : null
	);

	// Overall
	const areaData = $derived(
		selectedRow
			? [
					{ label: 'TSA Area (%)', value: 100 - Math.round(selectedRow.area_pct), group: 'Region' },
					{ label: 'TSA Area (%)', value: Math.round(selectedRow.area_pct), group: 'TSAs' }
				]
			: []
	);

	const popData = $derived(
		selectedRow
			? [
					{
						label: 'Population',
						tsa: selectedRow['Population_In'],
						cma: selectedRow['Population_Out']
					}
				]
			: []
	);

	const dwellingsData = $derived(
		selectedRow
			? [
					{
						label: 'Dwellings',
						tsa: selectedRow['Dwellings_In'],
						cma: selectedRow['Dwellings_Out']
					}
				]
			: []
	);

	const employmentData = $derived(
		selectedRow
			? [
					{
						label: 'Employment',
						tsa: selectedRow['Employment_In'],
						cma: selectedRow['Employment_Out']
					}
				]
			: []
	);

	const transportCostData = $derived(
		selectedRow
			? [
					{
						label: 'Average Transportation Cost',
						tsa: selectedRow['Transport_Cost_In'],
						cma: selectedRow['Transport_Cost_Out']
					}
				]
			: []
	);

	const popDotData = $derived(
		selectedRow
			? [
					{
						label: 'Employment',
						tsa: selectedRow['Employment_In'],
						cma: selectedRow['Employment_Out']
					},
					{
						label: 'Dwellings',
						tsa: selectedRow['Dwellings_In'],
						cma: selectedRow['Dwellings_Out']
					},
					{
						label: 'Population',
						tsa: selectedRow['Population_In'],
						cma: selectedRow['Population_Out']
					}
				]
			: []
	);

	const housingData = $derived(
		selectedRow
			? [
					{
						label: 'Spending >30% on shelter',
						tsa: selectedRow['Shelter_over30_In'],
						cma: selectedRow['Shelter_over30_Out']
					},
					{
						label: 'Renters',
						tsa: selectedRow['Rented_In'],
						cma: selectedRow['Rented_Out']
					},
					{
						label: 'Apartments',
						tsa: selectedRow['Apartment_In'],
						cma: selectedRow['Apartment_Out']
					}
				]
			: []
	);

	const transportData = $derived(
		selectedRow
			? [
					{
						label: 'Public Transit',
						tsa: selectedRow['Public_Transit_In'],
						cma: selectedRow['Public_Transit_Out']
					},
					{
						label: 'Active Transportation',
						tsa: selectedRow['Active_In'],
						cma: selectedRow['Active_Out']
					}
				]
			: []
	);

	const demoData = $derived(
		selectedRow
			? [
					{
						label: 'University Degree',
						tsa: selectedRow['Uni_Degree_In'],
						cma: selectedRow['Uni_Degree_Out']
					},
					{
						label: 'Single Households',
						tsa: selectedRow['Single_person_hh_In'],
						cma: selectedRow['Single_person_hh_Out']
					},
					{
						label: 'Maintainers Under 35',
						tsa: selectedRow['Maintaier_Age_u35_In'],
						cma: selectedRow['Maintaier_Age_u35_Out']
					}
				]
			: []
	);

	const minValue = $derived(
		popDotData.length > 0 ? Math.min(...popDotData.flatMap((d) => [d.tsa, d.cma])) : 0
	);
	const maxValue = $derived(
		popDotData.length > 0 ? Math.max(...popDotData.flatMap((d) => [d.tsa, d.cma])) : 0
	);
	const domain = $derived([minValue * 0.5, maxValue * 1.2]);

	const place = $derived(frenchPlace(selectedRow?.Region ?? ''));
	const legendRow = $derived(
		fr && selectedRow ? { ...selectedRow, TSANAME: place.tsa, CMANAME: place.cma } : selectedRow
	);

	const tsaColour = '#db3069';
	const cmaColour = '#00adf2';
</script>

{#if fr}
	<ReportHeader
		id="report-header"
		title="Qui habite les aires de station de transport collectif?"
		subtitle="Quels types de collectivités l’aménagement axé sur le transport collectif attire-t-il? Comparez les aires de station de transport collectif à leur région pour en savoir plus."
		backgroundImage={introImage}
		scrollTargetId="main"
	/>
{:else}
<ReportHeader
	id="report-header"
	title="Who lives in Transit Station Areas?"
	subtitle="What kinds of communities does transit-oriented development attract? Compare transit station areas to their regions to learn more."
	backgroundImage={introImage}
	scrollTargetId="main"
/>
{/if}

{#if data.length > 0 && selectedRow}
	<main class="p-10 md:px-50" id="main">
		<h1 class="infographic-title p-10" style="text-align: center;">
			{#if fr}
			Qui habite les aires de station de transport collectif {place.titleDe}?
			{:else}
			Who Lives in
			{#if selectedRegion == 'All Regions'}
				Canada's
			{:else}
				{selectedRow.Region}'s
			{/if}
			Transit Station Areas?
			{/if}
		</h1>
		<div class="center font-semibold" style="color: var(--brandDarkBlue);">
			{fr ? 'Choisissez une région :' : 'Select a Region:'}
		</div>
		<div class="center p-4 sticky">
			<CardSelector options={regions} bind:selected={selectedRegion} />
		</div>

		<div class="region-description grid grid-cols-1 md:grid-cols-2 gap-4 p-10">
			<div class="image-container flex items-center justify-center">
				{#if currentImage}
					<img src={currentImage} alt={regionName(selectedRegion)} class="region-image" />
				{/if}
			</div>
			<div class="pt-10">
				<div class="flex items-end gap-2">
					<div class="chart-stat shrink-0 leading-none mt-1">
						{#if fr}{pct(selectedRow.area_pct)}{:else}{Math.round(selectedRow.area_pct)}%{/if}
					</div>
					<div class="w-full max-w-[16rem] mb-1">
						<span style="color: var(--brandDarkBlue);">
							{#if fr}
								<b>de la superficie {place.ofCma} est constituée d’aires de station de transport collectif.</b>
							{:else if selectedRegion == 'All Regions'}
								<b>of area in All Regions is made up of transit station areas.</b>
							{:else}
								<b>of {selectedRow.Region}'s area is made up of transit station areas.</b>
							{/if}
						</span>
					</div>
				</div>

				<div class="w-full max-w-[30rem] pb-8">
					<BarChart
						colors={['#d9d9d9', '#f1c500']}
						data={loc(areaData)}
						xKey="value"
						yKey="label"
						zKey="group"
						mode="default"
						xSuffix={fr ? '\u00a0%' : '%'}
						padding={{ top: 0, bottom: 20, left: 60, right: 20 }}
					/>
				</div>

				{#if fr}
					<p>
						Les <b style="color: var(--brandDarkBlue);">aires de station de transport collectif (ASTC)</b>
						désignent le secteur situé dans un rayon de 800&nbsp;m autour d’une station de transport
						collectif.<br /><br />

						Les données qui suivent comparent la population qui vit dans les aires de station de
						transport collectif à celle qui vit à l’extérieur de ces aires
						<b style="color: var(--brandDarkBlue);">{place.inCma}</b>.
					</p>
					<p style="font-size: 0.75em">
						<b style="color: var(--brandDarkBlue);">Toutes les régions</b> désigne les RMR de Calgary,
						d’Edmonton, de Kitchener - Cambridge - Waterloo, de Montréal, d’Ottawa - Gatineau, de Toronto
						et de Vancouver.
					</p>
				{:else}
				<p>
					<b style="color: var(--brandDarkBlue);">Transit Station Areas (TSAs)</b> refer to the area
					within an 800m radius of a transit station.<br /><br />

					The following data compares the population within transit station areas to the population
					outside of transit station areas in
					<b style="color: var(--brandDarkBlue);">{selectedRow.CMANAME}</b>.
				</p>
				<p style="font-size: 0.75em">
					<b style="color: var(--brandDarkBlue);">All Regions</b> refers to Calgary CMA, Edmonton CMA,
					Kitchener - Cambridge - Waterloo CMA, Montreal CMA, Ottawa-Gatineau CMA, Toronto CMA, and Vancouver
					CMA.
				</p>
				{/if}
			</div>
		</div>

		<div class="infographic-section pb-20">
			<div class="section-title pb-6 text-center">
				<h2>
					<span class="flex items-center gap-2 justify-center flex-wrap">
						<Icon icon="mdi:map" style="color: var(--brandLightBlue)" />
						{fr ? 'En un coup d’œil' : 'At a Glance'}
					</span>
				</h2>
			</div>
			{#if fr}
				<p class="pb-8">
					Les aires de station de transport collectif n’occupent qu’une très petite partie du
					territoire de leur région. Elles sont toutefois extrêmement efficaces sur le plan de la
					densité de population et de logements.
				</p>
			{:else}
			<p class="pb-8">
				Transit station areas make up a very small portion of the land area in their regions.
				However, they are extremely efficient when it comes to population and dwelling density.
			</p>
			{/if}
			<div style="display: flex; justify-content: center;">
				<DotPlotLegend data={legendRow} />
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
				<div class="sm:pl-40 md:pl-0 h-25">
					<DotPlot
						data={loc(popData)}
						yKey="label"
						xDomain={[
							Math.min(...popData.flatMap((d) => [d.tsa, d.cma])) * 0.8,
							Math.max(...popData.flatMap((d) => [d.tsa, d.cma])) * 1.2
						]}
						zDomain={['cma', 'tsa']}
						zRange={[cmaColour, tsaColour]}
					/>
				</div>
				<div class="section-stats pl-10 pb-10 w-auto">
					{#if fr}
						<h4 class="pb-2">Population</h4>
						<span class="stat" style="color: {tsaColour};">{num(popData[0]?.tsa ?? 0)}</span>
						personnes {place.ofCma}
						<b style="color: var(--brandDarkBlue);">vivent dans les ASTC</b><br />
						<span class="stat" style="color: {cmaColour};">{num(popData[0]?.cma ?? 0)}</span>
						personnes {place.ofCma}
						<b style="color: var(--brandDarkBlue);">vivent hors des ASTC</b>
					{:else}
					<h4 class="pb-2">Population</h4>

					<span class="stat" style="color: {tsaColour};"
						>{Math.round(popData[0]?.tsa ?? 0).toLocaleString()}</span
					>
					people in {selectedRow.CMANAME}
					<b style="color: var(--brandDarkBlue);">live inside TSAs</b><br />
					<span class="stat" style="color: {cmaColour};"
						>{Math.round(popData[0]?.cma ?? 0).toLocaleString()}</span
					>
					people in {selectedRow.CMANAME}
					<b style="color: var(--brandDarkBlue);">live outside TSAs</b>
					{/if}
				</div>
				<div class="sm:pl-40 md:pl-0 w-auto h-25">
					<DotPlot
						data={loc(dwellingsData)}
						yKey="label"
						xDomain={[
							Math.min(...dwellingsData.flatMap((d) => [d.tsa, d.cma])) * 0.8,
							Math.max(...dwellingsData.flatMap((d) => [d.tsa, d.cma])) * 1.2
						]}
						zDomain={['cma', 'tsa']}
						zRange={[cmaColour, tsaColour]}
					/>
				</div>
				<div class="section-stats pl-10 pb-10 w-auto">
					{#if fr}
						<h4 class="pb-2">Logements</h4>
						<span class="stat" style="color: {tsaColour};">{num(dwellingsData[0]?.tsa ?? 0)}</span>
						logements {place.ofCma} se trouvent
						<b style="color: var(--brandDarkBlue);">dans les ASTC</b><br />
						<span class="stat" style="color: {cmaColour};">{num(dwellingsData[0]?.cma ?? 0)}</span>
						logements {place.ofCma} se trouvent
						<b style="color: var(--brandDarkBlue);">hors des ASTC</b>
					{:else}
					<h4 class="pb-2">Dwellings</h4>
					<span class="stat" style="color: {tsaColour};"
						>{Math.round(dwellingsData[0]?.tsa ?? 0).toLocaleString()}</span
					>
					dwellings in {selectedRow.CMANAME} are
					<b style="color: var(--brandDarkBlue);">inside TSAs</b><br />
					<span class="stat" style="color: {cmaColour};"
						>{Math.round(dwellingsData[0]?.cma ?? 0).toLocaleString()}</span
					>
					dwellings in
					{selectedRow.CMANAME} are <b style="color: var(--brandDarkBlue);">outside TSAs</b>
					{/if}
				</div>
				<div class="sm:pl-40 md:pl-0 w-auto h-25">
					<DotPlot
						data={loc(employmentData)}
						yKey="label"
						xDomain={[
							Math.min(...employmentData.flatMap((d) => [d.tsa, d.cma])) * 0.8,
							Math.max(...employmentData.flatMap((d) => [d.tsa, d.cma])) * 1.2
						]}
						zDomain={['cma', 'tsa']}
						zRange={[cmaColour, tsaColour]}
					/>
				</div>
				<div class="pl-10">
					{#if fr}
						<h4 class="pb-2">Emplois</h4>
						<span class="stat" style="color: {tsaColour};">{num(employmentData[0]?.tsa ?? 0)}</span>
						emplois {place.ofCma} se trouvent
						<b style="color: var(--brandDarkBlue);">dans les ASTC</b><br />
						<span class="stat" style="color: {cmaColour};">{num(employmentData[0]?.cma ?? 0)}</span>
						emplois {place.ofCma} se trouvent
						<b style="color: var(--brandDarkBlue);">hors des ASTC</b>
					{:else}
					<h4 class="pb-2">Employment</h4>
					<span class="stat" style="color: {tsaColour};"
						>{Math.round(employmentData[0]?.tsa ?? 0).toLocaleString()}</span
					>
					jobs in {selectedRow.CMANAME} are
					<b style="color: var(--brandDarkBlue);">inside TSAs</b><br />
					<span class="stat" style="color: {cmaColour};"
						>{Math.round(employmentData[0]?.cma ?? 0).toLocaleString()}</span
					>
					jobs in {selectedRow.CMANAME} are
					<b style="color: var(--brandDarkBlue);">outside TSAs</b>
					{/if}
				</div>
			</div>
		</div>

		<div class="infographic-section pb-20 md:pb-20 pt-16 md:pt-0">
			<div class="section-title pb-6 text-center">
				<h2>
					<span class="flex items-center gap-2 justify-center flex-wrap">
						<Icon icon="mdi:train" style="color: var(--brandPurple); display: inline;" />
						{fr ? 'L’aménagement axé sur le transport collectif, pour qui?' : 'Transit-Oriented Development For Who?'}
					</span>
				</h2>
			</div>
			{#if fr}
				<p class="pb-8">
					Les collectivités situées autour des stations de transport collectif sont généralement
					composées de jeunes locataires vivant seuls. Les populations des ASTC sont aussi généralement
					très scolarisées : la proportion de personnes titulaires d’un diplôme universitaire y est plus
					élevée qu’à l’extérieur des ASTC.
				</p>
			{:else}
			<p class="pb-8">
				Communities around transit station areas are usually oriented towards young,
				single-household renters. TSA communities are also generally highly-educated, with higher
				percentages of residents holding university degrees inside TSAs than outside.
			</p>
			{/if}
			<div style="display: flex; justify-content: center;">
				<DotPlotLegend data={legendRow} />
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="sm:pl-40 md:pl-0 h-100 md:h-auto">
					<DotPlot
						data={loc(demoData)}
						yKey="label"
						xDomain={[0, 80]}
						zDomain={['cma', 'tsa']}
						zRange={[cmaColour, tsaColour]}
					/>
					<div class="pl-12 text-xs text-gray-500 center uppercase font-semibold">
						{fr ? 'Pourcentage (%)' : 'Percentage (%)'}
					</div>
				</div>
				<div class="section-stats md:pt-4 pl-10 w-auto">
					<div class="py-8">
						{#if fr}
							<h4 class="pb-2">Âge du principal soutien du ménage</h4>
							<span class="stat" style="color: {tsaColour};">{pct(demoData.find((d) => d.label === 'Maintainers Under 35')?.tsa ?? 0)}</span>
							des principaux soutiens des ménages
							<b style="color: var(--brandDarkBlue);">{place.inTsa}</b> ont moins de 35 ans<br />
							<span class="stat" style="color: {cmaColour};">{pct(demoData.find((d) => d.label === 'Maintainers Under 35')?.cma ?? 0)}</span>
							des principaux soutiens des ménages
							<b style="color: var(--brandDarkBlue);">{place.inCma} (hors des ASTC)</b> ont moins de 35 ans
						{:else}
						<h4 class="pb-2">Maintainer Age</h4>
						<span class="stat" style="color: {tsaColour};"
							>{Math.round(
								demoData.find((d) => d.label === 'Maintainers Under 35')?.tsa ?? 0
							)}%</span
						>
						of household maintainers in
						<b style="color: var(--brandDarkBlue);">{selectedRow.TSANAME}</b> are under 35<br />
						<span class="stat" style="color: {cmaColour};"
							>{Math.round(
								demoData.find((d) => d.label === 'Maintainers Under 35')?.cma ?? 0
							)}%</span
						>
						of household maintainers in
						<b style="color: var(--brandDarkBlue);">{selectedRow.CMANAME} (outside TSAs)</b> are under
						35
						{/if}
					</div>

					<div class="py-8">
						{#if fr}
							<h4 class="pb-2">Ménages d’une personne</h4>
							<span class="stat" style="color: {tsaColour};">{pct(demoData.find((d) => d.label === 'Single Households')?.tsa ?? 0)}</span>
							des ménages <b style="color: var(--brandDarkBlue);">{place.inTsa}</b> comptent une seule personne<br />
							<span class="stat" style="color: {cmaColour};">{pct(demoData.find((d) => d.label === 'Single Households')?.cma ?? 0)}</span>
							des ménages <b style="color: var(--brandDarkBlue);">{place.inCma} (hors des ASTC)</b> comptent une seule personne
						{:else}
						<h4 class="pb-2">Single Households</h4>

						<span class="stat" style="color: {tsaColour};"
							>{Math.round(demoData.find((d) => d.label === 'Single Households')?.tsa ?? 0)}%</span
						>
						of households in
						<b style="color: var(--brandDarkBlue);">{selectedRow.TSANAME}</b> are single-person<br
						/>
						<span class="stat" style="color: {cmaColour};"
							>{Math.round(demoData.find((d) => d.label === 'Single Households')?.cma ?? 0)}%</span
						>
						of households in
						<b style="color: var(--brandDarkBlue);">{selectedRow.CMANAME} (outside TSAs)</b> are single-person
						{/if}
					</div>

					<div class="py-8">
						{#if fr}
							<h4 class="pb-2">Diplôme universitaire</h4>
							<span class="stat" style="color: {tsaColour};">{pct(demoData.find((d) => d.label === 'University Degree')?.tsa ?? 0)}</span>
							des personnes résidentes <b style="color: var(--brandDarkBlue);">{place.inTsa}</b> sont titulaires d’un diplôme universitaire<br />
							<span class="stat" style="color: {cmaColour};">{pct(demoData.find((d) => d.label === 'University Degree')?.cma ?? 0)}</span>
							des personnes résidentes <b style="color: var(--brandDarkBlue);">{place.inCma} (hors des ASTC)</b> sont titulaires d’un diplôme universitaire
						{:else}
						<h4 class="pb-2">University Degree</h4>
						<span class="stat" style="color: {tsaColour};"
							>{Math.round(demoData.find((d) => d.label === 'University Degree')?.tsa ?? 0)}%</span
						>
						of residents in
						<b style="color: var(--brandDarkBlue);">{selectedRow.TSANAME}</b> hold a university
						degree<br />
						<span class="stat" style="color: {cmaColour};"
							>{Math.round(demoData.find((d) => d.label === 'University Degree')?.cma ?? 0)}%</span
						>
						of residents in
						<b style="color: var(--brandDarkBlue);">{selectedRow.CMANAME} (outside TSAs)</b> hold a university
						degree
						{/if}
					</div>
				</div>
			</div>
		</div>

		<div class="infographic-section pb-20 mt-16 md:mt-0">
			<div class="section-title pb-6 text-center">
				<h2>
					<span class="flex items-center gap-2 justify-center flex-wrap">
						<Icon icon="mdi:domain" style="color: var(--brandOrange)" />
						{fr ? 'Densifier en hauteur plutôt qu’en étalement' : 'Building Up, Not Out'}
					</span>
				</h2>
			</div>
			{#if fr}
				<p class="pb-8">
					Pour être aussi efficace sur un territoire aussi restreint, la forme urbaine des aires de
					station de transport collectif doit se développer en hauteur plutôt qu’à l’horizontale. Les
					aires de station de transport collectif comptent une proportion plus élevée d’immeubles
					d’appartements que les secteurs environnants. De plus, une proportion plus élevée de
					personnes résidentes des aires de station de transport collectif consacrent plus de 30&nbsp;%
					de leur revenu aux frais de logement.
				</p>
			{:else}
			<p class="pb-8">
				In order to be so efficient in such a small area, the urban form in transit station areas
				must go vertical rather than spreading horizontally. Transit station areas have a higher
				percentage of residential apartment buildings than their surrounding areas. Additionally, a
				higher percentage of residents in transit station areas spend over 30% of their income on
				shelter costs.
			</p>
			{/if}
			<div style="display: flex; justify-content: center;">
				<DotPlotLegend data={legendRow} />
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="sm:pl-40 md:pl-0 w-auto h-100 md:h-auto">
					<DotPlot
						data={loc(housingData)}
						yKey="label"
						xDomain={[0, 100]}
						zDomain={['cma', 'tsa']}
						zRange={[cmaColour, tsaColour]}
					/>

					<div class="pl-12 text-xs text-gray-500 center uppercase font-semibold">
						{fr ? 'Pourcentage (%)' : 'Percentage (%)'}
					</div>
				</div>
				<div class="section-stats md:pt-4 pl-10 w-auto">
					<div class="py-8">
						{#if fr}
							<h4 class="pb-2">Appartements</h4>
							<span class="stat" style="color: {tsaColour};">{pct(housingData.find((d) => d.label === 'Apartments')?.tsa ?? 0)}</span>
							des logements <b style="color: var(--brandDarkBlue);">{place.inTsa}</b> sont des appartements<br />
							<span class="stat" style="color: {cmaColour};">{pct(housingData.find((d) => d.label === 'Apartments')?.cma ?? 0)}</span>
							des logements <b style="color: var(--brandDarkBlue);">{place.inCma} (hors des ASTC)</b> sont des appartements
						{:else}
						<h4 class="pb-2">Apartments</h4>
						<span class="stat" style="color: {tsaColour};"
							>{Math.round(housingData.find((d) => d.label === 'Apartments')?.tsa ?? 0)}%</span
						>
						of dwellings are apartments inside
						<b style="color: var(--brandDarkBlue);">{selectedRow.TSANAME}</b><br />
						<span class="stat" style="color: {cmaColour};"
							>{Math.round(housingData.find((d) => d.label === 'Apartments')?.cma ?? 0)}%</span
						>
						of dwellings are apartments in
						<b style="color: var(--brandDarkBlue);">{selectedRow.CMANAME} (outside TSAs)</b>
						{/if}
					</div>
					<div class="py-8">
						{#if fr}
							<h4 class="pb-2">Locataires</h4>
							<span class="stat" style="color: {tsaColour};">{pct(housingData.find((d) => d.label === 'Renters')?.tsa ?? 0)}</span>
							des ménages <b style="color: var(--brandDarkBlue);">{place.inTsa}</b> sont locataires<br />
							<span class="stat" style="color: {cmaColour};">{pct(housingData.find((d) => d.label === 'Renters')?.cma ?? 0)}</span>
							des ménages <b style="color: var(--brandDarkBlue);">{place.inCma} (hors des ASTC)</b> sont locataires
						{:else}
						<h4 class="pb-2">Renters</h4>

						<span class="stat" style="color: {tsaColour};"
							>{Math.round(housingData.find((d) => d.label === 'Renters')?.tsa ?? 0)}%</span
						>
						of households are renting inside
						<b style="color: var(--brandDarkBlue);">{selectedRow.TSANAME}</b><br />
						<span class="stat" style="color: {cmaColour};"
							>{Math.round(housingData.find((d) => d.label === 'Renters')?.cma ?? 0)}%</span
						>
						of households are renting in
						<b style="color: var(--brandDarkBlue);">{selectedRow.CMANAME} (outside TSAs)</b>
						{/if}
					</div>
					<div class="py-8">
						{#if fr}
							<h4 class="pb-2">Ménages consacrant plus de 30&nbsp;% de leur revenu au logement</h4>
							<span class="stat" style="color: {tsaColour};">{pct(housingData.find((d) => d.label === 'Spending >30% on shelter')?.tsa ?? 0)}</span>
							des ménages <b style="color: var(--brandDarkBlue);">{place.inTsa}</b> consacrent plus de 30&nbsp;% de leur revenu au logement<br />
							<span class="stat" style="color: {cmaColour};">{pct(housingData.find((d) => d.label === 'Spending >30% on shelter')?.cma ?? 0)}</span>
							des ménages <b style="color: var(--brandDarkBlue);">{place.inCma} (hors des ASTC)</b> consacrent plus de 30&nbsp;% de leur revenu au logement
						{:else}
						<h4 class="pb-2">Spending more than 30% of income on shelter</h4>
						<span class="stat" style="color: {tsaColour};"
							>{Math.round(
								housingData.find((d) => d.label === 'Spending >30% on shelter')?.tsa ?? 0
							)}%</span
						>
						of households are spending more than 30% on shelter inside
						<b style="color: var(--brandDarkBlue);">{selectedRow.TSANAME}</b><br />
						<span class="stat" style="color: {cmaColour};"
							>{Math.round(
								housingData.find((d) => d.label === 'Spending >30% on shelter')?.cma ?? 0
							)}%</span
						>
						of households are spending more than 30% on shelter in
						<b style="color: var(--brandDarkBlue);">{selectedRow.CMANAME} (outside TSAs)</b>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<div class="infographic-section pb-20 mt-16 md:mt-0">
			<div class="section-title pb-6 text-center">
				<h2>
					<span class="flex items-center gap-2 justify-center flex-wrap">
						<Icon icon="mdi:map-marker-path" style="color: var(--brandPink)" />
						{fr ? 'En mouvement' : 'On the Move'}
					</span>
				</h2>
			</div>
			{#if fr}
				<p class="pb-8">
					En moyenne, les aires de station de transport collectif comptent une proportion plus élevée
					de personnes résidentes qui utilisent le transport actif et le transport collectif. Les
					personnes résidentes des aires de station de transport collectif dépensent aussi moins en
					transport, en moyenne, que celles de leur région.
				</p>
			{:else}
			<p class="pb-8">
				On average, have a higher percentage of residents who use active and public transportation.
				Residents of transit station areas also spend less on transportation on average compared to
				their region.
			</p>
			{/if}
			<div style="display: flex; justify-content: center;">
				<DotPlotLegend data={legendRow} />
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
				<div class="sm:pl-40 md:pl-0 w-auto h-100">
					<DotPlot
						data={loc(transportData)}
						yKey="label"
						xDomain={[0, 30]}
						zDomain={['cma', 'tsa']}
						zRange={[cmaColour, tsaColour]}
					/>
					<div class="pl-12 text-xs text-gray-500 center uppercase font-semibold">
						{fr ? 'Pourcentage (%)' : 'Percentage (%)'}
					</div>
				</div>
				<div class="section-stats md:pt-4 pl-10 w-auto">
					<div class="py-8">
						{#if fr}
							<h4 class="pb-2">Transport actif</h4>
							<span class="stat" style="color: {tsaColour};">{pct(transportData.find((d) => d.label === 'Active Transportation')?.tsa ?? 0)}</span>
							des personnes résidentes <b style="color: var(--brandDarkBlue);">{place.inTsa}</b> utilisent le transport actif<br />
							<span class="stat" style="color: {cmaColour};">{pct(transportData.find((d) => d.label === 'Active Transportation')?.cma ?? 0)}</span>
							des personnes résidentes <b style="color: var(--brandDarkBlue);">{place.inCma} (hors des ASTC)</b> utilisent le transport actif
						{:else}
						<h4 class="pb-2">Active Transportation</h4>
						<span class="stat" style="color: {tsaColour};"
							>{Math.round(
								transportData.find((d) => d.label === 'Active Transportation')?.tsa ?? 0
							)}%</span
						>
						of residents inside
						<b style="color: var(--brandDarkBlue);">{selectedRow.TSANAME}</b> use active
						transportation<br />
						<span class="stat" style="color: {cmaColour};"
							>{Math.round(
								transportData.find((d) => d.label === 'Active Transportation')?.cma ?? 0
							)}%</span
						>
						of residents in
						<b style="color: var(--brandDarkBlue);">{selectedRow.CMANAME} (outside TSAs)</b> use active
						transportation
						{/if}
					</div>
					<div class="py-8">
						{#if fr}
							<h4 class="pb-2">Transport collectif</h4>
							<span class="stat" style="color: {tsaColour};">{pct(transportData.find((d) => d.label === 'Public Transit')?.tsa ?? 0)}</span>
							des personnes résidentes <b style="color: var(--brandDarkBlue);">{place.inTsa}</b> utilisent le transport collectif<br />
							<span class="stat" style="color: {cmaColour};">{pct(transportData.find((d) => d.label === 'Public Transit')?.cma ?? 0)}</span>
							des personnes résidentes <b style="color: var(--brandDarkBlue);">{place.inCma} (hors des ASTC)</b> utilisent le transport collectif
						{:else}
						<h4 class="pb-2">Public Transit</h4>
						<span class="stat" style="color: {tsaColour};"
							>{Math.round(
								transportData.find((d) => d.label === 'Public Transit')?.tsa ?? 0
							)}%</span
						>
						of residents inside
						<b style="color: var(--brandDarkBlue);">{selectedRow.TSANAME}</b> use public transit<br
						/>
						<span class="stat" style="color: {cmaColour};"
							>{Math.round(
								transportData.find((d) => d.label === 'Public Transit')?.cma ?? 0
							)}%</span
						>
						of residents in
						<b style="color: var(--brandDarkBlue);">{selectedRow.CMANAME} (outside TSAs)</b> use public
						transit
						{/if}
					</div>
				</div>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="sm:pl-40 md:pl-0 w-auto h-25">
					<DotPlot
						data={loc(transportCostData)}
						yKey="label"
						xDomain={[
							Math.min(...transportCostData.flatMap((d) => [d.tsa, d.cma])) * 0.8,
							Math.max(...transportCostData.flatMap((d) => [d.tsa, d.cma])) * 1.2
						]}
						zDomain={['cma', 'tsa']}
						zRange={[cmaColour, tsaColour]}
					/>
					<div class="pl-12 text-xs text-gray-500 center uppercase font-semibold">
						{fr ? 'Montant dépensé par ménage, par année ($)' : 'Amount spent by household, yearly ($)'}
					</div>
				</div>
				<div class="section-stats md:pl-10 w-auto">
					<div class="pt-24">
						{#if fr}
							<h4 class="pb-2">Coût moyen du transport</h4>
							<span class="stat" style="color: {tsaColour};">{money(transportCostData.find((d) => d.label === 'Average Transportation Cost')?.tsa ?? 0)}</span>
							dépensés en transport par le ménage moyen en un an <b style="color: var(--brandDarkBlue);">{place.inTsa}</b><br />
							<span class="stat" style="color: {cmaColour};">{money(transportCostData.find((d) => d.label === 'Average Transportation Cost')?.cma ?? 0)}</span>
							dépensés en transport par le ménage moyen en un an <b style="color: var(--brandDarkBlue);">{place.inCma} (hors des ASTC)</b>
						{:else}
						<h4 class="pb-2">Average Transportation Cost</h4>

						<span class="stat" style="color: {tsaColour};"
							>${Math.round(
								transportCostData.find((d) => d.label === 'Average Transportation Cost')?.tsa ?? 0
							).toLocaleString()}</span
						>
						spent on transportation by the average household in a year inside
						<b style="color: var(--brandDarkBlue);">{selectedRow.TSANAME}</b><br />
						<span class="stat" style="color: {cmaColour};"
							>${Math.round(
								transportCostData.find((d) => d.label === 'Average Transportation Cost')?.cma ?? 0
							).toLocaleString()}</span
						>
						spent on transportation by the average household in a year in
						<b style="color: var(--brandDarkBlue);">{selectedRow.CMANAME} (outside TSAs)</b>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</main>
{/if}

<style>
	.infographic-title {
		font-size: 60px;
	}
	.section-title {
		font-size: 40px;
		font-weight: 600;
		color: var(--brandDarkBlue);
	}
	.chart-stat {
		font-size: 76px;
		font-weight: 600;
		color: var(--brandYellow);
	}
	.stat {
		font-size: 24px;
		font-weight: 600;
	}
	.section-stats {
		max-width: 40em;
	}
	.region-image {
		width: 100%;
		max-width: 400px;
		height: auto;
		margin-bottom: 20px;
		border-radius: 8px;
	}
	.center {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.sticky {
		position: sticky;
		top: 0;
		z-index: 10;
		background-color: #ffffff;
	}
	@media (max-width: 1024px) {
		.sticky {
			position: static;
		}
	}

	@media (max-width: 768px) {
		.section-stats {
			padding-left: 0;
		}
	}
</style>
