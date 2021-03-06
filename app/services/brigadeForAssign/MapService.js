Ext.define('Isidamaps.services.brigadeForAssign.MapService', {
    extend: 'Isidamaps.services.monitoring.MapService',
    map: null,
    objectManager: null,
    callMarkers: [],
    brigadesMarkers: [],
    arrRoute: [],
    arrpoints: [],
    arrRouteForTable: [],

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
            this.getBrigadesFromStore(records)
        }, this);
        Ext.getStore('Isidamaps.store.CallsFirstLoadStore').on('add', (store, records, options) => {
            this.getCallsFromStore(records)
        }, this);
    },

    checkArrayIsEmpty: function (array) {
        if (array.length !== 0) {
            this.addMarkersInObjManager();
        }
    },

    getBrigadesFromStore: function (records) {
        this.brigadesMarkers = [];
        records.forEach(brigade => {
            if (brigade.isBrigadeHasCoordinates()) {
                this.brigadesMarkers.push(brigade.getObjectForMap());
            }
        });
        if (this.callMarkers.length === 0) {
            Isidamaps.util.Util.errorMessage('Внимание', 'Нет координат вызова');
        }
        this.checkArrayIsEmpty(this.callMarkers);
    },

    addMarkersInObjManager: function () {
        this.createMapBounds();
        this.brigadesMarkers.forEach(brigadeMarker => {
            this.createRoute(this.callMarkers[0], brigadeMarker);
        });
        this.objectManager.add(this.brigadesMarkers);
        this.objectManager.add(this.callMarkers);
        this.map.geoObjects.add(this.objectManager);
    },

    sendAnswerInASOV: function () {
        const store = Ext.getStore('Isidamaps.store.RouteForTableStore'),
            brigadeId = store.query('checkBox', 'true').getValues('brigadeId', 'data');

        if (brigadeId.length === 1) {
            ASOV.setBrigade(brigadeId[0]);
        }
        else (Isidamaps.util.Util.errorMessage('Ошибка', 'Не назначена бригада на вызов'))
    },

    createRoute: function (call, brigade) {
        const {id, geometry: {coordinates}, customOptions: {brigadeNum, objectType, profile}} = brigade;

        ymaps.route([coordinates, call.geometry.coordinates], {
            avoidTrafficJams: true,
        }).then(route => {
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
            let routeList = {
                brigade: brigade,
                route: route
            };
            this.arrRouteForTable.push(routeList);
            for (let i = 0; i < route.getPaths().getLength(); i++) {
                let way = route.getPaths().get(i),
                    segments = way.getSegments();
                for (const object of segments) {
                    let point = object.getCoordinates();
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
