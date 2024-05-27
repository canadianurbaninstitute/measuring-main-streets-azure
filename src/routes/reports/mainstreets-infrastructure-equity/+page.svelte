<script>
	import Title from '../../lib/Title.svelte';
	import civic from '../../lib/assets/graphics/civic.svg';
	import CivicInfraIndexMap from './CivicInfraIndexMap.svelte';
	import CIIHousingMap from './CIIHousingMap.svelte';
	import CIIRecentImmigrantsMap from './CIIRecentImmigrantsMap.svelte';
	import CIIMainStreetMap from './CIIMainStreetMap.svelte';
	import KeyFindings from '../../lib/ui/KeyFindings.svelte';
	import Footer from '../../lib/Footer.svelte';

	import '../../styles.css';

	// order of graphs: downtown, neighbourhood, small towns, malls
</script>

<Title
	outline={civic}
	name={'Infrastructure Equity & Main Streets'}
	location={'Identifying equity gaps in main street civic infrastructure'}
/>

<div class="full-text">
	<p>
		Everyone living in Canadian cities should have equal access to basic civic infrastructure, no
		matter what neighbourhood they reside in. Unfortunately, this is not the case today. Not only is
		civic infrastructure unequally distributed within major urban regions; there are also some
		troublingly consistent patterns that pose potential long-term issues for underserved
		communities.
	</p>
	<p>
		This report examines civic infrastructure provision in the Toronto, Montreal, and Edmonton
		regions at the neighbourhood scale in relation to housing construction, immigration patterns,
		and the geography of main streets. The research shows that civic infrastructure deficits are
		most commonly found in recently built suburban housing developments. These neighbourhoods are
		heavily populated by immigrants, placing them at greater risk of exclusion from essential public
		services and community programs. There is another concern that in the rush to tackle the housing
		crisis, we are neglecting to invest sufficiently in the civic infrastructure that is essential
		for building inclusive, complete communities. And, in many cases, new suburban developments are
		not planned and developed around main streets that can serve as focal points for neighbourhoods.
	</p>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Civic Infrastructure Index</h3>
			<p>
				For each urban region we mapped, we evaluated the relative provision of civic infrastructure
				by neighbourhood. Our Civic Infrastructure Index calculates a weighted count of civic
				infrastructure establishments (by employees) relative to the size of the local population
				(within 1 km). These patterns are visualized by transposing the index onto major roadways in
				built-up residential areas of each region. City centres in the Toronto, Montreal, and
				Edmonton regions show a relatively high concentration of civic infrastructure. This is
				unsurprising: central library branches, city halls, and major hospitals tend to be clustered
				in downtowns to serve wider populations. Outside of the city centres, the places with a
				higher concentration of civic infrastructure tend to be older, well-established
				neighbourhoods. Conversely, the places that tend to have the largest civic infrastructure
				deficits are in more recently constructed suburban neighbourhoods.
			</p>
		</div>
	</div>
	<div class="chart-container sticky-content">
		<CivicInfraIndexMap section={'civic-infra-index'} title={'Civic Infrastructure Index'} />
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Civic Infrastructure & New Communities</h3>
			<p>
				To examine the geographic connection between civic infrastructure deficits and newer
				communities, we overlayed the Civic Infrastructure Index with the share of the housing stock
				constructed since 2010. We identify major streets that are below the median on the Civic
				Infrastructure Index and above the median on the share of housing built. We use quartiles to
				further segment the streets into four categories. The streets in white on the map are the
				places that have both the largest civic infrastructure deficits and the greatest amount of
				new housing. In all three regions, there is a consistent pattern of civic infrastructure
				deficits on the urban fringe, in more recently built communities. This calls into question
				the effectiveness of planning policies that stipulate the amount of civic infrastructure
				provision relative to housing construction. Also at issue is the model of civic
				infrastructure provision in newer suburban developments that favours larger-scale facilities
				in fewer locations, leaving many neighbourhoods physically further away from key assets and
				potentially more distant in terms of personal connection and community responsiveness.
			</p>
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<CIIHousingMap
			section={'civic-infra-index-housing'}
			title={'Civic Infrastructure Index in relation to % of New Housing'}
		/>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Civic Infrastructure & Recent Immigrants</h3>
			<p>
				A large amount of Canada’s population growth, and subsequent demand for housing, is from
				immigration. The majority of newly arrived immigrants choose to live in the largest urban
				regions. Municipalities in the Toronto, Montreal, and Edmonton regions are all struggling to
				get housing built fast enough to meet this demand. The net result is often that new suburban
				housing developments are being populated by immigrant families without sufficient levels of
				civic infrastructure. The danger is that we are establishing a pattern whereby
				longer-established communities (of largely European descent) enjoy ample civic
				infrastructure in neighbourhoods that are more urban, while (largely racialized) immigrant
				communities do not.
			</p>
		</div>
	</div>

	<div class="chart-container bar sticky-content">
		<CIIRecentImmigrantsMap
			section={'civic-infra-index-recent-immigrants'}
			title={'Civic Infrastructure Index in relation to % of Recent Immigrants'}
		/>
	</div>
</div>

<div class="slide">
	<div class="text-container sticky-content">
		<div class="report-text">
			<h3>Civic Infrastructure & High Density Main Streets</h3>
			<p>
				A foundational problem of civic infrastructure in recently built suburban communities is
				that they are not centred on main streets, even though many are more densely populated than
				those of their mid-20th century predecessors. While land use for housing has become more
				efficient, commercial land uses and civic infrastructure have not. The maps show where civic
				infrastructure gaps are greatest (major roadways, in white) in relation to the locations of
				dense main streets (in light blue). There are very few instances where these elements
				overlap – neighbourhoods with significant civic infrastructure deficits generally do not
				have main streets, and neighbourhoods with main streets do not typically have infrastructure
				deficits. How we plan and build new suburban housing developments appears to be the main
				culprit when it comes to systemic gaps in civic infrastructure. Reintroducing main streets
				as a fundamental building block of inclusive, complete communities is a clear way to address
				this. Another solution is to continue to build infill housing on and near existing main
				streets where there is ample (and even in some cases, surplus) civic infrastructure already
				in place.
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

<div class="key-findings">
	<h3>Key Findings and Messages</h3>

	<KeyFindings
		number={'1'}
		finding={'The greatest deficits of civic infrastructure are predominantly found in more recently built suburban neighbourhoods.'}
		message1={'In the rush to address the housing crisis do not ignore the need for neighbourhood scale infrastructure.'}
		message2={'Maintain direct connection between development charges and civic infrastructure investment.'}
		message3={'Encourage infill housing on (and near to) existing main streets that provide ample existing civic infrastructure.'}
	/>

	<KeyFindings
		number={'2'}
		finding={'Recently built suburban neighborhoods are not typically centered around main streets.'}
		message1={'Begin with main streets when planning new suburban neighbourhoods.'}
		message2={'Create critical mass on main streets by (co)locating civic infrastructure in close proximity to commercial uses.'}
		message3={'Align scale of civic infrastructure facilities to walkable neighbourhoods.'}
	/>

	<KeyFindings
		number={'3'}
		finding={'Recent immigrants are more likely to live in recently built suburban neighbourhoods and experience civic infrastructure deficits.'}
		message1={'Ensure that the civic infrastructure and public services are aligned with immigration levels and patterns of settlement.'}
		message2={'Listen to communities about their civic infrastructure needs and genuinely include them in investment decisions.'}
		message3={'Align provision and programming of civic infrastructure to specific neighbourhood needs.'}
	/>
</div>

<Footer />

<style>
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

	.key-findings {
		display: flex;
		flex-direction: column;
		gap: 1em;
		padding: 2.5em;
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
	}
</style>
