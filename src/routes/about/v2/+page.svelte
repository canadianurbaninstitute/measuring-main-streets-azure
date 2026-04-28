<script>
	import Icon from '@iconify/svelte';
	import Accordion from '../../lib/ui/Accordion.svelte';
	import Footer from '../../lib/ui/Footer.svelte';
	import '../../styles.css';
	// Logos
	import canada_logo from '../../lib/assets/logos/canada_logo.svg';
	// Assets
	import montreal_bg from '../../lib/assets/graphics/montreal-bg.png';
	import vancouver_bg from '../../lib/assets/graphics/vancouver-bg.png';

	let activeSection = $state('about');
	let activeSubSection = $state('resilience');

	let aboutResilienceOpen = $state(true);
	let aboutTodOpen = $state(false);
	let teamResilienceOpen = $state(false);
	let teamTodOpen = $state(false);

	function scrollTo(id) {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<main>
	<!-- Hero Section -->
	<div class="hero-section" style="background-image: url({vancouver_bg})">
		<div class="hero-content">
			<h1>ABOUT<br />MEASURING<br /><span class="text-blue">MAIN STREETS</span></h1>
		</div>
	</div>

	<div class="container main-content">
		<div class="sidebar">
			<nav>
				<div class="nav-group">
					<h3>ABOUT</h3>
					<ul>
						<li>
							<button
								class:active={activeSection === 'about' && activeSubSection === 'resilience'}
								onclick={() => {
									activeSection = 'about';
									activeSubSection = 'resilience';
									aboutResilienceOpen = true;
									scrollTo('about-resilience');
								}}
							>
								Main Street Resilience
							</button>
						</li>
						<li>
							<button
								class:active={activeSection === 'about' && activeSubSection === 'tod'}
								onclick={() => {
									activeSection = 'about';
									activeSubSection = 'tod';
									aboutTodOpen = true;
									scrollTo('about-tod');
								}}
							>
								Transit-Oriented Development
							</button>
						</li>
					</ul>
				</div>

				<div class="nav-group">
					<h3>TEAM</h3>
					<ul>
						<li>
							<button
								class:active={activeSection === 'team' && activeSubSection === 'resilience'}
								onclick={() => {
									activeSection = 'team';
									activeSubSection = 'resilience';
									teamResilienceOpen = true;
									scrollTo('team-resilience');
								}}
							>
								Main Street Resilience
							</button>
						</li>
						<li>
							<button
								class:active={activeSection === 'team' && activeSubSection === 'tod'}
								onclick={() => {
									activeSection = 'team';
									activeSubSection = 'tod';
									teamTodOpen = true;
									scrollTo('team-tod');
								}}
							>
								Transit-Oriented Development
							</button>
						</li>
					</ul>
				</div>
			</nav>

			<div class="callout-box">
				<div class="callout-logos">
					<Icon
						icon="mdi:office-building"
						width="60"
						height="60"
						style="color: var(--brandDarkBlue);"
					/>
					<img src={canada_logo} alt="Canada" />
				</div>
				<p>
					The Measuring Main Streets platform is a part of the Research Knowledge Initiative program
					from Housing, Infrastructure and Communities Canada.
				</p>
			</div>
		</div>

		<div class="content-area">
			<section id="about-section">
				<div class="section-header">
					<h2>ABOUT</h2>
				</div>

				<div class="accordion-group">
					<Accordion bind:open={aboutResilienceOpen} id="about-resilience">
						<div slot="header" class="accordion-header">
							<div>
								<span class="eyebrow">PHASE ONE</span>
								<h3>MAIN STREET RESILIENCE</h3>
							</div>
							<Icon icon={aboutResilienceOpen ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="highlight-box">
								<h4>MAIN STREETS ARE THE BACKBONE OF CANADIAN SOCIETY.</h4>
							</div>

							<div class="stats-grid">
								<div class="stats-text">
									<p>
										<strong>85% of Canadians</strong> living within one kilometer of a main street.
										These streets are home to <strong>280,000 businesses</strong>, providing
										<strong>1.9 million jobs</strong>
										and generating <strong>$300 billion</strong> in annual revenue. They also house
										over <strong>98,000</strong> community and civic infrastructure assets.
									</p>
								</div>
								<div class="stats-image">
									<img src={montreal_bg} alt="Map graphic" />
								</div>
							</div>

							<div class="text-content">
								<p>
									However, planners, developers, and municipal leaders often consider investment
									decisions based on individual assets rather than the inter-relationship of civic
									assets, housing and other uses that can be anchored to a main street as the spine
									of a community. This narrow approach risks compromising the livability of
									communities by neglecting the scale at which residents and visitors understand and
									experience a neighbourhood/place.
								</p>
								<p>
									In response, The Canadian Urban Institute (CUI) has developed a groundbreaking
									toolkit on the newly released Measuring Main Streets platform. These resources,
									backed by two years of research funded by Housing, Infrastructure and Communities
									Canada, offer city builders the means to make informed investments at the main
									street scale to enhance community, resilience, and equity outcomes.
								</p>

								<blockquote class="quote">
									<p>
										“Without the wider lens of neighborhoods and communities, it’s nearly impossible
										to assess the health and vitality of our most important places,” says Jennifer
										Barrett, Managing Director of Programs at CUI. “But up until now, there hasn’t
										been a way to capture the state of a whole community – the data is often
										inaccessible or fragmented.”
									</p>
									<cite>Jennifer Barrett, Managing Director of Programs at CUI</cite>
								</blockquote>

								<p>
									The Measuring Main Streets tool aims to include every main street across Canada,
									allowing users to evaluate housing, services, civic infrastructure, and more all
									in one place. This is the first research tool to use main streets as the primary
									unit of analysis, allowing any user to make the case for their main street.
								</p>

								<blockquote class="quote">
									<p>
										“Main streets are the cornerstone of ‘complete communities’, where Canadians can
										live, work, and play all within their local neighbourhood,” adds Mary W. Rowe,
										CEO of CUI. “They are our economic powerhouses and social connective tissue.
										Decision-makers should invest in solutions to issues like housing, public
										safety, and sustainability at the scale of the main street, and now there’s a
										way to do it.”
									</p>
									<cite>Mary W. Rowe, CEO of CUI</cite>
								</blockquote>

								<p>
									The Canadian Urban Institute has demonstrated a long-time commitment to Canada’s
									main streets. From Bring Back Main Street in 2018, a nationally coordinated
									research and action campaign for pandemic recovery, to two rounds of My Main
									Street, a $15-million program empowering main street businesses and community
									activations. Since the pandemic, CUI has engaged with diverse stakeholders
									including the Main Street Action Network to bolster Canada’s main streets, making
									Measuring Main Streets the latest effort in a push to place main streets at the
									forefront of thought and action in urbanism.
								</p>
								<p>
									Using a data-driven approach, Measuring Main Streets explores what’s working,
									what’s not, and what’s next for Canada’s main streets, empowering city builders
									from the neighborhood to the national scale.
								</p>
							</div>
						</div>
					</Accordion>

					<Accordion bind:open={aboutTodOpen} id="about-tod">
						<div slot="header" class="accordion-header">
							<h3>TRANSIT-ORIENTED DEVELOPMENT</h3>
							<Icon icon={aboutTodOpen ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								<p>
									Canada’s housing system is failing to meet the needs of Canadians, and we need
									solutions to increase production and expand available options to make housing
									accessible and affordable everyone from communities of all sizes. How can
									Transit-Oriented Development (TOD) be catalyzed to meet Canada’s ambitious housing
									goals, while contributing to the creation of equitable, vibrant, complete
									communities?
								</p>
								<p>
									Transit-Oriented Development (TOD) refers to the creation of compact, mixed-use,
									walkable communities centered around high-quality transit systems. This approach
									to urban planning aims to reduce reliance on private vehicles, lower greenhouse
									gas emissions, and create more livable, sustainable communities.
								</p>
								<p>
									Our research explores how TOD can be implemented effectively across Canada,
									considering the unique challenges and opportunities in different regions. We focus
									on identifying best practices for zoning, infrastructure investment, and community
									engagement to ensure that TOD projects deliver on their promise of creating
									equitable and vibrant complete communities.
								</p>
							</div>
						</div>
					</Accordion>
				</div>
			</section>

			<section id="team-section">
				<div class="section-header">
					<h2>TEAM</h2>
				</div>

				<div class="accordion-group">
					<Accordion bind:open={teamResilienceOpen} id="team-resilience">
						<div slot="header" class="accordion-header">
							<h3>MAIN STREET RESILIENCE</h3>
							<Icon icon={teamResilienceOpen ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								<p>
									The Main Street Resilience team is composed of dedicated researchers, urban
									planners, and data analysts committed to understanding and supporting the backbone
									of Canadian communities.
								</p>
								<ul>
									<li><strong>Jennifer Barrett</strong> - Managing Director of Programs at CUI</li>
									<li><strong>Mary W. Rowe</strong> - CEO of CUI</li>
									<li>...and many other contributors from across Canada.</li>
								</ul>
							</div>
						</div>
					</Accordion>

					<Accordion bind:open={teamTodOpen} id="team-tod">
						<div slot="header" class="accordion-header">
							<h3>TRANSIT-ORIENTED DEVELOPMENT</h3>
							<Icon icon={teamTodOpen ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								<p>
									Our Transit-Oriented Development team works at the intersection of mobility,
									housing, and sustainability to create complete communities.
								</p>
								<ul>
									<li><strong>Team Member A</strong> - Urban Planner</li>
									<li><strong>Team Member B</strong> - Data Scientist</li>
									<li><strong>Team Member C</strong> - Policy Analyst</li>
								</ul>
							</div>
						</div>
					</Accordion>
				</div>
			</section>
		</div>
	</div>

	<!-- CUI Section -->
	<div class="cui-section" style="background-image: url({vancouver_bg})">
		<div class="container cui-flex">
			<div class="cui-about">
				<h3>ABOUT THE CANADIAN URBAN INSTITUTE</h3>
				<p>
					Helping communities thrive since 1990, CUI is a national charity driving place-based
					solutions. With over 35 years of experience in place-based planning, CUI brings together
					data, policy, and local insight to help communities be resilient, vibrant, and prosperous.
				</p>
			</div>
			<div class="cui-contact">
				<h3>CONTACT US</h3>

				<div class="contact-grid">
					<div class="contact-item">
						<span class="label">INQUIRIES?</span>
						<p>Contact us at <a href="mailto:cui@canurb.org">cui@canurb.org</a></p>
					</div>

					<div class="contact-item">
						<span class="label">NEWSLETTER</span>
						<p>Subscribe to the Canadian Urban Institute newsletter.</p>
					</div>

					<div class="contact-item">
						<span class="label">LEARN MORE</span>
						<p>See more of our work at <a href="https://www.canurb.org">www.canurb.org</a></p>
					</div>

					<div class="contact-item">
						<span class="label">CONNECT</span>
						<div class="social-icons">
							<Icon icon="fa6-brands:linkedin" />
							<Icon icon="fa6-brands:x-twitter" />
							<Icon icon="fa6-brands:instagram" />
							<Icon icon="fa6-brands:facebook" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>

<Footer />

<style>
	main {
		width: 100%;
		overflow-x: hidden;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	/* Hero Section */
	.hero-section {
		height: 450px;
		background-size: cover;
		background-position: center;
		display: flex;
		align-items: center;
		padding: 0;
		position: relative;
		border-bottom: 1px solid #ddd;
	}

	.hero-section::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(90deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.4) 100%);
	}

	.hero-content {
		position: relative;
		z-index: 1;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
		padding: 0 2rem;
	}

	.hero-content h1 {
		font-size: 5rem;
		line-height: 0.9;
		margin: 0;
		color: var(--brandDarkBlue);
		font-weight: 800;
		letter-spacing: -0.02em;
	}

	.text-blue {
		color: var(--brandLightBlue);
	}

	/* Main Content Layout */
	.main-content {
		display: flex;
		gap: 5rem;
		padding-top: 4rem;
		padding-bottom: 6rem;
	}

	.sidebar {
		width: 280px;
		flex-shrink: 0;
	}

	.content-area {
		flex-grow: 1;
	}

	/* Sidebar Nav */
	.nav-group {
		margin-bottom: 3.5rem;
	}

	.nav-group h3 {
		font-size: 1.4rem;
		border-bottom: 3px solid var(--brandLightBlue);
		padding-bottom: 0.75rem;
		margin-bottom: 1.5rem;
		color: var(--brandDarkBlue);
		letter-spacing: 0.05em;
	}

	.nav-group ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.nav-group li {
		margin-bottom: 1rem;
	}

	.nav-group button {
		background: none;
		border: none;
		padding: 0;
		font-family: inherit;
		font-size: 1.1rem;
		color: var(--brandDarkBlue);
		cursor: pointer;
		text-align: left;
		transition: all 0.2s;
		width: 100%;
	}

	.nav-group button:hover {
		color: var(--brandLightBlue);
		padding-left: 5px;
	}

	.nav-group button.active {
		color: var(--brandLightBlue);
		font-weight: 700;
	}

	/* Callout Box */
	.callout-box {
		background-color: #d8f1fb;
		padding: 2.5rem 1.5rem;
		border-radius: 4px;
		margin-top: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.callout-logos {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.callout-logos img {
		height: 30px;
	}

	.callout-box p {
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--brandDarkBlue);
		margin: 0;
		font-weight: 600;
	}

	/* Content Area */
	.section-header h2 {
		font-size: 2rem;
		border-bottom: 2px solid var(--brandLightBlue);
		padding-bottom: 0.5rem;
		margin-bottom: 2rem;
	}

	#team-section {
		margin-top: 4rem;
	}

	/* Accordion Styling */
	.accordion-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 2rem 0;
		border-top: 1px solid #ddd;
		cursor: pointer;
	}

	.accordion-header h3 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--brandDarkBlue);
		flex-grow: 1;
		font-family: 'Inter', sans-serif;
	}

	.accordion-header :global(svg) {
		font-size: 2rem;
		color: var(--brandDarkBlue);
	}

	.eyebrow {
		font-size: 0.75rem;
		color: var(--brandLightBlue);
		font-weight: 700;
		margin-bottom: 0.25rem;
		display: block;
	}

	.accordion-body {
		padding: 2rem 0;
	}

	/* Highlight Box */
	.highlight-box {
		background-color: var(--brandDarkBlue);
		color: white;
		padding: 2rem;
		margin-bottom: 2rem;
	}

	.highlight-box h4 {
		color: white;
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
		text-transform: none;
	}

	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		margin-bottom: 2rem;
		align-items: center;
	}

	.stats-text p {
		font-size: 1.1rem;
		line-height: 1.6;
	}

	.stats-image img {
		width: 100%;
		border-radius: 4px;
	}

	/* Quote */
	.quote {
		margin: 3rem 0;
		padding: 2rem;
		background-color: #f0f9ff;
		border-radius: 8px;
		position: relative;
	}

	.quote::before {
		content: '“';
		position: absolute;
		top: 1rem;
		left: 1rem;
		font-size: 4rem;
		color: var(--brandLightBlue);
		opacity: 0.2;
		line-height: 1;
	}

	.quote p {
		font-style: italic;
		font-size: 1.1rem;
		margin-bottom: 1rem;
	}

	.cite {
		display: block;
		font-weight: 700;
		font-size: 0.9rem;
		color: var(--brandDarkBlue);
	}

	/* CUI Section */
	.cui-section {
		background-size: cover;
		background-position: center;
		padding: 6rem 0;
		position: relative;
	}

	.cui-section::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(255, 255, 255, 0.9);
	}

	.cui-flex {
		position: relative;
		z-index: 1;
		display: flex;
		gap: 4rem;
	}

	.cui-about,
	.cui-contact {
		flex: 1;
	}

	.cui-about h3,
	.cui-contact h3 {
		font-size: 2rem;
		margin-bottom: 2rem;
		color: var(--brandDarkBlue);
		font-family: 'Gelasio', serif;
	}

	.cui-about p {
		font-size: 1.2rem;
		line-height: 1.6;
		max-width: 500px;
	}

	.contact-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}

	.label {
		display: block;
		color: var(--brandLightBlue);
		font-weight: 800;
		font-size: 0.85rem;
		margin-bottom: 0.5rem;
		letter-spacing: 0.05em;
	}

	.contact-item {
		margin-bottom: 1rem;
	}

	.contact-item p {
		margin: 0;
		font-weight: 600;
		color: var(--brandDarkBlue);
	}

	.social-icons {
		display: flex;
		gap: 1.5rem;
		font-size: 1.25rem;
		color: var(--brandLightBlue);
		margin-top: 0.5rem;
	}

	.social-icons :global(svg) {
		cursor: pointer;
		transition: transform 0.2s;
	}

	.social-icons :global(svg:hover) {
		transform: scale(1.2);
		color: var(--brandDarkBlue);
	}

	@media (max-width: 992px) {
		.main-content,
		.cui-flex {
			flex-direction: column;
		}

		.sidebar {
			width: 100%;
		}

		.stats-grid {
			grid-template-columns: 1fr;
		}

		.hero-section {
			padding: 0 2rem;
		}

		.hero-content h1 {
			font-size: 3rem;
		}
	}
</style>
