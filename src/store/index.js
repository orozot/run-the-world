import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    LOCAL_STREAM: null,
    REMOTE_STREAMS: []
  },
  mutations: {
    SET_LOCAL_STREAM(state, val) {
      state.LOCAL_STREAM = val;
    },
    UPDATE_REMOTE_STREAMS(state, val) {
      state.REMOTE_STREAMS = val;
    }
  },
  actions: {},
  modules: {}
});
