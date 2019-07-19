Ext.define('Isidamaps.view.filterHeatMapView.filterHeatMap.FilterHeatMap', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.filterHeatMapView-filterHeatMap',
    border: false,
    items: [{
        xtype: 'form',
        layout: 'hbox',
        width: '100%',

        fieldDefaults: {
            labelAlign: 'right',
            labelWidth: 70
        },
        border: false,
        items: [
            {
                xtype: 'container',
                layout: 'vbox',
                height: '100%',
                margin: '0px, 0px, 0px, 10px',
                flex: 5,
                items: [{
                    xtype: 'fieldset',
                    title: 'Подстанции',
                    height: '100%',
                    layout: 'anchor',
                    items: [
                        {

                            xtype: 'checkbox',
                            boxLabel: 'Все',
                            reference: 'allStations',
                            checked: false,
                            inputValue: 'ALL',
                            margin: '5px 10px 0px 10px',
                            listeners: {
                                change: function (checkbox, checked) {
                                    const stationGroup = Ext.getCmp('stationGroupId');
                                    if (checked) {
                                        stationGroup.items.each(item => {
                                            item.setRawValue(true);
                                        });
                                        stationGroup.fireEvent('customerchange');
                                        return;
                                    }
                                    Ext.getCmp('stationGroupId').items.each(item => {
                                        item.setRawValue(false);
                                    });
                                    stationGroup.fireEvent('customerchange');
                                }
                            }
                        },
                        {
                            xtype: 'component',
                            autoEl: 'hr',
                            cls: 'hr-all'
                        },
                        {
                            xtype: 'checkboxgroup',
                            id: 'stationGroupId',
                            reference: 'stationFilter',
                            columns: 4,
                            getState: function () {
                                return {"checked": this.getValue()};
                            },
                            applyState: function (state) {
                                Ext.fireEvent('setStateStation', state);
                            },
                            stateEvents: [
                                'customerchange'
                            ],
                            stateId: 'checkBoxStation',
                            stateful: true,
                            vertical: true,
                            margin: '0px 5px 5px 5px'
                        }]
                }]
            },
            {
                xtype: 'container',
                layout: 'vbox',
                height: '100%',
                margin: '0px, 0px, 0px, 10px',
                flex: 2,
                items: [
                    {
                        xtype: 'fieldset',
                        title: 'Профиль',
                        height: '100%',
                        items: [

                            {
                                xtype: 'checkbox',
                                boxLabel: 'Все',
                                reference: 'allProfiles',
                                checked: false,
                                inputValue: 'ALL',
                                margin: '5px 10px 0px 10px',
                                listeners: {
                                    change: function (checkbox, checked) {
                                        const profileGroup = Ext.getCmp('profileGroupId');
                                        if (checked) {
                                            profileGroup.items.each(item => {
                                                item.setRawValue(true);
                                            });
                                            profileGroup.fireEvent('customerchange');
                                            return;
                                        }
                                        profileGroup.items.each(item => {
                                            item.setRawValue(false);
                                        });
                                        profileGroup.fireEvent('customerchange');
                                    }
                                }
                            },
                            {
                                xtype: 'component',
                                autoEl: 'hr',
                                cls: 'hr-all'
                            },
                            {
                                xtype: 'checkboxgroup',
                                id: 'profileGroupId',
                                reference: 'profileBrigadeFilter',
                                columns: 1,
                                getState: function () {
                                    return {"checked": this.getValue()};
                                },
                                applyState: function (state) {
                                    Ext.fireEvent('setStateProfileBrigades', state);
                                },
                                stateEvents: [
                                    'customerchange'
                                ],
                                stateId: 'checkBoxProfileBrigades',
                                stateful: true,
                                vertical: true,
                                margin: '0px 5px 5px 5px',
                                items: [{
                                    boxLabel: 'ВБ',
                                    checked: false,
                                    inputValue: 'ВБ',
                                    width: 100,
                                    listeners: {
                                        change: {
                                            fn: function (checkbox, checked) {
                                                Ext.fireEvent('checkedFilter', checkbox, 'profileBrigadeFilter', Isidamaps.app.globals.ALL_PROFILES);
                                            }
                                        }
                                    }
                                },
                                    {
                                        boxLabel: 'ФБ',
                                        checked: false,
                                        inputValue: 'ФБ',
                                        width: 100,
                                        listeners: {
                                            change: {
                                                fn: function (checkbox, checked) {
                                                    Ext.fireEvent('checkedFilter', checkbox, 'profileBrigadeFilter', Isidamaps.app.globals.ALL_PROFILES);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        boxLabel: 'РХБ',
                                        checked: false,
                                        inputValue: 'РХБ',
                                        width: 100,
                                        listeners: {
                                            change: {
                                                fn: function (checkbox, checked) {
                                                    Ext.fireEvent('checkedFilter', checkbox, 'profileBrigadeFilter', Isidamaps.app.globals.ALL_PROFILES);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        boxLabel: 'ПсихБ',
                                        checked: false,
                                        inputValue: 'ПсихБ',
                                        width: 100,
                                        listeners: {
                                            change: {
                                                fn: function (checkbox, checked) {
                                                    Ext.fireEvent('checkedFilter', checkbox, 'profileBrigadeFilter', Isidamaps.app.globals.ALL_PROFILES);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        boxLabel: 'СКБ',
                                        checked: false,
                                        inputValue: 'СКБ',
                                        width: 100,
                                        listeners: {
                                            change: {
                                                fn: function (checkbox, checked) {
                                                    Ext.fireEvent('checkedFilter', checkbox, 'profileBrigadeFilter', Isidamaps.app.globals.ALL_PROFILES);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        boxLabel: 'ПБ',
                                        checked: false,
                                        inputValue: 'ПБ',
                                        width: 100,
                                        listeners: {
                                            change: {
                                                fn: function (checkbox, checked) {
                                                    Ext.fireEvent('checkedFilter', checkbox, 'profileBrigadeFilter', Isidamaps.app.globals.ALL_PROFILES);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        boxLabel: 'Б/перс',
                                        checked: false,
                                        inputValue: 'Б/перс',
                                        width: 100,
                                        listeners: {
                                            change: {
                                                fn: function (checkbox, checked) {
                                                    Ext.fireEvent('checkedFilter', checkbox, 'profileBrigadeFilter', Isidamaps.app.globals.ALL_PROFILES);
                                                }
                                            }
                                        }
                                    }
                                ]
                            }]
                    }]
            },
            {

                xtype: 'container',
                layout: 'vbox',
                margin: '0px, 0px, 0px, 10px',
                flex: 3,
                items: [
                    {
                        xtype: 'fieldset',
                        title: 'Дата',
                        items: [
                            {

                                xtype: 'datetimefield',
                                id: 'beginTime',
                                formatText: false,
                                todayText: 'Текущая дата',
                                hourText: 'Часы',
                                minuteText: 'Минуты',
                                fieldLabel: 'с',
                                labelWidth: 25,
                                renderTo: Ext.getBody(),
                                margin: '5px 10px 5px 10px',
                                format: 'd.m.Y H:i',
                                width: 200
                            },
                            {
                                xtype: 'datetimefield',
                                id: 'endTime',
                                formatText: false,
                                todayText: 'Текущая дата',
                                hourText: 'Часы',
                                minuteText: 'Минуты',
                                fieldLabel: 'по',
                                labelWidth: 25,
                                renderTo: Ext.getBody(),
                                margin: '5px 10px 5px 10px',
                                format: 'd.m.Y H:i',
                                width: 200
                            }

                        ]
                    },
                    {
                        xtype: 'fieldset',
                        title: 'Возраcт',
                        items: [
                            {
                                xtype: 'numberfield',
                                label: 'AgeStart',
                                id: 'ageStart',
                                minValue: 1,
                                maxValue: 150,
                                fieldLabel: 'с',
                                labelWidth: 25,
                                width: 200,
                                name: 'Возраст',
                                margin: '5px 10px 5px 10px'
                            },
                            {
                                xtype: 'numberfield',
                                label: 'AgeEnd',
                                id: 'ageEnd',
                                minValue: 1,
                                maxValue: 150,
                                fieldLabel: 'по',
                                labelWidth: 25,
                                width: 200,
                                name: 'Возраст',
                                margin: '5px 10px 5px 10px'
                            }]
                    },
                    {
                        xtype: 'fieldset',
                        title: 'Пол',
                        layout: 'hbox',
                        width: 240,
                        items: [
                            {
                                xtype: 'checkboxgroup',
                                id: 'sexGroupId',
                                margin: '0px 5px 5px 5px',
                                items: [
                                    {
                                        xtype: 'checkbox',
                                        boxLabel: 'М',
                                        id: 'Male',
                                        checked: false,
                                        labelWidth: 40,
                                        inputValue: 'MALE',
                                        margin: '5px 10px 5px 10px',
                                        listeners: {
                                            change: function (checkbox, checked) {
                                                if (checked) {
                                                    let fieldFeMale = Ext.getCmp('Female');
                                                    let fieldUnknown = Ext.getCmp('Unknown');
                                                    fieldFeMale.setValue(false);
                                                    fieldUnknown.setValue(false);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'checkbox',
                                        boxLabel: 'Ж',
                                        id: 'Female',
                                        checked: false,
                                        inputValue: 'FEMALE',
                                        margin: '5px 10px 5px 10px',
                                        listeners: {
                                            change: function (checkbox, checked) {
                                                if (checked) {
                                                    let fieldMale = Ext.getCmp('Male');
                                                    let fieldUnknown = Ext.getCmp('Unknown');
                                                    fieldMale.setValue(false);
                                                    fieldUnknown.setValue(false);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'checkbox',
                                        boxLabel: 'Неизвестно',
                                        id: 'Unknown',
                                        checked: false,
                                        inputValue: 'UNKNOWN',
                                        margin: '5px 10px 5px 10px',
                                        listeners: {
                                            change: function (checkbox, checked) {
                                                if (checked) {
                                                    let fieldMale = Ext.getCmp('Male');
                                                    let fieldFeMale = Ext.getCmp('Female');
                                                    fieldMale.setValue(false);
                                                    fieldFeMale.setValue(false);
                                                }
                                            }
                                        }
                                    }]
                            }]

                    }]
            },
            {
                xtype: 'container',
                layout: 'vbox',
                margin: '0px, 0px, 0px, 10px',
                flex: 5,
                items: [
                    {
                        xtype: 'fieldset',
                        title: 'Алкогольное опьянение',
                        layout: 'hbox',

                        items: [
                            {
                                xtype: 'checkboxgroup',
                                id: 'alco_intoxication_GroupId',
                                margin: '0px 5px 5px 5px',
                                items: [
                                    {

                                        boxLabel: 'Да',
                                        id: 'alco_yes',
                                        checked: false,
                                        labelWidth: 60,
                                        inputValue: true,
                                        margin: '5px 10px 5px 10px',
                                        listeners: {
                                            change: function (checkbox, checked) {
                                                if (checked) {
                                                    let fieldAlco = Ext.getCmp('alco_no');
                                                    fieldAlco.setValue(false);

                                                }
                                            }
                                        }
                                    },
                                    {

                                        boxLabel: 'Нет',
                                        id: 'alco_no',
                                        checked: false,
                                        labelWidth: 60,
                                        inputValue: false,
                                        margin: '5px 10px 5px 10px',
                                        listeners: {
                                            change: function (checkbox, checked) {
                                                if (checked) {
                                                    let fieldAlco = Ext.getCmp('alco_yes');
                                                    fieldAlco.setValue(false);

                                                }
                                            }
                                        }
                                    }]
                            }]
                    },
                    {
                        xtype: 'fieldset',
                        title: 'Район',
                        hidden: true,
                        items: [
                            {
                                xtype: 'combobox',
                                queryMode: 'remote',
                                queryParam: 'value',
                                name: 'DISTRICT',
                                id: 'district_auto_complete',
                                minChars: 3,
                                displayField: 'value',
                                valueField: 'id',
                                renderTo: Ext.getBody(),
                                store: 'Isidamaps.store.DistrictAutoCompleteStore',
                                margin: '5px 0px 5px 0px',
                                enableKeyEvents: true,
                                forceSelection: false,
                                labelWidth: 60,
                                width: 350,
                                listeners: {
                                    focus: function () {
                                        this.store.getProxy().url = `${Isidamaps.app.globals.URLGEODATA}/autocomplite?`;
                                        this.store.getProxy().extraParams = {field: 'DISTRICT'}
                                    }
                                }
                            }]
                    },
                    {
                        xtype: 'fieldset',
                        title: 'Улица',
                        items: [
                            {
                                xtype: 'combobox',
                                minChars: 3,
                                id: 'street_auto_complete',
                                name: 'STREET',
                                queryMode: 'remote',
                                queryParam: 'value',
                                displayField: 'value',
                                valueField: 'id',
                                renderTo: Ext.getBody(),
                                store: 'Isidamaps.store.StreetAutoCompleteStore',
                                margin: '5px 0px 5px 0px',
                                enableKeyEvents: true,
                                forceSelection: false,
                                labelWidth: 60,
                                width: 350,
                                listeners: {
                                    focus : function () {
                                        this.store.getProxy().url = `${Isidamaps.app.globals.URLGEODATA}/autocomplite?`;
                                        this.store.getProxy().extraParams = {field: 'STREET'}
                                    }
                                }
                            }]
                    },
                    {
                        xtype: 'fieldset',
                        title: 'Повод',
                        items: [
                            {
                                xtype: 'combobox',
                                id: 'reason_auto_complete',
                                minChars: 3,
                                name: 'REASON',
                                queryMode: 'remote',
                                queryParam: 'value',
                                displayField: 'value',
                                valueField: 'id',
                                renderTo: Ext.getBody(),
                                store: 'Isidamaps.store.ReasonAutoCompleteStore',
                                margin: '5px 0px 5px 0px',
                                enableKeyEvents: true,
                                width: 350,
                                listeners: {
                                    focus: function () {
                                        this.store.getProxy().url = `${Isidamaps.app.globals.URLGEODATA}/autocomplite?`;
                                        this.store.getProxy().extraParams = {field: 'REASON'}
                                    }
                                }

                            }]
                    }

                ]
            }

        ]

    },

        {
            xtype: 'panel',
            title: 'Диагноз',
            layout: 'hbox',
            height: 450,
            fullscreen: true,
            items: [{
                xtype: 'combobox',
                id: 'diagnosis_auto_complete',
                queryMode: 'remote',
                queryParam: 'value',
                minChars: 3,
                name: 'DIAGNOSIS',
                displayField: 'value',
                valueField: 'id',
                renderTo: Ext.getBody(),
                store: 'Isidamaps.store.DiagnosisAutoCompleteStore',
                margin: '5px 0px 5px 0px',
                labelWidth: 60,
                fieldLabel: 'Диагноз',
                enableKeyEvents: true,
                width: 450,
                listeners: {
                    focus: function () {
                        this.store.getProxy().url = `${Isidamaps.app.globals.URLGEODATA}/autocomplite?`;
                        this.store.getProxy().extraParams = {field: 'DIAGNOSIS'}
                    }
                }
            },
                {
                    xtype: 'container',
                    layout: 'vbox',
                    margin: '5px 5px 0px 5px',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-angle-right',
                            margin: '0px 0px 5px 0px',
                            listeners: {
                                click: function (me, e, eOpts) {
                                    let comp = Ext.getCmp('diagnosis_auto_complete');
                                    if (comp.rawValue !== '') {
                                        let t = Ext.getStore('Isidamaps.store.DiagnosisGridStore');
                                        t.add({
                                            id: comp.value,
                                            value: comp.rawValue
                                        })
                                    }
                                }


                            }

                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-angle-left',
                            listeners: {
                                click: function (me, e, eOpts) {
                                    let comp = Ext.getCmp('diagnosisGrid');
                                    if (comp.getSelection()[0]) {
                                        const id = comp.getSelection()[0].get('id'),
                                            gridStore = Ext.getStore('Isidamaps.store.DiagnosisGridStore'),
                                            row = gridStore.getById(id);
                                        gridStore.remove(row);
                                    }
                                }


                            }
                        }]
                },
                {
                    xtype: 'grid',
                    id: 'diagnosisGrid',
                    height: 265,
                    width: 600,
                    autoScroll: true,
                    autoSizeColumn: true,
                    store: 'Isidamaps.store.DiagnosisGridStore',
                    margin: '5px 5px 5px 0px',
                    columns: [{
                        text: 'Диагноз', dataIndex: 'value', minWidth: 595
                    }],
                    viewConfig: {
                        listeners: {
                            refresh: function (dataview) {
                                Ext.each(dataview.panel.columns, function (column) {
                                    if (column.autoSizeColumn === true)
                                        column.autoSize();
                                })
                            }
                        }
                    },
                    hideHeaders: true
                },

                {
                    xtype: 'button',
                    iconCls: 'x-fa fa-filter',
                    text: 'Применить фильтр',
                    margin: '5px 5px 5px 0px',
                    listeners: {
                        click: function (me, e, eOpts) {
                            Ext.fireEvent('applyFilterHeatMap');
                        }


                    }

                }]
        }
    ]
})
;
