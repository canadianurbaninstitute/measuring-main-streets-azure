<script>
	import chart from '../../lib/assets/graphics/chart.png';
	import civic from '../../lib/assets/graphics/civic.svg';
	import demographic from '../../lib/assets/graphics/demographic.svg';
	import housing from '../../lib/assets/graphics/housing.svg';
	import mainstreets from '../../lib/assets/graphics/mainstreets.svg';
	import opennorth from '../../lib/assets/graphics/opennorth.svg';
	import urbanform from '../../lib/assets/graphics/urbanform.svg';
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
		'Transit Oriented Development'
	];

	const items = [
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
			title: 'Transit Charts',
			description: 'Key data for each stop along a selected transit line.',
			image: chart,
			link: '/tools/transit-charts',
			tags: ['Graphing', 'Transit Oriented Development']
		},
		{
			title: 'Main Street Data and Technology Project Readiness',
			description: 'A downloadable readiness checklist by Open North.',
			image: opennorth,
			link: 'https://canurb.org/wp-content/uploads/Main-Street-Data-Readiness-Tool.pdf',
			tags: ['Qualitative', 'Main Street Resilience']
		}
	];
</script>

<main>
	<LandingLayout {title} {description} {items} {categories} />
</main>

<ModernFooter />
