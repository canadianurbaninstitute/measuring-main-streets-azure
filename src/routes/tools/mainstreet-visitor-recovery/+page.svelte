<script>
    import RecoveryMultiLineChart from "../../reports/mainstreets-malls-mice/RecoveryMultiLineChart.svelte"
    import Footer from "../../lib/ui/Footer.svelte";
    import { dataset } from '../../lib/data/reportdata/mainstreets-malls-mice/selectLabels.js';
</script>


<div class="hero">
    <h1> Main Street Visitor Recovery </h1>
    <p>
        This graphing tool highlights the visitor recovery patterns (relative to the same month of 2019) of the 4 typologies of main streets from 2020 to 2022.
    </p>
    <p>Use the drop down to select and add case study streets to the graph to compare their visitor recovery over time. Hover over the lines to see the exact value.
</p>
</div>


<div class='map-container'>


<RecoveryMultiLineChart dataset={dataset}/>

</div>

<Footer/>

<style>
    .map-container {
        margin: 2em;
    }
</style>