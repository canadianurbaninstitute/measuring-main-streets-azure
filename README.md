# Measuring Main Streets – Developer Guide

A SvelteKit-based web application for interactive mapping, data visualization, and research tools, deployed on Azure Static Web Apps.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Development](#development)
- [Build & Deployment](#build--deployment)
- [Testing](#testing)
- [Linting & Formatting](#linting--formatting)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [Contact](#contact)

## Tech Stack
- **Framework:** [SvelteKit](https://kit.svelte.dev/) (Svelte 4)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Deployment:** [Azure Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/)
- **Mapping & Visualization:** [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/), [D3.js](https://d3js.org/), [LayerCake](https://layercake.graphics/)

## Project Structure
```
measuring-main-streets-azure/
├── src/                # SvelteKit app source code
│   ├── routes/         # SvelteKit file-based routing (pages, API, endpoints)
│   ├── lib/            # Shared Svelte components, assets, stores
│   └── app.html        # HTML template
├── static/             # Static assets (favicon, images, SVGs)
├── scripts/            # Utility scripts (e.g., setupTypeScript.js)
├── tests/              # Playwright end-to-end tests
├── package.json        # Project metadata, dependencies, scripts
├── svelte.config.js    # SvelteKit configuration (Azure adapter)
├── vite.config.js      # Vite configuration (plugins, DSV)
├── playwright.config.js# Playwright test config
```

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
- The project uses `svelte-adapter-azure-swa` for deployment.
- Output is generated in the `.svelte-kit` and `build` directories.
- Configure Azure SWA as per [adapter docs](https://github.com/Azure/static-web-apps-cli) and your environment.

## Contributing
- Fork the repository and create a feature branch.
- Follow existing code style and use Prettier for formatting.
- Write or update tests for new features.
- Open a pull request with a clear description of your changes.

## Contact
For technical questions or to report issues, please open an issue or contact the maintainers at [cui@canurb.org](mailto:cui@canurb.org?subject=Measuring%20Main%20Streets%20Technical%20Enquiry).
