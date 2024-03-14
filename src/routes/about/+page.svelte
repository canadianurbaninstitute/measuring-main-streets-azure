<script>
    import '../styles.css'
    import cui from '../lib/assets/logos/cui_logo_white.svg';
	import canada from '../lib/assets/logos/canada_logo.svg';
	import environics from '../lib/assets/logos/environics_logo.svg';
	import schoolofcities from '../lib/assets/logos/soc_logo.svg';
	import opennorth from '../lib/assets/logos/opennorth_logo.svg';
</script>


<div class="hero">
    <h1> About Measuring Main Streets</h1>
	<div class="subtitle">
		<h2>About the Project</h2>
	</div>
    <p>
        The Measuring Main Streets project (part of the Research Knowledge Initiative program from Infrastructure Canada)
        was developed by the Canadian Urban Institute in partnership with Environics Analytics and
        Open North.
    </p>
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

<div class="hero">
	<div class="subtitle">
		<h2>About the Data</h2>
	</div>
    <p>
		Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
		labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
		laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
		voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    </p>
</div>


<style>
    a {
		text-decoration: none;
	}

	.logo-group {
		position: relative;
		background-color: var(--brandDarkBlue);
		display: flex;
		align-items: center;
		flex-direction: row;
		padding: 2em;
		margin: 1em 0 1em 0;
	}

	/* MOBILE FLEX COLUMN (STACKED) LAYOUT */

	@media only screen and (max-width: 768px) {
		.logo-group {
			flex-direction: column;
			text-align: center;
		}
	}

	img {
		height: 60px;
		padding: 0.5em;
	}

	a:hover {
		opacity: 0.5;
		cursor: pointer;
	}

	p {
		color: var(--brandDarkBlue);
	}

</style>