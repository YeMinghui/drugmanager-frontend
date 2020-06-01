import {getInfo, getRole, listUsers, login, logout} from '@/api/user'
import {getToken, removeToken, setToken} from '@/utils/auth'
import {resetRouter} from '@/router'
import {clearSession, saveId} from "@/utils/cachedata";

const getDefaultState = () => {
  return {
    token: getToken(),
    id: '',
    user: null,
    roles: null
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_ROLE: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // admin login
  login({ commit }, userInfo) {
    const { workId, password, rememberMe } = userInfo
    return new Promise((resolve, reject) => {
      login({ workId: workId.trim(), password: password, rememberMe: rememberMe }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_ID', data.id)
        setToken(data.token)
        saveId(data.id)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get admin info
  getInfo({ commit, state }, id) {
    return new Promise((resolve, reject) => {
      getInfo({ id: id }).then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        commit('SET_USER', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get role info
  getRoleInfo({commit}) {
    return new Promise((resolve, reject) => {
      getRole(null).then(response => {
        const { data } = response
        if (!data) {
          reject('No role get')
        }
        commit('SET_ROLE', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // admin logout
  logout({ commit, state }) {
    logout(state.token)
    removeToken() // must remove  token  first
    clearSession()
    resetRouter()
    commit('RESET_STATE')
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

