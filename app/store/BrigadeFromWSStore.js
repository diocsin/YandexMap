Ext.define('Isidamaps.store.BrigadeFromWSStore', {
    extend: 'Ext.data.Store',
    alias: 'BrigadeFromWebSocked',
    model: 'Isidamaps.model.Brigade',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});
