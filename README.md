# Smart Nutrition Analyser for Hostel Mess Food (MessMate AI) 🥗📊

A TypeScript-first, full-stack web application designed to help university students track daily nutritional intake effortlessly.  
By combining AI-based food recognition, nutrition analytics, and student-centric dashboards, MessMate AI reduces guesswork in hostel mess eating.

## Live Demo
[https://smart-nutirtion-analyser-for-hostel-flame.vercel.app/](https://smart-nutirtion-analyser-for-hostel-flame.vercel.app/)

---

## ✨ Core Features

- **AI-Powered Food Detection**  
  Upload/snap a meal image. The app is structured to use Gemini Vision to identify foods and map them against hostel mess and outside-food nutrition sources.

- **Personalized Nutrition Dashboard**  
  Track macro breakdown (protein, carbs, fats) and micronutrient progress with interactive visualizations.

- **7-Day Trend Analysis**  
  Rolling day/week insights to help students understand consistency and nutrition patterns over time.

- **Smart AI Coaching (Scaffolded)**  
  Generates contextual, actionable guidance based on recent meal history and nutrition targets.

- **Institutional Student Flow**  
  Supports student-centric onboarding (e.g., roll number capture) for localized campus deployment.

---

## 🏗️ Architecture & Project Status

This repository is currently in a **scaffold/foundation phase** with production-ready structure, routing, service boundaries, and typed data contracts in place.

### What is implemented now
- App architecture and modular folder organization
- Route tree and guard patterns
- Firestore schema guidance and type scaffolding
- Service/repository boundaries for data + AI integration
- Shared reusable UI/form/chart wrappers
- Theme tokens and utility modules

### What is intentionally not fully complete yet
- End-to-end production workflows
- Finalized business logic for all user journeys
- Fully integrated AI + nutrition database pipelines in all flows

---

## 🧱 Backend/Data Model (Firestore-Oriented Design)

The app uses a serverless architecture with Firebase Authentication + Cloud Firestore (scaffold and docs included).

Planned/Documented core collections:

- **`users`**  
  User profile, student metadata (e.g., roll number), goals/preferences.

- **`meal_logs`**  
  Time-series meal entries with timestamps, detected foods, optional image metadata, and nutrition aggregates.

- **`mess_database`**  
  Predefined nutrition values for recurring hostel meals to improve consistency and accuracy.

Firestore architecture notes are documented in:
- `docs/architecture/firestore-schema.md`

---

## 🛠️ Tech Stack

- **Frontend:** React 19 + Vite + TypeScript
- **Styling:** Tailwind CSS (tokenized design system)
- **Auth & Data Layer:** Firebase Authentication + Firestore
- **AI Integration (Scaffold):** Gemini API client structure
- **Charts:** Recharts
- **Routing:** React Router (route tree + guards)
- **Forms:** React Hook Form
- **Validation:** Zod
- **State Management:** Zustand + TanStack Query
- **Motion:** Framer Motion

---

## 📁 Project Structure

```text
.
├── docs/                      # Architecture and schema documentation
├── public/                    # Static assets
├── src/                       # Application source code
├── index.html                 # Vite entry HTML
├── package.json               # Scripts and dependencies
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
├── tsconfig.json              # TypeScript base config
├── tsconfig.app.json          # TS config for app
└── tsconfig.node.json         # TS config for node/vite tooling
```

### Key Architecture Areas
- **App composition/providers:** `src/app/*`
- **Routing system:** `src/app/router/*`
- **Reusable components:** `src/components/*`
- **Service layer:** `src/services/*`
- **Types & schemas:** `src/types/*`, `src/schemas/zod/*`
- **Utilities:** `src/utils/*`
- **Config/env:** `src/config/*`

---

## 🧠 Nutrition Score Methodology & Scoring Logic

### 3.3 Scoring Logic: Nutrient Weighting Justification

The 100-point weight distribution is not arbitrary; it is strategically engineered to address the specific nutritional challenges faced by university students eating hostel mess food. The weights prioritize foundational energy balance and muscle recovery, while heavily penalizing the common pitfalls of institutional diets (excessive carbs, fats, and sodium, with low fiber).

Here is the scientific and practical rationale behind the percentage assignments:

#### Energy & Foundation (25%)

- **Calories (25%)**: Energy balance is the absolute foundation of human nutrition. Whether a student is studying late into the night or engaging in physically demanding campus activities, caloric intake dictates energy levels, focus, and metabolic health. It is assigned the highest weight because severe underconsumption leads to fatigue, while severe overconsumption leads to lethargy and weight gain.

#### Macronutrient Balance (40%)

- **Protein (20%)**: Institutional vegetarian diets are notoriously deficient in high-quality protein. We assigned it a heavily weighted 20% to encourage students to seek out protein-dense mess options (like lentils, paneer, or eggs). This is crucial for muscle recovery, especially for students involved in active clubs, sports, or demanding physical routines.

- **Carbohydrates (10%) & Fats (10%)**: Hostel food typically over-indexes on cheap carbohydrates (rice, rotis, potatoes) and cooking oils. Because students rarely struggle to hit these targets, they are weighted lower than protein. The scoring logic here acts more as a guardrail against extreme overconsumption rather than an incentive to eat more.

#### Micronutrients & Digestive Health (35%)

- **Fiber (10%)**: Given the heavy, carb-dense nature of mess food, digestion often suffers. Fiber is given a uniquely high weight (10%) to actively incentivize students to eat the often-ignored salads, raw vegetables, and whole grains served in the mess, ensuring steady blood sugar and preventing post-meal sluggishness.

- **Iron (6%) & Calcium (6%)**: These are the two most common mineral deficiencies in young adults. Iron is critical for blood oxygenation (affecting cognitive focus), and calcium is essential for bone density. Their equal weighting ensures the algorithm rewards the consumption of dairy and leafy greens.

- **Vitamins C (4%) & A (3%), Potassium (3%)**: These support immune function and eye health (critical for students with high screen time). They receive smaller weights because hitting the fiber and calorie targets usually brings these along naturally, but tracking them ensures a varied diet.

- **Sodium (3%)**: Mess curries and late-night outside snacks are typically very high in salt. Tracking sodium serves primarily as a penalty metric to discourage students from relying heavily on processed junk food.

### 3. How We Did It (Methodology & Implementation)

To achieve a seamless and automated meal-tracking experience, we engineered a full-stack web application centered around a serverless architecture and AI vision integration. The implementation was divided into three core phases: Frontend Development, Backend Architecture, and AI Integration.

#### 3.1 Technical Stack

- **Frontend**: React, Recharts (for dynamic data visualization).
- **Backend & Database**: Firebase Authentication, Cloud Firestore (for time-series data storage).
- **AI Integration**: Gemini Vision API.

#### 3.2 Step-by-Step Implementation Flow

1. **User Onboarding & Target Initialization**: We implemented a custom authentication flow using Firebase. During signup, the system captures the student's institutional roll number and establishes baseline daily nutritional targets (Calories, Protein, Fats, Carbohydrates, and key micronutrients) mapped to their specific profile.

2. **AI-Powered Food Detection (The Input Phase)**: Instead of relying on manual entry, we integrated the Gemini Vision API. When a student uploads or snaps a photo of their mess plate, the frontend sends the image to the API. We engineered the prompts to identify the specific food items and cross-reference them against a predefined database of standard hostel mess meals and local food options to ensure accurate identification.

3. **Data Aggregation & Scoring Logic (The Processing Phase)**: Once the food items are identified, the system calculates the total nutritional value of the meal. We developed a proprietary 100-point Nutrition Score algorithm. This logic runs through a weighted, piecewise interpolation model that compares the consumed nutrients against the user's daily targets:
   - **Weighting**: Energy and macros account for 65% of the score (e.g., Calories 25%, Protein 20%), while micronutrients account for 35%.
   - **Evaluation**: The algorithm identifies a "sweet spot" (±10% of the target) for a perfect score and applies progressive mathematical penalties for both underconsumption and overconsumption.

4. **Real-Time Data Visualization (The Output Phase)**: The calculated data is immediately written to Firebase Firestore under the user's `meal_logs` collection. The frontend then queries this time-series data—pulling rolling 7-day windows—and feeds it into React Recharts. This generates the interactive Daily and Weekly progress bars and macronutrient pie charts, giving the user immediate, visual feedback on their dietary adherence.

### Nutrition Score Definition

The Nutrition Score is a dynamic, 100-point quantitative metric that evaluates a user's dietary adherence by tracking 11 specific nutritional markers against personalized daily targets. Rather than a simple pass/fail threshold, the algorithm utilizes a weighted, piecewise interpolation model. It rewards maximum points for consumption within a ±10% optimal range ("the sweet spot") and applies progressive algorithmic penalties for both underconsumption and overconsumption. This provides a precise, data-driven benchmark of a student's overall metabolic balance.

### The Scoring Logic (Algorithm)

The code calculates the final score by evaluating each nutrient individually, scoring it from 0 to 100 based on how close it is to the target, and then blending them together using a weighted average.

#### 1) The Weight Distribution

The algorithm distributes 100 total weight points across 11 nutrients. It heavily prioritizes energy and protein, while still keeping a strict eye on micronutrients.

| Category | Nutrient | Weight |
|---|---|---|
| Energy & Macros (65%) | Calories | 25% |
| Energy & Macros (65%) | Protein | 20% |
| Energy & Macros (65%) | Carbohydrates | 10% |
| Energy & Macros (65%) | Fat | 10% |
| Micros & Minerals (35%) | Fiber | 10% |
| Micros & Minerals (35%) | Iron | 6% |
| Micros & Minerals (35%) | Calcium | 6% |
| Micros & Minerals (35%) | Vitamin C | 4% |
| Micros & Minerals (35%) | Vitamin A | 3% |
| Micros & Minerals (35%) | Potassium | 3% |
| Micros & Minerals (35%) | Sodium | 3% |

> Note: If a target value for any nutrient is `0` or missing, the algorithm safely ignores it and adjusts the total weight accordingly.

#### 2) The Ratio Calculation

For every nutrient, the backend calculates an adherence ratio (`R`):

```math
R = \frac{\text{Consumed Value}}{\text{Target Value}}
```

#### 3) The Piecewise Scoring Bands

Once ratio `R` is calculated, the nutrient is scored on a scale of 0 to 100 using a piecewise linear interpolation model, so score transitions are smooth rather than abrupt.

- **Sweet Spot (±10% of target)**
  - If `0.9 ≤ R ≤ 1.1`, score = `100`.

- **Undereating Penalties (Linear Drop)**
  - Mild (`70% - 90%`): drops smoothly from `100` to `80`.
  - Moderate (`50% - 70%`): drops smoothly from `80` to `50`.
  - Severe (`< 50%`): drops directly proportional to intake (e.g., `R = 0.4` gives score `40`).

- **Overeating Penalties (Steeper Drop)**
  - Mild (`110% - 130%`): drops smoothly from `100` to `75`.
  - Moderate (`130% - 160%`): drops steeply from `75` to `35`.
  - Severe (`160% - 200%`): drops from `35` to `10`.
  - Extreme (`> 200%`): bottoms out at a flat score of `5`.

#### 4) Final Aggregation

The final score is the sum of all weighted nutrient scores, divided by the total available weight, bounded between 0 and 100, and rounded to the nearest integer:

```math
\text{Final Score} = \text{round}\left( \frac{\sum (\text{Nutrient Score} \times \text{Weight})}{\sum \text{Weights}} \right)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS recommended)
- npm

### Installation
```bash
npm install
cp .env.example .env
npm run dev
```

---

## 📜 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Type check + production build
npm run lint     # Lint source code
npm run preview  # Preview production build
```

---

## 🔐 Environment Variables

Create a `.env` file from `.env.example` and fill required values:

```bash
cp .env.example .env
```

Environment validation is handled in:
- `src/config/env.ts`

---

## 🧪 Development Notes

- Route guards include `ProtectedRoute` and `RoleRoute`.
- State strategy uses **Zustand** (app/client state) + **TanStack Query** (async/server-state patterns).
- Theme system is tokenized and structured for light/dark/high-contrast readiness.
- Utility modules include date helpers, nutrition aggregation, ranking/score scaffolds, and validation helpers.

---

## 🗺️ Roadmap
- [ ] Dietary alerts (allergens + preference conflicts such as vegan/lactose-free)
- [ ] Admin dashboard with anonymized aggregate nutrition insights
- [ ] Offline/PWA capability for low-connectivity logging

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch  
3. Commit your changes  
4. Open a pull request

---

## 📄 License

No license file is currently defined in this repository.
