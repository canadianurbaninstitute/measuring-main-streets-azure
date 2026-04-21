<script>
	import StackedBar from '../../../lib/ui/charts/StackedBar.svelte';

	let { visible } = $props();

	const data = [
		{ activity: 'Leisure', densification: 36.3, individuality: 63.7 },
		{ activity: 'Accessibility', densification: 45.9, individuality: 54.1 },
		{ activity: 'Neighbours', densification: 64.9, individuality: 35.1 },
		{ activity: 'Home size', densification: 63.0, individuality: 37.0 },
		{ activity: 'Shopping', densification: 59.3, individuality: 40.1 },
		{ activity: 'Road usage', densification: 74.5, individuality: 25.5 },
		{ activity: 'Road space', densification: 52.8, individuality: 47.3 }
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
