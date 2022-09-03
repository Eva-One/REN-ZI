import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

export default {
  namespaced: true,
  state: {
    token: getToken(),
    userInfo: {},
    hrsaasTime: ''
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      setToken(token)
    },
    REMOVE_TOKEN(state) {
      state.token = null
      removeToken()
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
    },
    REMOVE_USER_INFO(state) {
      state.userInfo = {}
    },
    SET_HRSAAS_TIME(state, time) {
      state.hrsaasTime = time
    }
  },
  actions: {
    async login({ commit }, info) {
      const res = await login(info)
      commit('SET_TOKEN', res)
      commit('SET_HRSAAS_TIME', +new Date())
    },
    async getUserInfo({ commit }) {
      const res = await getUserInfo()
      const baseInfo = await getUserDetailById(res.userId)
      const detailInfo = { ...res, ...baseInfo }
      commit('SET_USER_INFO', detailInfo)
      return detailInfo
    },
    logout({ commit }) {
      commit('REMOVE_TOKEN')
      commit('REMOVE_USER_INFO')
      resetRouter()
      commit('permission/setRoutes', [], { root: true })
    }
  }
}
