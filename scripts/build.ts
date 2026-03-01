import { write, file } from "bun";
import { rmSync, mkdirSync, existsSync } from "node:fs";

const DIST_DIR = "./dist";

// 1. Clean Dist
if (existsSync(DIST_DIR)) {
  rmSync(DIST_DIR, { recursive: true, force: true });
}
mkdirSync(DIST_DIR);

console.log("🧹 Dist directory cleaned.");

// 2. Run Bun Build
const buildResult = await Bun.build({
  entrypoints: ["./static/index.html"],
  outdir: DIST_DIR,
  minify: true,
});

if (!buildResult.success) {
  console.error("Build failed", buildResult.logs);
  process.exit(1);
}
console.log("📦 Frontend bundled successfully.");

// 3. Favicon Handling (Copy & Rename)
const iconSrc = file("./static/ollama-icon.webp");
if (await iconSrc.exists()) {
  await write(`${DIST_DIR}/favicon.webp`, iconSrc);
  console.log("🖼️  Favicon copied and renamed.");
} else {
  console.warn("⚠️  Warning: Source icon not found!");
}

console.log("🚀 Build complete!");
