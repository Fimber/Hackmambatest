---
layout: home

hero:
  name: 'API Dev Docs'
  text: 'HTTP clients and REST APIs for JavaScript developers'
  tagline: Practical guides covering Axios, the GitHub REST API, and modern async patterns.
  actions:
    - theme: brand
      text: Axios Tutorial
      link: /tutorial
    - theme: alt
      text: GitHub API Reference
      link: /api-reference

features:
  - icon: 🚀
    title: Make Your First API Call
    details: Learn to use Axios to send GET and POST requests, configure reusable clients, and handle errors cleanly in any Node.js project.
    link: /tutorial
    linkText: Start the tutorial
  - icon: 📖
    title: GitHub REST API Reference
    details: Full endpoint reference for the GitHub REST API—users, issues, and releases—with example requests, responses, and error codes.
    link: /api-reference
    linkText: Browse the reference
  - icon: ⚡
    title: ES Module Ready
    details: Every example uses native ES module syntax (import/export) and runs on Node.js 18 or later without extra tooling.
---

## What's in these docs

| Page | What it covers |
|------|----------------|
| [Tutorial](./tutorial) | Axios setup, GET, POST, reusable instances, error handling, TypeScript |
| [API Reference](./api-reference) | GitHub REST API—Get User, List Issues, List Releases |

## Prerequisites

- **Node.js 18 or later**—run `node --version` to check
- **npm**—bundled with Node.js
- A code editor
- Working knowledge of `async`/`await`
