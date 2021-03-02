import Vue from 'vue';
import _ from 'lodash';

export default {
    state: {
        loading: true,
        types: []
    },
    getters: {
        payment_types(state) {
            return state.types;
        }
    },
    mutations: {
        set_payment_types(state, types) {
            Vue.set(state, 'types', types.map((type) => {
                return {
                    name: _.startCase(type),
                    value: type
                };
            }));
            Vue.set(state, 'loading', false);
        }
    }
}