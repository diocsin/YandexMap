Ext.define('Isidamaps.store.BrigadeSearchStore', {
    extend: 'Ext.data.Store',
    model:'Isidamaps.model.Brigade',
    sorters: 'brigadeNum',
    proxy: {
        type: 'memory'
    }
});