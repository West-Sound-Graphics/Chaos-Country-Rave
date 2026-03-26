# Chaos Country Rave

A chaotic, energetic 2-D web game inspired by *Dig Dug* and a Miley Cyrus vibe. The player digs through a grid of blocks while avoiding enemies. Music can be toggled on or off.

## Current Status

**Playable!** - The game is now functional. You can dig, move, blast enemies, and collect power-ups. Level progression works automatically every 500 points.

## Files

- **`index.html`** – Entry point with canvas element and music toggle button
- **`game.js`** – Main game logic: grid generation, player movement, enemy AI, collision detection, rendering, and audio
- **`assets/`** – Media directory for background music (`party.mp3`) and sprites
- **`stages.json`** – Level data (3 levels configured)

## What's Been Fixed

- **Removed duplicate code** in `game.js` (lines 245-322 of original)
- **Fixed `stages.json` loading** - Now properly handles level data with id-based lookup
- **Fixed enemy initialization** - Uses default enemy count when level data not yet loaded
- **Fixed music autoplay** - Music now plays on first user interaction
- **Added player fallback** - Draws colored rectangle if sprite hasn't loaded

## What's Been Implemented

- **Grid world** – 20×15 tile grid with randomly generated blocks and solid borders
- **Player** – Pink square controlled with arrow keys (← → ↑ ↓)
- **Digging** – Click to remove blocks
- **Enemies** – Green squares that patrol horizontally and bounce off walls
- **Power-ups** – Collectible items that grant temporary buffs (boosted blast radius)
- **Magma pits** – Hazards that reset player position
- **Score system** – Points for collecting power-ups (+100 each) and persistent high score via localStorage
- **Level progression** – Auto-advance every 500 points (up to 3 levels)
- **Music toggle** – Play/pause background music (`assets/party.mp3`) - clicks canvas/button to start

## Play

Run a simple HTTP server:

```bash
npx serve .
```

Then open the URL in your browser. **Click anywhere on the game canvas** to start the music.

## How it Works

- **Player** – Arrow keys move a pink square
- **Digging** – Click on a block to remove it
- **Enemies** – Green squares patrol horizontally and bounce off walls
- **Music** – Click the button or anywhere on the canvas to toggle/pause background music

## Adding Assets

Place sprite sheets or sound files in the `assets/` directory.

- `assets/party.mp3` – Background music (currently using a placeholder)
- `assets/sprites/` – Player sprite images (currently using colored rectangles as fallback)

## Known Limitations

- No player sprite image yet (using colored rectangle fallback)
- Background music uses a placeholder file - replace with actual MP3

Enjoy the chaos!
