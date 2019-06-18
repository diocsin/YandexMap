Ext.define('Isidamaps.view.filterHeatMapView.FilterHeatMapView', {
    extend: 'Ext.tab.Panel',
    requires: [
        'Isidamaps.view.filterHeatMapView.filterHeatMap.FilterHeatMap'
    ],
    alias: 'widget.filterHeatMapView',
    items: [{
        title: 'Фильтр',
        xtype: 'filterHeatMapView-filterHeatMap'
    }]
});
