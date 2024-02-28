<script>
	import logo from '../lib/assets/cui_logo.svg';
	import mms_logo from '../lib/assets/mms_logo.svg';
	import Icon from '@iconify/svelte';
</script>

<div id="bar">
<div id="logo-group">
	<!-- <div id="logo">
		<a href="https://www.canurb.org"><img src={logo} alt="Canadian Urban Institute" /></a>
	</div> -->
	<a href="/"><img src={mms_logo} alt="Measuring Main Streets"/></a>
</div>
<div id="menu">
	<nav>
		<ul>
			<li><a href="/map">Map</a></li>
			<li class="dropdown">
				<a class="dropdown-title" href="/casestudies">Case Studies <Icon icon="icon-park-solid:down-one" /></a>
				<ul class="dropdown-menu">
				  <li><a href="/casestudies/toronto">Toronto</a></li>
				  <li><a href="/casestudies/montreal">Montreal</a></li>
				  <li><a href="/casestudies/edmonton">Edmonton</a></li>
				</ul>
			</li>
			<li><a href="/reports">Reports</a></li>
			<li><a href="/tools">Tools</a></li>
			<li><a href="/about">About</a></li>

		</ul>
	</nav>
</div>
</div>

<style>
	#menu {
		background-color: #fff;
		/* height: 10vh; */
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
		color: var(--brandDarkBlue);
	}

	a {
		text-decoration: none;
	}

	nav ul li.dropdown:hover .dropdown-menu {
		display: block;
	}

	.dropdown-menu {
		display: none;
		border-top: solid 1px #ddd;
		border-left: solid 1px #ddd;
		border-right: solid 1px #ddd;
		position: absolute;
		border-radius: 0.5em;
		box-shadow: rgba(27, 31, 35, 0.04) 0px 1px 0px 0px,rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset;
		z-index: 3;

	}


	.dropdown-menu li:last-child {
		border-radius: 0 0 0.5em 0.5em;
	}

	.dropdown-menu li:first-child {
		border-radius: 0.5em 0.5em 0 0;
	}


	.dropdown-menu li {
		background-color: white;
		z-index: 0;
		color: var(--brandLightBlue);
		border-bottom: 1px solid #ddd;
	}


	.dropdown-menu li:hover {
		background-color: #eee;
		color: var(--brandDarkBlue);
		cursor: pointer;
	}

	.dropdown-menu li a {
		color: var(--brandWhite);
		text-decoration: none;
		display: flex;
		margin: 0;
		padding: 0.5em;
	}

	.dropdown-title {
		display: flex;
		align-items: center;
	}


	#logo-group {
		position: relative;
		display: flex;
		align-items: center;
		flex-direction: row;
		padding: 1em 1em 1em 2em;
	}

	#bar {
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid #eee;
		align-items: center;
		width: 100%;
		justify-content: space-between;

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
	}

	img {
		height: 70px;
	}
	
	img:hover {
		opacity: 0.5;
		cursor: pointer;
	}

	/* h2 {
		margin: 0;
		font-family: 'Gelasio', serif;
		font-weight: 400;
		max-width: 450px;
		color: var(--brandLightBlue);
	}

	h2:hover {
		color: var(--brandDarkBlue);
	} */
</style>
