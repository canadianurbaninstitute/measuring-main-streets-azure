// Canadian French display labels for the transit station data (config.json,
// complete-communities-config.ts and values found in the remote station / region data).
//
// Keys are the English values exactly as they appear in the data or config. They are lookup keys
// (Mapbox filters, data keys, icon maps…) and must not be changed: translate only at display time:
//
//   import { trTransit } from '../../lib/data/transitdata/labels.fr';
//   {trTransit(metric.label, fr)}
//
// Values without a translation (station names, most line names…) are returned unchanged.

/** Metric labels from config.json and chart categories built from it. */
export const METRIC_LABELS_FR: Record<string, string> = {
	// age
	'0-19': '0 à 19 ans',
	'20-64': '20 à 64 ans',
	'65+': '65 ans et plus',
	// housing construction year
	'Pre-1960': 'Avant 1960',
	'1961-80': '1961-1980',
	'1981-00': '1981-2000',
	'2000-2020': '2000-2020',
	// dwelling type
	Detached: 'Individuelle',
	'Semi-Detached': 'Jumelée',
	Row: 'En rangée',
	Duplex: 'Duplex',
	'Apt >5': 'App. 5 étages et +',
	'Apt <5': 'App. moins de 5 étages',
	// bedrooms
	Studio: 'Studio',
	'1 Bed': '1 chambre',
	'2 Bed': '2 chambres',
	'3 Bed': '3 chambres',
	'≥ 4 Bed': '4 chambres et +',
	// tenure
	Owner: 'Propriétaires',
	Renter: 'Locataires',
	// business / civic
	'Food and Drink': 'Restauration et boissons',
	Retail: 'Commerce de détail',
	'Local Services': 'Services de proximité',
	Healthcare: 'Santé',
	Education: 'Éducation',
	'Government and Community Services': 'Services gouvernementaux et communautaires',
	Recreation: 'Loisirs',
	// employment
	'Core Amenities': 'Commodités essentielles',
	'Additional Amenities': 'Commodités complémentaires',
	Other: 'Autres',
	Total: 'Total',
	// single metrics
	Population: 'Population',
	Households: 'Ménages',
	'Average Employment Income': 'Revenu d’emploi moyen',
	'Visible Minority': 'Minorités visibles',
	Immigrants: 'Personnes immigrantes',
	Indigenous: 'Autochtones',
	'University Degree': 'Diplôme universitaire',
	'Total Employment': 'Emploi total',
	'Total Dwellings': 'Nombre total de logements',
	'Average Monthly Rent': 'Loyer mensuel moyen',
	'Average Dwelling Value': 'Valeur moyenne des logements',
	'Spending ≥30% of income on shelter': 'Consacrant 30 % ou plus du revenu au logement',
	'Population Density': 'Densité de population',
	'Employment Density': 'Densité d’emploi',
	Water: 'Eau',
	'Green Space': 'Espaces verts',
	Buildings: 'Bâtiments',
	Parking: 'Stationnement',
	'Daily Visits': 'Visites quotidiennes',
	'Average Daily Unique Visitors': 'Visiteurs uniques quotidiens (moyenne)',
	'Main Street Businesses': 'Entreprises sur rue principale',
	'Core Amenities Presence': 'Présence des commodités essentielles',
	'Additional Amenities Presence': 'Présence des commodités complémentaires',
	'Overall Score': 'Note globale',
	'Business Independence Index': 'Indice d’indépendance des entreprises'
};

/** Units from config.json. */
export const UNITS_FR: Record<string, string> = {
	years: 'ans',
	buildings: 'bâtiments',
	dwellings: 'logements',
	apartments: 'appartements',
	people: 'personnes',
	businesses: 'entreprises',
	facilities: 'installations',
	jobs: 'emplois',
	households: 'ménages',
	employees: 'employés',
	units: 'logements',
	'people/km²': 'personnes/km²',
	'employees/km²': 'employés/km²',
	visits: 'visites',
	visitors: 'visiteurs',
	index: 'indice'
};

/** Complete community amenity groups (complete-communities-config.ts). */
export const AMENITY_LABELS_FR: Record<string, string> = {
	// Tier 1 (core)
	Childcare: 'Services de garde',
	'Community Centres': 'Centres communautaires',
	'Convenience Store': 'Dépanneurs',
	Libraries: 'Bibliothèques',
	'Personal and Commercial Banking': 'Services bancaires',
	Pharmacy: 'Pharmacies',
	'Physicians Office': 'Cabinets de médecins',
	'Post Office': 'Bureaux de poste',
	'Primary and Secondary Schools': 'Écoles primaires et secondaires',
	Supermarket: 'Supermarchés',
	// Tier 2 (additional)
	'Appliance TV and Electronics Retailers': 'Magasins d’électroménagers et d’électronique',
	'Baked Goods': 'Boulangeries-pâtisseries',
	'Barber Shop': 'Salons de barbier',
	'Beauty Salon': 'Salons de beauté',
	'Book Stores': 'Librairies',
	'Building Material and Lawn Garden Stores': 'Quincailleries et centres de jardinage',
	'Clothing and Shoe Retailers': 'Magasins de vêtements et de chaussures',
	'Coin Laundry': 'Buanderies libre-service',
	'Community Health and Elderly Care Facilities':
		'Établissements de santé communautaire et de soins aux aînés',
	'Cosmetics and Beauty Supply Retailers': 'Magasins de cosmétiques et de produits de beauté',
	'Dentist Office': 'Cabinets de dentistes',
	'Dry Cleaners': 'Nettoyeurs à sec',
	'Fish and Seafood Market': 'Poissonneries',
	'Fitness and recreational sports centres': 'Centres de conditionnement physique et de sports',
	Florists: 'Fleuristes',
	'Fruit and Vegetable Market': 'Fruiteries',
	'Liquor Stores': 'Magasins d’alcool',
	'Meat Market': 'Boucheries',
	'Museums and Art Galleries': 'Musées et galeries d’art',
	'Nursing Care Facilities': 'Établissements de soins infirmiers',
	'Office supplies': 'Fournitures de bureau',
	'Other Personal Care': 'Autres soins personnels',
	'Religious Organizations': 'Organisations religieuses',
	Restaurants: 'Restaurants',
	'Sporting goods and Hobby Retailers': 'Magasins d’articles de sport et de loisirs'
};

/** Station status values. */
export const STATUS_FR: Record<string, string> = {
	Existing: 'En service',
	Construction: 'En construction',
	Planned: 'Planifié'
};

/** Station technology values. */
export const TECHNOLOGY_FR: Record<string, string> = {
	Subway: 'Métro',
	LRT: 'SLR',
	Commuter: 'Train de banlieue'
};

/** Housing development potential levels (DevelopmentPotential_Subindex.csv). */
export const LEVEL_FR: Record<string, string> = {
	'Very High': 'Très élevé',
	High: 'Élevé',
	Moderate: 'Modéré',
	Low: 'Faible',
	'Very Low': 'Très faible'
};

/** Region names (transit-regions.json) and line names with an official French form. */
export const PLACE_NAMES_FR: Record<string, string> = {
	'Greater Golden Horseshoe': 'Région élargie du Golden Horseshoe',
	'Greater Vancouver / Lower Mainland': 'Grand Vancouver / Lower Mainland',
	Montreal: 'Montréal',
	'Quebec Tramway': 'Tramway de Québec'
};

const ALL_FR: Record<string, string> = {
	...METRIC_LABELS_FR,
	...UNITS_FR,
	...AMENITY_LABELS_FR,
	...STATUS_FR,
	...TECHNOLOGY_FR,
	...LEVEL_FR,
	...PLACE_NAMES_FR
};

/**
 * Translate a transit data label to Canadian French when `fr` is true.
 * Unknown values are returned unchanged.
 */
export function trTransit<T>(value: T, fr = true): T {
	if (!fr || typeof value !== 'string') return value;
	return (ALL_FR[value] ?? value) as T;
}
