Ext.define('Isidamaps.view.routeHistoryTableView.RouteHistoryTableView', {
    extend: 'Ext.tab.Panel',
    requires: [
        'Isidamaps.view.routeHistoryTableView.routeHistoryTable.RouteHistoryTable'
    ],
    alias: 'widget.routeHistoryTableView',
    items: [{
        title: 'RouteHistoryTable',
        xtype: 'routeHistoryTableView-routeHistoryTable'
    }]
});
