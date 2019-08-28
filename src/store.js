import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userdata: []
  },

  mutations: {
    setMinerData(state, payload){
      let key = state.userdata.find(obj => { 
        return (obj.pool == payload.pool && obj.address == payload.address); 
      });
      key = state.userdata.indexOf(key)
      Vue.set(state.userdata, key, payload)
    },

    getUserData(state) {
      if(localStorage.getItem('userdata')){
        let data = JSON.parse(localStorage.getItem('userdata'))
        Vue.set(state, 'userdata', data)
      }
    },

    addPool(state, payload) {
      let update = true
      state.userdata.forEach(data => {
        if(data.pool == payload.pool && data.address == payload.address){
          update = false
        }
      })
      if(update){
        state.userdata.push(payload)
        localStorage.setItem('userdata', JSON.stringify(state.userdata));
      }
    },

    removePool(state, i) {
      let userkey = state.userdata.find(obj => { 
        return (obj.pool == state.userdata[i].pool && obj.address == state.userdata[i].address); 
      });
      userkey = state.userdata.indexOf(userkey)
      state.userdata.splice(i,1)
      state.userdata.splice(userkey,1)
      localStorage.setItem('userdata', JSON.stringify(state.userdata));
    }
  },

  actions: {
    getMinerData(store) {
      store.state.userdata.forEach(entry => {
        let func = entry.pool.charAt(0).toUpperCase() + entry.pool.slice(1)
        func = `get${func}Data`
        store.dispatch(func, entry.address)
      })
    },

    getEthermineData(store, address) {
      let http = Axios.create({
        baseURL: "https://api.ethermine.org/miner/",
        timeout: 100000,
      });

      let res = {}

      http.get(address + "/dashboard").then( response => {
        if(response.data.data) {
          res = response.data.data
        }
        store.commit('setMinerData', {pool: 'ethermine', address: address, data: res})
      })
    },

    getSupportxmrData(store, address) {
      let http = Axios.create({
        baseURL: "https://cors-anywhere.herokuapp.com/https://www.supportxmr.com/api/miner/",
        timeout: 100000,
      });
      let res = {}
      
      http.get(address + "/stats").then( response => {
        res.stats = response.data
        http.get(address + "/chart/hashrate").then( response => {
          res.chart = response.data
          store.commit('setMinerData', {pool: 'supportxmr', address: address, data: res})
        })
      })
    }
  }
})
