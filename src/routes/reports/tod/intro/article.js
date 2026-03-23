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
		panels: [
			{
				id: 'urban-pop',
				label: 'Figure 1 – Six ‘transit regions’ share of Canadian population',
				source: 'Statistics Canada. Table 17-10-0148-01  Population estimates, July 1, by census metropolitan area and census agglomeration, 2021 boundaries'
			}
		],
		blocks: [
			{
				eyebrow: '',
				heading: 'The growth of Canada’s largest cities, continued?',
				body: `Canada’s largest metropolitan Regions (Toronto, Montreal, Vancouver, Calgary, Edmonton, and Ottawa) account for xx% of the Canadian population.`
			}
		]
	},
	{
		panels: [
			{ id: 'urban-pop-growth', label: 'Figure 2 – Population growth by region size', source: 'Statistics Canada. Table 17-10-0148-01  Population estimates, July 1, by census metropolitan area and census agglomeration, 2021 boundaries' },
			{ id: 'test-image', label: 'Test Image' }
		],
		blocks: [
			{
				panelId: 'urban-pop-growth',
				body: `<b>These regions are also growing at a faster rate with xx households on average added each year between 2001 and 2025.</b> 
				This is due primarily to job growth and immigration. The housing crisis in Canada by many measures is most acute in the largest cities.
				 Polices at the federal, provincial, and municipal levels need to be sensitive to the structural differences between localities when crafting 
				policies and making infrastructure investments. Building higher order public transit is one of the most impactful measures governments are making 
				that directly addresses the housing shortages in Canada’s largest cities. Investments in public transit are about much more than transportation,
				 they are foundational investments in city building.`
			}
		]
	},
	{
		panels: [{ id: 'urban-economy', label: 'Figure 3 – Growth in goods producing and servicing producing sectors.', source: 'Statistics Canada. Table 14-10-0355-01  Employment by industry, monthly, seasonally adjusted and unadjusted, and trend-cycle, last 5 months (x 1,000)' }],
		blocks: [
			{
				panelId: 'urban-economy',
				heading: 'Canada’s urban economy',
				body: `Job growth has been one of the main drivers of population growth in Canada’s urban regions. The six transit regions have added 2.6 million jobs since 2011 representing 2 out of every 3 net new jobs in the country. This runs counter to the long-standing popular narrative that Canada’s economic engine is driven by the natural resource sector.  While goods production (i.e. agriculture, natural resources, manufacturing) do account for a much larger share of exports, they account for far fewer direct jobs. Over the past 50 years job creation in goods producing sectors has been largely flat, adding only 900 thousand positions. That is in stark contrast with service producing sectors which have added over 10 million jobs over the same time-period. Service industries are mainly dependent not only on people, but on the relationships between them. Despite advances in digital communications technologies, operating in close physical proximity still offers significant advantages. The key point is that service sector job growth skews towards the largest urban areas, and even more specifically, towards the downtowns of big cities.`
			}
		]
	},
	{
		panels: [
			{ id: 'gateway', label: 'Figure 4 – Share of immigration by geography 2001-2025' },
		],
		blocks: [
			{
				panelId: 'gateway',
				heading: 'Gateway cities',
				body: `The other main driver of population growth is immigration. The six largest urban regions are home to three quarters of all immigrants in Canada. While people tend to be drawn to economic opportunities, newcomers also seek out communities that provide social and cultural supports. Over the past few decades, there has been a self-reinforcing cycle of more jobs, attracting more people, which in turn attract more jobs, resulting in the largest Canadian cities  growing at a faster rate than the rest of the country.`
			}
		]
	},
	{
		panels: [
			{ id: 'housing', label: 'Figure 5 – Housing affordability in the largest CMAs', source: `<a href="https://www.cmhc-schl.gc.ca/observer/2026/beyond-toronto-vancouver-affordability-challenges-spread-across-canadian-cities" target="_blank">https://www.cmhc-schl.gc.ca/observer/2026/beyond-toronto-vancouver-affordability-challenges-spread-across-canadian-cities</a>` }
		],
		blocks: [
			{
				panelId: 'housing',
				heading: 'The need for housing in Canada’s largest urban regions',
				body: `To meet the needs of a growing population, the Canada Housing and Mortgage Corporation projects that Canada needs to almost double its annual housing production to 480,000 new homes per year over the next decade to make housing affordable for Canadians.  The need is experienced most acutely in Canada’s largest cities and regions. For example, to meet these national targets, Toronto  needs to increase annual housing starts by 71%, Montreal by over 200%, Calgary by 45% and Ottawa/Gatineau by 155%.  In total, just over 50% of the required housing is in Canada’s largest six metropolitan areas.  The CMHC predicts that demand for housing and housing prices will continue to increase at a higher rate in those places for the foreseeable future. `
			}
		]
	},
	{
		panels: [
			{ id: 'transit', label: 'Figure 6 – Commute times in the largest urban regions' }
		],
		blocks: [
			{
				panelId: 'transit',
				heading: 'The need for higher order public transit in Canada’s largest urban regions',
				body: `Investments in public transit are vital to maintaining growth in the largest urban regions. As demand rises for land it becomes more valuable, putting upward pressures on costs. In this scenario, housing projects can quickly become unviable. Building at higher densities can help overcome this obstacle, but as large cities grow in this manner, they become harder to move through. Friction of movement simultaneously reduces cities’ economic advantage and diminishes quality of life. The Toronto Region Board of Trade  estimates that congestion in the Greater Toronto and Hamilton Region is costing the economy $44B per year. Investments in public transit infrastructure is the most effective solution to these problems. They improve mobility and quality of life which are reflected in associated land values which in turn attracts further private sector investment in housing construction. If it becomes too difficult to move through cities, people tend to start moving out of them.`
			},
			{
				panelId: 'transit',
				body: 'There are six regions with higher order public transit infrastructure with a seventh in planning stages (Quebec). In these six regions there are xx LRT lines, xx subway/metro lines, and xx commuter rail lines. There are xx LRT lines under construction with an additional xx in the planning stages. There is one subway line under construction as well as a range of additions and upgrades to commuter rail. In total there are xx higher order transit stations with an additional xx under construction or in the planning stages. Xx million people currently live with 800m of a higher order transit station. '
			}
		]
	}
];
