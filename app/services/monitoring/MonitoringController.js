Ext.define('Isidamaps.services.monitoring.MonitoringController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.monitoring',
    Monitoring: null,
    filterBrigadeArray: [],
    filterCallArray: [],
    stateStatusBrigades: null,
    stateStation: null,
    stateProfileBrigades: null,
    stateStatusCalls: null,
    buttonBrigade: null,
    myMask: null,
    listen: {
        global: {
            checkedProfileBrigade: 'checkedProfileBrigade',
            checkedStatusBrigade: 'checkedStatusBrigade',
            checkedCallStatus: 'checkedCallStatus',
            checkedStationBrigade: 'checkedStationBrigade',
            setStateStatusBrigades: 'setStateStatusBrigades',
            setStateStation: 'setStateStation',
            setStateProfileBrigades: 'setStateProfileBrigades',
            setStateStatusCalls: 'setStateStatusCalls',
            addButtonsBrigadeOnPanel: 'addButtonsBrigadeOnPanel',
            addStationFilter: 'addStationFilter',
            getButtonBrigadeForChangeButton: 'getButtonBrigadeForChangeButton',
            buttonSearch: 'buttonSearch',
            deletingAllMarkers: 'deletingAllMarkers'
        }
    },

    setStateStatusBrigades: function (state) {
        const me = this;
        me.stateStatusBrigades = state;
    },

    setStateStation: function (state) {
        const me = this;
        me.stateStation = state;
    },

    setStateProfileBrigades: function (state) {
        const me = this;
        me.stateProfileBrigades = state;
    },

    setStateStatusCalls: function (state) {
        const me = this;
        me.stateStatusCalls = state;
    },

    deletingAllMarkers: function () {
        const me = this;
        me.Monitoring.objectManager.objects.removeAll();
    },

    buttonSearch: function () {
        const me = this;
        let searchTrue = null,
            searchText = Ext.getCmp('searchTextField').getValue();
        Ext.Array.each(me.Monitoring.objectManager.objects.getAll(), function (object) {
            if (object.customOptions.brigadeNum === searchText) {
                me.Monitoring.map.setCenter([object.geometry.coordinates[0], object.geometry.coordinates[1]], 14);
                searchTrue = object;
                return false;
            }
        });
        if (searchTrue === null) {
            Ext.getCmp('searchTextField').setActiveError('Не найдена бригада с данным номером');
        }
    },

    checkedCallStatus: function (checkbox) {
        const me = this,
            checkboxValue = checkbox.inputValue,
            checkboxChecked = checkbox.checked,
            callStatusFilterComp = this.lookupReference('callStatusFilter');
        if (!checkboxChecked) {
            me.filterCallArray.push(checkboxValue);
            let i = 0;
            callStatusFilterComp.items.each(function (checkbox) {
                if (checkbox.checked) {
                    i++
                }
            });
            if (callStatusFilterComp.items.length === i + 1) {
                me.lookupReference('allCalls').setValue(false)
            }
            Ext.Array.each(me.Monitoring.callMarkers, function (call) {
                if (checkboxValue === call.customOptions.status) {
                    me.Monitoring.objectManager.objects.remove(call);
                }
            });
            return;
        }

        let j = 0;
        Ext.Array.remove(me.filterCallArray, checkboxValue);
        Ext.Array.each(me.Monitoring.callMarkers, function (call) {
            if (checkboxValue === call.customOptions.status) {
                if (!Ext.Array.contains(me.filterCallArray, call.customOptions.station)) {
                    me.Monitoring.objectManager.objects.add(call);
                }
            }
        });
        callStatusFilterComp.items.each(function (checkbox) {
            if (checkbox.checked) {
                j++
            }
        });
        if (callStatusFilterComp.items.length === j) {
            me.lookupReference('allCalls').setValue(true)
        }
    },

    checkedStationBrigade: function (checkbox) {
        const me = this,
            checkboxValue = checkbox.inputValue,
            checkboxChecked = checkbox.checked,
            stationFilter = me.lookupReference('stationFilter');
        if (!checkboxChecked) {
            me.filterCallArray.push(checkboxValue);
            me.filterBrigadeArray.push(checkboxValue);
            let i = 0;
            stationFilter.items.each(function (checkbox) {
                if (checkbox.checked) {
                    i++
                }
            });
            if (stationFilter.items.length === i + 1) {
                me.lookupReference('allStation').setValue(false)
            }
            Ext.Array.each(me.Monitoring.brigadesMarkers, function (brigade) {
                if (checkboxValue === brigade.customOptions.station) {
                    me.Monitoring.objectManager.objects.remove(brigade);
                    me.hideButtonInPanel(brigade);
                }
            });

            Ext.Array.each(me.Monitoring.callMarkers, function (call) {
                if (checkboxValue === call.customOptions.station) {
                    me.Monitoring.objectManager.objects.remove(call);
                }
            });
            return;
        }
        let j = 0;
        Ext.Array.remove(me.filterBrigadeArray, checkboxValue);
        Ext.Array.remove(me.filterCallArray, checkboxValue);
        Ext.Array.each(me.Monitoring.brigadesMarkers, function (brigade) {
            if (checkboxValue === brigade.customOptions.station &&
                !Ext.Array.contains(me.filterBrigadeArray, brigade.customOptions.status) &&
                !Ext.Array.contains(me.filterBrigadeArray, brigade.customOptions.profile)) {
                me.Monitoring.objectManager.objects.add(brigade);
                me.showButtonInPanel(brigade);
            }
        });
        Ext.Array.each(me.Monitoring.callMarkers, function (call) {
            if (checkboxValue === call.customOptions.station &&
                !Ext.Array.contains(me.filterCallArray, call.customOptions.status)) {
                me.Monitoring.objectManager.objects.add(call);
            }
        });
        stationFilter.items.each(function (checkbox) {
            if (checkbox.checked) {
                j++
            }
        });
        if (stationFilter.items.length === j) {
            me.lookupReference('allStation').setValue(true)
        }

    },

    checkedProfileBrigade: function (checkbox) {
        const me = this,
            checkboxValue = checkbox.inputValue,
            checkboxChecked = checkbox.checked,
            profileBrigadeFilter = me.lookupReference('profileBrigadeFilter');
        if (!checkboxChecked) {
            me.filterBrigadeArray.push(checkboxValue);
            let i = 0;
            profileBrigadeFilter.items.each(function (checkbox) {
                if (checkbox.checked) {
                    i++
                }
            });
            if (profileBrigadeFilter.items.length === i + 1) {
                me.lookupReference('allProfile').setValue(false)
            }
            me.Monitoring.brigadesMarkers.forEach(function (brigade) {
                if (checkboxValue === brigade.customOptions.profile) {
                    me.Monitoring.objectManager.objects.remove(brigade);
                    me.hideButtonInPanel(brigade);
                }
            });
            return;
        }

        let j = 0;
        Ext.Array.remove(me.filterBrigadeArray, checkboxValue);
        Ext.Array.each(me.Monitoring.brigadesMarkers, function (brigade) {
            if (checkboxValue === brigade.customOptions.profile &&
                !Ext.Array.contains(me.filterBrigadeArray, brigade.customOptions.status) &&
                !Ext.Array.contains(me.filterBrigadeArray, brigade.customOptions.station)) {
                me.Monitoring.objectManager.objects.add(brigade);
                me.showButtonInPanel(brigade);
            }

        });
        profileBrigadeFilter.items.each(function (checkbox) {
            if (checkbox.checked) {
                j++
            }
        });
        if (profileBrigadeFilter.items.length === j) {
            me.lookupReference('allProfile').setValue(true)
        }
    }
    ,

    checkedStatusBrigade: function (checkbox) {
        const me = this,
            checkboxValue = checkbox.inputValue,
            checkboxChecked = checkbox.checked,
            statusBrigadeFilter = me.lookupReference('statusBrigadeFilter');
        if (!checkboxChecked) {
            me.filterBrigadeArray.push(checkboxValue);
            let i = 0;
            statusBrigadeFilter.items.each(function (checkbox) {
                if (checkbox.checked) {
                    i++
                }
            });
            if (statusBrigadeFilter.items.length === i + 1) {
                me.lookupReference('allStatus').setValue(false)
            }
            Ext.Array.each(me.Monitoring.brigadesMarkers, function (brigade) {
                if (checkboxValue === brigade.customOptions.status) {
                    me.Monitoring.objectManager.objects.remove(brigade);
                    me.hideButtonInPanel(brigade);
                }
            });
            return;
        }
        let j = 0;
        Ext.Array.remove(me.filterBrigadeArray, checkboxValue);
        console.dir(me.filterBrigadeArray);
        Ext.Array.each(me.Monitoring.brigadesMarkers, function (brigade) {
            if (checkboxValue === brigade.customOptions.status &&
                !Ext.Array.contains(me.filterBrigadeArray, brigade.customOptions.profile) &&
                !Ext.Array.contains(me.filterBrigadeArray, brigade.customOptions.station)) {
                me.Monitoring.objectManager.objects.add(brigade);
                me.showButtonInPanel(brigade);
            }
        });
        statusBrigadeFilter.items.each(function (checkbox) {
            if (checkbox.checked) {
                j++
            }
        });
        if (statusBrigadeFilter.items.length === j) {
            me.lookupReference('allStatus').setValue(true)
        }

    },

    mainBoxReady: function () {
        const me = this;
        ymaps.ready(function () {
            me.createMap();
        });
    },

    createMap: function () {
        const me = this;
        me.myMask = new Ext.LoadMask({
            msg: 'Подождите пожалуйста. Загрузка...',
            target: Ext.getCmp('monitoringPanel')
        });
        me.myMask.show();
        me.Monitoring = Ext.create('Isidamaps.services.monitoring.MapService', {
            filterBrigadeArray: me.filterBrigadeArray,
            filterCallArray: me.filterCallArray,
            getButtonBrigadeForChangeButton: me.getButtonBrigadeForChangeButton,
            setCheckbox: me.setCheckbox.bind(me),
            addNewButtonOnPanel: me.addNewButtonOnPanel.bind(me),
            destroyButtonOnPanel: me.destroyButtonOnPanel.bind(me),
        });
        me.Monitoring.listenerStore();
        me.Monitoring.optionsObjectManager();

        ASOV.setMapManager({
            setStation: me.Monitoring.setStation.bind(this)
        }, Ext.History.currentToken);
        Isidamaps.app.getController('AppController').readStation(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
        me.setFilterBrigadeAndCall();
        const ymapWrapper = me.lookupReference('ymapWrapper');
        ymapWrapper.on('resize', function () {
            me.Monitoring.resizeMap();
        });
    }
    ,

    setFilterBrigadeAndCall: function () {
        const me = this;
        me.lookupReference('profileBrigadeFilter').eachBox(function (item) {
            me.filterBrigadeArray.push(item.inputValue);
        });
        me.lookupReference('statusBrigadeFilter').eachBox(function (item) {
            me.filterBrigadeArray.push(item.inputValue);
        });
        Ext.Array.each(Isidamaps.app.getController('AppController').stationArray, function (item) {
            me.filterBrigadeArray.push(item);
            me.filterCallArray.push(item);
        });

        me.lookupReference('callStatusFilter').eachBox(function (item) {
            me.filterCallArray.push(item.inputValue);
        });
    }
    ,

    setCheckbox: function () {
        const me = this;
        try {
            me.lookupReference('stationFilter').setValue(me.stateStation.checked);
            me.lookupReference('profileBrigadeFilter').setValue(me.stateProfileBrigades.checked);
            me.lookupReference('statusBrigadeFilter').setValue(me.stateStatusBrigades.checked);
            me.lookupReference('callStatusFilter').setValue(me.stateStatusCalls.checked);
        }
        catch (e) {
        }
        me.myMask.hide();
    }
    ,

    addStationFilter: function () {
        const me = this,
            checkboxStation = me.lookupReference('stationFilter'),
            buttonBrigade = me.lookupReference('BrigadePanel'),
            records = Isidamaps.app.getController('AppController').stationArray;
        Ext.Array.each(records, function (rec) {
            checkboxStation.add(Ext.create('Ext.form.field.Checkbox', {
                boxLabel: rec,
                inputValue: rec,
                checked: false,
                listeners: {
                    change: {
                        fn: function (checkbox, checked) {
                            Ext.fireEvent('checkedStationBrigade', checkbox, checked);
                        }
                    }
                }
            }));
            buttonBrigade.add(Ext.create('Ext.panel.Panel', {
                itemId: 'panel_' + rec,
                title: rec,
                width: 260,
                renderTo: Ext.getBody(),
                floatable: true,
                collapsible: true,
                scrollable: 'vertical',
                collapseToolText: 'Скрыть панель',
                expandToolText: 'Открыть панель',
                header: {
                    titlePosition: 1
                }
            }));
        });

    }
    ,

    getButtonBrigadeForChangeButton: function (brigade, oldStatus) {
        const me = this,
            brigadePanel = me.buttonBrigade.getComponent('panel_' + brigade.customOptions.station),
            brigadeHave = brigadePanel.getComponent('id' + brigade.id);
        brigadeHave.removeCls('button_' + oldStatus);
        brigadeHave.addCls('button_' + brigade.customOptions.status);
        brigadePanel.updateLayout();
    }
    ,

    hideButtonInPanel: function (brigade) {
        const me = this,
            brigadePanel = me.buttonBrigade.getComponent('panel_' + brigade.customOptions.station);
        brigadePanel.getComponent('id' + brigade.id).hide();
    }
    ,

    destroyButtonOnPanel: function (brigade) {
        const me = this;
        try {
            const brigadePanel = me.buttonBrigade.getComponent('panel_' + brigade.customOptions.station);
            brigadePanel.getComponent('id' + brigade.id).destroy();
        }
        catch (e) {
        }
    }
    ,

    addNewButtonOnPanel: function (brigade) {
        const me = this,
            brigadePanel = me.buttonBrigade.getComponent('panel_' + brigade.customOptions.station),
            button = me.createButton(brigade);
        brigadePanel.add(button);
        button.show();
    }
    ,

    showButtonInPanel: function (brigade) {
        const me = this,
            brigadePanel = me.buttonBrigade.getComponent('panel_' + brigade.customOptions.station);
        brigadePanel.getComponent('id' + brigade.id).show();
    }
    ,

    addButtonsBrigadeOnPanel: function () {
        const me = this,
            brigadeSort = [];
        me.buttonBrigade = me.lookupReference('BrigadePanel');
        Ext.Array.each(me.Monitoring.brigadesMarkers, function (brigade) {
            brigadeSort.push(brigade);
        });
        brigadeSort.sort(function (a, b) {
            return a.customOptions.station - b.customOptions.station
        });
        brigadeSort.sort(function (a, b) {
            return a.customOptions.status === b.customOptions.status ? -1 : 1
        });
        Ext.Array.each(brigadeSort, function (brigade) {
            const button = me.createButton(brigade),
                stationPanelBrigades = me.buttonBrigade.getComponent('panel_' + brigade.customOptions.station);
            stationPanelBrigades.add(button);
        });
    }
    ,

    createButton: function (brigade) {
        const me = this;
        return Ext.create('Ext.Button', {
            itemId: 'id' + brigade.id,
            text: brigade.customOptions.brigadeNum + " " + "(" + brigade.customOptions.profile + ")",
            maxWidth: 110,
            minWidth: 110,
            margin: 5,
            hidden: true,
            hideMode: 'offsets',
            cls: 'button_' + brigade.customOptions.status,
            listeners: {
                click: function () {
                    me.clickButton(brigade);
                }
            }
        });
    }
    ,

    clickButton: function (brigade) {
        const me = this,
            marker = me.Monitoring.objectManager.objects.getById(brigade.id);
        if (marker) {
            me.Monitoring.map.setCenter([marker.geometry.coordinates[0], marker.geometry.coordinates[1]], 14);
        }
    }
    ,

    layoutReady: function () {
        this.fireTabEvent(this.lookupReference('navigationPanel'));
    }
    ,

    tabChange: function (panel, newTab, oldTab) {
        oldTab.fireEvent('tabExit');
        this.fireTabEvent(newTab);
    }
    ,

    fireTabEvent: function (tab) {
        tab.fireEvent('tabEnter');
    }
})
;
