const GRID_SIZE = 12;
const ROUND_DURATION_MS = 45_000;
const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const SUDOKU_DIFFICULTIES = ["easy", "medium", "hard", "expert"];
const SUDOKU_SOLUTION = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
const SUDOKU_PUZZLES = {
  easy: [
    {
      puzzle: "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
      solution: SUDOKU_SOLUTION,
    },
  ],
  medium: [
    {
      puzzle: "530070000600105000000342560859000420426053791013920056961500284080419605345080170",
      solution: SUDOKU_SOLUTION,
    },
  ],
  hard: [
    {
      puzzle: "030000900600105000008002067800060003020800001700004800001030080080019005300006070",
      solution: SUDOKU_SOLUTION,
    },
  ],
  expert: [
    {
      puzzle: "000008900070100000000000060800000003020000001000004800001000000000019005300000000",
      solution: SUDOKU_SOLUTION,
    },
  ],
};

const STORAGE_KEYS = {
  reactionLeaderboard: "flux-grid-arena-leaderboard",
  tttLeaderboard: "flux-grid-arcade-ttt-leaderboard",
  sudokuLeaderboard: "flux-grid-arcade-sudoku-leaderboard",
  playerName: "flux-grid-arena-player-name",
  language: "flux-grid-arena-language",
  activeGame: "flux-grid-arcade-active-game",
};

const DEFAULT_LANGUAGE = "en";
const DEFAULT_GAME = "reaction";
const SUPPORTED_LANGUAGES = ["en", "zh", "ja"];
const SUPPORTED_GAMES = ["reaction", "ttt", "sudoku"];

const KIND_CONFIG = {
  pulse: { labelKey: "pulseName", baseScore: 14, ttl: 1_000, className: "is-pulse" },
  echo: { labelKey: "echoName", baseScore: 24, ttl: 700, className: "is-echo" },
  rift: { labelKey: "riftName", baseScore: -16, ttl: 950, className: "is-rift" },
};

const I18N = {
  en: {
    htmlLang: "en",
    pageTitle: "Flux Grid Arcade",
    metaDescription: "A GitHub Pages-ready mini arcade with multiple local leaderboards.",
    eyebrow: "GitHub Pages Ready",
    hubTitle: "Flux Grid Arcade",
    lead: "A compact browser arcade with local leaderboards. Jump between a speed-focused reaction challenge, a tactical board duel, and a multi-difficulty Sudoku run.",
    gamesTitle: "Game Library",
    gamesIntro: "Switch between ranked mini-games without leaving the page.",
    rulesTitle: "How To Play",
    rankingTitle: "Ranking",
    clearRanking: "Clear Board",
    saveButton: "Save",
    namePlaceholder: "Enter a name",
    footerNote: "Static arcade project, ready for GitHub Pages. Each game stores its own local leaderboard in this browser.",
    pulseName: "Pulse",
    echoName: "Echo",
    riftName: "Rift",
    tttMarkX: "X",
    tttMarkO: "O",
    recent: "recent",
    cellLabel: "Cell",
    tttCellLabel: "Tic-Tac-Toe cell",
    sudokuCellLabel: "Sudoku cell",
    games: {
      reaction: {
        indexLabel: "Game 01",
        badgeLabel: "Game 01",
        name: "Pulse Grid",
        nav: "45-second combo sprint",
        description: "Clear glowing tiles fast, avoid traps, and push for the cleanest score run.",
        rankingContext: "Pulse Grid local top 10",
        startIdle: "Start Run",
        startRestart: "Restart Run",
        saveLabel: "Save your Pulse Grid run",
        saveHintDefault: "Pulse Grid scores are stored in this browser via localStorage.",
        saveHintResult: (score, accuracy) => `Scored ${score} with ${formatAccuracy(accuracy)} accuracy. Save it to the local leaderboard.`,
        statusReady: "Choose Pulse Grid and start a run.",
        statusStarted: "Run started. Keep the rhythm and prioritize glowing targets.",
        statusMissed: "You missed a score tile. Combo reset.",
        statusMistake: "Empty tap. Rhythm broken.",
        statusRift: "You hit a Rift. Score penalty and combo reset.",
        statusHit: (label, combo) => `Hit ${label}. Combo ${combo}.`,
        endGameSave: (score) => `Round over. Score ${score}. You can save it to the local leaderboard.`,
        endGameNoSave: (score) => `Round over. Score ${score}. It did not enter the current local top 10.`,
        saveSuccess: (count) => `Pulse Grid score saved. ${count} local record${count === 1 ? "" : "s"} stored.`,
        clearEmpty: "There is no Pulse Grid leaderboard to clear.",
        clearConfirm: "Clear the Pulse Grid leaderboard stored in this browser?",
        clearDone: "Pulse Grid leaderboard cleared.",
        noRanking: "No Pulse Grid runs saved yet. Set the first score.",
        rankingMeta: (accuracy, bestCombo, date) => `${formatAccuracy(accuracy)} · Combo ${bestCombo} · ${date}`,
        hudLabels: ["Score", "Combo", "Accuracy", "Time"],
        tags: ["45s sprint", "Combo scaling", "Trap tiles"],
        rules: [
          "<strong>Pulse</strong> is the standard score tile. Faster reactions grant more points.",
          "<strong>Echo</strong> expires faster but pays out more score per hit.",
          "<strong>Rift</strong> is a trap. Hitting it costs points and resets your combo.",
          "Missing a score tile also breaks rhythm and lowers your accuracy.",
        ],
      },
      ttt: {
        indexLabel: "Game 02",
        badgeLabel: "Game 02",
        name: "Tic-Tac-Toe",
        nav: "Beat the bot, rank by clean wins",
        description: "Play as X against a quick bot. Faster wins score higher, while draws still earn a smaller result.",
        rankingContext: "Tic-Tac-Toe local top 10",
        startIdle: "New Match",
        startRestart: "Reset Match",
        saveLabel: "Save your Tic-Tac-Toe result",
        saveHintDefault: "Tic-Tac-Toe results are stored in this browser via localStorage.",
        saveHintResult: (score, outcomeLabel, turns) => `Match score ${score}. ${outcomeLabel} in ${turns} turns. Save it to the local leaderboard.`,
        statusReady: "Start a Tic-Tac-Toe match. You play as X.",
        statusTurn: "Your turn. Place X.",
        statusBot: "Bot thinking...",
        statusWinSave: (score, turns) => `You win in ${turns} turns. Score ${score}. This result can be saved.`,
        statusWinNoSave: (score, turns) => `You win in ${turns} turns. Score ${score}. It did not enter the current local top 10.`,
        statusDrawSave: (score, turns) => `Draw in ${turns} turns. Score ${score}. This result can be saved.`,
        statusDrawNoSave: (score, turns) => `Draw in ${turns} turns. Score ${score}. It did not enter the current local top 10.`,
        statusLose: "The bot wins this round. Reset to try again.",
        saveSuccess: (count) => `Tic-Tac-Toe result saved. ${count} local record${count === 1 ? "" : "s"} stored.`,
        clearEmpty: "There is no Tic-Tac-Toe leaderboard to clear.",
        clearConfirm: "Clear the Tic-Tac-Toe leaderboard stored in this browser?",
        clearDone: "Tic-Tac-Toe leaderboard cleared.",
        noRanking: "No Tic-Tac-Toe results saved yet. Win or draw a match to start the board.",
        rankingMeta: (outcomeLabel, turns, date) => `${outcomeLabel} · ${turns} turns · ${date}`,
        outcomeWin: "Win",
        outcomeDraw: "Draw",
        outcomeLoss: "Loss",
        hudLabels: ["Wins", "Draws", "Losses", "Turns"],
        tags: ["You are X", "Smart bot", "Fast wins score more"],
        rules: [
          "You always play as <strong>X</strong> and move first.",
          "The bot looks for wins, blocks threats, and takes the center when possible.",
          "A quick win scores the most. Draws score less, and losses do not enter the ranking.",
          "Use reset to start a fresh board whenever the current match is over.",
        ],
      },
      sudoku: {
        indexLabel: "Game 03",
        badgeLabel: "Game 03",
        name: "Sudoku",
        nav: "4 difficulties, digit highlight",
        description: "Solve a classic 9x9 grid across four difficulty levels. Click a digit to highlight every matching number already placed on the board.",
        rankingContext: (difficultyLabel) => `Sudoku ${difficultyLabel} local top 10`,
        startIdle: "New Puzzle",
        startRestart: "Restart Puzzle",
        saveLabel: "Save your Sudoku result",
        saveHintDefault: (difficultyLabel) => `${difficultyLabel} Sudoku records are stored in this browser via localStorage.`,
        saveHintResult: (difficultyLabel, time, mistakes) => `Solved ${difficultyLabel} in ${time} with ${mistakes} mistake${mistakes === 1 ? "" : "s"}. Save it to the leaderboard.`,
        statusReady: (difficultyLabel) => `Choose a ${difficultyLabel} Sudoku puzzle and start solving.`,
        statusStarted: (difficultyLabel) => `${difficultyLabel} puzzle ready. Click a digit to highlight matching numbers, then fill the grid.`,
        statusMistake: (value, mistakes) => `${value} does not fit there. Mistakes ${mistakes}.`,
        statusSolvedSave: (time, mistakes) => `Puzzle solved in ${time} with ${mistakes} mistake${mistakes === 1 ? "" : "s"}. This run can be saved.`,
        statusSolvedNoSave: (time, mistakes) => `Puzzle solved in ${time} with ${mistakes} mistake${mistakes === 1 ? "" : "s"}. It did not enter the current top 10.`,
        saveSuccess: (count) => `Sudoku result saved. ${count} local record${count === 1 ? "" : "s"} stored for this difficulty.`,
        clearEmpty: "There is no Sudoku leaderboard to clear for this difficulty.",
        clearConfirm: (difficultyLabel) => `Clear the ${difficultyLabel} Sudoku leaderboard stored in this browser?`,
        clearDone: "Sudoku leaderboard cleared for the current difficulty.",
        noRanking: (difficultyLabel) => `No ${difficultyLabel} Sudoku runs saved yet.`,
        rankingMeta: (mistakes, date) => `${mistakes} mistake${mistakes === 1 ? "" : "s"} · ${date}`,
        hudLabels: ["Difficulty", "Filled", "Mistakes", "Time"],
        tags: ["4 difficulties", "Digit highlight", "Local ranking"],
        rules: [
          "Choose between Easy, Medium, Hard, and Expert before starting a puzzle.",
          "Click a digit such as <strong>2</strong> on the keypad to highlight every matching number already filled on the grid.",
          "Only editable cells can be changed. Wrong entries do not stay on the board and increase your mistake count.",
          "Rankings are stored separately for each difficulty and sorted by fastest clear time.",
        ],
        difficultyOptions: {
          easy: "Easy",
          medium: "Medium",
          hard: "Hard",
          expert: "Expert",
        },
        subtitle: "Click a digit to highlight every matching number already placed on the board.",
        eraseLabel: "Erase",
      },
    },
  },
  zh: {
    htmlLang: "zh-CN",
    pageTitle: "Flux Grid Arcade",
    metaDescription: "一个适合 GitHub Pages 的多游戏静态街机站点，内置多个本地排行榜。",
    eyebrow: "GitHub Pages Ready",
    hubTitle: "Flux Grid Arcade",
    lead: "一个带本地排行榜的轻量浏览器街机页。你可以在快节奏反应挑战、策略型井字棋和多难度数独之间切换。",
    gamesTitle: "游戏库",
    gamesIntro: "不离开页面就可以切换不同的排行榜小游戏。",
    rulesTitle: "玩法说明",
    rankingTitle: "排行榜",
    clearRanking: "清空榜单",
    saveButton: "保存",
    namePlaceholder: "输入昵称",
    footerNote: "纯静态街机项目，可直接部署到 GitHub Pages。每个游戏都会在当前浏览器里维护自己的本地排行榜。",
    pulseName: "Pulse",
    echoName: "Echo",
    riftName: "Rift",
    tttMarkX: "X",
    tttMarkO: "O",
    recent: "最近",
    cellLabel: "格子",
    tttCellLabel: "井字棋格",
    sudokuCellLabel: "数独格",
    games: {
      reaction: {
        indexLabel: "游戏 01",
        badgeLabel: "游戏 01",
        name: "Pulse Grid",
        nav: "45 秒连击冲分",
        description: "快速清掉发光方块，避开陷阱，把单局分数和节奏都打到最好。",
        rankingContext: "Pulse Grid 本地前 10",
        startIdle: "开始冲分",
        startRestart: "重新开始",
        saveLabel: "保存 Pulse Grid 成绩",
        saveHintDefault: "Pulse Grid 成绩会保存在当前浏览器的 localStorage 中。",
        saveHintResult: (score, accuracy) => `本局 ${score} 分，命中率 ${formatAccuracy(accuracy)}。可保存到本地排行榜。`,
        statusReady: "选择 Pulse Grid 后开始一局冲分。",
        statusStarted: "挑战已开始，保持节奏，优先点击亮块。",
        statusMissed: "漏掉了得分块，连击已中断。",
        statusMistake: "空拍，节奏被打断。",
        statusRift: "踩到 Rift，扣分并清空连击。",
        statusHit: (label, combo) => `命中 ${label}，当前连击 ${combo}。`,
        endGameSave: (score) => `本局结束，得分 ${score}。可以写入本地排行榜。`,
        endGameNoSave: (score) => `本局结束，得分 ${score}。未进入当前本地前 10。`,
        saveSuccess: (count) => `Pulse Grid 成绩已保存，当前共有 ${count} 条本地记录。`,
        clearEmpty: "当前没有可清空的 Pulse Grid 榜单。",
        clearConfirm: "清空当前浏览器里的 Pulse Grid 本地排行榜？",
        clearDone: "Pulse Grid 本地排行榜已清空。",
        noRanking: "还没有 Pulse Grid 记录，先打一局。",
        rankingMeta: (accuracy, bestCombo, date) => `${formatAccuracy(accuracy)} · 连击 ${bestCombo} · ${date}`,
        hudLabels: ["分数", "连击", "命中率", "时间"],
        tags: ["45 秒冲刺", "连击倍率", "陷阱方块"],
        rules: [
          "<strong>Pulse</strong> 是基础得分块，反应越快加分越多。",
          "<strong>Echo</strong> 生存时间更短，但单次得分更高。",
          "<strong>Rift</strong> 是陷阱，点到会掉分并清空连击。",
          "漏掉可得分目标也会打断节奏，影响命中率。",
        ],
      },
      ttt: {
        indexLabel: "游戏 02",
        badgeLabel: "游戏 02",
        name: "井字棋",
        nav: "和机器人对局并争榜",
        description: "你使用 X 与机器人对战。赢得越快分数越高，平局也会获得较低分。",
        rankingContext: "井字棋本地前 10",
        startIdle: "新对局",
        startRestart: "重开棋盘",
        saveLabel: "保存井字棋结果",
        saveHintDefault: "井字棋结果会保存在当前浏览器的 localStorage 中。",
        saveHintResult: (score, outcomeLabel, turns) => `本局 ${score} 分，结果为${outcomeLabel}，共 ${turns} 步。可保存到本地排行榜。`,
        statusReady: "开始一局井字棋。你使用 X 先手。",
        statusTurn: "轮到你，下一个 X。",
        statusBot: "机器人正在思考。",
        statusWinSave: (score, turns) => `你在 ${turns} 步内获胜，得分 ${score}。本局可以保存。`,
        statusWinNoSave: (score, turns) => `你在 ${turns} 步内获胜，得分 ${score}。但未进入当前本地前 10。`,
        statusDrawSave: (score, turns) => `本局 ${turns} 步战平，得分 ${score}。本局可以保存。`,
        statusDrawNoSave: (score, turns) => `本局 ${turns} 步战平，得分 ${score}。但未进入当前本地前 10。`,
        statusLose: "本局被机器人拿下了，重开再试一次。",
        saveSuccess: (count) => `井字棋结果已保存，当前共有 ${count} 条本地记录。`,
        clearEmpty: "当前没有可清空的井字棋榜单。",
        clearConfirm: "清空当前浏览器里的井字棋本地排行榜？",
        clearDone: "井字棋本地排行榜已清空。",
        noRanking: "还没有井字棋记录，先赢或平一局。",
        rankingMeta: (outcomeLabel, turns, date) => `${outcomeLabel} · ${turns} 步 · ${date}`,
        outcomeWin: "胜",
        outcomeDraw: "平",
        outcomeLoss: "负",
        hudLabels: ["胜场", "平局", "败场", "步数"],
        tags: ["你是 X", "机器人会挡", "快胜分更高"],
        rules: [
          "你固定使用 <strong>X</strong>，而且总是先手。",
          "机器人会优先找胜招、挡威胁，并在合适时拿中心格。",
          "快速获胜得分最高，平局也有较低分，失败不会进入排行榜。",
          "当前对局结束后可以直接重开一盘。",
        ],
      },
      sudoku: {
        indexLabel: "游戏 03",
        badgeLabel: "游戏 03",
        name: "数独",
        nav: "4 个难度，数字联动高亮",
        description: "在 9x9 经典数独盘面中选择四档难度。点击某个数字，会高亮棋盘中所有已填入的相同数字。",
        rankingContext: (difficultyLabel) => `数独 ${difficultyLabel} 本地前 10`,
        startIdle: "新题目",
        startRestart: "重新开题",
        saveLabel: "保存数独结果",
        saveHintDefault: (difficultyLabel) => `${difficultyLabel} 数独成绩会保存在当前浏览器的 localStorage 中。`,
        saveHintResult: (difficultyLabel, time, mistakes) => `${difficultyLabel} 难度完成用时 ${time}，失误 ${mistakes} 次。可保存到本地排行榜。`,
        statusReady: (difficultyLabel) => `选择 ${difficultyLabel} 难度后开始解题。`,
        statusStarted: (difficultyLabel) => `${difficultyLabel} 题目已载入。点击数字可高亮全盘相同数字，再填入空格。`,
        statusMistake: (value, mistakes) => `${value} 不能填在这里。当前失误 ${mistakes} 次。`,
        statusSolvedSave: (time, mistakes) => `已完成本题，用时 ${time}，失误 ${mistakes} 次。本局可以保存。`,
        statusSolvedNoSave: (time, mistakes) => `已完成本题，用时 ${time}，失误 ${mistakes} 次，但未进入当前前 10。`,
        saveSuccess: (count) => `数独成绩已保存，该难度当前共有 ${count} 条本地记录。`,
        clearEmpty: "当前难度下没有可清空的数独榜单。",
        clearConfirm: (difficultyLabel) => `清空当前浏览器里的 ${difficultyLabel} 数独本地排行榜？`,
        clearDone: "当前难度的数独排行榜已清空。",
        noRanking: (difficultyLabel) => `还没有 ${difficultyLabel} 数独记录。`,
        rankingMeta: (mistakes, date) => `失误 ${mistakes} 次 · ${date}`,
        hudLabels: ["难度", "已填", "失误", "时间"],
        tags: ["4 个难度", "数字高亮", "独立榜单"],
        rules: [
          "开始前可选择简单、中等、困难、专家四个难度。",
          "点击数字键，例如 <strong>2</strong>，会高亮棋盘上所有已经填入的 2。",
          "只有可编辑空格能被修改。错误输入不会保留在棋盘上，但会增加失误次数。",
          "排行榜按难度分别保存，并按最短完成时间排序。",
        ],
        difficultyOptions: {
          easy: "简单",
          medium: "中等",
          hard: "困难",
          expert: "专家",
        },
        subtitle: "点击数字即可高亮棋盘中所有已出现的相同数字。",
        eraseLabel: "清除",
      },
    },
  },
  ja: {
    htmlLang: "ja",
    pageTitle: "Flux Grid Arcade",
    metaDescription: "GitHub Pages 向けのマルチゲーム静的アーケード。各ゲームにローカルランキングがあります。",
    eyebrow: "GitHub Pages Ready",
    hubTitle: "Flux Grid Arcade",
    lead: "ローカルランキング付きの軽量ブラウザアーケードです。高速な反応ゲーム、戦略型の三目並べ、4 段階難易度の数独を切り替えて遊べます。",
    gamesTitle: "ゲーム一覧",
    gamesIntro: "ページを離れずにランキング対応のミニゲームを切り替えられます。",
    rulesTitle: "遊び方",
    rankingTitle: "ランキング",
    clearRanking: "クリア",
    saveButton: "保存",
    namePlaceholder: "名前を入力",
    footerNote: "GitHub Pages 向けの静的アーケードです。各ゲームはこのブラウザ内に個別のローカルランキングを保持します。",
    pulseName: "Pulse",
    echoName: "Echo",
    riftName: "Rift",
    tttMarkX: "X",
    tttMarkO: "O",
    recent: "最近",
    cellLabel: "セル",
    tttCellLabel: "三目並べセル",
    sudokuCellLabel: "数独セル",
    games: {
      reaction: {
        indexLabel: "Game 01",
        badgeLabel: "Game 01",
        name: "Pulse Grid",
        nav: "45 秒コンボスプリント",
        description: "光るタイルを素早く処理し、トラップを避けながら最高スコアを狙います。",
        rankingContext: "Pulse Grid ローカル Top 10",
        startIdle: "ラン開始",
        startRestart: "やり直し",
        saveLabel: "Pulse Grid の結果を保存",
        saveHintDefault: "Pulse Grid のスコアはこのブラウザの localStorage に保存されます。",
        saveHintResult: (score, accuracy) => `今回のスコアは ${score}、精度は ${formatAccuracy(accuracy)} です。ローカルランキングに保存できます。`,
        statusReady: "Pulse Grid を選んでランを開始してください。",
        statusStarted: "ラン開始。リズムを保って光るタイルを優先してください。",
        statusMissed: "得点タイルを逃しました。コンボがリセットされました。",
        statusMistake: "空振りです。リズムが崩れました。",
        statusRift: "Rift に触れました。減点され、コンボもリセットされました。",
        statusHit: (label, combo) => `${label} をヒット。現在 ${combo} コンボ。`,
        endGameSave: (score) => `ラウンド終了。スコア ${score}。ローカルランキングに保存できます。`,
        endGameNoSave: (score) => `ラウンド終了。スコア ${score}。現在のローカル Top 10 には入りませんでした。`,
        saveSuccess: (count) => `Pulse Grid の結果を保存しました。現在 ${count} 件のローカル記録があります。`,
        clearEmpty: "削除できる Pulse Grid ランキングがありません。",
        clearConfirm: "このブラウザに保存された Pulse Grid ランキングを削除しますか?",
        clearDone: "Pulse Grid ランキングを削除しました。",
        noRanking: "まだ Pulse Grid の記録がありません。最初のスコアを出してください。",
        rankingMeta: (accuracy, bestCombo, date) => `${formatAccuracy(accuracy)} · コンボ ${bestCombo} · ${date}`,
        hudLabels: ["スコア", "コンボ", "精度", "時間"],
        tags: ["45 秒", "コンボ倍率", "トラップ"],
        rules: [
          "<strong>Pulse</strong> は基本得点タイルです。反応が速いほど多く加点されます。",
          "<strong>Echo</strong> は消えるのが速い代わりに、1 回の得点が高めです。",
          "<strong>Rift</strong> はトラップです。触れると減点され、コンボがリセットされます。",
          "得点タイルを逃してもリズムが崩れ、精度が下がります。",
        ],
      },
      ttt: {
        indexLabel: "Game 02",
        badgeLabel: "Game 02",
        name: "Tic-Tac-Toe",
        nav: "ボット戦でスコアを狙う",
        description: "あなたは X としてボットと対戦します。速く勝つほど高得点になり、引き分けでも少し得点できます。",
        rankingContext: "Tic-Tac-Toe ローカル Top 10",
        startIdle: "新しい対局",
        startRestart: "盤面リセット",
        saveLabel: "Tic-Tac-Toe の結果を保存",
        saveHintDefault: "Tic-Tac-Toe の結果はこのブラウザの localStorage に保存されます。",
        saveHintResult: (score, outcomeLabel, turns) => `今回のスコアは ${score}、結果は ${outcomeLabel}、手数は ${turns} です。ローカルランキングに保存できます。`,
        statusReady: "三目並べを開始します。あなたは X で先手です。",
        statusTurn: "あなたの手番です。X を置いてください。",
        statusBot: "ボットが考えています。",
        statusWinSave: (score, turns) => `${turns} 手で勝利。スコア ${score}。この結果は保存できます。`,
        statusWinNoSave: (score, turns) => `${turns} 手で勝利。スコア ${score}。ただし現在のローカル Top 10 には入りませんでした。`,
        statusDrawSave: (score, turns) => `${turns} 手で引き分け。スコア ${score}。この結果は保存できます。`,
        statusDrawNoSave: (score, turns) => `${turns} 手で引き分け。スコア ${score}。ただし現在のローカル Top 10 には入りませんでした。`,
        statusLose: "このラウンドはボットの勝ちです。リセットして再挑戦してください。",
        saveSuccess: (count) => `Tic-Tac-Toe の結果を保存しました。現在 ${count} 件のローカル記録があります。`,
        clearEmpty: "削除できる Tic-Tac-Toe ランキングがありません。",
        clearConfirm: "このブラウザに保存された Tic-Tac-Toe ランキングを削除しますか?",
        clearDone: "Tic-Tac-Toe ランキングを削除しました。",
        noRanking: "まだ Tic-Tac-Toe の記録がありません。勝利または引き分けで盤面を埋めてください。",
        rankingMeta: (outcomeLabel, turns, date) => `${outcomeLabel} · ${turns} 手 · ${date}`,
        outcomeWin: "勝ち",
        outcomeDraw: "引き分け",
        outcomeLoss: "負け",
        hudLabels: ["勝ち", "引き分け", "負け", "手数"],
        tags: ["あなたは X", "ボットは防ぐ", "速い勝利ほど高得点"],
        rules: [
          "あなたは常に <strong>X</strong> を使い、先手で始まります。",
          "ボットは勝ち筋を探し、脅威を防ぎ、必要なら中央を優先します。",
          "速い勝利ほど高得点です。引き分けは少し得点でき、負けはランキング対象外です。",
          "対局終了後はそのまま新しい盤面を始められます。",
        ],
      },
      sudoku: {
        indexLabel: "Game 03",
        badgeLabel: "Game 03",
        name: "Sudoku",
        nav: "4 難易度、数字ハイライト",
        description: "4 段階の難易度で 9x9 の数独を解きます。数字をクリックすると、盤面上の同じ数字がすべて強調表示されます。",
        rankingContext: (difficultyLabel) => `Sudoku ${difficultyLabel} ローカル Top 10`,
        startIdle: "新しい問題",
        startRestart: "問題をやり直す",
        saveLabel: "Sudoku の結果を保存",
        saveHintDefault: (difficultyLabel) => `${difficultyLabel} の Sudoku 記録はこのブラウザの localStorage に保存されます。`,
        saveHintResult: (difficultyLabel, time, mistakes) => `${difficultyLabel} を ${time} でクリアし、ミスは ${mistakes} 回でした。ローカルランキングに保存できます。`,
        statusReady: (difficultyLabel) => `${difficultyLabel} の Sudoku を選んで開始してください。`,
        statusStarted: (difficultyLabel) => `${difficultyLabel} の問題を読み込みました。数字をクリックして同じ数字を強調表示し、空欄を埋めてください。`,
        statusMistake: (value, mistakes) => `${value} はそこに入りません。ミスは ${mistakes} 回です。`,
        statusSolvedSave: (time, mistakes) => `${time} でクリア、ミス ${mistakes} 回。この結果は保存できます。`,
        statusSolvedNoSave: (time, mistakes) => `${time} でクリア、ミス ${mistakes} 回。ただし現在の Top 10 には入りませんでした。`,
        saveSuccess: (count) => `Sudoku の結果を保存しました。この難易度には現在 ${count} 件のローカル記録があります。`,
        clearEmpty: "この難易度で削除できる Sudoku ランキングはありません。",
        clearConfirm: (difficultyLabel) => `このブラウザに保存された ${difficultyLabel} の Sudoku ランキングを削除しますか?`,
        clearDone: "現在の難易度の Sudoku ランキングを削除しました。",
        noRanking: (difficultyLabel) => `${difficultyLabel} の Sudoku 記録はまだありません。`,
        rankingMeta: (mistakes, date) => `ミス ${mistakes} 回 · ${date}`,
        hudLabels: ["難易度", "入力数", "ミス", "時間"],
        tags: ["4 難易度", "数字ハイライト", "難易度別ランキング"],
        rules: [
          "Easy、Medium、Hard、Expert の 4 段階から難易度を選べます。",
          "数字キー、たとえば <strong>2</strong> をクリックすると、盤面に入力済みの 2 がすべてハイライトされます。",
          "編集できるのは空欄だけです。誤入力は盤面に残りませんが、ミス数は増えます。",
          "ランキングは難易度ごとに分かれており、最短クリア時間順で並びます。",
        ],
        difficultyOptions: {
          easy: "Easy",
          medium: "Medium",
          hard: "Hard",
          expert: "Expert",
        },
        subtitle: "数字をクリックすると、盤面上の同じ数字がすべて強調表示されます。",
        eraseLabel: "消去",
      },
    },
  },
};

const arena = document.querySelector("#arena");
const reactionCells = Array.from(document.querySelectorAll("[data-cell]"));
const tttBoard = document.querySelector("#ttt-board");
const sudokuBoard = document.querySelector("#sudoku-board");
const sudokuKeypad = document.querySelector("#sudoku-keypad");
initializeSudokuUi();
const tttCells = Array.from(document.querySelectorAll("[data-ttt-cell]"));
const sudokuCells = Array.from(document.querySelectorAll("[data-sudoku-cell]"));
const sudokuKeys = Array.from(document.querySelectorAll("[data-sudoku-value]"));
const sudokuDifficultyButtons = Array.from(document.querySelectorAll("[data-sudoku-difficulty]"));
const startButton = document.querySelector("#start-button");
const statusText = document.querySelector("#status-text");
const saveForm = document.querySelector("#save-form");
const saveLabel = document.querySelector("#save-label");
const playerNameInput = document.querySelector("#player-name");
const saveHint = document.querySelector("#save-hint");
const clearRankingButton = document.querySelector("#clear-ranking");
const rankingList = document.querySelector("#ranking-list");
const rankingContext = document.querySelector("#ranking-context");
const rulesList = document.querySelector("#rules-list");
const reactionView = document.querySelector("#reaction-view");
const tttView = document.querySelector("#ttt-view");
const sudokuView = document.querySelector("#sudoku-view");
const sudokuSubtitle = document.querySelector("#sudoku-subtitle");
const statLabels = [1, 2, 3, 4].map((index) => document.querySelector(`#stat-label-${index}`));
const statValues = [1, 2, 3, 4].map((index) => document.querySelector(`#stat-value-${index}`));
const gameBadge = document.querySelector("#game-badge");
const gameTitle = document.querySelector("#game-title");
const gameDescription = document.querySelector("#game-description");
const gameTagElements = [1, 2, 3].map((index) => document.querySelector(`#game-tag-${index}`));
const gameButtons = Array.from(document.querySelectorAll("[data-game]"));
const langButtons = Array.from(document.querySelectorAll("[data-lang]"));
const metaDescription = document.querySelector("#meta-description");
const metaOgDescription = document.querySelector("#meta-og-description");

let activeGame = loadActiveGame();
let currentLanguage = loadLanguage();
let leaderboards = {
  reaction: loadReactionLeaderboard(),
  ttt: loadTttLeaderboard(),
  sudoku: loadSudokuLeaderboard(),
};
let animationFrameId = 0;
let reactionState = createReactionState();
let tttState = createTttState();
let sudokuState = createSudokuState();

playerNameInput.value = localStorage.getItem(STORAGE_KEYS.playerName) ?? "";
setGameStatus("sudoku", "statusReady", getSudokuDifficultyLabel());
setGameSaveHint("sudoku", "saveHintDefault", getSudokuDifficultyLabel());

applyLanguage(currentLanguage);
renderActiveGame();

startButton.addEventListener("click", handleStartButton);
clearRankingButton.addEventListener("click", handleClearLeaderboard);
saveForm.addEventListener("submit", handleSaveScore);
arena.addEventListener("click", handleReactionClick);
tttBoard.addEventListener("click", handleTttClick);
sudokuBoard.addEventListener("click", handleSudokuCellClick);
sudokuKeypad.addEventListener("click", handleSudokuKeyClick);
sudokuDifficultyButtons.forEach((button) => button.addEventListener("click", handleSudokuDifficultyChange));
gameButtons.forEach((button) => button.addEventListener("click", handleGameSwitch));
langButtons.forEach((button) => button.addEventListener("click", handleLanguageChange));

window.addEventListener("keydown", (event) => {
  if (event.code !== "Space" || document.activeElement === playerNameInput) {
    return;
  }

  event.preventDefault();
  if (!isGameRunning(activeGame)) {
    handleStartButton();
  }
});

function createReactionState() {
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
    pendingResult: null,
    statusKey: "statusReady",
    statusArgs: [],
    saveHintKey: "saveHintDefault",
    saveHintArgs: [],
    tiles: Array.from({ length: GRID_SIZE }, () => inactiveReactionTile()),
  };
}

function createTttState(previous = {}) {
  return {
    board: Array(9).fill(""),
    running: false,
    finished: false,
    botThinking: false,
    moves: 0,
    wins: previous.wins ?? 0,
    draws: previous.draws ?? 0,
    losses: previous.losses ?? 0,
    lastScore: previous.lastScore ?? 0,
    pendingResult: previous.pendingResult ?? null,
    statusKey: previous.statusKey ?? "statusReady",
    statusArgs: previous.statusArgs ?? [],
    saveHintKey: previous.saveHintKey ?? "saveHintDefault",
    saveHintArgs: previous.saveHintArgs ?? [],
    botTimerId: 0,
  };
}

function createSudokuState(previous = {}) {
  return {
    difficulty: previous.difficulty ?? "easy",
    board: Array(81).fill(0),
    givens: Array(81).fill(false),
    solution: Array(81).fill(0),
    running: false,
    completed: false,
    selectedCell: -1,
    selectedNumber: 0,
    mistakes: 0,
    filledCount: 0,
    elapsedMs: 0,
    startedAtMs: 0,
    pendingResult: null,
    statusKey: previous.statusKey ?? "statusReady",
    statusArgs: previous.statusArgs ?? [],
    saveHintKey: previous.saveHintKey ?? "saveHintDefault",
    saveHintArgs: previous.saveHintArgs ?? [],
    invalidCell: -1,
    timerId: 0,
  };
}

function inactiveReactionTile(feedback = "") {
  return {
    active: false,
    kind: null,
    bornAt: 0,
    expiresAt: 0,
    feedback,
  };
}

function handleStartButton() {
  if (activeGame === "reaction") {
    startReactionGame();
    return;
  }

  if (activeGame === "sudoku") {
    startSudokuGame();
    return;
  }

  startTttGame();
}

function handleGameSwitch(event) {
  const nextGame = event.currentTarget.dataset.game;
  if (!SUPPORTED_GAMES.includes(nextGame) || nextGame === activeGame) {
    return;
  }

  deactivateGame(activeGame);
  activeGame = nextGame;
  localStorage.setItem(STORAGE_KEYS.activeGame, activeGame);
  renderActiveGame();
}
function deactivateGame(gameId) {
  if (gameId === "reaction" && reactionState.running) {
    cancelAnimationFrame(animationFrameId);
    reactionState = createReactionState();
  }

  if (gameId === "ttt" && (tttState.running || tttState.botThinking)) {
    clearTimeout(tttState.botTimerId);
    tttState = createTttState(tttState);
  }

  if (gameId === "sudoku" && !sudokuState.running) {
    clearInterval(sudokuState.timerId);
  }
}

function handleLanguageChange(event) {
  const language = event.currentTarget.dataset.lang;
  if (!SUPPORTED_LANGUAGES.includes(language) || language === currentLanguage) {
    return;
  }

  currentLanguage = language;
  localStorage.setItem(STORAGE_KEYS.language, currentLanguage);
  applyLanguage(currentLanguage);
}

function applyLanguage(language) {
  const copy = I18N[language];

  document.documentElement.lang = copy.htmlLang;
  document.title = copy.pageTitle;
  metaDescription.setAttribute("content", copy.metaDescription);
  metaOgDescription.setAttribute("content", copy.metaDescription);
  playerNameInput.setAttribute("placeholder", copy.namePlaceholder);

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = copy[element.dataset.i18n];
  });

  langButtons.forEach((button) => {
    const isActive = button.dataset.lang === currentLanguage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  renderGameMenu();
  renderActiveGame();
  renderReactionArena(performance.now());
  renderTttBoard();
  renderSudokuBoard();
  renderSudokuControls();
}

function renderGameMenu() {
  const copy = I18N[currentLanguage].games;

  gameButtons.forEach((button) => {
    const gameId = button.dataset.game;
    const config = copy[gameId];

    button.querySelector(".game-choice-index").textContent = config.indexLabel;
    button.querySelector(".game-choice-title").textContent = config.name;
    button.querySelector(".game-choice-desc").textContent = config.nav;
    button.classList.toggle("is-active", gameId === activeGame);
    button.setAttribute("aria-pressed", String(gameId === activeGame));
  });
}

function renderActiveGame() {
  const config = getGameCopy(activeGame);

  reactionView.hidden = activeGame !== "reaction";
  tttView.hidden = activeGame !== "ttt";
  sudokuView.hidden = activeGame !== "sudoku";
  gameBadge.textContent = config.badgeLabel;
  gameTitle.textContent = config.name;
  gameDescription.textContent = config.description;
  rankingContext.textContent = activeGame === "sudoku"
    ? resolveGameMessage("sudoku", "rankingContext", getSudokuDifficultyLabel())
    : config.rankingContext;
  saveLabel.textContent = typeof config.saveLabel === "function" ? config.saveLabel() : config.saveLabel;
  if (activeGame === "sudoku") {
    sudokuSubtitle.textContent = config.subtitle;
  }

  config.tags.forEach((tag, index) => {
    if (gameTagElements[index]) {
      gameTagElements[index].textContent = tag;
    }
  });

  rulesList.innerHTML = config.rules.map((rule) => `<li>${rule}</li>`).join("");
  saveForm.hidden = getActiveState().pendingResult === null;

  renderStatus();
  renderSaveHint();
  updateStartButtonLabel();
  updateHud(performance.now());
  renderLeaderboard();
  renderReactionArena(performance.now());
  renderTttBoard();
  renderSudokuBoard();
  renderSudokuControls();
}

function renderStatus() {
  const state = getActiveState();

  if (activeGame === "sudoku" && (state.statusKey === "statusReady" || state.statusKey === "statusStarted")) {
    statusText.textContent = resolveGameMessage("sudoku", state.statusKey, getSudokuDifficultyLabel());
    return;
  }

  statusText.textContent = resolveGameMessage(activeGame, state.statusKey, ...state.statusArgs);
}

function renderSaveHint() {
  const state = getActiveState();

  if (activeGame === "sudoku" && state.saveHintKey === "saveHintDefault") {
    saveHint.textContent = resolveGameMessage("sudoku", "saveHintDefault", getSudokuDifficultyLabel());
    return;
  }

  if (activeGame === "sudoku" && state.saveHintKey === "saveHintResult") {
    saveHint.textContent = resolveGameMessage("sudoku", "saveHintResult", getSudokuDifficultyLabel(), state.saveHintArgs[1], state.saveHintArgs[2]);
    return;
  }

  saveHint.textContent = resolveGameMessage(activeGame, state.saveHintKey, ...state.saveHintArgs);
}

function updateStartButtonLabel() {
  const config = getGameCopy(activeGame);
  startButton.textContent = hasGameActivity(activeGame) ? config.startRestart : config.startIdle;
}

function updateHud(now) {
  const config = getGameCopy(activeGame);
  config.hudLabels.forEach((label, index) => {
    statLabels[index].textContent = label;
  });

  if (activeGame === "reaction") {
    const remainingMs = reactionState.running ? Math.max(0, reactionState.endAt - now) : reactionState.pendingResult ? 0 : ROUND_DURATION_MS;
    statValues[0].textContent = String(reactionState.score);
    statValues[1].textContent = String(reactionState.combo);
    statValues[2].textContent = formatAccuracy(getReactionAccuracy());
    statValues[3].textContent = `${(remainingMs / 1000).toFixed(1)}s`;
    return;
  }

  if (activeGame === "ttt") {
    statValues[0].textContent = String(tttState.wins);
    statValues[1].textContent = String(tttState.draws);
    statValues[2].textContent = String(tttState.losses);
    statValues[3].textContent = String(tttState.moves);
    return;
  }

  statValues[0].textContent = getSudokuDifficultyLabel();
  statValues[1].textContent = `${sudokuState.filledCount}/81`;
  statValues[2].textContent = String(sudokuState.mistakes);
  statValues[3].textContent = formatDuration(getSudokuElapsedMs());
}

function setGameStatus(gameId, key, ...args) {
  if (gameId === "reaction") {
    reactionState.statusKey = key;
    reactionState.statusArgs = args;
  } else if (gameId === "ttt") {
    tttState.statusKey = key;
    tttState.statusArgs = args;
  } else {
    sudokuState.statusKey = key;
    sudokuState.statusArgs = args;
  }

  if (gameId === activeGame) {
    renderStatus();
  }
}

function setGameSaveHint(gameId, key, ...args) {
  if (gameId === "reaction") {
    reactionState.saveHintKey = key;
    reactionState.saveHintArgs = args;
  } else if (gameId === "ttt") {
    tttState.saveHintKey = key;
    tttState.saveHintArgs = args;
  } else {
    sudokuState.saveHintKey = key;
    sudokuState.saveHintArgs = args;
  }

  if (gameId === activeGame) {
    renderSaveHint();
  }
}

function startReactionGame() {
  cancelAnimationFrame(animationFrameId);
  reactionState = createReactionState();

  const now = performance.now();
  reactionState.running = true;
  reactionState.startAt = now;
  reactionState.endAt = now + ROUND_DURATION_MS;
  reactionState.nextSpawnAt = now + 250;

  playerNameInput.value = localStorage.getItem(STORAGE_KEYS.playerName) ?? "";
  saveForm.hidden = true;
  setGameStatus("reaction", "statusStarted");
  setGameSaveHint("reaction", "saveHintDefault");
  updateStartButtonLabel();
  renderReactionArena(now);
  updateHud(now);

  animationFrameId = requestAnimationFrame(reactionLoop);
}

function reactionLoop(now) {
  if (!reactionState.running) {
    return;
  }

  expireReactionTiles(now);
  spawnReactionTiles(now);

  if (activeGame === "reaction") {
    renderReactionArena(now);
    updateHud(now);
  }

  if (now >= reactionState.endAt) {
    finishReactionGame();
    return;
  }

  animationFrameId = requestAnimationFrame(reactionLoop);
}

function spawnReactionTiles(now) {
  if (now < reactionState.nextSpawnAt) {
    return;
  }

  const timeLeft = Math.max(0, reactionState.endAt - now);
  const activeCount = reactionState.tiles.reduce((count, tile) => count + Number(tile.active), 0);
  const targetActive = timeLeft > 28_000 ? 1 : timeLeft > 14_000 ? 2 : 3;

  if (activeCount < targetActive) {
    const freeIndexes = reactionState.tiles
      .map((tile, index) => ({ tile, index }))
      .filter(({ tile }) => !tile.active)
      .map(({ index }) => index);

    if (freeIndexes.length > 0) {
      const chosenIndex = freeIndexes[Math.floor(Math.random() * freeIndexes.length)];
      const kind = pickReactionKind();
      const config = KIND_CONFIG[kind];

      reactionState.tiles[chosenIndex] = {
        active: true,
        kind,
        bornAt: now,
        expiresAt: now + config.ttl,
        feedback: "",
      };
    }
  }

  reactionState.nextSpawnAt = now + getReactionSpawnDelay(timeLeft);
}

function getReactionSpawnDelay(timeLeft) {
  if (timeLeft > 28_000) {
    return 560;
  }
  if (timeLeft > 14_000) {
    return 410;
  }
  return 280;
}

function pickReactionKind() {
  const roll = Math.random();
  if (roll < 0.58) {
    return "pulse";
  }
  if (roll < 0.83) {
    return "echo";
  }
  return "rift";
}

function expireReactionTiles(now) {
  reactionState.tiles.forEach((tile, index) => {
    if (!tile.active || now < tile.expiresAt) {
      return;
    }

    if (tile.kind !== "rift") {
      reactionState.combo = 0;
      reactionState.misses += 1;
      setGameStatus("reaction", "statusMissed");
      reactionState.tiles[index] = inactiveReactionTile("miss");
      scheduleReactionFeedbackClear(index, "miss");
      return;
    }

    reactionState.tiles[index] = inactiveReactionTile();
  });
}

function handleReactionClick(event) {
  if (activeGame !== "reaction") {
    return;
  }

  const button = event.target.closest("[data-cell]");
  if (!button || !reactionState.running) {
    return;
  }

  const index = Number(button.dataset.cell);
  const tile = reactionState.tiles[index];
  const now = performance.now();

  if (!tile.active) {
    reactionState.mistakes += 1;
    reactionState.combo = 0;
    reactionState.score = Math.max(0, reactionState.score - 4);
    setGameStatus("reaction", "statusMistake");
    reactionState.tiles[index] = inactiveReactionTile("miss");
    scheduleReactionFeedbackClear(index, "miss");
    updateHud(now);
    renderReactionArena(now);
    return;
  }

  if (tile.kind === "rift") {
    reactionState.mistakes += 1;
    reactionState.combo = 0;
    reactionState.score = Math.max(0, reactionState.score + KIND_CONFIG.rift.baseScore);
    setGameStatus("reaction", "statusRift");
    reactionState.tiles[index] = inactiveReactionTile("miss");
    scheduleReactionFeedbackClear(index, "miss");
    updateHud(now);
    renderReactionArena(now);
    return;
  }

  const config = KIND_CONFIG[tile.kind];
  const remainingLife = Math.max(0, tile.expiresAt - now);
  const speedBonus = Math.round(remainingLife / 34);
  const comboBonus = Math.floor(reactionState.combo / 3) * 6;

  reactionState.hits += 1;
  reactionState.combo += 1;
  reactionState.bestCombo = Math.max(reactionState.bestCombo, reactionState.combo);
  reactionState.score += config.baseScore + speedBonus + comboBonus;

  setGameStatus("reaction", "statusHit", t(config.labelKey), reactionState.combo);
  reactionState.tiles[index] = inactiveReactionTile("hit");
  scheduleReactionFeedbackClear(index, "hit");
  reactionState.nextSpawnAt = Math.min(reactionState.nextSpawnAt, now + 80);

  updateHud(now);
  renderReactionArena(now);
}

function scheduleReactionFeedbackClear(index, feedback) {
  window.setTimeout(() => {
    if (reactionState.tiles[index].feedback === feedback) {
      reactionState.tiles[index] = inactiveReactionTile();
      if (activeGame === "reaction") {
        renderReactionArena(performance.now());
      }
    }
  }, 180);
}

function finishReactionGame() {
  cancelAnimationFrame(animationFrameId);
  reactionState.running = false;
  reactionState.tiles = reactionState.tiles.map(() => inactiveReactionTile());

  const result = {
    score: reactionState.score,
    hits: reactionState.hits,
    misses: reactionState.misses,
    mistakes: reactionState.mistakes,
    bestCombo: reactionState.bestCombo,
    accuracy: getReactionAccuracy(),
    playedAt: new Date().toISOString(),
  };

  const canSave = qualifiesForLeaderboard("reaction", result);
  reactionState.pendingResult = canSave ? result : null;

  if (canSave) {
    saveForm.hidden = false;
    setGameSaveHint("reaction", "saveHintResult", result.score, result.accuracy);
    playerNameInput.focus();
  } else {
    saveForm.hidden = true;
    setGameSaveHint("reaction", "saveHintDefault");
  }

  setGameStatus("reaction", canSave ? "endGameSave" : "endGameNoSave", result.score);
  updateStartButtonLabel();
  updateHud(performance.now());
  renderReactionArena(performance.now());
}

function getReactionAccuracy() {
  const attempts = reactionState.hits + reactionState.misses + reactionState.mistakes;
  if (attempts === 0) {
    return 100;
  }
  return (reactionState.hits / attempts) * 100;
}

function renderReactionArena(now) {
  reactionCells.forEach((element, index) => {
    const tile = reactionState.tiles[index];
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
function startTttGame() {
  clearTimeout(tttState.botTimerId);
  tttState = createTttState(tttState);
  tttState.running = true;
  tttState.finished = false;
  tttState.pendingResult = null;
  tttState.moves = 0;

  playerNameInput.value = localStorage.getItem(STORAGE_KEYS.playerName) ?? "";
  saveForm.hidden = true;
  setGameStatus("ttt", "statusTurn");
  setGameSaveHint("ttt", "saveHintDefault");
  updateStartButtonLabel();
  renderTttBoard();
  updateHud(performance.now());
}

function handleTttClick(event) {
  if (activeGame !== "ttt") {
    return;
  }

  const button = event.target.closest("[data-ttt-cell]");
  if (!button || !tttState.running || tttState.finished || tttState.botThinking) {
    return;
  }

  const index = Number(button.dataset.tttCell);
  if (tttState.board[index] !== "") {
    return;
  }

  placeTttMark(index, "X");
  renderTttBoard();
  updateHud(performance.now());

  if (getWinningLine(tttState.board, "X")) {
    finishTttGame("win");
    return;
  }

  if (isTttBoardFull(tttState.board)) {
    finishTttGame("draw");
    return;
  }

  tttState.botThinking = true;
  setGameStatus("ttt", "statusBot");
  renderTttBoard();

  tttState.botTimerId = window.setTimeout(() => {
    runBotMove();
  }, 340);
}

function placeTttMark(index, mark) {
  tttState.board[index] = mark;
  tttState.moves += 1;
}

function runBotMove() {
  if (!tttState.running || tttState.finished) {
    return;
  }

  const move = chooseBotMove(tttState.board);
  if (move === null) {
    finishTttGame("draw");
    return;
  }

  tttState.botThinking = false;
  placeTttMark(move, "O");
  renderTttBoard();
  updateHud(performance.now());

  if (getWinningLine(tttState.board, "O")) {
    finishTttGame("loss");
    return;
  }

  if (isTttBoardFull(tttState.board)) {
    finishTttGame("draw");
    return;
  }

  setGameStatus("ttt", "statusTurn");
}

function chooseBotMove(board) {
  const winMove = findTttLineMove(board, "O");
  if (winMove !== null) {
    return winMove;
  }

  const blockMove = findTttLineMove(board, "X");
  if (blockMove !== null) {
    return blockMove;
  }

  if (board[4] === "") {
    return 4;
  }

  const corners = [0, 2, 6, 8].filter((index) => board[index] === "");
  if (corners.length) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  const sides = [1, 3, 5, 7].filter((index) => board[index] === "");
  if (sides.length) {
    return sides[Math.floor(Math.random() * sides.length)];
  }

  return null;
}

function findTttLineMove(board, mark) {
  for (const line of WIN_LINES) {
    const values = line.map((index) => board[index]);
    const markCount = values.filter((value) => value === mark).length;
    const emptyIndexes = line.filter((index) => board[index] === "");

    if (markCount === 2 && emptyIndexes.length === 1) {
      return emptyIndexes[0];
    }
  }

  return null;
}

function getWinningLine(board, mark) {
  return WIN_LINES.find((line) => line.every((index) => board[index] === mark)) ?? null;
}

function isTttBoardFull(board) {
  return board.every((cell) => cell !== "");
}

function finishTttGame(outcome) {
  clearTimeout(tttState.botTimerId);
  tttState.running = false;
  tttState.finished = true;
  tttState.botThinking = false;

  if (outcome === "win") {
    tttState.wins += 1;
  } else if (outcome === "draw") {
    tttState.draws += 1;
  } else {
    tttState.losses += 1;
  }

  const score = calculateTttScore(outcome, tttState.moves);
  tttState.lastScore = score;

  const result = {
    score,
    outcome,
    turns: tttState.moves,
    playedAt: new Date().toISOString(),
  };

  const canSave = qualifiesForLeaderboard("ttt", result);
  tttState.pendingResult = canSave ? result : null;

  if (canSave) {
    saveForm.hidden = false;
    setGameSaveHint("ttt", "saveHintResult", result.score, resolveGameMessage("ttt", outcomeKey(outcome)), result.turns);
    playerNameInput.focus();
  } else {
    saveForm.hidden = true;
    setGameSaveHint("ttt", "saveHintDefault");
  }

  if (outcome === "win") {
    setGameStatus("ttt", canSave ? "statusWinSave" : "statusWinNoSave", score, result.turns);
  } else if (outcome === "draw") {
    setGameStatus("ttt", canSave ? "statusDrawSave" : "statusDrawNoSave", score, result.turns);
  } else {
    tttState.pendingResult = null;
    setGameStatus("ttt", "statusLose");
  }

  updateStartButtonLabel();
  updateHud(performance.now());
  renderTttBoard();
}

function calculateTttScore(outcome, turns) {
  if (outcome === "win") {
    return Math.max(90, 200 - Math.max(0, turns - 5) * 20);
  }
  if (outcome === "draw") {
    return Math.max(30, 80 - Math.max(0, turns - 7) * 6);
  }
  return 0;
}

function renderTttBoard() {
  tttCells.forEach((cell, index) => {
    const mark = tttState.board[index];
    cell.className = "ttt-cell";
    cell.textContent = mark;
    cell.disabled = !tttState.running || tttState.botThinking || tttState.finished || mark !== "";
    cell.setAttribute("aria-label", `${t("tttCellLabel")} ${index + 1}`);

    if (mark === "X") {
      cell.classList.add("is-x");
    }

    if (mark === "O") {
      cell.classList.add("is-o");
    }
  });
}

function initializeSudokuUi() {
  for (let index = 0; index < 81; index += 1) {
    const cell = document.createElement("button");
    const row = Math.floor(index / 9);
    const col = index % 9;

    cell.type = "button";
    cell.className = "sudoku-cell";
    cell.dataset.sudokuCell = String(index);

    if (col === 2 || col === 5) {
      cell.classList.add("is-block-right");
    }

    if (row === 2 || row === 5) {
      cell.classList.add("is-block-bottom");
    }

    sudokuBoard.appendChild(cell);
  }

  for (let value = 1; value <= 9; value += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sudoku-key";
    button.dataset.sudokuValue = String(value);
    sudokuKeypad.appendChild(button);
  }

  const eraseButton = document.createElement("button");
  eraseButton.type = "button";
  eraseButton.className = "sudoku-key is-erase";
  eraseButton.dataset.sudokuValue = "0";
  sudokuKeypad.appendChild(eraseButton);
}

function renderSudokuControls() {
  if (!sudokuDifficultyButtons.length || !sudokuKeys.length) {
    return;
  }

  const config = getGameCopy("sudoku");

  sudokuDifficultyButtons.forEach((button) => {
    const difficulty = button.dataset.sudokuDifficulty;
    const isActive = sudokuState.difficulty === difficulty;
    button.textContent = config.difficultyOptions[difficulty];
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  sudokuKeys.forEach((button) => {
    const value = Number(button.dataset.sudokuValue);
    button.textContent = value === 0 ? config.eraseLabel : String(value);
    button.classList.toggle("is-active", sudokuState.selectedNumber === value);
    button.setAttribute("aria-pressed", String(sudokuState.selectedNumber === value));
  });
}

function handleSudokuDifficultyChange(event) {
  const difficulty = event.currentTarget.dataset.sudokuDifficulty;
  if (!SUDOKU_DIFFICULTIES.includes(difficulty) || sudokuState.difficulty === difficulty) {
    return;
  }

  clearInterval(sudokuState.timerId);
  sudokuState = createSudokuState({ difficulty });
  sudokuState.difficulty = difficulty;

  if (activeGame === "sudoku") {
    startSudokuGame();
  } else {
    setGameStatus("sudoku", "statusReady", getSudokuDifficultyLabel());
    setGameSaveHint("sudoku", "saveHintDefault", getSudokuDifficultyLabel());
    renderSudokuControls();
  }
}

function startSudokuGame() {
  clearInterval(sudokuState.timerId);

  const difficulty = sudokuState.difficulty;
  const puzzle = chooseSudokuPuzzle(difficulty);

  sudokuState = createSudokuState(sudokuState);
  sudokuState.difficulty = difficulty;
  sudokuState.board = puzzle.puzzle.split("").map((value) => Number(value));
  sudokuState.givens = sudokuState.board.map((value) => value !== 0);
  sudokuState.solution = puzzle.solution.split("").map((value) => Number(value));
  sudokuState.running = true;
  sudokuState.completed = false;
  sudokuState.selectedCell = -1;
  sudokuState.selectedNumber = 0;
  sudokuState.mistakes = 0;
  sudokuState.filledCount = sudokuState.board.filter((value) => value !== 0).length;
  sudokuState.elapsedMs = 0;
  sudokuState.startedAtMs = Date.now();
  sudokuState.pendingResult = null;
  sudokuState.invalidCell = -1;

  playerNameInput.value = localStorage.getItem(STORAGE_KEYS.playerName) ?? "";
  saveForm.hidden = true;
  setGameStatus("sudoku", "statusStarted", getSudokuDifficultyLabel());
  setGameSaveHint("sudoku", "saveHintDefault", getSudokuDifficultyLabel());
  startSudokuTimer();
  updateStartButtonLabel();
  updateHud(performance.now());
  renderSudokuBoard();
  renderSudokuControls();
  renderLeaderboard();
}

function startSudokuTimer() {
  clearInterval(sudokuState.timerId);
  sudokuState.timerId = window.setInterval(() => {
    sudokuState.elapsedMs = Date.now() - sudokuState.startedAtMs;
    if (activeGame === "sudoku") {
      updateHud(performance.now());
    }
  }, 200);
}

function handleSudokuCellClick(event) {
  if (activeGame !== "sudoku") {
    return;
  }

  const button = event.target.closest("[data-sudoku-cell]");
  if (!button || !sudokuState.running || sudokuState.completed) {
    return;
  }

  const index = Number(button.dataset.sudokuCell);
  sudokuState.selectedCell = index;

  if (sudokuState.board[index] !== 0) {
    sudokuState.selectedNumber = sudokuState.board[index];
    renderSudokuControls();
  }

  renderSudokuBoard();

  if (!sudokuState.givens[index] && sudokuState.selectedNumber !== 0) {
    applySudokuInput(index, sudokuState.selectedNumber);
  }
}

function handleSudokuKeyClick(event) {
  if (activeGame !== "sudoku") {
    return;
  }

  const button = event.target.closest("[data-sudoku-value]");
  if (!button || !sudokuState.running || sudokuState.completed) {
    return;
  }

  const value = Number(button.dataset.sudokuValue);
  sudokuState.selectedNumber = sudokuState.selectedNumber === value ? 0 : value;

  renderSudokuControls();
  renderSudokuBoard();

  if (sudokuState.selectedCell !== -1 && !sudokuState.givens[sudokuState.selectedCell] && sudokuState.selectedNumber !== 0) {
    applySudokuInput(sudokuState.selectedCell, sudokuState.selectedNumber);
  }

  if (value === 0 && sudokuState.selectedCell !== -1 && !sudokuState.givens[sudokuState.selectedCell]) {
    sudokuState.board[sudokuState.selectedCell] = 0;
    sudokuState.filledCount = sudokuState.board.filter((cell) => cell !== 0).length;
    updateHud(performance.now());
    renderSudokuBoard();
  }
}

function applySudokuInput(index, value) {
  if (sudokuState.givens[index]) {
    return;
  }

  if (value === 0) {
    sudokuState.board[index] = 0;
    sudokuState.filledCount = sudokuState.board.filter((cell) => cell !== 0).length;
    updateHud(performance.now());
    renderSudokuBoard();
    return;
  }

  if (sudokuState.solution[index] !== value) {
    sudokuState.mistakes += 1;
    sudokuState.invalidCell = index;
    setGameStatus("sudoku", "statusMistake", value, sudokuState.mistakes);
    updateHud(performance.now());
    renderSudokuBoard();

    window.setTimeout(() => {
      if (sudokuState.invalidCell === index) {
        sudokuState.invalidCell = -1;
        if (activeGame === "sudoku") {
          renderSudokuBoard();
        }
      }
    }, 280);
    return;
  }

  sudokuState.board[index] = value;
  sudokuState.filledCount = sudokuState.board.filter((cell) => cell !== 0).length;
  updateHud(performance.now());
  renderSudokuBoard();

  if (isSudokuSolved()) {
    finishSudokuGame();
  }
}

function finishSudokuGame() {
  clearInterval(sudokuState.timerId);
  sudokuState.running = false;
  sudokuState.completed = true;
  sudokuState.elapsedMs = Date.now() - sudokuState.startedAtMs;

  const result = {
    difficulty: sudokuState.difficulty,
    elapsedMs: sudokuState.elapsedMs,
    mistakes: sudokuState.mistakes,
    playedAt: new Date().toISOString(),
  };

  const canSave = qualifiesForLeaderboard("sudoku", result);
  sudokuState.pendingResult = canSave ? result : null;

  if (canSave) {
    saveForm.hidden = false;
    setGameSaveHint("sudoku", "saveHintResult", getSudokuDifficultyLabel(), formatDuration(result.elapsedMs), result.mistakes);
    playerNameInput.focus();
  } else {
    saveForm.hidden = true;
    setGameSaveHint("sudoku", "saveHintDefault", getSudokuDifficultyLabel());
  }

  setGameStatus("sudoku", canSave ? "statusSolvedSave" : "statusSolvedNoSave", formatDuration(result.elapsedMs), result.mistakes);
  updateStartButtonLabel();
  updateHud(performance.now());
  renderSudokuBoard();
}

function renderSudokuBoard() {
  sudokuCells.forEach((cell, index) => {
    const value = sudokuState.board[index];
    const isSelected = sudokuState.selectedCell === index;
    const isHighlight = sudokuState.selectedNumber !== 0 && value === sudokuState.selectedNumber;

    cell.classList.remove("is-given", "is-selected", "is-highlight", "is-invalid");
    cell.textContent = value === 0 ? "" : String(value);
    cell.disabled = activeGame !== "sudoku" || sudokuState.completed;
    cell.setAttribute("aria-label", `${t("sudokuCellLabel")} ${index + 1}`);

    if (sudokuState.givens[index]) {
      cell.classList.add("is-given");
    }

    if (isSelected) {
      cell.classList.add("is-selected");
    }

    if (isHighlight) {
      cell.classList.add("is-highlight");
    }

    if (sudokuState.invalidCell === index) {
      cell.classList.add("is-invalid");
    }
  });
}

function chooseSudokuPuzzle(difficulty) {
  const pool = SUDOKU_PUZZLES[difficulty];
  return pool[Math.floor(Math.random() * pool.length)];
}

function isSudokuSolved() {
  return sudokuState.board.every((value, index) => value === sudokuState.solution[index]);
}

function getSudokuDifficultyLabel() {
  return getGameCopy("sudoku").difficultyOptions[sudokuState.difficulty];
}

function getSudokuElapsedMs() {
  if (sudokuState.running) {
    return Date.now() - sudokuState.startedAtMs;
  }

  return sudokuState.elapsedMs;
}

function handleSaveScore(event) {
  event.preventDefault();

  const state = getActiveState();
  if (!state.pendingResult) {
    return;
  }

  const rawName = playerNameInput.value.trim();
  const safeName = sanitizeName(rawName || "Player");
  localStorage.setItem(STORAGE_KEYS.playerName, safeName);

  const entry = { name: safeName, ...state.pendingResult };
  const currentEntries = getLeaderboardEntries(activeGame);
  const nextEntries = sortLeaderboard(activeGame, [...currentEntries, entry]).slice(0, 10);
  setLeaderboardEntries(activeGame, nextEntries);
  persistLeaderboard(activeGame);

  state.pendingResult = null;
  saveForm.hidden = true;
  if (activeGame === "sudoku") {
    setGameSaveHint("sudoku", "saveHintDefault", getSudokuDifficultyLabel());
    setGameStatus("sudoku", "saveSuccess", getLeaderboardEntries("sudoku").length);
  } else {
    setGameSaveHint(activeGame, "saveHintDefault");
    setGameStatus(activeGame, "saveSuccess", getLeaderboardEntries(activeGame).length);
  }
  updateStartButtonLabel();
  renderLeaderboard();
}

function handleClearLeaderboard() {
  const config = getGameCopy(activeGame);
  if (!getLeaderboardEntries(activeGame).length) {
    setGameStatus(activeGame, "clearEmpty");
    return;
  }

  const confirmMessage = activeGame === "sudoku"
    ? resolveGameMessage("sudoku", "clearConfirm", getSudokuDifficultyLabel())
    : config.clearConfirm;

  if (!window.confirm(confirmMessage)) {
    return;
  }

  setLeaderboardEntries(activeGame, []);
  persistLeaderboard(activeGame);
  renderLeaderboard();
  setGameStatus(activeGame, "clearDone");
}

function renderLeaderboard() {
  const entries = getLeaderboardEntries(activeGame);

  if (!entries.length) {
    const emptyMessage = activeGame === "sudoku"
      ? resolveGameMessage("sudoku", "noRanking", getSudokuDifficultyLabel())
      : getGameCopy(activeGame).noRanking;
    rankingList.innerHTML = `<li class="rank-empty">${escapeHtml(emptyMessage)}</li>`;
    return;
  }

  rankingList.innerHTML = entries
    .map((entry, index) => {
      const dateLabel = formatDate(entry.playedAt);
      const meta = activeGame === "reaction"
        ? resolveGameMessage("reaction", "rankingMeta", entry.accuracy, entry.bestCombo, dateLabel)
        : activeGame === "ttt"
          ? resolveGameMessage("ttt", "rankingMeta", resolveGameMessage("ttt", outcomeKey(entry.outcome)), entry.turns, dateLabel)
          : resolveGameMessage("sudoku", "rankingMeta", entry.mistakes, dateLabel);
      const scoreLabel = activeGame === "sudoku" ? formatDuration(entry.elapsedMs) : String(entry.score);

      return `
        <li>
          <span class="rank-index">${index + 1}</span>
          <div class="rank-meta">
            <strong>${escapeHtml(entry.name)}</strong>
            <span>${escapeHtml(meta)}</span>
          </div>
          <span class="rank-score">${scoreLabel}</span>
        </li>
      `;
    })
    .join("");
}

function getLeaderboardEntries(gameId) {
  if (gameId === "reaction") {
    return leaderboards.reaction;
  }

  if (gameId === "ttt") {
    return leaderboards.ttt;
  }

  return leaderboards.sudoku[sudokuState.difficulty];
}

function setLeaderboardEntries(gameId, entries) {
  if (gameId === "reaction") {
    leaderboards.reaction = entries;
    return;
  }

  if (gameId === "ttt") {
    leaderboards.ttt = entries;
    return;
  }

  leaderboards.sudoku[sudokuState.difficulty] = entries;
}

function sortLeaderboard(gameId, entries) {
  if (gameId === "reaction") {
    return entries.sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }
      if ((right.accuracy ?? 0) !== (left.accuracy ?? 0)) {
        return (right.accuracy ?? 0) - (left.accuracy ?? 0);
      }
      return (right.bestCombo ?? 0) - (left.bestCombo ?? 0);
    });
  }

  if (gameId === "sudoku") {
    return entries.sort((left, right) => {
      if ((left.elapsedMs ?? Number.MAX_SAFE_INTEGER) !== (right.elapsedMs ?? Number.MAX_SAFE_INTEGER)) {
        return (left.elapsedMs ?? Number.MAX_SAFE_INTEGER) - (right.elapsedMs ?? Number.MAX_SAFE_INTEGER);
      }
      if ((left.mistakes ?? Number.MAX_SAFE_INTEGER) !== (right.mistakes ?? Number.MAX_SAFE_INTEGER)) {
        return (left.mistakes ?? Number.MAX_SAFE_INTEGER) - (right.mistakes ?? Number.MAX_SAFE_INTEGER);
      }
      return 0;
    });
  }

  return entries.sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }
    if ((left.turns ?? 99) !== (right.turns ?? 99)) {
      return (left.turns ?? 99) - (right.turns ?? 99);
    }
    return outcomeWeight(right.outcome) - outcomeWeight(left.outcome);
  });
}

function qualifiesForLeaderboard(gameId, result) {
  if (gameId !== "sudoku" && result.score <= 0) {
    return false;
  }

  if (gameId === "sudoku" && result.elapsedMs <= 0) {
    return false;
  }

  const sorted = sortLeaderboard(gameId, [...getLeaderboardEntries(gameId), result]).slice(0, 10);
  return sorted.includes(result);
}

function loadReactionLeaderboard() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.reactionLeaderboard);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return sortLeaderboard(
      "reaction",
      parsed
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
        .filter((item) => Number.isFinite(item.score)),
    ).slice(0, 10);
  } catch {
    return [];
  }
}

function loadTttLeaderboard() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.tttLeaderboard);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return sortLeaderboard(
      "ttt",
      parsed
        .map((item) => ({
          name: sanitizeName(String(item.name ?? "Player")),
          score: Number(item.score ?? 0),
          outcome: String(item.outcome ?? "draw"),
          turns: Number(item.turns ?? 0),
          playedAt: String(item.playedAt ?? ""),
        }))
        .filter((item) => Number.isFinite(item.score)),
    ).slice(0, 10);
  } catch {
    return [];
  }
}

function loadSudokuLeaderboard() {
  const empty = {
    easy: [],
    medium: [],
    hard: [],
    expert: [],
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.sudokuLeaderboard);
    if (!raw) {
      return empty;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return empty;
    }

    return Object.fromEntries(
      SUDOKU_DIFFICULTIES.map((difficulty) => {
        const entries = Array.isArray(parsed[difficulty]) ? parsed[difficulty] : [];
        const normalized = sortLeaderboard(
          "sudoku",
          entries
            .map((item) => ({
              name: sanitizeName(String(item.name ?? "Player")),
              difficulty,
              elapsedMs: Number(item.elapsedMs ?? 0),
              mistakes: Number(item.mistakes ?? 0),
              playedAt: String(item.playedAt ?? ""),
            }))
            .filter((item) => Number.isFinite(item.elapsedMs) && item.elapsedMs > 0),
        ).slice(0, 10);

        return [difficulty, normalized];
      }),
    );
  } catch {
    return empty;
  }
}

function persistLeaderboard(gameId) {
  if (gameId === "reaction") {
    localStorage.setItem(STORAGE_KEYS.reactionLeaderboard, JSON.stringify(leaderboards.reaction));
    return;
  }

  if (gameId === "ttt") {
    localStorage.setItem(STORAGE_KEYS.tttLeaderboard, JSON.stringify(leaderboards.ttt));
    return;
  }

  localStorage.setItem(STORAGE_KEYS.sudokuLeaderboard, JSON.stringify(leaderboards.sudoku));
}

function loadLanguage() {
  const stored = localStorage.getItem(STORAGE_KEYS.language);
  return SUPPORTED_LANGUAGES.includes(stored) ? stored : DEFAULT_LANGUAGE;
}

function loadActiveGame() {
  const stored = localStorage.getItem(STORAGE_KEYS.activeGame);
  return SUPPORTED_GAMES.includes(stored) ? stored : DEFAULT_GAME;
}

function getActiveState() {
  if (activeGame === "reaction") {
    return reactionState;
  }

  if (activeGame === "ttt") {
    return tttState;
  }

  return sudokuState;
}

function isGameRunning(gameId) {
  if (gameId === "reaction") {
    return reactionState.running;
  }

  if (gameId === "ttt") {
    return tttState.running;
  }

  return sudokuState.running;
}

function hasGameActivity(gameId) {
  if (gameId === "reaction") {
    return reactionState.running
      || reactionState.pendingResult !== null
      || reactionState.score > 0
      || reactionState.hits > 0
      || reactionState.misses > 0
      || reactionState.mistakes > 0;
  }

  if (gameId === "ttt") {
    return tttState.running || tttState.finished || tttState.moves > 0;
  }

  return sudokuState.running || sudokuState.completed || sudokuState.filledCount > 0 || sudokuState.mistakes > 0;
}

function getGameCopy(gameId) {
  return I18N[currentLanguage].games[gameId];
}

function resolveGameMessage(gameId, key, ...args) {
  const value = getGameCopy(gameId)[key];
  return typeof value === "function" ? value(...args) : value;
}

function outcomeKey(outcome) {
  if (outcome === "win") {
    return "outcomeWin";
  }
  if (outcome === "loss") {
    return "outcomeLoss";
  }
  return "outcomeDraw";
}

function outcomeWeight(outcome) {
  if (outcome === "win") {
    return 2;
  }
  if (outcome === "draw") {
    return 1;
  }
  return 0;
}

function t(key) {
  const value = I18N[currentLanguage][key];
  return typeof value === "function" ? value() : value;
}

function formatAccuracy(value) {
  return `${Math.round(value)}%`;
}

function formatDuration(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function formatDate(value) {
  if (!value) {
    return t("recent");
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return t("recent");
  }

  return new Intl.DateTimeFormat(I18N[currentLanguage].htmlLang, {
    month: "short",
    day: "numeric",
  }).format(date);
}

function sanitizeName(value) {
  return value.replace(/\s+/g, " ").slice(0, 12);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
