<script>
    import '../styles.css'
    import cui from '../lib/assets/logos/cui_logo_white.svg';
	import canada from '../lib/assets/logos/canada_logo.svg';
	import environics from '../lib/assets/logos/environics_logo.svg';
	import schoolofcities from '../lib/assets/logos/soc_logo.svg';
	import opennorth from '../lib/assets/logos/opennorth_logo.svg';
	import collage from '../lib/assets/graphics/MMS-collage.jpg'
	import Footer from '../lib/Footer.svelte';

</script>


<div class="hero">
    <h1> About Measuring Main Streets</h1>
	<div class="subtitle">
		<h2>The Measuring Main Streets project is a part of the Research Knowledge Initiative program from Infrastructure Canada.</h2>
	</div>
    <p>
        It is developed by the Canadian Urban Institute with support from our partners at Environics Analytics and
        Open North.
    </p>
	<p>The project is constructed around four interrelated components:</p>
	<ul>
		<li>
		an interactive national map of that provides descriptive data for every main street in the country.
		</li>
		<li>
		a set of 30 full case studies across 10 regions (Toronto; Montreal; Edmonton) as well as 30 partial case studies (data only).
		</li>
		<li>
		a set of analytical research briefs and reports that provide sensemaking and point towards potential policy interventions.
		</li>
		<li>
		a set of smart tools and recommendations to inform main street resiliency and future civic infrastructure investment.
		</li>
	</ul>
	</div>

<div id="logo-content">
	<div class="logo-group">
		<img src={canada} alt="Canadian Urban Institute" />
		<a href="https://www.canurb.org"><img src={cui} alt="Canadian Urban Institute" /></a>
		<!-- <a href="https://schoolofcities.utoronto.ca/"><img src={schoolofcities} alt="School of Cities" /></a> -->
		<a href="https://environicsanalytics.com/en-ca/home"><img src={environics} alt="Environics Analytics" /></a>
		<a href="https://opennorth.ca/"><img src={opennorth} alt="Open North" /></a>
	</div>
</div>

<div class="image-container">
<img src={collage} alt="collage" id="collage"/>
</div>

<Footer/>


<style>
    a {
		text-decoration: none;
	}

	.logo-group {
		position: relative;
		display: flex;
		align-items: center;
		flex-direction: row;
		padding: 2em;
		margin: 1em 0 1em 0;
	}


	#collage {
		width: 100%;
		margin-top: 1em;
	}

	/* MOBILE FLEX COLUMN (STACKED) LAYOUT */

	@media only screen and (max-width: 768px) {
		.logo-group {
			flex-direction: column;
			text-align: center;
		}
	}

	.logo-group img {
		height: 60px;
		padding: 0.5em;
		filter: brightness(0) saturate(100%);
	}

	a:hover {
		opacity: 0.5;
		cursor: pointer;
	}

	p {
		color: var(--brandDarkBlue);
	}

</style>