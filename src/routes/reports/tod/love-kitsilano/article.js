/**
 * article.js - Eating Well Report Data
 */

export const sections = [
	{
		layout: 'scrolly',
		panels: [
			{
				id: 'welcome'
			}
		],
		blocks: [
			{
				panelId: 'welcome',
				heading: 'What does it mean to Love Your Neighbourhood?',
				body: `<p><em>Love Your Neighbourhood</em> is a digital engagement initiative developed by Digital Public Square for the Research and Knowledge Initiative (RKI) project led by the Canadian Urban Institute and funded by Housing, Infrastructure and Communities Canada. The digital platform was designed to give community members a voice in shaping neighbourhood priorities while educating them about residential intensification, transit-oriented development, and complete communities. </p>
				<p>The project was undertaken through the lenses of raising awareness of what complete communities can offer, gathering resident opinions on local priorities, and empowering people to advocate for the changes they want to see.</p>`
			}
		]
	},
	{
		layout: 'scrolly',
		panels: [
			{
				id: 'kitsilano'
			}
		],
		blocks: [
			{
				panelId: 'kitsilano',
				heading: 'Love Kitsilano',
				body: `<p>The Kitsilano platform invited residents of this established Vancouver neighbourhood to share their perspectives on community priorities and neighbourhood change. As a dense, amenity-rich area, Kitsilano offered a unique context for exploring how residents understand and value the principles of complete communities, and what residential intensification and transit-oriented development could mean for a neighbourhood already navigating growth pressures.</p>
				<p>To analyse the neighbourhood, we used natural language processing in combination with Environics Analytics Opticks Numeris data and posts queried from Reddit related to Kitsilano and development. This allowed Digital Public Square to get an aggregate picture of people’s opinions around development intensification in Kitsilano.</p>`
			}
		]
	},
	{
		layout: 'inline',
		panels: [{ id: 'engagement-summary' }],
		blocks: [
			{
				heading: 'Community Perspectives',
				body: `<p>Analysis of community discussions revealed clear themes in how residents view neighbourhood change. These results highlight both the points of contention and the shared values that can drive future development.</p>`,
				panelId: 'engagement-summary'
			}
		]
	},
	{
		layout: 'scrolly',
		panels: [
			{
				id: 'engagement'
			}
		],
		blocks: [
			{
				panelId: 'engagement',
				heading: 'Takeaway #1: High Engagement',
				body: `<p>Kitsilano saw the highest numbers across six key engagement metrics, including total of number of
				questions answered, respondents answering at least one question, link clicks to follow-on services, and those who opted in to share their postal codes. It also saw the highest community poll engagement.</p>`
			}
		]
	},
	{
		layout: 'scrolly',
		panels: [
			{
				id: 'civic-infrastructure',
				label: 'Figure 5 – Comparative models of affordable grocery provision',
				source: 'CUI Research (2026)'
			}
		],
		blocks: [
			{
				heading: 'Grocery stores are civic infrastructure',
				body: `<p>As all levels of government work to make the most of transit investment, enabling the creation of lively urban, mixed-use neighbourhoods around subway and train stations needs intentional consideration of residents’ access to food. Just as affordable housing initiatives work to achieve housing security, affordable grocery options would do the same for food security.</p>
				<p>Both the public option and the co-operative option represent two approaches to increasing competition in the grocery industry. While they represent different approaches to addressing the same problem—runaway grocery prices—both are driven to financially benefit Canadians and can be combined for the great benefit of ## millions of transit neighbourhood residents.</p>
				<p>The provision of food shouldn’t be solely left to market forces driven by maximizing profit. </p>`
			}
		]
	},
	{
		layout: 'inline',
		panels: [],
		blocks: [
			{
				heading: 'Scaling a national network of local affordable grocers',
				body: `<p>Canada’s grocery industry needs competition to reduce prices, and neighbourhoods undergoing transit investment-induced change require intentional approaches to ensure access to healthy and affordable groceries.</p>
				<p>The development of transit neighbourhoods should benefit the communities that will inhabit them. The type of grocery stores we encourage and incentivize should responds to the needs left unmet by grocery oligopoly.</p>
				<p>Communities, when given the tools, will self-organize and implement initiatives to improve their quality of life. The role of governments should be to enable communities’ ability to help themselves by reducing financial, policy, and regulatory barriers. Whether in support of public grocers, food co-ops, or independent grocers, each level of government has levers to pull. </p>`
			},
			{
				eyebrow: 'Federal Government',
				heading: 'Wield the power of the purse',
				body: `<h6>Establish multi-jurisdictional agreements and transfer funding to develop nation building grocery infrastructure.</h6>
				<p>Developing the distribution infrastructure and sites for public grocers would require an up-front investment of $350 million. This is a modest cost considering the federal government’s intention to launch the Build Communities Strong Fund, a $51-billion, 10-year program.</p>
				<p>The distribution hubs—key regional economic development projects—could be leveraged by networks of public grocers, food co-ops, small stores, and independents, spread across transit neighbourhoods, and broader urban and rural areas, to combine buying power for high volume, accommodate space for stock, and compete with the grocery giants on price with suppliers. Savings will be passed on to consumers.</p>
				<p>Economies of scale and consistent demand, with a Buy Canada policy, would be a boon to Canadian businesses across local and national food industries of importance. </p>
				<p>The federal government has already demonstrated the ability to quickly navigate multi-jurisdictional agreements and budget transfers, such as the National School Food Program agreements with all provinces and territories. </p>`
			},
			{
				eyebrow: 'Provincial Governments',
				heading: 'Enable local competition in the grocery industry',
				body: `<h6>Eliminate property controls for grocery stores.</h6>
				<p>Property controls—restrictive covenants or exclusivity clauses—are deals made between landowners and retailers, in leases and property titles, to restrict the ability of competitors to operate or sell specific products on the same, adjacent, or nearby properties. </p>
				<p>This is a major barrier to opening new grocery stores operated by non-giant competitors. </p>
				<p>Leading the way on eliminating property controls in Canada, the Manitoba Government recently passed the Property Controls for Grocery Stores and Supermarkets Act in June 2025. By December 2025, <a href="https://news.gov.mb.ca/news/?item=71917" target="_blank"> 23 property controls were submitted for removal</a>.</p>`
			},
			{
				eyebrow: 'Transit Agencies',
				heading: 'Leverage site-specific opportunities',
				body: `<h6>Utilize joint development on transit agency lands.</h6>
				<p>Joint development, according to CATCH, is a policy and real estate strategy in which transit agencies partner with public, private, or non-profit developers to build housing and mixed-use projects on land they own or control. This can include stations, yards, parking lots, and air rights.</p>
				<p>Transit agencies can contribute underutilized land at below-market cost and require public-benefit outcomes as part of the development agreement. Public benefits, in addition affordable housing priorities, can include space for supportive, key amenities, such as food co-ops or public grocers. </p>`
			},
			{
				eyebrow: 'Municipalities',
				heading:
					'Enable the development of affordable grocers in priority neighbourhoods and transit station areas ',
				body: `<h6>For public grocers, prioritize their initial placement in neighbourhoods that need them the most.</h6>
				<p>While the introduction of affordable grocery alternatives over time will benefit all communities, as municipalities begin to pilot public grocery stores, they must be prioritized in areas with the lowest food access. These neighbourhoods will have lower-than-average household incomes and likely higher rates of racialized populations. These are also the same groups likely to be transit-dependent, and who would benefit the most from transit investment.</p>
				<h6>Reduce financial barriers for public grocers and food co-ops.</h6>
				<p>This can include waivers of property tax, development charges, and permitting fees to reduce development and operating costs. </p>
				<h6>Implement Community Improvement Plans to provide direct-to-business financial support to eligible food co-ops </h6>
				<p>Community Improvement Plans are a planning tool used by municipalities to provide direct-to-business financial supports, such as pre-development and development grants. These grants can be used for feasibility and market studies, construction, and renovation. The delineation of Community Improvement Plan areas can be drawn to include the overlap between transit station areas and underserved neighbourhoods.</p>`
			},
			{
				heading:
					'Facilitating the creation of public grocers and food co-ops isn’t about replacing corporate grocers.',
				body: '<p>It’s about introducing more choice to the benefit of Canadians, addressing market failures, reducing grocery prices, and getting our communities closer to securing their right to food. </p>'
			}
		]
	}
];
