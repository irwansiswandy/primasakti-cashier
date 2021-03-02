<template>
  <span id="today-invoices">
    <table-invoices :invoices="today_invoices.data"
                    :loading="today_invoices.loading">
    </table-invoices>
  </span>
</template>

<script>
  import { mapGetters } from 'vuex';
  import TableInvoices from './TableInvoices';

  export default {
    name: 'today-invoices',
    components: {
      TableInvoices
    },
    computed: {
      ...mapGetters([
        'server_date',
        'today_invoices'
      ]),
      total() {
        return this.today_invoices.data.length;
      }
    }
  }
</script>
