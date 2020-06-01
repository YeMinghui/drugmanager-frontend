import axios from 'axios'
import {MessageBox, Message} from 'element-ui'
import store from '@/store'
import {getToken} from '@/utils/auth'
import {status} from '@/utils/httpstatus'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  headers: {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json;charset=UTF-8'
  }

})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data

    if (res.code !== status.Success && res.code !== status.LOGGED) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    if (res.code === status.UnAuthorized) {
      Message({
        message: res.message || '没有权限',
        type: 'error',
        duration: 5 * 1000
      })
    }

    if (res.code === status.IllegalToken || res.code === status.TokenExpired || res.code === status.UnAuthentication) {
      // to re-login
      MessageBox.confirm('超时退出，重新登录？', 'Confirm logout', {
        confirmButtonText: 'Re-Login',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      });
    }

    return res
  },
  // error => {
  //   console.log('err' + error) // for debug
  //   Message({
  //     message: error.message,
  //     type: 'error',
  //     duration: 5 * 1000
  //   })
  // return Promise.reject(error)
  // }
)

export default service
