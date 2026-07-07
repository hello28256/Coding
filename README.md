# Coding

我的编程学习笔记。

[![Online](https://img.shields.io/badge/⌨️_在线访问-hello28256.github.io%2Fcoding-00c853)](https://hello28256.github.io/coding/)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/正文-CC%20BY--SA%204.0-lightgrey)](https://creativecommons.org/licenses/by-sa/4.0/)
[![License: MIT](https://img.shields.io/badge/代码-MIT-blue)](https://opensource.org/licenses/MIT)
[![Built with VitePress](https://img.shields.io/badge/Built_with-VitePress-00c853)](https://vitepress.dev/)

在线访问：<https://hello28256.github.io/coding/>

## 关于

编程是个手艺活，靠手熟。所有笔记直接放在 `docs/` 根，按编号 + 标题命名。
未来笔记多到几十、上百篇时，再拆 `docs/Coding2/` `docs/Coding3/` 子目录。

## 本地预览

需要 [Node.js 18+](https://nodejs.org/)：

```bash
# 1. 装依赖（仓库用 pnpm 锁版本，npm 也兼容）
pnpm install   # 或 npm install

# 2. 启动开发服务器（带热重载）
pnpm docs:dev  # 或 npm run docs:dev
# → http://localhost:5173/coding/

# 3. 构建静态文件（与 CI 行为一致）
pnpm docs:build
# 产物在 docs/.vitepress/dist/

# 4. 预览构建产物
pnpm docs:preview
```

## 目录结构

```text
Coding/
├── package.json                # 依赖 + scripts
├── pnpm-lock.yaml              # 锁版本
├── .markdownlint.json          # markdownlint 配置
├── docs/                       # VitePress srcDir
│   ├── .vitepress/
│   │   └── config.ts           # 站点配置，rootSidebar() 平铺扫描 docs/*.md
│   ├── index.md                # Coding 首页（home layout）
│   └── NNN标题.md              # 笔记平铺在 docs/ 根，每篇一个 H1
└── .github/workflows/
    └── deploy.yml              # GitHub Actions 自动部署
```

## URL 结构

所有笔记 URL 直接是 `/coding/NNN标题`，不带中间层。

## 新增一篇笔记

1. 在 `docs/` 根创建 `NNN标题.md`（3 位编号 + 标题，例如 `001Type Hints.md`）
2. 第一行写 `# 标题` —— 侧栏会从这里取显示名
3. 侧栏按文件名字典序自动排序，所以新笔记的编号决定它在侧栏的位置
4. `pnpm docs:dev` 本地预览
5. git push 自动发布

> 如果以后笔记多到几十、上百篇，按主题拆 `docs/Coding2/` `docs/Coding3/` 子目录，再把 `rootSidebar` 改回多书扫描即可。

## 部署

推送到 `main` 分支自动触发 GitHub Actions（`.github/workflows/deploy.yml`）：

1. checkout → Node 22 → 启用 corepack pnpm
2. `npm install` + `npm run docs:build` 生成 `docs/.vitepress/dist/`
3. 上传 dist 到 Pages artifact → 部署

仓库 **Settings → Pages → Source** 需要选 **GitHub Actions**。

## 许可

- 正文：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- 代码：MIT
