<script>
	import { LayerCake, Svg, groupLonger } from 'layercake';
	import { scaleBand, scaleOrdinal } from 'd3-scale';

	import Bar from '../../lib/chartcomponents/Bar.svelte';
	import AxisX from '../../lib/chartcomponents/AxisX.svelte';
	import AxisY from '../../lib/chartcomponents/AxisY.svelte';

	// This example loads csv data as json using @rollup/plugin-dsv
	import data from '../../lib/data/reportdata/mainstreets-malls-mice/casestudies.csv';

	const xKey = 'independence';
	const yKey = 'name';
	const zKey = 'ms_type';

	// data.forEach((d) => {
	// 	d[xKey] = +d[xKey];
	// });

	const seriesNames = new Set();
	const seriesColors = ['#58E965', '#DB3069', '#002940', '#00ADF2'];

	const dataTransformed = data.map((d) => {
		seriesNames.add(d[zKey]);
		return {
			[xKey]: +d[xKey],
			[yKey]: d[yKey],
			[zKey]: d[zKey]
		};
	});

	const seriesNamesArray = Array.from(seriesNames);
</script>

<div class="chart-container">
	<LayerCake
		padding={{ bottom: 20, left: 35 }}
		x={xKey}
		y={yKey}
		z={zKey}
		yScale={scaleBand()}
		xDomain={[0, null]}
		zScale={scaleOrdinal()}
		zDomain={seriesNamesArray}
		zRange={seriesColors}
		{data}
		flatData={data}
	>
		<Svg>
			<AxisX tickMarks baseline snapLabels />
			<AxisY tickMarks gridlines={false} />
			<Bar />
		</Svg>
	</LayerCake>
</div>

<style>
	/*
      The wrapper div needs to have an explicit width and height in CSS.
      It can also be a flexbox child or CSS grid element.
      The point being it needs dimensions since the <LayerCake> element will
      expand to fill it.
    */
	.chart-container {
		width: 100%;
		height: 700px;
	}
</style>
