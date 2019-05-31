Ext.define('Isidamaps.model.FactRoute', {
    extend: 'Ext.data.Model',
    fields: ['latitude', 'longitude', {name:'lastUpdateTime',   type: 'date'}, 'speed', 'vector']
});
