const layerContent = {
  regulation: {
    label: "目前層級・法規與資格",
    description: "追蹤特管辦法、訓練資格與案例認定，是所有學習路徑的基底。",
  },
  course: {
    label: "目前層級・訓練與課程",
    description: "整理課程資格、時數、費用與截止日，把零散報名資訊變成清楚路徑。",
  },
  technique: {
    label: "目前層級・技術與解剖",
    description: "從組織層次、針具選擇到材料特性，建立操作之前必須理解的地圖。",
  },
  safety: {
    label: "目前層級・安全與處置",
    description: "預先學習風險辨識與併發症處理，讓安全不是課程最後才出現的附註。",
  },
};

const header = document.querySelector("[data-header]");
const menuTrigger = document.querySelector("[data-menu-trigger]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const searchDialog = document.querySelector("[data-search-dialog]");
const searchInput = document.querySelector("[data-search-input]");
const searchEntries = [...document.querySelectorAll("[data-search-entry]")];
const searchEmpty = document.querySelector("[data-search-empty]");
const toast = document.querySelector("[data-toast]");
let toastTimer;

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
};

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
});

menuTrigger?.addEventListener("click", () => {
  const isOpen = menuTrigger.getAttribute("aria-expanded") === "true";
  menuTrigger.setAttribute("aria-expanded", String(!isOpen));
  mobileNav.classList.toggle("is-open", !isOpen);
});

mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuTrigger.setAttribute("aria-expanded", "false");
    mobileNav.classList.remove("is-open");
  });
});

const openSearch = () => {
  if (!searchDialog.open) searchDialog.showModal();
  window.setTimeout(() => searchInput.focus(), 30);
};

const closeSearch = () => {
  searchDialog.close();
  searchInput.value = "";
  searchEntries.forEach((entry) => (entry.hidden = false));
  searchEmpty.hidden = true;
};

document.querySelectorAll("[data-open-search]").forEach((button) => {
  button.addEventListener("click", openSearch);
});

document.querySelector("[data-close-search]")?.addEventListener("click", closeSearch);

searchDialog?.addEventListener("click", (event) => {
  if (event.target === searchDialog) closeSearch();
});

searchEntries.forEach((entry) => entry.addEventListener("click", closeSearch));

document.addEventListener("keydown", (event) => {
  const target = event.target;
  const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
  if (event.key === "/" && !isTyping) {
    event.preventDefault();
    openSearch();
  }
});

searchInput?.addEventListener("input", () => {
  const query = searchInput.value.trim().toLocaleLowerCase("zh-Hant");
  let matches = 0;
  searchEntries.forEach((entry) => {
    const text = `${entry.textContent} ${entry.dataset.keywords}`.toLocaleLowerCase("zh-Hant");
    const visible = !query || text.includes(query);
    entry.hidden = !visible;
    if (visible) matches += 1;
  });
  searchEmpty.hidden = matches !== 0;
});

document.querySelectorAll("[data-layer]").forEach((layer) => {
  layer.addEventListener("click", () => {
    document.querySelectorAll("[data-layer]").forEach((item) => item.classList.remove("is-active"));
    layer.classList.add("is-active");
    const content = layerContent[layer.dataset.layer];
    document.querySelector("[data-layer-label]").textContent = content.label;
    document.querySelector("[data-layer-description]").textContent = content.description;
  });
});

const savedItems = new Set(JSON.parse(localStorage.getItem("lumina-saved") || "[]"));

const wireSaveButtons = (scope = document) => {
  scope.querySelectorAll("[data-save]:not([data-save-wired])").forEach((button) => {
    button.dataset.saveWired = "true";
    const key = button.dataset.save;
    const label = button.querySelector("span");
    const initialText = label.textContent;

    const render = () => {
      const saved = savedItems.has(key);
      button.classList.toggle("is-saved", saved);
      button.setAttribute("aria-pressed", String(saved));
      label.textContent = saved ? "已收藏" : initialText;
    };

    render();
    button.addEventListener("click", () => {
      if (savedItems.has(key)) {
        savedItems.delete(key);
        showToast("已移除收藏");
      } else {
        savedItems.add(key);
        showToast("已加入收藏");
      }
      localStorage.setItem("lumina-saved", JSON.stringify([...savedItems]));
      render();
    });
  });
};

wireSaveButtons();

const filters = document.querySelectorAll("[data-filter]");
const courseEmpty = document.querySelector("[data-course-empty]");
let activeCourseFilter = "all";

const applyCourseFilter = () => {
  const courses = document.querySelectorAll("[data-course]");
  let visibleCount = 0;
  courses.forEach((course) => {
    const formats = course.dataset.format.split(" ");
    const visible = activeCourseFilter === "all" || formats.includes(activeCourseFilter);
    course.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  courseEmpty.hidden = visibleCount !== 0;
};

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("is-active"));
    filter.classList.add("is-active");
    activeCourseFilter = filter.dataset.filter;
    applyCourseFilter();
  });
});

const courseFeed = document.querySelector("[data-course-feed]");
const courseError = document.querySelector("[data-course-error]");
const courseFreshness = document.querySelector("[data-course-freshness]");
const verifiedCount = document.querySelector("[data-verified-count]");
const deadlineDate = document.querySelector("[data-deadline-date]");
const deadlineTitle = document.querySelector("[data-deadline-title]");
const daysLabel = document.querySelector("[data-days-left]");

const escapeHTML = (value = "") =>
  String(value).replace(
    /[&<>"]/g,
    (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character],
  );

const parseTaiwanDate = (date) => new Date(`${date}T12:00:00+08:00`);
const formatShortDate = (date) =>
  parseTaiwanDate(date).toLocaleDateString("zh-TW", { month: "2-digit", day: "2-digit" });
const formatFullDate = (date) =>
  parseTaiwanDate(date).toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" });

const formatDateRange = (startDate, endDate) => {
  if (startDate === endDate) return formatFullDate(startDate);
  return `${formatFullDate(startDate)}–${formatShortDate(endDate)}`;
};

const courseCardTemplate = (course) => {
  const tagList = course.tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join("");
  const month = parseTaiwanDate(course.startDate).toLocaleDateString("zh-TW", { month: "short" });
  const day = parseTaiwanDate(course.startDate).toLocaleDateString("zh-TW", { day: "2-digit" });
  const sourceUrl = course.sourceUrl.startsWith("https://") ? course.sourceUrl : "#";
  const registrationDeadline = course.registrationDeadline
    ? formatFullDate(course.registrationDeadline)
    : "未公告固定期限";
  const decisionNote = (() => {
    if (course.status === "verify") {
      return "若目標是累積法定訓練時數，報名前先向主辦確認是否核定、可採認及會取得哪一類證明。";
    }
    if (course.status === "waitlist") {
      return "目前不一定能直接報名；可先詢問候補與釋出名額，同時保留其他課程選項。";
    }
    if (course.formats.includes("online")) {
      return "適合先補理論基礎；仍要另外核對法定 32 小時中尚缺的課綱、時數與實作要求。";
    }
    return "報名前再回原始公告確認名額、身分門檻、最終核定積分與取消規則。";
  })();

  return `
    <article class="course-card course-card--${escapeHTML(course.status)}" data-course data-format="${escapeHTML(course.formats.join(" "))}" data-search-item data-keywords="${escapeHTML([course.title, course.organizer, ...course.tags].join(" "))}">
      <header class="course-card__header">
        <time datetime="${escapeHTML(course.startDate)}"><span>${escapeHTML(month)}</span><strong>${escapeHTML(day)}</strong></time>
        <div class="course-card__badges">
          <span class="course-status course-status--${escapeHTML(course.status)}">${escapeHTML(course.statusLabel)}</span>
          <span class="verification-badge">${escapeHTML(course.verificationLabel)}</span>
        </div>
      </header>
      <div class="course-card__body">
        <p class="course-card__organizer">${escapeHTML(course.organizer)}</p>
        <h3>${escapeHTML(course.title)}</h3>
        <div class="course-card__takeaway">
          <span>一眼重點</span>
          <p>${escapeHTML(course.summary)}</p>
        </div>
        <dl class="course-card__facts">
          <div><dt>日期</dt><dd>${escapeHTML(formatDateRange(course.startDate, course.endDate))}</dd></div>
          <div><dt>報名期限</dt><dd>${escapeHTML(registrationDeadline)}</dd></div>
          <div><dt>地點</dt><dd>${escapeHTML(course.location)}</dd></div>
          <div><dt>對象</dt><dd>${escapeHTML(course.audience)}</dd></div>
          <div><dt>時數／認證</dt><dd>${escapeHTML(course.regulatoryHours)}</dd></div>
          <div><dt>費用</dt><dd>${escapeHTML(course.price)}</dd></div>
        </dl>
        <div class="course-card__notice"><span>報名前注意</span><p>${escapeHTML(decisionNote)}</p></div>
        <div class="course-card__tags" aria-label="課程標籤">${tagList}</div>
      </div>
      <footer class="course-card__footer">
        <div><span>最後查核 ${escapeHTML(formatFullDate(course.checkedAt))}</span><a href="${escapeHTML(sourceUrl)}" target="_blank" rel="noreferrer">${escapeHTML(course.sourceLabel)} <span aria-hidden="true">↗</span></a></div>
        <button class="save-button" type="button" data-save="course-${escapeHTML(course.id)}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 4.5h11v15l-5.5-3-5.5 3z" /></svg>
          <span>收藏</span>
        </button>
      </footer>
    </article>`;
};

const updateNextDeadline = (courses) => {
  const now = new Date();
  const upcoming = courses
    .filter((course) => course.registrationDeadline && parseTaiwanDate(course.registrationDeadline) >= now)
    .sort((a, b) => a.registrationDeadline.localeCompare(b.registrationDeadline))[0];

  if (!upcoming) {
    deadlineDate.textContent = "持續追蹤";
    deadlineTitle.textContent = "目前沒有已核實的最近報名期限";
    daysLabel.textContent = "請查看各課程狀態";
    return;
  }

  const deadline = new Date(`${upcoming.registrationDeadline}T23:59:59+08:00`);
  const daysLeft = Math.max(0, Math.ceil((deadline - now) / 86_400_000));
  deadlineDate.textContent = formatFullDate(upcoming.registrationDeadline).replaceAll("/", ".");
  deadlineTitle.textContent = upcoming.title;
  daysLabel.textContent = daysLeft === 0 ? "今天截止" : `距截止還有 ${daysLeft} 天`;
};

const loadCourseIntelligence = async () => {
  try {
    const response = await fetch("./data/course-intelligence.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    courseFeed.innerHTML = payload.courses.map(courseCardTemplate).join("");
    courseFeed.setAttribute("aria-busy", "false");
    courseFreshness.textContent = `最後查核 ${new Date(payload.lastUpdated).toLocaleString("zh-TW", { timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}・${payload.sourceCount} 個來源・${payload.courses.length} 門課`;
    verifiedCount.textContent = `已查核 ${payload.courses.length} 門課`;
    wireSaveButtons(courseFeed);
    applyCourseFilter();
    updateNextDeadline(payload.courses);
  } catch (error) {
    console.error("課程情報載入失敗", error);
    courseFeed.hidden = true;
    courseError.hidden = false;
    courseFreshness.textContent = "課程資料暫時無法載入";
    verifiedCount.textContent = "查核資料載入失敗";
    deadlineDate.textContent = "請稍後再試";
    deadlineTitle.textContent = "無法讀取課程資料";
    daysLabel.textContent = "—";
  }
};

loadCourseIntelligence();

const qualificationForm = document.querySelector("[data-qualification-form]");
const qualificationResult = document.querySelector("[data-qualification-result]");
const resultBadge = document.querySelector("[data-result-badge]");
const resultContext = document.querySelector("[data-result-context]");
const resultTitle = document.querySelector("[data-result-title]");
const resultSummary = document.querySelector("[data-result-summary]");
const resultRequirements = document.querySelector("[data-result-requirements]");
const resultDeadline = document.querySelector("[data-result-deadline]");
const resultDays = document.querySelector("[data-result-days]");
const resultDate = document.querySelector("[data-result-date]");
const resultCaveat = document.querySelector("[data-result-caveat]");
const regulationClock = document.querySelector("[data-regulation-clock]");
const specialtyHint = document.querySelector("[data-specialty-hint]");
const specialtyDetail = document.querySelector("[data-specialty-detail]");
const scopeProcedure = document.querySelector("[data-scope-procedure]");
const scopeSurgery = document.querySelector("[data-scope-surgery]");
const scopeHighRisk = document.querySelector("[data-scope-high-risk]");
const transitionDeadline = new Date("2026-12-31T23:59:59+08:00");
const extendedTransitionDeadline = new Date("2027-12-31T23:59:59+08:00");

const getDaysUntil = (date) => Math.max(0, Math.ceil((date - new Date()) / 86_400_000));

const specialtyProfiles = {
  family: { label: "家庭醫學科", society: "台灣家庭醫學醫學會" },
  radiology: { label: "放射診斷科", society: "中華民國放射線醫學會" },
  surgery: { label: "外科", society: "台灣外科醫學會", generalSurgery: true, highRisk: ["中／全臉拉皮", "大量或全麻抽脂", "腹部整形", "鼻整形", "義乳植入"] },
  orthopedics: { label: "骨科", society: "中華民國骨科醫學會", generalSurgery: true, highRisk: ["臉部削骨", "臉部以外削骨", "中／全臉拉皮"] },
  neurosurgery: { label: "神經外科", society: "台灣神經外科醫學會", generalSurgery: true, highRisk: ["臉部削骨"] },
  plastic: { label: "整形外科", society: "台灣整形外科醫學會", generalSurgery: true, highRisk: ["削骨", "中／全臉拉皮", "大量或全麻抽脂", "腹部整形", "鼻整形", "義乳植入", "全身拉皮", "全麻生殖器整形"] },
  urology: { label: "泌尿科", society: "台灣泌尿科醫學會", generalSurgery: true, highRisk: ["全麻生殖器整形"] },
  obgyn: { label: "婦產科", society: "台灣婦產科醫學會", generalSurgery: true, highRisk: ["大量或全麻抽脂", "腹部整形", "全麻生殖器整形"] },
  ophthalmology: { label: "眼科", society: "中華民國眼科醫學會", generalSurgery: true, highRisk: ["臉部削骨", "中／全臉拉皮"] },
  ent: { label: "耳鼻喉科", society: "台灣耳鼻喉頭頸外科醫學會", generalSurgery: true, highRisk: ["臉部削骨", "中／全臉拉皮", "鼻整形"] },
  dermatology: { label: "皮膚科", society: "台灣皮膚科醫學會", generalSurgery: true, highRisk: ["中／全臉拉皮", "大量或全麻抽脂", "腹部整形", "鼻整形"] },
  internal: { label: "內科", society: "台灣內科醫學會" },
  pediatrics: { label: "兒科", society: "臺灣兒科醫學會" },
  emergency: { label: "急診醫學科", society: "台灣急診醫學會" },
  anesthesiology: { label: "麻醉科", society: "台灣麻醉醫學會" },
  rehabilitation: { label: "復健科", society: "台灣復健醫學會" },
  neurology: { label: "神經科", society: "台灣神經學學會" },
  psychiatry: { label: "精神科", society: "台灣精神醫學會" },
  radiationOncology: { label: "放射腫瘤科", society: "台灣放射腫瘤學會" },
  pathology: { label: "解剖病理科", society: "台灣病理學會" },
  clinicalPathology: { label: "臨床病理科", society: "台灣臨床病理暨檢驗醫學會" },
  nuclearMedicine: { label: "核子醫學科", society: "中華民國核醫學學會" },
  occupational: { label: "職業醫學科", society: "中華民國環境職業醫學會" },
};

const qualificationScenarios = {
  procedureBefore: {
    tone: "allowed",
    badge: "可依法施行",
    title: "可施行光電、針劑與FUE等處置",
    summary: "2019年8月1日前畢業且已取得部定專科資格，不必提出32例，也不受PGY及初始32小時訓練限制。",
    requirements: ["不需32例案例審查", "免初始32小時訓練限制", "每3年完成24小時繼續教育", "由院所完成項目及醫師資格備查"],
    caveat: "放射科專科的豁免只適用特定美容醫學處置，不會延伸成美容手術資格。",
  },
  procedureAfterNew: {
    tone: "warning",
    badge: "先完成資格",
    title: "完成PGY與32小時後才可開始施行",
    summary: "2019年8月1日起畢業者，放射科專科資格本身不免除新制訓練要求；但不必送32例案例審查。",
    requirements: ["完成適用學制的PGY並取得證明", "完成認可學會特定處置訓練至少32小時", "不需32例案例審查", "開始施作前由院所完成備查"],
    caveat: "中華民國放射線醫學會在認可訓練學會名單內；課程仍須符合全聯會最新課綱。",
  },
  procedureAfterExisting: {
    tone: "warning",
    badge: "既有業務過渡",
    title: "可在既有處置過渡期內補齊資格",
    summary: "若2026年1月1日前已施行，第27條之1第4項文字提供二年補齊PGY與32小時證明的過渡空間。",
    requirements: ["確認並保存PGY完訓證明", "完成認可學會32小時訓練", "不需32例案例審查", "就二年過渡起算取得地方衛生局書面確認"],
    caveat: "學會作業資料普遍建議2026年底前完成；如要援用二年條款，不要只靠口頭詢問。",
    deadline: extendedTransitionDeadline,
    deadlineLabel: "2027.12.31・法條二年過渡",
  },
  surgeryCases: {
    tone: "warning",
    badge: "可申請過渡",
    title: "可走30例既有手術案例認定",
    summary: "放射科不在九大美容手術專科內，但2026年新制前已有至少30例者，可依過渡條款申請繼續施行。",
    requirements: ["送審2026年1月1日前至少30例手術", "取得醫師全聯會案例認定證明", "完成美容醫學手術訓練至少32小時", "備妥病歷、手術紀錄及同意書"],
    caveat: "這是既有業務的過渡保留，不是取得所有美容手術的新資格；建議立刻送件，預留補件與複審時間。",
    deadline: transitionDeadline,
    deadlineLabel: "2026.12.31・案例與訓練期限",
  },
  surgeryNoCases: {
    tone: "danger",
    badge: "不可新施作",
    title: "放射科專科不能直接取得美容手術資格",
    summary: "放射診斷科不在法定九大美容手術專科內；沒有2026年前30例，也無法使用既有案例過渡條款。",
    requirements: ["若要新施作，原則上須取得九大部定專科之一", "單靠補32小時課程不足", "民間美容醫學專科證書不能取代法定專科", "目前可聚焦於符合資格的非手術處置"],
    caveat: "九大專科為外科、骨科、神經外科、整形外科、泌尿科、婦產科、眼科、耳鼻喉科及皮膚科。",
  },
  highRiskLegacy: {
    tone: "warning",
    badge: "舊制例外待確認",
    title: "僅可能保留舊證明涵蓋的既有項目",
    summary: "若2019年1月1日前已施作特定高風險項目，且當時取得認可學會或全聯會證明，可能依第31條不受科別限制。",
    requirements: ["核對舊證明的核發單位與日期", "確認證明逐項涵蓋欲施作項目", "由院所向地方衛生局核准登記", "取得主管機關書面認定後再施作"],
    caveat: "舊制例外不會擴張到證明以外的新項目；資格與機構核准是兩個不同層次。",
  },
  highRiskNoLegacy: {
    tone: "danger",
    badge: "原則禁止",
    title: "放射科不得新施作高風險特定手術",
    summary: "削骨、中全臉拉皮、大量或全麻抽脂、腹整、鼻整形、義乳等，均有更嚴格的逐項專科限制。",
    requirements: ["放射診斷科不在各項許可專科名單", "一般30例手術過渡不等於高風險項目資格", "沒有2019年前舊制證明即不適用第31條", "不得以民間訓練證書替代法定科別"],
    caveat: "如院所規劃此類業務，須改由符合第26條逐項專科資格的醫師施行。",
  },
};

const saveQualificationProfile = () => {
  if (!qualificationForm) return;
  const data = new FormData(qualificationForm);
  const profile = {
    specialty: data.get("specialty"),
    graduation: data.get("graduation"),
    procedure: data.get("procedure"),
    existingProcedure: data.get("existingProcedure") === "on",
    hasSurgeryCases: data.get("hasSurgeryCases") === "on",
    existingSurgery: data.get("existingSurgery") === "on",
    hasLegacyCertificate: data.get("hasLegacyCertificate") === "on",
  };
  localStorage.setItem("lumina-qualification-profile", JSON.stringify(profile));
};

const loadQualificationProfile = () => {
  if (!qualificationForm) return;
  try {
    const profile = JSON.parse(localStorage.getItem("lumina-qualification-profile") || "null");
    if (!profile) return;
    const specialty = qualificationForm.elements.specialty;
    if (specialty && specialtyProfiles[profile.specialty]) specialty.value = profile.specialty;
    ["graduation", "procedure"].forEach((name) => {
      const input = qualificationForm.querySelector(`[name="${name}"][value="${profile[name]}"]`);
      if (input) input.checked = true;
    });
    ["existingProcedure", "hasSurgeryCases", "existingSurgery", "hasLegacyCertificate"].forEach((name) => {
      const input = qualificationForm.elements[name];
      if (input) input.checked = Boolean(profile[name]);
    });
  } catch {
    localStorage.removeItem("lumina-qualification-profile");
  }
};

const getQualificationScenario = () => {
  const data = new FormData(qualificationForm);
  const profile = specialtyProfiles[data.get("specialty")] || specialtyProfiles.radiology;
  const graduation = data.get("graduation");
  const procedure = data.get("procedure");

  if (procedure === "surgery" && profile.generalSurgery) {
    const existing = data.get("existingSurgery") === "on";
    return {
      tone: existing ? "warning" : "allowed",
      badge: existing ? "一年過渡期" : "具科別門檻",
      title: existing ? "可在期限內補齊32小時訓練" : "完成32小時訓練後可施行",
      summary: `${profile.label}屬第25條法定九大美容手術專科，${existing ? "2026年前已施行者可在一年內補齊訓練" : "新進業務應先取得32小時訓練證明"}。`,
      requirements: ["完成認可學會美容醫學手術訓練至少32小時", "每3年完成繼續教育至少24小時", "由院所完成施行項目及醫師資格備查", "特定高風險手術仍須再核對第26條逐項科別"],
      caveat: "第25條的一般美容手術資格，不代表可施行所有特定美容手術。",
      deadline: existing ? transitionDeadline : undefined,
      deadlineLabel: existing ? "2026.12.31・一年訓練期限" : undefined,
    };
  }

  if (procedure === "surgery") {
    const scenario = data.get("hasSurgeryCases") === "on"
      ? { ...qualificationScenarios.surgeryCases }
      : { ...qualificationScenarios.surgeryNoCases };
    scenario.title = scenario.title.replace("放射科", profile.label);
    scenario.summary = scenario.summary.replace("放射科", profile.label).replace("放射診斷科", profile.label);
    return scenario;
  }

  if (procedure === "highRisk" && profile.highRisk?.length) {
    return {
      tone: "warning",
      badge: "逐項限定",
      title: "可施行第26條所列的部分項目",
      summary: `${profile.label}並非可施行全部特定美容手術；現行條文列入的項目為：${profile.highRisk.join("、")}。`,
      requirements: [`可適用項目：${profile.highRisk.join("、")}`, "應完成32小時美容手術訓練", "由院所依項目向地方衛生局申請核准與登記"],
      caveat: "未列於第26條該科別之項目，不得以一般美容手術資格或訓練證明擴張施作。",
    };
  }

  if (procedure === "highRisk") {
    const scenario = data.get("hasLegacyCertificate") === "on"
      ? { ...qualificationScenarios.highRiskLegacy }
      : { ...qualificationScenarios.highRiskNoLegacy };
    scenario.title = scenario.title.replace("放射科", profile.label);
    scenario.requirements = scenario.requirements.map((item) => item.replace("放射診斷科", profile.label));
    return scenario;
  }

  if (graduation === "before") {
    return {
      ...qualificationScenarios.procedureBefore,
      summary: `2019年8月1日前畢業且已取得${profile.label}專科資格，不必提出32例，也不受PGY及初始32小時訓練限制。`,
      caveat: `此豁免只適用特定美容醫學處置；${profile.label}的美容手術資格仍應另依第25條與第26條判斷。`,
    };
  }

  const scenario = data.get("existingProcedure") === "on"
    ? { ...qualificationScenarios.procedureAfterExisting }
    : { ...qualificationScenarios.procedureAfterNew };
  scenario.summary = scenario.summary.replace("放射科", profile.label);
  scenario.caveat = data.get("existingProcedure") === "on"
    ? scenario.caveat
    : `${profile.society}在衛福部認可的特定處置訓練學會名單內；課程仍須符合全聯會最新課綱。`;
  return scenario;
};

const renderQualification = () => {
  if (!qualificationForm || !qualificationResult) return;
  const data = new FormData(qualificationForm);
  const profile = specialtyProfiles[data.get("specialty")] || specialtyProfiles.radiology;
  const graduation = data.get("graduation");
  const procedure = data.get("procedure");

  document.querySelectorAll("[data-conditional]").forEach((field) => {
    const type = field.dataset.conditional;
    if (type === "procedure") field.hidden = !(procedure === "procedure" && graduation === "after");
    if (type === "surgery") field.hidden = !(procedure === "surgery" && !profile.generalSurgery);
    if (type === "eligibleSurgery") field.hidden = !(procedure === "surgery" && profile.generalSurgery);
    if (type === "highRisk") field.hidden = !(procedure === "highRisk" && !profile.highRisk?.length);
  });

  const scenario = getQualificationScenario();
  qualificationResult.dataset.tone = scenario.tone;
  resultBadge.textContent = scenario.badge;
  resultContext.textContent = `已取得・${profile.label}專科醫師`;
  resultTitle.textContent = scenario.title;
  resultSummary.textContent = scenario.summary;
  resultCaveat.textContent = scenario.caveat;
  resultRequirements.replaceChildren(...scenario.requirements.map((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    return li;
  }));

  if (scenario.deadline) {
    const days = getDaysUntil(scenario.deadline);
    resultDeadline.hidden = false;
    resultDays.textContent = days > 0 ? `剩 ${days} 天` : "期限已到";
    resultDate.textContent = scenario.deadlineLabel;
  } else {
    resultDeadline.hidden = true;
  }

  const surgeryHint = profile.generalSurgery
    ? "屬美容手術九大專科；特定美容手術仍應依項目核對科別。"
    : "屬部定專科，但不在美容手術九大專科內。";
  specialtyHint.textContent = `${profile.label}${surgeryHint}`;
  specialtyDetail.textContent = `${profile.label}${profile.generalSurgery ? "在九大專科內，但特定美容手術仍有逐項限制。" : "不在其中。"}`;
  scopeProcedure.textContent = `${profile.label}專科可適用（依畢業時間補足條件）`;
  scopeSurgery.textContent = profile.generalSurgery
    ? `${profile.label}屬九大專科；仍須32小時訓練`
    : "非九大專科；僅限既有30例過渡";
  scopeHighRisk.textContent = profile.highRisk?.length
    ? `僅限法定項目：${profile.highRisk.join("、")}`
    : `${profile.label}原則上不得新施作`;

  qualificationResult.classList.remove("is-scanning");
  void qualificationResult.offsetWidth;
  qualificationResult.classList.add("is-scanning");
  saveQualificationProfile();
};

loadQualificationProfile();
renderQualification();
qualificationForm?.addEventListener("change", renderQualification);

if (regulationClock) {
  const days = getDaysUntil(transitionDeadline);
  regulationClock.textContent = days > 0 ? `距12/31還有 ${days} 天` : "一年期已截止";
}

const complianceInputs = [...document.querySelectorAll("[data-compliance]")];
const complianceProgress = document.querySelector("[data-compliance-progress]");
const progressTrack = document.querySelector("[data-progress-track]");
const progressBar = document.querySelector("[data-progress-bar]");
let completedCompliance = new Set();

try {
  completedCompliance = new Set(JSON.parse(localStorage.getItem("lumina-compliance") || "[]"));
} catch {
  localStorage.removeItem("lumina-compliance");
}

const renderCompliance = () => {
  complianceInputs.forEach((input) => {
    input.checked = completedCompliance.has(input.dataset.compliance);
  });
  const complete = completedCompliance.size;
  const total = complianceInputs.length;
  const percent = total ? (complete / total) * 100 : 0;
  complianceProgress.textContent = `${complete} / ${total} 完成`;
  progressTrack?.setAttribute("aria-valuenow", String(complete));
  progressTrack?.setAttribute("aria-valuemax", String(total));
  if (progressBar) progressBar.style.width = `${percent}%`;
};

complianceInputs.forEach((input) => {
  input.addEventListener("change", () => {
    if (input.checked) completedCompliance.add(input.dataset.compliance);
    else completedCompliance.delete(input.dataset.compliance);
    localStorage.setItem("lumina-compliance", JSON.stringify([...completedCompliance]));
    renderCompliance();
    showToast(input.checked ? "已完成一項合規待辦" : "已重新開啟待辦");
  });
});

renderCompliance();

const noteForm = document.querySelector("[data-note-form]");
const noteInput = document.querySelector("[data-note-input]");
const noteStatus = document.querySelector("[data-note-status]");
const storedNote = localStorage.getItem("lumina-note");

if (storedNote) {
  noteInput.value = storedNote;
  noteStatus.textContent = "已從這台裝置載入";
}

noteInput?.addEventListener("input", () => {
  noteStatus.textContent = "有尚未儲存的變更";
});

noteForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  localStorage.setItem("lumina-note", noteInput.value.trim());
  const now = new Date().toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" });
  noteStatus.textContent = `已於 ${now} 儲存`;
  showToast("筆記已儲存在這台裝置");
});

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

reveals.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
  observer.observe(item);
});

const sectionLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"], .mobile-nav a[href^="#"]')];
const observedSections = [...new Set(sectionLinks.map((link) => document.querySelector(link.hash)).filter(Boolean))];

const setCurrentSection = (sectionId) => {
  sectionLinks.forEach((link) => {
    const isCurrent = link.hash === `#${sectionId}`;
    link.classList.toggle("is-current", isCurrent);
    if (isCurrent) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
};

let sectionFrame;
const updateCurrentSection = () => {
  const readingLine = window.scrollY + Math.min(window.innerHeight * 0.28, 260);
  const currentSection = observedSections
    .filter((section) => section.offsetTop <= readingLine)
    .at(-1);

  if (currentSection) setCurrentSection(currentSection.id);
  else sectionLinks.forEach((link) => {
    link.classList.remove("is-current");
    link.removeAttribute("aria-current");
  });
};

window.addEventListener("scroll", () => {
  window.cancelAnimationFrame(sectionFrame);
  sectionFrame = window.requestAnimationFrame(updateCurrentSection);
}, { passive: true });

window.addEventListener("load", updateCurrentSection);
