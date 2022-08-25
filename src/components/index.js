// import PageTools from './PageTools'

// export default {
//   install(Vue) {
//     Vue.component('PageTools', PageTools)
//   }
// }

// export default (Vue) => {
//   Vue.component('PageTools', PageTools)
// }

// 自动批量注册组件
const requireComponents = require.context('./', true, /\.vue$/)
const res = requireComponents.keys().map(ele => requireComponents(ele))

export default (Vue) => {
  res.forEach(ele => Vue.component(ele.default.name, ele.default))
}
