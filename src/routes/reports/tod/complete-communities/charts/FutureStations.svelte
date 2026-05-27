<script lang="ts">
	import { onMount } from 'svelte';

	interface RawRegionData {
		region: string;
		Total_Employees_Needed: number;
		Future_Stations: number;
		Core_Employees_per_Station: number;
	}

	interface ProcessedRegionData {
		region: string;
		needed: number;
		stations: number;
		perStation: number;
	}

	let data = $state<RawRegionData[]>([]);

	onMount(async () => {
		let url =
			'https://measuringmainstreets.blob.core.windows.net/public/reports/complete/future_employees_needed_all.json';
		try {
			const response = await fetch(url);

			data = await response.json();
		} catch (error) {
			console.error('Error fetching data:', error instanceof Error ? error.message : error);
		}
	});

	const processedData = $derived<ProcessedRegionData[]>(
		data
			.map((d) => ({
				region: d.region,
				needed: d.Total_Employees_Needed,
				stations: d.Future_Stations,
				perStation: d.Core_Employees_per_Station
			}))
			.sort((a, b) => b.needed - a.needed)
	);
</script>

<div class="w-full">
	<table class="w-full text-sm text-left">
		<thead class="text-zinc-500 border-b bg-zinc-50">
			<tr>
				<th class="py-2 px-2">Region</th>
				<th class="py-2 px-2 text-right">Future Stations</th>
				<th class="py-2 px-2 text-right">Total Employees Needed</th>
				<th class="py-2 px-2 text-right">Core Amenity Employees per Station</th>
			</tr>
		</thead>
		<tbody>
			{#each processedData as row}
				<tr class="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
					<td class="py-2 px-2 font-medium text-left">{row.region}</td>
					<td class="py-2 px-2 text-right">{row.stations}</td>
					<td class="py-2 px-2 text-right">{row.needed.toFixed(0).toLocaleString()}</td>
					<td class="py-2 px-2 text-right">{row.perStation.toFixed(0).toLocaleString()}</td>
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
