Ext.define('Isidamaps.services.factRouteHistory.FactRouteHistory', {
    extend: 'Ext.panel.Panel',
    xtype: 'factroutehistory',

    requires: ['Isidamaps.services.factRouteHistory.FactRouteHistoryController',
        'Isidamaps.services.factRouteHistory.MapService',
        'Isidamaps.services.factRouteHistory.FactRouteHistory'
    ],
    controller: 'factroutehistory',
    layout: 'border',
    items: [{
        xtype: 'panel',
        title: 'История маршрута',
        region: 'east',
        reference: 'routeHistoryTablePanel',
        publishes: 'size',
        width: 500,
        floatable: true,
        collapsible: true,
        titleCollapse: true,
        titleAlign: 'center',
        collapseToolText: 'Скрыть панель',
        expandToolText: 'Открыть панель',
        cls: 'panel-history',
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