Ext.define('Isidamaps.view.markerView.CallInfoWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.callInfo',
    controller: 'markercontroller',
    viewModel: true,
    title: 'Вызов',
    iconCls: 'fa fa-phone',
    layout: 'form',
    border: false,
    autoScroll: true,
    resizable: false,
    width: 540,
    constrain: true,
    items: [{
        xtype: 'callInfoForm'
    }]
});