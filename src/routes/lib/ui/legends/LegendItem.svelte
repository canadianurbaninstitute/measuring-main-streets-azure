<script>
	// let layerActive = $state(true);

	// MMS case study relevant props and imports

	import Icon from '@iconify/svelte';
	import { onDestroy } from 'svelte';
	import { mapStoreList } from '../../stores/mapStore';

	let {
		label,
		variant,
		bgcolor,
		bordercolor = 'rgba(0,0,0,0)',
		button = false,
		disabled = false,
		id,
		icon = null,
		targetopacity = 0.9,
		featuretype = 'circle',
		filterProperty,
		filterValue, // target opacity if the layer is switched back on
		useFilter = false,
		toggledValues = $bindable(), // needed to keep track of toggled values in the parent when using paint property toggling; necessary if a 'within' filter is already being used
		section = undefined,
		map
	} = $props();
	// NEW: Derived state. A button is "Active" if its value(s) are NOT in the hidden list.
	let layerActive = $derived.by(() => {
		if (!toggledValues[filterProperty]) return true;

		if (Array.isArray(filterValue)) {
			// Bulk toggle: Active if at least one of its values is NOT hidden
			// (Or use .every if you want it to only highlight when ALL are visible)
			return !filterValue.every((val) => toggledValues[filterProperty].includes(val));
		}

		// Individual toggle: Active if its specific value is NOT in the hidden list
		return !toggledValues[filterProperty].includes(filterValue);
	});

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
			let currentFilter = map.getFilter(id);
			// Check if there's a 'within' filter - we need special handling
			const hasWithinFilter =
				currentFilter && Array.isArray(currentFilter) && currentFilter[0] === 'within';

			if (hasWithinFilter) {
				// Use paint property to hide specific features instead of filters
				toggleWithPaintProperty();
				return;
			}

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

	function toggleWithPaintProperty() {
		if (!filterProperty) return;

		// Initialize the hidden values list for this property (e.g., 'Group Name')
		if (!toggledValues[filterProperty]) toggledValues[filterProperty] = [];

		const valuesToToggle = Array.isArray(filterValue) ? filterValue : [filterValue];

		if (layerActive) {
			// It's currently visible -> We want to HIDE it (Add values to the hidden list)
			const currentHidden = new Set(toggledValues[filterProperty]);
			valuesToToggle.forEach((val) => currentHidden.add(val));
			toggledValues[filterProperty] = Array.from(currentHidden);
		} else {
			// It's currently hidden -> We want to SHOW it (Remove values from hidden list)
			toggledValues[filterProperty] = toggledValues[filterProperty].filter(
				(v) => !valuesToToggle.includes(v)
			);
		}

		updateOpacity();
	}

	function updateOpacity() {
		const conditions = [];

		for (const [prop, values] of Object.entries(toggledValues)) {
			if (values.length > 0) {
				conditions.push(['in', ['get', prop], ['literal', values]]);
			}
		}

		let opacityExpr;

		if (conditions.length === 0) {
			opacityExpr = targetopacity;
		} else {
			const combined = conditions.length === 1 ? conditions[0] : ['any', ...conditions];
			opacityExpr = ['case', combined, 0, targetopacity];
		}

		map.setPaintProperty(id, `${featuretype}-opacity`, opacityExpr);
		if (featuretype === 'circle') {
			map.setPaintProperty(id, `${featuretype}-stroke-opacity`, opacityExpr);
		}
	}

	/* Helper function to check if a value is currently filtered out */
	function isValueFiltered(filter, property, value) {
		if (!filter) return false;

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
		if (!filter) return null;
		if (!Array.isArray(filter)) return filter;

		// If this is not an 'all' filter, we can't remove from it
		if (filter[0] !== 'all') {
			return filter;
		}

		// Filter out the ['!=', property, value] expression
		const filtered = filter.filter((item, index) => {
			// Keep the 'all' operator (index 0)
			if (index === 0) return true;

			// Remove our specific inequality condition
			if (Array.isArray(item) && item[0] === '!=' && item[1] === property && item[2] === value) {
				return false;
			}
			return true;
		});

		// Clean up the result
		if (filtered.length === 1) {
			// Only 'all' remains, return null to clear filter
			return null;
		}

		if (filtered.length === 2) {
			// 'all' with one condition - unwrap it and return that condition directly
			// This handles cases like ['all', ['within', polygon]] -> ['within', polygon]
			return filtered[1];
		}

		if (filtered.length === 3) {
			// If we have ['all', condition1, condition2], keep the 'all' structure
			return filtered;
		}

		return filtered;
	}

	/* Helper function to add a value filter */
	function addValueToFilter(filter, property, value) {
		const newCondition = ['!=', property, value];

		// If no existing filter, create a simple one
		if (!filter) {
			return newCondition;
		}

		// If filter is not an array, wrap it
		if (!Array.isArray(filter)) {
			return ['all', filter, newCondition];
		}

		// If it's already an 'all' filter, append to it
		if (filter[0] === 'all') {
			return [...filter, newCondition];
		}

		// For any other filter type, wrap it with 'all'
		return ['all', filter, newCondition];
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
	<button {disabled} class={layerActive ? 'layerOn' : 'layerOff'} onclick={handleToggle}>
		<div class="legend-item" {id}>
			{#if icon}
				<span class="legend-icon">
					<Icon {icon} color={bgcolor} />
				</span>
			{:else}
				<span
					class={variant}
					style="background-color: {bgcolor}; box-shadow: inset 0 0 0 2px {bordercolor};"
				></span>
			{/if}{label}
		</div>
	</button>
{:else}
	<div class="legend-item">
		<span
			class={variant}
			style="background-color: {bgcolor}; box-shadow:inset 0px 0px 0px 2px {bordercolor}; border-color: {bordercolor};"
		></span>{label}
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

	.legend-icon {
		width: 18px;
		height: 18px;
		margin-right: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		box-shadow: none;
	}
</style>
