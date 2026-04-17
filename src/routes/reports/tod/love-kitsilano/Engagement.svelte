<script>
	import BarChart from '../../../lib/ui/charts/BarChart.svelte';

	let { visible } = $props();

	const totalQuestions = [
		{ station: 'cooksville', value: 1499 },
		{ station: 'northfield', value: 1321 },
		{ station: 'kitsilano', value: 3283 }
	];
	const totalRespondents = [
		{ station: 'cooksville', value: 144 },
		{ station: 'northfield', value: 119 },
		{ station: 'kitsilano', value: 310 }
	];
	const totalLinks = [
		{ station: 'cooksville', value: 75 },
		{ station: 'northfield', value: 64 },
		{ station: 'kitsilano', value: 90 }
	];
	const totalPostalCodes = [
		{ station: 'cooksville', value: 86 },
		{ station: 'northfield', value: 70 },
		{ station: 'kitsilano', value: 197 }
	];
	const totalCommunityPollStatements = [
		{ station: 'cooksville', value: 66 },
		{ station: 'northfield', value: 37 },
		{ station: 'kitsilano', value: 98 }
	];
	const totalCommunityPollVotes = [
		{ station: 'cooksville', value: 1651 },
		{ station: 'northfield', value: 1126 },
		{ station: 'kitsilano', value: 3414 }
	];

	const seriesConfig = [
		{ key: 'cooksville', label: 'Cooksville', color: '#00adf2' },
		{ key: 'northfield', label: 'Northfield', color: '#00adf2' },
		{ key: 'kitsilano', label: 'Kitsilano', color: '#f45d01' }
	];
</script>

<div class="grid grid-cols-2 grid-rows-3 w-full h-full gap-1 p-0">
	<BarChart
		title="Total Questions Answered"
		data={totalQuestions}
		xKey="value"
		yKey="station"
		highlightValue="kitsilano"
		{visible}
		xTicks={2}
		showLegend={false}
		paddingLeft={60}
		paddingBottom={40}
		paddingRight={0}
		paddingTop={0}
		barPadding={0.1}
		titleFontSize="0.95rem"
		showTooltip={true}
		minHeight="100px"
		formatLabelX={(d) => d}
		formatLabelY={(d) => d.charAt(0).toUpperCase() + d.slice(1)}
	/>
	<BarChart
		title="Total Respondents"
		data={totalRespondents}
		xKey="value"
		yKey="station"
		{visible}
		xTicks={3}
		showLegend={false}
		paddingLeft={60}
		paddingBottom={20}
		paddingRight={0}
		paddingTop={0}
		barPadding={0.1}
		titleFontSize="0.95rem"
		showTooltip={true}
		minHeight="100px"
		highlightValue="kitsilano"
		formatLabelY={(d) => d.charAt(0).toUpperCase() + d.slice(1)}
	/>
	<BarChart
		title="Total Unique Links"
		data={totalLinks}
		xKey="value"
		yKey="station"
		{visible}
		xTicks={3}
		wrapLabels={true}
		paddingLeft={60}
		paddingBottom={20}
		paddingRight={0}
		paddingTop={0}
		barPadding={0.1}
		highlightValue="kitsilano"
		titleFontSize="0.95rem"
		showTooltip={true}
		minHeight="100px"
		formatLabelX={(d) => d}
		formatLabelY={(d) => d.charAt(0).toUpperCase() + d.slice(1)}
	/>
	<BarChart
		title="Total Postal Codes"
		data={totalPostalCodes}
		xKey="value"
		yKey="station"
		highlightValue="kitsilano"
		{visible}
		xTicks={3}
		wrapLabels={true}
		paddingLeft={60}
		paddingBottom={20}
		paddingRight={0}
		paddingTop={0}
		barPadding={0.1}
		titleFontSize="0.95rem"
		showTooltip={true}
		minHeight="100px"
		formatLabelX={(d) => d}
		formatLabelY={(d) => d.charAt(0).toUpperCase() + d.slice(1)}
	/>
	<BarChart
		title="Community Poll Statements"
		data={totalCommunityPollStatements}
		xKey="value"
		yKey="station"
		highlightValue="kitsilano"
		{visible}
		xTicks={3}
		showLegend={false}
		wrapLabels={true}
		paddingLeft={60}
		paddingBottom={40}
		paddingRight={0}
		paddingTop={0}
		barPadding={0.1}
		titleFontSize="0.95rem"
		showTooltip={true}
		minHeight="100px"
		formatLabelX={(d) => d}
		formatLabelY={(d) => d.charAt(0).toUpperCase() + d.slice(1)}
	/>
	<BarChart
		title="Community Poll Votes"
		data={totalCommunityPollVotes}
		xKey="value"
		yKey="station"
		highlightValue="kitsilano"
		{visible}
		xTicks={2}
		showLegend={false}
		wrapLabels={true}
		paddingLeft={60}
		paddingBottom={40}
		paddingRight={0}
		paddingTop={0}
		barPadding={0.1}
		titleFontSize="0.95rem"
		showTooltip={true}
		minHeight="100px"
		formatLabelX={(d) => d}
		formatLabelY={(d) => d.charAt(0).toUpperCase() + d.slice(1)}
	/>
</div>
