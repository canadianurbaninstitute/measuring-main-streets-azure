<script lang="ts">
	import Icon from '@iconify/svelte';
	import RangeSlider from 'svelte-range-slider-pips';
	import { Daily_Visits } from '../../../lib/data/transitdata/config.json';

	let { selectedStation, stationVisitorData, stationCCcounts, stationCCpresence } = $props();

	// -- State --
	let sliderValues = $state([0]);
	let futureVisits = $derived(sliderValues[0]);

	// Initialize futureVisits with current visits when station changes
	$effect(() => {
		if (stationVisitorData && stationVisitorData[Daily_Visits.key]) {
			sliderValues = [Math.round(stationVisitorData[Daily_Visits.key])];
		}
	});

	let visitorCount = $derived(
		stationVisitorData ? Math.round(stationVisitorData[Daily_Visits.key] || 0) : 0
	);

	// Helper to safely get presence numbers
	let presenceStats = $derived(stationCCpresence || {});

	// -- Methodology Constants --
	// Using user provided values where available, deriving others or using placeholders
	// The user provided: Grocery (Supermarket) 5.20, Pharmacy 2.67, Restaurant 14.02, Comm Centre 1.5
	// I will match the keys from stationCCcounts to these.
	const MTSA_AVERAGES = {
		Supermarket: 5.2,
		Pharmacy: 2.67,
		Restaurants: 14.02,
		'Community Centres': 1.5,
		Childcare: 3.0, // Placeholder
		Libraries: 0.8, // Placeholder
		'Convenience Store': 4.0,
		'Physicians Office': 6.5,
		'Dentist Office': 6.0,
		'Personal and Commercial Banking': 4.5
	};

	// Tracked Amenities
	const trackedAmenities = [
		'Supermarket',
		'Pharmacy',
		'Restaurants',
		'Community Centres',
		'Childcare',
		'Libraries',
		'Convenience Store',
		'Physicians Office'
	];

	// -- Derived Calculations --

	function getClassification(ratio: number, status: string) {
		if (status === 'Absent') return 'Critical Gap';
		if (ratio < 0.8) return 'Below Avg';
		if (ratio >= 0.8 && ratio <= 1.2) return 'Adequate';
		if (ratio > 1.2) return 'Excellent';
		return 'N/A';
	}

	// Prepare Table 1: Current Level of Access
	let currentAccessData = $derived(
		trackedAmenities.map((key) => {
			// Access IS the value in stationCCcounts (Employees / 1000 Visits)
			const accessStr = stationCCcounts[key];
			const access = typeof accessStr === 'number' ? accessStr : parseFloat(accessStr || '0');
			const status = access > 0 ? 'Present' : 'Absent';
			const mtsaAvg = MTSA_AVERAGES[key] || 1.0;

			let ratio = 0;
			let ratioDisplay = 'N/A';

			if (status === 'Present') {
				ratio = access / mtsaAvg;
				ratioDisplay = ratio.toFixed(2);
			}

			const classification = getClassification(ratio, status);

			// Rank is not per-amenity in the source provided, so I will placeholder or omit "Rank" column if data is missing.
			// The user example shows "518th", "12th". I'll format as N/A if not available.
			const rank = 'N/A'; // Placeholder

			return {
				amenity: key,
				status,
				access,
				mtsaAvg,
				ratio,
				ratioDisplay,
				rank,
				classification
			};
		})
	);

	// Prepare Table 2: Future Demand
	let futureDemandData = $derived(
		currentAccessData.map((item) => {
			const { amenity, status, access, mtsaAvg, classification } = item;

			// Scenario Logic
			// "Catch up" if Below Avg (Current < MTSA)
			// "Maintain" if Adequate or Excellent (Current >= MTSA)
			// "Critical Gap" if Absent

			let scenario = '';
			let desiredAccess = 0;
			let additionalEmployees = 0;

			if (status === 'Absent') {
				scenario = 'Critical Gap'; // Display as "Absent" or specific gap text? User example has "Critical Gap" as scenario in Table 2 for absent
				desiredAccess = mtsaAvg;

				// Formula: MTSA_Avg * (Future / 1000) - 0
				additionalEmployees = mtsaAvg * (futureVisits / 1000);
			} else if (access < mtsaAvg) {
				scenario = 'Catch Up';
				desiredAccess = mtsaAvg;

				// Catch up means we want to reach the MTSA Average for the Future population
				// Total Needed = Desired * (Future / 1000)
				// Existing Capacity (approx) = CurrentAccess * (CurrentVisits / 1000)
				// Gap = Total Needed - Existing Capacity
				// Wait, logic check:
				// User Ex: Grocery (Catch up). Current 3.9, Desired 5.20. Visits 20k -> 25k. Added = 52.
				// My derivation: (5.20 * 25) - (3.9 * 20) = 130 - 78 = 52. Matches.
				const totalNeeded = desiredAccess * (futureVisits / 1000);
				const currentCapacity = access * (visitorCount / 1000);
				additionalEmployees = totalNeeded - currentCapacity;
			} else {
				// Maintain or Excellent
				scenario = 'Maintain';
				desiredAccess = access; // Maintain current standard

				// Formula: CurrentAccess * (Future - Current) / 1000
				// User Ex: Pharmacy (Maintain). 2.8 -> 2.8. 20k->25k. Added 14.
				// Derivation: 2.8 * (25-20) = 2.8 * 5 = 14. Matches.
				const growth = futureVisits - visitorCount;
				additionalEmployees = desiredAccess * (growth / 1000);
			}

			return {
				amenity,
				scenario,
				currentAccess: access,
				desiredAccess,
				currentDemand: visitorCount,
				futureDemand: futureVisits,
				additionalEmployees: Math.max(0, additionalEmployees)
			};
		})
	);
</script>

<div class="access-tab">
	<!-- Table 1: Current Level of Access -->
	<div class="section">
		<h3 class="font-bold text-lg mb-3">Current Level of Access Relative to MTSA Average</h3>
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
			* Access metric represents employees per 1000 daily visits.
		</p>
	</div>

	<div class="divider"></div>

	<!-- Future Demand Section -->
	<div class="section">
		<h3 class="font-bold text-lg mb-2">Future Demand Projection</h3>

		<!-- Slider Control -->
		<div class="mb-6 bg-blue-50 p-4 rounded-md border border-blue-100">
			<label class="text-sm font-semibold mb-2 block flex justify-between">
				<span>Projected Daily Visits</span>
				<span class="text-blue-700 font-bold text-lg">{futureVisits.toLocaleString()}</span>
			</label>
			<div class="px-2 py-2">
				<RangeSlider
					bind:values={sliderValues}
					min={visitorCount}
					max={Math.max(visitorCount * 2, 5000)}
					step={100}
					pips
					first="label"
					last="label"
				/>
			</div>
			<p class="text-xs text-blue-600 mt-1">
				Current Visits: <span class="font-semibold">{visitorCount.toLocaleString()}</span>.
				Projected Increase:
				<span class="font-semibold"
					>+{Math.max(0, futureVisits - visitorCount).toLocaleString()}</span
				> visits.
			</p>
		</div>

		<!-- Table 2: Future Needs -->
		<h4 class="font-bold text-md mb-2">Additional Employees Needed Analysis</h4>
		<div class="overflow-x-auto">
			<table class="w-full text-sm text-left whitespace-nowrap">
				<thead class="text-zinc-500 border-b bg-zinc-50">
					<tr>
						<th class="py-2 px-2">Amenity</th>
						<th class="py-2 px-2">Scenario</th>
						<th class="py-2 px-2 text-right">Curr. Access</th>
						<th class="py-2 px-2 text-right">Desired</th>
						<!-- <th class="py-2 px-2 text-right">Curr. Demand</th>
                        <th class="py-2 px-2 text-right">Fut. Demand</th> -->
						<th class="py-2 px-2 text-right">Add. Emp. Needed</th>
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
							<td class="py-2 px-2 text-right font-medium">{row.desiredAccess.toFixed(2)}</td>
							<!-- <td class="py-2 px-2 text-right text-zinc-400">{row.currentDemand.toLocaleString()}</td>
                            <td class="py-2 px-2 text-right text-zinc-400">{row.futureDemand.toLocaleString()}</td> -->
							<td class="py-2 px-2 text-right font-bold text-zinc-800">
								{Math.round(row.additionalEmployees).toLocaleString()}
								{#if row.additionalEmployees > 0}
									<Icon icon="mdi:user-add" inline class="text-xs text-zinc-400 ml-1" />
								{/if}
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
