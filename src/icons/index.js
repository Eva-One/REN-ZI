import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/) // 批量导入

// req为一个方法

// console.log(req)
// console.log(req.keys()) // 拿到每一个路径
// console.log(req('./dashboard.svg')) // 根据路径加载模块
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
// console.log(requireAll(req))
