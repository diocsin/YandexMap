Ext.define('Isidamaps.store.ReasonAutoCompleteStore', {
    extend: 'Ext.data.Store',
    model:'Isidamaps.model.AutoComplete',
    sorters: 'value',
    proxy: {
        type: 'memory'
    }
});