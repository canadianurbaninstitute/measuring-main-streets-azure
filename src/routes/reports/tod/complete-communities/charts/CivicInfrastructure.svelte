<script lang="ts">
	import { onMount } from 'svelte';
	import GroupedBarChart from '../../../../lib/ui/charts/GroupedBarChart.svelte';
	import { formatNumber, getLang } from '../../../../lib/i18n';
	import { REGION_LABELS_FR, STATUS_LABELS_FR, trFr } from './labels.fr';

	const fr = getLang() === 'fr';
	const fmtFr = (d: number) => formatNumber(+d, { maximumFractionDigits: 0 }, 'fr');

	interface RawDataItem {
		lib_cc_status: string;
		region: string;
		TSA_pop: number;
		[key: string]: any;
	}

	interface ProcessedDataItem {
		status: string;
		[region: string]: string | number;
	}

	interface Props {
		visible?: boolean;
	}

	let { visible = false }: Props = $props();
	let data = $state<RawDataItem[]>([]);

	onMount(async () => {
		let url =
			'https://measuringmainstreets.blob.core.windows.net/public/reports/complete/Library_CC_status_by_Population.json';
		try {
			const response = await fetch(url);

			data = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error instanceof Error ? error.message : error);
		}
	});

	const processedData = $derived.by<ProcessedDataItem[]>(() => {
		const statuses = ['Neither', 'One', 'Both'];
		return statuses.map((status) => {
			const rows = data.filter((d) => d.lib_cc_status === status);
			const row: ProcessedDataItem = { status: trFr(STATUS_LABELS_FR, status, fr) };
			rows.forEach((r) => {
				row[r.region] = r.TSA_pop;
			});
			return row;
		});
	});

	const colors = ['#002940', '#2a5cac', '#43b171', '#f13737', '#f45d01', '#8a4285'];
	const regions = $derived<string[]>([...new Set(data.map((d) => d.region))]);

	const seriesConfig = $derived(
		regions.map((region, i) => ({
			key: region,
			label: trFr(REGION_LABELS_FR, region, fr),
			color: colors[i % colors.length]
		}))
	);
</script>

<GroupedBarChart
	data={processedData}
	{seriesConfig}
	yKey="status"
	minHeight="500px"
	{visible}
	xTicks={6}
	xLabel={fr ? 'Population moyenne' : 'Average Population'}
	wrapLabels={true}
	formatLabelX={(d) => (fr ? fmtFr(d) : d.toFixed(0))}
	padding={{ top: 10, right: 30, bottom: 40, left: 40 }}
	formatTooltipValue={(d) => (isNaN(+d) ? d : fr ? fmtFr(d) : d.toFixed(0).toLocaleString())}
/>
