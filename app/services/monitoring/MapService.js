Ext.define('Isidamaps.services.monitoring.MapService', {
    map: null,
    objectManager: null,
    brigadesMarkers: [],
    callMarkers: [],
    filterBrigadeArray: [],
    MyIconContentLayout: null,
    // ====
    getStoreMarkerInfo: Ext.emptyFn,
    setCheckbox: Ext.emptyFn,
    addNewButtonOnPanel: Ext.emptyFn,
    destroyButtonOnPanel: Ext.emptyFn,
    addButtonsBrigadeOnPanel: Ext.emptyFn,
    addStationFilter: Ext.emptyFn,
    // ====

    constructor: function (options) {
        this.createMap();
        this.setCheckbox = options.setCheckbox;
        this.addNewButtonOnPanel = options.addNewButtonOnPanel;
        this.destroyButtonOnPanel = options.destroyButtonOnPanel;
        this.addButtonsBrigadeOnPanel = options.addButtonsBrigadeOnPanel;
        this.addStationFilter = options.addStationFilter;
    },

    createMap: function () {
        const bound = [
            [60.007645, 30.092139],
            [59.923862, 30.519157]];
        this.map = new ymaps.Map('mapId', {
            bounds: bound,
            controls: ['trafficControl', 'rulerControl']
        });
        this.map.behaviors.disable('dblClickZoom').enable(['rightMouseButtonMagnifier']);
        this.objectManager = new ymaps.ObjectManager({
            clusterize: false, //true
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: false
        });
        this.objectManager.objects.options.set({
            iconLayout: 'default#image',
            zIndex: 2000,
            iconImageSize: [40, 40]

        });
        this.MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div style="color: #000000;  border: 1px solid; display: inline-block; background-color: #faf8ff; text-align: center; border-radius: 6px; z-index: 2;font-size: 12pt">$[properties.iconContent]</div>'
        );
    },

    searchControl: function () {
        const searchControl = new ymaps.control.SearchControl({
            options: {
                // Будет производиться поиск только по топонимам.
                provider: 'yandex#map',
                noPlacemark: true,
                noSelect: true

            }
        });
        this.map.controls.add(searchControl);
        searchControl.events.add('resultselect', (e) => {
            // Получает массив результатов.
            const results = searchControl.getResultsArray();
            console.dir(results);
            // Индекс выбранного объекта.
            const selected = e.get('index');
            // Получает координаты выбранного объекта.
            const point = results[selected].geometry.getCoordinates();
            console.dir(point);
            const balloonContent = results[selected].properties.getAll().name;
            this.map.balloon.open(point, balloonContent, {});
        });
    },

    optionsObjectManager: function () {
        this.objectManager.objects.events.add(['click'], (e) => {
            let object = this.objectManager.objects.getById(e.get('objectId'));
            Ext.widget('callInfo').getController().markerClick(object);
        });
        /*this.objectManager.clusters.events.add(['click'], (e) => {
             let object = this.objectManager.clusters.getById(e.get('objectId'));
             this.clustersClick([e._sourceEvent.originalEvent.clientPixels[0] - 20, e._sourceEvent.originalEvent.clientPixels[1] + 20], object);
         });
         */
    },

    addMarkers: function () {
        this.objectManager.add(this.brigadesMarkers);
        this.objectManager.add(this.callMarkers);
        this.map.geoObjects.add(this.objectManager);
        this.addButtonsBrigadeOnPanel();
        this.setCheckbox();

    },

    listenerWebSockedStore: function () {
        Ext.getStore('Isidamaps.store.BrigadeFromWebSockedStore').on('add', function (store, records, index) {
            this.createBrigadeOfSocked(records)
        }, this);
        Ext.getStore('Isidamaps.store.CallFromWebSockedStore').on('add', function (store, records, index) {
            this.createCallOfSocked(records)
        }, this);
    },

    listenerStore: function () {
        Ext.getStore('Isidamaps.store.BrigadesFirstLoadStore').on('load', function (store, records, options) {
            this.storeBrigade(records)
        }, this);
        Ext.getStore('Isidamaps.store.CallsFirstLoadStore').on('load', function (store, records, options) {
            this.storeCall(records)
        }, this);

    },

    addMarkersSocket: function (marker) {
        const object = this.objectManager.objects.getById(marker.id),
            addFeature = () => {
                this.objectManager.objects.add(marker);
            },
            {customOptions: {objectType, status}} = marker;
        if (object) {
            this.objectManager.objects.remove(object);
        }
        if (objectType === 'BRIGADE') {
            if (status !== 'WITHOUT_SHIFT') {
                Ext.defer(addFeature, 1, this);
            }
            return;
        }
        if (status !== 'COMPLETED') {
            Ext.defer(addFeature, 1, this);
        }
    },

    setStation: function (stations) {
        const readStation = () => {
            Isidamaps.app.getController('AppController').readStation(stations)
        };
        Isidamaps.app.getController('AppController').initial(readStation);
    },


    createCallFeature: function (call) {
        return {
            type: 'Feature',
            id: call.get('callCardId'),
            customOptions: {
                objectType: call.get('objectType'),
                status: call.get('status'),
                callCardNum: call.get('callCardNum'),
                station: call.get('station').toString()
            },
            geometry: {
                type: 'Point',
                coordinates: [call.get('latitude'), call.get('longitude')]
            },
            options: {
                iconImageHref: `resources/icon/${call.get('iconName')}`,
                iconImageSize: [25, 31]
            }
        }
    },

    createBrigadeFeature: function (brigade) {
        return {
            type: 'Feature',
            id: brigade.get('deviceId'),
            customOptions: {
                objectType: brigade.get('objectType'),
                profile: brigade.get('profile'),
                status: brigade.get('status'),
                station: brigade.get('station').toString(),
                brigadeNum: brigade.get('brigadeNum')
            },
            geometry: {
                type: 'Point',
                coordinates: [brigade.get('latitude'), brigade.get('longitude')]
            },
            options: {
                iconLayout: 'default#imageWithContent',
                iconImageHref: `resources/icon/${brigade.get('iconName')}`,
                iconContentLayout: this.MyIconContentLayout,
                iconImageOffset: [-24, -24],
                iconContentOffset: [30, -10],
            },
            properties: {
                hintContent: `Бригада ${brigade.get('brigadeNum')}`,
                iconContent: `${brigade.get('brigadeNum')}(${brigade.get('profile')})`
            }
        }
    },

    storeBrigade: function (records) {
        Ext.Array.clean(this.brigadesMarkers);
        records.forEach(brigade => {
            if (brigade.get('latitude') && brigade.get('longitude')) {
                const feature = this.createBrigadeFeature(brigade);
                this.brigadesMarkers.push(feature);
            }
        });
        this.checkArrayFeatureComplete(this.callMarkers);
    },

    storeCall: function (records) {
        Ext.Array.clean(this.callMarkers);
        records.forEach(call => {
            if (call.get('latitude') && call.get('longitude')) {
                const feature = this.createCallFeature(call);
                this.callMarkers.push(feature);
            }
        });
        this.checkArrayFeatureComplete(this.brigadesMarkers);
    },

    checkArrayFeatureComplete: function (array) {
        if (array.length !== 0) {
            this.addStationFilter();
            this.addMarkers();
            this.listenerWebSockedStore();
        }

    },

    createCallOfSocked: function (calls) {
        const call = calls[0];
        if (call.get('latitude') && call.get('longitude')) {
            let marker = this.createCallFeature(call);
            this.addMarkersSocket(marker);
            Ext.getStore('Isidamaps.store.CallFromWebSockedStore').clearData();
        }
    },

    createBrigadeOfSocked: function (brigades) {
        const brigade = brigades[0];
        if (brigade.get('latitude') && brigade.get('longitude') && brigade.get('status')) {
            let marker = this.createBrigadeFeature(brigade);

            let brigadeHas = Ext.Array.findBy(this.brigadesMarkers, (brigadeInArray, index) => {
                if (brigadeInArray.id === brigade.get('deviceId')) {
                    return brigadeInArray;
                }
            });
            Ext.Array.remove(this.brigadesMarkers, brigadeHas);
            if (brigade.get('status') !== 'WITHOUT_SHIFT') {
                Ext.Array.push(this.brigadesMarkers, marker);
                if (brigadeHas && brigadeHas.customOptions.status !== marker.customOptions.status) {
                    Ext.fireEvent('getButtonBrigadeForChangeButton', marker, brigadeHas.customOptions.status);
                }
                else if (!brigadeHas) {
                    this.addNewButtonOnPanel(marker);
                }
            }
            else {
                this.destroyButtonOnPanel(marker);
            }
            this.addMarkersSocket(marker);
            Ext.getStore('Isidamaps.store.BrigadeFromWebSockedStore').clearData();
        }
    },

    resizeMap: function () {
        this.map.container.fitToViewport();
    },

    createTableRoute: function () {
        if (this.arrRouteForTable.length === this.brigadesMarkers.length) {
            const store = Ext.getStore('Isidamaps.store.RouteForTableStore');
            this.arrRouteForTable.forEach(object => {
                const {route, brigade: {id, customOptions: {brigadeNum, profile}}} = object;
                let x = Ext.create('Isidamaps.model.Route');
                x.set('brigadeId', id);
                x.set('brigadeNum', brigadeNum);
                x.set('profile', profile);
                x.set('distance', (route.getLength() / 1000).toFixed(1));
                x.set('time', (route.getJamsTime() / 60).toFixed(0));
                store.add(x);
            });
        }
    },

    createBouns: function () {
        const arrayLatitude = [],
            arrayLongitude = [],
            call = this.callMarkers[0];
        arrayLatitude.push(call.geometry.coordinates[0]);
        arrayLongitude.push(call.geometry.coordinates[1]);

        this.brigadesMarkers.forEach(brigade => {
            arrayLatitude.push(brigade.geometry.coordinates[0]);
            arrayLongitude.push(brigade.geometry.coordinates[1]);
        });
        arrayLatitude.sort(function (a, b) {
            return a - b
        });
        arrayLongitude.sort(function (a, b) {
            return a - b
        });
        let bounds = [
            [arrayLatitude[arrayLatitude.length - 1] + 0.015, arrayLongitude[0] - 0.015],
            [arrayLatitude[0] - 0.015, arrayLongitude[arrayLatitude.length - 1] + 0.015]
        ];
        this.map.setBounds(bounds);
    },
})
;
