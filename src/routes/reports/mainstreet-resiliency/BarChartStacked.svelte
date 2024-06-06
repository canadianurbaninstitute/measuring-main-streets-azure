<script>
	import { LayerCake, Svg, flatten, stack } from 'layercake';
	import { scaleBand, scaleOrdinal } from 'd3-scale';

	import BarStacked from '../../lib/chartcomponents/BarStacked.svelte';
	import AxisX from '../../lib/chartcomponents/AxisX.svelte';
	import AxisY from '../../lib/chartcomponents/AxisY.svelte';
	import LegendItem from '../../lib/ui/legends/LegendItem.svelte';

	// This example loads csv data as json using @rollup/plugin-dsv
	import data from '../../lib/data/reportdata/mainstreet-resiliency/visitors.csv';

	export let title ='';

    const xKey = [0, 1];
	const yKey = 'Name';
	const zKey = 'key';
    const formatLabelX = (d) => d + '%';


	// data.forEach((d) => {
	// 	d[xKey] = +d[xKey];
	// });

    const seriesNames = Object.keys(data[0]).filter(d => d !== yKey);
	const seriesColors = ['#DB3069', '#002940', '#00ADF2'];

	// function filterColumn(data, columnName) {
	// 	return data.map(item => ({
	// 		name: item.name,
	// 		[columnName]: item[columnName]
	// 	}));
	// }

    data.forEach(d => {
    seriesNames.forEach(name => {
      d[name] = +d[name];
    });
  });

  const stackedData = stack(data, seriesNames);



</script>


<div class='chart-container'>

    <h4>{title}</h4>

    <div class='controls'>
        <div class="legend-container">
            <LegendItem variant={'polygon'} label={'Residents'} bgcolor={'#002940'} />
            <LegendItem variant={'polygon'} label={'Frequent Visitors'} bgcolor={'#00adf2'} />
            <LegendItem variant={'polygon'} label={'Infrequent Visitors'} bgcolor={'#DB3069'} />
        </div>
    </div>

<div class="chart">
	<LayerCake
		padding={{ bottom: 20, left: 35 }}
        x={xKey}
        y={d => d.data[yKey]}
        z={zKey}
        yScale={scaleBand().paddingInner(0.05)}
        zScale={scaleOrdinal()}
        zDomain={seriesNames}
        zRange={seriesColors}
        flatData={flatten(stackedData)}
        data={stackedData}
        yDomainSort={false}

	>
		<Svg>
			<AxisX tickMarks baseline snapLabels format={formatLabelX}
            />
			<AxisY tickMarks gridlines={false} />
			<BarStacked/>
		</Svg>
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
		/* width: 100%; */
		height: 800px;
		position: relative;
        padding-left: 8em;
	}

	.chart-container {
        display: flex;
        flex-direction: column;
        gap: 2em;
		border: 1px solid #eee;
		padding: 1em;
		border-radius: 1em;

    }

	.controls {
        display:flex;
        flex-direction: column;
        }
    
    .legend-container {
        display:flex;
        flex-direction: column;
        border-radius: 0.5em;
        border: 1px solid var(--brandGrey);
        padding: 0.5em;

    }


	@media only screen and (min-width: 768px) {
		.legend-container {
			flex-direction: row;

		}
		 
	}
</style>
