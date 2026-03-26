# Chaos Country Rave

A chaotic, energetic 2-D web game inspired by *Dig Dug* and a Miley Cyrus vibe. The player digs through a grid of blocks while avoiding enemies. Music can be toggled on or off.

## Current Status

**Work in progress** - The game is not yet fully functioning. Core features are in place but require additional work before gameplay is smooth and complete.

## Files

- **`index.html`** – Entry point with canvas element and music toggle button
- **`game.js`** – Main game logic: grid generation, player movement, enemy AI, collision detection, rendering, and audio
- **`assets/`** – Media directory for background music (`party.mp3`) and sprites
- **`stages.json`** – Level data (fetches on game start)

## What's Been Implemented

- **Grid world** – 20×15 tile grid with randomly generated blocks and solid borders
- **Player** – Pink square controlled with arrow keys
- **Digging** – Click to remove blocks
- **Enemies** – Green squares that patrol horizontally and bounce off walls
- **Power-ups** – Collectible items that grant temporary buffs (boosted blast radius, etc.)
- **Magma pits** – Hazards that reset player position
- **Score system** – Points for collecting power-ups and persistent high score via localStorage
- **Level progression** – Auto-advance every 500 points
- **Music toggle** – Play/pause background music (`assets/party.mp3`)

## Known Issues

- Game fetches `stages.json` but file does not exist yet
- Duplicate variable declarations in `game.js` (some code is duplicated)
- Missing sprite assets (references placeholder images)
- Music autoplay is muted due to browser policy (requires user interaction)

## How to Fix

1. Create `stages.json` with level data
2. Add proper sprite assets to `assets/`
3. Fix duplicate declarations in `game.js`
4. Add background music file to `assets/party.mp3`

## Play locally

Run a simple HTTP server:

```bash
npx serve .
```

Open `http://localhost:1313` (or the port shown) in your browser.

## Deployment

Push to the `main` branch to deploy to GitHub Pages automatically.

The game will be live at:

```
https://<your-username>.github.io/Chaos-Country-Rave/
```

## How it Works

- **Player** – Arrow keys move a pink square
- **Digging** – Click on a block to remove it
- **Enemies** – Green squares patrol horizontally and bounce off walls
- **Music** – Click the button to toggle looping background music

## Adding Assets

Place sprite sheets or sound files in the `assets/` directory and update `game.js` to use them.

Enjoy the chaos!
