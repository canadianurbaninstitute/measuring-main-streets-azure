/**
 * article.js
 *
 * Defines the article's narrative structure.
 *
 * Each "section" has:
 *   visId   {string}   — which visualization panel to show (matches panels[].id)
 *   blocks  {Block[]}  — one or more text blocks tied to this visualization
 *
 * Each "block" has:
 *   eyebrow  {string}  — optional small label
 *   heading  {string}  — optional section heading
 *   body     {string}  — HTML string rendered via {@html}
 *                        Supports: <p> <strong> <em> <a> <ul> <ol> <li>
 *                                  <blockquote> <small> <hr>
 *
 * Alternatively, omit `body` and pass children via the default slot in
 * +page.svelte for full Svelte component flexibility.
 *
 */

export const sections = [
	{
		panels: [
			{
				id: 'urban-pop',
				label: 'The growth of Canada’s largest cities, continued?'
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
			{ id: 'urban-pop-growth', label: 'Urboan Population Growth' },
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
			},
			{
				panelId: 'test-image',
				body: `Test image panel.`
			},
			{
				panelId: 'test-image',
				body: `Test image panel 2.`
			}
		]
	},
	{
		panels: [
			{ id: 'urban-pop-growth1', label: 'Next Section' },
			{ id: 'test-image1', label: 'Another Section' }
		],
		blocks: [
			{
				panelId: 'urban-pop-growth1',
				heading: 'Test section',
				body: `Test section`
			},
			{
				panelId: 'test-image1',
				heading: 'Test Panel',
				body: `Test image panel 3.`
			},
			{
				panelId: 'test-image1',
				body: `Test image panel 4.`
			},
			{
				panelId: 'test-image1',
				body: `Test image panel 5.`
			}
		]
	}
];
