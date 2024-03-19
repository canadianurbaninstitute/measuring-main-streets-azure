<script>
    import { LayerCake, Svg } from 'layercake';
    import { scaleBand } from 'd3-scale';
  
	import Bar from '../../lib/chartcomponents/Bar.svelte';
	import AxisX from '../../lib/chartcomponents/AxisX.svelte';
	import AxisY from '../../lib/chartcomponents/AxisY.svelte';
  
    // This example loads csv data as json using @rollup/plugin-dsv
	import data from '../../lib/data/reportdata/mainstreets-malls-mice/groups.csv';
  
    const xKey = 'value';
    const yKey = 'year';
  
    data.forEach(d => {
      d[xKey] = +d[xKey];
    });
  </script>
  
  <style>
    /*
      The wrapper div needs to have an explicit width and height in CSS.
      It can also be a flexbox child or CSS grid element.
      The point being it needs dimensions since the <LayerCake> element will
      expand to fill it.
    */
    .chart-container {
      width: 100%;
      height: 500px;
    }
  </style>
  
  <div class="chart-container">
    <LayerCake
      padding={{ bottom: 20, left: 35 }}
      x={xKey}
      y={yKey}
      yScale={scaleBand().paddingInner(0.05)}
      xDomain={[0, null]}
      {data}
    >
      <Svg>
        <AxisX
          tickMarks
          baseline
          snapLabels
        />
        <AxisY
          tickMarks
          gridlines={false}
        />
        <Bar/>
      </Svg>
    </LayerCake>
  </div>