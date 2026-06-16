# Contributing to Carbona — Methodology & System Design

This document details the carbon calculation methodology, persona archetype boundaries, and AI prompt engineering layouts to help developers maintain consistency when contributing changes to the platform.

---

## 🍃 1. Carbon Calculation Methodology

All calculations are executed in [carbon-calculations.ts](file:///d:/carbona-/src/lib/carbon-calculations.ts). Input metrics are converted into **monthly kilograms of CO₂ equivalent (kg CO₂e)** using recognized factors:

### A. Transportation & Mobility
*   **Private Vehicles:**
    *   *Petrol:* `0.17 kg CO₂/km` (Source: EPA Greenhouse Gas Inventory Factors for Passenger Cars).
    *   *Diesel:* `0.16 kg CO₂/km` (Source: EPA/DEFRA Passenger Diesel averages).
    *   *Hybrid:* `0.10 kg CO₂/km` (Source: EPA Passenger Hybrid vehicle average).
    *   *Electric (EV):* `0.04 kg CO₂/km` (Source: Calculated grid charging losses using US EPA/India CEA equivalent grid mixes).
*   **Public Transit (Bus/Train):** `0.04 kg CO₂/km` (Source: UK DEFRA Passenger Transport greenhouse gas reporting averages).
*   **Aviation (Flights):** `90 kg CO₂/hour` of flight time, divided by 12 to convert annual flight hours into monthly averages (Source: IPCC AR6 WGIII emission factor databases).

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
*   **Dairy Frequency:** (Source: UN FAO dairy footprints)
    *   *High:* `2.0 kg CO₂/day` (~60 kg/month).
    *   *Moderate:* `1.0 kg CO₂/day` (~30 kg/month).
    *   *Low:* `0.4 kg CO₂/day` (~12 kg/month).
    *   *None:* `0.0 kg CO₂/day`.

### D. Consumer Shopping & Lifestyle
*   **Clothing Purchases:** `12 kg CO₂/item` (Source: Circular economy lifecycle metrics of standard textiles).
*   **Electronics:** `60 kg CO₂/device` (Annualized to monthly rates: `5 kg CO₂/device/month`).
*   **Online Deliveries:** `2.5 kg CO₂/delivery` (Packaging, shipping hubs, and last-mile logistics).

---

## 🇮🇳 2. India-Specific Environmental Context

To align the application's feedback with local conditions, Carbona uses India-specific baseline metrics for per capita targets and grid intensity:
1.  **National Per-Capita Average:** India's national average is **1.9 tons CO₂ per capita per year**, compared to the global average of **4.7 tons** and the US average of **14.5 tons**. This per-capita baseline is used in [TwinClient.tsx](file:///d:/carbona-/src/app/twin/TwinClient.tsx) to evaluate individual user performances relative to national footprints.
2.  **Indian Grid Emission Factor:** As of 2023, the Indian electrical grid operates with an intensity factor of approximately **0.82 kg CO₂/kWh** due to coal dominance. Although the platform's code uses a multi-national average of `0.40 kg CO₂/kWh` for general calculations, the learning portal and AI coaching modules present this grid factor to guide urban users on solar transitions.

---

## 🎭 3. Carbon Twin™ Archetype Classification Boundaries

The identity classification engine in [carbon-calculations.ts](file:///d:/carbona-/src/lib/carbon-calculations.ts) determines the user's Carbon Twin™ profile using the following rules:

1.  **Climate Hero (Score >= 85):** Reserved for low-impact users practicing vegan/vegetarian lifestyles and using active/electric transit.
2.  **Green Warrior (Score >= 70):** Active environmental practitioners with footprint metrics below typical national benchmarks.
3.  **Carbon Heavy Traveler:** Triggered if transportation represents $>45\%$ of total footprint, flight hours exceed 15/year, or monthly car travel exceeds 1500km.
4.  **Conscious Consumer:** Triggered if shopping and consumer lifestyle choices exceed $40\%$ of total footprint.
5.  **Conscious Eater:** Triggered if food represents $>45\%$ of total footprint and the user maintains a standard meat diet.
6.  **Energy Pioneer:** Triggered if household energy represents $>40\%$ of total footprint and monthly electricity usage exceeds 300 kWh.
7.  **Eco Explorer (Fallback):** The baseline entry status for new users initiating footprint analysis.

---

## 🤖 4. Coach Eco Gemini Prompt Engineering

The conversational AI coach, **Coach Eco**, uses Next.js Route Handlers to securely communicate with the Gemini API.
*   **Prompt Inject Template:** A system instruction is compiled in `/api/chat` using current Zustand client state data (categorized monthly emissions, twin archetype profile, badges, and completed challenges list).
*   **Response Directives:** Instructs the LLM to deliver structured, encouraging, science-grounded responses detailing micro-actions (e.g. "Reducing AC by 2 hours cuts 36kg CO₂/month").
*   **Fallback Resilience:** If the Gemini API key is missing or calls fail, a fallback simulation parses keywords to mock custom response layouts locally.

---

## 🌎 5. Real-World Impact

Carbona helps users achieve measurable reductions:
*   **Transit Swap:** Switching from a gasoline car to public transit (bus or rail) for a standard commute saves ~**1.2 tons CO₂ per year** (~100 kg CO₂/month).
*   **Grid Optimization:** Offsetting 200 kWh/month of coal-heavy Indian grid electricity through active reduction or solar energy cuts ~**164 kg CO₂/month** (~1.96 tons CO₂/year).
*   **Dietary Adjustments:** Moving from a meat-heavy diet to vegetarian weekdays prevents over ~**0.8 tons CO₂/year** from agricultural and feed emissions.
