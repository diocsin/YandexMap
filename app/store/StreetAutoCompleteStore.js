Ext.define('Isidamaps.store.StreetAutoCompleteStore', {
    extend: 'Ext.data.Store',
    model:'Isidamaps.model.AutoComplete',
    sorters: 'value',
    proxy: {
        type: 'memory'
    }
});