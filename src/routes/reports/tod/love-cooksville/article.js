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
				id: 'cooksville'
			}
		],
		blocks: [
			{
				panelId: 'cooksville',
				heading: 'Love Cooksville',
				body: `<p>The Cooksville platform invited residents of this established Mississauga neighbourhood to share their perspectives on community priorities and 
				neighbourhood change. As a mixed-density area with growing commercial corridors, Cooksville offered a unique context for exploring how residents understand 
				and value the principles of complete communities, and what residential intensification 
				and transit-oriented development could mean for a neighbourhood already navigating growth pressures.</p>
				<p>To analyse the neighbourhood, we used natural language processing in combination with Environics Analytics Opticks Numeris data and posts queried from Reddit related to Cooksville and development. This allowed Digital Public Square to get an aggregate picture of people’s opinions around development intensification in Cooksville.</p>`
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
				id: 'safety',
				label: 'Figure 1 – Safety and welcome metrics by neighbourhood'
			}
		],
		blocks: [
			{
				panelId: 'safety',
				heading: 'Key Takeaway #1: Safety Issues',
				body: `<p>Respondents from Cooksville feel notably less safe and welcome than the
				other two neighbourhoods, with a near 25% difference in respondents who
				generally feel safe. Just over a quarter of respondents only sometimes feel safe, 2.5x
				higher than the other two neighbourhoods. Kitsilano and Northfield are
				comparable, with Kitsilano feeling slightly safer than Northfield.</p>`
			}
		]
	},
	{
		layout: 'scrolly',
		panels: [
			{
				id: 'cleanliness'
			}
		],
		blocks: [
			{
				panelId: 'cleanliness',
				heading: 'Key Takeaway #2: Cleanliness is a priority',
				body: `<p>Safety, cleanliness, and aesthetics— like greenery, parks, and cleanup— were all tightly linked in how
				residents evaluated their neighbourhood and were widely agreed upon. Conversely, discussions around transportation
				modes and infrastructure—i.e. cycling versus transit, density and development, and the perception of unhoused people were more
				polarizing topics.</p>`
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
				heading: 'Key Takeaway #3: Development, but only if it helps',
				body: `<p>Sentiments towards the benefits of densification were mixed both in
				the qualitative insights, and through quantitative insights. Respondents
				tend to express cautioned openness to densification or development if
				key issues were addressed first, such as infrastructure (public transit vs.
				roads vs. bike lanes), safety and cleanliness.</p>
				
				<p>Future work should explore trust-building to increase community
				confidence in the benefits that can come with transit-oriented
				development (TOD).</p>`
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
					href: 'https://lovecooksville.ca/',
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
				heading: 'What has Cooksville been saying about Cooksville?',
				body: `<p>Digital Public Square utilized an open source tool called pol.is, allowing for quick analysis of how people have been talking about development in Cooksville. Check out what people have been talking about:</p>`
			}
		]
	}
];
