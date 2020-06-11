Ext.define('Isidamaps.services.brigadesHistory.Monitoring', {
    extend: 'Isidamaps.services.monitoring.Monitoring',
    xtype: 'brigadesHistory',
    id: 'monitoringPanel',

    requires: ['Isidamaps.view.filterBrigadeHistoryView.FilterBrigadeHistoryView',
        'Isidamaps.view.filterBrigadeView.FilterBrigadeView',
        'Isidamaps.services.brigadesHistory.MonitoringController',
        'Isidamaps.services.brigadesHistory.MapService',
        'Isidamaps.view.clusterView.ClusterInfo',
        'Isidamaps.view.markerView.CallInfoWindow',
        'Isidamaps.view.markerView.BrigadeInfoWindow'
    ],

    controller: 'brigadesHistory',
    layout: 'border',
    items: [{
        xtype: 'panel',
        layout: 'vbox',
        region: 'east',
        reference: 'BrigadePanel',
        title: 'Бригады',
        publishes: 'size',
        width: 250,
        floatable: true,
        collapsible: true,
        titleCollapse: true,
        scrollable: 'vertical',
        titleAlign: 'center',
        collapseToolText: 'Скрыть панель',
        expandToolText: 'Открыть панель',
        cls: 'panel-brigade',

        items: [{

            xtype: 'filterBrigadeView-filterBrigade',
            reference: 'filterBrigade'
        }]
    }, {
        xtype: 'panel',
        region: 'west',
        title: 'Фильтр',
        reference: 'navigationPanel',
        publishes: 'size',
        width: 300,
        floatable: true,
        collapsible: true,
        titleCollapse: true,
        titleAlign: 'center',
        collapseToolText: 'Скрыть панель',
        expandToolText: 'Открыть панель',
        items: [{
            xtype: 'filterBrigadeHistoryView-filterBrigadeHistory',
            reference: 'filterLocal'
        }]
    }, {
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
