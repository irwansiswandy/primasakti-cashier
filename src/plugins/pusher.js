import Vue from 'vue';
import Pusher from 'pusher-js';
import Env from '../_env';

export default Vue.install = (Vue) => {
    Vue.prototype.$pusher = new Pusher(Env.pusher.app_key, {
        wsHost: Env.pusher.host,
        wsPort: Env.pusher.port,
        forceTLS: false,
        enableStats: false
    });
}