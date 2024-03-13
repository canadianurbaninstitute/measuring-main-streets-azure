<script>
	import Title from '../../lib/Title.svelte';
	import malls from '../../lib/assets/graphics/malls.svg';

	import * as d3 from 'd3';
	import { onMount } from 'svelte';
    import '../../styles.css'
</script>

<Title
	outline={malls}
	name={'Main Streets, Malls & Mice'}
	location={'Trajectories of main streets, shopping malls and online behaviour'}
/>

<div id="my_dataviz" />
