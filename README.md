# SP-PLAY-SCHOOL

Lightweight starter for the SP Play School frontend.

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview production build locally:

```bash
npm run preview
```

## Available npm scripts

- `dev`: Starts Vite dev server
- `build`: Builds the production bundle
- `build:dev`: Builds with development mode
- `preview`: Serves the production build locally
- `lint`: Runs `eslint` over the project

## Project structure (important files)

- [src/main.tsx](src/main.tsx) — app entry
- [src/App.tsx](src/App.tsx) — root component
- [src/pages](src/pages) — route pages (e.g., `Analytics.tsx`, `Login.tsx`)
- [src/components](src/components) — UI components and features
- [src/lib](src/lib) — utilities, store, analytics
- [src/data/seedData.ts](src/data/seedData.ts) — example seed data
- [public](public) — static assets
- [vite.config.ts](vite.config.ts) — Vite configuration
- [tailwind.config.ts](tailwind.config.ts) — Tailwind configuration

## Tech stack

- Vite
- React + TypeScript
- Tailwind CSS
- shadcn-ui / Radix UI primitives

## Depolyment

- Vercel 
