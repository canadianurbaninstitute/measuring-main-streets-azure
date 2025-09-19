<script lang="ts">
    import { BarChart } from '@onsvisual/svelte-charts';
    import TransitMetric from '../../lib/ui/TransitMetric.svelte';
    import './tabs.css'

    export let selectedStation;
    export let ageData;
</script>

<div class="tab-content">
    <div class="metric-container">
        <TransitMetric
            label={'Population'}
            value={selectedStation.TotalPopulation.toLocaleString()}
            icon={'fluent:people-20-filled'}
        />
        <TransitMetric
            label={'Households'}
            value={selectedStation.TotalHouseholds.toLocaleString()}
            icon={'mdi:house'}
        />
    </div>
    <TransitMetric
        label={'Average Employment Income'}
        value={'$' + Math.round(selectedStation.AverageEmploymentIncome).toLocaleString()}
        icon={'mdi:wallet'}
    />
    <div class="metric-container">
        <TransitMetric
            label={'Visible Minority'}
            value={Math.round(selectedStation.VisibleMinorityTotal * 10) / 10 + '%'}
            icon={'mdi:people'}
        />
        <TransitMetric
            label={'Immigrants'}
            value={Math.round(selectedStation.TotalImmigrant * 10) / 10 + '%'}
            icon={'mdi:globe'}
        />
        <TransitMetric
            label={'Indigenous'}
            value={Math.round(selectedStation.IndigenousIdentity * 10) / 10 + '%'}
            icon={'mdi:people'}
        />
    </div>
    <TransitMetric
        label={'University Degree'}
        value={Math.round(selectedStation.UniversityDegree * 10) / 10 + '%'}
        icon={'mdi:school'}
    />
    <div class="chart-container">
        <div class="chart">
            <BarChart
                colors={['#002a41', '#0098D6', '#db3069']}
                data={ageData}
                zKey="label"
                xKey="value"
                yKey="y"
                title="Age"
                xMax="100"
                mode="stacked"
                legend="true"
                xSuffix="%"
                padding={{ top: 0, bottom: 20, left: 0, right: 20 }}
            />
        </div>
    </div>
</div>