# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Command | Description |
| ------- | ----------- |
| `npx serve .` | Run a local HTTP server to preview the game in the browser (no build step needed). |
| `git push` | Push local changes to GitHub; GitHub Actions automatically deploys to GitHub Pages. |
| `git pull` | Update your local branch from the remote. |

## Architecture

This is a Dig-Dug-style clone game with 3D graphics using Three.js. The game features a tile-based grid world where the player digs through blocks, avoids/defeats enemies, and progresses through levels.

### Key Files

- **`index.html`** – Entry point containing the Three.js canvas element and overlay UI (HUD: score, level, lives; blast button; music toggle).
- **`game.js`** – Main game logic: scene setup, camera, player/enemy/terrain meshes, input handling, collision detection, rendering, and animation loop.
- **`stages.json`** – Level configuration data (3 levels with enemy counts, hazard density, background music/image references).
- **`assets/`** – Media directory containing:
  - `music/party.mp3` – Background music
  - `backgrounds/` – Background images for each level (club.png, stadium.png, final.png)
  - `sprites/` – Game entity textures/models

### Deployment

The GitHub Actions workflow (`.github/workflows/gh-pages.yml`) automatically deploys to GitHub Pages when you push to `main`. The `dist/` directory is used for previewing deployed builds.

## Gameplay Mechanics

### Grid System
- 20×15 tile grid (each tile is 32×32 pixels in isometric projection)
- Border tiles are solid blocks; interior tiles are randomly generated
- Level progression occurs every 500 points (up to level 3)

### Player
- Controlled with arrow keys (← → ↑ ↓)
- Can dig blocks by clicking or pressing a dig key
- Has a blast ability (Space or click blast button) with cooldown

### Enemies
Three types of enemies that patrol horizontally and bounce off walls:
- **bubble** – Green, can be inflated then popped
- **gloom** – Dark enemy with different behavior
- **normal** – Standard enemy

### Hazards
- Magma pits reset player position
- Hazard density increases per level

### Power-ups
- Collectible items that grant temporary buffs (boosted blast radius)
- Score increases (+100 per power-up)
- High score persisted via localStorage

## Development Notes

### Three.js Implementation
The game uses Three.js with:
- WebGLRenderer for the canvas
- Orthographic camera for isometric/top-down view
- 3D geometry for terrain blocks (boxes)
- Lighting for depth perception
- Particles for blast effects

### Input Handling
- Arrow keys for movement
- Click or keyboard for digging
- Space/burst button for blast ability
- Music toggle button for audio control

### Audio
- Background music from `assets/music/party.mp3`
- Browser autoplay policy requires user interaction first
- Music toggle button allows play/pause

### Level Data
Each level is defined in `stages.json` with:
- `id` – Level number
- `gridPattern` – Tile generation pattern
- `enemyCount` – Number of enemies
- `hazardDensity` – Probability for hazard placement
- `bgMusic` – Music file reference
- `bgImage` – Background image reference

## Existing Memory

Read `C:\Users\Cadel\.claude\memory\MEMORY.md` for persisted session memory about this project and user preferences.
