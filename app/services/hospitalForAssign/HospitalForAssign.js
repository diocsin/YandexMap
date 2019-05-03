Ext.define('Isidamaps.services.hospitalForAssign.HospitalForAssign', {
    extend: 'Ext.panel.Panel',
    xtype: 'hospitalforassign',

    requires: ['Isidamaps.services.hospitalForAssign.HospitalForAssignController',
        'Isidamaps.services.hospitalForAssign.MapService'
    ],

    controller: 'hospitalforassign',
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
