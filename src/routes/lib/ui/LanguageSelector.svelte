<script>
    export let eng;
    export let fr;
    export let selected;
</script>

<div id='language-selector'>
    <h4><a href='{eng}' class:selected={selected === 'eng'}>ENGLISH</a></h4>
    <h4>|</h4>
    <h4><a href='{fr}' class:selected={selected === 'fr'}>FRANÇAIS</a></h4>
</div>

<style>
    #language-selector {
        display: flex;
        flex-direction: row;
        gap: 1em;
        width: 2em;
        padding: 2em 0 0 5em;
    }

    a {
        text-decoration: none;
        color: var(--brandLightBlue);
    }

    a.selected {
        color: var(--brandDarkBlue);
        font-weight: bold;
    }
</style>
