Ext.define('Isidamaps.view.markerView.BrigadeInfoWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.brigadeInfo',
    controller: 'markercontroller',
    viewModel: true,
    title: 'Бригада',
    iconCls: 'fa fa-ambulance',
    layout: 'form',
    border: false,
    autoScroll: true,
    resizable: false,
    width: 500,
    constrain: true,
    items: [{
        xtype: 'brigadeInfoForm'
    }]
});