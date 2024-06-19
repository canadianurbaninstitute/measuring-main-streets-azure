<script>
	import Title from '../../lib/Title.svelte';
	import mainstreets from '../../lib/assets/graphics/mainstreets.svg';
	import Footer from '../../lib/Footer.svelte';

	import '../../styles.css';

	// order of graphs: downtown, neighbourhood, small towns, malls
</script>

<Title
	outline={mainstreets}
	name={'Measuring Main Streets Platform'}
	location={''}
/>

<div class="full-text">
	<h3>Project Overview</h3> 
	<p>
		The Measuring Main Streets platform is a part of the Research Knowledge Initiative program from Infrastructure Canada. It was developed by the Canadian Urban Institute with support from our partners at Environics Analytics and Open North.</p>
		<p>The platform is constructed around four interrelated components:</p>
		<ul>
			<li>An interactive national map of that provides descriptive data for every main street in the country.</li>
			<li>A set of 30 full case studies across 10 regions (Toronto; Montreal; Edmonton) and 30 partial case studies (data only).</li>
			<li>Analytical research briefs and reports that provide sensemaking and point towards potential policy interventions.</li>
			<li>Smart tools and recommendations to inform main street resiliency and future civic infrastructure investment.</li>
		</ul>
</div>

<div class="full-text">
	<h3> Main Street Map</h3> 
	<p>
		Measuring Main Streets provide users with the ability to locate every main street across the country and retrieve associated data that describes the local context. One of the key contributions of this project is the creation of a standardized method for defining and identifying main streets across the country. This enables the direct comparison of main streets in a consistent manner essential for developing research findings that provide lessons for those involved in policy making and investment decisions. The methodology itself involves mapping the densities of main street businesses (i.e. retail; restaurants; local services) and civic infrastructure locations (i.e. arts & culture; education; health & care; recreation; government & community services) in relation to major roadways. This process segmented streets into high density main streets (i.e. traditional/walkable), low density main streets (i.e. car-oriented), and other major streets that do not have enough density to be consider a ‘true’ main street. On the national map section of the platform, users can click on any of these street segments and obtain general information about the street’s content (i.e. number of businesses; number of civic infrastructure) and the characteristics of the surrounding neighbourhood (i.e. demographics; housing stock; employment density). The national set of main streets can be classified and compared based on any of these indicators.
			</p>
</div>

<div class="full-text">
	<h3>Main Street Case Studies</h3> 
	<p>
		All main streets provide a range of goods and services as well as opportunities for people to congregate and interact. Yet no two main streets are exactly the same. Measuring Main Streets provides a set of 30 main street cases studies that combine detailed data profiles and direct observational research. An additional 30 data-only (no observational research) fill out a larger set of 60 across the three regions of Toronto, Montreal, and Edmonton. The case studies were selected to cover a range of contexts, from downtown main streets to small town main streets and many kinds of neighbourhoods in between. These case studies are intended to provide a foundation for the research briefs as well as lend detail and examples to specific findings. They also encapsulate the range of forms that main streets can take. The case studies include rich detail on the urban form, civic infrastructure, businesses, employment, housing, demographics, and visitor levels and characteristics. The data is reinforced by observations and photographs to paint a clearer picture of each main street environment.
				</p>
</div>

<div class="full-text">
	<h3>Main Street Research Briefs</h3> 
	<p>
		In addition to offering a range of interactive data, the Measuring Main Streets platform also provides a set of research briefs that give insights into the dynamics between main streets and civic infrastructure. These insights are intended to generate key messages for policy making and infrastructure investment decisions. The briefs are organized on three main themes: resiliency; equity; and community. The big takeaways across the set of reports are that the most resilient and equitable streets are the ones that primarily focus on the needs of their immediate local residential populations and create a sense of community through independent business and responsive civic infrastructure. This has significant implications going forward as downtown main streets need to adjust to a post-pandemic city with more people working from home. Additionally, newly planned suburban neighbourhoods will be more resilient and equitable if they reintroduce main streets as their central feature. Three further reports, one for each of Toronto, Montreal, and Edmonton further explore these themes on a regional level and draw connections with the case studies. A report commissioned to Open North that provides specific advice on how to incorporate data into main street decision making rounds out the set.
					</p>
</div>

<div class="full-text">
	<h3>Main Street Data Tools and Applications</h3> 
	<p>
		Using the main street as a unit of analysis is a novel approach to understanding urban form and neighbourhood dynamics. Measuring Main Streets provides a set of tools for exploring and visualizing a wide range of data at this scale. This includes interactive maps and charts that help users gain a deeper appreciation of how main streets can shape local communities and ultimately contribute to more resilient and equitable cities. These tools will continue to grow and expand as the measuring main streets platform continues to evolve. The platform is intended to serve a greater purpose than its project-based origins and become a hub for activities that support main street policy making and infrastructure decisions. Measuring Main Streets is already supporting other CUI programs (My Main Streets - FedDev), research projects (Housing on Main Streets – CMHC), and other client work (Ontario Line Construction Impact Dashboards – City of Toronto). More are on the way.</p>
</div>

<div class="full-text">
	<h3>Using the Measuring Main Street Platform</h3> 
	<p>
		Measuring Main Streets is designed as an interactive platform and not as a research report. There is no single beginning or end as it is intended to be experienced in a variety of ways. We hope that as you navigate your way through it that you will find data and analysis that helps you make the case for action in your own main street environment. As it continues to grow and evolve, we would appreciate your feedback on how to improve it going forward. If you have any questions or interest in exploring further opportunities please do not hesitate to get in touch.</p>
</div>




<Footer />

<style>

	.full-text {
		border-bottom: 1px solid var(--brandGrey);
		padding: 5em;
		background-color: white;
		color: var(--brandDarkBlue);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1em;
	}

	h3 {
		color:var(--brandLightBlue);
		text-transform: uppercase;
		font-weight: 600;
	}

	@media only screen and (min-width: 768px) {

	p {
		max-width: 80%;
	}
}

</style>
