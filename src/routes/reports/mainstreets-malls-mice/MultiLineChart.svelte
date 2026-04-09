<script>
	import MultiLineChart from '../../lib/ui/charts/MultiLineChart.svelte';

	import ecommerce from '../../lib/data/reportdata/mainstreets-malls-mice/ecommerce.csv';
	import restaurant from '../../lib/data/reportdata/mainstreets-malls-mice/restaurant.csv';

	// ── Backward-compat prop ─────────────────────────────────────────────────────
	/** @deprecated Use `data` + `seriesConfig` instead */
	export let chartDataset = null;

	// ── Inherited generalized props ──────────────────────────────────────────────
	export let data = [];
	export let seriesConfig = [];
	export let title = '';
	export let yDomain = [0, null];

	// ── Shim: map legacy chartDataset to new props ───────────────────────────────
	const PRESETS = {
		ecommerce: {
			data: ecommerce,
			seriesConfig: [
				{ key: 'percent', label: 'E-Commerce Share of All Retail Sales', color: '#002940' },
				{ key: 'trend', label: 'Pre-Pandemic Trendline', color: '#DB3069' }
			]
		},
		restaurant: {
			data: restaurant,
			seriesConfig: [
				{ key: 'drinking places', label: 'Drinking Places', color: '#002940' },
				{ key: 'full service restaurants', label: 'Full Service Restaurants', color: '#DB3069' },
				{
					key: 'limited service eating places',
					label: 'Limited Service Eating Places',
					color: '#00ADF2'
				}
			]
		}
	};

	$: if (chartDataset && PRESETS[chartDataset]) {
		data = PRESETS[chartDataset].data;
		seriesConfig = PRESETS[chartDataset].seriesConfig;
	}
</script>

<MultiLineChart {...$$restProps} {data} {seriesConfig} {title} {yDomain} height="800px" />
