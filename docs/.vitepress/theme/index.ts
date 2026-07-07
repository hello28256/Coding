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

export default {
  extends: DefaultTheme,
  setup() {
    const route = useRoute()
    onMounted(() => {
      bind()
      watch(
        () => route.path,
        () => nextTick(bind)
      )
    })
    onBeforeUnmount(() => {
      unbind()
    })
  },
}
