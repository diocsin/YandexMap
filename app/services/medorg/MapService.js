Ext.define('Isidamaps.services.medorg.MapService', {
    extend: 'Isidamaps.services.monitoring.MapService',
    map: null,
    objectManager: null,
    markerClick: Ext.emptyFn,

    constructor: function (options) {
        const me = this;
        me.createMap();
        me.markerClick = options.markerClick;
        me.map.geoObjects.add(me.objectManager);
    },

    optionsObjectManager: function () {
        const me = this;
        me.objectManager.objects.events.add(['click'], function (e) {
            let object = me.objectManager.objects.getById(e.get('objectId'));
            me.markerClick(object);
        });

    },

    listenerStore: function () {
        Ext.getStore('Isidamaps.store.MedOrgStore').on('add', function (store, records, options) {
            this.storeMedOrg(records)
        }, this);
    },

    storeMedOrg: function (records) {
        const me = this,
            medorgMarkers = [];
        records.forEach(function (medorg) {
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
                        iconImageHref: 'resources/icon/' + medorg.get('iconName')
                    },
                    properties: {
                        hintContent: medorg.get('organizationName')
                    }
                })
            }
        });
        me.objectManager.add(medorgMarkers);
    }
});
