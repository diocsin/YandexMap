Ext.define('Isidamaps.services.monitoringBrigadeOnCall.MapService', {
    extend: 'Isidamaps.services.monitoring.MapService',
    map: null,
    brigadesMarkers: [],
    callMarkers: [],
    arrRouteForTable: [],
    MyIconContentLayout: null,

    createRoute: function (call, brigade) {
        const me = this;
        let routeList = null;
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
        const me = this;
        me.createMap();
    },


    addMarkers: function () {
        const me = this;
        if (me.callMarkers.length === 0) {
            me.createCallAlert();
        }
        me.createBouns();
        me.objectManager.add(me.brigadesMarkers);
        me.objectManager.add(me.callMarkers);
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

    addMarkersSocket: function (marker) {
        const me = this,
            object = me.objectManager.objects.getById(marker.id);
        if (marker.customOptions.objectType === 'BRIGADE') {
            if (object) {
                me.objectManager.objects.remove(object);
            }

            function func() {
                me.objectManager.objects.add(marker);
                me.map.geoObjects.each(function (route) {
                    if (route.requestPoints !== undefined) {
                        me.map.geoObjects.remove(route);
                        return
                    }
                });
                me.createRoute(me.callMarkers[0], marker);
            }

            setTimeout(func, 1);
            return;
        }
        if (object) {
            me.objectManager.remove(object);
        }

        function func() {
            me.objectManager.objects.add(marker);
            me.map.geoObjects.each(function (route) {
                if (route.requestPoints !== undefined) {
                    me.map.geoObjects.remove(route);
                    return
                }
            });
            me.createRoute(marker, me.brigadesMarkers[0]);
        }

        setTimeout(func, 1);
    },

    setMarkers: function (call, brigades) {
        Isidamaps.app.getController('AppController').readMarkers(call, brigades);
    },

    listenerStore: function () {
        Ext.getStore('Isidamaps.store.BrigadesFirstLoadStore').on('add', function (store, records, options) {
            this.storeBrigade(records)
        }, this);
        Ext.getStore('Isidamaps.store.CallsFirstLoadStore').on('add', function (store, records, options) {
            this.storeCall(records)
        }, this);

    },

    storeBrigade: function (records) {
        const me = this;
        Ext.Array.clean(me.brigadesMarkers);
        records.forEach(function (brigade) {
            if (brigade.get('latitude') && brigade.get('longitude')) {
                const feature = me.createBrigadeFeature(brigade);
                me.brigadesMarkers.push(feature);
            }
        });
        me.checkArrayFeatureComplete(me.callMarkers);
    },

    createBrigadeOfSocked: function (brigades) {
        const me = this,
            brigade = brigades[0];
        if (brigade.get('latitude') && brigade.get('longitude') && brigade.get('status')) {
            let marker = me.createBrigadeFeature(brigade);
            me.addMarkersSocket(marker);
            Ext.getStore('Isidamaps.store.BrigadeFromWebSockedStore').clearData();
        }
    },

    checkArrayFeatureComplete: function (array) {
        const me = this;
        if (array.length !== 0) {
            me.addMarkers();
            me.listenerWebSockedStore();
        }
    }
});
