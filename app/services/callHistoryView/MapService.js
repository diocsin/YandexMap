Ext.define('Isidamaps.services.callHistoryView.MapService', {
    extend: 'Isidamaps.services.monitoringView.MapService',
    map: null,
    objectManager: null,
    callMarker: null,
    callMarkers: [],
    brigadeRoute: null,
    brigadesMarkers: [],
    viewModel: null,
    factRoute: null,
    brigadesStartPoint: null,
    brigadesEndPoint: null,
    urlGeodata: null,
    arrRouteForTable: [],
    callMarkersFactRoute: [],
    MyIconContentLayout: null,
    // ====
    markerClick: Ext.emptyFn,
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

    createBouns: function () {
        var me = this,
            arrayLatitude = [],
            arrayLongitude = [],
            call = me.callMarkers[0];
        arrayLatitude.push(call.geometry.coordinates[0]);
        arrayLongitude.push(call.geometry.coordinates[1]);

        me.brigadesMarkers.forEach(function (brigade) {
            arrayLatitude.push(brigade.geometry.coordinates[0]);
            arrayLongitude.push(brigade.geometry.coordinates[1]);
        });
        arrayLatitude.sort(function (a, b) {
            return a - b
        });
        arrayLongitude.sort(function (a, b) {
            return a - b
        });
        var bounds = [
            [arrayLatitude[arrayLatitude.length - 1] + 0.015, arrayLongitude[0] - 0.015],
            [arrayLatitude[0] - 0.015, arrayLongitude[arrayLatitude.length - 1] + 0.015]
        ];
        me.map.setBounds(bounds);
    },

    createMarkers: function () {
        var me = this;
        if (me.brigadesMarkers.length > 1 && me.callMarkers.length > 1) {
            me.createBouns();
        }
        if (me.callMarkers.length === 0) {
            Ext.create('Ext.window.MessageBox').show({
                title: 'Ошибка',
                message: 'Нет сохраненных маршрутов',
                icon: Ext.Msg.ERROR,
                buttons: Ext.Msg.OK
            });
            me.callMarkerFactRoute.load(function (records) {
                records.forEach(function (call) {
                    if (call.get('latitude') !== undefined && call.get('longitude') !== undefined) {
                        me.callMarkersFactRoute.push({
                            type: 'Feature',
                            id: call.get('callCardId'),
                            customOptions: {
                                objectType: call.get('objectType'),
                                status: call.get('status'),
                                callCardNum: call.get('callCardNum')
                            },
                            geometry: {
                                type: 'Point',
                                coordinates: [call.get('latitude'), call.get('longitude')]
                            },
                            options: {
                                iconImageHref: 'resources/icon/' + call.get('iconName')
                            }
                        })
                    }
                });
                me.objectManager.add(me.callMarkersFactRoute);
            });
        }
        me.objectManager.add(me.brigadesMarkers).add(me.callMarkers);
        me.map.geoObjects.add(me.objectManager);
    },

    createPolylineRoute: function () {
        var me = this;
        me.brigadeRoute.load(function (records) {
            records.forEach(function (b) {
                var routeList = Ext.decode(b.get('routeList'));
                me.arrRouteForTable = routeList;
                routeList.forEach(function (routes) {
                    var polyline = new ymaps.Polyline(routes.route, {}, {
                        draggable: false,
                        strokeColor: '#000000',
                        strokeWidth: 3
                    });
                    me.map.geoObjects.add(polyline);
                })
            });
            me.createTableRoute();
        })
    },

    createPolylineFactRoute: function () {
        var me = this,
            arrayLine = [];
        me.factRoute.load(function (records) {
            records.forEach(function (b) {
                arrayLine.push([b.get('latitude'), b.get('longitude')]);
            });
            var polyline = new ymaps.Polyline(arrayLine, {}, {
                draggable: false,
                strokeColor: '#FF0000',
                strokeWidth: 4,
                strokeStyle: '3 2'
            });
            me.map.geoObjects.add(polyline);
        });
    },

    createRouteForCalls: function () {
        var me = this;
        me.brigadesEndPoint.load(function (records) {
            records.forEach(function (brigade) {
                if (brigade.get('latitude') !== undefined && brigade.get('longitude') !== undefined) {
                    me.brigadesMarkers.push({
                        type: 'Feature',
                        id: brigade.get('deviceId') + 2,
                        customOptions: {
                            objectType: brigade.get('objectType'),
                            brigadeNum: brigade.get('brigadeNum'),
                            profile: brigade.get('profile')
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
                }
            });
            me.brigadesStartPoint.load(function (records) {
                records.forEach(function (brigade) {
                    if (brigade.get('latitude') !== undefined && brigade.get('longitude') !== undefined) {
                        me.brigadesMarkers.push({
                            type: 'Feature',
                            id: brigade.get('deviceId') + 1,
                            customOptions: {
                                objectType: brigade.get('objectType'),
                                brigadeNum: brigade.get('brigadeNum'),
                                profile: brigade.get('profile')
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
                    }
                });
                me.brigadeRoute.load(function (records) {
                    records.forEach(function (b) {
                        var routeList = Ext.decode(b.get('routeList'));
                        routeList.forEach(function (brigade) {
                            if (brigade.latitude!== undefined && brigade.longitude!== undefined) {
                                me.brigadesMarkers.push({
                                    type: 'Feature',
                                    id: brigade.brigadeId,
                                    customOptions: {
                                        objectType: brigade.objectType,
                                        brigadeNum: brigade.brigadeNum,
                                        profile: brigade.profile
                                    },
                                    geometry: {
                                        type: 'Point',
                                        coordinates: [brigade.latitude, brigade.longitude]
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
                            }
                        })
                    });
                    me.createMarkers();
                });
            });
        });
    },

    setMarkers: function (call) {
        this.CallHistory.readMarkers(call);
    },

    readMarkers: function (call) {
        var me = this,
            urlRouteList = Ext.String.format(me.urlGeodata + '/route?callcardid={0}', call),
            urlFactRouteList = Ext.String.format(me.urlGeodata + '/route/fact?callcardid={0}', call);
        me.brigadeRoute = Ext.create('Ext.data.Store', {
            model: 'Isidamaps.model.RouteHistory',
            proxy: {
                type: 'ajax',
                url: urlRouteList,
                reader: {
                    type: 'json',
                    rootProperty: 'brigadeRoute'
                }
            },
            autoLoad: false
        });
        me.callMarker = Ext.create('Ext.data.Store', {
            model: 'Isidamaps.model.Call',
            proxy: {
                type: 'ajax',
                url: urlRouteList,
                reader: {
                    type: 'json',
                    rootProperty: 'call'
                }
            },
            autoLoad: false
        });
        me.factRoute = Ext.create('Ext.data.Store', {
            model: 'Isidamaps.model.FactRoute',
            proxy: {
                type: 'ajax',
                url: urlFactRouteList,
                reader: {
                    type: 'json',
                    rootProperty: 'points'
                }
            },
            autoLoad: false
        });
        me.brigadesStartPoint = Ext.create('Ext.data.Store', {
            model: 'Isidamaps.model.Brigade',
            proxy: {
                type: 'ajax',
                url: urlFactRouteList,
                reader: {
                    type: 'json',
                    rootProperty: 'startPoint'
                }
            },
            autoLoad: false
        });

        me.brigadesEndPoint = Ext.create('Ext.data.Store', {
            model: 'Isidamaps.model.Brigade',
            proxy: {
                type: 'ajax',
                url: urlFactRouteList,
                reader: {
                    type: 'json',
                    rootProperty: 'endPoint'
                }
            },
            autoLoad: false
        });
        me.callMarkerFactRoute = Ext.create('Ext.data.Store', {
            model: 'Isidamaps.model.Call',
            proxy: {
                type: 'ajax',
                url: urlFactRouteList,
                reader: {
                    type: 'json',
                    rootProperty: 'call'
                }
            },
            autoLoad: false
        });

        me.callMarker.load(function (records) {
            records.forEach(function (call) {
                if (call.get('latitude') !== undefined && call.get('longitude') !== undefined) {
                    me.callMarkers.push({
                        type: 'Feature',
                        id: call.get('callCardId'),
                        customOptions: {
                            objectType: call.get('objectType'),
                            status: call.get('status'),
                            callCardNum: call.get('callCardNum')
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [call.get('latitude'), call.get('longitude')]
                        },
                        options: {
                            iconImageHref: 'resources/icon/' + call.get('iconName')
                        }
                    })
                }
            });
            me.createPolylineRoute();
            me.createPolylineFactRoute();
            me.createRouteForCalls();
        });
    },

    createTableRoute: function () {
        var me = this,
            store = me.viewModel.getStore('Route');
        me.arrRouteForTable.forEach(function (object) {
            var x = Ext.create('Isidamaps.model.Route');
            x.set('brigadeId', object.brigadeId);
            x.set('brigadeNum', object.brigadeNum);
            x.set('profile', object.profile);
            x.set('distance', object.distance);
            x.set('time', object.time);
            store.add(x);
        });
    }
});