<script>
        import Arrow from './ui/Arrow.svelte';

        export let name;
        export let location;
        export let outline;
</script>

<div class="blueprint">

    <div class="title">
            <img src={outline} alt="street">
        <h1>
            {name}
        </h1>
        <h2>
            {location}
        </h2>
    </div>

</div>

<style>
    .title {
    /* margin: 0 auto; */
    /* padding: 1em; */
    /* width:40vw; */
    color: white;
    position: relative;
    height: 20%;    /* background-color: rgba(255, 255, 255, 1); */
    padding: 5em 0 5em 0;

}

.title h1 {
    margin: 0 auto;
    font-family: 'Gelasio', serif;
    font-weight: 600;
    font-size: 3em;
    color: var(--brandDarkBlue);
    padding: 0.5em 0 0;
    display: flex;
    flex-direction: column;
}

.title h2 {
    padding-top: 20px;
    margin: 0 auto;
    font-family: 'Gelasio', serif;
    font-weight: 400;
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
    /* max-width: 1920px; */
    /* height: calc(100vh - 100px);
    max-height: 1080px; */
    background-color:white;
    background:linear-gradient(
      rgba(255, 255, 255, 0.95), 
      rgba(255, 255, 255, 0.6),
      rgba(255, 255, 255, 0.95)

    ), url('https://i.imgur.com/DXGEpQB.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 0 0 0 5em;
}

</style>