Ext.define('Isidamaps.store.DistrictAutoCompleteStore', {
    extend: 'Ext.data.Store',
    model:'Isidamaps.model.AutoComplete',
    sorters: 'value',
    proxy: {
        type: 'memory'
    }
});