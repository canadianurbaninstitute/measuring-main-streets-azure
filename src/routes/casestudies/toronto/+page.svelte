<script>
	import '../../styles.css';
	import Card from '../../lib/ui/Card.svelte';
	import { writable } from 'svelte/store';
	import Icon from '@iconify/svelte';
	import Footer from '../../lib/Footer.svelte';

	import Brampton from '../../lib/assets/boundaries/torontoboundaries/Brampton.svg';
	import CaledonEast from '../../lib/assets/boundaries/torontoboundaries/CaledonEast.svg';
	import DowntownYonge from '../../lib/assets/boundaries/torontoboundaries/DowntownYonge.svg';
	import EtobicokeLakeshore from '../../lib/assets/boundaries/torontoboundaries/EtobicokeLakeshore.svg';
	import GoldenMile from '../../lib/assets/boundaries/torontoboundaries/GoldenMile.svg';
	import KingstonRd from '../../lib/assets/boundaries/torontoboundaries/KingstonRd.svg';
	import LibertyVillage from '../../lib/assets/boundaries/torontoboundaries/LibertyVillage.svg';
	import MarkhamHwy7 from '../../lib/assets/boundaries/torontoboundaries/MarkhamHwy7.svg';
	import MississaugaDundas from '../../lib/assets/boundaries/torontoboundaries/MississaugaDundas.svg';
	import Newmarket from '../../lib/assets/boundaries/torontoboundaries/Newmarket.svg';
	import NorthYorkCentre from '../../lib/assets/boundaries/torontoboundaries/NorthYorkCentre.svg';
	import Oakville from '../../lib/assets/boundaries/torontoboundaries/Oakville.svg';
	import Pickering from '../../lib/assets/boundaries/torontoboundaries/Pickering.svg';
	import Schomberg from '../../lib/assets/boundaries/torontoboundaries/Schomberg.svg';
	import SpadinaChinatown from '../../lib/assets/boundaries/torontoboundaries/SpadinaChinatown.svg';
	import Sutton from '../../lib/assets/boundaries/torontoboundaries/Sutton.svg';
	import ThorncliffePark from '../../lib/assets/boundaries/torontoboundaries/ThorncliffePark.svg';
	import Uxbridge from '../../lib/assets/boundaries/torontoboundaries/Uxbridge.svg';
	import Weston from '../../lib/assets/boundaries/torontoboundaries/Weston.svg';
	import WestQueenWest from '../../lib/assets/boundaries/torontoboundaries/WestQueenWest.svg';

	const allCards = [
		{
			link: '/casestudies/toronto/downtownyonge',
			image: DowntownYonge,
			name: 'Downtown Yonge',
			type: 'downtown'
		},
		{
			link: '/casestudies/toronto/northyorkcentre',
			image: NorthYorkCentre,
			name: 'North York Centre',
			type: 'downtown'
		},
		{
			link: '/casestudies/toronto/westqueenwest',
			image: WestQueenWest,
			name: 'West Queen West',
			type: 'suburban'
		},
		{
			link: '/casestudies/toronto/thorncliffepark',
			image: ThorncliffePark,
			name: 'Thorncliffe Park',
			type: 'suburban'
		},
		{
			link: '/casestudies/toronto/mississaugadundas',
			image: MississaugaDundas,
			name: 'Mississauga Dundas',
			type: 'suburban'
		},
		{
			link: '/casestudies/toronto/kingstonroad',
			image: KingstonRd,
			name: 'Kingston Road',
			type: 'suburban'
		},
		{ link: '/casestudies/toronto/weston', image: Weston, name: 'Weston', type: 'suburban' },
		{ link: '/casestudies/toronto/sutton', image: Sutton, name: 'Sutton', type: 'suburban' },
		{ link: '/casestudies/toronto/uxbridge', image: Uxbridge, name: 'Uxbridge', type: 'rural' },
		{ link: '/casestudies/toronto/newmarket', image: Newmarket, name: 'Newmarket', type: 'rural' },
		{
			link: '/casestudies/toronto/spadinachinatown',
			image: SpadinaChinatown,
			name: 'Spadina Chinatown',
			type: 'downtown'
		},
		{
			link: '/casestudies/toronto/libertyvillage',
			image: LibertyVillage,
			name: 'Liberty Village',
			type: 'downtown'
		},
		{
			link: '/casestudies/toronto/caledoneast',
			image: CaledonEast,
			name: 'Caledon East',
			type: 'suburban'
		},
		{
			link: '/casestudies/toronto/etobicokelakeshore',
			image: EtobicokeLakeshore,
			name: 'Etobicoke Lakeshore',
			type: 'suburban'
		},
		{
			link: '/casestudies/toronto/downtownbrampton',
			image: Brampton,
			name: 'Downtown Brampton',
			type: 'suburban'
		},
		{
			link: '/casestudies/toronto/goldenmile',
			image: GoldenMile,
			name: 'Golden Mile',
			type: 'suburban'
		},
		{
			link: '/casestudies/toronto/markhamhwy7',
			image: MarkhamHwy7,
			name: 'Markham Highway 7',
			type: 'suburban'
		},
		{
			link: '/casestudies/toronto/pickering',
			image: Pickering,
			name: 'Pickering',
			type: 'suburban'
		},
		{ link: '/casestudies/toronto/oakville', image: Oakville, name: 'Oakville', type: 'rural' },
		{ link: '/casestudies/toronto/schomberg', image: Schomberg, name: 'Schomberg', type: 'rural' }
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
	<h1>Toronto, Ontario</h1>
</div>

<div class="subtitle">
	<h2>Full Case Studies</h2>
</div>

<div class="hero">
<p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
esse cillum dolore eu fugiat nulla pariatur.
</p>
<div class="filter-container">
	<h4>Filter:</h4>
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

<div class='hero'>
<p>
	Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
	labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
	nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
	esse cillum dolore eu fugiat nulla pariatur.
</p>
</div>
<div class="card-grid">
	{#each filteredDataCaseStudies as card}
		<Card link={card.link} cardImage={card.image} streetName={card.name} />
	{/each}
</div>

<Footer/>

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
