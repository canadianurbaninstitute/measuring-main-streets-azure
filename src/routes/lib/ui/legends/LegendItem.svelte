<script>
	// essential props
	export let label;
	export let variant; // can be 'circle', 'polygon' or 'line'
	export let bgcolor;

	// optional props
	export let bordercolor = 'rgba(0,0,0,0)';

	// use if turning into a toggle
	export let button = false;
	export let id; // layer id to target
	export let targetopacity = 0.9; // target opacity if the layer is switched back on
	export let featuretype = 'circle'; // needs to be set to the feature type the mapbox layer is, 'circle', 'fill', or 'line'

	// Filter-based toggling props
	export let filterProperty; // the property name to filter on
	export let filterValue; // the value to filter
	export let useFilter = false; // set to true to use filter-based toggling instead of opacity

	let layerActive = true;

	// MMS case study relevant props and imports
	export let section = undefined;
	export let map;
	import { onDestroy } from 'svelte';
	import { mapStoreList } from '../../stores/mapStore';

	/* MMS CASE STUDIES */

	// Subscribe to the map store only if section is provided
	let unsubscribe;
	if (section) {
		unsubscribe = mapStoreList.subscribe((maps) => {
			if (maps[section]) {
				map = maps[section];
			}
		});
	}

	// Unsubscribe when the component is destroyed to prevent memory leaks
	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	});

	/* Function to toggle layer visibility using filters */
	function toggleLayerWithFilter() {
		if (map && filterProperty && filterValue !== undefined) {
			// Get the current filter
			let currentFilter = map.getFilter(id) || ['all'];

			// Check if this value is currently filtered out
			const isFiltered = isValueFiltered(currentFilter, filterProperty, filterValue);

			if (isFiltered) {
				// Remove the filter for this value
				const newFilter = removeValueFromFilter(currentFilter, filterProperty, filterValue);
				map.setFilter(id, newFilter);
				layerActive = true;
			} else {
				// Add a filter to hide this value
				const newFilter = addValueToFilter(currentFilter, filterProperty, filterValue);
				map.setFilter(id, newFilter);
				layerActive = false;
			}
		}
	}

	/* Helper function to check if a value is currently filtered out */
	function isValueFiltered(filter, property, value) {
		// Look for ['!=', property, value] in the filter
		if (Array.isArray(filter)) {
			for (let i = 0; i < filter.length; i++) {
				const item = filter[i];
				if (Array.isArray(item) && item[0] === '!=' && item[1] === property && item[2] === value) {
					return true;
				}
				// Recursively check nested filters
				if (Array.isArray(item) && isValueFiltered(item, property, value)) {
					return true;
				}
			}
		}
		return false;
	}

	/* Helper function to remove a value filter */
	function removeValueFromFilter(filter, property, value) {
		if (!Array.isArray(filter)) return filter;

		// Filter out the ['!=', property, value] expression
		const filtered = filter
			.filter((item) => {
				if (Array.isArray(item) && item[0] === '!=' && item[1] === property && item[2] === value) {
					return false;
				}
				return true;
			})
			.map((item) => {
				// Recursively remove from nested filters
				if (Array.isArray(item)) {
					return removeValueFromFilter(item, property, value);
				}
				return item;
			});

		// If we're left with just ['all'], return null to show everything
		if (filtered.length === 1 && filtered[0] === 'all') {
			return null;
		}

		return filtered;
	}

	/* Helper function to add a value filter */
	function addValueToFilter(filter, property, value) {
		// If filter is null or just ['all'], create a new filter structure
		if (!filter || (Array.isArray(filter) && filter.length === 1 && filter[0] === 'all')) {
			return ['all', ['!=', property, value]];
		}

		// Add the new filter condition
		if (Array.isArray(filter) && filter[0] === 'all') {
			return [...filter, ['!=', property, value]];
		}

		// Wrap existing filter in 'all' if needed
		return ['all', filter, ['!=', property, value]];
	}

	/* Function to toggle layer visibility on and off by setting opacity */
	function toggleLayerVisibility() {
		if (map) {
			// get opacity of the type of feature the legend item is
			let opacity = map.getPaintProperty(id, `${featuretype}-opacity`);
			// if it is visible, undefined or has an expression as the value, set opacity to 0
			if (opacity > 0.4 || opacity === undefined || opacity.constructor === Array) {
				map.setPaintProperty(id, `${featuretype}-opacity`, 0);
				if (featuretype === 'circle') {
					map.setPaintProperty(id, `${featuretype}-stroke-opacity`, 0);
				} else if (id === 'case-study-BIAs') {
					map.setLayoutProperty(id, 'visibility', 'none');
				}
				layerActive = false;
				// set opacity to provided targetopacity, default is 0.9
			} else {
				map.setPaintProperty(id, `${featuretype}-opacity`, targetopacity);
				if (featuretype === 'circle') {
					map.setPaintProperty(id, `${featuretype}-stroke-opacity`, targetopacity);
				} else if (id === 'case-study-BIAs') {
					map.setLayoutProperty(id, 'visibility', 'visible');
				}
				layerActive = true;
			}
		}
	}

	/* Main toggle function that routes to the appropriate method */
	function handleToggle() {
		if (useFilter) {
			toggleLayerWithFilter();
		} else {
			toggleLayerVisibility();
		}
	}
</script>

<!-- Legend Item HTML -->

{#if button}
	<button class={layerActive ? 'layerOn' : 'layerOff'} on:click={handleToggle}>
		<div class="legend-item" {id}>
			<span
				class={variant}
				style="background-color: {bgcolor}; box-shadow:inset 0px 0px 0px 2px {bordercolor}; border-color: {bordercolor};"
			/>{label}
		</div>
	</button>
{:else}
	<div class="legend-item">
		<span
			class={variant}
			style="background-color: {bgcolor}; box-shadow:inset 0px 0px 0px 2px {bordercolor}; border-color: {bordercolor};"
		/>{label}
	</div>
{/if}

<style>
	.legend-item {
		padding: 0.3em;
		display: flex;
		align-items: center;
		font-size: 0.9em;
		text-align: left;
	}

	.polygon {
		border-radius: 2px;
		display: inline-block;
		height: 15px;
		margin-right: 5px;
		width: 15px;
	}

	.circle {
		border-radius: 100px;
		display: inline-block;
		height: 15px;
		margin-right: 5px;
		min-width: 15px;
	}

	.line {
		border-radius: 2px;
		display: inline-block;
		margin-right: 5px;
		width: 15px;
		height: 0;
		border-style: solid;
		border-width: 2px 2px 0 0;
		transform: rotate(45deg);
	}

	button {
		border: 1px solid rgba(28, 32, 36, 0.302);
		background-color: rgb(250, 251, 252);
		border-radius: 0.5em;
		box-shadow:
			rgba(27, 31, 35, 0.04) 0px 1px 0px 0px,
			rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset;
		opacity: 1;
		width: 100%;
		display: flex;
		padding: 0.2em;
		margin: 0.2em 0 0.2em 0;
	}

	button:hover {
		cursor: pointer;
		box-shadow:
			0px 1px 0px 0px rgba(27, 31, 35, 0.04),
			inset 0px 1px 0px 0px hsla(0, 0%, 100%, 0.25);
		background-color: #f3f4f6;
		transition: 0.3s;
	}

	button:active {
		box-shadow:
			0px 1px 0px 0px rgba(27, 31, 35, 0.04),
			inset 0px 1px 0px 0px hsla(0, 0%, 100%, 0.25),
			0px 1px 0px 0px rgba(225, 228, 232, 0.2);
		background-color: #edeff2;
		transition: 0.3s;
	}

	.layerOn {
		opacity: 1;
	}

	.layerOff {
		opacity: 0.6;
		border: 1px dashed rgba(27, 31, 35, 0.3);
	}
</style>
