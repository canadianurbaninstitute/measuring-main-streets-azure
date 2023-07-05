<script>
    import Top from "./lib/TopBar.svelte";
    import Title from "./lib/Title.svelte";
    import Summary from "./lib/Summary.svelte";
    import Scrollytelling from './lib/Scrollytelling.svelte';
    import './styles.css'; 



</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Gelasio:wght@400;600&family=Inter&display=swap" rel="stylesheet">
    <link href='https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css' rel='stylesheet' />
</svelte:head>

<Top/>

<main>

<Title/>
<Scrollytelling/>
<Summary/>





</main>

