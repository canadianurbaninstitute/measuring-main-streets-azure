<script>
	import '../../styles.css';
	import Card from '../../lib/ui/Card.svelte';
	import { writable } from 'svelte/store';
	import Icon from '@iconify/svelte';
	import Footer from '../../lib/Footer.svelte';

	import AveDorval from '../../lib/assets/boundaries/montrealboundaries/AveDorval.svg';
	import AveVictoria from '../../lib/assets/boundaries/montrealboundaries/AveVictoria.svg';
	import BlvdMonk from '../../lib/assets/boundaries/montrealboundaries/BlvdMonk.svg';
	import BoulStMartin from '../../lib/assets/boundaries/montrealboundaries/BoulStMartin.svg';
	import JeanTalon from '../../lib/assets/boundaries/montrealboundaries/JeanTalon.svg';
	import MontRoyal from '../../lib/assets/boundaries/montrealboundaries/MontRoyal.svg';
	import NotreDame from '../../lib/assets/boundaries/montrealboundaries/NotreDame.svg';
	import RueBeaubien from '../../lib/assets/boundaries/montrealboundaries/RueBeaubien.svg';
	import RueFleury from '../../lib/assets/boundaries/montrealboundaries/RueFleury.svg';
	import RueOntario from '../../lib/assets/boundaries/montrealboundaries/RueOntario.svg';
	import RueRichelieu from '../../lib/assets/boundaries/montrealboundaries/RueRichelieu.svg';
	import RueSainteCatherine from '../../lib/assets/boundaries/montrealboundaries/RueSainteCatherine.svg';
	import RueStAnne from '../../lib/assets/boundaries/montrealboundaries/RueStAnne.svg';
	import RueStCharles from '../../lib/assets/boundaries/montrealboundaries/RueStCharles.svg';
	import RueStGeorge from '../../lib/assets/boundaries/montrealboundaries/RueStGeorge.svg';
	import RueStPaul from '../../lib/assets/boundaries/montrealboundaries/RueStPaul.svg';
	import RueWellington from '../../lib/assets/boundaries/montrealboundaries/RueWellington.svg';
	import StDenis from '../../lib/assets/boundaries/montrealboundaries/StDenis.svg';
	import StEustache from '../../lib/assets/boundaries/montrealboundaries/StEustache.svg';
	import StHubert from '../../lib/assets/boundaries/montrealboundaries/StHubert.svg';

	const allCards = [
		{
			link: '/casestudies/montreal/ruesaintecatherine',
			image: RueSainteCatherine,
			name: 'Rue Sainte Catherine',
			type: 'downtown'
		},
		{
			link: '/casestudies/montreal/ruestpaul',
			image: RueStPaul,
			name: 'Rue St. Paul',
			type: 'downtown'
		},
		{
			link: '/casestudies/montreal/ruewellington',
			image: RueWellington,
			name: 'Rue Wellington',
			type: 'suburban'
		},
		{
			link: '/casestudies/montreal/ruefleury',
			image: RueFleury,
			name: 'Rue Fleury',
			type: 'suburban'
		},
		{
			link: '/casestudies/montreal/rueontario',
			image: RueOntario,
			name: 'RueOntario',
			type: 'suburban'
		},
		{
			link: '/casestudies/montreal/montroyal',
			image: MontRoyal,
			name: 'Mont Royal',
			type: 'suburban'
		},
		{
			link: '/casestudies/montreal/boulevardstmartin',
			image: BoulStMartin,
			name: 'Boulevard St. Martin',
			type: 'suburban'
		},
		{
			link: '/casestudies/montreal/ruestcharles',
			image: RueStCharles,
			name: 'Rue St. Charles',
			type: 'suburban'
		},
		{
			link: '/casestudies/montreal/ruestgeorge',
			image: RueStGeorge,
			name: 'Rue St. George',
			type: 'rural'
		},
		{
			link: '/casestudies/montreal/ruestanne',
			image: RueStAnne,
			name: 'Rue St. Anne',
			type: 'rural'
		},
		{
			link: '/casestudies/montreal/ruenotredame',
			image: NotreDame,
			name: 'Rue Notre-Dame',
			type: 'downtown'
		},
		{
			link: '/casestudies/montreal/stdenis',
			image: StDenis,
			name: 'Rue St. Denis',
			type: 'downtown'
		},
		{
			link: '/casestudies/montreal/avevictoria',
			image: AveVictoria,
			name: 'Avenue Victoria',
			type: 'suburban'
		},
		{
			link: '/casestudies/montreal/avedorval',
			image: AveDorval,
			name: 'Avenue Dorval',
			type: 'suburban'
		},
		{
			link: '/casestudies/montreal/boulevardmonk',
			image: BlvdMonk,
			name: 'Boulevard Monk',
			type: 'suburban'
		},
		{
			link: '/casestudies/montreal/ruebeaubien',
			image: RueBeaubien,
			name: 'Rue Beaubien',
			type: 'suburban'
		},
		{
			link: '/casestudies/montreal/jeantalon',
			image: JeanTalon,
			name: 'Rue Jean Talon',
			type: 'suburban'
		},
		{
			link: '/casestudies/montreal/sthubert',
			image: StHubert,
			name: 'Rue St. Hubert',
			type: 'suburban'
		},
		{
			link: '/casestudies/montreal/ruerichelieu',
			image: RueRichelieu,
			name: 'Rue Richelieu',
			type: 'rural'
		},
		{
			link: '/casestudies/montreal/steustache',
			image: StEustache,
			name: 'Rue St. Eustache',
			type: 'rural'
		}
	];

	const activeFilters = writable([]);

	let isDowntownChecked = false;
	let isSuburbanChecked = false;
	let isRuralChecked = false;

	function updateFilter(filter, isChecked) {
		activeFilters.update((currentFilters) => {
			if (isChecked) {
				if (!currentFilters.includes(filter)) {
					return [...currentFilters, filter];
				}
			} else {
				return currentFilters.filter((f) => f !== filter);
			}
			return currentFilters;
		});
	}

	function resetFilters() {
		activeFilters.set([]);
		isDowntownChecked = false;
		isSuburbanChecked = false;
		isRuralChecked = false;
	}

	// Split the allCards array into two arrays
	const fullCaseStudies = allCards.slice(0, 10);
	const dataCaseStudies = allCards.slice(10);

	// Reactive statements to filter both arrays
	$: filteredFullCaseStudies =
		$activeFilters.length > 0
			? fullCaseStudies.filter((card) => $activeFilters.includes(card.type))
			: fullCaseStudies;

	$: filteredDataCaseStudies =
		$activeFilters.length > 0
			? dataCaseStudies.filter((card) => $activeFilters.includes(card.type))
			: dataCaseStudies;
</script>

<div class="hero">
	<h1>Montreal, Québec</h1>
</div>

<div class="subtitle">
	<h2>Full Case Studies</h2>
</div>

<div class="hero">
	<p>
		Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
		labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
		laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
		voluptate velit esse cillum dolore eu fugiat nulla pariatur.
	</p>
	<div class="filter-container">
		<!-- <h4>Filter:</h4> -->
		<div class="checkbox-group">
			<label>
				<input
					type="checkbox"
					bind:checked={isDowntownChecked}
					on:change={() => updateFilter('downtown', isDowntownChecked)}
				/>
				Downtown
			</label>
			<label>
				<input
					type="checkbox"
					bind:checked={isSuburbanChecked}
					on:change={() => updateFilter('suburban', isSuburbanChecked)}
				/>
				Residential
			</label>
			<label>
				<input
					type="checkbox"
					bind:checked={isRuralChecked}
					on:change={() => updateFilter('rural', isRuralChecked)}
				/>
				Small Town
			</label>
		</div>
		<button on:click={resetFilters}><Icon icon="mi:undo" />Reset Filters</button>
	</div>
</div>

<div class="card-grid">
	{#each filteredFullCaseStudies as card}
		<Card link={card.link} cardImage={card.image} streetName={card.name} />
	{/each}
</div>

<div class="subtitle">
	<h2>Data Case Studies</h2>
</div>

<div class="hero">
	<p>
		Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
		labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
		laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
		voluptate velit esse cillum dolore eu fugiat nulla pariatur.
	</p>
</div>
<div class="card-grid">
	{#each filteredDataCaseStudies as card}
		<Card link={card.link} cardImage={card.image} streetName={card.name} />
	{/each}
</div>

<Footer />

<style>
	button {
		border: 1px solid rgba(27, 31, 35, 0.3);
		background-color: rgb(250, 251, 252);
		border-radius: 0.5em;
		box-shadow: rgba(27, 31, 35, 0.04) 0px 1px 0px 0px,
			rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset;
		opacity: 1;
		display: flex;
		align-items: center;
		margin: auto;
		padding: 0.5em;
		column-gap: 0.2em;
	}

	.filter-container {
		display: flex;
		flex-direction: column;
		background-color: #fff;
		padding: 1em;
		border-radius: 0.6em;
		border: 1px solid #eee;
		width: fit-content;
		grid-row-gap: 1em;
	}

	.checkbox-group {
		display: flex;
		justify-content: center;
	}

	.checkbox-group label {
		margin-right: 1em;
		display: flex;
		align-items: center;
	}

	input[type='checkbox'] {
		accent-color: var(--brandDarkBlue);
	}

	.card-grid {
		display: grid;
		grid-gap: 1em;
		margin: 2em;
		align-items: center;
		justify-content: center;
		grid-template-columns: repeat(1, 1fr);
		overflow: hidden;
	}

	/* WIDE MOBILE */

	@media only screen and (min-width: 480px) {
		.card-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	/*TABLET*/

	@media only screen and (min-width: 768px) {
		.card-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	/*DESKTOP*/
	@media only screen and (min-width: 968px) {
		.card-grid {
			grid-template-columns: repeat(5, 1fr);
		}
	}
</style>
