// Simple Dig‑Dug style game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const TILE = 32;
const GRID_W = 20;
const GRID_H = 15;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Grid data: 1 = solid block, 0 = empty
let grid = [];
for (let y = 0; y < GRID_H; y++) {
  let row = [];
  for (let x = 0; x < GRID_W; x++) {
    // create a border of blocks and some random interior blocks
    if (y === 0 || y === GRID_H-1 || x === 0 || x === GRID_W-1) {
      row.push(1);
    } else {
      row.push(Math.random() < 0.2 ? 1 : 0);
    }
  }
  grid.push(row);
}

// Player
const player = {
  x: TILE * 2,
  y: TILE * 2,
  size: TILE - 4,
  color: '#ff4081',
  vx: 0,
  vy: 0,
  speed: 3
};

let blastCooldown = 0;
const BLLAST_COOLDOWN_MAX = 60; // frames between blasts

function playerMicBlast() {
  // Blast radius
  const blastRadius = TILE * 1.5; // 1.5 tiles
  // Remove enemies within radius
  for (let i = enemies.length - 1; i >= 0; i--) {
    const ex = enemies[i].x + enemies[i].size / 2;
    const ey = enemies[i].y + enemies[i].size / 2;
    const dx = ex - player.x;
    const dy = ey - player.y;
    if (Math.hypot(dx, dy) < blastRadius) {
      enemies.splice(i, 1);
      // Create simple blast effect
      blastEffectActive = true;
      blastEffectTimer = 30;
    }
  }
}
\n// Enemies
const enemies = [];
for (let i = 0; i < 4; i++) {
  enemies.push({
    x: TILE * (Math.floor(Math.random()*GRID_W)+1),
    y: TILE * (Math.floor(Math.random()*GRID_H)+1),
    size: TILE - 8,
    color: '#00e676',
    vx: Math.random() < 0.5 ? 1.5 : -1.5,
    vy: 0
  });
}

// Input
const keys = {};
window.addEventListener('keydown', e => {keys[e.key] = true;});
window.addEventListener('keyup', e => {keys[e.key] = false;});

// Digging
canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const gx = Math.floor(mx / TILE);
  const gy = Math.floor(my / TILE);
  if (grid[gy] && grid[gy][gx] === 1) {
    grid[gy][gx] = 0; // dig
  }
});

function collision(obj, dx, dy) {
  const nx = obj.x + dx;
  const ny = obj.y + dy;
  const gx = Math.floor(nx / TILE);
  const gy = Math.floor(ny / TILE);
  if (grid[gy] && grid[gy][gx] === 1) return true;
  return false;
}

function update() {
  // Player movement
  if (keys['ArrowLeft']) player.vx = -player.speed;
  else if (keys['ArrowRight']) player.vx = player.speed;
  else player.vx = 0;

  if (keys['ArrowUp']) player.vy = -player.speed;
  else if (keys['ArrowDown']) player.vy = player.speed;
  else player.vy = 0;

  if (!collision(player, player.vx, 0)) player.x += player.vx;
  if (!collision(player, 0, player.vy)) player.y += player.vy;

  let blastCooldown = 0;
const BLLAST_COOLDOWN_MAX = 60; // frames between blasts

function playerMicBlast() {
  // Blast radius
  const blastRadius = TILE * 1.5; // 1.5 tiles
  // Remove enemies within radius
  for (let i = enemies.length - 1; i >= 0; i--) {
    const ex = enemies[i].x + enemies[i].size / 2;
    const ey = enemies[i].y + enemies[i].size / 2;
    const dx = ex - player.x;
    const dy = ey - player.y;
    if (Math.hypot(dx, dy) < blastRadius) {
      enemies.splice(i, 1);
      // Create simple blast effect
      blastEffectActive = true;
      blastEffectTimer = 30;
    }
  }
}
\n  // Mic blast (Space)
  if (keys[' '] && blastCooldown === 0) {
    playerMicBlast();
    blastCooldown = BLLAST_COOLDOWN_MAX;
  }
  // Enemies move horizontally, bounce off walls
  enemies.forEach(e => {
    if (!collision(e, e.vx, 0)) e.x += e.vx;
    else e.vx *= -1;
  });
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // Draw grid
  ctx.fillStyle = '#444';
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 1) {
        ctx.fillRect(x*TILE, y*TILE, TILE, TILE);
      }
    });
  });

  // Draw player sprite
  if (playerSprite.complete) {
    ctx.drawImage(playerSprite, player.x, player.y, player.size, player.size);
  };

  // Draw enemies
  enemies.forEach(e => {
    ctx.fillStyle = e.color;
    ctx.fillRect(e.x, e.y, e.size, e.size);
  });
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();

// Music toggle
const musicToggle = document.getElementById('musicToggle');
const audio = new Audio('assets/party.mp3');
audio.loop = true;
audio.muted = true;

const playerSprite = new Image();
playerSprite.src = 'assets/sprites/player_placeholder.png';

let blastEffectActive = false;
let blastEffectTimer = 0;

musicToggle.addEventListener('click', () => {
  audio.muted = !audio.muted;
  musicToggle.textContent = audio.muted ? 'Music Off' : 'Music On';
});
