<script>
	import civic from '../../lib/assets/graphics/civic.svg';
	import Edmonton from '../../lib/assets/graphics/edmonton.jpg';
	import mainstreets from '../../lib/assets/graphics/mainstreets.svg';
	import malls from '../../lib/assets/graphics/malls.svg';
	import Montreal from '../../lib/assets/graphics/montreal.jpg';
	import opennorth from '../../lib/assets/graphics/opennorth.svg';
	import resiliency from '../../lib/assets/graphics/resiliency.svg';
	import Toronto from '../../lib/assets/graphics/toronto.jpg';
	import LandingLayout from '../../lib/ui/LandingLayout.svelte';
	import '../../styles.css';

	const title = 'Measuring Main Streets Reports';
	const description =
		'Emerging from the data that underpins the mapping tool, CUI and select partners developed a project executive summary, four research reports, and three regional reports to reveal key findings and messages, enable sensemaking, and point toward real-life applications and interventions.';

	const categories = ['Research Brief', 'Regional Report', 'Executive Summary'];

	const items = [
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
	];
</script>

<main>
	<LandingLayout {title} {description} {items} {categories} />
</main>
