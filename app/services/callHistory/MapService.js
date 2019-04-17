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
    placemarkForRouteHistory: null,


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
            b.get('routeList') === '' ? routeList = Ext.decode(b.get('brigadeList')).brigades : routeList = Ext.decode(b.get('routeList'));
            this.createPolylineRoute(routeList);
            routeList.forEach((brigade) => {
                const {latitude, longitude, objectType, brigadeNum, profile, brigadeId, deviceId} = brigade;
                if (latitude && longitude) {
                    const feature = {
                        type: 'Feature',
                        id: brigadeId ? brigadeId : deviceId,
                        customOptions: {
                            objectType: objectType,
                            brigadeNum: brigadeNum,
                            profile: profile
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [latitude, longitude]
                        },
                        options: {
                            iconLayout: 'default#imageWithContent',
                            iconImageHref: 'resources/icon/free.png',
                            iconContentLayout: this.MyIconContentLayout,
                            iconImageOffset: [-24, -24],
                            iconContentOffset: [30, -10],
                        },
                        properties: {
                            iconContent: `${brigadeNum}(${profile})`
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
        this.createHistoryTable(records);
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
            const {brigadeId, brigadeNum, profile, distance, time, deviceId} = object;
            const x = Ext.create('Isidamaps.model.Route');
            brigadeId ? x.set('brigadeId', brigadeId) : x.set('brigadeId', deviceId);
            x.set('brigadeNum', brigadeNum);
            x.set('profile', profile);
            x.set('distance', distance);
            x.set('time', time);
            store.add(x);
        });
    },

    createHistoryTable: async function (records) {
        const grid = Ext.getCmp('MyGrid'),
            arr = [],
            store = Ext.getStore('Isidamaps.store.RouteHistoryTableStore');
        grid.on({
            cellclick: (me, td, cellIndex, record, tr, rowIndex, e, eOpts) => {
                this.cellClick(record);
            }
        });
        let i = 0,
            h = 0,
            g = 0,
            place = '',
            place2 = '';
        for (const object of records) {
            if (i <= records.length - 3) {
                let y = i;
                if (this.angleOfRotation(records[y], records[y + 1], records[y + 2]) <= 150) {
                    h = i + 1;
                }
                if (h === i) {
                    const address = await this.getAddress([object.get('latitude'), object.get('longitude')]);
                    g++;
                    place2 = `${place} - ${address}`;
                    place = address;
                }
            }
            let row = {
                place: `#${g} ${place2}`,
                point: `${object.get('latitude')} ${object.get('longitude')}`,
                time: object.get('lastUpdateTime'),
                speed: '60'
            };
            arr.push(row);
            i++;
        }
        arr.forEach((row) => {
            const x = Ext.create('Isidamaps.model.RouteHistoryTable');
            x.set('place', row.place);
            x.set('point', row.point);
            x.set('time', row.time);
            x.set('speed', row.speed);
            store.add(x);
        });
        grid.el.unmask();
    },


    angleOfRotation: function (A, B, C) {
        const AB = Math.sqrt(Math.pow(parseFloat(B.get('longitude')) - parseFloat(A.get('longitude')), 2) + Math.pow(parseFloat(B.get('latitude')) - parseFloat(A.get('latitude')), 2)),
            BC = Math.sqrt(Math.pow(parseFloat(B.get('longitude')) - parseFloat(C.get('longitude')), 2) + Math.pow(parseFloat(B.get('latitude')) - parseFloat(C.get('latitude')), 2)),
            AC = Math.sqrt(Math.pow(parseFloat(C.get('longitude')) - parseFloat(A.get('longitude')), 2) + Math.pow(parseFloat(C.get('latitude')) - parseFloat(A.get('latitude')), 2));
        return (AC < 0.00003) ? 180 : Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB)) * (180 / Math.PI);
    },

    getAddress: function (coords) {
        return ymaps.geocode(coords).then((res) => {
            const firstGeoObject = res.geoObjects.get(0);
            return `${(firstGeoObject.getThoroughfare()) ? firstGeoObject.getThoroughfare() : ''} ${(firstGeoObject.getPremiseNumber()) ? firstGeoObject.getPremiseNumber() : ''}`;
        });
    },

    cellClick: function (rec) {
        if (!this.placemarkForRouteHistory) {
            this.placemarkForRouteHistory = new ymaps.Placemark(Ext.String.splitWords(rec.get('point')));
            this.map.geoObjects.add(this.placemarkForRouteHistory);
        }
        else {
            const index = this.map.geoObjects.indexOf(this.placemarkForRouteHistory);
            let object = this.map.geoObjects.get(index);
            object.geometry.setCoordinates(Ext.String.splitWords(rec.get('point')));
        }
    }
});