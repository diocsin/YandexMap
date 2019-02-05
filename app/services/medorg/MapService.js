Ext.define('Isidamaps.services.medorg.MapService', {
    extend: 'Isidamaps.services.monitoring.MapService',
    map: null,
    objectManager: null,
    markerClick: Ext.emptyFn,

    constructor: function (options) {
        const me = this,
            bounds = [
                [60.2, 29.8],
                [59.7, 30.5]
            ];
        me.markerClick = options.markerClick;
        me.map = new ymaps.Map('mapId', {
            bounds: bounds,
            controls: ['trafficControl']
        });
        me.map.behaviors.disable('dblClickZoom'); //отключение приближения при двойном клике по карте
        me.objectManager = new ymaps.ObjectManager({
            clusterize: false,
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: false
        });
        me.objectManager.objects.options.set({
            iconLayout: 'default#image',
            zIndex: 2000,
            iconImageSize: [40, 40]

        });
        me.objectManager.clusters.options.set({
            zIndex: 3000,
            groupByCoordinates: true
        });
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
            if (medorg.get('latitude') !== undefined && medorg.get('longitude') !== undefined) {
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
