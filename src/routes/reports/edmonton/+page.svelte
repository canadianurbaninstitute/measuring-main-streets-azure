<script>
	import Title from '../../lib/ui/Title.svelte';
	import blank from '../../lib/assets/graphics/blank.svg';

	import CaseStudyLocationsMap from './CaseStudyLocationsMap.svelte';
	import CIIMainStreetMap from './CIIMainStreetMap.svelte';

	import Footer from '../../lib/ui/Footer.svelte';
	import RecoveryMultiLineChart from '../mainstreets-malls-mice/RecoveryMultiLineChart.svelte';
	import BubbleChart from '../../lib/BubbleChart.svelte'


	import '../../styles.css';

	import { dataset } from '../../lib/data/reportdata/edmonton/selectLabels.js';
	import data from '../../lib/data/reportdata/edmonton/bubble-edmonton.csv';


	// order of graphs: downtown, neighbourhood, small towns, malls
</script>

<Title
	outline={blank}
	name={'Edmonton'}
	location={'Regional Report'}
	bg={'https://i.imgur.com/Ickzdba.jpeg'}
/>

<div class="full-text">
	<p>
		Vibrant main streets are essential to building strong neighbourhoods. Strong neighbourhoods are
		essential to healthy cities. And healthy cities are the foundation of a strong country.
		The Edmonton region is home to 1.5 million people, and 88% of them live within 1 km of a main
		street. Main streets are home to over 6,000 businesses that employ nearly 60,000 people while
		generating over $8.5 billion in revenue per year. There are also over 2,000 sites of civic
		infrastructure on main streets in the Edmonton region.
	</p>
	<p>
		Main street businesses and civic infrastructure play a crucial role in the day-to-day lives of
		residents. But when main streets suffer, people suffer. The COVID-19 pandemic created
		significant pain on main streets, leading to the closure of businesses, and subsequently, to
		empty storefronts. While some main streets in the Edmonton region have rebounded, many have not
		fully recovered.
	</p>
	<p>
		Our research shows that the <a href="/reports/mainstreet-resiliency"
			>most resilient main streets are those most closely aligned with their immediate local
			community</a
		>. Opportunities for independent business and neighbourhood scale civic infrastructure are key
		building blocks for pushing back against longer-term threats to main streets, such as
		<a href="reports/mainstreets-malls-mice">ecommerce and regional shopping centres.</a>
	</p>
	<p>
		Unfortunately, <a href="/reports/mainstreets-infrastructure-equity">
			community resources are not equitably distributed within urban regions</a
		>, including in the Edmonton region. And, in more recently built suburban neighbourhoods that
		have not been developed around a main street, there is a scarcity of civic infrastructure. This
		research brief looks at main streets in relation to resiliency, community, and equity, drawing
		on 20 Edmonton-region main street case studies.
	</p>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Edmonton Case Study Main Streets</h3>
			<p>
				Twenty main streets were chosen in the Edmonton region as representative case studies. Ten
				involved direct observational research and detailed data analysis, and ten provide the data
				component alone.
			</p>
			<p>The case studies were also contrasted with five regional shopping centres.</p>
			<p>
				In addition, we selected main streets that reflect a cross section of geographies, including
				four downtown (workplace oriented) streets, four small town main streets, and 12
				neighbourhood (residentially oriented) main streets.
			</p>
			<p>
				The presence of equity deserving communities was also a key factor in the selection process.
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
			<h3>Main Street Resiliency</h3>
			<p>
				While all Montréal-region main streets experienced serious downturns during the pandemic,
				some were hit harder and took longer to recover.
			</p>
			<p>
				Our <a href="/reports/mainstreet-resiliency">statistical analysis</a> shows that the most resilient
				main streets were those that draw a high proportion of their visitors from the immediate neighbourhood
				(within 1 km). Conversely, the least resilient main streets tended to draw a greater share of
				their visitors from further away.
			</p>
			<p>
				Main streets located in and near downtowns tended to be hit harder by the pandemic and took
				longer to recover. The second most important factor associated with resiliency during the
				pandemic was the presence of greenspace, as people sought out safe places where a degree of
				social interaction remained possible.
			</p>
			<p>
				Among all 20 Edmonton-region main streets, those in small towns were generally the most
				resilient sub-type, with Beaumont leading the way. The most resilient neighbourhood main
				streets were found in <a href="casestudies/edmonton/149stnw">West Edmonton (149th Street NW)</a> and <a href="casestudies/edmonton/118beverly">Beverly (118 Avenue NW)</a> which
				typically had higher levels (28%-33%) of visitors coming from less than 1 km away. More
				car-oriented main streets such as <a href="casestudies/edmonton/104streetnw">Calgary Trail</a> and <a href="casestudies/edmonton/sherwooddrive">Sherwood Drive</a> were less resilient and
				only drew between 5%–13% of their visitors from nearby.
			</p>
			<p>
				The least resilient Edmonton case study main streets <a href="casestudies/edmonton/97streetnw">97 Street (Chinatown)</a>, <a href="casestudies/edmonton/104streetdowntown">4th Street
				Promenade</a>, and <a href="casestudies/edmonton/jasperavenue">Jasper Avenue</a>. Each of these three are examples of downtown main streets that
				traditionally depend on the presence of office workers and related central city activity.
				<a href="casestudies/edmonton/107avenuenw">107th Avenue W (Central McDougall)</a> was the fourth downtown Edmonton case study main street,
				which was not as adversely affected by the pandemic as the other three as it sits outside
				the central business district and serves more of a residential population.
			</p>
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<RecoveryMultiLineChart dataset={dataset}/>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Main Street Community</h3>
			<p>
				While the pandemic posed a major challenge to Edmonton-region main streets, there are
				longer-term sources of strain that continue.
			</p>
			<p>
				<a href="/reports/mainstreets-malls-mice"
					>Regional shopping malls and ecommerce offer alternatives to many of the goods and
					services offered on main streets.</a
				> Shopping malls were initially hit harder by the pandemic due to the effects of hard lockdowns,
				but typically rebounded faster. The use of ecommerce spiked from 2020 to 2022 before returning
				to its (more modest) historic upward trend in 2023.
			</p>
			<p>
				Despite a degree of overlap between main streets and shopping malls and ecommerce, there are
				also significant differences. Main streets offer more opportunities for independent business
				and provide more civic infrastructure. Both can be more responsive to the specific needs of
				the local community, and the relationships forged through the interactions of residents,
				business operators, and managers of civic infrastructure are essential for the long-term
				vitality of main streets.
			</p>
			<p>
				The five Edmonton-region shopping malls clearly have a scarcity of both independent
				businesses and civic infrastructure, ranking below all main streets on both scores. Of the
				Edmonton case studies, <a href="casestudies/edmonton/124streetnw">124th Street</a> and  <a href="casestudies/edmonton/104streetnw">Calgary Trail</a> stand out as having higher shares of
				both independent business and civic infrastructure. Despite being located outside the city
				centre, these main streets are denser and more walkable than many other suburban streets.
				There are multiple conditions present that are conducive to building strong local
				communities.
			</p>
			<p>
				The <a href="casestudies/edmonton/137avenuenw">137th Avenue NW (North Edmonton)</a> and <a href="casestudies/edmonton/parsonsroadsw">Parsons Road</a> are main streets at the other end of
				the spectrum. These are places with less independent business and civic infrastructure that
				are heavily car-oriented and characterized by big box retail and chain restaurants. Such
				main streets do not possess a clear identity and are less likely to be created for and by
				the local community.
			</p>
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<BubbleChart data={data} />
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Main Street Equity</h3>
			<p>
				Main streets contain the businesses and civic infrastructure that are essential for the
				day-to-day lives of residents. They make people’s lives better, easier, and more enjoyable –
				the foundation of local communities where people come together, interact, and form
				relationships.
			</p>
			<p>
				Unfortunately, not everyone enjoys equal access to main streets and what they have to offer.
				In some cases, main streets lack critical civic infrastructure, but more pointedly, some
				neighbourhoods lack main streets altogether. Our analysis shows that more recently built
				suburban neighbourhoods are where civic infrastructure deficits are most prevalent.
			</p>
			<p>
				Our Civic Infrastructure Index, which considers the amount of local (within 1 km) civic
				infrastructure relative to the local population, shows that newer Edmonton-region
				neighbourhoods further from the city centre and closer to the Henday (Hwy. 216) tend to have
				lower levels of local access to civic infrastructure relative to the regional average.
				Central Etobicoke and the former City of York are examples of older, established
				neighbourhoods that also possess lower levels of civic infrastructure.
			</p>
			<p>
				Downtown Edmonton is at the other end of the spectrum, with much higher levels of civic
				infrastructure, as it is home to many regionally significant assets. The four downtown main
				street case studies are also the top four on our Civic Infrastructure Index. The centres of
				many smaller communities in the region, such as Leduc, St, Albert, and Fort Saskatchewan,
				also score well above the median.
			</p>
			<p>
				The core issue not only about the overall amount of civic infrastructure, but how it is
				geographically distributed within urban regions. There is a danger of creating “have and
				have-not” neighbourhoods with divergent levels of local access to civic infrastructure,
				which in turn decreases the amount of control residents with less access to civic
				infrastructure have over programming. In such a scenario, civic infrastructure is less
				responsive to specific neighbourhood needs.
			</p>
			<p>
				The civic infrastructure deficit in recently constructed suburban neighbourhoods is not
				about the amount of investment, but rather models that favour large, centralized sites over
				smaller diffused locations. Like the trend toward big box retail in suburban environments,
				civic infrastructure provision has charted a similar path. These models may be more fiscally
				efficient in the short term, but they come with reduced community development and
				neighbourhood equity in the long term.
			</p>
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<CIIMainStreetMap
			section={'civic-infra-index-main-streets'}
			title={'Civic Infrastructure Index (Lowest Quintile) in relation to High Density Main Streets'}
		/>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Summary</h3>
			<p>
				Our research assesses main streets by their resiliency, community, and equity. We suggest
				that if the traits of specific main streets can foster these elements, they will nurture
				healthy neighbourhoods. If this is done consistently across Canada’s urban regions, they
				will provide the foundation for healthy cities. The City of Edmonton is implementing a new
				zoning framework that actively encourages the development of ’15-minute communities’. Main
				streets remain an important element of this policy, as it seeks to expand land use options
				in node, corridors, and residential neighbourhoods.
			</p>
			<p>
				There is no such thing as a “perfect” main street. There are a multitude of ways in which
				they can produce resiliency, community, and equity. Our research does, however, point toward
				general principles about main street characteristics that are more likely to generate
				positive outcomes. We have created indicators that most closely capture the essence of these
				themes: a Resiliency Index based on the relative change in visitor levels to a main street
				through the pandemic and the share of visitors that live within 1 km of the main street; an
				Independent Business Index; and a Civic Infrastructure Index that weighs the amount of
				infrastructure relative to the size of the neighbourhood population.
			</p>
			<p>
				The Edmonton region is a dynamic metropolis that has a growing economy and offers a high
				quality of life. The region has a mix of well-established neighbourhoods with distinct
				identities and many newer areas that are still growing into themselves. At the centre of the
				more well-established neighbourhoods are vibrant main streets that provide a range of goods,
				services, and activities that support people in their day-to-day lives. No two main streets
				are the same, however; their specific locations and characteristics have significant impacts
				on the range of local choices and opportunities for residents.
			</p>
		</div>
	</div>

	<div class="image-container">
		<div>
			<img class="report-image" src="https://i.imgur.com/7VC9qhM.jpeg" alt="124st" />
			<h5>124 Street NW</h5>
		</div>
		<div>
			<img class="report-image" src="https://i.imgur.com/ciffdqV.jpeg" alt="weston" />
			<h5>Alberta Avenue</h5>
		</div>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Summary (II)</h3>
			<p>
				The Edmonton-region main streets that most consistently score the highest across the key
				indicators tend to be long-established neighbourhood streets that primarily serve their
				immediate local community with a range of independent businesses and civic infrastructure.
				<a href="casestudies/edmonton/124streetnw">124th Street</a>, <a href="casestudies/edmonton/118albertaave">Alberta Avenue</a>, and <a href="casestudies/edmonton/50streetstonyplain">50 Street in Stony Plain</a> are locations that are relatively
				walkable but also accommodate car use. These main streets were originally built (mostly
				pre-1960) in conjunction with the surrounding housing stock and have co-evolved with
				physical and demographic changes. Key to this is the original built form and how adaptable
				it is over time. In the current context, such main streets offer prime opportunities for
				infill housing as they already provide ample supportive infrastructure.
			</p>
			<p>
				At the lower end of the spectrum are main streets that are heavily car-dependent places with
				large format (big box) retail and offer limited civic infrastructure. Such main streets tend
				to serve a larger catchment area and possess fewer independent businesses. <a href="casestudies/edmonton/sherwooddrive">Sherwood Drive</a>,
				<a href="casestudies/edmonton/parsonsroadsw">Parsons Road (South Edmonton Common)</a>, <a href="casestudies/edmonton/104streetnw"> 104 Street NW (Calgary Trail)</a>, and <a href="casestudies/edmonton/50ave">50 Avenue (Leduc)</a>
				are examples of main streets that are designed to accommodate cars and are dominated by
				large parking lots. These places are among the least resilient main streets and draw a lower
				share of visitors from their surrounding neighbourhoods.
			</p>
			<p>
				Edmonton’s recent District Planning and zoning amendments clearly recognize the goal of
				creating ’15-minute neighbourhoods’ that intend to generate a range of economic, social, and
				environmental benefits to residents and local businesses. This policy approach applies the
				positive lessons provided by ‘traditional main’ streets that are dense and walkable, but
				most importantly, adaptable to ever changing local needs. While it also recognizes the
				failures of more recently built suburban main streets and neighbourhoods that are dominated
				by car use and are associated with many negative outcomes. Success in implementing these
				policies will have a significant impact on Edmonton’s long-term urban form, and ultimately,
				the quality of life of current and future residents.
			</p>
		</div>
	</div>

	<div class="image-container">
		<div>
			<img class="report-image" src="https://i.imgur.com/yVJb0bT.jpeg" alt="kingstonroad" />
			<h5>Whyte Avenue</h5>
		</div>
		<div>
			<img class="report-image" src="https://i.imgur.com/J3JdmjW.jpeg" alt="missdundas" />
			<h5>Stony Plain Road NW</h5>
		</div>
	</div>
</div>

<Footer />