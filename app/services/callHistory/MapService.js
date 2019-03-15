Ext.define('Isidamaps.services.callHistory.MapService', {
    extend: 'Isidamaps.services.monitoring.MapService',
    map: null,
    objectManager: null,
    callMarker: null,
    callMarkers: [],
    brigadeRoute: null,
    brigadesMarkers: [],
    factRoute: null,
    brigadesStartPoint: null,
    brigadesEndPoint: null,
    arrRouteForTable: [],
    callMarkersFactRoute: [],
    MyIconContentLayout: null,


    constructor: function (options) {
        const me = this;
        me.createMap();
        me.map.geoObjects.add(me.objectManager);
    },

    listenerStore: function () {
        Ext.getStore('Isidamaps.store.CallsFirstLoadStore').on('add', function (store, records, options) {
            this.storeFactHistoryCall(records)
        }, this);
        Ext.getStore('Isidamaps.store.BrigadesFirstLoadStore').on('add', function (store, records, options) {
            this.storeFactHistoryBrigade(records)
        }, this);
        Ext.getStore('Isidamaps.store.RouteHistoryStore').on('add', function (store, records, options) {
            this.storeRouteHistory(records)
        }, this);
        Ext.getStore('Isidamaps.store.FactRouteHistoryStore').on('add', function (store, records, options) {
            this.storeFactRouteHistory(records)
        }, this);
    },

    storeFactHistoryCall: function (rec) {
        const me = this;
        rec.forEach(function (call) {
            if (call.get('latitude') && call.get('longitude')) {
                const feature = me.createCallFeature(call);
                me.callMarkers.push(feature);
                me.callMarkers.length === 1 ? me.objectManager.add(feature) : me.createBouns();
            }
        });
    },

    storeFactHistoryBrigade: function (rec) {
        const me = this;
        let i = 1;
        rec.forEach(function (brigade) {
            if (brigade.get('latitude') && brigade.get('longitude')) {
                brigade.data.deviceId = i++;  //т.к. метки с одинаковыми id не могут быть помещены в objectManager
                const feature = me.createBrigadeFeature(brigade);
                me.brigadesMarkers.push(feature);
                me.objectManager.add(feature);
            }
        });
    },

    storeRouteHistory: function (records) {
        const me = this;
        let routeList = null;
        records.forEach(function (b) {
            b.get('routeList') === '' ? routeList = Ext.decode(b.get('brigadeList')).brigades : routeList = Ext.decode(b.get('routeList'));
            me.createPolylineRoute(routeList);
            routeList.forEach(function (brigade) {
                if (brigade.latitude && brigade.longitude) {
                    const feature = {
                        type: 'Feature',
                        id: brigade.brigadeId ? brigade.brigadeId : brigade.deviceId,
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
                            iconImageHref: 'resources/icon/free.png',
                            iconContentLayout: me.MyIconContentLayout,
                            iconImageOffset: [-24, -24],
                            iconContentOffset: [30, -10],
                        },
                        properties: {
                            iconContent: brigade.brigadeNum + "(" + brigade.profile + ")"
                        }
                    };
                    me.brigadesMarkers.push(feature);
                    me.objectManager.add(feature);
                }
            })
        });
    },

    createPolylineRoute: function (routeList) {
        const me = this;
        me.arrRouteForTable = routeList;
        routeList.forEach(function (routes) {
            let polyline = new ymaps.Polyline(routes.route, {}, {
                draggable: false,
                strokeColor: '#000000',
                strokeWidth: 3
            });
            me.map.geoObjects.add(polyline);
        });
        me.createTableRoute();
    },

    storeFactRouteHistory: function (records) {
        const me = this,
            arrayLine = [];
        records.forEach(function (b) {
            arrayLine.push([b.get('latitude'), b.get('longitude')]);
        });
        let polyline = new ymaps.Polyline(arrayLine, {}, {
            draggable: false,
            strokeColor: '#FF0000',
            strokeWidth: 4,
            strokeStyle: '3 2'
        });
        me.map.geoObjects.add(polyline);
    },

    setMarkers: function (call) {
        Isidamaps.app.getController('AppController').initial(f);

        function f() {
            Isidamaps.app.getController('AppController').readMarkersForCallHistory(call);
        }

    },

    createTableRoute: function () {
        const me = this,
            store = Ext.getStore('Isidamaps.store.RouteForTableStore');
        me.arrRouteForTable.forEach(function (object) {
            const x = Ext.create('Isidamaps.model.Route');
            object.brigadeId ? x.set('brigadeId', object.brigadeId) : x.set('brigadeId', object.deviceId);
            x.set('brigadeNum', object.brigadeNum);
            x.set('profile', object.profile);
            x.set('distance', object.distance);
            x.set('time', object.time);
            store.add(x);
        });
    }
});