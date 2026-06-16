import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  CalculatorInputs, 
  EmissionResults, 
  TwinProfile, 
  DEFAULT_INPUTS, 
  calculateEmissions, 
  determineTwin 
} from './carbon-calculations';

/**
 * Represents a single carbon footprint entry containing the inputs and calculated results.
 */
export interface CarbonEntry {
  id: string;
  date: string;
  inputs: CalculatorInputs;
  emissions: EmissionResults;
}

/**
 * Represents a gamified weekly sustainability task/challenge.
 */
export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  badgeAwarded?: string;
  category: 'transportation' | 'energy' | 'food' | 'shopping';
}

/**
 * Represents a sustainability badge unlocked by the user.
 */
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

/**
 * Represents a single chat message in the Eco Coach conversation log.
 */
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

/**
 * Represents a message in the AI Coach conversational log.
 */
export interface CoachMessage extends ChatMessage {}

/**
 * List of weekly eco-challenges available to the user.
 */
export const ALL_CHALLENGES: Challenge[] = [
  {
    id: 'reusable-bottle',
    title: 'Hydration Swap',
    description: 'Use a reusable bottle instead of single-use plastic cups/bottles for 3 consecutive days.',
    difficulty: 'easy',
    xpReward: 50,
    badgeAwarded: 'Hydration Hero',
    category: 'shopping'
  },
  {
    id: 'meatless-day',
    title: 'Veggie Power',
    description: 'Go meat-free for one full day, replacing animal protein with beans, tofu, or lentils.',
    difficulty: 'easy',
    xpReward: 60,
    category: 'food'
  },
  {
    id: 'unplug-idle',
    title: 'Vampire Slayer',
    description: 'Unplug chargers, game consoles, and TV setups overnight to eliminate passive standby draws.',
    difficulty: 'easy',
    xpReward: 40,
    category: 'energy'
  },
  {
    id: 'walk-under-3k',
    title: 'Active Mobility',
    description: 'Walk, run, or bike for any trip under 3km rather than driving or ordering a rideshare.',
    difficulty: 'medium',
    xpReward: 120,
    badgeAwarded: 'Active Commuter',
    category: 'transportation'
  },
  {
    id: 'ac-timer',
    title: 'Cool Off Timer',
    description: 'Limit AC usage to 4 hours max per day for a week, relying on natural ventilation or fans.',
    difficulty: 'medium',
    xpReward: 150,
    category: 'energy'
  },
  {
    id: 'local-produce',
    title: 'Sourced Local',
    description: 'Purchase only locally grown, seasonal food for 3 days to lower shipping travel emissions.',
    difficulty: 'medium',
    xpReward: 100,
    category: 'food'
  },
  {
    id: 'car-free-week',
    title: 'Zero Tailpipe Week',
    description: 'Commute completely car-free for a full work week using transit, cycling, or walking.',
    difficulty: 'hard',
    xpReward: 300,
    badgeAwarded: 'Green Rider',
    category: 'transportation'
  },
  {
    id: 'consolidated-shopping',
    title: 'Fast Fashion Pause',
    description: 'Avoid purchasing new clothes or ordering non-essential online packages for 2 full weeks.',
    difficulty: 'hard',
    xpReward: 250,
    badgeAwarded: 'Zero-Waste Champion',
    category: 'shopping'
  },
  {
    id: 'eco-diet-week',
    title: 'Plant-Based Trial',
    description: 'Adopt a purely vegan diet for 7 days to evaluate the ease and impact of plant protein.',
    difficulty: 'hard',
    xpReward: 350,
    badgeAwarded: 'Planet Guardian',
    category: 'food'
  }
];

/**
 * Zustand global state interface for the Carbona platform.
 */
export interface CarbonaState {
  hasData: boolean;
  demoLoaded: boolean;
  calculatorInputs: CalculatorInputs;
  emissions: EmissionResults;
  twin: TwinProfile;
  
  // Gamification
  xp: number;
  level: 'Seedling' | 'Eco Learner' | 'Green Warrior' | 'Planet Guardian' | 'Climate Hero';
  unlockedBadges: string[];
  completedChallenges: string[];

  // Chat
  coachHistory: CoachMessage[];

  // Actions
  /**
   * @description Updates the user calculator input data, triggers carbon emission calculations,
   * and determines the resulting Carbon Twin archetype profile.
   */
  updateCalculator: (inputs: CalculatorInputs) => void;
  
  /**
   * @description Toggles challenge status, adjusts XP scores, and unlocks badges/levels dynamically.
   */
  toggleChallenge: (challengeId: string) => void;
  
  /**
   * @description Appends a message to the AI coach logs conversation history. Caps stored records.
   */
  addCoachMessage: (role: 'user' | 'model', text: string) => void;
  
  /**
   * @description Clears existing conversation logs history for Coach Eco.
   */
  clearCoachHistory: () => void;
  
  /**
   * @description Pre-populates the Zustand store with realistic demo data, badges, and AI coach history.
   */
  loadDemoProfile: () => void;
  
  /**
   * @description Resets the Zustand state variables back to standard low-impact default settings.
   */
  resetState: () => void;
}

/**
 * Determines the user level title based on their total XP metrics.
 * 
 * @param xp - The current experience points of the user.
 * @returns The level name corresponding to the user's XP.
 */
const getLevelFromXP = (xp: number): 'Seedling' | 'Eco Learner' | 'Green Warrior' | 'Planet Guardian' | 'Climate Hero' => {
  if (xp >= 1500) return 'Climate Hero';
  if (xp >= 900) return 'Planet Guardian';
  if (xp >= 450) return 'Green Warrior';
  if (xp >= 150) return 'Eco Learner';
  return 'Seedling';
};

/**
 * Calculates details regarding the next level rank and XP progress remaining.
 * 
 * @param xp - The current experience points of the user.
 * @returns An object containing the next level name, XP needed, and current level percent progress.
 */
export const getXPNeededForNextLevel = (xp: number): { nextLevelName: string; xpNeeded: number; percent: number } => {
  if (xp >= 1500) return { nextLevelName: 'Max Level', xpNeeded: 0, percent: 100 };
  if (xp >= 900) return { nextLevelName: 'Climate Hero', xpNeeded: 1500 - xp, percent: Math.round(((xp - 900) / 600) * 100) };
  if (xp >= 450) return { nextLevelName: 'Planet Guardian', xpNeeded: 900 - xp, percent: Math.round(((xp - 450) / 450) * 100) };
  if (xp >= 150) return { nextLevelName: 'Green Warrior', xpNeeded: 450 - xp, percent: Math.round(((xp - 150) / 300) * 100) };
  return { nextLevelName: 'Eco Learner', xpNeeded: 150 - xp, percent: Math.round((xp / 150) * 100) };
};

/**
 * Global Zustand store preserving state logic across page loads via LocalStorage.
 */
export const useCarbonaStore = create<CarbonaState>()(
  persist(
    (set, get) => ({
      hasData: false,
      demoLoaded: false,
      calculatorInputs: DEFAULT_INPUTS,
      emissions: {
        total: 0,
        transportation: 0,
        energy: 0,
        food: 0,
        shopping: 0,
        score: 100,
        rating: 'A+'
      },
      twin: {
        identity: 'Eco Explorer',
        avatar: 'compass',
        summary: 'Fill out the calculator to discover your sustainability identity.',
        strengths: [],
        improvements: [],
        suggestions: []
      },
      xp: 0,
      level: 'Seedling',
      unlockedBadges: [],
      completedChallenges: [],
      coachHistory: [],

      /**
       * @description Updates the user calculator input data, triggers carbon emission calculations,
       * and determines the resulting Carbon Twin archetype profile.
       */
      updateCalculator: (inputs: CalculatorInputs): void => {
        const emissions = calculateEmissions(inputs);
        const twin = determineTwin(emissions, inputs);
        set({
          calculatorInputs: inputs,
          emissions,
          twin,
          hasData: true
        });
      },

      /**
       * @description Toggles challenge status, adjusts XP scores, and unlocks badges/levels dynamically.
       */
      toggleChallenge: (challengeId: string): void => {
        const challenge = ALL_CHALLENGES.find(c => c.id === challengeId);
        if (!challenge) return;

        const isCompleted = get().completedChallenges.includes(challengeId);
        let newCompleted = [...get().completedChallenges];
        let newXp = get().xp;
        let newBadges = [...get().unlockedBadges];

        if (isCompleted) {
          // Remove completion
          newCompleted = newCompleted.filter(id => id !== challengeId);
          newXp = Math.max(0, newXp - challenge.xpReward);
          if (challenge.badgeAwarded) {
            newBadges = newBadges.filter(b => b !== challenge.badgeAwarded);
          }
        } else {
          // Add completion
          newCompleted.push(challengeId);
          newXp += challenge.xpReward;
          if (challenge.badgeAwarded && !newBadges.includes(challenge.badgeAwarded)) {
            newBadges.push(challenge.badgeAwarded);
          }
        }

        const newLevel = getLevelFromXP(newXp);

        set({
          completedChallenges: newCompleted,
          xp: newXp,
          unlockedBadges: newBadges,
          level: newLevel
        });
      },

      /**
       * @description Appends a message to the AI coach logs conversation history. Caps stored records.
       */
      addCoachMessage: (role: 'user' | 'model', text: string): void => {
        const newMessage: CoachMessage = {
          role,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        const updatedHistory = [...get().coachHistory, newMessage];
        // Cap history at 50 messages to prevent localStorage overflow
        const cappedHistory = updatedHistory.length > 50 ? updatedHistory.slice(-50) : updatedHistory;
        set({
          coachHistory: cappedHistory
        });
      },

      /**
       * @description Clears existing conversation logs history for Coach Eco.
       */
      clearCoachHistory: (): void => {
        set({ coachHistory: [] });
      },

      /**
       * @description Pre-populates the Zustand store with realistic demo data, badges, and AI coach history.
       */
      loadDemoProfile: (): void => {
        const demoInputs: CalculatorInputs = {
          carKm: 620,
          carType: 'petrol',
          transitKm: 150,
          flightHours: 12,
          activeKm: 15,
          electricityKwh: 240,
          acHours: 6,
          heatingSource: 'electric',
          dietType: 'low-meat',
          dairyFrequency: 'moderate',
          clothingCount: 4,
          electronicsCount: 2,
          onlineDeliveries: 6
        };

        const emissions = calculateEmissions(demoInputs);
        const twin = determineTwin(emissions, demoInputs);

        const demoCompletedChallenges = ['reusable-bottle', 'unplug-idle', 'local-produce'];
        let demoXp = 0;
        const demoBadges: string[] = [];

        ALL_CHALLENGES.forEach(c => {
          if (demoCompletedChallenges.includes(c.id)) {
            demoXp += c.xpReward;
            if (c.badgeAwarded) {
              demoBadges.push(c.badgeAwarded);
            }
          }
        });

        const demoLevel = getLevelFromXP(demoXp);

        const demoHistory: CoachMessage[] = [
          {
            role: 'user',
            text: 'Analyze my carbon score and suggest improvements.',
            timestamp: '10:04 AM'
          },
          {
            role: 'model',
            text: `Based on your calculator profile:
* **Carbon Score:** ${emissions.score}/100
* **Total Footprint:** ${emissions.total} kg CO₂/month
* **Main Contributor:** Transportation & Aviation (~${Math.round((inputs => (inputs.carKm * 0.17 + (inputs.flightHours * 90) / 12))(demoInputs))} kg CO₂)

**Primary Opportunities:**
1. **Reduce Car Travel:** Driving 620km in a petrol car contributes ~105kg CO₂ monthly. Commuting via transit (bus/rail) just 2 days a week would cut this by 35kg CO₂.
2. **AC Efficiency:** Setting your AC timer or running it 2 hours less daily will lower your home energy footprint by 36kg CO₂.
3. **Consolidate Deliveries:** Combining online deliveries into single orders rather than 6 small deliveries cuts delivery truck transport emissions.`,
            timestamp: '10:05 AM'
          }
        ];

        set({
          hasData: true,
          demoLoaded: true,
          calculatorInputs: demoInputs,
          emissions,
          twin,
          xp: demoXp,
          level: demoLevel,
          unlockedBadges: demoBadges,
          completedChallenges: demoCompletedChallenges,
          coachHistory: demoHistory
        });
      },

      /**
       * @description Resets the Zustand state variables back to standard low-impact default settings.
       */
      resetState: (): void => {
        set({
          hasData: false,
          demoLoaded: false,
          calculatorInputs: DEFAULT_INPUTS,
          emissions: {
            total: 0,
            transportation: 0,
            energy: 0,
            food: 0,
            shopping: 0,
            score: 100,
            rating: 'A+'
          },
          twin: {
            identity: 'Eco Explorer',
            avatar: 'compass',
            summary: 'Fill out the calculator to discover your sustainability identity.',
            strengths: [],
            improvements: [],
            suggestions: []
          },
          xp: 0,
          level: 'Seedling',
          unlockedBadges: [],
          completedChallenges: [],
          coachHistory: []
        });
      }
    }),
    {
      name: 'carbona-state-storage',
    }
  )
);
