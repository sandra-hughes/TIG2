# Flux Grid Arena

一个适合放到 GitHub 上的纯前端 Web 小游戏项目，直接支持 GitHub Pages 部署，内置本地排行榜。

## 项目特点

- 纯静态：只有 `HTML + CSS + JavaScript`，没有后端，部署成本低。
- 有玩法：45 秒反应挑战，包含高分块、基础块、陷阱块。
- 有排名：使用浏览器 `localStorage` 保存本地排行榜。
- 仓库结构规范：包含 `README`、`LICENSE`、`.gitignore` 和 GitHub Pages 工作流。

## 目录结构

```text
.
├─ .github/
│  └─ workflows/
│     └─ pages.yml
├─ assets/
│  └─ preview.svg
├─ src/
│  ├─ main.js
│  └─ styles.css
├─ .gitignore
├─ .nojekyll
├─ index.html
├─ LICENSE
└─ README.md
```

## 本地运行

直接双击 `index.html` 就可以打开。

如果你想用本地静态服务器，也可以在项目目录运行：

```bash
npx serve .
```

## 发布到 GitHub

1. 新建一个 GitHub 仓库，例如 `flux-grid-arena`。
2. 把当前目录内容推到仓库根目录。
3. 进入 GitHub 仓库的 `Settings > Pages`。
4. 把部署来源设置为 `GitHub Actions`。
5. 推送到 `main` 分支后，工作流会自动发布页面。

## 排行榜说明

- 当前版本是本地排行榜，只保存在当前浏览器里。
- 这对 GitHub Pages 很友好，因为不需要数据库或服务端接口。
- 如果你后面想升级成“全球排行榜”，建议接入 Supabase、Firebase 或 Cloudflare D1。

## 适合保活的原因

- 这是完整可展示的项目，不是单文件脚本。
- 提交记录可以围绕玩法、UI、音效、全球榜、移动端优化持续迭代。
- GitHub Pages 能直接展示效果，仓库可见度比单纯代码堆砌更高。

## 后续可继续加的内容

- 全局在线排行榜
- 音效和背景音乐
- 每日挑战模式
- 触屏震动反馈
- 多语言切换

## License

MIT
