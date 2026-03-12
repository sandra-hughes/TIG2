[English](./README.md) | [简体中文](./README_cn.md) | [日本語](./README_jp.md)

# Flux Grid Arena

A GitHub-ready browser game built with plain HTML, CSS, and JavaScript. It runs as a fully static site, works well with GitHub Pages, and includes a local leaderboard.

## Features

- Static-first setup: no backend, no build step, and no deployment complexity.
- Playable loop: a 45-second reaction challenge with score tiles, bonus tiles, and trap tiles.
- Built-in ranking: uses browser `localStorage` to keep a local top 10 leaderboard.
- Clean repository layout: includes `README`, `LICENSE`, `.gitignore`, and a GitHub Pages workflow.

## Project Structure

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

## Run Locally

You can open `index.html` directly in a browser.

If you prefer a local static server:

```bash
npx serve .
```

## Deploy to GitHub

1. Create a GitHub repository, for example `flux-grid-arena`.
2. Push the contents of this folder to the repository root.
3. Open `Settings > Pages` in the repository.
4. Set the deployment source to `GitHub Actions`.
5. Push to `main` and the workflow will publish the site automatically.

## Leaderboard Notes

- The current leaderboard is local-only and stored in the active browser.
- This matches GitHub Pages well because it does not require a database or server API.
- If you want a global leaderboard later, connect a service such as Supabase, Firebase, or Cloudflare D1.

## Why It Works Well As A Living Repository

- It is a complete, visible project instead of a throwaway script dump.
- Commits can evolve naturally through gameplay tuning, UI changes, audio, mobile polish, or online features.
- GitHub Pages makes the repository easy to preview and share.

## Good Next Iterations

- Online leaderboard
- Sound effects and music
- Daily challenge mode
- Mobile haptic feedback
- More visual themes

## License

MIT
