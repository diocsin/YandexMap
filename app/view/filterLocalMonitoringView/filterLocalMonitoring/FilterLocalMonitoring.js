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
                    if (checked === true) {
                        Ext.getCmp('stationGroupId').items.each(function (item) {
                            item.setValue(true);
                        });
                    }
                    if (checked === false) {
                        var i = true;
                        Ext.getCmp('stationGroupId').items.each(function (item) {
                            if (item.checked === false) {
                                i = false;
                            }
                        });
                        if (i === true) {
                            Ext.getCmp('stationGroupId').items.each(function (item) {
                                item.setValue(false);

                            });
                        }
                    }
                }
            }
        }, {
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
                'change'
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
                    if (checked === true) {
                        Ext.getCmp('statusGroupId').items.each(function (item) {
                            item.setValue(true);
                        })
                    }
                    if (checked === false) {
                        var i = true;
                        Ext.getCmp('statusGroupId').items.each(function (item) {
                            if (item.checked === false) {
                                i = false;
                            }
                        });
                        if (i === true) {
                            Ext.getCmp('statusGroupId').items.each(function (item) {
                                item.setValue(false);
                            })
                        }
                    }
                }
            }
        }, {
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
                'change'
            ],
            stateId: 'checkBoxStatusBrigades',
            stateful: true,
            margin: '0px 5px 5px 5px',

            items: [{
                boxLabel: 'Свободна',
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
                    boxLabel: 'Принял вызов',
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
                    boxLabel: 'На вызове',
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
                    boxLabel: 'Транспортировка в стационар',
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
                    boxLabel: 'Дежурство на мероприятии',
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
                    boxLabel: 'Вне графика',
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
                    boxLabel: 'Ремонт',
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
                    boxLabel: 'Обед',
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
                    boxLabel: 'Нападение на бригаду',
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
                        if (checked === true) {
                            Ext.getCmp('profileGroupId').items.each(function (item) {
                                item.setValue(true);
                            })
                        }
                        if (checked === false) {
                            var i = true;
                            Ext.getCmp('profileGroupId').items.each(function (item) {
                                if (item.checked === false) {
                                    i = false;
                                }
                            });
                            if (i === true) {
                                Ext.getCmp('profileGroupId').items.each(function (item) {
                                    item.setValue(false);
                                })
                            }
                        }
                    }
                }
            }, {
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
                    'change'
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
                        if (checked === true) {
                            Ext.getCmp('callGroupId').items.each(function (item) {
                                item.setValue(true);
                            })
                        }
                        if (checked === false) {
                            var i = true;
                            Ext.getCmp('callGroupId').items.each(function (item) {
                                if (item.checked === false) {
                                    i = false;
                                }
                            });
                            if (i === true) {
                                Ext.getCmp('callGroupId').items.each(function (item) {
                                    item.setValue(false);
                                })
                            }
                        }
                    }
                }
            }, {
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
                    'change'
                ],
                stateId: 'checkBoxStatusCalls',
                stateful: true,
                vertical: true,
                margin: '0px 5px 5px 5px',
                items: [{
                    boxLabel: 'Новые',
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
                        boxLabel: 'Исполнение',
                        checked: false,
                        inputValue: 'ASSIGNED',
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
                    items: [
                        {
                            xtype: 'textfield',
                            id: 'searchTextField',
                            name: 'searchBrigade',
                            margin: '5px 10px 5px 10px',
                            enableKeyEvents: true,
                            listeners: {
                                keypress: function (textfield, eventObject) {
                                    if (eventObject.getCharCode() === Ext.EventObject.ENTER) {
                                        Ext.fireEvent('buttonSearch');
                                    }
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
