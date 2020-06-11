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
        this.map.geoObjects.add(this.objectManager);
        this.addButtonsBrigadeOnPanel();
    },

    listenerStore: function () {
        Ext.getStore('Isidamaps.store.BrigadesFirstLoadStore').on('load', (store, records, options) => {
            this.getBrigadesFromStore(records)
        }, this);
    },

    setStation: function (stations) {
        const readStation = () => {
            Isidamaps.app.getController('AppController').readStationForSnapshot(stations)
        };
        Isidamaps.app.getController('AppController').initial(readStation);
    },

    getBrigadesFromStore: function (records) {
        this.objectManager.removeAll();
        this.brigadesMarkers = [];
        records.forEach(brigade => {
            if (brigade.isBrigadeHasCoordinates()) {
                this.brigadesMarkers.push(brigade.getObjectForMap());
            }
        });
        this.addMarkersInObjManager();
    }

});
