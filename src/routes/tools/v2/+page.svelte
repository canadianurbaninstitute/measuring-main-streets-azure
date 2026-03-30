<script>
	import civic from '../../lib/assets/graphics/civic.svg';
	import demographic from '../../lib/assets/graphics/demographic.svg';
	import housing from '../../lib/assets/graphics/housing.svg';
	import mainstreets from '../../lib/assets/graphics/mainstreets.svg';
	import opennorth from '../../lib/assets/graphics/opennorth.svg';
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
	import ModernFooter from '../../lib/ui/ModernFooter.svelte';
	import '../../styles.css';

	const title = 'Research Tools';
	const description =
		'Our in-depth main street research tools are a package of resources designed to support deeper analysis and understanding of main street health, down to the variable level. Quantitative tools allow you to dive into the context of your own main street, while the Open North qualitative tool is designed to assist practitioners in making crucial infrastructure decisions. We regularly update this selection with new tools, so check back often to discover new ways of measuring your main street!';

	const categories = [
		'Mapping',
		'Graphing',
		'Qualitative',
		'Main Street Resilience',
		'Transit Oriented Development',
		'Partner Tools'
	];

	const items = [
		{
			title: 'Transit Maps',
			description:
				'A map of all existing, under construction and planned higher-order transit lines in Canada with key data points.',
			image: transitmap,
			link: '/transit-maps',
			tags: ['Mapping', 'Transit Oriented Development']
		},
		{
			title: 'Transit Charts',
			description: 'Key data for each stop along a selected transit line.',
			image: chart,
			link: '/tools/transit-charts',
			tags: ['Graphing', 'Transit Oriented Development']
		},
		{
			title: 'Complete Communities',
			description:
				'This tool examines the presence and access of key community amenities to assess current completeness and future needs.',
			image: cc,
			link: '/tools/complete-communities',
			tags: ['Mapping', 'Transit Oriented Development']
		},
		{
			title: 'Development Potential Index',
			description:
				'This tool breaks down the housing development potential of areas within 800m of a transit station',
			image: development,
			link: '/tools/development-potential',
			tags: ['Graphing', 'Transit Oriented Development']
		},
		{
			title: 'Urban Form Comparison',
			description: 'This tool highlights the urban form of areas within 800m of a transit station.',
			image: urbanform,
			link: '/tools/urban-form-comparison',
			tags: ['Mapping', 'Transit Oriented Development']
		},
		{
			title: 'Love Your Neighbourhood Cooksville',
			description:
				'An interactive online experience where people can learn about how the future of their neighbourhood is being shaped.',
			image: dpscooksville,
			link: 'https://lovecooksville.ca/',
			tags: ['Partner Tools', 'Qualitative', 'Transit Oriented Development']
		},
		{
			title: 'Open Space Sandbox Cooksville',
			description: 'A community-design interface to help residents design their own open spaces.',
			image: oss,
			link: 'https://app.openspacesandbox.com/survey/70240673-ab25-4bae-b766-03ecd923098f',
			tags: ['Partner Tools', 'Qualitative', 'Transit Oriented Development']
		},
		{
			title: 'Love Your Neighbourhood Northfield',
			description:
				'An interactive online experience where people can learn about how the future of their neighbourhood is being shaped.',
			image: dpsnorthfield,
			link: 'https://lovenorthfield.ca/',
			tags: ['Partner Tools', 'Qualitative', 'Transit Oriented Development']
		},
		{
			title: 'Love Your Neighbourhood Kitsilano',
			description:
				'An interactive online experience where people can learn about how the future of their neighbourhood is being shaped.',
			image: dpskitsilano,
			link: 'https://lovekitsilano.ca/',
			tags: ['Partner Tools', 'Qualitative', 'Transit Oriented Development']
		},
		{
			title: 'Main Street Demographics',
			description: 'Demographic variables mapped to all arterial streets.',
			image: demographic,
			link: '/tools/mainstreet-demographic-map',
			tags: ['Mapping', 'Main Street Resilience']
		},
		{
			title: 'Civic Infrastructure Provision',
			description: 'Relative provision of civic infrastructure by neighbourhood.',
			image: civic,
			link: '/tools/civic-infrastructure-provision-map',
			tags: ['Mapping', 'Main Street Resilience']
		},
		{
			title: 'Housing Dot Density',
			description:
				'This choropleth dot mapping tool highlights housing built in Canada over the course of the past 60 years.',
			image: housing,
			link: '/tools/housing-density-map',
			tags: ['Mapping', 'Main Street Resilience']
		},
		{
			title: 'Urban Form Comparison',
			description: 'This tool highlights the urban form of areas within 800m of a transit station.',
			image: urbanform,
			link: '/tools/urban-form-comparison',
			tags: ['Mapping', 'Transit Oriented Development']
		},
		{
			title: 'Main Street Visitor Recovery',
			description: 'This graphing tool highlights the visitor recovery patterns from 2020 to 2022.',
			image: mainstreets,
			link: '/tools/mainstreet-visitor-recovery',
			tags: ['Graphing', 'Main Street Resilience']
		},
		{
			title: 'Main Street Data and Technology Project Readiness',
			description: 'A downloadable readiness checklist by Open North.',
			image: opennorth,
			link: 'https://canurb.org/wp-content/uploads/Main-Street-Data-Readiness-Tool.pdf',
			tags: ['Qualitative', 'Main Street Resilience', 'Partner Tools']
		}
	];
</script>

<main>
	<LandingLayout {title} {description} {items} {categories} syncUrl />
</main>

<ModernFooter />
