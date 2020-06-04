Ext.define('Isidamaps.services.brigadesHistory.MapService', {
    extend: 'Isidamaps.services.monitoring.MapService',

    constructor: function (options) {
        this.setCheckboxAfterFirstLoad = options.setCheckboxAfterFirstLoad;
        this.addNewButtonOnPanel = options.addNewButtonOnPanel;
        this.destroyButtonOnPanel = options.destroyButtonOnPanel;
        this.addButtonsBrigadeOnPanel = options.addButtonsBrigadeOnPanel;
        this.addStationFilter = options.addStationFilter;
    },


    addMarkersInObjManager: function () {
        this.objectManager.add(this.brigadesMarkers);
        this.objectManager.add(this.callMarkers);
        this.map.geoObjects.add(this.objectManager);
        this.addButtonsBrigadeOnPanel();
        this.setCheckboxAfterFirstLoad();
    },

    listenerWebSockedStore: function () {
        Ext.getStore('Isidamaps.store.BrigadeFromWSStore').on('add', (store, records, index) => {
            this.getBrigadeFromWS(...records)
        }, this);
        Ext.getStore('Isidamaps.store.CallFromWSStore').on('add', (store, records, index) => {
            this.getCallFromWS(...records)
        }, this);
    },

    listenerStore: function () {
        Ext.getStore('Isidamaps.store.BrigadesFirstLoadStore').on('load', (store, records, options) => {
            this.getBrigadesFromStore(records)
        }, this);
        Ext.getStore('Isidamaps.store.CallsFirstLoadStore').on('load', (store, records, options) => {
            this.getCallsFromStore(records)
        }, this);
    },

    addMarkerInObjectManager: function (marker) {
        const object = this.objectManager.objects.getById(marker.id),
            addFeature = () => {
                this.objectManager.objects.add(marker);
            },
            {customOptions: {objectType, status}} = marker;
        if (object) {
            this.objectManager.objects.remove(object);
        }
        if (objectType === 'BRIGADE') {
            if (status !== 'WITHOUT_SHIFT') {
                Ext.defer(addFeature, 10, this);
            }
            return;
        }
        if (status !== 'COMPLETED') {
            Ext.defer(addFeature, 10, this);
        }
    },

    setStationAndTime: function (stations, time) {
        const readStationAndTime = () => {
            Isidamaps.app.getController('AppController').readStationAndTime(stations, time)
        };
        Isidamaps.app.getController('AppController').initial(readStationAndTime);
    },




    getBrigadesFromStore: function (records) {
        Ext.Array.clean(this.brigadesMarkers);
        records.forEach(brigade => {
            if (brigade.get('latitude') && brigade.get('longitude')) {
                const feature = this.createBrigadeFeature(brigade);
                this.brigadesMarkers.push(feature);
            }
        });
        this.checkArrayIsEmpty(this.callMarkers);
    },

    getCallsFromStore: function (records) {
        Ext.Array.clean(this.callMarkers);
        records.forEach(call => {
            if (call.get('latitude') && call.get('longitude')) {
                const feature = this.createCallFeature(call);
                this.callMarkers.push(feature);
            }
        });
        this.checkArrayIsEmpty(this.brigadesMarkers);
    },

    checkArrayIsEmpty: function (array) {
        if (array.length !== 0) {
            this.addStationFilter();
            this.addMarkersInObjManager();
            this.listenerWebSockedStore();
        }
    },

    getCallFromWS: function (call) {
        if (call.get('latitude') && call.get('longitude')) {
            let marker = this.createCallFeature(call);
            this.addMarkerInObjectManager(marker);
            Ext.getStore('Isidamaps.store.CallFromWSStore').clearData();
        }
    },

    getBrigadeFromWS: function (brigade) {
        if (brigade.get('latitude') && brigade.get('longitude') && brigade.get('status')) {
            if (brigade.get('deviceId') === this.brigadeClickId) {
                this.updateSpeedInForm(brigade.get('speed'));
            }
            let marker = this.createBrigadeFeature(brigade);
            let brigadeHas = Ext.Array.findBy(this.brigadesMarkers, (brigadeInArray, index) => {
                if (brigadeInArray.id === brigade.get('deviceId')) {
                    return brigadeInArray;
                }
            });
            Ext.Array.remove(this.brigadesMarkers, brigadeHas);
            if (brigade.get('status') !== 'WITHOUT_SHIFT') {
                Ext.Array.push(this.brigadesMarkers, marker);
                if (brigadeHas && brigadeHas.customOptions.status !== marker.customOptions.status) {
                    Ext.fireEvent('getButtonBrigadeForChangeButton', marker, brigadeHas.customOptions.status);
                }
                else if (!brigadeHas) {
                    this.addNewButtonOnPanel(marker);
                }
            }
            else {
                this.destroyButtonOnPanel(marker);
            }
            this.addMarkerInObjectManager(marker);
            Ext.getStore('Isidamaps.store.BrigadeFromWSStore').clearData();
        }
    },

    resizeMap: function () {
        this.map.container.fitToViewport();
    }

});
