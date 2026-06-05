import { readdirSync, readFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { defineConfig } from 'vitepress'

// 扫描 docs/{book}/ 下的 .md 生成一本书的 sidebar 条目。
// 每条用 H1 作为标题，文件名作为链接。
function bookSidebar(book: string) {
  const bookDir = `docs/${book}`
  return readdirSync(bookDir)
    .filter((f) => f.endsWith('.md') && f !== 'index.md')
    .sort()
    .map((f) => {
      const name = basename(f, '.md')
      const content = readFileSync(join(bookDir, f), 'utf8')
      const h1 = content.match(/^#\s+(.+)$/m)
      return {
        text: h1 ? h1[1].trim() : name,
        link: `/${book}/${name}`,
      }
    })
}

// 读取每本书的 index.md，提取 `title:` frontmatter 作为导航显示名。
// 没写 frontmatter 就用目录名。
function bookLabel(book: string): string {
  try {
    const txt = readFileSync(`docs/${book}/index.md`, 'utf8')
    const m = txt.match(/^title:\s*(.+)$/m)
    if (m) return m[1].trim().replace(/^['"]|['"]$/g, '')
  } catch {}
  return book
}

// 自动发现 docs/ 下的所有子目录作为一本书。
// 新增 docs/1002Travel/ 子目录 + 在该目录下放 index.md，无需改本文件即可出现在导航/侧栏。
function discoverBooks(): string[] {
  return readdirSync('docs', { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
    .map((d) => d.name)
    .sort()
}

const books = discoverBooks()
const bookNavItems = books.map((book) => ({
  text: bookLabel(book),
  link: `/${book}/`,
}))

// 站点基础信息
export default defineConfig({
  // 注意：不要在这里写 srcDir: 'docs'。
  // CLI 命令 `vitepress build docs` 已经把 'docs' 当作 root，
  // 再写 srcDir: 'docs' 会拼成 docs/docs，导致找不到任何 .md。
  // srcDir 留空，默认就是当前 root（= docs/）。

  // GitHub Pages 子路径，必须以 / 开头和结尾
  // 仓库名是 Coding（大写 C），GitHub Pages 项目站点 URL 保留仓库名大小写，
  // 这里 base 必须与之一致，否则站内所有链接 404。
  base: '/Coding/',

  // 去掉 URL 里的 .html 后缀，访问 /foo/ 而不是 /foo.html。
  // GitHub Pages 原生支持目录 + index.html 结构，无需额外配置。
  cleanUrls: true,

  // SEO
  title: 'Coding',
  description: '我的编程学习笔记',
  lang: 'zh-CN',
  lastUpdated: true,

  // VitePress 主题配置
  themeConfig: {
    // 站点 logo 文字（无图就用纯文字）
    siteTitle: 'Coding',

    // 顶部导航
    nav: [
      { text: 'Coding', link: '/' },
      {
        text: '笔记',
        items: bookNavItems,
      },
      {
        text: '在线访问',
        items: [
          {
            text: 'GitHub 仓库',
            link: 'https://github.com/hello28256/Coding',
          },
          {
            text: 'GitHub Pages',
            link: 'https://hello28256.github.io/Coding/',
          },
        ],
      },
    ],

    // 侧栏：每本书自己的侧栏。
    // 在某本书内（路径以 /1001Coding/ 开头）时显示该书的笔记列表。
    // 根（/）不显示侧栏（Coding 首页不需要）。
    sidebar: Object.fromEntries(
      books.map((book) => [
        `/${book}/`,
        [
          { text: `${bookLabel(book)} · 首页`, link: `/${book}/` },
          ...bookSidebar(book),
        ],
      ])
    ),

    // 内置搜索（MiniSearch，支持中文）
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          tokenize: (text: string) => text.split(/\s+/),
        },
      },
    },

    // 暗色模式：默认跟随系统
    appearance: 'auto',

    // 页脚
    footer: {
      message: '正文采用 CC BY-SA 4.0 协议 · 代码示例采用 MIT 协议',
      copyright: 'Copyright © 2026 hello28256',
    },

    // 右上角图标
    socialLinks: [{ icon: 'github', link: 'https://github.com/hello28256/Coding' }],

    // 编辑本页
    editLink: {
      pattern: 'https://github.com/hello28256/Coding/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },
  },

  // Markdown 配置
  markdown: {
    lineNumbers: true,
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '提示',
      detailsLabel: '详细信息',
    },
  },

  // 死链检查：忽略 localhost 链接
  ignoreDeadLinks: [
    /^https?:\/\/localhost(:\d+)?\/?/,
  ],
})
