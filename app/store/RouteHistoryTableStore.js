Ext.define('Isidamaps.store.RouteHistoryTableStore', {
    extend: 'Ext.data.Store',
    groupField: 'place',
    remoteSort: true,
    model: 'Isidamaps.model.RouteHistoryTable',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
        }
    }
});