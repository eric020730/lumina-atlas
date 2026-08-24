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

const deadline = new Date("2027-10-25T23:59:59+08:00");
const today = new Date();
const daysLeft = Math.max(0, Math.ceil((deadline - today) / 86_400_000));
const daysLabel = document.querySelector("[data-days-left]");
if (daysLabel) daysLabel.textContent = daysLeft > 0 ? `距截止還有 ${daysLeft} 天` : "報名期間已結束";

const savedItems = new Set(JSON.parse(localStorage.getItem("lumina-saved") || "[]"));

document.querySelectorAll("[data-save]").forEach((button) => {
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

const filters = document.querySelectorAll("[data-filter]");
const courses = document.querySelectorAll("[data-course]");
const courseEmpty = document.querySelector("[data-course-empty]");

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("is-active"));
    filter.classList.add("is-active");
    const choice = filter.dataset.filter;
    let visibleCount = 0;
    courses.forEach((course) => {
      const visible = choice === "all" || course.dataset.format.split(" ").includes(choice);
      course.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    courseEmpty.hidden = visibleCount !== 0;
  });
});

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
