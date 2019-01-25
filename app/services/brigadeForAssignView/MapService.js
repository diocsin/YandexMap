Ext.define('Isidamaps.services.brigadeForAssignView.MapService', {
    extend: 'Isidamaps.services.callHistoryView.MapService',
    map: null,
    objectManager: null,
    callMarkers: [],
    brigadesMarkers: [],
    viewModel: null,
    arrRoute: [],
    arrpoints: [],
    brigades: [],
    urlGeodata: null,
    arrRouteForTable: [],
    errorBrigades: [],
    MyIconContentLayout: null,

    // ====.
    markerClick: Ext.emptyFn,
    clustersClick: Ext.emptyFn,
    // ====

    constructor: function (options) {
        var me = this;
        me.markerClick = options.markerClick;
        me.clustersClick = options.clustersClick;
        me.viewModel = options.viewModel;
        me.boundsMap = options.boundsMap;
        me.getStoreMarkerInfo = options.getStoreMarkerInfo;
        me.urlGeodata = options.urlGeodata;
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
        me.MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div style="color: #000000;  border: 1px solid; display: inline-block; background-color: #faf8ff; text-align: center; border-radius: 6px; z-index: 2;font-size: 12pt">$[properties.iconContent]</div>'
        );
    },
    callback: function () {
        var me = this;
        if (me.arrRoute.length === me.brigadesMarkers.length) {
            ASOV.setRoutes(me.arrRoute);
        }
    },

    createMarkers: function () {
        var me = this;
        if (me.callMarkers.length === 0) {
            me.createCallAlert();
        } else if (me.errorBrigades.length > 0) {
           // me.createBrigadeAlert();
        }
        me.createBouns();  //в callHistory
        me.optionsObjectManager();
        me.objectManager.add(me.brigadesMarkers).add(me.callMarkers);
        me.map.geoObjects.add(me.objectManager);
        if (me.callMarkers.length > 0 && me.brigadesMarkers.length > 0) {
            me.brigadesMarkers.forEach(function (brigadeMarker) {
                me.createRoute(me.callMarkers[0], brigadeMarker);
            });
        }

    },
    optionsObjectManager: function () {
        var me = this;
        me.objectManager.clusters.events.add(['click'], function (e) {
            var object = me.objectManager.clusters.getById(e.get('objectId'));
            me.clustersClick([e._sourceEvent.originalEvent.clientPixels[0] - 220, e._sourceEvent.originalEvent.clientPixels[1] + 20], object);
        });

        me.objectManager.objects.events.add(['click', 'contextmenu'], function (e) {
            var object = me.objectManager.objects.getById(e.get('objectId')),
                eType = e.get('type');
            if (eType === 'click') {
                var storeMarker = me.getStoreMarkerInfo(object);
                me.markerClick(object, [e._sourceEvent.originalEvent.clientPixels[0], e._sourceEvent.originalEvent.clientPixels[1]], storeMarker);
            } else {
                if (object.customOptions.objectType === 'BRIGADE') {
                    var store = me.viewModel.getStore('Routes'),
                        record = store.getById(object.id);
                    store.each(function (rec) {
                        rec.set('checkBox', false);
                    });
                    record.set('checkBox', !record.get('checkBox'));
                }
            }
        });
    },

    createAnswer: function () {
        var me = this,
            store = me.viewModel.getStore('Routes'),
            br = store.query('checkBox', 'true'),
            brigadeId = br.getValues('brigadeId', 'data');
        if (brigadeId.length === 1) {
            ASOV.setBrigade(brigadeId[0]);
        } else (Ext.create('Ext.window.MessageBox').show({
            title: 'Ошибка',
            message: 'Не назначена бригада на вызов',
            icon: Ext.Msg.ERROR,
            buttons: Ext.Msg.OK
        }))
    },

    createCallAlert: function () {
        Ext.create('Ext.window.MessageBox').show({
            title: 'Ошибка',
            message: 'Нет координат вызова',
            icon: Ext.Msg.ERROR,
            buttons: Ext.Msg.OK
        })
    },

    createBrigadeAlert: function () {
        var me = this,
            stringError = Ext.String.format('Нет координат {0} бригад', me.errorBrigades);
        Ext.create('Ext.window.MessageBox').show({
            title: 'Ошибка',
            message: stringError,
            icon: Ext.Msg.ERROR,
            buttons: Ext.Msg.OK
        })
    },


    createRoute: function (call, brigade) {
        var me = this,
            routeList = null;
        ymaps.route([brigade.geometry.coordinates, call.geometry.coordinates], {
            avoidTrafficJams: true
        }).then(function (route) {
            route.getWayPoints().options.set({
                iconLayout: 'default#image',
                iconImageHref: false,
                hasBalloon: false,
                zIndex: 1
            });
            route.getPaths().options.set({
                opacity: 0.9,
                strokeWidth: 4
            });
            me.map.geoObjects.add(route);
            routeList = {
                brigade: brigade,
                route: route
            };
            me.arrRouteForTable.push(routeList);
            for (var i = 0; i < route.getPaths().getLength(); i++) {
                var way = route.getPaths().get(i),
                    segments = way.getSegments();
                for (var j = 0; j < segments.length; j++) {
                    var point = segments[j].getCoordinates();
                    me.arrpoints.push(
                        [point[0][0], point[0][1]]
                    );
                }
                me.arrpoints.unshift(brigade.geometry.coordinates);
                me.arrpoints.push(call.geometry.coordinates);
            }
            me.arrRoute.push({
                brigadeId: brigade.id,
                objectType: brigade.customOptions.objectType,
                profile: brigade.customOptions.profile,
                brigadeNum: brigade.customOptions.brigadeNum,
                longitude: brigade.geometry.coordinates[1],
                latitude: brigade.geometry.coordinates[0],
                distance: (route.getLength() / 1000).toFixed(1),
                time: (route.getJamsTime() / 60).toFixed(0),
                route: me.arrpoints
            }).then(me.createTableRoute(), me.callback(), me.arrpoints = []);
        })
    },

    setMarkers: function (call, brigades) {
        this.BrigadeForAssign.readMarkers(call, brigades);
    },

    readMarkers: function (call, brigades) {
        var me = this;
        me.brigades = brigades;
        var t = Ext.Object.toQueryString({
                brigades: brigades
            }),
            urlRoute = Ext.String.format(me.urlGeodata + '/brigade?callcardid={0}&{1}', call, t);
        me.callStore = Ext.create('Ext.data.Store', {
            model: 'Isidamaps.model.Call',
            proxy: {
                type: 'ajax',
                url: urlRoute,
                reader: {
                    type: 'json',
                    rootProperty: 'call',
                    messageProperty: 'msjError'
                }
            },
            autoLoad: false
        });
        me.brigadeStore = Ext.create('Ext.data.Store', {
            model: 'Isidamaps.model.Brigade',
            proxy: {
                type: 'ajax',
                url: urlRoute,
                reader: {
                    type: 'json',
                    rootProperty: 'brigades',
                    messageProperty: 'msjError'
                }
            },
            autoLoad: false
        });
        me.callStore.load(function (records) {
            records.forEach(function (call) {
                if (call.get('latitude') !== undefined && call.get('longitude') !== undefined) {
                    me.callMarkers.push({
                        type: 'Feature',
                        id: call.get('callCardId'),
                        customOptions: {
                            objectType: call.get('objectType'),
                            status: call.get('status'),
                            callCardNum: call.get('callCardNum'),
                            station: call.get('station')
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [call.get('latitude'), call.get('longitude')]
                        },
                        options: {
                            iconImageHref: 'resources/icon/' + call.get('iconName'),
                            iconImageSize: [25, 33]
                        }
                    })
                }
            });
            me.brigadeStore.load(function (records) {
                records.forEach(function (brigade) {
                    if (brigade.get('latitude') !== undefined && brigade.get('longitude') !== undefined) {
                        me.brigadesMarkers.push({
                            type: 'Feature',
                            id: brigade.get('deviceId'),
                            customOptions: {
                                objectType: brigade.get('objectType'),
                                profile: brigade.get('profile'),
                                status: brigade.get('status'),
                                station: brigade.get('station'),
                                brigadeNum: brigade.get('brigadeNum')
                            },
                            geometry: {
                                type: 'Point',
                                coordinates: [brigade.get('latitude'), brigade.get('longitude')]
                            },
                            options: {
                                iconLayout: 'default#imageWithContent',
                                iconImageHref: 'resources/icon/' + brigade.get('iconName'),
                                iconContentLayout: me.MyIconContentLayout,
                                iconImageOffset: [-24, -24],
                                iconContentOffset: [30, -10],
                            },
                            properties: {
                                iconContent: brigade.get('brigadeNum') + "(" + brigade.get('profile') + ")"
                            }
                        })
                    } else {
                        me.errorBrigades.push(brigade.get('brigadeNum'));
                    }
                });
                me.createMarkers();
            });
        });
    },

    createTableRoute: function () {
        var me = this;
        if (me.arrRouteForTable.length === me.brigadesMarkers.length) {
            var store = me.viewModel.getStore('Routes');
            me.arrRouteForTable.forEach(function (object) {
                var x = Ext.create('Isidamaps.model.Route');
                x.set('checkBox', false);
                x.set('brigadeId', object.brigade.id);
                x.set('brigadeNum', object.brigade.customOptions.brigadeNum);
                x.set('profile', object.brigade.customOptions.profile);
                x.set('distance', (object.route.getLength() / 1000).toFixed(1));
                x.set('time', (object.route.getJamsTime() / 60).toFixed(0));
                store.add(x);
            });
        }
    }

});
