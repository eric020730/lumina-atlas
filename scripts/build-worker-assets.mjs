import { copyFile, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = resolve(projectRoot, "dist");
const assetPaths = [
  "index.html",
  "app.js",
  "styles.css",
  "taste.css",
  "assets/favicon.svg",
  "data/course-intelligence.json",
  "data/life-os.json",
  "data/video-learning.json",
];

await rm(outputRoot, { recursive: true, force: true });

for (const assetPath of assetPaths) {
  const destination = resolve(outputRoot, assetPath);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(resolve(projectRoot, assetPath), destination);
}

console.log(`Prepared ${assetPaths.length} static assets in ${outputRoot}`);
