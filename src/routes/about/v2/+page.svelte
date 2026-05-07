<script>
	import Icon from '@iconify/svelte';
	import { tick } from 'svelte';
	import Accordion from '../../lib/ui/Accordion.svelte';
	import '../../styles.css';
	// Logos
	import canada_logo from '../../lib/assets/logos/canada_color.png';
	import catch_logo from '../../lib/assets/logos/catch_color.png';
	import dps_logo from '../../lib/assets/logos/DPS-logo-black.png';
	import environics_logo from '../../lib/assets/logos/environics_color.png';
	import ii_logo from '../../lib/assets/logos/ii-logo.png';
	import opennorth_logo from '../../lib/assets/logos/opennorth_color.png';
	import soc_logo from '../../lib/assets/logos/uotsoc_color.png';
	// Assets
	import mainstreets from '../../lib/assets/graphics/mainstreets.svg';
	import montreal_bg from '../../lib/assets/graphics/montreal-bg.png';
	import vancouver_bg from '../../lib/assets/graphics/vancouver-bg.png';
	import ContactCard from '../../lib/ui/ContactCard.svelte';

	let activeSection = $state('about');
	let activeSubSection = $state('resilience');

	let aboutResilienceOpen = $state(false);
	let aboutTodOpen = $state(false);
	let teamResilienceOpen = $state(false);
	let teamTodOpen = $state(false);

	async function scrollTo(id) {
		await tick();
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
		<div class="sidebar md:sticky md:top-10 h-full">
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
								Resilience on Main
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
								TOD on Main
							</button>
						</li>
					</ul>
				</div>

				<div class="nav-group">
					<h3>TEAM AND PARTNERS</h3>
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
								Resilience on Main
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
								TOD on Main
							</button>
						</li>
					</ul>
				</div>
				<div class="nav-group">
					<button onclick={() => scrollTo('contact')}>
						<h3>CONTACT US</h3>
					</button>
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
			<section id="about-section">
				<div class="section-header">
					<h2>ABOUT</h2>
				</div>
				<div class="highlight-box">
					<h4>
						The Measuring Main Streets platform is a part of the Research Knowledge Initiative
						program from Housing, Infrastructure and Communities Canada.
					</h4>
				</div>

				<div class="stats-grid">
					<div class="stats-text">
						<p>
							Main streets are the backbone of Canadian society, with <strong
								>85% of Canadians</strong
							>
							living within one kilometer of a main street. These streets are home to
							<strong>280,000 businesses</strong>, providing
							<strong>1.9 million jobs</strong>
							and generating <strong>$300 billion</strong> in annual revenue. They also house over
							<strong>98,000</strong> community and civic infrastructure assets.
						</p>
					</div>
					<div class="stats-image">
						<img src={montreal_bg} alt="Map graphic" />
					</div>
				</div>
				<div class="text-content">
					<p>
						However, despite their outsized social and economic role, planning and investment
						decisions affecting main streets are often made without access to consistent,
						place-based data at a meaningful scale. Without a clear picture of the people, assets,
						and activities that anchor these streets, planners, developers, and municipal leaders
						are forced to rely on partial or fragmented information—limiting their ability to make
						informed decisions and assess long-term impacts on community livability.
					</p>
					<p>
						In response, The Canadian Urban Institute (CUI) has developed a groundbreaking toolkit
						on the newly released Measuring Main Streets platform. These resources, backed by two
						years of research funded by Housing, Infrastructure and Communities Canada, offer city
						builders the means to make informed investments at the main street scale to enhance
						community, resilience, and equity outcomes.
					</p>

					<blockquote class="quote">
						<p>
							“Without a thorough understanding of our neighbourhoods, it’s nearly impossible to
							assess the broader health and vitality of our communities, but until now, there hasn’t
							been a way to analyze or understand these important places quantitatively—the data has
							been too large, inaccessible, or fragmented.”
						</p>
						<cite>Gregory Spencer, Director of Research at CUI</cite>
					</blockquote>

					<p>
						In response, the Canadian Urban Institute (CUI) developed the Measuring Main Streets
						platform: a suite of tools and resources that brings together robust,
						neighbourhood-scale data at the main street level. The platform equips community
						decision-makers with a clearer understanding of local conditions, enabling better
						planning, more targeted investment, and the ability to track outcomes that advance
						housing, community vitality, resilience, and equity goals.
					</p>

					<p>
						Measuring Main Streets has completed two projects, releasing tools, research, and case
						studies that expanded the platform's depth and national reach. Each project built on the
						previous, growing the data-driven evidence base for communities and decision-makers.
						Learn more about each round of funding here.
					</p>
					<p>
						The <a
							href="https://housing-infrastructure.canada.ca/rki-irc/index-eng.html"
							target="_blank">Research and Knowledge Initiative</a
						>
						(RKI) that makes Measuring Main Streets possible is a national merit-based contributions
						funding program from
						<a href="https://housing-infrastructure.canada.ca/index-eng.html" target="_blank"
							>Housing, Infrastructure and Communities Canada</a
						>. The RKI funds projects focused on key Government of Canada research and data
						priorities related to housing, infrastructure and communities.
					</p>
					<p>
						Measuring Main Streets is the latest contribution to the Canadian Urban Institute’s
						long-term commitment to supporting the resilience and vitality of Canada’s main streets.
						Through research, policy leadership, and place-based tools, CUI has spent decades
						advancing approaches that recognize main streets as critical social, economic, and civic
						infrastructure. <a href="https://mainstreetcanada.ca/" target="_blank"
							>Discover CUI’s Main Street work here.</a
						>
					</p>
					<p>
						Using a data-driven approach, <strong>Measuring Main Streets</strong> examines what’s working,
						what’s not, and what’s next for Canada’s main streets: empowering city builders at every
						scale, from local neighbourhoods to national systems. By making complex data accessible and
						actionable, the platform supports better decisions, clearer accountability, and more effective
						outcomes for communities across the country. Explore the tools today.
					</p>
				</div>

				<div class="accordion-group">
					<Accordion bind:open={aboutResilienceOpen} id="about-resilience">
						<div slot="header" class="accordion-header">
							<div>
								<span class="eyebrow">Round One</span>
								<h3>Resilience on Main</h3>
							</div>
							<Icon icon={aboutResilienceOpen ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								<h6 class="mb-6">
									Equipping communities to make smarter investments in main streets and downtowns.
								</h6>
								<p>
									Coming out of the pandemic, many main streets and downtowns faced a convergence of
									economic, social, and operational challenges and were poorly positioned for
									recovery. Resilience on Main responded by delivering first-of-its-kind tools, case
									studies, and research that re‑scaled critical data to the main street
									level—equipping leaders and practitioners across Canada with the insights needed
									to restore activity, support recovery, champion equity, and strengthen long‑term
									resilience.
								</p>
								<div class="flex mb-4">
									<a href="/reports/executive-summary" class="button-primary"
										>Read the executive summary</a
									>
								</div>
								<p>
									In round one of funding, CUI's partners included Environics Analytics and Open
									North.
								</p>
								<div class="partner-logos-grid">
									<a
										href="https://housing-infrastructure.canada.ca/rki-irc/index-eng.html"
										target="_blank"
									>
										<img src={canada_logo} alt="Housing, Infrastructure and Communities Canada" />
									</a>
									<a href="https://environicsanalytics.com/en-ca/home" target="_blank">
										<img src={environics_logo} alt="Environics Analytics" />
									</a>
									<a href="https://opennorth.ca/" target="_blank">
										<img src={opennorth_logo} alt="Open North" />
									</a>
								</div>
							</div>
						</div>
					</Accordion>

					<Accordion bind:open={aboutTodOpen} id="about-tod">
						<div slot="header" class="accordion-header">
							<div>
								<span class="eyebrow">Round Two</span>
								<h3>Transit-Oriented Development on Main</h3>
							</div>
							<Icon icon={aboutTodOpen ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								<h6 class="mb-6">
									Leveraging transit-oriented development (TOD) to advance housing and community
									outcomes.
								</h6>
								<p>
									Canada has seven rapid transit systems, and the expansion of these networks
									continues to shape how communities, cities, and regions grow and change. Built on
									the foundation of the Measuring Main Streets Platform TOD on Main provides tools,
									case studies, and research to help decision‑makers leverage transit‑driven growth
									to advance housing goals, support vibrant and complete communities, and challenge
									the displacement trends often driven by TOD.
								</p>
								<div class="flex mb-4">
									<a href="/reports/tod/intro" class="button-primary"
										>Read the introductory report</a
									>
								</div>
								<p>
									In round two of funding, CUI's partners included Environics Analytics, the School
									of Cities at the University of Toronto, Digital Public Square, and the Canadian
									Alliance for Transit-Connected Housing.
								</p>
								<div class="partner-logos-grid">
									<img src={canada_logo} alt="Housing, Infrastructure and Communities Canada" />
									<a href="https://environicsanalytics.com/en-ca/home" target="_blank">
										<img src={environics_logo} alt="Environics Analytics" />
									</a>
									<a href="https://schoolofcities.utoronto.ca/" target="_blank">
										<img src={soc_logo} alt="School of Cities" />
									</a>
									<a href="https://digitalpublicsquare.org/" target="_blank">
										<img src={dps_logo} alt="Digital Public Square" />
									</a>
									<a href="https://catch-rehac.ca/" target="_blank">
										<img src={catch_logo} alt="CATCH" />
									</a>
								</div>
							</div>
						</div>
					</Accordion>
				</div>
			</section>

			<section id="team-section">
				<div class="section-header">
					<h2>TEAM AND PARTNERS</h2>
				</div>

				<div class="accordion-group">
					<Accordion bind:open={teamResilienceOpen} id="team-resilience">
						<div slot="header" class="accordion-header">
							<h3>Resilience on Main</h3>
							<Icon icon={teamResilienceOpen ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<h4 class="mb-6">Team Members</h4>
							<div class="card-grid">
								<ContactCard
									link="https://canurb.org/team/gregory-spencer/"
									title="Gregory Spencer"
									description="Director, Research"
								/>
								<ContactCard
									link="https://canurb.org/team/jennifer-barrett/"
									title="Jennifer Barrett"
									description="Managing Director, Programs, Planning and Policy"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/ananmay-sharan"
									title="Ananmay Sharan"
									description="Web Developer"
								/>
								<ContactCard
									link="https://canurb.org/team/alex-tabascio/"
									title="Alex Tabascio"
									description="Data Analyst"
								/>
								<ContactCard
									link="https://canurb.org/team/emily-wassmansdorf/"
									title="Emily Wassmansdorf"
									description="Communications Manager"
								/>
								<ContactCard
									link="https://canurb.org/team/leandro-santos/"
									title="Leandro G. Santos"
									description="Senior Planner"
								/>
								<ContactCard
									link="https://canurb.org/team/toma-beit-arie/"
									title="Toma Beit-Arie"
									description="Research Planner"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/david-scrivener-toronto/"
									title="David Scrivener"
									description="Field Researcher"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/ever-hughes-93ga64/"
									title="Ever Hughes"
									description="Data Intern"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/amanda-ng-2323591a6/"
									title="Amanda Ng"
									description="Data Intern"
								/>
							</div>

							<h4 class="mt-12 mb-6">Partners & Consultants</h4>

							<div class="card-grid">
								<ContactCard
									link="https://www.linkedin.com/in/steve-coutts"
									title="Steve Coutts"
									description="Open North"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/sanjida-rabbi/"
									title="Sanjida Rabbi"
									description="Open North"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/neufeldb/"
									title="Bronwyn Neufeld"
									description="Field Researcher"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/elainestam/"
									title="Elaine Stam"
									description="Universe Design Studio"
								/>
							</div>
							<div class="partner-logos-grid">
								<img src={canada_logo} alt="Housing, Infrastructure and Communities Canada" />
								<a href="https://environicsanalytics.com/en-ca/home" target="_blank">
									<img src={environics_logo} alt="Environics Analytics" />
								</a>
								<a href="https://opennorth.ca/" target="_blank">
									<img src={opennorth_logo} alt="Open North" />
								</a>
							</div>
						</div>
					</Accordion>

					<Accordion bind:open={teamTodOpen} id="team-tod">
						<div slot="header" class="accordion-header">
							<h3>Transit-Oriented Development on Main</h3>
							<Icon icon={teamTodOpen ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<h4 class="mb-6">Team Members</h4>
							<div class="card-grid">
								<ContactCard
									link="https://canurb.org/team/gregory-spencer/"
									title="Gregory Spencer"
									description="Director, Research"
								/>
								<ContactCard
									link="https://canurb.org/team/jennifer-barrett/"
									title="Jennifer Barrett"
									description="Managing Director, Programs, Planning and Policy"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/genna-weber-4168a1225/"
									title="Genna Weber"
									description="Senior Software Engineer"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/iris-wu-6090151b7/"
									title="Iris Wu"
									description="GIS Data Analyst / Web Developer"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/lucacarnegie/"
									title="Luca Carnegie"
									description="Data Analyst & UX Designer"
								/>
								<ContactCard
									link="https://canurb.org/team/alex-tabascio/"
									title="Alex Tabascio"
									description="Data Analyst"
								/>
								<ContactCard
									link="https://canurb.org/team/emily-wassmansdorf/"
									title="Emily Wassmansdorf"
									description="Communications Manager"
								/>
								<ContactCard
									link="https://canurb.org/team/leandro-santos/"
									title="Leandro G. Santos"
									description="Senior Planner"
								/>
								<ContactCard
									link="https://canurb.org/team/toma-beit-arie/"
									title="Toma Beit-Arie"
									description="Research Planner"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/zhaoyi-wang-econ/"
									title="Zhaoyi Wang"
									description="Intern"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/samuel-levi-abramsky/"
									title="Samuel Levi-Abramsky"
									description="Intern"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/elizabeth-wakileh/"
									title="Elizabeth Wakileh"
									description="Intern"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/lianne-harrison122/"
									title="Lianne Harrison"
									description="Intern"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/jaehyeong-jang-a2097521b/"
									title="Jaehyeong Jang"
									description="Intern"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/raghad-gamea-38227022a/"
									title="Raghad Gamea"
									description="Intern"
								/>
							</div>

							<h4 class="mt-12 mb-6">School of Cities</h4>
							<div class="card-grid">
								<ContactCard
									link="https://schoolofcities.utoronto.ca/people/karen-chapple/"
									title="Karen Chapple"
									description="Director"
								/>
								<ContactCard
									link="https://schoolofcities.utoronto.ca/people/kathryn-exon-smith/"
									title="Kathryn Exon Smith"
									description="Senior Research Officer"
								/>
								<ContactCard
									link="https://schoolofcities.utoronto.ca/people/jeff-allen/"
									title="Jeff Allen"
									description="Lead, Data Visualization"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/anika-taboy/"
									title="Anika Taboy"
									description="Research Assistant"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/miekoyao/"
									title="Mieko Yao"
									description="Web Developer"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/xinyue-wang-72209a26a/"
									title="Mia Wang"
									description="Research Assistant"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/an-pham-boston/"
									title="An Pham"
									description="Research Assistant"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/polina-gorn-b2a1b8284/"
									title="Polina Gorn"
									description="Research Assistant"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/isabeaux-graham/"
									title="Isabeaux Graham"
									description="Research Assistant"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/carrie-zeng-591644227/"
									title="Carrie Zeng"
									description="Research Assistant"
								/>
								<ContactCard
									link="https://schoolofcities.utoronto.ca/people/felicity-heyworth/"
									title="Felicity Heyworth"
									description="Senior Communications Officer"
								/>
							</div>

							<h4 class="mt-12 mb-6">Infrastructure Institute</h4>
							<div class="card-grid">
								<ContactCard
									link="https://infrastructureinstitute.ca/matti-siemiatycki/"
									title="Matti Siemiatycki"
									description="Director"
								/>
								<ContactCard
									link="https://infrastructureinstitute.ca/sarah-chan/"
									title="Sarah Chan"
									description="Planning and Design Lead"
								/>
								<ContactCard
									link="https://infrastructureinstitute.ca/phat-le/"
									title="Phat Le"
									description="Architectural Designer"
								/>
								<ContactCard
									link="https://infrastructureinstitute.ca/daniel-lam/"
									title="Daniel Lam"
									description="Architectural Designer"
								/>
								<ContactCard
									link="https://infrastructureinstitute.ca/alexandra-lambropoulos/"
									title="Alexandra Lambropoulos"
									description="Urban Planner"
								/>
								<ContactCard
									link="https://infrastructureinstitute.ca/eva-hellreich/"
									title="Eva Hellreich"
									description="Communications Officer"
								/>
							</div>

							<h4 class="mt-12 mb-6">University of Toronto</h4>
							<div class="card-grid">
								<ContactCard
									link="https://www.sociology.utoronto.ca/people/directories/all-faculty/prentiss-dantzler"
									title="Prentiss Dantzler"
									description="Associate Professor, Department of Sociology"
								/>
								<ContactCard
									link="https://www.utsc.utoronto.ca/geography/steven-farber"
									title="Steven Farber"
									description="Professor, Department of Geography"
								/>
								<ContactCard
									link="https://civmin.utoronto.ca/home/about-us/directory/professors/marianne-hatzopoulou/"
									title="Marianne Hatzopoulou"
									description="Professor, Department of Civil & Mineral Engineering"
								/>
								<ContactCard
									link="https://civmin.utoronto.ca/home/about-us/directory/professors/shoshanna-saxe/"
									title="Shoshanna Saxe"
									description="Associate Professor, Department of Civil & Mineral Engineering"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/alexanderhempel/"
									title="Alexander Hempel"
									description="Postdoctoral Fellow"
								/>
								<ContactCard
									link="https://schoolofcities.utoronto.ca/people/amir-forouhar/"
									title="Amir Forouhar"
									description="Postdoctoral Fellow"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/brenn-anderson-gregson/"
									title="Brenn Anderson-Gregson"
									description="Doctoral Researcher, Department of Geography and Planning"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/emily-farrar-gt/"
									title="Emily Farrar"
									description="Doctoral Researcher, Department of Civil & Mineral Engineering"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/khaliljmartin/"
									title="Khalil Martin"
									description="Research Assistant, Housing Justice Lab"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/abigail-meza-a1b4b121b/"
									title="Abigail Meza"
									description="Research Assistant, Housing Justice Lab"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/keaganrankin/"
									title="Keagan H. Rankin"
									description="Doctoral Researcher, Department of Civil & Mineral Engineering"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/letzai-ruiz-valero/"
									title="Letzai Ruiz"
									description="Research Associate, Centre for the Sustainable Built Environment"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/hoda-touma/"
									title="Hoda Touma"
									description="Research Project Manager, Department of Civil & Mineral Engineering"
								/>
								<ContactCard
									link="https://www.linkedin.com/in/santiago-zuluaga-a9b085116/"
									title="Santiago Zuluaga Mayorga"
									description="Postdoctoral Fellow"
								/>
							</div>

							<div class="partner-logos-grid">
								<img src={canada_logo} alt="Housing, Infrastructure and Communities Canada" />
								<a href="https://environicsanalytics.com/en-ca/home" target="_blank">
									<img src={environics_logo} alt="Environics Analytics" />
								</a>
								<a href="https://schoolofcities.utoronto.ca/" target="_blank">
									<img src={soc_logo} alt="School of Cities" />
								</a>
								<a href="https://infrastructureinstitute.ca/" target="_blank">
									<img src={ii_logo} alt="Infrastructure Institute" />
								</a>
								<a href="https://digitalpublicsquare.org/" target="_blank">
									<img src={dps_logo} alt="Digital Public Square" />
								</a>
								<a href="https://catch-rehac.ca/" target="_blank">
									<img src={catch_logo} alt="CATCH" />
								</a>
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
			<!-- <div class="cui-about">
				<h3>ABOUT THE CANADIAN URBAN INSTITUTE</h3>
				<p>
					Helping communities thrive since 1990, CUI is a national charity driving place-based
					solutions. With over 35 years of experience in place-based planning, CUI brings together
					data, policy, and local insight to help communities be resilient, vibrant, and prosperous.
				</p>
			</div> -->
			<div id="contact" class="cui-contact">
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
							<a href="https://ca.linkedin.com/company/canadianurbaninstitute" target="_blank"
								><Icon icon="fa6-brands:linkedin" /></a
							>
							<a href="https://www.instagram.com/canadianurbaninstitute/" target="_blank"
								><Icon icon="fa6-brands:instagram" /></a
							>
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
		text-transform: uppercase;
		display: block;
	}

	.accordion-body {
		padding: 2rem 0;
	}

	.card-grid {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		align-items: stretch;
	}

	.partner-logos-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		margin-top: 2rem;
		gap: 3rem;
		background: #f9f9f9;
		padding: 2rem;
		border-radius: 8px;
	}

	.partner-logos-grid img {
		height: 50px;
		max-width: 250px;
		object-fit: contain;
		transition: all 0.3s;
	}
	.partner-logos-grid img:hover {
		transform: scale(1.05);
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
		/* font-size: 1.5rem; */
		/* font-weight: 700; */
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
		background-image: url('../../lib/assets/graphics/vancouver-bg.png');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		display: flex;
		justify-content: center;
		padding: 6rem 2rem;
		margin: 0 auto;
		overflow: hidden;
		position: relative;
		width: 100%;
		background-attachment: fixed;
	}

	.cui-flex {
		position: relative;
		z-index: 1;
		justify-content: center;
		display: flex;
		gap: 4rem;
	}

	.cui-contact {
		z-index: 2;
		justify-content: center;
		background: rgba(255, 255, 255, 0.6);
		backdrop-filter: blur(10px);
		padding: 4rem;
		border-radius: 2rem;
	}

	.cui-about h3,
	.cui-contact h3 {
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
	.social-icons a {
		all: unset;
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
