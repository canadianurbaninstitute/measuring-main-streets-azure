<script>
	import '../styles.css';
	import cui from '../lib/assets/logos/cui_logo_white.svg';
	import canada from '../lib/assets/logos/canada_logo.svg';
	import environics from '../lib/assets/logos/environics_logo.svg';
	import schoolofcities from '../lib/assets/logos/soc_logo.svg';
	import opennorth from '../lib/assets/logos/opennorth_logo.svg';
	import collage from '../lib/assets/graphics/MMS-collage.jpg';
	import Footer from '../lib/ui/Footer.svelte';
</script>

<div class="hero">
	<h1>About Measuring Main Streets</h1>
	<div class="subtitle" style="max-width: 80%;">
		<h2>
			The Measuring Main Streets platform is a part of the Research Knowledge Initiative program
			from Housing, Infrastructure and Communities Canada.
		</h2>
	</div>
	<p>
		Main streets are the backbone of Canadian society, with 85% of Canadians living within one
		kilometer of a main street. These streets are home to 280,000 businesses, providing 1.9 million
		jobs and generating $300 billion in annual revenue. They also house over 98,000 community and
		civic infrastructure assets.
	</p>
	<p>
		However, planners, developers, and municipal leaders often consider investment decisions based
		on individual assets rather than the inter-relationship of civic assets, housing and other uses
		that can be anchored to a main street as the spine of a community. This narrow approach risks
		compromising the livability of communities by neglecting the scale at which residents and
		visitors understand and experience a neighbourhood/place.
	</p>
	<p>
		In response, The Canadian Urban Institute (CUI) has developed a groundbreaking toolkit on the
		newly released Measuring Main Streets platform. These resources, backed by two years of research
		funded by Housing, Infrastructure and Communities Canada, offer city builders the means to make
		informed investments at the main street scale to enhance community, resilience, and equity
		outcomes.
	</p>
	<p>
		“Without the wider lens of neighborhoods and communities, it’s nearly impossible to assess the
		health and vitality of our most important places,” says Jennifer Barrett, Managing Director of
		Programs at CUI. “But up until now, there hasn’t been a way to capture the state of a whole
		community – the data is often inaccessible or fragmented.”
	</p>
	<p>
		The Measuring Main Streets tool aims to include every main street across Canada, allowing users
		to evaluate housing, services, civic infrastructure, and more all in one place. This is the
		first research tool to use main streets as the primary unit of analysis, allowing any user to
		make the case for their main street.
	</p>
	<p>
		“Main streets are the cornerstone of ‘complete communities’, where Canadians can live, work, and
		play all within their local neighbourhood,” adds Mary W. Rowe, CEO of CUI. “They are our
		economic powerhouses and social connective tissue. Decision-makers should invest in solutions to
		issues like housing, public safety, and sustainability at the scale of the main street, and now
		there’s a way to do it.”
	</p>
	<p>
		The Canadian Urban Institute has demonstrated a long-time commitment to Canada’s main streets.
		From Bring Back Main Street in 2018, a nationally coordinated research and action campaign for
		pandemic recovery, to two rounds of My Main Street, a $15-million program empowering main street
		businesses and community activations. Since the pandemic, CUI has engaged with diverse
		stakeholders including the Main Street Action Network to bolster Canada’s main streets, making
		Measuring Main Streets the latest effort in a push to place main streets at the forefront of
		thought and action in urbanism.
	</p>
	<p>
		Using a data-driven approach, Measuring Main Streets explores what’s working, what’s not, and
		what’s next for Canada’s main streets, empowering city builders from the neighborhood to the
		national scale.
	</p>
</div>

<div id="logo-content">
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

<div class="collage-image-container">
	<img src={collage} alt="collage" id="collage" />
</div>

<Footer />

<style>
	a {
		text-decoration: none;
	}

	.logo-group {
		position: relative;
		display: flex;
		align-items: center;
		flex-direction: row;
		padding: 2em;
		margin: 1em 0 1em 0;
		justify-content: space-around;
	}

	#collage {
		width: 100%;
		margin-top: 1em;
	}

	/* MOBILE FLEX COLUMN (STACKED) LAYOUT */

	@media only screen and (max-width: 768px) {
		.logo-group {
			flex-direction: column;
			text-align: center;
		}
	}

	.logo-group img {
		height: 60px;
		padding: 0.5em;
		filter: brightness(0) saturate(100%);
	}

	a:hover {
		opacity: 0.5;
		cursor: pointer;
	}

	@media only screen and (min-width: 768px) {
		p {
			max-width: 80%;
		}

		.hero {
			margin: 2em 15em 2em 15em;
		}
	}
</style>
