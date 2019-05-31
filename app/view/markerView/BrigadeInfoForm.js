Ext.define('Isidamaps.view.markerView.BrigadeInfoForm', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.brigadeInfoForm',
    viewModel: true,
    id: 'tabPanelBrigade',
    bodyStyle: 'padding: 0 5px 0',
    border: false,
    defaults: {
        margin: 0,
        labelWidth: '100%'
    },
    items: [
        {
            title: 'О бригаде',
            iconCls: 'fa fa-info-circle ',
            border: false,
            items: [{
                xtype: 'displayfield',
                bind: '{record.brigadeNum}',
                fieldLabel: 'Номер бригады',
                labelWidth: 150
            }, {
                xtype: 'displayfield',
                bind: '{record.station}',
                fieldLabel: 'Номер подстанции',
                labelWidth: 150
            }, {
                xtype: 'displayfield',
                bind: '{record.profile}',
                fieldLabel: 'Профиль бригады',
                labelWidth: 150
            }, {
                xtype: 'displayfield',
                bind: '{record.status}',
                fieldLabel: 'Статус бригады',
                labelWidth: 150
            }, {
                xtype: 'displayfield',
                fieldLabel: 'Старший бригады',
                bind: '{record.chefName}',
                labelWidth: 150
            }, {
                xtype: 'displayfield',
                bind: '{record.callCardNum}',
                fieldLabel: 'Вызов',
                labelWidth: 150
            }, {
                xtype: 'displayfield',
                bind: '{record.address}',
                fieldLabel: 'Адрес места вызова',
                labelWidth: 150
            }, {
                xtype: 'displayfield',
                bind: '{record.passToBrigadeTime}',
                name: 'passToBrigadeTime',
                fieldLabel: 'Время получения бригадой',
                renderer: Ext.util.Format.dateRenderer('Y-m-d, H:i:s'),
                labelWidth: 150
            }, {
                xtype: 'displayfield',
                bind: '{record.stationary}',
                fieldLabel: 'Стационар',
                labelWidth: 150
            }, {
                xtype: 'displayfield',
                bind: '{record.speed}',
                fieldLabel: 'Скорость',
                labelWidth: 150
            }]
        },
        {
            xtype: 'container',
            region: 'center',
            layout: 'container',
            title: 'Вызов на карте',
            iconCls: 'fa fa-phone',
            id: 'mapTab',
            height: 322,
            listeners: {
                activate: function () {
                    Ext.fireEvent('activateTab', this, 'mapTab');

                }
            }
        }
    ]
})
;