const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

let square = { x: 50, y: 50, size: 50, vx: 2, vy: 2 };

function update() {
  square.x += square.vx;
  square.y += square.vy;

  if (square.x <= 0 || square.x + square.size >= canvas.width) square.vx *= -1;
  if (square.y <= 0 || square.y + square.size >= canvas.height) square.vy *= -1;
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#ff4081';
  ctx.fillRect(square.x, square.y, square.size, square.size);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
