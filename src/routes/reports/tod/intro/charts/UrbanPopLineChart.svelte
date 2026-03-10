<script>
	import MultiLineChart from '../../../mainstreets-malls-mice/MultiLineChart.svelte';

	const data = [
		{
			date: '2001-01-01',
			'Higher order transit regions': 100,
			'All other urban regions >100,000 pop.': 100,
			'Urban regions 10,000 to 100,000 pop.': 100,
			'Non-urban': 100
		},
		{
			date: '2002-01-01',
			'Higher order transit regions': 101.7981842,
			'All other urban regions >100,000 pop.': 100.8247994,
			'Urban regions 10,000 to 100,000 pop.': 100.2757656,
			'Non-urban': 99.88640118
		},
		{
			date: '2003-01-01',
			'Higher order transit regions': 103.1564612,
			'All other urban regions >100,000 pop.': 101.6275737,
			'Urban regions 10,000 to 100,000 pop.': 100.8303997,
			'Non-urban': 99.89437998
		},
		{
			date: '2004-01-01',
			'Higher order transit regions': 104.533678,
			'All other urban regions >100,000 pop.': 102.4776082,
			'Urban regions 10,000 to 100,000 pop.': 101.4538865,
			'Non-urban': 99.98783362
		},
		{
			date: '2005-01-01',
			'Higher order transit regions': 106.0277689,
			'All other urban regions >100,000 pop.': 103.1729714,
			'Urban regions 10,000 to 100,000 pop.': 102.0527282,
			'Non-urban': 100.0605906
		},
		{
			date: '2006-01-01',
			'Higher order transit regions': 107.6567787,
			'All other urban regions >100,000 pop.': 104.0296646,
			'Urban regions 10,000 to 100,000 pop.': 102.6439163,
			'Non-urban': 100.0263318
		},
		{
			date: '2007-01-01',
			'Higher order transit regions': 109.1208641,
			'All other urban regions >100,000 pop.': 104.861618,
			'Urban regions 10,000 to 100,000 pop.': 103.3686137,
			'Non-urban': 100.2077073
		},
		{
			date: '2008-01-01',
			'Higher order transit regions': 110.7349712,
			'All other urban regions >100,000 pop.': 105.8414984,
			'Urban regions 10,000 to 100,000 pop.': 104.166892,
			'Non-urban': 100.4855178
		},
		{
			date: '2009-01-01',
			'Higher order transit regions': 112.5267337,
			'All other urban regions >100,000 pop.': 106.89524,
			'Urban regions 10,000 to 100,000 pop.': 104.8157627,
			'Non-urban': 100.7065461
		},
		{
			date: '2010-01-01',
			'Higher order transit regions': 114.207205,
			'All other urban regions >100,000 pop.': 108.0006468,
			'Urban regions 10,000 to 100,000 pop.': 105.5043789,
			'Non-urban': 101.0391053
		},
		{
			date: '2011-01-01',
			'Higher order transit regions': 115.7241538,
			'All other urban regions >100,000 pop.': 109.0309119,
			'Urban regions 10,000 to 100,000 pop.': 106.183539,
			'Non-urban': 101.170609
		},
		{
			date: '2012-01-01',
			'Higher order transit regions': 117.4206169,
			'All other urban regions >100,000 pop.': 110.1906474,
			'Urban regions 10,000 to 100,000 pop.': 107.0580872,
			'Non-urban': 101.2672852
		},
		{
			date: '2013-01-01',
			'Higher order transit regions': 119.0985595,
			'All other urban regions >100,000 pop.': 111.2461475,
			'Urban regions 10,000 to 100,000 pop.': 107.743246,
			'Non-urban': 101.5172646
		},
		{
			date: '2014-01-01',
			'Higher order transit regions': 120.7042546,
			'All other urban regions >100,000 pop.': 112.2654342,
			'Urban regions 10,000 to 100,000 pop.': 108.434049,
			'Non-urban': 101.7491496
		},
		{
			date: '2015-01-01',
			'Higher order transit regions': 121.8671759,
			'All other urban regions >100,000 pop.': 113.2765084,
			'Urban regions 10,000 to 100,000 pop.': 108.9033411,
			'Non-urban': 101.9134302
		},
		{
			date: '2016-01-01',
			'Higher order transit regions': 123.5261037,
			'All other urban regions >100,000 pop.': 114.8998308,
			'Urban regions 10,000 to 100,000 pop.': 109.540894,
			'Non-urban': 102.3374612
		},
		{
			date: '2017-01-01',
			'Higher order transit regions': 125.2662483,
			'All other urban regions >100,000 pop.': 116.5899457,
			'Urban regions 10,000 to 100,000 pop.': 110.4030309,
			'Non-urban': 102.8214453
		},
		{
			date: '2018-01-01',
			'Higher order transit regions': 127.430133,
			'All other urban regions >100,000 pop.': 118.455835,
			'Urban regions 10,000 to 100,000 pop.': 111.4240021,
			'Non-urban': 103.4760689
		},
		{
			date: '2019-01-01',
			'Higher order transit regions': 129.7397147,
			'All other urban regions >100,000 pop.': 120.1968127,
			'Urban regions 10,000 to 100,000 pop.': 112.4629695,
			'Non-urban': 104.161005
		},
		{
			date: '2020-01-01',
			'Higher order transit regions': 131.3330733,
			'All other urban regions >100,000 pop.': 121.652778,
			'Urban regions 10,000 to 100,000 pop.': 113.296797,
			'Non-urban': 104.8861625
		},
		{
			date: '2021-01-01',
			'Higher order transit regions': 131.6370163,
			'All other urban regions >100,000 pop.': 122.7695388,
			'Urban regions 10,000 to 100,000 pop.': 114.2928571,
			'Non-urban': 105.9813089
		},
		{
			date: '2022-01-01',
			'Higher order transit regions': 134.2963193,
			'All other urban regions >100,000 pop.': 125.648961,
			'Urban regions 10,000 to 100,000 pop.': 115.8101295,
			'Non-urban': 107.1083361
		},
		{
			date: '2023-01-01',
			'Higher order transit regions': 139.0034028,
			'All other urban regions >100,000 pop.': 129.4306634,
			'Urban regions 10,000 to 100,000 pop.': 117.8341346,
			'Non-urban': 108.0892288
		},
		{
			date: '2024-01-01',
			'Higher order transit regions': 144.2060108,
			'All other urban regions >100,000 pop.': 133.5179861,
			'Urban regions 10,000 to 100,000 pop.': 120.1705775,
			'Non-urban': 109.1845821
		},
		{
			date: '2025-01-01',
			'Higher order transit regions': 145.5365793,
			'All other urban regions >100,000 pop.': 135.1680801,
			'Urban regions 10,000 to 100,000 pop.': 121.2430553,
			'Non-urban': 109.9393973
		}
	];
</script>

<MultiLineChart
	title="Urban Population Growth, 2001-2025"
	yDomain={[100, 150]}
	chartDataset={data}
/>
