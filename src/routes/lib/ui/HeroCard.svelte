<script>
    export let link;
    export let cardImage;
    export let title;
    export let subtitle;
</script>


<a href={link}>
<div class="card">
    <div class="card-img-container">
        <img src={cardImage} alt="card">
    </div>
    <div class="card-text-container">
    <div>
    <h2>{title}</h2>
    <h5>{subtitle}</h5>
    </div> 
    </div>
</div>
</a>


<style>
     .card {
        margin: 1em;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        border: 1px solid #ddd;
        border-radius: 1em;
        justify-content: space-between; 
        height: 100%;
    }

    .card:hover {
        cursor: pointer;
        background-color: #eee;
        transition: 1ms;
    }

    .card-text-container {
        border-top: 1px solid #ddd;
        width: 100%;
        padding: 1em;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    
    .card-img-container {
        width: 100%;
        height: 250px;
        border-radius: 1em 1em 0 0; 
        overflow: hidden;

    }

    .card-img-container img {
        height: 100%;
        width: 100%;
        object-fit: cover;
    }
    
    h2 {
        color: var(--brandDarkBlue);
        font-weight: 400;
    }

    h5 {
        font-weight: 400;
    }

    a {
        text-decoration: none;
    }
</style>