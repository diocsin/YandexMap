Ext.define('Isidamaps.services.medorg.MapService', {
    extend: 'Isidamaps.services.monitoring.MapService',
    map: null,
    objectManager: null,
    markerClick: Ext.emptyFn,

    constructor: function (options) {
        this.createMap();
        this.markerClick = options.markerClick;
        this.map.geoObjects.add(this.objectManager);
    },

    optionsObjectManager: function () {
        const markerController = Ext.create('controller.markercontroller');
        this.objectManager.objects.events.add(['click'], e => {
            let object = this.objectManager.objects.getById(e.get('objectId'));
            markerController.markerClick(object, this.objectManager.objects);
        });
    },

    listenerStore: function () {
        Ext.getStore('Isidamaps.store.MedOrgStore').on('add', (store, records, options) => {
            this.storeMedOrg(records)
        }, this);
    },

    storeMedOrg: function (records) {
        const medorgMarkers = [];
        records.forEach(medorg => {
            if (medorg.isMedOrgHasCoordinates()) {
                medorgMarkers.push(medorg.getObjectForMap())
            }
        });
        this.objectManager.add(medorgMarkers);
    }
});
