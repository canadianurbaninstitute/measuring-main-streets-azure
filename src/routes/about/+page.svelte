<script>
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import { tick } from 'svelte';
	import Accordion from '../lib/ui/Accordion.svelte';
	import '../styles.css';
	// Logos
	import canada_logo from '../lib/assets/logos/canada_color.png';
	import catch_logo from '../lib/assets/logos/catch_color.png';
	import dps_logo from '../lib/assets/logos/DPS-logo-black.png';
	import environics_logo from '../lib/assets/logos/environics_color.png';
	import ii_logo from '../lib/assets/logos/ii-logo.png';
	import opennorth_logo from '../lib/assets/logos/opennorth_color.png';
	import soc_logo from '../lib/assets/logos/uotsoc_color.png';
	// Assets
	import mainstreets from '../lib/assets/graphics/mainstreets.svg';
	import montreal_bg from '../lib/assets/graphics/montreal-bg.png';
	import vancouver_bg from '../lib/assets/graphics/vancouver-bg.png';
	import gnowise from '../lib/assets/logos/gnowise.webp';
	import ContactCard from '../lib/ui/ContactCard.svelte';

	import { goto } from '$app/navigation';
	import CustomButton from '../lib/ui/CustomButton.svelte';

	import { getLang } from '../lib/i18n';
	const fr = getLang() === 'fr';

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
			if (typeof window !== 'undefined' && window.location.hash !== `#${id}`) {
				goto(`#${id}`, { replaceState: false, noScroll: true, keepFocus: true });
			}
		}
	}

	$effect(() => {
		const hash = $page.url.hash.replace('#', '');
		if (hash) {
			if (hash === 'about-resilience') {
				aboutResilienceOpen = true;
				activeSection = 'about';
				activeSubSection = 'resilience';
			} else if (hash === 'about-tod') {
				aboutTodOpen = true;
				activeSection = 'about';
				activeSubSection = 'tod';
			} else if (hash === 'team-resilience') {
				teamResilienceOpen = true;
				activeSection = 'team';
				activeSubSection = 'resilience';
			} else if (hash === 'team-tod' || hash === 'tod-partners') {
				teamTodOpen = true;
				activeSection = 'team';
				activeSubSection = 'tod';
			}
			scrollTo(hash);
		}
	});
</script>

<main>
	<!-- Hero Section -->
	<div class="hero-section" style="background-image: url({vancouver_bg})">
		<div class="hero-content">
			{#if fr}
				<h1>À PROPOS DE<br />MESURES DES<br /><span class="text-blue">RUES PRINCIPALES</span></h1>
			{:else}
				<h1>ABOUT<br />MEASURING<br /><span class="text-blue">MAIN STREETS</span></h1>
			{/if}
		</div>
	</div>

	<div class="container main-content">
		<div class="sidebar lg:sticky lg:top-28 h-full">
			<nav>
				<div class="nav-group">
					<h3>{fr ? 'LE PROJET' : 'THE PROJECT'}</h3>
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
								{fr ? 'Résilience sur la rue principale' : 'Resilience on Main'}
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
								{fr ? 'TOD sur la rue principale' : 'TOD on Main'}
							</button>
						</li>
					</ul>
				</div>

				<div class="nav-group">
					<h3>{fr ? 'ÉQUIPE ET PARTENAIRES' : 'TEAM AND PARTNERS'}</h3>
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
								{fr ? 'Résilience sur la rue principale' : 'Resilience on Main'}
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
								{fr ? 'TOD sur la rue principale' : 'TOD on Main'}
							</button>
						</li>
					</ul>
				</div>
				<div class="nav-group">
					<button onclick={() => scrollTo('contact')}>
						<h3>{fr ? 'NOUS JOINDRE' : 'CONTACT US'}</h3>
					</button>
				</div>
			</nav>

			<div class="callout-box">
				<div class="callout-logos">
					<img src={mainstreets} alt={fr ? 'Rues principales' : 'Main Streets'} />
					<img src={canada_logo} alt="Canada" />
				</div>
				{#if fr}
					<p>
						La plateforme Mesures des rues principales fait partie de l’Initiative de recherche et de
						connaissances de Logement, Infrastructures et Collectivités Canada.
					</p>
				{:else}
					<p>
						The Measuring Main Streets platform is a part of the Research Knowledge Initiative program
						from Housing, Infrastructure and Communities Canada.
					</p>
				{/if}
			</div>
		</div>

		<div class="content-area">
			<section id="about">
				<div class="section-header">
					<h2>{fr ? 'LE PROJET' : 'THE PROJECT'}</h2>
				</div>
				<!-- <div class="highlight-box">
					<h4>
						The Measuring Main Streets platform is a part of the Research Knowledge Initiative
						program from Housing, Infrastructure and Communities Canada.
					</h4>
				</div> -->

				<div class="stats-grid">
					<div class="stats-text">
						{#if fr}
							<p>
								Les rues principales sont l’épine dorsale de la société canadienne : <strong
									>85 % de la population canadienne</strong
								>
								vit à moins d’un kilomètre d’une rue principale. Ces rues accueillent
								<strong>280 000 entreprises</strong>, qui fournissent
								<strong>1,9 million d’emplois</strong>
								et génèrent <strong>300 milliards de dollars</strong> de revenus annuels. On y trouve aussi plus de
								<strong>98 000</strong> actifs d’infrastructure communautaire et civique.
							</p>
						{:else}
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
						{/if}
					</div>
					<div class="stats-image">
						<img src={montreal_bg} alt={fr ? 'Illustration cartographique' : 'Map graphic'} />
					</div>
				</div>
				<div class="text-content">
					{#if fr}
						<p>
							Pourtant, malgré leur rôle social et économique de premier plan, les décisions de planification
							et d’investissement qui touchent les rues principales sont souvent prises sans accès à des données
							territoriales cohérentes, à une échelle pertinente. Sans portrait clair des personnes, des actifs
							et des activités qui ancrent ces rues, les urbanistes, les promoteurs et les responsables
							municipaux doivent se fier à des informations partielles ou fragmentées, ce qui limite leur
							capacité à prendre des décisions éclairées et à évaluer les effets à long terme sur la qualité de
							vie des collectivités.
						</p>

						<blockquote class="quote">
							<p>
								« Sans une compréhension approfondie de nos quartiers, il est presque impossible d’évaluer la
								santé et la vitalité globales de nos collectivités. Pourtant, jusqu’à maintenant, il n’existait
								aucun moyen d’analyser ou de comprendre ces lieux importants de façon quantitative : les données
								étaient trop volumineuses, inaccessibles ou fragmentées. »
							</p>
							<cite>Gregory Spencer, directeur de la recherche à l’IUC</cite>
						</blockquote>

						<p>
							En réponse, l’Institut urbain du Canada (IUC) a créé la plateforme Mesures des rues
							principales : une suite d’outils et de ressources qui rassemble des données robustes, à l’échelle
							des quartiers, au niveau des rues principales. La plateforme donne aux personnes qui prennent les
							décisions dans les collectivités une compréhension plus claire des conditions locales, ce qui
							favorise une meilleure planification, des investissements plus ciblés et la capacité de suivre
							les résultats qui font progresser les objectifs en matière de logement, de vitalité
							communautaire, de résilience et d’équité.
						</p>

						<p>
							Mesures des rues principales a mené à bien deux projets, qui ont produit des outils, des
							recherches et des études de cas ayant approfondi la plateforme et élargi sa portée nationale.
							Chaque projet s’est appuyé sur le précédent, enrichissant la base de données probantes à la
							disposition des collectivités et des décideurs. Découvrez ci-dessous chacune des phases de
							financement.
						</p>
						<p>
							L’<a href="https://housing-infrastructure.canada.ca/rki-irc/index-fra.html" target="_blank"
								>Initiative de recherche et de connaissances</a
							>
							(IRC), qui rend possible Mesures des rues principales, est un programme national de
							contributions fondé sur le mérite de
							<a href="https://housing-infrastructure.canada.ca/index-fra.html" target="_blank"
								>Logement, Infrastructures et Collectivités Canada</a
							>. L’IRC finance des projets axés sur les grandes priorités de recherche et de données du
							gouvernement du Canada en matière de logement, d’infrastructures et de collectivités.
						</p>
						<p>
							Mesures des rues principales est la plus récente contribution à l’engagement de longue date de
							l’Institut urbain du Canada envers la résilience et la vitalité des rues principales du pays. Par
							la recherche, le leadership en matière de politiques et des outils adaptés aux milieux, l’IUC
							fait progresser depuis des décennies des approches qui reconnaissent les rues principales comme
							une infrastructure sociale, économique et civique essentielle. <a
								href="https://mainstreetcanada.ca/"
								target="_blank">Découvrez ici le travail de l’IUC sur les rues principales.</a
							>
						</p>
						<p>
							Grâce à une approche axée sur les données, <strong>Mesures des rues principales</strong> examine
							ce qui fonctionne, ce qui ne fonctionne pas et ce qui attend les rues principales du Canada, en
							outillant les bâtisseurs de villes à toutes les échelles, des quartiers aux systèmes nationaux.
							En rendant des données complexes accessibles et exploitables, la plateforme favorise de meilleures
							décisions, une reddition de comptes plus claire et des résultats plus efficaces pour les
							collectivités de partout au pays. Explorez les outils dès aujourd’hui.
						</p>
					{:else}
						<p>
							However, despite their outsized social and economic role, planning and investment
							decisions affecting main streets are often made without access to consistent,
							place-based data at a meaningful scale. Without a clear picture of the people, assets,
							and activities that anchor these streets, planners, developers, and municipal leaders
							are forced to rely on partial or fragmented information—limiting their ability to make
							informed decisions and assess long-term impacts on community livability.
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
					{/if}
				</div>

				<div class="accordion-group">
					<Accordion bind:open={aboutResilienceOpen} id="about-resilience">
						<div slot="header" class="accordion-header">
							<div>
								<span class="eyebrow">{fr ? 'Première phase' : 'Round One'}</span>
								<h3>{fr ? 'Résilience sur la rue principale' : 'Resilience on Main'}</h3>
							</div>
							<Icon icon={aboutResilienceOpen ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								{#if fr}
									<h6 class="mb-6">
										Outiller les collectivités pour qu’elles investissent plus judicieusement dans leurs rues
										principales et leurs centres-villes.
									</h6>
									<p>
										Après la pandémie, de nombreuses rues principales et de nombreux centres-villes ont fait face à
										un ensemble de défis, dont une baisse de l’activité économique, des pressions sociales et de
										l’incertitude quant à la façon d’amorcer la reprise.
									</p>
									<p>
										L’un des plus grands obstacles à la reprise était le manque de données fiables à l’échelle
										locale. La plupart des données disponibles portaient sur des villes ou des régions, ce qui
										empêchait les collectivités de comprendre ce qui se passait sur chaque rue principale ou de
										planifier des solutions ciblées.
									</p>
									<p>
										La première phase a comblé cette lacune en créant la plateforme Mesures des rues principales, le
										premier outil de recherche qui utilise les rues principales comme unité d’analyse principale. Le
										projet a débuté en juin 2022 et a été officiellement lancé en juin 2024. Il a permis de repérer et
										de cartographier chaque rue principale au Canada, et de fournir des données sur les commerces et
										l’infrastructure civique qui s’y trouvent, ainsi qu’un profil démographique du quartier que
										dessert chaque rue principale.
									</p>
									<p>
										Cette analyse a permis de mieux comprendre ce qui rend les rues principales résilientes, comment
										elles soutiennent des collectivités dynamiques et comment elles peuvent devenir plus équitables.
										Les constats et les outils de recherche demeurent accessibles au public dans Mesures des rues
										principales.
									</p>
								{:else}
									<h6 class="mb-6">
										Equipping communities to make smarter investments in main streets and downtowns.
									</h6>
									<p>
										Following the pandemic, many main streets and downtowns faced a combination of
										challenges, including reduced economic activity, social pressures, and uncertainty
										about how to recover.
									</p>
									<p>
										One of the biggest barriers to recovery was a lack of reliable, local-level data.
										Most available data focused on cities or regions, making it difficult for
										communities to understand what was happening on individual main streets or to plan
										targeted solutions.
									</p>
									<p>
										Phase One addressed this gap by creating the Measuring Main Streets platform — the
										first research tool that uses main streets as the primary unit of analysis. The
										project began in June of 2022 and formally launched in June 2024. It identified
										and mapped every main street in Canada and supplied data on the businesses and
										civic infrastructure present as well as a demographic profile of the neighbourhood
										each main street serves.
									</p>
									<p>
										The result of this analysis was a better understanding of what makes main streets
										resilent, how they support vibrant communities, and how they can become more
										equitable. The findings and research tools remain publically available on
										Measuring Main Streets.
									</p>
								{/if}
								<div class="flex mb-4">
									<CustomButton
										href="/reports/executive-summary"
										label={fr ? 'Lire le résumé' : 'Read the executive summary'}
									/>
								</div>
								{#if fr}
									<p>
										Lors de la première phase de financement, les partenaires de l’IUC étaient Environics Analytics
										et Nord Ouvert.
									</p>
								{:else}
									<p>
										In round one of funding, CUI's partners included Environics Analytics and Open
										North.
									</p>
								{/if}
								<div class="partner-logos-grid">
									<a
										href={fr
											? 'https://housing-infrastructure.canada.ca/rki-irc/index-fra.html'
											: 'https://housing-infrastructure.canada.ca/rki-irc/index-eng.html'}
										target="_blank"
									>
										<img src={canada_logo} alt={fr ? 'Logement, Infrastructures et Collectivités Canada' : 'Housing, Infrastructure and Communities Canada'} />
									</a>
									<a href={fr ? 'https://environicsanalytics.com/fr-ca/home' : 'https://environicsanalytics.com/en-ca/home'} target="_blank">
										<img src={environics_logo} alt="Environics Analytics" />
									</a>
									<a href="https://opennorth.ca/" target="_blank">
										<img src={opennorth_logo} alt={fr ? 'Nord Ouvert' : 'Open North'} />
									</a>
								</div>
							</div>
						</div>
					</Accordion>

					<Accordion bind:open={aboutTodOpen} id="about-tod">
						<div slot="header" class="accordion-header">
							<div>
								<span class="eyebrow">{fr ? 'Deuxième phase' : 'Round Two'}</span>
								<h3>
								{fr
									? 'Aménagement axé sur le transport collectif sur la rue principale'
									: 'Transit-Oriented Development on Main'}
							</h3>
							</div>
							<Icon icon={aboutTodOpen ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								{#if fr}
									<h6 class="mb-6">
										Tirer parti de l’aménagement axé sur le transport collectif (TOD) pour améliorer les résultats en
										matière de logement et de collectivités.
									</h6>
									<p>
										À mesure que les collectivités amorçaient leur reprise, de nouveaux défis sont devenus plus
										pressants, en particulier le besoin d’un plus grand nombre de logements et de meilleures façons de
										gérer la croissance. Parallèlement, d’importants investissements dans le transport collectif
										partout au Canada créent de nouvelles possibilités d’aménagement le long des corridors de
										transport collectif.
									</p>
									<p>Toutefois, ces changements soulèvent aussi des questions importantes :</p>
									<ul class="mb-4 list-[circle]">
										<li>Où peut-on réalistement construire de nouveaux logements?</li>
										<li>
											Comment l’aménagement axé sur le transport collectif peut-il profiter aux collectivités plutôt
											que de les déplacer?
										</li>
										<li>
											Comment les décisions peuvent-elles concilier abordabilité, densité et qualité de vie pour créer
											des collectivités complètes et dynamiques?
										</li>
									</ul>
									<p>
										La deuxième phase vise à répondre à ces questions en s’appuyant sur les données et les outils
										créés lors de la première phase. Elle examine la démographie, le potentiel de développement
										résidentiel et les équipements collectifs dans les aires de station de transport collectif (ASTC)
										afin de plaider non seulement pour l’aménagement axé sur le transport collectif, mais aussi pour
										des collectivités complètes axées sur le transport collectif.
									</p>
								{:else}
									<h6 class="mb-6">
										Leveraging transit-oriented development (TOD) to advance housing and community
										outcomes.
									</h6>
									<p>
										As communities began to recover, a new set of challenges became more urgent —
										especially the need for more housing and better ways to manage growth. At the same
										time, major investments in transit across Canada have been creating new
										opportunities for development along transit corridors.
									</p>
									<p>However, these changes also raise important questions:</p>
									<ul class="mb-4 list-[circle]">
										<li>Where can new housing realistically be built?</li>
										<li>
											How can transit-oriented development benefit communities rather than displace
											them?
										</li>
										<li>
											How can decisions balance affordability, density, and quality of life to create
											vibrant, complete communities?
										</li>
									</ul>
									<p>
										Phase Two focuses on answering these questions by building on the data and tools
										created in Phase One. It explores demographics, housing development potential, and
										community amenities in transit station areas (TSAs) to make the case, not just for
										transit-oriented development, but for transit-oriented complete communities.
									</p>
								{/if}
								<div class="flex mb-4">
									<CustomButton
										href="/reports/tod/intro"
										label={fr
											? 'Lire le rapport Plaidoyer pour l’aménagement axé sur le transport collectif'
											: 'Read The Case for Transit-Oriented Development'}
									/>
								</div>
								{#if fr}
									<p>
										Lors de la deuxième phase de financement, les partenaires de l’IUC étaient Environics Analytics, la
										School of Cities de l’Université de Toronto et Digital Public Square.
									</p>
								{:else}
									<p>
										In round two of funding, CUI's partners were Environics Analytics, the School of
										Cities at the University of Toronto, and Digital Public Square.
									</p>
								{/if}
								<div class="partner-logos-grid">
									<img src={canada_logo} alt={fr ? 'Logement, Infrastructures et Collectivités Canada' : 'Housing, Infrastructure and Communities Canada'} />
									<a href={fr ? 'https://environicsanalytics.com/fr-ca/home' : 'https://environicsanalytics.com/en-ca/home'} target="_blank">
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
								</div>
								<p class="contributions-label">{fr ? 'Avec la contribution de' : 'With contributions by'}</p>
								<div class="partner-logos-grid">
									<a href="https://catch-rehac.ca/" target="_blank">
										<img src={catch_logo} alt="CATCH" />
									</a>
									<a href="https://gnowise.com/" target="_blank">
										<img src={gnowise} alt="Gnowise" />
									</a>
								</div>
							</div>
						</div>
					</Accordion>
				</div>
			</section>

			<section id="team-section">
				<div class="section-header">
					<h2>{fr ? 'ÉQUIPE ET PARTENAIRES' : 'TEAM AND PARTNERS'}</h2>
				</div>

				<div class="accordion-group">
					<Accordion bind:open={teamResilienceOpen} id="team-resilience">
						<div slot="header" class="accordion-header">
							<h3>{fr ? 'Résilience sur la rue principale' : 'Resilience on Main'}</h3>
							<Icon icon={teamResilienceOpen ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<p class="contributions-label">{fr ? 'Partenaires' : 'Partners'}</p>
							<div class="partner-logos-grid">
								<img src={canada_logo} alt={fr ? 'Logement, Infrastructures et Collectivités Canada' : 'Housing, Infrastructure and Communities Canada'} />
								<a href={fr ? 'https://environicsanalytics.com/fr-ca/home' : 'https://environicsanalytics.com/en-ca/home'} target="_blank">
									<img src={environics_logo} alt="Environics Analytics" />
								</a>
								<a href="https://opennorth.ca/" target="_blank">
									<img src={opennorth_logo} alt={fr ? 'Nord Ouvert' : 'Open North'} />
								</a>
							</div>
							<h4 class="mt-8 mb-6">{fr ? 'Membres de l’équipe' : 'Team Members'}</h4>
							<div class="card-grid">
								<ContactCard
									link="https://canurb.org/team/gregory-spencer/"
									title="Gregory Spencer"
									description={fr ? 'Directeur, Recherche' : 'Director, Research'}
								/>
								<ContactCard
									link="https://canurb.org/team/jennifer-barrett/"
									title="Jennifer Barrett"
									description={fr ? 'Directrice générale, Programmes, planification et politiques' : 'Managing Director, Programs, Planning and Policy'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/ananmay-sharan"
									title="Ananmay Sharan"
									description={fr ? 'Développeur Web' : 'Web Developer'}
								/>
								<ContactCard
									link="https://canurb.org/team/alex-tabascio/"
									title="Alex Tabascio"
									description={fr ? 'Analyste de données' : 'Data Analyst'}
								/>
								<ContactCard
									link="https://canurb.org/team/emily-wassmansdorf/"
									title="Emily Wassmansdorf"
									description={fr ? 'Gestionnaire des communications' : 'Communications Manager'}
								/>
								<ContactCard
									link="https://canurb.org/team/leandro-santos/"
									title="Leandro G. Santos"
									description={fr ? 'Urbaniste principal' : 'Senior Planner'}
								/>
								<ContactCard
									link="https://canurb.org/team/toma-beit-arie/"
									title="Toma Beit-Arie"
									description={fr ? 'Urbaniste en recherche' : 'Research Planner'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/david-scrivener-toronto/"
									title="David Scrivener"
									description={fr ? 'Chercheur de terrain' : 'Field Researcher'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/ever-hughes-93ga64/"
									title="Ever Hughes"
									description={fr ? 'Stagiaire en données' : 'Data Intern'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/amanda-ng-2323591a6/"
									title="Amanda Ng"
									description={fr ? 'Stagiaire en données' : 'Data Intern'}
								/>
							</div>

							<h4 class="mt-12 mb-6">{fr ? 'Partenaires et consultants' : 'Partners & Consultants'}</h4>

							<div class="card-grid">
								<ContactCard
									link="https://www.linkedin.com/in/steve-coutts"
									title="Steve Coutts"
									description={fr ? 'Nord Ouvert' : 'Open North'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/sanjida-rabbi/"
									title="Sanjida Rabbi"
									description={fr ? 'Nord Ouvert' : 'Open North'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/neufeldb/"
									title="Bronwyn Neufeld"
									description={fr ? 'Chercheuse de terrain' : 'Field Researcher'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/elainestam/"
									title="Elaine Stam"
									description="Universe Design Studio"
								/>
							</div>
						</div>
					</Accordion>

					<Accordion bind:open={teamTodOpen} id="team-tod">
						<span id="tod-partners" class="absolute -top-20"></span>
						<div slot="header" class="accordion-header">
							<h3>
								{fr
									? 'Aménagement axé sur le transport collectif sur la rue principale'
									: 'Transit-Oriented Development on Main'}
							</h3>
							<Icon icon={teamTodOpen ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<p class="contributions-label">{fr ? 'Partenaires' : 'Partners'}</p>
							<div class="partner-logos-grid">
								<img src={canada_logo} alt={fr ? 'Logement, Infrastructures et Collectivités Canada' : 'Housing, Infrastructure and Communities Canada'} />
								<a href={fr ? 'https://environicsanalytics.com/fr-ca/home' : 'https://environicsanalytics.com/en-ca/home'} target="_blank">
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
							</div>
							<p class="contributions-label mt-8">{fr ? 'Avec la contribution de' : 'With contributions by'}</p>
							<div class="partner-logos-grid">
								<a href="https://catch-rehac.ca/" target="_blank">
									<img src={catch_logo} alt="CATCH" />
								</a>
								<a href="https://gnowise.com/" target="_blank">
									<img src={gnowise} alt="Gnowise" />
								</a>
							</div>
							<h4 class="mt-8 my-6">{fr ? 'Membres de l’équipe' : 'Team Members'}</h4>
							<div class="card-grid">
								<ContactCard
									link="https://canurb.org/team/gregory-spencer/"
									title="Gregory Spencer"
									description={fr ? 'Directeur, Recherche' : 'Director, Research'}
								/>
								<ContactCard
									link="https://canurb.org/team/jennifer-barrett/"
									title="Jennifer Barrett"
									description={fr ? 'Directrice générale, Programmes, planification et politiques' : 'Managing Director, Programs, Planning and Policy'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/genna-weber-4168a1225/"
									title="Genna Weber"
									description={fr ? 'Ingénieure logiciel principale' : 'Senior Software Engineer'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/iris-wu-6090151b7/"
									title="Iris Wu"
									description={fr ? 'Analyste de données SIG / Développeuse Web' : 'GIS Data Analyst / Web Developer'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/lucacarnegie/"
									title="Luca Carnegie"
									description={fr ? 'Analyste de données et designer UX' : 'Data Analyst & UX Designer'}
								/>
								<ContactCard
									link="https://canurb.org/team/alex-tabascio/"
									title="Alex Tabascio"
									description={fr ? 'Analyste de données' : 'Data Analyst'}
								/>
								<ContactCard
									link="https://canurb.org/team/emily-wassmansdorf/"
									title="Emily Wassmansdorf"
									description={fr ? 'Gestionnaire des communications' : 'Communications Manager'}
								/>
								<ContactCard
									link="https://canurb.org/team/leandro-santos/"
									title="Leandro G. Santos"
									description={fr ? 'Urbaniste principal' : 'Senior Planner'}
								/>
								<ContactCard
									link="https://canurb.org/team/toma-beit-arie/"
									title="Toma Beit-Arie"
									description={fr ? 'Urbaniste en recherche' : 'Research Planner'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/zhaoyi-wang-econ/"
									title="Zhaoyi Wang"
									description={fr ? 'Stagiaire' : 'Intern'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/samuel-levi-abramsky/"
									title="Samuel Levi-Abramsky"
									description={fr ? 'Stagiaire' : 'Intern'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/elizabeth-wakileh/"
									title="Elizabeth Wakileh"
									description={fr ? 'Stagiaire' : 'Intern'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/lianne-harrison122/"
									title="Lianne Harrison"
									description={fr ? 'Stagiaire' : 'Intern'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/jaehyeong-jang-a2097521b/"
									title="Jaehyeong Jang"
									description={fr ? 'Stagiaire' : 'Intern'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/raghad-gamea-38227022a/"
									title="Raghad Gamea"
									description={fr ? 'Stagiaire' : 'Intern'}
								/>
							</div>

							<h4 class="mt-12 mb-6">School of Cities</h4>
							<div class="card-grid">
								<ContactCard
									link="https://schoolofcities.utoronto.ca/people/karen-chapple/"
									title="Karen Chapple"
									description={fr ? 'Directrice' : 'Director'}
								/>
								<ContactCard
									link="https://schoolofcities.utoronto.ca/people/kathryn-exon-smith/"
									title="Kathryn Exon Smith"
									description={fr ? 'Agente principale de recherche' : 'Senior Research Officer'}
								/>
								<ContactCard
									link="https://schoolofcities.utoronto.ca/people/jeff-allen/"
									title="Jeff Allen"
									description={fr ? 'Responsable, Visualisation des données' : 'Lead, Data Visualization'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/anika-taboy/"
									title="Anika Taboy"
									description={fr ? 'Auxiliaire de recherche' : 'Research Assistant'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/miekoyao/"
									title="Mieko Yao"
									description={fr ? 'Développeuse Web' : 'Web Developer'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/xinyue-wang-72209a26a/"
									title="Mia Wang"
									description={fr ? 'Auxiliaire de recherche' : 'Research Assistant'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/an-pham-boston/"
									title="An Pham"
									description={fr ? 'Auxiliaire de recherche' : 'Research Assistant'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/polina-gorn-b2a1b8284/"
									title="Polina Gorn"
									description={fr ? 'Auxiliaire de recherche' : 'Research Assistant'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/isabeaux-graham/"
									title="Isabeaux Graham"
									description={fr ? 'Auxiliaire de recherche' : 'Research Assistant'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/carrie-zeng-591644227/"
									title="Carrie Zeng"
									description={fr ? 'Auxiliaire de recherche' : 'Research Assistant'}
								/>
								<ContactCard
									link="https://schoolofcities.utoronto.ca/people/felicity-heyworth/"
									title="Felicity Heyworth"
									description={fr ? 'Agente principale des communications' : 'Senior Communications Officer'}
								/>
							</div>

							<h4 class="mt-12 mb-6">Infrastructure Institute</h4>
							<div class="card-grid">
								<ContactCard
									link="https://infrastructureinstitute.ca/matti-siemiatycki/"
									title="Matti Siemiatycki"
									description={fr ? 'Directeur' : 'Director'}
								/>
								<ContactCard
									link="https://infrastructureinstitute.ca/sarah-chan/"
									title="Sarah Chan"
									description={fr ? 'Responsable, Planification et design' : 'Planning and Design Lead'}
								/>
								<ContactCard
									link="https://infrastructureinstitute.ca/phat-le/"
									title="Phat Le"
									description={fr ? 'Designer en architecture' : 'Architectural Designer'}
								/>
								<ContactCard
									link="https://infrastructureinstitute.ca/daniel-lam/"
									title="Daniel Lam"
									description={fr ? 'Designer en architecture' : 'Architectural Designer'}
								/>
								<ContactCard
									link="https://infrastructureinstitute.ca/alexandra-lambropoulos/"
									title="Alexandra Lambropoulos"
									description={fr ? 'Urbaniste' : 'Urban Planner'}
								/>
								<ContactCard
									link="https://infrastructureinstitute.ca/eva-hellreich/"
									title="Eva Hellreich"
									description={fr ? 'Agente des communications' : 'Communications Officer'}
								/>
							</div>

							<h4 class="mt-12 mb-6">{fr ? 'Université de Toronto' : 'University of Toronto'}</h4>
							<div class="card-grid">
								<ContactCard
									link="https://www.sociology.utoronto.ca/people/directories/all-faculty/prentiss-dantzler"
									title="Prentiss Dantzler"
									description={fr ? 'Professeur agrégé, Département de sociologie' : 'Associate Professor, Department of Sociology'}
								/>
								<ContactCard
									link="https://www.utsc.utoronto.ca/geography/steven-farber"
									title="Steven Farber"
									description={fr ? 'Professeur, Département de géographie' : 'Professor, Department of Geography'}
								/>
								<ContactCard
									link="https://civmin.utoronto.ca/home/about-us/directory/professors/marianne-hatzopoulou/"
									title="Marianne Hatzopoulou"
									description={fr ? 'Professeure, Département de génie civil et minier' : 'Professor, Department of Civil & Mineral Engineering'}
								/>
								<ContactCard
									link="https://civmin.utoronto.ca/home/about-us/directory/professors/shoshanna-saxe/"
									title="Shoshanna Saxe"
									description={fr ? 'Professeure agrégée, Département de génie civil et minier' : 'Associate Professor, Department of Civil & Mineral Engineering'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/alexanderhempel/"
									title="Alexander Hempel"
									description={fr ? 'Chercheur postdoctoral' : 'Postdoctoral Fellow'}
								/>
								<ContactCard
									link="https://schoolofcities.utoronto.ca/people/amir-forouhar/"
									title="Amir Forouhar"
									description={fr ? 'Chercheur postdoctoral' : 'Postdoctoral Fellow'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/brenn-anderson-gregson/"
									title="Brenn Anderson-Gregson"
									description={fr ? 'Recherche doctorale, Département de géographie et d’urbanisme' : 'Doctoral Researcher, Department of Geography and Planning'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/emily-farrar-gt/"
									title="Emily Farrar"
									description={fr ? 'Doctorante, Département de génie civil et minier' : 'Doctoral Researcher, Department of Civil & Mineral Engineering'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/khaliljmartin/"
									title="Khalil Martin"
									description={fr ? 'Auxiliaire de recherche, Housing Justice Lab' : 'Research Assistant, Housing Justice Lab'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/abigail-meza-a1b4b121b/"
									title="Abigail Meza"
									description={fr ? 'Auxiliaire de recherche, Housing Justice Lab' : 'Research Assistant, Housing Justice Lab'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/keaganrankin/"
									title="Keagan H. Rankin"
									description={fr ? 'Doctorant, Département de génie civil et minier' : 'Doctoral Researcher, Department of Civil & Mineral Engineering'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/letzai-ruiz-valero/"
									title="Letzai Ruiz"
									description={fr ? 'Associée de recherche, Centre for the Sustainable Built Environment' : 'Research Associate, Centre for the Sustainable Built Environment'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/hoda-touma/"
									title="Hoda Touma"
									description={fr ? 'Gestionnaire de projets de recherche, Département de génie civil et minier' : 'Research Project Manager, Department of Civil & Mineral Engineering'}
								/>
								<ContactCard
									link="https://www.linkedin.com/in/santiago-zuluaga-a9b085116/"
									title="Santiago Zuluaga Mayorga"
									description={fr ? 'Chercheur postdoctoral' : 'Postdoctoral Fellow'}
								/>
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
				<h3 class="mb-8">{fr ? 'NOUS JOINDRE' : 'CONTACT US'}</h3>

				<div class="contact-grid">
					<div class="contact-item">
						<span class="label">INQUIRIES?</span>
						<p>Contact us at <a href="mailto:cui@canurb.org">cui@canurb.org</a></p>
					</div>

					<div class="contact-item">
						<span class="label">NEWSLETTER</span>
						<p>
							<a href="https://canurb.org/subscribe/" target="_blank">Subscribe</a> to the Canadian Urban
							Institute newsletter.
						</p>
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

	.contributions-label {
		text-align: center;
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #999;
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
