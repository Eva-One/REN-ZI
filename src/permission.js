import router from '@/router'
import store from '@/store'

const whiteList = ['/login', '/404']

router.beforeEach(async(to, from, next) => {
  if (store.getters.token) {
    if (!store.getters.userId) {
      const { roles: { menus }} = await store.dispatch('user/getUserInfo')
      store.dispatch('permission/filterRoutes', menus)
      // 动态路由的一个缺陷，需要给去往的路径
      next(to.path)
    }
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
