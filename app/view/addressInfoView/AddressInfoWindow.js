Ext.define('Isidamaps.view.addressInfoView.AddressInfoWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.addressInfo',
    viewModel: true,
    title: 'Адрес',
    layout: 'form',
    border: 'fit',
    resizable: false,
    width: 500,
    constrain: true,
    items: [{
        xtype: 'addressInfoForm'
    }],
    buttons: ['->', {
        text: 'Выбрать',
        handler: function () {
            Ext.fireEvent('sendCoordinateToASOV');
        }
    }, {
        text: 'Отмена',
        handler: function () {
            this.up('window').close();
        }
    }]
});