# Measuring Main Streets

Welcome to the Measuring Main Streets Platform repo. MMSP is a SvelteKit-based web application for interactive mapping, data visualization, and research tools, deployed with Azure Static Web Apps.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Development](#development)
- [Build & Deployment](#build--deployment)
- [Testing](#testing)
- [Linting & Formatting](#linting--formatting)
- [Scripts](#scripts)
- [Translation (English / French)](#translation-english--french)
- [Contributing](#contributing)
- [Contact](#contact)

## Tech Stack
- **Framework:** [SvelteKit](https://kit.svelte.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Deployment:** [Azure Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/) via [svelte-adapter-azure-swa](https://github.com/geoffrich/svelte-adapter-azure-swa)
- **Mapping:** [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- **Data Visualization**: [D3.js](https://d3js.org/), [LayerCake](https://layercake.graphics/), [ONSvisual/svelte-charts](https://github.com/ONSvisual/svelte-charts)
- **UI Library:** [Bits UI](https://bits-ui.com/)

## Setup & Installation
### Prerequisites
- Node.js v18.13 or higher
- npm (comes with Node.js)

### Install dependencies
```bash
npm install
```

## Development
Start the SvelteKit development server:
```bash
npm run dev
```
- App runs at [http://localhost:5173](http://localhost:5173) by default.
- Hot module reloading is enabled.

## Build & Deployment
Build the app for production:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

### Azure Static Web Apps
- The project uses [`svelte-adapter-azure-swa`](https://github.com/geoffrich/svelte-adapter-azure-swa) for deployment.
- Each commit to main triggers a Github Action which deploys the app. You can view the Github Action under 'Actions'.

## Translation (English / French)
The site is bilingual without any third-party translation service. French pages are served under `/fr/` (e.g. `/fr/about/`) from the same route files as the English pages, and the top bar has an EN / FR toggle.

When you add or change content, add the Canadian French text next to the English using `getLang()` from `src/routes/lib/i18n.js`. See [docs/translation-guide.md](docs/translation-guide.md) for the patterns, style rules and glossary.

## Contributing
- Create a feature branch.
- Follow existing code style.
- Write or update tests for new features.
- Open a pull request with a clear description of your changes.

## Contact
For technical questions or to report issues, please open an issue or contact us at [cui@canurb.org](mailto:cui@canurb.org?subject=Measuring%20Main%20Streets%20Technical%20Enquiry).
