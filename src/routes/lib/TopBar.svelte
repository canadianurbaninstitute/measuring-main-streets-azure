<script>
	import logo from '../assets/cui_logo.svg';
</script>

<div id="bar">
<div id="logo-group">
	<div id="logo">
		<a href="https://www.canurb.org"><img src={logo} alt="Canadian Urban Institute" /></a>
	</div>
	<h2>Measuring Main Streets</h2>
</div>
<div id="menu">
	<nav>
		<ul>
			<li><a href="#">Map</a></li>
			<li><a href="#">Case Studies</a></li>
			<li><a href="#">Reports</a></li>
			<li><a href="#">Toolkit</a></li>

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
		width:50%;
	}

	nav ul {
		list-style: none;
		margin: 0;
		padding: 0;
		padding-right: 6px;
		display: flex;
	}

	nav ul a {
		color: var(--brandLightBlue);
		text-decoration: none;
		padding-right: 30px;
	}

	nav ul li {
		margin-left: 0px;
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

	a {
		color: black;
	}
	a:hover {
		opacity: 0.7;
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
		line-height: 30px;
		color: var(--brandLightBlue);
	}
</style>
