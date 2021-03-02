import Vue from 'vue';
import Moment from 'moment';

const LOCALE = 'id';

export default Vue.install = (Vue) => {
    Moment.locale(LOCALE);
    Vue.prototype.$moment = Moment;
}