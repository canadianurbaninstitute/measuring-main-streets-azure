// The downtowns the Core Report profiles. `key` links every dataset (census
// rows, boundaries, size groups); `name` is how the explorer labels a city.
// scripts/build-core-series.mjs matches these to sdsc-data's downtown names.

export const CORE_CITIES = [
	{ key: 'stjohns', name: "St. John's", province: 'NL' },
	{ key: 'halifax', name: 'Halifax', province: 'NS' },
	{ key: 'moncton', name: 'Moncton', province: 'NB' },
	{ key: 'montreal', name: 'Montréal', province: 'QC' },
	{ key: 'ottawa', name: 'Ottawa', province: 'ON' },
	{ key: 'gatineau', name: 'Gatineau', province: 'QC' },
	{ key: 'toronto', name: 'Toronto', province: 'ON' },
	{ key: 'hamilton', name: 'Hamilton', province: 'ON' },
	{ key: 'london', name: 'London', province: 'ON' },
	{ key: 'winnipeg', name: 'Winnipeg', province: 'MB' },
	{ key: 'saskatoon', name: 'Saskatoon', province: 'SK' },
	{ key: 'lethbridge', name: 'Lethbridge', province: 'AB' },
	{ key: 'calgary', name: 'Calgary', province: 'AB' },
	{ key: 'edmonton', name: 'Edmonton', province: 'AB' },
	{ key: 'vancouver', name: 'Vancouver', province: 'BC' }
];
