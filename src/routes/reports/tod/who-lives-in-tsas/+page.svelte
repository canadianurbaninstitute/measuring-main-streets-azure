<script>
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
	import '../../../styles.css';
	import Footer from '../../../lib/ui/Footer.svelte';
	import Icon from '@iconify/svelte';

	let selectedRegion = $state('Canada');

	const regions = [
		{ value: 'Canada', name: 'Canada', image: Canada },
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

	function buildData(row, inKey, outKey) {
		return [
			{ label: row.TSAChartLabel, value: row[inKey] },
			{ label: row.CMAChartLabel, value: row[outKey] }
		];
	}

	// Overall
	// TODO: force sum to 100
	const areaData = $derived([
		{ label: 'TSA Area (%)', value: 100 - selectedRow.area_pct, group: 'Region' },
		{ label: 'TSA Area (%)', value: selectedRow.area_pct, group: 'TSAs' }
	]);
	const popData = $derived(buildData(selectedRow, 'Population_In', 'Population_Out'));
	const dwellingsData = $derived(buildData(selectedRow, 'Dwellings_In', 'Dwellings_Out'));
	const employmentData = $derived(buildData(selectedRow, 'Employment_In', 'Employment_Out'));
	// Housing
	const apartmentData = $derived(buildData(selectedRow, 'Apartment_In', 'Apartment_Out'));
	const renterData = $derived(buildData(selectedRow, 'Rented_In', 'Rented_Out'));
	const spendingOver30Data = $derived(
		buildData(selectedRow, 'Shelter_over30_In', 'Shelter_over30_Out')
	);
	// Transportation
	const activeData = $derived(buildData(selectedRow, 'Active_In', 'Active_Out'));
	const transitData = $derived(buildData(selectedRow, 'Public_Transit_In', 'Public_Transit_Out'));
	const transportCostData = $derived(
		buildData(selectedRow, 'Transport_Cost_In', 'Transport_Cost_Out')
	);
	// Demos
	const maintainerAgeData = $derived(
		buildData(selectedRow, 'Maintaier_Age_u35_In', 'Maintaier_Age_u35_Out')
	);
	const singleHHData = $derived(
		buildData(selectedRow, 'Single_person_hh_In', 'Single_person_hh_Out')
	);
	const uniDegreeData = $derived(buildData(selectedRow, 'Uni_Degree_In', 'Uni_Degree_Out'));
</script>

<main class="p-10 md:p-50">
	<h1 class="infographic-title p-10" style="text-align: center;">
		Who Lives in {selectedRow.Region}'s Transit Station Areas?
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
				<div class="w-60 mb-1">
					<span style="color: var(--brandDarkBlue);">
						<b>of {selectedRow.Region}'s area is made up of Transit Station Areas.</b>
					</span>
				</div>
			</div>

			<div class="w-120 pb-8">
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
			<span class="flex items-center justify-center gap-2">
				<Icon icon="mdi:map" style="color: var(--brandLightBlue)" />
				At a Glance
			</span>
		</div>
		<div class="section-description pb-8">
			Transit Station Areas make up a very small portion of the land area in their regions. However,
			they are extremely efficient when it comes to population and dwelling density.
		</div>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			{#key selectedRegion}
				<StatChart
					title="Population"
					data={popData}
					{selectedRow}
					statLabelInside="people"
					statLabelOutside="people"
					color="#00adf2"
				/><StatChart
					title="Dwellings"
					data={dwellingsData}
					{selectedRow}
					statLabelInside="dwellings"
					statLabelOutside="dwellings"
					color="#00adf2"
				/><StatChart
					title="Employment"
					data={employmentData}
					{selectedRow}
					statLabelInside="jobs"
					statLabelOutside="jobs"
					color="#00adf2"
				/>
			{/key}
		</div>
	</div>

	<div class="infographic-section pb-20">
		<div class="section-title pb-6 text-center">
			<span class="flex items-center justify-center gap-2">
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
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			{#key selectedRegion}
				<StatChart
					title="Apartments"
					data={apartmentData}
					{selectedRow}
					xSuffix="%"
					statLabelInside="of dwellings are apartments"
					statLabelOutside="of dwellings are apartments"
					color="#f45d01"
				/>

				<StatChart
					title="Renters"
					data={renterData}
					{selectedRow}
					xSuffix="%"
					statLabelInside="of residents are renters"
					statLabelOutside="of residents are renters"
					color="#f45d01"
				/>

				<StatChart
					title="Spending >30% of income on shelter"
					data={spendingOver30Data}
					{selectedRow}
					xSuffix="%"
					statLabelInside="spending over 30% of their income on shelter"
					statLabelOutside="spending over 30% of their income on shelter"
					color="#f45d01"
				/>
			{/key}
		</div>
	</div>

	<div class="infographic-section pb-20">
		<div class="section-title pb-6 text-center">
			<span class="flex items-center justify-center gap-2">
				<Icon icon="mdi:map-marker-path" style="color: var(--brandPink)" />
				On the Move
			</span>
		</div>
		<div class="section-description pb-8">
			On average, have a higher percentage of residents who use active and public transportation.
			Residents of Transit Station Areas also spend less on transportation on average compared to
			their region.
		</div>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			{#key selectedRegion}
				<StatChart
					title="Active Transportation"
					data={activeData}
					{selectedRow}
					xSuffix="%"
					statLabelInside="of population use active transportation"
					statLabelOutside="of population use active transportation"
				/>

				<StatChart
					title="Public Transit"
					data={transitData}
					{selectedRow}
					xSuffix="%"
					statLabelInside="of population use public transit"
					statLabelOutside="of population use public transit"
				/>

				<StatChart
					title="Average Transportation Cost"
					data={transportCostData}
					{selectedRow}
					xPrefix="$"
					statLabelInside="spent on transportation on average"
					statLabelOutside="spent on transportation on average"
				/>
			{/key}
		</div>
	</div>

	<div class="infographic-section pb-20">
		<div class="section-title pb-6 text-center">
			<span class="flex items-center justify-center gap-2">
				<Icon icon="mdi:train" style="color: var(--brandPurple)" />
				Transit-Oriented Development For Who?
			</span>
		</div>
		<div class="section-description pb-8">
			So who lives in Transit Station Areas? These communities are usually oriented towards young,
			highly-educated renters.
		</div>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			{#key selectedRegion}
				<StatChart
					title="Maintainer Age"
					data={maintainerAgeData}
					{selectedRow}
					xSuffix="%"
					statLabelInside="of maintainers are under 35"
					statLabelOutside="of maintainers are under 35"
					color="#8a4285"
				/>

				<StatChart
					title="Single Households"
					data={singleHHData}
					{selectedRow}
					xSuffix="%"
					statLabelInside="of households are single-person"
					statLabelOutside="of households are single-person"
					color="#8a4285"
				/>

				<StatChart
					title="University Degree"
					data={uniDegreeData}
					{selectedRow}
					xSuffix="%"
					statLabelInside="of residents hold a university degree"
					statLabelOutside="of residents hold a university degree"
					color="#8a4285"
				/>
			{/key}
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
