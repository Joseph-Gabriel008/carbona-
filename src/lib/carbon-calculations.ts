/**
 * @module carbon-calculations
 * @description Core mathematical module for calculating personal carbon emissions (kg CO2e)
 * across multiple lifestyle categories (transportation, home energy, diet, shopping)
 * and mapping users to descriptive Carbon Twin™ sustainability archetypes.
 */

/**
 * Input metrics gathered from the Carbon Footprint Calculator multi-step form.
 */
export interface CalculatorInputs {
  // Transportation
  carKm: number;
  carType: 'petrol' | 'diesel' | 'hybrid' | 'electric' | 'none';
  transitKm: number; // bus/train
  flightHours: number; // annual flight hours
  activeKm: number; // walking/biking
  
  // Home Energy
  electricityKwh: number;
  acHours: number; // average daily ac hours
  heatingSource: 'gas' | 'electric' | 'none';

  // Food
  dietType: 'meat' | 'low-meat' | 'vegetarian' | 'vegan';
  dairyFrequency: 'high' | 'moderate' | 'low' | 'none';

  // Shopping & Lifestyle
  clothingCount: number; // monthly
  electronicsCount: number; // annual
  onlineDeliveries: number; // monthly
}

/**
 * Categorized monthly emissions outputs represented in kilograms of CO2 equivalent (kg CO2e).
 */
export interface EmissionResults {
  total: number; // total kg CO2/month
  transportation: number;
  energy: number;
  food: number;
  shopping: number;
  score: number; // 0 - 100
  rating: string; // A+, B, C, etc.
}

/**
 * Sustainability persona properties indicating strengths, targets, and guidelines.
 */
export interface TwinProfile {
  identity: string;
  avatar: string; // icon name
  summary: string;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
}

/**
 * Default zero/low-impact calculator values used for initial state rendering.
 */
export const DEFAULT_INPUTS: CalculatorInputs = {
  carKm: 0,
  carType: 'none',
  transitKm: 0,
  flightHours: 0,
  activeKm: 0,
  electricityKwh: 0,
  acHours: 0,
  heatingSource: 'none',
  dietType: 'vegetarian',
  dairyFrequency: 'low',
  clothingCount: 0,
  electronicsCount: 0,
  onlineDeliveries: 0,
};

/**
 * Calculates monthly carbon emissions (kg CO2e) per lifestyle category and derives a final Eco Score.
 * 
 * Emission factors are based on the following real-world references:
 * - Private Vehicles: EPA Emission Factors for Greenhouse Gas Inventories (petrol: 0.17 kg/km, diesel: 0.16 kg/km, hybrid: 0.10 kg/km, EV: 0.04 kg/km grid equivalent).
 * - Public Transit: DEFRA Greenhouse Gas Reporting factors (average bus/rail: 0.04 kg/km).
 * - Aviation: IPCC Emission Factor database (average short/medium-haul travel: 90 kg CO2 per flight hour).
 * - Grid Electricity: Central Electricity Authority of India (CEA) / EPA eGRID data (average intensity: 0.40 kg/kWh).
 * - Air Conditioning: Household appliance load profiles (average 1kW load at 0.60 kg CO2/hour).
 * - Heating: EPA residential fuel factors (gas furnace: 120 kg/month, electric: 80 kg/month).
 * - Diet: Poore & Nemecek (2018) food footprint analysis (meat: 7.0 kg/day, low-meat: 4.5 kg/day, vegetarian: 3.0 kg/day, vegan: 1.5 kg/day).
 * - Dairy: Food and Agriculture Organization (FAO) dairy footprints (high: 2.0 kg/day, moderate: 1.0 kg/day, low: 0.4 kg/day).
 * - Shopping: Circular economy lifecycle metrics (clothing: 12 kg/item, electronics: 60 kg/item, online delivery transit: 2.5 kg/delivery).
 * 
 * @param inputs - The raw calculator values submitted by the user.
 * @returns An EmissionResults object containing categorized emissions, total emissions, and a derived score/rating.
 * 
 * @source EPA Greenhouse Gas Inventory Factors (2023) - Passenger vehicle factors.
 * @source DEFRA Greenhouse Gas Reporting Factors (2023) - Public transport bus/rail averages.
 * @source IPCC AR6 WGIII (2022) - Aviation passenger transport average factors.
 * @source Central Electricity Authority of India (CEA) (2023) / India MoEFCC - Grid emission intensity.
 * @source Poore & Nemecek (2018) Science - Food and dietary footprint averages.
 * 
 * @example
 * calculateEmissions(DEFAULT_INPUTS)
 * // returns { total: 102, transportation: 0, energy: 0, food: 102, shopping: 0, score: 93, rating: 'A+' }
 */
export function calculateEmissions(inputs: CalculatorInputs): EmissionResults {
  // 1. Transportation
  let carFactor = 0;
  if (inputs.carType === 'petrol') carFactor = 0.17;
  else if (inputs.carType === 'diesel') carFactor = 0.16;
  else if (inputs.carType === 'hybrid') carFactor = 0.10;
  else if (inputs.carType === 'electric') carFactor = 0.04;
  
  const carEmissions = inputs.carKm * carFactor;
  const transitEmissions = inputs.transitKm * 0.04;
  // Convert annual flight hours to monthly emissions
  // Short/medium-haul averages 90 kg CO2 / hour
  const flightEmissions = (inputs.flightHours * 90) / 12;
  const transportation = Math.round(carEmissions + transitEmissions + flightEmissions);

  // 2. Home Energy
  const electricityEmissions = inputs.electricityKwh * 0.40;
  const acEmissions = inputs.acHours * 0.60 * 30; // average 30 days
  let heatingFactor = 0;
  if (inputs.heatingSource === 'gas') heatingFactor = 120;
  else if (inputs.heatingSource === 'electric') heatingFactor = 80;
  
  const energy = Math.round(electricityEmissions + acEmissions + heatingFactor);

  // 3. Food
  let dietFactor = 0.0;
  if (inputs.dietType === 'meat') dietFactor = 7.0;
  else if (inputs.dietType === 'low-meat') dietFactor = 4.5;
  else if (inputs.dietType === 'vegetarian') dietFactor = 3.0;
  else if (inputs.dietType === 'vegan') dietFactor = 1.5;

  let dairyFactor = 0.0;
  if (inputs.dairyFrequency === 'high') dairyFactor = 2.0;
  else if (inputs.dairyFrequency === 'moderate') dairyFactor = 1.0;
  else if (inputs.dairyFrequency === 'low') dairyFactor = 0.4;

  const dietEmissions = dietFactor * 30;
  const dairyEmissions = dairyFactor * 30;
  const food = Math.round(dietEmissions + dairyEmissions);

  // 4. Shopping
  const clothingEmissions = inputs.clothingCount * 12;
  const electronicsEmissions = (inputs.electronicsCount * 60) / 12; // convert annual to monthly
  const deliveryEmissions = inputs.onlineDeliveries * 2.5;
  const shopping = Math.round(clothingEmissions + electronicsEmissions + deliveryEmissions);

  // Totals
  const total = transportation + energy + food + shopping;

  // Score Calculation (higher score is better)
  // Average benchmark monthly emissions: ~1200 kg CO2
  // We offset active transportation (biking/walking) to reward the user
  const activeOffset = Math.min(5, Math.round(inputs.activeKm * 0.05));
  let score = Math.round(100 - (total / 1400) * 100);
  score = Math.max(1, Math.min(100, score + activeOffset));

  let rating = 'C';
  if (score >= 85) rating = 'A+';
  else if (score >= 75) rating = 'A';
  else if (score >= 60) rating = 'B';
  else if (score >= 45) rating = 'C';
  else if (score >= 30) rating = 'D';
  else rating = 'F';

  return {
    total,
    transportation,
    energy,
    food,
    shopping,
    score,
    rating,
  };
}

/**
 * Categorizes a user into a specific Carbon Twin sustainability archetype based on emissions and input patterns.
 * 
 * Classification Boundaries:
 * - Score >= 85: Climate Hero (minimal overall impact)
 * - Score >= 70: Green Warrior (solid eco-conscious balance)
 * - Transportation > 45% of total, flight hours > 15, or car Km > 1500: Carbon Heavy Traveler
 * - Shopping > 40% of total: Conscious Consumer
 * - Food > 45% of total with Meat diet: Conscious Eater
 * - Energy > 40% of total with high electricity load (> 300 kWh): Energy Pioneer
 * - Fallback: Eco Explorer (starting point profile)
 * 
 * @param results - The calculated monthly emission totals.
 * @param inputs - The raw user calculator input fields.
 * @returns A TwinProfile archetype dataset mapping avatars, summaries, and action guidelines.
 * 
 * @source Central Electricity Authority of India (CEA) (2023) / India MoEFCC - National baseline target references.
 * @source IPCC AR6 WGIII (2022) - Reference mitigation pathway profiles.
 * 
 * @example
 * determineTwin({ score: 90, ...otherResults }, DEFAULT_INPUTS)
 * // returns TwinProfile with identity "Climate Hero"
 */
export function determineTwin(results: EmissionResults, inputs: CalculatorInputs): TwinProfile {
  const { total, score, transportation, energy, food, shopping } = results;

  // Decide Identity
  let identity = 'Eco Explorer';
  let avatar = 'compass';
  let summary = 'You are starting your eco-journey, identifying areas of carbon impact and learning how small adjustments in your lifestyle can lead to cleaner, greener habits.';
  let strengths = ['Receptive to climate topics', 'Aware of environmental challenges', 'Ready for positive lifestyle adjustments'];
  let improvements = ['Transitioning high-impact transportation habits', 'Evaluating household energy conservation opportunities'];
  let suggestions = [
    'Complete three Easy challenges this week to kickstart your progress.',
    'Review your daily transportation alternatives, like public transit or walking.'
  ];

  if (score >= 85) {
    identity = 'Climate Hero';
    avatar = 'shield-alert';
    summary = 'Your carbon footprint is remarkably low. You lead an exceptionally sustainable life, showing that zero-carbon targets are attainable with dedication.';
    strengths = ['Extremely low meat/dairy or complete plant-based diet', 'Zero or minimal car travel emissions', 'Minimal material consumption patterns'];
    improvements = ['Encouraging and educating others to copy your carbon footprint practices', 'Helping communities set up green spaces or localized carbon reductions'];
    suggestions = [
      'Take on Hard challenges in the Carbona app to test your limits.',
      'Share your Carbon Twin ID Card with friends to inspire them!'
    ];
  } else if (score >= 70) {
    identity = 'Green Warrior';
    avatar = 'leaf';
    summary = 'You actively prioritize the planet in your decisions. Your footprint is below average, demonstrating your consistency in practicing sustainability.';
    strengths = ['Strong recycling and shopping awareness', 'Lower-than-average home energy footprint', 'Prefers active or hybrid transit modes'];
    improvements = ['Further reducing indirect aviation emissions', 'Targeting zero food waste and zero single-use plastics'];
    suggestions = [
      'Try the AC Reduction challenge to trim down remaining home emissions.',
      'Consider switching to a vegan/vegetarian diet on weekdays.'
    ];
  } else if (transportation > total * 0.45 || inputs.flightHours > 15 || inputs.carKm > 1500) {
    identity = 'Carbon Heavy Traveler';
    avatar = 'plane';
    summary = 'Your carbon output is heavily dominated by travel. Whether by car or plane, mobility represents your largest area of planetary impact.';
    strengths = ['High mobility and connection to global communities', 'Likely efficient in other localized footprint sectors like food/shopping'];
    improvements = ['Offsetting flight carbon emissions or reducing non-essential short trips', 'Transitioning to hybrid/electric vehicles or choosing rail where feasible'];
    suggestions = [
      'Replace short car trips under 3km with active walking/cycling.',
      'Take a Train/Bus public transport challenge twice a week.'
    ];
  } else if (shopping > total * 0.40) {
    identity = 'Conscious Consumer';
    avatar = 'shopping-bag';
    summary = 'Your carbon impact points to consumer habits—deliveries, electronics, and clothing purchases. Adjusting buying cycles will greatly lower your score.';
    strengths = ['Active engagement in local economies', 'Interest in the latest technological and fashion styles'];
    improvements = ['Extending lifecycle of electronics and fashion items', 'Minimizing frequent small online shipping deliveries to combine orders'];
    suggestions = [
      'Implement a "no new clothes for 30 days" challenge.',
      'Opt for consolidated shipping options on digital storefronts.'
    ];
  } else if (food > total * 0.45 && inputs.dietType === 'meat') {
    identity = 'Conscious Eater';
    avatar = 'utensils';
    summary = 'Your main carbon footprint source is food, largely driven by dietary preferences. Even slight dietary pivots will boost your score.';
    strengths = ['Healthy appreciation for culinary experiences', 'Low material shopping and energy footprint'];
    improvements = ['Adopting meat-free days (e.g. Meatless Mondays)', 'Sourcing localized, seasonal produce to reduce food-travel distance'];
    suggestions = [
      'Complete the vegetarian meal challenge 3 times this week.',
      'Reduce cheese and high-emission dairy products where alternatives exist.'
    ];
  } else if (energy > total * 0.40 && inputs.electricityKwh > 300) {
    identity = 'Energy Pioneer';
    avatar = 'zap';
    summary = 'Your home energy represents the major footprint factor. Increasing efficiency or changing energy sources will yield significant progress.';
    strengths = ['Enjoys highly comfortable, modern home amenities', 'Aware of home automation options'];
    improvements = ['Unplugging unused appliances to stop vampire draws', 'Optimizing heating and AC cooling setups'];
    suggestions = [
      'Unplug electronics at night or use smart timers.',
      'Set your air conditioning 1-2 degrees higher and utilize fans.'
    ];
  }

  return {
    identity,
    avatar,
    summary,
    strengths,
    improvements,
    suggestions,
  };
}
