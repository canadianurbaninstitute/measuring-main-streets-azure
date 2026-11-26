<!-- UI component that displays a dropdown used in the MMS Case Studies for toggling demographic variables.-->
<script>
	import { onDestroy } from 'svelte';

	// props
	import { mapStoreList } from '../stores/mapStore';
	import { formatNumber, getLang } from '../i18n';
	import Legend from './legends/Legend.svelte';
	// Import the mapStore

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

	const fr = getLang() === 'fr';

	/** @type {Record<string, string>} */
	const LEGEND_FR = {
		'Average Age': 'Âge moyen',
		'Household Size': 'Taille des ménages',
		'Average Employment Income (Census 2021)': 'Revenu d’emploi moyen (Recensement de 2021)',
		'% Visible Minority Population': '% de minorités visibles',
		'% Immigrants and Non-Permanent Residents': '% d’immigrants et de résidents non permanents',
		'% Indigenous Population': '% de population autochtone',
		'% of French Speakers': '% de francophones',
		'% of English Speakers': '% d’anglophones',
		'% of Bachelors Degree Holders': '% de titulaires d’un baccalauréat',
		'Population Density (people/sq.km)': 'Densité de population (personnes/km²)',
		'# of Dwellings': 'Nombre de logements',
		'% Duplex': '% de duplex',
		'% Semi-Detached': '% de maisons jumelées',
		'% Single-Detached': '% de maisons individuelles',
		'% Apartments (more than 5 stories)': '% d’appartements (plus de 5 étages)',
		'% Apartments (less than 5 stories)': '% d’appartements (moins de 5 étages)'
	};

	/** Legend title in the page language. @param {string} label */
	const lab = (label) => (fr ? (LEGEND_FR[label] ?? label) : label);

	/**
	 * Legend end value in the page language ('$880,000' -> '880 000 $', '14.7%' -> '14,7 %').
	 * @param {string} value
	 */
	const num = (value) => {
		if (!fr) return value;
		const m = value.match(/^(\$?)([\d,.]+)(%?)$/);
		if (!m) return value;
		const n = formatNumber(Number(m[2].replace(/,/g, '')), { maximumFractionDigits: 1 });
		return n + (m[1] ? '\u00a0$' : '') + (m[3] ? '\u00a0%' : '');
	};

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
		<Legend minlabel={num('29')} maxlabel={num('89')} label={lab('Average Age')} />
	{/if}

	{#if selected && selected.id === 'household-size'}
		<Legend minlabel={num('1')} maxlabel={num('8')} label={lab('Household Size')} />
	{/if}

	{#if selected && selected.id === 'average-income'}
		<Legend
			maxlabel={num('$880,000')}
			minlabel={num('$20,000')}
			label={lab('Average Employment Income (Census 2021)')}
		/>
	{/if}

	{#if selected && selected.id === 'visibleminority'}
		<Legend maxlabel={num('100%')} label={lab('% Visible Minority Population')} />
	{/if}

	{#if selected && selected.id === 'immigrants'}
		<Legend maxlabel={num('100%')} label={lab('% Immigrants and Non-Permanent Residents')} />
	{/if}

	{#if selected && selected.id === 'indigenous'}
		<Legend maxlabel={num('79%')} label={lab('% Indigenous Population')} />
	{/if}

	{#if selected && selected.id === 'french-speakers'}
		<Legend maxlabel={num('14.7%')} label={lab('% of French Speakers')} />
	{/if}

	{#if selected && selected.id === 'english-speakers'}
		<Legend maxlabel={num('100%')} label={lab('% of English Speakers')} />
	{/if}

	{#if selected && selected.id === 'education-bachelors'}
		<Legend maxlabel={num('100%')} label={lab('% of Bachelors Degree Holders')} />
	{/if}

	<!-- Housing -->

	{#if selected && selected.id === 'populationdensity'}
		<Legend maxlabel={num('4,070,000')} label={lab('Population Density (people/sq.km)')} />
	{/if}

	{#if selected && selected.id === 'dwellings'}
		<Legend minlabel={num('18')} maxlabel={num('8149')} label={lab('# of Dwellings')} />
	{/if}

	{#if selected && selected.id === 'duplex'}
		<Legend maxlabel={num('70%')} label={lab('% Duplex')} />
	{/if}

	{#if selected && selected.id === 'semi-detached'}
		<Legend maxlabel={num('100%')} label={lab('% Semi-Detached')} />
	{/if}

	{#if selected && selected.id === 'single-detached'}
		<Legend maxlabel={num('100%')} label={lab('% Single-Detached')} />
	{/if}

	{#if selected && selected.id === 'apartment-more-5-stories'}
		<Legend maxlabel={num('100%')} label={lab('% Apartments (more than 5 stories)')} />
	{/if}

	{#if selected && selected.id === 'apartment-less-5-stories'}
		<Legend maxlabel={num('100%')} label={lab('% Apartments (less than 5 stories)')} />
	{/if}
{/if}

{#if region && region === 'montreal'}
	{#if selected && selected.id === 'average-age'}
		<Legend minlabel={num('38')} maxlabel={num('79.8')} label={lab('Average Age')} />
	{/if}

	{#if selected && selected.id === 'household-size'}
		<Legend minlabel={num('1')} maxlabel={num('8')} label={lab('Household Size')} />
	{/if}

	{#if selected && selected.id === 'average-income'}
		<Legend
			maxlabel={num('$171,000')}
			minlabel={num('$22,400')}
			label={lab('Average Employment Income (Census 2021)')}
		/>
	{/if}

	{#if selected && selected.id === 'visibleminority'}
		<Legend maxlabel={num('100%')} label={lab('% Visible Minority Population')} />
	{/if}

	{#if selected && selected.id === 'immigrants'}
		<Legend maxlabel={num('100%')} label={lab('% Immigrants and Non-Permanent Residents')} />
	{/if}

	{#if selected && selected.id === 'indigenous'}
		<Legend maxlabel={num('79%')} label={lab('% Indigenous Population')} />
	{/if}

	{#if selected && selected.id === 'french-speakers'}
		<Legend maxlabel={num('100%')} label={lab('% of French Speakers')} />
	{/if}

	{#if selected && selected.id === 'english-speakers'}
		<Legend maxlabel={num('100%')} label={lab('% of English Speakers')} />
	{/if}

	{#if selected && selected.id === 'education-bachelors'}
		<Legend maxlabel={num('100%')} label={lab('% of Bachelors Degree Holders')} />
	{/if}

	<!-- Housing -->

	{#if selected && selected.id === 'populationdensity'}
		<Legend maxlabel={num('159,762')} label={lab('Population Density (people/sq.km)')} />
	{/if}

	{#if selected && selected.id === 'dwellings'}
		<Legend minlabel={num('0')} maxlabel={num('4770')} label={lab('# of Dwellings')} />
	{/if}

	{#if selected && selected.id === 'duplex'}
		<Legend maxlabel={num('100%')} label={lab('% Duplex')} />
	{/if}

	{#if selected && selected.id === 'semi-detached'}
		<Legend maxlabel={num('100%')} label={lab('% Semi-Detached')} />
	{/if}

	{#if selected && selected.id === 'single-detached'}
		<Legend maxlabel={num('100%')} label={lab('% Single-Detached')} />
	{/if}

	{#if selected && selected.id === 'apartment-more-5-stories'}
		<Legend maxlabel={num('100%')} label={lab('% Apartments (more than 5 stories)')} />
	{/if}

	{#if selected && selected.id === 'apartment-less-5-stories'}
		<Legend maxlabel={num('100%')} label={lab('% Apartments (less than 5 stories)')} />
	{/if}
{/if}

{#if region && region === 'montreal-fr'}
	{#if selected && selected.id === 'average-age'}
		<Legend minlabel={num('38')} maxlabel={num('79.8')} label={lab('Âge moyen')} />
	{/if}

	{#if selected && selected.id === 'household-size'}
		<Legend minlabel={num('1')} maxlabel={num('8')} label={lab('Taille des ménages')} />
	{/if}

	{#if selected && selected.id === 'average-income'}
		<Legend maxlabel={num('$171,000')} minlabel={num('$22,400')} label={lab('Revenu moyen (Recensement de 2021)')} />
	{/if}

	{#if selected && selected.id === 'visibleminority'}
		<Legend maxlabel={num('100%')} label={lab('% Minorités visibles')} />
	{/if}

	{#if selected && selected.id === 'immigrants'}
		<Legend maxlabel={num('100%')} label={lab('% Immigrants récents')} />
	{/if}

	{#if selected && selected.id === 'indigenous'}
		<Legend maxlabel={num('79%')} label={lab('% Population autochtone')} />
	{/if}

	{#if selected && selected.id === 'french-speakers'}
		<Legend maxlabel={num('100%')} label={lab('% Personne de langue française')} />
	{/if}

	{#if selected && selected.id === 'english-speakers'}
		<Legend maxlabel={num('100%')} label={lab('% Personne de langue anglaise')} />
	{/if}

	{#if selected && selected.id === 'education-bachelors'}
		<Legend maxlabel={num('100%')} label={lab('% Titulaires d’un baccalauréat')} />
	{/if}

	<!-- Housing -->

	{#if selected && selected.id === 'populationdensity'}
		<Legend maxlabel={num('159,762')} label={lab('Densité de la population (personnes/sq.km)')} />
	{/if}

	{#if selected && selected.id === 'dwellings'}
		<Legend minlabel={num('0')} maxlabel={num('4770')} label={lab('Logements')} />
	{/if}

	{#if selected && selected.id === 'duplex'}
		<Legend maxlabel={num('100%')} label={lab('% Duplex')} />
	{/if}

	{#if selected && selected.id === 'semi-detached'}
		<Legend maxlabel={num('100%')} label={lab('% Logements jumelés')} />
	{/if}

	{#if selected && selected.id === 'single-detached'}
		<Legend maxlabel={num('100%')} label={lab('% Logements individuels non attenants')} />
	{/if}

	{#if selected && selected.id === 'apartment-more-5-stories'}
		<Legend maxlabel={num('100%')} label={lab('% Tours d’habitation')} />
	{/if}

	{#if selected && selected.id === 'apartment-less-5-stories'}
		<Legend maxlabel={num('100%')} label={lab('% Immeubles à hauteur restreinte')} />
	{/if}
{/if}

{#if region && region === 'edmonton'}
	{#if selected && selected.id === 'average-age'}
		<Legend minlabel={num('36')} maxlabel={num('76.1')} label={lab('Average Age')} />
	{/if}

	{#if selected && selected.id === 'household-size'}
		<Legend minlabel={num('1')} maxlabel={num('8')} label={lab('Household Size')} />
	{/if}

	{#if selected && selected.id === 'average-income'}
		<Legend
			maxlabel={num('$750,000')}
			minlabel={num('$36,000')}
			label={lab('Average Employment Income (Census 2021)')}
		/>
	{/if}

	{#if selected && selected.id === 'visibleminority'}
		<Legend maxlabel={num('100%')} label={lab('% Visible Minority Population')} />
	{/if}

	{#if selected && selected.id === 'immigrants'}
		<Legend maxlabel={num('100%')} label={lab('% Immigrants and Non-Permanent Residents')} />
	{/if}

	{#if selected && selected.id === 'indigenous'}
		<Legend maxlabel={num('97.6%')} label={lab('% Indigenous Population')} />
	{/if}

	{#if selected && selected.id === 'french-speakers'}
		<Legend maxlabel={num('46.9%')} label={lab('% of French Speakers')} />
	{/if}

	{#if selected && selected.id === 'english-speakers'}
		<Legend maxlabel={num('100%')} label={lab('% of English Speakers')} />
	{/if}

	{#if selected && selected.id === 'education-bachelors'}
		<Legend maxlabel={num('100%')} label={lab('% of Bachelors Degree Holders')} />
	{/if}

	<!-- Housing -->

	{#if selected && selected.id === 'populationdensity'}
		<Legend maxlabel={num('50,529')} label={lab('Population Density (people/sq.km)')} />
	{/if}

	{#if selected && selected.id === 'dwellings'}
		<Legend minlabel={num('0')} maxlabel={num('3778')} label={lab('# of Dwellings')} />
	{/if}

	{#if selected && selected.id === 'duplex'}
		<Legend maxlabel={num('100%')} label={lab('% Duplex')} />
	{/if}

	{#if selected && selected.id === 'semi-detached'}
		<Legend maxlabel={num('100%')} label={lab('% Semi-Detached')} />
	{/if}

	{#if selected && selected.id === 'single-detached'}
		<Legend maxlabel={num('100%')} label={lab('% Single-Detached')} />
	{/if}

	{#if selected && selected.id === 'apartment-more-5-stories'}
		<Legend maxlabel={num('100%')} label={lab('% Apartments (more than 5 stories)')} />
	{/if}

	{#if selected && selected.id === 'apartment-less-5-stories'}
		<Legend maxlabel={num('100%')} label={lab('% Apartments (less than 5 stories)')} />
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
		box-shadow:
			rgba(27, 31, 35, 0.04) 0px 1px 0px 0px,
			rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset;
	}

	option {
		width: 100%;
	}
</style>
