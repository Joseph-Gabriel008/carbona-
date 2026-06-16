import { useCarbonaStore, ALL_CHALLENGES } from '@/lib/store';
import { DEFAULT_INPUTS } from '@/lib/carbon-calculations';

describe('useCarbonaStore', () => {
  beforeEach(() => {
    // Clear Zustand store and localStorage before each test
    const { resetState } = useCarbonaStore.getState();
    resetState();
    window.localStorage.clear();
  });

  test('has correct initial state shape', () => {
    const state = useCarbonaStore.getState();
    
    expect(state.hasData).toBe(false); // Assertion 1
    expect(state.demoLoaded).toBe(false); // Assertion 2
    expect(state.calculatorInputs).toEqual(DEFAULT_INPUTS); // Assertion 3
    expect(state.xp).toBe(0); // Assertion 4
    expect(state.level).toBe('Seedling'); // Assertion 5
    expect(state.unlockedBadges).toEqual([]); // Assertion 6
    expect(state.completedChallenges).toEqual([]); // Assertion 7
    expect(state.coachHistory).toEqual([]); // Assertion 8
  });

  test('updates calculator and mutates emissions state', () => {
    const { updateCalculator } = useCarbonaStore.getState();
    
    updateCalculator({
      ...DEFAULT_INPUTS,
      carKm: 500,
      carType: 'petrol',
    });

    const state = useCarbonaStore.getState();
    expect(state.hasData).toBe(true); // Assertion 9
    expect(state.calculatorInputs.carKm).toBe(500); // Assertion 10
    expect(state.emissions.total).toBeGreaterThan(0); // Assertion 11
    expect(state.twin.identity).toBeDefined(); // Assertion 12
  });

  test('toggles challenges, increments XP, and unlocks badges', () => {
    const { toggleChallenge } = useCarbonaStore.getState();
    
    // Find a challenge that awards a badge (e.g. 'reusable-bottle' awards 'Hydration Hero')
    const challengeWithBadge = ALL_CHALLENGES.find(c => c.badgeAwarded) || ALL_CHALLENGES[0];
    
    // Toggle to complete
    toggleChallenge(challengeWithBadge.id);
    
    let state = useCarbonaStore.getState();
    expect(state.completedChallenges).toContain(challengeWithBadge.id); // Assertion 13
    expect(state.xp).toBe(challengeWithBadge.xpReward); // Assertion 14
    if (challengeWithBadge.badgeAwarded) {
      expect(state.unlockedBadges).toContain(challengeWithBadge.badgeAwarded); // Assertion 15
    }

    // Toggle again to uncomplete
    toggleChallenge(challengeWithBadge.id);
    state = useCarbonaStore.getState();
    expect(state.completedChallenges).not.toContain(challengeWithBadge.id); // Assertion 16
    expect(state.xp).toBe(0); // Assertion 17
    if (challengeWithBadge.badgeAwarded) {
      expect(state.unlockedBadges).not.toContain(challengeWithBadge.badgeAwarded); // Assertion 18
    }
  });

  test('loadDemoProfile populates fields correctly', () => {
    const { loadDemoProfile } = useCarbonaStore.getState();
    loadDemoProfile();

    const state = useCarbonaStore.getState();
    expect(state.hasData).toBe(true); // Assertion 19
    expect(state.demoLoaded).toBe(true); // Assertion 20
    expect(state.xp).toBeGreaterThan(0); // Assertion 21
    expect(state.coachHistory.length).toBeGreaterThan(0); // Assertion 22
  });

  test('resetState clears everything back to defaults', () => {
    const { loadDemoProfile, resetState } = useCarbonaStore.getState();
    loadDemoProfile(); // Populate state
    
    resetState(); // Reset state

    const state = useCarbonaStore.getState();
    expect(state.hasData).toBe(false); // Assertion 23
    expect(state.demoLoaded).toBe(false); // Assertion 24
    expect(state.xp).toBe(0); // Assertion 25
    expect(state.completedChallenges).toEqual([]); // Assertion 26
  });
});
