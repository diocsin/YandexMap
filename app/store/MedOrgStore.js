Ext.define('Isidamaps.store.MedOrgStore', {
    extend: 'Ext.data.Store',
    model: 'Isidamaps.model.Medorg',
    proxy: {
        type: 'ajax',
        reader: {
            type: 'json'
        }
    }
});
