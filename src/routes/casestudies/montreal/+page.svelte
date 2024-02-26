<script>
	import '../../styles.css';
	import Card from '../../lib/ui/Card.svelte';

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



</script>

<div class="hero">
	<h1>Montreal, Québec</h1>
</div>

<div class="subtitle">
	<h3>Full Case Studies</h3>
</div>

<div class="card-grid">
	<Card
		link={'/casestudies/montreal/boulevardstmartin'}
		cardImage={BoulStMartin}
		streetName={'Boulevard St. Martin'}
	/>
	<Card
		link={'/casestudies/montreal/montroyal'}
		cardImage={MontRoyal}
		streetName={'Mont Royal'}
	/>
	<Card
		link={'/casestudies/montreal/ruefleury'}
		cardImage={RueFleury}
		streetName={'Rue Fleury'}
	/>
    <Card link={'/casestudies/montreal/rueontario'} cardImage={RueOntario} streetName={'Rue Ontario'} />
    <Card link={'/casestudies/montreal/ruesaintecatherine'} cardImage={RueSainteCatherine} streetName={'Rue Sainte-Catherine'} />
	<Card link={'/casestudies/montreal/ruestanne'} cardImage={RueStAnne} streetName={'Rue St. Anne'} />
	<Card
		link={'/casestudies/montreal/ruestcharles'}
		cardImage={RueStCharles}
		streetName={'Rue St. Charles'}
	/>
	<Card link={'/casestudies/montreal/ruestgeorge'} cardImage={RueStGeorge} streetName={'Rue St. George'} />
	<Card
		link={'/casestudies/montreal/ruestpaul'}
		cardImage={RueStPaul}
		streetName={'Rue St. Paul'}
	/>
	<Card
		link={'/casestudies/montreal/ruewellington'}
		cardImage={RueWellington}
		streetName={'Rue Wellington'}
	/>
</div>

<div class="subtitle">
	<h3>Data Case Studies</h3>
</div>

<div class="card-grid">
	<Card
		link={'/casestudies/montreal/avedorval'}
		cardImage={AveDorval}
		streetName={'Ave Dorval'}
	/>
	<!-- avedorval -->
	<Card
		link={'/casestudies/montreal/avenuevictoria'}
		cardImage={AveVictoria}
		streetName={'Avenue Victoria'}
	/>
	<!-- avenuevictoria -->
	<Card
		link={'/casestudies/montreal/boulevardmonk'}
		cardImage={BlvdMonk}
		streetName={'Boulevard Monk'}
	/>
	<!-- boulevardmonk -->
	<Card
		link={'/casestudies/montreal/jeantalon'}
		cardImage={JeanTalon}
		streetName={'Jean Talon'}
	/>
	<!-- jeantalon -->
	<Card
		link={'/casestudies/montreal/notredame'}
		cardImage={NotreDame}
		streetName={'Notre Dame'}
	/>
	<!-- notredame -->
	<Card
		link={'/casestudies/montreal/ruebeaubien'}
		cardImage={RueBeaubien}
		streetName={'Rue Beaubien'}
	/>
	<!-- ruebeaubien -->
	<Card link={'/casestudies/montreal/ruerichelieu'} cardImage={RueRichelieu} streetName={'Rue Richelieu'} />
	<!-- ruerichelieu -->
	<Card
		link={'/casestudies/montreal/stdenis'}
		cardImage={StDenis}
		streetName={'St. Denis'}
	/>
	<!-- stdenis -->
	<Card
		link={'/casestudies/montreal/steustache'}
		cardImage={StEustache}
		streetName={'St. Eustache'}
	/>
	<!-- steustache -->
	<Card
		link={'/casestudies/montreal/sthubert'}
		cardImage={StHubert}
		streetName={'St. Hubert'}
	/>
	<!-- sthubert -->
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
