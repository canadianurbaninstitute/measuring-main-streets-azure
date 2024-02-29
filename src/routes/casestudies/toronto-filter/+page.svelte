<script>
	import '../../styles.css';
	import Card from '../../lib/ui/Card.svelte';
	import { writable } from 'svelte/store';

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
        { link: '/casestudies/toronto/downtownyonge', image: DowntownYonge, name: 'Downtown Yonge', type: 'downtown' },
		{ link: '/casestudies/toronto/uxbridge', image: Uxbridge, name: 'Uxbridge', type: 'rural' },
		{ link: '/casestudies/toronto/thorncliffepark', image: ThorncliffePark, name: 'Thorncliffe Park', type: 'suburban' }
    ];

	// Reactive variable for tracking active filters
    const activeFilters = writable([]);


    // Function to update active filters
    function toggleFilter(filter) {
        activeFilters.update(currentFilters => {
            const index = currentFilters.indexOf(filter);
            if (index === -1) {
                return [...currentFilters, filter];
            } else {
                return currentFilters.filter(f => f !== filter);
            }
        });
    }

    // Function to reset filters
    function resetFilters() {
        activeFilters.set([]);
    }

    // Derived store to compute filtered cards
    $: filteredCards = $activeFilters.length > 0 
        ? allCards.filter(card => $activeFilters.includes(card.type))
        : allCards;

	
</script>


<div class="hero">
	<h1>Toronto, Ontario</h1>
</div>

<div class="subtitle">
	<h2>Full Case Studies</h2>
</div>

<div class='button-group'>
<button on:click={() => toggleFilter('downtown')}> Workplace (Downtown) Oriented</button>
<button on:click={() => toggleFilter('suburban')}>Suburban</button>
<button on:click={() => toggleFilter('rural')}>Rural</button>
<button on:click={resetFilters}>Reset</button>
</div>

<div class="card-grid">
	{#each filteredCards as card}
	<Card link={card.link} cardImage={card.image} streetName={card.name} />
{/each}
</div>

<div class="subtitle">
	<h2>Data Case Studies</h2>
</div>

<div class="card-grid">
	<Card
		link={'/casestudies/toronto/caledoneast'}
		cardImage={CaledonEast}
		streetName={'Caledon East'}
	/>
	<!-- caledoneast -->
	<Card
		link={'/casestudies/toronto/downtownbrampton'}
		cardImage={Brampton}
		streetName={'Downtown Brampton'}
	/>
	<!-- downtownbrampton -->
	<Card
		link={'/casestudies/toronto/etobicokelakeshore'}
		cardImage={EtobicokeLakeshore}
		streetName={'Etobicoke Lakeshore'}
	/>
	<!-- etobicokelakeshore -->
	<Card
		link={'/casestudies/toronto/goldenmile'}
		cardImage={GoldenMile}
		streetName={'Golden Mile'}
	/>
	<!-- goldenmile -->
	<Card
		link={'/casestudies/toronto/libertyvillage'}
		cardImage={LibertyVillage}
		streetName={'Liberty Village'}
	/>
	<!-- libertyvillage -->
	<Card
		link={'/casestudies/toronto/markhamhwy7'}
		cardImage={MarkhamHwy7}
		streetName={'Markham Highway 7'}
	/>
	<!-- markhamhighway7 -->
	<Card link={'/casestudies/toronto/oakville'} cardImage={Oakville} streetName={'Oakville'} /> 
	<!-- oakvilla -->
	<Card
		link={'/casestudies/toronto/pickering'}
		cardImage={Pickering}
		streetName={'Pickering'}
	/>
	<!-- pickering -->
	<Card
		link={'/casestudies/toronto/schomberg'}
		cardImage={Schomberg}
		streetName={'Schomberg'}
	/>
	<!-- schomberg -->
	<Card
		link={'/casestudies/toronto/spadinachinatown'}
		cardImage={SpadinaChinatown}
		streetName={'Spadina Chinatown'}
	/>
	<!-- spadinachinatown -->
</div>

<style>

    h1 {
        padding-top: 1em;
    }

	.subtitle {
		display: flex;
		margin: 2em;
	}

	.button-group {
		display: flex;
		justify-content: center;
	}

	.layerOn {
		opacity: 1;
	}

	.layerOff {
		opacity: 0.6;
		border: 1px dashed rgba(27, 31, 35, 0.3);
	}

	.card-grid {
		border-radius: 1em;
		display: grid;
		background-color: #ddd;
		border: 1px solid #ddd;
		grid-gap: 1px;
		margin: 3em;
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
