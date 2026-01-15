export const TIER_1_AMENITIES = [
	{ label: 'Childcare', value: 'Childcare', color: '#f13737' },
	{ label: 'Community Centre', value: 'Community Centres', color: '#43b171' },
	{ label: 'Convenience Store', value: 'Convenience Store', color: '#db3069' },
	{ label: 'Library', value: 'Libraries', color: '#8a4285' },
	{
		label: 'Personal and Commercial Banking',
		value: 'Personal and Commercial Banking',
		color: '#f45d01'
	},
	{ label: 'Pharmacy', value: 'Pharmacy', color: '#f1c500' },
	{ label: 'Physicians Office', value: 'Physicians Office', color: '#e37d9d' },
	{ label: 'Post Office', value: 'Post Office', color: '#921111' },
	{
		label: 'Primary or Secondary School',
		value: 'Primary and Secondary Schools',
		color: '#58e965'
	},
	{ label: 'Supermarket', value: 'Supermarket', color: '#23c9ff' }
];

export const TIER_2_AMENITIES = [
	{ label: 'Appliance TV and Electronics Retailers', color: '#4a5568' },
	{ label: 'Baked Goods', color: '#d97706' },
	{ label: 'Barber Shop', color: '#0ea5e9' },
	{ label: 'Beauty Salon', color: '#ec4899' },
	{ label: 'Book Stores', color: '#8b5cf6' },
	{ label: 'Building Material and Lawn Garden Stores', color: '#78350f' },
	{ label: 'Clothing and Shoe Retailers', color: '#f43f5e' },
	{ label: 'Coin Laundry', color: '#64748b' },
	{ label: 'Community Health and Elderly Care Facilities', color: '#10b981' },
	{ label: 'Cosmetics and Beauty Supply Retailers', color: '#f472b6' },
	{ label: 'Dentist Office', color: '#2dd4bf' },
	{ label: 'Dry Cleaners', color: '#94a3b8' },
	{ label: 'Fish and Seafood Market', color: '#06b6d4' },
	{ label: 'Fitness and recreational sports centres', color: '#6366f1' },
	{ label: 'Florists', color: '#fb7185' },
	{ label: 'Fruit and Vegetable Market', color: '#84cc16' },
	{ label: 'Liquor Stores', color: '#dc2626' },
	{ label: 'Meat Market', color: '#991b1b' },
	{ label: 'Museums and Art Galleries', color: '#a855f7' },
	{ label: 'Nursing Care Facilities', color: '#059669' },
	{ label: 'Office supplies', color: '#475569' },
	{ label: 'Other Personal Care', color: '#d946ef' },
	{ label: 'Religious Organizations', color: '#f59e0b' },
	{ label: 'Restaurants', color: '#ea580c' },
	{ label: 'Sporting goods and Hobby Retailers', color: '#1d4ed8' }
];

export const AMENITY_ICONS: Record<string, string> = {
  // Tier 1
  'Childcare': 'mdi:baby-carriage',
  'Community Centres': 'mdi:account-group',
  'Convenience Store': 'mdi:store',
  'Libraries': 'mdi:library',
  'Personal and Commercial Banking': 'mdi:bank',
  'Pharmacy': 'mdi:pill',
  'Physicians Office': 'mdi:doctor',
  'Post Office': 'mdi:email',
  'Primary and Secondary Schools': 'mdi:bus-school',
  'Supermarket': 'mdi:cart',
  // Tier 2
  'Appliance TV and Electronics Retailers': 'mdi:television',
  'Baked Goods': 'mdi:baguette',
  'Barber Shop': 'mdi:content-cut',
  'Beauty Salon': 'mdi:spa',
  'Book Stores': 'mdi:book-open-page-variant',
  'Building Material and Lawn Garden Stores': 'mdi:hammer',
  'Clothing and Shoe Retailers': 'mdi:tshirt-crew',
  'Coin Laundry': 'mdi:washing-machine',
  'Community Health and Elderly Care Facilities': 'mdi:home-heart',
  'Cosmetics and Beauty Supply Retailers': 'mdi:lipstick',
  'Dentist Office': 'mdi:tooth',
  'Dry Cleaners': 'mdi:hanger',
  'Fish and Seafood Market': 'mdi:fish',
  'Fitness and recreational sports centres': 'mdi:dumbbell',
  'Florists': 'mdi:flower',
  'Fruit and Vegetable Market': 'mdi:fruit-cherries',
  'Liquor Stores': 'mdi:bottle-wine',
  'Meat Market': 'mdi:food-steak',
  'Museums and Art Galleries': 'mdi:palette',
  'Nursing Care Facilities': 'mdi:hospital-building',
  'Office supplies': 'mdi:paperclip',
  'Other Personal Care': 'mdi:account',
  'Religious Organizations': 'mdi:hands-pray',
  'Restaurants': 'mdi:silverware-fork-knife',
  'Sporting goods and Hobby Retailers': 'mdi:basketball'
};