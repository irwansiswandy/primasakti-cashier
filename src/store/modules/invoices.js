import Vue from 'vue';

export default {
    state: {
        today: {
            loading: true,
            data: []
        },
        unpaid: {
            loading: true,
            data: []
        },
        queried: {
            loading: true,
            data: []
        },
        paid_today: {
            loading: true,
            data: []
        }
    },
    getters: {
        invoices(state) {
            return state;
        },
        invoice_groups(state) {
            return Object.keys(state);
        },
        today_invoices(state) {
            return state.today;
        },
        unpaid_invoices(state) {
            return state.unpaid;
        },
        invoices_paid_today(state) {
            return state.paid_today;
        }
    },
    mutations: {
        set_invoices(state, [group, key, value]) {
            Vue.set(state[group], key, value);
        },
        unset_invoices(state, [group, invoice_id]) {
            for (let i=0; i<state[group].data.length; i++) {
                if (state[group].data[i].id == invoice_id) {
                    Vue.delete(state[group].data, i);
                }
                else {
                    continue;
                }
            }
        },
        add_invoice(state, [group, invoice]) {
            state[group].data.push(invoice);
        },
        update_invoice(state, [invoice_id, invoice]) {
            let groups = Object.keys(state);
            for (let i=0; i<groups.length; i++) {
                for (let j=0; j<state[groups[i]].data.length; j++) {
                    if (state[groups[i]].data[j].id == invoice_id) {
                        state[groups[i]].data.splice(j, 1, invoice);
                    }
                    else {
                        continue;
                    }
                }
            }
        },
        delete_invoice(state, invoice_id) {
            let groups = Object.keys(state);
            for (let i=0; i<groups.length; i++) {
                for (let j=0; j<state[groups[i]].data.length; j++) {
                    if (state[groups[i]].data[j].id == invoice_id) {
                        state[groups[i]].data.splice(j, 1);
                    }
                    else {
                        continue;
                    }
                }
            }
        },
        set_invoice_payment(state, [invoice_id, payment]) {
            let groups = Object.keys(state);
            for (let i=0; i<groups.length; i++) {
                for (let j=0; j<state[groups[i]].data.length; j++) {
                    if (state[groups[i]].data[j].id == invoice_id) {
                        Vue.set(state[groups[i]].data[j], 'payment', payment);
                    }
                    else {
                        continue;
                    }
                }
            }
        }
    }
}
