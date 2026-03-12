const GRID_SIZE = 12;
const ROUND_DURATION_MS = 45_000;
const LEADERBOARD_KEY = "flux-grid-arena-leaderboard";
const PLAYER_NAME_KEY = "flux-grid-arena-player-name";
const LANGUAGE_KEY = "flux-grid-arena-language";
const DEFAULT_LANGUAGE = "en";
const SUPPORTED_LANGUAGES = ["en", "zh", "ja"];

const KIND_CONFIG = {
  pulse: { labelKey: "pulseName", baseScore: 14, ttl: 1_000, className: "is-pulse" },
  echo: { labelKey: "echoName", baseScore: 24, ttl: 700, className: "is-echo" },
  rift: { labelKey: "riftName", baseScore: -16, ttl: 950, className: "is-rift" },
};

const I18N = {
  en: {
    htmlLang: "en",
    pageTitle: "Flux Grid Arena",
    metaDescription: "A GitHub Pages-ready reaction game with a local leaderboard.",
    eyebrow: "GitHub Pages Ready",
    lead: "A 45-second rhythm reaction game. Hit glowing targets fast to build your combo and score. Tap a rift or an empty cell and you lose points instantly.",
    pulseName: "Pulse",
    echoName: "Echo",
    riftName: "Rift",
    startButtonIdle: "Start Game",
    startButtonRestart: "Restart",
    statusReady: "Click start to generate a new run.",
    statusStarted: "Run started. Keep the rhythm and prioritize glowing targets.",
    statusMissed: "You missed a score tile. Combo reset.",
    statusMistake: "Empty tap. Rhythm broken.",
    statusRift: "You hit a Rift. Score penalty and combo reset.",
    statusHit: (label, combo) => `Hit ${label}. Combo ${combo}.`,
    legendPulse: "Pulse + score",
    legendEcho: "Echo bonus",
    legendRift: "Rift penalty",
    scoreLabel: "Score",
    comboLabel: "Combo",
    accuracyLabel: "Accuracy",
    timeLabel: "Time",
    arenaLabel: "Game arena",
    cellLabel: "Cell",
    rulesTitle: "How To Play",
    rule1: "<strong>Pulse</strong> is the standard score tile. Faster reactions grant more points.",
    rule2: "<strong>Echo</strong> expires faster but pays out more score per hit.",
    rule3: "<strong>Rift</strong> is a trap. Hitting it costs points and resets your combo.",
    rule4: "Missing a score tile also breaks rhythm and lowers your accuracy.",
    rankingTitle: "Ranking",
    clearRanking: "Clear Board",
    saveLabel: "Save your local run",
    namePlaceholder: "Enter a name",
    saveButton: "Save",
    saveHintDefault: "Leaderboard data is stored in this browser via localStorage.",
    saveHintResult: (score, accuracy) => `Scored ${score} with ${formatAccuracy(accuracy)} accuracy. Save it to the local leaderboard.`,
    endGameSave: (score) => `Round over. Score ${score}. You can save it to the local leaderboard.`,
    endGameNoSave: (score) => `Round over. Score ${score}. It did not enter the current local top 10.`,
    saveSuccess: (count) => `Score saved. ${count} local record${count === 1 ? "" : "s"} stored.`,
    clearEmpty: "There is no local leaderboard to clear.",
    clearConfirm: "Clear the local leaderboard stored in this browser?",
    clearDone: "Local leaderboard cleared.",
    noRanking: "No runs saved yet. Set the first score.",
    rankingMeta: (accuracy, bestCombo, date) => `${formatAccuracy(accuracy)} · Combo ${bestCombo} · ${date}`,
    recent: "recent",
    footerNote: "Static project, ready for GitHub Pages. The current ranking board is local to this browser.",
    dateLocale: "en-US",
  },
  zh: {
    htmlLang: "zh-CN",
    pageTitle: "Flux Grid Arena",
    metaDescription: "一个适合 GitHub Pages 的反应小游戏，带本地排行榜。",
    eyebrow: "GitHub Pages Ready",
    lead: "45 秒节奏反应小游戏。点亮的目标越快点中，连击越高，分数越高；点到裂隙或空格会直接掉分。",
    pulseName: "Pulse",
    echoName: "Echo",
    riftName: "Rift",
    startButtonIdle: "开始游戏",
    startButtonRestart: "重新开始",
    statusReady: "点击开始，生成一局新的挑战。",
    statusStarted: "挑战已开始，保持节奏，优先点击亮块。",
    statusMissed: "漏掉了得分块，连击已中断。",
    statusMistake: "空拍，节奏被打断。",
    statusRift: "踩到 Rift，扣分并清空连击。",
    statusHit: (label, combo) => `命中 ${label}，当前连击 ${combo}。`,
    legendPulse: "Pulse + 分",
    legendEcho: "Echo 高分",
    legendRift: "Rift 扣分",
    scoreLabel: "分数",
    comboLabel: "连击",
    accuracyLabel: "命中率",
    timeLabel: "时间",
    arenaLabel: "游戏区域",
    cellLabel: "格子",
    rulesTitle: "玩法说明",
    rule1: "<strong>Pulse</strong> 是基础得分块，反应越快加分越多。",
    rule2: "<strong>Echo</strong> 生存时间更短，但单次得分更高。",
    rule3: "<strong>Rift</strong> 是陷阱，点到会掉分并清空连击。",
    rule4: "漏掉可得分目标也会打断节奏，影响命中率。",
    rankingTitle: "排行榜",
    clearRanking: "清空榜单",
    saveLabel: "记录本地成绩",
    namePlaceholder: "输入昵称",
    saveButton: "保存",
    saveHintDefault: "排行榜保存在当前浏览器的 localStorage 中。",
    saveHintResult: (score, accuracy) => `本局 ${score} 分，命中率 ${formatAccuracy(accuracy)}。可保存到本地排行榜。`,
    endGameSave: (score) => `本局结束，得分 ${score}。可以写入本地排行榜。`,
    endGameNoSave: (score) => `本局结束，得分 ${score}。未进入当前本地榜前 10。`,
    saveSuccess: (count) => `成绩已保存，当前共有 ${count} 条本地记录。`,
    clearEmpty: "当前没有可清空的本地榜单。",
    clearConfirm: "清空当前浏览器里的本地排行榜？",
    clearDone: "本地排行榜已清空。",
    noRanking: "还没有记录，先打出第一局。",
    rankingMeta: (accuracy, bestCombo, date) => `${formatAccuracy(accuracy)} · 连击 ${bestCombo} · ${date}`,
    recent: "最近",
    footerNote: "纯静态项目，可直接部署到 GitHub Pages。当前排行榜为本地榜，同一浏览器下长期保留。",
    dateLocale: "zh-CN",
  },
  ja: {
    htmlLang: "ja",
    pageTitle: "Flux Grid Arena",
    metaDescription: "GitHub Pages 向けの反応ゲーム。ローカルランキング付き。",
    eyebrow: "GitHub Pages Ready",
    lead: "45 秒のリズム反応ゲームです。光ったターゲットを素早く叩いてコンボとスコアを伸ばし、Rift や空のセルを押すと即座に減点されます。",
    pulseName: "Pulse",
    echoName: "Echo",
    riftName: "Rift",
    startButtonIdle: "ゲーム開始",
    startButtonRestart: "再スタート",
    statusReady: "開始ボタンを押すと新しいラウンドが始まります。",
    statusStarted: "ラウンド開始。リズムを保って光るターゲットを優先してください。",
    statusMissed: "得点タイルを逃しました。コンボがリセットされました。",
    statusMistake: "空振りです。リズムが崩れました。",
    statusRift: "Rift に触れました。減点され、コンボもリセットされました。",
    statusHit: (label, combo) => `${label} をヒット。現在 ${combo} コンボ。`,
    legendPulse: "Pulse + score",
    legendEcho: "Echo bonus",
    legendRift: "Rift penalty",
    scoreLabel: "スコア",
    comboLabel: "コンボ",
    accuracyLabel: "精度",
    timeLabel: "時間",
    arenaLabel: "ゲームエリア",
    cellLabel: "セル",
    rulesTitle: "遊び方",
    rule1: "<strong>Pulse</strong> は基本得点タイルです。反応が速いほど多く加点されます。",
    rule2: "<strong>Echo</strong> は消えるのが速い代わりに、1 回の得点が高めです。",
    rule3: "<strong>Rift</strong> はトラップです。触れると減点され、コンボがリセットされます。",
    rule4: "得点タイルを逃してもリズムが崩れ、精度が下がります。",
    rankingTitle: "ランキング",
    clearRanking: "クリア",
    saveLabel: "ローカル記録を保存",
    namePlaceholder: "名前を入力",
    saveButton: "保存",
    saveHintDefault: "ランキングはこのブラウザの localStorage に保存されます。",
    saveHintResult: (score, accuracy) => `今回のスコアは ${score}、精度は ${formatAccuracy(accuracy)} です。ローカルランキングに保存できます。`,
    endGameSave: (score) => `ラウンド終了。スコア ${score}。ローカルランキングに保存できます。`,
    endGameNoSave: (score) => `ラウンド終了。スコア ${score}。現在のローカル上位 10 位には入りませんでした。`,
    saveSuccess: (count) => `スコアを保存しました。現在 ${count} 件のローカル記録があります。`,
    clearEmpty: "削除できるローカルランキングがありません。",
    clearConfirm: "このブラウザに保存されたローカルランキングを削除しますか?",
    clearDone: "ローカルランキングを削除しました。",
    noRanking: "まだ記録がありません。最初のスコアを出してください。",
    rankingMeta: (accuracy, bestCombo, date) => `${formatAccuracy(accuracy)} · コンボ ${bestCombo} · ${date}`,
    recent: "最近",
    footerNote: "GitHub Pages にそのまま配備できる静的プロジェクトです。現在のランキングはこのブラウザ内だけで保持されます。",
    dateLocale: "ja-JP",
  },
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
const langButtons = Array.from(document.querySelectorAll("[data-lang]"));
const metaDescription = document.querySelector("#meta-description");
const metaOgDescription = document.querySelector("#meta-og-description");

let animationFrameId = 0;
let pendingResult = null;
let leaderboard = loadLeaderboard();
let currentLanguage = loadLanguage();
let statusState = { key: "statusReady", args: [] };
let saveHintState = { key: "saveHintDefault", args: [] };
let state = createInitialState();

applyLanguage(currentLanguage);
renderLeaderboard();
renderArena(performance.now());
updateHud(performance.now());

startButton.addEventListener("click", startGame);
clearRankingButton.addEventListener("click", clearLeaderboard);
saveForm.addEventListener("submit", handleSaveScore);
arena.addEventListener("click", handleArenaClick);
langButtons.forEach((button) => button.addEventListener("click", handleLanguageChange));

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
  setStatus("statusStarted");
  setSaveHint("saveHintDefault");
  updateStartButtonLabel();

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
      setStatus("statusMissed");
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
    setStatus("statusMistake");
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
    setStatus("statusRift");
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

  setStatus("statusHit", t(config.labelKey), state.combo);
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
    setSaveHint("saveHintResult", result.score, result.accuracy);
    playerNameInput.focus();
  } else {
    saveForm.hidden = true;
    setSaveHint("saveHintDefault");
  }

  setStatus(canSave ? "endGameSave" : "endGameNoSave", result.score);
  updateStartButtonLabel();
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
  setSaveHint("saveHintDefault");
  renderLeaderboard();
  setStatus("saveSuccess", leaderboard.length);
  updateStartButtonLabel();
}

function sanitizeName(value) {
  return value.replace(/\s+/g, " ").slice(0, 12);
}

function clearLeaderboard() {
  if (!leaderboard.length) {
    setStatus("clearEmpty");
    return;
  }

  if (!window.confirm(t("clearConfirm"))) {
    return;
  }

  leaderboard = [];
  localStorage.removeItem(LEADERBOARD_KEY);
  renderLeaderboard();
  setStatus("clearDone");
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
    rankingList.innerHTML = `<li class="rank-empty">${escapeHtml(t("noRanking"))}</li>`;
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
            <span>${escapeHtml(resolveMessage("rankingMeta", entry.accuracy, entry.bestCombo, dateLabel))}</span>
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
    element.setAttribute("aria-label", `${t("cellLabel")} ${index + 1}`);
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
    span.textContent = t(config.labelKey);
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
    return t("recent");
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return t("recent");
  }

  return new Intl.DateTimeFormat(I18N[currentLanguage].dateLocale, {
    month: "short",
    day: "numeric",
  }).format(date);
}

function handleLanguageChange(event) {
  const language = event.currentTarget.dataset.lang;
  if (!SUPPORTED_LANGUAGES.includes(language) || language === currentLanguage) {
    return;
  }

  currentLanguage = language;
  localStorage.setItem(LANGUAGE_KEY, currentLanguage);
  applyLanguage(currentLanguage);
}

function applyLanguage(language) {
  const copy = I18N[language];

  document.documentElement.lang = copy.htmlLang;
  document.title = copy.pageTitle;
  metaDescription.setAttribute("content", copy.metaDescription);
  metaOgDescription.setAttribute("content", copy.metaDescription);
  arena.setAttribute("aria-label", copy.arenaLabel);
  playerNameInput.setAttribute("placeholder", copy.namePlaceholder);

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    element.innerHTML = t(element.dataset.i18nHtml);
  });

  langButtons.forEach((button) => {
    const isActive = button.dataset.lang === currentLanguage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  updateStartButtonLabel();
  renderStatus();
  renderSaveHint();
  renderLeaderboard();
  renderArena(performance.now());
  updateHud(performance.now());
}

function updateStartButtonLabel() {
  startButton.textContent = state.running || pendingResult ? t("startButtonRestart") : t("startButtonIdle");
}

function setStatus(key, ...args) {
  statusState = { key, args };
  renderStatus();
}

function renderStatus() {
  statusText.textContent = resolveMessage(statusState.key, ...statusState.args);
}

function setSaveHint(key, ...args) {
  saveHintState = { key, args };
  renderSaveHint();
}

function renderSaveHint() {
  saveHint.textContent = resolveMessage(saveHintState.key, ...saveHintState.args);
}

function resolveMessage(key, ...args) {
  const value = I18N[currentLanguage][key];
  return typeof value === "function" ? value(...args) : value;
}

function t(key) {
  return resolveMessage(key);
}

function loadLanguage() {
  const stored = localStorage.getItem(LANGUAGE_KEY);
  return SUPPORTED_LANGUAGES.includes(stored) ? stored : DEFAULT_LANGUAGE;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
