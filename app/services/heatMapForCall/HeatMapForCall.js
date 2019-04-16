Ext.define('Isidamaps.services.heatMapForCall.HeatMapForCall', {
    extend: 'Ext.panel.Panel',
    xtype: 'heatMapForCall',
    id: 'heatMapForCallPanel',

    requires: [
        'Isidamaps.services.heatMapForCall.HeatMapForCallController',
        'Isidamaps.services.heatMapForCall.MapService'
    ],

    controller: 'heatMapForCall',
    layout: 'border',
    items: [{
        xtype: 'container',
        region: 'center',
        reference: 'ymapWrapper',
        id: 'mapId',
        layout: 'container',
        listeners: {
            'boxready': 'mainBoxReady'
        }
    }],
    listeners: {
        'boxready': 'layoutReady'
    }
});
