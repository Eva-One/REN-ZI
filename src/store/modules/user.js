import { login, getUserInfo } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'

export default {
  namespaced: true,
  state: {
    token: getToken(),
    userInfo: {}
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      setToken(token)
    },
    REMOVED_TOKEN(state) {
      state.token = null
      removeToken()
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
    },
    REMOVED_USER_INFO(state) {
      state.userInfo = {}
    }
  },
  actions: {
    async login({ commit }, info) {
      const res = await login(info)
      commit('SET_TOKEN', res)
    },
    async getUserInfo({ commit }) {
      const res = await getUserInfo()
      commit('SET_USER_INFO', res)
    }
  }
}
