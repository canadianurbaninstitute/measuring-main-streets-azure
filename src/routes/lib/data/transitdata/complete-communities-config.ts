export const TIER_1_AMENITIES = [
	{ label: 'Childcare', color: '#f13737' },
	{ label: 'Community Centres', color: '#23c9ff' },
	{ label: 'Convenience Store', color: '#db3069' },
	{ label: 'Libraries', color: '#8a4285' },
	{
		label: 'Personal and Commercial Banking',
		color: '#f45d01'
	},
	{ label: 'Pharmacy', color: '#f1c500' },
	{ label: 'Physicians Office', color: '#e37d9d' },
	{
		label: 'Primary and Secondary Schools',
		color: '#58e965'
	},
	{ label: 'Supermarket', color: '#43B171' }
];

export const TIER_2_AMENITIES = [
	{ label: 'Post Office', color: '#921111' },
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
	Childcare: 'mdi:baby-carriage',
	'Community Centres': 'mdi:account-group',
	'Convenience Store': 'mdi:store',
	Libraries: 'mdi:library',
	'Personal and Commercial Banking': 'mdi:bank',
	Pharmacy: 'mdi:pill',
	'Physicians Office': 'mdi:doctor',
	'Post Office': 'mdi:email',
	'Primary and Secondary Schools': 'mdi:bus-school',
	Supermarket: 'mdi:cart',
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
	Florists: 'mdi:flower',
	'Fruit and Vegetable Market': 'mdi:fruit-cherries',
	'Liquor Stores': 'mdi:bottle-wine',
	'Meat Market': 'mdi:food-steak',
	'Museums and Art Galleries': 'mdi:palette',
	'Nursing Care Facilities': 'mdi:hospital-building',
	'Office supplies': 'mdi:paperclip',
	'Other Personal Care': 'mdi:account',
	'Religious Organizations': 'mdi:hands-pray',
	Restaurants: 'mdi:silverware-fork-knife',
	'Sporting goods and Hobby Retailers': 'mdi:basketball'
};

export const AMENITY_PATHS: Record<string, string> = {
	// Tier 1
	Childcare:
		'M13,2V10H21A8,8 0 0,0 13,2M19.32,15.89C20.37,14.54 21,12.84 21,11H6.44L5.5,9H2V11H4.22C4.22,11 6.11,15.07 6.34,15.42C5.24,16 4.5,17.17 4.5,18.5A3.5,3.5 0 0,0 8,22C9.76,22 11.22,20.7 11.46,19H13.54C13.78,20.7 15.24,22 17,22A3.5,3.5 0 0,0 20.5,18.5C20.5,17.46 20.04,16.53 19.32,15.89M8,20A1.5,1.5 0 0,1 6.5,18.5A1.5,1.5 0 0,1 8,17A1.5,1.5 0 0,1 9.5,18.5A1.5,1.5 0 0,1 8,20M17,20A1.5,1.5 0 0,1 15.5,18.5A1.5,1.5 0 0,1 17,17A1.5,1.5 0 0,1 18.5,18.5A1.5,1.5 0 0,1 17,20Z',
	'Community Centres':
		'M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z',
	'Convenience Store':
		'M12,18H6V14H12M21,14V12L20,7H4L3,12V14H4V20H14V14H18V20H20V14M20,4H4V6H20V4Z',
	Libraries:
		'M12,8A3,3 0 0,0 15,5A3,3 0 0,0 12,2A3,3 0 0,0 9,5A3,3 0 0,0 12,8M12,11.54C9.64,9.35 6.5,8 3,8V19C6.5,19 9.64,20.35 12,22.54C14.36,20.35 17.5,19 21,19V8C17.5,8 14.36,9.35 12,11.54Z',
	'Personal and Commercial Banking':
		'M11.5,1L2,6V8H21V6M16,10V17H19V10M2,22H21V19H2M10,10V17H13V10M4,10V17H7V10H4Z',
	Pharmacy:
		'M4.22,11.29L11.29,4.22C13.64,1.88 17.43,1.88 19.78,4.22C22.12,6.56 22.12,10.36 19.78,12.71L12.71,19.78C10.36,22.12 6.56,22.12 4.22,19.78C1.88,17.43 1.88,13.64 4.22,11.29M5.64,12.71C4.59,13.75 4.24,15.24 4.6,16.57L10.59,10.59L14.83,14.83L18.36,11.29C19.93,9.73 19.93,7.2 18.36,5.64C16.8,4.07 14.27,4.07 12.71,5.64L5.64,12.71Z',
	'Physicians Office':
		'M14.84,16.26C17.86,16.83 20,18.29 20,20V22H4V20C4,18.29 6.14,16.83 9.16,16.26L12,21L14.84,16.26M8,8H16V10A4,4 0 0,1 12,14A4,4 0 0,1 8,10V8M8,7L8.41,2.9C8.46,2.39 8.89,2 9.41,2H14.6C15.11,2 15.54,2.39 15.59,2.9L16,7H8M12,3H11V4H10V5H11V6H12V5H13V4H12V3Z',
	'Post Office':
		'M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z',
	'Primary and Secondary Schools':
		'M3,6C1.89,6 1,6.89 1,8V15H3A3,3 0 0,0 6,18A3,3 0 0,0 9,15H15A3,3 0 0,0 18,18A3,3 0 0,0 21,15H23V12C23,10.89 22.11,10 21,10H19V8C19,6.89 18.11,6 17,6H3M13.5,7.5H17.5V10H13.5V7.5M2.5,7.5H6.5V10H2.5V7.5M8,7.5H12V10H8V7.5M6,13.5A1.5,1.5 0 0,1 7.5,15A1.5,1.5 0 0,1 6,16.5A1.5,1.5 0 0,1 4.5,15A1.5,1.5 0 0,1 6,13.5M18,13.5A1.5,1.5 0 0,1 19.5,15A1.5,1.5 0 0,1 18,16.5A1.5,1.5 0 0,1 16.5,15A1.5,1.5 0 0,1 18,13.5Z',
	Supermarket:
		'M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z',
	'Appliance TV and Electronics Retailers':
		'M21,17H3V5H21M21,3H3A2,2 0 0,0 1,5V17A2,2 0 0,0 3,19H8V21H16V19H21A2,2 0 0,0 23,17V5A2,2 0 0,0 21,3Z',
	'Baked Goods':
		'M5 22C3.68 22 3.15 19.64 3.04 18.7A5.56 5.56 0 0 1 3.36 16A2.5 2.5 0 0 1 5.23 14.38C6.4 14.18 7.23 14.88 8.29 15.12A1.21 1.21 0 0 0 9.85 13.75C9.41 12.03 6.28 12 5 12C5 10.14 7.04 9.9 8.5 10.04A10.8 10.8 0 0 1 11.04 10.6C11.54 10.77 12.12 11.2 12.67 11.16C13.5 11.09 13.67 10.23 13.31 9.6C12.44 8.12 9.97 8 8.5 8C8.5 6 10.23 5.62 11.89 5.92A11.58 11.58 0 0 1 14.38 6.71C14.89 6.93 15.5 7.35 16.06 7.16C17.5 6.72 16 5.18 15.36 4.81A6.6 6.6 0 0 0 13.94 4.23C13.4 4.07 12.74 4.13 13.23 3.5A5.13 5.13 0 0 1 15.96 2.26C17.85 1.82 20.46 1.74 20.92 4.12A5.3 5.3 0 0 1 20.07 7.7A38.96 38.96 0 0 1 13.22 16.33A36.6 36.6 0 0 1 8.62 20.32C7.62 21.04 6.3 22 5 22Z',
	'Barber Shop':
		'M19,3L13,9L15,11L22,4V3M12,12.5A0.5,0.5 0 0,1 11.5,12A0.5,0.5 0 0,1 12,11.5A0.5,0.5 0 0,1 12.5,12A0.5,0.5 0 0,1 12,12.5M6,20A2,2 0 0,1 4,18C4,16.89 4.9,16 6,16A2,2 0 0,1 8,18C8,19.11 7.1,20 6,20M6,8A2,2 0 0,1 4,6C4,4.89 4.9,4 6,4A2,2 0 0,1 8,6C8,7.11 7.1,8 6,8M9.64,7.64C9.87,7.14 10,6.59 10,6A4,4 0 0,0 6,2A4,4 0 0,0 2,6A4,4 0 0,0 6,10C6.59,10 7.14,9.87 7.64,9.64L10,12L7.64,14.36C7.14,14.13 6.59,14 6,14A4,4 0 0,0 2,18A4,4 0 0,0 6,22A4,4 0 0,0 10,18C10,17.41 9.87,16.86 9.64,16.36L12,14L19,21H22V20L9.64,7.64Z',
	'Beauty Salon':
		'M15.5,9.63C15.31,6.84 14.18,4.12 12.06,2C9.92,4.14 8.74,6.86 8.5,9.63C9.79,10.31 10.97,11.19 12,12.26C13.03,11.2 14.21,10.32 15.5,9.63M12,15.45C9.85,12.17 6.18,10 2,10C2,20 11.32,21.89 12,22C12.68,21.88 22,20 22,10C17.82,10 14.15,12.17 12,15.45Z',
	'Book Stores':
		'M19 2L14 6.5V17.5L19 13V2M6.5 5C4.55 5 2.45 5.4 1 6.5V21.16C1 21.41 1.25 21.66 1.5 21.66C1.6 21.66 1.65 21.59 1.75 21.59C3.1 20.94 5.05 20.5 6.5 20.5C8.45 20.5 10.55 20.9 12 22C13.35 21.15 15.8 20.5 17.5 20.5C19.15 20.5 20.85 20.81 22.25 21.56C22.35 21.61 22.4 21.59 22.5 21.59C22.75 21.59 23 21.34 23 21.09V6.5C22.4 6.05 21.75 5.75 21 5.5V19C19.9 18.65 18.7 18.5 17.5 18.5C15.8 18.5 13.35 19.15 12 20V6.5C10.55 5.4 8.45 5 6.5 5Z',
	'Building Material and Lawn Garden Stores':
		'M2 19.63L13.43 8.2L12.72 7.5L14.14 6.07L12 3.89C13.2 2.7 15.09 2.7 16.27 3.89L19.87 7.5L18.45 8.91H21.29L22 9.62L18.45 13.21L17.74 12.5V9.62L16.27 11.04L15.56 10.33L4.13 21.76L2 19.63Z',
	'Clothing and Shoe Retailers':
		'M16,21H8A1,1 0 0,1 7,20V12.07L5.7,13.07C5.31,13.46 4.68,13.46 4.29,13.07L1.46,10.29C1.07,9.9 1.07,9.27 1.46,8.88L7.34,3H9C9,4.1 10.34,5 12,5C13.66,5 15,4.1 15,3H16.66L22.54,8.88C22.93,9.27 22.93,9.9 22.54,10.29L19.71,13.12C19.32,13.5 18.69,13.5 18.3,13.12L17,12.12V20A1,1 0 0,1 16,21',
	'Coin Laundry':
		'M14.83,11.17C16.39,12.73 16.39,15.27 14.83,16.83C13.27,18.39 10.73,18.39 9.17,16.83L14.83,11.17M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M7,4A1,1 0 0,0 6,5A1,1 0 0,0 7,6A1,1 0 0,0 8,5A1,1 0 0,0 7,4M10,4A1,1 0 0,0 9,5A1,1 0 0,0 10,6A1,1 0 0,0 11,5A1,1 0 0,0 10,4M12,8A6,6 0 0,0 6,14A6,6 0 0,0 12,20A6,6 0 0,0 18,14A6,6 0 0,0 12,8Z',
	'Community Health and Elderly Care Facilities':
		'M2,12L12,3L22,12H19V20H5V12H2M12,18L12.72,17.34C15.3,15 17,13.46 17,11.57C17,10.03 15.79,8.82 14.25,8.82C13.38,8.82 12.55,9.23 12,9.87C11.45,9.23 10.62,8.82 9.75,8.82C8.21,8.82 7,10.03 7,11.57C7,13.46 8.7,15 11.28,17.34L12,18Z',
	'Cosmetics and Beauty Supply Retailers':
		'M9 23C8.45 23 8 22.55 8 22V13C8 12.45 8.45 12 9 12H15C15.55 12 16 12.45 16 13V22C16 22.55 15.55 23 15 23H9M10 11C9.45 11 9 10.55 9 10V5.25C9 5.25 11 3 11.75 1C12.83 1.67 13.92 2.33 14.46 3.83C15 5.33 15 7.67 15 10C15 10.55 14.55 11 14 11H10Z',
	'Dentist Office':
		'M7,2C4,2 2,5 2,8C2,10.11 3,13 4,14C5,15 6,22 8,22C12.54,22 10,15 12,15C14,15 11.46,22 16,22C18,22 19,15 20,14C21,13 22,10.11 22,8C22,5 20,2 17,2C14,2 14,3 12,3C10,3 10,2 7,2Z',
	'Dry Cleaners':
		'M12 4A3.5 3.5 0 0 0 8.5 7.5H10.5A1.5 1.5 0 0 1 12 6A1.5 1.5 0 0 1 13.5 7.5A1.5 1.5 0 0 1 12 9C11.45 9 11 9.45 11 10V11.75L2.4 18.2A1 1 0 0 0 3 20H21A1 1 0 0 0 21.6 18.2L13 11.75V10.85A3.5 3.5 0 0 0 15.5 7.5A3.5 3.5 0 0 0 12 4M12 13.5L18 18H6Z',
	'Fish and Seafood Market':
		'M12,20L12.76,17C9.5,16.79 6.59,15.4 5.75,13.58C5.66,14.06 5.53,14.5 5.33,14.83C4.67,16 3.33,16 2,16C3.1,16 3.5,14.43 3.5,12.5C3.5,10.57 3.1,9 2,9C3.33,9 4.67,9 5.33,10.17C5.53,10.5 5.66,10.94 5.75,11.42C6.4,10 8.32,8.85 10.66,8.32L9,5C11,5 13,5 14.33,5.67C15.46,6.23 16.11,7.27 16.69,8.38C19.61,9.08 22,10.66 22,12.5C22,14.38 19.5,16 16.5,16.66C15.67,17.76 14.86,18.78 14.17,19.33C13.33,20 12.67,20 12,20M17,11A1,1 0 0,0 16,12A1,1 0 0,0 17,13A1,1 0 0,0 18,12A1,1 0 0,0 17,11Z',
	'Fitness and recreational sports centres':
		'M20.57,14.86L22,13.43L20.57,12L17,15.57L8.43,7L12,3.43L10.57,2L9.14,3.43L7.71,2L5.57,4.14L4.14,2.71L2.71,4.14L4.14,5.57L2,7.71L3.43,9.14L2,10.57L3.43,12L7,8.43L15.57,17L12,20.57L13.43,22L14.86,20.57L16.29,22L18.43,19.86L19.86,21.29L21.29,19.86L19.86,18.43L22,16.29L20.57,14.86Z',
	Florists:
		'M3,13A9,9 0 0,0 12,22C12,17 7.97,13 3,13M12,5.5A2.5,2.5 0 0,1 14.5,8A2.5,2.5 0 0,1 12,10.5A2.5,2.5 0 0,1 9.5,8A2.5,2.5 0 0,1 12,5.5M5.6,10.25A2.5,2.5 0 0,0 8.1,12.75C8.63,12.75 9.12,12.58 9.5,12.31C9.5,12.37 9.5,12.43 9.5,12.5A2.5,2.5 0 0,0 12,15A2.5,2.5 0 0,0 14.5,12.5C14.5,12.43 14.5,12.37 14.5,12.31C14.88,12.58 15.37,12.75 15.9,12.75C17.28,12.75 18.4,11.63 18.4,10.25C18.4,9.25 17.81,8.4 16.97,8C17.81,7.6 18.4,6.74 18.4,5.75C18.4,4.37 17.28,3.25 15.9,3.25C15.37,3.25 14.88,3.41 14.5,3.69C14.5,3.63 14.5,3.56 14.5,3.5A2.5,2.5 0 0,0 12,1A2.5,2.5 0 0,0 9.5,3.5C9.5,3.56 9.5,3.63 9.5,3.69C9.12,3.41 8.63,3.25 8.1,3.25A2.5,2.5 0 0,0 5.6,5.75C5.6,6.74 6.19,7.6 7.03,8C6.19,8.4 5.6,9.25 5.6,10.25M12,22A9,9 0 0,0 21,13C16,13 12,17 12,22Z',
	'Fruit and Vegetable Market':
		'M16 13H15.5C14.8 11.7 14.3 10 13.8 8.3L14.7 9.2C17.4 11.3 19.8 10.9 19.8 10.9S20.5 7.1 17.8 5.1C15.5 3.3 13.4 3.3 12.8 3.4C12.7 2.8 12.7 2.3 12.6 1.9L11.2 2C11.2 5.2 8.5 11.1 7.6 13C5.6 13.2 4 14.9 4 17C4 19.2 5.8 21 8 21C9.1 21 10 20.6 10.7 19.9C10.3 19 10 18 10 17S10.3 15 10.7 14.1C10.3 13.7 9.7 13.4 9.2 13.2C9.9 11.7 11.1 9 11.9 6.4C12.3 8.7 13.1 11.4 14.1 13.5C12.9 14.2 12 15.5 12 17C12 19.2 13.8 21 16 21S20 19.2 20 17 18.2 13 16 13M8 15.5C7.2 15.5 6.5 16.2 6.5 17H5.5C5.5 15.6 6.6 14.5 8 14.5V15.5M16 15.5C15.2 15.5 14.5 16.2 14.5 17H13.5C13.5 15.6 14.6 14.5 16 14.5V15.5Z',
	'Liquor Stores':
		'M10,22A1,1 0 0,1 9,21V11C9,9 10,7.25 11,7V2.5A0.5,0.5 0 0,1 11.5,2H12.5A0.5,0.5 0 0,1 13,2.5V7C14,7.25 15,9 15,11V21A1,1 0 0,1 14,22H10Z',
	'Meat Market':
		'M11.9 2C8 2 4.9 5.4 5 9.3C5.1 11.9 6.6 14.1 8.7 15.2C10.1 15.9 11 17.3 11 18.8V19C11 20.7 12.3 22 14 22C18 22 19 17 19 9C19 9 19 2 11.9 2M14 20C13.4 20 13 19.6 13 19V18.8C13 16.6 11.7 14.5 9.7 13.4C8.1 12.6 7.1 11 7 9.2C7 7.9 7.5 6.5 8.4 5.5C9.3 4.5 10.6 4 11.8 4C16.7 4 17 8.2 17 9C17 18.9 15.3 20 14 20M15.8 7.6L8.3 10.3C8.1 10 8 9.6 8 9.1C8 8.4 8.2 7.8 8.5 7.1L13.7 5.2C14.9 5.8 15.5 6.7 15.8 7.6M12.9 15.1L15.7 14.1C15.6 15.6 15.3 16.7 15.1 17.4L13.8 17.9C13.8 16.9 13.5 16 12.9 15.1M16 9.2C16 10.4 16 11.5 15.9 12.4L11.9 13.9C11.4 13.4 10.8 12.9 10.1 12.6C9.7 12.4 9.3 12.1 9 11.8L16 9.2Z',
	'Museums and Art Galleries':
		'M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z',
	'Nursing Care Facilities':
		'M2,22V7A1,1 0 0,1 3,6H7V2H17V6H21A1,1 0 0,1 22,7V22H14V17H10V22H2M9,4V10H11V8H13V10H15V4H13V6H11V4H9M4,20H8V17H4V20M4,15H8V12H4V15M16,20H20V17H16V20M16,15H20V12H16V15M10,15H14V12H10V15Z"',
	'Office supplies':
		'M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,1 11.5,15.5V6H10V15.5A2.5,2.5 0 0,0 12.5,18A2.5,2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z',
	'Other Personal Care':
		'M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z',
	'Religious Organizations':
		'M11.43 9.67C11.47 9.78 11.5 9.88 11.5 10V15.22C11.5 15.72 11.31 16.2 10.97 16.57L8.18 19.62L4.78 16.22L6 15L8.8 2.86C8.92 2.36 9.37 2 9.89 2C10.5 2 11 2.5 11 3.11V8.07C10.84 8.03 10.67 8 10.5 8C9.4 8 8.5 8.9 8.5 10V13C8.5 13.28 8.72 13.5 9 13.5S9.5 13.28 9.5 13V10C9.5 9.45 9.95 9 10.5 9C10.69 9 10.85 9.07 11 9.16C11.12 9.23 11.21 9.32 11.3 9.42C11.33 9.46 11.36 9.5 11.38 9.55C11.4 9.59 11.42 9.63 11.43 9.67M2 19L6 22L7.17 20.73L3.72 17.28L2 19M18 15L15.2 2.86C15.08 2.36 14.63 2 14.11 2C13.5 2 13 2.5 13 3.11V8.07C13.16 8.03 13.33 8 13.5 8C14.6 8 15.5 8.9 15.5 10V13C15.5 13.28 15.28 13.5 15 13.5S14.5 13.28 14.5 13V10C14.5 9.45 14.05 9 13.5 9C13.31 9 13.15 9.07 13 9.16C12.88 9.23 12.79 9.32 12.71 9.42C12.68 9.46 12.64 9.5 12.62 9.55C12.6 9.59 12.58 9.63 12.57 9.67C12.53 9.78 12.5 9.88 12.5 10V15.22C12.5 15.72 12.69 16.2 13.03 16.57L15.82 19.62L19.22 16.22L18 15M20.28 17.28L16.83 20.73L18 22L22 19L20.28 17.28Z',
	Restaurants:
		'M11,9H9V2H7V9H5V2H3V9C3,11.12 4.66,12.84 6.75,12.97V22H9.25V12.97C11.34,12.84 13,11.12 13,9V2H11V9M16,6V14H18.5V22H21V2C18.24,2 16,4.24 16,6Z',
	'Sporting goods and Hobby Retailers':
		'M2.34,14.63C2.94,14.41 3.56,14.3 4.22,14.3C5.56,14.3 6.73,14.72 7.73,15.56L4.59,18.7C3.53,17.5 2.78,16.13 2.34,14.63M15.56,9.8C17.53,11.27 19.66,11.63 21.94,10.88C21.97,11.09 22,11.47 22,12C22,13.03 21.75,14.18 21.28,15.45C20.81,16.71 20.23,17.73 19.55,18.5L13.22,12.19L15.56,9.8M8.77,16.64C9.83,18.17 10.05,19.84 9.42,21.66C8,21.25 6.73,20.61 5.67,19.73L8.77,16.64M12.19,13.22L18.5,19.55C16.33,21.45 13.78,22.25 10.88,21.94C11.09,21.28 11.2,20.56 11.2,19.78C11.2,19.16 11.06,18.43 10.78,17.6C10.5,16.77 10.17,16.09 9.8,15.56L12.19,13.22M8.81,14.5C7.88,13.67 6.8,13.15 5.58,12.91C4.36,12.68 3.19,12.75 2.06,13.13C2.03,12.91 2,12.53 2,12C2,10.97 2.25,9.82 2.72,8.55C3.19,7.29 3.77,6.27 4.45,5.5L11.11,12.19L8.81,14.5M15.56,7.73C14.22,6.08 13.91,4.28 14.63,2.34C15.25,2.5 15.96,2.8 16.76,3.26C17.55,3.71 18.2,4.16 18.7,4.59L15.56,7.73M21.66,9.38C21.06,9.59 20.44,9.7 19.78,9.7C18.69,9.7 17.64,9.38 16.64,8.72L19.73,5.67C20.61,6.77 21.25,8 21.66,9.38M12.19,11.11L5.5,4.45C7.67,2.55 10.22,1.75 13.13,2.06C12.91,2.72 12.8,3.44 12.8,4.22C12.8,4.94 12.96,5.75 13.29,6.66C13.62,7.56 14,8.28 14.5,8.81L12.19,11.11Z'
};

export const AMENITY_SPRITES: Record<string, string> = {
	// names of the image files uploaded on mapbox
	Childcare: 'baby-carriage',
	'Community Centres': 'account-group',
	'Convenience Store': 'store',
	Libraries: 'library-1',
	'Personal and Commercial Banking': 'bank-1',
	Pharmacy: 'pill',
	'Physicians Office': 'doctor-1',
	'Post Office': 'email',
	'Primary and Secondary Schools': 'bus-school',
	Supermarket: 'cart',
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
	Florists: 'flower',
	'Fruit and Vegetable Market': 'fruit-cherries',
	'Liquor Stores': 'bottle-wine',
	'Meat Market': 'food-steak',
	'Museums and Art Galleries': 'palette',
	'Nursing Care Facilities': 'hospital-building',
	'Office supplies': 'paperclip',
	'Other Personal Care': 'account',
	'Religious Organizations': 'hands-pray',
	Restaurants: 'silverware-fork-knife',
	'Sporting goods and Hobby Retailers': 'basketball-1'
};
