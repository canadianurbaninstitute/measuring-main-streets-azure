// Locale-aware default formatters for the chart components. English output matches the previous
// d3-format defaults exactly; Canadian French uses a comma as decimal separator, a non-breaking
// space as thousands separator and a non-breaking space before `%`.

import { format as d3Format } from 'd3-format';
import { timeFormat, timeFormatLocale } from 'd3-time-format';
import { formatNumberFor } from '../../i18n-core';

export const NBSP = ' ';

/** `:` with the non-breaking space French typography needs before it. @param {boolean} fr */
export const colon = (fr) => (fr ? `${NBSP}:` : ':');

/** 1234.5 -> '1,234.5' / '1 234,5'. @param {any} d @param {boolean} fr */
export function fmtComma(d, fr) {
	return fr ? formatNumberFor('fr', +d) : d3Format(',')(d);
}

/** 45.25 -> '45.3%' / '45,3 %'. @param {any} d @param {boolean} fr */
export function fmtPct1(d, fr) {
	return fr
		? formatNumberFor('fr', +d, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + NBSP + '%'
		: d3Format(',.1f')(d) + '%';
}

const frLocale = timeFormatLocale({
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

/** d3 `timeFormat` in the page language. @param {string} specifier @param {boolean} fr */
export function localeTimeFormat(specifier, fr) {
	return fr ? frLocale.format(specifier) : timeFormat(specifier);
}
