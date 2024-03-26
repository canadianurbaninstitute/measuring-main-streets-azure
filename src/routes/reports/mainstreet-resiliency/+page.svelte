<script>
	import Title from '../../lib/Title.svelte';
	import resiliency from '../../lib/assets/graphics/resiliency.svg';
	import LineAreaChart from './LineAreaChart.svelte';
	import BarChart from './BarChartTemp.svelte';
	import BarChartStacked from './BarChartStacked.svelte';
	import CivicBarChart from './CivicBarChartTemp.svelte';
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
		Main streets experienced a great deal of stress through the various phases of the COVID19 pandemic as people stayed home and footfall fell off drastically. While all main streets were negatively affected, they have each had their own specific trajectories over the past five years. Some saw sharper declines than others at the outset of the pandemic in early 2020, and some bounced back faster than others in the subsequent years. The Canadian Urban Institute conducted a statistical analysis to determine what main street characteristics have the strongest correlation with their level of resiliency. We identified two key messages, the first is that the most resilient streets from 2019 to 2022 were the ones that serviced a predominantly local population, and the second is that the presence of greenspace boosted main street resiliency through the pandemic.
	</p>
	<p>
		There were also clear geographic patterns to these associations. Main streets in and near the downtowns of cities experienced the sharpest declines and the slowest rebounds. Work from home and reduced business travel and tourism hit city centers the hardest and the main streets suffered greatly. As some of these trends have become habits, many downtown main streets have not fully recovered from pre-pandemic levels of activity. Main streets in suburban areas and small towns tended to experience less severe downturns and more rapid recoveries. In some cases, main streets have exceeded pre-pandemic levels of footfall. This tends to be the case in towns and neighbourhoods that have higher rates of people working from home. 		
	</p>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Case Study Selection</h3> 
			<p>
				We selected 20 main streets within the three metropolitan regions of Toronto, Montreal, and Edmonton for undertaking detailed analysis. The 20 main streets were intended to provide a representative sample of types of streets within each regional context. This included four downtown (workplace-oriented), four small town, and 12 neighourhood (residential-oriented) main streets were chosen with additional emphasis placed on equity-deserving communities. More streets were included in the neighbourhood category as there are a greater variety of streets within the group. 
			</p>
		</div>
	</div>

	<div class="chart-container sticky-content">
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Resiliency Score (I)</h3> 
			<p>
				The primary dependent variable used to assess resiliency was based on the number of visitors came to the main street on a monthly basis. This data is provided by Environics Analytics (link to MobileScapes) and is ultimately derived from cell-phone GPS signals. Specifically, we count the number of people (devices) entering buildings within a main street environment within certain time intervals. When a regular nighttime location (assumed to be someone’s home location) can be associated with a device, additional variables can be attached to the visitor data. We can derive how far visitors have travelled from home as well as link demographic data based on postal codes to get a sense of the characteristics of people coming to each main street. 				
			</p>
			<p>
				We created a single ‘resiliency’ score for each main street by comparing monthly visitor levels from 2020 to 2022 (pandemic) to their equivalent months in 2019 (pre-pandemic). For each month calculate the number of visitors as a percentage of the number of visitors in 2019. The total amount a main street was below its 2019 visitor levels for each month from 2020 to 2022 is the resiliency score. For example, if a main street experienced a sharp drop-off in visitors in 2020 and was slow to recover through to 2022 then it had a relatively low resiliency score. Conversely, if a main street experienced a modest drop-off in visitors and experienced a relatively quick recovery, then it had a higher resiliency score. 
			</p>
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<LineAreaChart chartDataset='libertyvillage' yDomain={[0, 150]}/>
		<LineAreaChart chartDataset='uxbridge' yDomain={[0, 150]}/>

	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Resiliency Score (II)</h3> 
			<p>
				There was a clear geography to main street resiliency through the pandemic with downtown main streets typically suffering the sharpest drop-offs in visitor levels as well as experiencing the slowest recoveries. North York Center in Toronto was the most resilient downtown street of the case studies. This is likely due to it being essentially a secondary downtown with a significant residential population. The least resilient downtown main street was 97th Street in Edmonton which saw visitor levels drop to 15% of pre-pandemic levels in October 2021 and had only risen to 33% by the end of 2022. Small town main streets tended to be the most resilient although there was an extensive range between the top (Sutton in the Toronto region) and the bottom (St. Eustache in the Montreal region). Neighbourhood main street resiliency was in between downtowns and small towns (closer to the latter). Rue Beaubien in Montreal was the most resilient neighbourhood main street with Central Brampton (Main and Queen) being the least resilient.
			</p>
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<BarChart
			xKey="Resiliency_Score"
			title="Resiliency Score"
			xDomain={[0, 3500]}
		/>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Visitor Types</h3> 
			<p>
				Downtown main streets were the least resilient through the pandemic in large part due to the reasons people tended to go there. The shift to working from home for people who typically worked in office buildings had, and continues to have, one of the most significant impacts on cities. The cell-phone data can identify regular nighttime (home) and regular daytime (typically work) locations and can provide insights into the reasons people visit particular main streets. We segment visitors into three categories: local residents (live within 1km of the street); frequent visitors (visit during the day on a regular basis); and infrequent visitors (neither local residents or frequent visitors). There is a clear pattern that infrequent visitors (workers) outnumbered local residents in the downtown main street visitor numbers prior to the pandemic. The opposite tended to be true for small towns and neighbourhood main streets that relied more heavily on residential visitors. 
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
				One of the core purposes of the initial Measuring Main Street project was to assess the role of civic infrastructure on main street resiliency. We created a civic infrastructure provision score for every main street in the country. This metric combines the presence of civic infrastructure locations relative to the population density of the area. The civic infrastructure locations are weighted by how many people they employ there to account for scale of the facility. Downtown main streets tend to have the highest levels of civic infrastructure provisions largely due to the fact that they house facilities that offer central functions (e.g. central libraries; major performance theatres; city hall) rather than strictly cater to a local population. In the context of the pandemic, these facilities were not sufficient to make downtown main streets withstand its impacts on visitor levels. The connection between civic infrastructure and main street resiliency proved to be more nuanced. 
			</p>
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<CivicBarChart
			title="Civic Infrastructure Provision"
		/>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Correlation Analysis</h3> 
			<p>
				To uncover the factors that help explain main street resiliency through the pandemic we performed a correlation analysis with a wide range of indicators. These factors included variable of urban form, demographics, and street content. The analysis reveal two key indicators with the closest associations with main street resiliency. One was the share of visitors that are local residents. During the pandemic people tended to stay closer to home while they were less likely to travel to work or other locations further away. Main streets that relied more heavily on visitors from further away were more likely to experience sharper drop-offs and slower recoveries. The second key factor of main street resiliency was the presence of greenspace. While civic infrastructure generally, did not predict higher resiliency, parks did. This makes intuitive sense as people still had the core desire to congregate but wanted to do so in a safe outdoor setting. This suggests that civic infrastructure is indeed important to the vitality of main streets and that data analysis in more ‘normal’ times may reveal this to be the case. 
			</p>
		</div>
	</div>

	<div class="chart-container sticky-content">
	</div>
</div>


<div class="full-text">
	<div class="report-text">
		<h3>Key Findings and Recommendations</h3> 
		<ol>
			<li>
			Downtown main streets were hit hardest by the pandemic and have been the slowest to recover.
			  <ol type="a">
				<li>Develop and implement downtown recovery strategies in every city.</li>
				<li>Adjust the mix of uses on downtown main streets – civic infrastructure can be a major part of this solution.</li>
				<li>Create positive impressions of downtown in order to encourage people to return while backstopping declines in public transportation and public safety.</li>
			  </ol>
			</li>
			<li>
			Main streets that predominantly serve their immediate local residents were the most resilient through the pandemic.
			  <ol type="a">
				<li>Curate main street businesses to match local demand – use data analysis to identify gaps in what the main street currently provides.</li>
				<li>Build more housing on and near to main streets – look for infill opportunities that can supplement and expand existing options.</li>
				<li>Invest in active transportation options at the neighbourhood scale.</li>
			  </ol>
			</li>
			<li>
				The presence of greenspace contributed to main street resiliency through the pandemic.
				  <ol type="a">
					<li>Provide high quality outdoor places on main streets for people to congregate.</li>
					<li>Integrate greenery and natural amenities into main street environments.</li>
					<li>Cluster civic infrastructure on main streets and create focal points for local communities.</li>
				  </ol>
				</li>
		</ol>
		  
	</div>
</div>


<Footer />

<style>
	.chart-container {
		padding: 0em;
		border-radius: 1em;
		width: 100%;
	}
	/* 
	.chart-container.bar {
		padding: 0 20em 0 10em;
	} */

	.report-text {
		margin: 0;
	}

	.text-container {
		width: 60%;
		margin: 0;
	}

	.slide {
		display: flex;
		flex-direction: row;
		gap: 5em;
		border-bottom: 1px solid var(--brandGrey);
		padding: 5em;
	}

	.full-text {
		border-bottom: 1px solid var(--brandGrey);
		padding: 5em;
		background-color: white;
		color: var(--brandDarkBlue);
	}

	h3 {
		color:var(--brandLightBlue);
		text-transform: uppercase;
		font-weight: 600;
	}

	.sticky-content {
			position: -webkit-sticky; /* for Safari */
			position: sticky;
			top: 1em;
			align-self: flex-start; /* <-- this is the fix */
		}


</style>
