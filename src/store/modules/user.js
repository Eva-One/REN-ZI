import { login } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'

export default {
  namespaced: true,
  state: {
    token: getToken()
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      setToken(token)
    },
    REMOVED_TOKEN(state) {
      state.token = null
      removeToken()
    }
  },
  actions: {
    async login({ commit }, info) {
      const { data } = await login(info)
      commit('SET_TOKEN', data.data)
    }
  }
}
