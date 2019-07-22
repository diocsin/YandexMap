Ext.define('Isidamaps.services.monitoringBrigadeOnCall.MapService', {
    extend: 'Isidamaps.services.monitoring.MapService',
    map: null,
    brigadesMarkers: [],
    callMarkers: [],
    hospitalMarkers: [],
    arrRouteForTable: [],
    circle: null,
    brigadeInsideCircle: false,

    createRoute: function (call, brigade) {
        this.arrRouteForTable = [];
        ymaps.route([brigade.geometry.coordinates, call.geometry.coordinates], {
            avoidTrafficJams: true
        }).then(route => {
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
            let routeList = {
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

    addMarkersInObjManager: function () {
        if (this.callMarkers.length === 0) {
            Isidamaps.util.Util.errorMessage('Внимание', 'Нет координат вызова');
        }
        // this.circle = new ymaps.Circle([this.callMarkers[0].geometry.coordinates, 100], null, {draggable: false * /, visible: false*/});
        this.createMapBounds();
        this.objectManager.add(this.brigadesMarkers);
        this.objectManager.add(this.callMarkers);
        this.objectManager.add(this.hospitalMarkers);
        this.map.geoObjects.add(this.objectManager);
        //this.map.geoObjects.add(this.circle);
        // this.getGeoQueryObject(this.brigadesMarkers[0]);  ////Будет отправлять ответ(смену статуса) каждый раз когда будет открываться окно когда бригада уже в круге

        if (this.callMarkers.length > 0 && this.brigadesMarkers.length > 0 && this.hospitalMarkers.length == 0) {
            this.brigadesMarkers.forEach(brigadeMarker => {
                this.createRoute(this.callMarkers[0], brigadeMarker);
            });
        }
        if (this.brigadesMarkers.length > 0 && this.hospitalMarkers.length > 0) {
            this.brigadesMarkers.forEach(brigadeMarker => {
                this.createRoute(this.hospitalMarkers[0], brigadeMarker);
            });
        }
    },

    addMarkerInObjectManager: function (marker) {
        const object = this.objectManager.objects.getById(marker.id),
            addFeatureCall = () => {
                //  this.getGeoQueryObject(marker);
                this.objectManager.objects.add(marker);
                this.map.geoObjects.each(route => {
                    if (route.requestPoints) {
                        this.map.geoObjects.remove(route);
                        return
                    }
                });
                if (this.hospitalMarkers.length == 0) {
                    this.createRoute(this.callMarkers[0], marker);
                    return
                }
                this.createRoute(this.hospitalMarkers[0], marker);
            },
            addFeatureBrigade = () => {
                this.objectManager.objects.add(marker);
                this.map.geoObjects.each(route => {
                    if (route.requestPoints) {
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
            Ext.defer(addFeatureCall, 10, this);
            return;
        }
        Ext.defer(addFeatureBrigade, 10, this);
    },

    setMarkers: function (call, brigades) {
        const readMarkers = () => {
            Isidamaps.app.getController('AppController').readMarkers('277688665', ...['277353644'])
        };
        Isidamaps.app.getController('AppController').initial(readMarkers);
    },

    listenerStore: function () {
        Ext.getStore('Isidamaps.store.BrigadesFirstLoadStore').on('add', (store, records, options) => {
            this.getBrigadesFromStore(records)
        }, this);
        Ext.getStore('Isidamaps.store.CallsFirstLoadStore').on('add', (store, records, options) => {
            this.getCallsFromStore(records)
        }, this);
        Ext.getStore('Isidamaps.store.MedOrgStore').on('add', (store, records, options) => {
            this.getHospitalFromStore(records)
        }, this);
    },

    getHospitalFromStore: function (records) {
        records.forEach(hospital => {
            if (hospital.get('latitude') && hospital.get('longitude')) {
                this.hospitalMarkers.push(this.createMedOrg(hospital));
            }
        });
        this.checkArrayIsEmpty(this.callMarkers);
    },

    createMedOrg: function (medorg) {
        return {
            type: 'Feature',
            id: medorg.get('organizationId'),
            customOptions: {
                objectType: medorg.get('objectType'),
                organizationName: medorg.get('organizationName')
            },
            geometry: {
                type: 'Point',
                coordinates: [medorg.get('latitude'), medorg.get('longitude')]
            },
            options: {
                iconImageHref: `resources/icon/${medorg.get('iconName')}`
            },
            properties: {
                hintContent: medorg.get('organizationName')
            }
        }
    },

    getBrigadesFromStore: function (records) {
        Ext.Array.clean(this.brigadesMarkers);
        records.forEach(brigade => {
            if (brigade.get('latitude') && brigade.get('longitude')) {
                this.brigadesMarkers.push(this.createBrigadeFeature(brigade));
            }
        });
        this.checkHaveStationary(...this.brigadesMarkers);
    },

    checkHaveStationary: function (brigade) {
        const {id, customOptions: {objectType}} = brigade,
            storeMarker = Isidamaps.app.getController('AppController').getStoreAboutMarker(objectType),
            params = {
                objecttype: objectType,
                objectid: id
            },
            options = {
                params: params,
                store: storeMarker
            };
        options.store.load({
            params: options.params,
            callback: (records, operation, success) => {
                if ((success === true && records.length === 0) || success === false) {
                    this.checkArrayIsEmpty(this.callMarkers);
                    return;
                }
                if (records[0].get('stationaryId')) {
                    let hospitalid = records[0].get('stationaryId');
                    this.getHospital(hospitalid, id);
                }
                else {
                    this.checkArrayIsEmpty(this.callMarkers);
                }
            }
        })
    },

    getHospital: function (hospitalid, brigade) {
        const hospitalStore = Ext.getStore('Isidamaps.store.MedOrgStore'),
            params = {
                hospitalid: hospitalid,
                brigade: brigade
            };
        hospitalStore.removeAll();
        Ext.Ajax.request({
            url: `${Isidamaps.app.getController('AppController').urlGeodata}/hospital?`,
            params: params,
            method: 'GET',
            success: (response, opts) => {
                let obj = Ext.decode(response.responseText);
                hospitalStore.add(obj.hospital);
            },
            failure: (response, opts) => {
                Ext.log({indent: 1, level: 'error'}, `server-side failure with status code ${response.status}`);
            }
        });
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

    getBrigadeFromWS: function (brigade) {
        if (brigade.get('latitude') && brigade.get('longitude') && brigade.get('status')) {
            if (brigade.get('deviceId') === this.brigadeClickId) {
                this.updateSpeedInForm(brigade.get('speed'));
            }
            let marker = this.createBrigadeFeature(brigade);
            this.addMarkerInObjectManager(marker);
            Ext.getStore('Isidamaps.store.BrigadeFromWSStore').clearData();
        }
    },

    checkArrayIsEmpty: function (array) {
        if (array.length !== 0) {
            this.addMarkersInObjManager();
            this.listenerWebSockedStore();
        }
    }
});
