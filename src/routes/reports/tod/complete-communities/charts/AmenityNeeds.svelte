<script lang="ts">
	import { onMount } from 'svelte';
	import { TIER_1_AMENITIES } from '../../../../lib/data/transitdata/complete-communities-config';
	import DotPlot from '../../../../lib/ui/charts/DotPlot.svelte';
	import { getLang } from '../../../../lib/i18n';
	import { AMENITY_LABELS_FR } from './labels.fr';

	const fr = getLang() === 'fr';

	interface RawAmenityData {
		Amenity: string;
		Emp_Low: number;
		Emp_High: number;
	}

	let { visible } = $props<{ visible: boolean }>();
	let data = $state<RawAmenityData[]>([]);

	onMount(async () => {
		let url =
			'https://measuringmainstreets.blob.core.windows.net/public/reports/complete/future_employees_needed_example_amenities.json';
		try {
			const response = await fetch(url);

			data = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error instanceof Error ? error.message : error);
		}
	});

	const processedData = $derived(
		data
			.map((d) => ({
				amenity: fr ? (AMENITY_LABELS_FR[d.Amenity] ?? d.Amenity) : d.Amenity,
				low: d.Emp_Low,
				high: d.Emp_High,
				color: TIER_1_AMENITIES.find((a) => a.label === d.Amenity)?.color || '#94a3b8'
			}))
			.sort((a, b) => b.high - a.high)
	);
</script>

{#if processedData.length > 0}
	<DotPlot
		data={processedData}
		yKey="amenity"
		xKey={['low', 'high']}
		zRange={['#00adf2', '#db3069']}
		padding={{ top: 10, right: 20, bottom: 20, left: 180 }}
		showLegend={true}
		legendLabels={fr
			? ['Estimation basse des emplois', 'Estimation haute des emplois']
			: ['Low Employee Estimate', 'High Employee Estimate']}
	/>
{/if}

<style>
</style>
