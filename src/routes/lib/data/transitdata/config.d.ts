export interface MetricDefinition {
  age: ArrayMetric[];
  housing: ArrayMetric[];
  dwelling: ArrayMetric[];
  bed: ArrayMetric[];
  owner: ArrayMetric[];
  business: ArrayMetric[];
  civic: ArrayMetric[];
  employment: ArrayMetric[];
  
  TotalPopulation: SingleMetric;
  TotalHouseholds: SingleMetric;
  AverageEmploymentIncome: SingleMetric;
  VisibleMinorityTotal: SingleMetric;
  TotalImmigrant: SingleMetric;
  IndigenousIdentity: SingleMetric;
  UniversityDegree: SingleMetric;
  EmployeeCount: SingleMetric;
  HousingTotal: SingleMetric;
  MonthlyRent: SingleMetric;
  HouseValue: SingleMetric;
  MoreThan30OnShelter: SingleMetric;
  PopulationDensity: SingleMetric;
  EmploymentDensity: SingleMetric;
  water_pct: SingleMetric;
  greenspace_pct: SingleMetric;
  building_pct: SingleMetric;
  parking_pct: SingleMetric;
  Daily_Visits: SingleMetric;
  Unique_Visitors: SingleMetric;
  BusinessCount: SingleMetric;
  Tier_1_presence: SingleMetric;
  Tier_2_presence: SingleMetric;
  Overall_score: SingleMetric;
  bii: SingleMetric;
  [key: string]: SingleMetric | ArrayMetric[];
}

export interface MetricBase {
  label: string;
  key: string;
  unit: string;
  icon: string;
  colour?: string;
}

export interface Metric
{
  label: string;
  value: {[key: string]: number} | number | {};
  y?: string;
}

export interface ArrayMetric extends MetricBase {
  label: string;
  key: string;
  unit: string;
  icon: string;
}

export interface SingleMetric extends MetricBase {
  label: string;
  key: string;
  unit: string;
  icon: string;
}

export interface StationCCMetric {
  // Core identifiers
  id: string | null;
  latitude?: number;
  longitude?: number;
  region?: string;
  
  // Transit line info
  line_id?: string;
  line_label?: string;
  line_display_name?: string;
  stop_label?: string;
  stop_sequence?: number;
  technology?: string;
  status?: string;
  
  // Business count fields
  // Retail & Services
  TV_and_Electronics_Retailers?: number;
  Baked_Goods?: number;
  Barber_Shop?: number;
  Beauty_Salon?: number;
  Book_Stores?: number;
  Building_Material_and_Lawn_Garden_Stores?: number;
  Childcare?: number;
  Clothing_and_Shoe_Retailers?: number;
  Coin_Laundry?: number;
  Community_Centres?: number;
  Community_Health_and_Elderly_Care_Facilities?: number;
  Convenience_Store?: number;
  Cosmetics_and_Beauty_Supply_Retailers?: number;
  Dentist_Office?: number;
  Dry_Cleaners?: number;
  Fish_and_Seafood_Market?: number;
  Fitness_and_recreational_sports_centres?: number;
  Florists?: number;
  Fruit_and_Vegetable_Market?: number;
  Libraries?: number;
  Liquor_Stores?: number;
  Meat_Market?: number;
  Museums_and_Art_Galleries?: number;
  Nursing_Care_Facilities?: number;
  Office_supplies?: number;
  Other_Personal_Care?: number;
  Personal_and_Commercial_Banking?: number;
  Pharmacy?: number;
  Physicians_Office?: number;
  Post_Office?: number;
  Primary_and_Secondary_Schools?: number;
  Religious_Organizations?: number;
  Restaurants?: number;
  Sporting_goods_and_Hobby_Retailers?: number;
  Supermarket?: number;
  
  // Transit employment indicators
  Tier_1?: number;
  'Tier 1 Employment'?: number;
  Tier_2?: number;
  'Tier 2 Employment'?: number;
  [key: string]: unknown;
}

export interface DPIMetric
{
  // Identifiers
  id?: string;
  line_id?: number; // This is a number in your data
  
  // Levels and Potential
  DRLevel?: "Low" | "Moderate" | "High"; // Adjust enum as needed
  GPLevel?: "Low" | "Moderate" | "High";
  LALevel?: "Low" | "Moderate" | "High";
  potential?: "Low" | "Moderate" | "High";
  
  // Scores (0-1 range typically)
  DailyVisits?: number;
  DevelopableArea?: number;
  DevelopmentPotentialScore?: number;
  DisplacementRisk?: number;
  EmploymentDensity?: number;
  GrowthPressure?: number;
  HighOpportunityArea?: number;
  IntersectionMult?: number;
  LandAvailability?: number;
  LowIncome?: number;
  MoreThan30OnShelter?: number;
  MunicipalPopChange2020to2025?: number;
  OverallCCScore?: number;
  PopChange2020to2025?: number;
  PopChange2025to2030?: number;
  PopulationDensity?: number;
  TotalImmigrant?: number;
  UnitsCreated?: number;
  VisibleMinorityTotal?: number;
  YouthElderly?: number;
  single_units?: number;
  
  // Region & Status
  region?: string; // Note: Your data has NaN here. If valid regions are strings, keep string.
  stop_label?: string; // Note: Your data has NaN here.
  
  // Helper to handle NaN gracefully if reading from external API
  [key: string]: unknown;
}