<template>
    <span id="table-invoices">
        <v-data-table :loading="loading"
                      :headers="table_headers"
                      :items="invoices"
                      :search="search.value"
                      :custom-filter="FILTER_by_search_key">
            <template v-slot:top>
                <v-row>
                    <v-col>
                        <v-select single-line clearable
                                  prepend-icon="mdi-magnify"
                                  label="Semua kolom"
                                  :items="table_headers"
                                  item-value="value"
                                  v-model="search.key">
                        </v-select>
                    </v-col>
                    <v-col>
                        <v-text-field single-line clearable
                                      label="Kata kunci"
                                      v-model="search.value">
                        </v-text-field>
                    </v-col>
                </v-row>
            </template>
            <template tag="tr" v-slot:item="{ item }">
                <tr>
                    <td :class="'text-' + GET_header_align('text', '')">
                        <v-tooltip bottom
                                   v-if="item.payment && item.payment.status">
                            <template v-slot:activator="{ attrs, on }">
                                <v-icon color="green"
                                        v-bind="attrs" v-on="on">
                                    mdi-cash-check
                                </v-icon>
                            </template>
                            <span class="caption">
                                Lunas
                            </span>
                        </v-tooltip>
                        <v-tooltip bottom
                                   v-else-if="item.payment && !item.payment.status && item.payment.type == 'bank_transfer'">
                            <template v-slot:activator="{ attrs, on }">
                                <v-icon v-bind="attrs" v-on="on">
                                    mdi-timer-sand
                                </v-icon>
                            </template>
                            <span class="caption">
                                Menunggu status transfer
                            </span>
                        </v-tooltip>
                        <v-tooltip bottom
                                   v-else>
                            <template v-slot:activator="{ attrs, on }">
                                <v-icon color="red"
                                        v-bind="attrs" v-on="on">
                                    mdi-cash-remove
                                </v-icon>
                            </template>
                            <span class="caption">
                                Belum lunas
                            </span>
                        </v-tooltip>
                    </td>
                    <td :class="'text-' + GET_header_align('text', 'ID')">
                        {{ item.id }}
                    </td>
                    <td :class="'text-' + GET_header_align('text', 'No. nota')">
                        {{ item.invoice_no }}
                    </td>
                    <td :class="'text-' + GET_header_align('text', 'Total')">
                        {{ $numeral(item.total).format('$0,0') }}
                    </td>
                    <td :class="'text-' + GET_header_align('text', 'Tgl/Waktu dibuat')">
                        {{ item.created_at }}
                    </td>
                    <td :class="'text-' + GET_header_align('text', 'Tgl/Waktu diubah')">
                        <span v-if="item.created_at != item.updated_at">{{ item.updated_at }}</span>
                        <span v-else>-</span>
                    </td>
                    <td :class="'text-' + GET_header_align('text', 'Yang membuat')">
                        <div v-for="(admin, index) in item.admin" :key="index">
                            {{ admin.first_name + ' ' + admin.last_name }}
                        </div>
                    </td>
                    <!-- Actions -->
                    <td :class="'text-' + GET_header_align('value', 'action')">
                        <!-- Centang transfer -->
                        <!-- Displayed if invoice's payment type is 'bank_transfer', but payment's status is false -->
                        <v-tooltip bottom
                                   v-if="item.payment && item.payment.type == 'bank_transfer' && !item.payment.status">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon class="ml-1"
                                        v-bind="attrs" v-on="on"
                                        v-on:click="HANDLE_table_action('transfer_confirmation', item)">
                                    mdi-credit-card-check
                                </v-icon>
                            </template>
                            <span class="caption">
                                Transfer sudah diterima
                            </span>
                        </v-tooltip>
                        <!-- /Centang transfer -->
                        <!-- Kasir -->
                        <!-- Displayed if invoice's payment is null or payment's status is false -->
                        <v-tooltip bottom
                                   v-if="!item.payment || !item.payment.status">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon class="ml-1"
                                        v-bind="attrs" v-on="on"
                                        v-on:click="HANDLE_table_action('payment', item)">
                                    mdi-cash-register
                                </v-icon>
                            </template>
                            <span class="caption">
                                Buka kasir
                            </span>
                        </v-tooltip>
                        <!-- /Kasir -->
                        <!-- Lihat nota -->
                        <!-- Always displayed -->
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon class="ml-1"
                                        color="info"
                                        v-bind="attrs" v-on="on"
                                        v-on:click="HANDLE_table_action('show', item)">
                                    mdi-information
                                </v-icon>    
                            </template>
                            <span class="caption">
                                Lihat nota
                            </span>
                        </v-tooltip>
                        <!-- /Lihat nota-->
                    </td>
                    <!-- /Actions -->
                </tr>
            </template>
        </v-data-table>
        <!-- Dialog -->
        <v-dialog persistent
                  max-width="800"
                  :fullscreen="dialog.fullscreen"
                  v-model="dialog.show">
            <!-- Regular-size content -->
            <v-card v-if="!dialog.fullscreen">
                <v-card-title>{{ dialog.title }}</v-card-title>
                <v-card-text>
                    <v-alert dense type="warning"
                             v-model="alert.show">
                        {{ alert.text }}
                    </v-alert>
                    <invoice :id="dialog.invoice.id"
                             v-if="dialog.invoice">
                    </invoice>
                </v-card-text>
                <v-card-actions class="text-right">
                    <v-spacer></v-spacer>
                    <span v-for="(action, index) in dialog.actions" :key="index">
                        <v-btn text :color="action.color"
                               v-on:click="HANDLE_dialog_action(action.name)">
                            <span v-if="!action.loading">
                                {{ action.text }}
                            </span>
                            <span v-else>
                                <v-progress-circular indeterminate></v-progress-circular>
                            </span>
                        </v-btn>
                    </span>
                </v-card-actions>
            </v-card>
            <!-- / Regular-size content -->
            <!-- Fullscreen content -->
            <v-card tile v-else>
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>{{ dialog.title }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <template v-for="(action, index) in dialog.actions">
                            <v-btn text :key="index" :disabled="GET_action_button_disabled(action)"
                                   v-on:click="HANDLE_dialog_action(action.name)">
                                <span v-if="!action.loading">
                                    {{ action.text }}
                                </span>
                                <span v-else>
                                    <v-progress-circular indeterminate></v-progress-circular>
                                </span>
                            </v-btn>
                        </template>
                    </v-toolbar-items>
                </v-toolbar>
                <v-container fluid>
                    <v-row>
                        <v-col cols="2" sm="7">
                            <v-card tile>
                                <v-card-title>Nota #{{ dialog.invoice.id }}</v-card-title>
                                <v-card-text>
                                    <invoice :id="dialog.invoice.id"
                                             v-if="dialog.invoice">
                                    </invoice>
                                </v-card-text>
                            </v-card>
                        </v-col>
                        <v-col>
                            <v-card tile>
                                <v-card-text>
                                    <payment ref="payment"
                                             :invoice="dialog.invoice"
                                             v-on:payment-validation="HANDLE_payment_validation"
                                             v-on:payment-success="HANDLE_payment_success">
                                    </payment>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
            <!-- / Fullscreen content -->
        </v-dialog>
        <!-- /Dialog -->
    </span>
</template>

<script>
    import { mapMutations } from 'vuex';
    import Mixins from '../mixins';
    import Invoice from './Invoice';
    import Payment from './Payment';

    export default {
        name: 'table-invoices',
        props: {
            invoices: {
                type: Array,
                required: true
            },
            loading: {
                type: Boolean,
                required: false,
                default: () => {
                    return false;
                }
            }
        },
        components: {
            Invoice,
            Payment
        },
        mixins: [
            Mixins
        ],
        data() {
            return {
                table_headers: [
                    { 
                        text: '',
                        value: '',
                        align: 'left',
                        sortable: false,
                        filterable: false
                    },
                    { 
                        text: 'ID',
                        value: 'id', 
                        align: 'left', 
                        sortable: true,
                        filterable: true
                    },
                    { 
                        text: 'No. Nota', 
                        value: 'invoice_no',
                        align: 'left', 
                        sortable: true,
                        filterable: true
                    },
                    { 
                        text: 'Total', 
                        value: 'total', 
                        align: 'right', 
                        sortable: true,
                        filterable: true
                    },
                    { 
                        text: 'Tgl/Waktu dibuat',
                        value: 'created_at',
                        align: 'right',
                        sortable: true,
                        filterable: true
                    },
                    { 
                        text: 'Tgl/Waktu diubah', 
                        value: 'updated_at', 
                        align: 'right', 
                        sortable: true,
                        filterable: true
                    },
                    { 
                        text: 'Yang membuat', 
                        value: 'admin', 
                        align: 'right', 
                        sortable: true,
                        filterable: true
                    },
                    {
                        text: '',
                        value: 'action',
                        align: 'right',
                        sortable: false
                    }
                ],
                dialog: {
                    show: false,
                    fullscreen: false,
                    content: '',
                    title: '',
                    actions: [],
                    invoice: null
                },
                search: {
                    key: '',
                    value: ''
                },
                alert: {
                    show: false,
                    type: '',
                    text: ''
                }
            };
        },
        watch: {
            'dialog.show'(new_value) {
                if (!new_value) {
                    this.$set(this.dialog, 'show', false);
                    setTimeout(() => {
                        this.$set(this.dialog, 'fullscreen', false);
                        this.$set(this.dialog, 'content', '');
                        this.$set(this.dialog, 'title', '');
                        this.$set(this.dialog, 'actions', []);
                        this.$set(this.dialog, 'invoice', null);
                        if (this.alert.show) {
                            this.$set(this.alert, 'type', '');
                            this.$set(this.alert, 'text', '');
                            this.$set(this.alert, 'show', false);
                        }
                    }, 500);
                }
            }
        },
        methods: {
            ...mapMutations([
                'show_snackbar',
                'set_invoice_payment'
            ]),
            FILTER_by_search_key(value, search, table_item) {
                let regexed_search = new RegExp(search, 'i');
                if (this.search.key) {
                    return regexed_search.test(table_item[this.search.key]);
                }
                else {
                    let total_search_keys = Object.keys(table_item).length;
                    for (let i=0; i<total_search_keys; i++) {
                        let key = Object.keys(table_item)[i];
                        if (regexed_search.test(table_item[key])) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                }
            },
            HANDLE_table_action(content, invoice) {
                this.$set(this.dialog, 'content', content);
                this.$set(this.dialog, 'invoice', invoice);
                this.dialog.actions.push(
                    { text: 'Tutup', name: 'close', color: 'red' }
                );
                switch (content) {
                    case 'show':
                        this.$set(this.dialog, 'title', 'Nota #' + invoice.id);
                        this.$set(this.dialog, 'show', true);
                        break;
                    case 'payment':
                        this.$set(this.dialog, 'fullscreen', true);
                        this.$set(this.dialog, 'title', 'Terima pembayaran');
                        this.dialog.actions.push({ 
                            text: 'Simpan', 
                            name: 'save', 
                            disabled: true,
                            loading: false
                        });
                        this.$set(this.dialog, 'show', true);
                        break;
                    case 'transfer_confirmation':
                        this.$set(this.dialog, 'title', 'Konfirmasi transfer untuk nota #' + invoice.id);
                        this.dialog.actions.push({
                            text: 'Konfirmasi',
                            name: 'confirm_transfer',
                            loading: false
                        });
                        this.$set(this.alert, 'text', 'Sebelum konfirmasi, harap nota dicek dulu dengan teliti');
                        this.$set(this.dialog, 'show', true);
                        setTimeout(() => {
                            this.$set(this.alert, 'show', true);
                        }, 500);
                        break;
                }
            },
            HANDLE_dialog_action(name) {
                switch (name) {
                    case 'close':
                        this.$set(this.dialog, 'show', false);
                        break;
                    case 'save':
                        for (let i=0; i<this.dialog.actions.length; i++) {
                            if (this.dialog.actions[i].name == 'save') {
                                this.$set(this.dialog.actions[i], 'loading', true);
                            }
                            else {
                                continue;
                            }
                        }
                        this.$refs.payment.POST();
                        break;
                    case 'confirm_transfer':
                        for (let i=0; i<this.dialog.actions.length; i++) {
                            if (this.dialog.actions[i].name == 'confirm_transfer') {
                                console.log(this.dialog.actions[i]);
                                this.$set(this.dialog.actions[i], 'loading', true);
                            }
                            else {
                                continue;
                            }
                        }
                        this.CONFIRM_bank_transfer(this.dialog.invoice);
                        break;
                }
            },
            HANDLE_payment_validation(value) {
                for (let i=0; i<this.dialog.actions.length; i++) {
                    if (this.dialog.actions[i].name == 'save') {
                        this.$set(this.dialog.actions[i], 'disabled', !value);
                        break;
                    }
                    else {
                        continue;
                    }
                }
            },
            HANDLE_payment_success(data) {
                this.show_snackbar(data.message);
                this.$set(this.dialog, 'show', false);
            },
            CONFIRM_bank_transfer(invoice) {
                this.$axios
                    .patch('api/cashier/payments/' + invoice.id, {
                        status: true
                    })
                    .then((response) => {
                        console.log(response);
                        this.$set(this.dialog, 'show', false)
                    });
            }
        },
        created() {
            this.$numeral.locale('id');
            this.$set(this.search, 'key', 'invoice_no');
        }
    }
</script>