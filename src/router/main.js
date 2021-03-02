import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import TodayInvoices from '../components/TodayInvoices';
import UnpaidInvoices from '../components/UnpaidInvoices';
import TodayPayments from '../components/TodayPayments';

export default new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: TodayInvoices,
            name: 'Nota hari ini'
        },
        {
            path: '/unpaid',
            component: UnpaidInvoices,
            name: 'Nota belum lunas'
        },
        {
            path: '/payment',
            component: TodayPayments,
            name: 'Nota lunas hari ini'
        }
    ]
});