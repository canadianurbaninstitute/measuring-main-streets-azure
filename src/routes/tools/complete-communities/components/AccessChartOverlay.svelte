<script lang="ts">
	import { cubicInOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import { trTransit } from '../../../lib/data/transitdata/labels.fr';
	import { formatNumber, getLang } from '../../../lib/i18n';

	const fr = getLang() === 'fr';
	const T = (en: string, frText: string) => (fr ? frText : en);
	const dec1 = (v: number) =>
		fr ? formatNumber(v, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : v.toFixed(1);
	const STATUS_FR: Record<string, string> = { Absent: 'Absente', Present: 'Présente' };

	let {
		legendHeight,
		computedAmenities,
		tier = $bindable('tier1'),
		stationCCcounts,
		sliderValues = $bindable([0]),
		selectedPercentile = $bindable('p50')
	} = $props();

	let isOpen = $state(true);
</script>

<div
	class="w-full z-10 transition-all duration-500 ease-in-out rounded-lg bg-white p-4 flex flex-col border border-zinc-200 overflow-y-auto
    {isOpen ? 'absolute bottom-0 h-full' : 'relative h-28'}"
>
	<div class="mb-4 flex items-center justify-between flex-shrink-0 border-b border-zinc-100 pb-2">
		<h3 class="text-lg font-bold text-zinc-900">{T('Access Analysis', 'Analyse de l’accès')}</h3>
		<button
			onclick={() => (isOpen = !isOpen)}
			class="text-zinc-400 hover:text-zinc-900 text-xl font-bold"
		>
			{isOpen ? '−' : '+'}
		</button>
	</div>

	{#if isOpen}
		<div transition:slide={{ duration: 600, easing: cubicInOut }}>
			<h4 class="my-3">{T('Current Level of Access', 'Niveau d’accès actuel')}</h4>
			<div class="overflow-x-auto">
				<table class="w-full text-sm text-left whitespace-nowrap">
					<thead class="text-zinc-500 border-b bg-zinc-50">
						<tr>
							<th class="py-2 px-2">{T('Amenity', 'Commodité')}</th>
							<th class="py-2 px-2">{T('Status', 'Statut')}</th>
							<th class="py-2 px-2 text-right">{T('Access Score*', 'Score d’accès*')}</th>
							<th class="py-2 px-2 text-right">{T('Regional Score*', 'Score régional*')}</th>
							<th class="py-2 px-2 text-right">{T('Access Gap*', 'Écart d’accès*')}</th>
							<!-- <th class="py-2 px-2">Rank</th> -->
							<th class="py-2 px-2">{T('Classification', 'Classement')}</th>
						</tr>
					</thead>
					<tbody>
						{#each computedAmenities as row}
							<tr class="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
								<td class="py-2 px-2 font-medium">{trTransit(row.Amenity, fr)}</td>
								<td class="py-2 px-2">
									<span
										class={`px-2 py-0.5 rounded-full text-xs font-medium 
                                    ${row.Amenity_Status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
									>
										{fr ? (STATUS_FR[row.Amenity_Status] ?? row.Amenity_Status) : row.Amenity_Status}
									</span>
								</td>
								<td class="py-2 px-2 text-right">{dec1(row.Access_per_1000)}</td>
								<td class="py-2 px-2 text-right text-zinc-500">{dec1(row.MTSA_med)}</td>
								<td class="py-2 px-2 text-right">{dec1(row.Access_Gap)}</td>
								<!-- <td class="py-2 px-2 text-zinc-400">{row.rank}</td> -->
								<td class="py-2 px-2">
									<span
										class={`px-2 py-0.5 rounded-full text-xs text-right font-medium ${
											row.Amenity_Status === 'Absent'
												? 'text-red-600 bg-red-100'
												: row.Access_Gap >= 0
													? 'text-green-600 bg-green-100'
													: row.Access_Gap < 0
														? 'text-orange-600 bg-orange-100'
														: 'text-zinc-700 bg-zinc-100'
										}`}
									>
										{#if row.Amenity_Status === 'Absent'}
											{T('Critical Gap', 'Écart critique')}
										{:else}
											{row.Access_Gap > 0
												? T('Above Average', 'Supérieur à la moyenne')
												: row.Access_Gap === 0
													? T('Average', 'Dans la moyenne')
													: T('Below Average', 'Inférieur à la moyenne')}
										{/if}
									</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<p class="text-zinc-400 mt-2 italic footnote">
				{#if fr}
					* L’indicateur d’accès représente l’accès relatif aux employés de chaque type de commodité
					par tranche de 1 000 visites quotidiennes. Plus le nombre est élevé, plus la ressource est
					accessible.
				{:else}
					* The access metric represents the relative access to employees for each amenity type per
					1000 daily visits. The higher the number, the more accessible the resource is.
				{/if}
			</p>

			<div class="divider"></div>

			<!-- Future Demand Section -->
			<h4 class="font-bold text-md mt-10 mb-2">{T('Future Investment Assessment', 'Évaluation des investissements futurs')}</h4>
			<!-- <div class="flex gap-1 mb-3">
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
			</div> -->
			<div class="overflow-x-auto pb-10">
				<table class="w-full text-sm text-left whitespace-nowrap">
					<thead class="text-zinc-500 border-b bg-zinc-50">
						<tr>
							<th class="py-2 px-2">{T('Amenity', 'Commodité')}</th>
							<th class="py-2 px-2">{T('Priority', 'Priorité')}</th>
							<th class="py-2 px-2 text-right">{#if fr}Nombre <br />actuel{:else}Current <br />Count{/if}</th>
							<!-- <th class="py-2 px-2 text-right">Curr. Demand</th>
                        <th class="py-2 px-2 text-right">Fut. Demand</th> -->
							<th class="py-2 px-2 text-right">{#if fr}Employés <br />additionnels{:else}Additional <br />Employees{/if}</th>
							<th class="py-2 px-2 text-right">{#if fr}Commodités <br /> additionnelles{:else}Additional <br /> Amenities{/if}</th>
							<!-- <th class="py-2 px-2 text-right">Additional <br />Visit Capacity</th> -->
						</tr>
					</thead>
					<tbody>
						{#each computedAmenities as row}
							<tr class="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
								<td class="py-2 px-2 font-medium">{trTransit(row.Amenity, fr)}</td>
								<td class="py-2 px-2">
									<span
										class={`px-2 py-0.5 rounded-full text-xs 
                                    ${
																			row.accessGap < 0
																				? 'bg-red-100 text-red-700'
																				: 'bg-green-100 text-green-700'
																		}`}
									>
										{row.accessGap > 0 ? T('Low', 'Faible') : T('High', 'Élevée')}
									</span>
								</td>
								<td class="py-2 px-2 text-right text-zinc-500"
									>{stationCCcounts[row?.Amenity]?.toFixed(0)}</td
								>
								<td class="py-2 px-2 text-right font-bold text-zinc-800">
									{Math.floor(row.empNeeded_p75) === 0
										? '-'
										: `+${Math.floor(row?.empNeeded_med)}${row?.empNeeded_p75 > row?.empNeeded_med ? `-${Math.floor(row?.empNeeded_p75)}` : ''}`}
								</td>
								<td class="py-2 px-2 text-right font-bold text-zinc-800">
									{Math.floor(row.amenitiesNeeded_p75) === 0
										? '-'
										: `+${Math.floor(row?.amenitiesNeeded_med)}${row?.amenitiesNeeded_p75 > row?.amenitiesNeeded_med ? `-${Math.floor(row?.amenitiesNeeded_p75)}` : ''}`}
								</td>
								<!-- <td class="py-2 px-2 text-right font-bold text-zinc-800">
									+{Math.round(row.Additional_Visits_Supported).toLocaleString()}
								</td> -->
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>

<style>
	.footnote {
		font-size: 0.75rem;
	}

	th {
		white-space: wrap;
	}
</style>
