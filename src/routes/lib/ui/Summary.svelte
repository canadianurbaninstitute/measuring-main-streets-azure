<script>
    export let name;
    export let location;
</script>

<div class="blueprint">

    <div class="title">
        <h1>
            {name}
        </h1>
        <h2>
            {location}
        </h2>
    </div>
</div>

<style>

.title h1 {
    margin: 0 auto;
    font-family: 'Gelasio', serif;
    font-weight: 600;
    max-width: 430px;
    font-size: 3em;
    color: var(--brandLightBlue);
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
    color: white;
}


@media only screen and (max-width: 920px) {
    h2 {
        font-size: 18px;
        line-height: 30px;
    }
}

.blueprint {
    height: 100vh;
    background-color:var(--brandDarkBlue);
    margin: 0 auto;
    padding: 2em;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

</style>