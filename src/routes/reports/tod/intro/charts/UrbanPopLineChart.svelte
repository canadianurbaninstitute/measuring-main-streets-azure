<script>
	import MultiLineChart from '../../../mainstreets-malls-mice/MultiLineChart.svelte';

	const data = [
		{
			date: '2001-01-01',
			'Higher order transit regions': 0,
			'All other urban regions >100,000 pop.': 0,
			'Urban regions 10,000 to 100,000 pop.': 0,
			'Non-urban': 0
		},
		{
			date: '2002-01-01',
			'Higher order transit regions': 1.798184215,
			'All other urban regions >100,000 pop.': 0.824799439,
			'Urban regions 10,000 to 100,000 pop.': 0.275765632,
			'Non-urban': -0.113598823
		},
		{
			date: '2003-01-01',
			'Higher order transit regions': 3.156461229,
			'All other urban regions >100,000 pop.': 1.627573721,
			'Urban regions 10,000 to 100,000 pop.': 0.830399704,
			'Non-urban': -0.105620023
		},
		{
			date: '2004-01-01',
			'Higher order transit regions': 4.533677962,
			'All other urban regions >100,000 pop.': 2.477608184,
			'Urban regions 10,000 to 100,000 pop.': 1.453886531,
			'Non-urban': -0.012166379
		},
		{
			date: '2005-01-01',
			'Higher order transit regions': 6.027768907,
			'All other urban regions >100,000 pop.': 3.17297141,
			'Urban regions 10,000 to 100,000 pop.': 2.052728209,
			'Non-urban': 0.060590635
		},
		{
			date: '2006-01-01',
			'Higher order transit regions': 7.656778748,
			'All other urban regions >100,000 pop.': 4.029664642,
			'Urban regions 10,000 to 100,000 pop.': 2.643916298,
			'Non-urban': 0.026331766
		},
		{
			date: '2007-01-01',
			'Higher order transit regions': 9.120864072,
			'All other urban regions >100,000 pop.': 4.861617989,
			'Urban regions 10,000 to 100,000 pop.': 3.368613722,
			'Non-urban': 0.207707315
		},
		{
			date: '2008-01-01',
			'Higher order transit regions': 10.73497125,
			'All other urban regions >100,000 pop.': 5.841498435,
			'Urban regions 10,000 to 100,000 pop.': 4.16689199,
			'Non-urban': 0.485517787
		},
		{
			date: '2009-01-01',
			'Higher order transit regions': 12.52673373,
			'All other urban regions >100,000 pop.': 6.895239988,
			'Urban regions 10,000 to 100,000 pop.': 4.81576273,
			'Non-urban': 0.706546081
		},
		{
			date: '2010-01-01',
			'Higher order transit regions': 14.20720503,
			'All other urban regions >100,000 pop.': 8.000646754,
			'Urban regions 10,000 to 100,000 pop.': 5.504378947,
			'Non-urban': 1.039105258
		},
		{
			date: '2011-01-01',
			'Higher order transit regions': 15.72415382,
			'All other urban regions >100,000 pop.': 9.030911881,
			'Urban regions 10,000 to 100,000 pop.': 6.18353899,
			'Non-urban': 1.170608993
		},
		{
			date: '2012-01-01',
			'Higher order transit regions': 17.42061685,
			'All other urban regions >100,000 pop.': 10.19064737,
			'Urban regions 10,000 to 100,000 pop.': 7.0580872,
			'Non-urban': 1.267285176
		},
		{
			date: '2013-01-01',
			'Higher order transit regions': 19.09855952,
			'All other urban regions >100,000 pop.': 11.24614752,
			'Urban regions 10,000 to 100,000 pop.': 7.743246003,
			'Non-urban': 1.517264626
		},
		{
			date: '2014-01-01',
			'Higher order transit regions': 20.7042546,
			'All other urban regions >100,000 pop.': 12.26543421,
			'Urban regions 10,000 to 100,000 pop.': 8.434048959,
			'Non-urban': 1.749149603
		},
		{
			date: '2015-01-01',
			'Higher order transit regions': 21.86717587,
			'All other urban regions >100,000 pop.': 13.27650843,
			'Urban regions 10,000 to 100,000 pop.': 8.903341073,
			'Non-urban': 1.913430183
		},
		{
			date: '2016-01-01',
			'Higher order transit regions': 23.5261037,
			'All other urban regions >100,000 pop.': 14.89983078,
			'Urban regions 10,000 to 100,000 pop.': 9.540893957,
			'Non-urban': 2.337461228
		},
		{
			date: '2017-01-01',
			'Higher order transit regions': 25.26624826,
			'All other urban regions >100,000 pop.': 16.5899457,
			'Urban regions 10,000 to 100,000 pop.': 10.40303094,
			'Non-urban': 2.821445293
		},
		{
			date: '2018-01-01',
			'Higher order transit regions': 27.43013303,
			'All other urban regions >100,000 pop.': 18.45583504,
			'Urban regions 10,000 to 100,000 pop.': 11.42400207,
			'Non-urban': 3.476068853
		},
		{
			date: '2019-01-01',
			'Higher order transit regions': 29.73971469,
			'All other urban regions >100,000 pop.': 20.1968127,
			'Urban regions 10,000 to 100,000 pop.': 12.46296948,
			'Non-urban': 4.161004964
		},
		{
			date: '2020-01-01',
			'Higher order transit regions': 31.33307329,
			'All other urban regions >100,000 pop.': 21.65277801,
			'Urban regions 10,000 to 100,000 pop.': 13.29679705,
			'Non-urban': 4.886162502
		},
		{
			date: '2021-01-01',
			'Higher order transit regions': 31.63701635,
			'All other urban regions >100,000 pop.': 22.76953883,
			'Urban regions 10,000 to 100,000 pop.': 14.29285707,
			'Non-urban': 5.981308927
		},
		{
			date: '2022-01-01',
			'Higher order transit regions': 34.29631935,
			'All other urban regions >100,000 pop.': 25.648961,
			'Urban regions 10,000 to 100,000 pop.': 15.81012951,
			'Non-urban': 7.108336089
		},
		{
			date: '2023-01-01',
			'Higher order transit regions': 39.00340277,
			'All other urban regions >100,000 pop.': 29.43066336,
			'Urban regions 10,000 to 100,000 pop.': 17.8341346,
			'Non-urban': 8.089228843
		},
		{
			date: '2024-01-01',
			'Higher order transit regions': 44.20601081,
			'All other urban regions >100,000 pop.': 33.5179861,
			'Urban regions 10,000 to 100,000 pop.': 20.17057753,
			'Non-urban': 9.184582062
		},
		{
			date: '2025-01-01',
			'Higher order transit regions': 45.53657926,
			'All other urban regions >100,000 pop.': 35.16808012,
			'Urban regions 10,000 to 100,000 pop.': 21.24305525,
			'Non-urban': 9.939397302
		}
	];
</script>

<MultiLineChart
	{data}
	title="Urban Population Growth, 2001-2025"
	yDomain={[-5, 60]}
	seriesConfig={[
		{
			key: 'Higher order transit regions',
			label: 'Higher order transit regions',
			color: '#002940'
		},
		{
			key: 'All other urban regions >100,000 pop.',
			label: 'All other urban regions >100,000 pop.',
			color: '#DB3069'
		},
		{
			key: 'Urban regions 10,000 to 100,000 pop.',
			label: 'Urban regions 10,000 to 100,000 pop.',
			color: '#43b171'
		},
		{
			key: 'Non-urban',
			label: 'Non-urban',
			color: '#f45d01'
		}
	]}
/>
