<script>
    	import TableOfContents from './TableOfContents.svelte';
        import Arrow from './ui/Arrow.svelte';
</script>

<div class="blueprint">

    <div class="title">
        <h1>
            West Queen West
        </h1>
        <h2>
            Toronto, Ontario
        </h2>
    </div>

    <Arrow/>

<TableOfContents/>




</div>

<style>
    .title {
    margin: 0 auto;
    padding: 20px;
    width:40vw;
    color: white;
    text-align: center;
    position: relative;
    border: solid 1px var(--brandLightBlue);
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 1);
}

.title h1 {
    margin: 0 auto;
    font-family: 'Gelasio', serif;
    font-weight: 600;
    max-width: 430px;
    font-size: 3em;
    color: var(--brandDarkBlue);
    padding: 0px;
    display: flex;
    flex-direction: column;
}

.title h2 {
    padding-top: 20px;
    margin: 0 auto;
    font-family: 'Gelasio', serif;
    font-weight: 400;
    max-width: 450px;
    font-size: 28px;
    line-height: 30px;
    color: var(--brandLightBlue);
}

@media only screen and (max-width: 920px) {
    .title h1 {
        font-size: 42px;
    }
    .title h2 {
        font-size: 18px;
        line-height: 30px;
    }
}

.blueprint {
    width: 100%;
    max-width: 1920px;
    height: calc(100vh - 100px);
    max-height: 1080px;
    background-color:var(--brandDarkBlue);
    /* background:linear-gradient(
      rgba(0, 42, 65, 0.85), 
      rgba(0, 42, 65, 0.85)
    ), url('https://i.imgur.com/2U00OqL.png'); */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

}

</style>