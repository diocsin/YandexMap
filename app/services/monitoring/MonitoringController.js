Ext.define('Isidamaps.services.monitoring.MonitoringController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.monitoring',
    Monitoring: null,
    filterBrigadeArray: [],
    allStatusBrigade: [],
    allProfileBrigade: [],
    allStatusCall: [],
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
            getButtonBrigadeForChangeButton: 'getButtonBrigadeForChangeButton',
            buttonSearch: 'buttonSearch',
            selectAll: 'selectAll',
            deselectAll: 'deselectAll'
        }
    },

    selectAll: function (checkbox) {
        const me = this;
        switch (checkbox.reference) {
            case 'allStation':
                me.filterBrigadeArray = Ext.Array.difference(me.filterBrigadeArray, Isidamaps.app.getController('AppController').stationArray);
                break;
            case 'allStatus':
                me.filterBrigadeArray = Ext.Array.difference(me.filterBrigadeArray, me.allStatusBrigade);
                break;
            case  'allProfile':
                me.filterBrigadeArray = Ext.Array.difference(me.filterBrigadeArray, me.allProfileBrigade);
                break;
            case 'allCalls':
                me.filterBrigadeArray = Ext.Array.difference(me.filterBrigadeArray, me.allStatusCall);
                break;
        }
        me.setFilterObjectManager();
    },

    deselectAll: function (checkbox) {
        const me = this;
        switch (checkbox.reference) {
            case 'allStation':
                me.filterBrigadeArray = Ext.Array.merge(me.filterBrigadeArray, Isidamaps.app.getController('AppController').stationArray);
                break;
            case 'allStatus':
                me.filterBrigadeArray = Ext.Array.merge(me.filterBrigadeArray, me.allStatusBrigade);
                break;
            case  'allProfile':
                me.filterBrigadeArray = Ext.Array.merge(me.filterBrigadeArray, me.allProfileBrigade);
                break;
            case 'allCalls':
                me.filterBrigadeArray = Ext.Array.merge(me.filterBrigadeArray, me.allStatusCall);
                break;
        }
        me.setFilterObjectManager();
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
            me.filterBrigadeArray.push(checkboxValue);
            let i = 0;
            callStatusFilterComp.items.each(function (checkbox) {
                if (checkbox.checked) {
                    i++
                }
            });
            if (callStatusFilterComp.items.length === i + 1) {
                me.lookupReference('allCalls').setRawValue(false)
            }
            me.setFilterObjectManager();
            callStatusFilterComp.fireEvent('customerchange');
            return;
        }
        let j = 0;
        Ext.Array.remove(me.filterBrigadeArray, checkboxValue);
        me.setFilterObjectManager();
        callStatusFilterComp.items.each(function (checkbox) {
            if (checkbox.checked) {
                j++
            }
        });
        if (callStatusFilterComp.items.length === j) {
            me.lookupReference('allCalls').setRawValue(true)
        }
        callStatusFilterComp.fireEvent('customerchange');
    },

    checkedStationBrigade: function (checkbox) {
        const me = this,
            checkboxValue = checkbox.inputValue,
            checkboxChecked = checkbox.checked,
            stationFilter = me.lookupReference('stationFilter');
        if (!checkboxChecked) {
            me.filterBrigadeArray.push(checkboxValue);
            let i = 0;
            stationFilter.items.each(function (checkbox) {
                if (checkbox.checked) {
                    i++
                }
            });
            if (stationFilter.items.length === i + 1) {
                me.lookupReference('allStation').setRawValue(false)
            }
            me.setFilterObjectManager();
            stationFilter.fireEvent('customerchange');
            return;
        }
        let j = 0;
        Ext.Array.remove(me.filterBrigadeArray, checkboxValue);
        me.setFilterObjectManager();
        stationFilter.items.each(function (checkbox) {
            if (checkbox.checked) {
                j++
            }
        });
        if (stationFilter.items.length === j) {
            me.lookupReference('allStation').setRawValue(true)
        }
        stationFilter.fireEvent('customerchange');

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
                me.lookupReference('allProfile').setRawValue(false)
            }
            me.setFilterObjectManager();
            profileBrigadeFilter.fireEvent('customerchange');
            return;
        }

        let j = 0;
        Ext.Array.remove(me.filterBrigadeArray, checkboxValue);
        me.setFilterObjectManager();
        profileBrigadeFilter.items.each(function (checkbox) {
            if (checkbox.checked) {
                j++
            }
        });
        if (profileBrigadeFilter.items.length === j) {
            me.lookupReference('allProfile').setRawValue(true)
        }
        profileBrigadeFilter.fireEvent('customerchange');
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
                me.lookupReference('allStatus').setRawValue(false)
            }
            me.setFilterObjectManager();
            statusBrigadeFilter.fireEvent('customerchange');
            return;
        }
        let j = 0;
        Ext.Array.remove(me.filterBrigadeArray, checkboxValue);
        me.setFilterObjectManager();
        statusBrigadeFilter.items.each(function (checkbox) {
            if (checkbox.checked) {
                j++
            }
        });
        if (statusBrigadeFilter.items.length === j) {
            me.lookupReference('allStatus').setRawValue(true)
        }
        statusBrigadeFilter.fireEvent('customerchange');

    },

    setFilterObjectManager: function () {
        const me = this,
            arrayForShowButton = [],
            arrayForHideButton = [];
        me.Monitoring.objectManager.setFilter(function (object) {
            if (object.customOptions.objectType === 'BRIGADE' && !Ext.Array.contains(me.filterBrigadeArray, object.customOptions.station) &&
                !Ext.Array.contains(me.filterBrigadeArray, object.customOptions.status) &&
                !Ext.Array.contains(me.filterBrigadeArray, object.customOptions.profile)) {
                arrayForShowButton.push(object);
                return true;
            }
            if (object.customOptions.objectType === 'CALL' && !Ext.Array.contains(me.filterBrigadeArray, object.customOptions.station) &&
                !Ext.Array.contains(me.filterBrigadeArray, object.customOptions.status)) {
                return true;
            }
            else {
                if (object.customOptions.objectType === 'BRIGADE') {
                    arrayForHideButton.push(object);
                }
                return false;
            }
        });
        me.showButtonInPanel(arrayForShowButton);
        me.hideButtonInPanel(arrayForHideButton);
    },

    mainBoxReady: function () {
        const me = this;
        ymaps.ready(function () {
            me.createClass();
        });
    },

    createClass: function () {
        const me = this;
        me.myMask = new Ext.LoadMask({
            msg: 'Подождите пожалуйста. Загрузка...',
            target: Ext.getCmp('monitoringPanel')
        });
        me.myMask.show();
        me.Monitoring = Ext.create('Isidamaps.services.monitoring.MapService', {
            addButtonsBrigadeOnPanel: me.addButtonsBrigadeOnPanel.bind(me),
            addStationFilter: me.addStationFilter.bind(me),
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
            me.allProfileBrigade.push(item.inputValue);
        });
        me.lookupReference('statusBrigadeFilter').eachBox(function (item) {
            me.allStatusBrigade.push(item.inputValue);
        });
        me.lookupReference('callStatusFilter').eachBox(function (item) {
            me.allStatusCall.push(item.inputValue);
        });
        me.filterBrigadeArray = Ext.Array.merge(me.allProfileBrigade, me.allStatusBrigade, me.allStatusCall, Isidamaps.app.getController('AppController').stationArray);
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

    hideButtonInPanel: function (brigades) {
        const me = this;
        Ext.suspendLayouts();
        Ext.Array.each(brigades, function (brigade) {
            let brigadePanel = me.buttonBrigade.getComponent('panel_' + brigade.customOptions.station);
            brigadePanel.getComponent('id' + brigade.id).hide();
        });
        Ext.resumeLayouts(true);
    }
    ,

    showButtonInPanel: function (brigades) {
        const me = this;
        Ext.suspendLayouts();
        Ext.Array.each(brigades, function (brigade) {
            let brigadePanel = me.buttonBrigade.getComponent('panel_' + brigade.customOptions.station);
            brigadePanel.getComponent('id' + brigade.id).show();
        });
        Ext.resumeLayouts(true);
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
        me.setFilterObjectManager();
    }
    ,

    addButtonsBrigadeOnPanel:
        function () {
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
