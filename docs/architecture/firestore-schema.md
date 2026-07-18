# Firestore Schema (Multi-College)

## Collections

- `colleges/{collegeId}`: `code`, `name`, `timezone`, `active`
- `users/{uid}`: `collegeId`, `role`, `hostelId`, `dietaryPreferences`, `createdAt`
- `hostels/{hostelId}`: `collegeId`, `messId`, `name`
- `messes/{messId}`: `collegeId`, `hostelId`, `name`
- `menus/{menuId}`: `collegeId`, `messId`, `date`, `meals[]`
- `foodItems/{foodItemId}`: `collegeId`, `name`, `category`, `servingSize`, `nutrients`
- `mealLogs/{mealLogId}`: `uid`, `collegeId`, `messId`, `date`, `mealType`, `selectedItemIds[]`, `source`
- `dailyNutrition/{uid_yyyy-mm-dd}`: `uid`, `collegeId`, `date`, `totals`, `score`, `gaps[]`
- `weeklyNutrition/{uid_weekStart}`: `uid`, `collegeId`, `weekStart`, `scores[]`, `recurringGaps[]`
- `aiInsights/{insightId}`: `uid`, `collegeId`, `dateRangeKey`, `summary`, `suggestions[]`, `generatedAt`

## Composite Index Guidance

Create these indexes first:

1. `menus`: `(collegeId ASC, messId ASC, date ASC)`
2. `mealLogs`: `(uid ASC, date DESC)`
3. `dailyNutrition`: `(uid ASC, date DESC)`
4. `weeklyNutrition`: `(uid ASC, weekStart DESC)`
5. `users`: `(collegeId ASC, role ASC)`

## Keys and Naming Conventions

- Store IDs in `camelCase` fields and use stable, lowercase collection names.
- Prefix analytics docs with user context where deterministic lookup is needed:
  - `dailyNutrition`: `uid_yyyy-mm-dd`
  - `weeklyNutrition`: `uid_weekStartDate`
- Keep all tenant-sensitive records explicitly keyed by `collegeId` even when nested in user-based queries.
