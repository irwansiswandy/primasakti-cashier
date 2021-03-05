<template>
    <span id="connection-status">
        <v-icon color="green"
                class="mr-2"
                v-if="server.on">
            mdi-lan-connect
        </v-icon>
        <v-icon color="red"
                class="mr-2"
                v-else>
            mdi-lan-disconnect
        </v-icon>
        <v-icon color="green"
                v-if="authorized">
            mdi-account-check
        </v-icon>
        <v-icon color="red"
                v-else>
            mdi-account-check-cancel
        </v-icon>
    </span>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'connection-status',
        computed: {
            ...mapGetters([
                'server',
                'authorized'
            ])
        }
    }
</script>