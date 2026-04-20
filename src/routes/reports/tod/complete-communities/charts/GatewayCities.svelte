<script>
	import PieChart from '../../../../lib/ui/charts/PieChart.svelte';

	let { visible } = $props();

	const topLevel = [
		{ label: 'Transit Regions', value: 77.6, color: '#00adf2', drilldown: true },
		{ label: 'Other Census Metropolitan Areas', value: 15.0, color: '#7c3aed' },
		{ label: 'Census Agglomerations', value: 4.3, color: '#10b981' },
		{ label: 'Non-urban', value: 3.2, color: '#f43f5e' }
	];

	const transitRegions = [
		{ label: 'Greater Golden Horseshoe', value: 37.9, color: '#00adf2' },
		{ label: 'Montreal', value: 13.6, color: '#58e965' },
		{ label: 'BC Lower Mainland', value: 12.7, color: '#DB3069' },
		{ label: 'Calgary', value: 5.8, color: '#002940' },
		{ label: 'Edmonton', value: 4.1, color: '#ff007f' },
		{ label: 'Ottawa', value: 3.5, color: '#f59e0b' }
	];
</script>

<PieChart
	data={topLevel}
	drilldownData={{
		'Transit Regions': transitRegions
	}}
	{visible}
	xKey="label"
	yKey="value"
	title="Share of immigration by geography"
	showTooltip={true}
	explode={['Transit Regions']}
/>
