<script>
	import logo from '../assets/cui_logo.svg';
</script>

<div id="bar">
	<div id="logo">
		<a href="https://www.canurb.org"><img src={logo} alt="Canadian Urban Institute"></a>
	</div>
	<h2>Measuring Main Streets / RKI</h2>

</div>

<style>
	#bar {
		position: relative;
		height: 100px;
		background-color: #fff;
		width: 100%;
		min-width: 200px;
		display: flex;
		align-items:center;
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

	h2 {
    margin: 0 auto;
    font-family: 'Gelasio', serif;
    font-weight: 400;
    max-width: 450px;
    font-size: 28px;
    line-height: 30px;
    color: var(--brandLightBlue);
}
</style>