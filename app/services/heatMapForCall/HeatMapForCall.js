Ext.define('Isidamaps.services.heatMapForCall.HeatMapForCall', {
    extend: 'Ext.panel.Panel',
    xtype: 'heatMapForCall',
    id: 'heatMapForCallPanel',

    requires: [
        'Isidamaps.services.heatMapForCall.HeatMapForCallController',
        'Isidamaps.services.heatMapForCall.MapService',
        'Isidamaps.view.filterHeatMapView.FilterHeatMapView'
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
    },
        {
            xtype: 'panel',
            region: 'south',
            title: 'Фильтр',
            reference: 'navigationPanel',
            publishes: 'size',
            height: 580,
            floatable: true,
            collapsible: true,
            titleCollapse: true,
            titleAlign: 'center',
            collapseToolText: 'Скрыть панель',
            expandToolText: 'Открыть панель',
            items: [{
                xtype: 'filterHeatMapView-filterHeatMap',
                reference: 'filterHeat'
            }]
        }],
    listeners: {
        'boxready': 'layoutReady'
    }
});
