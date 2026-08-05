<script>
	import {
		BarChart,
		BubbleChart,
		DonutMetric,
		DotPlot,
		GaugeMetric,
		GroupedBarChart,
		MultiLineChart,
		PieChart,
		RadarChart,
		RankMetric,
		ScatterChart,
		StackedBar
	} from '../../src/lib/index.ts';
	import Demo from '../Demo.svelte';

	const barData = [
		{ label: 'Retail', value: 42 },
		{ label: 'Food & Beverage', value: 28 },
		{ label: 'Services', value: 18 },
		{ label: 'Vacant', value: 12 }
	];

	const groupedData = [
		{ label: '2019', independent: 62, chain: 38 },
		{ label: '2021', independent: 55, chain: 45 },
		{ label: '2023', independent: 58, chain: 42 }
	];
	const groupedSeries = [
		{ key: 'independent', label: 'Independent', color: '#00adf2' },
		{ key: 'chain', label: 'Chain', color: '#db3069' }
	];

	const stackedSeries = [
		{ key: 'retail', label: 'Retail', color: '#00adf2' },
		{ key: 'food', label: 'Food & Beverage', color: '#db3069' },
		{ key: 'services', label: 'Services', color: '#43b171' }
	];
	const stackedData = [
		{ label: '2019', retail: 40, food: 25, services: 20 },
		{ label: '2021', retail: 35, food: 30, services: 22 },
		{ label: '2023', retail: 38, food: 27, services: 24 }
	];

	const lineSeries = [
		{ key: 'toronto', label: 'Toronto', color: '#00adf2' },
		{ key: 'montreal', label: 'Montreal', color: '#db3069' }
	];
	const lineData = [
		{ date: '2019-01-01', toronto: 100, montreal: 100 },
		{ date: '2020-01-01', toronto: 92, montreal: 88 },
		{ date: '2021-01-01', toronto: 85, montreal: 90 },
		{ date: '2022-01-01', toronto: 98, montreal: 101 },
		{ date: '2023-01-01', toronto: 106, montreal: 104 }
	];

	const pieData = [
		{ label: 'Independent', value: 58 },
		{ label: 'Chain', value: 30 },
		{ label: 'Vacant', value: 12 }
	];

	const scatterData = [
		{ x: 12, y: 45, name: '104 Street' },
		{ x: 28, y: 60, name: 'Jasper Avenue' },
		{ x: 40, y: 38, name: 'Whyte Avenue' },
		{ x: 55, y: 72, name: 'Stony Plain Road' }
	];

	const dotPlotData = [
		{ label: '104 Street', before: 32, after: 48 },
		{ label: 'Jasper Avenue', before: 55, after: 60 },
		{ label: 'Whyte Avenue', before: 41, after: 38 }
	];

	const bubbleData = [
		{
			name: '104 Street',
			ms_type: 'Downtown',
			independent_business_rank: 12,
			civic_infra_share_rank: 30,
			resiliency_score: 60
		},
		{
			name: 'Jasper Avenue',
			ms_type: 'Neighbourhood',
			independent_business_rank: 25,
			civic_infra_share_rank: 45,
			resiliency_score: 72
		},
		{
			name: 'Whyte Avenue',
			ms_type: 'Small Town',
			independent_business_rank: 40,
			civic_infra_share_rank: 55,
			resiliency_score: 80
		}
	];

	const radarData = [
		{ label: 'Walkability', value: 82 },
		{ label: 'Transit access', value: 65 },
		{ label: 'Business diversity', value: 74 },
		{ label: 'Vacancy (inverted)', value: 90 },
		{ label: 'Housing density', value: 58 }
	];
</script>

<section class="section" id="charts">
	<h2>Charts</h2>
	<p class="section-intro">
		Composed, LayerCake-based charts. Each takes <code>data</code> plus chart-specific keys — see
		the README for full prop tables and the shipped <code>.d.ts</code> files for every option.
	</p>

	<Demo title="BarChart" stack>
		<BarChart data={barData} xKey="value" yKey="label" height="260px" />
	</Demo>

	<Demo title="GroupedBarChart" stack>
		<GroupedBarChart
			data={groupedData}
			yKey="label"
			seriesConfig={groupedSeries}
			height="280px"
			minHeight="280px"
		/>
	</Demo>

	<Demo title="StackedBar" stack>
		<StackedBar
			data={stackedData}
			yKey="label"
			seriesConfig={stackedSeries}
			height="280px"
			minHeight="280px"
		/>
	</Demo>

	<Demo title="MultiLineChart" stack>
		<MultiLineChart
			data={lineData}
			xKey="date"
			seriesConfig={lineSeries}
			height="280px"
			minHeight="280px"
		/>
	</Demo>

	<Demo title="PieChart" stack>
		<PieChart data={pieData} xKey="label" yKey="value" height="300px" />
	</Demo>

	<Demo title="ScatterChart" stack>
		<ScatterChart data={scatterData} xKey="x" yKey="y" labelKey="name" showLabels height="300px" />
	</Demo>

	<Demo title="DotPlot" description="before/after comparison" stack>
		<DotPlot data={dotPlotData} yKey="label" xKey={['before', 'after']} height="220px" />
	</Demo>

	<Demo title="RadarChart" stack>
		<RadarChart data={radarData} height="360px" />
	</Demo>

	<Demo title="GaugeMetric / DonutMetric / RankMetric">
		<GaugeMetric label="Resiliency score" value={68} maxValue={100} />
		<DonutMetric label="Occupancy" value={82} />
		<RankMetric label="National Rank" value={3} total="25" />
	</Demo>

	<Demo title="BubbleChart" description="wraps @onsvisual/svelte-charts; fixed 800px height" stack>
		<BubbleChart data={bubbleData} />
	</Demo>
</section>
