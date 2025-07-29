<!-- UI component that displays a clickable card with an image and a street name used in the MMS Case Study pages to list case studies in a grid/lists.-->

<script>
    // props
    export let link;
    export let cardImage;
    export let streetName;
</script>

<a href={link}>
<div class="card">
    <div class="card-img">
        <img src={cardImage} alt="card">
    </div>
    <h4>{streetName}</h4>
</div>
</a>

<style>
     .card {
        padding: 1em;
        background-color: #fff;
        display:flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid #eee;
        border-radius: 1em;
        height: 100%;
    }

    .card:hover {
        cursor: pointer;
        background-color: #eee;
    }
    
    h4 {
        color: var(--brandDarkBlue);
        font-weight: 400;
        text-align: center;
    }

    a {
        text-decoration: none;
    }

    img {
        height: 10em;
        width: 10em;
    }

</style>