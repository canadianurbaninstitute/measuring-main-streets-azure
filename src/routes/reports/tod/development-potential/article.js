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
					'Urban form maps. The built form of a transit station influences its development potential.',
				source: '<a href="tools/urban-form-maps" target="_blank">Urban Form Tool</a>'
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
					'NorQuest is an example of a station with low land availability and high growth pressure.',
				source: '<a href="/tools/development-potential" target="_blank">Development Potential Tool</a>'
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
			}]
	},
	{
panels:[{
	id: 'potential-scatter'
}],
blocks:[			{
				panelId: 'potential-scatter',
				body: `<p>The land availability indicators were selected to reflect the station area’s capacity for new housing development. 
                The growth pressure indicators were selected to reflect the station area's demand for new housing. 
                <b>The land availability and growth 
                pressure scores are averages of the station’s percentile rank for each set of indicators.</b>
                The station area refers to the 800m radius surrounding a station.
                </p><p>Land Availability and Growth Pressure are negatively correlated. Stations with high growth pressure generally have low land availability, and stations with high land availability generally have low growth pressure.</p>
				<p>We can break the land availability vs. growth pressure scatterplot up based on the median for each, and categorize each station as low or high land availability and growth pressure. From there, we can examine a station’s development potential based on its overall demand and capacity for new housing.</p>`
			},
			{
				heading: 'Identifying housing development potential in transit station areas',
				body: `<h3>Calgary</h3>
				<p>The most common scenario is low land availability and high growth pressure. There are 13 stations with high land availability and high growth pressure, including Chinook, Dalhousie, and Lions Park on the Red Line, and the planned Seton, 28 Avenue N, and 16 Avenue N stations on the Green Line.</p>`,
				props: {
					region: 'Calgary'
				}
			},
			{
				body: `<h3>Edmonton</h3>
				<p>The most common scenario is high land availability and low growth pressure. There are 3 stations with high land availability and high growth pressure: McKernan-Belgravia on the Capital Line, and NAIT/Blatchford Market and Kingsway RAH on the Metro line.</p>`,
				props: {
					region: 'Edmonton'
				}
			},
			{
				body: `<h3>Greater Golden Horseshoe</h3>
				<p>The most common scenario is low land availability and high growth pressure. There are 86 stations with high land availability and high growth pressure, including Oakwood on Line 5 Eglinton, Main Street on Line 2 Bloor-Danforth, and Milton on the Milton Line.</p>`,
				props: {
					region: 'Greater Golden Horseshoe'
				}
			},
			{
				body: `<h3>Greater Vancouver/Lower Mainland</h3>
				<p>The most common scenario is low land availability and high growth pressure. Stations in Greater Vancouver/Lower Mainland have the lowest average land availability and highest average growth pressure of all regions. There are 6 stations with high land availability and high growth pressure, including the under construction Willowbrook, Hillcrest-184 St, and 152 St stations on the Expo Line.</p>`,
				props: {
					region: 'Greater Vancouver/Lower Mainland'
				}
			},
			{
				body: `<h3>Montreal</h3>
				<p>The most common scenario is high land availability and low growth pressure. There are 5 stations with high land availability and high growth pressure, including Ahuntsic on Ligne Mascouche, Préfontaine on Ligne Verte, and Montmorency on Ligne Orange.</p>`,
				props: {
					region: 'Montreal'
				}
			},
			{
				body: `<h3>Ottawa-Gatineau</h3>
				<p>The most common scenario is high land availability and low growth pressure. There are 2 stations with high land availability and high growth pressure: Tunney’s Pasture on Line 1 Trim-Algonquin and Line 3 Trim-Moodie, and Corso Italia on Line 2 Bayview-Limebank.</p>`,
				props: {
					region: 'Ottawa-Gatineau'
				}
			},
			{
				body: `<h3>Ville de Québec</h3>
				<p>The most common scenario is high land availability and low growth pressure. There is 1 station with high land availability and high growth pressure: CHUL on the planned Quebec Tramway.</p>`,
				props: {
					region: 'Ville de Québec'
				}
			}
		]
	},
	{
		layout: 'inline',
		blocks: [
			{
				heading: 'Development potential by technology',
				body: `<p>Patterns in land availability and growth pressure differ by technology.</p>
				<p>The most common scenario for commuter stations is high land availability and low growth pressure, indicating more land capacity for new housing, but less demand for it. These stations are frequently found in suburban or urban fringe communities, where population growth is slower, population density is lower, and the station area is less built up. Examples of commuter stations with high land availability and low growth pressure include East Gwillimbury GO station, Acton GO station, and Vaudreuil station.</p>
				<p>In contrast, the most common scenario for subway stations is low land availability and high growth pressure, reflecting limited land capacity for new housing, but high demand for it. Subway stations like Bloor-Yonge station in Toronto, Granville station in Vancouver, and Berri-UQAM station in Montreal are located downtown, in areas that are densely populated, highly developed, and facing high growth pressure. Outside of downtowns, subway stations still frequently lie in older neighbourhoods where the station area has developed and built up over many years. As a result, subway stations such as Runnymede in Toronto, Langara-49th Avenue in Vancouver, and De Castelnau in Montreal, while not as centrally located, nevertheless have limited land capacity for new development.</p>
				<p>Though the most common scenario for LRT stations is high land availability and low growth pressure, their distribution across land availability-growth pressure categories is relatively balanced compared to commuter and subway stations. Additionally, LRT is the most common technology for high land availability, high growth pressure stations, with over half of these high-high stations found on LRT lines. Many of these high-high stations are on relatively new LRT lines in suburban areas, for example Ionview station in Toronto, Borden station in Kitchener, and Kingsway/Royal Alex station in Edmonton.</p>`
			}
		]
	},
	{
		layout: 'overlay',
		panels: [{ id: 'potential-map' }],
		blocks: [
			{
				heading: 'High Land Availability, High Growth Pressure',
				body: `<p>While low land availability, high growth pressure stations are typically found in downtown cores, and high land availability, low growth pressure stations can be found in suburban and urban fringe communities, stations with high land availability and high growth pressure vary more in their locations. Some are found in older, built-up neighbourhoods on established transit lines, while others are situated in suburban commercial areas or infill developments on new or planned lines. While varying in their characteristics, these stations have high demand for housing as well as the land capacity to develop it, making them ideal places to build new housing. These high land availability, high growth pressure stations often have existing development plans that recognize their potential. Here are some examples:</p>`
			},
			{
				heading: 'Calgary - Chinook',
				body: `<p>Chinook station on Calgary’s Red Line is located near the Chinook Centre shopping mall, south of the city’s downtown core. With a large amount of developable land and high-opportunity sites, as well as a relatively high level of growth pressure, the Chinook transit station area has high potential for housing development. Given its high employment density, the area is envisioned to continue developing as a regional employment centre.</p>`,
				props: {
					region: 'Calgary',
				}
			},
			{
				body: `
				<p>Plans for Chinook station’s surrounding area focus on transit-oriented development, creating mixed-use communities integrating walkable, connected public spaces, non-market housing opportunities, and higher growth focused within the transit station area. Preliminary plans for Chinook Centre include Midtown, a proposed development comprising 28 new buildings. The development would create up to 6,200 housing units near the LRT station, with potential for the creation of a new infill station nearby. Chinook station’s high employment density and land availability present an opportunity to further develop a mixed-use community near transit, expanding residential development alongside existing and future commercial development.</p>`,
				props: {
					region: 'Calgary',
					highlightIds: ['Chinook']
				}
			},
			{
				heading: 'Edmonton - NAIT/Blatchford Market',
				body: `<p>NAIT/Blatchford Market station, located near the Northern Alberta Institute of Technology (NAIT), is the current northern terminus of Edmonton’s Metro Line. The station’s high land availability can be attributed to its low population density and relatively high amounts of developable area and high opportunity sites. Paired with its high growth pressure, particularly its relatively high projected population growth, the NAIT/Blatchford Market station area has high potential for housing development.</p>`,
				props: {
					region: 'Edmonton'
				}
			},
			{
				body: `<p>Located near Edmonton’s former city centre airport, the station’s creation was prompted by plans for the development of the surrounding community of Blatchford. The decommissioned airport land is slated to redevelop into a mixed-use, mid-density urban infill community. Blatchford’s development is integrated with the planned expansion of the NAIT campus, including an Advanced Skills Centre and potential student housing, introducing the potential for shared facilities to serve both communities.</p>
				<p>Several hundred housing units in Blatchford have been completed or are under construction, with townhomes, purpose-built rentals, and affordable housing among the types of homes planned for the neighbourhood. Blatchford, intended to be home to up to 30,000 residents upon completion, is expected to be a key example of higher density, transit-oriented infill development in Edmonton’s suburban communities.</p>`,
				props: {
					region: 'Edmonton',
					highlightIds: ['NAIT Blatchford Market']
				}
			},
			{
				heading: 'Greater Golden Horseshoe - Mount Pleasant GO',
				body: `<p>The Mount Pleasant GO station on the Kitchener line is located in Brampton. The station’s land availability is very high, with low employment density and high levels of single-unit dwellings and developable land. With high past and projected population growth, Mount Pleasant’s potential for housing development is very high.</p>`,
				props: {
					region: 'Greater Golden Horseshoe'
				}
			},
			{
				body: `<p>Located in a Major Transit Station Area (MTSA), Mount Pleasant station’s surrounding area is shaped by the City of Brampton’s MTSA policy framework, which sets targets for mixed-use, higher density development. Early plans for Mount Pleasant Village, the station’s surrounding neighbourhood, aimed to demonstrate transit-oriented greenfield development, centering the new neighbourhood on transit and active transportation.</p>
				<p>While the current phase of Mount Pleasant Village incorporates aspects of transit-oriented development to meet these goals, there is continued potential for development in the station area. Proposals for Mount Pleasant include a mixed-use multi-tower development comprising over 2,000 residential units. With new GO stations and their surrounding communities undergoing the planning process, for example Innisfil station on the Barrie line, future growth of Mount Pleasant Village presents an opportunity for the neighbourhood to stand as an model of transit-oriented greenfield development.</p>`,
				props: {
					region: 'Greater Golden Horseshoe',
					highlightIds: ['298']
				}
			},
			{
				heading: 'Greater Vancouver/Lower Mainland - Willowbrook',
				body: `<p>The under-construction Willowbrook station lies on the Surrey-Langley SkyTrain Extension of the Expo line. Located in Langley Township, the station will be adjacent to the nearby Willowbrook Shopping Centre. While it does not face extreme growth pressure, its high level of developable land, high opportunity sites, and relatively lower population density lead to a high potential for housing development in the station area.</p>`,
				props: {
					region: 'Vancouver',
				}
			},{body: `
				<p>The area surrounding Willowbrook station is designated a Transit Oriented Area, prioritizing high-density, mixed-use development in the station vicinity. While the Willowbrook Community Plan is currently paused, the opportunity for development in the station area is apparent. Several high-rise towers with a total of up to 2,600 new homes have been proposed near the station. Although plans for the Willowbrook station area are not fixed, the forthcoming completion of the station indicates the need for a transit-oriented approach that will tap into the development potential and support the growth of the Willowbrook community.</p>`,
				props: {
					region: 'Vancouver',
					highlightIds: ['Willowbrook']
				}
			},
			{
				heading: 'Laval - Montmorency',
				body: `<p>Montmorency station, located in downtown Laval, is the northern terminus of Ligne Orange. It is located near Collège Montmorency and the location of Laval’s future central library and cultural centre. While Montmorency station does not face exceptionally high growth pressure, its relatively high land availability lends itself to high overall development potential.</p>`,
				props: {
					region: 'Montreal',
				}
			},{body:`
			<p>New developments in the area include U-Bahn, a condo building with over 300 units, and Espace Montmorency, a mixed-use building complex with more than 700 apartments, as well as commercial and office spaces. These new residential projects, along with the continued cultural development of the area, demonstrate the role of transit-oriented development in establishing the Montmorency area and downtown Laval as a whole.</p>`,
				props: {
					region: 'Montreal',
					highlightIds: ['486']
				}
			},
			{
				heading: 'Ottawa-Gatineau - Tunney’s Pasture',
				body: `<p>Tunney’s Pasture is a federal employment site west of the city’s downtown core. The Tunney’s Pasture LRT station, located on Ottawa’s Line 1 and future Line 3, serves the government building campus. With high projected population growth and the presence of complete community amenities that serve its federal workforce, the Tunney’s Pasture station area has very high potential for housing development.</p>`,
				props: {
					region: 'Ottawa-Gatineau',
				}
			},
			{body: `
				<p>The station’s surrounding area is subject to the Tunney’s Pasture Master Plan, an extensive redevelopment project, of which transit-oriented development is a key objective. The project includes plans to reduce office space, increase green space, and introduce 7,000 to 9,000 new housing units in order to urbanize the historically single-use employment centre.</p>
				<p>The area already contains several existing high-rises, including a mixed-use two-tower 32-storey complex, a mixed-use 31-storey building, and an 11-storey building near the station. Proposed developments for Tunney’s Pasture include a 40-storey mixed-use high-rise and a six-storey mid-rise, which would create 429 apartment units. These housing developments, along with other community-focused aspects of the Tunney’s Pasture Master Plan, present an opportunity to leverage a transit-oriented approach in transforming the federal office space into a mixed-use, urban neighbourhood.</p>`,
				props: {
					region: 'Ottawa-Gatineau',
					highlightIds: ['594']
				}
			}
		]
	},
	{
		layout: 'inline',
		blocks: [
			{
				heading: 'Conclusion',
				body: `<p>When it comes to building new transit stations, areas that are high in demand and land capacity for new housing are ideal places to do so. Whether they are located in greenfields, commercial areas, or employment centres, areas with high growth pressure and high land availability present unique opportunities to create transit-oriented developments that serve their residents.</p>
				<p>Our land availability and growth pressure scores are policy-independent measurements; they assess a station’s potential for housing development based on physical and land-use characteristics, rather than what is possible based on existing planning regulations. This policy-agnostic approach allows us to consider what may be possible if provinces and municipalities aligned policy to maximize home-building return on higher-order transit investments.</p>
				<p>Alongside the development of new housing, station areas require additional infrastructure to become livable, accessible neighbourhoods. These additional amenities are essential to creating a high quality of life in station areas, bringing them from transit-oriented developments to transit-oriented complete communities.</p>`,
				cta: {
					href: '/reports/tod/complete-communities',
					label: 'Learn more about Complete Communities'
				}
			},
			{
				body: `<p>By considering transit investments as housing investments, and ultimately as community-building investments, city-builders are well-positioned to design the vibrant, sustainable neighbourhoods enabled by the high potential of transit station areas.</p>`,
				cta: {
					href: '/tools/development-potential',
					label: 'Explore the Development Potential Tool'
				}
			}
		]
	}
];
