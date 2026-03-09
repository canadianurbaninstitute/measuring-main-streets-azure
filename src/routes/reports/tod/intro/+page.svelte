<script>
	import ReportHeader from '../../components/ReportHeader.svelte';
	import ReportFindings from '../../components/ReportFindings.svelte';
	import ScrollSection from '../../components/ScrollSection.svelte';
	import TextBlock from '../../components/TextBlock.svelte';
	import ImagePanel from '../../components/ImagePanel.svelte';
	import Step from '../../components/Step.svelte';
	import introImage from '../../../lib/assets/screenshots/intro-header.png';
	import { BarChart, ColumnChart, LineChart } from '@onsvisual/svelte-charts';
	import '../../../styles.css';

	const urbanPop = [
		{
			Region: 'Greater Golden Horseshoe',
			PercentPop: 24.3
		},
		{
			Region: 'Montreal',
			PercentPop: 11
		},
		{
			Region: 'BC Lower Mainland',
			PercentPop: 8
		},
		{
			Region: 'Calgary',
			PercentPop: 4.4
		},
		{
			Region: 'Edmonton',
			PercentPop: 4.1
		},
		{
			Region: 'Ottawa-Gatineau',
			PercentPop: 4.1
		},
		{
			Region: 'Non-urban',
			PercentPop: 15.3
		},
		{
			Region: 'Urban regions 10,000 to 100,000',
			PercentPop: 9.9
		},
		{
			Region: 'All other urban regions >100,000',
			PercentPop: 19
		}
	];
	const section1Charts = [
		{ component: ImagePanel, props: { src: introImage, alt: '...' } },
		{
			label: 'Annual output — early years',
			component: BarChart,
			props: { data: urbanPop, title: '2019–2020 baseline' }
		}
	];
</script>

<main>
	<ReportHeader
		title="THE CASE FOR TRANSIT-ORIENTED COMPLETE COMMUNITIES"
		subtitle="With rapidly-growing populations, Canada’s largest metropolitan regions face an acute need for housing. How can transit-oriented development create complete communities that fulfill this need?"
		backgroundImage={introImage}
	/>
	<ReportFindings
		title="KEY FINDINGS"
		finding1="Investments in public transit"
		description1="are vital to maintaining growth in Canada’s largest urban regions."
		finding2="Communities are only complete"
		description2="if they are walkable."
		finding3="Not all transit projects"
		description3="deliver the same return."
	/>
	<ScrollSection sectionNumber={1} charts={section1Charts}>
		<svelte:fragment slot="steps" let:activeChartIndex>
			<Step chartIndex={0} {activeChartIndex}>
				<TextBlock eyebrow="Context" heading="Where we started">
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
				</TextBlock>
			</Step>

			<!-- Same chart (0), second text block -->
			<Step chartIndex={0} {activeChartIndex}>
				<TextBlock eyebrow="2020" heading="The disruption year">
					<p>
						Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
						commodo consequat.
					</p>
				</TextBlock>
			</Step>

			<Step chartIndex={1} {activeChartIndex}>
				<TextBlock eyebrow="Turning point" heading="The 2021 inflection">
					<p>
						Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
						nulla pariatur.
					</p>
				</TextBlock>
			</Step>

			<!-- Same chart (1), second text block -->
			<Step chartIndex={1} {activeChartIndex}>
				<TextBlock eyebrow="Now" heading="The 2024 peak">
					<p>
						At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
						voluptatum.
					</p>
				</TextBlock>
			</Step>
		</svelte:fragment>
	</ScrollSection>
</main>
