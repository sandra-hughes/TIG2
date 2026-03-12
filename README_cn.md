[English](./README.md) | [简体中文](./README_cn.md) | [日本語](./README_jp.md)

# Flux Grid Arena

这是一个适合放到 GitHub 上展示的浏览器小游戏项目，使用纯 HTML、CSS 和 JavaScript 构建，支持 GitHub Pages，并内置本地排行榜。

## 项目特点

- 纯静态站点：不需要后端，不需要构建流程，部署简单。
- 可玩性完整：45 秒反应挑战，包含基础得分块、高分块和陷阱块。
- 自带排名：使用浏览器 `localStorage` 保存本地前 10 名记录。
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
├─ README.md
├─ README_cn.md
└─ README_jp.md
```

## 本地运行

直接用浏览器打开 `index.html` 即可运行。

如果你更希望通过本地静态服务器运行：

```bash
npx serve .
```

## 发布到 GitHub

1. 新建一个 GitHub 仓库，例如 `flux-grid-arena`。
2. 将当前目录内容推送到仓库根目录。
3. 进入仓库的 `Settings > Pages`。
4. 将部署来源设置为 `GitHub Actions`。
5. 推送到 `main` 分支后，工作流会自动发布页面。

## 排行榜说明

- 当前版本的排行榜是本地榜，只保存在当前浏览器中。
- 这种实现方式非常适合 GitHub Pages，因为不依赖数据库或服务端接口。
- 如果后续要做全球排行榜，可以接入 Supabase、Firebase 或 Cloudflare D1。

## 为什么适合持续维护

- 这是一个完整且可展示的项目，不是零散脚本。
- 后续可以围绕玩法、UI、音效、移动端优化或在线功能持续提交迭代。
- GitHub Pages 可以直接展示效果，仓库更容易被看到。

## 后续可扩展方向

- 在线排行榜
- 音效和背景音乐
- 每日挑战模式
- 移动端震动反馈
- 更多视觉主题

## 许可证

MIT
