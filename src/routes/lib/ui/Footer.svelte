<script>
	import cui from '../assets/logos/cui_logo_white.svg';
	import mms from '../assets/logos/mms_logo_white.svg';
	import canada from '../assets/logos/canada_logo.svg';
	import environics from '../assets/logos/environics_logo.svg';
	import schoolofcities from '../assets/logos/soc_logo.svg';
	import opennorth from '../assets/logos/opennorth_logo.svg';
	import SocialLinks from './SocialLinks.svelte';
</script>

<div id="bar">
	<div class="footer-content">
		<a href="/"><img src={mms} alt="Measuring Main Street" /></a>
		<div id="social">
		</div>
	</div>
	<div id="logo-content">
		<p>
			The Measuring Main Streets platfrom (part of the Research Knowledge Initiative program from
			Housing, Infrastructure and Communities Canada) was developed by the Canadian Urban Institute in partnership with
			Environics Analytics and Open North.
		</p>
		<div class="logo-group">
			<img src={canada} alt="Canadian Urban Institute" />
			<a href="https://www.canurb.org"><img src={cui} alt="Canadian Urban Institute" /></a>
			<a href="https://environicsanalytics.com/en-ca/home"><img src={environics} alt="Environics Analytics" /></a
			>
			<a href="https://opennorth.ca/"><img src={opennorth} alt="Open North" /></a>
		</div>
	</div>
	<SocialLinks/>
</div>

<style>
	
	a {
		text-decoration: none;
	}

	#logo-content {
		margin: 1em;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		max-width: 80%;
	}

	.logo-group {
		position: relative;
		background-color: var(--brandDarkBlue);
		display: flex;
		align-items: center;
		flex-direction: row;
	}

	#bar {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		justify-content: space-between;
		background-color: var(--brandDarkBlue);
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
		color: white;
	}

	.footer-content {
		display: flex;
		flex-direction: row;
		justify-content: center;
		padding: 1em;
	}

	.footer-content img {
		height: 100px;
	}

</style>
