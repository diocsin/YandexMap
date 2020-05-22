Ext.define('Isidamaps.store.BrigadesFirstLoadStore', {
    extend: 'Ext.data.Store',
    model: 'Isidamaps.model.Brigade',
    proxy: {
        type: 'ajax',
        timeout: 90000,
        reader: {
            type: 'json'
        }
    }
});