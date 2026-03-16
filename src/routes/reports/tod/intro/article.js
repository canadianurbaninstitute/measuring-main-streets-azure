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
				heading: 'Test Panel',
				body: `<b>Does this show up</b><br><br>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer consequat consectetur hendrerit. Morbi dui odio, 
				mattis et tortor non, interdum dapibus leo. Cras eu neque velit. Sed sagittis mauris ex, finibus sagittis ex elementum ut.
				Pellentesque at magna eget nibh lobortis aliquam. Sed eu ligula gravida, vulputate nulla nec, tincidunt purus. Nulla a bibendum mauris. 
				Donec facilisis, sapien sed pretium consequat, ante turpis blandit massa, id mollis est metus sed lorem. Quisque et nisl ac eros dignissim pharetra.
				 Sed tincidunt tincidunt fermentum. Nunc interdum a felis ut euismod. Morbi pellentesque, tellus ut congue rutrum, dolor lorem dapibus ipsum, 
				 quis gravida elit ex ut risus.`
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
	},
	{
		panels: [
			{ id: 'urban-pop-growth1', label: 'Next Section' },
			{ id: 'test-image1', label: 'Another Section' }
		],
		blocks: [
			{
				panelId: 'urban-pop-growth1',
				heading: 'Another test section',
				body: `Nullam nisi magna, efficitur eu auctor ac, semper sit amet nulla. Curabitur viverra, mi ac porttitor semper, 
				odio ex imperdiet mi, suscipit ornare erat ligula sit amet dolor. Sed quis libero non odio viverra luctus. 
				Aenean nec enim lacinia metus blandit efficitur. Vivamus condimentum est est, ac auctor nibh ultrices et. 
				Duis et tincidunt magna. Phasellus ac nisl massa. Mauris volutpat bibendum enim ut facilisis. Nunc ac mi rutrum, 
				ornare massa sed, sagittis lorem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
				 Nullam eu mauris interdum, tristique turpis in, sagittis neque. Integer nec nulla porttitor, rutrum quam egestas, 
				 dapibus quam.`
			},
			{
				panelId: 'test-image1',
				body: `Quisque odio libero, ullamcorper nec magna vel, ornare efficitur odio. 
				Sed facilisis aliquam ullamcorper. Vivamus vel ipsum non tortor ullamcorper 
				facilisis ac ac arcu. In hac habitasse platea dictumst. Sed sed mi rhoncus, 
				tristique magna vel, gravida velit. Nulla vestibulum lacinia enim et suscipit. 
				Morbi in enim semper, pellentesque erat ac, finibus est.`
			},
			{
				panelId: 'test-image1',
				body: `Etiam fringilla nisl lectus. Ut id purus risus. 
				Vivamus pulvinar interdum neque. Morbi quis sapien tincidunt, condimentum est quis, 
				tempus arcu. Aliquam sit amet molestie arcu. Nunc bibendum purus eget sem viverra convallis. 
				Donec commodo dictum faucibus. Fusce ac quam consequat, cursus purus quis, hendrerit mauris.
				 Sed et mi quis lorem lacinia molestie. Fusce ultrices felis ex, sed porttitor ipsum tempus a.
				  Integer lectus eros, sodales at odio eget, malesuada laoreet velit.`
			}
		]
	}
];
