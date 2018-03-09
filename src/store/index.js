//  引入vue及vuex
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const state = {
    userID: ''
}

const mutations = {
    USER_ID( state,i ) {
        state.userID = i
    }
}

const actions = {
    userID: ({ commit },i) => {
        commit('USER_ID',i)
    }
}

const getters = {
    userID: userID => state.userID,
    showDialog: showDialog => state.showDialog
}


export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})
