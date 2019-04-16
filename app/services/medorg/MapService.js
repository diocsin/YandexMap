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
        this.objectManager.objects.events.add(['click'], (e) => {
            let object = this.objectManager.objects.getById(e.get('objectId'));
            this.markerClick(object);
        });

    },

    listenerStore: function () {
        Ext.getStore('Isidamaps.store.MedOrgStore').on('add', (store, records, options) => {
            this.storeMedOrg(records)
        }, this);
    },

    storeMedOrg: function (records) {
        const medorgMarkers = [];
        records.forEach((medorg) => {
            if (medorg.get('latitude') && medorg.get('longitude')) {
                medorgMarkers.push({
                    type: 'Feature',
                    id: medorg.get('organizationId'),
                    customOptions: {
                        objectType: medorg.get('objectType'),
                        organizationName: medorg.get('organizationName')
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [medorg.get('latitude'), medorg.get('longitude')]
                    },
                    options: {
                        iconImageHref: `resources/icon/${medorg.get('iconName')}`
                    },
                    properties: {
                        hintContent: medorg.get('organizationName')
                    }
                })
            }
        });
        this.objectManager.add(medorgMarkers);
    }
});
