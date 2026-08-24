import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const dataPath = resolve(process.cwd(), "data/life-os.json");
const data = JSON.parse(await readFile(dataPath, "utf8"));
const errors = [];

const requireText = (value, label) => {
  if (typeof value !== "string" || value.trim().length === 0) errors.push(`${label} 必須是非空字串`);
};

requireText(data.updatedAt, "updatedAt");
requireText(data.thesis, "thesis");

if (!Array.isArray(data.values) || data.values.length < 3) errors.push("values 至少需要三項價值權重");
if (!Array.isArray(data.paths) || data.paths.length < 4) errors.push("paths 至少需要四條互斥路徑");
if (!Array.isArray(data.experiments) || data.experiments.length === 0) errors.push("experiments 不可為空");
if (!Array.isArray(data.stopList) || data.stopList.length === 0) errors.push("stopList 不可為空");

const valueIds = new Set();
for (const [index, value] of (data.values || []).entries()) {
  requireText(value.id, `values[${index}].id`);
  requireText(value.label, `values[${index}].label`);
  if (valueIds.has(value.id)) errors.push(`價值 id 重複：${value.id}`);
  valueIds.add(value.id);
  if (!Number.isInteger(value.defaultWeight) || value.defaultWeight < 0 || value.defaultWeight > 5) {
    errors.push(`${value.id}.defaultWeight 必須是 0–5 的整數`);
  }
}

const pathIds = new Set();
for (const [index, path] of (data.paths || []).entries()) {
  ["id", "code", "shortTitle", "title", "tagline", "weeklyHours", "dailyLife", "sacrifice"].forEach((field) => {
    requireText(path[field], `paths[${index}].${field}`);
  });
  if (pathIds.has(path.id)) errors.push(`路徑 id 重複：${path.id}`);
  pathIds.add(path.id);
  for (const valueId of valueIds) {
    const score = path.dimensions?.[valueId];
    if (!Number.isInteger(score) || score < 1 || score > 5) errors.push(`${path.id}.dimensions.${valueId} 必須是 1–5 的整數`);
  }
  if (!Array.isArray(path.roadmap) || path.roadmap.length !== 6) errors.push(`${path.id}.roadmap 必須涵蓋六個年度節點`);
  for (const field of ["weekShape", "reversible", "irreversible", "switchSignals"]) {
    if (!Array.isArray(path[field]) || path[field].length === 0) errors.push(`${path.id}.${field} 不可為空`);
  }
}

const experimentIds = new Set();
for (const [index, experiment] of (data.experiments || []).entries()) {
  ["id", "phase", "title", "description", "proof"].forEach((field) => requireText(experiment[field], `experiments[${index}].${field}`));
  if (experimentIds.has(experiment.id)) errors.push(`實驗 id 重複：${experiment.id}`);
  experimentIds.add(experiment.id);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Validated ${data.paths.length} life paths, ${data.values.length} value weights, and ${data.experiments.length} experiments.`);
