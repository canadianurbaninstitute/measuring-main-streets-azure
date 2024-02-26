<script>
	import cui from '../lib/assets/cui_logo_white.svg';
	import canada from '../lib/assets/canada_logo.svg';
	import environics from '../lib/assets/environics_logo.svg';
	import schoolofcities from '../lib/assets/soc_logo.svg';
	import opennorth from '../lib/assets/opennorth_logo.svg';




</script>

<div id="bar">
	<div id="logo-content">
	<p>
		This project (part of the Research Knowledge Initiative program from the Department of Housing,
		Infrastructure and Communities) was developed by the Canadian Urban Institute in partnership
		with Environics Analytics, the University of Toronto's School of Cities, and Open North.
	</p>
	<div class="logo-group">
	<img src={canada} alt="Canadian Urban Institute" />
	<a href="https://www.canurb.org"><img src={cui} alt="Canadian Urban Institute" /></a>
	</div>
	<div class="logo-group">
	<a href="https://schoolofcities.utoronto.ca/"><img src={schoolofcities} alt="School of Cities" /></a>
	<a href="https://environicsanalytics.com/en-ca/home"><img src={environics} alt="Environics Analytics" /></a>

	<a href="https://opennorth.ca/"><img src={opennorth} alt="Open North" /></a>
	</div>
	</div>
	<div id="menu">
		<nav>
			<ul>
				<li><a href="/map">X (Twitter)</a></li>
				<li><a href="/reports">Linkedin</a></li>
			</ul>
		</nav>
	</div>
</div>

<style>
	#menu {
		background-color: var(--brandDarkBlue);
		display: flex;
		justify-content: end;
		align-items: center;
	}

	nav ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
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
		width: 60%;
		margin: 1em;
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
		flex-direction: row;
		align-items: center;
		width: 100%;
		justify-content: space-between;
		background-color: var(--brandDarkBlue);
	}

	/* MOBILE FLEX COLUMN (STACKED) LAYOUT */

	@media only screen and (max-width: 768px) {
		#bar,
		#logo-group {
			flex-direction: column;
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
</style>
