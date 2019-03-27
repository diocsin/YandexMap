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
        this.createMap();
        this.map.geoObjects.add(this.objectManager);
    },

    listenerStore: function () {
        Ext.getStore('Isidamaps.store.CallsFirstLoadStore').on('add', (store, records, options) => {
            this.storeFactHistoryCall(records)
        }, this);
        Ext.getStore('Isidamaps.store.BrigadesFirstLoadStore').on('add', (store, records, options) => {
            this.storeFactHistoryBrigade(records)
        }, this);
        Ext.getStore('Isidamaps.store.RouteHistoryStore').on('add', (store, records, options) => {
            this.storeRouteHistory(records)
        }, this);
        Ext.getStore('Isidamaps.store.FactRouteHistoryStore').on('add', (store, records, options) => {
            this.storeFactRouteHistory(records)
        }, this);
    },

    storeFactHistoryCall: function (rec) {
        rec.forEach((call) => {
            if (call.get('latitude') && call.get('longitude')) {
                const feature = this.createCallFeature(call);
                this.callMarkers.push(feature);
                this.callMarkers.length === 1 ? this.objectManager.add(feature) : this.createBouns();
            }
        });
    },

    storeFactHistoryBrigade: function (rec) {
        let i = 1;
        rec.forEach((brigade) => {
            if (brigade.get('latitude') && brigade.get('longitude')) {
                brigade.data.deviceId = i++;  //т.к. метки с одинаковыми id не могут быть помещены в objectManager
                const feature = this.createBrigadeFeature(brigade);
                this.brigadesMarkers.push(feature);
                this.objectManager.add(feature);
            }
        });
    },

    storeRouteHistory: function (records) {
        let routeList = null;
        records.forEach((b) => {
            routeList = Ext.decode(b.get('routeList'));
            this.createPolylineRoute(routeList);
            routeList.forEach((brigade) => {
                if (brigade.latitude && brigade.longitude) {
                    const feature = {
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
                            iconImageHref: `resources/icon/${brigade.iconName}`,
                            iconContentLayout: this.MyIconContentLayout,
                            iconImageOffset: [-24, -24],
                            iconContentOffset: [30, -10],
                        },
                        properties: {
                            iconContent: `${brigade.brigadeNum}(${brigade.profile})`
                        }
                    };
                    this.brigadesMarkers.push(feature);
                    this.objectManager.add(feature);
                }
            })
        });
    },

    createPolylineRoute: function (routeList) {
        this.arrRouteForTable = routeList;
        routeList.forEach((routes) => {
            let polyline = new ymaps.Polyline(routes.route, {}, {
                draggable: false,
                strokeColor: '#000000',
                strokeWidth: 3
            });
            this.map.geoObjects.add(polyline);
        });
        this.createTableRoute();
    },

    storeFactRouteHistory: function (records) {
        const arrayLine = [];
        records.forEach((b) => {
            arrayLine.push([b.get('latitude'), b.get('longitude')]);
        });
        let polyline = new ymaps.Polyline(arrayLine, {}, {
            draggable: false,
            strokeColor: '#FF0000',
            strokeWidth: 4,
            strokeStyle: '3 2'
        });
        this.map.geoObjects.add(polyline);
    },

    setMarkers: function (call) {
        const readMarkers = () => {
            Isidamaps.app.getController('AppController').readMarkersForCallHistory(call)
        };
        Isidamaps.app.getController('AppController').initial(readMarkers);
    },

    createTableRoute: function () {
        const store = Ext.getStore('Isidamaps.store.RouteForTableStore');
        this.arrRouteForTable.forEach((object) => {
            const x = Ext.create('Isidamaps.model.Route');
            x.set('brigadeId', object.brigadeId);
            x.set('brigadeNum', object.brigadeNum);
            x.set('profile', object.profile);
            x.set('distance', object.distance);
            x.set('time', object.time);
            store.add(x);
        });
    }
});