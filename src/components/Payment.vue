<template>
    <span id="payment">
        <v-select outlined
                  label="Tipe Pembayaran"
                  :items="payment_types"
                  item-text="name"
                  item-value="value"
                  v-model="payment_type">
        </v-select>
        <v-text-field outlined
                      label="Grand Total"
                      :value="$numeral(invoice.total).format('$0,0')">
        </v-text-field>
        <span v-if="payment_type && payment_type == 'cash'">
            <v-text-field outlined
                          label="Bayar"
                          v-model="paid_amount"
                          prefix="Rp ">
            </v-text-field>
            <v-text-field outlined
                          label="Kembali"
                          :value="$numeral(change).format('$0,0')">
            </v-text-field>
        </span>
    </span>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'payment',
        props: {
            invoice: {
                type: Object,
                required: true
            },
            submit: {
                type: Boolean,
                required: false,
                default: () => {
                    return false;
                }
            }
        },
        data() {
            return {
                payment_type: '',
                paid_amount: ''
            };
        },
        computed: {
            ...mapGetters([
                'payment_types'
            ]),
            change() {
                return this.paid_amount - this.invoice.total;
            },
            valid() {
                if (this.change >= 0) {
                    return true;
                }
                else {
                    return false;
                }
            }
        },
        watch: {
            'payment_type'(value) {
                if (value != 'cash') {
                    this.$set(this, 'paid_amount', this.invoice.total);
                }
            },
            'valid'(new_value) {
                this.$emit('payment-validation', new_value);
            }
        },
        methods: {
            POST() {
                this.$axios
                    .post('api/cashier/payments', {
                        invoice_id: this.invoice.id,
                        type: this.payment_type,
                        paid: this.paid_amount,
                        change: this.change,
                        actions: []
                    }, {
                        params: {
                            includes: 'invoice'
                        }
                    })
                    .then((response) => {
                        this.$emit('payment-success', response.data);
                        // data contains : { message [text], data [payment object]}
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },
        created() {
            this.$numeral.locale('id');
            // Initializes payment_type's default value
            if (!this.invoice.payment) {
                this.$set(this, 'payment_type', 'cash');
            }
            else {
                this.$set(this, 'payment_type', this.invoice.payment.type);
            }
        }
    }
</script>