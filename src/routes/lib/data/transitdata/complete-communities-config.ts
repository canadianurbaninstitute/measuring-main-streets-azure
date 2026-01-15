export const TIER_1_AMENITIES = [
	{ label: 'Childcare', color: '#f13737' },
	{ label: 'Community Centres', color: '#43b171' },
	{ label: 'Convenience Store', color: '#db3069' },
	{ label: 'Libraries', color: '#8a4285' },
	{
		label: 'Personal and Commercial Banking',
		color: '#f45d01'
	},
	{ label: 'Pharmacy', color: '#f1c500' },
	{ label: 'Physicians Office', color: '#e37d9d' },
	{ label: 'Post Office', color: '#921111' },
	{
		label: 'Primary and Secondary Schools',
		color: '#58e965'
	},
	{ label: 'Supermarket', color: '#23c9ff' }
];

export const TIER_2_AMENITIES = [
	{ label: 'Appliance TV and Electronics Retailers', color: '#0f172a' }, // electric charcoal
	{ label: 'Baked Goods', color: '#f59e0b' }, // bright amber
	{ label: 'Barber Shop', color: '#22c55e' }, // vivid green
	{ label: 'Beauty Salon', color: '#eab308' }, // saturated gold
	{ label: 'Book Stores', color: '#84cc16' }, // lime green
	{ label: 'Building Material and Lawn Garden Stores', color: '#16a34a' }, // strong green
	{ label: 'Clothing and Shoe Retailers', color: '#ef4444' }, // bright red
	{ label: 'Coin Laundry', color: '#38bdf8' }, // light cyan (not blue-heavy)
	{ label: 'Community Health and Elderly Care Facilities', color: '#14b8a6' }, // teal
	{ label: 'Cosmetics and Beauty Supply Retailers', color: '#f97316' }, // vivid orange
	{ label: 'Dentist Office', color: '#06b6d4' }, // clean cyan
	{ label: 'Dry Cleaners', color: '#60a5fa' }, // sky blue (kept light)
	{ label: 'Fish and Seafood Market', color: '#0ea5e9' }, // ocean cyan
	{ label: 'Fitness and recreational sports centres', color: '#22c55e' }, // energetic green
	{ label: 'Florists', color: '#65a30d' }, // plant green
	{ label: 'Fruit and Vegetable Market', color: '#4ade80' }, // fresh green
	{ label: 'Liquor Stores', color: '#dc2626' }, // strong crimson
	{ label: 'Meat Market', color: '#991b1b' }, // rich red
	{ label: 'Museums and Art Galleries', color: '#facc15' }, // gallery yellow
	{ label: 'Nursing Care Facilities', color: '#10b981' }, // healthcare green
	{ label: 'Office supplies', color: '#64748b' }, // neutral anchor
	{ label: 'Other Personal Care', color: '#fb923c' }, // peach-orange
	{ label: 'Religious Organizations', color: '#fde047' }, // bright yellow
	{ label: 'Restaurants', color: '#fb7185' }, // coral (controlled warmth)
	{ label: 'Sporting goods and Hobby Retailers', color: '#22d3ee' } // electric cyan
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

export const AMENITY_SPRITES: Record<string, string> = {
  // names of the image files uploaded on mapbox
  'Childcare': 'baby-carriage',
  'Community Centres': 'account-group',
  'Convenience Store': 'store',
  'Libraries': 'library-1',
  'Personal and Commercial Banking': 'bank-1',
  'Pharmacy': 'pill',
  'Physicians Office': 'doctor-1',
  'Post Office': 'email',
  'Primary and Secondary Schools': 'bus-school',
  'Supermarket': 'cart',
  // Tier 2
  'Appliance TV and Electronics Retailers': 'television',
  'Baked Goods': 'baguette',
  'Barber Shop': 'content-cut',
  'Beauty Salon': 'spa',
  'Book Stores': 'book-open-page-variant',
  'Building Material and Lawn Garden Stores': 'hammer',
  'Clothing and Shoe Retailers': 'tshirt-crew',
  'Coin Laundry': 'washing-machine',
  'Community Health and Elderly Care Facilities': 'home-heart',
  'Cosmetics and Beauty Supply Retailers': 'lipstick',
  'Dentist Office': 'tooth',
  'Dry Cleaners': 'hanger',
  'Fish and Seafood Market': 'fish',
  'Fitness and recreational sports centres': 'dumbbell',
  'Florists': 'flower',
  'Fruit and Vegetable Market': 'fruit-cherries',
  'Liquor Stores': 'bottle-wine',
  'Meat Market': 'food-steak',
  'Museums and Art Galleries': 'palette',
  'Nursing Care Facilities': 'hospital-building',
  'Office supplies': 'paperclip',
  'Other Personal Care': 'account',
  'Religious Organizations': 'hands-pray',
  'Restaurants': 'silverware-fork-knife',
  'Sporting goods and Hobby Retailers': 'basketball-1'
};