# API Dev Docs

A three-page documentation site built with [VitePress](https://vitepress.dev), covering Axios HTTP requests and the GitHub REST API. Prose is linted with [Vale](https://vale.sh) using the Google style guide.

## Pages

| Page | Description |
|------|-------------|
| **Home** | Overview and quick-start links |
| **Tutorial** | Step-by-step guide to making API calls with Axios (GET, POST, error handling, TypeScript) |
| **API Reference** | GitHub REST API — Get User, List Issues, List Releases |

## Getting started

**Prerequisites:** Node.js 18 or later, npm.

```bash
# Install dependencies
npm install

# Start the local dev server
npm run docs:dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available scripts

| Script | Description |
|--------|-------------|
| `npm run docs:dev` | Start local dev server with hot reload |
| `npm run docs:build` | Build the static site to `docs/.vitepress/dist/` |
| `npm run docs:preview` | Preview the production build locally |

## Linting

Prose is linted with Vale using the [Google developer style guide](https://developers.google.com/style).

```bash
# Install Vale (Windows — requires winget)
winget install errata-ai.vale

# Download configured style packages
vale sync

# Run the linter
vale docs/
```

### Vale configuration

| File | Purpose |
|------|---------|
| `.vale.ini` | Main config — sets style, minimum alert level, and vocab |
| `.vale/styles/Google/` | Google style rules (synced via `vale sync`) |
| `.vale/styles/config/vocabularies/Tech/accept.txt` | Accepted technical terms (Axios, npm, REST, etc.) |

## Project structure

```
.
├── docs/
│   ├── .vitepress/
│   │   └── config.mts        # Site title, nav, and sidebar
│   ├── index.md              # Home page
│   ├── tutorial.md           # Axios tutorial
│   └── api-reference.md      # GitHub REST API reference
├── .vale.ini                 # Vale linter config
├── .gitignore
├── package.json
└── README.md
```
