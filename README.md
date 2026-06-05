# Coding

我的编程学习笔记。

[![Online](https://img.shields.io/badge/⌨️_在线访问-hello28256.github.io%2Fcoding%2F1001Coding-00c853)](https://hello28256.github.io/coding/1001Coding/)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/正文-CC%20BY--SA%204.0-lightgrey)](https://creativecommons.org/licenses/by-sa/4.0/)
[![License: MIT](https://img.shields.io/badge/代码-MIT-blue)](https://opensource.org/licenses/MIT/)
[![Built with VitePress](https://img.shields.io/badge/Built_with-VitePress-00c853)](https://vitepress.dev/)

在线访问：<https://hello28256.github.io/coding/1001Coding/>

## 关于

编程学习过程中沉淀的笔记，按语言分。每门语言一个子目录。

## 本地预览

需要 [Node.js 18+](https://nodejs.org/)：

```bash
# 1. 装依赖
npm install

# 2. 启动开发服务器（带热重载）
npm run docs:dev
# → http://localhost:5173/coding/

# 3. 构建静态文件（与 CI 行为一致）
npm run docs:build
# 产物在 docs/.vitepress/dist/

# 4. 预览构建产物
npm run docs:preview
```

## 目录结构

```text
Coding/
├── package.json                # npm 依赖 + scripts
├── .markdownlint.json          # markdownlint 配置
├── docs/                       # VitePress srcDir
│   ├── .vitepress/
│   │   └── config.ts           # 站点配置，自动扫描 docs/ 子目录作为一种语言
│   ├── index.md                # Coding 首页（home layout）
│   ├── Python/                 # Python 笔记
│   │   └── index.md
│   ├── TypeScript/             # TypeScript 笔记
│   │   └── index.md
│   └── Go/                     # Go 笔记
│       └── index.md
└── .github/workflows/
    └── deploy.yml              # GitHub Actions 自动部署
```

## 新增一门语言

`docs/.vitepress/config.ts` 的 `discoverLanguages()` 会自动扫描
`docs/` 下所有子目录作为一门语言，侧栏从 H1 提取笔记标题，按文件名排序。

1. 在 `docs/` 下新建子目录，例如 `docs/Rust/`
2. 写 `docs/Rust/index.md`，带 `title:` frontmatter（语言在导航中的显示名）
3. 把笔记 `.md` 放进 `docs/Rust/`，**每篇用一个 H1 作为标题**（侧栏会从这里取）
4. `npm run docs:dev` 本地预览
5. git push 自动发布

## 部署

推送到 `main` 分支自动触发 GitHub Actions：

1. checkout → Node 22 → `npm install`
2. `npm run docs:build` 生成 `docs/.vitepress/dist/`
3. 上传 dist 到 Pages artifact → 部署

仓库 **Settings → Pages → Source** 需要选 **GitHub Actions**。

## 许可

- 正文：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- 代码：MIT
