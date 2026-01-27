<script lang="ts">
	import { Daily_Visits } from '../../../lib/data/transitdata/config.json';

	let {
		selectedStation,
		visitorCount,
		futureDemandData,
		currentAccessData,
		stationVisitorData,
		stationCCcounts,
		stationCCpresence,
		tier = $bindable('tier1'),
		sliderValues = $bindable([0])
	} = $props();

	// -- State --
	let futureVisits = $derived(sliderValues[0]);

	// Initialize futureVisits with current visits when station changes
	$effect(() => {
		if (stationVisitorData && stationVisitorData[Daily_Visits.key]) {
			sliderValues = [Math.round(stationVisitorData[Daily_Visits.key])];
		}
	});

	// -- Derived Calculations --

	function getClassification(ratio: number, status: string) {
		if (status === 'Absent') return 'Critical Gap';
		if (ratio < 0.8) return 'Below Avg';
		if (ratio >= 0.8 && ratio <= 1.2) return 'Adequate';
		if (ratio > 1.2) return 'Excellent';
		return 'N/A';
	}
</script>

<div class="access-tab mb-4">
	<!-- Table 1: Current Level of Access -->
	<div class="section">
		<h4 class="my-3">Current Level of Access</h4>
		<div class="overflow-x-auto">
			<table class="w-full text-sm text-left whitespace-nowrap">
				<thead class="text-zinc-500 border-b bg-zinc-50">
					<tr>
						<th class="py-2 px-2">Amenity</th>
						<th class="py-2 px-2">Status</th>
						<th class="py-2 px-2 text-right">Access</th>
						<th class="py-2 px-2 text-right">MTSA Avg</th>
						<th class="py-2 px-2 text-right">Ratio</th>
						<!-- <th class="py-2 px-2">Rank</th> -->
						<th class="py-2 px-2">Classification</th>
					</tr>
				</thead>
				<tbody>
					{#each currentAccessData as row}
						<tr class="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
							<td class="py-2 px-2 font-medium">{row.amenity}</td>
							<td class="py-2 px-2">
								<span
									class={`px-2 py-0.5 rounded-full text-xs font-medium 
                                    ${row.status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
								>
									{row.status}
								</span>
							</td>
							<td class="py-2 px-2 text-right">{row.access.toFixed(1)}</td>
							<td class="py-2 px-2 text-right text-zinc-500">{row.mtsaAvg.toFixed(2)}</td>
							<td class="py-2 px-2 text-right">{row.ratioDisplay}</td>
							<!-- <td class="py-2 px-2 text-zinc-400">{row.rank}</td> -->
							<td class="py-2 px-2">
								<span
									class={`font-medium ${
										row.classification === 'Critical Gap'
											? 'text-red-600'
											: row.classification === 'Excellent'
												? 'text-green-600'
												: row.classification === 'Below Avg'
													? 'text-orange-600'
													: 'text-zinc-700'
									}`}
								>
									{row.classification}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<p class="text-xs text-zinc-400 mt-2 italic">
			* Access metric represents number of amenities per 100,000 daily visits. MTSA average is based
			on placeholder values.
		</p>
	</div>

	<div class="divider"></div>

	<!-- Future Demand Section -->
	<div class="section">
		<h4 class="font-bold text-md mb-2">Additional Amenities Needed</h4>
		<div class="overflow-x-auto">
			<table class="w-full text-sm text-left whitespace-nowrap">
				<thead class="text-zinc-500 border-b bg-zinc-50">
					<tr>
						<th class="py-2 px-2">Amenity</th>
						<th class="py-2 px-2">Scenario</th>
						<th class="py-2 px-2 text-right">Curr. Access</th>
						<th class="py-2 px-2 text-right">Curr. Count</th>
						<th class="py-2 px-2 text-right">Desired</th>
						<!-- <th class="py-2 px-2 text-right">Curr. Demand</th>
                        <th class="py-2 px-2 text-right">Fut. Demand</th> -->
						<th class="py-2 px-2 text-right">Additional</th>
					</tr>
				</thead>
				<tbody>
					{#each futureDemandData as row}
						<tr class="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
							<td class="py-2 px-2 font-medium">{row.amenity}</td>
							<td class="py-2 px-2">
								<span
									class={`px-2 py-0.5 rounded-full text-xs 
                                    ${
																			row.scenario === 'Critical Gap'
																				? 'bg-red-100 text-red-700'
																				: row.scenario === 'Catch Up'
																					? 'bg-orange-100 text-orange-700'
																					: 'bg-blue-100 text-blue-700'
																		}`}
								>
									{row.scenario}
								</span>
							</td>
							<td class="py-2 px-2 text-right text-zinc-500">{row.currentAccess.toFixed(1)}</td>
							<td class="py-2 px-2 text-right text-zinc-500"
								>{stationCCcounts[row.amenity].toFixed(1)}</td
							>
							<td class="py-2 px-2 text-right font-medium">{row.desiredAccess.toFixed(2)}</td>
							<!-- <td class="py-2 px-2 text-right text-zinc-400">{row.currentDemand.toLocaleString()}</td>
                            <td class="py-2 px-2 text-right text-zinc-400">{row.futureDemand.toLocaleString()}</td> -->
							<td class="py-2 px-2 text-right font-bold text-zinc-800">
								+{Math.round(row.additionalResources).toLocaleString()}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<style>
	.access-tab {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.divider {
		height: 1px;
		background-color: #eee;
		width: 100%;
	}
	.section {
		width: 100%;
	}
</style>
