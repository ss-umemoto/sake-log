# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Sake Log (日本酒ログ) — an Expo / React Native TypeScript app for journaling sake tastings. The visual system is sourced from a Stitch design project and re-implemented as a local RN design system under `src/theme/` + `src/components/`.

## Commands

- `npm run start` — Expo dev server (Metro)
- `npm run web` / `npm run ios` / `npm run android` — launch target platform
- `npx tsc --noEmit` — type check (strict). There is no ESLint, Prettier, or test runner configured; `tsc` is the only check.
- `npx expo install <pkg>` — add native-aware dependencies (prefer this over `npm install` for Expo-managed packages so SDK-compatible versions are picked).

The devcontainer's `postCreateCommand.sh` registers the **Stitch MCP server** so the AI can create/update the Stitch design system and generate screens from prompts. The Stitch project is `projects/16062033344857122900` (asset `assets/637580641448852477`).

## Architecture

### Design system flow (Stitch → RN)
Stitch owns the source-of-truth design tokens (primary `#C28840`, `NEWSREADER` headline / `INTER` body, `ROUND_TWELVE`). Those tokens are mirrored manually into `src/theme/` — Stitch does not emit RN code, so any token change must be applied in both places. Tokens live in separate files (`colors.ts`, `typography.ts`, `spacing.ts`, `shadows.ts`) and are composed into `theme.ts` (`lightTheme`, `darkTheme`). `ThemeProvider.tsx` picks between them based on `system` / `light` / `dark`, and components read via `useTheme()`.

**Hard rule:** components never hardcode colors, font sizes, radii, or spacing — always go through `useTheme()`. New tokens get added to the theme files first, then consumed.

### Component library (`src/components/`)
All components are theme-aware and exported from `src/components/index.ts`. `Text` resolves typography variant + semantic color; `Button` has `filled | tonal | outline | ghost` × `sm | md | lg`; `Screen` is the root wrapper that applies safe-area + background; `Stack` is the layout primitive (prefer it over raw `View` with flex styles). `ImagePickerField` wraps `expo-image-picker` with permission handling and preview UI.

### Persistence (`src/lib/records.ts`)
Records are JSON in AsyncStorage (`sake-log:records:v1`). Images are copied from the picker's temporary cache URI into `documentDirectory/sake-images/` so they survive cache purges. Uses the **new class-based `expo-file-system` API** (`File`, `Directory`, `Paths`) — not the legacy functional API. If you need the legacy API, import from `expo-file-system/legacy` explicitly.

### Fonts
Google Fonts are loaded at app start via `@expo-google-fonts/newsreader` + `@expo-google-fonts/inter` in `app/_layout.tsx`. The typography tokens reference these exact family names (e.g. `Newsreader_600SemiBold`), so swapping a weight requires loading that weight in `_layout.tsx` **and** updating `fontFamilies` in `src/theme/typography.ts`.

### Routing (`app/`)
Uses **expo-router** (file-based). Entry is `expo-router/entry` via `package.json#main`; do not recreate `App.tsx` or `index.ts`. Layout:

- `app/_layout.tsx` — root Stack. Wraps everything in `ThemeProvider`, loads fonts, themes the native header.
- `app/(tabs)/_layout.tsx` — bottom tabs (`一覧`, `記録`). The `(tabs)` group removes itself from the URL.
- `app/(tabs)/index.tsx` — record list (route `/`).
- `app/(tabs)/new.tsx` — new-record form (route `/new`). On save, navigates to `/` so the list refreshes.
- `app/records/[id].tsx` — detail (route `/records/:id`), stacked on top of tabs.

List/detail screens use `useFocusEffect` (re-exported from `expo-router`) to refetch on tab focus rather than holding state in a global store. `src/screens/ShowcaseScreen.tsx` is **not** routed — it's a component reference/demo.

`app.json` has `"scheme": "sakelog"` for deep linking.

## Conventions

- **Language**: all user-facing copy is Japanese, including `Alert` messages and `accessibilityLabel`.
- **Date format**: records use `YYYY-MM-DD` strings; `RecordScreen` validates with the `DATE_PATTERN` regex. No date library is used.
- **IDs**: `makeId()` in `records.ts` combines `Date.now()` + random — fine for local-only storage, replace if adding sync.
