<script>
	import { LayerCake, Svg, groupLonger, Html } from 'layercake';
	import { scaleBand, scaleOrdinal } from 'd3-scale';

	import Bar from '../../lib/chartcomponents/Bar.svelte';
	import AxisX from '../../lib/chartcomponents/AxisX.svelte';
	import AxisY from '../../lib/chartcomponents/AxisY.svelte';
	import LegendItem from '../../lib/ui/legends/LegendItem.svelte';
	import Tooltip from '../../lib/chartcomponents/Tooltip.html.svelte';

	// This example loads csv data as json using @rollup/plugin-dsv
	import civic from '../../lib/data/reportdata/mainstreets-malls-mice/casestudies-civic.csv';
	import independence from '../../lib/data/reportdata/mainstreets-malls-mice/casestudies-independence.csv';
	import distance from '../../lib/data/reportdata/mainstreets-malls-mice/casestudies-distance.csv';


	export let xKey;
	export let title ='';
	export let xDomain = [0, null];
	
	let data;

	const yKey = 'name';
	const zKey = 'ms_type';

	if (xKey == 'civic') {
		data = civic
	} else if (xKey == 'independence') {
		data = independence
	} else if (xKey == 'distance') {
		data = distance
	}



	
</script>


<div class='chart-container'>

    <h4>{title}</h4>

	<div class='controls'>
		<div class="legend-container">
			<LegendItem variant={'polygon'} label={'Downtown Main Streets'} bgcolor={'#58e965'} />
			<LegendItem variant={'polygon'} label={'Neighbourhood Main Streets'} bgcolor={'#002940'} />
			<LegendItem variant={'polygon'} label={'Small Town Main Streets'} bgcolor={'#00adf2'} />
			<LegendItem variant={'polygon'} label={'Malls'} bgcolor={'#DB3069'} />
		</div>
	</div>

<div class="chart">
	<LayerCake
		position="absolute"
		padding={{ bottom: 20, left: 160 }}
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
			<Bar fill={'#58e965'}
			/>
		</Svg>
	</LayerCake>

	<LayerCake
		position="absolute"
		padding={{ bottom: 20, left: 160 }}
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
		padding={{ bottom: 20, left: 160 }}
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
		padding={{ bottom: 20, left: 160 }}
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
