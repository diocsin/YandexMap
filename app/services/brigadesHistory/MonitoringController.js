Ext.define('Isidamaps.services.brigadesHistory.MonitoringController', {
    extend: 'Isidamaps.services.monitoring.MonitoringController',
    alias: 'controller.brigadesHistory',
    listen: {
        global: {
            checkedFilter: 'checkedFilter',
            setStateStatusBrigades: 'setStateStatusBrigades',
            setStateStation: 'setStateStation',
            setStateProfileBrigades: 'setStateProfileBrigades',
            setStateStatusCalls: 'setStateStatusCalls',
            getButtonBrigadeForChangeButton: 'getButtonBrigadeForChangeButton',
            buttonSearch: 'buttonSearch',
            getBrigadesSnapshot: 'getBrigadesSnapshot',
            selectAll: 'selectAll',
            deselectAll: 'deselectAll'
        }
    },

    createClass: function () {
        this.myMask = new Ext.LoadMask({
            msg: 'Подождите пожалуйста. Загрузка...',
            target: Ext.getCmp('monitoringPanel')
        });
        this.myMask.show();
        this.Monitoring = Ext.create('Isidamaps.services.brigadesHistory.MapService', {
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
        ASOV.setMapManager({
            setStation: this.Monitoring.setStation.bind(this)
        }, Ext.History.currentToken);
        setTimeout(() => {
            this.addStationFilter();
            this.setCheckboxAfterFirstLoad();
        }, 1000);
        const ymapWrapper = this.lookupReference('ymapWrapper');
        ymapWrapper.on('resize', () => {
            this.Monitoring.resizeMap();
        });
    },

    getBrigadesSnapshot: function (dateTime) {
        this.myMask.show();
        Isidamaps.app.getController('AppController').readBrigadesSnapshot(dateTime);
    },

    addStationFilter: function () {
        const groupFilterStation = this.lookupReference('stationFilter'),
            buttonBrigade = this.lookupReference('BrigadePanel'),
            stations = Isidamaps.app.getController('AppController').stationArray;
        Ext.Array.each(stations, stationName => {
            groupFilterStation.add(Ext.create('Ext.form.field.Checkbox', {
                boxLabel: stationName,
                inputValue: stationName,
                checked: true,
                width: 70,
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
        this.myMask.hide();
    },

    createButtonBrigade: function (brigade) {
        const {id, customOptions: {brigadeNum, profile, status}} = brigade;
        return Ext.create('Ext.Button', {
            itemId: `id${id}`,
            text: `${brigadeNum} (${profile})`,
            maxWidth: 110,
            minWidth: 110,
            margin: 5,
            hidden: false,
            hideMode: 'offsets',
            cls: `button_${status}`,
            listeners: {
                click: () => {
                    this.clickButtonBrigade(brigade);
                }
            }
        });
    },

    addButtonsBrigadeOnPanel: function () {
        this.buttonBrigade = this.lookupReference('BrigadePanel');
        this.buttonBrigade.items.items.forEach(panel =>{
           if(panel.items.size===0){
               return
           }
            panel.removeAll();
        })
        this.callParent();
        this.myMask.hide();
        this.setFilterObjectManager();
        this.createArrayShowHideButton();
    },

    setFilterObjectManager: function () {
        if (this.Monitoring.objectManager.objects.getLength() === 0) {
            return
        }
        this.Monitoring.objectManager.setFilter(object => {
            const {customOptions: {objectType, status, profile, station}} = object,
                found = this.filterMarkerArray.some(r => [status, station, profile].includes(r));
            if (objectType === 'BRIGADE' && !found) {
                return true;
            }
        });
    },

    setFilterBrigadeAndCall: function () {
        this.lookupReference('profileBrigadeFilter').eachBox(item => {
            this.allProfileBrigade.push(item.inputValue);
        });
        this.lookupReference('statusBrigadeFilter').eachBox(item => {
            this.allStatusBrigade.push(item.inputValue);
        });
        this.lookupReference('stationFilter').eachBox(item => {
            this.allStation.push(item.inputValue);
        });

    },

    setCheckboxAfterFirstLoad: function () {
        try {
            this.lookupReference('stationFilter').setValue(this.stateStation.checked);
            this.lookupReference('profileBrigadeFilter').setValue(this.stateProfileBrigades.checked);
            this.lookupReference('statusBrigadeFilter').setValue(this.stateStatusBrigades.checked);
        }
        catch (e) {
            Ext.log({indent: 1, level: 'error'}, e);
        }
        this.myMask.hide();
    }

});
