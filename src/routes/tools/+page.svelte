<script lang="ts">
	import civic from '../lib/assets/graphics/civic.svg';
	import demographic from '../lib/assets/graphics/demographic.svg';
	import housing from '../lib/assets/graphics/housing.svg';
	import mainstreets from '../lib/assets/graphics/mainstreets.svg';
	import opennorth from '../lib/assets/graphics/opennorth.svg';
	import dps from '../lib/assets/logos/DPS-logo-black.png';
	import osslogo from '../lib/assets/logos/oss.png';
	import cc from '../lib/assets/screenshots/cc.png';
	import development from '../lib/assets/screenshots/development.png';
	import dpscooksville from '../lib/assets/screenshots/dps-cooksville.png';
	import dpskitsilano from '../lib/assets/screenshots/dps-kitsilano.png';
	import dpsnorthfield from '../lib/assets/screenshots/dps-northfield.png';
	import oss from '../lib/assets/screenshots/oss.png';
	import chart from '../lib/assets/screenshots/transit-chart.png';
	import transitmap from '../lib/assets/screenshots/transit-map.png';
	import urbanform from '../lib/assets/screenshots/urban-form.png';
	import { getLang } from '../lib/i18n';
	import LandingLayout from '../lib/ui/LandingLayout.svelte';
	import '../styles.css';

	const fr = getLang() === 'fr';
	const T = (en: string, frText: string) => (fr ? frText : en);

	const title = T('Research Tools', 'Outils de recherche');
	const description = fr
		? '<p>Les outils de recherche de Mesures des rues principales sont conçus pour aider les praticiennes et praticiens à prendre de meilleures décisions grâce à une compréhension plus approfondie de toute rue principale. Nous enrichissons régulièrement cette sélection de nouveaux outils : revenez souvent pour découvrir de nouvelles façons de mesurer votre rue principale!</p>'
		: '<p>Measuring Main Streets research tools are designed for practitioners to support better decision making through a more thorough understanding of any main street. We regularly update this selection with new tools, so check back often to discover new ways of measuring your main street!</p>';

	// Category and tag names stay in English: they are lookup keys (colours, ?tag= URL, filtering)
	// and are translated at display time by LandingLayout / LandingCard.

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

	const dpsDescription = T(
		'An interactive online experience where people can learn about how the future of their neighbourhood is being shaped.',
		'Une expérience interactive en ligne pour découvrir comment se dessine l’avenir de son quartier.'
	);

	const items = [
		{
			title: T('Transit Map', 'Carte du transport collectif'),
			description: T(
				'A map of all existing, under construction and planned higher-order transit lines in Canada with key data points.',
				'Une carte de toutes les lignes de transport collectif structurant existantes, en construction et projetées au Canada, avec des données clés.'
			),
			image: transitmap,
			link: '/transit-map',
			tags: ['Mapping', 'TOD on Main']
		},
		{
			title: T('Transit Charts', 'Graphiques du transport collectif'),
			description: T(
				'Key data for each stop along a selected transit line.',
				'Données clés pour chaque arrêt d’une ligne de transport collectif sélectionnée.'
			),
			image: chart,
			link: '/tools/transit-charts',
			tags: ['Graphing', 'TOD on Main']
		},
		{
			title: T('Complete Communities', 'Collectivités complètes'),
			description: T(
				'This tool examines the presence and access of key community amenities to assess current completeness and future needs.',
				'Cet outil examine la présence des principales commodités communautaires et l’accès à celles-ci afin d’évaluer le degré actuel de complétude et les besoins futurs.'
			),
			image: cc,
			link: '/tools/complete-communities',
			tags: ['Mapping', 'TOD on Main']
		},
		{
			title: T('Housing Development Potential', 'Potentiel de développement résidentiel'),
			description: T(
				'This tool breaks down the housing development potential of areas within 800m of a transit station',
				'Cet outil détaille le potentiel de développement résidentiel des secteurs situés dans un rayon de 800 m d’une station de transport collectif'
			),
			image: development,
			link: '/tools/development-potential',
			tags: ['Graphing', 'TOD on Main']
		},
		{
			title: T('Urban Form Comparison', 'Comparaison de la forme urbaine'),
			description: T(
				'This tool highlights the urban form of areas within 800m of a transit station.',
				'Cet outil met en évidence la forme urbaine des secteurs situés dans un rayon de 800 m d’une station de transport collectif.'
			),
			image: urbanform,
			link: '/tools/urban-form-comparison',
			tags: ['Mapping', 'TOD on Main']
		},
		{
			title: 'Love Your Neighbourhood Cooksville',
			logo: dps,
			description: dpsDescription,
			image: dpscooksville,
			link: 'https://lovecooksville.ca/',
			tags: ['Digital Public Square', 'Partner Tools', 'Qualitative', 'TOD on Main']
		},
		{
			title: 'Open Space Sandbox Cooksville',
			logo: osslogo,
			description: T(
				'A community-design interface to help residents design their own open spaces.',
				'Une interface de conception communautaire qui aide la population à concevoir ses propres espaces ouverts.'
			),
			image: oss,
			link: 'https://app.openspacesandbox.com/survey/70240673-ab25-4bae-b766-03ecd923098f',
			tags: ['Open Space Sandbox', 'Partner Tools', 'Qualitative', 'TOD on Main']
		},
		{
			title: 'Love Your Neighbourhood Northfield',
			logo: dps,
			description: dpsDescription,
			image: dpsnorthfield,
			link: 'https://lovenorthfield.ca/',
			tags: ['Digital Public Square', 'Partner Tools', 'Qualitative', 'TOD on Main']
		},
		{
			title: 'Love Your Neighbourhood Kitsilano',
			logo: dps,
			description: dpsDescription,
			image: dpskitsilano,
			link: 'https://lovekitsilano.ca/',
			tags: ['Digital Public Square', 'Partner Tools', 'Qualitative', 'TOD on Main']
		},
		{
			title: T('Main Street Demographics', 'Démographie des rues principales'),
			description: T(
				'Demographic variables mapped to all arterial streets.',
				'Variables démographiques cartographiées sur l’ensemble des artères.'
			),
			image: demographic,
			link: '/tools/mainstreet-demographic-map',
			tags: ['Mapping', 'Resilience on Main']
		},
		{
			title: T('Civic Infrastructure Provision', 'Offre d’infrastructure civique'),
			description: T(
				'Relative provision of civic infrastructure by neighbourhood.',
				'Offre relative d’infrastructure civique par quartier.'
			),
			image: civic,
			link: '/tools/civic-infrastructure-provision-map',
			tags: ['Mapping', 'Resilience on Main']
		},
		{
			title: T('Housing Dot Density', 'Densité de points du logement'),
			description: T(
				'This choropleth dot mapping tool highlights housing built in Canada over the course of the past 60 years.',
				'Cet outil de cartographie par points met en évidence les logements construits au Canada au cours des 60 dernières années.'
			),
			image: housing,
			link: '/tools/housing-density-map',
			tags: ['Mapping', 'Resilience on Main']
		},
		{
			title: T('Main Street Visitor Recovery', 'Reprise de l’achalandage des rues principales'),
			description: T(
				'This graphing tool highlights the visitor recovery patterns from 2020 to 2022.',
				'Cet outil graphique met en évidence les tendances de reprise de l’achalandage de 2020 à 2022.'
			),
			image: mainstreets,
			link: '/tools/mainstreet-visitor-recovery',
			tags: ['Graphing', 'Resilience on Main']
		},
		{
			title: T(
				'Main Street Data and Technology Project Readiness',
				'Préparation aux projets de données et de technologie pour les rues principales'
			),
			description: T(
				'A downloadable readiness checklist by Open North.',
				'Une liste de vérification de l’état de préparation, à télécharger, de Nord Ouvert.'
			),
			image: opennorth,
			link: 'https://canurb.org/wp-content/uploads/Main-Street-Data-Readiness-Tool.pdf',
			tags: ['Qualitative', 'Resilience on Main', 'Partner Tools']
		}
	];
</script>

<main>
	<LandingLayout {title} {description} {items} {categories} syncUrl />
</main>
