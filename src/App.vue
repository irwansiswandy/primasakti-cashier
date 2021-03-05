<template>
  <v-app>
    <v-main>
      <!-- Navigation drawer -->
      <v-navigation-drawer app v-model="nav_drawer">
        <v-list dense>
          <v-list-item v-for="(route, index) in routes" :key="index"
                       link
                       :to="route.path">
            <v-list-item-title>
              {{ route.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <!-- /Navigation drawer -->
      <!-- App bar -->
      <v-app-bar app flat dark
                 color="primary">
        <v-app-bar-nav-icon>
          <v-btn icon v-on:click="nav_drawer = !nav_drawer">
            <v-icon v-if="!nav_drawer">mdi-menu</v-icon>
            <v-icon v-else>mdi-menu-open</v-icon>
          </v-btn>
        </v-app-bar-nav-icon>
        <v-toolbar-title class="font-logo">
          Kasir | Primasakti - Print Shop
        </v-toolbar-title>
      </v-app-bar>
      <!-- /App bar -->
      <!-- Content -->
      <v-container fluid>
        <v-row>
          <v-col class="title">
            {{ title }}
          </v-col>
        </v-row>
        <router-view></router-view>
      </v-container>
      <!-- /Content -->
      <!-- Connection status -->
      <v-footer fixed
                color="transparent"
                class="pb-3">
        <connection-status></connection-status>
      </v-footer>
      <!-- /Connection status -->
      <v-snackbar dark color="green"
                  v-model="snackbar.show">
        {{ snackbar.text }}
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
  import { mapState, mapGetters, mapMutations } from 'vuex';
  import ConnectionStatus from './components/ConnectionStatus.vue';
  import Env from './_env';
  import Mixins from './mixins';

  export default {
    name: 'App',
    components: {
      ConnectionStatus
    },
    mixins: [
      Mixins
    ],
    data() {
      return {
        nav_drawer: false
      };
    },
    computed: {
      ...mapState([
        'server',
        'authorized'
      ]),
      ...mapGetters([
        'server_date',
        'today_invoices',
        'snackbar'
      ]),
      title() {
        return this.$route.name;
      },
      route() {
        return this.$route;
      },
      routes() {
        return this.$router.options.routes;
      }
    },
    watch: {
      'server_date'(new_value) {
        this.INIT_today_invoices(new_value);
        this.INIT_invoices_paid_on(new_value);
      },
      'authorized'(new_value) {
        if (new_value) {
          this.INIT_pusher();
        }
      },
      'snackbar.show'(new_value) {
        if (new_value) {
          setTimeout(() => {
            this.hide_snackbar();
          }, 3000);
        }
      },
      'route.path'(new_path, old_path) {
        if (new_path != old_path) {
          setTimeout(() => {
            this.$set(this, 'nav_drawer', false);
          }, 250);
        }
      }
    },
    methods: {
      ...mapMutations([
        'set_payment_types',
        'set_invoices',
        'add_invoice',
        'update_invoice',
        'delete_invoice',
        'unset_invoices',
        'hide_snackbar',
        'set_invoice_payment',
        'move_invoice'
      ]),
      INIT_server() {
        this.$axios
          .get('/')
          .then((response) => {
            this.$set(this.$store.state.server, 'on', true);
            this.$set(this.$store.state.server, 'datetime', response.data.datetime);
            this.$set(this.$store.state.server, 'timezone', response.data.timezone);
          });
      },
      INIT_authorized() {
        this.$axios
          .get('/api/cashier')
          .then((response) => {
            if (response.status == 200) {
              this.$set(this.$store.state, 'authorized', true);
            }
          });
      },
      INIT_payment_types() {
        this.$axios
            .get('/api/options/payment')
            .then((response) => {
              this.set_payment_types(response.data);
            });
      },
      INIT_pusher() {
        let subscribed_channels = Env.pusher.channels;
        for (let i=0; i<subscribed_channels.length; i++) {
          this.$pusher.subscribe(subscribed_channels[i]);
        }
        this.$pusher
          .channel('primasakti-admin')
          .bind('activity-log', (activity) => {
            // This handles PAYMENT's activities
            if (activity.subject_type == 'App\\Payment') {
              let payment = activity.properties.subject;
              /* disabled
              console.log({
                activity: activity,
                data: payment
              });
              */
              if (activity.log_name == 'payment-created') {
                if (payment.status) {
                  // add payment to invoice in unpaid_invoices and today_invoices
                  this.set_invoice_payment([
                    ['unpaid', 'today'],
                    payment.invoice_id,
                    payment
                  ]);
                  // move invoice from unpaid_invoices to invoices_paid_today
                  this.move_invoice([
                    'unpaid',
                    'paid_today',
                    payment.invoice_id
                  ]);
                }
                else {
                  // add payment to invoice's payment in unpaid_invoices
                  this.set_invoice_payment([
                    'unpaid',
                    payment.invoice_id,
                    payment
                  ]);
                  // add payment to invoice's payment in today_invoices if invoice created same as server_date
                  if (this.GET_invoice_date(payment.invoice) == this.server_date) {
                    this.set_invoice_payment([
                      'today',
                      payment.invoice_id,
                      payment
                    ]);
                  }
                }
              }
              else if (activity.log_name == 'payment-updated') {
                let updated_payment = payment.new;
                if (updated_payment.status) {
                  // updates invoice's payment in unpaid_invoices
                  this.set_invoice_payment([
                    'unpaid',
                    payment.invoice_id,
                    payment
                  ]);
                  // moves invoice to invoices_paid_today
                  this.move_invoice([
                    'unpaid',
                    'paid_today',
                    updated_payment.invoice_id
                  ]);
                  // updates invoice's payment in today_invoices
                  // if invoice created same as server_date
                  if (this.GET_invoice_date(updated_payment.invoice) == this.server_date) {
                    this.set_invoice_payment([
                      'today',
                      updated_payment.invoice_id,
                      updated_payment
                    ]);
                  }
                }
                else {
                  // updates invoice's payment in unpaid_invoices
                  this.set_invoice_payment([
                    'unpaid',
                    updated_payment.invoice_id,
                    updated_payment
                  ]);
                  // updates invoice's payment in today_invoices if invoice created same as server_date
                  if (this.GET_invoice_date(updated_payment.invoice) == this.server_date) {
                    this.set_invoice_payment([
                      'today',
                      updated_payment.invoice_id,
                      updated_payment
                    ]);
                  }
                }
              }
              else if (activity.log_name == 'payment-deleted') {
                //
              }
            }
            // This handles INVOICE's activities
            else if (activity.subject_type == 'App\\Invoice') {
              let invoice = activity.properties.subject;
              /* disabled
              console.log({
                activity: 'invoice',
                data: invoice
              });
              */
              if (activity.log_name == 'invoice-created') {
                // add invoice to unpaid_invoices and today_invoices
                this.add_invoice([
                  ['unpaid', 'today'],
                  invoice
                ]);
              }
              else if (activity.log_name == 'invoice-updated') {
                // invoice's object contains new, old
                let updated_invoice = invoice.new;
                // updates invoice in unpaid_invoices
                this.update_invoice([
                  'unpaid',
                  updated_invoice.id,
                  updated_invoice
                ]);
                // updates invoice in today_invoices if invoice created same as server_date
                if (this.GET_invoice_date(updated_invoice) == this.server_date) {
                  this.update_invoice([
                    'today',
                    updated_invoice.id,
                    updated_invoice
                  ]);
                }
              }
              else if (activity.log_name == 'invoice-deleted') {
                // deletes invoice from unpaid_invoices
                this.delete_invoice([
                  'unpaid',
                  invoice.id
                ]);
                // deletes invoice from today_invoices if invoice created same as server_date
                if (this.GET_invoice_date(invoice) == this.server_date) {
                  this.delete_invoice([
                    'today',
                    invoice.id
                  ]);
                }
              }
            }
        });
      },
      INIT_today_invoices(date) {
        this.$axios
            .get('/api/cashier/invoices', {
              params: {
                scope: 'withinDate:' + date,
                order_by: 'created_at, desc',
                includes: 'user,admin,payment'
              }
            })
            .then((response) => {
              let invoices = response.data;
              this.set_invoices(['today', 'data', invoices]);
              this.set_invoices(['today', 'loading', false]);
            });
      },
      INIT_unpaid_invoices() {
        this.$axios
            .get('/api/cashier/invoices', {
              params: {
                scope: 'unpaid',
                order_by: 'created_at, desc',
                includes: 'user,admin,payment'
              }
            })
            .then((response) => {
              let invoices = response.data;
              this.set_invoices(['unpaid', 'data', invoices]);
              this.set_invoices(['unpaid', 'loading', false]);
            });
      },
      INIT_invoices_paid_on(date) {
        this.$axios
            .get('/api/cashier/invoices', {
              params: {
                scope: 'paidDate:' + date,
                includes: 'user,admin,payment'
              }
            })
            .then((response) => {
              let invoices = response.data;
              this.set_invoices(['paid_today', 'data', invoices]);
              this.set_invoices(['paid_today', 'loading', false]);
            });
      }
    },
    mounted() {
      this.INIT_server();
      this.INIT_authorized();
      this.INIT_payment_types();
      this.INIT_unpaid_invoices();
    }
  }
</script>
