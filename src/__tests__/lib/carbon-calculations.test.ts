import { 
  calculateEmissions, 
  determineTwin, 
  CalculatorInputs, 
  DEFAULT_INPUTS 
} from '@/lib/carbon-calculations';

describe('carbon-calculations', () => {
  describe('calculateEmissions', () => {
    test('calculates correct emissions for zero/default inputs', () => {
      const inputs: CalculatorInputs = { ...DEFAULT_INPUTS };
      const results = calculateEmissions(inputs);
      
      expect(results.transportation).toBe(0); // Assertion 1
      expect(results.energy).toBe(0); // Assertion 2
      expect(results.food).toBe(102); // vegetarian 3*30 + dairy low 0.4*30 = 90 + 12 = 102 (Assertion 3)
      expect(results.shopping).toBe(0); // Assertion 4
      expect(results.total).toBe(102); // Assertion 5
      expect(results.score).toBe(93); // 100 - round((102/1400)*100) = 100 - 7 = 93 (Assertion 6)
      expect(results.rating).toBe('A+'); // Assertion 7
    });

    test('calculates correct emissions with known non-zero values', () => {
      const inputs: CalculatorInputs = {
        carKm: 100, // petrol -> 100 * 0.17 = 17
        carType: 'petrol',
        transitKm: 200, // 200 * 0.04 = 8
        flightHours: 12, // (12 * 90) / 12 = 90
        activeKm: 50, // active offset 50 * 0.05 = 2.5 -> offset = 3 (capped at 5)
        electricityKwh: 300, // 300 * 0.40 = 120
        acHours: 4, // 4 * 0.60 * 30 = 72
        heatingSource: 'gas', // 120
        dietType: 'meat', // 7.0 * 30 = 210
        dairyFrequency: 'high', // 2.0 * 30 = 60
        clothingCount: 3, // 3 * 12 = 36
        electronicsCount: 2, // (2 * 60) / 12 = 10
        onlineDeliveries: 4 // 4 * 2.5 = 10
      };

      const results = calculateEmissions(inputs);

      // Expected Transportation: Math.round(17 + 8 + 90) = 115
      expect(results.transportation).toBe(115); // Assertion 8
      // Expected Energy: Math.round(120 + 72 + 120) = 312
      expect(results.energy).toBe(312); // Assertion 9
      // Expected Food: Math.round(210 + 60) = 270
      expect(results.food).toBe(270); // Assertion 10
      // Expected Shopping: Math.round(36 + 10 + 10) = 56
      expect(results.shopping).toBe(56); // Assertion 11
      // Expected Total: 115 + 312 + 270 + 56 = 753
      expect(results.total).toBe(753); // Assertion 12
      // Expected Score: Math.round(100 - (753/1400)*100) + activeOffset(3) = 100 - 54 + 3 = 49
      expect(results.score).toBe(49); // Assertion 13
      expect(results.rating).toBe('C'); // Assertion 14
    });

    test('enforces limits (min/max/negatives)', () => {
      // Input negative values which should be handled gracefully or zeroed
      const inputs: CalculatorInputs = {
        ...DEFAULT_INPUTS,
        carKm: -100, // if we pass negative, expect it to multiply but score capped appropriately
        electricityKwh: 1000000, // massive value to test lower score cap
      };
      
      const results = calculateEmissions(inputs);
      expect(results.score).toBeGreaterThanOrEqual(1); // Assertion 15 (score floor is 1)
      expect(results.score).toBeLessThanOrEqual(100); // Assertion 16 (score ceiling is 100)
    });
  });

  describe('determineTwin', () => {
    test('classifies Climate Hero for very high score', () => {
      const results = {
        total: 50,
        transportation: 0,
        energy: 0,
        food: 50,
        shopping: 0,
        score: 95,
        rating: 'A+'
      };
      const twin = determineTwin(results, DEFAULT_INPUTS);
      expect(twin.identity).toBe('Climate Hero'); // Assertion 17
      expect(twin.avatar).toBe('shield-alert'); // Assertion 18
    });

    test('classifies Green Warrior for score >= 70', () => {
      const results = {
        total: 350,
        transportation: 50,
        energy: 100,
        food: 100,
        shopping: 100,
        score: 75,
        rating: 'A'
      };
      const twin = determineTwin(results, DEFAULT_INPUTS);
      expect(twin.identity).toBe('Green Warrior'); // Assertion 19
      expect(twin.avatar).toBe('leaf'); // Assertion 20
    });

    test('classifies Carbon Heavy Traveler when travel dominates', () => {
      const results = {
        total: 1000,
        transportation: 500, // > 45% of total
        energy: 200,
        food: 200,
        shopping: 100,
        score: 40,
        rating: 'D'
      };
      const inputs: CalculatorInputs = {
        ...DEFAULT_INPUTS,
        carKm: 1600, // triggers traveler criteria too
      };
      const twin = determineTwin(results, inputs);
      expect(twin.identity).toBe('Carbon Heavy Traveler'); // Assertion 21
      expect(twin.avatar).toBe('plane'); // Assertion 22
    });

    test('classifies Conscious Consumer when shopping dominates', () => {
      const results = {
        total: 1000,
        transportation: 200,
        energy: 200,
        food: 100,
        shopping: 500, // > 40% of total
        score: 40,
        rating: 'D'
      };
      const twin = determineTwin(results, DEFAULT_INPUTS);
      expect(twin.identity).toBe('Conscious Consumer'); // Assertion 23
      expect(twin.avatar).toBe('shopping-bag'); // Assertion 24
    });

    test('classifies Conscious Eater when food dominates with meat diet', () => {
      const results = {
        total: 1000,
        transportation: 200,
        energy: 200,
        food: 500, // > 45% of total
        shopping: 100,
        score: 40,
        rating: 'D'
      };
      const inputs: CalculatorInputs = {
        ...DEFAULT_INPUTS,
        dietType: 'meat'
      };
      const twin = determineTwin(results, inputs);
      expect(twin.identity).toBe('Conscious Eater'); // Assertion 25
      expect(twin.avatar).toBe('utensils'); // Assertion 26
    });

    test('classifies Energy Pioneer when energy dominates with high kWh', () => {
      const results = {
        total: 1000,
        transportation: 200,
        energy: 500, // > 40% of total
        food: 200,
        shopping: 100,
        score: 40,
        rating: 'D'
      };
      const inputs: CalculatorInputs = {
        ...DEFAULT_INPUTS,
        electricityKwh: 350 // > 300
      };
      const twin = determineTwin(results, inputs);
      expect(twin.identity).toBe('Energy Pioneer'); // Assertion 27
      expect(twin.avatar).toBe('zap'); // Assertion 28
    });

    test('defaults to Eco Explorer if boundaries not met', () => {
      const results = {
        total: 1000,
        transportation: 250,
        energy: 250,
        food: 250,
        shopping: 250,
        score: 35,
        rating: 'D'
      };
      const twin = determineTwin(results, DEFAULT_INPUTS);
      expect(twin.identity).toBe('Eco Explorer'); // Assertion 29
      expect(twin.avatar).toBe('compass'); // Assertion 30
    });
  });
});
