# Smart Nutrition Analyser for Hostel Mess Food (MessMate AI)

A TypeScript-first React application scaffold for analyzing hostel/mess food nutrition across multiple colleges.  
This repository currently provides architecture, routing, services, state management, and UI foundations for future feature development.

## Live Demo
[https://smart-nutirtion-analyser-for-hostel.vercel.app](https://smart-nutirtion-analyser-for-hostel-flame.vercel.app/)

---

## Tech Stack

- **Frontend:** React 19 + Vite + TypeScript
- **Styling:** Tailwind CSS (design tokens based)
- **Auth & Data Layer:** Firebase Authentication + Firestore (scaffold)
- **AI Integration (Scaffold):** Gemini API client structure
- **Charts:** Recharts
- **Routing:** React Router (route tree + guards)
- **Forms:** React Hook Form
- **Validation:** Zod
- **State Management:** Zustand + TanStack Query
- **Motion:** Framer Motion

---

## Project Status

This project is in a **scaffold/foundation phase**.

It includes:
- App architecture and modular folder organization
- Route structure and route guards
- Firestore schema guidance and type scaffolding
- Service boundaries and repository stubs
- Shared UI/form/chart wrapper components
- Theme tokens and utility modules

It intentionally does **not** yet include complete production workflows or final business logic.

---

## Project Structure

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

---

## Key Architecture Areas

- **App composition/providers:** `src/app/*`
- **Routing system:** `src/app/router/*`
- **Reusable components:** `src/components/*`
- **Service layer:** `src/services/*`
- **Types & schemas:** `src/types/*`, `src/schemas/zod/*`
- **Utilities:** `src/utils/*`
- **Config/env:** `src/config/*`

Firestore architecture notes are documented in:
- `docs/architecture/firestore-schema.md`

---

## Getting Started

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

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Type check + production build
npm run lint     # Lint source code
npm run preview  # Preview production build
```

---

## Environment Variables

Create a `.env` file from `.env.example` and fill required values.

```bash
cp .env.example .env
```

Environment validation is handled in:
- `src/config/env.ts`

---

## Development Notes

- Route guards include `ProtectedRoute` and `RoleRoute`.
- State strategy uses **Zustand** (local/global app state) + **TanStack Query** (server-state patterns).
- Theme supports tokenized styling and is structured for light/dark/high-contrast readiness.
- Utility modules include date helpers, nutrition aggregation, ranking/score scaffolds, and validation helpers.

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## License

No license file is currently defined in this repository.
