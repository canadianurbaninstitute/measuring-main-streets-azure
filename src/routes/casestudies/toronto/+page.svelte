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
			name: 'Overlea Boulevard (Thorncliffe Park)',
			type: 'suburban'
		},
		{
			link: '/casestudies/toronto/mississaugadundas',
			image: MississaugaDundas,
			name: 'Dundas Street (Mississauga)',
			type: 'suburban'
		},
		{
			link: '/casestudies/toronto/kingstonroad',
			image: KingstonRd,
			name: 'Kingston Road (Scarborough Cliffside)',
			type: 'suburban'
		},
		{ link: '/casestudies/toronto/weston', image: Weston, name: 'Weston Road', type: 'suburban' },
		{ link: '/casestudies/toronto/sutton', image: Sutton, name: 'High Street (Sutton)', type: 'suburban' },
		{ link: '/casestudies/toronto/uxbridge', image: Uxbridge, name: 'Brock Street (Uxbridge)', type: 'rural' },
		{ link: '/casestudies/toronto/newmarket', image: Newmarket, name: 'Main Street South (Newmarket)', type: 'rural' },
		{
			link: '/casestudies/toronto/spadinachinatown',
			image: SpadinaChinatown,
			name: 'Spadina Avenue (Chinatown)',
			type: 'downtown'
		},
		{
			link: '/casestudies/toronto/libertyvillage',
			image: LibertyVillage,
			name: 'Liberty Street (Liberty Village)',
			type: 'downtown'
		},
		{
			link: '/casestudies/toronto/caledoneast',
			image: CaledonEast,
			name: 'Airport Road (Caledon East)',
			type: 'suburban'
		},
		{
			link: '/casestudies/toronto/etobicokelakeshore',
			image: EtobicokeLakeshore,
			name: 'Lake Shore Boulevard West (Etobicoke Lakeshore)',
			type: 'suburban'
		},
		{
			link: '/casestudies/toronto/downtownbrampton',
			image: Brampton,
			name: 'Main Street North (Downtown Brampton)',
			type: 'suburban'
		},
		{
			link: '/casestudies/toronto/goldenmile',
			image: GoldenMile,
			name: 'Eglington Avenue East (Golden Mile)',
			type: 'suburban'
		},
		{
			link: '/casestudies/toronto/markhamhwy7',
			image: MarkhamHwy7,
			name: 'Highway 7 (Markham)',
			type: 'suburban'
		},
		{
			link: '/casestudies/toronto/pickering',
			image: Pickering,
			name: 'Kingston Road (Pickering)',
			type: 'suburban'
		},
		{ link: '/casestudies/toronto/oakville', image: Oakville, name: 'Lakeshore Road West (Oakville)', type: 'rural' },
		{ link: '/casestudies/toronto/schomberg', image: Schomberg, name: 'Main Street (Schomberg)', type: 'rural' }
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
	<div class="subtitle">
		<h2>Full Case Studies</h2>
	</div>
</div>

<div class="hero">
	<p>
		We conducted 10 full case studies in the Toronto region, which which combine data about the main
		streets with qualitative observation from site visits. The selection of main streets was
		intended to provide a representative sample of types of streets within each regional context.
		This included downtown (workplace-oriented), small town, and neighourhood (residential-oriented)
		main streets being chosen, with additional emphasis placed on equity-deserving communities. More
		streets were included in the neighbourhood category as there are a greater variety of streets
		within the group. Use the filters to filter the case studies by type, or click on a case study
		to read it.
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
				Neighbourhood
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

<div class="hero">
	<div class="subtitle">
		<h2>Data Case Studies</h2>
	</div>
	<p>
		These are the 10 data only case studies in the Toronto region. Use the filters above to filter
		the case studies by type, or click on a case study to read it.
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
		width: 100%;
		grid-row-gap: 1em;
	}

	.checkbox-group {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
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

		.filter-container {
			width: fit-content;
		}

		.checkbox-group {
		flex-direction: row;
		align-items: flex-start;
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
