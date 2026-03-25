# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

| Command | Description |
|---------|-------------|
| `npx serve .` | Run a local HTTP server to preview the game in the browser (no build step needed). |
| `npx serve dist` | After the GitHub Actions workflow deploys to `dist/`, preview the built site. |
| `git push` | Push local changes; GitHub Actions automatically deploys to GitHub Pages. |
| `git pull` | Update your local branch from the remote. |

## High‑Level Architecture

The project is a minimal client‑side web game, built entirely with vanilla JavaScript and HTML. The key files and their responsibilities are:

- **`index.html`** – The entry point of the web app. It sets up the page, includes the canvas element, and loads `game.js`. It also provides a simple music‑toggle button.
- **`game.js`** – Contains all game logic: grid initialization, player/enemy objects, input handling, collision detection, and rendering. The game runs in the browser’s animation loop via `requestAnimationFrame`.
- **`assets/`** – Directory for media such as background music (`party.mp3`). The code expects a file named `assets/party.mp3`.
- **`.github/workflows/gh-pages.yml`** – GitHub Actions workflow that automatically builds (serves) and deploys the current repository to GitHub Pages whenever changes are pushed to `main`.
- **`README.md`** – Provides a short description of the game and deployment instructions.

The repository does not include a build or test harness – the entire application is static and can be run locally with any HTTP server. Deployments are handled automatically by GitHub Pages.

## Notes for Future Work

- Adding a `package.json` with npm scripts could simplify local development.
- If unit tests are added later, they should be placed under a `tests/` directory and executed with a test runner like Jest.
- Consider adding a `src/` directory if the codebase grows to keep source files organized.

---
