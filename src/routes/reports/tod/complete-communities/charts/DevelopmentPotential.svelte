<script lang="ts">
	import { onMount } from 'svelte';
	import { TIER_1_AMENITIES } from '../../../../lib/data/transitdata/complete-communities-config';

	interface RawStationData {
		stop_label: string;
		Amenity: string;
		Amenity_Status: string;
		Access_Gap: number;
		Emp_Low: number;
		Emp_High: number;
		Amenities_Low: number;
		Amenities_High: number;
	}

	interface ProcessedStationData {
		station: string;
		amenity: string;
		status: string;
		gap: number;
		neededLow: number;
		neededHigh: number;
		amenitiesNeededLow: number;
		amenitiesNeededHigh: number;
		color: string;
	}

	interface Props {
		visible?: boolean;
	}

	let { visible = false }: Props = $props();
	let data = $state<RawStationData[]>([]);
	let selectedStation = $state<string | null>(null);

	onMount(async () => {
		let url =
			'https://measuringmainstreets.blob.core.windows.net/public/reports/complete/future_employees_needed_example.json';
		try {
			const response = await fetch(url);

			data = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error instanceof Error ? error.message : error);
		}
	});

	const processedData = $derived<ProcessedStationData[]>(
		data.map((d) => ({
			station: d.stop_label,
			amenity: d.Amenity,
			status: d.Amenity_Status,
			gap: d.Access_Gap,
			neededLow: d.Emp_Low,
			neededHigh: d.Emp_High,
			amenitiesNeededLow: d.Amenities_Low,
			amenitiesNeededHigh: d.Amenities_High,
			color: TIER_1_AMENITIES.find((a) => a.label === d.Amenity)?.color || '#94a3b8'
		}))
	);

	const stations = $derived<string[]>([...new Set(processedData.map((d) => d.station))]);

	$effect(() => {
		if (stations.length > 0 && !selectedStation) {
			selectedStation = stations[0];
		}
	});

	const filteredData = $derived<ProcessedStationData[]>(
		selectedStation ? processedData.filter((d) => d.station === selectedStation) : processedData
	);
</script>

<div class="flex flex-wrap gap-2 mb-4">
	{#each stations as station}
		<button
			class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap {selectedStation ===
			station
				? 'bg-blue-300 text-black'
				: 'bg-zinc-100 text-zinc-600 hover:bg-blue-200'}"
			onclick={() => (selectedStation = station)}
		>
			{station}
		</button>
	{/each}
</div>

<div class="w-full">
	<table class="w-full text-sm text-left">
		<thead class="text-zinc-500 border-b bg-zinc-50">
			<tr>
				<th class="py-2 px-2">Amenity</th>
				<th class="py-2 px-2">Status</th>
				<th class="py-2 px-2 text-right">Access Gap</th>
				<th class="py-2 px-2 text-right"> Employees Needed (Low)</th>
				<th class="py-2 px-2 text-right"> Employees Needed (High)</th>
				<th class="py-2 px-2 text-right"> Amenities Needed (Low)</th>
				<th class="py-2 px-2 text-right"> Amenities Needed (High)</th>
			</tr>
		</thead>
		<tbody>
			{#each filteredData as row}
				<tr
					class="border-b last:border-0 hover:bg-zinc-50"
					style="background-color: color-mix(in srgb, {row.color}, transparent 90%); border-color: {row.color}"
				>
					<td class="py-2 px-2 text-left">{row.amenity}</td>
					<td class="py-2 px-2 text-left">
						<span
							class="px-2 py-0.5 rounded-full text-xs font-medium {row.status === 'Absent'
								? 'bg-red-100 text-red-700'
								: 'bg-green-100 text-green-700'}"
						>
							{row.status}
						</span>
					</td>
					<td class="py-2 px-2 text-right">{row.gap.toFixed(1).toLocaleString()}</td>
					<td class="py-2 px-2 text-right">{row.neededLow.toFixed(0).toLocaleString()}</td>
					<td class="py-2 px-2 text-right">{row.neededHigh.toFixed(0).toLocaleString()}</td>
					<td class="py-2 px-2 text-right">{row.amenitiesNeededLow.toFixed(0).toLocaleString()}</td>
					<td class="py-2 px-2 text-right">{row.amenitiesNeededHigh.toFixed(0).toLocaleString()}</td
					>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	th {
		white-space: wrap;
	}
</style>
