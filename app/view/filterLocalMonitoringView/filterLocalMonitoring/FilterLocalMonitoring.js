Ext.define('Isidamaps.view.filterLocalMonitoringView.filterLocalMonitoring.FilterLocalMonitoring', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.filterLocalMonitoringView-filterLocalMonitoring',
    border: false,
    items: [{
        xtype: 'form',
        fieldDefaults: {
            labelAlign: 'right',
            labelWidth: 70
        },
        border: false,
        items: [{
            xtype: 'checkbox',
            boxLabel: 'Все',
            reference: 'allStation',
            checked: false,
            inputValue: 'ALL',
            margin: '5px 10px 0px 10px',
            listeners: {
                change: function (checkbox, checked) {
                    const stationGroup = Ext.getCmp('stationGroupId');
                    if (checked) {
                        stationGroup.items.each((item) => {
                            item.setRawValue(true);
                        });
                        stationGroup.fireEvent('customerchange');
                        Ext.fireEvent('selectAll', checkbox);
                        return;
                    }
                    Ext.getCmp('stationGroupId').items.each((item) => {
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
    }, {
        xtype: 'panel',
        title: 'Состояние',
        items: [{
            xtype: 'checkbox',
            boxLabel: 'Все',
            reference: 'allStatus',
            checked: false,
            inputValue: 'ALL',
            margin: '5px 10px 0px 10px',
            listeners: {
                change: function (checkbox, checked) {
                    const statusGroup = Ext.getCmp('statusGroupId');
                    if (checked) {
                        statusGroup.items.each((item) => {
                            item.setRawValue(true);
                        });
                        statusGroup.fireEvent('customerchange');
                        Ext.fireEvent('selectAll', checkbox);
                        return;
                    }
                    statusGroup.items.each((item) => {
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
                    checked: false,
                    inputValue: 'FREE',
                    listeners: {
                        change: {
                            fn: function (checkbox, checked) {
                                Ext.fireEvent('checkedStatusBrigade', checkbox, checked);
                            }
                        }
                    }
                },
                    {
                        boxLabel: '<img src="resources/icon/passed_brigade.png" width="22" height="22" vertical-align: sub;/><span style="vertical-align: top">Принял вызов</span>',
                        checked: false,
                        inputValue: 'PASSED_BRIGADE',
                        listeners: {
                            change: {
                                fn: function (checkbox, checked) {
                                    Ext.fireEvent('checkedStatusBrigade', checkbox, checked);
                                }
                            }
                        }
                    },
                    {
                        boxLabel: '<img src="resources/icon/at_call.png" width="22" height="22" vertical-align: sub;/><span style="vertical-align: top">На вызове</span>',
                        checked: false,
                        inputValue: 'AT_CALL',
                        listeners: {
                            change: {
                                fn: function (checkbox, checked) {
                                    Ext.fireEvent('checkedStatusBrigade', checkbox, checked);
                                }
                            }
                        }
                    },
                    {
                        boxLabel: '<img src="resources/icon/go_hospital.png" width="22" height="22" vertical-align: sub;/><span style="vertical-align: top">Транспортировка в стационар</span>',
                        checked: false,
                        inputValue: 'GO_HOSPITAL',
                        listeners: {
                            change: {
                                fn: function (checkbox, checked) {
                                    Ext.fireEvent('checkedStatusBrigade', checkbox, checked);
                                }
                            }
                        }
                    },
                    {
                        boxLabel: '<img src="resources/icon/on_event.png" width="22" height="22" vertical-align: sub;/><span style="vertical-align: top">Дежурство на мероприятии</span>',
                        checked: false,
                        inputValue: 'ON_EVENT',
                        listeners: {
                            change: {
                                fn: function (checkbox, checked) {
                                    Ext.fireEvent('checkedStatusBrigade', checkbox, checked);
                                }
                            }
                        }
                    },
                    {
                        boxLabel: '<img src="resources/icon/without_shift.png" width="22" height="22" vertical-align: sub;/><span style="vertical-align: top">Вне графика</span>',
                        checked: false,
                        inputValue: 'WITHOUT_SHIFT',
                        listeners: {
                            change: {
                                fn: function (checkbox, checked) {
                                    Ext.fireEvent('checkedStatusBrigade', checkbox, checked);
                                }
                            }
                        }
                    },
                    {
                        boxLabel: '<img src="resources/icon/crash_car.png" width="22" height="22" vertical-align: sub;/><span style="vertical-align: top">Ремонт</span>',
                        checked: false,
                        inputValue: 'CRASH_CAR',
                        listeners: {
                            change: {
                                fn: function (checkbox, checked) {
                                    Ext.fireEvent('checkedStatusBrigade', checkbox, checked);
                                }
                            }
                        }
                    },
                    {
                        boxLabel: '<img src="resources/icon/relaxon.png" width="22" height="22" vertical-align: sub;/><span style="vertical-align: top">Обед</span>',
                        checked: false,
                        inputValue: 'RELAXON',
                        listeners: {
                            change: {
                                fn: function (checkbox, checked) {
                                    Ext.fireEvent('checkedStatusBrigade', checkbox, checked);
                                }
                            }
                        }
                    },
                    {
                        boxLabel: '<img src="resources/icon/hijacking.png" width="22" height="22" vertical-align: sub;/><span style="vertical-align: top">Нападение на бригаду</span>',
                        checked: false,
                        inputValue: 'HIJACKING',
                        listeners: {
                            change: {
                                fn: function (checkbox, checked) {
                                    Ext.fireEvent('checkedStatusBrigade', checkbox, checked);
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
            items: [{
                xtype: 'checkbox',
                boxLabel: 'Все',
                reference: 'allProfile',
                checked: false,
                inputValue: 'ALL',
                margin: '5px 10px 0px 10px',
                listeners: {
                    change: function (checkbox, checked) {
                        const profileGroup = Ext.getCmp('profileGroupId');
                        if (checked) {
                            profileGroup.items.each((item) => {
                                item.setRawValue(true);
                            });
                            profileGroup.fireEvent('customerchange');
                            Ext.fireEvent('selectAll', checkbox);
                            return;
                        }


                        profileGroup.items.each((item) => {
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
                        checked: false,
                        inputValue: 'ВБ',
                        listeners: {
                            change: {
                                fn: function (checkbox, checked) {
                                    Ext.fireEvent('checkedProfileBrigade', checkbox, checked);
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
                                        Ext.fireEvent('checkedProfileBrigade', checkbox, checked);
                                    }
                                }
                            }
                        },
                        {
                            boxLabel: 'РХБ',
                            checked: false,
                            inputValue: 'РХБ',
                            listeners: {
                                change: {
                                    fn: function (checkbox, checked) {
                                        Ext.fireEvent('checkedProfileBrigade', checkbox, checked);
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
                                        Ext.fireEvent('checkedProfileBrigade', checkbox, checked);
                                    }
                                }
                            }
                        },
                        {
                            boxLabel: 'СКБ',
                            checked: false,
                            inputValue: 'СКБ',
                            listeners: {
                                change: {
                                    fn: function (checkbox, checked) {
                                        Ext.fireEvent('checkedProfileBrigade', checkbox, checked);
                                    }
                                }
                            }
                        },
                        {
                            boxLabel: 'ПБ',
                            checked: false,
                            inputValue: 'ПБ',
                            listeners: {
                                change: {
                                    fn: function (checkbox, checked) {
                                        Ext.fireEvent('checkedProfileBrigade', checkbox, checked);
                                    }
                                }
                            }
                        },
                        {
                            boxLabel: 'Б/перс',
                            checked: false,
                            inputValue: 'Б/перс',
                            width: 70,
                            listeners: {
                                change: {
                                    fn: function (checkbox, checked) {
                                        Ext.fireEvent('checkedProfileBrigade', checkbox, checked);
                                    }
                                }
                            }
                        }
                    ]
                }]

        },
        {
            xtype: 'panel',
            title: 'Вызовы',
            items: [{
                xtype: 'checkbox',
                boxLabel: 'Все',
                reference: 'allCalls',
                checked: false,
                inputValue: 'ALL',
                margin: '5px 10px 0px 10px',
                listeners: {
                    change: function (checkbox, checked) {
                        const callGroup = Ext.getCmp('callGroupId');
                        if (checked) {
                            callGroup.items.each((item) => {
                                item.setRawValue(true);
                            });
                            callGroup.fireEvent('customerchange');
                            Ext.fireEvent('selectAll', checkbox);
                            return;
                        }
                        callGroup.items.each((item) => {
                            item.setRawValue(false);
                        });
                        callGroup.fireEvent('customerchange');
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
                    id: 'callGroupId',
                    reference: 'callStatusFilter',
                    columns: 2,
                    getState: function () {
                        return {"checked": this.getValue()};
                    },
                    applyState: function (state) {

                        Ext.fireEvent('setStateStatusCalls', state);
                    },
                    stateEvents: [
                        'customerchange'
                    ],
                    stateId: 'checkBoxStatusCalls',
                    stateful: true,
                    vertical: true,
                    margin: '0px 5px 5px 5px',
                    items: [{
                        boxLabel: '<img src="resources/icon/new.png" width="18" height="21" vertical-align: sub;/><span style="vertical-align: top; margin-left: 5px">Новые</span>',
                        checked: false,
                        inputValue: 'NEW',
                        width: 100,
                        listeners: {
                            change: {
                                fn: function (checkbox, checked) {
                                    Ext.fireEvent('checkedCallStatus', checkbox, checked);
                                }
                            }
                        }
                    },
                        {
                            boxLabel: '<img src="resources/icon/assigned.png" width="18" height="21" vertical-align: sub;/><span style="vertical-align: top; margin-left: 5px">Исполнение</span>',
                            checked: false,
                            inputValue: 'ASSIGNED',
                            width: 150,
                            listeners: {
                                change: {
                                    fn: function (checkbox, checked) {
                                        Ext.fireEvent('checkedCallStatus', checkbox, checked);
                                    }
                                }
                            }
                        }

                    ]
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
                }]
        }
    ]
});
