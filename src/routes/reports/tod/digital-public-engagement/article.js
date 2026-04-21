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
				body: `<p>The <em>Love Your Neighbourhood</em> tool meets residents where they are through tailoring content by awareness level to build understanding, surface genuine
                community priorities, and equip people with the knowledge and strategies to advocate for the neighbourhoods they want.</p>
				<p>The tool adapts to each resident's familiarity with complete communities, using factoid and narrative content to build awareness progressively.
                As understanding grows, norming content helps surface what residents truly value in their neighbourhoods, feeding directly into the program's goal of 
                collecting genuine community priorities. From there, residents are equipped with targeted advocacy strategies so they can champion the changes they want to see.</p>`
			}
		]
	}
];
