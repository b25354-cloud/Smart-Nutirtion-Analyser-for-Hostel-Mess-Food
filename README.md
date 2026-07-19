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

- [ ] Wearable integration (Google Fit / Apple Health)
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
