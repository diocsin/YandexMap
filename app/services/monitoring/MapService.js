Ext.define('Isidamaps.services.monitoring.MapService', {
    map: null,
    objectManager: null,
    brigadesMarkers: [],
    callMarkers: [],
    filterMarkerArray: [],
    lowSpeedIconContentLayout: null,
    heightSpeedIconContentLayout: null,
    brigadeClickId: null,
    // ====
    setCheckboxAfterFirstLoad: Ext.emptyFn,
    addNewButtonOnPanel: Ext.emptyFn,
    destroyButtonOnPanel: Ext.emptyFn,
    addButtonsBrigadeOnPanel: Ext.emptyFn,
    addStationFilter: Ext.emptyFn,
    // ====

    constructor: function (options) {
        this.setCheckboxAfterFirstLoad = options.setCheckboxAfterFirstLoad;
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
        this.lowSpeedIconContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div id="lowSpeedIcon" >$[properties.iconContent]</div>'
        );
        this.heightSpeedIconContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div id="heightSpeedIcon" >$[properties.iconContent]</div>'
        );
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
                noSelect: false,
                maxWidth: [90, 172, 590],
                fitMaxWidth: true
            }
        });
        this.map.controls.add(searchControl);
        searchControl.events.add('resultselect', e => {
            // Получает массив результатов.
            const results = searchControl.getResultsArray();
            // Индекс выбранного объекта.
            const selected = e.get('index');
            // Получает координаты выбранного объекта.
            const point = results[selected].geometry.getCoordinates();

            const balloonContent = results[selected].properties.getAll().name;
            this.map.balloon.open(point, balloonContent, {});
        });
    },

    updateSpeedInForm: function (speed) {
        try {
            const brigadeInfoWidget = Ext.getCmp('tabPanelBrigade'),
                brigadeInfoViewModel = brigadeInfoWidget.getViewModel();
            brigadeInfoViewModel.set('record.speed', `${speed} км/ч`);
        }
        catch (e) {
        }
    },

    optionsObjectManager: function () {
        const markerController = Ext.create('controller.markercontroller');
        this.objectManager.objects.events.add(['click'], e => {
            let object = this.objectManager.objects.getById(e.get('objectId'));
            this.brigadeClickId = object.id;
            markerController.markerClick(object, this.objectManager.objects);
        });
        /*this.objectManager.clusters.events.add(['click'], (e) => {
             let object = this.objectManager.clusters.getById(e.get('objectId'));
             this.clustersClick([e._sourceEvent.originalEvent.clientPixels[0] - 20, e._sourceEvent.originalEvent.clientPixels[1] + 20], object);
         });
         */
    },

    addMarkersInObjManager: function () {
        this.objectManager.add(this.brigadesMarkers);
        this.objectManager.add(this.callMarkers);
        this.map.geoObjects.add(this.objectManager);
        this.addButtonsBrigadeOnPanel();
        this.setCheckboxAfterFirstLoad();
    },

    listenerWebSockedStore: function () {
        Ext.getStore('Isidamaps.store.BrigadeFromWSStore').on('add', (store, records, index) => {
            this.getBrigadeFromWS(...records)
        }, this);
        Ext.getStore('Isidamaps.store.CallFromWSStore').on('add', (store, records, index) => {
            this.getCallFromWS(...records)
        }, this);
    },

    listenerStore: function () {
        Ext.getStore('Isidamaps.store.BrigadesFirstLoadStore').on('load', (store, records, options) => {
            this.getBrigadesFromStore(records)
        }, this);
        Ext.getStore('Isidamaps.store.CallsFirstLoadStore').on('load', (store, records, options) => {
            this.getCallsFromStore(records)
        }, this);
    },

    addMarkerInObjectManager: function (marker) {
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
                Ext.defer(addFeature, 10, this);
            }
            return;
        }
        if (status !== 'COMPLETED') {
            Ext.defer(addFeature, 10, this);
        }
    },

    setStation: function (stations) {
        const readStation = () => {
            Isidamaps.app.getController('AppController').readStation(stations)
        };
        Isidamaps.app.getController('AppController').initial(readStation);
    },

    getBrigadesFromStore: function (records) {
        this.brigadesMarkers = [];
        records.forEach(brigade => {
            if (brigade.isBrigadeHasCoordinates()) {
                this.brigadesMarkers.push(brigade.getObjectForMap());
            }
        });
        this.checkArrayIsEmpty(this.callMarkers);
    },

    getCallsFromStore: function (records) {
       this.callMarkers = [];
        records.forEach(call => {
            if (call.isCallHasCoordinates()) {
                this.callMarkers.push(call.getObjectForMap());
            }
        });
        this.checkArrayIsEmpty(this.brigadesMarkers);
    },

    checkArrayIsEmpty: function (array) {
        if (array.length !== 0) {
            this.addStationFilter();
            this.addMarkersInObjManager();
            this.listenerWebSockedStore();
        }
    },

    getCallFromWS: function (call) {
        if (call.isCallHasCoordinates()) {
            this.addMarkerInObjectManager(call.getObjectForMap());
            Ext.getStore('Isidamaps.store.CallFromWSStore').clearData();
        }
    },

    getBrigadeFromWS: function (brigade) {
        if (brigade.isBrigadeHasCoordinates() && !!brigade.get('status')) {
            if (brigade.get('deviceId') === this.brigadeClickId) {
                this.updateSpeedInForm(brigade.get('speed'));
            }
            let marker = brigade.getObjectForMap();
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
            this.addMarkerInObjectManager(marker);
            Ext.getStore('Isidamaps.store.BrigadeFromWSStore').clearData();
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

    createMapBounds: function () {
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
});
