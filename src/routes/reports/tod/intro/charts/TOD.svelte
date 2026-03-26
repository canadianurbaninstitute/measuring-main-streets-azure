<script>
	import ScatterChart from '../../../../lib/ui/charts/ScatterChart.svelte';

	const data = [
		{
			city: 'Burnaby',
			within_800m: 24641,
			beyond_800m: 11945
		},
		{
			city: 'Calgary',
			within_800m: 61995,
			beyond_800m: 125702
		},
		{
			city: 'Edmonton',
			within_800m: 35911,
			beyond_800m: 118136
		},
		{
			city: 'Hamilton',
			within_800m: 5385,
			beyond_800m: 34754
		},
		{
			city: 'Laval',
			within_800m: 4444,
			beyond_800m: 35954
		},
		{
			city: 'Markham',
			within_800m: 9211,
			beyond_800m: 49023
		},
		{
			city: 'Mississauga',
			within_800m: 18062,
			beyond_800m: 38152
		},
		{
			city: 'Montreal',
			within_800m: 97476,
			beyond_800m: 42880
		},
		{
			city: 'New Westminster',
			within_800m: 7130,
			beyond_800m: 5472
		},
		{
			city: 'Ottawa',
			within_800m: 21850,
			beyond_800m: 97755
		},
		{
			city: 'Richmond',
			within_800m: 12705,
			beyond_800m: 14773
		},
		{
			city: 'Richmond Hill',
			within_800m: 3757,
			beyond_800m: 28564
		},
		{
			city: 'Surrey',
			within_800m: 20764,
			beyond_800m: 61752
		},
		{
			city: 'Toronto',
			within_800m: 237871,
			beyond_800m: 56971
		},
		{
			city: 'Vancouver',
			within_800m: 52413,
			beyond_800m: 27637
		},
		{
			city: 'Vaughan',
			within_800m: 12221,
			beyond_800m: 48749
		},
		{
			city: 'Waterloo',
			within_800m: 8616,
			beyond_800m: 10354
		}
	];

	const colors = [
		'#002940',
		'#2a5cac',
		'#007aa6',
		'#00adf2',
		'#43b171',
		'#58e965',
		'#db3069',
		'#f13737',
		'#f1c500',
		'#f45d01',
		'#8a4285'
	];
	const seriesConfig = data.map((d, i) => ({
		key: d.city,
		label: d.city,
		color: colors[i % colors.length]
	}));
</script>

<ScatterChart
	{data}
	{seriesConfig}
	xKey="beyond_800m"
	yKey="within_800m"
	zKey="city"
	showLabels={true}
	labelKey="city"
	showLegend={true}
	padding={{ left: 70, bottom: 40 }}
	title="Transit-Oriented Development by Select Municipalities 2001-2021"
	showTooltip={true}
	xTicks={4}
	xDomain={[0, 150000]}
	yDomain={[0, 250000]}
	xLabel="Net new housing units more than 800m from transit station"
	yLabel="Net new housing units within 800m of transit station"
	referenceLine={{
		x1: 0,
		y1: 0,
		x2: 150000,
		y2: 150000,
		stroke: '#00ADF2',
		strokeDasharray: '4 4'
	}}
/>
