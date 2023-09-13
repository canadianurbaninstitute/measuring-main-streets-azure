<script>
	import logo from '../lib/assets/cui_logo.svg';
	import Icon from '@iconify/svelte';
</script>

<div id="bar">
<div id="logo-group">
	<div id="logo">
		<a href="https://www.canurb.org"><img src={logo} alt="Canadian Urban Institute" /></a>
	</div>
	<a href="/"><h2>Measuring Main Streets</h2></a>
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

		</ul>
	</nav>
</div>
</div>

<style>
	#menu {
		background-color: #fff;
		height: 100px;
		display: flex;
		justify-content: end;
		align-items: center;
		width: 50%;
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
		z-index: 1;
		border-radius: 0.5em;
		box-shadow: rgba(27, 31, 35, 0.04) 0px 1px 0px 0px,rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset;
	}


	.dropdown-menu li:last-child {
		border-radius: 0 0 0.5em 0.5em;
	}

	.dropdown-menu li:first-child {
		border-radius: 0.5em 0.5em 0 0;
	}


	.dropdown-menu li {
		background-color: white;
		padding: 0.5em;
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
	}

	.dropdown-title {
		display: flex;
		align-items: center;
	}


	#logo-group {
		position: relative;
		height: 100px;
		background-color: #fff;
		width: 50%;
		min-width: 200px;
		display: flex;
		align-items: center;
	}

	#bar {
		display: flex;
	}

	#logo {
		margin: 2em;
		max-width: 230px;
		height: 50px;
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

	h2 {
		margin: 0;
		font-family: 'Gelasio', serif;
		font-weight: 400;
		max-width: 450px;
		color: var(--brandLightBlue);
	}

	h2:hover {
		color: var(--brandDarkBlue);
	}
</style>
