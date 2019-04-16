Ext.define('Isidamaps.services.monitoringBrigadeOnCall.MapService', {
    extend: 'Isidamaps.services.monitoring.MapService',
    map: null,
    brigadesMarkers: [],
    callMarkers: [],
    arrRouteForTable: [],
    MyIconContentLayout: null,
    circle: null,
    brigadeInsideCircle: false,

    createRoute: function (call, brigade) {
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
            this.map.geoObjects.add(route);
            routeList = {
                brigade: brigade,
                route: route
            };
            this.arrRouteForTable.push(routeList);
            this.createTableRoute();

        })
    },

    constructor: function (options) {
        this.createMap();
    },


    addMarkers: function () {
        if (this.callMarkers.length === 0) {
            this.createCallAlert();
        }
        this.circle = new ymaps.Circle([this.callMarkers[0].geometry.coordinates, 100], null, {draggable: false * /, visible: false*/});
        this.createBouns();
        this.objectManager.add(this.brigadesMarkers);
        this.objectManager.add(this.callMarkers);
        this.map.geoObjects.add(this.objectManager);
        this.map.geoObjects.add(this.circle);
        this.getGeoQueryObject(this.brigadesMarkers[0]);  ////Будет отправлять ответ(смену статуса) каждый раз когда будет открываться окно когда бригада уже в круге
        if (this.callMarkers.length > 0 && this.brigadesMarkers.length > 0) {
            this.brigadesMarkers.forEach(brigadeMarker => {
                this.createRoute(this.callMarkers[0], brigadeMarker);
            });
        }
        this.listenerStore();
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
        const object = this.objectManager.objects.getById(marker.id),
            addFeatureCall = () => {
                this.getGeoQueryObject(marker);
                this.objectManager.objects.add(marker);
                this.map.geoObjects.each(route => {
                    if (route.requestPoints !== undefined) {
                        this.map.geoObjects.remove(route);
                        return
                    }
                });
                this.createRoute(this.callMarkers[0], marker);
            },
            addFeatureBrigade = () => {
                this.objectManager.objects.add(marker);
                this.map.geoObjects.each(route => {
                    if (route.requestPoints !== undefined) {
                        this.map.geoObjects.remove(route);
                        return
                    }
                });
                this.createRoute(marker, this.brigadesMarkers[0]);
            };
        if (object) {
            this.objectManager.objects.remove(object);
        }
        if (marker.customOptions.objectType === 'BRIGADE') {
            Ext.defer(addFeatureCall, 1, this);
            return;
        }
        Ext.defer(addFeatureBrigade, 1, this);
    },

    setMarkers: function (call, brigades) {
        const readMarkers = () => {
            Isidamaps.app.getController('AppController').readMarkers(call, brigades)
        };
        Isidamaps.app.getController('AppController').initial(readMarkers);
    },

    listenerStore: function () {
        Ext.getStore('Isidamaps.store.BrigadesFirstLoadStore').on('add', (store, records, options) => {
            this.storeBrigade(records)
        }, this);
        Ext.getStore('Isidamaps.store.CallsFirstLoadStore').on('add', (store, records, options) => {
            this.storeCall(records)
        }, this);

    },

    storeBrigade: function (records) {
        Ext.Array.clean(this.brigadesMarkers);
        records.forEach(brigade => {
            if (brigade.get('latitude') && brigade.get('longitude')) {
                this.brigadesMarkers.push(this.createBrigadeFeature(brigade));
            }
        });
        this.checkArrayFeatureComplete(this.callMarkers);
    },

    getGeoQueryObject: function (brigade) {
        this.getObjectsInsideCircle(ymaps.geoQuery({
            type: 'Feature',
            id: brigade.id,
            geometry: {
                type: 'Point',
                coordinates: brigade.geometry.coordinates
            }
        }));
    },

    getObjectsInsideCircle: function (geoQueryObject) {
        const result = ymaps.geoQuery(geoQueryObject).searchIntersect(this.circle);
        if (result.getLength() === 1 && this.brigadeInsideCircle === false) {
            this.brigadeInsideCircle = true;
            console.dir(result.getLength());
        }
        if (ymaps.geoQuery(geoQueryObject).searchInside(this.map).getLength() === 0) {
            this.map.setCenter([geoQueryObject.getBounds()[0][0], geoQueryObject.getBounds()[0][1]]);
        }
    },

    createBrigadeOfSocked: function (brigades) {
        const brigade = brigades[0];
        if (brigade.get('latitude') && brigade.get('longitude') && brigade.get('status')) {
            let marker = this.createBrigadeFeature(brigade);
            this.addMarkersSocket(marker);
            Ext.getStore('Isidamaps.store.BrigadeFromWebSockedStore').clearData();
        }
    },

    checkArrayFeatureComplete: function (array) {
        if (array.length !== 0) {
            this.addMarkers();
            this.listenerWebSockedStore();
        }
    }
});
