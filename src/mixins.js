export default {
    methods: {
        GET_header_align(key, value) {
            for (let i=0; i<this.table_headers.length; i++) {
                if (this.table_headers[i][key] == value) {
                    return this.table_headers[i].align;
                }
            }
        },
        GET_action_button_disabled(action) {
            for (let i=0; i<Object.keys(action).length; i++) {
                let key = Object.keys(action)[i];
                if (key == 'disabled') {
                    return action[key];
                }
                else {
                    continue;
                }
            }
            return false;
        }
    }
}