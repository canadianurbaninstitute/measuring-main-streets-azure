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
				id: 'engagement',
				label: 'Figure 1 – Engagement metrics by neighbourhood'
			}
		],
		blocks: [
			{
				panelId: 'engagement',
				heading: 'Key Takeaway #1: High Engagement',
				body: `<p>Kitsilano saw the highest numbers across six key engagement metrics, including total of number of
				questions answered, respondents answering at least one question, link clicks to follow-on services, and those who opted in to share their postal codes. It also saw the highest community poll engagement.</p>`
			}
		]
	},
	{
		layout: 'scrolly',
		panels: [
			{
				id: 'walking',
				label: 'Figure 2 – Commute prefences'
			}
		],
		blocks: [
			{
				panelId: 'walking',
				heading: 'Key Takeaway #2: High Walking Preferences',
				body: `<p>Kitsilano was the only neighbourhood where a preference for
				walking was high across the board for all activities.</p>
				<p>
				However, cars are still strongly favoured, with 33.8% of respondents using their car for commutes.
				People are most likely to take the bus when going to work or school, most likely to be biking to get to
				their favourite activity, and most likely to be walking when going to the grocery store.</p>`
			}
		]
	},
	{
		layout: 'scrolly',
		panels: [
			{
				id: 'privacy',
				label: 'Figure 3 – Privacy preferences'
			}
		],
		blocks: [
			{
				panelId: 'privacy',
				heading: 'Key Takeaway #3: Privacy as Paramount',
				body: `<p>Though four out of seven tradeoff categories had a
				higher proportion of responses that favoured
				densification, such as home size, vibrant main
				streets, sidewalks, crossings and bike lanes, there
				was a strong preference towards prioritizing fewer
				neighbours and more privacy.
				This aligns with qualitative insights collected by the
				community poll and persona research, further
				underscoring the tension with building more homes
				in Kitsilano.</p>`
			}
		]
	},
	{
		layout: 'scrolly',
		panels: [
			{
				id: 'everyone'
			}
		],
		blocks: [
			{
				panelId: 'everyone',
				heading: 'Designing a city for everyone',
				body: `<p>Through this pilot experiment, it is demonstrably clear that digital tools can be a functionally efficient way to engage with local residents, particularly in capturing voices that may not typically surface through traditional community consultation. The inclusion of an open-text community poll alongside quantitative measures proved valuable in surfacing the root causes of anxieties around neighbourhood change, and in showing that residents are willing to engage meaningfully online, even with many competing online priorities.</p>
				<p>Moving forward, larger quantities of high-quality public engagement can be reached with a longer timespan of collection, more effective use of targeted ads across additional social media platforms, and coordinating digital engagement with traditional engagement methods like in-person consultations. These can all serve to further close the gap between the public's voice and collective action on the issues that matter most to local residents.</p>`,
				cta: {
					label: 'Explore the tool',
					href: 'https://lovekitsilano.ca/',
					target: '_blank'
				}
			}
		]
	},
	{
		layout: 'inline',
		panels: [
			{
				id: 'polis'
			}
		],
		blocks: [
			{
				panelId: 'polis',
				eyebrow: 'Appendix',
				heading: 'What has Kitsilano been saying about Kitsilano?',
				body: `<p>Digital Public Square utilized an open source tool called pol.is, allowing for quick analysis of how people have been talking about development in Kitsilano. Check out what people have been talking about:</p>`
			}
		]
	}
];
