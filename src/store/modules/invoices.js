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
            /* group [string | array]
               invoice [object]
            */
            // executes if given only single group in string
            if (typeof group == 'string') {
                state[group].data.push(invoice);
            }
            // executes if given multiple groups in array
            else if (typeof group == 'object') {
                for (let i=0; i<group.length; i++) {
                    state[group[i]].data.push(invoice);
                }
            }
        },
        update_invoice(state, [group, invoice_id, invoice]) {
            /* group [string | array],
               invoice_id [string | number]
               invoice [object]
            */
            // executes if given only single group in string
            if (typeof group == 'string') {
                for (let i=0; i<state[group].data.length; i++) {
                    if (state[group].data[i].id == invoice_id) {
                        state[group].data.splice(i, 1, invoice);
                    }
                    else {
                        continue;
                    }
                }
            }
            // executes if given multiple groups in array
            else if (typeof group == 'object') {
                for (let i=0; i<group.length; i++) {
                    for (let j=0; j<state[group[i]].data.length; j++) {
                        if (state[group[i]].data[j].id == invoice_id) {
                            state[group[i]].data.splice(j, 1, invoice);
                        }
                        else {
                            continue;
                        }
                    }
                }
            }
        },
        delete_invoice(state, [group, invoice_id]) {
            /* group [string | array],
               invoice_id [string | number]
            */
            // executes if given only single group in string
            if (typeof group == 'string') {
                for (let i=0; i<state[group].data.length; i++) {
                    if (state[group].data[i].id == invoice_id) {
                        state[group].data.splice(i, 1);
                    }
                    else {
                        continue;
                    }
                }
            }
            // executes if given multiple groups in array
            else if (typeof group == 'object') {
                for (let i=0; i<group.length; i++) {
                    for (let j=0; j<state[group[i]].data.length; j++) { 
                        if (state[group[i]].data[j].id == invoice_id) {
                            state[group[i]].data.splice(j, 1);
                        }
                        else {
                            continue;
                        }
                    }
                }
            }
        },
        set_invoice_payment(state, [group, invoice_id, payment]) {
            /* group [string | array],
               invoice_id [string | number],
               payment [object]
            */
            // executes if given only a single group in string
            if (typeof group == 'string') {
                for (let i=0; i<state[group].data.length; i++) {
                    if (state[group].data[i].id == invoice_id) {
                        Vue.set(state[group].data[i], 'payment', payment);
                    }
                    else {
                        continue;
                    }
                }
            }
            // executes if given multiple groups in array
            else if (typeof group == 'object') {
                for (let i=0; i<group.length; i++) {
                    for (let j=0; j<state[group[i]].data.length; j++) {
                        if (state[group[i]].data[j].id == invoice_id) {
                            Vue.set(state[group[i]].data[j], 'payment', payment);
                        }
                        else {
                            continue;
                        }
                    }
                }
            }
        },
        move_invoice(state, [from, to, invoice_id]) {
            /* from [string] : group invoice taken from,
               to [string] : group invoice moved to
            */
            for (let i=0; i<state[from].data.length; i++) {
                if (state[from].data[i].id == invoice_id) {
                    // copy invoice to group 'to'
                    let moved_invoice = state[from].data[i];
                    state[to].data.push(moved_invoice);
                    // deletes invoice from group 'from'
                    state[from].data.splice(i, 1);
                }
                else {
                    continue;
                }
            }
        }
    }
}
