<script>
	import { page } from '$app/stores';
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
		'what-is-mms': true,
		'what-is-main-street': false,
		'why-important': false,
		'data-source': false,
		'who-created': false,
		'missing-street': false,
		'create-case-study': false,
		'choose-regions': false,
		'my-main-street': false,
		'what-is-tod': false,
		'what-are-mtsas': false,
		'tod-partners': false
	});

	async function scrollTo(id) {
		await tick();
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}

	$effect(() => {
		const hash = $page.url.hash.replace('#', '');
		if (hash) {
			if (hash === 'what-is-mms') {
				faqs['what-is-mms'] = true;
				activeSection = 'resilience';
			} else if (hash === 'what-is-main-street') {
				faqs['what-is-main-street'] = true;
				activeSection = 'resilience';
			} else if (hash === 'why-important') {
				faqs['why-important'] = true;
				activeSection = 'resilience';
			} else if (hash === 'data-source') {
				faqs['data-source'] = true;
				activeSection = 'resilience';
			} else if (hash === 'who-created') {
				faqs['who-created'] = true;
				activeSection = 'resilience';
			} else if (hash === 'missing-street') {
				faqs['missing-street'] = true;
				activeSection = 'resilience';
			} else if (hash === 'create-case-study') {
				faqs['create-case-study'] = true;
				activeSection = 'resilience';
			} else if (hash === 'choose-regions') {
				faqs['choose-regions'] = true;
				activeSection = 'resilience';
			} else if (hash === 'my-main-street') {
				faqs['my-main-street'] = true;
				activeSection = 'resilience';
			} else if (hash === 'what-is-tod') {
				faqs['what-is-tod'] = true;
				activeSection = 'tod';
			} else if (hash === 'what-are-mtsas') {
				faqs['what-are-mtsas'] = true;
				activeSection = 'tod';
			} else if (hash === 'tod-partners') {
				faqs['tod-partners'] = true;
				activeSection = 'tod';
			}
			scrollTo(hash);
		}
	});
</script>

<main>
	<!-- Hero Section -->
	<div class="hero-section" style="background-image: url({vancouver_bg})">
		<div class="hero-content">
			<h1>FREQUENTLY<br />ASKED<br /><span class="text-blue">QUESTIONS</span></h1>
		</div>
	</div>

	<div class="container main-content">
		<div class="sidebar lg:sticky lg:top-10 h-full">
			<nav>
				<div class="nav-group">
					<h3>PROJECT PHASES</h3>
					<ul>
						<li>
							<button
								class:active={activeSection === 'resilience'}
								onclick={() => {
									activeSection = 'resilience';
									scrollTo('resilience-section');
								}}
							>
								Resilience on Main
							</button>
						</li>
						<li>
							<button
								class:active={activeSection === 'tod'}
								onclick={() => {
									activeSection = 'tod';
									scrollTo('tod-section');
								}}
							>
								TOD on Main
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
			<!-- Resilience Section -->
			<section id="resilience-section">
				<div class="section-header">
					<span class="eyebrow">Round One</span>
					<h2>RESILIENCE ON MAIN</h2>
				</div>

				<div class="accordion-group">
					<Accordion bind:open={faqs['what-is-mms']} id="what-is-mms">
						<div slot="header" class="accordion-header">
							<h3>What is Measuring Main Streets?</h3>
							<Icon icon={faqs['what-is-mms'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								<p>
									The Measuring Main Streets platform is a part of the Research Knowledge Initiative
									program from Housing, Infrastructure and Communities Canada. It is developed by
									the Canadian Urban Institute with support from our partners at Environics
									Analytics and Open North.
								</p>
								<p>The platform is constructed around four interrelated components:</p>
								<ul style="list-style: disc; padding-left: 1.5rem; margin-bottom: 1.5rem;">
									<li>
										An interactive national map that provides descriptive data for every main street
										in the country.
									</li>
									<li>
										A set of 30 full case studies across 10 regions (Toronto; Montreal; Edmonton) as
										well as 30 partial case studies (data only).
									</li>
									<li>
										A set of analytical research briefs and reports that provide sensemaking and
										point towards potential policy interventions.
									</li>
									<li>
										A set of smart tools and recommendations to inform main street resiliency and
										future civic infrastructure investment.
									</li>
								</ul>
							</div>
						</div>
					</Accordion>

					<Accordion bind:open={faqs['what-is-main-street']} id="what-is-main-street">
						<div slot="header" class="accordion-header">
							<h3>What is a 'main street' and how is it defined?</h3>
							<Icon icon={faqs['what-is-main-street'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								<p>
									The term “main street” represents the commercial and community focal point of a
									neighbourhood. They offer nearby residents access to shops, retailers, food and
									drink, and local services. Our definition of main streets split them into two
									types, 'high density' and 'low density' main streets, which were defined based on
									density thresholds around main street businesses and civic infrastructure. Learn
									more about the methodology we use on the <a href="/about/data-methodology/v2"
										>Data and Methodology</a
									> page.
								</p>
							</div>
						</div>
					</Accordion>

					<Accordion bind:open={faqs['why-important']} id="why-important">
						<div slot="header" class="accordion-header">
							<h3>Why are main streets important?</h3>
							<Icon icon={faqs['why-important'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								<p>
									Main streets are the backbone of Canadian society, with 85% of Canadians living
									within one kilometer of a main street. These streets are home to 280,000
									businesses, providing 1.9 million jobs and generating $300 billion in annual
									revenue. They also house over 98,000 community and civic infrastructure assets.
								</p>
								<p>
									Main streets are the cornerstone of ‘complete communities’, where Canadians can
									live, work, and play all within their local neighbourhood. They are our economic
									powerhouses and social connective tissue.
								</p>
							</div>
						</div>
					</Accordion>

					<Accordion bind:open={faqs['data-source']} id="data-source">
						<div slot="header" class="accordion-header">
							<h3>How did you source your data?</h3>
							<Icon icon={faqs['data-source'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								<p>
									We sourced data from a variety of sources, both open and proprietary. Learn more
									about the specific datasets used on the <a href="/about/data-methodology/v2"
										>Data and Methodology</a
									> page.
								</p>
							</div>
						</div>
					</Accordion>

					<Accordion bind:open={faqs['who-created']} id="who-created">
						<div slot="header" class="accordion-header">
							<h3>Who created this project?</h3>
							<Icon icon={faqs['who-created'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								<p>
									The Measuring Main Streets platform is a part of the Research Knowledge Initiative
									program from Housing, Infrastructure and Communities Canada. It is developed by
									the Canadian Urban Institute with support from our partners at Environics
									Analytics and Open North.
								</p>
							</div>
						</div>
					</Accordion>

					<Accordion bind:open={faqs['missing-street']} id="missing-street">
						<div slot="header" class="accordion-header">
							<h3>Why can't I find my main street on the Main Street Map?</h3>
							<Icon icon={faqs['missing-street'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								<p>
									CUI used a rigourous, data backed methodology for our identification of main
									streets, which included continuous iteration and incorporation of feedback from a
									variety of stakeholders. However, incomplete data or analytical errors could lead
									to your main street being excluded from the category of ‘main street’.
								</p>
								<p>
									If you have any further questions or would like to identify a missed main street,
									<a href="/about/v2/#contact">contact us.</a> Please note that you can still see all
									of the data associated with your main street using the mapping tool even if it is not
									visually categorized as a main street by the platform.
								</p>
							</div>
						</div>
					</Accordion>

					<Accordion bind:open={faqs['create-case-study']} id="create-case-study">
						<div slot="header" class="accordion-header">
							<h3>How do I create a case study for my street?</h3>
							<Icon icon={faqs['create-case-study'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								<p>
									The Canadian Urban Institute has used Measuring Main Streets data to produce case
									studies, reports, and other deliverables for various partners. If you or your
									organization may be interested in collaborating, please <a href="/about/contact"
										>contact us with your specific enquiry.</a
									>
								</p>
							</div>
						</div>
					</Accordion>

					<Accordion bind:open={faqs['choose-regions']} id="choose-regions">
						<div slot="header" class="accordion-header">
							<h3>How did you choose the case study regions and streets?</h3>
							<Icon icon={faqs['choose-regions'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								<p>
									We conducted 60 case studies in total across the Toronto, Montreal and Edmonton
									regions, 20 in each region. 10 of the 20 are full case studies which combine data
									about the main streets with qualitative observation from site visits, whilst the
									further 10 are data-only.
								</p>
								<p>
									The 20 main streets were intended to provide a representative sample of types of
									streets within each regional context. This included four downtown
									(workplace-oriented), four small town, and 12 neighourhood (residential-oriented)
									main streets being chosen, with additional emphasis placed on equity-deserving
									communities.
								</p>
							</div>
						</div>
					</Accordion>

					<Accordion bind:open={faqs['my-main-street']} id="my-main-street">
						<div slot="header" class="accordion-header">
							<h3>Is this program connected to My Main Street?</h3>
							<Icon icon={faqs['my-main-street'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								<p>
									My Main Street is a $15-million investment from the Government of Canada through
									the Federal Economic Development Agency for Southern Ontario (FedDev Ontario) to
									spur local economic recovery. My Main Street is delivered by the Canadian Urban
									Institute (CUI) to help support the revitalization of neighbourhoods across
									southern Ontario.
								</p>
								<p>
									The program is not directly connected, however the technical infrastructure
									generated by the Measuring Main Streets project has helped to power the My Main
									Street program and others at the CUI.
								</p>
							</div>
						</div>
					</Accordion>
				</div>
			</section>

			<!-- TOD Section -->
			<section id="tod-section" class="mt-20">
				<div class="section-header">
					<span class="eyebrow">Round Two</span>
					<h2>TRANSIT-ORIENTED DEVELOPMENT ON MAIN</h2>
				</div>
				<div class="accordion-group">
					<Accordion bind:open={faqs['what-is-tod']} id="what-is-tod">
						<div slot="header" class="accordion-header">
							<h3>What is “Transit-oriented development (TOD)”?</h3>
							<Icon icon={faqs['what-is-tod'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								<p>
									According to the <a href="https://tod.itdp.org/what-is-tod.html"
										>Institute for Transportation & Develoment Policy</a
									>: “TOD, or Transit-Oriented Development, is an approach to urban development
									designed to bring people, services, and activities together with quality public
									transport supported by walking and cycling conditions to facilitate shorter trips,
									better lifestyles, and more efficient use of city resources.”
								</p>
								<p>
									On Measuring Main Streets, we focus on development within 800m of high-order
									transit stations.
								</p>
								<p>
									You can read more about the benefits and nuances of transit-oriented development
									in the report
									<a href="/reports/tod/intro">The Case for Transit Oriented Development.</a>
								</p>
							</div>
						</div>
					</Accordion>

					<Accordion bind:open={faqs['what-are-mtsas']} id="what-are-mtsas">
						<div slot="header" class="accordion-header">
							<h3>What is a “Major Transit Station Area (MTSA)”?</h3>
							<Icon icon={faqs['what-are-mtsas'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								<p>
									Major Transit Station Areas are often defined as “the area within a 500 to 800
									metre radius of a higher order transit station representing about a 10-minute
									walk.” <a
										href="https://www.hamilton.ca/build-invest-grow/planning-development/official-plan/official-plan-review/major-transit-station"
										>(Source: City of Hamilton)</a
									> MTSAs often have unique zoning and polices, which are defined on a city-by-city basis.
								</p>
								<p>
									For the purposes of our research, we have used the term “transit station area”
									(TSA) to refer to an 800m radius of all higher order transit stations regardless
									of their official zoning or designation.
								</p>
							</div>
						</div>
					</Accordion>
					<Accordion bind:open={faqs['tod-partners']} id="tod-partners">
						<div slot="header" class="accordion-header">
							<h3>Who were the partners of this project round?</h3>
							<Icon icon={faqs['tod-partners'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								<p>
									In round two of funding, resources on Measuring Main Streets was created with
									support from our partners at Environics Analytics, the School of Cities at the
									University of Toronto, Digital Public Square, and the Canadian Alliance for
									Transit-Connected Housing.
								</p>
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
				<h3>STILL HAVE QUESTIONS?</h3>

				<div class="contact-grid">
					<div class="contact-item">
						<span class="label">GET IN TOUCH</span>
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
		font-size: 1.4rem;
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
		font-size: 2rem;
		border-bottom: 4px solid var(--brandLightBlue);
		padding-bottom: 0.5rem;
		margin-bottom: 2rem;
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

	.accordion-body {
		padding: 2rem 0;
	}

	.text-content p {
		font-size: 1.1rem;
		line-height: 1.6;
		margin-bottom: 1.5rem;
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

	.eyebrow {
		font-size: 1rem;
		color: var(--brandLightBlue);
		font-weight: 700;
		margin-bottom: 0.25rem;
		text-transform: uppercase;
		display: block;
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

	.mt-20 {
		margin-top: 5rem;
	}

	@media (max-width: 992px) {
		.main-content {
			flex-direction: column;
		}
		.sidebar {
			width: 100%;
			margin-bottom: 3rem;
		}
		.hero-content h1 {
			font-size: 3.5rem;
		}
	}
</style>
