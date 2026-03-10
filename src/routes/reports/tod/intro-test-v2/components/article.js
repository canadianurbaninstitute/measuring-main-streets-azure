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
 *   body     {string}  — paragraph text
 *
 * Each "panel" in visuals has:
 *   id       {string}  — unique key, referenced by sections[].visId
 *   label    {string}  — accessible caption shown below the visual
 *   component — the Svelte component to render inside the panel
 *              (import and pass from the page; keep data separate from views)
 */

export const sections = [
  {
    visId: 'intro-chart',
    blocks: [
      {
        eyebrow: 'Chapter 1',
        heading: 'The world is warming faster than ever',
        body:
          'Global average temperatures have risen by approximately 1.1 °C above pre-industrial levels. The past decade was the hottest on record, and the trajectory is accelerating — driven primarily by carbon dioxide emissions from fossil fuels.',
      },
      {
        eyebrow: null,
        heading: null,
        body:
          'The chart shows annual temperature anomalies relative to the 1951–1980 baseline. Each bar represents a single year; colour intensity maps to the magnitude of deviation. Notice how the red bars pile up after 1980.',
      },
    ],
  },
  {
    visId: 'emissions-map',
    blocks: [
      {
        eyebrow: 'Chapter 2',
        heading: 'Emissions are concentrated but consequences are shared',
        body:
          'The top ten emitting nations account for roughly two-thirds of all greenhouse-gas output. Yet the countries facing the most severe climate impacts — small island states, sub-Saharan Africa, South Asia — contribute a fraction of global emissions.',
      },
      {
        eyebrow: null,
        heading: null,
        body:
          'The map encodes per-capita emissions as colour saturation and absolute emissions as circle size. China and the United States dominate by volume; Gulf states lead per capita.',
      },
      {
        eyebrow: null,
        heading: null,
        body:
          'Hover over any country to see its emissions trajectory since 1990. A handful of economies have managed to decouple GDP growth from carbon output — but they remain exceptions.',
      },
    ],
  },
  {
    visId: 'solutions-grid',
    blocks: [
      {
        eyebrow: 'Chapter 3',
        heading: 'Solutions exist at every scale',
        body:
          'From rooftop solar to reforestation, the toolbox for decarbonisation is deep. Costs for renewable energy have fallen 90% in a decade. The question is no longer technological feasibility — it is political will and equitable deployment.',
      },
      {
        eyebrow: null,
        heading: null,
        body:
          'Each cell in the grid represents a mitigation pathway. The vertical axis measures potential CO₂ reduction by 2050; horizontal axis shows implementation cost per tonne. Bubbles in the upper-left quadrant are the highest-leverage, lowest-cost opportunities.',
      },
    ],
  },
];
