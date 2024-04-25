<script>
	import logo from '../lib/assets/logos/cui_logo.svg';
	import mms_logo from '../lib/assets/logos/mms_logo.svg';
	import mms_logo_alt from '../lib/assets/logos/mms_logo_alt.svg';
	import Icon from '@iconify/svelte';

	// Initial image source
	let imageSrc = mms_logo;

	// Function to change the image source on hover
	function onMouseOver() {
		imageSrc = mms_logo_alt;
	}

	// Function to revert the image source when the mouse leaves
	function onMouseOut() {
		imageSrc = mms_logo;
	}
</script>

<div id="bar">
	<div id="logo-group">
		<a href="/"
			><img
				src={imageSrc}
				alt="Measuring Main Streets"
				on:mouseover={onMouseOver}
				on:mouseout={onMouseOut}
				on:focus={onMouseOver}
				on:blur={onMouseOut}
			/>
		</a>
	</div>
	<div id="menu">
		<nav>
			<ul>
				<li><a href="/map">Main Street Map</a></li>
				<li class="dropdown">
					<a class="dropdown-title" href="/casestudies">
						Case Studies <Icon icon="icon-park-solid:down-one" /></a>
					<ul class="dropdown-menu">
						<li><a href="/casestudies/toronto">Toronto</a></li>
						<li><a href="/casestudies/montreal">Montreal</a></li>
						<li><a href="/casestudies/edmonton">Edmonton</a></li>
					</ul>
				</li>
				<li><a href="/reports">Reports</a></li>
				<li><a href="/tools">Tools</a></li>
				<li class="dropdown">
					<a class="dropdown-title" href="/about">
						About <Icon icon="icon-park-solid:down-one" /></a>
					<ul class="dropdown-menu" id="about-menu">
						<li><a href="/about">Platform</a></li>
						<li><a href="/about/guide">Guide</a></li>
						<li><a href="/about/faq">FAQ</a></li>
						<li><a href="/about/data-methodology">Data & Methodology</a></li>
						<li><a href="/about/team">Team</a></li>
						<li><a href="/about/contact">Contact</a></li>
					</ul>
				</li>
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
		color: var(--brandDarkBlue);
		text-decoration: none;
		padding-right: 2em;
		margin-bottom: 0.4em;
	}

	nav ul a:hover {
		color: var(--brandLightBlue);
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
		box-shadow: rgba(27, 31, 35, 0.04) 0px 1px 0px 0px,
			rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset;
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
		color: var(--brandDarkBlue);
		border-bottom: 1px solid #ddd;
	}

	.dropdown-menu li:hover {
		background-color: #eee;
		color: var(--brandLightBlue);
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

	#about-menu {
		right: 2em;
	}

	/* MOBILE FLEX COLUMN (STACKED) LAYOUT */

	@media only screen and (max-width: 768px) {
		#bar,
		#logo-group {
			flex-direction: column;
		}
	}

	img {
		height: 50px;
	}

	img:hover {
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
