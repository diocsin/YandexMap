Ext.define('Isidamaps.services.monitoring.MonitoringController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.monitoring',
    Monitoring: null,
    filterBrigadeArray: [],
    allStatusBrigade: [],
    allProfileBrigade: [],
    allStatusCall: [],
    allStation: [],
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
        switch (checkbox.reference) {
            case 'allStation':
                this.filterBrigadeArray = Ext.Array.difference(this.filterBrigadeArray, Isidamaps.app.getController('AppController').stationArray);
                break;
            case 'allStatus':
                this.filterBrigadeArray = Ext.Array.difference(this.filterBrigadeArray, this.allStatusBrigade);
                break;
            case  'allProfile':
                this.filterBrigadeArray = Ext.Array.difference(this.filterBrigadeArray, this.allProfileBrigade);
                break;
            case 'allCalls':
                this.filterBrigadeArray = Ext.Array.difference(this.filterBrigadeArray, this.allStatusCall);
                break;
        }
        this.setFilterObjectManager();
    },

    deselectAll: function (checkbox) {
        switch (checkbox.reference) {
            case 'allStation':
                this.filterBrigadeArray = Ext.Array.merge(this.filterBrigadeArray, Isidamaps.app.getController('AppController').stationArray);
                break;
            case 'allStatus':
                this.filterBrigadeArray = Ext.Array.merge(this.filterBrigadeArray, this.allStatusBrigade);
                break;
            case  'allProfile':
                this.filterBrigadeArray = Ext.Array.merge(this.filterBrigadeArray, this.allProfileBrigade);
                break;
            case 'allCalls':
                this.filterBrigadeArray = Ext.Array.merge(this.filterBrigadeArray, this.allStatusCall);
                break;
        }
        this.setFilterObjectManager();
    },

    setStateStatusBrigades: function (state) {
        this.stateStatusBrigades = state;
    },

    setStateStation: function (state) {
        this.stateStation = state;
    },

    setStateProfileBrigades: function (state) {
        this.stateProfileBrigades = state;
    },

    setStateStatusCalls: function (state) {
        this.stateStatusCalls = state;
    },

    buttonSearch: function () {
        let searchTrue = null,
            searchText = Ext.getCmp('searchTextField').getValue();
        Ext.Array.each(this.Monitoring.objectManager.objects.getAll(), (object) => {
            if (object.customOptions.brigadeNum === searchText) {
                this.Monitoring.map.setCenter([object.geometry.coordinates[0], object.geometry.coordinates[1]], 14);
                searchTrue = object;
                return false;
            }
        });
        if (searchTrue === null) {
            Ext.getCmp('searchTextField').setActiveError('Не найдена бригада с данным номером');
        }
    },

    checkedCallStatus: function (checkbox) {
        const {inputValue, checked} = checkbox,
            callStatusFilterComp = this.lookupReference('callStatusFilter');
        if (!checked) {
            this.filterBrigadeArray.push(inputValue);
            let i = 0;
            callStatusFilterComp.items.each((checkbox) => {
                if (checkbox.checked) {
                    i++
                }
            });
            if (callStatusFilterComp.items.length === i + 1) {
                this.lookupReference('allCalls').setRawValue(false)
            }
            this.setFilterObjectManager();
            callStatusFilterComp.fireEvent('customerchange');
            return;
        }
        let j = 0;
        Ext.Array.remove(this.filterBrigadeArray, inputValue);
        this.setFilterObjectManager();
        callStatusFilterComp.items.each((checkbox) => {
            if (checkbox.checked) {
                j++
            }
        });
        if (callStatusFilterComp.items.length === j) {
            this.lookupReference('allCalls').setRawValue(true)
        }
        callStatusFilterComp.fireEvent('customerchange');
    },

    checkedStationBrigade: function (checkbox) {
        const {inputValue, checked} = checkbox,
            stationFilter = this.lookupReference('stationFilter');
        if (!checked) {
            this.filterBrigadeArray.push(inputValue);
            let i = 0;
            stationFilter.items.each((checkbox) => {
                if (checkbox.checked) {
                    i++
                }
            });
            if (stationFilter.items.length === i + 1) {
                this.lookupReference('allStation').setRawValue(false)
            }
            this.setFilterObjectManager();
            stationFilter.fireEvent('customerchange');
            return;
        }
        let j = 0;
        Ext.Array.remove(this.filterBrigadeArray, inputValue);
        this.setFilterObjectManager();
        stationFilter.items.each((checkbox) => {
            if (checkbox.checked) {
                j++
            }
        });
        if (stationFilter.items.length === j) {
            this.lookupReference('allStation').setRawValue(true)
        }
        stationFilter.fireEvent('customerchange');

    },

    checkedProfileBrigade: function (checkbox) {
        const {inputValue, checked} = checkbox,
            profileBrigadeFilter = this.lookupReference('profileBrigadeFilter');
        if (!checked) {
            this.filterBrigadeArray.push(inputValue);
            let i = 0;
            profileBrigadeFilter.items.each((checkbox) => {
                if (checkbox.checked) {
                    i++
                }
            });
            if (profileBrigadeFilter.items.length === i + 1) {
                this.lookupReference('allProfile').setRawValue(false)
            }
            this.setFilterObjectManager();
            profileBrigadeFilter.fireEvent('customerchange');
            return;
        }

        let j = 0;
        Ext.Array.remove(this.filterBrigadeArray, inputValue);
        this.setFilterObjectManager();
        profileBrigadeFilter.items.each((checkbox) => {
            if (checkbox.checked) {
                j++
            }
        });
        if (profileBrigadeFilter.items.length === j) {
            this.lookupReference('allProfile').setRawValue(true)
        }
        profileBrigadeFilter.fireEvent('customerchange');
    }
    ,

    checkedStatusBrigade: function (checkbox) {
        const {inputValue, checked} = checkbox,
            statusBrigadeFilter = this.lookupReference('statusBrigadeFilter');
        if (!checked) {
            this.filterBrigadeArray.push(inputValue);
            let i = 0;
            statusBrigadeFilter.items.each((checkbox) => {
                if (checkbox.checked) {
                    i++
                }
            });
            if (statusBrigadeFilter.items.length === i + 1) {
                this.lookupReference('allStatus').setRawValue(false)
            }
            this.setFilterObjectManager();
            statusBrigadeFilter.fireEvent('customerchange');
            return;
        }
        let j = 0;
        Ext.Array.remove(this.filterBrigadeArray, inputValue);
        this.setFilterObjectManager();
        statusBrigadeFilter.items.each((checkbox) => {
            if (checkbox.checked) {
                j++
            }
        });
        if (statusBrigadeFilter.items.length === j) {
            this.lookupReference('allStatus').setRawValue(true)
        }
        statusBrigadeFilter.fireEvent('customerchange');

    },

    setFilterObjectManager: function () {
        const arrayForShowButton = [],
            arrayForHideButton = [];
        this.Monitoring.objectManager.setFilter((object) => {
            const {customOptions: {objectType, status, profile, station}} = object;
            if (objectType === 'BRIGADE' && !Ext.Array.contains(this.filterBrigadeArray, station) &&
                !Ext.Array.contains(this.filterBrigadeArray, status) &&
                !Ext.Array.contains(this.filterBrigadeArray, profile)) {
                arrayForShowButton.push(object);
                return true;
            }
            if (objectType === 'CALL' && !Ext.Array.contains(this.filterBrigadeArray, station) &&
                !Ext.Array.contains(this.filterBrigadeArray, status)) {
                return true;
            }
            else {
                if (objectType === 'BRIGADE') {
                    arrayForHideButton.push(object);
                }
                return false;
            }
        });
        this.showButtonInPanel(arrayForShowButton);
        this.hideButtonInPanel(arrayForHideButton);
    },

    mainBoxReady: function () {
        ymaps.ready(() => {
            this.createClass();
        });
    },

    createClass: function () {
        this.myMask = new Ext.LoadMask({
            msg: 'Подождите пожалуйста. Загрузка...',
            target: Ext.getCmp('monitoringPanel')
        });
        this.myMask.show();
        this.Monitoring = Ext.create('Isidamaps.services.monitoring.MapService', {
            addButtonsBrigadeOnPanel: this.addButtonsBrigadeOnPanel.bind(this),
            addStationFilter: this.addStationFilter.bind(this),
            getButtonBrigadeForChangeButton: this.getButtonBrigadeForChangeButton,
            setCheckbox: this.setCheckbox.bind(this),
            addNewButtonOnPanel: this.addNewButtonOnPanel.bind(this),
            destroyButtonOnPanel: this.destroyButtonOnPanel.bind(this),
        });
        this.Monitoring.searchControl();
        this.Monitoring.listenerStore();
        this.Monitoring.optionsObjectManager();
        ASOV.setMapManager({
            setStation: this.Monitoring.setStation.bind(this)
        }, Ext.History.currentToken);
        const ymapWrapper = this.lookupReference('ymapWrapper');
        ymapWrapper.on('resize', () => {
            this.Monitoring.resizeMap();
        });
    }
    ,

    setFilterBrigadeAndCall: function () {
        this.lookupReference('profileBrigadeFilter').eachBox((item) => {
            this.allProfileBrigade.push(item.inputValue);
        });
        this.lookupReference('statusBrigadeFilter').eachBox((item) => {
            this.allStatusBrigade.push(item.inputValue);
        });
        this.lookupReference('callStatusFilter').eachBox((item) => {
            this.allStatusCall.push(item.inputValue);
        });

        this.lookupReference('stationFilter').eachBox((item) => {
            this.allStation.push(item.inputValue);
        });

        this.filterBrigadeArray = Ext.Array.merge(this.allProfileBrigade, this.allStatusBrigade, this.allStatusCall, this.allStation);
    }
    ,

    setCheckbox: function () {
        try {
            this.lookupReference('stationFilter').setValue(this.stateStation.checked);
            this.lookupReference('profileBrigadeFilter').setValue(this.stateProfileBrigades.checked);
            this.lookupReference('statusBrigadeFilter').setValue(this.stateStatusBrigades.checked);
            this.lookupReference('callStatusFilter').setValue(this.stateStatusCalls.checked);
        }
        catch (e) {
            Ext.log({indent: 1, level: 'error'}, e);
        }
        this.myMask.hide();
    }
    ,

    addStationFilter: function () {
        const checkboxStation = this.lookupReference('stationFilter'),
            buttonBrigade = this.lookupReference('BrigadePanel'),
            records = Isidamaps.app.getController('AppController').stationArray;
        Ext.Array.each(records, (rec) => {
            checkboxStation.add(Ext.create('Ext.form.field.Checkbox', {
                boxLabel: rec,
                inputValue: rec,
                checked: false,
                listeners: {
                    change: {
                        fn: (checkbox, checked) => {
                            Ext.fireEvent('checkedStationBrigade', checkbox, checked);
                        }
                    }
                }
            }));
            buttonBrigade.add(Ext.create('Ext.panel.Panel', {
                itemId: `panel_${rec}`,
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
        this.setFilterBrigadeAndCall();

    }
    ,

    getButtonBrigadeForChangeButton: function (brigade, oldStatus) {
        const {id, customOptions: {status, station, profile}} = brigade,
            brigadePanel = this.buttonBrigade.getComponent(`panel_${station}`),
            brigadeHave = brigadePanel.getComponent(`id${id}`);
        brigadeHave.removeCls(`button_${oldStatus}`);
        brigadeHave.addCls(`button_${status}`);
        if (Ext.Array.contains(this.filterBrigadeArray, status) && !brigadeHave.isHidden()) {
            brigadeHave.hide();
        }
        if (!Ext.Array.contains(this.filterBrigadeArray, station) &&
            !Ext.Array.contains(this.filterBrigadeArray, status) &&
            !Ext.Array.contains(this.filterBrigadeArray, profile) &&
            brigadeHave.isHidden()) {
            brigadeHave.show();
        }

        brigadePanel.updateLayout();
    }
    ,

    hideButtonInPanel: function (brigades) {
        Ext.suspendLayouts();
        Ext.Array.each(brigades, (brigade) => {
            let brigadePanel = this.buttonBrigade.getComponent(`panel_${brigade.customOptions.station}`);
            brigadePanel.getComponent(`id${brigade.id}`).hide();
        });
        Ext.resumeLayouts(true);
    }
    ,

    showButtonInPanel: function (brigades) {
        Ext.suspendLayouts();
        Ext.Array.each(brigades, (brigade) => {
            let brigadePanel = this.buttonBrigade.getComponent(`panel_${brigade.customOptions.station}`);
            brigadePanel.getComponent(`id${brigade.id}`).show();
        });
        Ext.resumeLayouts(true);
    }
    ,

    destroyButtonOnPanel: function (brigade) {
        try {
            const brigadePanel = this.buttonBrigade.getComponent(`panel_${brigade.customOptions.station}`);
            brigadePanel.getComponent(`id${brigade.id}`).destroy();
        }
        catch (e) {
            Ext.log({indent: 1, level: 'error'}, e);
        }
    }
    ,

    addNewButtonOnPanel: function (brigade) {
        const brigadePanel = this.buttonBrigade.getComponent(`panel_${brigade.customOptions.station}`),
            button = this.createButton(brigade);
        brigadePanel.add(button);
        this.setFilterObjectManager();
    }
    ,

    addButtonsBrigadeOnPanel: function () {
        const brigadeSort = [];
        this.buttonBrigade = this.lookupReference('BrigadePanel');
        Ext.Array.each(this.Monitoring.brigadesMarkers, (brigade) => {
            brigadeSort.push(brigade);
        });
        brigadeSort.sort(function (a, b) {
            return a.customOptions.station - b.customOptions.station
        });
        brigadeSort.sort(function (a, b) {
            return a.customOptions.status === b.customOptions.status ? -1 : 1
        });
        Ext.Array.each(brigadeSort, (brigade) => {
            const button = this.createButton(brigade),
                stationPanelBrigades = this.buttonBrigade.getComponent(`panel_${brigade.customOptions.station}`);
            stationPanelBrigades.add(button);
        });
    }

    ,

    createButton: function (brigade) {
        const {id, customOptions: {brigadeNum, profile, status}} = brigade;
        return Ext.create('Ext.Button', {
            itemId: `id${id}`,
            text: `${brigadeNum} (${profile})`,
            maxWidth: 110,
            minWidth: 110,
            margin: 5,
            hidden: true,
            hideMode: 'offsets',
            cls: `button_${status}`,
            listeners: {
                click: () => {
                    this.clickButton(brigade);
                }
            }
        });
    }
    ,

    clickButton: function (brigade) {
        const marker = this.Monitoring.objectManager.objects.getById(brigade.id);
        if (marker) {
            this.Monitoring.map.setCenter([marker.geometry.coordinates[0], marker.geometry.coordinates[1]], 14);
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
