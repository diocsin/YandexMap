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
        const me = this;
        me.createMap();
        me.setCheckbox = options.setCheckbox;
        me.addNewButtonOnPanel = options.addNewButtonOnPanel;
        me.destroyButtonOnPanel = options.destroyButtonOnPanel;
        me.addButtonsBrigadeOnPanel = options.addButtonsBrigadeOnPanel;
        me.addStationFilter = options.addStationFilter;
    },

    createMap: function () {
        const me = this,
            bound = [
                [60.007645, 30.092139],
                [59.923862, 30.519157]];
        me.map = new ymaps.Map('mapId', {
            bounds: bound,
            controls: ['trafficControl']
        });
        me.map.behaviors.disable('dblClickZoom'); //отключение приближения при двойном клике по карте
        me.objectManager = new ymaps.ObjectManager({
            clusterize: false, //true
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

    searchControl: function () {
        const me = this,
            searchControl = new ymaps.control.SearchControl({
                options: {
                    // Будет производиться поиск только по топонимам.
                    provider: 'yandex#map',
                    noPlacemark: true,
                    noSelect: true

                }
            });
        me.map.controls.add(searchControl);
        searchControl.events.add('resultselect', function (e) {
            // Получает массив результатов.
            const results = searchControl.getResultsArray();
            console.dir(results);
            // Индекс выбранного объекта.
            const selected = e.get('index');
            // Получает координаты выбранного объекта.
            const point = results[selected].geometry.getCoordinates();
            console.dir(point);
            const balloonContent = results[selected].properties.getAll().name;
            me.map.balloon.open(point, balloonContent, {});
        });
    },

    optionsObjectManager: function () {
        const me = this;
        me.objectManager.objects.events.add(['click'], function (e) {
            let object = me.objectManager.objects.getById(e.get('objectId'));
            Ext.widget('callInfo').getController().markerClick(object);
        });
        /*me.objectManager.clusters.events.add(['click'], function (e) {
             var object = me.objectManager.clusters.getById(e.get('objectId'));
             me.clustersClick([e._sourceEvent.originalEvent.clientPixels[0] - 20, e._sourceEvent.originalEvent.clientPixels[1] + 20], object);
         });
         */
    },

    addMarkers: function () {
        const me = this;
        me.objectManager.add(me.brigadesMarkers);
        me.objectManager.add(me.callMarkers);
        me.map.geoObjects.add(me.objectManager);
        me.addButtonsBrigadeOnPanel();
        me.setCheckbox();

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
        const me = this,
            object = me.objectManager.objects.getById(marker.id);
        if (marker.customOptions.objectType === 'BRIGADE') {
            if (object) {
                me.objectManager.objects.remove(object);
            }
            if (marker.customOptions.status !== 'WITHOUT_SHIFT') {
                function func() {
                    me.objectManager.objects.add(marker);
                }

                setTimeout(func, 1);
            }
            return;
        }
        if (object) {
            me.objectManager.remove(object);
        }
        if (marker.customOptions.status !== "COMPLETED") {
            function func() {
                me.objectManager.objects.add(marker);
            }

            setTimeout(func, 1);
        }
    },

    setStation: function (stations) {
        Isidamaps.app.getController('AppController').initial(f);

        function f() {
            Isidamaps.app.getController('AppController').readStation(stations);
        }
    },


    createCallFeature: function (call) {
        return {
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
        }
    },

    createBrigadeFeature: function (brigade) {
        const me = this;
        return {
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
                hintContent: 'Бригада ' + brigade.get('brigadeNum'),
                iconContent: brigade.get('brigadeNum') + "(" + brigade.get('profile') + ")"
            }
        }
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

    storeCall: function (records) {
        const me = this;
        Ext.Array.clean(me.callMarkers);
        records.forEach(function (call) {
            if (call.get('latitude') && call.get('longitude')) {
                const feature = me.createCallFeature(call);
                me.callMarkers.push(feature);
            }
        });
        me.checkArrayFeatureComplete(me.brigadesMarkers);
    },

    checkArrayFeatureComplete: function (array) {
        const me = this;
        if (array.length !== 0) {
            me.addStationFilter();
            me.addMarkers();
            me.listenerWebSockedStore();
        }

    },

    createCallOfSocked: function (calls) {
        const me = this,
            call = calls[0];
        if (call.get('latitude') && call.get('longitude')) {
            let marker = me.createCallFeature(call);
            me.addMarkersSocket(marker);
            Ext.getStore('Isidamaps.store.CallFromWebSockedStore').clearData();
        }
    },

    createBrigadeOfSocked: function (brigades) {
        const me = this,
            brigade = brigades[0];
        if (brigade.get('latitude') && brigade.get('longitude') && brigade.get('status')) {
            let marker = me.createBrigadeFeature(brigade);

            let brigadeHas = Ext.Array.findBy(me.brigadesMarkers, function (brigadeInArray, index) {
                if (brigadeInArray.id === brigade.get('deviceId')) {
                    return brigadeInArray;
                }
            });
            Ext.Array.remove(me.brigadesMarkers, brigadeHas);
            if (brigade.get('status') !== 'WITHOUT_SHIFT') {
                Ext.Array.push(me.brigadesMarkers, marker);
                if (brigadeHas && brigadeHas.customOptions.status !== marker.customOptions.status) {
                    Ext.fireEvent('getButtonBrigadeForChangeButton', marker, brigadeHas.customOptions.status);
                }
                else if (!brigadeHas) {
                    me.addNewButtonOnPanel(marker);
                }
            }
            else {
                me.destroyButtonOnPanel(marker);
            }
            me.addMarkersSocket(marker);
            Ext.getStore('Isidamaps.store.BrigadeFromWebSockedStore').clearData();
        }
    },

    resizeMap: function () {
        this.map.container.fitToViewport();
    },

    createTableRoute: function () {
        const me = this;
        if (me.arrRouteForTable.length === me.brigadesMarkers.length) {
            const store = Ext.getStore('Isidamaps.store.RouteForTableStore');
            me.arrRouteForTable.forEach(function (object) {
                let x = Ext.create('Isidamaps.model.Route');
                x.set('brigadeId', object.brigade.id);
                x.set('brigadeNum', object.brigade.customOptions.brigadeNum);
                x.set('profile', object.brigade.customOptions.profile);
                x.set('distance', (object.route.getLength() / 1000).toFixed(1));
                x.set('time', (object.route.getJamsTime() / 60).toFixed(0));
                store.add(x);
            });
        }
    },

    createBouns: function () {
        const me = this,
            arrayLatitude = [],
            arrayLongitude = [],
            call = me.callMarkers[0];
        arrayLatitude.push(call.geometry.coordinates[0]);
        arrayLongitude.push(call.geometry.coordinates[1]);

        me.brigadesMarkers.forEach(function (brigade) {
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
        me.map.setBounds(bounds);
    },
})
;
