// Canadian French formatters and display labels shared by the report charts in this folder
// (also used by the Toronto, Edmonton and Montreal regional reports through
// RecoveryMultiLineChart). English output does not use this module.

import { formatLocale } from 'd3-format';
import { timeFormatLocale } from 'd3-time-format';

export const NBSP = ' ';

export const frNumberLocale = formatLocale({
	decimal: ',',
	thousands: NBSP,
	grouping: [3],
	currency: ['', NBSP + '$']
});

export const frTimeLocale = timeFormatLocale({
	dateTime: '%A %e %B %Y à %X',
	date: '%Y-%m-%d',
	time: '%H:%M:%S',
	periods: ['', ''],
	days: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
	shortDays: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
	months: [
		'janvier',
		'février',
		'mars',
		'avril',
		'mai',
		'juin',
		'juillet',
		'août',
		'septembre',
		'octobre',
		'novembre',
		'décembre'
	],
	shortMonths: [
		'janv.',
		'févr.',
		'mars',
		'avr.',
		'mai',
		'juin',
		'juill.',
		'août',
		'sept.',
		'oct.',
		'nov.',
		'déc.'
	]
});

/** Axis label for a percentage value: 50 -> '50 %'. @param {number} d */
export const frPercentAxis = (d) => frNumberLocale.format('~s')(d) + NBSP + '%';

/** Tooltip value for a percentage: 45.6 -> '46 %'. @param {number} d */
export const frPercentValue = (d) => frNumberLocale.format('.0f')(d) + NBSP + '%';

/** Plain number with French separators: 0.25 -> '0,25', 1000 -> '1 000'. @param {number} d */
export const frNumber = (d) => frNumberLocale.format(',')(d);

/** Main street categories (CSV column names / `ms_type` values) shown in legends and tooltips. */
export const CATEGORY_LABELS_FR = {
	'downtown main streets': 'Rues principales de centre-ville',
	malls: 'Centres commerciaux',
	'neighbourhood main streets': 'Rues principales de quartier',
	'small town main streets': 'Rues principales de petites villes'
};

export const REGION_LABELS_FR = {
	Montreal: 'Montréal',
	Toronto: 'Toronto',
	Edmonton: 'Edmonton'
};
