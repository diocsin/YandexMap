Ext.define('Isidamaps.model.Route', {
    extend: 'Ext.data.Model',
    idProperty: 'brigadeId',
    fields: [{
        name: 'checkBox',
        type: 'boolean'
    },
        {
            name: 'time',
            type: 'auto'
        },
        {
            name: 'brigadeNum',
            type: 'number'
        }, {
            name: 'brigadeId'
        },
        {
            name: 'distance',
            type: 'auto'
        },
        'profile',]
});
