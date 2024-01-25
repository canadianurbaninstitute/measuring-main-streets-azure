<script>
	import '../../styles.css';
	import Card from '../../lib/ui/Card.svelte';

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
</script>

<div class="hero">
	<h1>Toronto, Ontario</h1>
</div>

<div class="subtitle">
	<h3>Full Case Studies</h3>
</div>

<div class="card-grid">
	<Card
		link={'/casestudies/toronto/downtownyonge'}
		cardImage={DowntownYonge}
		streetName={'Downtown Yonge'}
	/>
	<Card
		link={'/casestudies/toronto/kingstonroad'}
		cardImage={KingstonRd}
		streetName={'Kingston Road'}
	/>
	<Card
		link={'/casestudies/toronto/mississaugadundas'}
		cardImage={MississaugaDundas}
		streetName={'Mississauga Dundas'}
	/>
	<Card link={'/casestudies/toronto/newmarket'} cardImage={Newmarket} streetName={'Newmarket'} />
	<Card
		link={'/casestudies/toronto/northyorkcentre'}
		cardImage={NorthYorkCentre}
		streetName={'North York Centre'}
	/>
	<Card link={'/casestudies/toronto/sutton'} cardImage={Sutton} streetName={'Sutton'} />
	<Card
		link={'/casestudies/toronto/thorncliffepark'}
		cardImage={ThorncliffePark}
		streetName={'Thorncliffe Park'}
	/>
	<Card link={'/casestudies/toronto/uxbridge'} cardImage={Uxbridge} streetName={'Uxbridge'} />
	<Card
		link={'/casestudies/toronto/westqueenwest'}
		cardImage={WestQueenWest}
		streetName={'West Queen West'}
	/>
	<Card link={'/casestudies/toronto/weston'} cardImage={Weston} streetName={'Weston'} />
</div>

<div class="subtitle">
	<h3>Data Case Studies</h3>
</div>

<div class="card-grid">
	<Card
		link={'/casestudies/toronto/westqueenwest'}
		cardImage={CaledonEast}
		streetName={'Caledon East'}
	/>
	<Card
		link={'/casestudies/toronto/westqueenwest'}
		cardImage={Brampton}
		streetName={'Downtown Brampton'}
	/>
	<Card
		link={'/casestudies/toronto/westqueenwest'}
		cardImage={EtobicokeLakeshore}
		streetName={'Etobicoke Lakeshore'}
	/>
	<Card
		link={'/casestudies/toronto/westqueenwest'}
		cardImage={GoldenMile}
		streetName={'Golden Mile'}
	/>
	<Card
		link={'/casestudies/toronto/westqueenwest'}
		cardImage={LibertyVillage}
		streetName={'Liberty Village'}
	/>
	<Card
		link={'/casestudies/toronto/westqueenwest'}
		cardImage={MarkhamHwy7}
		streetName={'Markham Highway 7'}
	/>
	<Card link={'/casestudies/toronto/westqueenwest'} cardImage={Oakville} streetName={'Oakville'} />
	<Card
		link={'/casestudies/toronto/westqueenwest'}
		cardImage={Pickering}
		streetName={'Pickering'}
	/>
	<Card
		link={'/casestudies/toronto/westqueenwest'}
		cardImage={Schomberg}
		streetName={'Schomberg'}
	/>
	<Card
		link={'/casestudies/toronto/westqueenwest'}
		cardImage={SpadinaChinatown}
		streetName={'Spadina Chinatown'}
	/>
</div>

<style>

    h1 {
        padding-top: 1em;
    }

	.subtitle {
		display: flex;
		margin: 2em;
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
