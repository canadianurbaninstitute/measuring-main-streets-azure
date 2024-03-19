<script>
	import Title from '../../lib/Title.svelte';
	import malls from '../../lib/assets/graphics/malls.svg';
	import RecoveryMultiLineChart from './RecoveryMultiLineChart.svelte';
	import BarChart from './BarChart.svelte';

	import '../../styles.css';
</script>

<Title
	outline={malls}
	name={'Main Streets, Malls & Mice'}
	location={'Trajectories of main streets, shopping malls and online behaviour'}
/>

<div class="text-container">
	<div class="report-text">
		<p>
			Main streets were experiencing serious headwinds before the onset of the pandemic in the form
			of competition from shopping malls and shifting consumer behavior to online retailing. At the
			outset of the pandemic there were many doomsday predictions for main streets as online
			retailing spiked. It was seen as an acceleration of on inevitable trend that would lead to the
			shuttering of many bricks and mortar (independent) businesses. While there are a stack of
			related challenges facing local small business communities, the trends of consumer choices
			between main streets, malls, and online have not been linear or as catastrophic as some had
			predicted. This report sorts out how the pandemic impacted consumer behaviors and what lessons
			can be learned for main street resiliency.
		</p>
		<p>
			For the Measuring Main Streets project we tracked the visitor levels of 60 main streets and 15
			regional shopping malls in the Toronto, Montreal, and Edmonton regions. The streets were
			chosen to be representative of location, form, and demographics/equity. These were grouped
			into three broad categories of downtown (workplace oriented), small town, and urban/suburban
			(residential oriented). The visitor data dates to the beginning of 2019 and enables the
			comparison of visitor levels through to the end of 2022 on a monthly basis for individual
			streets or groups of streets according to type.
		</p>
		<p>
			The pandemic began to heavily impact the lives of Canadians in March of 2020. Hard lockdowns
			were imposed in many places while fear and uncertainty dominated personal decisions. During
			these early months visitor levels to main streets and malls dropped off precipitously. By
			April 2020, visitor levels to all types of main streets in Toronto, Montreal and Edmonton fell
			by at least half with downtown main streets dropping below 30% of pre-pandemic levels.
			Regional shopping malls were the most affected by hard lockdowns, falling to 15% of
			pre-pandemic visitor levels.
		</p>
		<p>
			Recovery trajectories also varied significantly by specific context. Small town main streets
			and residentially oriented main streets recovered more quickly than ones in downtowns. Much of
			this was due to a shift to work-from-home arrangements that heavily impacted office tower
			occupancy in city centers. As people worked from home more often, they are likely to have
			shifted some of their consumption patterns to their neighbourhood main street. By the end of
			2022, 9 out of the 75 case study main streets and shopping malls had fully recovered (or
			exceeded 2019 visitor levels). Five of these main streets were in small towns and four
			anchored residential neighbourhoods. Regional shopping malls typically experienced a series of
			V-shaped sharp declines and rebounds in relation to hard lockdowns. In aggregate, these spiky
			patterns did not add up to a full recovery for the studied malls by the 2022. Overall,
			regional shopping malls did not end 2022 in great shape, but they did outperform downtown
			oriented main streets by a significant margin.
		</p>
	</div>
</div>

<div class="chart-container">
	<RecoveryMultiLineChart />
</div>

<div class="text-container">
	<div class="report-text">
		<p>
			Regional shopping malls do not typically provide the same range of offerings as main streets.
			Measuring Main Streets identifies businesses (retail; bars & restaurants; local services) and
			civic infrastructure (arts & culture; recreation; education; health & care; government &
			community services) that are commonly found in main street environments. For the average main
			street, civic infrastructure accounts for slightly more than 20% of all establishments –
			though for some it is significantly higher. This is contrast to regional shopping malls where
			on average civic infrastructure accounts for only 8% of establishments. Only one regional
			shopping center in the study (Millwoood Town Center) provides civic infrastructure at the rate
			of typical main street.
		</p>
	</div>
</div>


<div class="chart-container">
	<BarChart />
</div>


<div class="text-container">
	<div class="report-text">
		<p>
			A key difference between main streets and regional shopping centers is the extent to which they support independent business. Measuring Main Streets developed an Independent Index to assess the relative balance between one-off independent businesses and establishments that are parts of chains. The index considers the size of the chain so that smaller local ones are not equated with large international chains. A score closer to one means that an area has a greater share of independent business relative to chains (and closer to zero should be read as a higher share of chain businesses). The average Independent Business Index score for the 60 main street case studies was 0.74 in comparison to 0.30 for the 15 regional shopping malls. Main streets clearly provide significantly more opportunities for locally owned independent business. Such businesses are also more likely to provides goods and services that are more closely aligned with the nuances of local communities. 
		</p>
	</div>
</div>

<style>
	.chart-container {
		padding: 0 20em 0 5em;
	}
</style>
