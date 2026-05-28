<script lang="ts">
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
				<td class="pb-1 bg-gray-50 break-words">{station1Data.status}</td>
				<td></td>
				<td class="pb-1 bg-gray-50 break-words">{station2Data.status}</td>
			</tr>
			<tr class="text-xs sm:text-sm border-b border-gray-200">
				<td class="py-1 text-center bg-gray-50">
					{#if station1Metrics.greenspace_pct === undefined}
						N/A
					{:else}
						{station1Metrics.greenspace_pct.toFixed(1)}%
					{/if}
				</td>
				<td class="py-1 text-center px-1">Greenspace</td>
				<td class="py-1 text-center bg-gray-50">
					{#if station2Metrics.greenspace_pct === undefined}
						N/A
					{:else}
						{station2Metrics.greenspace_pct.toFixed(1)}%
					{/if}
				</td>
			</tr>
			<tr class="text-xs sm:text-sm border-b border-gray-200">
				<td class="py-1 text-center bg-gray-50">
					{#if station1Metrics.water_pct === undefined}
						N/A
					{:else}
						{station1Metrics.water_pct.toFixed(1)}%
					{/if}
				</td>
				<td class="py-1 text-center px-1">Water</td>
				<td class="py-1 text-center bg-gray-50">
					{#if station2Metrics.water_pct === undefined}
						N/A
					{:else}
						{station2Metrics.water_pct.toFixed(1)}%
					{/if}
				</td>
			</tr>
			<tr class="text-xs sm:text-sm border-b border-gray-200">
				<td class="py-1 text-center bg-gray-50">
					{#if station1Metrics.building_pct === undefined}
						N/A
					{:else}
						{station1Metrics.building_pct.toFixed(1)}%
					{/if}
				</td>
				<td class="py-1 text-center px-1">Buildings</td>
				<td class="py-1 text-center bg-gray-50">
					{#if station2Metrics.building_pct === undefined}
						N/A
					{:else}
						{station2Metrics.building_pct.toFixed(1)}%
					{/if}
				</td>
			</tr>
			<tr class="text-xs sm:text-sm border-b border-gray-200">
				<td class="py-1 text-center bg-gray-50">
					{#if station1Metrics.parking_pct === undefined}
						N/A
					{:else}
						{station1Metrics.parking_pct.toFixed(1)}%
					{/if}
				</td>
				<td class="py-1 text-center px-1">Parking</td>
				<td class="py-1 text-center bg-gray-50">
					{#if station2Metrics.parking_pct === undefined}
						N/A
					{:else}
						{station2Metrics.parking_pct.toFixed(1)}%
					{/if}
				</td>
			</tr>
		</tbody>
	</table>
{/if}
