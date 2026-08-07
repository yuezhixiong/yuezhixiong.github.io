const fallbackRestaurants = [
  { name: "惠食记·蘭轩", category: "浙菜", walkMinutes: 4, address: "玉古路188号", weight: 8, color: "#e89d55", orangeVDeal: { title: "橙V专享套餐" } },
  { name: "渔佬佬·海鲜面", category: "面馆", walkMinutes: 2, address: "玉古路178号", weight: 8, color: "#d8503f" },
  { name: "港深潮滋鸡煲坊", category: "港式火锅", walkMinutes: 4, address: "黄龙体育中心", weight: 8, color: "#f0c83f", orangeVDeal: { title: "橙V专享双人餐", price: 98 } },
  { name: "陈先进鱼馆", category: "鱼馆", walkMinutes: 8, address: "西湖北线/黄龙", weight: 7, color: "#8faeaf", orangeVDeal: { title: "鱼头煲双人餐", price: 78 } },
  { name: "同乐坊", category: "中餐", walkMinutes: 7, address: "西湖体育馆周边", weight: 7, color: "#86a85a" },
  { name: "红星牛肉馆", category: "牛肉馆", walkMinutes: 6, address: "西湖体育馆周边", weight: 7, color: "#6f9c8a" },
  { name: "云蒸山雨", category: "中餐", walkMinutes: 7, address: "西湖体育馆周边", weight: 7, color: "#e25f56" },
  { name: "伊北味·清真拉面村", category: "清真面馆", walkMinutes: 6, address: "天目山路159-4号", weight: 7, color: "#e9b86c" },
  { name: "福雅居·老底子杭帮菜", category: "浙菜", walkMinutes: 2, address: "黄龙体育中心", weight: 8, color: "#a9b981", orangeVDeal: { title: "招牌橙V双人套餐", price: 88 } },
  { name: "贵州生态牛肉店", category: "贵州牛肉", walkMinutes: 3, address: "西湖北线/黄龙", weight: 8, color: "#f07b45", orangeVDeal: { title: "橙V招牌双人餐", price: 78 } },
  { name: "张花花重庆爆炒浇头面", category: "重庆面馆", walkMinutes: 14, address: "文三路沿线", weight: 5, color: "#f0c83f", orangeVDeal: { title: "浇头面双人餐", price: 29.9 } },
  { name: "大鼓米线", category: "米粉/米线", walkMinutes: 4, address: "体中三路1号黄龙华洋体育馆", weight: 8, color: "#d8503f" },
  { name: "麦当劳", category: "西式快餐", walkMinutes: 8, address: "黄龙体育中心周边", weight: 6, color: "#f0c83f" },
  { name: "很累海南鸡饭", category: "海南鸡饭", walkMinutes: 9, address: "西湖体育馆周边", weight: 6, color: "#8faeaf" }
];

const USERS = [
  { id: "zhang", name: "章" },
  { id: "hu", name: "胡" },
  { id: "wang", name: "王" },
  { id: "le", name: "乐" }
];

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
const selectionRule = document.querySelector("#selection-rule");
const userButtons = [...document.querySelectorAll(".user-button")];

let isDrawing = false;
let round = 1;
let activeIndex = -1;
let activeUserId = USERS[0].id;
const userSelections = new Map(USERS.map((user) => [user.id, new Set()]));

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

function renderTreemap() {
  treemap.replaceChildren();
  const placements = new Map();
  layoutTreemap(restaurants, { x: 0, y: 0, width: 100, height: 100 }, placements);

  restaurants.forEach((restaurant, index) => {
    const bounds = placements.get(restaurant.name);
    const walkLabel = `步行约 ${restaurant.walkMinutes} 分`;
    const dealPrice = restaurant.orangeVDeal?.price;
    const priceLabel = Number.isFinite(dealPrice) ? `套餐 ¥${dealPrice}` : "";
    const tile = document.createElement("article");
    const isSmall = restaurant.weight <= 6 || (restaurant.name.length >= 7 && restaurant.weight <= 10);
    tile.className = `restaurant-tile${isSmall ? " is-small" : ""}`;
    tile.dataset.index = index;
    tile.tabIndex = 0;
    tile.setAttribute("role", "button");
    tile.setAttribute("aria-pressed", "false");
    tile.style.left = `${bounds.x}%`;
    tile.style.top = `${bounds.y}%`;
    tile.style.width = `${bounds.width}%`;
    tile.style.height = `${bounds.height}%`;
    tile.style.backgroundColor = restaurant.color;
    tile.setAttribute(
      "aria-label",
      `${restaurant.name}，${walkLabel}${priceLabel ? `，${priceLabel}` : ""}，权重 ${restaurant.weight}%`
    );
    tile.innerHTML = `
      <div class="tile-heading">
        <h2 class="tile-name">${restaurant.name}</h2>
        <span class="tile-markers">
          ${restaurant.orangeVDeal ? '<span class="orange-v-badge">橙V</span>' : ""}
          <span class="tile-voters"></span>
        </span>
      </div>
      <div class="tile-meta">
        <span class="tile-facts">
          <span class="tile-category">${restaurant.category}</span>
          <span class="tile-walk"><span class="fact-prefix">步行约 </span>${restaurant.walkMinutes} 分</span>
          ${priceLabel ? `<strong class="tile-price"><span class="fact-prefix">套餐 </span>¥${dealPrice}</strong>` : ""}
        </span>
        <span class="tile-weight">${restaurant.weight}<small>%</small></span>
      </div>
    `;
    treemap.appendChild(tile);
  });

  restaurantCount.textContent = `${restaurants.length} 家`;
  updateSelectionUI();
}

function getSelectionPool() {
  const participatingUsers = USERS.filter((user) => userSelections.get(user.id).size > 0);
  if (!participatingUsers.length) return [];

  const allocations = new Map();
  const userWeight = 1 / participatingUsers.length;
  participatingUsers.forEach((user) => {
    const selectedIndexes = userSelections.get(user.id);
    const restaurantShare = userWeight / selectedIndexes.size;
    selectedIndexes.forEach((index) => {
      allocations.set(index, (allocations.get(index) || 0) + restaurantShare);
    });
  });

  return [...allocations].map(([index, weight]) => ({ index, weight }));
}

function getDrawPool() {
  if (selectedOnlyToggle.checked) return getSelectionPool();
  return restaurants.map((restaurant, index) => ({ index, weight: restaurant.weight }));
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

function getUsersForRestaurant(index) {
  return USERS.filter((user) => userSelections.get(user.id).has(index));
}

function updateSelectionUI() {
  const selectedIndexes = new Set();

  userButtons.forEach((button) => {
    const userId = button.dataset.userId;
    const count = userSelections.get(userId).size;
    const isCurrent = userId === activeUserId;
    button.classList.toggle("is-current", isCurrent);
    button.setAttribute("aria-pressed", String(isCurrent));
    button.querySelector("small").textContent = count;
    userSelections.get(userId).forEach((index) => selectedIndexes.add(index));
  });

  document.querySelectorAll(".restaurant-tile").forEach((tile) => {
    const index = Number(tile.dataset.index);
    const voters = getUsersForRestaurant(index);
    const selectedByCurrentUser = userSelections.get(activeUserId).has(index);
    const voterNames = voters.map((user) => user.name).join("、");
    tile.classList.toggle("is-picked", voters.length > 0);
    tile.classList.toggle("is-picked-by-current", selectedByCurrentUser);
    tile.setAttribute("aria-pressed", String(selectedByCurrentUser));
    tile.querySelector(".tile-voters").innerHTML = voters
      .map((user) => `<span class="tile-voter user-${user.id}" title="${user.name}已选">${user.name}</span>`)
      .join("");
    const selectionText = voters.length ? `，${voterNames}已选` : "，无人选择";
    tile.setAttribute("aria-label", `${tile.getAttribute("aria-label").replace(/，(?:章|胡|王|乐|、)*已选|，无人选择/g, "")}${selectionText}`);
  });

  const counts = USERS.map((user) => `${user.name}${userSelections.get(user.id).size}`).join(" · ");
  selectionSummary.textContent = selectedIndexes.size
    ? `共选中 ${selectedIndexes.size} 家 · ${counts}`
    : "还没有人选择餐厅";
  clearSelectionsButton.disabled = selectedIndexes.size === 0 || isDrawing;
}

function toggleRestaurantSelection(index) {
  if (isDrawing) return;
  const selections = userSelections.get(activeUserId);
  if (selections.has(index)) selections.delete(index);
  else selections.add(index);
  updateSelectionUI();
}

function setSelectionModeCopy() {
  const selectedOnly = selectedOnlyToggle.checked;
  selectionRule.textContent = selectedOnly ? "用户均权" : "面积 = 概率";
  buttonLabel.textContent = selectedOnly ? "从已选中抽" : "开始随机";
  if (!isDrawing && !result.classList.contains("is-settled")) {
    resultLabel.textContent = selectedOnly ? "用户选择模式" : "等待开饭";
    resultDetail.textContent = selectedOnly
      ? "每位已选择餐厅的用户权重相同，再平均分配到各自选中的餐厅。"
      : "附近餐厅已经就位，距离越近的餐厅获得略高权重。";
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

async function runDraw() {
  if (isDrawing) return;

  const drawPool = getDrawPool();
  if (!drawPool.length) {
    result.classList.remove("is-settled");
    resultLabel.textContent = "还不能开抽";
    resultName.textContent = "先选几家吧";
    resultDetail.textContent = "选择一位用户，再点击餐厅矩形；至少有一位用户完成选择后才能仅抽已选餐厅。";
    return;
  }

  isDrawing = true;
  const winnerIndex = weightedPick(drawPool);
  const candidateIndexes = drawPool.map((item) => item.index);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const steps = reducedMotion ? 4 : 28;

  drawButton.disabled = true;
  cornerDrawButton.disabled = true;
  userButtons.forEach((button) => { button.disabled = true; });
  selectedOnlyToggle.disabled = true;
  clearSelectionsButton.disabled = true;
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
  resultLabel.textContent = selectedOnlyToggle.checked ? "用户均权结果" : "就是这里，不许反悔";
  resultName.textContent = winner.name;
  const deal = winner.orangeVDeal;
  const selectedPrice = Number.isFinite(deal?.price) ? ` · ¥${deal.price}` : "";
  const originalPrice = Number.isFinite(deal?.originalPrice) ? `（原价 ¥${deal.originalPrice}）` : "";
  const dealText = deal
    ? ` · 套餐：${deal.title}${selectedPrice}${originalPrice}`
    : " · 暂无已录入套餐";
  const voterNames = getUsersForRestaurant(winnerIndex).map((user) => user.name).join("、");
  const voterText = selectedOnlyToggle.checked ? ` · ${voterNames}选中` : "";
  resultDetail.textContent = `${winner.category} · 步行约 ${winner.walkMinutes} 分钟 · ${winner.address}${voterText}${dealText}。现在出发。`;
  result.classList.add("is-settled");

  round += 1;
  roundLabel.textContent = `ROUND ${String(round).padStart(2, "0")}`;
  buttonLabel.textContent = selectedOnlyToggle.checked ? "从已选再抽" : "再来一次";
  drawButton.disabled = false;
  cornerDrawButton.disabled = false;
  userButtons.forEach((button) => { button.disabled = false; });
  selectedOnlyToggle.disabled = false;
  drawButton.classList.remove("is-running");
  isDrawing = false;
  updateSelectionUI();
}

drawButton.addEventListener("click", runDraw);
cornerDrawButton.addEventListener("click", runDraw);
userButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeUserId = button.dataset.userId;
    updateSelectionUI();
  });
});
selectedOnlyToggle.addEventListener("change", setSelectionModeCopy);
clearSelectionsButton.addEventListener("click", () => {
  userSelections.forEach((selections) => selections.clear());
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
    && Number.isFinite(restaurant.walkMinutes)
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
  restaurants = await loadRestaurants();
  renderTreemap();
  setSelectionModeCopy();
  drawButton.disabled = false;
  cornerDrawButton.disabled = false;
}

initialize();
