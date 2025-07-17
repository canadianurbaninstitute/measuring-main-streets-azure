<script>
    import { ScatterChart } from '@onsvisual/svelte-charts';

    import LegendItem from "./ui/legends/LegendItem.svelte"
  
    export let data;

    const doHoverScatter = (e) => hoveredScatter = e.detail.id;
	const doSelectScatter = (e) => selectedScatter = e.detail.id;

    let hover = true;
	let hoveredScatter = null;
	let select = true;
	let selectedScatter = null;
  </script>
  
  <div class='chart-container'>

    <h4>Independent Business Rank (x-axis) vs. Civic Infrastructure % Rank (y-axis)</h4>

    <ScatterChart
				data={data}
				xKey="independent_business_rank" yKey="civic_infra_share_rank" zKey="ms_type" rKey="resiliency_score" labelKey="name"
                colors={['#58E965', '#DB3069', '#002940', '#00ADF2']}
                height={800}
				r={[5,25]}
                {hover} hovered={hoveredScatter} on:hover={doHoverScatter}
				{select} selected={selectedScatter} on:select={doSelectScatter} labels/>


    <div class='controls'>
        <div class="legend-container">
            <LegendItem variant={'circle'} label={'Downtown Main Streets'} bgcolor={'#58e965'} />
            <LegendItem variant={'circle'} label={'Neighbourhood Main Streets'} bgcolor={'#002940'} />
            <LegendItem variant={'circle'} label={'Small Town Main Streets'} bgcolor={'#00adf2'} />
            <LegendItem variant={'circle'} label={'Malls'} bgcolor={'#DB3069'} />
        </div>
    </div>
  </div>



  <style>

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
