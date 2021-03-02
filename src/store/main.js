import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import Payments from './modules/payments';
import Invoices from './modules/invoices';

export default new Vuex.Store({
    // strict: true,
    modules: {
        payments: Payments,
        invoices: Invoices
    },
    state: {
        server: {
            on: false,
            datetime: '',
            timezone: ''
        },
        authorized: false,
        locale: 'id',
        snackbar: {
            show: false,
            text: ''
        }
    },
    getters: {
        server(state) {
            return state.server;
        },
        server_date(state) {
            let date = state.server.datetime.split(' ');
            return date[0];
        },
        server_time(state) {
            let date = state.server.datetime.split(' ');
            return date[1];
        },
        authorized(state) {
            return state.authorized;
        },
        locale(state) {
            return state.locale;
        },
        snackbar(state) {
            return state.snackbar;
        }
    },
    mutations: {
        show_snackbar(state, text) {
            Vue.set(state.snackbar, 'text', text);
            Vue.set(state.snackbar, 'show', true);
        },
        hide_snackbar(state) {
            Vue.set(state.snackbar, 'show', false);
            setTimeout(() => {
                Vue.set(state.snackbar, 'text', '');
            }, 250);
        }
    }
});