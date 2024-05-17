<script>
	import Title from '../../lib/Title.svelte';
	import blank from '../../lib/assets/graphics/blank.svg';
	import CaseStudyLocationsMap from './CaseStudyLocationsMap.svelte';
	import RecoveryMultiLineChart from './RecoveryMultiLineChart.svelte';
	import CIIMainStreetMap from './CIIMainStreetMap.svelte';
	import BubbleChart from './BubbleChart.svelte'
	import Footer from '../../lib/Footer.svelte';

	import '../../styles.css';

	// order of graphs: downtown, neighbourhood, small towns, malls
</script>

<Title outline={blank} name={'Montréal'} location={'Regional Report'} bg={'https://i.imgur.com/2sGLoIh.jpeg'} />

<div class="full-text">
	<p>
		Vibrant main streets are essential to building strong neighbourhoods. Strong neighbourhoods are essential to healthy cities. And healthy cities are the foundation of a strong country.  
	</p>
	<p>Over 4 million people live in the Montréal region, with 96% residing within 1 km of a main street. Montréal’s main streets are home to over 23,000 businesses that employ 215,000 people and generate over $30 billion in revenue per year. There are also nearly 8,000 sites of civic infrastructure on main streets. </p>
	<p>
		Main street businesses and civic infrastructure play a crucial role in the day-to-day lives of residents. But when main streets suffer, people suffer. The COVID-19 pandemic created significant pain on main streets, leading to the closure of businesses, and subsequently, to empty storefronts. While some main streets in the Montréal region have rebounded, many have not fully recovered. 
	</p>
	<p>Our researchshows that the <a href="/reports/mainstreet-resiliency">most resilient main streets are those most closely aligned with their immediate local community</a>. Opportunities for independent business and neighbourhood scale civic infrastructure are key building blocks for pushing back against longer-term threats to main streets, such as <a href='reports/mainstreets-malls-mice'>ecommerce and regional shopping centres.</a></p>
	<p>Unfortunately, <a href='/reports/mainstreets-infrastructure-equity'> community resources are not equitably distributed within urban regions</a>, including in the Montréal region. And, in more recently built suburban neighbourhoods that have not been developed around a main street, there is a scarcity of civic infrastructure. This research brief looks at main streets in relation to resiliency, community, and equity, drawing on 20 Montréal-region main street case studies.</p>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Montréal Case Study Main Streets</h3>
			<p>
				Twenty main streets were chosen in the Montréal region as representative case studies. Ten involved direct observational research and detailed data analysis, and ten provide the data component alone. 
			</p>
			<p>The case studies were also contrasted with five regional shopping centres. </p>
			<p>In addition, we selected main streets that reflect a cross section of geographies, including four downtown (workplace oriented) streets, four small town main streets, and 12 neighbourhood (residentially oriented) main streets. </p>
			<p>The presence of equity deserving communities was also a key factor in the selection process. </p>
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
				While all Montréal-region main streets experienced serious downturns during the pandemic, some were hit harder and took longer to recover. 
			</p>
			<p>Our <a href="/reports/mainstreet-resiliency">statistical analysis</a> shows that the most resilient main streets were those that draw a high proportion of their visitors from the immediate neighbourhood (within 1 km). Conversely, the least resilient main streets tended to draw a greater share of their visitors from further away. </p>
			<p>
				Main streets located in and near downtowns tended to be hit harder by the pandemic and took longer to recover. The second most important factor associated with resiliency during the pandemic was the presence of greenspace, as people sought out safe places where a degree of social interaction remained possible. 
			</p>
			<p>
				Among all 20 Montréal-region main streets there were examples of small town, downtown, and residential streets demonstrating higher levels of resiliency. The most resilient main street case study was in Sainte Anne de Bellevue, which had a high level of visitors (27%) coming from less than 1 km away. Rue St. Paul in Old Montréal is a rare example of a downtown main street that showed a higher degree of resilience. Dorval and Ville Emard (Boulevard Monk) were the most resilient neighbourhood main street case studies in the Montréal region. </p>
			<p>Saint Denis and Notre Dame (Saint Henri) were among the least resilient main street case studies in the Montréal region. Both tough the edges of the downtown core and rely on a greater share of visitor from more than 1km away. The least resilient neighbourhood case study main street was Rue Ontario in Hochelaga. It captured 20% of its visitors from with 1km in 2019, which is at the low end of the spectrum for neighbourhood type main streets.  </p>
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
				While the pandemic posed a major challenge to Montréal-region main streets, there are longer-term sources of strain that continue. 
			</p>
			<p><a href="/reports/mainstreets-malls-mice">Regional shopping malls and ecommerce offer alternatives to many of the goods and services offered on main streets.</a> Shopping malls were initially hit harder by the pandemic due to the effects of hard lockdowns, but typically rebounded faster. The use of ecommerce spiked from 2020 to 2022 before returning to its (more modest) historic upward trend in 2023. </p>
			<p>
				Despite a degree of overlap between main streets and shopping malls and ecommerce, there are also significant differences. Main streets offer more opportunities for independent business and provide more civic infrastructure. Both can be more responsive to the specific needs of the local community, and the relationships forged through the interactions of residents, business operators, and managers of civic infrastructure are essential for the long-term vitality of main streets. 
			</p>
			<p>
				The five Montréal-region shopping malls clearly have a scarcity of both independent businesses and civic infrastructure, ranking below all main streets on both scores. Of the Montréal case study main streets, Boulevard Monk (Ville Emard), Rue Saint Charles (Old Longueil), and Rue Notre Dame (St. Henri) stand out as having higher shares of both independent business and civic infrastructure. Each of these are examples of main streets that are older well-established main streets that are dense and walkable. They possess a variety of building types that are generally flexible and adaptable. Two of the small-town main street case studies also scored in the top ten on both independent business and share civic infrastructure. Rue St. George (Saint Jerome) and Rue St. Eustache (St. Eustache) both demonstrate assets that are conducive to centering strong local communities.
			</p>
			<p>
				Av. Victoria (St. Lambert) and Boul. St. Martin (Laval) are main streets at the other end of the spectrum. These are places with less independent business and civic infrastructure that are heavily car-oriented and characterized by big box retail and chain restaurants. Such main streets do not possess a clear identity and are less likely to be shaped by the local community. 
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
				Main streets contain the businesses and civic infrastructure that are essential for the day-to-day lives of residents. They make people’s lives better, easier, and more enjoyable – the foundation of local communities where people come together, interact, and form relationships. 
			</p>
			<p>
				Unfortunately, not everyone enjoys equal access to main streets and what they have to offer. In some cases, main streets lack critical civic infrastructure, but more pointedly, some neighbourhoods lack main streets altogether. Our analysis shows that more recently built suburban neighbourhoods are where civic infrastructure deficits are most prevalent.
			</p>
			<p>
				Our Civic Infrastructure Index, which considers the amount of local (within 1 km) civic infrastructure relative to the local population, shows that Montréal-region more recently built neighbourhoods in places like Blainville, Laval, and Brossard tend to have lower levels of local access to civic infrastructure relative to the regional average. 			</p>
			<p>
				Downtown Montréal is at the other end of the spectrum, with much higher levels of civic infrastructure, as it is home to many regionally significant assets. Fittingly, Rue Notre Dame (St. Henri) and St. Denis are the case studies that score the highest on our Civic Infrastructure Index. In the Montréal region, access to civic infrastructure tends to taper from the centre and so the neighbourhood main streets that score the highest on the index are relatively close to downtown. Rue Beaubien (Rosement-La-Petit-Patrie) and Rue Ontario (Hochelaga) are prime examples of neighbourhood main streets with high levels of civic opportunity. 			</p>
			<p>
				The core issue not only about the overall amount of civic infrastructure, but how it is geographically distributed within urban regions. There is a danger of creating “have and have-not” neighbourhoods with divergent levels of local access to civic infrastructure, which in turn decreases the amount of control residents with less access to civic infrastructure have over programming. In such a scenario, civic infrastructure is less responsive to specific neighbourhood needs. </p>
			<p>The civic infrastructure deficit in recently constructed suburban neighbourhoods is not about the amount of investment, but rather models that favour large, centralized sites over smaller diffused locations. Like the trend toward big box retail in suburban environments, civic infrastructure provision has charted a similar path. These models may be more fiscally efficient in the short term, but they come with reduced community development and neighbourhood equity in the long term. </p>
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
				Our research assesses main streets by their resiliency, community, and equity. We suggest that if the traits of specific main streets can foster these elements, they will nurture healthy neighbourhoods. If this is done consistently across Canada’s urban regions, they will provide the foundation for healthy cities. 
			</p>
			<p>There is no such thing as a “perfect” main street. There are a multitude of ways in which they can produce resiliency, community, and equity. Our research does, however, point toward general principles about main street characteristics that are more likely to generate positive outcomes. We have created indicators that most closely capture the essence of these themes: a Resiliency Index based on the relative change in visitor levels to a main street through the pandemic and the share of visitors that live within 1 km of the main street; an Independent Business Index; and a Civic Infrastructure Index that weighs the amount of infrastructure relative to the size of the neighbourhood population. </p>
			<p>
				The Montréal region is a thriving metropolis that offers one of the highest quality of life environments compared to its global peers. The region has traditionally been credited with having strong neighbourhoods with distinct identities. At the centre of these neighbourhoods are vibrant main streets that provide a range of goods, services, and activities that support people in their day-today lives. No two main streets are the same, however; their specific locations and characteristics have significant impacts on the range of local choices and opportunities for residents. 			</p>
		</div>
	</div>

	<div class="image-container">
		<div>
		<img class='report-image' src="https://res.cloudinary.com/dfseerxb3/image/upload/Montreal/MontRoyal/2_Built_Form/IMG_6200" alt="downtownyonge">
		<h5>Mont Royal</h5>
		</div>
		<div>
		<img class='report-image' src="https://res.cloudinary.com/dfseerxb3/image/upload/Montreal/RueStCharles/2_Built_Form/IMG_6450" alt="weston">
		<h5>Rue St. Charles</h5>
		</div>
	</div>
</div>


<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Summary (II)</h3>
			<p>
				The Montréal-region main street case studies that most consistently score the highest across the key indicators tend to be neighbourhood streets that are further from the city centre with a range of independent businesses and civic infrastructure. Avenue Dorval, Boulevard Monk (Ville Emard), Boulevard St. Martin (Laval), and Jean Talon (Parc-Extension) are older suburban main streets that primarily serve their local communities. They also tend to offer a mix of housing types that cater to a range of income levels. These main streets were originally built (pre-1960) in conjunction with the surrounding housing stock and have co-evolved with physical and demographic changes. Key to this is the original built form and how adaptable it is over time. In the current context, such main streets offer prime opportunities for infill housing as they already provide ample supportive infrastructure. 			</p>
			<p>
				Montréal differs from the other case study regions of Toronto and Edmonton in overall urban form largely due to its relative age. Many of the main streets are older, and thus can be considered ‘traditional’ in the sense that they are highly walkable and provide fine grained retail. Cultural factors also likely contribute to Montréal having significantly higher levels of independent business. Long-term these factors are conducive to highly vibrant main streets, but in the short-term they may have contributed to Montréal being more negatively impacted by the pandemic, especially in areas closer to the centre. In addition to possessing an advantageous form, Montréal has also been at the fore of main street innovation. Imaginative use of the public realm and bolder pursuits of pedestrianization have received attention across the country. Many of these initiatives are now supported by data similar to what can be found on the Measuring Main Street platform.
			</p>
			</div>
	</div>

	<div class="image-container">
		<div>
		<img class='report-image' src="https://res.cloudinary.com/dfseerxb3/image/upload/Montreal/RueOntario/2_Built_Form/IMG_6286" alt="kingstonroad">
		<h5>Rue Ontario</h5>
		</div>
		<div>
		<img class='report-image' src="https://res.cloudinary.com/dfseerxb3/image/upload/Montreal/BoulStMartin/3_Civic/IMG_6774" alt="missdundas">
		<h5>Boulevard St. Martin, Laval</h5>
		</div>
	</div>
</div>

<Footer />

<style>
	.chart-container {
		padding: 0;
		border-radius: 1em;
		width: 100%;
	}

	.image-container {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	.report-image {
		width: 100%;
	}

	.report-text {
		margin: 0;
	}

	.slide {
		display: flex;
		flex-direction: column;
		gap: 2.5em;
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
			gap: 5em;
		}

		.full-text {
			padding: 5em;
		}

		.text-container {
			width: 60%;
			margin: 0;
		}

		.report-image {
			width: 50vw;
		}
	}
</style>
