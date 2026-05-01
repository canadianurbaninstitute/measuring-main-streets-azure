<script>
	import StackedBar from '../../../../lib/ui/charts/StackedBar.svelte';

	let { visible } = $props();
	const commuteData = [
		{
			city: 'Toronto',
			'Less than 15 minutes': 18.2,
			'15 to 29 minutes': 32.3,
			'30 to 44 minutes': 26.9,
			'45 to 59 minutes': 10.8,
			'60 minutes and over': 11.6
		},
		{
			city: 'Vancouver',
			'Less than 15 minutes': 20.7,
			'15 to 29 minutes': 34.9,
			'30 to 44 minutes': 26.4,
			'45 to 59 minutes': 9.9,
			'60 minutes and over': 8.2
		},
		{
			city: 'Montréal',
			'Less than 15 minutes': 21.6,
			'15 to 29 minutes': 35.5,
			'30 to 44 minutes': 25.1,
			'45 to 59 minutes': 9.7,
			'60 minutes and over': 8.0
		},
		{
			city: 'Ottawa-Gatineau',
			'Less than 15 minutes': 26.7,
			'15 to 29 minutes': 38.9,
			'30 to 44 minutes': 21.8,
			'45 to 59 minutes': 7.1,
			'60 minutes and over': 5.5
		},
		{
			city: 'Calgary',
			'Less than 15 minutes': 22.0,
			'15 to 29 minutes': 44.9,
			'30 to 44 minutes': 22.7,
			'45 to 59 minutes': 5.2,
			'60 minutes and over': 5.1
		},
		{
			city: 'Edmonton',
			'Less than 15 minutes': 24.4,
			'15 to 29 minutes': 42.6,
			'30 to 44 minutes': 22.3,
			'45 to 59 minutes': 5.9,
			'60 minutes and over': 4.8
		},
		{
			city: 'Canada',
			'Less than 15 minutes': 32.0,
			'15 to 29 minutes': 34.8,
			'30 to 44 minutes': 19.1,
			'45 to 59 minutes': 7.0,
			'60 minutes and over': 7.1
		}
	];

	const seriesConfig = [
		{ key: 'Less than 15 minutes', label: '< 15 min', color: '#13612c' },
		{ key: '15 to 29 minutes', label: '15–29 min', color: '#74c800' },
		{ key: '30 to 44 minutes', label: '30–44 min', color: '#f59e0b' },
		{ key: '45 to 59 minutes', label: '45–59 min', color: '#DB3069' },
		{ key: '60 minutes and over', label: '60+ min', color: '#8b1b1d' }
	];
</script>

<StackedBar
	data={commuteData}
	yKey="city"
	{seriesConfig}
	title="Commute times in the largest urban regions"
	minHeight="300px"
	formatLabelX={(d) => d + '%'}
	{visible}
	showTooltip={true}
	padding={{ left: 85, bottom: 20 }}
/>
