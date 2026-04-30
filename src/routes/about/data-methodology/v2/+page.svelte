<script>
	import Icon from '@iconify/svelte';
	import { tick } from 'svelte';
	import Accordion from '../../../lib/ui/Accordion.svelte';
	import '../../../styles.css';
	// Logos
	import canada_logo from '../../../lib/assets/logos/canada_color.png';
	// Assets
	import mainstreets from '../../../lib/assets/graphics/mainstreets.svg';
	import vancouver_bg from '../../../lib/assets/graphics/vancouver-bg.png';

	let activeSection = $state('resilience');

	// Accordion states
	let faqs = $state({
		// Resilience
		'res-data': true,
		'res-meth': false,
		'res-ind': false,
		// TOD
		'tod-meth': false
	});

	async function scrollTo(id) {
		await tick();
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}

	function openAndScroll(id, section) {
		activeSection = section;
		faqs[id] = true;
		scrollTo(id);
	}
</script>

<main>
	<!-- Hero Section -->
	<div class="hero-section" style="background-image: url({vancouver_bg})">
		<div class="hero-content">
			<h1>DATA &<br /><span class="text-blue">METHODOLOGY</span></h1>
		</div>
	</div>

	<div class="container main-content">
		<div class="sidebar md:sticky md:top-10 h-full">
			<nav>
				<div class="nav-group">
					<h3>RESILIENCE ON MAIN</h3>
					<ul>
						<li>
							<button
								class:active={activeSection === 'resilience' && faqs['res-data']}
								onclick={() => openAndScroll('res-data', 'resilience')}
							>
								Data
							</button>
						</li>
						<li>
							<button
								class:active={activeSection === 'resilience' && faqs['res-meth']}
								onclick={() => openAndScroll('res-meth', 'resilience')}
							>
								Methodology
							</button>
						</li>
						<li>
							<button
								class:active={activeSection === 'resilience' && faqs['res-ind']}
								onclick={() => openAndScroll('res-ind', 'resilience')}
							>
								Indices
							</button>
						</li>
					</ul>
				</div>

				<div class="nav-group">
					<h3>TOD ON MAIN</h3>
					<ul>
						<li>
							<button
								class:active={activeSection === 'tod' && faqs['tod-meth']}
								onclick={() => openAndScroll('tod-meth', 'tod')}
							>
								Methodology
							</button>
						</li>
					</ul>
				</div>
			</nav>

			<div class="callout-box">
				<div class="callout-logos">
					<img src={mainstreets} />
					<img src={canada_logo} alt="Canada" />
				</div>
				<p>
					The Measuring Main Streets platform is a part of the Research Knowledge Initiative program
					from Housing, Infrastructure and Communities Canada.
				</p>
			</div>
		</div>

		<div class="content-area">
			<!-- Resilience on Main Section -->
			<section id="resilience-section">
				<div class="section-header">
					<h2>RESILIENCE ON MAIN</h2>
				</div>

				<div class="accordion-group">
					<!-- Data Accordion -->
					<Accordion bind:open={faqs['res-data']} id="res-data">
						<div slot="header" class="accordion-header">
							<h3>DATA</h3>
							<Icon icon={faqs['res-data'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								<div class="mb-12">
									<h4>1. Business and Civic Infrastructure Location Data</h4>
									<span class="eyebrow">Environics Analytics, 2023</span>
									<p>
										Business and Civic Infrastructure location data sourced from Environics Analytics
										provides the spatial location of all businesses and civic infrastructure tracked
										by InfoCanada.
									</p>
									<div class="highlight-box">
										<div class="stats-grid" style="grid-template-columns: 1fr 1fr; gap: 2rem;">
											<div>
												<h4 style="color: white; margin-bottom: 1rem;">Main Street Businesses</h4>
												<ul
													style="color: rgba(255,255,255,0.8); list-style: disc; padding-left: 1.5rem;"
												>
													<li>Retail</li>
													<li>Food & Drink</li>
													<li>Local Services</li>
												</ul>
											</div>
											<div>
												<h4 style="color: white; margin-bottom: 1rem;">Civic Infrastructure</h4>
												<ul
													style="color: rgba(255,255,255,0.8); list-style: disc; padding-left: 1.5rem;"
												>
													<li>Arts and Culture</li>
													<li>Education</li>
													<li>Healthcare</li>
													<li>Recreation Facilities</li>
													<li>Government and Community</li>
												</ul>
											</div>
										</div>
									</div>
								</div>

								<div class="mb-12">
									<h4>2. Demographic Data</h4>
									<span class="eyebrow">Environics Analytics DemoStats, 2023; Statistics Canada, 2021</span>
									<p>
										The demographic data combines proprietary data from Environics Analytics
										DemoStats, updated yearly, with open-source data from the 2021 census.
									</p>
								</div>

								<div>
									<h4>3. Mobile Visitor Count Data</h4>
									<span class="eyebrow">Environics Analytics MobileScapes, 2019 – 2022</span>
									<p>
										Visitor Count data is derived using Environics Analytics MobileScapes data, a
										mobile movement database developed from permission-based data collected using
										location-enabled mobile applications.
									</p>
								</div>
							</div>
						</div>
					</Accordion>

					<!-- Methodology Accordion -->
					<Accordion bind:open={faqs['res-meth']} id="res-meth">
						<div slot="header" class="accordion-header">
							<h3>METHODOLOGY</h3>
							<Icon icon={faqs['res-meth'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								<div class="mb-12">
									<h4>Creating Canada's Main Street Network</h4>
									<p>
										Creating a comprehensive main street network for Canada began with identifying
										segments of roads where clusters of Main Street Businesses and Civic
										Infrastructure are co-located and concentrated across the country.
									</p>

									<div class="table-container mt-8">
										<table style="font-size: 0.9rem;">
											<thead>
												<tr>
													<th>Group</th>
													<th>NAICS Code Selection</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td><strong>Food and Drink</strong></td>
													<td>7224 (Drinking places), 7225 (Restaurants)</td>
												</tr>
												<tr>
													<td><strong>Retail</strong></td>
													<td>4451 (Grocery), 4481 (Clothing), 4511 (Sporting Goods), 4531 (Florists)</td>
												</tr>
												<tr>
													<td><strong>Local Services</strong></td>
													<td>8121 (Personal Care), 5221 (Banking), 5411 (Legal), 8111 (Auto Repair)</td>
												</tr>
												<tr>
													<td><strong>Arts & Culture</strong></td>
													<td>519120 (Libraries), 711110 (Theatre), 712110 (Museums)</td>
												</tr>
												<tr>
													<td><strong>Education</strong></td>
													<td>611110 (Elementary), 611310 (Universities), 624410 (Childcare)</td>
												</tr>
												<tr>
													<td><strong>Healthcare</strong></td>
													<td>621111 (Physicians), 621210 (Dentists), 622110 (Hospitals)</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>

								<div class="mb-12">
									<h4>Attaching Data</h4>
									<p>
										After cleaning the Infrastructure and Road Networks, a spatial intersection was
										performed, attaching all main street businesses and civic infrastructure to all
										roads within 50 metres.
									</p>
								</div>

								<div>
									<h4>Identifying Main Streets</h4>
									<p>
										Main streets are identified as segments of road where a clustering of main street
										businesses and civic infrastructure exists, using Kernel Density Estimation
										(KDE).
									</p>
								</div>
							</div>
						</div>
					</Accordion>

					<!-- Indices Accordion -->
					<Accordion bind:open={faqs['res-ind']} id="res-ind">
						<div slot="header" class="accordion-header">
							<h3>INDICES</h3>
							<Icon icon={faqs['res-ind'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								<div class="mb-12">
									<h4>Independent Business Index</h4>
									<p>
										The Independent Business Index creates a scaled index of business independence
										using text analysis to apply a scale between 0 and 1 based on how many times a
										business name appears in the data.
									</p>
								</div>

								<div>
									<h4>Civic Infrastructure Index</h4>
									<p>
										The Civic Infrastructure Index (CII) assesses relative access to civic
										infrastructure within a defined catchment area by combining services' capacity
										with the local population's demand.
									</p>
								</div>
							</div>
						</div>
					</Accordion>
				</div>
			</section>

			<!-- TOD on Main Section -->
			<section id="tod-section" class="mt-32">
				<div class="section-header">
					<h2>TOD ON MAIN</h2>
				</div>

				<div class="accordion-group">
					<Accordion bind:open={faqs['tod-meth']} id="tod-meth">
						<div slot="header" class="accordion-header">
							<h3>METHODOLOGY</h3>
							<Icon icon={faqs['tod-meth'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								<h4>Expanding to Transit-Oriented Development</h4>
								<p>
									TOD on Main leverages the foundation of the Measuring Main Streets Platform to
									provide tools, case studies, and research focused on transit-driven growth.
								</p>
								<div class="quote">
									<p>
										The methodology involves identifying transit station areas and evaluating their
										potential for housing and complete community development.
									</p>
								</div>
								<p>Further technical methodology for Phase Two is coming soon.</p>
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
			<div class="cui-contact">
				<h3>HAVE MORE QUESTIONS?</h3>
				<div class="contact-grid">
					<div class="contact-item">
						<span class="label">ENQUIRIES</span>
						<p>Contact us at <a href="mailto:cui@canurb.org">cui@canurb.org</a></p>
					</div>
					<div class="contact-item">
						<span class="label">LEARN MORE</span>
						<p>See more of our work at <a href="https://www.canurb.org">www.canurb.org</a></p>
					</div>
					<div class="contact-item">
						<span class="label">CONNECT</span>
						<div class="social-icons">
							<Icon icon="fa6-brands:linkedin" />
							<Icon icon="fa6-brands:instagram" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>

<style>
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
		margin: 0;
		color: var(--brandDarkBlue);
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
		font-size: 1.2rem;
		border-bottom: 4px solid var(--brandLightBlue);
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
		font-size: 2.2rem;
		border-bottom: 4px solid var(--brandLightBlue);
		padding-bottom: 0.5rem;
		margin-bottom: 2rem;
		color: var(--brandDarkBlue);
		font-family: 'Gelasio', serif;
	}

	.eyebrow {
		font-size: 0.75rem;
		color: var(--brandLightBlue);
		font-weight: 700;
		margin-bottom: 0.5rem;
		text-transform: uppercase;
		display: block;
	}

	.text-content h4 {
		font-size: 1.5rem;
		color: var(--brandDarkBlue);
		margin-bottom: 0.5rem;
		font-family: 'Inter', sans-serif;
		font-weight: 700;
	}

	.text-content p {
		font-size: 1.1rem;
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	/* Highlight Box */
	.highlight-box {
		background-color: var(--brandDarkBlue);
		color: white;
		padding: 2.5rem;
		border-radius: 8px;
		margin: 2rem 0;
	}

	/* Quote */
	.quote {
		margin: 3rem 0;
		padding: 2rem;
		background-color: #f0f9ff;
		border-radius: 8px;
		border-left: 6px solid var(--brandLightBlue);
	}

	/* Table Styling */
	.table-container {
		width: 100%;
		overflow-x: auto;
		border: 1px solid #ddd;
		border-radius: 8px;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		background: white;
	}

	th {
		background-color: #f9f9f9;
		text-align: left;
		padding: 1rem;
		font-weight: 700;
		color: var(--brandDarkBlue);
		border-bottom: 2px solid #eee;
		text-transform: uppercase;
		font-size: 0.8rem;
		letter-spacing: 0.05em;
	}

	td {
		padding: 1rem;
		border-bottom: 1px solid #eee;
		font-size: 0.95rem;
	}

	/* Accordion Header Override */
	.accordion-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem 0;
		border-top: 1px solid #ddd;
		cursor: pointer;
	}

	.accordion-header h3 {
		margin: 0;
		font-size: 1.6rem;
		font-weight: 800;
		color: var(--brandDarkBlue);
		letter-spacing: 0.02em;
	}

	.accordion-body {
		padding-bottom: 2rem;
	}

	/* CUI Section */
	.cui-section {
		padding: 8rem 0;
		background-size: cover;
		background-position: center;
		position: relative;
		border-top: 1px solid #ddd;
	}

	.cui-section::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
	}

	.cui-flex {
		position: relative;
		z-index: 1;
		display: flex;
		justify-content: center;
	}

	.cui-contact {
		background-color: white;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
		padding: 4rem;
		border-radius: 2rem;
		width: 100%;
		max-width: 800px;
	}

	.cui-contact h3 {
		margin-bottom: 2rem;
		color: var(--brandDarkBlue);
		font-family: 'Gelasio', serif;
		font-size: 2rem;
	}

	.contact-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 3rem;
	}

	.contact-item .label {
		display: block;
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--brandLightBlue);
		text-transform: uppercase;
		margin-bottom: 0.5rem;
		letter-spacing: 0.1em;
	}

	.contact-item p {
		margin: 0;
		font-size: 1.1rem;
		color: var(--brandDarkBlue);
		font-weight: 500;
	}

	.contact-item a {
		color: var(--brandLightBlue);
		text-decoration: none;
	}

	.social-icons {
		display: flex;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	.mb-12 { margin-bottom: 3rem; }
	.mt-32 { margin-top: 8rem; }

	@media (max-width: 992px) {
		.main-content { flex-direction: column; }
		.sidebar { width: 100%; margin-bottom: 3rem; }
		.hero-content h1 { font-size: 3.5rem; }
	}
</style>
