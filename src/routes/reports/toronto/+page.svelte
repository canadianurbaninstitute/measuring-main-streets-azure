<script>
	import Title from '../../lib/Title.svelte';
	import resiliency from '../../lib/assets/graphics/resiliency.svg';
	import CaseStudyLocationsMap from './CaseStudyLocationsMap.svelte';
	import RecoveryMultiLineChart from './RecoveryMultiLineChart.svelte';
	import CIIMainStreetMap from './CIIMainStreetMap.svelte';
	import BubbleChart from './BubbleChart.svelte'
	import Footer from '../../lib/Footer.svelte';

	import '../../styles.css';

	// order of graphs: downtown, neighbourhood, small towns, malls
</script>

<Title outline={resiliency} name={'Toronto'} location={'Regional Report'} />

<div class="full-text">
	<p>
		Vibrant main streets are essential to building strong neighbourhoods. Strong neighbourhoods are
		essential to healthy cities. And healthy cities are the foundation of a strong country. 6M
		people live in the Toronto region 97.6% of them live within 1km of a main street. Main streets
		contain over 32,000 businesses that employ 285,000 people and generate over $20 billion in
		revenue per year. There are also xxx sites of civic infrastructure on main streets that employ a
		further xxx people. These businesses and civic infrastructure play a crucial role in the
		day-to-day lives of residents. But when main streets suffer, people suffer.
	</p>
	<p>
		The COVID pandemic created significant pain on main streets resulting in the closures of
		businesses and empty storefronts. While some main streets have rebounded, many have not fully
		recovered. Our research shows (link to resiliency report) that the most resilient main streets
		are the ones most closely aligned with their immediate local community. Opportunities for
		independent business and neighbourhood scale civic infrastructure are key building blocks for
		pushing back against longer term threats to main streets such as e-commerce and regional
		shopping centers (link to malls-mice report). Unfortunately, community resources are not
		equitably distributed within urban regions such as Toronto (link to equity report). There is
		often a dearth of civic infrastructure in more recently built suburban neighbourhoods that lack
		main streets entirely. This research brief looks at main streets in the Toronto region in
		relation to the themes of resiliency, community, and equity while drawing on 20 local main
		street case studies.
	</p>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Toronto Case Study Main Streets</h3>
			<p>
				Twenty main streets were chosen in the Toronto region to act as representative case studies.
				Ten of these involved direct observational research and detailed data analysis with the
				remaining ten including solely the data component. The case studies were also contrasted
				against five regional shopping centres. Main streets were selected to provide a cross
				section of geography, including four downtown (workplace oriented) streets, four small town
				main streets, and twelve neighbourhood (residentially oriented) main streets. The presence
				of equity deserving communities was also a key factor in the selection process.
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
				While all streets experienced serious downturns during the pandemic, some were hit harder
				and took longer to recover, while others escaped with less of an impact. Our statistical
				analysis shows (report link) that the most resilient main streets were the ones that draw a
				high proportion of their visitors from the immediate neighbourhood (with 1km). Conversely,
				the least resilient streets tend to draw a greater share of their visitors from further
				away. Main streets located in and near downtowns tended to be hit harder by the pandemic and
				took longer to recover. The second most important factor associated with resiliency during
				the pandemic was the presence of greenspace as people sought out safe places where a degree
				of social interaction remained possible.
			</p>
			<p>
				Small town main streets were generally the most resilient with Sutton and Caledon East
				leading the way. The most resilient neighbourhood main street was Thorncliffe Park which had
				a high level of visitors (30%) coming from less than 1km away. More car-oriented main
				streets such as those in Pickering, Markham, Scarborough and Mississauga were less resilient
				and only drew between 9-12% of their visitors from nearby. The least resilient street out of
				all 20 Toronto cases studies was Liberty Village. This Business Improvement Area is to the
				west of the central business district and contains many high-tech employers. This industry
				continues to be at the fore of the trend to working at home. Liberty Village is also a
				relatively new residential neighbourhood that has lower levels of civic infrastructure (i.e.
				no school, library, recreation center), especially relative to other central parts of the
				city.
			</p>
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<RecoveryMultiLineChart />
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Main Street Community</h3>
			<p>
				While the pandemic posed a major challenge, there are longer-term sources of strain that
				main streets continue to confront. Regional shopping malls and e-commerce offer alternatives
				to many of the goods and services offered on main streets (link to report). Shopping malls
				were initially hit harder by the pandemic due to the effects of hard lockdowns, but
				typically rebounded faster. The use of e-commerce spiked from 2020 to 2022 before returning
				to its (more modest) historic upward trend in 2023. Despite a degree of overlap between main
				streets, malls, and e-commerce there are also significant differences. Main streets offer
				more opportunities for independent business and are also home to more civic infrastructure.
				Both elements can be more responsive to the specific needs of the local community. The
				relationships forged during the interaction between residents, business operators, and
				managers of civic infrastructure are essential for the long-term vitality of main streets.
			</p>
			<p>
				The five Toronto region shopping malls clearly have a dearth of both independent businesses
				and civic infrastructure, as they rank below all main streets on both scores. Of the Toronto
				main street case studies, Newmarket, Oakville, and Weston stand out as having higher shares
				of both independent business and civic infrastructure. Each of these are examples of main
				streets that originated in smaller towns that eventually became subsumed by urban sprawl.
				Despite being in suburban locations, these main streets are dense and walkable. There are
				multiple conditions present that are conducive to building strong local communities.
			</p>
			<p>
				The Golden Mile in Scarborough and Kingston Road in Pickering are main streets at the other
				end of the spectrum. These are places with lower levels of independent business and civic
				infrastructure that are heavily car oriented and characterized by big box retail and chain
				restaurants. Such main streets do not possess a clear identity and are less likely to be
				created for and by the local community.
			</p>
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<BubbleChart/>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Main Street Equity</h3>
			<p>
				Main streets contain businesses and civic infrastructure that are essential for the
				day-to-day lives of residents. They make peoples lives better, easier, and more enjoyable.
				They are the foundation of local communities, where people come together, interact, and form
				relationships. Unfortunately, not everyone enjoys equal access to main streets and what they
				have to offer. In some cases, main streets lack critical civic infrastructure, but more
				pointedly some neighbourhoods lack main streets altogether. Our analysis shows that more
				recently built suburban neighbourhoods are where civic infrastructure deficits are most
				prevalent.
			</p>
			<p>
				Our civic infrastructure index, which considers the amount of local (within 1km) civic
				infrastructure relative to the local population, shows that newer neighborhoods in places
				like Brampton, Mississauga, Halton, and Pickering tend to have lower levels of local access
				to civic infrastructure relative to the regional average. Central Etobicoke and the old city
				of York are examples of older established neighbourhoods that also possess lower levels of
				civic infrastructure. Downtown Toronto is at the other end of the spectrum, with much higher
				levels of civic infrastructure as it is home to many regionally significant assets.
				Fittingly, Downtown Yonge and Spadina-Chinatown are the Toronto main street cases studies
				that score the highest on the civic infrastructure index. The centres of many suburban
				communities and satellite towns also score well above the median. The main street case
				studies that are most exemplary in this respect are Oakville, Newmarket, and Markham.
			</p>
			<p>
				The core issue is not so much the overall amount of civic infrastructure, but how it is
				geographically distributed within urban regions. There is a danger of creating have and
				have-not neighbourhoods that have divergent levels of local access to civic infrastructure.
				A lack of access to neighbourhood-scale civic infrastructure also decreases the amount of
				control residents have over programming. In such a scenario, civic infrastructure is less
				responsive to specific neighbourhood needs. The civic infrastructure deficit in recently
				constructed suburban neighbourhoods is not about the amount of investment, but rather models
				that favour large, centralized sites over smaller diffused locations. Like the trend towards
				big-box retail in suburban environments, civic infrastructure provision has charted a
				similar path. These models may be more fiscally efficient in the short-term, but they come
				with longer-term issues of reducing community development and neighbourhood equity.
			</p>
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<CIIMainStreetMap
		section={'civic-infra-index-main-streets'}
		title={'Civic Infrastructure Index (Lowest Quintile) in relation to High Density Main Streets'} />
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Summary</h3>
			<p>
				The Toronto region is a thriving metropolis that offers one of the highest quality of life
				environments compared to its global peers. The city has traditionally been credited with
				having strong neighbourhoods with distinct identities. At the centre of these neighbourhoods
				are vibrant main streets that provide a range of goods, services, and activities that
				support people in their day-today lives. No two main streets are the same however, their
				specific locations and characteristics have significant impacts on the range of local
				choices and opportunities for residents. Our research assesses main streets on the three
				major themes of resiliency, community, and equity. We suggest that if the traits of specific
				main streets can foster these elements, then they will nurture healthy neighbourhoods. If
				this is done consistently across urban regions, they will provide the foundation for healthy
				cities.
			</p>
			<p>
				There is no such thing as a ‘perfect’ main street. There are a multitude of ways in which
				they can produce resiliency, community, and equity. Our research does, however, point
				towards general principals about main street characteristics that are more likely to
				generate positive outcomes. We have created indicators that most closely capture the essence
				of these themes: a resiliency index based on the relative change in visitor levels to a main
				street through the pandemic; the share of visitors that live with 1km of the main street; an
				independent business index; and a civic infrastructure index that weighs the amount of
				infrastructure relative to the size of the neighbourhood population.
			</p>
		</div>
	</div>

	<div class="chart-container bar sticky-content" />
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Summary (II)</h3>
			<p>
				The Toronto main streets that most consistently scored the highest across the key indicators
				tended to be long-established neighbourhood streets that primarily serve their immediate
				local community with a range of civic infrastructure and independent business. The primary
				examples from the case studies are Etobicoke Lakeshore and Kingston Road (Scarborough). Both
				are ‘inner’ suburban locations that are relatively walkable but also accommodate car use.
				They also offer a mix of housing types that cater to a range of income levels. Ultimately,
				these main streets were originally built (pre-1960) in conjunction with the surrounding
				housing stock and have co-evolved with physical and demographic changes. Key to this is the
				original form and how it has been adaptable over time. In the current context, such main
				streets offer prime opportunities for infill housing as they already provide ample
				supportive infrastructure.
			</p>
			<p>
				At the lower end of the spectrum are main streets that are heavily car-dependent places that
				are home to large format retail and offer limited civic infrastructure. Such main streets
				tend to serve a larger catchment area and possess fewer independent businesses. In the
				Toronto region the case studies that best encapsulate these traits are Dundas Street in
				Mississauga, Scarborough’s Golden Mile, and Kingston Road in Pickering. These main streets
				are designed to accommodate cars and are dominated by large parking lots. These places were
				among the least resilient main streets and draw a lower share of visitors from their
				surrounding neighbourhoods. While the form of these places is not conducive to adaptive
				reuse of existing buildings, they do tend to be highly suitable for larger scale
				redevelopment. Scarborough’s Golden Mile is an extreme example of this as there are over
				30,000 housing units in the application process due to the imminent opening of the Crosstown
				LRT line. While there are tremendous opportunities associated with this intensity of
				urbanization, the test will be in how well it is done rather than how much. Our research
				shows that there are many learning opportunities about building vibrant main streets from
				Toronto’s own past.
			</p>
		</div>
	</div>

	<div class="chart-container bar sticky-content" />
</div>

<Footer />

<style>
	.chart-container {
		padding: 0em;
		border-radius: 1em;
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1em;
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
		color: var(--brandLightBlue);
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
