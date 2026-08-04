// UI primitives
export { default as Accordion } from './ui/Accordion.svelte';
export { default as Card } from './ui/Card.svelte';
export { default as Checkbox } from './ui/Checkbox.svelte';
export { default as Collapsible } from './ui/Collapsible.svelte';
export { default as Combobox } from './ui/Combobox.svelte';
export { default as ContactCard } from './ui/ContactCard.svelte';
export { default as CustomButton } from './ui/CustomButton.svelte';
export { default as FeaturedCard } from './ui/FeaturedCard.svelte';
export { default as HeroCard } from './ui/HeroCard.svelte';
export { default as HeroStat } from './ui/HeroStat.svelte';
export { default as KeyFindings } from './ui/KeyFindings.svelte';
export { default as LanguageSelector } from './ui/LanguageSelector.svelte';
export { default as Metric } from './ui/Metric.svelte';
export { default as ReportCard } from './ui/ReportCard.svelte';
export { default as Select } from './ui/Select.svelte';
export { default as SocialLinks } from './ui/SocialLinks.svelte';
export { default as Title } from './ui/Title.svelte';
export { default as TransitMetric } from './ui/TransitMetric.svelte';

// Legends
export { default as Legend } from './legends/Legend.svelte';
export { default as LegendAbsolute } from './legends/LegendAbsolute.svelte';
export { default as LegendItem } from './legends/LegendItem.svelte';

// Composed charts (built on the LayerCake primitives in ./chartcomponents)
export { default as BarChart } from './charts/BarChart.svelte';
export { default as BubbleChart } from './charts/BubbleChart.svelte';
export { default as DonutMetric } from './charts/DonutMetric.svelte';
export { default as DotPlot } from './charts/DotPlot.svelte';
export { default as GaugeMetric } from './charts/GaugeMetric.svelte';
export { default as GroupedBarChart } from './charts/GroupedBarChart.svelte';
export { default as MultiLineChart } from './charts/MultiLineChart.svelte';
export { default as PieChart } from './charts/PieChart.svelte';
export { default as RadarChart } from './charts/RadarChart.svelte';
export { default as RankMetric } from './charts/RankMetric.svelte';
export { default as ScatterChart } from './charts/ScatterChart.svelte';
export { default as StackedBar } from './charts/StackedBar.svelte';

// Lower-level chart building blocks (AxisX, Bar, Line, tooltips, etc.) are shipped
// under ./chartcomponents/*.svelte for advanced custom LayerCake compositions,
// but aren't re-exported here — import them directly if you need them, e.g.:
//   import AxisX from '@canadianurbaninstitute/mms-ui-kit/chartcomponents/AxisX.svelte';
