<script>
	import '../../styles.css';
	import Card from '../../lib/ui/Card.svelte';
	import { writable } from 'svelte/store';
	import Icon from '@iconify/svelte';
	import Footer from '../../lib/Footer.svelte';

	import FiftyAvenue from '../../lib/assets/boundaries/edmontonboundaries/50Avenue.svg';
    import FiftyStreetBeaumont from '../../lib/assets/boundaries/edmontonboundaries/50StreetBeaumont.svg';
	import FiftyStreetStonyPlain from '../../lib/assets/boundaries/edmontonboundaries/50StreetStonyPlain.svg';
	import EightyTwoAvenueNW from '../../lib/assets/boundaries/edmontonboundaries/82AvenueNW.svg';
	import NinteySevenStreetDowntown from '../../lib/assets/boundaries/edmontonboundaries/97StreetDowntown.svg';
    import NinteySevenStreetNW from '../../lib/assets/boundaries/edmontonboundaries/97StreetNW.svg';
	import HundredAve from '../../lib/assets/boundaries/edmontonboundaries/100Avenue.svg';
	import HundredFourStreetNW from '../../lib/assets/boundaries/edmontonboundaries/104StreetNW.svg';
	import HundredFiveStreetNW from '../../lib/assets/boundaries/edmontonboundaries/105StreetNW.svg';
	import HundredSevenAvenueNW from '../../lib/assets/boundaries/edmontonboundaries/107AvenueNW.svg';
	import HundredEighteenAlbertaAve from '../../lib/assets/boundaries/edmontonboundaries/118AlbertaAve.svg';
	import HundredEighteenBeverly from '../../lib/assets/boundaries/edmontonboundaries/118Beverly.svg';
	import HundredTwentyFourStreetNW from '../../lib/assets/boundaries/edmontonboundaries/124StreetNW.svg';
	import HundredThirtySevenAvenueNW from '../../lib/assets/boundaries/edmontonboundaries/137AvenueNW.svg';
	import HundredFortyNineStreetNW from '../../lib/assets/boundaries/edmontonboundaries/149StreetNW.svg';
	import JasperAve from '../../lib/assets/boundaries/edmontonboundaries/JasperAve.svg';
	import ParsonsRoadSW from '../../lib/assets/boundaries/edmontonboundaries/ParsonsRoadSW.svg';
	import SherwoodDrive from '../../lib/assets/boundaries/edmontonboundaries/SherwoodDrive.svg';
	import StAlbertRoad from '../../lib/assets/boundaries/edmontonboundaries/StAlbertRoad.svg';
	import StonyPlainRoadNW from '../../lib/assets/boundaries/edmontonboundaries/StonyPlainRoadNW.svg';

	const allCards = [
		{
			link: '/casestudies/edmonton/82avenuenw',
			image: EightyTwoAvenueNW,
			name: 'Whyte (82) Avenue NW',
			type: 'downtown'
		},
		{
			link: '/casestudies/edmonton/jasperavenue',
			image: JasperAve,
			name: 'Jasper Avenue',
			type: 'downtown'
		},
		{
			link: '/casestudies/edmonton/104streetnw',
			image: HundredFourStreetNW,
			name: '104 Street NW',
			type: 'suburban'
		},
		{
			link: '/casestudies/edmonton/118albertaave',
			image: HundredEighteenAlbertaAve,
			name: '118 Ave (Alberta Avenue)',
			type: 'suburban'
		},
		{
			link: '/casestudies/edmonton/118beverly',
			image: HundredEighteenBeverly,
			name: '118 Ave (Beverly)',
			type: 'suburban'
		},
		{
			link: '/casestudies/edmonton/124streetnw',
			image: HundredTwentyFourStreetNW,
			name: '124 Street NW',
			type: 'suburban'
		},
		{
			link: '/casestudies/edmonton/149streetnw',
			image: HundredFortyNineStreetNW,
			name: '149 Street NW',
			type: 'suburban'
		},
		{
			link: '/casestudies/edmonton/stonyplainroadnw',
			image: StonyPlainRoadNW,
			name: 'Stony Plain Road NW',
			type: 'suburban'
		},
		{
			link: '/casestudies/edmonton/50streetbeaumont',
			image: FiftyStreetBeaumont,
			name: '50 Street Beaumont',
			type: 'rural'
		},
		{
			link: '/casestudies/edmonton/50streetstonyplain',
			image: FiftyStreetStonyPlain,
			name: '50 Street Stony Plain',
			type: 'rural'
		},
		{
			link: '/casestudies/edmonton/107avenuenw',
			image: HundredSevenAvenueNW,
			name: '107 Avenue NW',
			type: 'downtown'
		},
		{
			link: '/casestudies/edmonton/97streetdowntown',
			image: NinteySevenStreetDowntown,
			name: '97 Street Downtown',
			type: 'downtown'
		},
		{
			link: '/casestudies/edmonton/97streetnw',
			image: NinteySevenStreetNW,
			name: '97 Street NW',
			type: 'suburban'
		},
		{
			link: '/casestudies/edmonton/105streetnw',
			image: HundredFiveStreetNW,
			name: '105 Street NW',
			type: 'suburban'
		},
		{
			link: '/casestudies/edmonton/137avenuenw',
			image: HundredThirtySevenAvenueNW,
			name: '137 Avenue NW',
			type: 'suburban'
		},
		{
			link: '/casestudies/edmonton/parsonsroadsw',
			image: ParsonsRoadSW,
			name: 'Parsons Road SW',
			type: 'suburban'
		},
		{
			link: '/casestudies/edmonton/sherwooddrive',
			image: SherwoodDrive,
			name: 'Sherwood Drive',
			type: 'suburban'
		},
		{
			link: '/casestudies/edmonton/stalbertroad',
			image: StAlbertRoad,
			name: 'St. Albert Road',
			type: 'suburban'
		},
		{
			link: '/casestudies/edmonton/100avenue',
			image: HundredAve,
			name: '100 Avenue',
			type: 'rural'
		},
		{
			link: '/casestudies/edmonton/50avenue',
			image: FiftyAvenue,
			name: '50 Avenue',
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
	<h1>Edmonton, Alberta</h1>

	<div class="subtitle">
		<h2>Full Case Studies</h2>
	</div>
</div>



<div class="hero">
	<p>
		We conducted 10 full case studies in the Edmonton region, which which combine data about the main
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
		These are the 10 data only case studies in the Edmonton region. Use the filters above to filter
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

