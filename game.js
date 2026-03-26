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

// Load level data
let levels = [];
let currentLevel = 0;
let levelData = {};
fetch('stages.json')
  .then(r => r.json())
  .then(data => {
    levels = data;
    currentLevelData = data[0]; // default to first level
  })
  .catch(err => console.error('Failed to load stages.json', err));

// Player effect timers
let boostedBlastRadius = 1;
let boostedFrames = 0;
const BOOST_FRAMES_MAX = 180; // 3 seconds at 60fps
let playerScore = 0;

function playerMicBlast() {
  // Blast radius
  const blastRadius = TILE * boostedBlastRadius;
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
for (let i = 0; i < (currentLevelData.enemyCount || 4); i++) {
  const typeIdx = Math.floor(Math.random() * 3);
  const eType = ['bubble','gloom','normal'][typeIdx];
  enemies.push({
    x: TILE * (Math.floor(Math.random()*GRID_W)+1),
    y: TILE * (Math.floor(Math.random()*GRID_H)+1),
    size: TILE - 8,
    color: eType === 'bubble' ? '#00e676' : '#ff4081',
    vx: Math.random() < 0.5 ? 1.5 : -1.5,
    vy: 0,
    type: eType,
    inflated: false
  });
}

// Magma pit hazard positions (tile based)
const baseHazardPositions = [
  {x: TILE * 3, y: TILE * 2},
  {x: TILE * 7, y: TILE * 5},
  {x: TILE * 5, y: TILE * 8},
  {x: TILE * 1, y: TILE * 4}
];
const magmaPits = [];
// Generate hazards based on density
const maxHazards = Math.min(4, Math.ceil(currentLevelData.hazardDensity * 4));
for (let i = 0; i < maxHazards; i++) {
  const idx = i % baseHazardPositions.length;
  const pos = baseHazardPositions[idx];
  magmaPits.push({
    x: pos.x * TILE,
    y: pos.y * TILE,
    w: TILE,
    h: TILE
  });
}

// Power-up definitions (initially static positions)
const powerUps = [
  {x: TILE * 5, y: TILE * 3, type: 'glowmic', collected: false, size: TILE - 4},
  {x: TILE * 8, y: TILE * 6, type: 'encoreshot', collected: false, size: TILE - 4},
  {x: TILE * 2, y: TILE * 4, type: 'stageshield', collected: false, size: TILE - 4},
  {x: TILE * 10, y: TILE * 2, type: 'proppack', collected: false, size: TILE - 4},
  {x: TILE * 6, y: TILE * 8, type: 'beatbooster', collected: false, size: TILE - 4}
];

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
  // Check if click hit an enemy
  const hitEnemy = enemies.find(en =>
    mx >= en.x && mx <= en.x + en.size &&
    my >= en.y && my <= en.y + en.size
  );
  if (hitEnemy) {
    if (hitEnemy.type === 'bubble') {
      if (hitEnemy.inflated) {
        // Burst the inflated bubble
        enemies.splice(enemies.indexOf(hitEnemy), 1);
      } else {
        hitEnemy.inflated = true;
        hitEnemy.color = '#ff00ff';
      }
    } else if (hitEnemy.type === 'gloom') {
      // Simple knockback for gloom
      hitEnemy.y -= 10;
    }
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

  // Decrease blast cooldown
  if (blastCooldown > 0) {
    blastCooldown--;
  }

  // Check magma pit collisions
  magmaPits.forEach(pit => {
    if (player.x < pit.x + pit.w && player.x + player.size > pit.x &&
        player.y < pit.y + pit.h && player.y + player.size > pit.y) {
      // Reset player position on hazard touch (simple handling)
      player.x = TILE * 2;
      player.y = TILE * 2;
    }
  });

  // Check power-up collection
  powerUps.forEach(pu => {
    if (!pu.collected) {
      if (player.x < pu.x + pu.size && player.x + player.size > pu.x &&
          player.y < pu.y + pu.size && player.y + player.size > pu.y) {
        pu.collected = true;
        playerScore += 100; // simple score increase
        switch (pu.type) {
          case 'glowmic':
            boostedFrames = BOOST_FRAMES_MAX;
            boostedBlastRadius = 1.5;
            break;
          case 'encoreshot':
            // Could set rapid shot flag
            break;
          case 'stageshield':
            // Placeholder for shield duration
            break;
          case 'proppack':
            // Placeholder for prop pack
            break;
          case 'beatbooster':
            // Could speed up music or animation
            break;
        }
      }
    }
  });

  let blastCooldown = 0;
const BLLAST_COOLDOWN_MAX = 60; // frames between blasts

// Load level data
let levels = [];
let currentLevel = 0;
let levelData = {};
fetch('stages.json')
  .then(r => r.json())
  .then(data => {
    levels = data;
    currentLevelData = data[0]; // default to first level
  })
  .catch(err => console.error('Failed to load stages.json', err));

// Player effect timers
let boostedBlastRadius = 1;
let boostedFrames = 0;
const BOOST_FRAMES_MAX = 180; // 3 seconds at 60fps
let playerScore = 0;

function playerMicBlast() {
  // Blast radius
  const blastRadius = TILE * boostedBlastRadius;
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

  // Decrease boosted frames timer
  if (boostedFrames > 0) {
    boostedFrames--;
    if (boostedFrames === 0) {
      boostedBlastRadius = 1;
    }
  }
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

  // Draw power-ups
  powerUps.forEach(pu => {
    if (!pu.collected) {
      ctx.fillStyle = '#ff0';
      ctx.beginPath();
      ctx.arc(pu.x + pu.size/2, pu.y + pu.size/2, pu.size/2, 0, Math.PI*2);
      ctx.fill();
    }
  });

  // Draw score
  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${playerScore}`, 20, 40);

  // Draw magma pit hazards
  ctx.fillStyle = '#550000';
  magmaPits.forEach(pit => {
    ctx.fillRect(pit.x, pit.y, pit.w, pit.h);
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
