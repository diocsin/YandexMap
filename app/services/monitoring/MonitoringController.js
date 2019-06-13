Ext.define('Isidamaps.services.monitoring.MonitoringController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.monitoring',
    Monitoring: null,
    filterMarkerArray: [],
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
            checkedFilter: 'checkedFilter',
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
            case Isidamaps.app.globals.ALL_STATIONS:
                this.filterMarkerArray = Ext.Array.difference(this.filterMarkerArray, Isidamaps.app.getController('AppController').stationArray);
                break;
            case Isidamaps.app.globals.ALL_STATUSES:
                this.filterMarkerArray = Ext.Array.difference(this.filterMarkerArray, this.allStatusBrigade);
                break;
            case Isidamaps.app.globals.ALL_PROFILES:
                this.filterMarkerArray = Ext.Array.difference(this.filterMarkerArray, this.allProfileBrigade);
                break;
            case Isidamaps.app.globals.ALL_CALLS:
                this.filterMarkerArray = Ext.Array.difference(this.filterMarkerArray, this.allStatusCall);
                break;
        }
        this.setFilterObjectManager();
        this.createArrayShowHideButton();
    },

    deselectAll: function (checkbox) {
        switch (checkbox.reference) {
            case Isidamaps.app.globals.ALL_STATIONS:
                this.filterMarkerArray = Ext.Array.merge(this.filterMarkerArray, Isidamaps.app.getController('AppController').stationArray);
                break;
            case Isidamaps.app.globals.ALL_STATUSES:
                this.filterMarkerArray = Ext.Array.merge(this.filterMarkerArray, this.allStatusBrigade);
                break;
            case Isidamaps.app.globals.ALL_PROFILES:
                this.filterMarkerArray = Ext.Array.merge(this.filterMarkerArray, this.allProfileBrigade);
                break;
            case Isidamaps.app.globals.ALL_CALLS:
                this.filterMarkerArray = Ext.Array.merge(this.filterMarkerArray, this.allStatusCall);
                break;
        }
        this.setFilterObjectManager();
        this.createArrayShowHideButton();
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
        let searchText = Ext.getCmp('searchTextField').getValue(),
            brigade = Ext.getStore('Isidamaps.store.BrigadeSearchStore').getById(searchText),
            brigadeInMap = this.Monitoring.objectManager.objects.getById(searchText);
        brigade && brigadeInMap ? this.Monitoring.map.setCenter(brigadeInMap.geometry.coordinates, 14) : Ext.getCmp('searchTextField').setActiveError('Не найдена бригада с данным номером');
    },

    checkedFilter: function (checkbox, reference, inputValueAllCheckBox) {
        const {inputValue, checked} = checkbox,
            groupFilterComp = this.lookupReference(reference);
        if (!checked) {
            this.uncheckCheckBoxInFilter(groupFilterComp, inputValue, inputValueAllCheckBox);
            return;
        }
        this.checkCheckBoxInFilter(groupFilterComp, inputValue, inputValueAllCheckBox)
    },

    checkCheckBoxInFilter: function (groupFilterComp, inputValue, inputValueAllCheckBox) {
        let j = 0;
        Ext.Array.remove(this.filterMarkerArray, inputValue);
        this.setFilterObjectManager();
        this.createArrayShowHideButton();
        groupFilterComp.items.each(checkbox => {
            if (checkbox.checked) {
                j++
            }
        });
        if (groupFilterComp.items.length === j) {
            this.lookupReference(inputValueAllCheckBox).setRawValue(true)
        }
        groupFilterComp.fireEvent('customerchange');
    },

    uncheckCheckBoxInFilter: function (groupFilterComp, inputValue, inputValueAllCheckBox) {
        let i = 0;
        this.filterMarkerArray.push(inputValue);
        this.setFilterObjectManager();
        this.createArrayShowHideButton();
        groupFilterComp.items.each(checkbox => {
            if (checkbox.checked) {
                i++
            }
        });
        if (groupFilterComp.items.length === i + 1) {
            this.lookupReference(inputValueAllCheckBox).setRawValue(false)
        }
        groupFilterComp.fireEvent('customerchange');
    },

    setFilterObjectManager: function () {
        this.Monitoring.objectManager.setFilter(object => {
            const {customOptions: {objectType, status, profile, station}} = object,
                found = this.filterMarkerArray.some(r => this.returnArray(status, station, profile).includes(r));
            if (objectType === 'BRIGADE' && !found) {
                return true;
            }
            return objectType === 'CALL' && !Ext.Array.contains(this.filterMarkerArray, station) &&
                !Ext.Array.contains(this.filterMarkerArray, status);
        });
    },

    createArrayShowHideButton: function () {
        const arrayForHideButton = [],
            arrayForShowButton = [],
            states = Ext.getStore('Isidamaps.store.BrigadeSearchStore');

        states.removeAll();
        this.Monitoring.objectManager.objects.each(object => {
            const {id, customOptions: {brigadeNum, objectType, status, profile, station}} = object,
                found = this.filterMarkerArray.some(r => this.returnArray(status, station, profile).includes(r));
            if (objectType === 'BRIGADE' && !found) {
                arrayForShowButton.push(object);
                let user = Ext.create('Isidamaps.model.Brigade', {
                    brigadeNum: brigadeNum,
                    id: id
                });
                states.add(user);
            }
            else {
                if (objectType === 'BRIGADE') {
                    arrayForHideButton.push(object);
                }
            }
        });
        this.showOrHideButtonInPanel(arrayForShowButton, true);
        this.showOrHideButtonInPanel(arrayForHideButton, false);
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
            setCheckboxAfterFirstLoad: this.setCheckboxAfterFirstLoad.bind(this),
            addNewButtonOnPanel: this.addNewButtonOnPanel.bind(this),
            destroyButtonOnPanel: this.destroyButtonOnPanel.bind(this),
        });
        this.Monitoring.createMap();
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
    },

    setFilterBrigadeAndCall: function () {
        this.lookupReference('profileBrigadeFilter').eachBox(item => {
            this.allProfileBrigade.push(item.inputValue);
        });
        this.lookupReference('statusBrigadeFilter').eachBox(item => {
            this.allStatusBrigade.push(item.inputValue);
        });
        this.lookupReference('callStatusFilter').eachBox(item => {
            this.allStatusCall.push(item.inputValue);
        });
        this.lookupReference('stationFilter').eachBox(item => {
            this.allStation.push(item.inputValue);
        });
        this.filterMarkerArray = Ext.Array.merge(this.allProfileBrigade, this.allStatusBrigade, this.allStatusCall, this.allStation);
    },

    setCheckboxAfterFirstLoad: function () {
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
    },

    addStationFilter: function () {
        const groupFilterStation = this.lookupReference('stationFilter'),
            buttonBrigade = this.lookupReference('BrigadePanel'),
            stations = Isidamaps.app.getController('AppController').stationArray;

        Ext.Array.each(stations, stationName => {
            groupFilterStation.add(Ext.create('Ext.form.field.Checkbox', {
                boxLabel: stationName,
                inputValue: stationName,
                checked: false,
                listeners: {
                    change: {
                        fn: (checkbox, checked) => {
                            Ext.fireEvent('checkedFilter', checkbox, 'stationFilter', Isidamaps.app.globals.ALL_STATIONS);
                        }
                    }
                }
            }));
            buttonBrigade.add(Ext.create('Ext.panel.Panel', {
                itemId: `panel_${stationName}`,
                title: stationName,
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
    },

    getButtonBrigadeForChangeButton: function (brigade, oldStatus) {
        const {id, customOptions: {status, station, profile}} = brigade,
            brigadesPanel = this.buttonBrigade.getComponent(`panel_${station}`),
            brigadeButton = brigadesPanel.getComponent(`id${id}`),
            found = this.filterMarkerArray.some(r => this.returnArray(status, station, profile).includes(r));

        brigadeButton.removeCls(`button_${oldStatus}`);
        brigadeButton.addCls(`button_${status}`);

        if (Ext.Array.contains(this.filterMarkerArray, status) && !brigadeButton.isHidden()) {
            brigadeButton.hide();
        }
        if (!found && brigadeButton.isHidden()) {
            brigadeButton.show();
        }
        brigadesPanel.updateLayout();
    },

    showOrHideButtonInPanel: function (brigades, show) {
        Ext.suspendLayouts();
        Ext.Array.each(brigades, brigade => {
            let brigadePanel = this.buttonBrigade.getComponent(`panel_${brigade.customOptions.station}`);
            show ? brigadePanel.getComponent(`id${brigade.id}`).show() : brigadePanel.getComponent(`id${brigade.id}`).hide();
        });
        Ext.resumeLayouts(true);
    },

    destroyButtonOnPanel: function (brigade) {
        try {
            const brigadePanel = this.buttonBrigade.getComponent(`panel_${brigade.customOptions.station}`);
            brigadePanel.getComponent(`id${brigade.id}`).destroy();
        }
        catch (e) {
            Ext.log({indent: 1, level: 'error'}, e);
        }
    },

    addNewButtonOnPanel: function (brigade) {
        const brigadePanel = this.buttonBrigade.getComponent(`panel_${brigade.customOptions.station}`),
            button = this.createButtonBrigade(brigade);
        brigadePanel.add(button);
        this.createArrayShowHideButton();
    },

    addButtonsBrigadeOnPanel: function () {
        const brigadeSort = [];
        this.buttonBrigade = this.lookupReference('BrigadePanel');
        Ext.Array.each(this.Monitoring.brigadesMarkers, brigade => {
            brigadeSort.push(brigade);
        });
        brigadeSort.sort(function (a, b) {
            return a.customOptions.station - b.customOptions.station
        });
        brigadeSort.sort(function (a, b) {
            return a.customOptions.status === b.customOptions.status ? -1 : 1
        });
        Ext.Array.each(brigadeSort, brigade => {
            const button = this.createButtonBrigade(brigade),
                stationPanelBrigades = this.buttonBrigade.getComponent(`panel_${brigade.customOptions.station}`);
            stationPanelBrigades.add(button);
        });
    },

    createButtonBrigade: function (brigade) {
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
                    this.clickButtonBrigade(brigade);
                }
            }
        });
    },

    clickButtonBrigade: function (brigade) {
        const marker = this.Monitoring.objectManager.objects.getById(brigade.id);
        if (marker) {
            this.Monitoring.map.setCenter(marker.geometry.coordinates, 14);
        }
    },

    returnArray: function (...args) {
        return args
    },

    layoutReady: function () {
        this.fireTabEvent(this.lookupReference('navigationPanel'));
    },

    tabChange: function (panel, newTab, oldTab) {
        oldTab.fireEvent('tabExit');
        this.fireTabEvent(newTab);
    },

    fireTabEvent: function (tab) {
        tab.fireEvent('tabEnter');
    }
});
