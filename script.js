const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

let t = 0;

// Resize canvas for crisp rendering
function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  canvas.width = displayWidth * ratio;
  canvas.height = displayHeight * ratio;
  ctx.scale(ratio, ratio);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* -----------------------------
  SNOW PARTICLES
----------------------------- */
const flakes = [];
const FLAKE_COUNT = 120;

function initSnow() {
  flakes.length = 0;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  for (let i = 0; i < FLAKE_COUNT; i++) {
    flakes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1 + Math.random() * 2,
      speed: 0.3 + Math.random() * 1.2,
    });
  }
}
initSnow();

/* -----------------------------
  CHRISTMAS LIGHTS (HANGING)
----------------------------- */
const lights = [];
const LIGHT_COUNT = 30;
const LIGHT_COLORS = ["#ff4d6d", "#ffd700", "#4cc9f0", "#80ed99"];

function initLights() {
  const w = canvas.clientWidth;
  const curveHeight = 35; // how much the string sags

  for (let i = 0; i < LIGHT_COUNT; i++) {
    const pct = i / (LIGHT_COUNT - 1);

    // X position evenly spaced
    const x = pct * w;

    // Y position follows a gentle curve (sagging string)
    const y = 40 + Math.sin(pct * Math.PI) * curveHeight;

    lights.push({
      x,
      y,
      radius: 6,
      phase: Math.random() * Math.PI * 2,
      speed: 0.05 + Math.random() * 0.05
    });
  }
}

initLights();

function drawLights() {
  const w = canvas.clientWidth;

  // Draw the string first
  ctx.strokeStyle = "#3a3a3a";
  ctx.lineWidth = 3;
  ctx.beginPath();

  for (let i = 0; i < lights.length; i++) {
    const b = lights[i];
    if (i === 0) ctx.moveTo(b.x, b.y);
    else ctx.lineTo(b.x, b.y);
  }

  ctx.stroke();

  // Draw bulbs hanging from the string
  for (const bulb of lights) {
    const sway = Math.sin(t * 0.02 + bulb.phase) * 3;

    const bulbX = bulb.x + sway;
    const bulbY = bulb.y + 10; // hanging below the string

    const glow = (Math.sin(t * bulb.speed + bulb.phase) + 1) / 2;

    const color = LIGHT_COLORS[Math.floor(glow * LIGHT_COLORS.length) % LIGHT_COLORS.length];

    // Bulb
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(bulbX, bulbY, bulb.radius, 0, Math.PI * 2);
    ctx.fill();

    // Glow halo
    ctx.beginPath();
    ctx.strokeStyle = color + "55";
    ctx.lineWidth = 10;
    ctx.arc(bulbX, bulbY, bulb.radius + 4, 0, Math.PI * 2);
    ctx.stroke();

    // Little connector piece
    ctx.fillStyle = "#3a3a3a";
    ctx.fillRect(bulbX - 3, bulbY - 10, 6, 6);
  }
}

/* -----------------------------
  BACKGROUND + SNOW
----------------------------- */
function drawBackground() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const snowLine = h * 0.75;

  const grad = ctx.createLinearGradient(0, 0, 0, snowLine);
  grad.addColorStop(0, "#000814");
  grad.addColorStop(0.4, "#001d3d");
  grad.addColorStop(1, "#003566");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, snowLine);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, snowLine, w, h - snowLine);

  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 80; i++) {
    const x = (i * 77 + t * 0.4) % w;
    const y = 20 + ((i * 43) % (snowLine - 40));
    ctx.fillRect(x, y, 1.3, 1.3);
  }
}

function drawSnow() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  ctx.fillStyle = "white";

  for (const f of flakes) {
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fill();

    f.y += f.speed;
    if (f.y > h) {
      f.y = -5;
      f.x = Math.random() * w;
    }
  }
}

/* -----------------------------
  CHARACTERS (Santa, Snowman, Reindeer)
----------------------------- */
function drawSanta(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.fillStyle = "#c1121f";
  ctx.beginPath();
  ctx.arc(0, 0, 40, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffddb3";
  ctx.beginPath();
  ctx.arc(0, -40, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#c1121f";
  ctx.beginPath();
  ctx.moveTo(-22, -52);
  ctx.lineTo(22, -52);
  ctx.lineTo(0, -82);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "white";
  ctx.fillRect(-22, -52, 44, 8);
  ctx.beginPath();
  ctx.arc(0, -82, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, -32, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(-7, -42, 2, 0, Math.PI * 2);
  ctx.arc(7, -42, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "black";
  ctx.fillRect(-40, -5, 80, 10);
  ctx.fillStyle = "#ffd700";
  ctx.fillRect(-10, -5, 20, 10);

  const armAngle = Math.sin(t * 0.12) * 0.6 - 0.2;
  ctx.save();
  ctx.translate(30, -10);
  ctx.rotate(armAngle);
  ctx.strokeStyle = "#c1121f";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(30, 0);
  ctx.stroke();
  ctx.fillStyle = "#ffddb3";
  ctx.beginPath();
  ctx.arc(30, 0, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = "#c1121f";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(-30, -10);
  ctx.lineTo(-50, -2);
  ctx.stroke();

  ctx.restore();
}

function drawSnowman(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(0, 20, 28, 0, Math.PI * 2);
  ctx.arc(0, -18, 22, 0, Math.PI * 2);
  ctx.arc(0, -48, 16, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(-5, -52, 2, 0, Math.PI * 2);
  ctx.arc(5, -52, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ff7f11";
  ctx.beginPath();
  ctx.moveTo(0, -48);
  ctx.lineTo(16, -46);
  ctx.lineTo(0, -44);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "black";
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.arc(0, -46, 6, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(0, -18, 2.5, 0, Math.PI * 2);
  ctx.arc(0, -10, 2.5, 0, Math.PI * 2);
  ctx.arc(0, -2, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#1b9aaa";
  ctx.fillRect(-18, -36, 36, 6);
  ctx.fillRect(-4, -30, 8, 16);

  ctx.strokeStyle = "#5b3a29";
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(-16, -22);
  ctx.lineTo(-36, -30);
  ctx.stroke();

  const armAngle = -0.3 + Math.sin(t * 0.14 + 1.5) * 0.4;
  ctx.save();
  ctx.translate(16, -22);
  ctx.rotate(armAngle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(22, 0);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

function drawReindeer(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.fillStyle = "#8b5e3c";
  ctx.fillRect(-40, -10, 80, 30);

  ctx.fillRect(-30, 20, 8, 26);
  ctx.fillRect(-10, 20, 8, 26);
  ctx.fillRect(10, 20, 8, 26);
  ctx.fillRect(30, 20, 8, 26);

  ctx.beginPath();
  ctx.moveTo(-40, -6);
  ctx.lineTo(-52, -14);
  ctx.lineTo(-46, -6);
  ctx.closePath();
  ctx.fill();

  ctx.fillRect(10, -32, 16, 26);

  ctx.beginPath();
  ctx.ellipse(28, -40, 20, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#d90429";
  ctx.beginPath();
  ctx.arc(38, -38, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(24, -44, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#5b3a29";
  ctx.lineWidth = 3;
  const antlerWiggle = Math.sin(t * 0.1) * 0.15;

  ctx.save();
  ctx.translate(20, -52);
  ctx.rotate(-0.7 + antlerWiggle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-18, -18);
  ctx.moveTo(-10, -10);
  ctx.lineTo(-18, -22);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.translate(28, -54);
  ctx.rotate(-0.4 - antlerWiggle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(18, -18);
  ctx.moveTo(8, -10);
  ctx.lineTo(18, -22);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#e63946";
  ctx.fillRect(10, -28, 16, 4);

  ctx.restore();
}

function drawCharacter() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const baseY = h * 0.75 - 20;

  // Reindeer on the left
  drawReindeer(w * 0.35, baseY, 1.4);
  
  // Santa in the middle
  drawSanta(w * 0.5, baseY, 1.5);
  
  // Snowman on the right
  drawSnowman(w * 0.65, baseY, 1.4);
}

/* -----------------------------
  MAIN LOOP
----------------------------- */
function loop() {
  t++;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  ctx.clearRect(0, 0, w, h);

  drawBackground();
  drawLights();
  drawSnow();
  drawCharacter();

  requestAnimationFrame(loop);
}
loop();

/* -----------------------------
  MUSIC CONTROLS
----------------------------- */
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

let isPlaying = false;

musicBtn.addEventListener("click", () => {
  if (!isPlaying) {
    music.play().catch(err => {
      console.warn("Could not play audio:", err.message);
    });
    musicBtn.textContent = "Pause Music";
  } else {
    music.pause();
    musicBtn.textContent = "Play Music";
  }
  isPlaying = !isPlaying;
});