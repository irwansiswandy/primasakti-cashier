<template>
    <span id="connection-status">
        <v-icon color="success"
                class="ml-2 mr-2"
                v-if="server.on">
            mdi-lan-connect
        </v-icon>
        <v-icon v-else
                color="error"
                class="ml-2 mr-2">
            mdi-lan-disconnect
        </v-icon>
        <v-icon class="ml-2 mr-2">
            mdi-account-check
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