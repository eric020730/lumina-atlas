import { readFile } from "node:fs/promises";

const fileUrl = new URL("../data/video-learning.json", import.meta.url);
const payload = JSON.parse(await readFile(fileUrl, "utf8"));
const allowedCategories = new Set(["foundation", "energy", "injection", "safety"]);
const requiredFields = [
  "id",
  "week",
  "category",
  "categoryLabel",
  "title",
  "source",
  "duration",
  "objective",
  "takeaway",
  "sourceUrl",
  "checkedAt",
];

const errors = [];
const ids = new Set();
const sourceUrls = new Set();

if (payload.schemaVersion !== 1) errors.push("schemaVersion 必須是 1");
if (!Number.isFinite(Date.parse(payload.lastUpdated))) errors.push("lastUpdated 日期格式無效");
if (!Array.isArray(payload.lessons) || payload.lessons.length === 0) errors.push("lessons 必須是非空陣列");

for (const [index, lesson] of (payload.lessons || []).entries()) {
  const label = `lessons[${index}]`;
  for (const field of requiredFields) {
    if (lesson[field] === undefined || lesson[field] === null || lesson[field] === "") {
      errors.push(`${label}.${field} 不可為空`);
    }
  }
  if (!/^[A-Za-z0-9_-]{11}$/.test(lesson.id || "")) errors.push(`${label}.id 不是有效的 YouTube ID`);
  if (ids.has(lesson.id)) errors.push(`${label}.id 重複：${lesson.id}`);
  ids.add(lesson.id);
  if (!Number.isInteger(lesson.week) || lesson.week < 1 || lesson.week > 6) errors.push(`${label}.week 必須介於 1 到 6`);
  if (!allowedCategories.has(lesson.category)) errors.push(`${label}.category 無效：${lesson.category}`);
  if (!/^\d{2,3}:\d{2}$/.test(lesson.duration || "")) errors.push(`${label}.duration 格式應為 MM:SS`);
  if (!/^https:\/\/www\.youtube\.com\/watch\?v=/.test(lesson.sourceUrl || "")) errors.push(`${label}.sourceUrl 必須是 YouTube HTTPS 觀看網址`);
  if (lesson.sourceUrl && !lesson.sourceUrl.includes(`v=${lesson.id}`)) errors.push(`${label}.sourceUrl 與影片 ID 不一致`);
  if (Number.isNaN(Date.parse(lesson.checkedAt))) errors.push(`${label}.checkedAt 日期格式無效`);
  sourceUrls.add(lesson.sourceUrl);
}

if (payload.sourceCount !== sourceUrls.size) {
  errors.push(`sourceCount 應為 ${sourceUrls.size}，目前是 ${payload.sourceCount}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`影片資料驗證通過：${payload.lessons.length} 堂，最後更新 ${payload.lastUpdated}`);
