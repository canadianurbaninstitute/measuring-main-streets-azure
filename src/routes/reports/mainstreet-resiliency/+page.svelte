<script>
	import Title from '../../lib/Title.svelte';
	import resiliency from '../../lib/assets/graphics/resiliency.svg';
	import correlation from '../../lib/assets/graphics/correlation-plot.png';
	import CaseStudyLocationsMap from './CaseStudyLocationsMap.svelte';
	import LineAreaChart from './LineAreaChart.svelte';
	import BarChart from './BarChart.svelte';
	import BarChartStacked from './BarChartStacked.svelte';
	import CivicBarChart from './CivicBarChart.svelte';
	import KeyFindings from '../../lib/ui/KeyFindings.svelte';
	import Footer from '../../lib/Footer.svelte';

	import '../../styles.css';

	// order of graphs: downtown, neighbourhood, small towns, malls
</script>

<Title
	outline={resiliency}
	name={'Main Street Resiliency'}
	location={'Analysing main street resiliency through visitor levels over the pandemic'}
/>

<div class="full-text">
	<p>
		Canada’s main streets experienced a great deal of stress throughout the COVID-19 pandemic, as
		people stayed home and footfall drastically declined. While every main street was negatively
		affected, each has had its own specific trajectory since early 2019. Some saw sharper declines
		than others at the outset of the pandemic and some bounced back faster in the subsequent years.
	</p>
	<p>
		CUI conducted a statistical analysis to determine which main street characteristics have the
		strongest correlation with their level of resiliency. We identified two key points: first, that
		the most resilient streets from 2019 to 2022 were the ones that serviced a predominantly local
		population; the second is that the presence of green spaces gave main street resiliency a boost
		throughout the pandemic.
	</p>
	<p>
		There were clear geographic patterns to these associations. Main streets in and near the
		downtowns of cities experienced the sharpest declines and the slowest rebounds. Work from home
		and reduced business travel and tourism hit city centres the hardest, and main streets suffered
		greatly. As some of these trends have become engrained, many downtown main streets have not
		fully recovered to pre-pandemic levels of activity. Main streets in suburban areas and small
		towns tended to experience less severe downturns and more rapid recoveries. In some cases, main
		streets have exceeded pre-pandemic levels of footfall, usually in towns and neighbourhoods that
		have higher rates of people working from home.
	</p>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Case Study Selection</h3>
			<p>
				For our detailed resiliency analysis, we selected 20 main streets in the Toronto, Montreal,
				and Edmonton regions. These main streets were chosen to provide a representative sample of
				the types of streets in each regional context, and included four downtown
				(workplace-oriented), four small town, and 12 neighbourhood (residential-oriented) main
				streets. (More main streets were included in the neighbourhood category as there is a
				greater variety of main streets within this group.) In addition, we intentionally included
				main streets with equity-deserving communities.
			</p>
		</div>
	</div>

	<div class="chart-container sticky-content">
		<CaseStudyLocationsMap />
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Resiliency Score (I)</h3>
			<p>
				The primary dependent variable we used to assess resiliency was based on the number of
				visitors to the main street on a monthly basis. The data is provided by <a
					href="https://environicsanalytics.com/en-ca/home">Environics Analytics</a
				> and is ultimately derived from cell phone GPS signals. We count the number of people (devices)
				entering buildings on a main street within certain time intervals. When a regular nighttime location
				(assumed to be someone’s home location) can be associated with a device, additional variables
				are attached to the visitor data. We derive how far visitors have travelled from home, and link
				demographic data (based on postal codes) to get a sense of the characteristics of people visiting
				each main street.
			</p>
			<p>
				We created a single resiliency score for each main street by comparing monthly visitor
				levels from 2020–2022 to their equivalent months in 2019 (pre-pandemic). For each month, we
				calculate the number of visitors as a percentage of the number of visitors in 2019. The
				total amount that a main street was below its 2019 visitor levels for each month from
				2020–2022 is the resiliency score. For example, if a main street experienced a sharp
				drop-off in visitors in 2020 and was slow to recover through to 2022, it had a relatively
				low resiliency score. Conversely, if a main street experienced a modest drop-off in visitors
				and experienced a relatively quick recovery, it had a higher resiliency score.
			</p>
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<LineAreaChart
			title={'Main Street with Low Resiliency Score'}
			chartDataset="libertyvillage"
			yDomain={[0, 150]}
		/>
		<LineAreaChart
			title={'Main Street with High Resiliency Score'}
			chartDataset="uxbridge"
			yDomain={[0, 150]}
		/>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Resiliency Score (II)</h3>
			<p>
				There was a clear geography to main street resiliency through the pandemic, with downtown
				main streets typically suffering the sharpest drop-offs in visitor levels and experiencing
				the slowest recoveries.
			</p>
			<ul>
				<li>
					North York Centre in Toronto was the most resilient downtown street among our case
					studies. This is likely due to its function as a secondary downtown to Toronto’s central
					core, with a significant residential population.
				</li>
				<li>
					The least resilient downtown main street was 97th Street in Edmonton, which saw visitor
					levels drop to 15% of pre-pandemic levels in October 2021, and rising only to 33% by the
					end of 2022.
				</li>
				<li>
					Small town main streets tended to be the most resilient, although there was an extensive
					range between the top (Sutton in the Toronto region) and the bottom (St. Eustache in the
					Montreal region).
				</li>
				<li>
					Neighbourhood main street resiliency was in between that of downtowns and small towns
					(closer to the latter). Rue Beaubien in Montreal was the most resilient neighbourhood main
					street; Central Brampton (Main and Queen) was the least resilient.
				</li>
			</ul>
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<BarChart xKey="Resiliency_Score" title="Resiliency Score" xDomain={[0, 3500]} />
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Visitor Types</h3>
			<p>
				Downtown main streets were the least resilient through the pandemic, largely because people
				did not have to go there. The shift to working from home for those who typically worked in
				office buildings had, and continues to have, one of the most significant impacts on cities.
				Cell phone data can identify regular nighttime (home) and regular daytime (typically, work)
				locations, and can provide insights into the reasons people visit particular main streets.
				We segment visitors into three categories:
			</p>
			<ul>
				<li>local residents (live within 1 km of the street)</li>
				<li>frequent visitors (visit during the day on a regular basis)</li>
				<li>infrequent visitors (workers, neither local residents or frequent visitors).</li>
			</ul>
			<p>
				There is a clear pattern: infrequent visitors (workers) outnumbered local residents on
				downtown main streets prior to the pandemic. The opposite tends to be true for small towns
				and neighbourhood main streets that relied more heavily on residential visitors.
			</p>
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<BarChartStacked title="Share of Visitors" />
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Civic Infrastructure Provision</h3>
			<p>
				A core purpose of the initial Measuring Main Street project was to assess the role of civic
				infrastructure on main street resiliency. We created a civic infrastructure provision score
				for every main street in the country: the Civic Infrastructure Index. This metric combines
				the presence of civic infrastructure locations relative to the population density of an
				area. The civic infrastructure locations are weighted by how many people they employ, to
				account for scale of the facility. Downtown main streets tend to have the highest levels of
				civic infrastructure provisions, largely because they house facilities that offer central
				functions (main libraries, major performance theatres, city halls) rather than strictly
				cater to a local population. In the context of COVID-19, these facilities were not
				sufficient to enable downtown main streets to withstand the pandemic’s impacts on visitor
				levels. The connection between civic infrastructure and main street resiliency proved to be
				more nuanced.
			</p>
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<CivicBarChart title="Civic Infrastructure Provision" />
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Correlation Analysis</h3>
			<p>
				To uncover the factors that help explain main street resiliency throughout the pandemic, we
				performed a correlation analysis with a wide range of indicators. The factors included
				variables of urban form, demographics, and street content.
			</p>
			<p>
				The analysis revealed two key indicators that had the closest associations with main street
				resiliency. First was the share of visitors that are local residents. During the pandemic,
				people tended to stay closer to home; they were less likely to travel to work or other
				locations further away. Main streets that relied more heavily on visitors from further away
				were more likely to experience sharper drop-offs and slower recoveries. Second was the
				presence of green spaces. While civic infrastructure generally did not predict higher
				resiliency, parks did. This makes intuitive sense, as people still had the core desire to
				congregate, but wanted to do so in a safe outdoor setting. This suggests that civic
				infrastructure is indeed important to the vitality of main streets and that data analysis in
				more “normal” times may reveal this to be the case.
			</p>
		</div>
	</div>

	<div class="chart-container sticky-content">
		<img src={correlation} alt="Correlation Plot" />
	</div>
</div>

<div class="full-text">
	<h3>Key Findings and Messages</h3>

	<KeyFindings
		number={'1'}
		finding={'Downtown main streets were hit hardest by the pandemic and have been the slowest to recover.'}
		message1={'Develop and implement downtown recovery strategies in every city.'}
		message2={'Adjust the mix of uses on downtown main streets – civic infrastructure can be a major part of this solution.'}
		message3={'Create positive impressions of downtown in order to encourage people to return while backstopping declines in public transportation and public safety.'}
	/>

	<KeyFindings
		number={'2'}
		finding={'Main streets that predominantly serve their immediate local residents were the most resilient through the pandemic.'}
		message1={'Curate main street businesses to match local demand using data analysis to identify gaps in what a main street currently provides.'}
		message2={'Build more housing on and near to main streets by looking for infill opportunities that can supplement and expand existing options.'}
		message3={'Invest in active transportation options at the neighbourhood scale.'}
	/>

	<KeyFindings
		number={'3'}
		finding={'The presence of green spaces contributed to main street resiliency through the pandemic.'}
		message1={'Provide high quality outdoor places on main streets for people to congregate.'}
		message2={'Integrate greenery and natural amenities into main street environments.'}
		message3={'Cluster civic infrastructure on main streets and create focal points for local communities.'}
	/>
</div>

<Footer />

<style>
	img {
		width: 100%;
	}

	.chart-container {
		padding: 0em;
		border-radius: 1em;
		width: 100%;
	}

	.report-text {
		margin: 0;
	}

	.slide {
		display: flex;
		flex-direction: column;
		gap: 5em;
		border-bottom: 1px solid var(--brandGrey);
		padding: 2.5em;
	}

	.full-text {
		border-bottom: 1px solid var(--brandGrey);
		padding: 2.5em;
		background-color: white;
		color: var(--brandDarkBlue);
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	h3 {
		color: var(--brandLightBlue);
		text-transform: uppercase;
		font-weight: 600;
	}

	.sticky-content {
		position: relative;
		top: 1em;
		align-self: flex-start; /* <-- this is the fix */
	}

	@media only screen and (min-width: 768px) {
		.sticky-content {
			position: -webkit-sticky; /* for Safari */
			position: sticky;
		}

		.slide {
			display: flex;
			flex-direction: row;
			padding: 5em;
		}

		.full-text {
			padding: 5em;
		}

		.text-container {
			width: 60%;
			margin: 0;
		}

		.chart-container {
			padding: 0em;
			border-radius: 1em;
			width: 100%;
			display: flex;
			flex-direction: column;
			gap: 1em;
			max-width: 50vw;
		}
	}
</style>
