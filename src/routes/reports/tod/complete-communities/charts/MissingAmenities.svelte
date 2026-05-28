<script lang="ts">
	import { onMount } from 'svelte';
	import StackedBar from '../../../../lib/ui/charts/StackedBar.svelte';

	interface RawAmenityStatus {
		Amenity: string;
		Amenity_Status: 'Absent' | 'Present';
		Percentage: number;
		[key: string]: any;
	}

	interface ProcessedAmenityData {
		Amenity: string;
		Absent: number;
		Present: number;
	}

	interface Props {
		visible?: boolean;
	}

	let { visible = false }: Props = $props();
	let data = $state<RawAmenityStatus[]>([]);

	onMount(async () => {
		let url =
			'https://measuringmainstreets.blob.core.windows.net/public/reports/complete/missing_amenities_core.json';
		try {
			const response = await fetch(url);

			data = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error instanceof Error ? error.message : error);
		}
	});

	const processedData = $derived.by<ProcessedAmenityData[]>(() => {
		const amenities = [...new Set(data.map((d) => d.Amenity))];
		return amenities
			.map((amenity) => {
				const rows = data.filter((d) => d.Amenity === amenity);
				const absent = rows.find((r) => r.Amenity_Status === 'Absent')?.Percentage || 0;
				const present = rows.find((r) => r.Amenity_Status === 'Present')?.Percentage || 0;
				return {
					Amenity: amenity,
					Absent: absent,
					Present: present
				};
			})
			.sort((a, b) => b.Absent - a.Absent);
	});

	const seriesConfig = [
		{ key: 'Absent', label: 'Absent in TSA', color: '#00adf2' },
		{ key: 'Present', label: 'Present in TSA', color: '#f45d01' }
	];
</script>

<StackedBar
	data={processedData}
	{seriesConfig}
	yKey="Amenity"
	minHeight="300px"
	{visible}
	xTicks={6}
	xLabel="Percent"
	wrapLabels={true}
	showTooltip={true}
	formatLabelX={(d) => `${d}%`}
	padding={{ top: 10, right: 30, bottom: 30, left: 70 }}
/>
