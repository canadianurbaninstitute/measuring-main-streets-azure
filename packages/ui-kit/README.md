# @canadianurbaninstitute/mms-ui-kit

Reusable Svelte 5 UI components and LayerCake-based data-visualization charts,
extracted from the [Measuring Main Streets](https://github.com/canadianurbaninstitute/measuring-main-streets-azure)
site so they can be shared across other Canadian Urban Institute projects.

Everything here is presentational and framework-generic — no dependency on
SvelteKit routing, mapbox, or this site's Supabase/data layer. Bring your own
data as props.

## Install

Not yet published to npm. Until it is, install it straight from this repo/workspace:

```bash
# from another project, as a git dependency
npm install github:canadianurbaninstitute/measuring-main-streets-azure#path:packages/ui-kit

# or, if you've cloned this repo locally
npm install /path/to/measuring-main-streets-azure/packages/ui-kit
```

Once published:

```bash
npm install @canadianurbaninstitute/mms-ui-kit
```

`svelte` (^5.0.0) is a peer dependency — your project needs it installed already.

## Setup

1. **Import the design tokens once**, in your app's global CSS (e.g. `app.css`):

   ```css
   @import '@canadianurbaninstitute/mms-ui-kit/tokens.css';
   ```

   This provides the CSS custom properties (brand colours, neutrals, chart
   colour scales) and a few shared classes (`.button-primary`, `.select-trigger`,
   etc.) that components style against. Override any `--brand*` / `--color-*`
   variable afterwards to re-theme the kit for your project.

2. **Load the Inter font** (used throughout) however your project prefers —
   Google Fonts, self-hosted, etc. Components don't bundle a font file.

## Component showcase

A live, browsable page rendering every component with real example props —
more convenient than reading prop tables here. Run it from `packages/ui-kit`:

```bash
npm run docs         # dev server with hot reload, at localhost:5173
npm run docs:build   # static site → packages/ui-kit/demo-dist, deployable anywhere
npm run docs:preview # serve the built static site locally
```

(Or from the repo root: `npm run ui-kit:docs`.) The showcase source lives in
`demo/` and isn't part of the published package — it imports straight from
`src/lib` so it always reflects the current component code.

## Usage

Import components by name from the package root:

```svelte
<script>
	import { CustomButton, Card, BarChart } from '@canadianurbaninstitute/mms-ui-kit';
</script>

<Card link="/example" cardImage="/img.jpg" streetName="Main Street" />

<BarChart
	data={[
		{ label: 'A', value: 12 },
		{ label: 'B', value: 20 }
	]}
	xKey="value"
	yKey="label"
/>
```

Full prop types for every component are shipped as `.d.ts` files (generated
from each component's TypeScript `Props` interface), so editor autocomplete
and hover-docs work out of the box — that's the authoritative reference for
every prop. The tables below cover the common ones.

## Component reference

### UI primitives

| Component          | Key props                                                                                               | Notes                              |
| ------------------ | ------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `CustomButton`     | `label`, `href`, `variant`, `disabled`, `icon`, `onclick`                                               | Styled action button/link          |
| `Card`             | `link`, `cardImage`, `streetName`                                                                       | Simple image + link card           |
| `ContactCard`      | `link`, `title`, `description`, `disabled`                                                              | Team/contact tile                  |
| `FeaturedCard`     | `link`, `image`, `title`, `description`, `tags`                                                         | Card with tag chips                |
| `HeroCard`         | `link`, `cardImage`, `title`, `subtitle`                                                                | Large hero-style card              |
| `HeroStat`         | `number`, `subtitle`, `color`                                                                           | Big stat callout                   |
| `ReportCard`       | `link`, `cardImage`, `title`, `subtitle`                                                                | Report/landing listing card        |
| `KeyFindings`      | `number`, `finding`, `message1`, `message2`, `message3`                                                 | Numbered findings block            |
| `Metric`           | `label`, `value`, `icon`, `iconcolor`, `prefix`                                                         | Inline metric with icon            |
| `TransitMetric`    | `label`, `value`, `icon`, `iconcolor`, `prefix`, `suffix`, `accordion`, `active`, `disabled`, `onclick` | Metric row, optionally collapsible |
| `Title`            | `name`, `location`, `outline`, `bg`                                                                     | Page/section title banner          |
| `SocialLinks`      | _(slots/props for link list)_                                                                           | Social icon row                    |
| `LanguageSelector` | `eng`, `fr`, `selected`                                                                                 | EN/FR toggle                       |
| `Accordion`        | `open`, `duration`, `easing`, `onToggle`, `id`                                                          | Expand/collapse panel              |
| `Collapsible`      | _(bits-ui Collapsible wrapper)_                                                                         | Animated collapsible               |
| `Checkbox`         | `checked` (bindable), `label`, `icon`, `color`                                                          | Styled checkbox                    |
| `Select`           | `data`, `icon`, `placeholder`, `handleSelect`, `selected` (bindable)                                    | Single-select dropdown (bits-ui)   |
| `Combobox`         | `handleSelect`, `data`, `icon`, `placeholder`, `selected`, `type`                                       | Searchable combobox (bits-ui)      |

### Legends

| Component        | Key props                                                                                                                  | Notes                                                                                                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Legend`         | `label`, `sublabel`, `minlabel`, `maxlabel`, `gradient`                                                                    | Gradient scale legend                                                                                                                                                      |
| `LegendAbsolute` | `title`, `items`, `gradient`, `absolute`                                                                                   | Positioned legend card, supports snippet children                                                                                                                          |
| `LegendItem`     | `label`, `variant` (`circle`/`polygon`/`line`), `bgcolor`, `bordercolor`, `button`, `filterProperty`, `filterValue`, `map` | Single legend row; pass a `map` instance (mapbox-gl/maplibre-gl) directly as a prop if you want it to toggle map layers — it no longer reaches into any app-specific store |

### Charts

Built on [LayerCake](https://layercake.graphics/); each accepts `data` plus
chart-specific keys. All support `showLegend`, `showTooltip`, `height`, and a
`formatLabelX`/`formatLabelY`/`formatTooltipValue` customization pattern.

| Component         | Required props                         | Notes                                                                           |
| ----------------- | -------------------------------------- | ------------------------------------------------------------------------------- |
| `BarChart`        | `data`, `xKey`                         | Single-series bar chart, horizontal or vertical via `groupKey`/config           |
| `GroupedBarChart` | `data`, `seriesConfig`                 | Grouped bars                                                                    |
| `StackedBar`      | `data`, `yKey`, `zKey`, `seriesConfig` | Stacked bars                                                                    |
| `MultiLineChart`  | `data`, `xKey`, `seriesConfig`         | Multi-series line/area chart, supports `stacked`, `cumulative`, `showTotalLine` |
| `PieChart`        | `data`, `xKey`, `yKey`                 | Pie/donut with optional `drilldownData` and `explode`                           |
| `ScatterChart`    | `data`, `xKey`, `yKey`                 | Scatter plot with optional quadrants and reference lines                        |
| `DotPlot`         | `data`, `yKey`, `xKey`                 | Dot/strip plot with quadtree-based tooltips                                     |
| `RadarChart`      | `data`                                 | Radar/spider chart                                                              |
| `BubbleChart`     | `data`                                 | Wraps `@onsvisual/svelte-charts` `ScatterChart`                                 |
| `DonutMetric`     | `value`                                | Single-value donut gauge (0–100 or 0–1)                                         |
| `GaugeMetric`     | `value`, `maxValue`                    | Arc gauge                                                                       |
| `RankMetric`      | `value`                                | Rank/ordinal callout (e.g. "#3 of 25")                                          |

Lower-level LayerCake building blocks (`AxisX`, `AxisY`, `Bar`, `Line`,
`Pie`, tooltips, etc.) ship under `chartcomponents/` for advanced custom
compositions, but aren't part of the top-level export — import them directly
if you're assembling your own LayerCake chart:

```js
import AxisX from '@canadianurbaninstitute/mms-ui-kit/chartcomponents/AxisX.svelte';
```

## Theming

The kit doesn't ship Tailwind — a couple of components (`LegendAbsolute`) use
Tailwind utility classes internally, so if you don't already use Tailwind in
your project, add `tailwindcss` and point its `content` glob at
`node_modules/@canadianurbaninstitute/mms-ui-kit/**/*.svelte`, or override the
component's classes to your own CSS.

## Developing this package

From the repo root (npm workspaces):

```bash
npm install                # installs workspace + package deps
npm run ui-kit:build       # builds packages/ui-kit/dist via @sveltejs/package
```

The package's own scripts (run from `packages/ui-kit/`):

```bash
npm run package   # svelte-package build + publint validation
npm run check      # svelte-check against this package's tsconfig
```

This package is developed inside the main site's repo as an npm workspace so
component updates stay easy to test in context, but it has no runtime
dependency on the site itself — copy `packages/ui-kit/` out on its own at any
time, or `npm publish` it once ready.
