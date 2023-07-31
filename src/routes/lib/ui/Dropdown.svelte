<script>
    let options = [
		{ id: 1, text: `Average Income`},
		{ id: 2, text: `Population Density` },
		{ id: 3, text: `Census Layer 3` }
	];

	let selected;
</script>

<small><i>Select Census Layer</i></small>
<select bind:value={selected}>
    {#each options as option}
        <option value={option}>
            {option.text}
        </option>
    {/each}
</select>

<style>

    select {
        width: 100%;
        height: 2em;
        padding-right: 30px; 
        margin-top: 0.4em;
        margin-bottom: 0.4em;

        border: 1px solid rgba(27, 31, 35, 0.3);
		background-color: rgb(250, 251, 252);
		border-radius: 0.5em;
		box-shadow: rgba(27, 31, 35, 0.04) 0px 1px 0px 0px,
			rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset;
    }

    option {
        width: 100%;
    }

</style>