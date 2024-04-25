<script>
	import Title from '../../lib/Title.svelte';
	import malls from '../../lib/assets/graphics/malls.svg';
	import RecoveryMultiLineChart from './RecoveryMultiLineChart.svelte';
	import BarChart from './BarChart.svelte';
	import MultiLineChart from './MultiLineChart.svelte';
	import KeyFindings from '../../lib/ui/KeyFindings.svelte';
	import Footer from '../../lib/Footer.svelte';

	import '../../styles.css';

	// order of graphs: downtown, neighbourhood, small towns, malls
</script>

<Title
	outline={malls}
	name={'Main Streets, Malls & Mice'}
	location={'Trajectories of main streets, shopping malls and online behaviour'}
/>

<div class="full-text">
	<p>
		Main streets were experiencing serious headwinds before the onset of the COVID-19 pandemic, in the form of competition from shopping malls and shifting consumer behaviour to online retailing. At the onset of the pandemic there were many doomsday predictions for main streets, as online retailing spiked. It was widely seen as an acceleration of an “inevitable” trend that would lead to the shuttering of many bricks-and-mortar (independent) businesses. 	</p>
		<p>While there are many related challenges facing local small business communities, the trend of consumers to choose among main streets, shopping malls, and online options have not been linear or as catastrophic as some had predicted. This brief sorts out how the pandemic impacted consumer behaviours and what lessons can be learned for main street resiliency. The primary message is that main streets need to be central to building distinct local communities, to best position themselves relative to the lure of shopping malls and online commerce.</p>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Visitor Levels</h3> 
			<p>
				For the Measuring Main Streets project we tracked the visitor levels of 60 main streets and 15 regional shopping malls in the Toronto, Montreal, and Edmonton regions. The streets were chosen to be representative of location, form, and demographics, as well as equity. Each was grouped into one of three broad categories: downtown (workplace-oriented), small town, and urban/suburban (residential-oriented). The visitor data dates to the beginning of 2019 and enables the comparison of visitor levels through to the end of 2022 on a monthly basis for individual streets or groups of streets, according to type.			</p>
			<p>
				The pandemic began to impact the lives of Canadians heavily in March 2020. Hard lockdowns were imposed in many places, while fear and uncertainty dominated personal decision-making. During these early months, visitor levels to main streets and malls dropped-off precipitously. By April 2020, visitor levels to all types of main streets in Toronto, Montreal, and Edmonton fell by at least half, with downtown main streets dropping below 30% of pre-pandemic levels. Regional shopping malls were the most affected by hard lockdowns, falling to 15% of pre-pandemic visitor levels.			</p>
			<p>
				Recovery trajectories also varied significantly by specific context. 			</p>
				<p>Small town main streets and residentially oriented main streets recovered more quickly than those in downtowns. Much of this was due to a shift to work from home arrangements, which heavily impacted office tower occupancy in city centres. As people worked from home more often, they likely shifted some of their consumption patterns to their neighbourhood main street. </p>
				<p>By the end of 2022, nine out of the 75 case study main streets and shopping malls had fully recovered or exceeded 2019 visitor levels. Five of these main streets were in small towns and four anchored residential neighbourhoods. Regional shopping malls typically experienced a series of V-shaped sharp declines and rebounds in relation to hard lockdowns. In aggregate, these spiky patterns did not add up to a full recovery for the case study shopping malls by the end of 2022. Overall, regional shopping malls outperformed main streets in 2022 despite another decline in the final two months of that year. </p>
				<p>People seemed more comfortable returning to malls in greater numbers sooner than to most main streets. Shopping malls tend to invest in creating perceptions of safety and security. Part of this effort involves crafting consistent and cohesive environments where people know what to expect. Main streets can draw some longer-term lessons from this, while retaining their distinct character and experiences.</p>
		</div>
	</div>

	<div class="chart-container sticky-content">
		<RecoveryMultiLineChart />
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Civic Infrastructure</h3> 
			<p>
				Regional shopping malls do not typically provide the same range of offerings as main streets. Measuring Main Streets identifies the businesses (retail, bars and restaurants, local services) and civic infrastructure (arts and culture, recreation, education, healthcare, government and community services) that are commonly found in main street environments. For the average main street, civic infrastructure accounts for slightly more than 20% of all establishments, though for some it is significantly higher. This is in contrast to regional shopping malls where civic infrastructure accounts for only 8% of establishments, on average. Only one regional shopping centre in the study (Millwood Town Centre) provides civic infrastructure at the rate of a typical main street.			</p>
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<BarChart
			xKey="civic"
			title="Civic Infrastructure as a Share of Establishments (%)"
			xDomain={[0, 60]}
		/>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Independent Businesses</h3> 
			<p>
				A key difference between main streets and regional shopping centres is the extent to which they support independent business. For the Measuring Main Streets project, we developed an Independent Business Index to assess the relative balance between one-off independent businesses and chain-affiliated establishments. (The index considers the size of a chain so those that are small and local are not equated with large international chains.) A score closer to one means that an area has a greater share of independent businesses relative to chains; a score closer to zero indicates a higher share of chain businesses. 			</p>
				<p>The average Independent Business Index score for the 60 main street case studies was 0.74, compared to 0.30 for the 15 regional shopping malls. Main streets clearly provide significantly more opportunities for locally owned independent business. Such businesses are also more likely to provide goods and services that are more closely aligned with the nuances of local communities.</p>
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<BarChart xKey="independence" title="Independent Business Index" />
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Distance Travelled</h3> 
			<p>
				Regional shopping malls tend to serve a wider catchment area than neighbourhood oriented main streets. The average trip distance to the 15 regional shopping malls in 2022 was 10 km, versus 7.8 km for neighbourhood main streets. Small town and downtown mains streets’ trip distance profiles are more aligned with that of regional shopping malls than neighbourhood main streets but for different reasons. Small town main streets typically serve low-density and rural communities, while downtown main streets draw people from all parts of the city. Average trip distances to all types of main streets as well as to shopping malls fell significantly through the pandemic (2020–2021) before beginning to revert to historical levels in 2022. 			</p>
				<p>As people travelled less during the pandemic there were significant reductions in average household greenhouse gas emissions. In 2020 there was a reduction of 17.3% followed by a further drop of 0.5% in 2021 (Statistics Canada 2022). This highlights the possible environmental benefits of providing essential goods and services on main streets in more densely populated neighbourhoods.</p>
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<BarChart
			xKey="distance"
			title="Average Distance (km) Travelled by Visitors"
			xDomain={[0, 18]}
		/>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Ecommerce</h3> 
			<p>
				As all types of physical locations showed declines in activity in the early stages of the pandemic, e-commerce boomed. April 2020 saw the share of e-commerce for all retail trade rise above 10% for the first time. Prior to the pandemic, e-commerce accounted for a rising share of the value of retail transactions but had yet to breach the 4% mark. This sudden spike led to many predictions that this was an inevitable acceleration of an existing trend that would continue beyond the end of the pandemic. These predictions did not come to fruition as e-commerce stayed well above expected levels for the core two years of the pandemic before retreating to the historic trend. While the pandemic does not seem to have accelerated a consumer shift to online retail, the long-term pattern continues to rise steadily.			</p>
		</div>
	</div>

	<div class="chart-container sticky-content">
		<MultiLineChart
			title="E-Commerce Share (%) of All Retail Sales"
			yDomain={[0, 12]}
			chartDataset={'ecommerce'}
		/>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Restaurants</h3> 
			<p>
				There was also a notable increase in online orders for restaurant meals during the pandemic. By 2021, online restaurant revenues had risen by an estimated 90% from pre-pandemic (2019) amounts (DoorDash/Restaurants Canada 2022). This was a lifesaver for many main street businesses that saw their in-person dining levels evaporate in the early stages of the pandemic. The trajectory of restaurant revenues was similar to that of regional shopping malls: there were very sharp drop-offs during hard lockdowns and very quick recoveries.		</p>
				<p>Full-service restaurants and bars (“drinking places”) experienced deeper losses of revenue than limited-service (fast food) restaurants, as they are almost entirely dependent on in-person consumption. Fast food restaurants were better positioned to adjust through online orders, deliveries, and service windows. As a result, they managed to exceed pre-pandemic sales levels by the summer of 2021. The downside for independent businesses is that many online ordering and deliveries are mediated by third parties that capture most, if not all, of the extra revenue (McKinsey, YEAR). The potential downside for main streets is that when more people stay home (rather than visiting in person), the overall vibrancy and experience of the main street is reduced, which can in turn undermine their recovery efforts.</p>
		</div>
	</div>

	<div class="chart-container sticky-content">
		<MultiLineChart
			title="Sales Relative to Same Month in 2019 (%)"
			yDomain={[0, 150]}
			chartDataset={'restaurant'}
		/>
	</div>
</div>

<div class="full-text">

	<h3>Key Findings and Messages</h3> 


	<KeyFindings 
	number={'1'}
	finding={'Main streets are able to center complete communities in ways that regional shopping malls and online commerce cannot.'}
	message1={'Cluster civic infrastructure on main streets to generate synergies and center complete communities.'}
	message2={'Support and protect independent businesses.'}
	message3={'Organize civic institutions and independent business operators to focus on serving local community needs.'}
	/>

	<KeyFindings 
		number={'2'}
		finding={'Regional shopping malls experienced sharper declines in visitor levels at key stages (the hard lockdowns) of the pandemic, but people felt safer returning to them earlier.'}
		message1={'Ensure that main streets feel safe and inviting.'}
		message2={'Create a cohesive main street identity and promote it.'}
		message3={'Focus on overall experience on main streets that provides a balance between being comfortable and serendipitous.'}
		/>
	


		<KeyFindings 
		number={'3'}
		finding={'More consumer behaviour is shifting online, but not at the rapid pace expected during the pandemic.'}
		message1={'Provide tools and advice to small independent businesses on maximizing their own online presence.'}
		message2={'Seek out or create alternatives to third-party online food delivery services.'}
		message3={'Work together to create a main street-scale online presence that strengthens local community by connecting residents, business, and civic infrastructure.'}
		/>
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
		display: flex;
		flex-direction: column;
		gap: 1em;
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
