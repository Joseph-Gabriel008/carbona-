# Carbona — AI-Powered Carbon Footprint Awareness Platform
> **"Small Actions. Big Impact."**

Carbona is a production-grade climate-tech web application designed to help users track, understand, visualize, and reduce their carbon footprint. By integrating a modular Carbon Calculator, a customized Carbon Twin™ identity engine, an AI Sustainability Coach (powered by Gemini API), and gamified weekly eco-challenges, Carbona empowers users to turn awareness into measurable planet-friendly actions.

---

## 🍃 Problem Statement
Global temperatures have risen by ~1.1°C above pre-industrial baselines, driven largely by household consumption, fossil-fuel transportation, and energy inefficiency. Yet, the average citizen struggles to conceptualize their direct (Scope 1) and indirect (Scope 2 & 3) carbon footprint. Existing tools are either overly complex, require paid subscriptions, or lack actionable guidance. 

**Carbona solves this by combining interactive visualizations with immediate, personalized AI coaching and gamified milestones to foster sustainable habit loops.**

---

## ✨ Core Features

1. **Intelligent Carbon Calculator:**
   A premium multi-step tracking interface addressing **Transportation** (private vehicles, public transit, flights, active commuting offsets), **Home Energy** (electrical loads, AC heating), **Dietary Food Profiles**, and **Shopping Consumption** cycles.
2. **Carbon Twin™ Profile Archetype:**
   An identity engine translating footprint scores into specific sustainability personas (e.g. *Climate Hero*, *Green Warrior*, *Carbon Heavy Traveler*, *Conscious Consumer*). Includes strengths, areas to improve, and custom guidelines.
3. **Coach Eco (Gemini AI Integration):**
   An interactive conversational sustainability coach that securely retrieves the user's calculator history and profile archetype, delivering structured action recommendations and habit transitions.
4. **Analytics Dashboard:**
   Beautiful, responsive visual charts (`recharts`) mapping category breakdowns and historical carbon reduction pathways, integrated with hydration-safe server-client component splits.
5. **Eco Challenges & Gamification:**
   Checklist tasks grouped by difficulty (*Easy, Medium, Hard*) rewarding users with XP. Reaching XP thresholds unlocks ranks (from *Seedling* to *Climate Hero*) and unlocks milestones in their **Badge Achievement Cabinet**.
6. **Try Demo Profile (Instant Access):**
   A one-click trial button pre-populating the Zustand store with realistic calculator inputs, completed challenges, badges, and AI coach history, allowing judges to evaluate the entire system instantly.

---

## 🛠️ Technical Stack & Architecture

- **Frontend Core:** Next.js 16 (App Router, strict TypeScript)
- **Styling:** Tailwind CSS v4 (designed with glassmorphic layers, custom OKLCH eco-color palettes, and Poppins Google font typography)
- **State Engine:** Zustand with local storage persistence to retain calculator data and AI conversation logs across route updates
- **Animations:** Framer Motion transitions (layout fades, spring cards, item lists, and button hover states)
- **Data Visualization:** Recharts (responsive vector charts optimized for mobile viewport responsiveness)
- **AI Backend:** Gemini 2.5 Flash (`@google/genai` Node client wrapper)
- **Routing Shells:** Next.js `unstable_instant = { prefetch: 'static' }` segment config on page wrappers to enforce build-time validation and instant navigations

---

## 🤖 AI Integration Details
To guarantee API key safety, all client requests communicate with a secure Next.js Route Handler (`/api/chat`). The route:
1. Gathers client-side Zustand profile context (archetype, emissions, level progress).
2. Formats a context-rich system instruction prompt detailing user specifics.
3. Uses the `@google/genai` client to generate a highly targeted response via `gemini-2.5-flash`.
4. Employs a robust fallback simulation to generate local, customized instructions in case of network issues or missing keys.

---

## 🚀 Installation & Local Development

### 1. Prerequisites
- Node.js version 20+
- A Gemini API Key (obtain from [Google AI Studio](https://aistudio.google.com/))

### 2. Clone and Setup
```bash
git clone https://github.com/Joseph-Gabriel008/carbona-.git
cd carbona-
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📦 Netlify Deployment

This project is configured with a `netlify.toml` file leveraging `@netlify/plugin-nextjs` to manage edge function middleware, route prefetching, and API route handlers.

**Build Settings:**
- Build Command: `npm run build`
- Publish Directory: `.next`

---

## 🔮 Future Scope
- **IoT Smart Meter Integration:** Read utility APIs to sync live electrical loads.
- **Micro-Offsets Marketplace:** Enable carbon offset token purchases linked to local forestry.
- **Social Challenge Leagues:** Compete with coworkers/friends in seasonal leaderboard brackets.
