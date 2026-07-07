import { readdirSync, readFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { defineConfig } from 'vitepress'

// 扫描 docs/ 根下的 .md 生成 sidebar 条目（平铺笔记）。
// 每条用 H1 作为标题，文件名作为链接。
// 注意：只扫 docs/ 根一层 —— 2026-07 重构后所有笔记直接放在 docs/ 下，
// 不再用 docs/1001Coding/ 子目录结构（该目录已彻底删除，不是重定向）。
// 重构是为了让 URL 直接是 /001xxx 而不是 /1001Coding/001xxx。
function rootSidebar() {
  return readdirSync('docs')
    .filter((f) => f.endsWith('.md') && f !== 'index.md')
    .sort()
    .map((f) => {
      const name = basename(f, '.md')
      const content = readFileSync(join('docs', f), 'utf8')
      const h1 = content.match(/^#\s+(.+)$/m)
      return {
        text: h1 ? h1[1].trim() : name,
        link: `/${name}`,
      }
    })
}

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

  // 浏览器标签 favicon + Apple 触屏图标。
  // 显式声明而不是依赖 VitePress 默认查找，
  // 因为站点部署在 /Coding/ 子路径，显式声明最稳。
  // 复用 ../book 的图标（docs/public/ 下两份），跟 book 保持一致。
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/Coding/favicon.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/Coding/apple-touch-icon.png' }],
  ],

  // VitePress 主题配置
  themeConfig: {
    // 站点 logo 文字（无图就用纯文字）
    siteTitle: 'Coding',

    // 顶部导航
    // 不放 "Coding" 项 —— 左侧 siteTitle 已经显示 "Coding"，再放会重复。
    // 不放 "笔记" 下拉 —— 笔记已平铺到 docs/ 根，侧栏就是全集。
    nav: [
      {
        // 直链外站 nav 项：跳到主站首页 hello28256.github.io
        // VitePress 1.x: link 含 http(s):// 就自动当外链处理（加 target=_blank），
        // 不需要显式 external: true（TS NavItem 类型里也没这个字段）。
        text: '首页',
        link: 'https://hello28256.github.io/',
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

    // 侧栏：所有页面都显示笔记列表（平铺）。
    // 包括首页 / (即 docs/index.md)，让侧栏随时可点。
    sidebar: [
      { text: '首页', link: '/' },
      ...rootSidebar(),
    ],

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
