<script>
    import RecoveryMultiLineChart from "../../reports/mainstreets-malls-mice/RecoveryMultiLineChart.svelte"
    import Footer from "../../lib/ui/Footer.svelte";
    import { dataset } from '../../lib/data/reportdata/mainstreets-malls-mice/selectLabels.js';
    import { getLang } from '../../lib/i18n';

    const fr = getLang() === 'fr';
</script>


<div class="hero">
    {#if fr}
    <h1> Reprise de l’achalandage des rues principales </h1>
    <p>
        Cet outil graphique met en évidence les tendances de reprise de l’achalandage (par rapport au même mois en 2019) des quatre typologies de rues principales de 2020 à 2022.
    </p>
    <p>Utilisez le menu déroulant pour choisir des rues faisant l’objet d’études de cas et les ajouter au graphique afin de comparer la reprise de leur achalandage au fil du temps. Survolez les lignes pour voir la valeur exacte.
</p>
    {:else}
    <h1> Main Street Visitor Recovery </h1>
    <p>
        This graphing tool highlights the visitor recovery patterns (relative to the same month of 2019) of the 4 typologies of main streets from 2020 to 2022.
    </p>
    <p>Use the drop down to select and add case study streets to the graph to compare their visitor recovery over time. Hover over the lines to see the exact value.
</p>
    {/if}
</div>


<div class='chart-container'>


<RecoveryMultiLineChart dataset={dataset}/>

</div>

<Footer/>

<style>
    .chart-container {
        margin: 2em;
    }
</style>