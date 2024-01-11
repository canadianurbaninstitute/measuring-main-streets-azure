<script>
	import '../../styles.css';
	import Card from '../../lib/ui/Card.svelte';

	import FiftyAvenue from '../../lib/assets/boundaries/edmontonboundaries/50Avenue.svg';
    import FiftyStreetBeaumont from '../../lib/assets/boundaries/edmontonboundaries/50StreetBeaumont.svg';
	import FiftyStreetStonyPlain from '../../lib/assets/boundaries/edmontonboundaries/50StreetStonyPlain.svg';
	import EightyTwoAvenueNW from '../../lib/assets/boundaries/edmontonboundaries/82AvenueNW.svg';
	import NinteySevenStreetDowntown from '../../lib/assets/boundaries/edmontonboundaries/97StreetDowntown.svg';
    import NinteySevenStreetNW from '../../lib/assets/boundaries/edmontonboundaries/97StreetNW.svg';
	import HundredAve from '../../lib/assets/boundaries/edmontonboundaries/100Ave.svg';
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

</script>

<div class="hero">
	<h1>Edmonton, Alberta</h1>
</div>

<div class="subtitle">
	<h3>Full Case Studies</h3>
</div>

<div class="card-grid">
	<Card
		link={'/casestudies/edmonton/50streetbeaumont'}
		cardImage={FiftyStreetBeaumont}
		streetName={'50 Street Beaumont'}
	/>
	<Card
		link={'/casestudies/edmonton/50streetstonyplain'}
		cardImage={FiftyStreetStonyPlain}
		streetName={'50 Street Stony Plain'}
	/>
	<Card
		link={'/casestudies/edmonton/82avenuenw'}
		cardImage={EightyTwoAvenueNW}
		streetName={'Whyte (82) Avenue NW'}
	/>
    <Card link={'/casestudies/edmonton/104streetnw'} cardImage={HundredFourStreetNW} streetName={'104 Street NW'} />
    <Card link={'/casestudies/edmonton/118albertaave'} cardImage={HundredEighteenAlbertaAve} streetName={'118 Ave (Alberta)'} />
	<Card link={'/casestudies/edmonton/118beverly'} cardImage={HundredEighteenBeverly} streetName={'118 Ave (Beverly)'} />
	<Card
		link={'/casestudies/edmonton/124streetnw'}
		cardImage={HundredTwentyFourStreetNW}
		streetName={'124 Street NW'}
	/>
	<Card link={'/casestudies/edmonton/149streetnw'} cardImage={HundredFortyNineStreetNW} streetName={'149 Street NW'} />
	<Card
		link={'/casestudies/edmonton/jasperavenue'}
		cardImage={JasperAve}
		streetName={'Jasper Avenue'}
	/>
	<Card
		link={'/casestudies/edmonton/stonyplainroadnw'}
		cardImage={StonyPlainRoadNW}
		streetName={'Stony Plain Road NW'}
	/>
</div>

<div class="subtitle">
	<h3>Data Case Studies</h3>
</div>

<div class="card-grid">
	<Card
		link={'/casestudies/toronto/westqueenwest'}
		cardImage={FiftyAvenue}
		streetName={'50 Avenue'}
	/>
	<Card
		link={'/casestudies/toronto/westqueenwest'}
		cardImage={NinteySevenStreetDowntown}
		streetName={'97 Street Downtown'}
	/>
	<Card
		link={'/casestudies/toronto/westqueenwest'}
		cardImage={NinteySevenStreetNW}
		streetName={'97 Street NW'}
	/>
	<Card
		link={'/casestudies/toronto/westqueenwest'}
		cardImage={HundredAve}
		streetName={'100 Avenue'}
	/>
	<Card
		link={'/casestudies/toronto/westqueenwest'}
		cardImage={HundredFiveStreetNW}
		streetName={'105 Street NW'}
	/>
	<Card
		link={'/casestudies/toronto/westqueenwest'}
		cardImage={HundredSevenAvenueNW}
		streetName={'107 Avenue NW'}
	/>
	<Card link={'/casestudies/toronto/westqueenwest'} cardImage={HundredThirtySevenAvenueNW} streetName={'137 Avenue NW'} />
	<Card
		link={'/casestudies/toronto/westqueenwest'}
		cardImage={ParsonsRoadSW}
		streetName={'Parsons Road SW'}
	/>
	<Card
		link={'/casestudies/toronto/westqueenwest'}
		cardImage={SherwoodDrive}
		streetName={'Sherwood Drive'}
	/>
	<Card
		link={'/casestudies/toronto/westqueenwest'}
		cardImage={StAlbertRoad}
		streetName={'St. Albert Road'}
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
