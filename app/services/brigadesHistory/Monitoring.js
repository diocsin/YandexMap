Ext.define('Isidamaps.services.brigadesHistory.Monitoring', {
    extend: 'Isidamaps.services.monitoring.Monitoring',
    xtype: 'brigadesHistory',
    id: 'monitoringPanel',

    requires: ['Isidamaps.view.filterLocalMonitoringView.FilterLocalMonitoringView',
        'Isidamaps.view.filterBrigadeView.FilterBrigadeView',
        'Isidamaps.services.brigadesHistory.MonitoringController',
        'Isidamaps.services.brigadesHistory.MapService',
        'Isidamaps.view.clusterView.ClusterInfo',
        'Isidamaps.view.markerView.CallInfoWindow',
        'Isidamaps.view.markerView.BrigadeInfoWindow'
    ],

    controller: 'brigadesHistory',

});
