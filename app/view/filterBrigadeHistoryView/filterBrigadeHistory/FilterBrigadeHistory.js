Ext.define('Isidamaps.view.filterBrigadeHistoryView.filterBrigadeHistory.FilterBrigadeHistory', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.filterBrigadeHistoryView-filterBrigadeHistory',
    border: false,
    items: [{
        xtype: 'form',
        fieldDefaults: {
            labelAlign: 'right',
            labelWidth: 70
        },
        border: false,
        items: [{
            xtype: 'panel',
            title: 'Дата/время снимка состояния',
            layout: 'hbox',
            collapsible: true,
            titleCollapse: true,
            collapseToolText: 'Скрыть панель',
            expandToolTest: 'Открыть панель',
            border: false,
            items: [
                {
                    xtype: 'datetimefield',
                    id: 'beginTime',
                    formatText: false,
                    todayText: 'Текущая дата',
                    hourText: 'Часы',
                    value: new Date(),
                    minuteText: 'Минуты',
                    renderTo: Ext.getBody(),
                    margin: '5px 10px 5px 10px',
                    format: 'd.m.Y H:i',
                    width: 150
                },
                {
                    xtype: 'button',
                    text: 'Отобразить',
                    margin: '5px 10px 5px 10px',
                    listeners: {
                        click: {
                            fn: function () {
                                  Ext.fireEvent('getBrigadesSnapshot', new Date(Ext.getCmp('beginTime').value).toISOString());
                            }
                        }
                    }
                }
            ]
        },
            {
                xtype: 'panel',
                title: 'Подстанции',
                collapsible: true,
                titleCollapse: true,
                collapseToolText: 'Скрыть панель',
                expandToolTest: 'Открыть панель',
                border: false,
                items: [
                    {
                        xtype: 'checkbox',
                        boxLabel: 'Все',
                        reference: 'allStations',
                        checked: true,
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
                                    Ext.fireEvent('selectAll', checkbox);
                                    return;
                                }
                                Ext.getCmp('stationGroupId').items.each(item => {
                                    item.setRawValue(false);
                                });
                                stationGroup.fireEvent('customerchange');
                                Ext.fireEvent('deselectAll', checkbox);
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

    }, {
        xtype: 'panel',
        title: 'Состояние',
        collapsible: true,
        titleCollapse: true,
        collapseToolText: 'Скрыть панель',
        expandToolTest: 'Открыть панель',
        border: false,
        items: [{
            xtype: 'checkbox',
            boxLabel: 'Все',
            reference: 'allStatuses',
            checked: true,
            inputValue: 'ALL',
            margin: '5px 10px 0px 10px',
            listeners: {
                change: function (checkbox, checked) {
                    const statusGroup = Ext.getCmp('statusGroupId');
                    if (checked) {
                        statusGroup.items.each(item => {
                            item.setRawValue(true);
                        });
                        statusGroup.fireEvent('customerchange');
                        Ext.fireEvent('selectAll', checkbox);
                        return;
                    }
                    statusGroup.items.each(item => {
                        item.setRawValue(false);
                    });
                    statusGroup.fireEvent('customerchange');
                    Ext.fireEvent('deselectAll', checkbox);
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
                id: 'statusGroupId',
                reference: 'statusBrigadeFilter',
                columns: 1,
                vertical: true,
                getState: function () {
                    return {"checked": this.getValue()};
                },
                applyState: function (state) {
                    Ext.fireEvent('setStateStatusBrigades', state);
                },
                stateEvents: [
                    'customerchange'
                ],
                stateId: 'checkBoxStatusBrigades',
                stateful: true,
                margin: '0px 5px 5px 5px',

                items: [{
                    boxLabel: '<img src="resources/icon/free.png" width="22" height="22" vertical-align: sub;/><span style="vertical-align: top">Свободна</span>',
                    checked: true,
                    inputValue: 'FREE',
                    listeners: {
                        change: {
                            fn: function (checkbox, checked) {
                                Ext.fireEvent('checkedFilter', checkbox, 'statusBrigadeFilter', Isidamaps.app.globals.ALL_STATUSES);
                            }
                        }
                    }
                },
                    {
                        boxLabel: '<img src="resources/icon/passed_brigade.png" width="22" height="22" vertical-align: sub;/><span style="vertical-align: top">Принял вызов</span>',
                        checked: true,
                        inputValue: 'PASSED_BRIGADE',
                        listeners: {
                            change: {
                                fn: function (checkbox, checked) {
                                    Ext.fireEvent('checkedFilter', checkbox, 'statusBrigadeFilter', Isidamaps.app.globals.ALL_STATUSES);
                                }
                            }
                        }
                    },
                    {
                        boxLabel: '<img src="resources/icon/at_call.png" width="22" height="22" vertical-align: sub;/><span style="vertical-align: top">На вызове</span>',
                        checked: true,
                        inputValue: 'AT_CALL',
                        listeners: {
                            change: {
                                fn: function (checkbox, checked) {
                                    Ext.fireEvent('checkedFilter', checkbox, 'statusBrigadeFilter', Isidamaps.app.globals.ALL_STATUSES);
                                }
                            }
                        }
                    },
                    {
                        boxLabel: '<img src="resources/icon/go_hospital.png" width="22" height="22" vertical-align: sub;/><span style="vertical-align: top">Транспортировка в стационар</span>',
                        checked: true,
                        inputValue: 'GO_HOSPITAL',
                        listeners: {
                            change: {
                                fn: function (checkbox, checked) {
                                    Ext.fireEvent('checkedFilter', checkbox, 'statusBrigadeFilter', Isidamaps.app.globals.ALL_STATUSES);
                                }
                            }
                        }
                    },
                    {
                        boxLabel: '<img src="resources/icon/on_event.png" width="22" height="22" vertical-align: sub;/><span style="vertical-align: top">Дежурство на мероприятии</span>',
                        checked: true,
                        inputValue: 'ON_EVENT',
                        listeners: {
                            change: {
                                fn: function (checkbox, checked) {
                                    Ext.fireEvent('checkedFilter', checkbox, 'statusBrigadeFilter', Isidamaps.app.globals.ALL_STATUSES);
                                }
                            }
                        }
                    },
                    {
                        boxLabel: '<img src="resources/icon/without_shift.png" width="22" height="22" vertical-align: sub;/><span style="vertical-align: top">Вне графика</span>',
                        checked: true,
                        inputValue: 'WITHOUT_SHIFT',
                        listeners: {
                            change: {
                                fn: function (checkbox, checked) {
                                    Ext.fireEvent('checkedFilter', checkbox, 'statusBrigadeFilter', Isidamaps.app.globals.ALL_STATUSES);
                                }
                            }
                        }
                    },
                    {
                        boxLabel: '<img src="resources/icon/crash_car.png" width="22" height="22" vertical-align: sub;/><span style="vertical-align: top">Ремонт</span>',
                        checked: true,
                        inputValue: 'CRASH_CAR',
                        listeners: {
                            change: {
                                fn: function (checkbox, checked) {
                                    Ext.fireEvent('checkedFilter', checkbox, 'statusBrigadeFilter', Isidamaps.app.globals.ALL_STATUSES);
                                }
                            }
                        }
                    },
                    {
                        boxLabel: '<img src="resources/icon/relaxon.png" width="22" height="22" vertical-align: sub;/><span style="vertical-align: top">Обед</span>',
                        checked: true,
                        inputValue: 'RELAXON',
                        listeners: {
                            change: {
                                fn: function (checkbox, checked) {
                                    Ext.fireEvent('checkedFilter', checkbox, 'statusBrigadeFilter', Isidamaps.app.globals.ALL_STATUSES);
                                }
                            }
                        }
                    },
                    {
                        boxLabel: '<img src="resources/icon/hijacking.png" width="22" height="22" vertical-align: sub;/><span style="vertical-align: top">Вызов спецслужб</span>',
                        checked: true,
                        inputValue: 'HIJACKING',
                        listeners: {
                            change: {
                                fn: function (checkbox, checked) {
                                    Ext.fireEvent('checkedFilter', checkbox, 'statusBrigadeFilter', Isidamaps.app.globals.ALL_STATUSES);
                                }
                            }
                        }
                    },
                    {
                        boxLabel: '<img src="resources/icon/alarm.png" width="22" height="22" vertical-align: sub;/><span style="vertical-align: top">Тревога</span>',
                        checked: true,
                        inputValue: 'ALARM',
                        listeners: {
                            change: {
                                fn: function (checkbox, checked) {
                                    Ext.fireEvent('checkedFilter', checkbox, 'statusBrigadeFilter', Isidamaps.app.globals.ALL_STATUSES);
                                }
                            }
                        }
                    }
                ]
            }]
    },
        {
            xtype: 'panel',
            title: 'Профиль',
            collapsible: true,
            titleCollapse: true,
            collapseToolText: 'Скрыть панель',
            expandToolTest: 'Открыть панель',
            border: false,
            items: [{
                xtype: 'checkbox',
                boxLabel: 'Все',
                reference: 'allProfiles',
                checked: true,
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
                            Ext.fireEvent('selectAll', checkbox);
                            return;
                        }
                        profileGroup.items.each(item => {
                            item.setRawValue(false);
                        });
                        profileGroup.fireEvent('customerchange');
                        Ext.fireEvent('deselectAll', checkbox);
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
                    columns: 3,
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
                        checked: true,
                        inputValue: 'ВБ',
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
                            checked: true,
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
                            checked: true,
                            inputValue: 'РХБ',
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
                            checked: true,
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
                            checked: true,
                            inputValue: 'СКБ',
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
                            checked: true,
                            inputValue: 'ПБ',
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
                            checked: true,
                            inputValue: 'Б/перс',
                            width: 70,
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

        },
        {
            xtype: 'panel',
            title: 'Поиск по номеру бригады',
            layout: 'hbox',
            fullscreen: true,
            items: [
                {
                    xtype: 'combobox',
                    id: 'searchTextField',
                    name: 'searchBrigade',
                    queryMode: 'local',
                    displayField: 'brigadeNum',
                    valueField: 'id',
                    renderTo: Ext.getBody(),
                    store: 'Isidamaps.store.BrigadeSearchStore',
                    margin: '5px 10px 5px 10px',
                    enableKeyEvents: true,
                    listeners: {
                        keypress: function (textfield, eventObject) {
                            if (eventObject.getCharCode() === Ext.EventObject.ENTER) {
                                Ext.fireEvent('buttonSearch');
                            }
                        },
                        select: function () {
                            Ext.fireEvent('buttonSearch');
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: 'Поиск',
                    margin: '5px 10px 5px 10px',
                    listeners: {
                        click: {
                            fn: function () {
                                Ext.fireEvent('buttonSearch');

                            }
                        }
                    }
                }
            ]
        }
    ]
});
