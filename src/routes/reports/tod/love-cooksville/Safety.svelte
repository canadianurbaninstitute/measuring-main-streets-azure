<script>
	import StackedBar from '../../../lib/ui/charts/StackedBar.svelte';

	let { visible } = $props();

	const data = [
		{ region: 'Cooksville', safe: 62.6, sometimes: 27.3, unsafe: 10.1 },
		{ region: 'Northfield', safe: 87.7, sometimes: 9.9, unsafe: 2.5 },
		{ region: 'Kitsilano', safe: 90.8, sometimes: 5.5, unsafe: 3.7 }
	];

	const dataWelcome = [
		{ region: 'Cooksville', welcome: 68.5, sometimes: 22.8, unwelcome: 6.5 },
		{ region: 'Northfield', welcome: 81.0, sometimes: 12.7, unwelcome: 5.1 },
		{ region: 'Kitsilano', welcome: 88.8, sometimes: 8.1, unwelcome: 1.7 }
	];

	const seriesConfig = [
		{ key: 'safe', label: 'Generally feels safe', color: '#58e965' },
		{ key: 'sometimes', label: 'Sometimes feels safe', color: '#00adf2' },
		{ key: 'unsafe', label: 'Generally feels unsafe', color: '#db3069' }
	];

	const seriesConfigWelcome = [
		{ key: 'welcome', label: 'Generally feels welcome', color: '#58e965' },
		{ key: 'sometimes', label: 'Sometimes feels welcome', color: '#00adf2' },
		{ key: 'unwelcome', label: 'Generally feels unwelcome', color: '#db3069' }
	];
</script>

<div class="grid grid-cols-1 grid-rows-2 w-full h-full gap-1 p-0">
	<StackedBar
		title="Feels safe"
		{data}
		{seriesConfig}
		yKey="region"
		minHeight="200px"
		{visible}
		xTicks={6}
		wrapLabels={true}
		showTooltip={true}
		formatLabelX={(d) => `${d}%`}
		padding={{ top: 10, right: 30, bottom: 30, left: 70 }}
		showLegend={false}
		xLabel="Percent"
	/>

	<StackedBar
		title="Feels welcome"
		data={dataWelcome}
		seriesConfig={seriesConfigWelcome}
		yKey="region"
		minHeight="200px"
		{visible}
		xTicks={6}
		wrapLabels={true}
		showTooltip={true}
		formatLabelX={(d) => `${d}%`}
		padding={{ top: 10, right: 30, bottom: 30, left: 70 }}
		showLegend={false}
		xLabel="Percent"
	/>
</div>
