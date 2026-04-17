<script>
	import StackedBar from '../../../lib/ui/charts/StackedBar.svelte';

	let { visible } = $props();

	const data = [
		{ activity: 'Leisure', densification: 47.8, individuality: 52.3 },
		{ activity: 'Accessibility', densification: 45, individuality: 55 },
		{ activity: 'Neighbours', densification: 31.5, individuality: 68.5 },
		{ activity: 'Home size', densification: 76.4, individuality: 23.6 },
		{ activity: 'Shopping', densification: 83.3, individuality: 16.7 },
		{ activity: 'Road usage', densification: 83.2, individuality: 16.8 },
		{ activity: 'Road space', densification: 63.2, individuality: 36.8 }
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
