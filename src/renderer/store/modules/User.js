const state = {
  id: null,
  email: null,
  name: null,
  apiToken: null,
  company: null
}

const mutations = {
  SET_USER (state, user) {
    state.id = user.id
    state.email = user.email
    state.name = user.name
    state.apiToken = user.api_token
    state.company = user.company
  },
  DELETE_USER (state) {
    state.id = null
    state.email = null
    state.name = null
    state.apiToken = null
    state.company = null
  }
}

const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  }
}

export default {
  state,
  mutations,
  actions
}
