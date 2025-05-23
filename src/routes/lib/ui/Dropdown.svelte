<script>
	import { onDestroy } from 'svelte';
	import Legend from './legends/Legend.svelte';
	import { mapStoreList } from '../mapStore'; // Import the mapStore

	export let options = [];
	export let casestudy;
	export let section;
	export let region;

	let map = null; // Initialize map as null

	// Subscribe to the map store and update the local `map` variable
	const unsubscribe = mapStoreList.subscribe((maps) => {
		if (section && maps[section]) {
			map = maps[section];
		}
	});

	// Unsubscribe when the component is destroyed to prevent memory leaks
	onDestroy(unsubscribe);

	const gradient =
		'linear-gradient(to right, #ebf9ff, #cceffe, #99dffc, #67cefb, #34bef9, #01aef8, #018bc6, #016895, #004663, #002332, #001d29)';

	let selected;

	function toggleCensusLayer() {
		map.setPaintProperty(`${casestudy}-outline`, 'line-color', '#ffdd33');
		options.forEach((option) => {
			let id = option.id;
			if (id === selected.id) {
				map.setLayoutProperty(id, 'visibility', 'visible');
			} else {
				map.setLayoutProperty(id, 'visibility', 'none');
			}
		});
	}
</script>

<!-- <small><i>Change Map Layer</i></small> -->
<select bind:value={selected} on:change={toggleCensusLayer}>
	{#each options as option}
		<option value={option}>
			{option.text}
		</option>
	{/each}
</select>

{#if region && region === 'toronto'}
	{#if selected && selected.id === 'average-age'}
		<Legend minlabel={'29'} maxlabel={'89'} label={'Average Age'} />
	{/if}

	{#if selected && selected.id === 'household-size'}
		<Legend minlabel={'1'} maxlabel={'8'} label={'Household Size'} />
	{/if}

	{#if selected && selected.id === 'average-income'}
		<Legend
			maxlabel={'$880,000'}
			minlabel={'$20,000'}
			label={'Average Employment Income (Census 2021)'}
		/>
	{/if}

	{#if selected && selected.id === 'visibleminority'}
		<Legend maxlabel={'100%'} label={'% Visible Minority Population'} />
	{/if}

	{#if selected && selected.id === 'immigrants'}
		<Legend maxlabel={'100%'} label={'% Immigrants and Non-Permanent Residents'} />
	{/if}

	{#if selected && selected.id === 'indigenous'}
		<Legend maxlabel={'79%'} label={'% Indigenous Population'} />
	{/if}

	{#if selected && selected.id === 'french-speakers'}
		<Legend maxlabel={'14.7%'} label={'% of French Speakers'} />
	{/if}

	{#if selected && selected.id === 'english-speakers'}
		<Legend maxlabel={'100%'} label={'% of English Speakers'} />
	{/if}

	{#if selected && selected.id === 'education-bachelors'}
		<Legend maxlabel={'100%'} label={'% of Bachelors Degree Holders'} />
	{/if}

	<!-- Housing -->

	{#if selected && selected.id === 'populationdensity'}
		<Legend maxlabel={'4,070,000'} label={'Population Density (people/sq.km)'} />
	{/if}

	{#if selected && selected.id === 'dwellings'}
		<Legend minlabel={'18'} maxlabel={'8149'} label={'# of Dwellings'} />
	{/if}

	{#if selected && selected.id === 'duplex'}
		<Legend maxlabel={'70%'} label={'% Duplex'} />
	{/if}

	{#if selected && selected.id === 'semi-detached'}
		<Legend maxlabel={'100%'} label={'% Semi-Detached'} />
	{/if}

	{#if selected && selected.id === 'single-detached'}
		<Legend maxlabel={'100%'} label={'% Single-Detached'} />
	{/if}

	{#if selected && selected.id === 'apartment-more-5-stories'}
		<Legend maxlabel={'100%'} label={'% Apartments (more than 5 stories)'} />
	{/if}

	{#if selected && selected.id === 'apartment-less-5-stories'}
		<Legend maxlabel={'100%'} label={'% Apartments (less than 5 stories)'} />
	{/if}
{/if}

{#if region && region === 'montreal'}
	{#if selected && selected.id === 'average-age'}
		<Legend minlabel={'38'} maxlabel={'79.8'} label={'Average Age'} />
	{/if}

	{#if selected && selected.id === 'household-size'}
		<Legend minlabel={'1'} maxlabel={'8'} label={'Household Size'} />
	{/if}

	{#if selected && selected.id === 'average-income'}
		<Legend
			maxlabel={'$171,000'}
			minlabel={'$22,400'}
			label={'Average Employment Income (Census 2021)'}
		/>
	{/if}

	{#if selected && selected.id === 'visibleminority'}
		<Legend maxlabel={'100%'} label={'% Visible Minority Population'} />
	{/if}

	{#if selected && selected.id === 'immigrants'}
		<Legend maxlabel={'100%'} label={'% Immigrants and Non-Permanent Residents'} />
	{/if}

	{#if selected && selected.id === 'indigenous'}
		<Legend maxlabel={'79%'} label={'% Indigenous Population'} />
	{/if}

	{#if selected && selected.id === 'french-speakers'}
		<Legend maxlabel={'100%'} label={'% of French Speakers'} />
	{/if}

	{#if selected && selected.id === 'english-speakers'}
		<Legend maxlabel={'100%'} label={'% of English Speakers'} />
	{/if}

	{#if selected && selected.id === 'education-bachelors'}
		<Legend maxlabel={'100%'} label={'% of Bachelors Degree Holders'} />
	{/if}

	<!-- Housing -->

	{#if selected && selected.id === 'populationdensity'}
		<Legend maxlabel={'159,762'} label={'Population Density (people/sq.km)'} />
	{/if}

	{#if selected && selected.id === 'dwellings'}
		<Legend minlabel={'0'} maxlabel={'4770'} label={'# of Dwellings'} />
	{/if}

	{#if selected && selected.id === 'duplex'}
		<Legend maxlabel={'100%'} label={'% Duplex'} />
	{/if}

	{#if selected && selected.id === 'semi-detached'}
		<Legend maxlabel={'100%'} label={'% Semi-Detached'} />
	{/if}

	{#if selected && selected.id === 'single-detached'}
		<Legend maxlabel={'100%'} label={'% Single-Detached'} />
	{/if}

	{#if selected && selected.id === 'apartment-more-5-stories'}
		<Legend maxlabel={'100%'} label={'% Apartments (more than 5 stories)'} />
	{/if}

	{#if selected && selected.id === 'apartment-less-5-stories'}
		<Legend maxlabel={'100%'} label={'% Apartments (less than 5 stories)'} />
	{/if}
{/if}

{#if region && region === 'montreal-fr'}
	{#if selected && selected.id === 'average-age'}
		<Legend minlabel={'38'} maxlabel={'79.8'} label={'Âge moyen'} />
	{/if}

	{#if selected && selected.id === 'household-size'}
		<Legend minlabel={'1'} maxlabel={'8'} label={'Taille des ménages'} />
	{/if}

	{#if selected && selected.id === 'average-income'}
		<Legend
			maxlabel={'$171,000'}
			minlabel={'$22,400'}
			label={'Revenu moyen (Census 2021)'}
		/>
	{/if}

	{#if selected && selected.id === 'visibleminority'}
		<Legend maxlabel={'100%'} label={'% Minorités visibles'} />
	{/if}

	{#if selected && selected.id === 'immigrants'}
		<Legend maxlabel={'100%'} label={'% Immigrants récents'} />
	{/if}

	{#if selected && selected.id === 'indigenous'}
		<Legend maxlabel={'79%'} label={'% Population autochtone'} />
	{/if}

	{#if selected && selected.id === 'french-speakers'}
		<Legend maxlabel={'100%'} label={'% Personne de langue française'} />
	{/if}

	{#if selected && selected.id === 'english-speakers'}
		<Legend maxlabel={'100%'} label={'% Personne de langue anglaise'} />
	{/if}

	{#if selected && selected.id === 'education-bachelors'}
		<Legend maxlabel={'100%'} label={'% Titulaires d’un baccalauréat'} />
	{/if}

	<!-- Housing -->

	{#if selected && selected.id === 'populationdensity'}
		<Legend maxlabel={'159,762'} label={'Densité de la population (personnes/sq.km)'} />
	{/if}

	{#if selected && selected.id === 'dwellings'}
		<Legend minlabel={'0'} maxlabel={'4770'} label={'Logements'} />
	{/if}

	{#if selected && selected.id === 'duplex'}
		<Legend maxlabel={'100%'} label={'% Duplex'} />
	{/if}

	{#if selected && selected.id === 'semi-detached'}
		<Legend maxlabel={'100%'} label={'% Logements jumelés'} />
	{/if}

	{#if selected && selected.id === 'single-detached'}
		<Legend maxlabel={'100%'} label={'% Logements individuels non attenants'} />
	{/if}

	{#if selected && selected.id === 'apartment-more-5-stories'}
		<Legend maxlabel={'100%'} label={'% Tours d’habitation'} />
	{/if}

	{#if selected && selected.id === 'apartment-less-5-stories'}
		<Legend maxlabel={'100%'} label={'% Immeubles à hauteur restreinte'} />
	{/if}
{/if}



{#if region && region === 'edmonton'}
	{#if selected && selected.id === 'average-age'}
		<Legend minlabel={'36'} maxlabel={'76.1'} label={'Average Age'} />
	{/if}

	{#if selected && selected.id === 'household-size'}
		<Legend minlabel={'1'} maxlabel={'8'} label={'Household Size'} />
	{/if}

	{#if selected && selected.id === 'average-income'}
		<Legend
			maxlabel={'$750,000'}
			minlabel={'$36,000'}
			label={'Average Employment Income (Census 2021)'}
		/>
	{/if}

	{#if selected && selected.id === 'visibleminority'}
		<Legend maxlabel={'100%'} label={'% Visible Minority Population'} />
	{/if}

	{#if selected && selected.id === 'immigrants'}
		<Legend maxlabel={'100%'} label={'% Immigrants and Non-Permanent Residents'} />
	{/if}

	{#if selected && selected.id === 'indigenous'}
		<Legend maxlabel={'97.6%'} label={'% Indigenous Population'} />
	{/if}

	{#if selected && selected.id === 'french-speakers'}
		<Legend maxlabel={'46.9%'} label={'% of French Speakers'} />
	{/if}

	{#if selected && selected.id === 'english-speakers'}
		<Legend maxlabel={'100%'} label={'% of English Speakers'} />
	{/if}

	{#if selected && selected.id === 'education-bachelors'}
		<Legend maxlabel={'100%'} label={'% of Bachelors Degree Holders'} />
	{/if}

	<!-- Housing -->

	{#if selected && selected.id === 'populationdensity'}
		<Legend maxlabel={'50,529'} label={'Population Density (people/sq.km)'} />
	{/if}

	{#if selected && selected.id === 'dwellings'}
		<Legend minlabel={'0'} maxlabel={'3778'} label={'# of Dwellings'} />
	{/if}

	{#if selected && selected.id === 'duplex'}
		<Legend maxlabel={'100%'} label={'% Duplex'} />
	{/if}

	{#if selected && selected.id === 'semi-detached'}
		<Legend maxlabel={'100%'} label={'% Semi-Detached'} />
	{/if}

	{#if selected && selected.id === 'single-detached'}
		<Legend maxlabel={'100%'} label={'% Single-Detached'} />
	{/if}

	{#if selected && selected.id === 'apartment-more-5-stories'}
		<Legend maxlabel={'100%'} label={'% Apartments (more than 5 stories)'} />
	{/if}

	{#if selected && selected.id === 'apartment-less-5-stories'}
		<Legend maxlabel={'100%'} label={'% Apartments (less than 5 stories)'} />
	{/if}
{/if}

<style>
	select {
		width: 100%;
		height: 2em;
		padding-right: 30px;
		margin-top: 0.4em;
		margin-bottom: 0.4em;
		border: 1px solid rgba(27, 31, 35, 0.3);
		background-color: rgb(250, 251, 252);
		border-radius: 0.5em;
		box-shadow: rgba(27, 31, 35, 0.04) 0px 1px 0px 0px,
			rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset;
	}

	option {
		width: 100%;
	}
</style>
