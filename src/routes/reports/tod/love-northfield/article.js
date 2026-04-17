/**
 * article.js - Love Northfield Report Data
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
				id: 'northfield'
			}
		],
		blocks: [
			{
				panelId: 'northfield',
				heading: 'Love Northfield',
				body: `<p>The Northfield platform invited residents of this primarily industrial Kitchener-Waterloo neighbourhood to share their perspectives on community priorities and neighbourhood change. As a transitional area balancing residential character with emerging development potential, Northfield offered a unique context for exploring how residents understand and value the principles of complete communities, and what residential intensification and transit-oriented development could mean for a neighbourhood already navigating growth pressures.</p>
				<p>
				To analyse the neighbourhood, we used natural language processing in combination with Environics Analytics Opticks Numeris data and posts queried from Reddit related to Northfield and development. This allowed Digital Public Square to get an aggregate picture of people’s opinions around development intensification in Northfield.</p>`
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
				id: 'tradeoffs',
				label: 'Figure 1 – Densification vs Individuality tradeoffs'
			}
		],
		blocks: [
			{
				panelId: 'tradeoffs',
				heading: 'Key Takeaway #1: Densification Supported, but Trade‑offs Unclear',
				body: `<p>Responses to tradeoff questions from Northfield point to diverse, vibrant neighbourhoods. This, with qualitative sentiments that indicate support for walkability and mixed-use environments, indicates Northfield may be most open to densification when compared to the other two study areas.</p><p>The consensus for a more walkable, mixed-use neighbourhood does suggest future engagement may need to focus on raising awareness about the tradeoffs that come with TOD.</p>`
			}
		]
	},
	{
		layout: 'scrolly',
		panels: [
			{
				id: 'cars',
				label: 'Figure 2 – Commute prefences'
			}
		],
		blocks: [
			{
				panelId: 'cars',
				heading: 'Key Takeaway #2: Cars Still Dominate Daily Travel',
				body: `<p>Cars are the most used method to commute in Cooksville and Northfield; however, for leisure activities, notably lower numbers opt for biking or walking instead. </p>
				<p>
				Respondents are most likely to take the bus when commuting to work or school, and are most likely to walk when going to their favourite activity.</p>`
			}
		]
	},
	{
		layout: 'scrolly',
		panels: [
			{
				id: 'functionality'
			}
		],
		blocks: [
			{
				panelId: 'functionality',
				heading: 'Key Takeaway #3: Demand for Density, Without Losing Functionality',
				body: `<p>Key themes that emerged in the Community Poll
				urged for walkability and mixed—use environments,
				particularly emphasizing the need for more local
				shops and group floor retailers with housing above.
				There was also a strong emphasis on transit
				improvements
				</p><p>Clear tensions in discourse
				around cars vs. bikes. vs. transit. Bike infrastructure
			 was highly polarized, with one group opposing the
			 replacement of car lanes with bike lanes, and the
				other calling for winter maintenance of cycling
			 infrastructure.</p>`
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
					href: 'https://lovenorthfield.ca/',
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
				heading: 'What has Northfield been saying about Northfield?',
				body: `<p>Digital Public Square utilized an open source tool called pol.is, allowing for quick analysis of how people have been talking about development in Northfield. Check out what people have been talking about:</p>`
			}
		]
	}
];
