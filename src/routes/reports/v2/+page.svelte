<script>
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import ccreport from '../../lib/assets/graphics/ccreport.png';
	import civic from '../../lib/assets/graphics/civic.svg';
	import devreport from '../../lib/assets/graphics/devpotentialreport.png';
	import Edmonton from '../../lib/assets/graphics/edmonton.jpg';
	import goldenmile from '../../lib/assets/graphics/golden-mile.png';
	import grocery from '../../lib/assets/graphics/grocery.jpg';
	import mainstreets from '../../lib/assets/graphics/mainstreets.svg';
	import malls from '../../lib/assets/graphics/malls.svg';
	import Montreal from '../../lib/assets/graphics/montreal.jpg';
	import opennorth from '../../lib/assets/graphics/opennorth.svg';
	import resiliency from '../../lib/assets/graphics/resiliency.svg';
	import Toronto from '../../lib/assets/graphics/toronto.jpg';
	import catch_logo from '../../lib/assets/logos/catch_color.png';
	import dps_logo from '../../lib/assets/logos/DPS-logo-black.png';
	import soc from '../../lib/assets/logos/uotsoc_color.png';
	import arbutus from '../../lib/assets/screenshots/arbutus.png';
	import decarbonizing from '../../lib/assets/screenshots/decarbonizing.png';
	import displacement from '../../lib/assets/screenshots/displacement2.png';
	import embodiedcarbon from '../../lib/assets/screenshots/emissions.png';
	import fiscalimpacts from '../../lib/assets/screenshots/fiscal.png';
	import intensification from '../../lib/assets/screenshots/intensification.png';
	import intro from '../../lib/assets/screenshots/IntroHeader.png';
	import transportation from '../../lib/assets/screenshots/transportation.png';
	import whotsas from '../../lib/assets/screenshots/who-tsas.png';
	import LandingLayout from '../../lib/ui/LandingLayout.svelte';
	import cooksville from '../../reports/assets/dps-cooksville.png';
	import northfield from '../../reports/assets/dps-northfield.png';
	import dpsmethod from '../../reports/assets/dps-welcome.png';
	import catchreport from '../../reports/tod/catch/assets/elevated-train.png';
	import '../../styles.css';

	const title = 'Measuring Main Streets Reports';

	const tabs = [
		{
			label: 'TOD on Main',
			value: 'tod',
			description: [
				'Canada’s housing system is failing to meet the needs of Canadians, and we need solutions to increase production and expand available options to make housing accessible and affordable everyone from communities of all sizes. How can Transit-Oriented Development (TOD) be catalyzed to meet Canada’s ambitious housing goals, while contributing to the creation of equitable, vibrant, complete communities? '
			],
			categories: [
				'Mobility',
				'Equity',
				'GHG Emissions',
				'Infographic',
				'Regional Report',
				'Partner Report',
				'School of Cities',
				'Complete Communities',
				'Development Potential'
			],
			items: [
				{
					title: 'The Case for Transit Oriented Development',
					description:
						'Why is transit-oriented development worth investing in, and what is needed to make it successful?',
					image: intro,
					link: '/reports/tod/intro',
					tags: ['Executive Summary']
				},
				{
					title: "Who Lives in Canada's Transit Station Areas?",
					description:
						'A visual summary of the demographic makeup of transit station areas across Canada.',
					image: whotsas,
					link: '/reports/tod/who-lives-in-tsas',
					tags: ['Infographic', 'Regional Report']
				},
				{
					title: 'Walkability Report',
					description: 'Communities are only complete if they are walkable.',
					image: arbutus,
					link: '/reports/tod/walkability',
					tags: ['Mobility', 'Complete Communities', 'Regional Report']
				},
				{
					title: 'Eating Well',
					description: 'Enabling affordable grocery options in and around transit stations.',
					image: grocery,
					link: '/reports/tod/eating-well',
					tags: ['Complete Communities']
				},
				{
					title: 'From TOD to TOCC',
					description:
						'Transit-oriented development and complete communities in a Canadian context.',
					image: ccreport,
					link: '/reports/tod/complete-communities',
					tags: ['Complete Communities']
				},
				{
					title: 'Hight Potential',
					description: 'Exploring housing development potential in transit station areas.',
					image: devreport,
					link: '/reports/tod/development-potential',
					tags: ['Development Potential']
				},

				{
					title: 'Transit-Induced Displacement',
					description:
						'How opening new transit stations affects low-income residents, with research into patterns of residential displacement and exclusion. ',
					image: displacement,
					logo: soc,
					link: '/reports/tod/displacement',
					tags: ['Equity', 'School of Cities']
				},
				{
					title: 'Embodied GHG Emissions',
					description:
						'Research quantifying how planning decisions shape embodied GHG emissions from proposed development in five Canadian case study scenarios. ',
					image: embodiedcarbon,
					logo: soc,
					link: '/reports/tod/embodied-carbon',
					tags: ['GHG Emissions', 'School of Cities']
				},
				{
					title: 'Decarbonizing Transport',
					description:
						'Explores whether directing growth to transit-rich areas meaningfully reduces vehicle travel and emissions. ',
					logo: soc,
					image: decarbonizing,
					link: '/reports/tod/decarbonizing',
					tags: ['GHG Emissions', 'School of Cities']
				},
				{
					title: 'Transportation Equity',
					description:
						'Research into how TOD affects two key metrics: transportation equity and sustainable mode shift. ',
					logo: soc,
					image: transportation,
					link: '/reports/tod/transportation-equity',
					tags: ['Equity', 'Mobility', 'School of Cities']
				},
				{
					title: 'Tracking Neighbourhood Changes',
					description:
						'Explores whether TOD areas promote affordability through increased building unit construction. ',
					logo: soc,
					image: intensification,
					link: '/reports/tod/intensification-equity',
					tags: ['Equity', 'School of Cities']
				},
				{
					title: 'Fiscal Impacts of TOD',
					description:
						'Examines whether TOD generates net revenues or costs for municipal governments. ',
					logo: soc,
					image: fiscalimpacts,
					link: '/reports/tod/fiscal-impacts',
					tags: ['School of Cities']
				},
				{
					title: 'Ground Floor',
					description:
						'A case study of the Scarborough Golden Mile prepared by fourth-year undergraduate students at the University of Toronto.',
					image: goldenmile,
					logo: soc,
					link: '/reports/tod/golden-mile',
					tags: ['School of Cities']
				},
				{
					title: 'Love Northfield',
					logo: dps_logo,
					description:
						'The Northfield Love Your Neighbourhood platform invited residents to share their perspectives on community priorities and neighbourhood change.',
					image: northfield,
					link: '/reports/tod/love-northfield',
					tags: ['Partner Report']
				},
				{
					title: 'Love Kitsilano',
					logo: dps_logo,
					description:
						'The Kitsilano Love Your Neighbourhood platform invited residents to share their perspectives on community priorities and neighbourhood change.',
					image: northfield,
					link: '/reports/tod/love-kitsilano',
					tags: ['Partner Report']
				},
				{
					title: 'Love Cooksville',
					logo: dps_logo,
					description:
						'The Cooksville Love Your Neighbourhood platform invited residents to share their perspectives on community priorities and neighbourhood change.',
					image: cooksville,
					link: '/reports/tod/love-cooksville',
					tags: ['Partner Report']
				},
				{
					title: 'Digital Public Engagement',
					logo: dps_logo,
					description: 'Exploring the potential of digital initiatives for public engagement',
					image: dpsmethod,
					link: '/reports/tod/digital-public-engagement',
					tags: ['Partner Report']
				},
				{
					title: 'Transit Without Displacement',
					logo: catch_logo,
					description:
						'How communities can ensure transit-oriented development works for everyone.',
					image: catchreport,
					link: '/reports/tod/catch',
					tags: ['Partner Report']
				}
			]
		},
		{
			label: 'Resilience on Main',
			value: 'msr',
			description: [
				'Decision-makers across Canadian communities are working to identify and deploy solutions to support resiliency, equity, and vibrancy on main streets and downtowns across the country. But very little data is traditionally available at the hyper-local scale – where impact is felt most – to make stronger decisions, and measure outcomes. What insights can we glean when the most useful data sets – from civic infrastructure assets to business mix to demographics - are re-mapped to the scale of the main street, and centralized in one place?'
			],
			categories: ['Research Brief', 'Regional Report', 'Executive Summary', 'Partner Report'],
			items: [
				{
					title: 'Executive Summary: Measuring Main Streets',
					description: 'Learn about the Measuring Main Street project and platform.',
					image: mainstreets,
					link: '/reports/executive-summary',
					tags: ['Executive Summary']
				},
				{
					title: 'Main Streets, Malls & Mice',
					description: 'Trajectories of main streets, shopping malls and online behaviour.',
					image: malls,
					link: '/reports/mainstreets-malls-mice',
					tags: ['Research Brief']
				},
				{
					title: 'Main Street Resiliency',
					description: 'Analysing main street resiliency through visitor levels over the pandemic.',
					image: resiliency,
					link: '/reports/mainstreet-resiliency',
					tags: ['Research Brief']
				},
				{
					title: 'Infrastructure Equity & Main Streets',
					description: 'Identifying equity gaps in main street civic infrastructure.',
					image: civic,
					link: '/reports/mainstreets-infrastructure-equity',
					tags: ['Research Brief']
				},
				{
					title: 'Open North: Data Driven Approaches',
					description:
						'Planning data and technology projects to support smart civic infrastructure investments.',
					image: opennorth,
					link: 'https://canurb.org/wp-content/uploads/Data-Driven-Approaches-to-Main-Street-Challenges.pdf',
					tags: ['Partner Report']
				},
				{
					title: 'Toronto Regional Report',
					description: 'Ontario regional analysis based on sixty case studies.',
					image: Toronto,
					link: '/reports/toronto',
					tags: ['Regional Report']
				},
				{
					title: 'Montreal Regional Report',
					description: 'Québec regional analysis based on sixty case studies.',
					image: Montreal,
					link: '/reports/montreal',
					tags: ['Regional Report']
				},
				{
					title: 'Edmonton Regional Report',
					description: 'Alberta regional analysis based on sixty case studies.',
					image: Edmonton,
					link: '/reports/edmonton',
					tags: ['Regional Report']
				}
			]
		}
	];

	let activeTab = $state('tod');

	onMount(() => {
		activeTab = page.url.searchParams.get('tab') || 'tod';
	});
</script>

<main>
	<LandingLayout {title} {tabs} bind:activeTab syncUrl />
</main>
