<script>
	import logo from '../assets/cui_logo.svg';
</script>

<div id="bar">
	<div id="logo">
		<a href="https://www.canurb.org"><img src={logo} alt="Canadian Urban Institute"></a>
	</div>

</div>

<style>
	#bar {
		position: relative;
		height: 100px;
		background-color: #fff;
		width: 100%;
		min-width: 200px;
		display: flex;
	}

	#logo {
		margin: auto;
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
</style>