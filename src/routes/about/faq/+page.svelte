<script>
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import { tick } from 'svelte';
	import Accordion from '../../lib/ui/Accordion.svelte';
	import '../../styles.css';
// Logos
	import canada_logo from '../../lib/assets/logos/canada_color.png';
	// Assets
	import mainstreets from '../../lib/assets/graphics/mainstreets.svg';
	import vancouver_bg from '../../lib/assets/graphics/vancouver-bg.png';

	import { getLang } from '../../lib/i18n';
	const fr = getLang() === 'fr';

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
		'what-are-tsas': false,
		'tod-partners': false
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
			} else if (hash === 'what-are-tsas') {
				faqs['what-are-tsas'] = true;
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
			{#if fr}
				<h1>FOIRE<br />AUX<br /><span class="text-blue">QUESTIONS</span></h1>
			{:else}
				<h1>FREQUENTLY<br />ASKED<br /><span class="text-blue">QUESTIONS</span></h1>
			{/if}
		</div>
	</div>

	<div class="container main-content">
		<div class="sidebar lg:sticky lg:top-10 h-full">
			<nav>
				<div class="nav-group">
					<h3>{fr ? 'PHASES DU PROJET' : 'PROJECT PHASES'}</h3>
					<ul>
						<li>
							<button
								class:active={activeSection === 'resilience'}
								onclick={() => {
									activeSection = 'resilience';
									scrollTo('resilience-section');
								}}
							>
								{fr ? 'Résilience sur la rue principale' : 'Resilience on Main'}
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
								{fr ? 'TOD sur la rue principale' : 'TOD on Main'}
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
			<!-- Resilience Section -->
			<section id="resilience-section">
				<div class="section-header">
					<span class="eyebrow">{fr ? 'Première phase' : 'Round One'}</span>
					<h2>{fr ? 'RÉSILIENCE SUR LA RUE PRINCIPALE' : 'RESILIENCE ON MAIN'}</h2>
				</div>

				<div class="accordion-group">
					<Accordion bind:open={faqs['what-is-mms']} id="what-is-mms">
						<div slot="header" class="accordion-header">
							<h3>{fr ? 'Qu’est-ce que Mesures des rues principales?' : 'What is Measuring Main Streets?'}</h3>
							<Icon icon={faqs['what-is-mms'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								{#if fr}
									<p>
										La plateforme Mesures des rues principales fait partie de l’Initiative de recherche et de
										connaissances de Logement, Infrastructures et Collectivités Canada. Elle est développée par
										l’Institut urbain du Canada avec le soutien de nos partenaires Environics Analytics et Nord
										Ouvert.
									</p>
									<p>La plateforme s’articule autour de quatre composantes interreliées :</p>
									<ul style="list-style: disc; padding-left: 1.5rem; margin-bottom: 1.5rem;">
										<li>
											Une carte nationale interactive qui fournit des données descriptives sur chaque rue principale
											du pays.
										</li>
										<li>
											Un ensemble de 30 études de cas complètes réparties dans 10 régions (Toronto; Montréal;
											Edmonton) ainsi que 30 études de cas partielles (données seulement).
										</li>
										<li>
											Une série de notes de recherche analytiques et de rapports qui aident à interpréter les données
											et proposent des pistes d’intervention en matière de politiques publiques.
										</li>
										<li>
											Un ensemble d’outils intelligents et de recommandations pour éclairer la résilience des rues
											principales et les investissements futurs dans l’infrastructure civique.
										</li>
									</ul>
								{:else}
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
								{/if}
							</div>
						</div>
					</Accordion>

					<Accordion bind:open={faqs['what-is-main-street']} id="what-is-main-street">
						<div slot="header" class="accordion-header">
							<h3>{fr ? 'Qu’est-ce qu’une « rue principale » et comment la définit-on?' : 'What is a \'main street\' and how is it defined?'}</h3>
							<Icon icon={faqs['what-is-main-street'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								{#if fr}
									<p>
										Le terme « rue principale » désigne le point focal commercial et communautaire d’un quartier.
										Les rues principales offrent aux personnes résidentes des environs un accès à des boutiques, à des
										commerces de détail, à des restaurants et bars ainsi qu’à des services de proximité. Notre
										définition distingue deux types de rues principales, celles « à forte densité » et celles « à
										faible densité », établies selon des seuils de densité autour des commerces et de
										l’infrastructure civique des rues principales. Pour en savoir plus sur notre méthodologie,
										consultez la page <a href="/about/data-methodology/">Données et méthodologie</a>.
									</p>
								{:else}
									<p>
										The term “main street” represents the commercial and community focal point of a
										neighbourhood. They offer nearby residents access to shops, retailers, food and
										drink, and local services. Our definition of main streets split them into two
										types, 'high density' and 'low density' main streets, which were defined based on
										density thresholds around main street businesses and civic infrastructure. Learn
										more about the methodology we use on the <a href="/about/data-methodology/"
											>Data and Methodology</a
										> page.
									</p>
								{/if}
							</div>
						</div>
					</Accordion>

					<Accordion bind:open={faqs['why-important']} id="why-important">
						<div slot="header" class="accordion-header">
							<h3>{fr ? 'Pourquoi les rues principales sont-elles importantes?' : 'Why are main streets important?'}</h3>
							<Icon icon={faqs['why-important'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								{#if fr}
									<p>
										Les rues principales sont l’épine dorsale de la société canadienne : 85 % de la population
										canadienne vit à moins d’un kilomètre d’une rue principale. Ces rues accueillent 280 000
										entreprises, qui fournissent 1,9 million d’emplois et génèrent 300 milliards de dollars de
										revenus annuels. On y trouve aussi plus de 98 000 actifs d’infrastructure communautaire et
										civique.
									</p>
									<p>
										Les rues principales sont la pierre angulaire des « collectivités complètes », où la population
										peut vivre, travailler et se divertir au sein de son propre quartier. Elles sont nos moteurs
										économiques et le tissu conjonctif de notre vie sociale.
									</p>
								{:else}
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
								{/if}
							</div>
						</div>
					</Accordion>

					<Accordion bind:open={faqs['data-source']} id="data-source">
						<div slot="header" class="accordion-header">
							<h3>{fr ? 'D’où proviennent vos données?' : 'How did you source your data?'}</h3>
							<Icon icon={faqs['data-source'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								{#if fr}
									<p>
										Nous avons puisé nos données dans diverses sources, ouvertes et exclusives. Pour en savoir plus
										sur les jeux de données utilisés, consultez la page <a href="/about/data-methodology"
											>Données et méthodologie</a
										>.
									</p>
								{:else}
									<p>
										We sourced data from a variety of sources, both open and proprietary. Learn more
										about the specific datasets used on the <a href="/about/data-methodology"
											>Data and Methodology</a
										> page.
									</p>
								{/if}
							</div>
						</div>
					</Accordion>

					<Accordion bind:open={faqs['who-created']} id="who-created">
						<div slot="header" class="accordion-header">
							<h3>{fr ? 'Qui a créé ce projet?' : 'Who created this project?'}</h3>
							<Icon icon={faqs['who-created'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								{#if fr}
									<p>
										La plateforme Mesures des rues principales fait partie de l’Initiative de recherche et de
										connaissances de Logement, Infrastructures et Collectivités Canada. Elle est développée par
										l’Institut urbain du Canada avec le soutien de nos partenaires Environics Analytics et Nord
										Ouvert.
									</p>
								{:else}
									<p>
										The Measuring Main Streets platform is a part of the Research Knowledge Initiative
										program from Housing, Infrastructure and Communities Canada. It is developed by
										the Canadian Urban Institute with support from our partners at Environics
										Analytics and Open North.
									</p>
								{/if}
							</div>
						</div>
					</Accordion>

					<Accordion bind:open={faqs['missing-street']} id="missing-street">
						<div slot="header" class="accordion-header">
							<h3>{fr ? 'Pourquoi ma rue principale ne figure-t-elle pas sur la carte des rues principales?' : 'Why can\'t I find my main street on the Main Street Map?'}</h3>
							<Icon icon={faqs['missing-street'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								{#if fr}
									<p>
										L’IUC a utilisé une méthodologie rigoureuse, fondée sur les données, pour repérer les rues
										principales, notamment au moyen d’itérations continues et de l’intégration des commentaires de
										diverses parties prenantes. Toutefois, des données incomplètes ou des erreurs d’analyse pourraient
										faire en sorte que votre rue principale ne soit pas classée dans la catégorie « rue principale ».
									</p>
									<p>
										Si vous avez d’autres questions ou souhaitez signaler une rue principale manquante,
										<a href="/about/#contact">communiquez avec nous.</a> Veuillez noter que vous pouvez tout de même
										consulter toutes les données associées à votre rue principale dans l’outil cartographique, même si
										la plateforme ne la présente pas visuellement comme une rue principale.
									</p>
								{:else}
									<p>
										CUI used a rigourous, data backed methodology for our identification of main
										streets, which included continuous iteration and incorporation of feedback from a
										variety of stakeholders. However, incomplete data or analytical errors could lead
										to your main street being excluded from the category of ‘main street’.
									</p>
									<p>
										If you have any further questions or would like to identify a missed main street,
										<a href="/about/#contact">contact us.</a> Please note that you can still see all of
										the data associated with your main street using the mapping tool even if it is not
										visually categorized as a main street by the platform.
									</p>
								{/if}
							</div>
						</div>
					</Accordion>

					<Accordion bind:open={faqs['create-case-study']} id="create-case-study">
						<div slot="header" class="accordion-header">
							<h3>{fr ? 'Comment créer une étude de cas pour ma rue?' : 'How do I create a case study for my street?'}</h3>
							<Icon icon={faqs['create-case-study'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								{#if fr}
									<p>
										L’Institut urbain du Canada a utilisé les données de Mesures des rues principales pour produire des
										études de cas, des rapports et d’autres livrables pour divers partenaires. Si vous ou votre
										organisation souhaitez collaborer avec nous, veuillez <a href="/about/contact"
											>nous écrire en précisant votre demande.</a
										>
									</p>
								{:else}
									<p>
										The Canadian Urban Institute has used Measuring Main Streets data to produce case
										studies, reports, and other deliverables for various partners. If you or your
										organization may be interested in collaborating, please <a href="/about/contact"
											>contact us with your specific enquiry.</a
										>
									</p>
								{/if}
							</div>
						</div>
					</Accordion>

					<Accordion bind:open={faqs['choose-regions']} id="choose-regions">
						<div slot="header" class="accordion-header">
							<h3>{fr ? 'Comment avez-vous choisi les régions et les rues des études de cas?' : 'How did you choose the case study regions and streets?'}</h3>
							<Icon icon={faqs['choose-regions'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								{#if fr}
									<p>
										Nous avons réalisé 60 études de cas au total dans les régions de Toronto, de Montréal et
										d’Edmonton, soit 20 par région. Dans chaque région, 10 sont des études de cas complètes, qui
										combinent des données sur les rues principales et des observations qualitatives recueillies lors
										de visites sur le terrain, tandis que les 10 autres portent uniquement sur les données.
									</p>
									<p>
										Les 20 rues principales visaient à constituer un échantillon représentatif des types de rues de
										chaque contexte régional. Ainsi, quatre rues principales de centre-ville (axées sur les lieux de
										travail), quatre de petite ville et 12 de quartier (axées sur les milieux résidentiels) ont été
										retenues, en accordant une attention particulière aux communautés en quête d’équité.
									</p>
								{:else}
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
								{/if}
							</div>
						</div>
					</Accordion>

					<Accordion bind:open={faqs['my-main-street']} id="my-main-street">
						<div slot="header" class="accordion-header">
							<h3>{fr ? 'Ce programme est-il lié à Ma rue principale?' : 'Is this program connected to My Main Street?'}</h3>
							<Icon icon={faqs['my-main-street'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								{#if fr}
									<p>
										Ma rue principale est un investissement de 15 millions de dollars du gouvernement du Canada, par
										l’intermédiaire de l’Agence fédérale de développement économique pour le Sud de l’Ontario
										(FedDev Ontario), visant à stimuler la reprise économique locale. Ma rue principale est mis en
										œuvre par l’Institut urbain du Canada (IUC) pour soutenir la revitalisation de quartiers partout
										dans le Sud de l’Ontario.
									</p>
									<p>
										Les deux programmes ne sont pas directement liés; toutefois, l’infrastructure technique développée
										dans le cadre du projet Mesures des rues principales a contribué à alimenter le programme Ma rue
										principale et d’autres initiatives de l’IUC.
									</p>
								{:else}
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
								{/if}
							</div>
						</div>
					</Accordion>
				</div>
			</section>

			<!-- TOD Section -->
			<section id="tod-section" class="mt-20">
				<div class="section-header">
					<span class="eyebrow">{fr ? 'Deuxième phase' : 'Round Two'}</span>
					<h2>
						{fr
							? 'AMÉNAGEMENT AXÉ SUR LE TRANSPORT COLLECTIF SUR LA RUE PRINCIPALE'
							: 'TRANSIT-ORIENTED DEVELOPMENT ON MAIN'}
					</h2>
				</div>
				<div class="accordion-group">
					<Accordion bind:open={faqs['what-is-tod']} id="what-is-tod">
						<div slot="header" class="accordion-header">
							<h3>{fr ? 'Qu’est-ce que l’« aménagement axé sur le transport collectif (TOD) »?' : 'What is “Transit-oriented development (TOD)”?'}</h3>
							<Icon icon={faqs['what-is-tod'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								{#if fr}
									<p>
										Selon l’<a href="https://tod.itdp.org/what-is-tod.html"
											>Institute for Transportation and Development Policy</a
										> : « Le TOD, ou aménagement axé sur le transport collectif, est une approche du développement
										urbain conçue pour réunir les personnes, les services et les activités autour d’un transport
										collectif de qualité, appuyé par des conditions favorables à la marche et au vélo, afin de
										favoriser des déplacements plus courts, de meilleurs modes de vie et une utilisation plus efficace
										des ressources de la ville. » (traduction libre)
									</p>
									<p>
										Dans Mesures des rues principales, nous nous concentrons sur l’aménagement dans un rayon de 800 m
										autour des stations de transport collectif structurant.
									</p>
									<p>
										Pour en savoir plus sur les avantages et les nuances de l’aménagement axé sur le transport
										collectif, consultez le rapport
										<a href="/reports/tod/intro">Plaidoyer pour l’aménagement axé sur le transport collectif.</a>
									</p>
								{:else}
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
										<a href="/reports/tod/intro">The Case for Transit-Oriented Development.</a>
									</p>
								{/if}
							</div>
						</div>
					</Accordion>

					<Accordion bind:open={faqs['what-are-tsas']} id="what-are-tsas">
						<div slot="header" class="accordion-header">
							<h3>{fr ? 'Qu’est-ce qu’une aire de station de transport collectif (ASTC)?' : 'What is a Transit Station Area (TSA)”?'}</h3>
							<Icon icon={faqs['what-are-tsas'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								{#if fr}
									<p>
										Les aires de station de transport collectif sont souvent définies comme « la zone située dans un
										rayon de 500 à 800 mètres d’une station de transport collectif structurant, ce qui représente
										environ 10 minutes de marche » (traduction libre). <a
											href="https://www.hamilton.ca/build-invest-grow/planning-development/official-plan/official-plan-review/major-transit-station"
											>(Source : Ville de Hamilton)</a
										>
									</p>
									<p>
										Aux fins de notre recherche, nous utilisons le terme « aire de station de transport collectif »
										(ASTC) pour désigner un rayon de 800 m autour de toutes les stations de transport collectif
										structurant, peu importe leur zonage ou leur désignation officielle.
									</p>
								{:else}
									<p>
										Transit Station Areas are often defined as “the area within a 500 to 800
										metre radius of a higher order transit station representing about a 10-minute
										walk.” <a
											href="https://www.hamilton.ca/build-invest-grow/planning-development/official-plan/official-plan-review/major-transit-station"
											>(Source: City of Hamilton)</a
										>
									</p>
									<p>
										For the purposes of our research, we have used the term “transit station area”
										(TSA) to refer to an 800m radius of all higher order transit stations regardless
										of their official zoning or designation.
									</p>
								{/if}
							</div>
						</div>
					</Accordion>
					<Accordion bind:open={faqs['tod-partners']} id="tod-partners">
						<div slot="header" class="accordion-header">
							<h3>{fr ? 'Qui étaient les partenaires de cette phase du projet?' : 'Who were the partners of this project round?'}</h3>
							<Icon icon={faqs['tod-partners'] ? 'mdi:minus' : 'mdi:plus'} />
						</div>
						<div slot="body" class="accordion-body">
							<div class="text-content">
								{#if fr}
									<p>
										Lors de la deuxième phase de financement, les ressources de Mesures des rues principales ont été
										créées avec le soutien de nos partenaires : Environics Analytics, la School of Cities de
										l’Université de Toronto, Digital Public Square et la Canadian Alliance for Transit-Connected
										Housing.
									</p>
								{:else}
									<p>
										In round two of funding, resources on Measuring Main Streets was created with
										support from our partners at Environics Analytics, the School of Cities at the
										University of Toronto, Digital Public Square, and the Canadian Alliance for
										Transit-Connected Housing.
									</p>
								{/if}
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
				<h3>{fr ? 'VOUS AVEZ D’AUTRES QUESTIONS?' : 'STILL HAVE QUESTIONS?'}</h3>

				<div class="contact-grid">
					<div class="contact-item">
						<span class="label">{fr ? 'NOUS JOINDRE' : 'GET IN TOUCH'}</span>
						<p>
							{fr ? 'Écrivez-nous à' : 'Contact us at'} <a href="mailto:cui@canurb.org">cui@canurb.org</a>
						</p>
					</div>

					<div class="contact-item">
						<span class="label">{fr ? 'EN SAVOIR PLUS' : 'LEARN MORE'}</span>
						<p>
							{fr ? 'Découvrez nos autres travaux sur' : 'See more of our work at'}
							<a href="https://www.canurb.org">www.canurb.org</a>
						</p>
					</div>

					<div class="contact-item">
						<span class="label">{fr ? 'SUIVEZ-NOUS' : 'CONNECT'}</span>
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
