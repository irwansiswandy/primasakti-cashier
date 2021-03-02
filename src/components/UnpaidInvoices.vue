<template>
    <span id="unpaid-invoices">
        <table-invoices :loading="unpaid_invoices.loading"
                        :invoices="unpaid_invoices.data">
        </table-invoices>
    </span>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import TableInvoices from './TableInvoices';

    export default {
        name: 'unpaid-invoices',
        components: {
            TableInvoices
        },
        computed: {
            ...mapGetters([
                'unpaid_invoices'
            ])
        },
        methods: {
            ...mapMutations([
                'set_invoices'
            ])
        }
    }
</script>
