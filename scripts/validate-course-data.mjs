import { readFile } from "node:fs/promises";

const fileUrl = new URL("../data/course-intelligence.json", import.meta.url);
const payload = JSON.parse(await readFile(fileUrl, "utf8"));
const allowedStatuses = new Set(["open", "ongoing", "waitlist", "closed", "verify"]);
const allowedCreditStatuses = new Set(["confirmed", "expected", "unverified"]);
const requiredFields = [
  "id",
  "title",
  "organizer",
  "startDate",
  "endDate",
  "location",
  "formats",
  "status",
  "statusLabel",
  "audience",
  "verification",
  "verificationLabel",
  "creditStatus",
  "regulatoryHours",
  "price",
  "summary",
  "tags",
  "sourceUrl",
  "sourceLabel",
  "checkedAt"
];

const errors = [];
const warnings = [];
const ids = new Set();
const todayKey = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Taipei",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const today = new Date(`${todayKey}T12:00:00+08:00`);

if (payload.schemaVersion !== 1) errors.push("schemaVersion 必須是 1");
if (!Array.isArray(payload.courses)) errors.push("courses 必須是陣列");

for (const [index, course] of (payload.courses || []).entries()) {
  const label = `courses[${index}]`;
  for (const field of requiredFields) {
    if (course[field] === undefined || course[field] === null || course[field] === "") {
      errors.push(`${label}.${field} 不可為空`);
    }
  }
  if (ids.has(course.id)) errors.push(`${label}.id 重複：${course.id}`);
  ids.add(course.id);
  if (!allowedStatuses.has(course.status)) errors.push(`${label}.status 無效：${course.status}`);
  if (!allowedCreditStatuses.has(course.creditStatus)) errors.push(`${label}.creditStatus 無效：${course.creditStatus}`);
  if (!Array.isArray(course.formats) || course.formats.length === 0) errors.push(`${label}.formats 必須是非空陣列`);
  if (!Array.isArray(course.tags)) errors.push(`${label}.tags 必須是陣列`);
  if (!/^https:\/\//.test(course.sourceUrl || "")) errors.push(`${label}.sourceUrl 必須使用 HTTPS`);
  if (Number.isNaN(Date.parse(course.startDate))) errors.push(`${label}.startDate 日期格式無效`);
  if (Number.isNaN(Date.parse(course.endDate))) errors.push(`${label}.endDate 日期格式無效`);
  if (Number.isNaN(Date.parse(course.checkedAt))) errors.push(`${label}.checkedAt 日期格式無效`);
  if (course.registrationDeadline && Number.isNaN(Date.parse(course.registrationDeadline))) {
    errors.push(`${label}.registrationDeadline 日期格式無效`);
  }

  const startDate = new Date(`${course.startDate}T12:00:00+08:00`);
  const endDate = new Date(`${course.endDate}T12:00:00+08:00`);
  const checkedAt = new Date(`${course.checkedAt}T12:00:00+08:00`);
  const registrationDeadline = course.registrationDeadline
    ? new Date(`${course.registrationDeadline}T12:00:00+08:00`)
    : null;

  if (endDate < startDate) errors.push(`${label} 結束日早於開始日`);
  if (["open", "ongoing", "verify"].includes(course.status) && endDate < today) {
    errors.push(`${label} 已結束但 status 仍為 ${course.status}`);
  }
  if (course.status === "open" && registrationDeadline && registrationDeadline < today) {
    errors.push(`${label} 報名期限已過但 status 仍為 open`);
  }
  const checkedAgeDays = Math.floor((today - checkedAt) / 86_400_000);
  if (checkedAgeDays > 14) warnings.push(`${label} 最後查核已過 ${checkedAgeDays} 天`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

if (warnings.length) console.warn(warnings.join("\n"));

console.log(`課程資料驗證通過：${payload.courses.length} 筆，最後更新 ${payload.lastUpdated}${warnings.length ? `，${warnings.length} 筆新鮮度提醒` : ""}`);
