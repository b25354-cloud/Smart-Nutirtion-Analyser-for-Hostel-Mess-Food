# MessMate AI

Production-ready architecture scaffold for a multi-college smart nutrition analyzer focused on hostel and mess food.

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS + design tokens
- Firebase Authentication + Firestore
- Gemini API client scaffold
- Recharts wrappers
- React Router route tree + guards
- React Hook Form wrappers
- Framer Motion tokenized transitions
- Zustand + TanStack Query state strategy
- Zod runtime validation stubs

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

## Quality Commands

```bash
npm run lint
npm run build
```

## Architecture Coverage

### 1) Folder structure
- App composition and providers: `src/app/*`
- Modular route system: `src/app/router/*`
- Shared components: `src/components/*`
- Service boundaries: `src/services/*`
- Shared types and schemas: `src/types/*`, `src/schemas/zod/*`
- Utilities: `src/utils/*`
- Config and environment: `src/config/*`

### 2) Routing architecture
- Constants: `src/app/router/constants.ts`
- Route tree and layouts: `src/app/router/index.tsx`, `layouts/*`
- Guards: `ProtectedRoute`, `RoleRoute`
- Not-found and route stubs included

### 3) Firestore schema
- Multi-college schema and index guidance in `docs/architecture/firestore-schema.md`
- Collection constants and key strategies in `src/types/firestore.ts`

### 4) TypeScript interfaces
- Domain, API, Firestore, and UI types in `src/types/*`
- Includes required entities and guard-friendly unions (`UserRole`, `MealType`)

### 5) Services structure
- Firebase config/auth/firestore clients in `src/services/firebase/*`
- Repository stubs: colleges/menu/tracking/analysis
- Gemini client + prompts scaffold
- Mappers and validators with safe result types

### 6) Reusable component hierarchy
- Common UI: Button, Card, Modal, Loader, EmptyState
- Form wrappers: FormField, SelectField, DateField
- Chart wrappers: NutrientRadarChart, WeeklyTrendChart, ScoreGaugeChart
- Nutrition UI: NutrientChip, GapIndicator, MealTag
- Layout: AppShell, TopNav, Sidebar

### 7) State management strategy
- Zustand stores for auth, college context, tracking filters, and UI
- TanStack Query key factory in `src/app/query/queryKeys.ts`

### 8) Theme system
- Tailwind + CSS variable tokens in `src/app/styles/tokens.css`
- Light, dark, and high-contrast ready themes
- Motion tokens in `src/config/theme.ts`

### 9) Utility structure
- Date helpers, nutrition aggregation, score and ranking scaffolds
- Role guard and error helper modules
- Zod schema stubs for runtime validation

### 10) Environment variable structure
- `.env.example` + typed validation in `src/config/env.ts`
- Developer-friendly startup validation for required variables

## Notes

This scaffold intentionally avoids implementing production pages and business workflows. It is designed to be an extensible foundation for future feature development.
