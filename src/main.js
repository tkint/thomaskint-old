// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';
import VueAxios from 'vue-axios';
import Axios from 'axios';

import App from './App';
import router from './router';

Vue.config.productionTip = false;

// Axios.defaults.baseURL = 'http://192.168.230.134/';

Vue.use(Vuetify);
Vue.use(VueAxios, Axios);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
