import DefaultTheme from 'vitepress/theme'
import './custom.css'

// 继承默认主题 + 加载自定义 CSS（只覆盖 siteTitle 颜色为主色）。
// 不引品牌色变量 —— 让 .VPNavBarTitle 跟着 --vp-c-brand-1 走，
// 以后想换品牌色只动 CSS 变量一处。
export default DefaultTheme
