const header = document.querySelector("[data-header]");
const menuTrigger = document.querySelector("[data-menu-trigger]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const searchDialog = document.querySelector("[data-search-dialog]");
const searchInput = document.querySelector("[data-search-input]");
const searchResults = document.querySelector("[data-search-results]");
const searchEmpty = document.querySelector("[data-search-empty]");
const searchCount = document.querySelector("[data-search-count]");
const searchInterpretation = document.querySelector("[data-search-interpretation]");
const searchFilters = [...document.querySelectorAll("[data-search-filter]")];
const clearSearchButton = document.querySelector("[data-clear-search]");
const recentSearches = document.querySelector("[data-recent-searches]");
const recentSearchList = document.querySelector("[data-recent-search-list]");
const toast = document.querySelector("[data-toast]");
let toastTimer;

const baseKnowledgeIndex = [
  {
    id: "regulation-guide",
    type: "法規摘要",
    audience: "臨床工作者",
    intents: ["quick", "evidence"],
    readTime: 3,
    title: "特管新法：訓練時數、案例認定與關鍵期限",
    scope: "一次看懂特定處置、美容手術與高風險手術的訓練規則、過渡期限與官方版本。",
    match: "法規、特管、訓練時數與案例認定",
    evidence: "衛福部與醫師全聯會官方來源",
    updatedAt: "2026-08-24",
    href: "#regulation-radar",
    risk: "safety",
    keywords: "法規 特管 合規 醫療法 訓練 32小時 24小時 案例 30例 PGY 過渡 期限 官方 來源",
  },
  {
    id: "qualification-scan",
    type: "資格工具",
    audience: "醫師",
    intents: ["quick", "evidence"],
    readTime: 3,
    title: "依科別切換的個人資格掃描",
    scope: "依部定專科、畢業時間與施作類型，整理可施作範圍、缺口與應查核的期限。",
    match: "科別、畢業時間、施作類型與法定門檻",
    evidence: "法規條文與認可學會資料",
    updatedAt: "2026-08-24",
    href: "#regulation-radar",
    risk: "safety",
    keywords: "家庭醫學科 家醫科 放射診斷科 放射科 專科醫師 資格 可以做 醫美 光電 雷射 電波 超音波 針劑 FUE 手術",
  },
  {
    id: "course-comparison",
    type: "比較入口",
    audience: "所有階段",
    intents: ["compare", "course", "evidence"],
    readTime: 3,
    title: "比較近期課程、資格門檻與特管時數",
    scope: "在同一頁比較日期、地點、對象、費用、報名狀態，以及課程是否明示法定時數。",
    match: "課程、時數、費用、學分與報名期限",
    evidence: "主辦單位原頁與最後查核日",
    updatedAt: "2026-08-24",
    href: "#courses",
    risk: "standard",
    keywords: "比較 課程 特管 時數 學分 費用 價格 報名 期限 線上 實作 年會 workshop 研討會 認證",
  },
  {
    id: "learning-atlas",
    type: "3 分鐘路徑",
    audience: "初學者",
    intents: ["quick"],
    readTime: 3,
    title: "法規、訓練、技術、安全四層學習地圖",
    scope: "先確認法規邊界，再安排訓練、技術與安全的學習順序，避免只收藏零散資料。",
    match: "入門、學習順序與先備知識",
    evidence: "站內已查核內容導覽",
    updatedAt: "2026-08-24",
    href: "#atlas",
    risk: "standard",
    keywords: "零基礎 入門 三分鐘 快速 學習路徑 知識圖譜 法規 課程 技術 解剖 安全 下一步",
  },
  {
    id: "safety-curriculum",
    type: "安全主題",
    audience: "臨床進階",
    intents: ["safety", "quick"],
    readTime: 3,
    title: "把安全與併發症放在新技術之前",
    scope: "從關鍵血管、高風險區域與異常警訊開始，建立停止、辨識與尋求支援的學習順序。",
    match: "安全、風險、併發症與即時影像",
    evidence: "課綱重點與來源導向學習",
    updatedAt: "2026-08-24",
    href: "#curriculum",
    risk: "high",
    keywords: "安全 併發症 風險 血管 栓塞 失明 缺血 異常 警訊 處置 即時影像 超音波 解剖",
  },
  {
    id: "materials-curriculum",
    type: "技術概覽",
    audience: "初學至進階",
    intents: ["quick", "compare"],
    readTime: 3,
    title: "肉毒、玻尿酸與膠原刺激劑的學習入口",
    scope: "先區分肌肉放鬆、容積填充與組織刺激，再連回解剖層次、材料特性與安全主題。",
    match: "針劑材料、作用方式與選擇邏輯",
    evidence: "結構化課綱與學習目標",
    updatedAt: "2026-08-24",
    href: "#curriculum",
    risk: "standard",
    keywords: "肉毒 botox botulinum toxin 玻尿酸 hyaluronic acid HA PLLA PDLLA CaHA 填充劑 膠原刺激劑 線材 針劑",
  },
  {
    id: "video-learning",
    type: "學習路徑",
    audience: "零基礎",
    intents: ["quick"],
    readTime: 3,
    title: "六週零基礎影片學習路徑",
    scope: "依皮膚基礎、光電、能量治療、針劑與安全排序，追蹤進度並為每堂課留下筆記。",
    match: "影片、零基礎與分週學習",
    evidence: "精選影片來源與個人進度",
    updatedAt: "2026-08-24",
    href: "#video-learning",
    risk: "standard",
    keywords: "影片 youtube 零基礎 六週 皮膚 防曬 雷射 電波 音波 肉毒 玻尿酸 安全 學習進度",
  },
  {
    id: "official-source-trace",
    type: "官方來源",
    audience: "臨床工作者",
    intents: ["evidence"],
    readTime: 3,
    title: "官方版本與修正時間軸",
    scope: "回到衛福部、醫師全聯會與認可學會原始公告，分辨頁面更新日、法規版本與實際生效日。",
    match: "官方公告、版本、函釋與更新日期",
    evidence: "第一方官方來源",
    updatedAt: "2026-08-24",
    href: "#source-trace",
    risk: "safety",
    keywords: "官方 來源 證據 文獻 查核 衛福部 醫師全聯會 學會 公告 函文 版本 更新 日期",
  },
  {
    id: "life-os",
    type: "私人決策工具",
    audience: "職涯轉換",
    intents: ["quick", "compare"],
    readTime: 3,
    title: "2031 人生路徑與 90 天實驗",
    scope: "比較診所、醫療 AI、學術、組合職涯與時間富足五條路徑，調整價值權重並追蹤九十天證據。",
    match: "職涯、創業、AI、家庭、健康、財務與時間自主",
    evidence: "個人對話脈絡與情境推演",
    updatedAt: "2026-08-24",
    href: "#life-os",
    risk: "standard",
    keywords: "2031 人生 路徑 職涯 創業 AI 診所 家庭 健康 財務 旅行 生活方式 決策 實驗 physician builder",
  },
];

let knowledgeIndex = [...baseKnowledgeIndex];
let activeSearchFilter = "all";

const searchSynonyms = [
  ["放射科", "放射診斷科 放射科 專科醫師 資格"],
  ["家醫科", "家庭醫學科 家醫科 專科醫師 資格"],
  ["肉毒", "肉毒 肉毒桿菌素 botox botulinum toxin"],
  ["玻尿酸", "玻尿酸 hyaluronic acid HA 填充劑"],
  ["音波", "音波 超音波 HIFU 能量治療"],
  ["電波", "電波 RF 射頻 能量治療"],
  ["比較", "比較 差異 對照 哪個 vs"],
  ["安全", "安全 風險 併發症 警訊 處置"],
  ["課程", "課程 訓練 時數 學分 報名 研討會 workshop"],
  ["法規", "法規 特管 合規 資格 備查 醫療法"],
];

const safeHTML = (value = "") =>
  String(value).replace(/[&<>\"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;" })[character]);

const normalizeSearchText = (value = "") =>
  String(value)
    .normalize("NFKC")
    .toLocaleLowerCase("zh-Hant")
    .replace(/[，。！？、；：,.!?;:()（）/\\|_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getSearchTerms = (query) => {
  const normalized = normalizeSearchText(query);
  const terms = new Set(normalized.split(" ").filter((term) => term.length > 1));
  searchSynonyms.forEach(([trigger, expansion]) => {
    if (normalized.includes(trigger)) {
      normalizeSearchText(expansion).split(" ").forEach((term) => terms.add(term));
    }
  });
  return [...terms];
};

const detectSearchIntent = (query) => {
  const normalized = normalizeSearchText(query);
  if (/比較|差異|哪個|vs/.test(normalized)) return "compare";
  if (/安全|風險|併發症|警訊|處置/.test(normalized)) return "safety";
  if (/課程|訓練|時數|學分|報名|研討會|workshop/.test(normalized)) return "course";
  if (/證據|來源|官方|法規|規定|資格|限制|門檻|可以做|能不能|能做/.test(normalized)) return "evidence";
  return normalized ? "learn" : "all";
};

const intentLabels = {
  all: "探索本站已整理內容",
  learn: "快速了解",
  compare: "比較資料",
  safety: "安全與併發症",
  evidence: "官方來源與法規",
  course: "課程與訓練",
};

const getRecentSearchValues = () => {
  try {
    return JSON.parse(localStorage.getItem("lumina-recent-searches") || "[]");
  } catch {
    localStorage.removeItem("lumina-recent-searches");
    return [];
  }
};

const renderRecentSearches = () => {
  if (!recentSearches || !recentSearchList) return;
  const values = getRecentSearchValues();
  recentSearches.hidden = values.length === 0;
  recentSearchList.innerHTML = values
    .map((value) => `<button type="button" data-search-query="${safeHTML(value)}">${safeHTML(value)}</button>`)
    .join("");
};

const rememberSearch = (query) => {
  const value = query.trim();
  if (value.length < 2) return;
  const values = [value, ...getRecentSearchValues().filter((item) => item !== value)].slice(0, 5);
  localStorage.setItem("lumina-recent-searches", JSON.stringify(values));
  renderRecentSearches();
};

const resultCardTemplate = (item) => `
  <a class="search-result-card" href="${safeHTML(item.href)}" data-search-result>
    <div class="search-result-card__topline">
      <span>${safeHTML(item.type)}</span>
      <span>${safeHTML(item.audience)}</span>
      ${item.risk === "high" ? '<span class="is-risk">安全主題</span>' : ""}
    </div>
    <div class="search-result-card__body">
      <h3>${safeHTML(item.title)}</h3>
      <p>${safeHTML(item.scope)}</p>
      <span class="search-result-card__match">符合：${safeHTML(item.match)}</span>
    </div>
    <div class="search-result-card__footer">
      <span>${safeHTML(item.evidence)}</span>
      <span>最後查核 ${safeHTML(item.updatedAt)}</span>
      <strong>${safeHTML(item.readTime)} 分鐘 <i aria-hidden="true">↘</i></strong>
    </div>
  </a>`;

const renderSearchResults = () => {
  if (!searchResults || !searchInput) return;
  const query = searchInput.value.trim();
  const normalizedQuery = normalizeSearchText(query);
  const compactQuery = normalizedQuery.replace(/\s/g, "");
  const terms = getSearchTerms(query);
  const intent = detectSearchIntent(query);

  const scored = knowledgeIndex
    .filter((item) => activeSearchFilter === "all" || item.intents.includes(activeSearchFilter))
    .map((item, index) => {
      const haystack = normalizeSearchText(`${item.title} ${item.scope} ${item.match} ${item.keywords} ${item.type} ${item.audience}`);
      const compactHaystack = haystack.replace(/\s/g, "");
      let score = query ? 0 : Math.max(0, 20 - index);
      if (compactQuery && compactHaystack.includes(compactQuery)) score += 30;
      terms.forEach((term) => {
        if (haystack.includes(term)) score += term.length >= 4 ? 6 : 3;
      });
      if (intent !== "all" && intent !== "learn" && item.intents.includes(intent)) score += 7;
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);

  searchResults.innerHTML = scored.map(resultCardTemplate).join("");
  searchEmpty.hidden = scored.length !== 0;
  searchCount.textContent = query
    ? `${scored.length} 個符合「${query}」的入口`
    : activeSearchFilter === "all"
      ? "推薦入口"
      : `${scored.length} 個${searchFilters.find((item) => item.dataset.searchFilter === activeSearchFilter)?.textContent || ""}入口`;
  clearSearchButton.hidden = !query && activeSearchFilter === "all";
  searchInterpretation.innerHTML = query
    ? `<span>查詢解讀</span><p>目前依「${safeHTML(intentLabels[intent])}」尋找；結果按關鍵概念、內容範圍與查核完整度排列。</p>`
    : '<span>搜尋提示</span><p>可輸入「放射科可以做醫美嗎」或「比較近期特管課程」。</p>';
};

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

const openSearch = (query = "") => {
  if (!searchDialog.open) searchDialog.showModal();
  if (query) searchInput.value = query;
  renderSearchResults();
  renderRecentSearches();
  window.setTimeout(() => searchInput.focus(), 30);
};

const closeSearch = () => {
  if (searchDialog.open) searchDialog.close();
};

document.querySelectorAll("[data-open-search]").forEach((button) => {
  button.addEventListener("click", () => openSearch());
});

document.querySelector("[data-close-search]")?.addEventListener("click", closeSearch);

searchDialog?.addEventListener("click", (event) => {
  if (event.target === searchDialog) closeSearch();
});

document.addEventListener("keydown", (event) => {
  const target = event.target;
  const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
  if (event.key === "/" && !isTyping) {
    event.preventDefault();
    openSearch();
  }
});

searchInput?.addEventListener("input", renderSearchResults);

searchInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    rememberSearch(searchInput.value);
    renderSearchResults();
  }
});

searchFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    activeSearchFilter = filter.dataset.searchFilter;
    searchFilters.forEach((item) => {
      const isActive = item === filter;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    renderSearchResults();
  });
});

clearSearchButton?.addEventListener("click", () => {
  searchInput.value = "";
  activeSearchFilter = "all";
  searchFilters.forEach((item) => {
    const isActive = item.dataset.searchFilter === "all";
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });
  renderSearchResults();
  searchInput.focus();
});

document.addEventListener("click", (event) => {
  const queryButton = event.target.closest("[data-search-query]");
  if (queryButton) {
    openSearch(queryButton.dataset.searchQuery);
    rememberSearch(queryButton.dataset.searchQuery);
  }

  const result = event.target.closest("[data-search-result]");
  if (result) {
    rememberSearch(searchInput.value);
    closeSearch();
  }
});

renderSearchResults();
renderRecentSearches();

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
const courseTimeline = document.querySelector("[data-course-timeline]");
const timelineTrack = document.querySelector("[data-timeline-track]");
const timelineViewport = document.querySelector("[data-timeline-viewport]");
const timelineSummary = document.querySelector("[data-timeline-summary]");
const timelineRange = document.querySelector("[data-timeline-range]");
const verifiedCount = document.querySelector("[data-verified-count]");
const upcomingEvents = document.querySelector("[data-upcoming-events]");

const escapeHTML = (value = "") =>
  String(value).replace(
    /[&<>"]/g,
    (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character],
  );

const fallbackVideoLessons = [
  {
    id: "zRjTkEIjEM8",
    week: 1,
    category: "foundation",
    categoryLabel: "皮膚基礎",
    title: "探索皮膚的奧秘",
    source: "美肌教主 DR. 王朝輝",
    duration: "03:03",
    objective: "先建立表皮、真皮與皮下組織的基本地圖，之後才知道不同療程大致作用在哪一層。",
    takeaway: "表皮、真皮與皮下組織各自扮演什麼角色？",
  },
  {
    id: "Zfv5MbPIgFA",
    week: 1,
    category: "foundation",
    categoryLabel: "皮膚基礎",
    title: "什麼是皮膚障壁功能？",
    source: "美上美皮膚科・莊盈彥醫師",
    duration: "07:31",
    objective: "理解皮膚屏障、保濕與刺激反應，建立先處理皮膚健康、再考慮醫美療程的順序。",
    takeaway: "皮膚屏障受損時，為什麼不適合急著增加刺激性療程？",
  },
  {
    id: "9sBS8C-R6gs",
    week: 2,
    category: "foundation",
    categoryLabel: "保養與防曬",
    title: "如何閱讀防曬標示",
    source: "American Academy of Dermatology",
    duration: "02:23",
    objective: "學會從標示理解廣效防護、防曬係數與使用情境；影片為英文，可開啟 YouTube 字幕。",
    takeaway: "一款防曬產品的標示，至少應該看懂哪些資訊？",
  },
  {
    id: "pLHo2b4B108",
    week: 2,
    category: "safety",
    categoryLabel: "廣告判讀",
    title: "保養品話術與迷思破解",
    source: "志祺七七 × 邱品齊醫師",
    duration: "21:11",
    objective: "練習辨認敏感肌、淡斑、抗老等常見宣稱，分開產品行銷語言與可以驗證的效果。",
    takeaway: "影片中的哪一種宣稱需要更多證據才能成立？",
  },
  {
    id: "jIkNbX37wBQ",
    week: 3,
    category: "energy",
    categoryLabel: "療程總覽",
    title: "雷射、肉毒、電波、音波一次搞懂",
    source: "蒼藍鴿的醫學天地",
    duration: "10:17",
    objective: "先從全貌區分光電、能量與注射治療，避免把不同機轉的療程放在同一個價格表比較。",
    takeaway: "色素、肌肉、容量流失與鬆弛，各自對應哪一類治療邏輯？",
  },
  {
    id: "LR6g-xYnJlU",
    week: 3,
    category: "safety",
    categoryLabel: "術後照護",
    title: "雷射術後照護七大問題",
    source: "ME Media 美醫誌・鄒承軒醫師",
    duration: "11:04",
    objective: "理解雷射後的清潔、防曬、傷口照護與異常警訊，知道哪些狀況需要回診。",
    takeaway: "正常恢復反應與需要立即聯絡醫療院所的警訊有何不同？",
  },
  {
    id: "CbGUqnc4jf8",
    week: 4,
    category: "energy",
    categoryLabel: "音波與電波",
    title: "電波和音波有什麼不同？",
    source: "美上美皮膚科・莊盈彥醫師",
    duration: "10:29",
    objective: "比較兩類能量的作用方式、深度與預期限制，不用品牌名稱代替治療評估。",
    takeaway: "電波與音波的主要差異是什麼？哪些結構問題不是它們能解決的？",
  },
  {
    id: "mD1GRDPzZdA",
    week: 4,
    category: "energy",
    categoryLabel: "埋線拉提",
    title: "想對抗鬆弛，不可不知的埋線",
    source: "中華民國美容醫學醫學會・曾繁聞醫師",
    duration: "04:15",
    objective: "認識埋線的機械性支撐、適用限制與常見風險，和非侵入性能量療程分開比較。",
    takeaway: "埋線、電波與音波在機轉和可逆性上有什麼不同？",
  },
  {
    id: "Gj-FpR9IPcY",
    week: 5,
    category: "injection",
    categoryLabel: "肉毒桿菌素",
    title: "肉毒桿菌素必備知識",
    source: "MedPartner 美的好朋友",
    duration: "04:51",
    objective: "理解肉毒桿菌素是暫時降低肌肉收縮，不是填補凹陷，也不是所有皺紋的通用答案。",
    takeaway: "動態紋和靜態紋為什麼不能用同一套思路處理？",
  },
  {
    id: "wPkwOUuwEks",
    week: 5,
    category: "injection",
    categoryLabel: "填充與刺激劑",
    title: "玻尿酸、肉毒與膠原刺激劑比較",
    source: "ME Media 美醫誌・邱軍棠醫師",
    duration: "09:27",
    objective: "比較肌肉放鬆、立即填充與膠原刺激三種不同目的，建立材料選擇的基本語言。",
    takeaway: "玻尿酸、肉毒與膠原刺激劑分別改變了什麼？",
  },
  {
    id: "SLTmAvB6nlo",
    week: 5,
    category: "safety",
    categoryLabel: "注射安全",
    title: "玻尿酸注射與失明風險",
    source: "ME Media 美醫誌・王正坤醫師",
    duration: "02:31",
    objective: "認識填充劑血管栓塞的嚴重性與緊急警訊；風險很低不等於沒有風險。",
    takeaway: "注射後出現哪些視覺或皮膚變化，不能在家等待觀察？",
  },
  {
    id: "bqcVD3jaaqc",
    week: 6,
    category: "safety",
    categoryLabel: "診所選擇",
    title: "如何選擇安全的醫美診所",
    source: "財團法人醫院評鑑暨醫療品質策進會",
    duration: "04:27",
    objective: "學會核對機構、醫師、設備、麻醉與緊急後送資訊，把安全條件放在價格之前。",
    takeaway: "預約療程前，至少要向醫師或院所確認哪五件事？",
  },
];

let videoLessons = fallbackVideoLessons;

const videoPlaylist = document.querySelector("[data-video-playlist]");
const videoIframe = document.querySelector("[data-video-iframe]");
const videoWeek = document.querySelector("[data-video-week]");
const videoCategory = document.querySelector("[data-video-category]");
const videoDuration = document.querySelector("[data-video-duration]");
const videoSource = document.querySelector("[data-video-source]");
const videoTitle = document.querySelector("[data-video-title]");
const videoObjective = document.querySelector("[data-video-objective]");
const videoTakeaway = document.querySelector("[data-video-takeaway]");
const videoYoutube = document.querySelector("[data-video-youtube]");
const videoCompleteButton = document.querySelector("[data-video-complete]");
const videoCompletedCount = document.querySelector("[data-video-completed]");
const videoTotal = document.querySelector("[data-video-total]");
const videoProgressTrack = document.querySelector("[data-video-progress-track]");
const videoProgressBar = document.querySelector("[data-video-progress-bar]");
const videoProgressCopy = document.querySelector("[data-video-progress-copy]");
const videoFreshness = document.querySelector("[data-video-freshness]");
const videoEmpty = document.querySelector("[data-video-empty]");
const videoFilters = [...document.querySelectorAll("[data-video-filter]")];
const videoNoteForm = document.querySelector("[data-video-note-form]");
const videoNoteInput = document.querySelector("[data-video-note-input]");
const videoNoteStatus = document.querySelector("[data-video-note-status]");
let activeVideoFilter = "all";
let completedVideos = new Set();
let videoNotes = {};

try {
  completedVideos = new Set(JSON.parse(localStorage.getItem("lumina-video-completed") || "[]"));
  videoNotes = JSON.parse(localStorage.getItem("lumina-video-notes") || "{}") || {};
} catch {
  localStorage.removeItem("lumina-video-completed");
  localStorage.removeItem("lumina-video-notes");
}

const storedVideoId = localStorage.getItem("lumina-video-current");
let activeVideoId = videoLessons.some((lesson) => lesson.id === storedVideoId)
  ? storedVideoId
  : videoLessons[0].id;

const getActiveVideo = () => videoLessons.find((lesson) => lesson.id === activeVideoId) || videoLessons[0];

const videoMatchesFilter = (lesson) => {
  if (activeVideoFilter === "all") return true;
  if (activeVideoFilter === "pending") return !completedVideos.has(lesson.id);
  return lesson.category === activeVideoFilter;
};

const renderVideoProgress = () => {
  const complete = videoLessons.filter((lesson) => completedVideos.has(lesson.id)).length;
  const total = videoLessons.length;
  const percent = total ? Math.round((complete / total) * 100) : 0;
  if (videoCompletedCount) videoCompletedCount.textContent = String(complete);
  if (videoTotal) videoTotal.textContent = String(total);
  if (videoProgressTrack) {
    videoProgressTrack.setAttribute("aria-valuenow", String(complete));
    videoProgressTrack.setAttribute("aria-valuemax", String(total));
  }
  if (videoProgressBar) videoProgressBar.style.width = `${percent}%`;
  if (videoProgressCopy) {
    videoProgressCopy.textContent = complete === total
      ? "六週核心課程已完成。接下來用諮詢問題與官方資料持續交叉查證。"
      : complete === 0
        ? "從第一堂開始，建立自己的醫美判讀框架。"
        : `已完成 ${percent}%，下一堂繼續沿著六週路徑前進。`;
  }
};

const videoPlaylistItemTemplate = (lesson, index) => {
  const isActive = lesson.id === activeVideoId;
  const isComplete = completedVideos.has(lesson.id);
  return `
    <li class="video-lesson${isActive ? " is-active" : ""}${isComplete ? " is-complete" : ""}">
      <button
        type="button"
        data-video-id="${escapeHTML(lesson.id)}"
        ${isActive ? 'aria-current="true"' : ""}
        aria-label="第 ${lesson.week} 週，${escapeHTML(lesson.title)}，${isComplete ? "已完成" : "未完成"}"
      >
        <span class="video-lesson__index">${String(index + 1).padStart(2, "0")}</span>
        <span class="video-lesson__content">
          <small>第 ${lesson.week} 週・${escapeHTML(lesson.categoryLabel)}</small>
          <strong>${escapeHTML(lesson.title)}</strong>
          <span>${escapeHTML(lesson.source)}・${escapeHTML(lesson.duration)}</span>
        </span>
        <span class="video-lesson__status" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" /></svg>
        </span>
      </button>
    </li>`;
};

const renderVideoPlaylist = () => {
  if (!videoPlaylist) return;
  const visibleLessons = videoLessons.filter(videoMatchesFilter);
  videoPlaylist.innerHTML = visibleLessons
    .map((lesson) => videoPlaylistItemTemplate(lesson, videoLessons.indexOf(lesson)))
    .join("");
  if (videoEmpty) videoEmpty.hidden = visibleLessons.length !== 0;

  videoPlaylist.querySelectorAll("[data-video-id]").forEach((button) => {
    button.addEventListener("click", () => {
      activeVideoId = button.dataset.videoId;
      localStorage.setItem("lumina-video-current", activeVideoId);
      renderActiveVideo();
      renderVideoPlaylist();
    });
  });
};

const renderActiveVideo = () => {
  const lesson = getActiveVideo();
  const isComplete = completedVideos.has(lesson.id);
  const embedUrl = `https://www.youtube-nocookie.com/embed/${lesson.id}?rel=0`;
  if (videoIframe && videoIframe.src !== embedUrl) {
    videoIframe.src = embedUrl;
    videoIframe.title = `${lesson.title}｜影片學習播放器`;
  }
  if (videoWeek) videoWeek.textContent = `第 ${lesson.week} 週`;
  if (videoCategory) videoCategory.textContent = lesson.categoryLabel;
  if (videoDuration) videoDuration.textContent = lesson.duration;
  if (videoSource) videoSource.textContent = lesson.source;
  if (videoTitle) videoTitle.textContent = lesson.title;
  if (videoObjective) videoObjective.textContent = lesson.objective;
  if (videoTakeaway) videoTakeaway.textContent = lesson.takeaway;
  if (videoYoutube) videoYoutube.href = `https://www.youtube.com/watch?v=${lesson.id}`;
  if (videoCompleteButton) {
    videoCompleteButton.classList.toggle("is-complete", isComplete);
    videoCompleteButton.setAttribute("aria-pressed", String(isComplete));
    videoCompleteButton.querySelector("span").textContent = isComplete ? "已完成這堂" : "標示完成";
  }
  if (videoNoteInput) videoNoteInput.value = videoNotes[lesson.id] || "";
  if (videoNoteStatus) {
    videoNoteStatus.textContent = videoNotes[lesson.id] ? "已載入這堂課的筆記" : "筆記會依影片分別儲存";
  }
};

videoCompleteButton?.addEventListener("click", () => {
  const lesson = getActiveVideo();
  if (completedVideos.has(lesson.id)) {
    completedVideos.delete(lesson.id);
    showToast("已將這堂課改為未完成");
  } else {
    completedVideos.add(lesson.id);
    showToast("完成進度已儲存");
  }
  localStorage.setItem("lumina-video-completed", JSON.stringify([...completedVideos]));
  renderVideoProgress();
  renderActiveVideo();
  renderVideoPlaylist();
});

videoFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    activeVideoFilter = filter.dataset.videoFilter;
    videoFilters.forEach((item) => {
      const isActive = item === filter;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    const firstVisibleLesson = videoLessons.find(videoMatchesFilter);
    if (firstVisibleLesson && !videoMatchesFilter(getActiveVideo())) {
      activeVideoId = firstVisibleLesson.id;
      localStorage.setItem("lumina-video-current", activeVideoId);
      renderActiveVideo();
    }
    renderVideoPlaylist();
  });
});

videoNoteInput?.addEventListener("input", () => {
  if (videoNoteStatus) videoNoteStatus.textContent = "有尚未儲存的變更";
});

videoNoteForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const lesson = getActiveVideo();
  const note = videoNoteInput.value.trim();
  if (note) videoNotes[lesson.id] = note;
  else delete videoNotes[lesson.id];
  localStorage.setItem("lumina-video-notes", JSON.stringify(videoNotes));
  const now = new Date().toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" });
  if (videoNoteStatus) videoNoteStatus.textContent = note ? `已於 ${now} 儲存` : "已清除這堂課的筆記";
  showToast(note ? "這堂課的筆記已儲存" : "這堂課的筆記已清除");
});

const loadVideoLessons = async () => {
  try {
    const response = await fetch("./data/video-learning.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (!Array.isArray(payload.lessons) || payload.lessons.length === 0) {
      throw new Error("影片課程資料為空");
    }

    videoLessons = payload.lessons;
    const storedId = localStorage.getItem("lumina-video-current");
    activeVideoId = videoLessons.some((lesson) => lesson.id === storedId)
      ? storedId
      : videoLessons[0].id;
    if (videoFreshness) {
      const updatedAt = new Date(payload.lastUpdated).toLocaleString("zh-TW", {
        timeZone: "Asia/Taipei",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      videoFreshness.textContent = `最後查核 ${updatedAt}・${payload.sourceCount} 個影片來源・${payload.lessons.length} 堂課`;
    }
  } catch (error) {
    console.error("影片課程載入失敗，改用內建備援資料", error);
    videoLessons = fallbackVideoLessons;
    if (videoFreshness) videoFreshness.textContent = "最新資料暫時無法載入，現正使用備援課程清單";
  }

  renderVideoProgress();
  renderActiveVideo();
  renderVideoPlaylist();
};

loadVideoLessons();

const parseTaiwanDate = (date) => new Date(`${date}T12:00:00+08:00`);
const formatShortDate = (date) =>
  parseTaiwanDate(date).toLocaleDateString("zh-TW", { month: "2-digit", day: "2-digit" });
const formatFullDate = (date) =>
  parseTaiwanDate(date).toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" });

const formatDateRange = (startDate, endDate) => {
  if (startDate === endDate) return formatFullDate(startDate);
  return `${formatFullDate(startDate)}–${formatShortDate(endDate)}`;
};

const formatTimelineDate = (startDate, endDate) => {
  const start = formatShortDate(startDate);
  if (startDate === endDate) return start;
  return `${start}–${formatShortDate(endDate)}`;
};

const creditStatusLabels = {
  confirmed: "已明示學分／時數",
  expected: "預計／待核定",
  unverified: "報名前確認",
};

const courseFormatLabels = {
  online: "線上",
  practice: "實作",
  conference: "年會／研討會",
};

const courseTimelineItemTemplate = (course, index, today) => {
  const start = parseTaiwanDate(course.startDate);
  const end = parseTaiwanDate(course.endDate);
  const timing = end < today ? "past" : start <= today ? "current" : "upcoming";
  const format = course.formats
    .filter((item) => courseFormatLabels[item])
    .map((item) => courseFormatLabels[item])
    .join("＋");

  return `
    <li class="course-timeline__item is-${timing}" data-credit-status="${escapeHTML(course.creditStatus)}">
      <div class="course-timeline__node" aria-hidden="true"><span>${index + 1}</span></div>
      <article class="timeline-course-card">
        <div class="timeline-course-card__topline">
          <time datetime="${escapeHTML(course.startDate)}">${escapeHTML(formatTimelineDate(course.startDate, course.endDate))}</time>
          <span class="timeline-credit timeline-credit--${escapeHTML(course.creditStatus)}">${escapeHTML(creditStatusLabels[course.creditStatus])}</span>
        </div>
        <h4>${escapeHTML(course.title)}</h4>
        <p class="timeline-course-card__status">${escapeHTML(course.statusLabel)}</p>
        <dl>
          <div><dt>形式</dt><dd>${escapeHTML(format || "依主辦公告")}</dd></div>
          <div><dt>地點</dt><dd>${escapeHTML(course.location)}</dd></div>
          <div><dt>學分／時數</dt><dd>${escapeHTML(course.regulatoryHours)}</dd></div>
        </dl>
        <a href="#course-${escapeHTML(course.id)}">查看完整資訊 <span aria-hidden="true">↓</span></a>
      </article>
    </li>`;
};

const renderCourseTimeline = (courses) => {
  if (!courseTimeline || !timelineTrack) return;

  const sortedCourses = [...courses].sort((a, b) =>
    a.startDate.localeCompare(b.startDate) || a.endDate.localeCompare(b.endDate),
  );

  if (sortedCourses.length === 0) {
    timelineTrack.innerHTML = '<li class="course-timeline__loading">目前沒有可排列的課程。</li>';
    timelineSummary.textContent = "尚無課程資料";
    timelineRange.textContent = "新增課程後會自動出現在這裡";
    courseTimeline.setAttribute("aria-busy", "false");
    return;
  }

  const taiwanToday = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const today = parseTaiwanDate(taiwanToday);
  const firstStart = parseTaiwanDate(sortedCourses[0].startDate);
  const lastStart = parseTaiwanDate(sortedCourses.at(-1).startDate);
  const totalSpan = Math.max(1, lastStart - firstStart);
  const dateProgress = Math.min(1, Math.max(0, (today - firstStart) / totalSpan));
  const timelineEdge = 100 / (sortedCourses.length * 2);
  const progressPosition = timelineEdge + dateProgress * (100 - timelineEdge * 2);
  const nextCourse = sortedCourses.find((course) => parseTaiwanDate(course.startDate) >= today);
  const longestEnd = sortedCourses.reduce(
    (latest, course) => (course.endDate > latest ? course.endDate : latest),
    sortedCourses[0].endDate,
  );

  const courseItems = sortedCourses
    .map((course, index) => courseTimelineItemTemplate(course, index, today))
    .join("");
  timelineTrack.innerHTML = `
    <li class="course-timeline__today" aria-label="今天 ${escapeHTML(formatShortDate(taiwanToday))}">
      <span>今天</span><time datetime="${escapeHTML(taiwanToday)}">${escapeHTML(formatShortDate(taiwanToday))}</time>
    </li>
    ${courseItems}`;
  timelineTrack.style.setProperty("--timeline-count", sortedCourses.length);
  timelineTrack.style.setProperty("--timeline-edge", `${timelineEdge}%`);
  timelineTrack.style.setProperty("--timeline-progress", `${progressPosition}%`);
  timelineTrack.style.setProperty("--timeline-progress-width", `${Math.max(0, progressPosition - timelineEdge)}%`);

  if (nextCourse) {
    const daysUntil = Math.max(0, Math.ceil((parseTaiwanDate(nextCourse.startDate) - today) / 86_400_000));
    const timingLabel = daysUntil === 0 ? "今天" : `${daysUntil} 天後`;
    timelineSummary.textContent = `下一站 ${formatShortDate(nextCourse.startDate)}・${nextCourse.title}（${timingLabel}）`;
  } else {
    timelineSummary.textContent = "目前列表中的課程皆已開始，請留意下一次資料更新";
  }

  const startRange = formatFullDate(sortedCourses[0].startDate);
  const finalStart = formatFullDate(sortedCourses.at(-1).startDate);
  const extendedRange = longestEnd > sortedCourses.at(-1).startDate
    ? `・最長課程開放至 ${formatFullDate(longestEnd)}`
    : "";
  timelineRange.textContent = `開課日 ${startRange}—${finalStart}・共 ${sortedCourses.length} 門${extendedRange}`;
  courseTimeline.setAttribute("aria-busy", "false");

  if (timelineViewport) timelineViewport.scrollLeft = 0;
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
    <article id="course-${escapeHTML(course.id)}" class="course-card course-card--${escapeHTML(course.status)}" data-course data-format="${escapeHTML(course.formats.join(" "))}" data-search-item data-keywords="${escapeHTML([course.title, course.organizer, ...course.tags].join(" "))}">
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

const upcomingEventTemplate = (course) => {
  const dateLabel = formatDateRange(course.startDate, course.endDate).replaceAll("/", ".");
  return `
    <a class="upcoming-event" href="#course-${escapeHTML(course.id)}">
      <time datetime="${escapeHTML(course.startDate)}">${escapeHTML(dateLabel)}</time>
      <span class="upcoming-event__status">${escapeHTML(course.statusLabel)}</span>
      <strong>${escapeHTML(course.title)}</strong>
      <span class="upcoming-event__arrow" aria-hidden="true">↘</span>
    </a>`;
};

const updateUpcomingEvents = (courses) => {
  const now = new Date();
  const upcoming = courses
    .filter((course) => course.startDate && parseTaiwanDate(course.startDate) >= now)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 5);

  if (!upcomingEvents) return;

  if (!upcoming.length) {
    upcomingEvents.innerHTML = '<p class="upcoming-events__loading">目前沒有已核實的近期活動，請查看完整課程情報。</p>';
    return;
  }

  upcomingEvents.innerHTML = upcoming.map(upcomingEventTemplate).join("");
};

const registerCourseSearchItems = (courses) => {
  const courseItems = courses.map((course) => ({
    id: `search-course-${course.id}`,
    type: "近期課程",
    audience: course.audience,
    intents: ["course"],
    readTime: 3,
    title: course.title,
    scope: course.summary,
    match: `${course.location}、${course.regulatoryHours}、${course.statusLabel}`,
    evidence: course.verificationLabel,
    updatedAt: course.checkedAt,
    href: `#course-${course.id}`,
    risk: course.creditStatus === "unverified" ? "safety" : "standard",
    keywords: [
      course.organizer,
      course.location,
      course.audience,
      course.regulatoryHours,
      course.price,
      course.statusLabel,
      ...course.tags,
      ...course.formats,
    ].join(" "),
  }));
  knowledgeIndex = [...baseKnowledgeIndex, ...courseItems];
  renderSearchResults();
};

const loadCourseIntelligence = async () => {
  try {
    const response = await fetch("./data/course-intelligence.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    courseFeed.innerHTML = payload.courses.map(courseCardTemplate).join("");
    courseFeed.setAttribute("aria-busy", "false");
    courseFreshness.textContent = `最後查核 ${new Date(payload.lastUpdated).toLocaleString("zh-TW", { timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}・${payload.sourceCount} 個來源・${payload.courses.length} 門課`;
    verifiedCount.textContent = `${payload.courses.length} 門課已查核`;
    wireSaveButtons(courseFeed);
    applyCourseFilter();
    renderCourseTimeline(payload.courses);
    updateUpcomingEvents(payload.courses);
    registerCourseSearchItems(payload.courses);
  } catch (error) {
    console.error("課程情報載入失敗", error);
    courseFeed.hidden = true;
    courseError.hidden = false;
    courseFreshness.textContent = "課程資料暫時無法載入";
    if (courseTimeline) courseTimeline.hidden = true;
    verifiedCount.textContent = "查核資料載入失敗";
    if (upcomingEvents) {
      upcomingEvents.innerHTML = '<p class="upcoming-events__loading">無法讀取近期活動，請稍後再試。</p>';
    }
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

const lifeOsConsole = document.querySelector("[data-life-os]");
const lifeOsError = document.querySelector("[data-life-error]");
const lifeThesis = document.querySelector("[data-life-thesis]");
const lifePathTabs = document.querySelector("[data-life-path-tabs]");
const lifePathDetail = document.querySelector("[data-life-path-detail]");
const lifeValuesForm = document.querySelector("[data-life-values]");
const lifeRanking = document.querySelector("[data-life-ranking]");
const lifeRankingNote = document.querySelector("[data-life-ranking-note]");
const lifeExperiments = document.querySelector("[data-life-experiments]");
const lifeStopList = document.querySelector("[data-life-stop-list]");
const lifeCompleted = document.querySelector("[data-life-completed]");
const lifeTotal = document.querySelector("[data-life-total]");
const lifeProgressTrack = document.querySelector("[data-life-progress-track]");
const lifeProgressBar = document.querySelector("[data-life-progress-bar]");
const lifeUpdated = document.querySelector("[data-life-updated]");
const lifeResetButton = document.querySelector("[data-life-reset]");

let lifeOsData;
let activeLifePathId = "portfolio";
let lifeWeights = {};
let completedLifeExperiments = new Set();

const parseLifeStorage = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
};

const calculateLifeScores = () => {
  if (!lifeOsData) return [];
  const totalWeight = lifeOsData.values.reduce((sum, value) => sum + Number(lifeWeights[value.id] || 0), 0);
  return lifeOsData.paths.map((path, order) => {
    if (!totalWeight) return { path, order, score: null };
    const weightedScore = lifeOsData.values.reduce(
      (sum, value) => sum + Number(lifeWeights[value.id] || 0) * Number(path.dimensions[value.id] || 0),
      0,
    );
    return { path, order, score: Math.round((weightedScore / (totalWeight * 5)) * 100) };
  });
};

const renderLifePathTabs = () => {
  if (!lifePathTabs || !lifeOsData) return;
  const scores = new Map(calculateLifeScores().map(({ path, score }) => [path.id, score]));
  lifePathTabs.innerHTML = lifeOsData.paths
    .map((path) => {
      const isActive = path.id === activeLifePathId;
      const score = scores.get(path.id);
      return `
        <button
          class="life-path-tab${isActive ? " is-active" : ""}"
          id="life-path-tab-${safeHTML(path.id)}"
          type="button"
          role="tab"
          aria-selected="${isActive}"
          aria-controls="life-path-detail"
          tabindex="${isActive ? "0" : "-1"}"
          data-life-path="${safeHTML(path.id)}"
        >
          <span class="life-path-tab__code">${safeHTML(path.code)}</span>
          <span class="life-path-tab__title">${safeHTML(path.shortTitle)}</span>
          <span class="life-path-tab__score">${score === null ? "—" : `${score}`}</span>
        </button>`;
    })
    .join("");
};

const renderLifeList = (selector, values) => {
  const element = document.querySelector(selector);
  if (!element) return;
  element.innerHTML = values.map((value) => `<li>${safeHTML(value)}</li>`).join("");
};

const renderLifePath = () => {
  if (!lifeOsData || !lifePathDetail) return;
  const path = lifeOsData.paths.find((item) => item.id === activeLifePathId) || lifeOsData.paths[0];
  activeLifePathId = path.id;
  localStorage.setItem("lumina-life-path", activeLifePathId);
  lifePathDetail.setAttribute("aria-labelledby", `life-path-tab-${path.id}`);

  const textBindings = [
    ["[data-life-code]", path.code],
    ["[data-life-short-title]", path.shortTitle],
    ["[data-life-title]", path.title],
    ["[data-life-tagline]", path.tagline],
    ["[data-life-hours]", path.weeklyHours],
    ["[data-life-income]", path.incomeShape],
    ["[data-life-certainty]", path.certainty],
    ["[data-life-reversibility]", path.reversibility],
    ["[data-life-daily]", path.dailyLife],
    ["[data-life-sacrifice]", path.sacrifice],
  ];
  textBindings.forEach(([selector, value]) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  });

  const weekShape = document.querySelector("[data-life-week-shape]");
  if (weekShape) {
    weekShape.innerHTML = path.weekShape
      .map((item) => `<div><strong>${safeHTML(item.label)}</strong><small>${safeHTML(item.value)}</small></div>`)
      .join("");
  }

  const roadmap = document.querySelector("[data-life-roadmap]");
  if (roadmap) {
    roadmap.innerHTML = path.roadmap
      .map((item) => `<li><strong>${safeHTML(item.year)}</strong><p>${safeHTML(item.text)}</p></li>`)
      .join("");
  }

  renderLifeList("[data-life-reversible]", path.reversible);
  renderLifeList("[data-life-irreversible]", path.irreversible);
  renderLifeList("[data-life-signals]", path.switchSignals);
  renderLifePathTabs();
};

const renderLifeValues = () => {
  if (!lifeValuesForm || !lifeOsData) return;
  lifeValuesForm.innerHTML = lifeOsData.values
    .map((value) => `
      <div class="life-value-control">
        <label for="life-value-${safeHTML(value.id)}">
          <span>${safeHTML(value.label)}</span>
          <output for="life-value-${safeHTML(value.id)}" data-life-value-output="${safeHTML(value.id)}">${Number(lifeWeights[value.id] || 0)}</output>
        </label>
        <p>${safeHTML(value.description)}</p>
        <input
          id="life-value-${safeHTML(value.id)}"
          type="range"
          min="0"
          max="5"
          step="1"
          value="${Number(lifeWeights[value.id] || 0)}"
          aria-label="${safeHTML(value.label)}權重"
          data-life-value="${safeHTML(value.id)}"
        />
      </div>`)
    .join("");
};

const renderLifeRanking = () => {
  if (!lifeRanking || !lifeOsData) return;
  const scores = calculateLifeScores();
  const hasWeights = scores.some(({ score }) => score !== null);
  const ranked = [...scores].sort((a, b) => {
    if (a.score === null || b.score === null) return a.order - b.order;
    return b.score - a.score || a.order - b.order;
  });

  lifeRanking.innerHTML = ranked
    .map(({ path, score }, index) => `
      <li>
        <span>${String(index + 1).padStart(2, "0")}</span>
        <div>
          <strong>${safeHTML(path.shortTitle)}</strong>
          <span class="life-ranking__track"><i style="width:${score === null ? 0 : score}%"></i></span>
        </div>
        <b>${score === null ? "—" : score}</b>
      </li>`)
    .join("");

  if (lifeRankingNote) {
    lifeRankingNote.textContent = hasWeights
      ? "分數只反映你設定的價值，不代表客觀最佳解。"
      : "請至少提高一項權重，系統才會開始比較。";
  }
  renderLifePathTabs();
};

const renderLifeExperimentProgress = () => {
  if (!lifeOsData) return;
  const validIds = new Set(lifeOsData.experiments.map((experiment) => experiment.id));
  completedLifeExperiments = new Set([...completedLifeExperiments].filter((id) => validIds.has(id)));
  const complete = completedLifeExperiments.size;
  const total = lifeOsData.experiments.length;
  const percent = total ? (complete / total) * 100 : 0;
  if (lifeCompleted) lifeCompleted.textContent = complete;
  if (lifeTotal) lifeTotal.textContent = total;
  lifeProgressTrack?.setAttribute("aria-valuenow", String(complete));
  lifeProgressTrack?.setAttribute("aria-valuemax", String(total));
  if (lifeProgressBar) lifeProgressBar.style.width = `${percent}%`;
};

const renderLifeExperiments = () => {
  if (!lifeExperiments || !lifeOsData) return;
  lifeExperiments.innerHTML = lifeOsData.experiments
    .map((experiment) => `
      <article class="life-experiment-item">
        <input
          id="life-experiment-${safeHTML(experiment.id)}"
          type="checkbox"
          data-life-experiment="${safeHTML(experiment.id)}"
          ${completedLifeExperiments.has(experiment.id) ? "checked" : ""}
        />
        <label for="life-experiment-${safeHTML(experiment.id)}">
          <span>${safeHTML(experiment.phase)}</span>
          <h4>${safeHTML(experiment.title)}</h4>
          <p>${safeHTML(experiment.description)}</p>
          <small>完成證據 · ${safeHTML(experiment.proof)}</small>
        </label>
      </article>`)
    .join("");
  renderLifeExperimentProgress();
};

const initializeLifeOs = async () => {
  if (!lifeOsConsole) return;
  try {
    const response = await fetch("./data/life-os.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Life OS data request failed: ${response.status}`);
    lifeOsData = await response.json();

    const storedPath = localStorage.getItem("lumina-life-path");
    if (lifeOsData.paths.some((path) => path.id === storedPath)) activeLifePathId = storedPath;

    const storedWeights = parseLifeStorage("lumina-life-values", {});
    lifeWeights = Object.fromEntries(
      lifeOsData.values.map((value) => {
        const storedValue = Number(storedWeights[value.id]);
        const weight = Number.isFinite(storedValue) && storedValue >= 0 && storedValue <= 5
          ? storedValue
          : value.defaultWeight;
        return [value.id, weight];
      }),
    );
    completedLifeExperiments = new Set(parseLifeStorage("lumina-life-experiments", []));

    if (lifeThesis) lifeThesis.textContent = lifeOsData.thesis;
    if (lifeUpdated) lifeUpdated.textContent = `資料版本 ${lifeOsData.updatedAt.replaceAll("-", "/")}`;
    if (lifeStopList) lifeStopList.innerHTML = lifeOsData.stopList.map((item) => `<li>${safeHTML(item)}</li>`).join("");

    renderLifeValues();
    renderLifeRanking();
    renderLifePath();
    renderLifeExperiments();
    lifeOsConsole.setAttribute("aria-busy", "false");
  } catch (error) {
    console.error(error);
    lifeOsConsole.setAttribute("aria-busy", "false");
    if (lifeOsError) lifeOsError.hidden = false;
  }
};

lifePathTabs?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-life-path]");
  if (!button || !lifeOsData) return;
  activeLifePathId = button.dataset.lifePath;
  renderLifePath();
});

lifePathTabs?.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
  const tabs = [...lifePathTabs.querySelectorAll("[data-life-path]")];
  const currentIndex = tabs.findIndex((tab) => tab.dataset.lifePath === activeLifePathId);
  let nextIndex = currentIndex;
  if (["ArrowRight", "ArrowDown"].includes(event.key)) nextIndex = (currentIndex + 1) % tabs.length;
  if (["ArrowLeft", "ArrowUp"].includes(event.key)) nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  if (event.key === "Home") nextIndex = 0;
  if (event.key === "End") nextIndex = tabs.length - 1;
  event.preventDefault();
  activeLifePathId = tabs[nextIndex].dataset.lifePath;
  renderLifePath();
  lifePathTabs.querySelector(`[data-life-path="${activeLifePathId}"]`)?.focus();
});

lifeValuesForm?.addEventListener("input", (event) => {
  const input = event.target.closest("[data-life-value]");
  if (!input || !lifeOsData) return;
  lifeWeights[input.dataset.lifeValue] = Number(input.value);
  const output = lifeValuesForm.querySelector(`[data-life-value-output="${input.dataset.lifeValue}"]`);
  if (output) output.textContent = input.value;
  localStorage.setItem("lumina-life-values", JSON.stringify(lifeWeights));
  renderLifeRanking();
});

lifeResetButton?.addEventListener("click", () => {
  if (!lifeOsData) return;
  lifeWeights = Object.fromEntries(lifeOsData.values.map((value) => [value.id, value.defaultWeight]));
  localStorage.setItem("lumina-life-values", JSON.stringify(lifeWeights));
  renderLifeValues();
  renderLifeRanking();
  showToast("已重設人生路徑權重");
});

lifeExperiments?.addEventListener("change", (event) => {
  const input = event.target.closest("[data-life-experiment]");
  if (!input || !lifeOsData) return;
  if (input.checked) completedLifeExperiments.add(input.dataset.lifeExperiment);
  else completedLifeExperiments.delete(input.dataset.lifeExperiment);
  localStorage.setItem("lumina-life-experiments", JSON.stringify([...completedLifeExperiments]));
  renderLifeExperimentProgress();
  showToast(input.checked ? "已記錄一項人生實驗證據" : "已重新開啟這項人生實驗");
});

initializeLifeOs();

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
