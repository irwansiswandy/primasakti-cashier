<template>
    <span id="invoice"
          v-if="ready">
        <v-row>
            <v-col class="text-left">
                <div>Nama staff :</div>
                <div v-for="(admin, index) in invoice.admin" :key="index">
                    {{ admin.first_name + ' ' + admin.last_name }}
                </div>
            </v-col>
            <v-col class="text-right">
                <div>Customer :</div>
                <span v-if="invoice.user">
                    <div>{{ invoice.user.first_name + ' ' + invoice.user.last_name }}</div>
                </span>
                <div v-else>-</div>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-left">
                <div>No. nota : </div>
                <div>{{ invoice.invoice_no }}</div>
            </v-col>
            <v-col class="text-center">
                <div>Tgl/waktu dibuat :</div>
                <div>{{ invoice.created_at }}</div>
            </v-col>
            <v-col class="text-right">
                <div>Tgl/waktu diubah :</div>
                <div v-if="invoice.updated_at != invoice.created_at">{{ invoice.updated_at }}</div>
                <div v-else>-</div>
            </v-col>
        </v-row>
        <v-data-table hide-default-footer
                      :headers="table_headers"
                      :items="invoice.items">
            <template v-slot:item="{ item }">
                <tr>
                    <td :class="'text-' + GET_header_align('text', 'Keterangan')">
                        {{ item.product.category.name }}
                        <br>{{ item.product.name }}
                    </td>
                    <td :class="'text-' + GET_header_align('text', 'Qty')">
                        {{ Number(item.qty) }}
                    </td>
                    <td :class="'text-' + GET_header_align('text', 'Harga @')">
                        {{ $numeral(item.price).format('$0,0') }}
                    </td>
                    <td :class="'text-' + GET_header_align('text', 'Subtotal')">
                        {{ $numeral(item.subtotal).format('$0,0') }}
                    </td>
                </tr>
            </template>
            <template v-slot:body.append>
                <tr>
                    <td colspan="3" class="text-right font-weight-black">
                        Grand Total
                    </td>
                    <td class="text-right font-weight-black">
                        {{ $numeral(invoice.total).format('$0,0') }}
                    </td>
                </tr>
            </template>
        </v-data-table>
        <v-row v-if="invoice.payment && invoice.payment.status">
            <v-col class="text-left">
                <div>Tgl/waktu pembayaran diterima :</div>
                <div>{{ invoice.payment.created_at }}</div>
            </v-col>
            <v-col class="text-right">
                <div>Tipe pembayaran :</div>
                <div>{{ invoice.payment.type }}</div>
            </v-col>
        </v-row>
    </span>
    <!-- Loading -->
    <span v-else>
        <v-progress-linear indeterminate
                           color="primary">
        </v-progress-linear>
    </span>
    <!-- /Loading -->
</template>

<script>
    import Mixins from '../mixins';

    export default {
        name: 'invoice',
        props: {
            id: {
                type: Number,
                required: true
            }
        },
        mixins: [
            Mixins
        ],
        data() {
            return {
                loading: true,
                invoice: null,
                table_headers: [
                    {
                        text: 'Keterangan',
                        value: '',
                        align: 'left',
                        sortable: false
                    },
                    {
                        text: 'Qty',
                        value: '',
                        align: 'left',
                        sortable: false
                    },
                    {
                        text: 'Harga @',
                        value: '',
                        align: 'right',
                        sortable: 'false'
                    },
                    {
                        text: 'Subtotal',
                        value: '',
                        align: 'right',
                        sortable: false
                    }
                ]
            };
        },
        computed: {
          ready() {
            if (!this.loading && this.invoice) {
              return true;
            }
            else {
              return false;
            }
          }
        },
        methods: {
            GET_invoice(id) {
                this.$axios
                    .get('api/cashier/invoices/' + id, {
                        params: {
                            includes: 'items,admin,user,payment'
                        }
                    })
                    .then((response) => {
                        let invoice = response.data;
                        this.$set(this, 'invoice', invoice);
                        this.$set(this, 'loading', false);
                    });
            }
        },
        created() {
            this.$numeral.locale('id');
            this.GET_invoice(this.id);
        }
    }
</script>
