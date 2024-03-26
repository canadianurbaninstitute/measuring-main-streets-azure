<script>
	import { LayerCake, Svg, groupLonger } from 'layercake';
	import { scaleBand, scaleOrdinal } from 'd3-scale';

	import Bar from '../../lib/chartcomponents/Bar.svelte';
	import AxisX from '../../lib/chartcomponents/AxisX.svelte';
	import AxisY from '../../lib/chartcomponents/AxisY.svelte';
	import LegendItem from '../../lib/ui/legends/LegendItem.svelte';

	// This example loads csv data as json using @rollup/plugin-dsv
	import data from '../../lib/data/reportdata/mainstreets-malls-mice/casestudies.csv';

	export let xKey;
	export let title ='';
	export let xDomain = [0, null];

	const yKey = 'name';
	const zKey = 'ms_type';

	const filteredData = data.filter((d) => d.ms_type == 'Small Town')
    .sort((a, b) => b.civic - a.civic);

	console.log(filteredData);


	
</script>


<div class='chart-container'>

    <h4>{title}</h4>

<div class="chart">
	<LayerCake
		position="absolute"
		padding={{ bottom: 20, left: 35 }}
		x={xKey}
		y={yKey}
		yDomainSort={false}
		yScale={scaleBand().paddingInner(0.1)}
		xDomain={xDomain}
		data={data.filter((d) => d.ms_type == 'Downtown and CBD')}
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
		data={data.filter((d) => d.ms_type == 'Small Town')}
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
		data={data.filter((d) => d.ms_type == 'Regional Mall')}
		flatData={data}
	>
		<Svg>
			<Bar fill={'#DB3069'} />
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
		data={data.filter((d) => d.ms_type == 'Urban and Suburban Main Street')}
		flatData={data}
	>
		<Svg>
			<Bar fill={'#002940'} />
		</Svg>
	</LayerCake>
</div>

<div class='controls'>
    <div class="legend-container">
		<LegendItem variant={'polygon'} label={'Downtown Main Streets'} bgcolor={'#58e965'} />
        <LegendItem variant={'polygon'} label={'Neighbourhood Main Streets'} bgcolor={'#002940'} />
        <LegendItem variant={'polygon'} label={'Small Town Main Streets'} bgcolor={'#00adf2'} />
        <LegendItem variant={'polygon'} label={'Malls'} bgcolor={'#DB3069'} />
    </div>
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
        display:flex;
        flex-direction: row;
        border-radius: 0.5em;
        border: 1px solid var(--brandGrey);
        padding: 0.5em;

    }
</style>
