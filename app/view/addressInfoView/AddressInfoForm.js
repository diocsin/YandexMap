Ext.define('Isidamaps.view.addressInfo.AddressInfoForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.addressInfoForm',
    autoScroll: true,
    viewModel: true,
    bodyStyle: 'padding: 0 5px 0',
    border: false,
    defaults: {
        margin: 0,
        labelWidth: '100%'
    },
    items: [{
        xtype: 'displayfield',
        bind: '{record}'
    }]
});