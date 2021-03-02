import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import Store from './store/main';
import Router from './router/main';

import Vuetify from './plugins/vuetify';
import './assets/app.css';

import VueAxios from './plugins/axios';
Vue.use(VueAxios);

import VuePusher from './plugins/pusher';
Vue.use(VuePusher);

import VueNumeral from './plugins/numeral';
Vue.use(VueNumeral);

new Vue({
  render: h => h(App),
  store: Store,
  router: Router,
  vuetify: Vuetify
}).$mount('#app')