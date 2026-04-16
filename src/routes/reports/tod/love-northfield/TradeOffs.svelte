<script>
	import StackedBar from '../../../lib/ui/charts/StackedBar.svelte';

	let { visible } = $props();

	const data = [
		{ activity: 'Leisure', densification: 50.6, individuality: 49.4 },
		{ activity: 'Accessibility', densification: 62.2, individuality: 37.8 },
		{ activity: 'Neighbours', densification: 52.3, individuality: 47.7 },
		{ activity: 'Home size', densification: 58.6, individuality: 41.4 },
		{ activity: 'Shopping', densification: 69.3, individuality: 30.7 },
		{ activity: 'Road usage', densification: 83.7, individuality: 16.3 },
		{ activity: 'Road space', densification: 63.5, individuality: 36.5 }
	];

	const seriesConfig = [
		{ key: 'densification', label: 'Favours Densification', color: '#00adf2' },
		{ key: 'individuality', label: 'Favours Individuality', color: '#f45d01' }
	];
</script>

<StackedBar
	{data}
	{seriesConfig}
	yKey="activity"
	minHeight="300px"
	{visible}
	xTicks={6}
	xLabel="Percent"
	wrapLabels={true}
	showTooltip={true}
	formatLabelX={(d) => `${d}%`}
	padding={{ top: 10, right: 30, bottom: 30, left: 70 }}
/>
