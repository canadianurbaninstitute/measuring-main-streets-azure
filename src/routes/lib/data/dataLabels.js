// Canadian French translations for category labels that appear inside chart data
// (case study data files, report CSVs, …). Use `localizeRows()` to translate the string values of
// a data array before passing it to a chart:
//
//   import { localizeRows } from '../../../lib/data/dataLabels';
//   const fr = getLang() === 'fr';
//   const businessmixData = localizeRows(businessmix, fr);
//
// Values without a translation are returned unchanged (place names, numbers, …).

/** @type {Record<string, string>} */
export const LABELS_FR = {
	// Business mix
	'Food and Drink': 'Restauration et boissons',
	Retail: 'Commerce de détail',
	'Local Services': 'Services de proximité',

	// Civic infrastructure mix
	'Arts and Culture': 'Arts et culture',
	Education: 'Éducation',
	'Government and Community Services': 'Services gouvernementaux et communautaires',
	Healthcare: 'Santé',
	'Recreation Facilities': 'Installations récréatives',

	// Areas
	'Ten Minute Walk': 'Rayon de 10 minutes de marche',
	'Montreal RMR': 'RMR de Montréal',

	// Housing
	'Pre 1960': 'Avant 1960',
	'Pré-1960': 'Avant 1960',
	'After 2021': 'Après 2021',
	'Single-Detached': 'Maisons individuelles',
	'Semi-Detached': 'Maisons jumelées',
	Row: 'Maisons en rangée',
	'High-rise Apartment': 'Appartements (5 étages et plus)',
	'Low-rise Apartment': 'Appartements (moins de 5 étages)',
	Duplex: 'Duplex',

	// Days of the week
	Sunday: 'Dimanche',
	Monday: 'Lundi',
	Tuesday: 'Mardi',
	Wednesday: 'Mercredi',
	Thursday: 'Jeudi',
	Friday: 'Vendredi',
	Saturday: 'Samedi',

	// Time of day
	'12am - 6am': '0 h – 6 h',
	'6am - 9am': '6 h – 9 h',
	'9am - 12pm': '9 h – 12 h',
	'12pm - 3pm': '12 h – 15 h',
	'3pm - 6pm': '15 h – 18 h',
	'6pm - 9pm': '18 h – 21 h',
	'9pm - 12am': '21 h – 0 h',

	// Visitor types
	Resident: 'Résident',
	'Recurring Visitor': 'Visiteur récurrent',
	'Infrequent Visitor': 'Visiteur occasionnel',
	Recurring: 'Récurrent',
	Infrequent: 'Occasionnel',
	Visitor: 'Visiteur',
	Residents: 'Résidents',
	Visitors: 'Visiteurs'
};

const CMA_PATTERN = /^(.+?) (CMA|RMR)$/;
const CITY_NAMES_FR = { Montreal: 'Montréal', 'Quebec City': 'Québec' };

/**
 * Translate a single chart label to Canadian French. Unknown labels are returned unchanged.
 * @template T
 * @param {T} value
 * @param {boolean} [fr=true] translate only when true
 * @returns {T}
 */
export function translateLabel(value, fr = true) {
	if (!fr || typeof value !== 'string') return value;
	if (value in LABELS_FR) return /** @type {T} */ (/** @type {unknown} */ (LABELS_FR[value]));
	const cma = value.match(CMA_PATTERN);
	if (cma) {
		const city = CITY_NAMES_FR[/** @type {keyof typeof CITY_NAMES_FR} */ (cma[1])] ?? cma[1];
		return /** @type {T} */ (/** @type {unknown} */ (`RMR de ${city}`));
	}
	return value;
}

/**
 * Return a copy of `rows` with every string value translated with `translateLabel`.
 * Field names (object keys) are not changed, so chart `xKey`/`yKey`/`zKey` props keep working.
 * @template {Record<string, unknown>} R
 * @param {R[]} rows
 * @param {boolean} [fr=true] translate only when true (returns `rows` untouched otherwise)
 * @returns {R[]}
 */
export function localizeRows(rows, fr = true) {
	if (!fr || !Array.isArray(rows)) return rows;
	return rows.map(
		(row) =>
			/** @type {R} */ (
				Object.fromEntries(
					Object.entries(row).map(([key, value]) => [key, translateLabel(value, true)])
				)
			)
	);
}
