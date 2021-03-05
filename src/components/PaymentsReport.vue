<template>
    <span id="invoices-paid-today">
        <table-invoices :invoices="invoices_paid_today.data"
                        :loading="invoices_paid_today.loading">
        </table-invoices>
        <v-card >
            <v-card-title>
                Ringkasan
            </v-card-title>
            <v-card-text>
                <div class="font-weight-bold">
                    Total nota hari ini ({{ number_of_today_invoices + ' nota' }}) :
                    <br>{{ $numeral(total_today_invoices).format('$0,0') }}
                </div>
                <v-divider class="mt-2 mb-2"></v-divider>
                <div class="font-weight-bold">
                    Total pembayaran yang diterima hari ini ({{ number_of_paid_invoices + ' nota' }}) :
                    <br>{{ $numeral(total_paid_invoices).format('$0,0') }}
                </div>
                <v-divider class="mt-2 mb-2"></v-divider>
                <div v-for="(payment_type, index) in payment_types" :key="index">
                    {{ payment_type.name + ' : ' + $numeral(sumOfPaymentType(payment_type.value)).format('$0,0') + ' (' + numberOfPaymentType(payment_type.value) + ')' }}
                </div>
            </v-card-text>
        </v-card>
    </span>
</template>

<script>
    import { mapGetters } from 'vuex';
    import TableInvoices from '../components/TableInvoices';

    export default {
        name: 'payments-report',
        components: {
            TableInvoices
        },
        computed: {
            ... mapGetters([
                'payment_types',
                'today_invoices',
                'invoices_paid_today'
            ]),
            number_of_today_invoices() {
                return this.today_invoices.data.length;
            },
            total_today_invoices() {
                let value = 0;
                for (let i=0; i<this.today_invoices.data.length; i++) {
                    value += Number(this.today_invoices.data[i].total);
                }
                return value;
            },
            number_of_paid_invoices() {
                return this.invoices_paid_today.data.length;
            },
            total_paid_invoices() {
                let value = 0;
                for (let i=0; i<this.invoices_paid_today.data.length; i++) {
                    value += Number(this.invoices_paid_today.data[i].total);
                }
                return value;
            }
        },
        methods: {
            numberOfPaymentType(payment_type) {
                let value = 0;
                for (let i=0; i<this.invoices_paid_today.data.length; i++) {
                    if (this.invoices_paid_today.data[i].payment &&
                        this.invoices_paid_today.data[i].payment.type == payment_type) {
                            value += 1;
                        }
                    else {
                        continue;
                    }
                }
                return value;
            },
            sumOfPaymentType(payment_type) {
                let value = 0;
                for (let i=0; i<this.invoices_paid_today.data.length; i++) {
                    if (this.invoices_paid_today.data[i].payment &&
                        this.invoices_paid_today.data[i].payment.type == payment_type) {
                            value += Number(this.invoices_paid_today.data[i].total);
                        }
                    else {
                        continue;
                    }
                }
                return value;
            }
        }
    } 
</script>