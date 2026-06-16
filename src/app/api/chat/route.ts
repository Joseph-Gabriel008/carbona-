/**
 * @module api-chat-route
 * @description Secure API route handler for the Carbona platform's Eco Sustainability Coach.
 * Integrates Google Gemini API using the @google/genai client with a fully local fallback
 * conversational simulator to handle key outages or missing API keys securely.
 */

import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

/**
 * RATE LIMITING IMPLEMENTATION NOTE:
 * Rate limiting logic should be integrated here (e.g., using Redis Token Bucket, Upstash, or Vercel KV).
 * - Identify client requests using client IP address: `req.headers.get('x-forwarded-for')` or user authentication tokens.
 * - Allow a maximum threshold (e.g. 5 prompts per minute per IP).
 * - Return HTTP 429 Too Many Requests if the rate limit is exceeded.
 */

interface EmissionsContext {
  total: number;
  score: number;
  rating: string;
  transportation: number;
  energy: number;
  food: number;
  shopping: number;
}

interface TwinContext {
  identity: string;
}

interface GamificationContext {
  level: string;
  xp: number;
  completedChallenges: string[];
}

interface ChatMessageInput {
  role: 'user' | 'model';
  text: string;
}

interface ChatRequestBody {
  messages?: ChatMessageInput[];
  context?: {
    emissions?: EmissionsContext;
    twin?: TwinContext;
    gamification?: GamificationContext;
  };
}

export async function POST(req: Request) {
  try {
    // SECURITY UPGRADE: Validate Content-Type
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 415 }
      );
    }

    // Explicit request body parsing using defined TypeScript types
    const body = (await req.json()) as ChatRequestBody;
    const { messages, context } = body;

    // Validate presence and layout of messages array
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || typeof lastMessage.text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      );
    }

    // Input sanitization: trim whitespace and reject empty messages
    const sanitizedMessageText = lastMessage.text.trim();
    if (sanitizedMessageText === '') {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    // Message length cap: reject if > 2000 characters
    if (sanitizedMessageText.length > 2000) {
      return NextResponse.json(
        { error: 'Message length exceeds limit of 2000 characters' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Check if context is available, set defaults if not
    const emissions = context?.emissions || { total: 600, transportation: 200, energy: 200, food: 100, shopping: 100, score: 60, rating: 'C' };
    const twin = context?.twin || { identity: 'Eco Explorer' };
    const gamification = context?.gamification || { level: 'Seedling', xp: 0, completedChallenges: [] };

    // Format the messages to the structure expected by @google/genai
    const contents = messages.map((m, idx) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: idx === messages.length - 1 ? sanitizedMessageText : m.text }]
    }));

    // System instruction injected to align the AI behavior
    const systemInstruction = `You are "Eco", a world-class AI Sustainability Coach on the Carbona platform.
Your purpose is to help the user understand, track, and reduce their carbon footprint.

User's Sustainability Profile:
- Carbon Twin Archetype: ${twin.identity}
- Carbon Score: ${emissions.score}/100
- Total Monthly Footprint: ${emissions.total} kg CO2/month
- Category Breakdown:
  * Transportation: ${emissions.transportation} kg CO2
  * Home Energy: ${emissions.energy} kg CO2
  * Food & Diet: ${emissions.food} kg CO2
  * Shopping & Lifestyle: ${emissions.shopping} kg CO2
- Level: ${gamification.level} (${gamification.xp} XP)
- Completed Challenges: ${gamification.completedChallenges?.join(', ') || 'None yet'}

Tone and Guidelines:
1. Be encouraging, modern, clear, and science-grounded. Use professional language.
2. Refer directly to the user's specific emissions and highlight their largest areas of impact.
3. Provide realistic, concrete, micro-actions (e.g., "Replacing 50km of car driving with transit cuts 8.5 kg CO2").
4. Support markdown formatting: bolding, bullet points, headers, or lists.
5. Keep answers concise, highly readable, and structured. Avoid lengthy intros or sign-offs.
`;

    try {
      if (!apiKey || apiKey === 'your_api_key_here') {
        throw new Error('API_KEY_MISSING');
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      if (response && response.text) {
        return NextResponse.json({ text: response.text });
      } else {
        throw new Error('EMPTY_RESPONSE');
      }

    } catch (apiError) {
      console.warn('Gemini API call failed or key is missing. Using local fallback response. Error:', apiError);
      
      // Fallback: Use smart local response simulator when connection is down or key is invalid
      const responseText = simulateEcoResponse(sanitizedMessageText.toLowerCase(), emissions, twin, gamification);
      return NextResponse.json({ text: responseText, isFallback: true });
    }

  } catch (error) {
    // Log the error securely internally on the server console for debugging
    console.error('API Error:', error);
    
    // SECURITY UPGRADE:
    // Never return the stack trace or raw error message details back to the client.
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Rejects GET requests explicitly with a 405 Method Not Allowed error.
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method Not Allowed' },
    { status: 405 }
  );
}

/**
 * Simulates customized sustainability coach advice based on keywords and user footprint context.
 * Useful as a fail-safe mechanism if API key is not configured or network request fails.
 * 
 * @param message - The sanitized lowercase message text sent by the user.
 * @param emissions - The current categorized carbon emissions.
 * @param twin - The user's Carbon Twin archetype.
 * @param gamification - The current XP progress and badge metadata.
 * @returns A structured Markdown response with concrete targets.
 */
function simulateEcoResponse(
  message: string, 
  emissions: EmissionsContext, 
  twin: TwinContext, 
  gamification: GamificationContext
): string {
  // Sort and identify the highest emissions category to provide targeted help
  const categories = [
    { name: 'Transportation', value: emissions.transportation },
    { name: 'Home Energy', value: emissions.energy },
    { name: 'Food & Diet', value: emissions.food },
    { name: 'Shopping & Lifestyle', value: emissions.shopping },
  ];
  categories.sort((a, b) => b.value - a.value);
  const highest = categories[0];

  // KEYWORD ROUTE 1: Reduction and habit improvement requests
  if (message.includes('reduce') || message.includes('help') || message.includes('how can i')) {
    return `Hello! As your sustainability coach, let's analyze your current monthly footprint of **${emissions.total} kg CO₂**.

Your highest impact source is **${highest.name}** at **${highest.value} kg CO₂/month**. Here are the most effective ways to reduce this:

### 1. Target ${highest.name} (Your highest source)
${highest.name === 'Transportation' ? 
`* **Opt for Active Commuting:** Walking or biking for short trips (under 3km) emits 0kg CO₂ and improves cardio health. Replacing 30km of driving per month saves **~5 kg CO₂**.
* **Utilize Public Transit:** Buses and trains emit up to 75% less CO₂ per passenger-km than cars. Commuting by rail for 100km monthly cuts **~15 kg CO₂**.` :
highest.name === 'Home Energy' ?
`* **Optimize AC Settings:** Keeping your thermostat at 25°C (77°F) instead of lower settings reduces compressor load. Reducing AC by 2 hours a day saves **~36 kg CO₂/month**.
* **Vampire Power Draws:** Unplugging chargers and electronics when not in use stops standby energy loss, saving up to **10% of household electricity**.` :
highest.name === 'Food & Diet' ?
`* **Green Mondays:** Replacing red meat with plant proteins (beans, tofu, vegetables) just one day a week saves **~15 kg CO₂/month**.
* **Zero Food Waste:** Buying only what you need and composting scraps reduces landfill methane. Food waste represents about 8% of global greenhouse emissions.` :
`* **Buy For Life:** Choosing durable goods and styling second-hand fashion reduces demand for fast-fashion production, saving **~12 kg CO₂** per shirt avoided.
* **Consolidated Shipping:** Opting for grouped/consolidated delivery options reduces packaging waste and delivery truck mileage.`
}

### 2. Next Steps & Challenges
* I recommend trying the **${highest.name === 'Transportation' ? 'Active Mobility' : highest.name === 'Home Energy' ? 'Cool Off Timer' : highest.name === 'Food & Diet' ? 'Veggie Power' : 'Fast Fashion Pause'}** challenge in the **Eco Challenges** section!
* You're currently a **${gamification.level}** with **${gamification.xp} XP**. Completing this challenge will reward you with more XP and help you level up!`;
  }

  // KEYWORD ROUTE 2: Score analysis and profile breakdowns
  if (message.includes('score') || message.includes('analyze') || message.includes('carbon score')) {
    return `### Carbon Score Analysis

Your current score is **${emissions.score}/100**, earning you a **"${emissions.rating}"** rating.

Here is a breakdown of your sustainability profile as an **${twin.identity}**:

* **Transportation:** ${emissions.transportation} kg CO₂ (${Math.round((emissions.transportation / emissions.total) * 100) || 0}%)
* **Home Energy:** ${emissions.energy} kg CO₂ (${Math.round((emissions.energy / emissions.total) * 100) || 0}%)
* **Food & Diet:** ${emissions.food} kg CO₂ (${Math.round((emissions.food / emissions.total) * 100) || 0}%)
* **Shopping:** ${emissions.shopping} kg CO₂ (${Math.round((emissions.shopping / emissions.total) * 100) || 0}%)

**Key Insight:** Your footprint is **${emissions.total < 500 ? 'significantly below' : emissions.total < 1000 ? 'around' : 'above'}** the national average of ~1,000 kg CO₂ per month. 

To boost your score to the next tier:
1. Try adding at least **20km** of walking or cycling to your weekly routine.
2. Complete the **Vampire Slayer** easy challenge to shave off phantom energy consumption.`;
  }

  // KEYWORD ROUTE 3: Habits or general alternatives
  if (message.includes('habit') || message.includes('alternative') || message.includes('improve')) {
    return `### Small Habits. Big Cumulative Impact.

Let's focus on micro-habits you can integrate starting today:

1. **The 3km Rule:** For any commute under 3km, commit to walking, running, or cycling.
2. **Eco Laundry:** Wash your clothes in cold water rather than hot water. This saves up to 75% of the energy consumed per wash cycle.
3. **Consolidated Delivery:** Instead of checking out immediately for individual items online, hold them in your cart and ship them once a week. This reduces the carbon cost of delivery trips by 50%+.
4. **Smart Thermostats:** Raising your cooling temperature by 1°C in summer saves roughly 6% to 10% on cooling power.

*Would you like me to suggest specific challenges from the list to help you build these habits?*`;
  }

  // DEFAULT FALLBACK ROUTE: Standard intro instructions
  return `Hello! I am **Eco**, your AI Sustainability Coach. 

I've analyzed your Carbon Twin identity (**${twin.identity}**) and your monthly emissions (**${emissions.total} kg CO₂**). 

Here are some questions you can ask me:
* *How can I reduce my carbon footprint?*
* *Analyze my carbon score.*
* *What habits should I improve?*
* *Suggest eco-friendly alternatives for daily life.*

How can I support your green journey today?`;
}
