<script>
	import { LayerCake, Svg, Html, groupLonger, flatten } from 'layercake';
	import '../../styles.css';

	import { scaleOrdinal } from 'd3-scale';
	import { timeParse, timeFormat } from 'd3-time-format';
	import { format } from 'd3-format';
	import MultiSelect from 'svelte-multiselect';

	import LegendItem from '../../lib/ui/legends/LegendItem.svelte';
	import MultiLine from '../../lib/chartcomponents/MultiLine.svelte';
	import AxisX from '../../lib/chartcomponents/AxisX.svelte';
	import AxisY from '../../lib/chartcomponents/AxisY.svelte';
	import SharedTooltip from '../../lib/chartcomponents/SharedTooltip.html.svelte';

	// Data
	import data from '../../lib/data/reportdata/mainstreets-malls-mice/recovery-full.csv';
	import { dataset } from '../../lib/data/reportdata/mainstreets-malls-mice/selectLabels.js';

	/* --------------------------------------------
	 * Column keys
	 */
	const xKey = 'date';
	const yKey = 'value';
	const zKey = 'ms_type';
	const xKeyCast = timeParse('%Y-%m-%d');

	const intialSeriesNames = [
		'downtown main streets',
		'malls',
		'neighbourhood main streets',
		'small town main streets'
	];

	/* Colors */
	let seriesColors = ['#58E965', '#DB3069', '#002940', '#00ADF2']; // base 4
	let newLineSeriesColors = ['#58E965', '#DB3069', '#002940', '#00ADF2']; // overwritten when selecting
	let seriesColorsFaded = ['#ddd']; // background layer

	/* Cast values in CSV */
	const allColumns = Object.keys(data[0]).filter((d) => d !== xKey);
	data.forEach((d) => {
		d[xKey] = typeof d[xKey] === 'string' ? xKeyCast(d[xKey]) : d[xKey];
		allColumns.forEach((col) => {
			d[col] = +d[col];
		});
	});

	const formatLabelX = timeFormat('%b %Y');
	const formatLabelY = (d) => format(`~s`)(d) + '%';
	const formatValue = (d) => format('.0f')(d) + '%';

	/* ------------------------------------------------
	 * Build flat options for svelte-multiselect
	 * dataset.casestudies() -> [{label:'City', options:[{value,text},...]},...]
	 * MultiSelect needs a flat array of selectable items with a 'label' prop.
	 * We'll retain the city name in a 'group' field for optional display.
	 */
	const rawGroups = dataset.casestudies();

	// helper: pick the key that exists in the CSV (value vs text)
	function matchCsvKey(o) {
		const row = data[0];
		if (o.value in row) return o.value;
		if (o.text in row) return o.text;
		// fallback: try a normalized variant (strip spaces) if needed
		const norm = o.text.replace(/\s+/g, '');
		if (norm in row) return norm;
		return null; // no match; user will see it but selecting won't add a line
	}

	const casestudyOptions = rawGroups.flatMap((g) =>
		g.options.map((o) => {
			const col = matchCsvKey(o);
			return {
				label: `${o.text} (${g.label})`, // what user sees/searches (includes group)
				value: col ?? o.value,            // chart lookup key (best effort)
				group: g.label,                   // keep group metadata if needed elsewhere
				shortLabel: o.text                // clean label for legend
			};
		})
	);

	/* Two-way binding target for MultiSelect */
	let selectedOptions = [];

	/* Derive the *data column* names to plot */
	$: selectedValues = selectedOptions
		.map((o) => o.value)
		.filter((v) => v && v in data[0]); // ignore unmatched

	/* Labels for legend (display only) */
	$: selectedLabels = selectedOptions.map((o) => o.shortLabel ?? o.label);

	/* Data used by charts */
	let groupedDataCategories = groupLonger(data, intialSeriesNames, {
		groupTo: zKey,
		valueTo: yKey
	}); // static grey background lines

	let groupedData = groupedDataCategories; // foreground lines (changes w/ selection)
	let filteredData = buildFilteredData(intialSeriesNames); // drives tooltip

	/* React to selection changes */
	$: updateFromSelection(selectedValues);

	function updateFromSelection(values) {
		if (!values || values.length === 0) {
			// Reset to initial 4 base categories
			seriesColors = ['#58E965', '#DB3069', '#002940', '#00ADF2'];
			newLineSeriesColors = ['#58E965', '#DB3069', '#002940', '#00ADF2'];

			groupedData = groupLonger(data, intialSeriesNames, {
				groupTo: zKey,
				valueTo: yKey
			});

			filteredData = buildFilteredData(intialSeriesNames);
			return;
		}

		// Show base series in grey; highlight selected in blue
		seriesColors = ['#ddd', '#ddd', '#ddd', '#ddd'];
		newLineSeriesColors = ['#00ADF2'];

		groupedData = groupLonger(data, values, {
			groupTo: zKey,
			valueTo: yKey
		});

		filteredData = buildFilteredData(values);
	}

	function buildFilteredData(keys) {
		return data.map((row) => {
			const obj = { date: row.date };
			keys.forEach((k) => {
				obj[k] = row[k];
			});
			return obj;
		});
	}

	/* Optional: inspect event payloads from MultiSelect */
	function handleMultiSelectChange(e) {
		// e.detail.type: 'add' | 'remove' | 'removeAll' | ...
		// e.detail.option / options
		console.log('MultiSelect change:', e.detail);
	}
</script>

<div class="chart-container">
	<h4>Visitor Levels (%) relative to the same month in 2019</h4>

	<div class="controls">
		<MultiSelect
			bind:selected={selectedOptions}
			options={casestudyOptions}
			placeholder="Add a street"
			removeAllTitle="Clear"
			onchange={handleMultiSelectChange}
		/>

		<div class="legend-container">
			<LegendItem variant="line" label="Downtown Main Streets" bordercolor={seriesColors[0]} />
			<LegendItem variant="line" label="Malls" bordercolor={seriesColors[1]} />
			<LegendItem variant="line" label="Neighbourhood Main Streets" bordercolor={seriesColors[2]} />
			<LegendItem variant="line" label="Small Town Main Streets" bordercolor={seriesColors[3]} />

			{#each selectedLabels as lbl}
				<LegendItem variant="line" label={lbl} bordercolor="#00ADF2" />
			{/each}
		</div>
	</div>

	<div class="chart">
		<!-- Background: always show 4 base categories in faded grey -->
		<LayerCake
			position="absolute"
			padding={{ top: 7, right: 10, bottom: 20, left: 25 }}
			x={xKey}
			y={yKey}
			z={zKey}
			yDomain={[0, 160]}
			zScale={scaleOrdinal()}
			zRange={seriesColorsFaded}
			flatData={flatten(groupedDataCategories, 'values')}
			data={groupedDataCategories}
		>
			<Svg>
				<MultiLine />
			</Svg>
		</LayerCake>

		<!-- Foreground: selected case studies (or 4 base categories when none selected) -->
		<LayerCake
			position="absolute"
			padding={{ top: 7, right: 10, bottom: 20, left: 25 }}
			x={xKey}
			y={yKey}
			z={zKey}
			yDomain={[0, 160]}
			zScale={scaleOrdinal()}
			zRange={newLineSeriesColors}
			flatData={flatten(groupedData, 'values')}
			data={groupedData}
		>
			<Svg>
				<AxisX
					gridlines={false}
					ticks={data.filter((_, i) => i % 5 === 0).map((d) => d[xKey])}
					format={formatLabelX}
					tickMarks
					snapLabels
				/>
				<AxisY ticks={4} format={formatLabelY} />
				<MultiLine />
			</Svg>

			<Html>
				<SharedTooltip formatTitle={formatLabelX} dataset={filteredData} {formatValue} />
			</Html>
		</LayerCake>
	</div>
</div>

<style>
	.chart {
		width: 100%;
		height: 500px;
		position: relative;
	}

	.chart-container {
		display: flex;
		flex-direction: column;
		gap: 2em;
		border: 1px solid #eee;
		padding: 1em;
		border-radius: 1em;
	}

	.controls {
		display: flex;
		flex-direction: column;
	}
	.controls:hover {
		cursor: pointer;
	}

	.legend-container {
		display: flex;
		flex-direction: row;
		border-radius: 0.5em;
		border: 1px solid var(--brandGrey);
		margin: 1em 0 0 0;
		padding: 0.5em;
		flex-wrap: wrap;
	}
</style>
