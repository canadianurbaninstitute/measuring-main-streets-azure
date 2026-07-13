<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onDestroy } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';
	import { mapStoreList } from '../../stores/mapStore';

	interface Props {
		label: string;
		variant: 'circle' | 'polygon' | 'line';
		bgcolor?: string;
		bordercolor?: string;
		button?: boolean;
		disabled?: boolean;
		id?: string;
		icon?: string | null;
		targetopacity?: number;
		featuretype?: 'circle' | 'fill' | 'line';
		filterProperty?: string;
		filterValue?: any;
		baseFilter?: any[] | null;
		useFilter?: boolean;
		toggledValues?: Record<string, any[]>;
		section?: string | undefined;
		map?: any;
	}

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
		filterValue,
		baseFilter = null,
		useFilter = false,
		toggledValues = $bindable({}),
		section = undefined,
		map = $bindable()
	}: Props = $props();

	let manualLayerOn = $state(true);

	let layerActive = $derived.by(() => {
		if (!toggledValues || !filterProperty) return manualLayerOn;
		if (!toggledValues[filterProperty]) return true;

		if (Array.isArray(filterValue)) {
			return !filterValue.every((val) => toggledValues[filterProperty].includes(val));
		}

		return !toggledValues[filterProperty].includes(filterValue);
	});

	let unsubscribe: Unsubscriber | undefined;
	if (section) {
		unsubscribe = mapStoreList.subscribe((maps: Record<string, any>) => {
			if (maps[section]) {
				map = maps[section];
			}
		});
	}

	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	});

	function toggleLayerWithFilter() {
		if (map && filterProperty && filterValue !== undefined) {
			let currentFilter = map.getFilter(id);
			const hasWithinFilter =
				currentFilter && Array.isArray(currentFilter) && currentFilter[0] === 'within';

			if (hasWithinFilter) {
				toggleWithPaintProperty();
				return;
			}

			const isFiltered = isValueFiltered(currentFilter, filterProperty, filterValue);

			if (isFiltered) {
				const newFilter = removeValueFromFilter(currentFilter, filterProperty, filterValue);
				map.setFilter(id, newFilter);
			} else {
				const newFilter = addValueToFilter(currentFilter, filterProperty, filterValue);
				map.setFilter(id, newFilter);
			}
		}
	}

	function toggleWithPaintProperty() {
		if (!filterProperty) return;

		if (!toggledValues[filterProperty]) toggledValues[filterProperty] = [];

		const valuesToToggle = Array.isArray(filterValue) ? filterValue : [filterValue];

		if (layerActive) {
			const currentHidden = new Set(toggledValues[filterProperty]);
			valuesToToggle.forEach((val) => currentHidden.add(val));
			toggledValues[filterProperty] = Array.from(currentHidden);
		} else {
			toggledValues[filterProperty] = toggledValues[filterProperty].filter(
				(v) => !valuesToToggle.includes(v)
			);
		}

		updateOpacity();
	}

	function updateOpacity() {
		const conditions: any[] = [];
		if (baseFilter) conditions.push(baseFilter);

		for (const [prop, values] of Object.entries(toggledValues)) {
			if (Array.isArray(values) && values.length > 0) {
				conditions.push(['in', ['get', prop], ['literal', values]]);
			}
		}

		let opacityExpr: any;

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

	function isValueFiltered(filter: any, property: string, value: any): boolean {
		if (!filter) return false;

		if (Array.isArray(filter)) {
			for (let i = 0; i < filter.length; i++) {
				const item = filter[i];
				if (Array.isArray(item) && item[0] === '!=' && item[1] === property && item[2] === value) {
					return true;
				}
				if (Array.isArray(item) && isValueFiltered(item, property, value)) {
					return true;
				}
			}
		}
		return false;
	}

	function removeValueFromFilter(filter: any, property: string, value: any): any {
		if (!filter) return null;
		if (!Array.isArray(filter)) return filter;

		if (filter[0] !== 'all') {
			return filter;
		}

		const filtered = filter.filter((item, index) => {
			if (index === 0) return true;

			if (Array.isArray(item) && item[0] === '!=' && item[1] === property && item[2] === value) {
				return false;
			}
			return true;
		});

		if (filtered.length === 1) {
			return null;
		}

		if (filtered.length === 2) {
			return filtered[1];
		}

		return filtered;
	}

	function addValueToFilter(filter: any, property: string, value: any): any {
		const newCondition = ['!=', property, value];

		if (!filter) {
			return newCondition;
		}

		if (!Array.isArray(filter)) {
			return ['all', filter, newCondition];
		}

		if (filter[0] === 'all') {
			return [...filter, newCondition];
		}

		return ['all', filter, newCondition];
	}

	function toggleLayerVisibility() {
		if (map) {
			manualLayerOn = !manualLayerOn;

			if (!manualLayerOn) {
				map.setPaintProperty(id, `${featuretype}-opacity`, 0);
				if (featuretype === 'circle') {
					map.setPaintProperty(id, `${featuretype}-stroke-opacity`, 0);
				} else if (id === 'case-study-BIAs') {
					map.setLayoutProperty(id, 'visibility', 'none');
				}
			} else {
				map.setPaintProperty(id, `${featuretype}-opacity`, targetopacity);
				if (featuretype === 'circle') {
					map.setPaintProperty(id, `${featuretype}-stroke-opacity`, targetopacity);
				} else if (id === 'case-study-BIAs') {
					map.setLayoutProperty(id, 'visibility', 'visible');
				}
			}
		}
	}

	function handleToggle() {
		if (useFilter) {
			toggleLayerWithFilter();
		} else {
			toggleLayerVisibility();
		}
	}
</script>

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
