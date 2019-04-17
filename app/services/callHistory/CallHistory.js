Ext.define('Isidamaps.services.callHistory.CallHistory', {
    extend: 'Ext.panel.Panel',
    xtype: 'callhistory',

    requires: ['Isidamaps.view.routeHistoryView.RouteHistoryView',
        'Isidamaps.view.routeHistoryTableView.RouteHistoryTableView',
        'Isidamaps.services.callHistory.CallHistoryController',
        'Isidamaps.services.callHistory.MapService'
    ],

    controller: 'callhistory',
    layout: 'border',
    items: [{
        xtype: 'panel',
        region: 'west',
        reference: 'navigationPanel',
        publishes: 'size',
        width: 400,
        floatable: true,
        collapsible: true,
        titleAlign: 'center',
        collapseToolText: 'Скрыть панель',
        expandToolText: 'Открыть панель',
        layout: 'fit',

        items: [{
            title: 'Параметры доезда',
            xtype: 'routeHistoryView-routeHistory'
        }]
    }, {
        xtype: 'panel',
        region: 'east',
        reference: 'routeHistoryTablePanel',
        publishes: 'size',
        width: 500,
        floatable: true,
        collapsible: true,
        titleAlign: 'center',
        collapseToolText: 'Скрыть панель',
        expandToolText: 'Открыть панель',
        layout: 'fit',

        items: [{
            title: 'История маршрута',
            xtype: 'routeHistoryTableView-routeHistoryTable'
        }]
    },
        {
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
