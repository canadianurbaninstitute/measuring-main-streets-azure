<script lang="ts">
    import TransitMetric from '../../lib/ui/TransitMetric.svelte';
    import './tabs.css'
    
    export let selectedStation;
    export let stationBuiltForm;
</script>

<div class="tab-content">
    <div class="metric-container">
        <TransitMetric
            label={'Population Density'}
            value={Math.round(selectedStation.PopulationDensity).toLocaleString() +
                ' / sq. km'}
            icon={'mdi:people'}
        />
        <TransitMetric
            label={'Employment Density'}
            value={Math.round(selectedStation.EmploymentDensity).toLocaleString() +
                ' / sq. km'}
            icon={'mdi:briefcase'}
        />
    </div>
    <div class="metric-container">
        <TransitMetric
            label={'Green Space'}
            value={Math.round(stationBuiltForm.greenspace_area).toLocaleString() + ' sq. m'}
            icon={'mdi:pine-tree-variant'}
        />
        <TransitMetric
            label={'Water'}
            value={Math.round(stationBuiltForm.water_area).toLocaleString() + ' sq. m'}
            icon={'mdi:waves'}
        />
        <TransitMetric
            label={'Buildings'}
            value={Math.round(stationBuiltForm.building_area).toLocaleString() + ' sq. m'}
            icon={'mdi:office-building'}
        />
        <TransitMetric
            label={'Parking'}
            value={Math.round(stationBuiltForm.parking_area).toLocaleString() + ' sq. m'}
            icon={'mdi:car'}
        />
    </div>
</div>