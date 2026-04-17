export const sections = [
	{
		panels: [
			{
				id: 'gmstudyarea',
				label: 'Figure 1 — Golden Mile Study Area.'
			},
			{
				id: 'gmbuildings',
				label: 'Figure 2 — Proposed, approved, and existing, buildings on the Golden Mile.'
			}
		],
		blocks: [
			{
				panelIds: ['gmstudyarea'],
				heading: 'Ground Floor on the Golden Mile',
				body: `<p>Ground floors are where cities happen. They are the interface between
                buildings and the public realm, shaping how people move, gather, shop,
                and connect in their daily lives. They function as the social and economic
                infrastructure of neighbourhoods by supporting walkability, hosting locally owned businesses, and fostering a sense of place. 
                <br><br>
                Across the Greater Toronto Area (GTA), major transit investments are reshaping urban corridors at a pace and scale not seen in generations.
                However, density alone does not guarantee a community. Transit-oriented developments (TODs) have too often delivered on housing targets while
                falling short of creating the vibrant, inclusive, and socially cohesive environments that planning policy promises. The result is a recurring pattern:
                oversized retail units, inactive frontages, and a dominance of chain tenants that limit adaptability, local economic diversity, and community life.
                <br><br>
                This project responds to that gap by asking a central question: How can ground floors in newly densified, transit-oriented communities be designed
                and governed to support vibrant, inclusive, and resilient neighbourhoods? Without deliberate intervention, the Scarborough Golden Mile risks
                becoming a dense corridor void of the conditions for complete communities.</p>`
			},
			{
				panelIds: ['gmbuildings'],
				body: `<p><b>The Scarborough Golden Mile provides a critical test case.</b> Once a postwar
                industrial and auto-oriented retail corridor, the Golden Mile is being transformed into a high-density, transit-served district anchored by the
                Eglinton Crosstown LRT (Line 5). The City’s Golden Mile Secondary Plan envisions approximately 24,000 new residential units, 43,000 residents,
                and 19,500 jobs across 113 hectares, effectively building a new community from the ground up.</p>`
			},
			{
				body: `<p>While the plan establishes ambitious growth targets, it
                offers limited direction on how ground floors will be designed, programmed, and governed. 
				<br><br>
				<b>This creates both a risk and a rare opportunity:</b> to shape the 
                everyday life of a neighbourhood before it fully exists.</p>`
			}
		]
	},
	{
		panels: [
			{
				id: 'reimagining',
				label: 'Figure 3a — Key assets to Golden Mile redesign.'
			},
			{
				id: 'macro',
				label:
					'Figure 3b — Possible locations and walkable distances for new community assets in the Golden Mile.'
			}
		],
		blocks: [
			{
				panelIds: ['reimagining', 'macro'],
				heading: 'Reimagining the Golden Mile',
				body: `<p>
                In response, our team developed a practitioner-oriented Guidebook in partnership with the Canadian Urban Institute (CUI). The Guidebook
                proposes an integrated approach that combines ground-floor design strategies with a local governance model to ensure that these spaces
                are active, adaptable, and community-serving over time. 
                <br><br>
                Design recommendations are organized across macro, meso, and micro scales,
                emphasizing fine-grained frontages, flexible spatial configurations, and strong connections to transit and the public realm. Complementing this,
                we propose the Golden Mile Stewardship District (GMSD), a sub-municipal governance model that coordinates public-realm activation, supports local
                and newcomer-owned businesses, and sustains community infrastructure through tools partnerships and community benefits agreements.
                </p>`
			},
			{
				body: `<p>Our work draws on an eight-month research process combining spatial analysis, demographic forecasting, comparative case studies, policy review,
                and ongoing engagement with CUI. We examined local and international precedents; from Toronto's high-density neighbourhoods to cities such
                as New York, London, Amsterdam, and Barcelona, to identify transferable strategies and avoid well-documented pitfalls.
                <br><br>
                <b>This Guidebook is a practical decision-support tool</b> for planners, developers, policymakers, and community organizations involved in the Golden Mile's
                redevelopment, and a broader framework for other rapidly densifying GTA corridors. Its core argument is simple: getting the ground floor right is essential to getting the community right. The Golden Mile represents a rare,
                time-sensitive opportunity to align density with livability and a chance to set a new standard for transit-oriented, complete-community development.</p>`,
				cta: {
					href: 'https://canurb.org/wp-content/uploads/MUCP-x-CUI-Guidebook.pdf',
					label: 'Read the full Guidebook'
				}
			}
		]
	}
];
