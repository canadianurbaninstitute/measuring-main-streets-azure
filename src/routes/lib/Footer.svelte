<script>
	import logo from '../lib/assets/cui_logo.svg';
</script>

<div id="bar">
<div id="logo-group">
	<div id="logo">
		<a href="https://www.canurb.org"><img src={logo} alt="Canadian Urban Institute" /></a>
	</div>
</div>
<div id="menu">
	<nav>
		<ul>
			<li><a href="/map">Map</a></li>
			<li><a href="/reports">Reports</a></li>

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

	#logo-group {
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

		#bar, #logo-group {
		flex-direction: column;

		}
		
}

	#logo {
		margin: 1em;
		max-width: 230px;
		height: 50px;
		filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(281deg) brightness(104%) contrast(103%);
	}

	img {
		height: 50px;
		color: blue;
	}
	
	img:hover {
		height: 50px;
		opacity: 0.5;
		cursor: pointer;
	}

</style>
