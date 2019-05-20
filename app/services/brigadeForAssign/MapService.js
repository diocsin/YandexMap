Ext.define('Isidamaps.services.brigadeForAssign.MapService', {
    extend: 'Isidamaps.services.monitoring.MapService',
    map: null,
    objectManager: null,
    callMarkers: [],
    brigadesMarkers: [],
    arrRoute: [],
    arrpoints: [],
    arrRouteForTable: [],
    MyIconContentLayout: null,

    constructor: function (options) {
        this.createMap();
    },

    callback: function () {
        if (this.arrRoute.length === this.brigadesMarkers.length) {
            ASOV.setRoutes(this.arrRoute);
        }
    },

    listenerStore: function () {
        Ext.getStore('Isidamaps.store.BrigadesFirstLoadStore').on('add', (store, records, options) => {
            this.storeBrigade(records)
        }, this);
        Ext.getStore('Isidamaps.store.CallsFirstLoadStore').on('add', (store, records, options) => {
            this.storeCall(records)
        }, this);

    },

    checkArrayFeatureComplete: function (array) {
        if (array.length !== 0) {
            this.addMarkers();
        }
    },

    storeBrigade: function (records) {
        Ext.Array.clean(this.brigadesMarkers);
        records.forEach((brigade) => {
            if (brigade.get('latitude') && brigade.get('longitude')) {
                const feature = this.createBrigadeFeature(brigade);
                this.brigadesMarkers.push(feature);
            }
        });
        if (this.callMarkers.length === 0) {
            Isidamaps.util.Util.errorMessage('Внимание', 'Нет координат вызова');
        }
        this.checkArrayFeatureComplete(this.callMarkers);
    },

    addMarkers: function () {
        this.createBouns();
        this.brigadesMarkers.forEach((brigadeMarker) => {
            this.createRoute(this.callMarkers[0], brigadeMarker);
        });
        this.objectManager.add(this.brigadesMarkers);
        this.objectManager.add(this.callMarkers);
        this.map.geoObjects.add(this.objectManager);
    },

    createAnswer: function () {
        const store = Ext.getStore('Isidamaps.store.RouteForTableStore'),
            brigadeId = store.query('checkBox', 'true').getValues('brigadeId', 'data');
        if (brigadeId.length === 1) {
            ASOV.setBrigade(brigadeId[0]);
        } else (Isidamaps.util.Util.errorMessage('Ошибка', 'Не назначена бригада на вызов'))
    },

    createRoute: function (call, brigade) {
        const {id, geometry: {coordinates}, customOptions: {brigadeNum, objectType, profile}} = brigade;
        let routeList = null;
        ymaps.route([coordinates, call.geometry.coordinates], {
            avoidTrafficJams: true,
        }).then((route) => {
            route.getWayPoints().options.set({
                iconLayout: 'default#image',
                iconImageHref: false,
                hasBalloon: true,
                zIndex: 1
            });
            route.id = id;
            route.getPaths().options.set({
                opacity: 0.9,
                balloonContentLayout: ymaps.templateLayoutFactory.createClass(`Маршрут ${brigadeNum} бригады`),
                strokeWidth: 4
            });
            this.map.geoObjects.add(route);
            routeList = {
                brigade: brigade,
                route: route
            };
            this.arrRouteForTable.push(routeList);
            for (let i = 0; i < route.getPaths().getLength(); i++) {
                let way = route.getPaths().get(i),
                    segments = way.getSegments();
                for (let j = 0; j < segments.length; j++) {
                    let point = segments[j].getCoordinates();
                    this.arrpoints.push(
                        [point[0][0], point[0][1]]
                    );
                }
                this.arrpoints.unshift(coordinates);
                this.arrpoints.push(call.geometry.coordinates);
            }
            this.arrRoute.push({
                brigadeId: id,
                objectType: objectType,
                profile: profile,
                brigadeNum: brigadeNum,
                longitude: coordinates[1],
                latitude: coordinates[0],
                distance: (route.getLength() / 1000).toFixed(1),
                time: (route.getJamsTime() / 60).toFixed(0),
                route: this.arrpoints
            }).then(this.createTableRoute(), this.callback(), this.arrpoints = []);
        })
    },

    setMarkers: function (call, brigades) {
        const readMarkers = () => {
            Isidamaps.app.getController('AppController').readMarkersBrigadeForAssign(call, brigades)
        };
        Isidamaps.app.getController('AppController').initial(readMarkers);
    }

});
