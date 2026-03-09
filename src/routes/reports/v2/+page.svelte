<script>
	import { page } from '$app/state';
	import civic from '../../lib/assets/graphics/civic.svg';
	import Edmonton from '../../lib/assets/graphics/edmonton.jpg';
	import mainstreets from '../../lib/assets/graphics/mainstreets.svg';
	import malls from '../../lib/assets/graphics/malls.svg';
	import Montreal from '../../lib/assets/graphics/montreal.jpg';
	import opennorth from '../../lib/assets/graphics/opennorth.svg';
	import resiliency from '../../lib/assets/graphics/resiliency.svg';
	import Toronto from '../../lib/assets/graphics/toronto.jpg';
	import LandingLayout from '../../lib/ui/LandingLayout.svelte';
	import ModernFooter from '../../lib/ui/ModernFooter.svelte';
	import '../../styles.css';
	import { browser } from '$app/environment';

	const title = 'Measuring Main Streets Reports';

	const tabs = [
		{
			label: 'Main Street Resiliency',
			value: 'msr',
			description: [
				'The Measuring Main Streets Platform (MMSP) maps, analyses and explores the role of civic infrastructure and other elements that make-up the thousands of main streets throughout Canada to understand the profile of a variety of main street environments and the role of civic infrastructure, businesses, housing, infrastructure and the built form/public realm in creating and maintaining vibrant main streets in Canadian communities. The MMSP is the first research tool that uses main streets as the primary unit of analysis. It identifies and maps every main street in Canada and supplies data on the businesses and civic infrastructure present as well as a demographic profile of the neighbourhood each main street serves. The original project used the data to better understand main streets across the themes of resiliency, community, and equity.',
				'MMSP offers a range of applications to understand the dynamics impacting resiliency and recovery. First, the Canadian Urban Institute has provide detailed analysis of main street resiliency using case studies in three cities: Montreal, Toronto and Edmonton through the stages of the COVID pandemic. A variety of data sources from GPS cell phone data used to measure visitor levels to observational research to understand businesses, amenities, built form, public realm and other generators of activity for a total of 30 case studies (ten in each of the three urban regions). This analysis revealed that main streets that primarily serve a local population tended to experience a lower drop in visitor numbers at the onset of the pandemic and/or recovered more quickly. Conversely, main streets in the downtowns of the three cities were generally hit the hardest and have not fully recovered. Based on observational and data analysis, the presence of greenspace was a key type aspect of higher levels of resiliency through the pandemic.',
				'Second, main street environments were compared to the trajectories of regional shopping centres through the pandemic. Research found that most malls experienced sharper declines in footfall and activity but faster recoveries. Our findings show that while hard lockdowns had a greater impact on shopping centres, people returned to them sooner than to many main street environments.',
				'Third, research evaluates the impact of changing spending trends during the pandemic. While data reveals that e-commerce usage spiked during the pandemic, setting off alarm bells for traditional bricks-and-mortar retail, but e-commerce levels returned to historical trendlines post-pandemic.',
				'Finally, the work analyzes the equitable distribution of civic infrastructure across the three urban regions. Our research shows that civic infrastructure deficits are most acute in recently built suburban neighbourhoods that tend to have higher levels of immigrant populations. Many of these housing developments are planned without main streets and have a low capacity to adapt. Conversely, civic infrastructure surpluses are found in many well-established neighbourhoods that have experienced population decline. These places tend to have traditional main streets that present significant opportunities for infill housing, which could improve the efficiency of existing infrastructure.',
				'In total, the key advantage that main streets possess is their role in community building. The presence of independent business and neighbourhood scale civic infrastructure are creations and reflections of local cultures and needs. When properly supported, these assets are essential to maintaining vibrant main streets.',
				'While there is no singular model of an ideal main street, our research does highlight some common principles of places that demonstrate relative successes across the themes of resiliency, community, and equity. By examining the themes together from a geographic approach in each of three regions some types of streets become evident. The well-performing main streets tended to be places that served well-established walkable residential neighbourhoods. These main streets possessed buildings that are flexible and have been adapted as local populations shifted. The most resilient main streets also tend to offer a range of housing options. By contrast, in a suburban context where main streets are built around car use, single use buildings, low housing density, and less civic infrastructure the ability of this environment to serve the purposes of a main street is more difficult and the lack of vibrancy reflects this.',
				'The Measuring Main Street project began in June of 2022 and formally launched in June 2024. The platform can be found at www.measuringmainstreets.ca. It is comprised of four primary components, an interactive map of all main streets in Canada, thematic and regional research briefs, detailed main street case studies, and a set of data and visualization tools. The Measuring Main Streets Platform will be publicly available and serve as a hub of main street research going forward.'
			],
			categories: ['Research Brief', 'Regional Report', 'Executive Summary'],
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
					tags: ['Research Brief']
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
		},
		{
			label: 'Transit Oriented Development',
			value: 'tod',
			description: 'Reports and documentation produced in partnership with external organisations.',
			categories: [],
			items: []
		}
	];

	let activeTab = $state(browser ? page.url.searchParams.get('tab') || 'msr' : 'msr');
</script>

<main>
	<LandingLayout {title} {tabs} bind:activeTab syncUrl />
</main>

<ModernFooter />
