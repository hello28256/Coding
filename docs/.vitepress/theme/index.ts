import DefaultTheme from 'vitepress/theme'
import { onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import './custom.css'

// 监听 VitePress 自带的 <footer class="VPFooter"> 元素，
// 进入视口时加 .is-visible，触发 CSS fade-in + 上滑动画。
// 用户往下滚到页脚时才浮现，首屏不出现。
//
// 路由切换时 footer 节点会被替换，需重新观察。
// 阈值 0.15 = 露 15% 就开始显示，避免最后一刻才出现。
let observer: IntersectionObserver | null = null
let currentFooter: HTMLElement | null = null

function bind() {
  observer?.disconnect()
  const footer = document.querySelector<HTMLElement>('footer.VPFooter')
  if (!footer) return
  currentFooter = footer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.15 }
  )
  observer.observe(footer)
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
      observer?.disconnect()
      currentFooter = null
    })
  },
}
