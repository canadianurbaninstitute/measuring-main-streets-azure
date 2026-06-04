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
		// Resilience
		'res-data': true,
		'res-meth': false,
		'res-ind': false,
		// TOD
		'tod-meth': false,
		'tod-dpi': false,
		'tod-cc': false,
		'dpi-data': true,
		'dpi-meth': true,
		'cc-core': false,
		'cc-add': false,
		'cc-data': true,
		'cc-meth': true
	});

	import { goto } from '$app/navigation';

	async function scrollTo(id) {
		await tick();
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
			if (typeof window !== 'undefined' && window.location.hash !== `#${id}`) {
				goto(`#${id}`, { replaceState: false, noScroll: true, keepFocus: true });
			}
		}
	}

	function openAndScroll(id, section) {
		activeSection = section;
		faqs[id] = true;
		scrollTo(id);
	}

	$effect(() => {
		const hash = $page.url.hash.replace('#', '');
		if (hash) {
			// Helper: open parent and child accordions for deep links
			const open = (ids, section) => {
				ids.forEach((id) => (faqs[id] = true));
				activeSection = section;
			};
			if (hash === 'res-data') {
				open(['res-data'], 'resilience');
			} else if (hash === 'res-meth') {
				open(['res-meth'], 'resilience');
			} else if (hash === 'res-ind') {
				open(['res-ind'], 'resilience');
			} else if (hash === 'tod-meth') {
				open(['tod-meth'], 'tod');
			} else if (hash === 'tod-dpi') {
				open(['tod-dpi'], 'tod');
			} else if (hash === 'tod-cc') {
				open(['tod-cc'], 'tod');
			} else if (hash === 'dpi-data') {
				open(['tod-dpi', 'dpi-data'], 'tod');
			} else if (hash === 'dpi-meth') {
				open(['tod-dpi', 'dpi-meth'], 'tod');
			} else if (hash === 'cc-core') {
				open(['tod-cc', 'cc-data', 'cc-core'], 'tod');
			} else if (hash === 'cc-add') {
				open(['tod-cc', 'cc-data', 'cc-add'], 'tod');
			} else if (hash === 'cc-data') {
				open(['tod-cc', 'cc-data'], 'tod');
			} else if (hash === 'cc-meth') {
				open(['tod-cc', 'cc-meth'], 'tod');
			}
			scrollTo(hash);
		}
	});
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
								Transit Data
							</button>
						</li>
					</ul>
					<ul>
						<li>
							<button
								class:active={activeSection === 'tod' && faqs['tod-cc']}
								onclick={() => openAndScroll('tod-cc', 'tod')}
							>
								Complete Community Index
							</button>
						</li>
					</ul>
					<ul>
						<li>
							<button
								class:active={activeSection === 'tod' && faqs['tod-dpi']}
								onclick={() => openAndScroll('tod-dpi', 'tod')}
							>
								Housing Development Potential
							</button>
						</li>
					</ul>
				</div>
			</nav>

			<div class="callout-box">
				<div class="callout-logos">
					<img src={mainstreets} alt="Main Streets" />
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
										Business and Civic Infrastructure location data sourced from Environics
										Analytics provides the spatial location of all businesses and civic
										infrastructure tracked by InfoCanada.
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
												<h4 style="color: white; margin-bottom: 1rem; margin-top: 1rem;">
													Civic Infrastructure
												</h4>
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
									<span class="eyebrow"
										>Environics Analytics DemoStats, 2023; Statistics Canada, 2021</span
									>
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

								<div>
									<h4>4. National Road Network</h4>
									<span class="eyebrow">Statistics Canada, 2023</span>
									<p>
										The NRN was adopted by members of the Inter-Agency Committee on Geomatics (IACG)
										and the Canadian Council on Geomatics (CCOG) to provide quality, homogeneous,
										and normalized geospatial and attributive data (current, accurate, consistent)
										for the entire Canadian road network.
									</p>
									<p>
										The NRN is publicly available on the <a
											href="https://open.canada.ca/en"
											target="_blank">Open Government data portal.</a
										>
									</p>
								</div>
								<div>
									<h4>5. Dataset Summary Table</h4>
									<div class="table-container mt-8">
										<table style="font-size: 0.9rem;">
											<thead>
												<tr>
													<th>Data Set</th>
													<th>Scale</th>
													<th>Usage</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>Business and Civic Location Data</td>
													<td>National (point data)</td>
													<td>Platform, Case Studies, Reports, Tools</td>
												</tr>
												<tr>
													<td>Demographic Data</td>
													<td>National (Dissemination Area)</td>
													<td>Platform, Case Studies, Reports, Tools</td>
												</tr>
												<tr>
													<td>Mobile Visitor Count Data</td>
													<td>Case Study (Building Footprint)</td>
													<td>Case Studies, Reports, Tools</td>
												</tr>
												<tr>
													<td>National Road Network</td>
													<td>National (Line Data)</td>
													<td>Platform, Case Studies, Tools</td>
												</tr>
											</tbody>
										</table>
									</div>
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
													<td
														>4451 (Grocery), 4481 (Clothing), 4511 (Sporting Goods), 4531 (Florists)</td
													>
												</tr>
												<tr>
													<td><strong>Local Services</strong></td>
													<td
														>8121 (Personal Care), 5221 (Banking), 5411 (Legal), 8111 (Auto Repair)</td
													>
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
										Main streets are identified as segments of road where a clustering of main
										street businesses and civic infrastructure exists, using Kernel Density
										Estimation (KDE).
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
							<h3 class="uppercase">Transit Data</h3>
							<Icon icon={faqs['tod-meth'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								<h4 class="uppercase">Expanding to Transit-Oriented Development</h4>
								<p>
									TOD on Main leverages the foundation of the Measuring Main Streets Platform to
									provide tools, case studies, and research focused on transit-driven growth.
								</p>

								<p>
									The methodology involves identifying transit station areas (TSAs) and evaluating
									their potential for housing and complete community development.
								</p>
								<h4 class="uppercase">Transit Station Area Data</h4>
								<p>
									The data for transit station areas (TSAs) found on the <a
										href="/transit-map"
										target="_blank">Transit Map</a
									> comes from the following sources:
								</p>
								<div class="table-container mt-8">
									<table style="font-size: 0.9rem;">
										<thead>
											<tr>
												<th>Data</th>
												<th>Definition</th>
												<th>Source</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>Transit data</td>
												<td
													>Higher order transit stations and transit lines (subway, LRT, and
													commuter).</td
												>
												<td>Local open data, various. Collected in 2025.</td>
											</tr>
											<tr>
												<td>Population</td>
												<td
													>TSA-level population; derived from dissemination area-level data using
													areal weighting with National Address Register points.</td
												>
												<td
													>Environics Analytics (2025), Statistics Canada (National Address
													Register, December 2025)</td
												>
											</tr>
											<tr>
												<td>Households</td>
												<td>Number of households in TSA</td>
												<td>Environics Analytics (2025)</td>
											</tr>
											<tr>
												<td>Average Employment Income</td>
												<td>Average Employment Income in TSA</td>
												<td>Statistics Canada (Census, 2021)</td>
											</tr>
											<tr>
												<td>Visible Minorities</td>
												<td>Proportion of TSA population who are visible minorities</td>
												<td>Environics Analytics (2025)</td>
											</tr>
											<tr>
												<td>Immigrants</td>
												<td>Proportion of TSA population who are immigrants</td>
												<td>Environics Analytics (2025)</td>
											</tr>
											<tr>
												<td>Indigenous</td>
												<td>Proportion of TSA population who are indigenous</td>
												<td>Environics Analytics (2025)</td>
											</tr>
											<tr>
												<td>University Degree</td>
												<td>Proportion of TSA population who hold a university degree</td>
												<td>Environics Analytics (2025)</td>
											</tr>
											<tr>
												<td>Age</td>
												<td
													>Proportion of TSA population who are youth (under 19), working age
													(20-64), and elderly (65 and over)</td
												>
												<td>Environics Analytics (2025)</td>
											</tr>
											<tr>
												<td>Total Dwellings</td>
												<td>Number of dwellings in TSA</td>
												<td>Environics Analytics (2025)</td>
											</tr>
											<tr>
												<td>Average Dwelling Value</td>
												<td>Average dwelling value in TSA</td>
												<td>Statistics Canada (Census, 2021)</td>
											</tr>
											<tr>
												<td>Average Monthly Rent</td>
												<td>Average monthly rent in TSA</td>
												<td>Statistics Canada (Census, 2021)</td>
											</tr>
											<tr>
												<td>Spending more than 30% of income on shelter</td>
												<td
													>Proportion of TSA population spending more than 30% of their income on
													shelter</td
												>
												<td>Statistics Canada (Census, 2021)</td>
											</tr>
											<tr>
												<td>Owners/Renters</td>
												<td>Proportion of TSA population who own vs. rent</td>
												<td>Environics Analytics (2025)</td>
											</tr>
											<tr>
												<td>Dwelling Type</td>
												<td
													>Proportion of dwellings in TSA that are detached, semi-detached, row,
													duplex, apartments less than 5 stories, or apartments with five or more
													stories.</td
												>
												<td>Environics Analytics (2025)</td>
											</tr>
											<tr>
												<td>Dwelling Type</td>
												<td
													>Proportion of dwellings in TSA that were constructed before 1960, between
													1961 to 1980, between 1981 to 2000, or between 2000-2020</td
												>
												<td>Environics Analytics (2025)</td>
											</tr>
											<tr>
												<td>Number of Bedrooms</td>
												<td
													>Proportion of dwellings in TSA that are studios or have 1, 2, 3, or 4 or
													more bedrooms.</td
												>
												<td>Statistics Canada (Census, 2021)</td>
											</tr>
											<tr>
												<td>Total Employment</td>
												<td>Total number of jobs in TSA</td>
												<td>Environics Analytics (2025)</td>
											</tr>
											<tr>
												<td>Employment Mix</td>
												<td
													>Proportion of jobs that are at core amenities, additional amenities, or
													other employers.</td
												>
												<td>Environics Analytics (2025)</td>
											</tr>
											<tr>
												<td>Population Density</td>
												<td>Number of people per square kilometre in TSA</td>
												<td>Environics Analytics (2025)</td>
											</tr>
											<tr>
												<td>Employment Density</td>
												<td>Number of employees per square kilometre in TSA</td>
												<td>Environics Analytics (2025)</td>
											</tr>
											<tr>
												<td>Water</td>
												<td>Proportion of TSA area that is water</td>
												<td>OpenStreetMap (2025)</td>
											</tr>
											<tr>
												<td>Greenspace</td>
												<td>Proportion of TSA area that is greenspace</td>
												<td>OpenStreetMap (2025)</td>
											</tr>
											<tr>
												<td>Buildings</td>
												<td>Proportion of TSA area that is building footprint</td>
												<td>OpenStreetMap (2025)</td>
											</tr>
											<tr>
												<td>Parking</td>
												<td>Proportion of TSA area that is surface parking</td>
												<td>OpenStreetMap (2025)</td>
											</tr>
											<tr>
												<td>Overall Score</td>
												<td>Overall score of complete community amenity presence in TSA</td>
												<td
													>Complete Community Index (2025); based on Environics Analytics (2025)</td
												>
											</tr>
											<tr>
												<td>Core Amenities Presence</td>
												<td>Proportion of core amenities present in TSA</td>
												<td
													>Complete Community Index (2025); based on Environics Analytics (2025)</td
												>
											</tr>
											<tr>
												<td>Additional Amenities Presence</td>
												<td>Proportion of additional amenities present in TSA</td>
												<td
													>Complete Community Index (2025); based on Environics Analytics (2025)</td
												>
											</tr>
											<tr>
												<td>Daily Visits</td>
												<td>Average daily visits to TSA in 2025</td>
												<td>Environics Analytics (2025)</td>
											</tr>
											<tr>
												<td>Main Street Businesses</td>
												<td>Number of main street businesses in TSA</td>
												<td>Environics Analytics (2025)</td>
											</tr>
											<tr>
												<td>Business Independence Index</td>
												<td
													>Measure of business independence in TSA, from 0 (less independent) to 1
													(more independent)</td
												>
												<td>Calculated from business data, Environics Analytics (2025)</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</Accordion>

					<Accordion bind:open={faqs['tod-cc']} id="tod-cc">
						<div slot="header" class="accordion-header">
							<h3 class="uppercase">Complete Community Index</h3>
							<Icon icon={faqs['tod-cc'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								<div>
									<p>
										The Complete Community Index methodology evaluates the overall presence of Core
										and Additional Amenities that make up a complete transit-oriented community,
										evaluates the relative access of each transit station area compared to a
										regional benchmark, and enables scenario planning, allowing future demand
										increases to be evaluated against existing amenity capacity.
									</p>
									<Accordion bind:open={faqs['cc-data']} id="cc-data">
										<div slot="header" class="accordion-header">
											<h4>Data</h4>
											<Icon icon={faqs['cc-data'] ? 'mdi:minus' : 'mdi:plus'} />
										</div>
										<div slot="body" class="accordion-body">
											<div class="table-container mt-8">
												<table style="font-size: 0.9rem;">
													<thead>
														<tr>
															<th>Data</th>
															<th>Definition</th>
															<th>Source</th>
														</tr>
													</thead>
													<tbody>
														<tr>
															<td>Business data</td>
															<td>Location, NAICS classification, Employment Size.</td>
															<td>Environics Analytics (2025)</td>
														</tr>
														<tr>
															<td>Visit data</td>
															<td>Aggregated Total Visits of a transit station area for 2025.</td>
															<td>Environics Analytics (2025)</td>
														</tr>
														<tr>
															<td>Complete Community Amenities</td>
															<td
																>Location and classification of complete community amenities within
																transit station areas.</td
															>
															<td>Environics Analytics (2025)</td>
														</tr>
													</tbody>
												</table>
											</div>
											<h4 class="my-12">Complete Community Amenities</h4>
											<p>
												Amenities are split into two distinct categories: core amenities, which are
												crucial to the development of a complete community, and additional
												amenities, which improve quality of life, but not are necessary for a
												complete community.
											</p>
											<Accordion bind:open={faqs['cc-core']} id="cc-core">
												<div slot="header" class="accordion-header">
													<h6>Core Amenities</h6>

													<Icon icon={faqs['cc-core'] ? 'mdi:minus' : 'mdi:plus'} />
												</div>
												<div slot="body" class="accordion-body">
													<div class="table-container">
														<table style="font-size: 0.9rem;">
															<thead>
																<tr>
																	<th>Amenity</th>
																	<th>NAICS Code</th>
																</tr>
															</thead>
															<tbody>
																<tr>
																	<td>Childcare</td>
																	<td>624410</td>
																</tr>
																<tr>
																	<td>Community Centres</td>
																	<td>711310</td>
																</tr>
																<tr>
																	<td>Convenience Store</td>
																	<td>445131</td>
																</tr>
																<tr>
																	<td>Libraries</td>
																	<td>519210</td>
																</tr>
																<tr>
																	<td>Personal and Commercial Banking</td>
																	<td>522110</td>
																</tr>
																<tr>
																	<td>Pharmacy</td>
																	<td>456110</td>
																</tr>
																<tr>
																	<td>Physicians Office</td>
																	<td>621111</td>
																</tr>
																<tr>
																	<td>Primary and Secondary Schools</td>
																	<td>611110</td>
																</tr>
																<tr>
																	<td>Supermarket</td>
																	<td>445110</td>
																</tr>
															</tbody>
														</table>
													</div>
												</div></Accordion
											><Accordion bind:open={faqs['cc-add']} id="cc-add">
												<div slot="header" class="accordion-header">
													<h6>Additional Amenities</h6>

													<Icon icon={faqs['cc-add'] ? 'mdi:minus' : 'mdi:plus'} />
												</div>
												<div slot="body" class="accordion-body">
													<div class="table-container">
														<table style="font-size: 0.9rem;">
															<thead>
																<tr>
																	<th>Amenities</th>
																	<th>NAICS Code</th>
																</tr>
															</thead>
															<tbody>
																<tr>
																	<td>Appliance TV and Electronics Retailers</td>
																	<td>449210 </td>
																</tr>
																<tr>
																	<td>Baked Goods</td>
																	<td>311811 </td>
																</tr>
																<tr>
																	<td>Barber Shop</td>
																	<td>812111 </td>
																</tr>
																<tr>
																	<td>Beauty Salon</td>
																	<td>812112 </td>
																</tr>
																<tr>
																	<td>Book Stores</td>
																	<td>459210 </td>
																</tr>
																<tr>
																	<td>Building Material and Lawn Garden Stores</td>
																	<td>444180 </td>
																</tr>
																<tr>
																	<td>Clothing and Shoe Retailers</td>
																	<td>458110, 458210</td>
																</tr>
																<tr>
																	<td>Coin Laundry </td>
																	<td>812310 </td>
																</tr>
																<tr>
																	<td>Community Health and Elderly Care Facilities</td>
																	<td>623312, 624120</td>
																</tr>
																<tr>
																	<td>Cosmetics and Beauty Supply Retailers</td>
																	<td>456120 </td>
																</tr>
																<tr>
																	<td>Dentist Office</td>
																	<td>621210 </td>
																</tr>
																<tr>
																	<td>Dry Cleaners</td>
																	<td>812320 </td>
																</tr>
																<tr>
																	<td>Fish and Seafood Market</td>
																	<td>445250 </td>
																</tr>
																<tr>
																	<td>Fitness and recreational sports centres</td>
																	<td>713940 </td>
																</tr>
																<tr>
																	<td>Florists</td>
																	<td>459310 </td>
																</tr>
																<tr>
																	<td>Fruit and Vegetable Market</td>
																	<td>445230 </td>
																</tr>
																<tr>
																	<td>Liquor Stores</td>
																	<td>445320 </td>
																</tr>
																<tr>
																	<td>Meat Market</td>
																	<td>445240 </td>
																</tr>
																<tr>
																	<td>Museums and Art Galleries</td>
																	<td>712110 </td>
																</tr>
																<tr>
																	<td>Nursing Care Facilities</td>
																	<td>623110 </td>
																</tr>
																<tr>
																	<td>Office supplies</td>
																	<td>459410 </td>
																</tr>
																<tr>
																	<td>Other Personal Care</td>
																	<td>812199 </td>
																</tr>
																<tr>
																	<td>Post Office</td>
																	<td>491110 </td>
																</tr>
																<tr>
																	<td>Religious Organizations</td>
																	<td>813110 </td>
																</tr>
																<tr>
																	<td>Restaurants</td>
																	<td>722511 </td>
																</tr>
																<tr>
																	<td>Sporting Goods and Hobby Retailers</td>
																	<td>459120, 459140, 459130, 459110 </td>
																</tr>
															</tbody>
														</table>
													</div>
												</div></Accordion
											>
										</div></Accordion
									>
								</div>
								<Accordion bind:open={faqs['cc-meth']} id="cc-meth">
									<div slot="header" class="accordion-header">
										<h4>Methodology</h4>
										<Icon icon={faqs['cc-meth'] ? 'mdi:minus' : 'mdi:plus'} />
									</div>
									<div slot="body" class="accordion-body">
										<h6>1. Cleaning and Transforming Employment Data</h6>
										<p>
											The EA Business Data is filtered to include only Core or Additional Amenities.
											Employment size is log-transformated to reduce the effect of extreme outliers.
										</p>

										<h6>2. Gathering and Transforming Station-Level Daily Visit Data</h6>
										<p>
											Daily visits are weighted based on home location to categorize residents vs.
											non-residents, while also being log transformed, reducing the effect of
											over-penalizing high-volume downtown and transfer stations.
										</p>

										<h6>3. Calculating Access using Two-Stage Floating Catchment Areas</h6>
										<p>
											Two-Stage Floating Catchment Area (2SFCA) is a spatial accessibility method
											that measures how easily people can reach services while accounting for both
											supply and demand within a travel threshold. Services are our core and
											additional amenities. Supply is the transformed counts of employees per
											amenity. Demand is the effective demand for daily resident and non-resident
											visits. For the travel threshold, we use an 800-metre buffer around each
											station, equivalent to a 10-minute walk.
										</p>

										<h6>4. Calculating a Regional Benchmark and Access Surplus</h6>
										<p>
											In order to compare the Access of an amenity type for a particular transit
											station area, regional benchmarks were created to compare the different levels
											of access conditions across the transit region, with Typical (median) and
											Above Average (75th percentile) Access benchmarks.
										</p>
										<p>
											From there, Access Surplus for each Amenity Type and transit station area was
											calculated as the difference between Access and Regional Access to identify
											where more capacity should exist or additional visits can be handled.
										</p>

										<h6>5. Translating Access into Planning Action</h6>
										<p>
											In order to compare the Access of an amenity type for a particular transit
											station area, regional benchmarks were created to compare the different levels
											of access conditions across the transit region, with Typical (median) and
											Above Average (75th percentile) Access benchmarks.
										</p>
										<p>
											With Access to every Amenity Type within a transit station area calculated and
											compared to the Regional Access, this can be translated into interpretable
											numbers for accomplishing the following objectives:
										</p>
										<p>
											i. Identify Amenities within a transit station area where additional Capacity
											is needed to meet typical Access levels
										</p>
										<p>
											ii. Identify how Access changes with a future increase in Residents to a
											particular transit station area
										</p>
										<p>
											<strong>Calculating Typical Employment</strong><br />
											For each amenity group within a transit region, the median employment size is calculated.
											This represents the employment of a typical amenity type within a transit station
											area.
										</p>

										<p>
											<strong>Calculating Additional Employees Needed</strong><br />
											For TSAs where an Amenity has an Access Surplus less than 0, Additional Employees
											Needed is calculated as a ratio of Access Surplus and Regional Access, multiplied
											by Typical Employment.
											<math display="block">
												<mi>Employees Needed</mi>
												<mo>=</mo>
												<mrow>
													<mo>|</mo>
													<mfrac><mi>Access Surplus</mi> <mi>Regional Access</mi></mfrac>
													<mo>|</mo>
												</mrow>
												<mi>&times; Typical Employment</mi>
											</math>
										</p>

										<h6>6. Calculating Future Demand Scenarios</h6>
										<p>
											Using Population and Visit Data, we can convert the number of additional
											residents into the additional number of daily trips by calculating the average
											number of daily visits made to a transit station area by residents.
										</p>
										<p>
											Future demand scenarios are calculated as a ratio of daily visits and a sum of
											daily and additional daily visits, multiplied by access.
										</p>
										<math display="block">
											<mi>Future Access</mi>
											<mo>=</mo>
											<mi>Access</mi>
											<mo>&times;</mo>
											<mfrac
												><mrow><mi>Daily Visits</mi></mrow><mrow
													><mi>Daily Visits + Additional Daily Visits</mi></mrow
												></mfrac
											>
										</math>
									</div></Accordion
								>
							</div>
						</div></Accordion
					>

					<div id="housing-dev">
						<Accordion bind:open={faqs['tod-dpi']} id="tod-dpi">
							<div slot="header" class="accordion-header">
								<h3 class="uppercase">Housing Development Potential</h3>
								<Icon icon={faqs['tod-dpi'] ? 'mdi:minus' : 'mdi:plus'} />
							</div>
							<div slot="body" class="accordion-body">
								<div class="text-content">
									<div>
										<p>
											The Housing Development Potential Tool provides an indication of the potential
											for new housing construction in a transit station area.
										</p>
										<Accordion bind:open={faqs['dpi-data']} id="dpi-data">
											<div slot="header" class="accordion-header">
												<h4>Data</h4>

												<Icon icon={faqs['dpi-data'] ? 'mdi:minus' : 'mdi:plus'} />
											</div>
											<div slot="body" class="accordion-body">
												<p>
													The Housing Development Potential tool splits indicators into three
													categories: Land Availability to measure capacity for new housing, Growth
													Pressure to measure demand for new housing, and Displacement Risk to
													measure the risk of displacing existing residents when building new
													housing.
												</p>
												<p>
													Number of approved building permits is provided as supplementary
													information where available.
												</p>
												<h6 style="margin-top: 2rem;">Land Availability</h6>
												<div class="table-container mt-8">
													<table style="font-size: 0.9rem;">
														<thead>
															<tr>
																<th>Indicator</th>
																<th>Definition</th>
																<th>Data Source</th>
															</tr>
														</thead>
														<tbody>
															<tr>
																<td>Total developable area</td>
																<td>Total station area, excluding water and greenspace</td>
																<td>OpenStreetMap (2025)</td>
															</tr>
															<tr>
																<td>High opportunity sites</td>
																<td>Surface parking area</td>
																<td>OpenStreetMap (2025)</td>
															</tr>
															<tr>
																<td>Single unit dwellings</td>
																<td>Count of single unit addresses</td>
																<td>Statistics Canada (National Address Register, December 2025)</td
																>
															</tr>
															<tr>
																<td>Population density</td>
																<td>Population / (total station area, excluding water)</td>
																<td>Environics Analytics (2025)</td>
															</tr>
															<tr>
																<td>Employment density</td>
																<td>Number of employees / (total station area, excluding water)</td>
																<td>Environics Analytics (2025)</td>
															</tr>
														</tbody>
													</table>
												</div>

												<h6 style="margin-top: 2rem;">Growth Pressure</h6>
												<div class="table-container mt-8">
													<table style="font-size: 0.9rem;">
														<thead>
															<tr>
																<th>Indicator</th>
																<th>Definition</th>
																<th>Data Source</th>
															</tr>
														</thead>
														<tbody>
															<tr>
																<td>Municipal population change</td>
																<td>CMA-level population change, 2020-2025</td>
																<td>Environics Analytics (2025)</td>
															</tr>
															<tr>
																<td>Population change</td>
																<td>Transit station area population change, 2020-2025</td>
																<td>Environics Analytics (2025)</td>
															</tr>
															<tr>
																<td>Projected population change</td>
																<td>Projected transit station area population change, 2025-2030</td>
																<td>Environics Analytics (2025)</td>
															</tr>
															<tr>
																<td>Amenity presence</td>
																<td
																	>Overall complete community score, measuring availability of
																	amenities within station area.</td
																>
																<td>Complete Community Index; Environics Analytics (2025)</td>
															</tr>
															<tr>
																<td>Daily visits</td>
																<td>Average number of visitors within station area.</td>
																<td>Complete Community Index; Environics Analytics (2026)</td>
															</tr>
														</tbody>
													</table>
												</div>

												<h6 style="margin-top: 2rem;">Displacement Risk</h6>
												<div class="table-container mt-8">
													<table style="font-size: 0.9rem;">
														<thead>
															<tr>
																<th>Indicator</th>
																<th>Definition</th>
																<th>Data Source</th>
															</tr>
														</thead>
														<tbody>
															<tr>
																<td>Low income</td>
																<td
																	>Population who are low-income (Low-income measure, after tax)</td
																>
																<td>Statistics Canada (Census, 2021)</td>
															</tr>
															<tr>
																<td>More than 30% of income spent on shelter</td>
																<td>Population spending more than 30% of income on shelter.</td>
																<td>Statistics Canada (Census, 2021)</td>
															</tr>
															<tr>
																<td>Immigrants</td>
																<td>Population who are immigrants.</td>
																<td>Environics Analytics (2025)</td>
															</tr>
															<tr>
																<td>Visible minorities</td>
																<td>Population who are visible minorities.</td>
																<td>Environics Analytics (2025)</td>
															</tr>
															<tr>
																<td>Youth and elderly</td>
																<td>Population who are under 19 or over 65.</td>
																<td>Environics Analytics (2026)</td>
															</tr>
														</tbody>
													</table>
												</div>

												<h6 style="margin-top: 2rem;">Additional Data</h6>
												<div class="table-container mt-8">
													<table style="font-size: 0.9rem;">
														<thead>
															<tr>
																<th>Indicator</th>
																<th>Definition</th>
																<th>Data Source</th>
															</tr>
														</thead>
														<tbody>
															<tr>
																<td>Building permits</td>
																<td>Number of approved units.</td>
																<td
																	>Local open data, various (2025-2026). <br />
																	Only available for stations in Calgary, Edmonton, Kitchener, Mississauga,
																	Montreal, Ottawa, Toronto, Vancouver, and Waterloo.</td
																>
															</tr>
														</tbody>
													</table>
												</div>
											</div></Accordion
										>
									</div>
									<div class="mb-12">
										<Accordion bind:open={faqs['dpi-meth']} id="dpi-meth">
											<div slot="header" class="accordion-header">
												<h4>Methodology</h4>

												<Icon icon={faqs['dpi-meth'] ? 'mdi:minus' : 'mdi:plus'} />
											</div>
											<div slot="body" class="accordion-body">
												<div class="my-8">
													<h4 class="my-8">Subscore Calculation</h4>
													<p>
														A station's percentile rank relative to other stations is calculated for
														each Land Availability, Growth Pressure, and Displacement Risk
														indicator. The direction of population and employment density rankings
														are inverted; a higher population density leads to a lower population
														density percentile rank.
													</p>

													<p>
														A station's Land Availability and Growth Pressure subscores are
														calculated as the mean of the indicator percentile ranks.
													</p>

													<p>
														Land Availability, Growth Pressure, and Displacement Risk levels (Very
														Low, Low, Moderate, etc.) are determined using their subscore quantiles.
													</p>
													<h4 class="my-8">Development Potential Score</h4>
													<p>
														The Development Potential Score is calculated as a sum of the Land
														Availability and Growth Pressure subscores.
													</p>

													<p>
														For stations on multiple transit lines, the Growth Pressure subscore is
														multiplied by an Intersection Multiplier. The Intersection Multiplier is
														calculated as the average population of transit stations on multiple
														lines divided by the average population of transit stations on a single
														line.
													</p>

													<p>
														The Development Potential Level is based on the quantiles of Development
														Potential Score (lowest fifth of Development Potential Score &rarr; Very
														Low, second-lowest fifth of Development Potential Score &rarr; Low,
														etc.).
													</p>
												</div>

												<div id="housing-est">
													<h4>Calculating Housing Estimate</h4>

													<p class="mb-8">
														The estimate for new housing construction in transit station areas is
														based on the current population of existing transit station areas.
													</p>

													<h6>1. Setting Target Population</h6>
													<p>
														Calculate average population of existing stations for each region. For
														Quebec City, the average population of the planned line is used.
													</p>
													<p>
														For each station, the target population is set as the average population
														of existing stations in that region.
													</p>
													<p>
														For stations on multiple transit lines, the target population is
														multiplied by the Intersection Multiplier.
													</p>

													<h6>2. Calculating Additional Population</h6>
													<p>
														For each station, the additional population is calculated as the
														difference between the current and target population. If the station’s
														current population is greater than or equal to the target population,
														the additional population is set to 0.
													</p>

													<h6>3. Calculating Additional Households</h6>
													<p>
														A station's additional population is divided by the station’s average
														household size to get additional number of households. The additional
														number of households is summed for all stations to get the housing
														estimate. This gives us the low-end housing estimate (1.2 million).
													</p>
													<p>
														To obtain the mid-range housing estimate (2.7 million), the target
														population is set to 1.5 times the regional average. To obtain the
														high-end housing estimate (4.4 million), the target population is set as
														double the regional average.
													</p>
												</div>
											</div></Accordion
										>
									</div>
								</div>
							</div></Accordion
						>
					</div>
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
							<a href="https://ca.linkedin.com/company/canadianurbaninstitute" target="_blank"
								><Icon icon="fa6-brands:linkedin" /></a
							>
							<a href="https://www.instagram.com/canadianurbaninstitute/" target="_blank">
								<Icon icon="fa6-brands:instagram" />
							</a>
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
	.social-icons :global(svg) {
		cursor: pointer;
		transition: transform 0.2s;
	}

	.social-icons :global(svg:hover) {
		transform: scale(1.2);
		color: var(--brandDarkBlue);
	}
	.mb-12 {
		margin-bottom: 3rem;
	}
	.mt-32 {
		margin-top: 8rem;
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
