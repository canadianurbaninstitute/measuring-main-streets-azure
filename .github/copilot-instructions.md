# Copilot instructions for this repository ✅

Short, actionable guidance for AI coding agents working on Measuring Main Streets (SvelteKit + Vite).

## Quick facts
- Run locally: `npm run dev` (Vite).  Node >= 18.13 is required.
- Build: `npm run build` (SvelteKit via Vite + Azure adapter)
- Preview static build: `npm run preview`
- Tests: `npm test` (runs Playwright; config in `playwright.config.js` runs `npm run build && npm run preview` and expects the site on port 4173)
- Formatting & linting: `npm run format`, `npm run lint`, `npm run check` (svelte-check)
- Unused asset scan: `npm run knip`

## Where to look (high value files)
- Project entry & scripts: `package.json`
- SvelteKit config & Azure adapter: `svelte.config.js`
- CI/CD (Azure Static Web Apps): `.github/workflows/azure-static-web-apps-happy-mud-0b96d900f.yml`
- Playwright test config: `playwright.config.js`
- Supabase client: `src/routes/lib/supabaseClient.js`
- Example server route querying Supabase: `src/routes/mainstreets-measures/+server.js`
- Cloudinary server vs client usage: look at `+page.server.js` files under `src/routes/casestudies/*` (server uses `cloudinary.v2` with secrets) and corresponding `+page.svelte` (uses `cloudinary-build-url` + `setConfig({ cloudName })` client-side). Example: `src/routes/casestudies/edmonton/104streetdowntown/+page.server.js` & `+page.svelte`.
- Map components and tokens: `src/routes/lib/ui/CaseStudyMap.svelte` (sets `mapboxgl.accessToken` directly and defines styles like `mapbox://styles/…`). Many other pages also set `mapboxgl.accessToken`.
- Data: static/case study data lives in `src/routes/lib/data/` (lots of JSON/JS files). Use these imports rather than external calls when possible.

## Important environment variables & secrets
- SUPABASE_URL, SUPABASE_ANON_KEY — used by `src/routes/lib/supabaseClient.js` and in CI (`$env/static/private`).
- CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET — used by server pages (Cloudinary v2) to fetch JSON lists of images.
- Azure SWA token: `AZURE_STATIC_WEB_APPS_API_TOKEN_*` supplied in the workflow for deployment.

Notes: Cloudinary uses `cloudName` on the client (`setConfig({ cloudName })`) while secrets are only needed server-side. Mapbox access tokens are currently embedded in components (e.g. `CaseStudyMap.svelte`) — changing tokens requires editing those components.

## Architecture & data flow (short)
- SvelteKit-based single-repo website with heavy static content under `src/routes/casestudies/` and `src/routes/reports/`.
- Static datasets (geo, charts, etc.) are stored in `src/routes/lib/data/*` and imported directly into Svelte pages.
- Media images are hosted on Cloudinary. Server endpoints fetch lists from Cloudinary (using API secrets) and client-side code constructs URLs with `cloudinary-build-url` and a public cloud name.
- Map visualizations rely on Mapbox GL JS and multiple custom styles (styles are hard-coded per case study page).
- Supabase is used for fetching main street-specific measures via server routes (example: `mainstreets-measures` table).

## Conventions & patterns to follow (project-specific)
- Routing & pages follow SvelteKit conventions: use `+page.svelte`, `+page.server.js`, `+server.js` for endpoints.
- Case study content is organized by city and path: `src/routes/casestudies/<city>/<case-study>/+page.svelte` and matching `+page.server.js` when server-side image lists are required.
- Localization is file/folder-based: e.g. `montreal` vs `montreal-fr` — duplicate structure for French pages.
- Mapbox tokens are often set in components as `mapboxgl.accessToken = 'pk.*'` — search for `mapboxgl.accessToken =` to find where to update.
- Image building on the client uses `buildImageUrl(public_id, options)`; server code typically requests a Cloudinary list and passes `resources` into page data.

## Tests & CI tips
- Playwright tests run against a built preview; make sure build succeeds and required env vars are present (Cloudinary keys, SUPABASE settings may be required for server routes during build).
- CI deploys to Azure Static Web Apps; `output_location` is `build/static` and `api_location` is `build/server` (see workflow file).

## Safety & maintenance notes for an agent
- Avoid embedding new long-lived secrets directly in the repo. Use environment variables and the repo's secrets (see workflow for examples).
- Beware of hard-coded public tokens (Mapbox public tokens are embedded). If rotating Mapbox tokens, update every file that sets `mapboxgl.accessToken` and verify map styles still load.
- When altering case study content, check both `+page.server.js` and `+page.svelte` for related logic (server fetch vs client rendering).

## Quick examples (use these as templates)
- Querying Supabase from a server route (existing example): `src/routes/mainstreets-measures/+server.js`.
- Cloudinary server list fetch pattern: see `+page.server.js` files under `src/routes/casestudies/*`.
- Map component with style and token: `src/routes/lib/ui/CaseStudyMap.svelte`.

---
If you'd like, I can refine this further (shorten, add more code examples, or highlight particular files). What would you like to emphasize or add? 🔧