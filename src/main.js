const GRID_SIZE = 12;
const ROUND_DURATION_MS = 45_000;
const LEADERBOARD_KEY = "flux-grid-arena-leaderboard";
const PLAYER_NAME_KEY = "flux-grid-arena-player-name";

const KIND_CONFIG = {
  pulse: { label: "Pulse", baseScore: 14, ttl: 1_000, className: "is-pulse" },
  echo: { label: "Echo", baseScore: 24, ttl: 700, className: "is-echo" },
  rift: { label: "Rift", baseScore: -16, ttl: 950, className: "is-rift" },
};

const arena = document.querySelector("#arena");
const cellElements = Array.from(document.querySelectorAll("[data-cell]"));
const scoreValue = document.querySelector("#score-value");
const comboValue = document.querySelector("#combo-value");
const accuracyValue = document.querySelector("#accuracy-value");
const timeValue = document.querySelector("#time-value");
const startButton = document.querySelector("#start-button");
const statusText = document.querySelector("#status-text");
const rankingList = document.querySelector("#ranking-list");
const clearRankingButton = document.querySelector("#clear-ranking");
const saveForm = document.querySelector("#save-form");
const playerNameInput = document.querySelector("#player-name");
const saveHint = document.querySelector("#save-hint");

let animationFrameId = 0;
let pendingResult = null;
let leaderboard = loadLeaderboard();
let state = createInitialState();

renderLeaderboard();
renderArena(performance.now());
updateHud(performance.now());

startButton.addEventListener("click", startGame);
clearRankingButton.addEventListener("click", clearLeaderboard);
saveForm.addEventListener("submit", handleSaveScore);
arena.addEventListener("click", handleArenaClick);

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    if (!state.running) {
      startGame();
    }
  }
});

function createInitialState() {
  return {
    running: false,
    score: 0,
    combo: 0,
    bestCombo: 0,
    hits: 0,
    misses: 0,
    mistakes: 0,
    startAt: 0,
    endAt: 0,
    nextSpawnAt: 0,
    tiles: Array.from({ length: GRID_SIZE }, () => inactiveTile()),
  };
}

function startGame() {
  cancelAnimationFrame(animationFrameId);

  state = createInitialState();
  const now = performance.now();

  state.running = true;
  state.startAt = now;
  state.endAt = now + ROUND_DURATION_MS;
  state.nextSpawnAt = now + 250;

  pendingResult = null;
  saveForm.hidden = true;
  playerNameInput.value = localStorage.getItem(PLAYER_NAME_KEY) ?? "";
  statusText.textContent = "挑战已开始，保持节奏，优先点击亮块。";
  startButton.textContent = "重新开始";

  renderArena(now);
  updateHud(now);

  animationFrameId = requestAnimationFrame(gameLoop);
}

function gameLoop(now) {
  if (!state.running) {
    return;
  }

  expireTiles(now);
  spawnTiles(now);
  renderArena(now);
  updateHud(now);

  if (now >= state.endAt) {
    endGame();
    return;
  }

  animationFrameId = requestAnimationFrame(gameLoop);
}

function spawnTiles(now) {
  if (now < state.nextSpawnAt) {
    return;
  }

  const timeLeft = Math.max(0, state.endAt - now);
  const activeCount = countActiveTiles();
  const targetActive = timeLeft > 28_000 ? 1 : timeLeft > 14_000 ? 2 : 3;

  if (activeCount < targetActive) {
    const availableIndexes = state.tiles
      .map((tile, index) => ({ tile, index }))
      .filter(({ tile }) => !tile.active)
      .map(({ index }) => index);

    if (availableIndexes.length > 0) {
      const chosenIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
      const kind = pickKind();
      const config = KIND_CONFIG[kind];

      state.tiles[chosenIndex] = {
        active: true,
        kind,
        bornAt: now,
        expiresAt: now + config.ttl,
        feedback: "",
      };
    }
  }

  state.nextSpawnAt = now + getSpawnDelay(timeLeft);
}

function getSpawnDelay(timeLeft) {
  if (timeLeft > 28_000) {
    return 560;
  }
  if (timeLeft > 14_000) {
    return 410;
  }
  return 280;
}

function pickKind() {
  const roll = Math.random();
  if (roll < 0.58) {
    return "pulse";
  }
  if (roll < 0.83) {
    return "echo";
  }
  return "rift";
}

function expireTiles(now) {
  state.tiles.forEach((tile, index) => {
    if (!tile.active || now < tile.expiresAt) {
      return;
    }

    if (tile.kind !== "rift") {
      state.combo = 0;
      state.misses += 1;
      statusText.textContent = "漏掉了目标，连击已中断。";
      state.tiles[index] = inactiveTile("miss");
      scheduleFeedbackClear(index, "miss");
      return;
    }

    state.tiles[index] = inactiveTile();
  });
}

function handleArenaClick(event) {
  const button = event.target.closest("[data-cell]");
  if (!button || !state.running) {
    return;
  }

  const index = Number(button.dataset.cell);
  const tile = state.tiles[index];
  const now = performance.now();

  if (!tile.active) {
    state.mistakes += 1;
    state.combo = 0;
    state.score = Math.max(0, state.score - 4);
    statusText.textContent = "空拍，节奏被打断。";
    state.tiles[index] = inactiveTile("miss");
    scheduleFeedbackClear(index, "miss");
    updateHud(now);
    renderArena(now);
    return;
  }

  if (tile.kind === "rift") {
    state.mistakes += 1;
    state.combo = 0;
    state.score = Math.max(0, state.score + KIND_CONFIG.rift.baseScore);
    statusText.textContent = "踩到 Rift，扣分并清空连击。";
    state.tiles[index] = inactiveTile("miss");
    scheduleFeedbackClear(index, "miss");
    updateHud(now);
    renderArena(now);
    return;
  }

  const config = KIND_CONFIG[tile.kind];
  const remainingLife = Math.max(0, tile.expiresAt - now);
  const speedBonus = Math.round(remainingLife / 34);
  const comboBonus = Math.floor(state.combo / 3) * 6;

  state.hits += 1;
  state.combo += 1;
  state.bestCombo = Math.max(state.bestCombo, state.combo);
  state.score += config.baseScore + speedBonus + comboBonus;

  statusText.textContent = `命中 ${config.label}，当前连击 ${state.combo}。`;
  state.tiles[index] = inactiveTile("hit");
  scheduleFeedbackClear(index, "hit");
  state.nextSpawnAt = Math.min(state.nextSpawnAt, now + 80);

  updateHud(now);
  renderArena(now);
}

function inactiveTile(feedback = "") {
  return {
    active: false,
    kind: null,
    bornAt: 0,
    expiresAt: 0,
    feedback,
  };
}

function scheduleFeedbackClear(index, feedback) {
  window.setTimeout(() => {
    if (state.tiles[index].feedback === feedback) {
      state.tiles[index] = inactiveTile();
      renderArena(performance.now());
    }
  }, 180);
}

function endGame() {
  cancelAnimationFrame(animationFrameId);
  state.running = false;
  state.tiles = state.tiles.map(() => inactiveTile());

  const result = {
    score: state.score,
    hits: state.hits,
    misses: state.misses,
    mistakes: state.mistakes,
    bestCombo: state.bestCombo,
    accuracy: getAccuracy(),
    playedAt: new Date().toISOString(),
  };

  pendingResult = result;
  const lowestScore = leaderboard.length ? leaderboard[leaderboard.length - 1].score : -1;
  const canSave = result.score > 0 && (leaderboard.length < 10 || result.score > lowestScore);

  if (canSave) {
    saveForm.hidden = false;
    saveHint.textContent = `本局 ${result.score} 分，命中率 ${formatAccuracy(result.accuracy)}。可保存到本地排行榜。`;
    playerNameInput.focus();
  } else {
    saveForm.hidden = true;
  }

  statusText.textContent = canSave
    ? `本局结束，得分 ${result.score}。可以写入本地排行榜。`
    : `本局结束，得分 ${result.score}。未进入当前本地榜前 10。`;

  updateHud(performance.now());
  renderArena(performance.now());
}

function handleSaveScore(event) {
  event.preventDefault();

  if (!pendingResult) {
    return;
  }

  const rawName = playerNameInput.value.trim();
  const safeName = sanitizeName(rawName || "Player");

  localStorage.setItem(PLAYER_NAME_KEY, safeName);

  leaderboard = [...leaderboard, { name: safeName, ...pendingResult }]
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }
      if (right.accuracy !== left.accuracy) {
        return right.accuracy - left.accuracy;
      }
      return right.bestCombo - left.bestCombo;
    })
    .slice(0, 10);

  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));

  pendingResult = null;
  saveForm.hidden = true;
  renderLeaderboard();
  statusText.textContent = `成绩已保存，当前共有 ${leaderboard.length} 条本地记录。`;
}

function sanitizeName(value) {
  return value.replace(/\s+/g, " ").slice(0, 12);
}

function clearLeaderboard() {
  if (!leaderboard.length) {
    statusText.textContent = "当前没有可清空的本地榜单。";
    return;
  }

  if (!window.confirm("清空当前浏览器里的本地排行榜？")) {
    return;
  }

  leaderboard = [];
  localStorage.removeItem(LEADERBOARD_KEY);
  renderLeaderboard();
  statusText.textContent = "本地排行榜已清空。";
}

function loadLeaderboard() {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => ({
        name: sanitizeName(String(item.name ?? "Player")),
        score: Number(item.score ?? 0),
        hits: Number(item.hits ?? 0),
        misses: Number(item.misses ?? 0),
        mistakes: Number(item.mistakes ?? 0),
        bestCombo: Number(item.bestCombo ?? 0),
        accuracy: Number(item.accuracy ?? 0),
        playedAt: String(item.playedAt ?? ""),
      }))
      .filter((item) => Number.isFinite(item.score))
      .sort((left, right) => right.score - left.score)
      .slice(0, 10);
  } catch {
    return [];
  }
}

function renderLeaderboard() {
  if (!leaderboard.length) {
    rankingList.innerHTML = '<li class="rank-empty">还没有记录，先打出第一局。</li>';
    return;
  }

  rankingList.innerHTML = leaderboard
    .map((entry, index) => {
      const dateLabel = formatDate(entry.playedAt);
      return `
        <li>
          <span class="rank-index">${index + 1}</span>
          <div class="rank-meta">
            <strong>${escapeHtml(entry.name)}</strong>
            <span>${formatAccuracy(entry.accuracy)} · Combo ${entry.bestCombo} · ${dateLabel}</span>
          </div>
          <span class="rank-score">${entry.score}</span>
        </li>
      `;
    })
    .join("");
}

function renderArena(now) {
  state.tiles.forEach((tile, index) => {
    const element = cellElements[index];
    const span = element.firstElementChild ?? element.appendChild(document.createElement("span"));

    element.className = "cell";
    element.style.setProperty("--life", "0");
    span.textContent = "";

    if (tile.feedback === "hit") {
      element.classList.add("is-feedback-hit");
    }

    if (tile.feedback === "miss") {
      element.classList.add("is-feedback-miss");
    }

    if (!tile.active || !tile.kind) {
      return;
    }

    const config = KIND_CONFIG[tile.kind];
    const life = Math.max(0, tile.expiresAt - now) / config.ttl;

    element.classList.add("is-active", config.className);
    element.style.setProperty("--life", String(life));
    span.textContent = config.label;
  });
}

function updateHud(now) {
  const remainingMs = state.running ? Math.max(0, state.endAt - now) : pendingResult ? 0 : ROUND_DURATION_MS;

  scoreValue.textContent = String(state.score);
  comboValue.textContent = String(state.combo);
  accuracyValue.textContent = formatAccuracy(getAccuracy());
  timeValue.textContent = `${(remainingMs / 1000).toFixed(1)}s`;
}

function countActiveTiles() {
  return state.tiles.reduce((count, tile) => count + Number(tile.active), 0);
}

function getAccuracy() {
  const attempts = state.hits + state.misses + state.mistakes;
  if (attempts === 0) {
    return 100;
  }
  return (state.hits / attempts) * 100;
}

function formatAccuracy(value) {
  return `${Math.round(value)}%`;
}

function formatDate(value) {
  if (!value) {
    return "recent";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "recent";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
