Ext.define('Isidamaps.services.medorgView.MapService', {
    extend: 'Isidamaps.services.monitoringView.MapService',
    map: null,
    objectManager: null,
    viewModel: null,
    medorgMarkers: [],
    medorgStore: null,
    urlGeodata: null,
    // ====
    markerClick: Ext.emptyFn,
    clustersClick: Ext.emptyFn,
    getStoreMarkerInfo: Ext.emptyFn,
    // ====
    constructor: function (options) {
        var me = this;
        me.markerClick = options.markerClick;
        me.clustersClick = options.clustersClick;
        me.viewModel = options.viewModel;
        me.boundsMap = options.boundsMap;
        me.urlGeodata = options.urlGeodata;
        me.getStoreMarkerInfo = options.getStoreMarkerInfo;
        me.map = new ymaps.Map('mapId-innerCt', {
            bounds: me.boundsMap,
            controls: ['trafficControl']
        });
        me.map.behaviors.disable('dblClickZoom'); //отключение приближения при двойном клике по карте
        me.objectManager = new ymaps.ObjectManager({
            clusterize: true,
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
    },

    addMarkers: function () {
        var me = this;
        me.map.geoObjects.add(me.objectManager);

    },

    readMarkers: function () {
        var me = this,
            urlArray = [],
            urlHospital = Ext.String.format(me.urlGeodata + '/organization?organizationtype=HOSPITAL'),
            urlPolyclinic = Ext.String.format(me.urlGeodata + '/organization?organizationtype=POLYCLINIC'),
            urlEmergencyRoom = Ext.String.format(me.urlGeodata + '/organization?organizationtype=EMERGENCY_ROOM');
        urlArray.push(urlHospital, urlPolyclinic, urlEmergencyRoom);
        urlArray.forEach(function (url) {
            me.medorgStore = Ext.create('Ext.data.Store', {
                model: 'Isidamaps.model.Medorg',
                proxy: {
                    type: 'ajax',
                    url: url,
                    reader: {
                        type: 'json',
                        messageProperty: 'msjError'
                    }
                },
                autoLoad: false
            });


            me.medorgStore.load(function (records) {
                records.forEach(function (medorg) {
                    if (medorg.get('latitude') !== undefined && medorg.get('longitude') !== undefined) {
                        me.medorgMarkers.push({
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
                me.objectManager.add(me.medorgMarkers);
            });
        });
        me.addMarkers();
    }
});
