/* ===================================
  INTERACTIVE CHRISTMAS CARD
  Canvas-based animation with characters,
  snow, lights, and festive decorations
   =================================== */

// ===================================
// CANVAS SETUP
// ===================================

// Get canvas element and 2D drawing context
const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

// Animation timer - increments each frame
let t = 0;

// Resize canvas for crisp rendering across different screen sizes
function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1; // Handle high-DPI displays
  const rect = canvas.getBoundingClientRect();
  
  // Set internal canvas size based on device pixel ratio
  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;
  
  // Set CSS size to match display size
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas); // Re-adjust on window resize

/* ===================================
  SNOW PARTICLES
   =================================== */

const flakes = []; // Array to store snowflake objects
const FLAKE_COUNT = 120; // Total number of snowflakes

// Initialize snow particles with random positions and properties
function initSnow() {
  flakes.length = 0; // Clear existing flakes
  const w = canvas.width;
  const h = canvas.height;
  
  for (let i = 0; i < FLAKE_COUNT; i++) {
    flakes.push({
      x: Math.random() * w,      // Random horizontal position
      y: Math.random() * h,      // Random vertical position
      r: 1 + Math.random() * 2,  // Random radius (1-3px)
      speed: 0.3 + Math.random() * 1.2, // Random fall speed
    });
  }
}
initSnow();

/* ===================================
  CHRISTMAS LIGHTS (HANGING)
   =================================== */

const lights = []; // Array to store light bulb objects
const LIGHT_COUNT = 30; // Number of lights on the string
const LIGHT_COLORS = ["#ff4d6d", "#ffd700", "#4cc9f0", "#80ed99"]; // Red, Gold, Blue, Green

// Initialize hanging Christmas lights with curved string
function initLights() {
  const w = canvas.width;
  const curveHeight = 35; // How much the string sags in the middle

  for (let i = 0; i < LIGHT_COUNT; i++) {
    const pct = i / (LIGHT_COUNT - 1); // Position percentage (0 to 1)
    
    // X position evenly spaced across canvas
    const x = pct * w;
    
    // Y position follows a sine curve (sagging string effect)
    const y = 40 + Math.sin(pct * Math.PI) * curveHeight;

    lights.push({
      x,
      y,
      radius: 6,
      phase: Math.random() * Math.PI * 2, // Random starting phase for twinkling
      speed: 0.05 + Math.random() * 0.05  // Random twinkle speed
    });
  }
}
initLights();

// Draw the hanging Christmas lights with twinkling effect
function drawLights() {
  const w = canvas.width;

  // Draw the string connecting the lights
  ctx.strokeStyle = "#3a3a3a"; // Dark gray string
  ctx.lineWidth = 3;
  ctx.beginPath();
  
  for (let i = 0; i < lights.length; i++) {
    const b = lights[i];
    if (i === 0) ctx.moveTo(b.x, b.y);
    else ctx.lineTo(b.x, b.y);
  }
  ctx.stroke();

  // Draw each light bulb with glow effect
  for (const bulb of lights) {
    // Gentle swaying motion
    const sway = Math.sin(t * 0.02 + bulb.phase) * 3;
    const bulbX = bulb.x + sway;
    const bulbY = bulb.y + 10; // Hanging below the string

    // Twinkling effect (0 to 1)
    const glow = (Math.sin(t * bulb.speed + bulb.phase) + 1) / 2;
    
    // Cycle through colors
    const color = LIGHT_COLORS[Math.floor(glow * LIGHT_COLORS.length) % LIGHT_COLORS.length];

    // Draw bulb
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(bulbX, bulbY, bulb.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw glow halo around bulb
    ctx.beginPath();
    ctx.strokeStyle = color + "55"; // Add transparency
    ctx.lineWidth = 10;
    ctx.arc(bulbX, bulbY, bulb.radius + 4, 0, Math.PI * 2);
    ctx.stroke();

    // Draw connector piece between string and bulb
    ctx.fillStyle = "#3a3a3a";
    ctx.fillRect(bulbX - 3, bulbY - 10, 6, 6);
  }
}

/* ===================================
  BACKGROUND + SNOW
   =================================== */

// Draw the night sky and snowy ground
function drawBackground() {
  const w = canvas.width;
  const h = canvas.height;
  const snowLine = h * 0.75; // Snow starts at 75% down the canvas

  // Night sky gradient (dark blue to darker blue)
  const grad = ctx.createLinearGradient(0, 0, 0, snowLine);
  grad.addColorStop(0, "#000814");   // Very dark blue at top
  grad.addColorStop(0.4, "#001d3d"); // Medium dark blue
  grad.addColorStop(1, "#003566");   // Lighter blue at horizon
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, snowLine);

  // White snowy ground
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, snowLine, w, h - snowLine);

  // Twinkling stars in the sky
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 80; i++) {
    const x = (i * 77 + t * 0.4) % w; // Slowly moving stars
    const y = 20 + ((i * 43) % (snowLine - 40));
    ctx.fillRect(x, y, 1.3, 1.3);
  }
}

// Draw and animate falling snow
function drawSnow() {
  const w = canvas.width;
  const h = canvas.height;
  ctx.fillStyle = "white";

  for (const f of flakes) {
    // Draw snowflake
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fill();

    // Move snowflake down
    f.y += f.speed;
    
    // Reset to top when it falls off bottom
    if (f.y > h) {
      f.y = -5;
      f.x = Math.random() * w;
    }
  }
}

/* ===================================
  CHARACTERS & DECORATIONS
   =================================== */

/**
 * Draw Santa's house with decorations
 * @param {number} x - X position
 * @param {number} y - Y position  
 * @param {number} scale - Size multiplier
 */
function drawSantaHouse(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // House body (brown wood)
  ctx.fillStyle = "#8b4513";
  ctx.fillRect(-50, -60, 100, 80);

  // Red roof
  ctx.fillStyle = "#c1121f";
  ctx.beginPath();
  ctx.moveTo(-60, -60);
  ctx.lineTo(0, -100);
  ctx.lineTo(60, -60);
  ctx.closePath();
  ctx.fill();

  // Snow on roof edge
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(-60, -60);
  ctx.lineTo(-55, -65);
  ctx.lineTo(55, -65);
  ctx.lineTo(60, -60);
  ctx.closePath();
  ctx.fill();

  // Brown door
  ctx.fillStyle = "#654321";
  ctx.fillRect(-15, -20, 30, 40);

  // Gold door knob
  ctx.fillStyle = "#ffd700";
  ctx.beginPath();
  ctx.arc(8, 0, 3, 0, Math.PI * 2);
  ctx.fill();

  // Glowing yellow windows
  ctx.fillStyle = "#ffe066";
  ctx.fillRect(-40, -45, 20, 20);
  ctx.fillRect(20, -45, 20, 20);

  // Window frames (cross pattern)
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
  ctx.fillRect(25, -100, 20, 5); // Snow on chimney

  // Animated smoke puffs
  const smokeOffset = Math.sin(t * 0.05) * 3; // Gentle sway
  
  // Bottom smoke puff
  ctx.fillStyle = "rgba(200, 200, 200, 0.6)";
  ctx.beginPath();
  ctx.arc(35 + smokeOffset, -110, 8, 0, Math.PI * 2);
  ctx.fill();
  
  // Middle smoke puff
  ctx.fillStyle = "rgba(180, 180, 180, 0.5)";
  ctx.beginPath();
  ctx.arc(38 + smokeOffset * 1.5, -125, 10, 0, Math.PI * 2);
  ctx.fill();
  
  // Top smoke puff (most faded)
  ctx.fillStyle = "rgba(160, 160, 160, 0.4)";
  ctx.beginPath();
  ctx.arc(33 + smokeOffset * 2, -140, 12, 0, Math.PI * 2);
  ctx.fill();

  // Christmas wreath on door
  ctx.strokeStyle = "#0f5132"; // Dark green
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, -40, 8, 0, Math.PI * 2);
  ctx.stroke();
  
  // Red bow on wreath
  ctx.fillStyle = "#ff4d6d";
  ctx.beginPath();
  ctx.arc(0, -48, 3, 0, Math.PI * 2);
  ctx.fill();

  // Twinkling string lights along roof border
  const roofLights = [
    { x: -48, y: -60 }, { x: -35, y: -60 }, { x: -22, y: -60 }, { x: -9, y: -60 },
    { x: 4, y: -60 }, { x: 17, y: -60 }, { x: 30, y: -60 }, { x: 43, y: -60 },
  ];

  roofLights.forEach((light, i) => {
    const twinkle = Math.sin(t * 0.08 + i) * 0.4 + 0.6; // Pulsing effect
    const colors = ["#ff4d6d", "#ffd700", "#4cc9f0"]; // Red, Gold, Blue
    ctx.fillStyle = colors[i % 3];
    ctx.globalAlpha = twinkle;
    ctx.beginPath();
    ctx.arc(light.x, light.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1; // Reset transparency

  ctx.restore();
}

/**
 * Draw Santa character with animated waving arm
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} scale - Size multiplier
 */
function drawSanta(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Red body
  ctx.fillStyle = "#c1121f";
  ctx.beginPath();
  ctx.arc(0, 0, 40, 0, Math.PI * 2);
  ctx.fill();

  // Skin-tone face
  ctx.fillStyle = "#ffddb3";
  ctx.beginPath();
  ctx.arc(0, -40, 22, 0, Math.PI * 2);
  ctx.fill();

  // Red hat
  ctx.fillStyle = "#c1121f";
  ctx.beginPath();
  ctx.moveTo(-22, -52);
  ctx.lineTo(22, -52);
  ctx.lineTo(0, -82);
  ctx.closePath();
  ctx.fill();

  // White hat trim
  ctx.fillStyle = "white";
  ctx.fillRect(-22, -52, 44, 8);
  
  // White pom-pom on hat
  ctx.beginPath();
  ctx.arc(0, -82, 5, 0, Math.PI * 2);
  ctx.fill();

  // White beard
  ctx.beginPath();
  ctx.arc(0, -32, 18, 0, Math.PI * 2);
  ctx.fill();

  // Black eyes
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(-7, -42, 2, 0, Math.PI * 2);
  ctx.arc(7, -42, 2, 0, Math.PI * 2);
  ctx.fill();

  // Black belt
  ctx.fillStyle = "black";
  ctx.fillRect(-40, -5, 80, 10);
  
  // Gold belt buckle
  ctx.fillStyle = "#ffd700";
  ctx.fillRect(-10, -5, 20, 10);

  // Animated waving arm (right side)
  const armAngle = Math.sin(t * 0.12) * 0.6 - 0.2; // Wave motion
  ctx.save();
  ctx.translate(30, -10);
  ctx.rotate(armAngle);
  
  // Red arm
  ctx.strokeStyle = "#c1121f";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(30, 0);
  ctx.stroke();
  
  // Skin-tone hand
  ctx.fillStyle = "#ffddb3";
  ctx.beginPath();
  ctx.arc(30, 0, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Static left arm
  ctx.strokeStyle = "#c1121f";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(-30, -10);
  ctx.lineTo(-50, -2);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draw Snowman character with animated waving arm
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} scale - Size multiplier
 */
function drawSnowman(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Three white snowballs (bottom, middle, top)
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(0, 20, 28, 0, Math.PI * 2);   // Bottom
  ctx.arc(0, -18, 22, 0, Math.PI * 2);  // Middle
  ctx.arc(0, -48, 16, 0, Math.PI * 2);  // Head
  ctx.fill();

  // Black eyes
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(-5, -52, 2, 0, Math.PI * 2);
  ctx.arc(5, -52, 2, 0, Math.PI * 2);
  ctx.fill();

  // Orange carrot nose
  ctx.fillStyle = "#ff7f11";
  ctx.beginPath();
  ctx.moveTo(0, -48);
  ctx.lineTo(16, -46);
  ctx.lineTo(0, -44);
  ctx.closePath();
  ctx.fill();

  // Smile
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.arc(0, -46, 6, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();

  // Three black buttons
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(0, -18, 2.5, 0, Math.PI * 2);
  ctx.arc(0, -10, 2.5, 0, Math.PI * 2);
  ctx.arc(0, -2, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Blue scarf
  ctx.fillStyle = "#1b9aaa";
  ctx.fillRect(-18, -36, 36, 6);  // Horizontal part
  ctx.fillRect(-4, -30, 8, 16);   // Hanging part

  // Brown stick arms
  ctx.strokeStyle = "#5b3a29";
  ctx.lineWidth = 3;

  // Static left arm
  ctx.beginPath();
  ctx.moveTo(-16, -22);
  ctx.lineTo(-36, -30);
  ctx.stroke();

  // Animated waving right arm
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

/**
 * Draw Reindeer character with animated antlers
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} scale - Size multiplier
 */
function drawReindeer(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Brown body
  ctx.fillStyle = "#8b5e3c";
  ctx.fillRect(-40, -10, 80, 30);

  // Four brown legs
  ctx.fillRect(-30, 20, 8, 26);
  ctx.fillRect(-10, 20, 8, 26);
  ctx.fillRect(10, 20, 8, 26);
  ctx.fillRect(30, 20, 8, 26);

  // Tail
  ctx.beginPath();
  ctx.moveTo(-40, -6);
  ctx.lineTo(-52, -14);
  ctx.lineTo(-46, -6);
  ctx.closePath();
  ctx.fill();

  // Neck
  ctx.fillRect(10, -32, 16, 26);

  // Head (oval shape)
  ctx.beginPath();
  ctx.ellipse(28, -40, 20, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Red nose (Rudolph!)
  ctx.fillStyle = "#d90429";
  ctx.beginPath();
  ctx.arc(38, -38, 5, 0, Math.PI * 2);
  ctx.fill();

  // Black eye
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(24, -44, 2, 0, Math.PI * 2);
  ctx.fill();

  // Animated antlers
  ctx.strokeStyle = "#5b3a29";
  ctx.lineWidth = 3;
  const antlerWiggle = Math.sin(t * 0.1) * 0.15; // Gentle wiggle

  // Left antler
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

  // Right antler
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

  // Red collar
  ctx.fillStyle = "#e63946";
  ctx.fillRect(10, -28, 16, 4);

  ctx.restore();
}

/**
 * Draw Christmas tree with ornaments and star
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} scale - Size multiplier
 */
function drawChristmasTree(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Brown tree trunk
  ctx.fillStyle = "#654321";
  ctx.fillRect(-10, 10, 20, 30);

  // Three green triangle layers (bottom to top)
  ctx.fillStyle = "#0f5132";
  
  // Bottom layer
  ctx.beginPath();
  ctx.moveTo(-60, 10);
  ctx.lineTo(0, -50);
  ctx.lineTo(60, 10);
  ctx.closePath();
  ctx.fill();

  // Middle layer
  ctx.beginPath();
  ctx.moveTo(-50, -20);
  ctx.lineTo(0, -80);
  ctx.lineTo(50, -20);
  ctx.closePath();
  ctx.fill();

  // Top layer
  ctx.beginPath();
  ctx.moveTo(-40, -50);
  ctx.lineTo(0, -110);
  ctx.lineTo(40, -50);
  ctx.closePath();
  ctx.fill();

  // Gold star on top
  ctx.fillStyle = "#ffd700";
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const radius = i % 2 === 0 ? 12 : 6; // Alternating points
    const px = Math.cos(angle) * radius;
    const py = Math.sin(angle) * radius - 120;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();

  // Twinkling ornaments
  const ornaments = [
    { x: -30, y: -10, color: "#ff4d6d" },  // Red
    { x: 20, y: -5, color: "#4cc9f0" },    // Blue
    { x: -15, y: -35, color: "#ffd700" },  // Gold
    { x: 25, y: -40, color: "#ff4d6d" },   // Red
    { x: 0, y: -60, color: "#4cc9f0" },    // Blue
    { x: -20, y: -65, color: "#ffd700" },  // Gold
    { x: 15, y: -70, color: "#ff4d6d" },   // Red
  ];

  ornaments.forEach(ornament => {
    const twinkle = Math.sin(t * 0.1 + ornament.x) * 0.3 + 0.7; // Pulsing effect
    ctx.fillStyle = ornament.color;
    ctx.globalAlpha = twinkle;
    ctx.beginPath();
    ctx.arc(ornament.x, ornament.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1; // Reset transparency

  ctx.restore();
}

/**
 * Draw all characters and decorations in the scene
 */
function drawCharacter() {
  const w = canvas.width;
  const h = canvas.height;
  const baseY = h * 0.75 - 20; // Position on snow line

  // Santa's house on the left
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

/* ===================================
  MAIN ANIMATION LOOP
   =================================== */

/**
 * Main animation loop - runs 60 times per second
 * Draws all elements in the correct order
 */
function loop() {
  t++; // Increment animation timer

  // Reset transformation matrix
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  
  // Clear canvas for next frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw everything in order (back to front)
  drawBackground();  // Sky and ground
  drawLights();      // Hanging Christmas lights
  drawSnow();        // Falling snowflakes
  drawCharacter();   // All characters and decorations

  // Request next animation frame
  requestAnimationFrame(loop);
}

// Start the animation loop
loop();

/* ===================================
  MUSIC CONTROLS
   =================================== */

// Get audio element and button
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

// Track music playing state
let isPlaying = false;

// Toggle music play/pause on button click
musicBtn.addEventListener("click", () => {
  if (!isPlaying) {
    // Try to play music (may fail due to browser autoplay policies)
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
