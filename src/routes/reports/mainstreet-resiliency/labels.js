// Canadian French display labels for the Main Street Resiliency report charts.
// The CSV values stay untouched (they are used as keys / band-scale domains);
// translate them at display time with `frName()`.

import { timeFormatLocale } from 'd3-time-format';

/** @type {Record<string, string>} */
const NAMES_FR = {
	'97 Street Downtown': '97 Street (centre-ville)',
	'104 Street Downtown': '104 Street (centre-ville)',
	'Downtown Brampton': 'Centre-ville de Brampton',
	'Downtown Yonge': 'Yonge (centre-ville)',
	'Boulevard St. Martin': 'Boulevard Saint-Martin',
	'Fairview Pointe Claire': 'Fairview Pointe-Claire',
	'Jean Talon': 'Jean-Talon',
	'Mall Champlain': 'Mail Champlain',
	'Mont Royal': 'Mont-Royal',
	'Rue Sainte Catherine': 'Rue Sainte-Catherine',
	'Rue St. Anne': 'Rue Sainte-Anne',
	'Rue St. Charles': 'Rue Saint-Charles',
	'Rue St. Hubert': 'Rue Saint-Hubert',
	'Rue St. Paul': 'Rue Saint-Paul',
	'St. Denis': 'Saint-Denis',
	'St. Eustache': 'Saint-Eustache'
};

/**
 * @param {string} name
 * @param {boolean} fr
 */
export function frName(name, fr) {
	return fr ? (NAMES_FR[name] ?? name) : name;
}

/** d3 time formatting with Canadian French month names. */
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
		'juil.',
		'août',
		'sept.',
		'oct.',
		'nov.',
		'déc.'
	]
});
