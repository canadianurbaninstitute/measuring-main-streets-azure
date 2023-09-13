<script>
        import Arrow from './ui/Arrow.svelte';

        export let name;
        export let location;
        export let image;
</script>

<div class="blueprint">

    <div class="title">
        <div class="card-img">
            <img src={image} alt="street">
        </div>
        <h1>
            {name}
        </h1>
        <h2>
            {location}
        </h2>
    </div>

    <Arrow/>



</div>

<style>
    .title {
    margin: 0 auto;
    padding: 1em;
    width:40vw;
    color: white;
    text-align: center;
    position: relative;
    bottom: 5em;
    border: solid 0px var(--brandLightBlue);
    border-radius: 8px;
    /* background-color: rgba(255, 255, 255, 1); */
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

.card-img {
    height: 15em;
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
    background-color:white;
    background:linear-gradient(
      rgba(255, 255, 255, 0.95), 
      rgba(255, 255, 255, 0.7),
      rgba(255, 255, 255, 0.95)

    ), url('https://i.imgur.com/DXGEpQB.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

</style>