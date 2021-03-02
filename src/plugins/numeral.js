import Vue from 'vue';

const Numeral = require('numeral');

Numeral.register('locale', 'id', {
    currency: {
        symbol: 'Rp '
    },
    delimiters: {
        thousands: ',',
        decimal: ','
    },
    abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
    }
});

export default Vue.install = (Vue) => {
    Vue.prototype.$numeral = Numeral;
}