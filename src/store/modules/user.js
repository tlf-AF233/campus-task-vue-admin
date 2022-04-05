import { getUserProfile } from '@/api/user'

const user = {
  state: {
    avatarUrl: '',
    name: ''
  },

  mutations: {
    SET_AVATAR: (state, avatarUrl) => {
      state.avatarUrl = avatarUrl
    },
    SET_NAME: (state, name) => {
      state.name = name
    }
  },

  actions: {
    setUserInfo({ commit, state }) {
      getUserProfile().then(res => {
        commit('SET_AVATAR', res.data.avatarUrl)
        commit('SET_NAME', res.data.name)
      })
    }
  } 
}

export default user