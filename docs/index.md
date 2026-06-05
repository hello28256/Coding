---
layout: home

hero:
  name: Coding
  text: 编程学习笔记
  tagline: 按语言分：Python / TypeScript / Go
  actions:
    - theme: brand
      text: 开始阅读
      link: /Python/
    - theme: alt
      text: GitHub 仓库
      link: https://github.com/hello28256/Coding

features:
  - title: 🐍 Python
    details: 后端脚本、爬虫、数据处理、类型提示、异步、测试
    link: /Python/
    linkText: 查看 Python 笔记
  - title: 📘 TypeScript
    details: 类型系统、泛型、模块解析、Node.js、React 类型、工具类型
    link: /TypeScript/
    linkText: 查看 TypeScript 笔记
  - title: 🐹 Go
    details: 基础语法、并发模型、错误处理、依赖管理、性能分析
    link: /Go/
    linkText: 查看 Go 笔记
---

## 关于这个站点

这是我整理编程学习笔记的地方。每门语言一个子目录，按笔记文件名排序。VitePress
会自动扫描 `docs/` 下的子目录生成导航和侧栏。

新增一门语言：

1. 在 `docs/` 下新建子目录，例如 `docs/Rust/`
2. 写 `docs/Rust/index.md`，带 `title:` frontmatter
3. 把笔记 `.md` 放进 `docs/Rust/`，**每篇用一个 H1 作为标题**
4. 推送到 `main`，Actions 自动部署
