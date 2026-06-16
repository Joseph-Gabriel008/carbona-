# Contributing to Carbona — Methodology & System Design

This document details the carbon calculation methodology, persona archetype boundaries, and AI prompt engineering layouts to help developers maintain consistency when contributing changes to the platform.

---

## 🍃 1. Carbon Calculation Methodology

All calculations are executed in [carbon-calculations.ts](file:///d:/carbona-/src/lib/carbon-calculations.ts). Input metrics are converted into **monthly kilograms of CO₂ equivalent (kg CO₂e)** using recognized factors:

### A. Transportation & Mobility
*   **Private Vehicles:**
    *   *Petrol:* `0.17 kg CO₂/km` (Source: EPA greenhouse gas inventory factors for average passenger cars).
    *   *Diesel:* `0.16 kg CO₂/km` (Source: EPA/DEFRA passenger diesel averages).
    *   *Hybrid:* `0.10 kg CO₂/km` (Reflects ~40% efficiency gains from electric support).
    *   *Electric (EV):* `0.04 kg CO₂/km` (Calculated using grid charging loss averages).
*   **Public Transit (Bus/Train):** `0.04 kg CO₂/km` (Source: DEFRA passenger transport averages).
*   **Aviation (Flights):** `90 kg CO₂/hour` of flight time, divided by 12 to convert annual flight hours into monthly offsets (Source: IPCC average passenger aviation greenhouse metrics).

### B. Home Energy Consumption
*   **Grid Electricity:** `0.40 kg CO₂/kWh` (Reflects regional grid average intensities from the Central Electricity Authority of India and EPA eGRID baselines).
*   **Air Conditioning:** `0.60 kg CO₂/hour` (Assuming a typical 1.5-ton AC unit consuming 1.5 kWh/hour on an average grid).
*   **Utility Heating:**
    *   *Natural Gas:* `120 kg CO₂/month` flat factor.
    *   *Electric Heating:* `80 kg CO₂/month` flat factor.

### C. Dietary Portions & Food Footprints
*   **Diet Type:** (Source: Poore & Nemecek (2018) Science food footprint metadata)
    *   *High-Meat Diet:* `7.0 kg CO₂/day` (~210 kg/month).
    *   *Low-Meat / Flexitarian:* `4.5 kg CO₂/day` (~135 kg/month).
    *   *Vegetarian:* `3.0 kg CO₂/day` (~90 kg/month).
    *   *Vegan:* `1.5 kg CO₂/day` (~45 kg/month).
*   **Dairy Frequency:**
    *   *High:* `2.0 kg CO₂/day` (~60 kg/month).
    *   *Moderate:* `1.0 kg CO₂/day` (~30 kg/month).
    *   *Low:* `0.4 kg CO₂/day` (~12 kg/month).
    *   *None:* `0.0 kg CO₂/day`.

### D. Consumer Shopping & Lifestyle
*   **Clothing Purchases:** `12 kg CO₂/item` (Average production lifecycle footprint of standard textiles).
*   **Electronics:** `60 kg CO₂/device` (Annualized to monthly rates: `5 kg CO₂/device/month`).
*   **Online Deliveries:** `2.5 kg CO₂/delivery` (Packaging, shipping hubs, and last-mile logistics).

---

## 🎭 2. Carbon Twin™ Archetype Classification Boundaries

The identity classification engine in [carbon-calculations.ts](file:///d:/carbona-/src/lib/carbon-calculations.ts) determines the user's Carbon Twin™ profile using the following rules:

1.  **Climate Hero (Score >= 85):** Reserved for elite, low-impact users practicing vegan/vegetarian lifestyles and using active/electric transit.
2.  **Green Warrior (Score >= 70):** Active environmental practitioners with footprint metrics below typical national benchmarks.
3.  **Carbon Heavy Traveler:** Triggered if transportation represents $>45\%$ of total footprint, flight hours exceed 15/year, or monthly car travel exceeds 1500km.
4.  **Conscious Consumer:** Triggered if shopping and consumer lifestyle choices exceed $40\%$ of total footprint.
5.  **Conscious Eater:** Triggered if food represents $>45\%$ of total footprint and the user maintains a standard meat diet.
6.  **Energy Pioneer:** Triggered if household energy represents $>40\%$ of total footprint and monthly electricity usage exceeds 300 kWh.
7.  **Eco Explorer (Fallback):** The baseline entry status for new users initiating footprint analysis.

---

## 🤖 3. Coach Eco Gemini Prompt Engineering

The conversational AI coach, **Coach Eco**, uses Next.js Route Handlers to securely communicate with the Gemini API.
*   **Prompt Inject Template:** A system instruction is compiled in `/api/chat` using current Zustand client state data (categorized monthly emissions, twin archetype profile, badges, and completed challenges list).
*   **Response Directives:** Instructs the LLM to deliver structured, encouraging, science-grounded responses detailing micro-actions (e.g. "Reducing AC by 2 hours cuts 36kg CO₂/month").
*   **Fallback Resilience:** If the Gemini API key is missing or calls fail, a fallback simulation parses keywords to mock custom response layouts locally.

---

## 📈 4. How Carbona Helps Users Reduce Footprint

1.  **Visual Awareness (Dashboard):** Recharts categories highlight high-intensity carbon hotspots.
2.  **Gamification (Challenges):** Users complete specific easy/medium/hard tasks to earn XP and ranks, translating passive intentions into actions.
3.  **Actionable Coaching (Coach Eco):** Provides interactive suggestions tailored to the user's specific emissions.
