<script>
    import { LayerCake, Svg } from 'layercake';
    import { timeParse, timeFormat } from 'd3-time-format';

  
    import Line from '../../lib/chartcomponents/Line.svelte';
    import Area from '../../lib/chartcomponents/Area.svelte';
    import AxisX from '../../lib/chartcomponents/AxisX.svelte';
    import AxisY from '../../lib/chartcomponents/AxisY.svelte';
  
    // This example loads csv data as json using @rollup/plugin-dsv
    import libertyvillage from '../../lib/data/casestudydata/toronto/libertyvillage/visitortraffic';
    import uxbridge from '../../lib/data/casestudydata/toronto/uxbridge/visitortraffic'

    export let chartDataset;
    export let yDomain = [0, null];

    let data;

    if (chartDataset == 'libertyvillage') {
		data = libertyvillage
	} else if (chartDataset == 'uxbridge') {
		data = uxbridge
	}

  
    const xKey = 'date';
    const yKey = 'Percentage';

    const xKeyCast = timeParse('%Y-%m-%d');

  
    data.forEach(d => {
      d[yKey] = +d[yKey];
      d[xKey] = typeof d[xKey] === 'string' ? xKeyCast(d[xKey]) : d[xKey];
    });

    const formatLabelX = timeFormat('%b %Y');
    const formatLabelY = (d) => d + '%';



  </script>
  
  <style>
    /*
      The wrapper div needs to have an explicit width and height in CSS.
      It can also be a flexbox child or CSS grid element.
      The point being it needs dimensions since the <LayerCake> element will
      expand to fill it.
    */
	.chart {
		width: 100%;
		height: 300px;
	}

    .chart-container {
        display: flex;
        flex-direction: column;
        gap: 2em;
		border: 1px solid #eee;
		padding: 1em;
		border-radius: 1em;

    }
  </style>
  
  <div class="chart">
    <LayerCake
      padding={{ top: 8, right: 10, bottom: 20, left: 25 }}
      x={xKey}
      y={yKey}
      yDomain={yDomain}
      {data}
    >
      <Svg>
        <AxisX
        format={formatLabelX}
        />
        <AxisY
          ticks={4}
          format={formatLabelY}

        />
        <Line stroke={'#00adf2'}/>
        <Area fill={'#00adf210'}/>
      </Svg>
    </LayerCake>
  </div>