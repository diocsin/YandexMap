Ext.define('Isidamaps.store.DiagnosisGridStore', {
    extend: 'Ext.data.Store',
    model:'Isidamaps.model.Diagnosis',
    sorters: 'value',
    proxy: {
        type: 'memory'
    }
});