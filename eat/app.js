const fallbackRestaurants = [
  { name: "惠食记·蘭轩", category: "浙菜", walkDistance: 255, address: "玉古路188号", weight: 8, color: "#e89d55", orangeVDeal: { title: "橙V专享套餐" } },
  { name: "渔佬佬·海鲜面", category: "面馆", walkDistance: 140, address: "玉古路178号", weight: 8, color: "#d8503f" },
  { name: "港深潮滋鸡煲坊", category: "港式火锅", walkDistance: 221, address: "黄龙体育中心", weight: 8, color: "#f0c83f", orangeVDeal: { title: "橙V专享双人餐", price: 98 } },
  { name: "陈先进鱼馆", category: "鱼馆", walkDistance: 566, address: "西湖北线/黄龙", weight: 6, color: "#8faeaf", orangeVDeal: { title: "鱼头煲双人餐", price: 78 } },
  { name: "同乐坊", category: "中餐", walkDistance: 500, address: "西湖体育馆周边", weight: 7, color: "#86a85a" },
  { name: "红星牛肉馆", category: "牛肉馆", walkDistance: 420, address: "西湖体育馆周边", weight: 8, color: "#6f9c8a" },
  { name: "云蒸山雨", category: "中餐", walkDistance: 500, address: "西湖体育馆周边", weight: 7, color: "#e25f56" },
  { name: "伊北味·清真拉面村", category: "清真面馆", walkDistance: 450, address: "天目山路159-4号", weight: 7, color: "#e9b86c" },
  { name: "福雅居·老底子杭帮菜", category: "浙菜", walkDistance: 103, address: "黄龙体育中心", weight: 8, color: "#a9b981", orangeVDeal: { title: "招牌橙V双人套餐", price: 88 } },
  { name: "贵州生态牛肉店", category: "贵州牛肉", walkDistance: 187, address: "西湖北线/黄龙", weight: 8, color: "#f07b45", orangeVDeal: { title: "橙V招牌双人餐", price: 78 } },
  { name: "Kpro", category: "西式简餐", walkDistance: 600, address: "黄龙体育中心周边", weight: 5, color: "#f0c83f" },
  { name: "大鼓米线", category: "米粉/米线", walkDistance: 300, address: "体中三路1号黄龙华洋体育馆", weight: 8, color: "#d8503f" },
  { name: "麦当劳", category: "西式快餐", walkDistance: 600, address: "黄龙体育中心周边", weight: 6, color: "#f0c83f" },
  { name: "很累海南鸡饭", category: "海南鸡饭", walkDistance: 675, address: "西湖体育馆周边", weight: 6, color: "#8faeaf" }
];

const AREA_CONFIG = {
  all: { label: "全部区域", color: "#fffef7" },
  international: { label: "黄龙国际", color: "#e87357" },
  sports: { label: "黄龙体育", color: "#e6c953" },
  huanggu: { label: "黄姑山路", color: "#7ea990" },
  other: { label: "其他周边", color: "#93aab0" }
};
const AREA_ORDER = ["international", "sports", "huanggu", "other"];

const INTERNATIONAL_RESTAURANTS = new Set([
  "星平鸡饭", "煮饭佬", "池奈", "豆腐家", "越富南洋", "厨创",
  "外婆家", "澜爵·LANJOLL", "绿茶餐厅"
]);
const HUANGGU_RESTAURANTS = new Set([
  "川味泡菜馆", "姜姜好家庭厨房", "红星牛肉馆", "Kpro",
  "陈先进鱼馆", "农家土菜馆"
]);
const OTHER_RESTAURANTS = new Set([
  "松木场面馆", "很累海南鸡饭", "惠食记·蘭轩", "同乐坊",
  "麦当劳", "杭一碗"
]);

let restaurants = fallbackRestaurants;

const treemap = document.querySelector("#treemap");
const drawButton = document.querySelector("#draw-button");
const cornerDrawButton = document.querySelector("#corner-draw-button");
const buttonLabel = drawButton.querySelector(".button-label");
const result = document.querySelector("#result");
const resultLabel = document.querySelector("#result-label");
const resultName = document.querySelector("#result-name");
const resultDetail = document.querySelector("#result-detail");
const roundLabel = document.querySelector("#round-label");
const restaurantCount = document.querySelector("#restaurant-count");
const selectionSummary = document.querySelector("#selection-summary");
const selectedOnlyToggle = document.querySelector("#selected-only");
const clearSelectionsButton = document.querySelector("#clear-selections");
const resetSelectionButton = document.querySelector("#reset-selection");
const toolbarDrawButton = document.querySelector("#toolbar-draw-button");
const drawHistoryList = document.querySelector("#draw-history-list");
const drawHistoryCount = document.querySelector("#draw-history-count");
const selectionRule = document.querySelector("#selection-rule");
const areaFilter = document.querySelector("#area-filter");

let isDrawing = false;
let round = 1;
let activeIndex = -1;
let activeAreaKey = "all";
const selectedRestaurants = new Set();
const drawHistory = [];

const sumWeights = (items) => items.reduce((sum, item) => sum + item.weight, 0);

function splitBalanced(items) {
  const target = sumWeights(items) / 2;
  let runningTotal = 0;
  let splitIndex = 1;

  for (let index = 0; index < items.length - 1; index += 1) {
    runningTotal += items[index].weight;
    splitIndex = index + 1;
    if (runningTotal >= target) break;
  }

  return [items.slice(0, splitIndex), items.slice(splitIndex)];
}

function layoutTreemap(items, bounds, placements) {
  if (items.length === 1) {
    placements.set(items[0].name, bounds);
    return;
  }

  const [firstGroup, secondGroup] = splitBalanced(items);
  const firstRatio = sumWeights(firstGroup) / sumWeights(items);
  const splitVertically = bounds.width >= bounds.height;

  if (splitVertically) {
    const firstWidth = bounds.width * firstRatio;
    layoutTreemap(firstGroup, { ...bounds, width: firstWidth }, placements);
    layoutTreemap(secondGroup, {
      x: bounds.x + firstWidth,
      y: bounds.y,
      width: bounds.width - firstWidth,
      height: bounds.height
    }, placements);
    return;
  }

  const firstHeight = bounds.height * firstRatio;
  layoutTreemap(firstGroup, { ...bounds, height: firstHeight }, placements);
  layoutTreemap(secondGroup, {
    x: bounds.x,
    y: bounds.y + firstHeight,
    width: bounds.width,
    height: bounds.height - firstHeight
  }, placements);
}

function getRestaurantAreaKey(restaurant) {
  if (INTERNATIONAL_RESTAURANTS.has(restaurant.name)) return "international";
  if (HUANGGU_RESTAURANTS.has(restaurant.name)) return "huanggu";
  if (OTHER_RESTAURANTS.has(restaurant.name)) return "other";
  return "sports";
}

function layoutTreemapByArea(items, bounds, placements) {
  const areaGroups = AREA_ORDER.map((areaKey) => {
    const areaItems = items.filter((item) => getRestaurantAreaKey(item) === areaKey);
    return {
      name: `area-${areaKey}`,
      weight: sumWeights(areaItems),
      items: areaItems
    };
  }).filter((group) => group.items.length > 0);
  const areaPlacements = new Map();

  layoutTreemap(areaGroups, bounds, areaPlacements);
  areaGroups.forEach((group) => {
    layoutTreemap(group.items, areaPlacements.get(group.name), placements);
  });
}

function getActiveAreaLabel() {
  return AREA_CONFIG[activeAreaKey].label;
}

function renderAreaFilters() {
  areaFilter.replaceChildren();

  Object.entries(AREA_CONFIG).forEach(([areaKey, config]) => {
    const count = areaKey === "all"
      ? restaurants.length
      : restaurants.filter((restaurant) => getRestaurantAreaKey(restaurant) === areaKey).length;
    const button = document.createElement("button");
    button.className = "area-filter-button";
    button.type = "button";
    button.dataset.area = areaKey;
    button.dataset.count = count;
    button.style.setProperty("--area-color", config.color);
    button.setAttribute("aria-pressed", String(areaKey === activeAreaKey));
    button.innerHTML = `
      <span class="area-swatch${areaKey === "all" ? " is-all" : ""}" aria-hidden="true"></span>
      <span>${config.label}</span>
      <small>${count}</small>
    `;
    areaFilter.appendChild(button);
  });

  updateAreaFilterUI();
}

function updateAreaFilterUI() {
  document.querySelectorAll(".area-filter-button").forEach((button) => {
    const isActive = button.dataset.area === activeAreaKey;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
    button.disabled = isDrawing || Number(button.dataset.count) === 0;
  });

  document.querySelectorAll(".restaurant-tile").forEach((tile) => {
    const isOutsideArea = activeAreaKey !== "all" && tile.dataset.area !== activeAreaKey;
    tile.classList.toggle("is-area-muted", isOutsideArea);
  });
}

function renderTreemap() {
  treemap.replaceChildren();
  const placements = new Map();
  layoutTreemapByArea(restaurants, { x: 0, y: 0, width: 100, height: 100 }, placements);

  restaurants.forEach((restaurant, index) => {
    const bounds = placements.get(restaurant.name);
    const areaKey = getRestaurantAreaKey(restaurant);
    const area = AREA_CONFIG[areaKey];
    const walkLabel = `步行 ${restaurant.walkDistance} m`;
    const tile = document.createElement("article");
    const isSmall = restaurant.weight <= 6 || (restaurant.name.length >= 7 && restaurant.weight <= 10);
    tile.className = `restaurant-tile${isSmall ? " is-small" : ""}`;
    tile.dataset.index = index;
    tile.dataset.area = areaKey;
    tile.tabIndex = 0;
    tile.setAttribute("role", "button");
    tile.setAttribute("aria-pressed", "false");
    tile.style.left = `${bounds.x}%`;
    tile.style.top = `${bounds.y}%`;
    tile.style.width = `${bounds.width}%`;
    tile.style.height = `${bounds.height}%`;
    tile.style.backgroundColor = area.color;
    tile.setAttribute(
      "aria-label",
      `${restaurant.name}，${area.label}，${walkLabel}，权重 ${restaurant.weight}%`
    );
    tile.innerHTML = `
      <div class="tile-heading">
        <h2 class="tile-name">${restaurant.name}</h2>
        <span class="tile-markers">
          ${restaurant.orangeVDeal ? '<span class="orange-v-badge">橙V</span>' : ""}
          <span class="selection-badge" aria-hidden="true"></span>
        </span>
      </div>
      <div class="tile-meta">
        <span class="tile-facts">
          <span class="tile-category">${restaurant.category}</span>
          <span class="tile-walk"><span class="fact-prefix">步行 </span>${restaurant.walkDistance} m</span>
        </span>
        <span class="tile-weight">${restaurant.weight}<small>%</small></span>
      </div>
    `;
    treemap.appendChild(tile);
  });

  restaurantCount.textContent = `${restaurants.length} 家`;
  renderAreaFilters();
  updateSelectionUI();
}

function getSelectionPool() {
  return [...selectedRestaurants].map((index) => ({ index, weight: 1 }));
}

function getDrawPool() {
  const pool = selectedOnlyToggle.checked
    ? getSelectionPool()
    : restaurants.map((restaurant, index) => ({ index, weight: restaurant.weight }));

  if (activeAreaKey === "all") return pool;
  return pool.filter(({ index }) => getRestaurantAreaKey(restaurants[index]) === activeAreaKey);
}

function weightedPick(pool) {
  const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
  let threshold = Math.random() * totalWeight;

  for (const item of pool) {
    threshold -= item.weight;
    if (threshold < 0) return item.index;
  }

  return pool[pool.length - 1].index;
}

function pickNextHighlight(candidateIndexes) {
  let nextIndex = candidateIndexes[Math.floor(Math.random() * candidateIndexes.length)];
  if (nextIndex === activeIndex) {
    const currentPosition = candidateIndexes.indexOf(nextIndex);
    nextIndex = candidateIndexes[(currentPosition + 1) % candidateIndexes.length];
  }
  return nextIndex;
}

function updateSelectionUI() {
  document.querySelectorAll(".restaurant-tile").forEach((tile) => {
    const index = Number(tile.dataset.index);
    const isSelected = selectedRestaurants.has(index);
    tile.classList.toggle("is-picked", isSelected);
    tile.setAttribute("aria-pressed", String(isSelected));
    tile.querySelector(".selection-badge").textContent = isSelected ? "已选" : "";
    const selectionText = isSelected ? "，已选" : "，未选";
    tile.setAttribute("aria-label", `${tile.getAttribute("aria-label").replace(/，(?:已选|未选)$/, "")}${selectionText}`);
  });

  selectionSummary.textContent = selectedRestaurants.size
    ? `已选择 ${selectedRestaurants.size} 家餐厅`
    : "还没有选择餐厅";
  clearSelectionsButton.disabled = selectedRestaurants.size === 0 || isDrawing;
}

function toggleRestaurantSelection(index) {
  if (isDrawing) return;
  if (selectedRestaurants.has(index)) selectedRestaurants.delete(index);
  else selectedRestaurants.add(index);
  updateSelectionUI();
}

function setSelectionModeCopy() {
  const selectedOnly = selectedOnlyToggle.checked;
  const areaFiltered = activeAreaKey !== "all";
  const areaLabel = getActiveAreaLabel();

  if (selectedOnly && areaFiltered) {
    selectionRule.textContent = `已选 ∩ ${areaLabel}`;
    buttonLabel.textContent = "从交集中抽";
  } else if (selectedOnly) {
    selectionRule.textContent = "已选等概率";
    buttonLabel.textContent = "从已选中抽";
  } else if (areaFiltered) {
    selectionRule.textContent = `${areaLabel} · 面积概率`;
    buttonLabel.textContent = "在此区域抽";
  } else {
    selectionRule.textContent = "面积 = 概率";
    buttonLabel.textContent = "开始随机";
  }

  if (!isDrawing && !result.classList.contains("is-settled")) {
    if (selectedOnly && areaFiltered) {
      resultLabel.textContent = "组合筛选模式";
      resultDetail.textContent = `只在已选择且属于${areaLabel}的餐厅中等概率随机。`;
    } else if (selectedOnly) {
      resultLabel.textContent = "已选餐厅模式";
      resultDetail.textContent = "只在已选择的餐厅中随机，每家餐厅的机会相同。";
    } else if (areaFiltered) {
      resultLabel.textContent = "区域随机模式";
      resultDetail.textContent = `只在${areaLabel}的同色餐厅中按面积权重随机。`;
    } else {
      resultLabel.textContent = "等待开饭";
      resultDetail.textContent = "附近餐厅已经就位，距离越近的餐厅获得略高权重。";
    }
  }
}

function setActiveTile(index) {
  document.querySelectorAll(".restaurant-tile").forEach((tile) => {
    tile.classList.toggle("is-active", Number(tile.dataset.index) === index);
  });
  activeIndex = index;
}

function wait(duration) {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

function renderDrawHistory() {
  drawHistoryList.replaceChildren();
  drawHistoryCount.textContent = `${drawHistory.length} 轮`;

  if (!drawHistory.length) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "draw-history-empty";
    emptyItem.textContent = "还没有抽签记录";
    drawHistoryList.appendChild(emptyItem);
    return;
  }

  [...drawHistory].reverse().forEach((entry) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <span class="draw-history-round">${String(entry.round).padStart(2, "0")}</span>
      <span class="draw-history-swatch" style="--history-color: ${entry.color}" aria-label="${entry.area}" title="${entry.area}"></span>
      <strong>${entry.name}</strong>
      <small>${entry.distance} m</small>
    `;
    drawHistoryList.appendChild(item);
  });
}

function resetSelectionState() {
  if (isDrawing) return;

  selectedRestaurants.clear();
  selectedOnlyToggle.checked = false;
  activeAreaKey = "all";
  activeIndex = -1;
  drawHistory.length = 0;
  round = 1;
  roundLabel.textContent = "ROUND 01";
  treemap.classList.remove("is-drawing", "has-winner");
  document.querySelectorAll(".restaurant-tile").forEach((tile) => {
    tile.classList.remove("is-active", "is-winner");
  });
  result.classList.remove("is-settled");
  resultLabel.textContent = "等待开饭";
  resultName.textContent = "会是哪一家？";
  resultDetail.textContent = "附近餐厅已经就位，距离越近的餐厅获得略高权重。";
  updateAreaFilterUI();
  updateSelectionUI();
  renderDrawHistory();
  setSelectionModeCopy();
}

async function runDraw() {
  if (isDrawing) return;

  const drawPool = getDrawPool();
  if (!drawPool.length) {
    const areaLabel = getActiveAreaLabel();
    result.classList.remove("is-settled");
    resultLabel.textContent = "还不能开抽";
    resultName.textContent = "先选几家吧";
    resultDetail.textContent = selectedOnlyToggle.checked && activeAreaKey !== "all"
      ? `${areaLabel}中没有已选择的餐厅，请选择同色餐厅或切换区域。`
      : "先点击餐厅矩形完成选择，再开启仅抽已选餐厅。";
    return;
  }

  isDrawing = true;
  const winnerIndex = weightedPick(drawPool);
  const candidateIndexes = drawPool.map((item) => item.index);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const steps = reducedMotion ? 4 : 28;

  drawButton.disabled = true;
  cornerDrawButton.disabled = true;
  toolbarDrawButton.disabled = true;
  resetSelectionButton.disabled = true;
  selectedOnlyToggle.disabled = true;
  clearSelectionsButton.disabled = true;
  updateAreaFilterUI();
  drawButton.classList.add("is-running");
  buttonLabel.textContent = "正在选择";
  treemap.classList.remove("has-winner");
  treemap.classList.add("is-drawing");
  result.classList.remove("is-settled");
  resultLabel.textContent = "随机信号搜索中";
  resultName.textContent = "选择困难退散…";
  resultDetail.textContent = "高亮正在餐厅之间移动，马上给你一个不反悔的答案。";
  document.querySelectorAll(".restaurant-tile").forEach((tile) => tile.classList.remove("is-winner"));

  for (let step = 0; step < steps; step += 1) {
    const progress = step / Math.max(steps - 1, 1);
    const delay = reducedMotion ? 18 : 52 + Math.pow(progress, 3) * 240;
    setActiveTile(step === steps - 1 ? winnerIndex : pickNextHighlight(candidateIndexes));
    await wait(delay);
  }

  const winner = restaurants[winnerIndex];
  const winnerTile = document.querySelector(`[data-index="${winnerIndex}"]`);
  winnerTile.classList.remove("is-active");
  winnerTile.classList.add("is-winner");
  treemap.classList.remove("is-drawing");
  treemap.classList.add("has-winner");
  const areaFiltered = activeAreaKey !== "all";
  resultLabel.textContent = selectedOnlyToggle.checked && areaFiltered
    ? "组合筛选结果"
    : selectedOnlyToggle.checked
      ? "已选餐厅结果"
      : areaFiltered
        ? "区域随机结果"
        : "就是这里，不许反悔";
  resultName.textContent = winner.name;
  const deal = winner.orangeVDeal;
  const dealText = deal
    ? ` · 套餐：${deal.title}`
    : " · 暂无已录入套餐";
  const areaText = ` · ${AREA_CONFIG[getRestaurantAreaKey(winner)].label}`;
  resultDetail.textContent = `${winner.category}${areaText} · 步行 ${winner.walkDistance} m · ${winner.address}${dealText}。现在出发。`;
  result.classList.add("is-settled");
  drawHistory.push({
    round,
    name: winner.name,
    area: AREA_CONFIG[getRestaurantAreaKey(winner)].label,
    color: AREA_CONFIG[getRestaurantAreaKey(winner)].color,
    distance: winner.walkDistance
  });
  renderDrawHistory();

  round += 1;
  roundLabel.textContent = `ROUND ${String(round).padStart(2, "0")}`;
  buttonLabel.textContent = selectedOnlyToggle.checked && areaFiltered
    ? "从交集再抽"
    : selectedOnlyToggle.checked
      ? "从已选再抽"
      : areaFiltered
        ? "在此区域再抽"
        : "再来一次";
  drawButton.disabled = false;
  cornerDrawButton.disabled = false;
  toolbarDrawButton.disabled = false;
  resetSelectionButton.disabled = false;
  selectedOnlyToggle.disabled = false;
  drawButton.classList.remove("is-running");
  isDrawing = false;
  updateAreaFilterUI();
  updateSelectionUI();
}

drawButton.addEventListener("click", runDraw);
cornerDrawButton.addEventListener("click", runDraw);
toolbarDrawButton.addEventListener("click", runDraw);
resetSelectionButton.addEventListener("click", resetSelectionState);
selectedOnlyToggle.addEventListener("change", setSelectionModeCopy);
areaFilter.addEventListener("click", (event) => {
  const button = event.target.closest(".area-filter-button");
  if (!button || button.disabled || isDrawing) return;
  activeAreaKey = button.dataset.area;
  updateAreaFilterUI();
  setSelectionModeCopy();
});
clearSelectionsButton.addEventListener("click", () => {
  selectedRestaurants.clear();
  updateSelectionUI();
});
treemap.addEventListener("click", (event) => {
  const tile = event.target.closest(".restaurant-tile");
  if (tile) toggleRestaurantSelection(Number(tile.dataset.index));
});
treemap.addEventListener("keydown", (event) => {
  const tile = event.target.closest(".restaurant-tile");
  if (!tile || !["Enter", "Space"].includes(event.code)) return;
  event.preventDefault();
  event.stopPropagation();
  toggleRestaurantSelection(Number(tile.dataset.index));
});
document.addEventListener("keydown", (event) => {
  const isSpace = event.code === "Space";
  const isFormControl = ["BUTTON", "INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName);
  if (isSpace && !isFormControl) {
    event.preventDefault();
    runDraw();
  }
});

function isValidRestaurant(restaurant) {
  return restaurant
    && typeof restaurant.name === "string"
    && typeof restaurant.category === "string"
    && Number.isFinite(restaurant.walkDistance)
    && Number.isFinite(restaurant.weight)
    && restaurant.weight > 0;
}

async function loadRestaurants() {
  try {
    const response = await fetch("data/restaurants.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const payload = await response.json();
    const loadedRestaurants = payload.restaurants;
    if (!Array.isArray(loadedRestaurants) || !loadedRestaurants.length) {
      throw new Error("餐厅列表为空");
    }
    if (!loadedRestaurants.every(isValidRestaurant) || sumWeights(loadedRestaurants) !== 100) {
      throw new Error("餐厅数据或权重无效");
    }
    return loadedRestaurants;
  } catch (error) {
    console.warn(`无法加载餐厅数据，使用内置列表：${error.message}`);
    return fallbackRestaurants;
  }
}

async function initialize() {
  drawButton.disabled = true;
  cornerDrawButton.disabled = true;
  toolbarDrawButton.disabled = true;
  restaurants = await loadRestaurants();
  renderTreemap();
  setSelectionModeCopy();
  drawButton.disabled = false;
  cornerDrawButton.disabled = false;
  toolbarDrawButton.disabled = false;
}

initialize();
