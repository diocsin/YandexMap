Ext.define('Isidamaps.services.monitoringBrigadeOnCallView.MapService', {
    extend: 'Isidamaps.services.callHistoryView.MapService',
    map: null,
    callsModel: null,
    viewModel: null,
    brigadeId: null,
    callId: null,
    brigadesMarkers: [],
    callMarkers: [],
    station: [],
    urlGeodata: null,
    arrayRoute: [],
    arrRouteForTable: [],
    commonArrayMarkers: [],
    MyIconContentLayout: null,
    // ====
    markerClick: Ext.emptyFn,
    getStoreMarkerInfo: Ext.emptyFn,
    // ====

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
            me.createTableRoute();

        })
    },


    constructor: function (options) {
        var me = this;
        me.markerClick = options.markerClick;
        me.viewModel = options.viewModel;
        me.boundsMap = options.boundsMap;
        me.getStoreMarkerInfo = options.getStoreMarkerInfo;
        me.urlGeodata = options.urlGeodata;
        me.map = new ymaps.Map('mapId', {
            bounds: me.boundsMap,
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
        me.MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div style="color: #000000;  border: 1px solid; display: inline-block; background-color: #faf8ff; text-align: center; border-radius: 6px; z-index: 2;font-size: 12pt">$[properties.iconContent]</div>'
        );
    },

    optionsObjectManager: function () {
        var me = this;
        me.objectManager.objects.events.add(['click'], function (e) {
            var object = me.objectManager.objects.getById(e.get('objectId')),
                storeMarker = me.getStoreMarkerInfo(object);
            me.markerClick(object, [e._sourceEvent.originalEvent.clientPixels[0], e._sourceEvent.originalEvent.clientPixels[1]], storeMarker);
        });
    },

    addMarkers: function () {
        var me = this;
        if (me.callMarkers.length === 0) {
            me.createCallAlert();
        }
        me.createBouns();  //в callHistory
        me.brigadesMarkers.forEach(function (brigade) {
            me.objectManager.add(brigade);
        });
        me.callMarkers.forEach(function (call) {
            me.objectManager.add(call);
        });
        me.map.geoObjects.add(me.objectManager);
        if (me.callMarkers.length > 0 && me.brigadesMarkers.length > 0) {
            me.brigadesMarkers.forEach(function (brigadeMarker) {
                me.createRoute(me.callMarkers[0], brigadeMarker);
            });
        }
        me.listenerStore();
    },

    createCallAlert: function () {
        Ext.create('Ext.window.MessageBox').show({
            title: 'Ошибка',
            message: 'Нет координат вызова',
            icon: Ext.Msg.ERROR,
            buttons: Ext.Msg.OK
        })
    },

    listenerStore: function () {
        var me = this;
        me.viewModel.getStore('Brigades').on('add', function (store, records, index) {
            this.createBrigadeOfSocked(records)
        }, this);
        me.viewModel.getStore('Calls').on('add', function (store, records, index) {
            this.createCallOfSocked(records)
        }, this);
    },

    createCallOfSocked: function (calls) {
        var me = this,
            call = calls[0];
        if (call.get('latitude') !== undefined && call.get('longitude') !== undefined) {
            var marker = {
                type: 'Feature',
                id: call.get('callCardId'),
                customOptions: {
                    objectType: call.get('objectType'),
                    status: call.get('status'),
                    callCardNum: call.get('callCardNum'),
                    station: '' + call.get('station')
                },
                geometry: {
                    type: 'Point',
                    coordinates: [call.get('latitude'), call.get('longitude')]
                },
                options: {
                    iconImageHref: 'resources/icon/' + call.get('iconName'),
                    iconImageSize: [25, 31]
                }
            };
            var callHas = Ext.Array.findBy(me.callMarkers, function (callInArray, index) {
                if (callInArray.id === call.get('callCardId')) {
                    return callInArray;
                }
            });
            Ext.Array.remove(me.callMarkers, callHas);
            Ext.Array.push(me.callMarkers, marker);
            me.addMarkersSocket(marker);
            me.viewModel.getStore('Calls').clearData();
        }


    },

    createBrigadeOfSocked: function (brigades) {
        var me = this,
            brigade = brigades[0];

        if (brigade.get('latitude') !== undefined && brigade.get('longitude') !== undefined) {
            var marker = {
                type: 'Feature',
                id: brigade.get('deviceId'),
                customOptions: {
                    objectType: brigade.get('objectType'),
                    profile: brigade.get('profile'),
                    status: brigade.get('status'),
                    station: '' + brigade.get('station'),
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
            };
            var brigadeHas = Ext.Array.findBy(me.brigadesMarkers, function (brigadeInArray, index) {
                if (brigadeInArray.id === brigade.get('deviceId')) {
                    return brigadeInArray;
                }
            });
            Ext.Array.remove(me.brigadesMarkers, brigadeHas);
            Ext.Array.push(me.brigadesMarkers, marker);
            me.addMarkersSocket(marker);
            me.viewModel.getStore('Brigades').clearData();
        }

    },

    addMarkersSocket: function (marker) {
        var me = this;
        if (marker.customOptions.objectType === 'BRIGADE') {
            var t = me.objectManager.objects.getById(marker.id);
            if (t !== null) {
                me.objectManager.objects.remove(t);
            }

            function func() {
                me.objectManager.objects.add(marker);
                me.map.geoObjects.each(function (marker) {
                    if (marker.requestPoints !== undefined) {
                        me.map.geoObjects.remove(marker);
                        return
                    }
                });
                me.createRoute(me.callMarkers[0], marker);
            }

            setTimeout(func, 30);

        }
        if (marker.customOptions.objectType === 'CALL') {
            var o = me.objectManager.objects.getById(marker.id);
            if (o !== null) {
                me.objectManager.remove(o);
            }

            function func() {
                me.objectManager.objects.add(marker);
                me.map.geoObjects.each(function (marker) {
                    if (marker.requestPoints !== undefined) {
                        me.map.geoObjects.remove(marker);
                        return
                    }
                });
                me.createRoute(marker, me.brigadesMarkers[0]);
            }

            setTimeout(func, 30);

        }
    },

    setMarkers: function (call, brigades) {
        this.MonitoringBrigade.readMarkers(call, brigades);
    },

    readMarkers: function (call, brigades) {
        var me = this;
        Ext.Array.clean(me.brigadesMarkers);
        Ext.Array.clean(me.callMarkers);
        me.callId = call;
        me.brigadeId = brigades[0];
        me.brigades = brigades;
        var brigadesToString = Ext.Object.toQueryString({
                brigades: brigades
            }),
            urlRoute = Ext.String.format(me.urlGeodata + '/brigade?callcardid={0}&{1}', call, brigadesToString);
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
                            iconImageSize: [25, 31]
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
                me.addMarkers();
            });
        });
    },

    resizeMap: function () {
        this.map.container.fitToViewport();

    },
    createTableRoute: function () {
        var me = this,
            store = me.viewModel.getStore('Route');
        me.arrRouteForTable.forEach(function (object) {
            var x = Ext.create('Isidamaps.model.Route');
            x.set('brigadeId', object.brigade.id);
            x.set('brigadeNum', object.brigade.customOptions.brigadeNum);
            x.set('profile', object.brigade.customOptions.profile);
            x.set('distance', (object.route.getLength() / 1000).toFixed(1));
            x.set('time', (object.route.getJamsTime() / 60).toFixed(0));
            store.add(x);
        });
    }
});
