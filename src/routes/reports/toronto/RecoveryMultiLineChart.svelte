<script>
	import { LayerCake, Svg, Html, groupLonger, flatten } from 'layercake';
	import '../../styles.css'

	import { scaleOrdinal } from 'd3-scale';
	import { timeParse, timeFormat } from 'd3-time-format';
	import { format } from 'd3-format';
	import LegendItem from '../../lib/ui/legends/LegendItem.svelte';

	import MultiLine from '../../lib/chartcomponents/MultiLine.svelte';
	import AxisX from '../../lib/chartcomponents/AxisX.svelte';
	import AxisY from '../../lib/chartcomponents/AxisY.svelte';
	import SharedTooltip from '../../lib/chartcomponents/SharedTooltip.html.svelte';

	// This example loads csv data as json using @rollup/plugin-dsv

	import data from '../../lib/data/reportdata/toronto/recovery-toronto.csv';

	/* --------------------------------------------
	 * Set what is our x key to separate it from the other series
	 */
	const xKey = 'date';
	const yKey = 'value';
	const zKey = 'ms_type';

	const xKeyCast = timeParse('%Y-%m-%d');

	const seriesNames = Object.keys(data[0]).filter((d) => d !== xKey);

	let seriesColors = ['#58E965', '#DB3069', '#002940', '#00ADF2'];

	/* Cast values */
	data.forEach((d) => {
		d[xKey] = typeof d[xKey] === 'string' ? xKeyCast(d[xKey]) : d[xKey];
		seriesNames.forEach((name) => {
			d[name] = +d[name];
		});
	});

	const formatLabelX = timeFormat('%b %Y');
	const formatLabelY = (d) => format(`~s`)(d) + '%';
	const formatValue = (d) => format('.0f')(d) + '%';


	let groupedData;


	groupedData = groupLonger(data, seriesNames, {
		groupTo: zKey,
		valueTo: yKey
	});

</script>

<div class="chart-container">
	<h4>Visitor Levels (%) relative to the same month in 2019</h4>
	<div class="controls">
		<div class="legend-container">
			<LegendItem variant={'line'} label={'Downtown Main Streets'} bordercolor={seriesColors[0]} />
			<LegendItem variant={'line'} label={'Malls'} bordercolor={seriesColors[1]} />
			<LegendItem variant={'line'} label={'Neighbourhood Main Streets'} bordercolor={seriesColors[2]} />
			<LegendItem variant={'line'} label={'Small Town Main Streets'} bordercolor={seriesColors[3]} />
		</div>


	</div>

	<div class="chart">
		<LayerCake
			position="absolute"
			padding={{ top: 7, right: 10, bottom: 20, left: 25 }}
			x={xKey}
			y={yKey}
			z={zKey}
			yDomain={[0, 160]}
			zScale={scaleOrdinal()}
			zRange={seriesColors}
			flatData={flatten(groupedData, 'values')}
			data={groupedData}
		>
			<Svg>
				<AxisX
					gridlines={false}
					ticks={data.filter((_, i) => i % 5 === 0).map((d) => d[xKey])}
					format={formatLabelX}
					tickMarks
					snapLabels
				/>
				<AxisY ticks={4} format={formatLabelY} />
				<MultiLine />
			</Svg>

			<Html>
				<SharedTooltip formatTitle={formatLabelX} dataset={data} {formatValue} />
			</Html>
		</LayerCake>
	</div>
</div>

<style>
	/*
          The wrapper div needs to have an explicit width and height in CSS.
          It can also be a flexbox child or CSS grid element.
          The point being it needs dimensions since the <LayerCake> element will
          expand to fill it.
        */
	.chart {
		width: 100%;
		height: 500px;
		position: relative;
	}

	.chart-container {
		display: flex;
		flex-direction: column;
		gap: 1em;
		border: 1px solid #eee;
		padding: 1em;
		border-radius: 1em;
	}

	.controls {
		display: flex;
		flex-direction: column;
	}

	.controls:hover {
		cursor: pointer;
	}

	.legend-container {
		display: flex;
		flex-direction: row;
		border-radius: 0.5em;
		border: 1px solid var(--brandGrey);
		margin: 1em 0 0 0;
		padding: 0.5em;
	}


</style>
