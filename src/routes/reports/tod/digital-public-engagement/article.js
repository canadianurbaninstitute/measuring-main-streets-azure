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
				id: 'persona'
			}
		],
		blocks: [
			{
				panelId: 'persona',
				heading: 'What is Persona Research?',
				body: `<p><em>Persona Research</em> is the process of collecting data about a specific group of interest, to create concise but fictional profiles of people. Commonly used in marketing and technology, they help teams empathize better with the group, align on goals and make evidence-based decisions. </p>
				<p>In <em>Love Your Neighbourhood</em>, personas were used to inform the design process of the community engagement tool. By collecting aggregate data of people and 
                analyzing it for trends or interesting themes, different archetypes of conversation participants can be created for each community. 
                These archetypes can then be used to more logically design a tool that the residents of Kitsilano, Northfield, and Cooksville can productively engage with.</p>`
			}
		]
	},
	{
		layout: 'scrolly',
		panels: [
			{
				id: 'creatingpersonas'
			}
		],
		blocks: [
			{
				panelId: 'creatingpersonas',
				heading: 'How Digital Public Square created their personas',
				body: `<p>Social media conversations were collected in online communities used in each of the three
                case-study locations to create resident personas and better-understand the audiences we were intending to reach. 
                Posts, comments, and public conversations were collected from Reddit, Facebook, Instagram, X, Bluesky, LinkedIn, Blogs and other forums. </p>
				<p>This text data was then mined by Natural Language Processing models, where topics, conflicts, and general sentiment were uncovered. Environics Analytics’ 
                Opticks data added further context in demographic and online behaviour context. </p>`
			}
		]
	},
	{
		layout: 'scrolly',
		panels: [
			{
				id: 'design'
			}
		],
		blocks: [
			{
				panelId: 'design',
				heading: 'Creating the Design',
				body: `<p>The <em>Love Your Neighbourhood</em> provides an online experience where people can learn how their neighbourhoods are changing and share their perspectives on what they value in those changes. It uses interactive prompts to surface how residents think about tradeoffs and priorities and offers opportunities to explore topics in more or less depth depending on interest.</p>
				<p>The experience introduces themes related to transit-oriented development, complete communities, and neighbourhood change—such as housing, mobility, and public space—and allows users to reflect on and compare different possible futures. It supports the expression of preferences, tradeoffs, and ideas for what they would like to see in their communities.</p>`
			}
		]
	}
];
