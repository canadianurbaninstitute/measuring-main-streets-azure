<script>
	import civic from '../../lib/assets/graphics/civic.svg';
	import demographic from '../../lib/assets/graphics/demographic.svg';
	import housing from '../../lib/assets/graphics/housing.svg';
	import mainstreets from '../../lib/assets/graphics/mainstreets.svg';
	import opennorth from '../../lib/assets/graphics/opennorth.svg';
	import dps from '../../lib/assets/logos/DPS-logo-black.png';
	import osslogo from '../../lib/assets/logos/oss.png';
	import cc from '../../lib/assets/screenshots/cc.png';
	import development from '../../lib/assets/screenshots/development.png';
	import dpscooksville from '../../lib/assets/screenshots/dps-cooksville.png';
	import dpskitsilano from '../../lib/assets/screenshots/dps-kitsilano.png';
	import dpsnorthfield from '../../lib/assets/screenshots/dps-northfield.png';
	import oss from '../../lib/assets/screenshots/oss.png';
	import chart from '../../lib/assets/screenshots/transit-chart.png';
	import transitmap from '../../lib/assets/screenshots/transit-map.png';
	import urbanform from '../../lib/assets/screenshots/urban-form.png';
	import LandingLayout from '../../lib/ui/LandingLayout.svelte';
	import '../../styles.css';

	const title = 'Research Tools';
	const description =
		'<p>Measuring Main Streets research tools are designed for practitioners to support better decision making through a more thorough understanding of any main street. We regularly update this selection with new tools, so check back often to discover new ways of measuring your main street!</p>';

	const categories = [
		'Mapping',
		'Graphing',
		'Qualitative',
		'Resilience on Main',
		'TOD on Main',
		'Digital Public Square',
		'Open Space Sandbox',
		'Partner Tools'
	];

	const items = [
		{
			title: 'Transit Map',
			description:
				'A map of all existing, under construction and planned higher-order transit lines in Canada with key data points.',
			image: transitmap,
			link: '/transit-map',
			tags: ['Mapping', 'TOD on Main']
		},
		{
			title: 'Transit Charts',
			description: 'Key data for each stop along a selected transit line.',
			image: chart,
			link: '/tools/transit-charts',
			tags: ['Graphing', 'TOD on Main']
		},
		{
			title: 'Complete Communities',
			description:
				'This tool examines the presence and access of key community amenities to assess current completeness and future needs.',
			image: cc,
			link: '/tools/complete-communities',
			tags: ['Mapping', 'TOD on Main']
		},
		{
			title: 'Housing Development Potential',
			description:
				'This tool breaks down the housing development potential of areas within 800m of a transit station',
			image: development,
			link: '/tools/development-potential',
			tags: ['Graphing', 'TOD on Main']
		},
		{
			title: 'Urban Form Comparison',
			description: 'This tool highlights the urban form of areas within 800m of a transit station.',
			image: urbanform,
			link: '/tools/urban-form-comparison',
			tags: ['Mapping', 'TOD on Main']
		},
		{
			title: 'Love Your Neighbourhood Cooksville',
			logo: dps,
			description:
				'An interactive online experience where people can learn about how the future of their neighbourhood is being shaped.',
			image: dpscooksville,
			link: 'https://lovecooksville.ca/',
			tags: ['Digital Public Square', 'Partner Tools', 'Qualitative', 'TOD on Main']
		},
		{
			title: 'Open Space Sandbox Cooksville',
			logo: osslogo,
			description: 'A community-design interface to help residents design their own open spaces.',
			image: oss,
			link: 'https://app.openspacesandbox.com/survey/70240673-ab25-4bae-b766-03ecd923098f',
			tags: ['Open Space Sandbox', 'Partner Tools', 'Qualitative', 'TOD on Main']
		},
		{
			title: 'Love Your Neighbourhood Northfield',
			logo: dps,
			description:
				'An interactive online experience where people can learn about how the future of their neighbourhood is being shaped.',
			image: dpsnorthfield,
			link: 'https://lovenorthfield.ca/',
			tags: ['Digital Public Square', 'Partner Tools', 'Qualitative', 'TOD on Main']
		},
		{
			title: 'Love Your Neighbourhood Kitsilano',
			logo: dps,
			description:
				'An interactive online experience where people can learn about how the future of their neighbourhood is being shaped.',
			image: dpskitsilano,
			link: 'https://lovekitsilano.ca/',
			tags: ['Digital Public Square', 'Partner Tools', 'Qualitative', 'TOD on Main']
		},
		{
			title: 'Main Street Demographics',
			description: 'Demographic variables mapped to all arterial streets.',
			image: demographic,
			link: '/tools/mainstreet-demographic-map',
			tags: ['Mapping', 'Resilience on Main']
		},
		{
			title: 'Civic Infrastructure Provision',
			description: 'Relative provision of civic infrastructure by neighbourhood.',
			image: civic,
			link: '/tools/civic-infrastructure-provision-map',
			tags: ['Mapping', 'Resilience on Main']
		},
		{
			title: 'Housing Dot Density',
			description:
				'This choropleth dot mapping tool highlights housing built in Canada over the course of the past 60 years.',
			image: housing,
			link: '/tools/housing-density-map',
			tags: ['Mapping', 'Resilience on Main']
		},
		{
			title: 'Main Street Visitor Recovery',
			description: 'This graphing tool highlights the visitor recovery patterns from 2020 to 2022.',
			image: mainstreets,
			link: '/tools/mainstreet-visitor-recovery',
			tags: ['Graphing', 'Resilience on Main']
		},
		{
			title: 'Main Street Data and Technology Project Readiness',
			description: 'A downloadable readiness checklist by Open North.',
			image: opennorth,
			link: 'https://canurb.org/wp-content/uploads/Main-Street-Data-Readiness-Tool.pdf',
			tags: ['Qualitative', 'Resilience on Main', 'Partner Tools']
		}
	];
</script>

<main>
	<LandingLayout {title} {description} {items} {categories} syncUrl />
</main>
