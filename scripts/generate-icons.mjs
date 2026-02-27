/**
 * Generates PWA icons (192×192, 512×512, maskable 512×512)
 * using only Node built-ins — no extra dependencies needed.
 *
 * Run: node scripts/generate-icons.mjs
 */
import { createCanvas } from "canvas";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, "..", "public", "icons");
mkdirSync(iconsDir, { recursive: true });

function drawIcon(size, maskable = false) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  const padding = maskable ? size * 0.1 : 0;
  const effective = size - padding * 2;

  // Background gradient — zinc-900 to slate-800
  const bg = ctx.createLinearGradient(0, 0, size, size);
  bg.addColorStop(0, "#18181b"); // zinc-900
  bg.addColorStop(1, "#1e293b"); // slate-800
  ctx.fillStyle = bg;

  if (maskable) {
    // Maskable: full square bg
    ctx.fillRect(0, 0, size, size);
  } else {
    // Regular: rounded rect
    const r = size * 0.18;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(size - r, 0);
    ctx.quadraticCurveTo(size, 0, size, r);
    ctx.lineTo(size, size - r);
    ctx.quadraticCurveTo(size, size, size - r, size);
    ctx.lineTo(r, size);
    ctx.quadraticCurveTo(0, size, 0, size - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fill();
  }

  // Centre icon — a simple 3D cube silhouette
  const cx = size / 2;
  const cy = size / 2;
  const unit = effective * 0.18;

  // Gradient for the cube faces
  const accentGrad = ctx.createLinearGradient(
    cx - unit * 2,
    cy - unit * 2,
    cx + unit * 2,
    cy + unit * 2
  );
  accentGrad.addColorStop(0, "#a78bfa"); // violet-400
  accentGrad.addColorStop(1, "#818cf8"); // indigo-400

  ctx.fillStyle = accentGrad;

  // Top face of cube
  ctx.beginPath();
  ctx.moveTo(cx, cy - unit * 1.5);
  ctx.lineTo(cx + unit * 1.7, cy - unit * 0.5);
  ctx.lineTo(cx, cy + unit * 0.5);
  ctx.lineTo(cx - unit * 1.7, cy - unit * 0.5);
  ctx.closePath();
  ctx.fill();

  // Left face
  ctx.fillStyle = "#6d28d9"; // violet-700
  ctx.beginPath();
  ctx.moveTo(cx - unit * 1.7, cy - unit * 0.5);
  ctx.lineTo(cx, cy + unit * 0.5);
  ctx.lineTo(cx, cy + unit * 2);
  ctx.lineTo(cx - unit * 1.7, cy + unit * 1);
  ctx.closePath();
  ctx.fill();

  // Right face
  ctx.fillStyle = "#7c3aed"; // violet-600
  ctx.beginPath();
  ctx.moveTo(cx + unit * 1.7, cy - unit * 0.5);
  ctx.lineTo(cx, cy + unit * 0.5);
  ctx.lineTo(cx, cy + unit * 2);
  ctx.lineTo(cx + unit * 1.7, cy + unit * 1);
  ctx.closePath();
  ctx.fill();

  // Edge highlights
  ctx.strokeStyle = "rgba(167,139,250,0.5)";
  ctx.lineWidth = Math.max(1, size * 0.006);
  ctx.beginPath();
  ctx.moveTo(cx, cy - unit * 1.5);
  ctx.lineTo(cx + unit * 1.7, cy - unit * 0.5);
  ctx.lineTo(cx, cy + unit * 0.5);
  ctx.lineTo(cx - unit * 1.7, cy - unit * 0.5);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, cy + unit * 0.5);
  ctx.lineTo(cx, cy + unit * 2);
  ctx.stroke();

  return canvas.toBuffer("image/png");
}

const sizes = [
  { name: "icon-192.png", size: 192, maskable: false },
  { name: "icon-512.png", size: 512, maskable: false },
  { name: "icon-maskable-512.png", size: 512, maskable: true },
];

for (const { name, size, maskable } of sizes) {
  const buf = drawIcon(size, maskable);
  const out = join(iconsDir, name);
  writeFileSync(out, buf);
  console.log(`✓ Generated ${name} (${buf.length} bytes)`);
}
console.log("Done!");
