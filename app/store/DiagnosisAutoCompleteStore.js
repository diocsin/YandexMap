Ext.define('Isidamaps.store.DiagnosisAutoCompleteStore', {
    extend: 'Ext.data.Store',
    model:'Isidamaps.model.AutoComplete',
    sorters: 'value',
    proxy: {
        type: 'memory'
    }
});