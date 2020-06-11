Ext.define('Isidamaps.view.filterBrigadeHistoryView.FilterBrigadeHistoryView', {
    extend: 'Ext.tab.Panel',
    requires: [
        'Isidamaps.view.filterBrigadeHistoryView.filterBrigadeHistory.FilterBrigadeHistory'
    ],
    alias: 'widget.filterBrigadeHistoryView',
    items: [{
        title: 'Фильтр',
        xtype: 'filterBrigadeHistoryView-filterBrigadeHistory'
    }]
});
