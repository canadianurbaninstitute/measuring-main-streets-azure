<script lang="ts">
	import { cubicInOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	let {
		currentAccessData,
		p50,
		p75,
		p90,
		tier = $bindable('tier1'),
		futureDemandData,
		stationCCcounts,
		sliderValues = $bindable([0]),
		selectedPercentile = $bindable('p50')
	} = $props();

	let isOpen = $state(false);

	let accessTableData = $derived(p50.filter((row) => row.Tier === (tier === 'tier1' ? 1 : 2)));

	let baseData = $derived(
		selectedPercentile === 'p75' ? p75 : selectedPercentile === 'p90' ? p90 : p50
	);

	let demandTableData = $derived(baseData.filter((row) => row.Tier === (tier === 'tier1' ? 1 : 2)));
</script>

<div
	class="absolute w-full z-10 bottom-0 transition-all duration-500 ease-in-out rounded-lg bg-white p-4 flex flex-col border border-zinc-200 overflow-y-auto"
	class:h-full={isOpen}
	class:h-50={!isOpen}
>
	<div class="mb-4 flex items-center justify-between flex-shrink-0 border-b border-zinc-100 pb-2">
		<h3 class="text-lg font-bold text-zinc-900">Access Analysis</h3>
		<button
			onclick={() => (isOpen = !isOpen)}
			class="text-zinc-400 hover:text-zinc-900 text-xl font-bold"
		>
			{isOpen ? '−' : '+'}
		</button>
	</div>

	{#if isOpen}
		<div transition:slide={{ duration: 600, easing: cubicInOut }} class="space-y-4 pb-30">
			<h4 class="my-3">Current Level of Access</h4>
			<div class="overflow-x-auto">
				<table class="w-full text-sm text-left whitespace-nowrap">
					<thead class="text-zinc-500 border-b bg-zinc-50">
						<tr>
							<th class="py-2 px-2">Amenity</th>
							<th class="py-2 px-2">Status</th>
							<th class="py-2 px-2 text-right">Access</th>
							<th class="py-2 px-2 text-right">MTSA Median</th>
							<th class="py-2 px-2 text-right">Access Gap</th>
							<!-- <th class="py-2 px-2">Rank</th> -->
							<th class="py-2 px-2">Classification</th>
						</tr>
					</thead>
					<tbody>
						{#each accessTableData as row}
							<tr class="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
								<td class="py-2 px-2 font-medium">{row.Amenity}</td>
								<td class="py-2 px-2">
									<span
										class={`px-2 py-0.5 rounded-full text-xs font-medium 
                                    ${row.Amenity_Status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
									>
										{row.Amenity_Status}
									</span>
								</td>
								<td class="py-2 px-2 text-right">{row.Access_per_1000.toFixed(1)}</td>
								<td class="py-2 px-2 text-right text-zinc-500">{row.MTSA_med.toFixed(1)}</td>
								<td class="py-2 px-2 text-right">{row.Access_Gap.toFixed(1)}</td>
								<!-- <td class="py-2 px-2 text-zinc-400">{row.rank}</td> -->
								<td class="py-2 px-2">
									<span
										class={`px-2 py-0.5 rounded-full text-xs text-right font-medium ${
											row.Amenity_Status === 'Absent'
												? 'text-red-600 bg-red-100'
												: row.Access_Gap > 0
													? 'text-green-600 bg-green-100'
													: row.Access_Gap < 0
														? 'text-orange-600 bg-orange-100'
														: 'text-zinc-700 bg-zinc-100'
										}`}
									>
										{#if row.Amenity_Status === 'Absent'}
											{'Critical Gap'}
										{:else}
											{row.Access_Gap > 0 ? 'Above Average' : 'Below Average'}
										{/if}
									</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<p class="text-xs text-zinc-400 mt-2 italic">
				* Access metric represents number of amenities per 1000 daily visits.
			</p>

			<div class="divider"></div>

			<!-- Future Demand Section -->
			<h4 class="font-bold text-md mt-10 mb-2">Additional Amenities Needed</h4>
			<div class="flex gap-1 mb-3">
				{#each [['p50', '50th'], ['p75', '75th'], ['p90', '90th']] as [value, label]}
					<button
						onclick={() => (selectedPercentile = value)}
						class={`px-3 py-1 rounded-full text-xs font-medium border transition-colors
										${
											selectedPercentile === value
												? 'bg-blue-500 text-white border-blue-500'
												: 'bg-white text-zinc-600 border-zinc-300 hover:border-zinc-400'
										}`}
					>
						{label} Percentile
					</button>
				{/each}
			</div>
			<div class="overflow-x-auto">
				<table class="w-full text-sm text-left whitespace-nowrap">
					<thead class="text-zinc-500 border-b bg-zinc-50">
						<tr>
							<th class="py-2 px-2">Amenity</th>
							<th class="py-2 px-2">Scenario</th>
							<th class="py-2 px-2 text-right">Current <br />Count</th>
							<!-- <th class="py-2 px-2 text-right">Curr. Demand</th>
                        <th class="py-2 px-2 text-right">Fut. Demand</th> -->
							<th class="py-2 px-2 text-right">Additional <br /> Amenities</th>
							<th class="py-2 px-2 text-right">Additional <br />Employees</th>
							<th class="py-2 px-2 text-right">Additional <br />Visit Capacity</th>
						</tr>
					</thead>
					<tbody>
						{#each demandTableData as row}
							<tr class="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
								<td class="py-2 px-2 font-medium">{row.Amenity}</td>
								<td class="py-2 px-2">
									<span
										class={`px-2 py-0.5 rounded-full text-xs 
                                    ${
																			row.Access_Gap < 0
																				? 'bg-red-100 text-red-700'
																				: 'bg-green-100 text-green-700'
																		}`}
									>
										{row.Access_Gap > 0 ? 'Maintain' : 'Catch Up'}
									</span>
								</td>
								<td class="py-2 px-2 text-right text-zinc-500"
									>{stationCCcounts[row.Amenity].toFixed(0)}</td
								>
								<td class="py-2 px-2 text-right font-bold text-zinc-800">
									+{Math.round(row.Amenities_Required).toLocaleString()}
								</td>
								<td class="py-2 px-2 text-right font-bold text-zinc-800">
									+{Math.round(row.Employees_Required).toLocaleString()}
								</td>
								<td class="py-2 px-2 text-right font-bold text-zinc-800">
									+{Math.round(row.Additional_Visits_Supported).toLocaleString()}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>

<style>
</style>
