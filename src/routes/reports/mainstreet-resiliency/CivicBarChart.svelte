<script>
	import { LayerCake, Svg, groupLonger } from 'layercake';
	import { scaleBand, scaleOrdinal } from 'd3-scale';

	import Bar from '../../lib/chartcomponents/Bar.svelte';
	import AxisX from '../../lib/chartcomponents/AxisX.svelte';
	import AxisY from '../../lib/chartcomponents/AxisY.svelte';
	import LegendItem from '../../lib/ui/legends/LegendItem.svelte';

	// This example loads csv data as json using @rollup/plugin-dsv
	import data from '../../lib/data/reportdata/mainstreet-resiliency/civic.csv';

	export let title ='';
	let xDomain = [0, 0.6];

	const xKey = 'Civic_Provision'
	const yKey = 'Name';
	const zKey = 'Type';

	// data.forEach((d) => {
	// 	d[xKey] = +d[xKey];
	// });

	const seriesColors = ['#58E965', '#DB3069', '#002940', '#00ADF2'];

	function filterColumn(data, columnName) {
		return data.map(item => ({
			name: item.name,
			[columnName]: item[columnName]
		}));
	}

</script>


<div class='chart-container'>

    <h4>{title}</h4>

	<div class='controls'>
		<div class="legend-container">
			<LegendItem variant={'polygon'} label={'Downtown Main Streets'} bgcolor={'#58e965'} />
			<LegendItem variant={'polygon'} label={'Neighbourhood Main Streets'} bgcolor={'#002940'} />
			<LegendItem variant={'polygon'} label={'Small Town Main Streets'} bgcolor={'#00adf2'} />
			<!-- <LegendItem variant={'polygon'} label={'Malls'} bgcolor={'#DB3069'} /> -->
		</div>
	</div>

<div class="chart">
	<LayerCake
		position="absolute"
		padding={{ bottom: 20, left: 35 }}
		x={xKey}
		y={yKey}
		yDomainSort={false}
		yScale={scaleBand().paddingInner(0.1)}
		xDomain={xDomain}
		data={data.filter((d) => d.Type == 'Downtown')}
		flatData={data}
	>
		<Svg>
			<AxisX tickMarks baseline snapLabels />
			<AxisY tickMarks gridlines={false} />
			<Bar fill={'#58e965'} />
		</Svg>
	</LayerCake>

	<LayerCake
		position="absolute"
		padding={{ bottom: 20, left: 35 }}
		x={xKey}
		y={yKey}
		yDomainSort={false}
		yScale={scaleBand().paddingInner(0.1)}
		xDomain={xDomain}
		data={data.filter((d) => d.Type == 'Small Town')}
		flatData={data}
	>
		<Svg>
			<Bar fill={'#00adf2'} />
		</Svg>
	</LayerCake>
	<LayerCake
		position="absolute"
		padding={{ bottom: 20, left: 35 }}
		x={xKey}
		y={yKey}
		yDomainSort={false}
		yScale={scaleBand().paddingInner(0.1)}
		xDomain={xDomain}
		data={data.filter((d) => d.Type == 'Residential')}
		flatData={data}
	>
		<Svg>
			<Bar fill={'#002940'} />
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
		width: 100%;
		height: 800px;
		position: relative;
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
        display: flex;
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
