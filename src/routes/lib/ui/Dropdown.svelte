<script>
    import { onDestroy } from 'svelte';
    import Legend from "./legends/Legend.svelte";
    import { mapStore2 } from '../mapStore'; // Import the mapStore

    export let options = [];
    export let section;

    let map = null; // Initialize map as null

	// Subscribe to the map store and update the local `map` variable
	const unsubscribe = mapStore2.subscribe((maps) => {
		if (section && maps[section]) {
			map = maps[section];
		}
	});

	// Unsubscribe when the component is destroyed to prevent memory leaks
	onDestroy(unsubscribe);


    const gradients = {
		populationdensity: 'linear-gradient(to right, #ebf9ff, #cceffe, #99dffc, #67cefb, #34bef9, #01aef8, #018bc6, #016895, #004663, #002332, #001d29)',
		averageincome: 'linear-gradient(to right, #f7fcf5, #c9eac2, #7bc77c, #2a924b, #00441b, #002e12)',
        visibleminority: 'linear-gradient(to right, #ffeddb, #fd9243, #df5005, #7f2704, #4a1703)',
	};

	let selected;


    function toggleCensusLayer() {
        options.forEach(option => {
            let id = option.id;
            if (id === selected.id) {
                map.setLayoutProperty(id, 'visibility', 'visible');
            }
            else {
                map.setLayoutProperty(id, 'visibility', 'none');
            }
        });
    }

</script>

<small><i>Change Map Census Layer</i></small>
<select bind:value={selected} on:change={toggleCensusLayer}>
    {#each options as option}
        <option value={option}>
            {option.text}
        </option>
    {/each}
</select>

{#if selected && selected.id === 'populationdensity'}
    <Legend
        minlabel={'0'}
        maxlabel={'4070000'}
        label={'Population Density (people/sq.km)'}
        gradient={gradients.populationdensity}
    />
{/if}

{#if selected && selected.id === 'averageincome'}
    <Legend
        minlabel={'$0'}
        maxlabel={'$736000'}
        label={'Average Income (Census 2021)'}
        gradient={gradients.averageincome}
    />
{/if}

{#if selected && selected.id === 'visibleminority'}
    <Legend
        minlabel={'0'}
        maxlabel={'29730'}
        label={'Visible Minority Population'}
        gradient={gradients.visibleminority}
    />
{/if}


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