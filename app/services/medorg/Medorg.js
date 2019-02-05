Ext.define('Isidamaps.services.medorg.Medorg', {
    extend: 'Ext.panel.Panel',
    xtype: 'medorg',

    requires: [
        'Isidamaps.services.medorg.MedorgController',
        'Isidamaps.services.medorg.MapService'
    ],

    controller: 'medorg',
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
