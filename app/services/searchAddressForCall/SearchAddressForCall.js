Ext.define('Isidamaps.services.searchAddressForCall.SearchAddressForCall', {
    extend: 'Ext.panel.Panel',
    xtype: 'searchAddressForCall',
    id: 'searchAddressForCallPanel',

    requires: [
        'Isidamaps.services.searchAddressForCall.SearchAddressForCallController',
        'Isidamaps.services.searchAddressForCall.MapService'
    ],

    controller: 'searchAddressForCall',
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
