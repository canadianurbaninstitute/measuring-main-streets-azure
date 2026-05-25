/**
 * article.js
 *
 * Data shape
 * ──────────
 * Each section has:
 *   panels   {Panel[]}  — one or more visualization panels for this section.
 *                         Each panel has a unique `id` scoped to the section,
 *                         plus either a `component` key or an `image` key
 *                         (resolved in +page.svelte).
 *   blocks   {Block[]}  — text steps. Each block may set `panelId` to switch
 *                         to a specific panel mid-section. If omitted, the
 *                         first panel in the section is shown.
 *
 * Panel shape:
 *   id        {string}  — unique within the section (e.g. 'chart', 'map-2')
 *   label     {string}  — accessible caption shown below the panel (optional)
 *
 *   One of:
 *   component {string}  — key into the visComponents map in +page.svelte
 *   image     {object}  — { src, alt, caption?, fit? } — rendered by VisImage
 *
 * Block shape:
 *   panelId   {string}  — which panel to show (defaults to panels[0].id)
 *   eyebrow   {string}  — optional small label
 *   heading   {string}  — optional heading
 *   body      {string}  — HTML string (supports <p> <strong> <em> etc.)
 */

export const sections = [
	{
		layout: 'inline',
		panels: [{ id: 'amenity-tiers', label: 'Figure 1 — List of core and additional amenities' }],
		blocks: [
			{
				heading: 'Identifying Community Amenities',
				body: `
        <p>With rapidly growing population in Canada’s largest urban regions there is a need for housing supply with a focus of sustainable development. Higher-Ordered public transit is vital to maintaining growth as these regions continue to expand and are a driver of housing development and intensification. In Canada’s six largest municipalities, areas within 800 metres of a transit station gained 499,000 housing units from 2001 to 2021, compared to 470,000 outside 800 metres with these areas only making up 8 percent of total land area across these six municipalities.</p>`
			},
			{
				body: `<p>With a focus on intensification in these regions due to growing demand. The concept of complete communities in a Canadian planning context has become more relevant. A recent study that reviewed 102 different planning and policy documents from 1975-2023 across different sized cities found mention of completed communities in 81% of documents (Grant, 2024). While the specific details of what produces a complete community varied to some degree, the concept of a complete community was used as an overarching concept for high-density growth with the ability for residents of all ages to reach needed amenities and services with an emphasis on active transportation.</p><p>Using national business data we have created two tiers of amenities: core and additional. Core amenities are necessary to a complete community while the 26 additional amenities improve overall quality of life but aren’t as important. With this report's focus on complete communities in Transit Station Areas, we primarily focus on core amenities within an 800-metre buffer around the transit station, the equivalent of a 10-15 minute walk.</p>
        <p>In the context of Transit Station Areas (TSAs), complete communities can work as a way to drive intensification through a lens of sustainable development. However, not all transit stations areas have executed on this relationship.</p>`,
				panelId: 'amenity-tiers'
			}
		]
	},
	{
		panels: [
			{
				id: 'access-scatter',
				label: 'Figure 2 — Core Amenity Access vs Population Density'
			},
			{ id: 'amenity-map' }
		],
		blocks: [
			{
				body: `<p>This chart provides a picture of access to core amenities compared to the current population within a TSA adjusted to the regional median. Stations that exist in the bottom-left quadrant have low levels of access in addition to low population while stations in the upper right exhibit the opposite, high access along with high population.</p>`
			},
			{
				body: `<p>When compared across all transit regions, clear patterns begin to emerge. One is the relationship between access and density itself. While the overall slope of this patterns varies, generally as the total population increases so to does the access to core amenities. This illustrates the an overall benefit of complete communities and transit being a driving force for residential density. While a “chicken and egg” pattern exists between completeness and density they are mutually reinforcing constructs. Added density can make economic development from a business perspective more attractive or conversely, a community with access to amenities is attractive for residential development.</p>`,
				props: { region: 'All' }
			},
			{
				body: `<p>Where these stations exist within their urban region is also telling. In regions such as Montreal, Vancouver, Ottawa and the Greater Golden Horseshoe, stations in the top-right exist within the regions most urbanized areas, the downtown core or just outside, and stations such as <strong>Union, Mont-Royal, Rideau and Vancouver City Centre</strong> reflect this. Stations in the bottom left exist in suburban or urban fringes of these regions (<strong>Letrim, Limebank, Templeton</strong>) with stations in the GGH and Montreal being regional commuter rail stations (<strong>Malton, Old Elm, Mascouche</strong>).</p>`,
				props: {
					highlightIds: ['381', '476', '598', '714', '602', '584', '713', '544', '271', '311'],
					region: 'All'
				}
			},
			{
				body: `<p>In Calgary and Edmonton the urban form of these regions is different, where large amount of available land has given way to urban expansion rather than residential intensification. As a result suburban stations exist at both extremes of this chart with most stations in the urban core around the regional median.</p>`,
				props: { region: ['Calgary', 'Edmonton'] }
			},
			{
				body: `<p>This chart can also be used to identify stations where residential or core amenity investment can occur. Stations in the top-left quadrant have relatively high access to core amenities but are below average in residential population. Places like <strong>Port Coquitlam, Guelph, Rundle, and Saint Lambert</strong> could support housing development without having access fall below the regional median. On the other hand, stations in the bottom-right quadrant, are relatively denser areas where additional investment into core amenities would provide the most value, such as <strong>Duncanwoods Station</strong> on the new Finch West LRT.</p>`,
				props: { region: 'All', highlightIds: ['191', '227', '699', '56', '531'] }
			}
		]
	},
	{
		layout: 'inline',
		panels: [
			{
				id: 'amenity-map',
				label: 'Figure 3 — Amenity Access vs Population Density by Transit Region'
			}
		],
		blocks: [
			{
				panelId: 'amenity-map',
				body: `<p>Explore the map below to see the distribution of amenities vs population in different transit regions.</p>`
			}
		]
	},
	{
		panels: [
			{
				id: 'access-scatter-additional',
				label: 'Figure 4 — Additional Amenity Access vs Population Density'
			}
		],
		blocks: [
			{
				heading: 'Additional Amenities Access',
				body: `<p>A similar chart for additional amenities reflects a similar pattern of regions like Montreal, Vancouver, Ottawa and the Greater Golden Horseshoe as stations in the top-right and bottom-left seem to move further away from each other. For regions like Calgary and Edmonton and even suburban station in the four previous regions the vertical stretch along the left-side of the chart is very apparent as these stations either have lots of additional amenities or none at all. The stations with high access to additional amenities along the y-axis seem to be station connected to a regional shopping centre such as <strong>Yorkdale, Southgate, and Chinook stations</strong>.</p>`
			}
		]
	},
	{
		panels: [
			{
				id: 'missing-infrastructure',
				label: 'Figure 5 — Core Amenity Status in TSAs by Type'
			}
		],
		blocks: [
			{
				heading: 'What Infrastructure is Missing?',
				body: `<p>With the understanding that higher population density leads to better access to core amenities around Transit Stations Areas, we can now look at what amenities are more commonly found compared to others.</p>
        <p>This chart show the amenity status across all stations for each type of core amenity. The most significant finding is the lack of larger civic infrastructure such <strong>Libraries and Community Centres</strong>. These types of civic infrastructure are absent in 60 and 57 percent of TSAs respectively, while more market based amenities that take up a smaller footprint (Physician Offices, Convenience Stores, Banks, Supermarkets, Childcare, and Pharmacies) are far more likely which Pharmacies being the most present with only 14 percent of TSAs not having at least one.</p>`
			}
		]
	},
	{
		panels: [
			{
				id: 'civic-infrastructure',
				label: 'Figure 6 — Library and Community Center Status compared to TSA Population'
			}
		],
		blocks: [
			{
				body: `<p>When classifying stations that have neither, versus one of a Community Center or Library, versus both, we again see the benefits of density factoring into the presence of these civic infrastructure pieces with station areas that have both being far more dense regardless of transit region.</p>`
			}
		]
	},
	{
		layout: 'inline',
		panels: [
			{
				id: 'library-map',
				label: 'Figure 7 — Library and Community Center Status by Transit Station Area'
			}
		],
		blocks: [
			{
				body: `<p>The map below shows the location and amenity status of each TSA similar as the location of libraries and community centers. In downtowns and more dense areas of these regions we can see a clustering of these amenities with even a single amenity being able to serve multiple Transit Station Areas at a time. Contrast that to suburban areas where the coverage of these amenities is much more spread out with many stations having no access to these places on foot and needing to take another mode of transportation.</p><p>This separating of uses is due to planning policies formed around post world war two ‘suburbanization’ in many north american cities. As cities began to expand outward, planning decisions were made to separate commercial land uses from residential, as residents were looking for an alternative to the crowded city centre (Centre for Urban Growth and Renewal, 2012). The result, has been an over reliance on cars and transport related inequality as people without a car are experiencing longer travel times or the inability to access services altogether acting as the inverse to the complete community concept all together.</p>`,
				panelId: 'library-map'
			}
		]
	},
	{
		layout: 'inline',
		panels: [
			{
				id: 'future-stations',
				label: 'Figure 8 — Future Development Potential by Transit Station Area'
			}
		],
		blocks: [
			{
				panelId: 'future-stations',
				heading: 'How can Transit Agencies and Municipalities do this going forward?',
				body: `<p>Transit-oriented development can be the great equalizer against transport inequality by giving a larger number of residents access to fast and reliable dedicated transit. Intensification around existing transit station is already happening and will continue with 277 future higher-order transit stations being planned or under construction making these regions more connected than ever before. However, if our land use policies around these transit stations do not change, transit station areas will get busier, but not better.</p>`
			},
			{
				body: `<p>This is where a shift in policy from <strong>transit-oriented development (TOD)</strong> to <strong>transit-oriented complete communities (TOCC)</strong> is needed. Future transit stations are already in amenity debt for the existing population and that is before any future residential intensification that a new transit station will inevitably bring. Looking at future transit stations across all five regions currently, in order to meet the median access for core amenities, these stations alone would need to add roughly 60,000 core amenity employees.</p>`
			}
		]
	},
	{
		layout: 'inline',
		panels: [
			{
				id: 'development-potential',
				label: 'Figure 9 — Future Development Potential Case Studies'
			},
			{
				id: 'amenity-needs-summary',
				label: 'Figure 10 — Overall Employee Needs by Amenity Type'
			}
		],
		blocks: [
			{
				panelId: 'development-potential',
				body: `<p>Of course the demands of growth will not be same everywhere, but stations, existing and planned, that fill a unique set of characteristics where intensification around stations can make the most impact should be focused on. Using the <a href="/tools/development-potential">Canadian Urban Institute housing development potential tool</a>, we look at five stations that have been identified as excellent candidates for future development based on their local growth pressures and land availability:</p>
				<ul>
				<li>Mount Pleast GO (Greater Golden Horseshoe)</li>
<li>Chinook (Calgary)</li>
<li>Tunneys Pasture (Ottawa)</li>
<li>Willowbrook (Greater Vancounver / Lower Mainland)</li>
<li>NAIT Blatchford Market (Edmonton)</li></ul><br/>`,
				body: `<p>Using the <a href="/tools/complete-communities">Complete Community Tool</a>, we took the current outlook of access and added an additional 10,000 residents to each TSA to gauge a hypothetical scenario of residential intensification. While the count of core employees needed varied investment was needed across all station areas. Tunney’s Pasture and Chinook were the best performing as Tunney’s Pastures had all core amenities except for a Community Centre, while for Chinook investments in Childcare and Grocery Stores, as well as a new Library would create the greatest impact. Willowbrook had 6 of 9 core amenities, missing a Physicians Office, Community Centre and Library, with needed investment in Childcare, and Schools. Mount Pleasant GO and NAIT Blatchford Market were the worst performing needing between 338 - 795 and 631 - 1256 core amenity employees respectfully. For Mount Pleasant 8 of 9 amenities (except for a Library) would be significantly below the regional median, and 9 of 9 would be below for NAIT Blatchford Market with the biggest needs in Libraries, Schools, Banking, Physicians Offices and Grocery Stores.</p>`
			},
			{
				panelId: 'amenity-needs-summary',
				body: `<p>On an amenity basis the three core amenities where the most investment would be needed across all stations would be Libraries, Primary and Secondary Schools, and Grocery Stores.</p>`
			}
		]
	},
	{
		layout: 'inline',
		panels: [],
		blocks: [
			{
				heading: 'Conclusion and Recommendations',
				body: `<p>In conclusion, Canada’s largest regions face a number of challenges related to housing and affordability. The combination of higher ordered transit investment in combination with residential intensification can address these challenges by increasing supply while lower transportation costs through the promotion of public and active transportation. However, if these places do not have the core amenities people utilize on a daily basis, we will reinforce old patterns of separated land uses and reliance of other modes of transport increase costs and transit inequality. It is why an overall shift from <strong>transit-oriented development</strong> to <strong>transit-oriented complete communities</strong> is vital to fully realize the economic, environmental and equity benefits of these new communities.</p>`
			},
			{
				body: `<h3>Coordinated Planning</h3><br/><p>Long before a transit station is being constructed, coordination between the agency responsible for the transit infrastructure, often the provincial government, and municipal planning staff is vital. This coordination is relevant in two stages. First is land acquisition which should be done as early as possible to keep land speculation low. Additional tools should be given to municipalities to acquire land in TSAs for the purpose of housing and community infrastructure such as bigger civic amenities such as libraries, community centers, grocery stores, etc. In suburban stations, underutilized areas such as underdeveloped or station parking lots should also be a point of intensification within the TSA. Secondly, is a coordinated zoning strategy to make sure enough land is left for core and additional amenities to match future residential population.</p>`
			},
			{
				body: `<h3>Establishing Good First-Last Mile Connections</h3><br/><p>Complete Communities around Transit Station Areas will not be achieved if the first-last mile connection to these amenities are not safe and/or pleasant for active mode of transport and for residents of all ages and ability. What can be is dependant of the exisiting built environment, however elements such as sidewalk widths and quality, street furniture, accessibility infrastructure and more can improve these connections. <a href="/reports/tod/walkability">Explore our walkability report for more information</a>.</p>`
			},
			{
				body: `<h3>Proper Communication of Complete Community Benefits</h3><br/><p>For existing stations NIMBYism can be the driving force against new infrastructure and residential intensification. This study showed that greater population densities lead to better access to core and additional amenities within the Transit Station Area. With this in mind the benefits of density should be properly communicated to existing and new residents throughout the planning and public engagement process, with the discourse being more focused around what residents can look forward to with transit-oriented complete communities rather than debating whether the development should take place at all.</p>`
			}
		]
	}
];
