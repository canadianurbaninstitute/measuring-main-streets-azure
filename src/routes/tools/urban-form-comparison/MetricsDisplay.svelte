<script lang="ts">
	import { formatNumber, getLang } from '../../lib/i18n';

	interface StationData {
		stop_label: string;
		line_display_name: string;
		region: string;
		status: string;
	}

	interface StationMetrics {
		greenspace_pct?: number;
		water_pct?: number;
		building_pct?: number;
		parking_pct?: number;
	}

	interface Props {
		station1Data: StationData | null | undefined;
		station2Data: StationData | null | undefined;
		station1Metrics: StationMetrics | null | undefined;
		station2Metrics: StationMetrics | null | undefined;
	}

	let { station1Data, station2Data, station1Metrics, station2Metrics }: Props = $props();

	const fr = getLang() === 'fr';

	const metricRows: { key: keyof StationMetrics; label: string }[] = [
		{ key: 'greenspace_pct', label: fr ? 'Espaces verts' : 'Greenspace' },
		{ key: 'water_pct', label: fr ? 'Eau' : 'Water' },
		{ key: 'building_pct', label: fr ? 'Bâtiments' : 'Buildings' },
		{ key: 'parking_pct', label: fr ? 'Stationnement' : 'Parking' }
	];

	// Station statuses are data values; translate at display time only
	const STATUS_FR: Record<string, string> = {
		Operational: 'En service',
		Planned: 'Planifiée',
		Construction: 'En construction'
	};
	const statusLabel = (status: string) => (fr ? (STATUS_FR[status] ?? status) : status);

	function pct(value: number | undefined) {
		if (value === undefined) return fr ? 'N/D' : 'N/A';
		return fr
			? formatNumber(value, { minimumFractionDigits: 1, maximumFractionDigits: 1 }, 'fr') + '\u00a0%'
			: `${value.toFixed(1)}%`;
	}
</script>

{#if station1Data && station2Data && station1Metrics && station2Metrics}
	<table class="table-fixed w-full border-l border-r border-gray-200">
		<thead class="text-sm sm:text-base text-gray-700 uppercase border-t border-gray-200">
			<tr>
				<th class="w-2/5 px-2 sm:px-4 md:px-6 pt-2 bg-gray-50 break-words"
					>{station1Data.stop_label}</th
				>
				<th class="w-1/5 px-1 sm:px-2 md:px-6 pt-2"></th>
				<th class="w-2/5 px-2 sm:px-4 md:px-6 pt-2 bg-gray-50 break-words"
					>{station2Data.stop_label}</th
				>
			</tr>
		</thead>
		<tbody>
			<tr class="text-xs text-gray-700 text-center">
				<td class="px-2 sm:px-4 md:px-6 bg-gray-50 break-words">{station1Data.line_display_name}</td
				>
				<td></td>
				<td class="px-2 sm:px-4 md:px-6 bg-gray-50 break-words">{station2Data.line_display_name}</td
				>
			</tr>
			<tr class="text-xs text-gray-700 text-center">
				<td class="pb-1 bg-gray-50 break-words">{station1Data.region}</td>
				<td></td>
				<td class="pb-1 bg-gray-50 break-words">{station2Data.region}</td>
			</tr>
			<tr class="text-xs text-gray-700 text-center border-b border-gray-200">
				<td class="pb-1 bg-gray-50 break-words">{statusLabel(station1Data.status)}</td>
				<td></td>
				<td class="pb-1 bg-gray-50 break-words">{statusLabel(station2Data.status)}</td>
			</tr>
			{#each metricRows as row}
				<tr class="text-xs sm:text-sm border-b border-gray-200">
					<td class="py-1 text-center bg-gray-50">{pct(station1Metrics[row.key])}</td>
					<td class="py-1 text-center px-1">{row.label}</td>
					<td class="py-1 text-center bg-gray-50">{pct(station2Metrics[row.key])}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
