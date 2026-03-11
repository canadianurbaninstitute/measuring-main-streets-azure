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
			{ id: 'urban-pop-growth', label: 'Urban Population Growth' },
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
		panels: [{ id: 'test-panel', label: 'Test Panel' }],
		blocks: [
			{
				panelId: 'test-panel',
				body: `Does this show up`
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
