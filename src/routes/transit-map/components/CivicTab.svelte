<script lang="ts">
    import { BarChart } from '@onsvisual/svelte-charts';
    import TransitMetric from '../../lib/ui/TransitMetric.svelte';
    import './tabs.css'
    
    export let selectedStation;
    export let civicData;
</script>


<div class="tab-content">
    <TransitMetric
        label={'Civic Infrastructure Locations'}
        value={Math.round(selectedStation.CivicCount).toLocaleString()}
        icon={'mdi:museum'}
    />
    <div class="chart-container">
        <div class="chart">
            <BarChart
                colors={['#DB3069', '#F45D01', '#8A4285', '#33AED7', '#43B171']}
                data={civicData}
                zKey="label"
                xKey="value"
                yKey="y"
                title="Civic Infrastructure"
                xMax="100"
                mode="stacked"
                legend="true"
                xSuffix="%"
                padding={{ top: 0, bottom: 20, left: 0, right: 20 }}
            />
        </div>
    </div>
</div>