import Vue from 'vue';
import Axios from 'axios';
import Env from '../_env';

function getBaseURL() {
  if (Env.server.ssl) {
    return 'https://' + Env.server.host + ':' + Env.server.port;
  }
  else {
    return 'http://' + Env.server.host + ':' + Env.server.port;
  }
}

Axios.defaults.baseURL = getBaseURL();
Axios.defaults.headers.common = {
  'X-PS-UI': 'cashier'
};

export default Vue.install = (Vue) => {
  Vue.prototype.$axios = Axios;
};