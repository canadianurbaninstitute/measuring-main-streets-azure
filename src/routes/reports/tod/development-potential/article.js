export const sections = [
	{
		panels: [
			{
				id: 'intro',
				label: 'Transit-oriented housing development looks different in different places.'
			}
		],
		blocks: [
			{
				panelId: 'intro',
				heading: 'Maximizing the impact of transit-oriented development',
				body: `<p>Transit investments spark housing construction, but not all the same way in all the same places.
                Demand for transit-oriented development varies from region to region, city to city, and even station to station across transit lines. 
                When new transit stations are planned, they may be placed where demand is greatest, in densely populated urban centres, or where land supply is
                high, with stations planned in conjunction with new transit-oriented communities.</p>`
			},
			{
				panelId: 'intro',
				body: `<p>However, <a href="https://measuringmainstreets.ca/reports/tod/intro" target="_blank">new transit stations do not universally guarantee a 
                return on housing</a>: new home construction in the three largest urban regions (Toronto, Montreal, Vancouver) mostly occurs close to major transit stations, 
                while new homes in the next three largest regions (Calgary, Edmonton, Ottawa) are built mostly outside of transit station areas.</p>`
			}
		]
	},
	{
		panels: [
			{
				id: 'intro2',
				label:
					'Urban form maps. The built form of a transit station influences its development potential.'
			}
		],
		blocks: [
			{
				panelId: 'intro2',
				heading: '',
				body: `<p>Given that investments in transit projects do not all result in the same potential for housing development, 
                <b>which transit stations do have the highest potential for housing and what do they have in common? Moreover, when new transit 
                stations are planned, where should they be placed to get the most return on housing?</b><br><br>
                This report examines land availability and 
                growth pressure in transit station areas to understand where capacity and demand for housing is greatest, assessing overall 
                potential for transit-oriented development across Canada’s higher-order transit stations.</p>`
			}
		]
	},
	{
		panels: [
			{
				id: 'intro3',
				label:
					'Indicator rankings from a station with low land availability and high growth pressure.'
			}
		],
		blocks: [
			{
				panelId: 'intro3',
				heading: 'Land Availability vs. Growth Pressure',
				body: `<p>To examine the housing development potential of each station area, we selected five land availability and 
                five growth pressure indicators to create a land availability and growth pressure score for each station.
                </p>`
			},
			{
				panelId: 'intro3',
				heading: '',
				body: `<p>These are the indicators:
                <br><br>
                <b>Land Availability</b>
                <ul style="list-style-type: square;">
                <li>Developable Area (Total Area - Water - Greenspace)</li>
                <li>High Opportunity Area (Surface Parking Area)</li>
                <li>Single Unit Residences</li>
                <li>Population Density</li>
                <li>Employment Density</li>
                </ul>
                <b>Growth Pressure</b>
                <ul style="list-style-type: square;">
                <li>Station Area Population Change, 2020-2025</li>
                <li>Station Area Population Change, 2025-2030</li>
                <li>Municipal Population Growth, 2020-2025</li>
                <li>Daily Visits</li>
                <li>Overall Complete Community Score</li>
                </ul>
                </p>`
			},
			{
				panelId: 'intro3',
				heading: '',
				body: `<p>The land availability indicators were selected to reflect the station area’s capacity for new housing development. 
                The growth pressure indicators were selected to reflect the station area's demand for new housing. 
                <br><br>
                <b>The land availability and growth 
                pressure scores are averages of the station’s percentile rank for each set of indicators.</b>
                <br><br>
                The station area refers to the 800m radius surrounding a station.
                </p>`
			}
		]
	}
];
