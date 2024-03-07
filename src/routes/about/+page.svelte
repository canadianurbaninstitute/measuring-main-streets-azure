<script>
    import '../styles.css'
    import cui from '../lib/assets/logos/cui_logo_white.svg';
	import canada from '../lib/assets/logos/canada_logo.svg';
	import environics from '../lib/assets/logos/environics_logo.svg';
	import schoolofcities from '../lib/assets/logos/soc_logo.svg';
	import opennorth from '../lib/assets/logos/opennorth_logo.svg';
</script>


<div class="hero">
    <h1> About </h1>
    <p>
        The Measuring Main Streets project (part of the Research Knowledge Initiative program from Infrastructure Canada)
        was developed by the Canadian Urban Institute in partnership with Environics Analytics and
        Open North.
    </p>
	<div id="logo-content">
		<div class="logo-group">
			<img src={canada} alt="Canadian Urban Institute" />
			<a href="https://www.canurb.org"><img src={cui} alt="Canadian Urban Institute" /></a>
		</div>
		<div class="logo-group">
			<!-- <a href="https://schoolofcities.utoronto.ca/"><img src={schoolofcities} alt="School of Cities" /></a> -->
			<a href="https://environicsanalytics.com/en-ca/home"><img src={environics} alt="Environics Analytics" /></a>
			<a href="https://opennorth.ca/"><img src={opennorth} alt="Open North" /></a>
		</div>
	</div>
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