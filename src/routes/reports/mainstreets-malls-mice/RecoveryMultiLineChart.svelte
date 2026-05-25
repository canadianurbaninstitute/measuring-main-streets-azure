<script>
	import { Html, LayerCake, Svg, flatten, groupLonger } from 'layercake';
	import '../../styles.css';

	import { format } from 'd3-format';
	import { scaleOrdinal } from 'd3-scale';
	import { timeFormat, timeParse } from 'd3-time-format';

	import MultiSelect from 'svelte-multiselect';
	import AxisX from '../../lib/ui/chartcomponents/AxisX.svelte';
	import AxisY from '../../lib/ui/chartcomponents/AxisY.svelte';
	import MultiLine from '../../lib/ui/chartcomponents/MultiLine.svelte';
	import SharedTooltip from '../../lib/ui/chartcomponents/SharedTooltip.html.svelte';
	import LegendItem from '../../lib/ui/legends/LegendItem.svelte';
	// Data
	import data from '../../lib/data/reportdata/mainstreets-malls-mice/recovery-full.csv';

	// Props
	let {
		dataset,
		title = 'Visitor Levels (%) relative to the same month in 2019',
		height = '500px'
	} = $props();

	/* Column keys */
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

	/* Colors & Dynamic Chart Data State */
	let seriesColors = $state(['#58E965', '#DB3069', '#002940', '#00ADF2']);
	let newLineSeriesColors = $state(['#58E965', '#DB3069', '#002940', '#00ADF2']);
	const seriesColorsFaded = ['#ddd'];

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

	/* Build flat options for svelte-multiselect */
	const rawGroups = dataset.casestudies();

	const casestudyOptions = rawGroups.flatMap((g) =>
		g.options.map((o) => {
			const col = matchCsvKey(o);
			return {
				label: `${o.text} (${g.label})`,
				value: col ?? o.value,
				group: g.label,
				shortLabel: o.text
			};
		})
	);

	function matchCsvKey(o) {
		const row = data[0];
		if (o.value in row) return o.value;
		if (o.text in row) return o.text;
		const norm = o.text.replace(/\s+/g, '');
		if (norm in row) return norm;
		return null;
	}

	/* Two-way binding target for MultiSelect */
	let selectedOptions = $state([]);

	/* Derive the *data column* names to plot */
	let selectedValues = $derived(
		selectedOptions.map((o) => o.value).filter((v) => v && v in data[0])
	);

	/* Labels for legend (display only) */
	let selectedLabels = $derived(selectedOptions.map((o) => o.shortLabel ?? o.label));

	/* Static background data */
	const groupedDataCategories = groupLonger(data, intialSeriesNames, {
		groupTo: zKey,
		valueTo: yKey
	});

	/* Foreground data states */
	let groupedData = $state(groupedDataCategories);
	let filteredData = $state(buildFilteredData(intialSeriesNames));

	/* Svelte 5 Effect to replace legacy reactive statement ($:) */
	$effect(() => {
		updateFromSelection(selectedValues);
	});

	function updateFromSelection(values) {
		if (!values || values.length === 0) {
			seriesColors = ['#58E965', '#DB3069', '#002940', '#00ADF2'];
			newLineSeriesColors = ['#58E965', '#DB3069', '#002940', '#00ADF2'];

			groupedData = groupLonger(data, intialSeriesNames, {
				groupTo: zKey,
				valueTo: yKey
			});

			filteredData = buildFilteredData(intialSeriesNames);
			return;
		}

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
</script>

<div class="chart-container">
	<h4>{title}</h4>

	<div class="controls">
		<MultiSelect
			bind:selected={selectedOptions}
			options={casestudyOptions}
			placeholder="Add a street"
			removeAllTitle="Clear"
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

	<div class="chart" style="min-height: {height}">
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
		position: relative;
	}

	.chart-container {
		display: flex;
		flex-direction: column;
		gap: 2em;
		border: 1px solid #eee;
		padding: 1em;
		border-radius: 1em;
		box-sizing: border-box;
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

	:global(div.multiselect) {
		--sms-remove-btn-hover-color: var(--brandDarkBlue);
	}
</style>
