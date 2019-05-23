Ext.define('Isidamaps.store.CallFromWSStore', {
    extend: 'Ext.data.Store',
    alias: 'CallFromWebSocked',
    model: 'Isidamaps.model.Call',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});