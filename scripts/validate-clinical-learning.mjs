import { readFile } from "node:fs/promises";

const fileUrl = new URL("../data/clinical-learning.json", import.meta.url);
const payload = JSON.parse(await readFile(fileUrl, "utf8"));
const errors = [];
const moduleIds = new Set();
const sourceIds = new Set((payload.sources || []).map((source) => source.id));
const domainIds = new Set((payload.passportDomains || []).map((domain) => domain.id));
const requiredModuleFields = [
  "id",
  "phase",
  "phaseLabel",
  "handbookYear",
  "priority",
  "durationMinutes",
  "title",
  "clinicPrompt",
  "summary",
  "prerequisites",
  "domains",
  "objectives",
  "clinicChecklist",
  "redFlags",
  "supervision",
  "sourceIds",
  "case",
];

if (payload.schemaVersion !== 1) errors.push("schemaVersion 必須是 1");
if (!Number.isFinite(Date.parse(payload.lastReviewed))) errors.push("lastReviewed 日期格式無效");
if (![25, 45, 75].includes(payload.defaultDailyMinutes)) errors.push("defaultDailyMinutes 必須是 25、45 或 75");
if (!Array.isArray(payload.reviewIntervalsDays) || payload.reviewIntervalsDays.some((day) => !Number.isInteger(day) || day < 1)) {
  errors.push("reviewIntervalsDays 必須是正整數陣列");
}
if (!Array.isArray(payload.sources) || payload.sources.length < 3) errors.push("sources 至少需要三個來源");
if (!Array.isArray(payload.passportDomains) || payload.passportDomains.length !== 6) errors.push("passportDomains 必須有六個領域");
if (!Array.isArray(payload.modules) || payload.modules.length === 0) errors.push("modules 必須是非空陣列");

for (const [index, module] of (payload.modules || []).entries()) {
  const label = `modules[${index}]`;
  for (const field of requiredModuleFields) {
    if (module[field] === undefined || module[field] === null || module[field] === "") {
      errors.push(`${label}.${field} 不可為空`);
    }
  }
  if (!/^[a-z0-9-]+$/.test(module.id || "")) errors.push(`${label}.id 格式無效`);
  if (moduleIds.has(module.id)) errors.push(`${label}.id 重複：${module.id}`);
  moduleIds.add(module.id);
  if (!Number.isInteger(module.phase) || module.phase < 1 || module.phase > 4) errors.push(`${label}.phase 必須介於 1 到 4`);
  if (!Number.isInteger(module.priority) || module.priority < 1) errors.push(`${label}.priority 必須為正整數`);
  if (!Number.isInteger(module.durationMinutes) || module.durationMinutes < 10 || module.durationMinutes > 60) {
    errors.push(`${label}.durationMinutes 必須介於 10 到 60`);
  }
  for (const field of ["objectives", "clinicChecklist", "redFlags", "sourceIds", "domains", "prerequisites"]) {
    if (!Array.isArray(module[field])) errors.push(`${label}.${field} 必須是陣列`);
  }
  if ((module.objectives || []).length < 3) errors.push(`${label}.objectives 至少三項`);
  if ((module.clinicChecklist || []).length < 3) errors.push(`${label}.clinicChecklist 至少三項`);
  if ((module.redFlags || []).length < 2) errors.push(`${label}.redFlags 至少兩項`);
  for (const sourceId of module.sourceIds || []) {
    if (!sourceIds.has(sourceId)) errors.push(`${label}.sourceIds 找不到來源：${sourceId}`);
  }
  for (const domainId of module.domains || []) {
    if (!domainIds.has(domainId)) errors.push(`${label}.domains 找不到領域：${domainId}`);
  }
  const caseItem = module.case || {};
  if (!caseItem.stem || !caseItem.question || !caseItem.rationale) errors.push(`${label}.case 缺少題幹、問題或解析`);
  if (!Array.isArray(caseItem.options) || caseItem.options.length !== 4) errors.push(`${label}.case.options 必須有四個選項`);
  if (!Number.isInteger(caseItem.correctIndex) || caseItem.correctIndex < 0 || caseItem.correctIndex > 3) {
    errors.push(`${label}.case.correctIndex 必須介於 0 到 3`);
  }
}

for (const [index, module] of (payload.modules || []).entries()) {
  for (const prerequisite of module.prerequisites || []) {
    if (!moduleIds.has(prerequisite)) errors.push(`modules[${index}].prerequisites 找不到單元：${prerequisite}`);
    if (prerequisite === module.id) errors.push(`modules[${index}] 不可依賴自己`);
  }
}

const visiting = new Set();
const visited = new Set();
const moduleMap = new Map((payload.modules || []).map((module) => [module.id, module]));
const visit = (id) => {
  if (visiting.has(id)) {
    errors.push(`先修關係形成循環：${id}`);
    return;
  }
  if (visited.has(id)) return;
  visiting.add(id);
  for (const prerequisite of moduleMap.get(id)?.prerequisites || []) visit(prerequisite);
  visiting.delete(id);
  visited.add(id);
};
for (const id of moduleIds) visit(id);

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`臨床動態課程資料驗證通過：${payload.modules.length} 個單元、${payload.passportDomains.length} 個學習護照領域`);
