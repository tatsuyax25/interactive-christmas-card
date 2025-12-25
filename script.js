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
function drawSantaHouse(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // House body
  ctx.fillStyle = "#8b4513";
  ctx.fillRect(-50, -60, 100, 80);

  // Roof
  ctx.fillStyle = "#c1121f";
  ctx.beginPath();
  ctx.moveTo(-60, -60);
  ctx.lineTo(0, -100);
  ctx.lineTo(60, -60);
  ctx.closePath();
  ctx.fill();

  // Snow on roof
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(-60, -60);
  ctx.lineTo(-55, -65);
  ctx.lineTo(55, -65);
  ctx.lineTo(60, -60);
  ctx.closePath();
  ctx.fill();

  // Door
  ctx.fillStyle = "#654321";
  ctx.fillRect(-15, -20, 30, 40);

  // Door knob
  ctx.fillStyle = "#ffd700";
  ctx.beginPath();
  ctx.arc(8, 0, 3, 0, Math.PI * 2);
  ctx.fill();

  // Windows
  ctx.fillStyle = "#ffe066";
  ctx.fillRect(-40, -45, 20, 20);
  ctx.fillRect(20, -45, 20, 20);

  // Window frames
  ctx.strokeStyle = "#654321";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-30, -55);
  ctx.lineTo(-30, -25);
  ctx.moveTo(-50, -35);
  ctx.lineTo(-20, -35);
  ctx.moveTo(30, -55);
  ctx.lineTo(30, -25);
  ctx.moveTo(10, -35);
  ctx.lineTo(50, -35);
  ctx.stroke();

  // Chimney
  ctx.fillStyle = "#8b4513";
  ctx.fillRect(25, -95, 20, 40);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(25, -100, 20, 5);

  // Smoke from chimney
  const smokeOffset = Math.sin(t * 0.05) * 3;
  ctx.fillStyle = "rgba(200, 200, 200, 0.6)";
  ctx.beginPath();
  ctx.arc(35 + smokeOffset, -110, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(180, 180, 180, 0.5)";
  ctx.beginPath();
  ctx.arc(38 + smokeOffset * 1.5, -125, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(160, 160, 160, 0.4)";
  ctx.beginPath();
  ctx.arc(33 + smokeOffset * 2, -140, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

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

function drawChristmasTree(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Tree trunk
  ctx.fillStyle = "#654321";
  ctx.fillRect(-10, 10, 20, 30);

  // Tree layers (3 triangles)
  ctx.fillStyle = "#0f5132";
  ctx.beginPath();
  ctx.moveTo(-60, 10);
  ctx.lineTo(0, -50);
  ctx.lineTo(60, 10);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-50, -20);
  ctx.lineTo(0, -80);
  ctx.lineTo(50, -20);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-40, -50);
  ctx.lineTo(0, -110);
  ctx.lineTo(40, -50);
  ctx.closePath();
  ctx.fill();

  // Star on top
  ctx.fillStyle = "#ffd700";
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const radius = i % 2 === 0 ? 12 : 6;
    const px = Math.cos(angle) * radius;
    const py = Math.sin(angle) * radius - 120;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();

  // Ornaments
  const ornaments = [
    { x: -30, y: -10, color: "#ff4d6d" },
    { x: 20, y: -5, color: "#4cc9f0" },
    { x: -15, y: -35, color: "#ffd700" },
    { x: 25, y: -40, color: "#ff4d6d" },
    { x: 0, y: -60, color: "#4cc9f0" },
    { x: -20, y: -65, color: "#ffd700" },
    { x: 15, y: -70, color: "#ff4d6d" },
  ];

  ornaments.forEach(ornament => {
    const twinkle = Math.sin(t * 0.1 + ornament.x) * 0.3 + 0.7;
    ctx.fillStyle = ornament.color;
    ctx.globalAlpha = twinkle;
    ctx.beginPath();
    ctx.arc(ornament.x, ornament.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  ctx.restore();
}

function drawCharacter() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const baseY = h * 0.75 - 20;

  // Santa's house on the left, sitting on snow
  drawSantaHouse(w * 0.15, baseY + 20, 2.2);

  // Reindeer on the left
  drawReindeer(w * 0.35, baseY, 1.4);
  
  // Santa in the middle
  drawSanta(w * 0.5, baseY, 1.5);
  
  // Snowman on the right
  drawSnowman(w * 0.65, baseY, 1.4);

  // Christmas tree on the right side
  drawChristmasTree(w * 0.85, baseY + 40, 1.8);
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