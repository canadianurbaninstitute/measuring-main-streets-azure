// Canadian French display labels for the complete-communities report charts.
// Data values (amenity names, regions, statuses) stay in English as lookup keys;
// use `trFr()` to translate them only when they are displayed.

export const AMENITY_LABELS_FR: Record<string, string> = {
	// Core amenities
	Childcare: 'Services de garde',
	'Community Centres': 'Centres communautaires',
	'Convenience Store': 'Dépanneur',
	Libraries: 'Bibliothèques',
	'Personal and Commercial Banking': 'Services bancaires personnels et commerciaux',
	Pharmacy: 'Pharmacie',
	'Physicians Office': 'Cabinet de médecin',
	'Primary and Secondary Schools': 'Écoles primaires et secondaires',
	Supermarket: 'Supermarché',
	// Additional amenities
	'Post Office': 'Bureau de poste',
	'Appliance TV and Electronics Retailers': 'Détaillants d’électroménagers, de téléviseurs et d’électronique',
	'Baked Goods': 'Boulangeries-pâtisseries',
	'Barber Shop': 'Salon de barbier',
	'Beauty Salon': 'Salon de beauté',
	'Book Stores': 'Librairies',
	'Building Material and Lawn Garden Stores': 'Matériaux de construction et fournitures de jardinage',
	'Clothing and Shoe Retailers': 'Détaillants de vêtements et de chaussures',
	'Coin Laundry': 'Buanderie libre-service',
	'Community Health and Elderly Care Facilities':
		'Établissements de santé communautaire et de soins aux personnes âgées',
	'Cosmetics and Beauty Supply Retailers': 'Détaillants de cosmétiques et de produits de beauté',
	'Dentist Office': 'Cabinet de dentiste',
	'Dry Cleaners': 'Nettoyeurs à sec',
	'Fish and Seafood Market': 'Poissonnerie',
	'Fitness and recreational sports centres': 'Centres de conditionnement physique et de sports récréatifs',
	Florists: 'Fleuristes',
	'Fruit and Vegetable Market': 'Marché de fruits et légumes',
	'Liquor Stores': 'Magasins d’alcool',
	'Meat Market': 'Boucherie',
	'Museums and Art Galleries': 'Musées et galeries d’art',
	'Nursing Care Facilities': 'Établissements de soins infirmiers',
	'Office supplies': 'Fournitures de bureau',
	'Other Personal Care': 'Autres soins personnels',
	'Religious Organizations': 'Organismes religieux',
	Restaurants: 'Restaurants',
	'Sporting goods and Hobby Retailers': 'Détaillants d’articles de sport et de loisirs'
};

export const REGION_LABELS_FR: Record<string, string> = {
	All: 'Toutes',
	Calgary: 'Calgary',
	Edmonton: 'Edmonton',
	'Greater Golden Horseshoe': 'Région élargie du Golden Horseshoe',
	'Greater Vancouver/Lower Mainland': 'Grand Vancouver / Lower Mainland',
	Vancouver: 'Vancouver',
	Montreal: 'Montréal',
	'Ottawa-Gatineau': 'Ottawa-Gatineau',
	'Ville de Québec': 'Ville de Québec'
};

export const STATUS_LABELS_FR: Record<string, string> = {
	// Amenity status
	Absent: 'Absente',
	Present: 'Présente',
	// Library / community centre status
	Neither: 'Aucun des deux',
	One: 'L’un des deux',
	Both: 'Les deux',
	// Access / population tags
	High: 'Élevé',
	Low: 'Faible',
	'High-High': 'Élevé-Élevé',
	'High-Low': 'Élevé-Faible',
	'Low-High': 'Faible-Élevé',
	'Low-Low': 'Faible-Faible'
};

/** Translate `value` with `map` when `fr` is true; unknown values are returned unchanged. */
export function trFr<T>(map: Record<string, string>, value: T, fr: boolean): T | string {
	if (!fr || typeof value !== 'string') return value;
	return map[value] ?? value;
}
