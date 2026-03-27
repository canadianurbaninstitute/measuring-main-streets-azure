<script>
	import Icon from '@iconify/svelte';

	// Images
	import Vancouver from './assets/Vancouver.png';
	import Calgary from './assets/Calgary.png';
	import Edmonton from './assets/Edmonton.png';
	import KWC from './assets/KWC.png';
	import Montreal from './assets/Montreal.png';
	import Ottawa from './assets/Ottawa-Gatineau.png';
	import Toronto from './assets/Toronto.png';
	import Canada from './assets/Canada.png';

	// Data
	import data from './data/TSA_all_demos.csv';

	// Components
	import CardSelector from './components/CardSelector.svelte';
	import { BarChart } from '@onsvisual/svelte-charts';
	import StatChart from './components/StatBarChart.svelte';
	import Footer from '../../../lib/ui/Footer.svelte';
	import DotPlot from './components/StatDotPlot.svelte';
	import DotPlotLegend from './components/DotPlotLegend.svelte';
	import '../../../styles.css';

	let selectedRegion = $state('All Regions');

	const regions = [
		{ value: 'All Regions', name: 'All Regions', image: Canada },
		{ value: 'Calgary', name: 'Calgary', image: Vancouver },
		{ value: 'Edmonton', name: 'Edmonton', image: Edmonton },
		{
			value: 'Kitchener - Cambridge - Waterloo',
			name: 'Kitchener - Cambridge - Waterloo',
			image: KWC
		},
		{ value: 'Montreal', name: 'Montreal', image: Montreal },
		{ value: 'Ottawa - Gatineau', name: 'Ottawa - Gatineau', image: Ottawa },
		{ value: 'Toronto', name: 'Toronto', image: Toronto },
		{ value: 'Vancouver', name: 'Vancouver', image: Vancouver }
	];

	const currentImage = $derived(
		regions.find((region) => region.value === selectedRegion)?.image ?? null
	);

	const selectedRow = $derived(data.find((d) => d.Region === selectedRegion) ?? data[0]);

	// Overall
	// TODO: force sum to 100
	const areaData = $derived([
		{ label: 'TSA Area (%)', value: 100 - selectedRow.area_pct, group: 'Region' },
		{ label: 'TSA Area (%)', value: selectedRow.area_pct, group: 'TSAs' }
	]);
	const popData = $derived([
		{
			label: 'Population',
			tsa: selectedRow['Population_In'],
			cma: selectedRow['Population_Out']
		}
	]);
	const dwellingsData = $derived([
		{
			label: 'Dwellings',
			tsa: selectedRow['Dwellings_In'],
			cma: selectedRow['Dwellings_Out']
		}
	]);
	const employmentData = $derived([
		{
			label: 'Employment',
			tsa: selectedRow['Employment_In'],
			cma: selectedRow['Employment_Out']
		}
	]);
	const transportCostData = $derived([
		{
			label: 'Average Transportation Cost',
			tsa: selectedRow['Transport_Cost_In'],
			cma: selectedRow['Transport_Cost_Out']
		}
	]);

	const popDotData = $derived([
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
	]);

	const housingData = $derived([
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
	]);

	const transportData = $derived([
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
	]);

	const demoData = $derived([
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
	]);

	const minValue = $derived(Math.min(...popDotData.flatMap((d) => [d.tsa, d.cma])));
	const maxValue = $derived(Math.max(...popDotData.flatMap((d) => [d.tsa, d.cma])));
	const domain = $derived([minValue * 0.5, maxValue * 1.2]);

	$effect(() => {
		console.log(popDotData);
		console.log(domain);
	});

	const tsaColour = '#db3069';
	const cmaColour = '#00adf2';
</script>

<main class="p-10 md:p-50">
	<h1 class="infographic-title p-10" style="text-align: center;">
		Who Lives in
		{#if selectedRegion == 'All Regions'}
			Canada's
		{:else}
			{selectedRow.Region}'s
		{/if}
		Transit Station Areas?
	</h1>
	<div class="center font-semibold" style="color: var(--brandDarkBlue);">Select a Region:</div>
	<div class="center p-4 sticky">
		<CardSelector options={regions} bind:selected={selectedRegion} />
	</div>

	<div class="region-description grid grid-cols-1 md:grid-cols-2 gap-4 p-10">
		<div class="image-container flex items-center justify-center">
			{#if currentImage}
				<img src={currentImage} alt={selectedRegion} class="region-image" />
			{/if}
		</div>
		<div class="pt-10">
			<div class="flex items-end gap-2">
				<div class="chart-stat shrink-0 leading-none mt-1">{Math.round(selectedRow.area_pct)}%</div>
				<div class="w-full max-w-[16rem] mb-1">
					<span style="color: var(--brandDarkBlue);">
						{#if selectedRegion == 'All Regions'}
							<b>of area in All Regions is made up of Transit Station Areas.</b>
						{:else}
							<b>of {selectedRow.Region}'s area is made up of Transit Station Areas.</b>
						{/if}
					</span>
				</div>
			</div>

			<div class="w-full max-w-[30rem] pb-8">
				<BarChart
					colors={['#d9d9d9', '#f1c500']}
					data={areaData}
					xKey="value"
					yKey="label"
					zKey="group"
					mode="default"
					xSuffix="%"
					padding={{ top: 0, bottom: 20, left: 60, right: 20 }}
				/>
			</div>

			<p>
				<b style="color: var(--brandDarkBlue);">Transit Station Areas (TSAs)</b> refer to the area
				within an 800m radius of a transit station.<br /><br />

				The following data compares the population within Transit Station Areas to the population
				outside of Transit Station Areas in
				<b style="color: var(--brandDarkBlue);">{selectedRow.CMANAME}</b>.
			</p>
		</div>
	</div>

	<div class="infographic-section pb-20">
		<div class="section-title pb-6 text-center">
			<span class="flex items-center gap-2 justify-center flex-wrap">
				<Icon icon="mdi:map" style="color: var(--brandLightBlue)" />
				At a Glance
			</span>
		</div>
		<div class="section-description pb-8">
			Transit Station Areas make up a very small portion of the land area in their regions. However,
			they are extremely efficient when it comes to population and dwelling density.
		</div>
		<div style="display: flex; justify-content: center;">
			<DotPlotLegend data={selectedRow} />
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
			<div>
				<div class="md:pl-40 w-auto h-25">
					<DotPlot
						data={popData}
						yKey="label"
						xDomain={[
							Math.min(...popData.flatMap((d) => [d.tsa, d.cma])) * 0.8,
							Math.max(...popData.flatMap((d) => [d.tsa, d.cma])) * 1.2
						]}
						zDomain={['cma', 'tsa']}
						zRange={[cmaColour, tsaColour]}
					/>
				</div>
			</div>
			<div class="pl-10">
				<h4 class="pb-2">Population</h4>
				<span class="stat" style="color: {cmaColour};"
					>{Math.round(popData[0].cma).toLocaleString()}</span
				>
				people in {selectedRow.CMANAME}
				<b style="color: var(--brandDarkBlue);">live outside TSAs</b><br />
				<span class="stat" style="color: {tsaColour};"
					>{Math.round(popData[0].tsa).toLocaleString()}</span
				>
				people in {selectedRow.CMANAME}
				<b style="color: var(--brandDarkBlue);">live inside TSAs</b>
			</div>
			<div class="md:pl-40 w-auto h-25">
				<DotPlot
					data={dwellingsData}
					yKey="label"
					xDomain={[
						Math.min(...dwellingsData.flatMap((d) => [d.tsa, d.cma])) * 0.8,
						Math.max(...dwellingsData.flatMap((d) => [d.tsa, d.cma])) * 1.2
					]}
					zDomain={['cma', 'tsa']}
					zRange={[cmaColour, tsaColour]}
				/>
			</div>
			<div class="pl-10">
				<h4 class="pb-2">Dwellings</h4>
				<span class="stat" style="color: {cmaColour};"
					>{Math.round(dwellingsData[0].cma).toLocaleString()}</span
				>
				dwellings in
				{selectedRow.CMANAME} are <b style="color: var(--brandDarkBlue);">outside TSAs</b><br />
				<span class="stat" style="color: {tsaColour};"
					>{Math.round(dwellingsData[0].tsa).toLocaleString()}</span
				>
				dwellings in {selectedRow.CMANAME} are
				<b style="color: var(--brandDarkBlue);">inside TSAs</b>
			</div>
			<div class="md:pl-40 w-auto h-25">
				<DotPlot
					data={employmentData}
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
				<h4 class="pb-2">Employment</h4>
				<span class="stat" style="color: {cmaColour};"
					>{Math.round(employmentData[0].cma).toLocaleString()}</span
				>
				jobs in {selectedRow.CMANAME} are
				<b style="color: var(--brandDarkBlue);">outside TSAs</b><br />
				<span class="stat" style="color: {tsaColour};"
					>{Math.round(employmentData[0].tsa).toLocaleString()}</span
				>
				jobs in {selectedRow.CMANAME} are
				<b style="color: var(--brandDarkBlue);">inside TSAs</b>
			</div>
		</div>
	</div>

	<div class="infographic-section pb-20 mt-16 md:mt-0">
		<div class="section-title pb-6 text-center">
			<span class="flex items-center gap-2 justify-center flex-wrap">
				<Icon icon="mdi:domain" style="color: var(--brandOrange)" />
				Building Up, Not Out
			</span>
		</div>
		<div class="section-description pb-8">
			In order to be so efficient in such a small area, the urban form must go vertical rather than
			spreading horizontally. This is the case in the Transit Station Area housing stock. A higher
			percentage of residents in Transit Station Areas spend over 30% of their income on shelter
			costs.
		</div>
		<div style="display: flex; justify-content: center;">
			<DotPlotLegend data={selectedRow} />
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="md:pl-40 w-auto h-100 md:h-auto">
				<DotPlot
					data={housingData}
					yKey="label"
					xDomain={[0, 100]}
					seriesColors={[tsaColour, cmaColour]}
					height="100%"
					zDomain={['cma', 'tsa']}
					zRange={[cmaColour, tsaColour]}
				/>

				<div class="pl-12 text-xs text-gray-500 center uppercase font-semibold">Percentage (%)</div>
			</div>
			<div class="md:pt-4 pl-10 w-auto">
				<div class="py-8">
					<h4 class="pb-2">Apartments</h4>
					<span class="stat" style="color: {cmaColour};"
						>{Math.round(housingData.find((d) => d.label === 'Apartments')?.cma)}%</span
					>
					of dwellings are apartments in
					<b style="color: var(--brandDarkBlue);">{selectedRow.CMANAME} (outside TSAs)</b><br />
					<span class="stat" style="color: {tsaColour};"
						>{Math.round(housingData.find((d) => d.label === 'Apartments')?.tsa)}%</span
					>
					of dwellings are apartments inside
					<b style="color: var(--brandDarkBlue);">{selectedRow.TSANAME}</b>
				</div>
				<div class="py-8">
					<h4 class="pb-2">Renters</h4>
					<span class="stat" style="color: {cmaColour};"
						>{Math.round(housingData.find((d) => d.label === 'Renters')?.cma)}%</span
					>
					of households are renting in
					<b style="color: var(--brandDarkBlue);">{selectedRow.CMANAME} (outside TSAs)</b><br />
					<span class="stat" style="color: {tsaColour};"
						>{Math.round(housingData.find((d) => d.label === 'Renters')?.tsa)}%</span
					>
					of households are renting inside
					<b style="color: var(--brandDarkBlue);">{selectedRow.TSANAME}</b>
				</div>
				<div class="py-8">
					<h4 class="pb-2">Spending more than 30% of income on shelter</h4>

					<span class="stat" style="color: {cmaColour};"
						>{Math.round(
							housingData.find((d) => d.label === 'Spending >30% on shelter')?.cma
						)}%</span
					>
					of households are spending more than 30% on shelter in
					<b style="color: var(--brandDarkBlue);">{selectedRow.CMANAME} (outside TSAs)</b><br />
					<span class="stat" style="color: {tsaColour};"
						>{Math.round(
							housingData.find((d) => d.label === 'Spending >30% on shelter')?.tsa
						)}%</span
					>
					of households are spending more than 30% on shelter inside
					<b style="color: var(--brandDarkBlue);">{selectedRow.TSANAME}</b>
				</div>
			</div>
		</div>
	</div>

	<div class="infographic-section pb-20 mt-16 md:mt-0">
		<div class="section-title pb-6 text-center">
			<span class="flex items-center gap-2 justify-center flex-wrap">
				<Icon icon="mdi:map-marker-path" style="color: var(--brandPink)" />
				On the Move
			</span>
		</div>
		<div class="section-description pb-8">
			On average, have a higher percentage of residents who use active and public transportation.
			Residents of Transit Station Areas also spend less on transportation on average compared to
			their region.
		</div>
		<div style="display: flex; justify-content: center;">
			<DotPlotLegend data={selectedRow} />
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="md:pl-40 w-auto h-100">
				<DotPlot
					data={transportData}
					yKey="label"
					xDomain={[0, 30]}
					seriesColors={[tsaColour, cmaColour]}
					height="100%"
					zDomain={['cma', 'tsa']}
					zRange={[cmaColour, tsaColour]}
				/>
				<div class="pl-12 text-xs text-gray-500 center uppercase font-semibold">Percentage (%)</div>
				<div class="h-auto w-auto">
					<DotPlot
						data={transportCostData}
						yKey="label"
						xDomain={[
							Math.min(...transportCostData.flatMap((d) => [d.tsa, d.cma])) * 0.8,
							Math.max(...transportCostData.flatMap((d) => [d.tsa, d.cma])) * 1.2
						]}
						seriesColors={[tsaColour, cmaColour]}
						height="100px"
						zDomain={['cma', 'tsa']}
						zRange={[cmaColour, tsaColour]}
					/>
				</div>
			</div>
			<!-- TODO: fix mobile -->
			<div class="md:pt-4 pl-10 w-auto">
				<div class="py-8">
					<h4 class="pb-2">Active Transportation</h4>
					<span class="stat" style="color: {cmaColour};"
						>{Math.round(
							transportData.find((d) => d.label === 'Active Transportation')?.cma
						)}%</span
					>
					of residents in
					<b style="color: var(--brandDarkBlue);">{selectedRow.CMANAME} (outside TSAs)</b> use
					active transportation<br />
					<span class="stat" style="color: {tsaColour};"
						>{Math.round(
							transportData.find((d) => d.label === 'Active Transportation')?.tsa
						)}%</span
					>
					of residents inside
					<b style="color: var(--brandDarkBlue);">{selectedRow.TSANAME}</b> use active transportation
				</div>
				<div class="py-8">
					<h4 class="pb-2">Public Transit</h4>
					<span class="stat" style="color: {cmaColour};"
						>{Math.round(transportData.find((d) => d.label === 'Public Transit')?.cma)}%</span
					>
					of residents in
					<b style="color: var(--brandDarkBlue);">{selectedRow.CMANAME} (outside TSAs)</b> use
					public transit<br />
					<span class="stat" style="color: {tsaColour};"
						>{Math.round(transportData.find((d) => d.label === 'Public Transit')?.tsa)}%</span
					>
					of residents inside
					<b style="color: var(--brandDarkBlue);">{selectedRow.TSANAME}</b> use public transit
				</div>
				<div class="py-8">
					<h4 class="pb-2">Average Transportation Cost</h4>
					<span class="stat" style="color: {cmaColour};"
						>${Math.round(
							transportCostData.find((d) => d.label === 'Average Transportation Cost')?.cma
						).toLocaleString()}</span
					>
					spent on transportation by the average household in a year in
					<b style="color: var(--brandDarkBlue);">{selectedRow.CMANAME} (outside TSAs)</b><br />
					<span class="stat" style="color: {tsaColour};"
						>${Math.round(
							transportCostData.find((d) => d.label === 'Average Transportation Cost')?.tsa
						).toLocaleString()}</span
					>
					spent on transportation by the average household in a year inside
					<b style="color: var(--brandDarkBlue);">{selectedRow.TSANAME}</b>
				</div>
			</div>
		</div>
	</div>

	<div class="infographic-section pb-20 md:pb-20 pt-16 md:pt-0">
		<div class="section-title pb-6 text-center">
			<span class="flex items-center gap-2 justify-center flex-wrap">
				<Icon icon="mdi:train" style="color: var(--brandPurple); display: inline;" />
				Transit-Oriented Development For Who?
			</span>
		</div>
		<div class="section-description pb-8">
			So who lives in Transit Station Areas? These communities are usually oriented towards young,
			highly-educated renters.
		</div>
		<div style="display: flex; justify-content: center;">
			<DotPlotLegend data={selectedRow} />
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="md:pl-40 w-auto h-100 md:h-auto">
				<DotPlot
					data={demoData}
					yKey="label"
					xDomain={[0, 80]}
					seriesColors={[tsaColour, cmaColour]}
					zDomain={['cma', 'tsa']}
					zRange={[cmaColour, tsaColour]}
				/>
				<div class="pl-12 text-xs text-gray-500 center uppercase font-semibold">Percentage (%)</div>
			</div>
			<div class="md:pt-4 pl-10 w-auto">
				<div class="py-8">
					<h4 class="pb-2">Maintainer Age</h4>
					<span class="stat" style="color: {cmaColour};"
						>{Math.round(demoData.find((d) => d.label === 'Maintainers Under 35')?.cma)}%</span
					>
					of household maintainers in
					<b style="color: var(--brandDarkBlue);">{selectedRow.CMANAME} (outside TSAs)</b> are under
					35<br />
					<span class="stat" style="color: {tsaColour};"
						>{Math.round(demoData.find((d) => d.label === 'Maintainers Under 35')?.tsa)}%</span
					>
					of household maintainers in
					<b style="color: var(--brandDarkBlue);">{selectedRow.TSANAME}</b> are under 35
				</div>

				<div class="py-8">
					<h4 class="pb-2">Single Households</h4>
					<span class="stat" style="color: {cmaColour};"
						>{Math.round(demoData.find((d) => d.label === 'Single Households')?.cma)}%</span
					>
					of households in
					<b style="color: var(--brandDarkBlue);">{selectedRow.CMANAME} (outside TSAs)</b> are
					single-person<br />
					<span class="stat" style="color: {tsaColour};"
						>{Math.round(demoData.find((d) => d.label === 'Single Households')?.tsa)}%</span
					>
					of households in
					<b style="color: var(--brandDarkBlue);">{selectedRow.TSANAME}</b> are single-person
				</div>

				<div class="py-8">
					<h4 class="pb-2">University Degree</h4>
					<span class="stat" style="color: {cmaColour};"
						>{Math.round(demoData.find((d) => d.label === 'University Degree')?.cma)}%</span
					>
					of residents in
					<b style="color: var(--brandDarkBlue);">{selectedRow.CMANAME} (outside TSAs)</b> hold a
					university degree<br />
					<span class="stat" style="color: {tsaColour};"
						>{Math.round(demoData.find((d) => d.label === 'University Degree')?.tsa)}%</span
					>
					of residents in
					<b style="color: var(--brandDarkBlue);">{selectedRow.TSANAME}</b> hold a university degree
				</div>
			</div>
		</div>
	</div>
</main>
<Footer />

<style>
	.infographic-title {
		font-size: 60px;
	}
	.section-title {
		font-size: 40px;
		font-weight: 600;
		color: var(--brandDarkBlue);
		/* text-transform: uppercase; */
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
	.section-description {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 auto;
		max-width: 40em;
		text-align: center;
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
</style>
