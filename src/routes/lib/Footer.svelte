<script>
	import cui from '../lib/assets/logos/cui_logo_white.svg';
	import mms from '../lib/assets/logos/mms_logo_white.svg';
	import canada from '../lib/assets/logos/canada_logo.svg';
	import environics from '../lib/assets/logos/environics_logo.svg';
	import schoolofcities from '../lib/assets/logos/soc_logo.svg';
	import opennorth from '../lib/assets/logos/opennorth_logo.svg';
	import HubspotForm from './ui/HubspotForm.svelte'
</script>

<div id="bar">
	<div class="footer-content">
		<a href="/"><img src={mms} alt="Measuring Main Street" /></a>
		<div>
		<p>Subscribe to the Canadian Urban Institute newsletter</p>
		<HubspotForm      
		portalId="8260137"      
		formId="6697fce8-23ec-49ad-bb8c-b6174d3bebaa"      
	 	/>
		</div>
	</div>
	<div id="logo-content">
		<p>
			The Measuring Main Streets project (part of the Research Knowledge Initiative program from
			Infrastructure Canada) was developed by the Canadian Urban Institute in partnership with
			Environics Analytics and Open North.
		</p>
		<div class="logo-group">
			<img src={canada} alt="Canadian Urban Institute" />
			<a href="https://www.canurb.org"><img src={cui} alt="Canadian Urban Institute" /></a>
			<!-- <a href="https://schoolofcities.utoronto.ca/"><img src={schoolofcities} alt="School of Cities" /></a> -->
			<a href="https://environicsanalytics.com/en-ca/home"
				><img src={environics} alt="Environics Analytics" /></a
			>
			<a href="https://opennorth.ca/"><img src={opennorth} alt="Open North" /></a>
		</div>
	</div>
	<nav class="social">
		<ul>
			<li><a href="https://x.com/canurb">Twitter</a></li>
			<li><a href="https://ca.linkedin.com/company/canadian-urban-institute">LinkedIn</a></li>
			<li><a href="https://www.instagram.com/canadianurbaninstitute/">Instagram</a></li>
			<li><a href="https://www.facebook.com/canurb/">Facebook</a></li>
		</ul>
	</nav>
</div>

<style>
	nav ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: row;
	}

	nav ul a {
		color: var(--brandLightBlue);
		text-decoration: none;
		padding-right: 2em;
		margin-bottom: 0.4em;
	}

	nav ul a:hover {
		color: #fff;
	}

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

	/* MOBILE FLEX COLUMN (STACKED) LAYOUT */

	@media only screen and (max-width: 768px) {
		#bar,
		.logo-group,
		nav ul {
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
		color: white;
	}

	.social {
		padding-bottom: 2em;
	}

	.footer-content {
		display: flex;
		flex-direction: row;
		padding: 1em;
		width: 80%;
		justify-content: space-between;
	}

	.footer-content img {
		height: 100px;
	}

	#divider {
		width: 80%;
		border: 0.1px solid white;
	}
</style>
