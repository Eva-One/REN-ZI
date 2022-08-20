import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'

const overTime = 10 * 60 * 60
const isOver = () => {
  return (+new Date() - store.getters.hrsaasTime) / 1000 > overTime
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use((config) => {
  if (store.getters.token) {
    if (isOver()) {
      console.log(isOver())
      store.dispatch('user/logout')
      router.push('/login')
      // Message.error('token超时')
      return Promise.reject(new Error('接口超时'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, (err) => {
  return Promise.reject(err)
}
)

// response interceptor
service.interceptors.response.use((response) => {
  const { data, message, success } = response.data
  if (success) {
    return data
  }
  Message.error(message)
  return Promise.reject(new Error(message))
}, (err) => {
  // console.log(err.response)
  if (err.response && err.response.data && err.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  }
  Message.error(err.message)
  return Promise.reject(err)
}
)

export default service
