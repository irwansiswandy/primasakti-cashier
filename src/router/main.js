import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import TodayInvoices from '../components/TodayInvoices';
import UnpaidInvoices from '../components/UnpaidInvoices';
import PaymentsReport from '../components/PaymentsReport';

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
            path: '/payments',
            component: PaymentsReport,
            name: 'Pembayaran hari ini'
        }
    ]
});