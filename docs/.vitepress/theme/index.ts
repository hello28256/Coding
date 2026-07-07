import DefaultTheme from 'vitepress/theme'
import { onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import './custom.css'

// 用户向下滚动任意距离才显示页脚。
// 之前用 IntersectionObserver 在视口足够大时会被立即触发（首屏就显示），
// 改用 scroll 监听更精确：只有用户主动滚动过才浮现。
//
// scroll 用 passive + rAF 节流，避免滚动卡顿。
// 路由切换时重新绑定（footer 节点会被替换）。
let rafId: number | null = null
let boundFooter: HTMLElement | null = null

function onScroll() {
  if (rafId !== null) return
  rafId = requestAnimationFrame(() => {
    rafId = null
    if (window.scrollY > 0 && boundFooter) {
      boundFooter.classList.add('is-visible')
    }
  })
}

function bind() {
  if (boundFooter) {
    boundFooter.classList.remove('is-visible')
  }
  boundFooter = document.querySelector<HTMLElement>('footer.VPFooter')
  if (!boundFooter) return
  window.addEventListener('scroll', onScroll, { passive: true })
}

function unbind() {
  window.removeEventListener('scroll', onScroll)
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  boundFooter = null
}

// --- 「首页」直链在当前 tab 跳转 ---
// VitePress 1.6.3 给 nav 里的外链直链自动加 target="_blank"，
// 没有官方开关关掉。用 click 拦截 + window.location 跳转绕过。
//
// 只针对 nav 里指向 hello28256.github.io/ 的 .VPNavBarMenuLink
// （"首页" 项），其他外链（如 "在线访问" 里的 GitHub 仓库/Pages）
// 保持新开 tab 行为不变。
function onHomeClick(e: MouseEvent) {
  const target = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
    'a.VPNavBarMenuLink[href="https://hello28256.github.io/"]'
  )
  if (!target) return
  // 修饰键（Cmd/Ctrl/Shift/Middle-click）让用户自己决定新开 tab
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return
  e.preventDefault()
  // 用 location.assign 而非 href=，保留浏览器历史 + 可被拦截器捕获
  window.location.assign(target.href)
}

export default {
  extends: DefaultTheme,
  setup() {
    const route = useRoute()
    onMounted(() => {
      bind()
      // 整个 document 上 capture 阶段拦截，路由切换后 nav 节点替换也生效
      document.addEventListener('click', onHomeClick, { capture: true })
      watch(
        () => route.path,
        () => nextTick(bind)
      )
    })
    onBeforeUnmount(() => {
      unbind()
      document.removeEventListener('click', onHomeClick, { capture: true } as any)
    })
  },
}
